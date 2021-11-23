import {useEffect, useState} from 'react';
import TokenCard from './TokenCard'
import '../style/tokens.css'

let currentTokenList = []
let lastBoughtTigerId
let lastTigerBuyer

function TokenList ({provider, address, contract, page, tokensPerPage, totalSupply, setCurrentlyBuying, walletOfOwner, sortBy}) {

    const [loadedSoFar, setLoadedSoFar] = useState(0)

    async function buyEventListener(tigerId, price, buyer) {
        console.log(`TigerBought tigerId ${tigerId}`)
        if (tigerId && buyer) {
            window.buyer = buyer
            if (lastBoughtTigerId && tigerId.eq(lastBoughtTigerId) &&
                lastTigerBuyer && buyer.equals(lastTigerBuyer)) {
                return
            }
            lastBoughtTigerId = tigerId
            lastTigerBuyer = buyer
            setCurrentlyBuying(null)
            await getPriceInfoFor(tigerId)
        }
    }
    
    async function handleBuyEventSubscription () {
        await contract.on("TigerBought", buyEventListener)
        return async () => { await contract.off("TigerBought", buyEventListener)}
    }
    
    useEffect(() => {return handleBuyEventSubscription()}, [])

 
    async function getPriceInfoFor(id) {
        const tokenList = currentTokenList.slice()
        let isForSale, price
        ;[isForSale, price] = await contract.isForSale(id)
        let token = {id: id, isForSale: isForSale, price: price}
        tokenList[id] = token
        currentTokenList = tokenList
        setLoadedSoFar(n => {return n + 1})
    }
    
    async function getPriceInfo() {
        setLoadedSoFar(0)
            for (let id = 0; id < totalSupply; id++) {
                await getPriceInfoFor(id)
            }


    }

    useEffect(() => {getPriceInfo()}, [])

    if (loadedSoFar > (page * tokensPerPage)) {
        return (<div className='tokenList'>
                {
                    sortBy === 0 ?
                        currentTokenList.slice(page * tokensPerPage, page * tokensPerPage + tokensPerPage).map(token =>  {
                            return <TokenCard key={token.id} token={token} setCurrentlyBuying={setCurrentlyBuying}/>
                        })
                    :
                    sortBy === 1 ?
                        <></>
                    :
                    sortBy === 2 ?
                        <></>
                    :
                    sortBy === 3 ?
                    walletOfOwner.slice(page * tokensPerPage, page * tokensPerPage + tokensPerPage).map(token =>  {
                        return <TokenCard key={currentTokenList[Number(token)]} token={currentTokenList[Number(token)]} setCurrentlyBuying={setCurrentlyBuying}/>
                    })
                    :
                    sortBy === 4 ?
                        <></>
                    : 
                        <></>
                }
                </div>)
    } else {
        return (<div>Loading Tigers...</div>)
    }
}

export default TokenList;
