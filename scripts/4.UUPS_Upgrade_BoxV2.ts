import { ethers, upgrades } from "hardhat"
import { Contract } from "ethers"

const provider = new ethers.JsonRpcProvider()

async function getSlotStorage(contract_address:string, slot_number:number) {
  let SlotStorage = await provider.getStorage(contract_address, slot_number)
  console.log("slot", slot_number.toString().padStart(3, '0'), SlotStorage)
  return SlotStorage
}

async function main() {

  // let boxV1: Contract
  let boxV2: Contract
  
  let AdminAccount

  const boxV1_adress = "0x8A791620dd6260079BF849Dc5567aDC3F2FdC318";

  //获取账户
  [AdminAccount] = await ethers.getSigners();
  
  console.log("\n", "账户列表...")
  console.log("AdminAccount: ", AdminAccount.address) //管理员账户：accounts[0]，具有唯一升级权限
  // console.log("OwnerAccount: ", OwnerAccount.address) //合约所有者：accounts[1]
  // console.log("UserAccount:  ", UserAccount.address)  //用户账户  ：accounts[2]

  const Contract_Factory_BoxV2 = await ethers.getContractFactory("UUPS_BoxV2", AdminAccount) //必须指定部署时指定的Owner账户，否则升级失败
  
  //合约升级
  console.log("\n", "升级合约: BoxV1 ——> BoxV2...");
  boxV2 = await upgrades.upgradeProxy(boxV1_adress, Contract_Factory_BoxV2)
  const boxV2_adress = await boxV2.getAddress()

  console.log("boxV2 代理合约地址: ", boxV2_adress)
  console.log("boxV2 逻辑合约地址: ", await upgrades.erc1967.getImplementationAddress(boxV2_adress))
  console.log("boxV2 管理合约地址: ", await upgrades.erc1967.getAdminAddress(boxV2_adress))

  console.log("\n", "打印固定存储槽...");
  console.log("逻辑合约地址存储槽")
  let slot_hash = "0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc";
  await getSlotStorage(boxV1_adress as string, slot_hash);
  console.log("管理合约地址存储槽")
  slot_hash = "0xb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d6103";
  await getSlotStorage(boxV1_adress as string, slot_hash);

  console.log("\n", "验证升级...", "（调用新增函数成功不抛异常表示升级OK）")
  console.log("boxV2.get_value(): ", await boxV2.get_value())

}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
