

// 在remix中部署
// code wizard: https://docs.openzeppelin.com/contracts/5.x/wizard

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

// import "hardhat/console.sol";

contract UUPS_BoxV1 is Initializable, OwnableUpgradeable, UUPSUpgradeable {

    uint256 private value;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(address initialOwner) initializer public {
        __Ownable_init(initialOwner);
        __UUPSUpgradeable_init();
    }

    function _authorizeUpgrade(address newImplementation)
        internal
        onlyOwner
        override
    {}

    event ValueChanged(uint256 value);
    function store(uint256 _value) public {
        value = _value;
        emit ValueChanged(_value);
    } 
    function retrieve() public view returns (uint256) {
        return value;
    }

}