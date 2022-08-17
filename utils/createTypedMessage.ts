import { Contract } from "@ethersproject/contracts";

export function createTypedMessage(
  contractName: string,
  contract: Contract,
  message: any,
  types: any,
  primaryType: string
) {
  const chainId = contract.deployTransaction.chainId;
  return {
    data: {
      types,
      primaryType,
      domain: {
        name: contractName,
        version: "1",
        chainId: 31337,
        verifyingContract: contract.address,
      },
      message,
    },
  };
}
