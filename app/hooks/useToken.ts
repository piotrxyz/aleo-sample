import { useWallet } from '@demox-labs/aleo-wallet-adapter-react'
import { useCallback, useEffect, useState } from 'react'
import { RecordPlaintext } from '@/app/types'
import { calculateTokenBalance, formatPublicBalance } from '@/app/utils'

export const useToken = (program: string) => {
  const { wallet, publicKey, requestRecords, requestRecordPlaintexts } = useWallet()

  const [tokenBalance, setTokenBalance] = useState<number>(0)
  const [tokenPublicBalance, setTokenPublicBalance] = useState<string>('0')
  const [tokenBalanceLoading, setTokenBalanceLoading] = useState<boolean>(false)
  const [tokenBalanceError, setTokenBalanceError] = useState<Error | undefined>()
  const [tokenName, setTokenName] = useState<string>('')

  const getTokenPublicBalance = useCallback(async () => {
    try {
      // const response = await fetch(`https://explorer.hamp.app/api/v1/mapping/get_value/${program}/account/${publicKey}?outdated=1`)

      const response = await fetch(`https://api.explorer.aleo.org/v1/testnet3/program/${program}/mapping/account/${publicKey}`)

      if (!response.ok) {
        throw new Error('Failed to fetch public balance')
      }

      const data = await response.json()
      console.log('data', data)
      const publicBalance = formatPublicBalance(data)
      setTokenPublicBalance(publicBalance)
    } catch (error) {
      setTokenPublicBalance('0')
    } finally {
      setTokenBalanceLoading(false)
    }
  }, [program, publicKey, tokenPublicBalance])

  const getTokenBalance = useCallback(async () => {
    if (!wallet || !publicKey) return

    setTokenBalanceLoading(true)
    setTokenBalanceError(undefined)

    if (!requestRecords || !requestRecordPlaintexts) {
      setTokenBalanceError(new Error('This wallet does not support requesting records'))
      setTokenBalanceLoading(false)
      return
    }

    try {
      const recordPlaintexts: RecordPlaintext[] = await requestRecordPlaintexts(program)

      const name = recordPlaintexts[0].program_id
      const tokenName = name.replace('.aleo', '')
      setTokenName(tokenName)

      const tokenBalance = recordPlaintexts.reduce((acc, record) => acc + calculateTokenBalance(record), 0)
      const tokenBalanceInBase = tokenBalance / 1_000_000
      setTokenBalance(tokenBalanceInBase)
    } catch (error) {
      setTokenBalanceError(error as Error)
    } finally {
      setTokenBalanceLoading(false)
    }
  }, [program, publicKey, requestRecordPlaintexts, requestRecords, wallet])

  useEffect(() => {
    if (!wallet || !publicKey) return
    void getTokenPublicBalance()

    if (!tokenBalance) {
      void getTokenBalance()
    }
  }, [getTokenBalance, getTokenPublicBalance, publicKey, tokenBalance, wallet])

  return {
    tokenBalance,
    tokenPublicBalance,
    tokenBalanceLoading,
    tokenBalanceError,
    getTokenBalance,
    tokenName,
  }
}
