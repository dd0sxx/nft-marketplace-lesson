import {useEffect, useState} from 'react';
import { ethers } from 'ethers';
import '../style/app.css';
import Header from './Header.js';
import TokenList from './TokenList.js';
import tigerNFTABI from '../assets/tigerNFT'

function App() {

  let provider
  window.ethereum.enable().then(provider = new ethers.providers.Web3Provider(window.ethereum))
  const signer = provider.getSigner()
  const [address, setAddress] = useState()
  const nftAddr = '0x65eeD93FE9343A0b1f5E6C2a4Ed5FC715a3813d8'
  const contract = new ethers.Contract(nftAddr, tigerNFTABI, provider);

  async function connectToMetamask() {
    try {
      let res = await signer.getAddress()
      console.log("Signed in", res)
      setAddress(res)
    }
    catch(err) {
      console.log("Not signed in")
      await provider.send("eth_requestAccounts", [])
    }
  }

  useEffect(() => {
    connectToMetamask().catch(err => console.error(err))
  }, [])


  return (
    <div className="app">
      <Header provider={provider} address={address} connect={connectToMetamask}/>
      <TokenList provider={provider} address={address} contract={contract}/>
    </div>
  );
}

export default App;
