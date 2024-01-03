# OpenZeppenlin升级合约

### 1. 环境准备

#### 安装依赖插件
```shell
npm install @openzeppelin/contracts-upgradeable @openzeppelin/hardhat-upgrades hardhat
npm install --save-dev @nomicfoundation/hardhat-toolbox
```

可执行`npm install`命令安装package.json文件中的所有库。

#### 启动本地网络
```shell
npx hardhat node
```

#### 配置自定义网络和账户
在.env文件中配置
```
# 测试网络地址
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/your_infura_api_key

# 账户地址
PRIVATE_KEY=your_private_key_without_0x_prefix
```


### 2. 透明代理升级


#### 原理介绍
透明代理，涉及3个合约，升级函数在代理合约中：

- 管理合约（Admin）
  
  文件路径：[ProxyAdmin.sol](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/proxy/transparent/ProxyAdmin.sol)

- 代理合约（Proxy）
  
  文件路径：[TransparentUpgradeableProxy.sol](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/proxy/transparent/TransparentUpgradeableProxy.sol)

- 逻辑合约（Implementation）
  
  文件路径：待部署的合约文件。


#### 本地网络执行测试用例
```shell
npx hardhat test .\test\TRANS_BoxProxyV2.test.ts --network localhost
```


#### 本地网络打印输出
```
  透明代理升级合约测试

 账户列表...
AdminAccount:  0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
OwnerAccount:  0x70997970C51812dc3A010C7d01b50e0d17dc79C8
UserAccount:   0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC

 部署合约: Box...
boxV1 代理合约地址:  0xc96304e3c037f81dA488ed9dEa1D8F2a48278a75
boxV1 逻辑合约地址:  0x1291Be112d480055DaFd8a610b7d1e203891C274
boxV1 管理合约地址:  0x8e0BfED44D5B63812d0693FB248AfA1892dDc036

 打印固定存储槽...
逻辑合约地址存储槽
slot 0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc 0x0000000000000000000000001291be112d480055dafd8a610b7d1e203891c274
管理合约地址存储槽
slot 0xb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d6103 0x0000000000000000000000008e0bfed44d5b63812d0693fb248afa1892ddc036

 升级合约: BoxV1 ——> BoxV2...
boxV2 代理合约地址:  0xc96304e3c037f81dA488ed9dEa1D8F2a48278a75
boxV2 逻辑合约地址:  0xCD8a1C3ba11CF5ECfa6267617243239504a98d90
boxV2 管理合约地址:  0x8e0BfED44D5B63812d0693FB248AfA1892dDc036
    ✔ 透明代理升级用例 (114ms)


  1 passing (734ms)
```
升级后管理合约和代理合约地址不变，只有逻辑合约地址变化。

#### 测试网部署和升级合约

部署合约
```
npx hardhat run .\scripts\1.TRANS_Deploy_BoxV1.ts --network sepolia
```

部署完成打印输出
```
 账户列表...
AdminAccount:  0x6BBC4994BFA366B19541a0252148601a9f874cD1

 部署合约: Box...

boxV1 代理合约地址:  0xECb89780291121Ff8b4751d0b4e1B766FD276a50
boxV1 逻辑合约地址:  0xad487b215cac4EA21012d7fe624b01640B0A8ff2
boxV1 管理合约地址:  0xC830f6088cb0D76a07893dB2e47AA20F028e1a15

 打印固定存储槽...
逻辑合约地址存储槽
slot 0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc 0x000000000000000000000000ad487b215cac4ea21012d7fe624b01640b0a8ff2
管理合约地址存储槽
slot 0xb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d6103 0x000000000000000000000000c830f6088cb0d76a07893db2e47aa20f028e1a15
```

升级合约
```
npx hardhat run .\scripts\2.TRANS_Upgrade_BoxV2.ts --network sepolia
```

升级完成打印输出
```
 账户列表...
AdminAccount:  0x6BBC4994BFA366B19541a0252148601a9f874cD1

 升级合约: BoxV1 ——> BoxV2...

boxV2 代理合约地址:  0xECb89780291121Ff8b4751d0b4e1B766FD276a50
boxV2 逻辑合约地址:  0xa67CAaE5d31f97928362dC3aE7031e9fb705fD06
boxV2 管理合约地址:  0xC830f6088cb0D76a07893dB2e47AA20F028e1a15

 打印固定存储槽...
逻辑合约地址存储槽
slot 0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc 0x000000000000000000000000a67caae5d31f97928362dc3ae7031e9fb705fd06
管理合约地址存储槽
slot 0xb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d6103 0x000000000000000000000000c830f6088cb0d76a07893db2e47aa20f028e1a15

 验证升级... （调用新增函数成功不抛异常表示升级OK）
boxV2.get_value():  0n
```

#### Etherscan上传和验证合约代码

- 逻辑合约：需要上传和验证合约代码。
- 代理合约：需要设置为代理合约。先验证逻辑合约，再设置代理合约。
- 管理合约：无需验证和设置。

参照： [ETHERSCAN上传和验证智能合约代码](./docs/ETHERSCAN上传和验证智能合约代码.md)

### 3. UUPS代理升级

#### 原理介绍
UUPS代理（Universal Upgradeable Proxy Standard，通用可升级代理），涉及2个合约，升级函数在逻辑合约中：

- 代理合约（Proxy）
  
  文件路径：[ERC1967Proxy.sol](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/proxy/ERC1967/ERC1967Proxy.sol)

- 逻辑合约（Implementation）
  
  文件路径：待部署的合约文件。

  逻辑合约中需要包含初始化函数 [Initializable.sol](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/proxy/utils/Initializable.sol) 和升级函数 [UUPSUpgradeable.sol](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/proxy/utils/UUPSUpgradeable.sol)。


#### 本地网络执行测试用例
```shell
npx hardhat test .\test\UUPS_BoxProxyV2.test.ts --network localhost
```


#### 本地网络打印输出
```
  UUPS代理升级合约测试

 账户列表...
AdminAccount:  0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
OwnerAccount:  0x70997970C51812dc3A010C7d01b50e0d17dc79C8
UserAccount:   0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC

 部署合约: Box...
boxV1 代理合约地址:  0x276C216D241856199A83bf27b2286659e5b877D3
boxV1 逻辑合约地址:  0x86A2EE8FAf9A840F7a2c64CA3d51209F9A02081D
boxV1 管理合约地址:  0x0000000000000000000000000000000000000000

 打印固定存储槽...
逻辑合约地址存储槽
slot 0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc 0x00000000000000000000000086a2ee8faf9a840f7a2c64ca3d51209f9a02081d
管理合约地址存储槽
slot 0xb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d6103 0x0000000000000000000000000000000000000000000000000000000000000000

 升级合约: BoxV1 ——> BoxV2...
boxV2 代理合约地址:  0x276C216D241856199A83bf27b2286659e5b877D3
boxV2 逻辑合约地址:  0xAA292E8611aDF267e563f334Ee42320aC96D0463
boxV2 管理合约地址:  0x0000000000000000000000000000000000000000
    ✔ UUPS代理升级用 (142ms)


  1 passing (779ms)
```
升级后代理合约地址不变，只有逻辑合约地址变化。无管理合约，地址为0。

### 地址说明
为了避免存储槽冲突，OpenZeppelin升级合约文件 [ERC1967Utils.sol](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/proxy/ERC1967/ERC1967Utils.sol) 里定义了几个常量地址：

逻辑合约地址存储槽
```solidity
/**
  * @dev Storage slot with the address of the current implementation.
  * This is the keccak-256 hash of "eip1967.proxy.implementation" subtracted by 1.
  */
// solhint-disable-next-line private-vars-leading-underscore
bytes32 internal constant IMPLEMENTATION_SLOT = 0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc;

```

管理合约地址存储槽
```solidity

/**
  * @dev Storage slot with the admin of the contract.
  * This is the keccak-256 hash of "eip1967.proxy.admin" subtracted by 1.
  */
// solhint-disable-next-line private-vars-leading-underscore
bytes32 internal constant ADMIN_SLOT = 0xb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d6103;

```

### 账户说明
可升级合约中涉及三类账户：

- 管理员账户：是部署合约时的账户，只能调用升级函数，不能调用业务函数。

- 所有者账户：在合约初始化时可以指定其他所有者账户，可以调用标记为onlyOwner的函数，不能调用升级函数。部署代理合约时，在代理合约中会创建管理合约实例，所以代理合约和管理合约的所有者账户是同一个。

- 用户账户：只能调用业务函数，不能调用升级函数和标记为onlyOwner的函数。

注意：透明代理必须由部署时的管理员账户来升级，UUPS代理必须由部署时指定的Owner账户来升级。

查看本地网络账户列表：
`npx hardhat accounts --network localhost` 或 `npx hardhat accounts`

查看指定网络账户列表：
`npx hardhat accounts --network sepolia`

### 变更说明
本次使用OpenZeppenlin 5.0版本和ethers V6版本。

ethersV6 vs ethersV5变更点：
- 获取合约地址，box.address变更为await box.getAddress()
- 整数转大数，BigNumber.from("1000")变更为BigInt("1000")


### 其他说明
OpenZeppelin有两类合约库：

普通的合约库：https://github.com/OpenZeppelin/openzeppelin-contracts

可升级合约库：https://github.com/OpenZeppelin/openzeppelin-contracts-upgradeable

普通合约存在构造函数constructor，可升级合约没有构造函数，通过initializer进行初始化。

### 参考文章

[深入理解合约升级(4) - 合约升级原理的代码实现](https://mirror.xyz/xyyme.eth/VSyU0JfmVrcqN-F28tX5mzYjxFFAosl8tDAQX3vB5Dg)

[深入理解合约升级(5) - 部署一个可升级合约](https://mirror.xyz/xyyme.eth/kM9ld2u0D1BpHAfXTiaSPGPtDnOd6vrxJ5_tW4wZVBk)

[Openzeppelin的三种代理模式](https://cloud.tencent.com/developer/article/2152968)

[Openzeppelin合约生成向导](https://wizard.openzeppelin.com)