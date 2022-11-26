import { ethers } from "hardhat";
import { Addresses, KmsSigner } from "../common";
import { FLXExtension } from "../../typechain/FLXExtension";
import { FLXDescriptorExtension } from "../../typechain-types/contracts/nft/FLXDescriptorExtension";

import { waffle } from "hardhat";
const { deployContract } = waffle;

async function main() {
  const signer = KmsSigner();
  // const addresses = Addresses()!

  const NFTDescriptor = await ethers.getContractFactory("NFTDescriptor");
  const c0 = await NFTDescriptor.connect(signer).deploy();
  await c0.deployed();
  console.log("NFTDescriptor:", c0.address);

  const FLXDescriptorExtension = await ethers.getContractFactory(
    "FLXDescriptorExtension",
    {
      libraries: { NFTDescriptor: c0.address },
    }
  );
  const c1 = await FLXDescriptorExtension.connect(signer).deploy();
  await c1.deployed();
  console.log("FLXDescriptorExtension:", c1.address);

  const FLXExtension = await ethers.getContractFactory("FLXExtension");
  const c2 = (await FLXExtension.connect(signer).deploy()) as FLXExtension;
  await c2.deployed();
  console.log("FLXExtension:", c2.address);

  const tx1 = await c2.connect(signer).setDescriptor(c1.address);
  console.log(tx1);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
