//SPDX-License-Identifier: MIT
pragma solidity 0.8.15;

import "@openzeppelin/contracts/access/Ownable.sol";
import "../Delegatable.sol";

struct AppStorage {
    string purpose;
}

contract MockPurposeFacet is Ownable {
    AppStorage internal s;

    function purpose() public view returns (string memory) {
        return s.purpose;
    }

    function setPurpose(string memory purpose_) public onlyOwner {
        s.purpose = purpose_;
    }
}
