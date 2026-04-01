// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// 2. Contract declaration
contract Voting{

    // 3. Structs
 
 struct Candidate {
    string name;
    bool isQualified;
    uint id;
    uint voteCount;
}

struct Voter {
    bool isEligible;
    uint age;
    uint voterId;
    bool hasVoted;
}


   mapping(address => Voter) public voters;
   mapping(uint => Candidate) public candidates;
   mapping(address => uint) public votedFor;
   
    // 5. State Variables
  
     address public owner;
    uint public totalVotes;
   bool public votingOpen;
   uint public candidateCount;

    // 6. Constructor
    constructor() {
    owner = msg.sender;      // deployer becomes owner 
    votingOpen = false;      // voting starts closed 
    candidateCount = 0;      // no candidates yet 
}

    // 7. onlyOwner modifier
    modifier onlyOwner() {
    require(msg.sender == owner, "Not an owner"); 
    _; // continue to function 
}

    // 8. addCandidate()
    function addCandidate(string memory _name) public onlyOwner {
    require(!votingOpen, "Voting already started");
    candidateCount++;
    candidates[candidateCount] = Candidate(
        _name,          // name 
        true,           // isQualified 
        candidateCount, // id 
        0               // voteCount 
    );
}

    // 9. registerVoter()
    function registerVoter(
    address _voterAddress,
    uint _age,
    uint _voterId
) public onlyOwner {
    require(!votingOpen, "Voting already started");
    require(!voters[_voterAddress].isEligible, "Already registered");
    
    voters[_voterAddress] = Voter(
        true,      // isEligible 
        _age,      // age 
        _voterId,  // voterId 
        false      // hasVoted 
    );
}

    // 10. openVoting()
    function openVoting() public onlyOwner {
    require(!votingOpen, "Voting is already open"); 
    votingOpen = true; 
}
    // 11. closeVoting()
    function closeVoting() public onlyOwner {
    require(votingOpen, "Voting is already closed"); 
    votingOpen = false; 
}

    // 12. vote()
    function vote(uint _candidateId) public {
    require(votingOpen, "Voting is not open");
    require(voters[msg.sender].isEligible, "Not registered"); 
    require(!voters[msg.sender].hasVoted, "Already voted"); 
    require(_candidateId > 0 && _candidateId <= candidateCount, "Invalid candidate"); 

    candidates[_candidateId].voteCount++;  // update candidate votes
    voters[msg.sender].hasVoted = true;    // 
    votedFor[msg.sender] = _candidateId;   //
    totalVotes++;                           // update total votes
}

    // 13. getResults()
    function getResults(uint _candidateId) public view 
returns(string memory name, uint voteCount) {
    require(!votingOpen, "Voting hasn't ended yet");
    Candidate memory candidate = candidates[_candidateId];
    return(candidate.name, candidate.voteCount);
}

// Close contract




}

