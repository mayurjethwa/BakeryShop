// SPDX-License-Identifier: MIT
pragma solidity ^0.5.0;

contract Installment {
    address[16] public installer;
// New Function ** Installment **
    function install(uint petId) public returns (uint) {
        require(petId >= 0 && petId <= 15);

        installer[petId] = msg.sender;

        return petId;
    }

    // Retrieving the installment
    function getInstallers() public view returns (address[16] memory) {
        return installer;
    }

}