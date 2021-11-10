import {useEffect, useState} from 'react';
import { ethers } from 'ethers';
import '../style/header.css'
import walletSVG from '../assets/wallet.svg'

function Header ({address, connect, setHomePageOpen, setProfilePageOpen}) {

    const setProfile = () => {
        setProfilePageOpen(true)
        setHomePageOpen(false)
    }

    const setHome = () => {
        setProfilePageOpen(false)
        setHomePageOpen(true)
    }

    return (
        <div className='header flex-centered'>
            <h1 onClick={setHome}>Tiger NFT</h1>
            <div className='wallet flex-centered'>
                <div onClick={setProfile} style={{ backgroundImage: `url(${walletSVG})`, width: 30, height: 30, backgroundSize: 'fit', backgroundRepeat: 'no-repeat', marginRight: 10}} />
                <div onClick={connect} className='address'>{
                    address ?
                    `${address.slice(0,6)}...${address.slice(-4)}` :
                    'connect to metamask!'
                }</div>
            </div>
        </div>
    )
}

export default Header