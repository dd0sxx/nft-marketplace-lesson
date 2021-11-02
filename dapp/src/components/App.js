import {useEffect, useState} from 'react';
import { ethers } from 'ethers';
import '../style/app.css';
import Header from './Header.js';
import TokenList from './TokenList.js';
import tigerNFTABI from '../assets/tigerNFT'
import ChainMsg from './Modal.js'

function App() {

    const [page, setPage] = useState(0)
    const [chainId, setChainId] = useState(-1)
    const totalSupply = 100

    let provider
    window.ethereum.enable().then(provider = new ethers.providers.Web3Provider(window.ethereum, "rinkeby"))
    const signer = provider.getSigner()
    const [address, setAddress] = useState()
    const [chainWarning, setChainWarning] = useState(false)
    const nftAddr = '0x65eeD93FE9343A0b1f5E6C2a4Ed5FC715a3813d8'
    const contract = new ethers.Contract(nftAddr, tigerNFTABI, provider);
    const rinkeby_chain = "0x4"
    const tokensPerPage = 12

    window.ethereum.on('chainChanged', handleChainChanged);

    function handleChainChanged(_chainId) {
        if (_chainId.toString() !== rinkeby_chain) {
            setChainWarning(true)
        }
        setChainId(_chainId)
        window.location.reload()
    }

    async function connectToMetamask() {
        try {
            let res = await signer.getAddress()
            console.log("Signed in", res)
            setAddress(res)
            let _chainId = (await window.ethereum.request({ method: 'eth_chainId' }))
            setChainId(_chainId)
            if (_chainId.toString() !== rinkeby_chain) {
                setChainWarning(true)
            }
        }
        catch(err) {
            console.log("Not signed in")
            await provider.send("eth_requestAccounts", [])
        }
    }

    // async function initForTesting() {
    //     console.log("is for sale before: " + await contract.isForSale(1))
    //     await contract.connect(signer).putUpForSale(1, ethers.utils.parseEther("1"))
    //     console.log("is for sale after: " + await contract.isForSale(1))
    // }
    
    useEffect(() => {connectToMetamask().catch(err => console.error(err))}, [])
    // useEffect(() => {initForTesting()}, [])


    return (
            <div className="app">
            <Header address={address} connect={connectToMetamask}/>
            <TokenList provider={provider} address={address} contract={contract} page={page} tokensPerPage={tokensPerPage} totalSupply={totalSupply}/>
            <div className='flex-centered '>
            <div className='page-button'>Page:</div>
            {page > 0 ? <div className='page-button' onClick={() => {setPage(page - 1)}}>Prev</div> : <></>}
        {((page + 1) * tokensPerPage) < totalSupply ? <div className='page-button' onClick={() => {setPage(page + 1)}}>Next</div> : <></>}
            </div>
            <ChainMsg open={chainWarning} setOpen={setChainWarning}/>
            </div>
    );
}

export default App;
