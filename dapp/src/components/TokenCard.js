import {useEffect, useState} from 'react';
import { ethers } from 'ethers';

function TokenCard ({id, provider, address, connect}) {

    return (
        <div className='tokenCard'>
            <div className='title'>title</div>
            <div>id={id}</div>
            <div className='image'></div>
            <div className='price'>price</div>
        </div>
    )
}

export default TokenCard;
