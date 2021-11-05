import {useEffect, useState} from 'react';
import { ethers } from 'ethers';
import '../style/header.css'
import walletSVG from '../assets/wallet.svg'

function Header ({address, connect, profilePageOpen, setProfilePageOpen}) {

    const setProfile = () => {
        profilePageOpen ? setProfilePageOpen(false) : setProfilePageOpen(true)
        console.log(profilePageOpen)
    }

    return (
        <div className='header flex-centered'>
            <h1>Tiger NFT</h1>
            <div className='wallet flex-centered'>
                <div onClick={setProfile} style={{ backgroundImage: `url(${walletSVG})`, width: 30, height: 30, backgroundSize: 'fit'}} />
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