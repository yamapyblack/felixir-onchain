import { ethers } from "hardhat";
import { KmsSigner } from "../common";
import { Addr } from "../addresses";
import { encode } from "../svg/encoder";
import { FLXDescriptorExtension } from "../../typechain-types/contracts/nft/FLXDescriptorExtension";
import { FLXExtension } from "../../typechain/FLXExtension";

// const INPUT_SVG_FILE = "images/test/image_soard2.png";
// const INPUT_SVG_FILE = "images/test/wpn0012_002.png";
const INPUT_SVG_FILE = "images/test/hat0003_002.png";

async function main() {
  const signer = KmsSigner();

  const tokenId = 2;
  const to = Addr.Deployer;

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
