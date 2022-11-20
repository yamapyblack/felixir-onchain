// SPDX-License-Identifier: GPL-3.0

/// @title A library used to convert multi-part RLE compressed images to SVG

pragma solidity ^0.8.0;

import "hardhat/console.sol";

library MultiPartRLEToSVG {
    struct ContentBounds {
        uint8 top;
        uint8 right;
        uint8 bottom;
        uint8 left;
    }

    struct Rect {
        uint8 len;
        uint8 colorIndex;
    }

    struct DecodedImage {
        ContentBounds bounds;
        Rect[] rects;
    }

    /**
     * @notice Given RLE image parts and color palettes, generate SVG rects.
     */
    // prettier-ignore
    function generateSVGRects(bytes memory seed, string[] memory palette)
        internal
        view
        returns (string memory svg)
    {
        // console.log("yama1");
        string[33] memory lookup = [
            '0', '10', '20', '30', '40', '50', '60', '70', 
            '80', '90', '100', '110', '120', '130', '140', '150', 
            '160', '170', '180', '190', '200', '210', '220', '230', 
            '240', '250', '260', '270', '280', '290', '300', '310',
            '320' 
        ];
        string memory rects;

        DecodedImage memory image = _decodeRLEImage(seed);
        // console.log("yama1_1");

        uint256 currentX = image.bounds.left;
        uint256 currentY = image.bounds.top;
        // uint256 cursor;
        string[4] memory buffer;

        console.log("image.bounds.top", image.bounds.top);
        console.log("image.bounds.right", image.bounds.right);
        console.log("image.bounds.bottom", image.bounds.bottom);
        console.log("image.bounds.left", image.bounds.left);

        string memory part;
        console.log("image.rects.length", image.rects.length); 
        for (uint256 i = 0; i < image.rects.length; i++) {
            // console.log("i", i);
            Rect memory rect = image.rects[i];

            uint _surplus;
            if(currentX + rect.len > image.bounds.right){
                _surplus = currentX + rect.len - image.bounds.right;

                if(rect.colorIndex != 0){
                    // console.log("cursor", cursor);
                    // console.log("rect.len", rect.len);
                    // console.log("currentX", currentX);
                    // console.log("currentY", currentY);
                    // console.log("rect.colorIndex", rect.colorIndex);
                    buffer[0] = lookup[rect.len - _surplus];          // width
                    buffer[1] = lookup[currentX];         // x
                    buffer[2] = lookup[currentY];         // y
                    buffer[3] = palette[rect.colorIndex]; // color
                    // console.log("hoge2");
                    part = string(abi.encodePacked(part, _getChunk(buffer)));
                }
                currentX = image.bounds.left;
                currentY++;
                if(rect.colorIndex != 0){
                    // console.log("cursor", cursor);
                    // console.log("rect.len", rect.len);
                    // console.log("currentX", currentX);
                    // console.log("currentY", currentY);
                    // console.log("rect.colorIndex", rect.colorIndex);
                    buffer[0] = lookup[_surplus];          // width
                    buffer[1] = lookup[currentX];         // x
                    buffer[2] = lookup[currentY];         // y
                    buffer[3] = palette[rect.colorIndex]; // color
                    // console.log("hoge2");
                    part = string(abi.encodePacked(part, _getChunk(buffer)));
                }
                currentX += _surplus;

            }else{
                if(rect.colorIndex != 0){
                    // console.log("cursor", cursor);
                    // console.log("rect.len", rect.len);
                    // console.log("currentX", currentX);
                    // console.log("currentY", currentY);
                    // console.log("rect.colorIndex", rect.colorIndex);
                    buffer[0] = lookup[rect.len];          // width
                    buffer[1] = lookup[currentX];         // x
                    buffer[2] = lookup[currentY];         // y
                    buffer[3] = palette[rect.colorIndex]; // color
                    // console.log("hoge2");
                    part = string(abi.encodePacked(part, _getChunk(buffer)));
                }
                // console.log("hoge3");

                currentX += rect.len;
                // console.log("rect.len", rect.len);
                // if (currentX - image.bounds.left == image.width) {
                if (currentX == image.bounds.right) {
                    console.log("currentX is back", currentX);
                    currentX = image.bounds.left;
                    currentY++;
                }
            }
        }

        // part = string(abi.encodePacked(part, _getChunk(buffer)));
        rects = string(abi.encodePacked(rects, part));
        // console.log("yama2");

        return rects;
    }

    /**
     * @notice Return a string that consists of all rects in the provided `buffer`.
     */
    // prettier-ignore
    function _getChunk(string[4] memory buffer) private pure returns (string memory) {
        string memory chunk;
        chunk = string(
            abi.encodePacked(
                chunk,
                '<rect width="', buffer[0], '" height="10" x="', buffer[1], '" y="', buffer[2], '" fill="#', buffer[3], '" />'
            )
        );
        return chunk;
    }

    /**
     * @notice Decode a single RLE compressed seed into a `DecodedImage`.
     */
    function _decodeRLEImage(bytes memory seed)
        private
        pure
        returns (DecodedImage memory)
    {
        // uint8 paletteIndex = uint8(seed[0]);

        ContentBounds memory bounds = ContentBounds({
            top: uint8(seed[1]),
            right: uint8(seed[2]),
            bottom: uint8(seed[3]),
            left: uint8(seed[4])
        });

        uint256 cursor;
        Rect[] memory rects = new Rect[]((seed.length - 5) / 2);
        for (uint256 i = 5; i < seed.length; i += 2) {
            rects[cursor] = Rect({
                len: uint8(seed[i]),
                colorIndex: uint8(seed[i + 1])
            });
            cursor++;
        }
        return
            DecodedImage({
                bounds: bounds,
                rects: rects
            });
    }
}
