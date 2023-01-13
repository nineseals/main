import React, { useEffect, useState } from "react";
import Web3 from 'web3';

import Header from './components/Header/Header';
import './App.scss';
import oContract from './contracts/NineSeals.json';

const SALE_STATUS_NOT_STARTED = 0;
const SALE_STATUS_ALLOWLIST = 1;
const SALE_STATUS_PUBLIC = 2;
const SALE_STATUS_DONE = 3;

function App() {

  const [web3, setWeb3] = useState(null);
  const [currentAccount, setCurrentAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [saleStatus, setSaleStatus] = useState(null);
  
  useEffect(() => {
    init();    
  }, []);

  useEffect(() => {
    if (web3) {
      checkWalletIsConnected();    
    }
  }, [web3]);

  useEffect(() => {
    checkSaleStatus();
  }, [contract]);


  const init = async () => {
    // Get network provider and web3 instance.
    const connWeb3 = await new Web3(Web3.givenProvider || 'http://localhost:8545');
    setWeb3(connWeb3);
  };

  const checkWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have Metamask installed!");
      return;
    } else {
      console.log("Wallet exists! We're ready to go!")
    }

    console.log(web3);
      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account: ", account);
      setCurrentAccount(account);
    } else {
      console.log("No authorized account found");
    }

    

    

    console.log("Network: ", await web3.eth.net.getId());
    const contractAddress = oContract.networks[await web3.eth.net.getId()].address;
    const abi = oContract.abi;

    // Create a contract instance
    const nftContract = new web3.eth.Contract(abi, contractAddress);
    console.log(nftContract);

    console.log(accounts);

        await setContract(nftContract);

  }

  const connectWalletHandler = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      alert("Please install Metamask!");
    }

    try {
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      console.log("Found an account! Address: ", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (err) {
      console.log(err)
    }
  }

  const checkSaleStatus = async () => {
    let currStatus = SALE_STATUS_NOT_STARTED;

    if (!contract) { 
        await setSaleStatus(SALE_STATUS_NOT_STARTED);
    } else {
      currStatus = await contract.methods.isPublicSaleOn().call();

      console.log("Status", currStatus);
    }
  }

  const mintNftHandler = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {

        
        console.log("Initialize payment");

        
        let nftTxn = await contract.methods.publicSaleMint(1, 123456789).send({ from: currentAccount, value: web3.utils.toWei("0.02", "ether") }).on('receipt', function () {
          console.log('receipt')
        });

        console.log("Mining...please wait");
        console.log("Mined: ", nftTxn.transactionHash);

      } else {
        console.log("Ethereum object does not exist");
      }

    } catch (err) {
      console.log(err);
    }
  }

  const connectWalletButton = () => {
    return (
      <button onClick={connectWalletHandler} className='cta-button connect-wallet-button'>
        Connect Wallet
      </button>
    )
  }

  const mintNftButton = () => {
    return (
      <button onClick={mintNftHandler} className='cta-button mint-nft-button'>
        Mint NFT
      </button>
    )
  }

  return (
    <div className='App'>
      <Header />
      <div className='main-app'>
          {currentAccount ? mintNftButton() : connectWalletButton()}
        </div>
      </div>
  )
}

export default App;