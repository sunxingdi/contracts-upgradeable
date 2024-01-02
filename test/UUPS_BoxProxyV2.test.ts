// test/4.BoxProxyV2.test.ts
import { expect } from "chai"
import { ethers, upgrades } from "hardhat"
import { Contract } from "ethers"
// import { expectEvent } = from "@openzeppelin/test-helpers"

const provider = new ethers.JsonRpcProvider()

async function getSlotStorage(contract_address:string, slot_number:number) {
  let SlotStorage = await provider.getStorage(contract_address, slot_number)
  console.log("slot", slot_number.toString().padStart(3, '0'), SlotStorage)
  return SlotStorage
}

describe("UUPS代理升级合约测试", function () {
  let boxV1:Contract
  let boxV2:Contract

  let AdminAccount, OwnerAccount, UserAccount

  beforeEach(async function () {

    //获取账户
    [AdminAccount, OwnerAccount, UserAccount] = await ethers.getSigners();
    console.log("\n", "账户列表...")
    console.log("AdminAccount: ", AdminAccount.address) //管理员账户：accounts[0]，具有唯一升级权限
    console.log("OwnerAccount: ", OwnerAccount.address) //合约所有者：accounts[1]
    console.log("UserAccount:  ", UserAccount.address)  //用户账户  ：accounts[2]

    const Contract_Factory_Box   = await ethers.getContractFactory("UUPS_BoxV1", AdminAccount)
    const Contract_Factory_BoxV2 = await ethers.getContractFactory("UUPS_BoxV2", OwnerAccount) //必须指定Owner账户，否则升级失败

    //合约初始化：42
    console.log("\n", "部署合约: Box...");
    boxV1 = await upgrades.deployProxy(Contract_Factory_Box, [OwnerAccount.address], { kind: 'uups', initializer: 'initialize' });
    await boxV1.waitForDeployment();
    const boxV1_adress = await boxV1.getAddress()   

    await boxV1.store(42);

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

    //合约升级前测试
    expect(await boxV1.retrieve()).to.equal(BigInt("42")) //初始化生效
    
    //合约升级
    console.log("\n", "升级合约: BoxV1 ——> BoxV2...");
    boxV2 = await upgrades.upgradeProxy(boxV1_adress, Contract_Factory_BoxV2)
    const boxV2_adress = await boxV2.getAddress()

    console.log("boxV2 代理合约地址: ", boxV2_adress)
    console.log("boxV2 逻辑合约地址: ", await upgrades.erc1967.getImplementationAddress(boxV2_adress))
    console.log("boxV2 管理合约地址: ", await upgrades.erc1967.getAdminAddress(boxV2_adress))
  })

  it("UUPS代理升级用", async function () {

    await expect(boxV2.store(30) ).to.be.revertedWith('The store function has been canceled');     //修改函数生效
    await expect(boxV2.retrieve()).to.be.revertedWith('The retrieve function has been canceled');  //修改函数生效

    expect(await boxV2.get_value() ).to.equal(BigInt('42')) //新增函数get_value()生效，状态变量value继承生效
    expect(await boxV2.get_value2()).to.equal(BigInt('0'))  //新增函数get_value2()生效，新增状态变量value2生效

    await boxV2.increment() //新增函数increment()生效
    expect(await boxV2.get_value() ).to.equal(BigInt('43')) 
    expect(await boxV2.get_value2()).to.equal(BigInt('1')) 

    await boxV2.set_value(100)  //新增函数set_value() 生效
    await boxV2.set_value2(200) //新增函数set_value2()生效
    expect(await boxV2.get_value() ).to.equal(BigInt('100')) 
    expect(await boxV2.get_value2()).to.equal(BigInt('200')) 

    // 使用用户账户调用升级后合约的get_value函数，预期OK
    const boxV2WithSignerUser = boxV2.connect(UserAccount);
    expect(await boxV2WithSignerUser.get_value()).to.equal(BigInt('100'));

    // 使用管理账户调用升级后合约的get_value函数，预期失败
    const boxV2WithSignerAdmin = boxV2.connect(AdminAccount);
    expect(await boxV2WithSignerAdmin.get_value()).to.not.be.undefined;

  })

})
