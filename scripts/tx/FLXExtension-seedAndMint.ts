import { ethers } from "hardhat";
import { KmsSigner } from "../common";
import { Addr } from "../addresses";
import { encode } from "../svg/encoder";
import { FLXDescriptorExtension } from "../../typechain-types/contracts/nft/FLXDescriptorExtension";
import { FLXExtension } from "../../typechain/FLXExtension";

// const INPUT_SVG_FILE = "images/test/image_soard2.png";
// const INPUT_SVG_FILE = "images/test/wpn0012_002.png";
// const INPUT_SVG_FILE = "images/test/hat0003_002.png";
// const INPUT_SVG_FILE = "images/test/IMG_0553_mini.png";

const tokenId = 83;
// const to = Addr.Deployer;
const to = "0x9c0F9A4A14C0e6E7D3a2EF084aef986f588da6E5";

// const INPUT_SVG_FILE = "images/weapons/wpn0001_002.png";
// const INPUT_SVG_FILE = "images/weapons/wpn0005_002.png";
// const INPUT_SVG_FILE = "images/weapons/wpn0007_001.png";
// const INPUT_SVG_FILE = "images/weapons/wpn0011_001.png";
// const INPUT_SVG_FILE = "images/weapons/wpn0012_002.png";
// const INPUT_SVG_FILE = "images/weapons/hat0001_001.png";
// const INPUT_SVG_FILE = "images/weapons/hat0001_002.png";
// const INPUT_SVG_FILE = "images/weapons/hat0002_002.png";
// const INPUT_SVG_FILE = "images/weapons/hat0003_002.png";
// const INPUT_SVG_FILE = "images/weapons/sld0002_001.png";
// const INPUT_SVG_FILE = "images/weapons/sld0004_002.png";
// const INPUT_SVG_FILE = "images/weapons/sld0005_001.png";
const INPUT_SVG_FILE = "images/weapons/sld0005_002.png";

/*
// const INPUT_SVG_FILE = "images/weapons_mini/wpn0001_002_m.png";
// const INPUT_SVG_FILE = "images/weapons_mini/wpn0005_002_m.png";
// const INPUT_SVG_FILE = "images/weapons_mini/wpn0007_001_m.png";
// const INPUT_SVG_FILE = "images/weapons_mini/wpn0011_001_m.png";
// const INPUT_SVG_FILE = "images/weapons_mini/wpn0012_002_m.png";
// const INPUT_SVG_FILE = "images/weapons_mini/hat0001_001_m.png";
// const INPUT_SVG_FILE = "images/weapons_mini/hat0001_002_m.png";
// const INPUT_SVG_FILE = "images/weapons_mini/hat0002_002_m.png";
// const INPUT_SVG_FILE = "images/weapons_mini/hat0003_002_m.png";
// const INPUT_SVG_FILE = "images/weapons_mini/sld0002_001_m.png";
// const INPUT_SVG_FILE = "images/weapons_mini/sld0004_002_m.png";
// const INPUT_SVG_FILE = "images/weapons_mini/sld0005_001_m.png";
// const INPUT_SVG_FILE = "images/weapons_mini/sld0005_002_m.png";
*/

async function main() {
  const signer = KmsSigner();

  const c0 = (await ethers.getContractAt(
    "FLXDescriptorExtension",
    Addr.FLXDescriptorExtension
  )) as FLXDescriptorExtension;
  const c1 = (await ethers.getContractAt(
    "FLXExtension",
    Addr.FLXExtension
  )) as FLXExtension;

  const encodeJson = await encode(INPUT_SVG_FILE);
  const palettes = encodeJson.palette;
  const seed = encodeJson.images.root[0].data;

  const tx = await c0.connect(signer).addBulkColorsToPalette(tokenId, palettes);
  console.log(tx);
  const tx2 = await c0.connect(signer).setSeed(tokenId, seed);
  console.log(tx2);

  const tx3 = await c1.connect(signer)["mint(address,uint256)"](to, tokenId);
  console.log(tx3);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
