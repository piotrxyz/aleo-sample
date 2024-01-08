'use client'

import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { useTransaction } from '@/app/hooks'
import { useWallet } from '@demox-labs/aleo-wallet-adapter-react'

export default function Mint() {
  const { publicKey } = useWallet()
  const { tx, txStatus } = useTransaction()

  const [mintAmount, setMintAmount] = useState('')
  const [inputs, setInputs] = useState<any[]>([])
  const [receiver, setReceiver] = useState('')

  useEffect(() => {
    setInputs([receiver, `${mintAmount}u64`])

    if (!publicKey) return
    setReceiver(publicKey)
  }, [mintAmount, publicKey, receiver])

  return (
    <form
      className="mt-10 flex flex-col gap-4 max-w-2xl"
    >
      <h2 className="text-2xl">Mint token</h2>
      <div className="flex flex-col gap-4">
        <label htmlFor="mintReceiver">Receiver</label>
        <input
          className="h-11 w-full appearance-none rounded-lg border-2 border-gray-200 bg-transparent py-1 text-sm tracking-tighter text-gray-900 outline-none transition-all placeholder:text-gray-600 focus:border-gray-900 ltr:pr-5 ltr:pl-10 rtl:pr-10 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-gray-500 px-4"
          placeholder="Amount to mint (public) in microcredits i.e. 1 credit = 1_000_000 microcredits"
          id="mintReceiver"
          type="text"
          autoComplete="off"
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            setReceiver(event.target.value)
          }
          value={receiver}
          required
        />
      </div>
      <div className="flex flex-col gap-4">
        <label htmlFor="mintAmount">Amount</label>
        <input
          className="h-11 w-full appearance-none rounded-lg border-2 border-gray-200 bg-transparent py-1 text-sm tracking-tighter text-gray-900 outline-none transition-all placeholder:text-gray-600 focus:border-gray-900 ltr:pr-5 ltr:pl-10 rtl:pr-10 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-gray-500 px-4"
          placeholder="Amount to mint in microcredits i.e. 1 credit = 1_000_000 microcredits"
          id="mintAmount"
          type="text"
          autoComplete="off"
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            setMintAmount(event.target.value)
          }
          value={mintAmount}
          required
        />
      </div>
      <div className="flex gap-4">
        <button
          className="h-11 w-full bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all"
          type="submit"
          onClick={async (event: FormEvent) => {
            await tx(publicKey, event, inputs, 5_000_000, 'mint_public', true)
          }}
        >
          Mint public
        </button>
        <button
          className="h-11 w-full bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all"
          type="submit"
          onClick={async (event: FormEvent) => {
            await tx(publicKey, event, inputs, 5_000_000, 'mint_private', true)
          }}
        >
          Mint private
        </button>
      </div>
      <div>
        Transaction status: {txStatus ? txStatus : 'N/A'}
      </div>
    </form>
  )
}
