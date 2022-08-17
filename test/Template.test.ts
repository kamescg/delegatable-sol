import { ethers } from "hardhat";
import { Contract, ContractFactory, Wallet } from "ethers";
import { getPrivateKeys } from "../utils/getPrivateKeys";

describe("InvokeFromEIP1271", () => {
  let wallet0: Wallet;

  // Contract instances
  let InvokeFromEIP1271: Contract;
  let InvokeFromEIP1271Factory: ContractFactory;

  before(async () => {
    [wallet0] = getPrivateKeys(ethers.getDefaultProvider());
    InvokeFromEIP1271Factory = await ethers.getContractFactory(
      "InvokeFromEIP1271"
    );
  });

  beforeEach(async () => {
    InvokeFromEIP1271 = await InvokeFromEIP1271Factory.deploy(
      "InvokeFromEIP1271"
    );
  });

  /* ================================================================================ */
  /* READ                                                                             */
  /* ================================================================================ */
  describe("READ", () => {});

  /* ================================================================================ */
  /* WRITE                                                                            */
  /* ================================================================================ */
  describe("WRITE", () => {});
});
