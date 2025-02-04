import { parseAbi } from "viem";

export const agentKeys = ["alice", "bob", "charlie", "david", "eve"];

export const PLANT_TYPES = ["wheat", "tomato", "rice"];

export const MINUTE = 60;
export const HOUR = 60 * MINUTE;
export const PLANT_GROWTH_TIME = HOUR;
export const RICE_GROWTH_TIME = 24 * HOUR;

export const CONTRACT_ABI = parseAbi([
  `error NotAuthorized()`,
  `error NoCampaignsAvailable()`,
  `error FarmPlotAlreadySet()`,
  `struct Campaign { string name; string description; uint256 amount; }`,
  `struct FarmPlot { uint256 time; uint8 plotType; }`,
  `function addCampaign(string memory name, string memory description, uint256 amount) external`,
  `function setFarmPlot(address user, uint256 index, uint8 plotType) external`,
  `function chargeNextCampaign(uint256 amount) external`,
  `function getNextCampaign() external view returns (Campaign memory)`,
  `function getFarmPlots(address user) external view returns (FarmPlot[] memory)`,
]);

export const ERC20_ABI = parseAbi([
  `function balanceOf(address account) external view returns (uint256)`,
  `function transfer(address recipient, uint256 amount) external returns (bool)`,
  `function allowance(address owner, address spender) external view returns (uint256)`,
  `function approve(address spender, uint256 amount) external returns (bool)`,
  `function transferFrom(address sender, address recipient, uint256 amount) external returns (bool)`,
]);
