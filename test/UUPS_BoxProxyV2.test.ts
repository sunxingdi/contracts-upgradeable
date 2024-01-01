// test/4.BoxProxyV2.test.ts
import { expect } from "chai"
import { ethers, upgrades } from "hardhat"
import { Contract } from "ethers"
// import { expectEvent } = from "@openzeppelin/test-helpers"

describe("UUPS代理升级合约", function () {
  let boxV1:Contract
  let boxV2:Contract

  beforeEach(async function () {

    const accounts = await ethers.getSigners();
    const account0 = accounts[0].address;

    const Contract_Factory_Box   = await ethers.getContractFactory("UUPS_Box")
    const Contract_Factory_BoxV2 = await ethers.getContractFactory("UUPS_BoxV2")

    console.log("account0: ",account0)

    //合约初始化：42
    console.log("\n", "Deploy Box...");
    boxV1 = await upgrades.deployProxy(Contract_Factory_Box, [account0], { kind: 'uups', initializer: 'initialize' });
    await boxV1.waitForDeployment();
    const boxV1_adress = await boxV1.getAddress()   

    await boxV1.store(42);

    console.log("boxV1 proxyAddress:          ", boxV1_adress)
    console.log("boxV1 ImplementationAddress: ", await upgrades.erc1967.getImplementationAddress(boxV1_adress))
    console.log("boxV1 AdminAddress:          ", await upgrades.erc1967.getAdminAddress(boxV1_adress))

    //合约升级前测试
    expect(await boxV1.retrieve()).to.equal(BigInt('42')) //初始化生效
    
    //合约升级
    console.log("\n", "Upgrade BoxV1 ——> BoxV2...");
    boxV2 = await upgrades.upgradeProxy(boxV1_adress, Contract_Factory_BoxV2)
    const boxV2_adress = await boxV2.getAddress()

    console.log("boxV2 proxyAddress:          ", boxV2_adress)
    console.log("boxV2 ImplementationAddress: ", await upgrades.erc1967.getImplementationAddress(boxV2_adress))
    console.log("boxV2 AdminAddress:          ", await upgrades.erc1967.getAdminAddress(boxV2_adress))
  })

  it("should retrieve value previously stored and increment correctly", async function () {

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
  })

})
