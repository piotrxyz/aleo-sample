'use client'


import {
  Deployment,
  WalletAdapterNetwork,
  WalletNotConnectedError,
} from '@demox-labs/aleo-wallet-adapter-base'
import { useWallet } from '@demox-labs/aleo-wallet-adapter-react'
import { useEffect, useState } from 'react'

export default function Deploy() {
  const { publicKey, requestDeploy, requestTransaction } = useWallet()

  const [program, setProgram] = useState('')

  const onClick = async () => {
    if (!publicKey) throw new WalletNotConnectedError()

    const fee = 4_835_000 // This will fail if fee is not set high enough

    const aleoDeployment = new Deployment(
      publicKey,
      WalletAdapterNetwork.Testnet,
      program,
      fee,
    )

    if (requestTransaction) {
      // Returns a transaction Id, that can be used to check the status. Note this is not the on-chain transaction id
      if (requestDeploy) {
        await requestDeploy(aleoDeployment)
      }
    }
  }

  useEffect(() => {
    console.log('program', program)
  }, [program])

  return (
    <form
      className="mt-10 flex flex-col gap-4 max-w-2xl"
    >
      <h2 className="text-2xl">Deploy program</h2>
      <div className="flex flex-col gap-4">
        <textarea
          className="h-11 w-full appearance-none rounded-lg border-2 border-gray-200 bg-transparent py-1 text-sm tracking-tighter text-gray-900 outline-none transition-all placeholder:text-gray-600 focus:border-gray-900 ltr:pr-5 ltr:pl-10 rtl:pr-10 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-gray-500 px-4 min-h-[250px]"
          placeholder="Paste your program here"
          id="program"
          value={program}
          onChange={(event) => setProgram(event.target.value)}
        />
      </div>
      <div className="flex gap-4">
        <button
          className="h-11 w-full bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all"
          type="submit"
          onClick={onClick} disabled={!publicKey}
        >
          Deploy
        </button>
      </div>
    </form>
  )
}
