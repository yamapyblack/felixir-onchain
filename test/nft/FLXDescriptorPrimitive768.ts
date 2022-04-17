import "@nomiclabs/hardhat-waffle";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { encode } from "../../scripts/svg/encoder";
import { palette768 } from "../../scripts/palette768"
import { promises as fs } from "fs";
import { decodeSvg } from "../helper/helper"
import { expect, use } from 'chai'
import path from "path";

// test contracts and parameters
import { FLXDescriptorPrimitive } from "../../typechain/FLXDescriptorPrimitive";
// import { NFTDescriptor } from "../typechain/NFTDescriptor";
import { ERC721JunctionMock } from "../../typechain/ERC721JunctionMock";

const INPUT_SVG_FILE = "images/chr_all_2.png"

describe("FLXDescriptorPrimitive-test", async () => {
  let owner :SignerWithAddress, addr1 :SignerWithAddress, addr2 :SignerWithAddress

  let c: FLXDescriptorPrimitive;
  let c0;
  let c2: ERC721JunctionMock;

  before(async () => {
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

    //palette
    let indexes_ = []
    let palettes_ = []
  
    for(let i = 0; i < palette768.length; i++){
      console.log("i",i)
      indexes_.push(i)
      palettes_.push(palette768[i])
  
      // await c0.addBulkColorsToPalette(i, palette3072[i]);
  
      if(i % 4 == 3){
        // console.log("i % 4",i % 4)
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
      // console.log(seed)
      await c.setSeed(i,seed)
    }

  });

  describe("test", async () => {
    it("success", async () => {
      for(let j = 3975; j < 3990; j++){
        c2.mint(owner.address, j)

        const svg = await c.tokenURI(j);
        // console.log(decodeSvg(svg))
  
        const OUT_SVG_FILE = "images/output/768_" + j + ".svg";
        await fs.writeFile(OUT_SVG_FILE, decodeSvg(svg));  
      }    
    });

    it("success", async () => {
      for(let j = 3990; j < 4005; j++){
        c2.mint(owner.address, j)

        const svg = await c.tokenURI(j);
        // console.log(decodeSvg(svg))
  
        const OUT_SVG_FILE = "images/output/768_" + j + ".svg";
        await fs.writeFile(OUT_SVG_FILE, decodeSvg(svg));  
      }    
    });

  });
});
