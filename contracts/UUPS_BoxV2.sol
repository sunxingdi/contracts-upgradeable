

// 在remix中部署
// code wizard: https://docs.openzeppelin.com/contracts/5.x/wizard

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

// import "hardhat/console.sol";

contract UUPS_BoxV2 is Initializable, OwnableUpgradeable, UUPSUpgradeable {

    uint256 private value;
    uint256 private value2; //新增状态变量

    /// @custom:oz-upgrades-unsafe-allow constructor
    // constructor() {
    //     _disableInitializers();
    // }

    function initialize(address initialOwner) initializer public {
        __Ownable_init(initialOwner);
        __UUPSUpgradeable_init();
    }

    function _authorizeUpgrade(address newImplementation)
        internal
        onlyOwner
        override
    {}

    // Emitted when the stored value changes
    event ValueChanged(uint256 value); //修改事件

    // Stores a new value in the contract
    function store(uint256 _value) public { //修改函数
        revert("The store function has been canceled");
    }
 
    // Reads the last stored value
    function retrieve() public view returns (uint256) { //修改函数
        revert("The retrieve function has been canceled");
    }

    function set_value(uint256 newValue) public { //新增函数
        value  = newValue;
        emit ValueChanged(value);
    }
    function set_value2(uint256 newValue) public { //新增函数
        value2  = newValue;
        emit ValueChanged(value2);
    }    

    function get_value() public view returns (uint256) { //新增函数
        return value;
    }
    function get_value2() public view returns (uint256) { //新增函数
        return value2;
    }         

    function increment() public { //新增函数
        set_value(get_value() + 1);
        set_value2(get_value2() + 1);
    }
}