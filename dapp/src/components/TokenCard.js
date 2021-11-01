import {useEffect, useState} from 'react';
import { ethers } from 'ethers';

function TokenCard ({id, provider, address, contract}) {

    let isForSale
    let price
    
    async function getPrice() {
        let [isForSale, price] = await contract.isForSale(id)
    }


    getPrice()
    return (
        <div className='tokenCard'>
            <div className='title'>title</div>
            <div>id={id}</div>
            <div className='image' style={{backgroundImage: `url("https://ipfs.io/ipfs/QmVBm9qzvZSPZUF3bYq8QFCMxBdukrfPYi1cGFcYL6wSAY/1.png")`}}></div>
            <div className='price'>{isForSale ? "price: " + price : "not for sale"}</div>
        </div>
    )
}

export default TokenCard;
