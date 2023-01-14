import React from 'react';
import { SiDiscord, SiTwitter } from "react-icons/si";

import logo from "../../assets/img/demonic_9_logo.jpg";
import './Header.scss';


const Header = (props) => {

    return (
      <div className="header-container">
        <div className="header-left">
            <div className="logo-container">
                <img src={logo} alt="NineSeals Logo" className="logo" /> 
            </div>
        </div>
        <div className="header-right">
            <div className="link">                
                <a href="https://twitter.com/ninesealsnft"><SiTwitter className="social-icon" /></a>
            </div>
            <div className="link">
                <a href="https://discord.gg/KwGSBzAC"><SiDiscord className="social-icon" /></a>
            </div>
            <div>
                {
                    props.wallet 
                    ? <button onClick={props.disconnectWalletHandler} className="wallet-connect-button">{props.wallet.toUpperCase()}</button>
                    : <button onClick={props.connectWalletHandler} className="wallet-connect-button">Connect</button>
                }               
            </div>
        </div>        
      </div>
    );
}

export default Header;