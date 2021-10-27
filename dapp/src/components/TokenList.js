import {useEffect, useState} from 'react';
import { ethers } from 'ethers';
import TokenCard from './TokenCard'
import '../style/tokens.css'

function TokenList ({provider, address, contract, page, tokensPerPage}) {

    const totalSupply = 100
    const [list, setList] = useState([])


    useEffect(() => {
        let tempArray = []
        for (let i = 0; i < totalSupply; i++) {
            tempArray.push(i)
        }
        setList(tempArray)
    }, [])

    return (
        <div className='tokenList'>
            {list.slice(page * tokensPerPage, page * tokensPerPage + tokensPerPage).map((_, id) =>  {
                return <TokenCard id={id} provider={provider} address={address} contract={contract}/>
            })}
        </div>
    )
}

export default TokenList;
