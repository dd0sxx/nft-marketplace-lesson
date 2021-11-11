import {useEffect, useState} from 'react';
import { ethers } from 'ethers';
import '../style/app.css';
import Header from './Header.js';
import Profile from './Profile.js';
import TokenList from './TokenList.js';
import tigerNFTABI from '../assets/TigerNFT'
import ChainMsg from './Modal.js'
import BuyDialog from './BuyDialog.js'

function App() {

    const [page, setPage] = useState(0)
    const [profilePageOpen, setProfilePageOpen] = useState(false)
    const [homePageOpen, setHomePageOpen] = useState(false)
    const [walletOfOwner, setWalletOfOwner] = useState([])
    const [address, setAddress] = useState()
    const [chainWarning, setChainWarning] = useState(false)
    const [currentlyBuying, setCurrentlyBuying] = useState(null)
    
    const totalSupply = 100

    let provider
    window.ethereum.enable().then(provider = new ethers.providers.Web3Provider(window.ethereum, "rinkeby"))
    const signer = provider.getSigner()
    window.signer = signer
    const nftAddr = '0xDC04D8183a0C91c40E02dd5a0e06Ee6a2D25685F'
    const contract = new ethers.Contract(nftAddr, tigerNFTABI, provider);
    const rinkeby_chain = "0x4"
    const tokensPerPage = 12

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
        let balance = await contract.getBalance(address)
        console.log('woof', balance)
        // for (let i = 0; i < balance; i++) {
        //     let token = await contract.tigerByOwnerAndIndex(address, i)
        //     setWalletOfOwner(walletOfOwner.push(token))
        // }
    }

    useEffect(() => {connectToMetamask().catch(err => console.error(err))}, [])

    // useEffect(() => {
    //    getWalletOfOwner().then(() => console.log(walletOfOwner)).catch(err => console.error(err))
    // }, [address])

    return (
        <div className="app">
        <Header address={address} connect={connectToMetamask} setHomePageOpen={setHomePageOpen} setProfilePageOpen={setProfilePageOpen}/>
        {   profilePageOpen && !homePageOpen ?
            <Profile walletOfOwner={walletOfOwner} provider={provider} address={address} contract={contract}/>
                :
                <div>
            <TokenList provider={provider} address={address} contract={contract} page={page} tokensPerPage={tokensPerPage} totalSupply={totalSupply} setCurrentlyBuying={setCurrentlyBuying}/>
            <div className='flex-centered '>
            <div className='page-button'>Page:</div>
            {page > 0 ? <div className='page-button' onClick={() => {setPage(page - 1)}}>Prev</div> : <></>}
            {((page + 1) * tokensPerPage) < totalSupply ? <div className='page-button' onClick={() => {setPage(page + 1)}}>Next</div> : <></>}
            </div>
            <ChainMsg open={chainWarning} setOpen={setChainWarning}/>
            <BuyDialog currentlyBuying={currentlyBuying} setCurrentlyBuying={setCurrentlyBuying} contract={contract} address={address} signer={signer}/>
            </div>
        }
        </div>
    );
}

export default App;
