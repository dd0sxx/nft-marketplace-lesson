// SPDX-License-Identifier: MIT

pragma solidity 0.8.2;

import "hardhat/console.sol";

/*
   NFT Contract along the lines of CryptoPunks. For the original see:
   https://github.com/larvalabs/cryptopunks/blob/master/contracts/CryptoPunksMarket.sol
*/
contract TigerBuggyNFT {

    // how many unique tiger tokens exist
    uint public constant totalSupply = 100;

    // percentage of sale price taken as royalty for the contract
    uint public constant contractRoyaltyPercentage = 1;
    
    // percentage of sale price taken as royalty for the artist
    uint public constant artistRoyaltyPercentage = 5;
    
    // address that deployed this contract
    address private deployer;

    // address of the artist, initial owner of all tiger tokens, recipient of artist's fees
    address private artist;
    
    // initial sale price for all tokens
    uint private startingPrice;
    
    // mapping from token ID to owner address
    mapping(uint256 => address) private tigerOwners;

    // tigers currently up for sale
    struct SaleOffer {
        bool isForSale;
        address seller;
        uint price;
    }
    mapping (uint => SaleOffer) public tigersForSale;

    // ether held by the contract on behalf of addresses that have interacted with it
    mapping (address => uint) public pendingWithdrawals;

    event TigerForSale(address indexed seller, uint indexed tigerId, uint price);
    event TigerSold(address indexed seller, address indexed buyer, uint indexed tigerId, uint price);
    event TigerWithdrawnFromSale(address indexed seller, uint indexed tigerId);
    
    // create the contract, artist is set here and never changes subsequently
    constructor(address _artist, uint _startingPrice) {
        require(_artist != address(0));
        _init_(artist, msg.sender, _startingPrice);
    }

    // initialize the contract state
    function _init_(address _artist, address _deployer, uint _startingPrice) public {
        artist = _artist;
        deployer = _deployer;
        startingPrice = _startingPrice;
    }        
    
    // allow anyone to see if a tiger is for sale and, if so, for how much
    function isForSale(uint tigerIndex) external view returns (bool, uint) {
        require(tigerIndex < totalSupply, "index out of range");
        SaleOffer memory saleOffer = getSaleInfo(tigerIndex);
        if (saleOffer.isForSale) {
            return(true, saleOffer.price);
        }
        return (false, 0);
    }

    // tokens which have never been sold are for sale at the starting price,
    // all others are not unless the owner puts them up for sale
    function getSaleInfo(uint tigerIndex) private view returns (SaleOffer memory saleOffer) {
        if (tigerOwners[tigerIndex] == address(0)) {
            saleOffer = SaleOffer(true, artist, startingPrice);
        } else {
            saleOffer = tigersForSale[tigerIndex];
        }
    }

    // get the current owner of a token, unsold tokens belong to the artist
    function getOwner(uint tigerIndex) public view returns (address) {
        require(tigerIndex < totalSupply, "index out of range");
        address owner = tigerOwners[tigerIndex];
        if (owner == address(0)) {
            owner = artist;
        }
        return owner;
    }

    // allow the current owner to put a tiger token up for sale
    function putUpForSale(uint tigerIndex, uint minSalePriceInWei) external {
        require(tigerIndex < totalSupply, "index out of range");
        require(getOwner(tigerIndex) == msg.sender, "not owner");
        tigersForSale[tigerIndex] = SaleOffer(true, msg.sender, minSalePriceInWei);
        emit TigerForSale(msg.sender, tigerIndex, minSalePriceInWei);
    }

    // allow the current owner to withdraw a tiger token from sale
    function withdrawFromSale(uint tigerIndex) external {
        require(tigerIndex < totalSupply, "index out of range");
        require(getOwner(tigerIndex) == msg.sender, "not owner");
        tigersForSale[tigerIndex] = SaleOffer(false, address(0), 0);
        emit TigerWithdrawnFromSale(msg.sender, tigerIndex);
    }

    // allow someone to buy a tiger offered for sale to them
    function buyTiger(uint tigerIndex) external payable {
        require(tigerIndex < totalSupply, "index out of range");
        SaleOffer memory saleOffer = getSaleInfo(tigerIndex);
        require(saleOffer.isForSale,"not for sale");
        (uint contractRoyalty, uint artistRoyalty) = calculateRoyalties(msg.value);
        pendingWithdrawals[deployer] += contractRoyalty;
        pendingWithdrawals[artist] += artistRoyalty;
        pendingWithdrawals[saleOffer.seller] += msg.value;
        tigerOwners[tigerIndex] = msg.sender;
        emit TigerSold(saleOffer.seller, msg.sender, tigerIndex, saleOffer.price);
    }

    // calculate the contract and artist royalties due on the sale amount
    function calculateRoyalties(uint amount) private pure returns (uint contractRoyalty, uint artistRoyalty) {
        contractRoyalty = (contractRoyaltyPercentage / 100) * amount;
        artistRoyalty = (artistRoyaltyPercentage / 100) * amount;
    }

    // allow participant to withdraw accumulated funds
    function withdrawFunds() external {
        payable(msg.sender).call{value: pendingWithdrawals[msg.sender]}("");
        pendingWithdrawals[msg.sender] = 0;
    }

    
}
