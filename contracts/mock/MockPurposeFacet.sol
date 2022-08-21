//SPDX-License-Identifier: MIT
pragma solidity 0.8.15;

import "@openzeppelin/contracts/access/Ownable.sol";
import "../Delegatable.sol";

contract MockPurposeFacet is Ownable {
    string public purpose = "What is my purpose?";

    function setPurpose(string memory purpose_) public onlyOwner {
        purpose = purpose_;
    }
}
