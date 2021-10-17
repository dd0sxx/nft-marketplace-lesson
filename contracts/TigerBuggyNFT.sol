// SPDX-License-Identifier: MIT

pragma solidity 0.8.2;
/*
   NFT Contract along the lines of CryptoPunks. For the original see:
   https://github.com/larvalabs/cryptopunks/blob/master/contracts/CryptoPunksMarket.sol
*/
contract TigerBuggyNFT {

    // how many unique tiger tokens exist
    uint public constant totalSupply = 1000;

    // percentage of sale price taken as royalty for the contract
    uint public constant contractRoyaltyPercentage = 1;
    
    // percentage of sale price taken as royalty for the artist
    uint public constant artistRoyaltyPercentage = 5;
    
    // address that deployed this contract
    address private deployer;

    // address of the artist, initial owner of all tiger tokens, recipient of artist's fees
    address private artist;
    
    // mapping from token ID to owner address
    mapping(uint256 => address) public tigerOwners;

    // tigers currently up for sale
    struct SaleOffer {
        bool isForSale;
        address seller;
        uint price;
        address onlySellTo; //isForSale true plus zero for onlySellTo address means sell to anyone 
    }
    mapping (uint => SaleOffer) public tigersForSale;

    // ether held by the contract on behalf of addresses that have interacted with it
    mapping (address => uint) public pendingWithdrawals;

    // create and initialize the contract
    constructor(address _artist) {
        deployer = msg.sender;
        _init_(artist);
    }

    // iniitalize the artist on contract deployment and make them the initial owner of all the tokens
    function _init_(address _artist) public {
        artist = _artist;
        for (uint i = 0; i < totalSupply; i++) {
            tigerOwners[i] = _artist;
        }
    }
    
    // allow anyone to see if a tiger is for sale and, if so, for how much
    function isForSale(uint tigerIndex) external view returns (bool, uint) {
        require(tigerIndex < totalSupply, "index out of range");
        // @todo does the use of this memory variable save gas or use more of it?
        SaleOffer memory saleOffer = tigersForSale[tigerIndex];
        if (saleOffer.isForSale
            && ((saleOffer.onlySellTo == address(0)) || saleOffer.onlySellTo == msg.sender)) {
            return(true, saleOffer.price);
        }
        return (false, 0);
    }

    // allow the current owner to put a tiger token up for sale
    function putUpForSale(uint tigerIndex, uint minSalePriceInWei) external {
        require(tigerIndex < totalSupply, "index out of range");
        require(tigerOwners[tigerIndex] == msg.sender, "not owner");
        tigersForSale[tigerIndex] = SaleOffer(true, msg.sender, minSalePriceInWei, address(0));
    }

    // allow the current owner to put a tiger token up for sale
    function putUpForSaleToAddress(uint tigerIndex, uint minSalePriceInWei, address buyer) external {
        require(tigerIndex < totalSupply, "index out of range");
        require(tigerOwners[tigerIndex] == msg.sender, "not owner");
        tigersForSale[tigerIndex] = SaleOffer(true, msg.sender, minSalePriceInWei, buyer);
    }

    // allow the current owner to withdraw a tiger token from sale
    function withdrawFromSale(uint tigerIndex) external {
        require(tigerIndex < totalSupply, "index out of range");
        require(tigerOwners[tigerIndex] == msg.sender, "not owner");
        tigersForSale[tigerIndex] = SaleOffer(false, address(0), 0, address(0));
    }

    // allow someone to buy a tiger offered for sale to them
    function buyTiger(uint tigerIndex) external payable {
        require(tigerIndex < totalSupply, "index out of range");
        SaleOffer memory saleOffer = tigersForSale[tigerIndex];
        require(saleOffer.isForSale && (saleOffer.onlySellTo == address(0) || saleOffer.onlySellTo == msg.sender),
                "not for sale");
        require(saleOffer.seller == tigerOwners[tigerIndex], "seller no longer owns");
        (uint contractRoyalty, uint artistRoyalty) = calculateRoyalties(msg.value);
        pendingWithdrawals[deployer] += contractRoyalty;
        pendingWithdrawals[artist] += artistRoyalty;
        pendingWithdrawals[saleOffer.seller] += msg.value;
        tigerOwners[tigerIndex] = msg.sender;
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
