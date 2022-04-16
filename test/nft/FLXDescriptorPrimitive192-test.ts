import "@nomiclabs/hardhat-waffle";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { encode } from "../../scripts/svg/encoder";
import { palette192 } from "../../scripts/palette192"
import { promises as fs } from "fs";
import { expect, use } from 'chai'
import path from "path";

// test contracts and parameters
import { FLXDescriptorPrimitive } from "../../typechain/FLXDescriptorPrimitive";
// import { NFTDescriptor } from "../typechain/NFTDescriptor";
import { ERC721JunctionMock } from "../../typechain/ERC721JunctionMock";

const OUT_SVG_FILE = "images/encoder.svg";
const INPUT_SVG_FILE = "images/chr_all_2.png"

describe("FLXDescriptorPrimitive-test", async () => {
  let owner :SignerWithAddress, addr1 :SignerWithAddress, addr2 :SignerWithAddress

  let c: FLXDescriptorPrimitive;
  let c0;
  let c2: ERC721JunctionMock;

  beforeEach(async () => {
    [owner, addr1, addr2,] = await ethers.getSigners()

    const ERC721JunctionMock = await ethers.getContractFactory("ERC721JunctionMock");
    c2 = (await ERC721JunctionMock.deploy()) as ERC721JunctionMock
    await c2.deployed();

    const NFTDescriptor = await ethers.getContractFactory("NFTDescriptor");
    c0 = await NFTDescriptor.deploy();
    await c0.deployed();

    const FLXDescriptorPrimitive = await ethers.getContractFactory("FLXDescriptorPrimitive", {
      libraries: { NFTDescriptor: c0.address },
    });
    c = (await FLXDescriptorPrimitive.deploy()) as FLXDescriptorPrimitive;
    await c.deployed();

    await c.setToken(c2.address)
  });

  describe("test", async () => {
    it("success", async () => {

      //palette
      let indexes_ = []
      let palettes_ = []
    
      for(let i = 0; i < palette192.length; i++){
        console.log("i",i)
        indexes_.push(i)
        palettes_.push(palette192[i])
    
        // await c0.addBulkColorsToPalette(i, palette3072[i]);
    
        if(i % 4 == 3){
          console.log("i % 4",i % 4)
          await c.addBulkBulkColorsToPalette(indexes_, palettes_);
          indexes_ = []
          palettes_ = []    
        }    
      }

      //seed
      for(let i = 0; i < 12; i++){
        const INPUT_SVG_FILE_ALL = "images/" + (i*4 +1) + ".png"
    
        const encodeJson = await encode(INPUT_SVG_FILE_ALL);
    
        const seed = encodeJson.images.root[0].data;
        console.log(seed)
        await c.setSeed(i,seed)
      }
    
      c2.mint(owner.address, 11)

      const svg = await c.tokenURI(11);
      console.log(svg)
      // const svg2 = ethers.utils.toUtf8String(ethers.utils.base64.decode(svg));
      // console.log(svg2)
      // await fs.writeFile(OUT_SVG_FILE, svg2);

    });

  });
});
