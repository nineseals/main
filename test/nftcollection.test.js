const NFTCollection = artifacts.require("./NFTCollection.sol");

contract("NFTCollection", accounts => {
  it("...should store the value 'test'.", async () => {
    const nftCollectionInstance = await NFTCollection.deployed();

    // Set value of 89
    await nftCollectionInstance.setBaseURI('test');

    // Get stored value
    const storedData = await nftCollectionInstance.getBaseURI.call();

    assert.equal(storedData, "test", "The value 'test' was not stored.");
  });
});
