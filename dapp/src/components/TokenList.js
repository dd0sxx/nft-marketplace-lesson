import {useEffect, useState} from 'react';
import { ethers } from 'ethers';
import TokenCard from './TokenCard'
import '../style/tokens.css'

function TokenList ({provider, address, contract, page, tokensPerPage, totalSupply}) {

    const [list, setList] = useState([])


    async function getPriceInfo() {
        for (let id = 0; id < totalSupply; id++) {
            let isForSale, price
            [isForSale, price] = await contract.isForSale(id)
            let token = {id: id, isForSale: isForSale, price: price}            
            setList(a => {
                a.push(token)
                return a
            })
            if (id === tokensPerPage) {
                setList(a => {
                    return a.slice()
                })
            }
        }
        setList(a => {return a.slice()})
    }

    useEffect(() => {getPriceInfo()}, [])

    return (
        <div className='tokenList'>
            {list.slice(page * tokensPerPage, page * tokensPerPage + tokensPerPage).map(token =>  {
                return <TokenCard id={token.id} isForSale={token.isForSale} price={token.price}/>
            })}
        </div>
    )
}

export default TokenList;
