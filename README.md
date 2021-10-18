# NFT Contracts for week long Project

### Introduction
This project will give engineers a stronger working knowledge of web3. It involves developing a smart contract in Solidity and deploying it to a test network. We will be working with an NFT contract along the lines of CryptoPunks (see https://github.com/larvalabs/cryptopunks/blob/master/contracts/CryptoPunksMarket.sol).

### Prerequisites
This project is designed for experienced software engineers who are in the early stages of learning web3. You wil lbe writing code in Solidity, but to get the most out of it you should already be very comfortable writing applications and tests in at least one other language. You should also have some prior knowledge of Solidity. Completion of the first CryptoZombies Solidity Path (https://cryptozombies.io/solidity) would be ideal. All the coding for the project is in Solidity, but the contract deployment and tests make use of JavaScript and NPM. Previous experience of these, or at least the ability to Google your way out of trouble, will help a lot. Finally, there is a front end DApp that provides a web UI based on JavaScript and React. You don't need to work on this to complete the project. However you may be interested to examine it, and your possible next steps on completion of the project include modifying or extending it.

### Tasks

1. Take a look at the provided file TigerBasicNFT.sol, which contains most of the implementaiton of a smart contract for trading in an imaginary Tiger NFT token. The contract keeps track of who owns each token. It also tracks which Tiger tokens are currently for sale and allows participants to buy them with suitable offers. All payments are in Ether. The first task is to extend this contract to provide some missing functionality:
    - The contract holds all Ether paid for Tiger tokens and records the addresses for which the funds are held in the mapping pendingWithdrawals. pendignWithdrawals maps addresses to the amount og Ether held for each address. However as it stands there is no way for the owner of an address to transfer their Ether out of the Tiger NFT contract.
        - Add a withdrawFunds function which allows users to claim the Ether held on their behalf and move it from the contract's address to their own address.
    - We would like the artist to receive a royalty payment of 5% on each resale of the tokens.
        - Extend the contract to automatically deduct a 5% artist's fee from all token sales and make this available to the artist via the withdrawFunds function.
    - The contract should also take a 1% fee for itself.
        - Extend the contract to automatically deduct a 1% service fee from all token sales and make this available for transfer to the adddress from which the contract was deployed, again do this via the withdrawFunds function.
        
2. Take a look 







This project should kick off with a 45 minute live kickoff with a walkthrough of the end product, and a setup of the project, followed by 6 days of Async work, with a closing call exactly 1 week later.

Goals for the students are as follows

- Build on top of an existing contract the following functionality
  - Send a 5% Royalty to the creator of the NFT on all transactions of this NFT, forever
  - Keep a 1% transaction fee for the smart contract on each transaction forever
  - Allow the creator of the smart contract to withdraw the collected transaction fees
 - Find all the bugs in a contract that already implements all of the above
 
### Contracts

1. _TigerBasicNFT.sol_ 

  A basic NFT contract along the lines of CryptoPunks (see https://github.com/larvalabs/cryptopunks/blob/master/contracts/CryptoPunksMarket.sol ) that is a starting point for the students to modify.

2. _TigerNFT.sol_ 
  
  A complete NFT contract which is contract 1 above, but extended to charge royalties on sales, 5% to the artist and 1% to the contract owner, and also to allow participants to withdraw their funds.

3. _TigerBuggyNFT.sol_

  A version of the complete contract with bugs and vulnerabilities for the students to find.
 
