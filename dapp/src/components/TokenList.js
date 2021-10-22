import {useEffect, useState} from 'react';
import { ethers } from 'ethers';
import TokenCard from './TokenCard'
import '../style/tokens.css'

function TokenList ({provider, address, connect, contract, page}) {

    const [totalSupply, setTotalSupply] = useState(1000)
    const [list, setList] = useState([])


    useEffect(() => {
        let tempArray = []
        for (let i = 0; i < 1000; i++) {
            tempArray.push(i)
        }
        setList(tempArray)
    }, [])

    return (
        <div className='tokenList'>
            {list.slice(page * 50, page * 50 + 50).map((_, id) =>  {
                return <TokenCard />
            })}
        </div>
    )
}

export default TokenList;