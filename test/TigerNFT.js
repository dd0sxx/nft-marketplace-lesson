const { expect } = require("chai")

describe("TigerNFT contract", function () {

    let tiger
    let owner
    let artist
    let alice
    let bob
    let addrs
    
    const logger = ethers.utils.Logger.globalLogger()
    
    beforeEach(async function () {
        ;[owner, artist, alice, bob, ...addrs] = await ethers.getSigners()
        tigerFactory = await ethers.getContractFactory("TigerNFT")
        tiger = await tigerFactory.deploy(artist.address)
        await tiger.deployed()
    })

    it("artist should be initial owner", async function () {
        expect(await tiger.getOwner(0)).to.equal(artist.address)
        expect(await tiger.getOwner(999)).to.equal(artist.address)
    })

    it("iniitally nothing should be for sale", async function () {
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
        expect((await tiger.isForSale(13))[0]).to.equal(false)
        expect(await tiger.connect(alice).getOwner(13)).to.equal(bob.address)
    })

    it("can't buy a tiger that is not for sale", async function () {
        await expect(tiger.connect(bob).buyTiger(13, {value:ethers.utils.parseEther("1")})).to.be.revertedWith("not for sale")
    })

    it("someone can buy a tiger that is for sale just to them", async function () {
        await tiger.connect(artist).putUpForSaleToAddress(13, ethers.utils.parseEther("1"), bob.address)
        await tiger.connect(bob).buyTiger(13, {value:ethers.utils.parseEther("1")})
        expect((await tiger.isForSale(13))[0]).to.equal(false)
        expect(await tiger.connect(alice).getOwner(13)).to.equal(bob.address)
    })

    it("can't buy a tiger that is for sale only to someone else", async function () {
        await tiger.connect(artist).putUpForSaleToAddress(13, ethers.utils.parseEther("1"), alice.address)
        await expect(tiger.connect(bob).buyTiger(13, {value:ethers.utils.parseEther("1")})).to.be.revertedWith("not for sale")
    })

    it("sellers can withdraw funds", async function () {
        await tiger.connect(artist).putUpForSale(13, ethers.utils.parseEther("1"))
        await tiger.connect(bob).buyTiger(13, {value:ethers.utils.parseEther("1")})
        await tiger.connect(bob).putUpForSale(13, ethers.utils.parseEther("15"))
        await tiger.connect(alice).buyTiger(13, {value:ethers.utils.parseEther("15")})
        let initialBalance = await ethers.provider.getBalance(artist.address)
        await tiger.connect(artist).withdrawFunds()
        let finalBalance = await ethers.provider.getBalance(artist.address)
        let difference = finalBalance.sub(initialBalance)
        expect(difference).to.be.closeTo(ethers.utils.parseEther("1"), ethers.utils.parseEther("0.04"))
        await tiger.connect(artist).withdrawFunds()
        initialBalance = await ethers.provider.getBalance(bob.address)
        await tiger.connect(bob).withdrawFunds()
        finalBalance = await ethers.provider.getBalance(bob.address)
        difference = finalBalance.sub(initialBalance)
        expect(difference).to.be.closeTo(ethers.utils.parseEther("15"), ethers.utils.parseEther("0.04"))
    })

})
