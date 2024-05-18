/* eslint-disable no-undef */
import React, { useState } from 'react';
import { ethers } from 'ethers';
import { useWeb3 } from '../Web3Provider';
import { abi as AdminAbi, address as AdminAddress } from '../contracts/Admin';
import Datetime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';
import moment from 'moment';

const Admin = () => {
    const { signer } = useWeb3();
    const [votingStart, setVotingStart] = useState('');
    const [votingEnd, setVotingEnd] = useState('');
    const [candidateName, setCandidateName] = useState('');
    const [candidateAddress, setCandidateAddress] = useState('');
    const [candidateId, setCandidateId] = useState('');

    if (!signer) return null;

    const adminContract = new ethers.Contract(AdminAddress, AdminAbi, signer);

    const updateVotingPeriod = async () => {
        try {
            const startTimestamp = moment(votingStart).unix();
            const endTimestamp = moment(votingEnd).unix();
            await adminContract.updateVotingPeriod(BigInt(startTimestamp), BigInt(endTimestamp));
        } catch (error) {
            console.error('Error updating voting period:', error);
        }
    };

    const addCandidate = async () => {
        try {
            await adminContract.addCandidate(candidateName, candidateAddress);
            console.log('a');
        } catch (error) {
            console.error('Error adding candidate:', error);
        }
    };

    const deactivateCandidate = async () => {
        try {
            await adminContract.deactivateCandidate(candidateId);
        } catch (error) {
            console.error('Error deactivating candidate:', error);
        }
    };

    return (
        <div>
            <h2>Admin</h2>
            <div>
                <h3>Update Voting Period</h3>
                <label>Start Time</label>
                <Datetime 
                    value={votingStart} 
                    onChange={(date) => setVotingStart(date)} 
                    dateFormat="YYYY-MM-DD" 
                    timeFormat="HH:mm:ss" 
                    inputProps={{ placeholder: 'YYYY-MM-DD HH:mm:ss' }}
                />
                <label>End Time</label>
                <Datetime 
                    value={votingEnd} 
                    onChange={(date) => setVotingEnd(date)} 
                    dateFormat="YYYY-MM-DD" 
                    timeFormat="HH:mm:ss" 
                    inputProps={{ placeholder: 'YYYY-MM-DD HH:mm:ss' }}
                />
                <button onClick={updateVotingPeriod}>Update Period</button>
            </div>
            <div>
                <h3>Add Candidate</h3>
                <input type="text" value={candidateName} onChange={(e) => setCandidateName(e.target.value)} placeholder="Candidate Name" />
                <input type="text" value={candidateAddress} onChange={(e) => setCandidateAddress(e.target.value)} placeholder="Candidate Address" />
                <button onClick={addCandidate}>Add Candidate</button>
            </div>
            <div>
                <h3>Deactivate Candidate</h3>
                <input type="text" value={candidateId} onChange={(e) => setCandidateId(e.target.value)} placeholder="Candidate ID" />
                <button onClick={deactivateCandidate}>Deactivate Candidate</button>
            </div>
        </div>
    );
};

export default Admin;
