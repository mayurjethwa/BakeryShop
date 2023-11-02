var Adoption = artifacts.require("Adoption");
var Installment = artifacts.require("Installment");

module.exports = function(deployer) {
  deployer.deploy(Adoption);
  deployer.deploy(Installment);
};