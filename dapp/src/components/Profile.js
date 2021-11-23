import { Contract } from 'ethers';
import {useEffect, useState} from 'react';
import TokenList from './TokenList';
import '../style/profile.css'

function Profile ({walletOfOwner, provider, address, contract, page, tokensPerPage, totalSupply, setCurrentlyBuying}) {

     console.log('walletOfOwner: ', walletOfOwner)

    return (
        <div className='profile'>
            {typeof(walletOfOwner) == 'object' ? walletOfOwner.map(token => {
                <TokenList page={page} tokensPerPage={tokensPerPage} totalSupply={totalSupply} setCurrentlyBuying={setCurrentlyBuying} provider={provider} address={address} contract={contract}/>
            }) 
            :
            <>...</>
        }
        </div>
    )
}

export default Profile;
