import { ethers } from "hardhat";
import { KmsSigner, Addresses } from "../common"
import { Addr } from "../addresses"
import { FelixirShop } from "../../typechain/FelixirShop"

async function main() {
  const signer = KmsSigner()

  const FelixirShop = await ethers.getContractFactory("FelixirShop");
  const c0 = await FelixirShop.connect(signer).deploy(Addr.FLXPrimitive, Addr.FelixirExecutor);
  await c0.deployed();
  console.log("deployed to:", c0.address);

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
