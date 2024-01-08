import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { WalletNotConnectedError } from '@demox-labs/aleo-wallet-adapter-base'
import { useWallet } from '@demox-labs/aleo-wallet-adapter-react'
import { getHighestUnspentRecord } from '@/app/utils'
import { RecordPlaintext } from '@/app/types'
import { program } from '@/app/config'
import { getLowestUnspentRecord } from '@/app/utils/getLowestUnspentRecord'
import { getSuitableUnspentRecord } from '@/app/utils/getSuitableUnspentRecord'
import { useTransaction } from '@/app/hooks'

export const Merge = () => {
  const { publicKey, requestRecords, requestRecordPlaintexts, decrypt } = useWallet()
  const { tx, txStatus } = useTransaction()

  const [record, setRecord] = useState('')
  const [record2, setRecord2] = useState('')
  const [allRecords, setAllRecords] = useState<string[]>([])
  const [showRecords, setShowRecords] = useState<boolean>(false)
  const [fee, setFee] = useState<number>(5_000_000)
  const [plainRecords, setPlainRecords] = useState<RecordPlaintext[]>([])
  const [showPlainRecords, setShowPlainRecords] = useState<boolean>(false)

  useEffect(() => {
    if (!publicKey) return
    void reqRecordPlaintexts()
  }, [publicKey])

  const handleSubmit = async (event: FormEvent, fnName: string) => {
    const inputs = [record, record2]
    await tx(publicKey, event, inputs, fee, fnName, false)
  }

  const handleRecordChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    event.preventDefault()
    setRecord(event.currentTarget.value)
  }

  const handleRecord2Change = (event: ChangeEvent<HTMLTextAreaElement>) => {
    event.preventDefault()
    setRecord2(event.currentTarget.value)
  }

  const handleFeeChange = (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault()
    setFee(Number(event.currentTarget.value))
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
      // console.log('Records: ' + JSON.stringify(records))
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
    >
      <div className="flex justify-between">
        <h1 className="text-4xl font-bold">Merge</h1>
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
        <label htmlFor="record">Record</label>
        <textarea
          className="h-11 w-full appearance-none rounded-lg border-2 border-gray-200 bg-transparent py-1 text-sm tracking-tighter text-gray-900 outline-none transition-all placeholder:text-gray-600 focus:border-gray-900 ltr:pr-5 ltr:pl-10 rtl:pr-10 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-gray-500 px-4 min-h-[250px]"
          placeholder="Record (Plaintext)"
          id="record"
          value={record}
          required
          onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
            handleRecordChange(event)
          }
        />
      </div>

      <div className="flex flex-col gap-4">
        <label htmlFor="record">Record 2</label>
        <textarea
          className="h-11 w-full appearance-none rounded-lg border-2 border-gray-200 bg-transparent py-1 text-sm tracking-tighter text-gray-900 outline-none transition-all placeholder:text-gray-600 focus:border-gray-900 ltr:pr-5 ltr:pl-10 rtl:pr-10 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-gray-500 px-4 min-h-[250px]"
          placeholder="Record (Plaintext)"
          id="record2"
          value={record2}
          required
          onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
            handleRecord2Change(event)
          }
        />
      </div>

      <div className="flex flex-col gap-4">
        <label htmlFor="fee">Fee</label>
        <input
          className="h-11 w-full appearance-none rounded-lg border-2 border-gray-200 bg-transparent py-1 text-sm tracking-tighter text-gray-900 outline-none transition-all placeholder:text-gray-600 focus:border-gray-900 ltr:pr-5 ltr:pl-10 rtl:pr-10 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-gray-500 px-4"
          placeholder="Fee (in microcredits): ie, 1000000 (1 credit)"
          id="fee"
          autoComplete="off"
          onChange={(event: ChangeEvent<HTMLInputElement>) => handleFeeChange(event)}
          value={fee}
          // required
        />
      </div>
      <button
        className="h-11 w-full bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all"
        type="submit"
        onClick={async (event: FormEvent) => {
          await handleSubmit(event, 'merge_records')
        }}
      >
        Merge
      </button>
      <div>
        Transaction status: {txStatus ? txStatus : 'N/A'}
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
