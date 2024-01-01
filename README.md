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


### 2. 透明代理升级说明


#### 原理介绍
透明代理，涉及3个合约，升级函数在代理合约中：

- 管理合约（Admin）
  
  文件路径：[ProxyAdmin.sol](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/proxy/transparent/ProxyAdmin.sol)

- 代理合约（Proxy）
  
  文件路径：[TransparentUpgradeableProxy.sol](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/proxy/transparent/TransparentUpgradeableProxy.sol)

- 逻辑合约（Implementation）
  
  文件路径：待部署的合约文件。


#### 执行命令
```shell
npx hardhat test .\test\TRANS_BoxProxyV2.test.ts --network localhost
```


#### 打印输出
```
  透明代理升级合约

 Deploy Contract: BoxV1...
boxV1 ProxyAddress:           0x0DCd1Bf9A1b36cE34237eEaFef220932846BCD82
boxV1 ImplementationAddress:  0x5FbDB2315678afecb367f032d93F642f64180aa3
boxV1 AdminAddress:           0x32467b43BFa67273FC7dDda0999Ee9A12F2AaA08

 Upgrade Contract: BoxV1 ——> BoxV2...
boxV2 ProxyAddress:           0x0DCd1Bf9A1b36cE34237eEaFef220932846BCD82
boxV2 ImplementationAddress:  0x5FC8d32690cc91D4c39d9d3abcBD16989F875707
boxV2 AdminAddress:           0x32467b43BFa67273FC7dDda0999Ee9A12F2AaA08
```
升级后管理合约和代理合约地址不变，只有逻辑合约地址变化。


### 3. UUPS代理升级说明

#### 原理介绍
UUPS代理（Universal Upgradeable Proxy Standard，通用可升级代理），涉及2个合约，升级函数在逻辑合约中：

- 代理合约（Proxy）
  
  文件路径：[ERC1967Proxy.sol](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/proxy/ERC1967/ERC1967Proxy.sol)

- 逻辑合约（Implementation）
  
  文件路径：待部署的合约文件。

  逻辑合约中需要包含初始化函数 [Initializable.sol](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/proxy/utils/Initializable.sol) 和升级函数 [UUPSUpgradeable.sol](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/proxy/utils/UUPSUpgradeable.sol)。


#### 执行命令
```shell
npx hardhat test .\test\UUPS_BoxProxyV2.test.ts --network localhost
```


#### 打印输出
```
  UUPS代理升级合约
account0:  0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266

 Deploy Box...
boxV1 proxyAddress:           0xc6e7DF5E7b4f2A278906862b61205850344D4e7d
boxV1 ImplementationAddress:  0x3Aa5ebB10DC797CAC828524e59A333d0A371443c
boxV1 AdminAddress:           0x0000000000000000000000000000000000000000

 Upgrade BoxV1 ——> BoxV2...
boxV2 proxyAddress:           0xc6e7DF5E7b4f2A278906862b61205850344D4e7d
boxV2 ImplementationAddress:  0x4ed7c70F96B99c776995fB64377f0d4aB3B0e1C1
boxV2 AdminAddress:           0x0000000000000000000000000000000000000000
```
升级后代理合约地址不变，只有逻辑合约地址变化。无管理合约，地址为0。

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