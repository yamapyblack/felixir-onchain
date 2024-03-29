import "@nomiclabs/hardhat-waffle";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { encode } from "../../scripts/svg/encoder";
import { promises as fs } from "fs";
import { expect, use } from "chai";

// test contracts and parameters
import { FLXDescriptorPrimitive } from "../../typechain/FLXDescriptorPrimitive";
import { FLXDescriptor } from "../../typechain/FLXDescriptor";
import { FLXDescriptorExtension } from "../../typechain-types/contracts/nft/FLXDescriptorExtension";
import { FLXPrimitive } from "../../typechain/FLXPrimitive";
import { FLXExtension } from "../../typechain/FLXExtension";

const OUT_SVG_FILE = "images/test/encoder.svg";
const INPUT_SVG_FILE = "images/test/image_soard2.png";
const INPUT_SVG_FILE2 = "images/test/image5.png";

describe("SvgJunction-test", async () => {
  let owner: SignerWithAddress,
    addr1: SignerWithAddress,
    addr2: SignerWithAddress;

  let descriptorLib;
  let descriptor: FLXDescriptorExtension;
  let descriptorPrimitive: FLXDescriptorPrimitive;
  let extension: FLXExtension;
  let primitive: FLXPrimitive;

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

    const FLXDescriptorPrimitive = await ethers.getContractFactory(
      "FLXDescriptorPrimitive",
      {
        libraries: { NFTDescriptor: descriptorLib.address },
      }
    );
    descriptorPrimitive =
      (await FLXDescriptorPrimitive.deploy()) as FLXDescriptorPrimitive;
    await descriptor.deployed();

    const FLXExtension = await ethers.getContractFactory("FLXExtension", {});
    extension = (await FLXExtension.deploy()) as FLXExtension;
    await extension.deployed();

    const FLXPrimitive = await ethers.getContractFactory("FLXPrimitive", {});
    primitive = (await FLXPrimitive.deploy()) as FLXPrimitive;
    await primitive.deployed();

    await extension.setDescriptor(descriptor.address);
    await primitive.setDescriptor(descriptorPrimitive.address);

    //set token address to descriptor(primitive)
    await descriptorPrimitive.setToken(primitive.address);

    //set whitelist
    await primitive.setWhiteList(extension.address, true);
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

      //set primitive's seed and palettes
      const encodeJson2 = await encode(INPUT_SVG_FILE2);
      const palettes2 = encodeJson2.palette;
      const seed2 = encodeJson2.images.root[0].data;
      // console.log(palettes2);

      await descriptorPrimitive.addBulkColorsToPalette(1, palettes2);
      await descriptorPrimitive.setSeed(1, seed2);

      //mint
      await extension["mint(address,uint256)"](owner.address, 1);
      await primitive["mint(address,uint256)"](owner.address, 1);

      //tokenURI
      const svg = await primitive.tokenURI(1);
      const svg1 = svg.split(",")[1];
      const svg2 = ethers.utils.toUtf8String(ethers.utils.base64.decode(svg1));
      console.log(svg2);

      const svg2s = svg2.split(",");
      const svg3 = svg2s[svg2s.length - 1];
      const svg4 = ethers.utils.toUtf8String(ethers.utils.base64.decode(svg3));
      // console.log(svg4);

      await fs.writeFile(OUT_SVG_FILE, svg4);

      //junction
      // await c2.setApprovalForAll(c3.address, true);
      // await c3.junction(1, [{ addr: c2.address, id: 1 }]);

      //tokenURI
      // const svg = await c3.tokenURI(1);
      // const svg1 = svg.split(",")[1];
      // const svg2 = ethers.utils.toUtf8String(ethers.utils.base64.decode(svg1));
      // console.log(svg2);

      // const svg2s = svg2.split(",");
      // const svg3 = svg2s[svg2s.length - 1];
      // const svg4 = ethers.utils.toUtf8String(ethers.utils.base64.decode(svg3));
      // // console.log(svg4);

      // await fs.writeFile(OUT_SVG_FILE, svg4);
    });
  });
});
