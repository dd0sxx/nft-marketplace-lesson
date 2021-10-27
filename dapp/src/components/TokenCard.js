import {useEffect, useState} from 'react';
import { ethers } from 'ethers';

function TokenCard ({id, provider, address, contract}) {

    let isForSale
    let price
    let onlySellTo
    
    async function getPrice() {
        let saleInfo = await contract.isForSale(id)
        console.log("sale info", saleInfo)
        // {isForSale, _, price, onlySellTo} = saleInfo
    }
    getPrice()
    return (
        <div className='tokenCard'>
            <div className='title'>title</div>
            <div>id={id}</div>
            <div className='image'></div>
            <div className='price'>price {isForSale ? price : "not for sale"}</div>
        </div>
    )
}

export default TokenCard;
