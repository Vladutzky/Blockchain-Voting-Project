import React, { useState } from 'react';
import { ethers } from 'ethers';
import { useWeb3 } from '../Web3Provider';
import { abi as PaymentAbi, address as PaymentAddress } from '../contracts/Payment';

const Payment = () => {
    const { signer } = useWeb3();
    const [voterAddress, setVoterAddress] = useState('');
    const [votingFee, setVotingFee] = useState('');
    const [maxPaidVotes, setMaxPaidVotes] = useState('');
    const [amount, setAmount] = useState('');
    const [totalPaidVotes, setTotalPaidVotes] = useState('');
    const [winnerAddress, setWinnerAddress] = useState('');

    if (!signer) return null;

    const paymentContract = new ethers.Contract(PaymentAddress, PaymentAbi, signer);

    const payToVote = async () => {
        try {
            await paymentContract.payToVote(voterAddress, { value: ethers.parseEther(amount) });
        } catch (error) {
            console.error('Error paying to vote:', error);
        }
    };

    const updateFees = async () => {
        try {
            await paymentContract.updateFees(ethers.parseEther(votingFee));
        } catch (error) {
            console.error('Error updating fees:', error);
        }
    };

    const updateMaxPaidVotes = async () => {
        try {
            await paymentContract.updateMaxPaidVotes(maxPaidVotes);
        } catch (error) {
            console.error('Error updating max paid votes:', error);
        }
    };

    const getTotalPaidVotes = async () => {
        try {
            const votes = await paymentContract.getTotalPaidVotes(voterAddress);
            setTotalPaidVotes(votes.toString());
        } catch (error) {
            console.error('Error getting total paid votes:', error);
        }
    };

    const releaseFunds = async () => {
        try {
            await paymentContract.releaseFunds(winnerAddress);
        } catch (error) {
            console.error('Error releasing funds:', error);
        }
    };

    return (
        <div>
            <h2>Payment</h2>
            <div>
                <h3>Pay to Vote</h3>
                <input type="text" value={voterAddress} onChange={(e) => setVoterAddress(e.target.value)} placeholder="Voter Address" />
                <input type="text" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount (ETH)" />
                <button onClick={payToVote}>Pay to Vote</button>
            </div>
            <div>
                <h3>Update Voting Fee</h3>
                <input type="text" value={votingFee} onChange={(e) => setVotingFee(e.target.value)} placeholder="New Fee (ETH)" />
                <button onClick={updateFees}>Update Fee</button>
            </div>
            <div>
                <h3>Update Max Paid Votes</h3>
                <input type="text" value={maxPaidVotes} onChange={(e) => setMaxPaidVotes(e.target.value)} placeholder="Max Paid Votes" />
                <button onClick={updateMaxPaidVotes}>Update Max Paid Votes</button>
            </div>
            <div>
                <h3>Get Total Paid Votes</h3>
                <input type="text" value={voterAddress} onChange={(e) => setVoterAddress(e.target.value)} placeholder="Voter Address" />
                <button onClick={getTotalPaidVotes}>Get Total Paid Votes</button>
                {totalPaidVotes && <p>Total Paid Votes: {totalPaidVotes}</p>}
            </div>
            <div>
                <h3>Release Funds to Winner</h3>
                <input type="text" value={winnerAddress} onChange={(e) => setWinnerAddress(e.target.value)} placeholder="Winner Address" />
                <button onClick={releaseFunds}>Release Funds</button>
            </div>
        </div>
    );
};

export default Payment;
