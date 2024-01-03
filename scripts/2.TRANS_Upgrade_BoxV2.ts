import { SEPOLIA_RPC_URL } from "../hardhat.config";
import { ethers, upgrades } from "hardhat"
import { Contract, providers } from "ethers"

let provider: providers.JsonRpcProvider;

async function getSlotStorage(contract_address:string, slot_number:number) {
  let SlotStorage = await provider.getStorage(contract_address, slot_number)
  console.log("slot", slot_number.toString().padStart(3, '0'), SlotStorage)
  return SlotStorage
}

async function waitForReceipt(Box:Contract, Prtflag:boolean = false) {
  const ContractInstance = await Box.waitForDeployment();
  console.log("\nContractInstance: \n", ContractInstance);
  // const ContractTransactionResponse = ContractInstance.deployTransaction;
  // console.log("\nContractTransactionResponse: \n", ContractTransactionResponse);
  const txHash = ContractInstance.deployTransaction.hash //获取交易哈希
  const txReceipt = await provider.waitForTransaction(txHash); //等待交易完成，返回交易回执
  // const txReceipt = await provider.getTransactionReceipt(txHash); //该方法有问题，不等待直接获取回执，可能交易还未完成。
  console.log("\ntxReceipt: \n", txReceipt, "\n");

  if (true == Prtflag) {
  }
}

async function main() {

  // let boxV1: Contract
  let boxV2: Contract
  
  let AdminAccount

  //填写代理合约地址
  const boxV1_adress = "0xECb89780291121Ff8b4751d0b4e1B766FD276a50";

  // 设置网络
  const hre: HardhatRuntimeEnvironment = await import('hardhat');
  const networkName = hre.network.name; // 获取通过命令行传递的 --network 参数值

  if (networkName === 'sepolia') {
    provider = new ethers.JsonRpcProvider(SEPOLIA_RPC_URL);
    console.log('网络设置：使用远端RPC网络', networkName);

  } else if (networkName === 'localhost' || networkName === 'hardhat') {
    provider = new ethers.JsonRpcProvider();
    console.log('网络设置：使用本地网络...');  

  } else {
    throw new Error("网络参数错误，请检查...");
  }

  //获取账户
  [AdminAccount] = await ethers.getSigners();
  
  console.log("\n", "账户列表...")
  console.log("AdminAccount: ", AdminAccount.address) //管理员账户：accounts[0]，具有唯一升级权限
  // console.log("OwnerAccount: ", OwnerAccount.address) //合约所有者：accounts[1]
  // console.log("UserAccount:  ", UserAccount.address)  //用户账户  ：accounts[2]

  const Contract_Factory_BoxV2 = await ethers.getContractFactory("TRANS_BoxV2", AdminAccount) //必须指定管理员账户，否则升级失败
  
  //合约升级
  console.log("\n", "升级合约: BoxV1 ——> BoxV2...");
  boxV2 = await upgrades.upgradeProxy(boxV1_adress, Contract_Factory_BoxV2)
  await waitForReceipt(boxV2, true);
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
