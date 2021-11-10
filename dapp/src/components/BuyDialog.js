import { ethers } from 'ethers';
import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'

export default function BuyDialog({currentlyBuying, setCurrentlyBuying, contract, address, signer}) {

    function closeModal() {
        setCurrentlyBuying(null)
    }

    function formatEtherPercentage(percentage) {
        if (currentlyBuying) {
            return ethers.utils.formatEther(currentlyBuying.price.mul(percentage).div(100).toString())
        }
        return ""
    }

    async function buyToken() {
        await contract.connect(signer).buyTiger(currentlyBuying.id, {value: currentlyBuying.price})
        currentlyBuying.processingPurchase = true
    }
    
    function buttonsEnabled() {
        return currentlyBuying?.processingPurchase ? "false" : "true"
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
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
          You will pay {formatEtherPercentage(100)}
                  </p>
                  <p className="text-sm text-gray-500">
          Current owner will get {formatEtherPercentage(94)}
                  </p>
                  <p className="text-sm text-gray-500">
          Artist will get {formatEtherPercentage(5)}
                  </p>
                  <p className="text-sm text-gray-500">
          Contract treasury will get {formatEtherPercentage(1)}
                  </p>
              </div>
                <div className="mt-4">
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
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
  )
}
