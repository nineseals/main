var NineSeals = artifacts.require("./NineSeals.sol");

module.exports = function(deployer) {
  deployer.deploy(NineSeals,"NineSeals","NINESEALS");
};
