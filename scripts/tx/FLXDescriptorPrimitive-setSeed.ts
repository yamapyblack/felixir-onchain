import { ethers } from "hardhat";
import { Addresses, KmsSigner } from "../common"
import { Addr } from "../addresses"
import { encode } from "../svg/encoder";
import { FLXDescriptorPrimitive } from "../../typechain/FLXDescriptorPrimitive"
import { promises as fs } from "fs";

const OUT_PALETTE_FILE = "images/out_palette.txt";
const OUT_PALETTE_FILE2 = "images/out_palette2.txt";

async function main() {
  const signer = KmsSigner()

  const c0 = (await ethers.getContractAt("FLXDescriptorPrimitive", Addr.FLXDescriptorPrimitive)) as FLXDescriptorPrimitive

  for(let i = 0; i < 12; i++){
    const INPUT_SVG_FILE_ALL = "images/" + (i*4 +1) + ".png"

    const encodeJson = await encode(INPUT_SVG_FILE_ALL);

    const seed = encodeJson.images.root[0].data;
    // console.log(seed)
    const tx = await c0.connect(signer).setSeed(i,seed)
    console.log(tx)    
  }

}

async function getSeed() {
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
