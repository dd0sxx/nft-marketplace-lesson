import {useEffect, useState} from 'react';
import { ethers } from 'ethers';

function TokenCard ({id, provider, address, contract}) {

    let isForSale
    let price
    let onlySellTo
    
    async function getPrice() {
        let saleInfo = await contract.isForSale(id)
        let [isForSale, price] = saleInfo
    }

    getPrice()
    return (
        <div className='tokenCard'>
            <div className='title'>title</div>
            <div>id={id}</div>
            {/* replace the next line background image with token id when all the images go online */}
            <div className='image' style={{backgroundImage: `url("https://ipfs.io/ipfs/QmVBm9qzvZSPZUF3bYq8QFCMxBdukrfPYi1cGFcYL6wSAY/1.png")`}}></div>
            <div className='price'>price {isForSale ? price : "not for sale"}</div>
        </div>
    )
}

export default TokenCard;
