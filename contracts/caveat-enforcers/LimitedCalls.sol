pragma solidity ^0.8.13;
//SPDX-License-Identifier: MIT

import "../Delegatable.sol";

contract LimitedCallsEnforcer is CaveatEnforcer {
  mapping(address => mapping(bytes32 => uint256)) callCounts;

  function enforceCaveat(
    bytes calldata terms,
    Transaction calldata _transaction,
    bytes32 delegationHash
  ) public override returns (bool) {
    uint256 limit = bytesToUint(terms);
    uint256 callCount = callCounts[msg.sender][delegationHash];

    require(callCount < limit, "Call limit exceeded");
    callCounts[msg.sender][delegationHash]++;
    return true;
  }

  function bytesToUint(bytes memory b) internal pure returns (uint256) {
    uint256 number;
    for (uint256 i = 0; i < b.length; i++) {
      number = number + uint256(uint8(b[i])) * (2**(8 * (b.length - (i + 1))));
    }
    return number;
  }
}
