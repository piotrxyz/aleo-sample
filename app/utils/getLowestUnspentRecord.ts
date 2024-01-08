import { RecordPlaintext } from '@/app/types'
import { isAmountData, isMicrocreditsData } from '@/app/utils/token'

export const getLowestUnspentRecord = (records: RecordPlaintext[]) => {
  // return unspent record with the lowest balance
  return records.reduce((prev, current) => {
    if (prev.spent || current.spent) {
      return prev
    }
    if (isMicrocreditsData(prev.data) && isMicrocreditsData(current.data)) {
      return (parseInt(prev.data.microcredits) < parseInt(current.data.microcredits)) ? prev : current
    }

    if (isAmountData(prev.data) && isAmountData(current.data)) {
      return (parseInt(prev.data.amount) < parseInt(current.data.amount)) ? prev : current
    }

    return prev
  })
}