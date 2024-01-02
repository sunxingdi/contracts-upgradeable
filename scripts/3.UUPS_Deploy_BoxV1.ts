import { ethers, upgrades } from "hardhat"
import { Contract } from "ethers"

const provider = new ethers.JsonRpcProvider()

async function getSlotStorage(contract_address:string, slot_number:number) {
  let SlotStorage = await provider.getStorage(contract_address, slot_number)
  console.log("slot", slot_number.toString().padStart(3, '0'), SlotStorage)
  return SlotStorage
}

async function main() {

  let boxV1: Contract
  // let boxV2: Contract
  
  let AdminAccount

  //获取账户
  [AdminAccount] = await ethers.getSigners();
  
  console.log("\n", "账户列表...")
  console.log("AdminAccount: ", AdminAccount.address) //管理员账户：accounts[0]，具有唯一升级权限
  // console.log("OwnerAccount: ", OwnerAccount.address) //合约所有者：accounts[1]
  // console.log("UserAccount:  ", UserAccount.address)  //用户账户  ：accounts[2]

  const Contract_Factory_Box   = await ethers.getContractFactory("UUPS_BoxV1", AdminAccount)
  
  //合约初始化：42
  console.log("\n", "部署合约: Box...");
  boxV1 = await upgrades.deployProxy(Contract_Factory_Box, [AdminAccount.address], { kind: 'uups', initializer: 'initialize'})
  await boxV1.waitForDeployment();

  const boxV1_adress = await boxV1.getAddress()

  console.log("boxV1 代理合约地址: ", boxV1_adress)
  console.log("boxV1 逻辑合约地址: ", await upgrades.erc1967.getImplementationAddress(boxV1_adress))
  console.log("boxV1 管理合约地址: ", await upgrades.erc1967.getAdminAddress(boxV1_adress))

  console.log("\n", "打印固定存储槽...");
  console.log("逻辑合约地址存储槽")
  let slot_hash = "0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc";
  await getSlotStorage(boxV1_adress as string, slot_hash);
  console.log("管理合约地址存储槽")
  slot_hash = "0xb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d6103";
  await getSlotStorage(boxV1_adress as string, slot_hash);
  
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
