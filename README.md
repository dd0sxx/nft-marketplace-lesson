# week-long-nft-project

## NFT Contracts for week long Project

### Context
This is a project that experienced engineers will opt-into doing after getting initial exposure and experience to Web3. They will be engineers who have now seen what all this hype is about, and want to write some Solidity / understand the technical architecture differences between Web2 and Web3.

This project should kick off with a 45 minute live kickoff with a walkthrough of the end product, and a setup of the project, followed by 6 days of Async work, with a closing call exactly 1 week later.

Goals for the students are as follows

- Build on top of an existing contract the following functionality
  - Send a 5% Royalty to the creator of the NFT on all transactions of this NFT, forever
  - Keep a 1% transaction fee for the smart contract on each transaction forever
  - Allow the creator of the smart contract to withdraw the collected transaction fees
 - Find all the bugs in a contract that already implements all of the above
 
### Contracts

1. A basic NFT contract along the lines of CryptoZombies (see https://github.com/larvalabs/cryptopunks/blob/master/contracts/CryptoPunksMarket.sol ) that is a starting point for the students to modify.

2. A complete NFT contract which is contract 1 above, but extended to charge royalties on sales, 5% to the artist and 1% to the contract owner

3. A version of the complete contract with bugs for the students to find.
 
