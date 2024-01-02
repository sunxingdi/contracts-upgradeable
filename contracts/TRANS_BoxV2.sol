// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// import "hardhat/console.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract TRANS_BoxV2 is Initializable, OwnableUpgradeable {
    
    uint256 private value;
    uint256 private value2; //新增状态变量
 
    // Emitted when the stored value changes
    event ValueChanged(string Name, uint256 newValue); //修改事件

    event PrtVar(address addr); //修改事件

     /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(address initialOwner) initializer public {
        __Ownable_init(initialOwner);
    }

    // Stores a new value in the contract
    function store(uint256 newValue) public { //修改函数
        revert("The store function has been canceled");
    }
 
    // Reads the last stored value
    function retrieve() public view returns (uint256) { //修改函数
        revert("The retrieve function has been canceled");
    }

    function set_value(uint256 newValue) public { //新增函数
        value  = newValue;
        emit ValueChanged("value: ", value);
    }
    function set_value2(uint256 newValue) public { //新增函数
        value2  = newValue;
        emit ValueChanged("value2: ", value2);
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
