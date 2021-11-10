import { ethers } from 'ethers';
import ethSVG from '../assets/eth-symbol-virgil.svg'

function TokenCard ({token, setCurrentlyBuying}) {

    return (
        <div className='tokenCard'>
          <div className='title'>Tiger #{token.id}</div>
          <div className='image' style={{backgroundImage: `url("https://ipfs.io/ipfs/QmZWUmdscMCmvvZfNp3BwTvLim26hsDT8BqAYxjFHWjgQ2/${token.id}.png")`}} />
          {token.isForSale ? (
              token.processingPurchase ? (
                  <div className='page-button'>Processing, please wait...</div>
              )
                  :(<div className='flex-centered'>
                      <div style={{paddingRight: 5}}>price:</div>
                      <div className='price'>{ethers.utils.formatEther(token.price)}</div>
                      <div style={{backgroundImage: `url("${ethSVG}")`, backgroundRepeat: 'no', backgroundSize: 'contain', width: 20, height: 20}}/>
                      <div className="page-button" onClick={() => setCurrentlyBuying(token)}>Buy Now</div>
                    </div>))
           :
           <div className='page-button'>Not For Sale</div>
          }
        </div>
    )
}

export default TokenCard;
