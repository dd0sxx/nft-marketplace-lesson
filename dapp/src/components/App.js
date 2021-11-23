import {useEffect, useState} from 'react';
import { ethers } from 'ethers';
import '../style/app.css';
import Header from './Header.js';
import TokenList from './TokenList.js';
import tigerNFTABI from '../assets/TigerNFT'
import ChainMsg from './Modal.js'
import BuyDialog from './BuyDialog.js'

function App() {

    const [page, setPage] = useState(0)
    const [walletOfOwner, setWalletOfOwner] = useState([])
    const [address, setAddress] = useState()
    const [chainWarning, setChainWarning] = useState(false)
    const [currentlyBuying, setCurrentlyBuying] = useState(null)
    const [sortBy, setSortBy] = useState(0)
    
    const totalSupply = 100

    let provider
    window.ethereum.enable().then(provider = new ethers.providers.Web3Provider(window.ethereum, "rinkeby"))
    const signer = provider.getSigner()
    window.signer = signer
    const nftAddr = '0xDC04D8183a0C91c40E02dd5a0e06Ee6a2D25685F'
    const contract = new ethers.Contract(nftAddr, tigerNFTABI, provider);
    const rinkeby_chain = "0x4"
    const tokensPerPage = 12

    const sortOptions = ['by id', 'price low to high', 'price high to low', 'by tokens owned', 'last sold']

    window.ethereum.on('chainChanged', handleChainChanged);

    function handleChainChanged(_chainId) {
        if (_chainId.toString() !== rinkeby_chain) {
            setChainWarning(true)
        }
        window.location.reload()
    }

    async function connectToMetamask() {
        try {
            let res = await signer.getAddress()
            console.log("Signed in", res)
            setAddress(res)
            let _chainId = (await window.ethereum.request({ method: 'eth_chainId' }))
            if (_chainId.toString() !== rinkeby_chain) {
                setChainWarning(true)
            }
        }
        catch(err) {
            console.log("Not signed in")
            await provider.send("eth_requestAccounts", [])
        }
    }

    const getWalletOfOwner = async () => {
        console.log('meow')
        let balanceBN = await contract.getBalance(address)
        let balance = Number(balanceBN)
        let temp = [...walletOfOwner]
        for (let i = 0; i < balance; i++) {
            let token = await contract.tigerByOwnerAndIndex(address, i)
            temp.push(token)
        }
        console.log('temp: ',temp)
        await setWalletOfOwner(temp)
        return walletOfOwner
    }

    useEffect(() => {connectToMetamask().catch(err => console.error(err))}, [])

    useEffect(() => {
        if (address) getWalletOfOwner().catch(err => console.error(err))
    }, [address])

    return (
        <div className="app">
        <Header address={address} connect={connectToMetamask} sortOptions={sortOptions} setSortBy={setSortBy}/>
        <TokenList provider={provider} address={address} contract={contract} page={page} tokensPerPage={tokensPerPage} totalSupply={totalSupply} sortBy={sortBy}
        setCurrentlyBuying={setCurrentlyBuying} walletOfOwner={walletOfOwner}/>
            <div className='flex-centered '>
            <div className='page-button'>Page:</div>
            {page > 0 ? <div className='page-button' onClick={() => {setPage(page - 1)}}>Prev</div> : <></>}
            {((page + 1) * tokensPerPage) < totalSupply ? <div className='page-button' onClick={() => {setPage(page + 1)}}>Next</div> : <></>}
            </div>
            <ChainMsg open={chainWarning} setOpen={setChainWarning}/>
            <BuyDialog currentlyBuying={currentlyBuying} setCurrentlyBuying={setCurrentlyBuying} contract={contract} address={address} signer={signer}/>
            </div>
        );
    }

    export default App;
