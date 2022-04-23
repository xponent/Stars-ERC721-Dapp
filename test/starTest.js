const {ethers} = require("ethers");
const assert = require("assert");
const {parseEther} = require("ethers/lib/utils");
const StarNotary = artifacts.require("StarNotary");


contract("StarNotary", async accounts => {
    it('should show that the token name and symbol are added.', async function () {
        let instance = await StarNotary.deployed();
        let name = await  instance.name();
        let symbol = await instance.symbol();
        assert.equal(`${name} ${symbol}`, "Star S")
    });
    it('should create a star and the name should match assertion.', async() => {
        let instance = await StarNotary.deployed();
        await instance.createStar("Test Star", {from: accounts[0]});
        let star = await instance.lookUptokenIdToStarInfo.call(1);
        assert.equal(star, "Test Star");
    });
    it('should put a star up for sale.', async function () {
        let instance = await StarNotary.deployed();
        await instance.createStar("Test Star", {from: accounts[0]});
        await instance.setStarForSale(1, 5);
        assert.equal(await instance.starsForSale(1), 5);
    });
    it('should transfer funds after a sale/transaction between users.', async function () {
        let instance = await StarNotary.deployed();
        await instance.createStar("Test Star", {from: accounts[0]});
        let starPrice = parseEther("5.0");
        let sentValue = parseEther("8.0")
        await instance.setStarForSale(1, starPrice);
        let provider = new ethers.providers.JsonRpcProvider();
        let balanceBefore = await provider.getBalance(accounts[0]);
        await instance.buyStar(1, {from: accounts[1], value: sentValue});
        let balanceAfter = await provider.getBalance(accounts[0]);
        assert.equal(Number(balanceAfter), Number(balanceBefore) + Number(starPrice));
    });
});
contract("Star Notary", async accounts => {
    it('should let accounts[1] buy star.', async function () {
        let instance = await StarNotary.deployed();
        await instance.createStar("Test Star", {from: accounts[0]});
        await instance.setStarForSale(1, 5, {from: accounts[0]});
        await instance.buyStar(1, {from: accounts[1], value: 5});
        assert.equal(accounts[1], await instance.ownerOf(1));
    });
    it('should decrease the balance of accounts[3] after star purchase.', async function () {
        let instance = await StarNotary.deployed();
        let starPrice = parseEther("5.0");
        let sentValue = parseEther("8.0")
        await instance.setStarForSale(1, starPrice, {from: accounts[1]});
        let provider = new ethers.providers.JsonRpcProvider();
        let balanceBefore = await provider.getBalance(accounts[3]);
        await instance.buyStar(1, {from: accounts[3], value: sentValue});
        let balanceAfter = await provider.getBalance(accounts[3]);
        expect(Number(balanceBefore) > (Number(balanceAfter))).to.equal(true);
    });
});
contract("Star Notary", async accounts => {
    it('should successfully exchange stars between users.', async function () {
        let instance = await StarNotary.deployed();
        let star1 = await instance.createStar("Test Star 1", {from: accounts[0]});
        let star2 = await instance.createStar("Test Star 2", {from: accounts[1]});
        await instance.exchangeStars(1, 2);
        expect(await instance.ownerOf(1)).to.equal(accounts[1]);
    });
});