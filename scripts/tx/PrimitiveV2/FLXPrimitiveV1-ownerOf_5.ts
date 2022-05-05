import { ethers } from "hardhat";
import { Addr } from "../../addresses"
import { encode } from "../../svg/encoder";
import { FLXPrimitive } from "../../../typechain/FLXPrimitive"
import { promises as fs } from "fs";

const OUT_PATH = "scripts/V2/";

async function main() {
  const c0 = (await ethers.getContractAt("FLXPrimitive", Addr.FLXPrimitive)) as FLXPrimitive

  const num = 5
  // const start = 800 * (num - 1) + 1
  const start = 3811
  const end = 800 * num
  console.log(start, end)

  const out_file = OUT_PATH + "owners_" + num + ".txt"

  for(let i = start; i <= end; i++){
    const owner = await c0.ownerOf(i)
    await fs.appendFile(out_file, 
      "['" + owner + "'," + i + "],\n"
    );
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
