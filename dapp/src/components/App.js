import {useEffect, useState} from 'react';
import { ethers } from 'ethers';
import '../style/app.css';
import Header from './Header.js';
import TokenList from './TokenList.js';
import tigerNFTABI from '../assets/tigerNFT'

function App() {

    const [page, setPage] = useState(0)
    const [chainId, setChainId] = useState(-1)

    let provider
    window.ethereum.enable().then(provider = new ethers.providers.Web3Provider(window.ethereum, "rinkeby"))
    const signer = provider.getSigner()
    const [address, setAddress] = useState()
    const nftAddr = '0x65eeD93FE9343A0b1f5E6C2a4Ed5FC715a3813d8'
    const contract = new ethers.Contract(nftAddr, tigerNFTABI, provider);

    window.ethereum.on('chainChanged', handleChainChanged);

    function handleChainChanged(_chainId) {
        if (_chainId !== 4) {
           //show modal "please connect to Rinkeby network"
        }
        setChainId(_chainId)
        window.location.reload()
    }

    async function connectToMetamask() {
        try {
            let res = await signer.getAddress()
            console.log("Signed in", res)
            setAddress(res)
            setChainId(await window.ethereum.request({ method: 'eth_chainId' }))
            if (chainId !== 4) {
                console.log("please connect to Rinkeby network")
            }
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
            {/*debug, display chain id*/}
            <div>network id: {chainId}</div>
            <TokenList provider={provider} address={address} contract={contract} page={page}/>
            <div className='flex-centered '>
            <div className='page-button'>Page:</div>
            {page > 0 ? <div className='page-button' onClick={() => {setPage(page - 50)}}>Prev</div> : <></>}
            <div className='page-button' onClick={() => {setPage(page + 50)}}>Next</div>
            </div>
            </div>
    );
}

export default App;
