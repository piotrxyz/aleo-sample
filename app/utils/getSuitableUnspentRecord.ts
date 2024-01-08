import { RecordPlaintext } from '@/app/types'
import { isAmountData, isMicrocreditsData } from '@/app/utils/token'

export const getSuitableUnspentRecord = (records: RecordPlaintext[], amount: number) => {
  // Filter unspent records with balance/microcredits equal or greater than the amount
  const suitableRecords = records.filter((record) => {
    const { spent, data } = record
    if (spent) {
      return false
    }
    if (isMicrocreditsData(data)) {
      return parseInt(data.microcredits) >= amount
    }

    if (isAmountData(data)) {
      return parseInt(data.amount) >= amount
    }

    return false
  })

  // Return the record with the smallest balance/microcredits among the suitable records
  return suitableRecords.reduce((prev, current) => {
    if (isMicrocreditsData(prev.data) && isMicrocreditsData(current.data)) {
      return (prev.data.microcredits < current.data.microcredits) ? prev : current
    }

    if (isAmountData(prev.data) && isAmountData(current.data)) {
      return (prev.data.amount < current.data.amount) ? prev : current
    }

    return prev
  }, suitableRecords[0])
}