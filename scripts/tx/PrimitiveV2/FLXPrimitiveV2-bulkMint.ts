import { ethers } from "hardhat";
import { Addr } from "../../addresses"
import { Addresses, KmsSigner } from "../../common"
import { encode } from "../../svg/encoder";
import { FLXPrimitiveV2 } from "../../../typechain/FLXPrimitiveV2"
import { owners } from "../../V2/owners"

async function main() {
  const signer = KmsSigner()

  const c0 = (await ethers.getContractAt("FLXPrimitiveV2", Addr.FLXPrimitiveV2)) as FLXPrimitiveV2

  const bundle = 80
  let addrs : string[] = []
  let tokenIds = []

  for(let i = 0; i < owners.length; i++){
    console.log("i",i)
    addrs.push(owners[i][0] as string)
    tokenIds.push(owners[i][1])

    if(i % bundle == (bundle - 1)){
      console.log("bundle")
      await c0.connect(signer)["mint(address[],uint256[])"](addrs, tokenIds);
      addrs = []
      tokenIds = []
    }
  }

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
