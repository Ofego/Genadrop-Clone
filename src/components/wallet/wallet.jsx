import React, { useContext, useRef, useState } from 'react'
import classes from './wallet.module.css';
import WalletConnectProvider from "@walletconnect/web3-provider";
import { GenContext } from '../../gen-state/gen.context';
import { setConnector, setAccount, setNotification } from '../../gen-state/gen.actions';
import userIcon from '../../assets/user.svg';
// import switchIcon from '../../assets/icon-switch.svg';
import copyIcon from '../../assets/icon-copy.svg';
import disconnectIcon from '../../assets/icon-disconnect.svg';
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import { useHistory } from 'react-router-dom';


function ConnectWallet({ setToggleNav }) {
  const { dispatch, connector, account } = useContext(GenContext);
  const [dropdown, setDropdown] = useState(false);
  const [toggleDropdown, setToggleDropdown] = useState(false);
  const [clipboardState, setClipboardState] = useState('Copy Address');
  const clipboardRef = useRef(null);

  function breakAddress(address = "", width = 6) {
    return `${address.slice(0, width)}...${address.slice(-width)}`
  }

  const providerOptions = {
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        rpc: {
          137: 'https://polygon-mumbai.g.alchemy.com/v2/sjbvWTjbyKXxvfJ1HkHIdEDHc2u8wNym',
          4160: "https://api.testnet.algoexplorer.io",
        },
        rpcUrl: ""
      }
    }
  }

  const web3Modal = new Web3Modal({
    // network: "mainnet", // optional
    // cacheProvider: true, // optional
    providerOptions // required
  });

  async function disconnect() {
    if (connector) {
      // const clear = await web3Modal.clearCachedProvider();
      dispatch(setAccount(''));
      dispatch(setConnector())
      setDropdown(false);
      setToggleDropdown(false)
    }
  }


  const toggleWallet = async (e) => {
    // bridge url
    // const bridge = "https://bridge.walletconnect.org";

    let connector
    try {
      connector = await web3Modal.connect();
      // feedbacktype: success
      //await web3Modal.toggleModal();
    } catch (error) {
      dispatch(setNotification('connection failed'))
      //   feedbacktype: error
      return
    }

    const provider = new ethers.providers.Web3Provider(connector);
    const signer = provider.getSigner();
    console.log('info', provider, signer)

    if (provider.connection.url === 'metamask') {
      await dispatch(setConnector(provider));
      const account = await signer.getAddress();
      dispatch(setAccount(account));
    } else {
      await dispatch(setConnector(connector));
      if (!connector.connected) {
        // create new session
        await connector.createSession();
      }
      // Subscribe to connection events
      connector.on("connect", (error, payload) => {
        if (error) {
          dispatch(setNotification('No connected'))
          // feedbacktype: warn              

          throw error;
        }

        // Get provided accounts
        const { accounts } = payload.params[0];
        console.log(payload.params, accounts)
        dispatch(setAccount(accounts[0]));
      });

      connector.on("session_update", (error, payload) => {
        if (error) {
          throw error;
        }

        // Get updated accounts 
        const { accounts } = payload.params[0];
        dispatch(setAccount(accounts[0]));
      });

      if (connector.connected) {
        console.log('ppp', provider, signer)
        const { accounts } = connector;
        dispatch(setAccount(accounts[0]));
      }

      connector.on("disconnect", (error, payload) => {
        if (error) {
          throw error;
        }
      });
    }
    // check if already connected
  };

  const handleSwitch = async () => {
    // implement switch account functionality
  }

  const handleCopy = props => {
    const { navigator, clipboard } = props;
    clipboard.select();
    clipboard.setSelectionRange(0, 99999); /* For mobile devices */
    navigator.clipboard.writeText(clipboard.value);
    setClipboardState('Copied')
    setTimeout(() => {
      setClipboardState('Copy Address')
    }, 850);
  }

  const history = useHistory();

  return (
    (account ?
      <div onClick={() => setDropdown(!dropdown)} className={classes.connected}>
        <div onClick={() => { setToggleDropdown(false); history.push(`/me/${account}`); setToggleNav(false) }} className={classes.user}>
          <img src={userIcon} alt='' />
        </div>
        <div onClick={() => setToggleDropdown(!toggleDropdown)} className={classes.address}>{breakAddress(account)}</div>
        <div className={`${classes.dropdown} ${toggleDropdown && classes.active}`}>
          <div onClick={() => handleCopy({ navigator, clipboard: clipboardRef.current })} className={classes.option}>
            <div>{clipboardState}</div> <img src={copyIcon} alt="" />
            <input style={{ display: 'none' }} ref={clipboardRef} type="text" defaultValue={account} />
          </div>
          {/* <div className={classes.option}>
            <div onClick={handleSwitch}>Switch Wallet</div> <img src={switchIcon} alt="" />
          </div> */}
          <div onClick={disconnect} className={classes.option}>
            <div>Disconnect</div> <img src={disconnectIcon} alt="" />
          </div>
        </div>
      </div>
      :
      <div className={classes.connect} onClick={toggleWallet}>Connect Wallet</div>
    )
  )
}

export default ConnectWallet;