import {useEffect, useState} from 'react';
import { ethers } from 'ethers';
import '../style/header.css'

function Header ({provider, address, connect}) {

    return (
        <div className='header'>
            <h1>Tiger NFT</h1>
            <div onClick={(connect)} className='address'>{
                address ?
                `${address.slice(0,6)}...${address.slice(-4)}` :
                'connect to metamask!'
            }</div>
        </div>
    )
}

export default Header