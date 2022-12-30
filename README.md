# Felixir Howto create ExtensionNFT

### What’s Junction

Anyone can create Extension NFTs like Weapon and junction them to Felixir charactor NFTs. Extension NFTs are staked to Felixir's NFT and the image of Felixir's NFT change layered.

### How to create Extension NFTs

Extension NFT must be fully-onchain NFT, NFT's image must be 32x32 pixeled svg format. The fully-onchain NFT is separated two contracts, ERC721 contract and Descriptor contract. Descriptor has image code.

Sample below

- ERC721 contract

[https://github.com/yamapyblack/felixir-onchain/blob/main/contracts/nft/FLXExtension.sol](https://github.com/yamapyblack/felixir-onchain/blob/main/contracts/nft/FLXExtension.sol)

- Descriptor contract

[https://github.com/yamapyblack/felixir-onchain/blob/main/contracts/nft/FLXDescriptor.sol](https://github.com/yamapyblack/felixir-onchain/blob/main/contracts/nft/FLXDescriptor.sol)

These two contracts are needed to be related. After deploying both, need to do `setDescriptor` on ERC721 contract to relate ERC721 to Descriptor.

Sample deployment script

[https://github.com/yamapyblack/felixir-onchain/blob/main/scripts/deploy/FLXExtension-deploy.ts](https://github.com/yamapyblack/felixir-onchain/blob/main/scripts/deploy/FLXExtension-deploy.ts)

### How to set images

Creators make 32x32 svg images and set them on Descriptor contract in format of `seed` and `pallet`. Seed and Pallet define pixels and colors.
The encoder script below can generate `seed` and `pallet` from png file (this png size must be 32x32)

This concept is inspired by Nouns DAO, so read below in detail.

[https://nouns.center/dev/generate-on-chain-noun](https://nouns.center/dev/generate-on-chain-noun)

Sample script for setting images

[https://github.com/yamapyblack/felixir-onchain/blob/main/scripts/tx/FLXExtension-seedAndMint.ts](https://github.com/yamapyblack/felixir-onchain/blob/main/scripts/tx/FLXExtension-seedAndMint.ts)

### Applying Whitelist

After deployment of Extension contract, it’s necessary to apply it to whitelists. Felixir NFT contract has whitelist of Extensions because of preventing hacking risks so can be junctioned only whitelisting contracts.

Application Form

[https://forms.gle/hPg8xkYexS2hgzXr7](https://forms.gle/hPg8xkYexS2hgzXr7)

### How to junction

https://felixirdaoxyz.notion.site/How-to-Junction-4e4cb6a0cb6b4fffb6a99e670545fd7f
