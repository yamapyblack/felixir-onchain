import { ethers } from "hardhat";
import { Addr } from "../../addresses"
import { Addresses, KmsSigner } from "../../common"
import { encode } from "../../svg/encoder";
import { FLXPrimitiveV2 } from "../../../typechain/FLXPrimitiveV2"

async function main() {
  const signer = KmsSigner()

  const c0 = (await ethers.getContractAt("FLXPrimitiveV2", Addr.FLXPrimitiveV2)) as FLXPrimitiveV2

  let addrs : string[] = []
  let tokenIds = []

  let owners = [
    // ['0x1B4983D160b43ABd7861EBd968201099cc559183',7001],
    // ['0xFaD1EFb6ea95F693d22B8e379a4Ef08537d1C92e',7002],
    // ['0x97C3253e01431a580E341Cc289446aEd1553B153',7003],
    // ['0xE3Ce6CDf25a6fe4490DE6E5B5e7810ba87aaB937',7004],
    // ['0x46efB4903DdeFF6d4Fd0561EFF7528C87b3e1461',7005],
    // ['0x2690381aBBE2bD89aE6318fC501746f92c0Eb2A8',7006],
    // ['0x3511748c00b6B2dD9f77c1141ceC9C0BD7ADA5bE',7007],
    // ['0x3ED2c3a508A88A20062011fC77f703B23378956C',7008],
    // ['0xF7351B2795Fe83ec903D31C21aa806e5a4F6007b',7009],
    // ['0x5df4660295BEd7Abc783480c7d28d8c015Cfb37a',7010],
    // ['0x7c5bCF17f910eCCb897783113bf5f27E3c5133a3',7011],
    // ['0x2e7735AdB640c4A1f6C72657c66FbD892D487d5D',7012],
    ['0xb49A66c7E31772F2D5378a4eb22Ff0ba4EE5c1B1',7013],
    ['0x5df341c2F01FE92D183D865f5D136EFdb2E9EaED',7014],
    ['0x49A60dfc874B241A772177cAFD07A9f64AF5273C',7015],
    ['0xb14f6D53A5d017Af0B20d8DFbB9F655785fD3cA9',7016],
    ['0x789299d57Cc344B88e67f50BDa991e038eEDe8c7',7017],
  ]

  for(let i = 0; i < owners.length; i++){
    console.log("i",i)
    addrs.push(owners[i][0] as string)
    tokenIds.push(owners[i][1])
  }
  const tx = await c0.connect(signer)["mint(address[],uint256[])"](addrs, tokenIds);
  console.log(tx)

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
