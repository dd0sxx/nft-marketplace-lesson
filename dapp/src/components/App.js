import {useEffect, useState} from 'react';
import { ethers } from 'ethers';
import '../style/app.css';
import Header from './Header.js';
import Profile from './Profile.js';
import TokenList from './TokenList.js';
import tigerNFTABI from '../assets/tigerNFT'
import ChainMsg from './Modal.js'

function App() {

    const [page, setPage] = useState(0)
    const [profilePageOpen, setProfilePageOpen] = useState(false)
    const [chainId, setChainId] = useState(-1)
    const [walletOfOwner, setWalletOfOwner] = useState([])
    
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

    const getWalletOfOwner = async () => {
        for (let i = 0; i < 100; i++) {
            if (await contract.getOwner(i) == address) {
                setWalletOfOwner(walletOfOwner.push(i))
            } 
        }
    }

    useEffect(() => {connectToMetamask().catch(err => console.error(err))}, [])

    useEffect(() => {
        getWalletOfOwner().then(() => console.log(walletOfOwner)).catch(err => console.error(err))
    }, [address])

    return (
            <div className="app">
            <Header address={address} connect={connectToMetamask} profilePageOpen={profilePageOpen} setProfilePageOpen={setProfilePageOpen}/>
            {   profilePageOpen ?
                <Profile walletOfOwner={walletOfOwner} />
                :
                <div>
                    <TokenList provider={provider} address={address} contract={contract} page={page} tokensPerPage={tokensPerPage} totalSupply={totalSupply}/>
                    <div className='flex-centered '>
                    <div className='page-button'>Page:</div>
                    {page > 0 ? <div className='page-button' onClick={() => {setPage(page - 1)}}>Prev</div> : <></>}
                    {((page + 1) * tokensPerPage) < totalSupply ? <div className='page-button' onClick={() => {setPage(page + 1)}}>Next</div> : <></>}
                    </div>
                    <ChainMsg open={chainWarning} setOpen={setChainWarning}/>
                </div>
            }
            </div>
    );
}

export default App;
