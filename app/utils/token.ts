import { AmountData, MicrocreditsData, RecordPlaintext } from '@/app/types'

export function isAmountData(data: AmountData | MicrocreditsData): data is AmountData {
  return (data as AmountData).amount !== undefined
}

export function isMicrocreditsData(data: AmountData | MicrocreditsData): data is MicrocreditsData {
  return (data as MicrocreditsData).microcredits !== undefined
}

export const calculateTokenBalance = (record: RecordPlaintext) => {
  if (record.program_id === 'credits.aleo' && isMicrocreditsData(record.data) && !record.spent) {
    return parseInt(record.data.microcredits)
  }

  if (isAmountData(record.data) && !record.spent) {
    return parseInt(record.data.amount)
  }

  return 0
}