import { ethers, network, run } from "hardhat";

async function main() {
//   const priceFeedAddress = “0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e”;

//   const priceFeedConsumerFactory = await ethers.getContractFactory(“PriceConsumerV3”);
//   const priceFeedConsumer = await priceFeedConsumerFactory.deploy(priceFeedAddress);

//   const WAIT_BLOCK_CONFIRMATIONS = 6;
//   await priceFeedConsumer.deployTransaction.wait(WAIT_BLOCK_CONFIRMATIONS);

//   console.log(`Contract deployed to ${priceFeedConsumer.address} on ${network.name}`);

  console.log(`Verifying contract on Etherscan...`);

  await run(`verify:verify`, {
    address: "0x3177613B4Fe0DAfEa77c8F72799C367D4b1AB668",
    constructorArguments: ["0x6BBC4994BFA366B19541a0252148601a9f874cD1"],
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});