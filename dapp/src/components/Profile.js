import { Contract } from 'ethers';
import {useEffect, useState} from 'react';
import TokenCard from './TokenCard';
import '../style/profile.css'

function Profile ({walletOfOwner, provider, address, contract}) {

     console.log('walletOfOwner: ', walletOfOwner)

    return (
        <div className='profile'>
            {walletOfOwner.map(token => {
                <TokenCard id={token} provider={provider} address={address} contract={contract}/>
            })}
        </div>
    )
}

export default Profile;
