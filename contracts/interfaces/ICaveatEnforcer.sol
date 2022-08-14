//SPDX-License-Identifier: MIT
pragma solidity 0.8.15;

import "../TypesAndDecoders.sol";

interface ICaveatEnforcer {
    function enforceCaveat(
        bytes calldata terms,
        Transaction calldata tx,
        bytes32 delegationHash
    ) external virtual returns (bool);
}
