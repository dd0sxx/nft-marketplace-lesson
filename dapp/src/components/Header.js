import {useEffect, useState} from 'react';
import { ethers } from 'ethers';
import '../style/header.css'

function Header ({address, connect, sortOptions, setSortBy}) {

    function setSort (e) {
        sortOptions.forEach((item, i) => {
            if (e.target.value === item) setSortBy(i)
        })
    }

    return (
        <div className='header flex-centered'>
        <h1>Tiger NFT</h1>
        <div className='flex'>
            <div>sort: </div>
            <select onChange={(e) => setSort(e)} style={{marginLeft: 5, border: '1px solid black'}}>
                {
                sortOptions.map( (option, i) => (
                    <option key={i}>
                        {option}</option>
                ))
                }
            </select>
        </div>
        <div onClick={connect} className='address'>{
            address ?
            `${address.slice(0,6)}...${address.slice(-4)}` :
            'connect to metamask!'
        }</div>
        </div>
    )
}

export default Header
