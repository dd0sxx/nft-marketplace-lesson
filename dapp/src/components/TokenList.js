import {useEffect, useState} from 'react';
import TokenCard from './TokenCard'
import '../style/tokens.css'

function TokenList ({provider, address, contract, page, tokensPerPage, totalSupply, setCurrentlyBuying}) {

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
            // setList(list.push(token))
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
                return <TokenCard key={token.id} token={token} setCurrentlyBuying={setCurrentlyBuying}/>
            })}
        </div>
    )
}

export default TokenList;
