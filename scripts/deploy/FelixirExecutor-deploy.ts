import { ethers } from "hardhat";
import { KmsSigner, Addresses } from "../common"

async function main() {
  const signer = KmsSigner()

  const FelixirExecutor = await ethers.getContractFactory("FelixirExecutor");

  const c0 = await FelixirExecutor.connect(signer).deploy();
  await c0.deployed();
  console.log("deployed to:", c0.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
