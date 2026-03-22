export const erc20TokenAbi = [

  "constructor(address _owner)",

  "error AccessControlBadConfirmation()",
  "error AccessControlUnauthorizedAccount(address account, bytes32 neededRole)",
  "error AlreadyClaimed(uint256 timeRemaining)",
  "error ERC20InsufficientAllowance(address spender, uint256 allowance, uint256 needed)",
  "error ERC20InsufficientBalance(address sender, uint256 balance, uint256 needed)",
  "error ERC20InvalidApprover(address approver)",
  "error ERC20InvalidReceiver(address receiver)",
  "error ERC20InvalidSender(address sender)",
  "error ERC20InvalidSpender(address spender)",
  "error InvalidAddress()",
  "error InvalidAmount()",
  "error MaxSupplyExceeded()",


  "event Approval(address indexed owner, address indexed spender, uint256 value)",
  "event RoleAdminChanged(bytes32 indexed role, bytes32 indexed previousAdminRole, bytes32 indexed newAdminRole)",
  "event RoleGranted(bytes32 indexed role, address indexed account, address indexed sender)",
  "event RoleRevoked(bytes32 indexed role, address indexed account, address indexed sender)",
  "event Transfer(address indexed from, address indexed to, uint256 value)",

  
  "function DEFAULT_ADMIN_ROLE() view returns (bytes32)",
  "function MINTER_ROLE() view returns (bytes32)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function balanceOf(address account) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function faucetAmount() view returns (uint256)",
  "function getRoleAdmin(bytes32 role) view returns (bytes32)",
  "function hasRole(bytes32 role, address account) view returns (bool)",
  "function lastClaimed(address) view returns (uint256)",
  "function maxsupply() view returns (uint256)",
  "function name() view returns (string)",
  "function owner() view returns (address)",
  "function remainingTime() view returns (uint256)",
  "function supportsInterface(bytes4 interfaceId) view returns (bool)",
  "function symbol() view returns (string)",
  "function totalSupply() view returns (uint256)",

 
  "function approve(address spender, uint256 value) returns (bool)",
  "function grantRole(bytes32 role, address account)",
  "function mint(address _to, uint256 _amount)",
  "function renounceRole(bytes32 role, address callerConfirmation)",
  "function requestToken()",
  "function revokeRole(bytes32 role, address account)",
  "function transfer(address to, uint256 value) returns (bool)",
  "function transferFrom(address from, address to, uint256 value) returns (bool)"
] as const;