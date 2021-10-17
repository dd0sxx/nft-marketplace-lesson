const { expect } = require("chai")

describe("TigerBuggyNFT contract", function () {

    let tiger
    let deployer
    let artist
    let alice
    let bob
    let addrs
    
    const logger = ethers.utils.Logger.globalLogger()
    
    beforeEach(async function () {
        ;[deployer, artist, alice, bob, ...addrs] = await ethers.getSigners()
        tigerFactory = await ethers.getContractFactory("TigerBuggyNFT")
        tiger = await tigerFactory.deploy(artist.address)
        await tiger.deployed()
    })

    it("artist should be initial owner", async function () {
        expect(await tiger.tigerOwners(0)).to.equal(artist.address)
        expect(await tiger.tigerOwners(999)).to.equal(artist.address)
    })

    it("initially nothing should be for sale", async function () {
        forSale = await tiger.isForSale(0)
        expect(forSale[0]).to.equal(false)
        expect(forSale[1]).to.equal(ethers.utils.parseEther("0"))
        forSale = await tiger.isForSale(999)
        expect(forSale[0]).to.equal(false)
        expect(forSale[1]).to.equal(ethers.utils.parseEther("0"))
    })

    it("only owner can put tiger up for sale", async function () {
        await expect(tiger.putUpForSale(13, ethers.utils.parseEther("1"))).to.be.revertedWith("not owner")
    })

    it("artist can put tiger up for sale", async function () {
        await tiger.connect(artist).putUpForSale(13, ethers.utils.parseEther("1"))
        forSale = await tiger.isForSale(13)
        expect(forSale[0]).to.equal(true)
        expect(forSale[1]).to.equal(ethers.utils.parseEther("1"))
    })

    it("artist can withdraw tiger from sale", async function () {
        await tiger.connect(artist).putUpForSale(13, ethers.utils.parseEther("1"))
        await tiger.connect(artist).withdrawFromSale(13)
        expect((await tiger.isForSale(13))[0]).to.equal(false)
    })

    it("someone can buy a tiger that is for sale", async function () {
        await tiger.connect(artist).putUpForSale(13, ethers.utils.parseEther("1"))
        await tiger.connect(bob).buyTiger(13, {value:ethers.utils.parseEther("1")})
        expect(await tiger.connect(alice).tigerOwners(13)).to.equal(bob.address)
    })

    it("tiger should show as no longer for sale after it's been bought", async function () {
        await tiger.connect(artist).putUpForSale(389, ethers.utils.parseEther("1"))
        await tiger.connect(bob).buyTiger(389, {value:ethers.utils.parseEther("1")})
        expect((await tiger.isForSale(389))[0]).to.equal(false)
        expect(await tiger.connect(alice).tigerOwners(389)).to.equal(bob.address)
    })

    it("can't buy a tiger that is not for sale", async function () {
        await expect(tiger.connect(bob).buyTiger(13, {value:ethers.utils.parseEther("1")})).to.be.revertedWith("not for sale")
    })

    it("someone can buy a tiger that is for sale just to them", async function () {
        await tiger.connect(artist).putUpForSaleToAddress(13, ethers.utils.parseEther("1"), bob.address)
        await tiger.connect(bob).buyTiger(13, {value:ethers.utils.parseEther("1")})
        expect((await tiger.isForSale(13))[0]).to.equal(false)
        expect(await tiger.connect(alice).tigerOwners(13)).to.equal(bob.address)
    })

    it("can't buy a tiger that is for sale only to someone else", async function () {
        await tiger.connect(artist).putUpForSaleToAddress(13, ethers.utils.parseEther("1"), alice.address)
        await expect(tiger.connect(bob).buyTiger(13, {value:ethers.utils.parseEther("1")})).to.be.revertedWith("not for sale")
    })

    it("sellers can withdraw funds", async function () {
        //artist sells to bob for 1 ether, who then sells to alice for 15 ether
        await tiger.connect(artist).putUpForSale(13, ethers.utils.parseEther("1"))
        await tiger.connect(bob).buyTiger(13, {value:ethers.utils.parseEther("1")})
        await tiger.connect(bob).putUpForSale(13, ethers.utils.parseEther("15"))
        await tiger.connect(alice).buyTiger(13, {value:ethers.utils.parseEther("15")})

        //artist withdraws their funds from the sale, should be 1.74 ether minus gas cost of withdrawal
        //calculated as 1 ether from initial sale minus 1% contract royalty, plus 0.75 ether from 5% artist
        //royalty on second sale
        let initialBalance = await ethers.provider.getBalance(artist.address)
        await tiger.connect(artist).withdrawFunds()
        let finalBalance = await ethers.provider.getBalance(artist.address)
        let difference = finalBalance.sub(initialBalance)
        expect(difference).to.be.closeTo(ethers.utils.parseEther("1.74"), ethers.utils.parseEther("0.04"))

        //bob withdraws his funds from the sale, should be 14.1 ether minus gas cost of withdrawal
        //calculated as 15 ether sale price minus 1% contract royalty and 5% artist royalty
        initialBalance = await ethers.provider.getBalance(bob.address)
        await tiger.connect(bob).withdrawFunds()
        finalBalance = await ethers.provider.getBalance(bob.address)
        difference = finalBalance.sub(initialBalance)
        expect(difference).to.be.closeTo(ethers.utils.parseEther("14.1"), ethers.utils.parseEther("0.04"))

        //contract deployer withdraws their funds from the sale
        //should be 0.16 ether minus gas cost of withdrawal
        //calculated as 1% contract royalty on 16 ether of total sales
        initialBalance = await ethers.provider.getBalance(deployer.address)
        await tiger.connect(deployer).withdrawFunds()
        finalBalance = await ethers.provider.getBalance(deployer.address)
        difference = finalBalance.sub(initialBalance)
        expect(difference).to.be.closeTo(ethers.utils.parseEther("0.16"), ethers.utils.parseEther("0.04"))
    })

})
