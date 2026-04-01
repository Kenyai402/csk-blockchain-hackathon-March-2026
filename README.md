# 🗳️ Decentralised Voting System

A secure, transparent, and tamper-proof voting 
system built on the Ethereum blockchain using 
Solidity, Ethers.js, and vanilla JavaScript.

---

## 📌 Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Smart Contract Architecture](#smart-contract-architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [How to Use](#how-to-use)
- [Security Considerations](#security-considerations)
- [Future Improvements](#future-improvements)
- [Author](#author)

---

## 🌍 Overview

Traditional voting systems suffer from several 
critical problems:
- Lack of transparency
- Susceptibility to fraud and manipulation
- Centralised control
- Limited accessibility

This project addresses these challenges by 
leveraging blockchain technology to create a 
voting system where:

- Every vote is **permanently recorded** on-chain
- Results are **publicly verifiable** by anyone
- **No single entity** can manipulate the outcome
- All rules are **enforced by smart contracts** 
  — not by humans

---

## ✨ Features

### 👑 Admin (Owner) Capabilities
- Add candidates before voting begins
- Register eligible voters by wallet address
- Open and close the voting period
- View real-time candidate and voter counts

### 🗳️ Voter Capabilities
- Connect MetaMask wallet securely
- View all registered candidates
- Cast exactly ONE vote per address
- View results after voting closes

### 👁️ Public Transparency
- Anyone can view final results
- All transactions are traceable on Etherscan
- Smart contract is open source and verifiable

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Smart Contract | Solidity ^0.8.0 |
| Blockchain | Ethereum (Sepolia Testnet) |
| Frontend | HTML, CSS, Vanilla JavaScript |
| Blockchain Interaction | Ethers.js v5.7.2 |
| Wallet | MetaMask |
| Development Environment | Remix IDE |
| Code Editor | VS Code |
| Version Control | Git & GitHub |

---

## 📐 Smart Contract Architecture

### Data Structures
```solidity
struct Candidate {
    string name;        // Candidate's name
    bool isQualified;   // Always true when added
    uint id;            // Auto-generated unique ID
    uint voteCount;     // Total votes received
}

struct Voter {
    bool isEligible;    // Registered by owner
    uint age;           // Voter's age
    uint voterId;       // Unique voter ID
    bool hasVoted;      // Prevents double voting
}
```

### Mappings
```solidity
mapping(address => Voter) public voters;
mapping(uint => Candidate) public candidates;
mapping(address => uint) public votedFor;
```

### State Variables
```solidity
address public owner;        // Contract deployer
uint public totalVotes;      // Total votes cast
bool public votingOpen;      // Voting status
uint public candidateCount;  // Total candidates
```

### Functions

| Function | Access | Description |
|----------|--------|-------------|
| `addCandidate(name)` | Owner only | Adds a new candidate |
| `registerVoter(address, age, id)` | Owner only | Registers an eligible voter |
| `openVoting()` | Owner only | Opens the voting period |
| `closeVoting()` | Owner only | Closes the voting period |
| `vote(candidateId)` | Registered voters | Casts a single vote |
| `getResults(candidateId)` | Anyone | Returns candidate results |

### Security Modifiers & Checks

| Check | Protection Against |
|-------|-------------------|
| `onlyOwner` modifier | Unauthorised admin actions |
| `require(votingOpen)` | Voting outside allowed period |
| `require(isEligible)` | Unregistered voters |
| `require(!hasVoted)` | Double voting |
| `require(validCandidateId)` | Invalid candidate selection |
| `require(!isEligible)` | Duplicate voter registration |

---

## 📁 Project Structure
```
voting-project/
│
├── contracts/
│   └── VotingContract.sol    # Solidity smart contract
│
├── frontend/
│   ├── index.html            # Main HTML structure
│   ├── style.css             # Styling and layout
│   └── app.js                # Blockchain interaction logic
│
└── README.md                 # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites
Before running this project, make sure you have:

- [ ] [MetaMask](https://metamask.io/) installed 
      in your browser
- [ ] A MetaMask wallet with Sepolia test ETH
      (get some at https://sepoliafaucet.com)
- [ ] [VS Code](https://code.visualstudio.com/) 
      installed
- [ ] [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) 
      VS Code extension installed
- [ ] [Git](https://git-scm.com/) installed

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/yourusername/voting-project.git
cd voting-project
```

2. **Open in VS Code:**
```bash
code .
```

3. **Deploy the smart contract:**
   - Open [Remix IDE](https://remix.ethereum.org)
   - Upload `contracts/VotingContract.sol`
   - Compile with Solidity ^0.8.0
   - Set environment to "Browser Extension"
   - Connect MetaMask to Sepolia testnet
   - Click Deploy and confirm in MetaMask
   - Copy the deployed contract address

4. **Configure the frontend:**
   - Open `frontend/app.js`
   - Replace `contractAddress` with your 
     deployed address:
```javascript
const contractAddress = "YOUR_CONTRACT_ADDRESS";
```

5. **Run the frontend:**
   - Right click `frontend/index.html`
   - Click "Open with Live Server"
   - App opens at `http://127.0.0.1:5500`

---

## 📖 How to Use

### As the Owner (Admin)

**Step 1: Connect your wallet**
```
Click "Connect Wallet"
Approve MetaMask connection
Admin panel will appear automatically
```

**Step 2: Add candidates**
```
Enter candidate name in Admin Panel
Click "Add Candidate"
Confirm MetaMask transaction
Repeat for all candidates
```

**Step 3: Register voters**
```
Enter voter's wallet address
Enter voter's age
Enter voter's unique ID
Click "Register Voter"
Confirm MetaMask transaction
```

**Step 4: Open voting**
```
Click "Open Voting"
Confirm MetaMask transaction
Voting panel is now visible to voters
```

**Step 5: Close voting**
```
Click "Close Voting" when done
Confirm MetaMask transaction
Results panel becomes visible
```

### As a Voter

**Step 1: Connect wallet**
```
Click "Connect Wallet"
Make sure you're on Sepolia testnet
Your registered wallet must match
```

**Step 2: Cast your vote**
```
Browse the candidates list
Click "Vote for [Candidate Name]"
Confirm MetaMask transaction
You can only vote ONCE!
```

**Step 3: View results**
```
Results are visible after voting closes
Click "Get Results" to see final counts
```

---

## 🔐 Security Considerations

### Smart Contract Security
- **No owner voting privilege:** The owner manages 
  the election but is not registered as a voter, 
  maintaining fairness
- **Immutable votes:** Once cast, votes cannot be 
  changed or deleted
- **On-chain enforcement:** All rules are enforced 
  by the smart contract — not by the frontend
- **Double-vote prevention:** The `hasVoted` flag 
  is permanently set after voting
- **Registration window:** Voters can only be 
  registered before voting opens

### Known Limitations
- Contract owner is a centralised point of trust 
  for voter registration
- Frontend is a convenience layer — always verify 
  transactions in MetaMask
- Currently deployed on testnet — not for 
  production use without audit

---

## 🔮 Future Improvements

- [ ] Add voting deadline with block timestamp
- [ ] Emit events for all state changes
- [ ] Add candidate removal before voting opens
- [ ] Implement voter self-registration with 
      owner approval
- [ ] Add IPFS for decentralised frontend hosting
- [ ] Professional smart contract security audit
- [ ] Multi-election support
- [ ] Mobile responsive design improvements
- [ ] Real-time vote count updates using 
      contract events

---

## 🔗 Contract Details

| Detail | Value |
|--------|-------|
| Network | Sepolia Testnet |
| Contract Address | `0xB97116cc2297053F274E4dcC77A5A0d5D5C16eCf` |
| Solidity Version | ^0.8.0 |
| Licence | MIT |

> View on Etherscan: 
> https://sepolia.etherscan.io/address/0xB97116cc2297053F274E4dcC77A5A0d5D5C16eCf

---

## 👤 Author

**Your Name**
- GitHub: (https://github.com/Kenyai402)
- LinkedIn: (https://www.linkedin.com/in/keren-irungu-488a0930b/)


---

## 📄 Licence

This project is licensed under the 
MIT Licence — see the 
[LICENSE](LICENSE) file for details.



*Built with ❤️ as part of a Web3 learning journey*

