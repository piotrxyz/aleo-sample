import { FormEvent, SyntheticEvent, useEffect, useState } from 'react'
import { Transaction, WalletAdapterNetwork, WalletNotConnectedError } from '@demox-labs/aleo-wallet-adapter-base'
import { LeoWalletAdapter } from '@demox-labs/aleo-wallet-adapter-leo'
import { useWallet } from '@demox-labs/aleo-wallet-adapter-react'
import { getHighestUnspentRecord } from '@/app/utils'
import { RecordPlaintext } from '@/app/types'
import { program } from '@/app/config'
import { getLowestUnspentRecord } from '@/app/utils/getLowestUnspentRecord'
import { getSuitableUnspentRecord } from '@/app/utils/getSuitableUnspentRecord'

export const TransferForm = () => {
  const { wallet, publicKey, requestRecords, requestRecordPlaintexts, decrypt } = useWallet()

  const [toAddress, setToAddress] = useState('')
  const [amount, setAmount] = useState<number>(0)
  const [record, setRecord] = useState('')
  const [allRecords, setAllRecords] = useState<string[]>([])
  const [showRecords, setShowRecords] = useState<boolean>(false)
  const [fee, setFee] = useState<number | undefined>(5_000_000)
  const [transactionId, setTransactionId] = useState<string | undefined>()
  const [status, setStatus] = useState<string | undefined>()

  const [plainRecords, setPlainRecords] = useState<RecordPlaintext[]>([])
  const [showPlainRecords, setShowPlainRecords] = useState<boolean>(false)

  useEffect(() => {
    const getTransactionStatus = async (txId: string) => {
      const status = await (
        wallet?.adapter as LeoWalletAdapter
      ).transactionStatus(txId)
      setStatus(status)
    }

    let intervalId: NodeJS.Timeout | undefined

    if (transactionId) {
      intervalId = setInterval(() => {
        void getTransactionStatus(transactionId!)
      }, 1000)
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId)
      }
    }
  }, [transactionId, wallet?.adapter])

  useEffect(() => {
    if (!publicKey) return
    void reqRecordPlaintexts()
  }, [publicKey])

  const handleSubmit = async (event: any) => {
    event.preventDefault()
    if (!publicKey) {
      throw new WalletNotConnectedError()
    }

    const inputs = [toAddress, `${amount}u64`, record]

    const aleoTransaction = Transaction.createTransaction(
      publicKey,
      WalletAdapterNetwork.Testnet,
      program,
      'transfer_public',
      inputs,
      fee!,
    )

    const txId =
      (await (wallet?.adapter as LeoWalletAdapter).requestTransaction(aleoTransaction)) || ''
    if (event.target?.elements[0]?.value) {
      event.target.elements[0].value = ''
    }
    setTransactionId(txId)
  }

  const handleToAddressChange = (event: any) => {
    setTransactionId(undefined)
    event.preventDefault()
    setToAddress(event.currentTarget.value)
  }

  const handleAmountChange = (event: any) => {
    setTransactionId(undefined)
    event.preventDefault()
    setAmount(event.currentTarget.value)

    const suitableRecord = getSuitableUnspentRecord(plainRecords, event.currentTarget.value)

    if (suitableRecord && decrypt) {
      const decryptRecord = async () => {
        const record = await decrypt(suitableRecord.ciphertext)

        console.log('record', record)
        setRecord(record)
      }

      void decryptRecord()
    }
  }

  const handleRecordChange = (event: any) => {
    setTransactionId(undefined)
    event.preventDefault()
    setRecord(event.currentTarget.value)
  }

  const handleFeeChange = (event: any) => {
    setTransactionId(undefined)
    event.preventDefault()
    setFee(event.currentTarget.value)
  }

  const reqRecords = async () => {
    if (!publicKey) throw new WalletNotConnectedError()
    if (requestRecords) {
      const records = await requestRecords(program)
      setAllRecords(records)
      setShowRecords(true)
      console.log('Records: ' + JSON.stringify(records))
    }
  }

  const reqRecordPlaintexts = async () => {
    if (!publicKey) throw new WalletNotConnectedError()
    if (requestRecordPlaintexts) {
      const records = await requestRecordPlaintexts(program)
      console.log('Records: ' + JSON.stringify(records))
      setPlainRecords(records)
      const highestUnspentRecord = getHighestUnspentRecord(records)
      const lowestUnspentRecord = getLowestUnspentRecord(records)
      console.log('lowestUnspentRecord', lowestUnspentRecord)
      console.log('highestUnspentRecord', highestUnspentRecord)
    }
  }

  return (
    <form
      className="mt-10 flex flex-col gap-4 max-w-2xl"
      onSubmit={async (event: SyntheticEvent<HTMLFormElement>) => {
        await handleSubmit(event)
      }}
    >
      <div className="flex justify-between">
        <h1 className="text-4xl font-bold">Transfer</h1>
        <div className="flex gap-6 items-center">
          <button
            className="bg-gray-900 text-white rounded-lg hover:bg-gray-800 w-fit py-2 px-4 transition-all"
            onClick={reqRecords}
            disabled={!publicKey}
            type="button"
          >
            Request Records
          </button>
          <button
            className="bg-gray-900 text-white rounded-lg hover:bg-gray-800 w-fit py-2 px-4 transition-all"
            onClick={() => {
              void reqRecordPlaintexts()
              setShowPlainRecords(true)
            }}
            disabled={!publicKey}
            type="button"
          >
            Request Record Plaintexts
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <label htmlFor="toAddress">To address</label>
        <input
          className="h-11 w-full appearance-none rounded-lg border-2 border-gray-200 bg-transparent py-1 text-sm tracking-tighter text-gray-900 outline-none transition-all placeholder:text-gray-600 focus:border-gray-900 ltr:pr-5 ltr:pl-10 rtl:pr-10 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-gray-500 px-4"
          placeholder="To address: ie, aleo1kf3dgrz9lqyklz8kqfy0hpxxyt78qfuzshuhccl02a5x43x6nqpsaapqru"
          autoComplete="off"
          onChange={(event: FormEvent) =>
            handleToAddressChange(event)
          }
          value={toAddress}
          required
        />
      </div>
      <div className="flex flex-col gap-4">
        <label htmlFor="amount">Amount</label>
        <input
          className="h-11 w-full appearance-none rounded-lg border-2 border-gray-200 bg-transparent py-1 text-sm tracking-tighter text-gray-900 outline-none transition-all placeholder:text-gray-600 focus:border-gray-900 ltr:pr-5 ltr:pl-10 rtl:pr-10 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-gray-500 px-4"
          placeholder="Amount in microcredits: ie, 1000000 (1 credit)"
          id="amount"
          type="text"
          autoComplete="off"
          onChange={(event: FormEvent) =>
            handleAmountChange(event)
          }
          value={amount}
          required
        />
      </div>
      <div className="flex flex-col gap-4">
        <label htmlFor="record">Record</label>
        <input
          className="h-11 w-full appearance-none rounded-lg border-2 border-gray-200 bg-transparent py-1 text-sm tracking-tighter text-gray-900 outline-none transition-all placeholder:text-gray-600 focus:border-gray-900 ltr:pr-5 ltr:pl-10 rtl:pr-10 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-gray-500 px-4"
          placeholder="Record"
          id="record"
          autoComplete="off"
          onChange={(event: FormEvent) =>
            handleRecordChange(event)
          }
          value={record}
          // required
        />
      </div>

      <div className="flex flex-col gap-4">
        <label htmlFor="fee">Fee</label>
        <input
          className="h-11 w-full appearance-none rounded-lg border-2 border-gray-200 bg-transparent py-1 text-sm tracking-tighter text-gray-900 outline-none transition-all placeholder:text-gray-600 focus:border-gray-900 ltr:pr-5 ltr:pl-10 rtl:pr-10 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-gray-500 px-4"
          placeholder="Fee (in microcredits): ie, 1000000 (1 credit)"
          id="fee"
          autoComplete="off"
          onChange={(event: FormEvent) => handleFeeChange(event)}
          value={fee}
          // required
        />
      </div>
      <button
        className={`${!publicKey ? 'bg-gray-500' : 'bg-gray-900'} h-11 w-full  text-white rounded-lg hover:bg-gray-800 transition-all`}
        type="submit"
        disabled={!publicKey}
      >
        {publicKey ? 'Submit' : 'Connect your wallet'}
      </button>
      <div
        className="mt-5 inline-flex w-full items-center rounded-full bg-white shadow-card dark:bg-light-dark xl:mt-6">
        <div
          className="inline-flex h-full shrink-0 grow-0 items-center rounded-full px-4 text-xs text-black sm:text-sm">
          Transaction status: {status}
        </div>
      </div>
      <div
        className={`${showRecords ? 'block' : 'hidden'} mt-5 inline-flex items-center bg-white shadow-card dark:bg-light-dark xl:mt-6 fixed`}>
        <button
          className="bg-cyan-500 w-fit py-2 px-4 rounded-2xl hover:bg-cyan-600 transition-colors absolute right-1 top-1"
          type="button"
          onClick={() => setShowRecords(false)}
        >
          X
        </button>
        <textarea
          className="inline-flex h-full shrink-0 grow-0 items-center px-4 text-xs text-black sm:text-sm min-h-[250px] w-[80vh]"
          value={JSON.stringify(allRecords, null, 2)}
          readOnly
        />
      </div>
      <div
        className={`${showPlainRecords ? 'block' : 'hidden'} mt-5 inline-flex items-center bg-white shadow-card dark:bg-light-dark xl:mt-6 fixed`}>
        <button
          className="bg-cyan-500 w-fit py-2 px-4 rounded-2xl hover:bg-cyan-600 transition-colors absolute right-1 top-1"
          type="button"
          onClick={() => setShowPlainRecords(false)}
        >
          X
        </button>
        <textarea
          className="inline-flex h-full shrink-0 grow-0 items-center px-4 text-xs text-black sm:text-sm min-h-[250px] w-[80vh]"
          // value={JSON.stringify(plainRecords.filter((record) => !record.spent), null, 2)}
          value={JSON.stringify(plainRecords, null, 2)}
          readOnly
        />
      </div>
    </form>
  )
}
