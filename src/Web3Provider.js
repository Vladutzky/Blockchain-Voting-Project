import React, { createContext, useContext, useEffect, useState } from 'react';
import { ethers } from 'ethers';
import Web3Modal from 'web3modal';

const Web3Context = createContext();

export const useWeb3 = () => useContext(Web3Context);

export const Web3Provider = ({ children }) => {
    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [account, setAccount] = useState(null);
    const [balance, setBalance] = useState(null);

    useEffect(() => {
        if (provider && account) {
            (async () => {
                const balance = await provider.getBalance(account);
                setBalance(ethers.formatEther(balance));
            })();
        }
    }, [provider, account]);

    const connectWallet = async () => {
        const web3Modal = new Web3Modal();
        const instance = await web3Modal.connect();
        const provider = new ethers.BrowserProvider(instance);
        const signer = await provider.getSigner();
        const account = await signer.getAddress();

        setProvider(provider);
        setSigner(signer);
        setAccount(account);
    };

    return (
        <Web3Context.Provider value={{ provider, signer, account, balance, connectWallet }}>
            {children}
        </Web3Context.Provider>
    );
};
