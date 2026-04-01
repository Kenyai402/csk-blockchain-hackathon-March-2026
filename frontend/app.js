// CONTRACT INFO
const contractAddress = "0xB97116cc2297053F274E4dcC77A5A0d5D5C16eCf"; // paste your deployed address here
const contractABI = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_name",
        type: "string",
      },
    ],
    name: "addCandidate",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "candidateCount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "candidates",
    outputs: [
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "bool",
        name: "isQualified",
        type: "bool",
      },
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "voteCount",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "closeVoting",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_candidateId",
        type: "uint256",
      },
    ],
    name: "getResults",
    outputs: [
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "voteCount",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "openVoting",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_voterAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_age",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_voterId",
        type: "uint256",
      },
    ],
    name: "registerVoter",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "totalVotes",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_candidateId",
        type: "uint256",
      },
    ],
    name: "vote",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "votedFor",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "voters",
    outputs: [
      {
        internalType: "bool",
        name: "isEligible",
        type: "bool",
      },
      {
        internalType: "uint256",
        name: "age",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "voterId",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "hasVoted",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "votingOpen",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
]; // pasted ABI here

// GLOBAL VARIABLES
let provider; // connects to blockchain
let signer; // represents the current user
let contract; // our voting contract instance
let userAddress; // connected wallet address

// CONNECT WALLET FUNCTION
async function connectWallet() {
  if (typeof window.ethereum !== "undefined") {
    try {
      // Request wallet connection
      provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      signer = provider.getSigner();
      userAddress = await signer.getAddress();

      // Update UI with wallet address
      document.getElementById("walletAddress").innerText = userAddress;

      // Create contract instance
      contract = new ethers.Contract(contractAddress, contractABI, signer);

      // Check if connected wallet is owner
      await checkIfOwner();
      await updateUI();

      console.log("Connected:", userAddress);
    } catch (error) {
      console.error("Connection failed:", error);
    }
  } else {
    alert("Please install MetaMask!");
  }
}
// EVENT LISTENERS
document.getElementById("connectWallet") // find the button by ID
    .addEventListener("click", connectWallet);// attach click event to connectWallet function

document.getElementById("addCandidate")// find the add candidate button
    .addEventListener("click", addCandidate);// attach click event to addCandidate function

document.getElementById("registerVoter")//find the register voter button
    .addEventListener("click", registerVoter);//    attach click event to registerVoter function

document.getElementById("openVoting")//find the open voting button
    .addEventListener("click", openVoting);//    attach click event to openVoting function

document.getElementById("closeVoting")//find the close voting button
    .addEventListener("click", closeVoting);//    attach click event to closeVoting function

document.getElementById("getResults")//find the get results button
    .addEventListener("click", getResults);//    attach click event to getResults function

// CHECK OWNER FUNCTION
async function checkIfOwner() {
  const owner = await contract.owner();
  const adminPanel = document.getElementById("admin-panel");

  if (userAddress.toLowerCase() === owner.toLowerCase()) {
    adminPanel.style.display = "block";
  } else {
    adminPanel.style.display = "none";
  }
}

async function addCandidate() {
  try {
    const name = document.getElementById("candidateName").value;

    if (!name) {
      alert("Please enter a candidate name!");
      return;
    }

    const tx = await contract.addCandidate(name);
    await tx.wait(); // wait for blockchain confirmation

    alert("Candidate added successfully!");
    document.getElementById("candidateName").value = ""; // clear input
  } catch (error) {
    alert("Error: " + error.message);
  }
}
async function registerVoter() {
  try {
    const address = document.getElementById("voterAddress").value;
    const age = document.getElementById("voterAge").value;
    const id = document.getElementById("voterId").value;

    if (!address || !age || !id) {
      alert("Please fill in all fields!");
      return;
    }

    const tx = await contract.registerVoter(address, age, id);
    await tx.wait();

    alert("Voter registered successfully!");

    // Clear inputs after success
    document.getElementById("voterAddress").value = "";
    document.getElementById("voterAge").value = "";
    document.getElementById("voterId").value = "";
  } catch (error) {
    alert("Error: " + error.message);
  }
}
//Open Voting
async function openVoting() {
  try {
    const tx = await contract.openVoting(); // call openVoting function on contract
    await tx.wait();
    await updateUI(); // refresh panels!
    alert("Voting is now open!"); // user feedback
  } catch (error) {
    // error handling
    alert("Error: " + error.message); // show error to user
  }
}
//Close Voting
async function closeVoting() {
  try {
    const tx = await contract.closeVoting(); // call closeVoting function on contract
    await tx.wait(); // wait for transaction confirmation
    await updateUI(); // ← refreshes panels!
    alert("Voting closed!"); // user feedback
  } catch (error) {
    // error handling
    alert("Error: " + error.message); // show error to user
  }
}
async function loadCandidates() {
  try {
    const count = await contract.candidateCount();
    const candidatesList = document.getElementById("candidates-list");
    candidatesList.innerHTML = ""; // clear existing list

    for (let i = 1; i <= count; i++) {
      const candidate = await contract.candidates(i);

      candidatesList.innerHTML += `
                <div class="candidate-card">
                    <h3>${candidate.name}</h3>
                    <p>Candidate ID: ${candidate.id}</p>
                    <button onclick="castVote(${candidate.id})">
                        Vote for ${candidate.name}
                    </button>
                </div>
            `;
    }
  } catch (error) {
    console.error("Error loading candidates:", error);
  }
}

// Cast Vote
async function castVote(candidateId) {
  try {
    const tx = await contract.vote(candidateId);
    await tx.wait();
    await updateUI();
    alert("Vote cast successfully!");
    await loadCandidates();
  } catch (error) {
    alert("Error: " + error.message);
  }
}

// Update UI based on voting status
async function updateUI() {
  const isVotingOpen = await contract.votingOpen();

  if (isVotingOpen) {
    document.getElementById("voting-panel").style.display = "block";
    document.getElementById("results-panel").style.display = "none";
    await loadCandidates(); // ← add this!
  } else {
    document.getElementById("voting-panel").style.display = "none";
    document.getElementById("results-panel").style.display = "block";
  }
}

async function getResults() {
  try {
    const count = await contract.candidateCount();
    const resultsList = document.getElementById("results-list");
    resultsList.innerHTML = "";

    for (let i = 1; i <= count; i++) {
      const result = await contract.getResults(i);

      resultsList.innerHTML += `
                <div class="result-card">
                    <h3>${result.name}</h3>
                    <p>Votes: ${result.voteCount.toString()}</p>
                </div>
            `;
    }
  } catch (error) {
    alert("Error: " + error.message);
  }
}
