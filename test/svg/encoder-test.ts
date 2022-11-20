import "@nomiclabs/hardhat-waffle";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { encode } from "../../scripts/svg/encoder";
import { promises as fs } from "fs";
import path from "path";

// test contracts and parameters
import { FLXDescriptorExtension } from "../../typechain-types/contracts/nft/FLXDescriptorExtension";
import { FLXPrimitive } from "../../typechain/FLXPrimitive";
import { NFTDescriptor } from "../../typechain/NFTDescriptor";

const OUT_SVG_FILE = "images/test/encoder.svg";
// const INPUT_SVG_FILE = "images/test/image5.png";
const INPUT_SVG_FILE = "images/test/image_soard2.png";
const INPUT_SVG_FILE2 = "images/test/image6.png";

describe("encoder-test", async () => {
  let owner: SignerWithAddress,
    addr1: SignerWithAddress,
    addr2: SignerWithAddress;

  let c0: NFTDescriptor;
  let c1: FLXDescriptorExtension;
  let c2: FLXPrimitive;

  beforeEach(async () => {
    [owner, addr1, addr2] = await ethers.getSigners();

    const NFTDescriptor = await ethers.getContractFactory("NFTDescriptor");
    c0 = (await NFTDescriptor.deploy()) as NFTDescriptor;
    await c0.deployed();

    const FLXDescriptorExtension = await ethers.getContractFactory(
      "FLXDescriptorExtension",
      {
        libraries: { NFTDescriptor: c0.address },
      }
    );
    c1 = (await FLXDescriptorExtension.deploy()) as FLXDescriptorExtension;
    await c1.deployed();
  });

  describe("test", async () => {
    // it("success1", async () => {
    //   const encodeJson = await encode(INPUT_SVG_FILE);

    //   const seed = encodeJson.images.root[0].data;
    //   console.log(seed);

    //   const palettes = encodeJson.palette;
    //   palettes.shift(); // Nounsのだと先頭が空になるため、先頭削除
    //   console.log(palettes);

    //   c1.setSeed(0, seed);

    //   // const tx = await c0.connect(signer).setSeed(i, seed);
    //   // console.log(tx);
    // });

    it("success weapon", async () => {
      // const palettes = ["", "ffffff", "181b1d", "550e11", "0e6775"];
      // const seed =
      //   "0x0001131f100301030103010301030103010301020201010301010102030301010101040101010101040101030103010301030103010301030103010301030103010301030103010301030103010301";

      // const palettes = ["", "181b1d", "000000", "9ca7ae", "d4dbdf", "f2e120"];
      // const seed =
      //   "0x00080e13020301090001010103010401010800010101040103010401010800010101040103010401010800010101040103010401010800010101040103010401010800010101040103010401010800010101040103010403010600010101040103010401050101070001010104010501010800010101050101090002010300";

      const encodeJson = await encode(INPUT_SVG_FILE);
      const seed = encodeJson.images.root[0].data;
      console.log(seed);
      const palettes = encodeJson.palette;
      console.log(palettes);

      await c1.addBulkColorsToPalette(0, palettes);
      await c1.setSeed(0, seed);

      const svg = await c1.generateImage(0);
      const svg2 = ethers.utils.toUtf8String(ethers.utils.base64.decode(svg));
      // console.log(svg2);
      await fs.writeFile(OUT_SVG_FILE, svg2);

      // const svg1 = svg.split(",")[1];
      // const svg2 = ethers.utils.toUtf8String(ethers.utils.base64.decode(svg1));
      // const svg3 = svg2.split(",")[3];
      // const svg4 = ethers.utils.toUtf8String(ethers.utils.base64.decode(svg3));
      // console.log(svg4);

      // await fs.writeFile(OUT_SVG_FILE, svg4);
    });
  });
});
