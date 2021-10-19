import {useEffect, useState} from 'react';
import { ethers } from 'ethers';
import '../style/app.css';
import Header from './Header.js';

function App() {

  let provider
  window.ethereum.enable().then(provider = new ethers.providers.Web3Provider(window.ethereum))
  const signer = provider.getSigner()
  const [address, setAddress] = useState()

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

  // const nftAddr = '' // contract abi
  // const contract = new ethers.Contract(nftAddr, contractAbi, provider);

  return (
    <div className="App">
      <Header provider={provider} address={address} connect={connectToMetamask}/>
    </div>
  );
}

export default App;
