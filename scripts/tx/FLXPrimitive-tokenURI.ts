import { ethers } from "hardhat";
import { Addr } from "../addresses"
import { encode } from "../svg/encoder";
import { FLXPrimitive } from "../../typechain/FLXPrimitive"

async function main() {
  const c0 = (await ethers.getContractAt("FLXPrimitive", Addr.FLXPrimitive)) as FLXPrimitive
  const tx = await c0.tokenURI(5001)
  console.log(tx)
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
