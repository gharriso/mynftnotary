import { expect } from "chai";
import { ethers } from "hardhat";

describe("MyNftNotary", function () {
  it("Test contract", async function () {
    const ContractFactory = await ethers.getContractFactory("MyNftNotary");

    const instance = await ContractFactory.deploy();
    await instance.deployed();

    expect(await instance.name()).to.equal("myNftNotary");
  });
});
