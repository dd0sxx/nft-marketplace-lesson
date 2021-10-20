import {useEffect, useState} from 'react';
import { ethers } from 'ethers';

function TokenCard ({provider, address, connect}) {

    return (
        <div className='tokenCard'>
            <div className='title'>title</div>
            <div className='image'></div>
            <div className='price'>price</div>
        </div>
    )
}

export default TokenCard;