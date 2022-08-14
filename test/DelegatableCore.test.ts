import { ethers } from "hardhat";
import { Contract, ContractFactory, utils, Wallet } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
// @ts-ignore
import { generateUtil } from "eth-delegatable-utils";
import { getPrivateKeys } from "../utils/getPrivateKeys";
import { expect } from "chai";
import { Provider } from "@ethersproject/providers";
import { generateDelegation } from "./utils";
const { getSigners } = ethers;

describe("DelegatableCore", () => {
  const CONTACT_NAME = "DelegatableCore";
  let CONTRACT_INFO: any;
  let delegatableUtils: any;
  let signer0: SignerWithAddress;
  let wallet0: Wallet;
  let wallet1: Wallet;
  let wallet2: Wallet;
  let pk0: string;
  let pk1: string;
  let AllowedMethodsEnforcer: Contract;
  let AllowedMethodsEnforcerFactory: ContractFactory;
  let Delegatable: Contract;
  let DelegatableFactory: ContractFactory;

  before(async () => {
    [signer0] = await getSigners();
    [wallet0, wallet1, wallet2] = getPrivateKeys(
      signer0.provider as unknown as Provider
    );
    DelegatableFactory = await ethers.getContractFactory("MockDelegatableCore");
    AllowedMethodsEnforcerFactory = await ethers.getContractFactory(
      "AllowedMethodsEnforcer"
    );
    pk0 = wallet0._signingKey().privateKey;
    pk1 = wallet1._signingKey().privateKey;
  });

  beforeEach(async () => {
    Delegatable = await DelegatableFactory.connect(wallet0).deploy(
      CONTACT_NAME
    );
    AllowedMethodsEnforcer = await AllowedMethodsEnforcerFactory.connect(
      wallet0
    ).deploy();

    CONTRACT_INFO = {
      chainId: Delegatable.deployTransaction.chainId,
      verifyingContract: Delegatable.address,
      name: CONTACT_NAME,
    };
    delegatableUtils = generateUtil(CONTRACT_INFO);
  });

  describe("_msgSender()", () => {
    it("should SUCCEED to FORWARD the msg.sender IF NOT from SELF", async () => {
      expect(await Delegatable.exec()).to.equal(wallet0.address);
    });
    it("should SUCCEED to EXTRACT the address from transaction data IF from SELF", async () => {
      await Delegatable.execFrom(wallet1.address);
      expect(await Delegatable.specialSender()).to.equal(wallet1.address);
    });
  });

  describe("_enforceReplayProtection(address,ReplayProtection)", () => {
    it("should SUCCEED to UPDATE nonce using VALID input", async () => {
      await Delegatable.enforceReplayProtection(wallet0.address, {
        nonce: 1,
        queue: 0,
      });
      expect(await Delegatable.getNonce(wallet0.address, 0)).to.eq(1);
    });
    it("should FAIL to UPDATE nonce using INVALID input", async () => {
      await expect(
        Delegatable.enforceReplayProtection(wallet0.address, {
          nonce: 0,
          queue: 0,
        })
      ).to.be.revertedWith("DelegatableCore:nonce2-out-of-order");
    });
  });

  describe("_invoke(Invocation[],address)", () => {
    it("should SUCCEED to EXECUTE a single Invocation", async () => {});
    it("should SUCCEED to EXECUTE multiple Invocations", async () => {});
    it("should FAIL to EXECUTE from INVALID delegation signature", async () => {});
    it("should FAIL to EXECUTE from INVALID authority delegation link", async () => {});
    it("should FAIL to EXECUTE from FAILING caveat enforcer", async () => {});
    it("should FAIL to EXECUTE from INVALID invocation transaction target", async () => {});
    it("should FAIL to EXECUTE from INVALID primary transaction execution", async () => {});
  });
});
