import { ethers } from "hardhat";
import { Addr } from "../addresses"
import { encode } from "../svg/encoder";
import { FelixirShop } from "../../typechain/FelixirShop"

async function main() {
  const c0 = (await ethers.getContractAt("FelixirShop", Addr.FelixirShop)) as FelixirShop
  const tx = await c0.setSale(true)
  console.log(tx)
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
