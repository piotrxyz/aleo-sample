import { Transaction, WalletAdapterNetwork, WalletNotConnectedError } from '@demox-labs/aleo-wallet-adapter-base'
import { program } from '@/app/config'
import { useWallet } from '@demox-labs/aleo-wallet-adapter-react'
import { FormEvent, useEffect, useState } from 'react'

export const useTransaction = () => {
  const { transactionStatus, requestTransaction } = useWallet()

  const [transactionId, setTransactionId] = useState<string>('')
  const [txStatus, setTxStatus] = useState<string>('')

  useEffect(() => {
    let intervalId: NodeJS.Timeout | undefined

    if (transactionStatus && transactionId) {
      const getTransactionStatus = async () => {
        const status = await transactionStatus(transactionId)
        setTxStatus(status)
      }

      intervalId = setInterval(() => {
        void getTransactionStatus()
      }, 1000)
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId)
      }
    }

  }, [transactionId, transactionStatus])

  const tx = async (publicKey: string | null, event: FormEvent, inputs: string[], fee: number, functionName: string, feePrivate: boolean) => {
    event.preventDefault()
    if (!publicKey) {
      throw new WalletNotConnectedError()
    }

    const aleoTransaction = Transaction.createTransaction(
      publicKey,
      WalletAdapterNetwork.Testnet,
      program,
      functionName,
      inputs,
      fee,
      feePrivate,
    )

    if (requestTransaction) {
      const txId = await requestTransaction(aleoTransaction)
      setTransactionId(txId)
    }
  }

  return { tx, txStatus }
}