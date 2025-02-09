import { parseAbi } from "viem";

export const agentKeys = ["alice", "bob", "charlie", "david", "eve"];

export const PLANT_TYPES = ["wheat", "tomato", "rice"];

export const MINUTE = 60;
export const HOUR = 60 * MINUTE;
export const PLANT_GROWTH_TIME = HOUR;
export const RICE_GROWTH_TIME = 24 * HOUR;

export const MINUTE_MS = MINUTE * 1000;

export const CONTRACT_ABI = parseAbi([
  `error NotAuthorized()`,
  `error NoCampaignsAvailable()`,
  `error FarmPlotAlreadySet()`,
  `error FarmPlotNotReady()`,
  `error NotEnoughRiceSeeds()`,
  `struct Campaign { string name; string description; uint256 amount; }`,
  `struct FarmPlot { uint256 time; uint8 plantType; }`,
  `function setScriptHash(string memory _scriptHash) external`,
  `function getScriptHash() external view returns (string memory)`,
  `function addCampaign(string memory name, string memory description, uint256 amount) external`,
  `function plantAtFarmPlot(address user, uint8 index, uint8 plantType) external`,
  `function grantRiceSeed(address user, uint256 riceCost) external`,
  `function harvestFarmPlot(address user, uint8 index) external`,
  `function reducePlantSupply(address user, uint8 plantType, uint8 amount) external`,
  `function getPlantSupply(address user) external view returns (uint8[3] memory)`,
  `function getNextCampaign() external view returns (Campaign memory)`,
  `function getFarmPlots(address user) external view returns (FarmPlot[] memory)`,
  `function getRiceSeedCount(address user) external view returns (uint256)`,
]);

export const ERC20_ABI = parseAbi([
  `function balanceOf(address account) external view returns (uint256)`,
  `function transfer(address recipient, uint256 amount) external returns (bool)`,
  `function allowance(address owner, address spender) external view returns (uint256)`,
  `function approve(address spender, uint256 amount) external returns (bool)`,
  `function transferFrom(address sender, address recipient, uint256 amount) external returns (bool)`,
]);

// Amount rice seeds cost to campaign in USDC
export const ONE_USDC = 1_000_000;
// One cent per seed
export const CAMPAIGN_UNIT_COST = 10_000;

// World Food Programme (WFP) ShareTheMeal
// $0.80 feeds a child for a day.
// $1 provides 125 grams of rice, or approximately 6,200 grains of rice.
export const GRAINS_PER_USDC = 6_200;
export const RICE_GRAINS_PER_SEED =
  (CAMPAIGN_UNIT_COST / ONE_USDC) * GRAINS_PER_USDC;
