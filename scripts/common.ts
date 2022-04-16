import env, { ethers } from 'hardhat'
import { KmsEthersSigner } from "aws-kms-ethers-signer";
import { HttpNetworkConfig } from "hardhat/types"

export const NilAddress = "0x0000000000000000000000000000000000000000"
const region = process.env.AWS_REGION!;
const keyId = process.env.KMS_KEY_ID!;

export interface AddressesType {
  Deployer: string
}

export const Addresses = () => {
  switch (env.network.name) {
    case "shiden":
      return {
        Deployer: "0x76D8a627dA0EA33ABDF3A922E7dA6e6ee78ab7A1",
      } as AddressesType

    case "astar":
      return {
        Deployer: "0x76D8a627dA0EA33ABDF3A922E7dA6e6ee78ab7A1",
      } as AddressesType

    default:
      return undefined
  }
}

export const KmsSigner = () => {
  const rpcUrl = (env.network.config as HttpNetworkConfig).url;
  const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
  const signer = new KmsEthersSigner({ keyId }).connect(provider);

  return signer
}

export const Verify = async (address: string, args: any[]) => {
  try {
    await env.run("verify:verify", {
      address: address,
      constructorArguments: args,
    });
  } catch (e: any) {
    if (e.message == "Missing or invalid ApiKey") {
      console.log("Skip verifing with", e.message)
      return
    }
    if (e.message == "Contract source code already verified") {
      console.log("Skip verifing with", e.message)
      return
    }
    throw e
  }
}
