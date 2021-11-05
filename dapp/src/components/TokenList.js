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
                console.log(`before a[0]?.id ${a[0]?.id} a[1]?.id ${a[1]?.id} a[2]?.id ${a[2]?.id}`)
                a.push(token)
                console.log(`after  a[0]?.id ${a[0]?.id} a[1]?.id ${a[1]?.id} a[2]?.id ${a[2]?.id}`)
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
