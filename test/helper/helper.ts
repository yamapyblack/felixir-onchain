import { network, ethers } from "hardhat";

export const encodeParameters = (types: string[], values: unknown[]): string => {
  const abi = new ethers.utils.AbiCoder()
  return abi.encode(types, values)
}

export const evmMine = async (num: number): Promise<void> => {
  for(let i = 0; i < num; i++){
    await network.provider.send("evm_mine")
  }
}

export const getBlockNumber = async (): Promise<number> => {
  return ethers.provider.getBlockNumber()
}

export const NilAddress = "0x0000000000000000000000000000000000000000";

export const decodeSvg = (svg: string): string => {
  const svg1 = svg.split(",")[1];
  const svg2 = ethers.utils.toUtf8String(ethers.utils.base64.decode(svg1));

  const svg3 = JSON.parse(svg2)
  console.log(svg3.name)
  console.log(svg3.description)
  console.log(svg3.attributes)
  const svg4 = svg3.image.split(",")[1]
  const svg5 = ethers.utils.toUtf8String(ethers.utils.base64.decode(svg4));

  // console.log(svg5);
  return svg5
}