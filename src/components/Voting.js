import React, { useState } from 'react';
import { ethers } from 'ethers';
import { useWeb3 } from '../Web3Provider';
import { abi as VotingAbi, address as VotingAddress } from '../contracts/Voting';
import { abi as AdminAbi, address as AdminAddress } from '../contracts/Admin';

const Voting = () => {
    const { signer } = useWeb3();
    const [candidateId, setCandidateId] = useState('');
    const [amount, setAmount] = useState('');
    const [winner, setWinner] = useState(null);
    const [candidates, setCandidates] = useState([]);

    if (!signer) return null;

    const votingContract = new ethers.Contract(VotingAddress, VotingAbi, signer);
    const adminContract = new ethers.Contract(AdminAddress, AdminAbi, signer);

    const fetchCandidates = async () => {
       
            console.log('aaa');
            const candidateIds = await adminContract.getAllCandidates1();
            console.log(candidateIds);
        
        
    };

    const registerVoter = async () => {
        try {
            await votingContract.registerVoter();
        } catch (error) {
            console.error('Error registering voter:', error);
        }
    };

    const vote = async () => {
        try {
            await votingContract.vote(candidateId, { value: ethers.parseEther(amount) });
        } catch (error) {
            console.error('Error voting:', error);
        }
    };

    const findWinner = async () => {
        try {
            const winnerData = await votingContract.getWinner();
            console.log('Winner Data:', winnerData);
            setWinner({
                name: winnerData[0],
                address: winnerData[1],
                votes: winnerData[2].toString(), // Convert BigNumber to string
            });
        } catch (error) {
            console.error('Error finding winner:', error);
        }
    };

    return (
        <div>
            <h2>Voting</h2>
            <div>
                <h3>Register Voter</h3>
                <button onClick={registerVoter}>Register</button>
            </div>
            <div>
                <h3>Vote</h3>
                <input type="text" value={candidateId} onChange={(e) => setCandidateId(e.target.value)} placeholder="Candidate ID" />
                <input type="text" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount (ETH)" />
                <button onClick={vote}>Vote</button>
            </div>
            <div>
                <h3>Find Winner</h3>
                <button onClick={findWinner}>Find Winner</button>
                {winner && (
                    <div>
                        <p>Winner Name: {winner.name}</p>
                        <p>Winner Address: {winner.address}</p>
                        <p>Winner Votes: {winner.votes}</p>
                    </div>
                )}
            </div>
            <div>
                <h3>All Candidates</h3>
                <button onClick={fetchCandidates}>Fetch Candidates</button>
                <ul>
                    {candidates.map((candidate, index) => (
                        <li key={index}>
                            <p>ID: {candidate.id}</p>
                            <p>Name: {candidate.name}</p>
                            <p>Address: {candidate.candidateAddress}</p>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Voting;
