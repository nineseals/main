import React, { useEffect, useRef, useState } from "react";
import Web3 from 'web3';

import Header from './components/Header/Header';
import './App.scss';
import oContract from './contracts/NineSeals.json';

const SALE_STATUS_NOT_STARTED = 0;
const SALE_STATUS_ALLOWLIST = 1;
const SALE_STATUS_PUBLIC = 2;
const SALE_STATUS_DONE = 3;
const SALE_STATUS_PAUSED = 4;

const PUBLIC_SALE_KEY = 123456789;

function App() {

  const mintNumRef = useRef(null);

  const [web3, setWeb3] = useState(null);
  const [currentAccount, setCurrentAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [saleStatus, setSaleStatus] = useState(null);
  const [salePrice, setSalePrice] = useState(null);
  const [userConfig, setUserConfig] = useState({});
  
  useEffect(() => {
    init();    
  }, []);

  useEffect(() => {
    if (web3) {
      checkWalletIsConnected();    
    }
  }, [web3]);

  useEffect(() => {
    let checkStatusInterval = null;
    
    if (contract) {
      checkStatusInterval = setInterval(() => {
        checkSaleStatus();
      }, 5000);
      
      getUserConfig();
    }

    return () => clearInterval(checkStatusInterval);
  }, [contract]);

  useEffect(() => {
    if (saleStatus > 0) {
      console.log("Status:", saleStatus);
      getSalePrice();
    }
  }, [saleStatus]);

  // DEBUG ONLY
  useEffect(() => {
    console.log("userConfig:", userConfig);
  }, [userConfig]);

  // DEBUG ONLY
  useEffect(() => {
    console.log("salePrice:", salePrice);
  }, [salePrice]);

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

    setContract(nftContract);
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

  const disconnectWalletHandler = async () => {
    setCurrentAccount(null);
  }

  const checkSaleStatus = async () => {
    if (!contract) { 
      console.log('No contract available to get status');
    } else if (await contract.methods.isSaleClosed().call()) {
      setSaleStatus(SALE_STATUS_DONE);
    } else if (await contract.methods.isMintPaused().call()) {
      setSaleStatus(SALE_STATUS_PAUSED);
    } else if (await contract.methods.isPublicSaleOn().call()) {
      setSaleStatus(SALE_STATUS_PUBLIC);
    } else if (await contract.methods.isAllowlistSaleOn().call()) {
      setSaleStatus(SALE_STATUS_ALLOWLIST);
    } else {
      setSaleStatus(SALE_STATUS_NOT_STARTED);
    }
  }

  const getSalePrice = async () => {
    if (contract) {
      const mintCost = await contract.methods.getMintPrice().call();
      console.log(`Fetched mint cost: ${mintCost}`);
      setSalePrice(mintCost);
    }
  }

  const getUserConfig = async () => {

    if (!contract) { 
      return false;
    } 
    
    const allowlistSlots = Number(await contract.methods.allowlistSlots(currentAccount).call());
    const allowlistRemaining =  Number(await contract.methods.allowlistTokensRemaining(currentAccount).call());

    const publicSlots = Number(await contract.methods.maxMintableTokens(currentAccount).call());
    const publicRemaining =  Number(await contract.methods.publicSaleTokensRemaining(currentAccount).call());

    setUserConfig({
      ...userConfig,
      allowlistSlots,
      allowlistRemaining,
      publicSlots,
      publicRemaining,
    });

    return (allowlistRemaining > 0); 
  }

  
  const mintNftHandler = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {

        const mintQty = Number(mintNumRef.current.value);

        if (!mintQty) {
          return;
        }

        const mintTotalCost = new web3.utils.BN(salePrice).muln(mintQty);

        console.log(`Minting ${mintQty} tokens for ${web3.utils.fromWei(mintTotalCost, 'ether')} ether.`);
        
        let nftTxn = null;

        if (saleStatus === SALE_STATUS_ALLOWLIST) {
          nftTxn = await contract.methods.allowlistMint(mintQty).send({ from: currentAccount, value: mintTotalCost.toString() }).on('receipt', function () {
            console.log('receipt')
          });

        } else {
          nftTxn = await contract.methods.publicSaleMint(mintQty, PUBLIC_SALE_KEY).send({ from: currentAccount, value: mintTotalCost.toString() }).on('receipt', function () {
            console.log('receipt')
          });
        }

        console.log("Minting...please wait");
        console.log("Minted: ", nftTxn.transactionHash);

        await getUserConfig();

      } else {
        console.log("Ethereum object does not exist");
      }

    } catch (err) {
      console.log(err);
    }
  }
  
  const mintNftForm = () => {
    const maxMints = (saleStatus === SALE_STATUS_ALLOWLIST) 
      ? userConfig.allowlistRemaining
      : userConfig.publicRemaining;

      if (mintNumRef.current && mintNumRef.current.value > maxMints) {
        mintNumRef.current.value = maxMints;
      }

    return (
      <div>
        <div className="form-row">
          <input ref={mintNumRef} type="number" step="1" min="1" max={maxMints} defaultValue={maxMints} className="input-mint-number" />
        </div>
        <div className="form-row">
          <button onClick={mintNftHandler} className='cta-button mint-nft-button'>
            Mint
          </button>
        </div>
      </div>      
    )
  };

  const printSaleState = () => {
    switch (saleStatus) {
      case SALE_STATUS_ALLOWLIST:
        return allowlistState();

      case SALE_STATUS_PUBLIC:
        return publicSaleState();

      case SALE_STATUS_PAUSED:
        return mintPausedState();

      case SALE_STATUS_DONE:
        return saleClosedState();

      default:
        return "";
    }
  }

  const mintPausedState = () => {
    return (
      <div>
        <h1>Mint Paused</h1>
      </div>
    );
  };

  const saleClosedState = () => {
    return (
      <div>
        <h1>Mint has finished</h1>
      </div>
    );
  };

  const allowlistState = () => {
    return (
      <div>
        <h1>Allowlist Pre-sale</h1>
        {
          userConfig.allowlistSlots 
          ? `You have ${userConfig.allowlistRemaining} allowlist mints remaining.`
          : `Not on allowlist`
        }
        { mintNftForm() }
      </div>
    );
  };

  const publicSaleState = () => {
    return (
      <div>
        <h1>Public Sale</h1>
        <div>You have {userConfig.publicRemaining} mints remaining.</div>
        { mintNftForm() }
      </div>
    );
  };

  return (
    <div className='App'>
      <Header connectWalletHandler={connectWalletHandler} disconnectWalletHandler={disconnectWalletHandler} wallet={currentAccount} />
      <div className='main-app'>
          {currentAccount ? printSaleState() : <h2>Please connect wallet to mint</h2>}
        </div>
      </div>
  )
}

export default App;