import "@nomiclabs/hardhat-waffle";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { encode } from "../../scripts/svg/encoder";
import { promises as fs } from "fs";
import { expect, use } from "chai";
import path from "path";

// test contracts and parameters
import { FLXDescriptorExtension } from "../../typechain-types/contracts/nft/FLXDescriptorExtension";
import { FLXExtension } from "../../typechain/FLXExtension";
import { FLXDescriptor } from "../../typechain/FLXDescriptor";

const OUT_SVG_FILE = "images/test/encoder.svg";
const INPUT_SVG_FILE = "images/test/image_soard2.png";

describe("FLXExtension-test", async () => {
  let owner: SignerWithAddress,
    addr1: SignerWithAddress,
    addr2: SignerWithAddress;

  let descriptorLib;
  let descriptor: FLXDescriptorExtension;
  let extension: FLXExtension;

  beforeEach(async () => {
    [owner, addr1, addr2] = await ethers.getSigners();

    const NFTDescriptor = await ethers.getContractFactory("NFTDescriptor");
    descriptorLib = await NFTDescriptor.deploy();
    await descriptorLib.deployed();

    const FLXDescriptorExtension = await ethers.getContractFactory(
      "FLXDescriptorExtension",
      {
        libraries: { NFTDescriptor: descriptorLib.address },
      }
    );
    descriptor =
      (await FLXDescriptorExtension.deploy()) as FLXDescriptorExtension;
    await descriptor.deployed();

    const FLXExtension = await ethers.getContractFactory("FLXExtension", {});
    extension = (await FLXExtension.deploy()) as FLXExtension;
    await extension.deployed();

    await extension.setDescriptor(descriptor.address);
  });

  describe("test", async () => {
    it("success generateImage", async () => {
      //set extension's seed and palettes
      const encodeJson = await encode(INPUT_SVG_FILE);
      const palettes = encodeJson.palette;
      const seed = encodeJson.images.root[0].data;
      // console.log(palettes);

      await descriptor.addBulkColorsToPalette(1, palettes);
      await descriptor.setSeed(1, seed);

      //mint
      await extension["mint(address,uint256)"](owner.address, 1);

      //tokenURI
      const svg = await extension.tokenURI(1);
      console.log(svg);
      const svg1 = svg.split(",")[1];
      const svg2 = ethers.utils.toUtf8String(ethers.utils.base64.decode(svg1));

      const svg2s = svg2.split(",");
      const svg3 = svg2s[svg2s.length - 1];
      const svg4 = ethers.utils.toUtf8String(ethers.utils.base64.decode(svg3));
      // console.log(svg4);

      await fs.writeFile(OUT_SVG_FILE, svg4);
    });
  });
});
