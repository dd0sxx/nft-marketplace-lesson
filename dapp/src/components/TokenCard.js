import {useEffect, useState} from 'react';
import { ethers } from 'ethers';

function TokenCard ({id, provider, address, contract}) {

    const [isForSale, setIsForSale] = useState([])
    const [price, setPrice] = useState([])
    
    async function getPriceInfo() {
        let _isForSale, _price
        [_isForSale, _price] = await contract.isForSale(id)
        setIsForSale(_isForSale)
        setPrice(_price)
    }

    useEffect(() => {getPriceInfo()}, [])

    return (
        <div className='tokenCard'>
            <div className='title'>title</div>
            <div>id={id}</div>
            {/* replace the next line background image with token id when all the images go online */}
            <div className='image' style={{backgroundImage: `url("https://ipfs.io/ipfs/QmZWUmdscMCmvvZfNp3BwTvLim26hsDT8BqAYxjFHWjgQ2/${id}.png")`}}></div>
            <div className='price'>{isForSale ? "price: " + ethers.utils.formatEther(price) : "not for sale"}</div>
        </div>
    )
}

export default TokenCard;
