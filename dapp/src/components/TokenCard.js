import {useEffect, useState} from 'react';
import { ethers } from 'ethers';
import ethSVG from '../assets/eth-symbol-virgil.svg'

function TokenCard ({id, isForSale, price}) {

    return (
        <div className='tokenCard'>
            <div className='title'>Tiger #{id}</div>
            <div className='image' style={{backgroundImage: `url("https://ipfs.io/ipfs/QmZWUmdscMCmvvZfNp3BwTvLim26hsDT8BqAYxjFHWjgQ2/${id}.png")`}} />
                {isForSale ?
                    <div className='flex-centered'>
                        <div style={{paddingRight: 5}}>price:</div>
                        <div className='price'>{ethers.utils.formatEther(price)}</div>
                        <div style={{backgroundImage: `url("${ethSVG}")`, backgroundRepeat: 'no', backgroundSize: 'contain', width: 20, height: 20}}/>
                    </div>
                    :
                    <div className='price'>"not for sale"</div>
                }
        </div>
    )
}

export default TokenCard;
