import { HardhatRuntimeEnvironment } from "hardhat/types";

export default async function deploy(hardhat: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hardhat;

  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  await deploy("DelegatableFacet", {
    contract: "DelegatableFacet",
    from: deployer,
    args: [],
    skipIfAlreadyDeployed: true,
    log: true,
  });

  await deploy("AllowedMethodsEnforcer", {
    contract: "AllowedMethodsEnforcer",
    from: deployer,
    args: [],
    skipIfAlreadyDeployed: true,
    log: true,
  });

  await deploy("BlockNumberEnforcer", {
    contract: "BlockNumberEnforcer",
    from: deployer,
    args: [],
    skipIfAlreadyDeployed: true,
    log: true,
  });

  await deploy("ERC20AllowanceEnforcer", {
    contract: "ERC20AllowanceEnforcer",
    from: deployer,
    args: [],
    skipIfAlreadyDeployed: true,
    log: true,
  });

  await deploy("LimitedCallsEnforcer", {
    contract: "LimitedCallsEnforcer",
    from: deployer,
    args: [],
    skipIfAlreadyDeployed: true,
    log: true,
  });

  await deploy("TimestampEnforcer", {
    contract: "TimestampEnforcer",
    from: deployer,
    args: [],
    skipIfAlreadyDeployed: true,
    log: true,
  });
}
