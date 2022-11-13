
## How to Junction

Anyone can create Extension NFTs like Weapon and junction them to Felixir charactor NFTs. Extension NFTs are staked to Felixir's NFT and the image of Felixir's NFT change layered.

### How to create Extension NFTs

Extension NFT must be fully-onchain NFT, NFT's image must be 32x32 pixeled svg format. The fully-onchain NFT is separated two contracts, ERC721 contract and Descriptor contract. Descriptor has image code.

Sample below

- ERC721 contract

https://github.com/yamapyblack/felixir-onchain/blob/main/contracts/nft/FLXExtension.sol

- Descriptor contract

https://github.com/yamapyblack/felixir-onchain/blob/main/contracts/nft/FLXDescriptor.sol

These two contracts are needed to be related. After depoloying both, need to do `setDescriptor` on ERC721 contract to relate ERC721 to Descriptor.

### How to create images

Creators make 32x32 svg images and set them on Descriptor contract. In fact, necessaries are `seed` and `pallet`. Seed and Pallet define pixel and color. 
The encoder script below can generate `seed` and `pallet` from png file (this png size must be 32x32)

*set INPUT_SVG_FILE on filePath

https://github.com/yamapyblack/felixir-onchain/blob/main/scripts/svg/encoder.ts

This concept is inspired by Nouns DAO, so read below in detail.

https://nouns.center/dev/generate-on-chain-noun

Seed and Pallet are set on `PaletteStorage.sol` that extended by FLXDescriptor.sol.

https://github.com/yamapyblack/felixir-onchain/blob/main/contracts/lib/PaletteStorage.sol

### How to junction Extension NFTs to Felixir charactor NFTs

Felixir charactor NFTs extend `ERC721Junction.sol` that has some functions to junction.

https://github.com/yamapyblack/felixir-onchain/blob/main/contracts/lib/ERC721Junction.sol

- Junction

`parentTokenId` means Felixir charactor NFTs token id and `childToken` means Extension NFTs contract address and token id. Before junctioning, `approve` is necessary because this function transfer Extension NFTs to the Felixir NFT (staking).

```
    function junction(
        uint256 parentTokenId,
        ChildToken[] calldata childToken
    ) external;

    struct ChildToken{
        address addr;
        uint id;
    }
```

- Unjunction

if removing Extension NFTs, do unJunction.

```
    function unJunction(uint256 parentTokenId) external;
```
