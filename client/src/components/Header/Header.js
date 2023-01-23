import React from 'react';
import { SiDiscord, SiTwitter } from "react-icons/si";

// import logo from "../../assets/img/demonic_9_logo.jpg";
import IconOpenSea from "../../assets/img/icon_opensea.svg";

import './Header.scss';


const Header = (props) => {

    return (
      <div className="header-container">
        <div className="header-left">
            {/* <div className="logo-container">
                <img src={logo} alt="NineSeals Logo" className="logo" /> 
            </div> */}
        </div>
        <div className="header-right">
            <div className="link">
                <a href="https://opensea.io/collection/order-of-the-nine-seals"><img src={IconOpenSea} alt="OpenSea" className="social-icon svg" /></a>
            </div>
            <div className="link">                
                <a href="https://twitter.com/ninesealsnft"><SiTwitter className="social-icon" /></a>
            </div>
            <div className="link">
                <a href="https://discord.gg/KwGSBzAC"><SiDiscord className="social-icon" /></a>
            </div>
            <div>
                {
                    props.wallet 
                    ? (
                        <button 
                            className={[
                                `wallet-connect-button`,
                                (props.wallet && `connected`)
                            ].join(' ')}>
                            {props.wallet.slice(0,4).toUpperCase()}...{props.wallet.slice(-4).toUpperCase()}
                        </button>
                      )
                    : <button onClick={props.connectWalletHandler} className="wallet-connect-button">Connect</button>
                }               
            </div>
        </div>        
      </div>
    );
}

export default Header;