import React, { useEffect, useRef, useState } from "react";
import Web3 from 'web3';
import { TbExternalLink } from "react-icons/tb";

import Background from "./components/Background/Background";
import Header from './components/Header/Header';
import CollectionPreviews from './components/CollectionPreviews/CollectionPreviews';
import TeamMember from "./components/TeamMember/TeamMember";

import oContract from './contracts/NineSeals.json';

import './App.scss';

import pfpFounder from './assets/img/pfp_ikari.png';
import pfpDev from './assets/img/pfp_itsbradleybitch.png';
import pfpArtist from './assets/img/pfp_artist.png';

const SALE_STATUS_NOT_STARTED = 0;
const SALE_STATUS_ALLOWLIST = 1;
const SALE_STATUS_PUBLIC = 2;
const SALE_STATUS_DONE = 3;
const SALE_STATUS_PAUSED = 4;

const PUBLIC_SALE_KEY = 15670169;

function App() {

  const mintNumRef = useRef(null);

  const [web3, setWeb3] = useState(null);
  const [currentAccount, setCurrentAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [saleStatus, setSaleStatus] = useState(null);
  const [salePrice, setSalePrice] = useState(null);
  const [userConfig, setUserConfig] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [txHash, setTxHash] = useState(null);
  const [collectionSize, setCollectionSize] = useState(null);
  const [numMinted, setNumMinted] = useState(null);
  
  useEffect(() => {
    init();    
  }, []);

  useEffect(() => {
    const { ethereum } = window;

    if (web3) {
      checkWalletIsConnected();    

      if (ethereum) {
        ethereum.on('accountsChanged', (accounts) => {
          // Time to reload your interface with accounts[0]!
          // console.log('Accounts Changed:', accounts);
          initAccount();
        });
        
        ethereum.on('chainChanged', (networkId) => {
          // Time to reload your interface with the new networkId
          // console.log('Network Changed:', networkId);
          initContract();
        });
      }
    }
  }, 
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [web3]);

  useEffect(() => {
    let checkStatusInterval = null;
    
    if (contract) {
      checkStatusInterval = setInterval(() => {
        checkSaleStatus();
        updateMintCounts();
      }, 2500);
      
      getUserConfig();
    }

    return () => clearInterval(checkStatusInterval);
  }, 
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [contract]);

  useEffect(() => {
    if (saleStatus > 0) {
      // console.log("Status:", saleStatus);
      getSalePrice();
    }
  }, 
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [saleStatus]);

  useEffect(() => {
    if (currentAccount) {
      getUserConfig();
    }
  },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [currentAccount]);

  // // DEBUG ONLY
  // useEffect(() => {
  //   console.log("userConfig:", userConfig);
  // }, [userConfig]);

  // // DEBUG ONLY
  // useEffect(() => {
  //   console.log("salePrice:", salePrice);
  // }, [salePrice]);

  const init = async () => {
    try {
    // Get network provider and web3 instance.
    const connWeb3 = await new Web3(Web3.givenProvider || 'http://localhost:8545');
    setWeb3(connWeb3);
    } catch (err) {
      console.log(err);
    }
  };

  const initAccount = async () => {
    try {
      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // console.log(accounts);

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account: ", account);
        setCurrentAccount(account);
      } else {
        setCurrentAccount(null);
        // console.log("No authorized account found");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const initContract = async () => {
    try {
      const ethNetworkId = await web3.eth.net.getId();
      // console.log("Network: ", ethNetworkId);

      if (!oContract.networks[ethNetworkId]) {
        setErrorMessage("Please make sure you are connected to mainnet");
        return;
      } else {
        clearErrorMessage();
      }

      const contractAddress = oContract.networks[ethNetworkId].address;
      const abi = oContract.abi;

      // Create a contract instance
      const nftContract = new web3.eth.Contract(abi, contractAddress);

      // console.log(nftContract);

      const collectionSize = await nftContract.methods.collectionSize().call();

      setCollectionSize(collectionSize);

      setContract(nftContract);
    } catch (err) {
      console.log(err);
    }
  };

  const clearErrorMessage = () => setErrorMessage("");

  const checkWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      setErrorMessage("No available web3 wallet detected");
      // console.log("Make sure you have Metamask installed!");
      return;
    } else {
      console.log("Wallet exists! We're ready to go!")
    
      await initAccount();

      await initContract();
    }
  }

  const connectWalletHandler = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      setErrorMessage("Please install Metamask!");
    }

    try {
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      console.log("Found an account! Address: ", accounts[0]);
      setCurrentAccount(accounts[0]);
    
      await initAccount();
    } catch (err) {
      console.log(err)
    }
  }

  const checkSaleStatus = async () => {
    if (!contract) { 
      console.log('No contract available to get status');
    } else {
      try {
        const currStatus = await contract.methods.getSaleStatus().call();
        setSaleStatus(Number(currStatus));
      } catch (err) {
        console.log(err)
      }
    } 
  }

  const updateMintCounts = async () => {
    if (!contract) { 
      console.log('No contract available to get mint counts');
    } else {
      try {
        const currMintCount = await contract.methods.totalSupply().call();
        setNumMinted(currMintCount);
      } catch (err) {
        console.log(err)
      }
    } 
  }

  const getSalePrice = async () => {
    if (contract) {
      try {
        const mintCost = await contract.methods.getMintPrice().call();
        // console.log(`Fetched mint cost: ${mintCost}`);
        setSalePrice(mintCost);
      } catch (err) {
        console.log(err)
      }
    }
  }

  const getUserConfig = async () => {

    if (!contract || !currentAccount) { 
      return false;
    } 

    try {
      const _userConfig = await contract.methods.getUserConfig(currentAccount).call();

      
      // const allowlistSlots = Number(await contract.methods.allowlistSlots(currentAccount).call());
      // const allowlistRemaining =  Number(await contract.methods.allowlistTokensRemaining(currentAccount).call());

      // const publicSlots = Number(await contract.methods.maxMintableTokens(currentAccount).call());
      // const publicRemaining =  Number(await contract.methods.publicSaleTokensRemaining(currentAccount).call());

      // const tokenBalance = Number(await contract.methods.numberMinted(currentAccount).call());

      setUserConfig({
        ...userConfig,
        ...(_userConfig || {})
      });
    } catch (err) {
      console.log(err)
    }
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
            // console.log('receipt')
          });

        } else {
          const totalGas = 60000 + (60000 * mintQty);

          nftTxn = await contract.methods.publicSaleMint(mintQty, PUBLIC_SALE_KEY).send({
            gas: totalGas,
            from: currentAccount, 
            value: mintTotalCost.toString() 
          }).on('receipt', function () {
            // console.log('receipt')
          });
        }

        // console.log("Minting...please wait");
        console.log("Minted: ", nftTxn.transactionHash);

        if (`transactionHash` in nftTxn) {
          setTxHash(nftTxn.transactionHash);
        }

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
      ? userConfig.userAllowlistRemaining
      : userConfig.userPublicRemaining;

      if (mintNumRef.current && mintNumRef.current.value > maxMints) {
        mintNumRef.current.value = maxMints;
      }

    return (
      <div className="mint-form">        
        <div className="form-row">
          <input ref={mintNumRef} type="number" step="1" min="1" max={maxMints} defaultValue={maxMints} className="input-mint-number" disabled={!maxMints} />
        </div>
        <div className="form-row">
          <button onClick={mintNftHandler} className='cta-button mint-nft-button' disabled={!maxMints}> 
            Mint
          </button>
        </div>
        {
          txHash && 
            <div className="tx-receipt"><a href={`https://etherscan.io/tx/${txHash}`} target="_blank" rel="noopener noreferrer">View Tx on Etherscan <TbExternalLink /></a></div>
        }
      </div>      
    )
  };

  const printSaleState = () => {
    const salePctMinted = saleStatus && <div className="mint-count">{numMinted} / {collectionSize}</div>;

    switch (saleStatus) {
      case SALE_STATUS_NOT_STARTED:
        return saleNotStartedState(salePctMinted);

      case SALE_STATUS_ALLOWLIST:
        return allowlistState(salePctMinted);

      case SALE_STATUS_PUBLIC:
        return publicSaleState(salePctMinted);

      case SALE_STATUS_PAUSED:
        return mintPausedState(salePctMinted);

      case SALE_STATUS_DONE:
        return saleClosedState();

      default:
        return <div className="mint-loading">Loading...</div>;
    }
  }

  const saleNotStartedState = () => {
    return (
      <div>
        <h1>Mint has not yet begun, check back later</h1>
      </div>
    );
  };

  const mintPausedState = (salePctMinted) => {
    return (
      <div>
        <h1>Mint Paused</h1>
        {salePctMinted}
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

  const allowlistState = (salePctMinted) => {
    const isAllowlist = (userConfig.userAllowlistSlots > 0 );
    return (
      <div>
        <h1>Allowlist Pre-sale</h1>
        {salePctMinted}
        <p>
        {
          isAllowlist
          ? `You have ${userConfig.userAllowlistRemaining} allowlist mints remaining.`
          : `You are not on the allowlist`
        }
        </p>
        { isAllowlist && mintNftForm() }
      </div>
    );
  };

  const publicSaleState = (salePctMinted) => {
    return (
      <div>
        <h1>Public Sale</h1>
        {salePctMinted}
        <div>You have {userConfig.userPublicRemaining} mints remaining.</div>
        { mintNftForm() }
      </div>
    );
  };

  return (
    <div className='App'>      
      <main className="wrapper">
        <Header connectWalletHandler={connectWalletHandler} wallet={currentAccount} />
        <div className='main-app'>
            { errorMessage && <div className="error-message-container"><div className="error-message">{errorMessage}</div></div> }
            <section className="content-container section-mint">
              <div className="content">
                <h2 className="section-title">Mint</h2>
                <div className="mint-container">                  
                  {currentAccount ? printSaleState() : <h2>Please connect wallet to mint</h2>}
                </div>
              </div>
            </section>          
            <section className="content-container section-previews">
              <div className="content">
                <CollectionPreviews />
              </div>
            </section>
            <section className="content-container section-team">
              <div className="content">
                <h2 className="section-title">Team</h2>
                <div className="team">
                  <TeamMember imageUrl={pfpFounder} title="Founder" twitter="itskfreeze" />
                  <TeamMember imageUrl={pfpDev} title="Developer" twitter="badassbradash" />
                  <TeamMember imageUrl={pfpArtist} title="Creative Director" twitter="woodrow_22" />
                </div>
              </div>
            </section>
            <section className="content-container section-footer">
              { (contract && `_address` in contract) &&
                (
                  <div className="contract-address">
                    Contract Address: <a href={`https://etherscan.io/address/${contract._address}`} target="_blank" rel="noopener noreferrer">{contract._address}</a>
                  </div>
                )
              }
            </section>
        </div>
      </main>
      <Background />
    </div>
  )
}

export default App;