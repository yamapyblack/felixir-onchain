// SPDX-License-Identifier: CC0

pragma solidity ^0.8.0;

interface IPaletteStorage{

    function setSeed(uint8 _seedIdx, bytes calldata _seed) external;

    function addBulkColorsToPalette(
        uint paletteIndex,
        string[] calldata newColors
    ) external;

    function addColorToPalette(uint _paletteIndex, string calldata _color)
        external;
}
