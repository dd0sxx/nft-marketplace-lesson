import { useState } from 'react';
import { ethers } from 'ethers';
import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import ethSVG from '../assets/eth-symbol-virgil.svg'

export default function BuyDialog({currentlyBuying, setCurrentlyBuying, contract, address, signer}) {

    const [processing, setProcessing] = useState(false)

    function closeModal() {
        setCurrentlyBuying(null)
        setProcessing(false)
    }

    function formatEtherPercentage(percentage) {
        if (currentlyBuying) {
            return ethers.utils.formatEther(currentlyBuying.price.mul(percentage).div(100).toString())
        }
        return ""
    }

    async function buyToken() {
        setProcessing(true)
        await contract.connect(signer).buyTiger(currentlyBuying.id, {value: currentlyBuying.price})
    }
    
    function buttonsEnabled() {
        return processing ? "false" : "true"
    }

    return (
        <Transition appear show={currentlyBuying !== null} as={Fragment}>
        <Dialog as="div" className="fixed inset-0 z-10 overflow-y-auto"onClose={closeModal}>
        <div className="min-h-screen px-4 text-center">
        <Transition.Child
        as={Fragment}
        enter="ease-out duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
        >
        <Dialog.Overlay className="fixed inset-0 bg-gray-400 bg-opacity-70 transition-opacity" />
        </Transition.Child>

        {/* This element is to trick the browser into centering the modal contents. */}
        <span
        className="inline-block h-screen align-middle" aria-hidden="true">
                                                                  &#8203;
        </span>
        <Transition.Child
        as={Fragment}
        enter="ease-out duration-300"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
        >
        <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
        <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
        Buy Tiger #{currentlyBuying?.id}
        </Dialog.Title>
        {processing ?
         (<div className='mt-2'>
             <p>Processing</p>
             <p>Please confirm the transaction in your wallet, then wait...</p>
             </div>)
:
         (<div>
             <div className="mt-2">
             <div className="flex items-center text-sm text-gray-500">
             You will pay {formatEtherPercentage(100)}
             <div style={{backgroundImage: `url("${ethSVG}")`, backgroundRepeat: 'no', backgroundSize: 'contain', width: 10, height: 10}}/>
             </div>
             <div className="text-sm text-gray-500">Of which:</div>
             <div className="flex items-center text-sm text-gray-500">
             the current owner will get 94%, which is {formatEtherPercentage(94)}
             <div style={{backgroundImage: `url("${ethSVG}")`, backgroundRepeat: 'no', backgroundSize: 'contain', width: 10, height: 10}}/>
             </div>
             <div className="flex items-center text-sm text-gray-500">
             the artist will get 5%, which is {formatEtherPercentage(5)}
             <div style={{backgroundImage: `url("${ethSVG}")`, backgroundRepeat: 'no', backgroundSize: 'contain', width: 10, height: 10}}/>
             </div>
             <div className="flex items-center text-sm text-gray-500">
             the contract treasury will get 1%, which is {formatEtherPercentage(1)}
             <div style={{backgroundImage: `url("${ethSVG}")`, backgroundRepeat: 'no', backgroundSize: 'contain', width: 10, height: 10}}/>
             </div>
             </div>
             <div className="space-x-4 mt-4">
             <button
             type="button"
             className="inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
             onClick={buyToken}
             enabled={buttonsEnabled()}
             >
             Buy
             </button>
             <button
             type="button"
             className="inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
             onClick={closeModal}
             enabled={buttonsEnabled()}
             >
             Cancel
             </button>
             </div>
             </div>)}
        </div>
        </Transition.Child>
        </div>
        </Dialog>
        </Transition>
    )
}
