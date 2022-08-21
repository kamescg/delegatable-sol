// @ts-ignore
import { generateUtil } from "eth-delegatable-utils";
const BASE_AUTH =
  "0x0000000000000000000000000000000000000000000000000000000000000000";

export function generateDelegation(
  name: any,
  contract: any,
  pk: any,
  to: any,
  caveats = Array<any>(),
  authority = BASE_AUTH
) {
  const CONTRACT_INFO = {
    chainId: contract.provider._network.chainId,
    verifyingContract: contract.address,
    name: name,
  };
  const DELEGATION = {
    delegate: to,
    authority: authority,
    caveats: caveats,
  };
  const delegatableUtils = generateUtil(CONTRACT_INFO);
  const signedDelegation = delegatableUtils.signDelegation(DELEGATION, pk);

  return signedDelegation;
}
