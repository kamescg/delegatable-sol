import { ethers } from "hardhat";
import { Contract, ContractFactory, ethers, utils, Wallet } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
// @ts-ignore
import { generateUtil } from "eth-delegatable-utils";
import { getPrivateKeys } from "../utils/getPrivateKeys";
import { expect } from "chai";
import { Provider } from "@ethersproject/providers";
import { generateDelegation } from "./utils";
const { getSigners } = ethers;

const {
  getSelectors,
  FacetCutAction,
  removeSelectors,
  findAddressPositionInFacets,
} = require("../scripts/diamond.js");

describe("DelegatableFacet", () => {
  const CONTACT_NAME = "MyDiamond";
  let CONTRACT_INFO: any;
  let delegatableUtils: any;
  let signer0: SignerWithAddress;
  let wallet0: Wallet;
  let wallet1: Wallet;
  let pk0: string;
  let pk1: string;

  let DiamondCutFacet: Contract;
  let DiamondCutFacetFactory: ContractFactory;
  let Diamond: Contract;
  let DiamondFactory: ContractFactory;
  let PurposeFacet: Contract;
  let PurposeFacetFactory: ContractFactory;
  let DelegatableFacet: Contract;
  let DelegatableFacetFactory: ContractFactory;

  before(async () => {
    [signer0] = await getSigners();
    [wallet0, wallet1] = getPrivateKeys(
      signer0.provider as unknown as Provider
    );

    DiamondCutFacetFactory = await ethers.getContractFactory("DiamondCutFacet");
    DiamondFactory = await ethers.getContractFactory("Diamond");
    PurposeFacetFactory = await ethers.getContractFactory("MockPurposeFacet");
    DelegatableFacetFactory = await ethers.getContractFactory(
      "DelegatableFacet"
    );

    pk0 = wallet0._signingKey().privateKey;
    pk1 = wallet1._signingKey().privateKey;
  });

  beforeEach(async () => {
    DiamondCutFacet = await DiamondCutFacetFactory.deploy();
    const BareDiamond = await DiamondFactory.connect(wallet0).deploy(
      wallet0.address,
      DiamondCutFacet.address
    );
    PurposeFacet = await PurposeFacetFactory.connect(wallet0).deploy();
    DelegatableFacet = await DelegatableFacetFactory.connect(wallet0).deploy();

    // Create proxy for ethers.js diamond interface so diamond exposes all facet methods:
    const Diamond = createDiamondProxy(BareDiamond, [
      DiamondCutFacet,
      PurposeFacet,
      DelegatableFacet,
    ]);

    // Add purpose facet to the Diamond
    Diamond.diamondCut(
      [
        {
          facetAddress: PurposeFacet.address,
          action: FacetCutAction.Add,
          functionSelectors: getSelectors(PurposeFacet),
        },
      ],
      "0x0",
      "0x0"
    );

    // Generate delegatable init code to generate domain typehash
    const initTypehashBytes =
      DelegatableFacet.populateTransaction.setDomainHash(CONTACT_NAME);
    // Add delegatable facet to the diamond
    Diamond.diamondCut(
      [
        {
          facetAddress: DelegatableFacet.address,
          action: FacetCutAction.Add,
          functionSelectors: getSelectors(DelegatableFacet),
          //   - run delegatable init code to generate domain typehash
        },
      ],
      DelegatableFacet.address,
      initTypehashBytes
    );

    CONTRACT_INFO = {
      chainId: Diamond.deployTransaction.chainId,
      verifyingContract: Diamond.address,
      version: "1",
      name: CONTACT_NAME,
    };
    delegatableUtils = generateUtil(CONTRACT_INFO);
  });

  it("READ getDelegationTypedDataHash(Delegation memory delegation)", async () => {
    const DELEGATION = {
      delegate: wallet0.address,
      authority:
        "0x0000000000000000000000000000000000000000000000000000000000000000",
      caveats: [],
    };
    expect(await Diamond.getDelegationTypedDataHash(DELEGATION)).to.eq(
      "0x5352e474c0624192d7bdd9ace20cca8e397aa705676ef4f494218dcd291aac36"
    );
  });
  it("READ getInvocationsTypedDataHash(Invocations memory invocations)", async () => {
    const _delegation = generateDelegation(
      CONTACT_NAME,
      Diamond,
      pk0,
      wallet1.address
    );
    const INVOCATION_MESSAGE = {
      replayProtection: {
        nonce: "0x01",
        queue: "0x00",
      },
      batch: [
        {
          authority: [_delegation],
          transaction: {
            to: Diamond.address,
            gasLimit: "21000000000000",
            data: (
              await Diamond.populateTransaction.setPurpose("To delegate!")
            ).data,
          },
        },
      ],
    };
    expect(
      await Diamond.getInvocationsTypedDataHash(INVOCATION_MESSAGE)
    ).to.eq(
      "0xf6e94ae88b8b72d51444924d7cf26f28b4eaf7d5d274dffbdc83cb92cb4eeac5"
    );
  });
  it("READ getEIP712DomainHash(string,string,uint256,address)", async () => {});
  it("READ verifyDelegationSignature(SignedDelegation memory signedDelegation)`", async () => {
    const _delegation = generateDelegation(
      CONTACT_NAME,
      Diamond,
      pk0,
      wallet1.address
    );
    expect(await Diamond.verifyDelegationSignature(_delegation)).to.eq(
      wallet0.address
    );
  });
  it("READ verifyInvocationSignature(SignedInvocation memory signedInvocation)", async () => {
    const _delegation = generateDelegation(
      CONTACT_NAME,
      Diamond,
      pk0,
      wallet1.address
    );
    const INVOCATION_MESSAGE = {
      replayProtection: {
        nonce: "0x01",
        queue: "0x00",
      },
      batch: [
        {
          authority: [_delegation],
          transaction: {
            to: Diamond.address,
            gasLimit: "21000000000000",
            data: (
              await Diamond.populateTransaction.setPurpose("To delegate!")
            ).data,
          },
        },
      ],
    };
    const invocation = delegatableUtils.signInvocation(INVOCATION_MESSAGE, pk0);
    expect(await Diamond.verifyInvocationSignature(invocation)).to.eq(
      wallet0.address
    );
  });

  describe("contractInvoke(Invocation[] calldata batch)", () => {
    it("should SUCCEED to EXECUTE batched Invocations", async () => {
      expect(await Diamond.purpose()).to.eq("What is my purpose?");
      const _delegation = generateDelegation(
        CONTACT_NAME,
        Diamond,
        pk0,
        wallet1.address
      );
      await Diamond.contractInvoke([
        {
          authority: [_delegation],
          transaction: {
            to: Diamond.address,
            gasLimit: "21000000000000",
            data: (
              await Diamond.populateTransaction.setPurpose("To delegate!")
            ).data,
          },
        },
      ]);
      expect(await Diamond.purpose()).to.eq("To delegate!");
    });
  });

  describe("invoke(SignedInvocation[] calldata signedInvocations)", () => {
    it("should SUCCEED to EXECUTE a single Invocation from an unsigned authority", async () => {
      expect(await Diamond.purpose()).to.eq("What is my purpose?");
      const INVOCATION_MESSAGE = {
        replayProtection: {
          nonce: "0x01",
          queue: "0x00",
        },
        batch: [
          {
            authority: [],
            transaction: {
              to: Diamond.address,
              gasLimit: "21000000000000",
              data: (
                await Diamond.populateTransaction.setPurpose("To delegate!")
              ).data,
            },
          },
        ],
      };
      const invocation = delegatableUtils.signInvocation(
        INVOCATION_MESSAGE,
        pk0
      );
      await Diamond.invoke([
        {
          signature: invocation.signature,
          invocations: invocation.invocations,
        },
      ]);
      expect(await Diamond.purpose()).to.eq("To delegate!");
    });

    it("should SUCCEED to EXECUTE batched SignedInvocations", async () => {
      expect(await Diamond.purpose()).to.eq("What is my purpose?");
      const _delegation = generateDelegation(
        CONTACT_NAME,
        Diamond,
        pk0,
        wallet1.address
      );
      const INVOCATION_MESSAGE = {
        replayProtection: {
          nonce: "0x01",
          queue: "0x00",
        },
        batch: [
          {
            authority: [_delegation],
            transaction: {
              to: Diamond.address,
              gasLimit: "21000000000000",
              data: (
                await Diamond.populateTransaction.setPurpose("To delegate!")
              ).data,
            },
          },
        ],
      };
      const invocation = delegatableUtils.signInvocation(
        INVOCATION_MESSAGE,
        pk0
      );
      await Diamond.invoke([
        {
          signature: invocation.signature,
          invocations: invocation.invocations,
        },
      ]);
      expect(await Diamond.purpose()).to.eq("To delegate!");
    });
  });
});

/* @notice Merges multiple ethers.js contract instances' interfaces into the first one.
 */
function createDiamondProxy(diamond: Contract, facets: Contract[]) {
  return new Proxy(diamond, {
    get: function (target, name) {
      let requested = target.getOwnProperty(name);
      if (requested) {
        return requested;
      }
      for (const facet of facets) {
        requested = facet.getOwnProperty(name);
        if (requested) {
          const instance = new ethers.Contract(
            diamond.address,
            facet.interface
          );
          return instance.getOwnProperty(name);
        }
      }
    },
  });
}
