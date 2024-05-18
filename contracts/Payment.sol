// contracts/Payment.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import "@openzeppelin/contracts/access/Ownable.sol";
contract Payment is Ownable {

    mapping(address => uint) public votesPaid;  // Tracks the number of paid votes per voter
    uint public votingFee;
    uint public maxPaidVotes;
    uint public maxFreeVotes;

    event MaxPaidVotesUpdated(uint _updatedNumber);
    event PaymentReceived(address indexed payer);
    event FeeUpdated(uint _votingFee);
    event WinnerPaid(uint totalCollectedFees);

    modifier validNumberVotesRange(uint _maxFreeVotes, uint _maxPaidVotes){
        require(_maxFreeVotes < _maxPaidVotes, "Invalid range of free/paid votes");
        _;
    }

    constructor(address initialOwner, uint _initialFee, uint _maxFreeVotes, uint _maxPaidVotes) Ownable(initialOwner) validNumberVotesRange(_maxFreeVotes, _maxPaidVotes) {
        if (initialOwner == address(0)) {
            revert OwnableInvalidOwner(address(0));
        }
        votingFee = _initialFee;   
        maxFreeVotes = _maxFreeVotes;
        maxPaidVotes = _maxPaidVotes;
    }

    function payToVote(address voter) external payable {
        require(msg.value >= votingFee, "Not enough ETH sent");
        if (msg.value > votingFee) {
            (bool sent, ) = payable(voter).call{value: msg.value - votingFee}("");
            require(sent, "Failed to send the extra Ether back");
        }

        votesPaid[voter] += 1;
        emit PaymentReceived(voter);
    }

    // Allow the owner to update the fee 
    function updateFees(uint _updatedFee) external onlyOwner {
        votingFee = _updatedFee;
        emit FeeUpdated(votingFee);
    }

    function updateMaxPaidVotes(uint _maxPaidVotes) external onlyOwner {
        maxPaidVotes = _maxPaidVotes;
        emit MaxPaidVotesUpdated(maxPaidVotes);

    }

    // Function to check the total votes paid by a voter
    function getTotalPaidVotes(address voter) external view returns (uint) {
        return votesPaid[voter];
    }

    // Pay the winner
    function releaseFunds(address winner) external onlyOwner {
        uint totalCollectedFees = address(this).balance;  
        require(totalCollectedFees > 0, "No funds to distribute");
        payable(winner).transfer(totalCollectedFees);
        emit WinnerPaid(totalCollectedFees);
    }
}
