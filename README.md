# ⬡ ERC20 Token Terminal

A modern, interactive web application for managing ERC20 tokens on Lisk Sepolia testnet. This application provides a user-friendly interface to interact with smart contracts, claim tokens from a faucet, transfer tokens, mint new tokens, and check contract details.

---

## 🎯 What This Application Does

The ERC20 Token Terminal is a comprehensive web interface built with React and TypeScript that allows users to:

- **Connect their Web3 wallet** via AppKit
- **Request free tokens** from an automated faucet (with 24-hour cooldown)
- **Transfer tokens** to other wallet addresses
- **Mint new tokens** (if authorized as owner)
- **View token information** (name, symbol, decimals, total supply)
- **Check wallet balances** for any address
- **Manage token approvals** and allowances
- **Check role-based permissions** (MINTER_ROLE, DEFAULT_ADMIN_ROLE)

All interactions are performed on the **Lisk Sepolia testnet** and include real-time feedback through toast notifications and status updates.

---

## 🛠️ Technology Stack

### Frontend Framework
- **React** 19.2.4 - UI library
- **TypeScript** 5.9.3 - Type-safe JavaScript
- **Vite** 8.0.1 - Fast build tool and dev server

### Blockchain Integration
- **Ethers.js** 6.16.0 - Ethereum JavaScript library
- **AppKit** (@reown/appkit) 1.8.19 - Wallet connection framework
- **AppKit Adapter** (@reown/appkit-adapter-ethers) - Ethers integration

### Styling
- **Custom CSS** - Cyberpunk theme with glowing accents
- **Responsive Design** - Mobile, tablet, and desktop support

### Development Tools
- **ESLint** - Code quality checking
- **TypeScript Compiler** - Type checking

---

## 📋 Features Overview

### 🔐 Wallet Integration
- Connect multiple wallet types (MetaMask, WalletConnect, Coinbase Wallet, etc.)
- Automatic network switching to Lisk Sepolia
- Real-time wallet connection status
- Display connected wallet address

### 💰 Token Operations
- **Faucet**: Request free tokens with automatic 24-hour cooldown timer
- **Transfer**: Send tokens to any Ethereum address
- **Mint**: Create new tokens (owner-only feature)
- **Approve**: Grant permission for other contracts to spend your tokens
- **Check Allowance**: View spending permissions

### 📊 Information Dashboard
- Real-time token balance display
- Total supply and max supply information
- Faucet amount per claim
- Token metadata (name, symbol, decimals)
- Contract owner address
- Custom balance lookup for any address
- Role verification system

### 🎨 User Experience
- Dark cyberpunk theme with neon accents
- Toast notifications for transaction feedback
- Countdown timer showing cooldown status
- Loading indicators during transactions
- Responsive layout for all devices
- Professional typography and spacing
- Real-time data updates

---

## 🚀 Installation & Setup

### Prerequisites
- **Node.js** v16.0.0 or higher
- **npm** v8.0.0 or higher
- A **Web3 wallet** (MetaMask, Coinbase Wallet, etc.)
- **Testnet funds** for gas fees ([Lisk Sepolia Faucet](https://sepolia-faucet.lisk.com))

## 📖 How to Use

### 1. Connect Your Wallet

1. Click the **"Connect Wallet"** button in the top-right corner
2. Select your preferred wallet from the modal
3. Approve the connection in your wallet popup
4. Your wallet address will appear in the header

### 2. Claim Tokens from Faucet

1. Navigate to the **Faucet** panel
2. Click **"Request Tokens"** button
3. Approve the transaction in your wallet
4. Wait for confirmation (30 seconds to 2 minutes)
5. Your balance will update automatically

**Note**: You can only claim once every 24 hours. A countdown timer shows your remaining wait time.

### 3. Transfer Tokens to Others

1. Go to the **Transfer** panel
2. Enter the recipient's wallet address
3. Enter the amount of tokens to send
4. Click **"Send Tokens"**
5. Approve in your wallet and wait for confirmation

### 4. Mint New Tokens (Owner Only)

1. Go to the **Mint** panel
2. If you're the contract owner, you'll see input fields
3. Enter the recipient address and amount
4. Click **"Mint Tokens"**
5. Approve and wait for confirmation

**Note**: This feature is locked if you're not the contract owner.

### 5. View Token Information

In the **Contract Info & Read** panel:

- **Token Details**: See name, symbol, decimals, and owner
- **Check Balance**: Enter any address to see its balance
- **Check Role**: Verify if an address has specific roles

### 6. Manage Approvals

In the **Approve & Allowance** panel:

- **Approve Spender**: Grant a contract permission to spend your tokens
- **Check Allowance**: See how much a spender is allowed to use

---

## 📁 Project Structure

```
erc20-ui/
├── .env                           # Environment variables (root level)
├── index.html                     # HTML entry point
├── package.json                   # Project dependencies and scripts
├── tsconfig.json                  # TypeScript configuration
├── vite.config.ts                 # Vite build configuration
│
├── src/
│   ├── main.tsx                   # React app entry point
│   ├── App.tsx                    # Main application component
│   ├── App.css                    # Cyberpunk theme styles
│   ├── index.css                  # Global styles
│   │
│   ├── connection.ts              # AppKit wallet setup
│   ├── utils.ts                   # Helper functions
│   │
│   ├── components/                # React components
│   │   ├── ApprovePanel.tsx       # Token approval management
│   │   ├── ApprovalPanel.tsx      # Check and display approvals
│   │   ├── Countdown.tsx          # Faucet cooldown timer
│   │   ├── FaucetPanel.tsx        # Request tokens interface
│   │   ├── MintPanel.tsx          # Mint tokens interface
│   │   ├── ReadPanel.tsx          # View token information
│   │   ├── StatsRow.tsx           # Display statistics
│   │   ├── Toast.tsx              # Notification system
│   │   └── TransferPanel.tsx      # Token transfer interface
│   │
│   ├── hooks/                     # Custom React hooks
│   │   ├── useContract.ts         # Contract instance creation
│   │   ├── useRunner.ts           # Provider and signer setup
│   │   │
│   │   └── specific/              # Contract-specific hooks
│   │       ├── useReadERC.ts      # Read-only contract functions
│   │       └── useWriteERC.ts     # State-changing functions
│   │
│   ├── ABI/
│   │   └── Erc20.ts               # ERC20 contract ABI
│   │
│   ├── constants/
│   │   └── provider.ts            # Provider configuration
│   │
│   └── assets/                    # Images and static files
│       ├── vite.svg
│       ├── react.svg
│       └── hero.png
│
├── public/                        # Static assets
│   ├── favicon.svg
│   └── icons.svg
│
└── node_modules/                  # Dependencies (installed via npm)
```

---

## 🎨 Design & Styling

### Color Theme (Cyberpunk)
- **Background**: Very dark blue (#020408)
- **Card Background**: Dark blue (#0d1d2e)
- **Primary Accent**: Cyan (#00d4ff)
- **Secondary Accent**: Blue (#0088ff)
- **Success**: Green (#00ff88)
- **Alert**: Orange (#ff6600)
- **Error**: Red (#ff2244)

### Typography
- **Display**: Orbitron (bold, futuristic)
- **Code/Monospace**: Share Tech Mono
- **Body**: Rajdhani (clean, readable)

### Responsive Breakpoints
- **Desktop** (1100px+): 4-column layout
- **Tablet** (700px-1100px): 2-column layout
- **Mobile** (<700px): 1-column stacked layout

---

## 🔌 Component Details

### Core Components

#### `App.tsx` - Main Application
The central component that:
- Manages wallet connection state
- Fetches contract data (balance, supply, owner)
- Handles all token operations
- Manages UI state for all panels
- Provides error handling and user feedback

#### `useContract.ts` - Contract Initialization
Creates ethers.js Contract instances for:
- Read-only operations (no gas required)
- Write operations (requires wallet signature)

#### `useReadERC.ts` - Read Functions
Implements read-only contract calls:
- `balanceOf()` - Get account balance
- `totalSupply()` - Get total supply
- `maxSupply()` - Get supply cap
- `name()`, `symbol()`, `decimals()` - Token metadata
- `allowance()` - Check spending permission
- `hasRole()` - Check account role

#### `useWriteERC.ts` - Write Functions
Handles state-changing transactions:
- `requestTokens()` - Claim from faucet
- `transfer()` - Send tokens
- `approve()` - Grant spending permission
- `mint()` - Create new tokens

### UI Panels

#### Faucet Panel
- Request free tokens with one click
- Shows amount per claim
- 24-hour cooldown timer
- Status messages

#### Transfer Panel
- Input fields for recipient and amount
- Real-time validation
- Transaction status feedback

#### Mint Panel
- Owner-only access (auto-locked for non-owners)
- Input fields for recipient and amount
- Clear ownership indication

#### Contract Info Panel
- Display token metadata
- Check any wallet's balance
- Look up address roles

#### Approve Panel
- Set spending allowances
- Check current allowances
- Revoke permissions

---

## 💻 Available Commands

### Development
```bash
# Start dev server
npm run dev

# Run linter to check code quality
npm run lint
```

### Production
```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 🔐 Smart Contract Integration

### Contract Details
- **Address**: `0xB645Dd4C7b7D09Ee42e45113a68fd9daF8013131`
- **Network**: Lisk Sepolia (Chain ID: 4202)
- **Standard**: ERC20
- **ABI**: Defined in `src/ABI/Erc20.ts`

### Read Functions (No Gas Fee)
```solidity
balanceOf(address account) → uint256
totalSupply() → uint256
maxSupply() → uint256
faucetAmount() → uint256
name() → string
symbol() → string
decimals() → uint8
owner() → address
lastClaimed(address) → uint256
allowance(address owner, address spender) → uint256
hasRole(bytes32 role, address account) → bool
```

### Write Functions (Requires Gas Fee)
```solidity
requestTokens() → bool
transfer(address to, uint256 amount) → bool
approve(address spender, uint256 amount) → bool
mint(address to, uint256 amount) → bool
```

---

## 🚨 Troubleshooting

### Issue: Blank Page / Nothing Displays
**Solution:**
1. Hard refresh browser: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)
2. Check browser console (`F12`) for errors
3. Verify `.env` file is in root directory
4. Restart dev server: `npm run dev`

### Issue: Cannot Connect Wallet
**Solution:**
1. Ensure you have a Web3 wallet installed
2. Try a different wallet (MetaMask, Coinbase Wallet, etc.)
3. Check that AppKit is properly initialized
4. Check browser console for error messages

### Issue: Transaction Keeps Failing
**Solution:**
1. Verify you have enough testnet ETH for gas fees
2. Confirm you're on Lisk Sepolia network
3. Check gas prices (try again during lower congestion)
4. Ensure you have sufficient token balance for the operation

### Issue: Can't Claim from Faucet
**Solution:**
1. Check the countdown timer - you must wait 24 hours between claims
2. Make sure you're using the same wallet address
3. Verify you have enough ETH for gas fees
4. Check that the contract hasn't reached its supply limit

### Issue: Mint Button is Locked
**Solution:**
1. Only the contract owner can mint tokens
2. You're not the owner of this contract
3. If you should have minting rights, check your wallet address is correct

### Issue: npm install Fails
**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and lock file
rm -rf node_modules package-lock.json

# Reinstall
npm install
```


## 🔒 Security Considerations

### Best Practices
- **Never share your private keys** - This app uses wallet signing, not key storage
- **Verify contract addresses** - Always confirm the contract address before transactions
- **Test with testnet first** - Use Lisk Sepolia before mainnet
- **Approve cautiously** - Only approve known contracts
- **Check amounts** - Verify amounts before confirming transactions

### Smart Contract Safety
- Token operations use standard ERC20 interface
- All transactions require wallet signature (no automatic approvals)
- Contract address is configurable via environment variables
- Built-in role-based access control

---

## 🤝 Contributing & Modifications

### To Modify the Contract Address
1. Update `VITE_ERC20_CONTRACT_ADDRESS` in `.env`
2. Update the ABI in `src/ABI/Erc20.ts` if functions differ
3. Restart the dev server

### To Customize Styling
- Edit `src/App.css` for component styles
- Edit `src/index.css` for global styles
- Update color variables in the CSS

### To Add Features
1. Create new components in `src/components/`
2. Create hooks in `src/hooks/` as needed
3. Import and use in `App.tsx`
4. Style with CSS classes

---

## 📚 Learning Resources

### Blockchain Development
- [Ethers.js Documentation](https://docs.ethers.org)
- [ERC20 Token Standard](https://eips.ethereum.org/EIPS/eip-20)
- [Lisk Documentation](https://docs.lisk.com)

### Web Development
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Vite Guide](https://vitejs.dev)

### Wallet Integration
- [AppKit Documentation](https://docs.reown.com/appkit)
- [Web3 Best Practices](https://ethereum.org/en/developers)

---

## 📝 Development Notes

### State Management
- React hooks (useState, useEffect, useCallback)
- Contract instances managed via `useMemo`
- Provider and signer state in `useRunner` hook

### Data Flow
1. User connects wallet via AppKit
2. App fetches contract data through read-only provider
3. User triggers transaction (requires wallet signature)
4. Transaction sent via signer
5. App listens for confirmation and updates state
6. Toast notification displays result

### Error Handling
- Try-catch blocks in contract calls
- User-friendly error messages in toasts
- Console logging for debugging
- Network error detection

---
