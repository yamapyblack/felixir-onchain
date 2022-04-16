import { ethers } from "hardhat";
import { Addr } from "../addresses"
import { Palettes } from "../palette"
import { encode } from "../svg/encoder";
import { FLXDescriptorPrimitive } from "../../typechain/FLXDescriptorPrimitive"
import { promises as fs } from "fs";

const OUT_PALETTE_FILE = "images/out_palette.txt";

async function main() {

  // const baseColor = ["000000","1a1a1c","ffffff"]

  // const c0 = (await ethers.getContractAt("FLXDescriptorPrimitive", Addr.FLXDescriptorPrimitive)) as FLXDescriptorPrimitive

  for(let i = 0; i < 48; i++){
    const INPUT_SVG_FILE_ALL = "images/chr_all_" + (i+1) + ".png"

    const encodeJson = await encode(INPUT_SVG_FILE_ALL);
    const palettes = encodeJson.palette;
    palettes.shift(); // Nounsのだと先頭が空になるため、先頭削除
    console.log(palettes)

    // var palettes2 = palettes.filter((item: string) => !item.match(/000000|1a1a1c|ffffff/));
    // console.log(palettes2)

    // const seed = encodeJson.images.root[0].data;

    // await c0.addBulkColorsToPalette(i, palettes);
    // await c0.setSeed(i, seed);  
  }

}

async function getSeed() {
  for(let i = 0; i < 12; i++){
    const INPUT_SVG_FILE_ALL = "images/chr_all_" + (i*4 +1) + ".png"

    const encodeJson = await encode(INPUT_SVG_FILE_ALL);

    const seed = encodeJson.images.root[0].data;
    console.log(seed)
  }
}

async function outPalette() {
  for(let k = 0; k < Palettes.length; k++){
     
    for(let l = 0; l < 4; l++){
      for(let m = 0; m < 4; m++){
        for(let n = 0; n < 4; n++){
          for(let o = 0; o < 4; o++){
            console.log(Palettes[k][l][0],Palettes[k][m][1],Palettes[k][n][2],Palettes[k][o][3])
            await fs.appendFile(OUT_PALETTE_FILE, 
               '["' + Palettes[k][l][0] + '","' + Palettes[k][m][1] + '","' + Palettes[k][n][2] + '","' + Palettes[k][o][3] + '"],' + "\n"
            );
          }
        }
      }
    }
  }

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
