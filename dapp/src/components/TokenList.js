import {useEffect, useState} from 'react';
import TokenCard from './TokenCard'
import '../style/tokens.css'

let currentTokenList = []

function TokenList ({provider, address, contract, page, tokensPerPage, totalSupply, setCurrentlyBuying}) {

    const [loadedSoFar, setLoadedSoFar] = useState(0)

    async function getPriceInfo() {
        for (let id = 0; id < totalSupply; id++) {
            const tokenList = currentTokenList.slice()
            let isForSale, price
            [isForSale, price] = await contract.isForSale(id)
            let token = {id: id, isForSale: isForSale, price: price}
            tokenList[id] = token
            currentTokenList = tokenList
            setLoadedSoFar(id + 1)
        }
    }

    useEffect(() => {getPriceInfo()}, [])

    if (loadedSoFar > (page * tokensPerPage)) {
        return (<div className='tokenList'>
                {
                    currentTokenList.slice(page * tokensPerPage, page * tokensPerPage + tokensPerPage).map(token =>  {
                        return <TokenCard key={token.id} token={token} setCurrentlyBuying={setCurrentlyBuying}/>
                    })
                }
            </div>)
    } else {
        return (<div>Loading Tigers...</div>)
    }
}

export default TokenList;
