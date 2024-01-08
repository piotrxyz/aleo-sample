import { useEffect, useState } from 'react'
import { connect, disconnect, getAccount, GetSelectedAccountResponse, PuzzleAccount, SessionTypes } from '@puzzlehq/sdk'
import { shortAddress } from '@/app/utils/shortAddress'

export const ConnectPuzzleWallet = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | undefined>()
  const [account, setAccount] = useState<PuzzleAccount | undefined>()
  const [connected, setConnected] = useState(false)

  const connectPuzzleWallet = async () => {
    setLoading(true)
    setError(undefined)
    try {
      const session: SessionTypes.Struct = await connect()
      console.log('session', session)
      // setAccount(account)
    } catch (e) {
      console.log('error', e)
      setError((e as Error).message)
    } finally {
      setLoading(false)
      setConnected(true)
    }
  }

  const disconnectPuzzleWallet = async () => {
    setLoading(true)
    setError(undefined)
    try {
      await disconnect()
      setAccount(undefined)
    } catch (e) {
      setError((e as Error).message)
    } finally {
      console.log('disconnected', account)
      setLoading(false)
      setConnected(false)
    }
  }

  useEffect(() => {
    const getPuzzleAccount = async () => {
      setError(undefined)
      try {
        const response: GetSelectedAccountResponse = await getAccount()
        if (response.account) {
          console.log('response.account', response.account)
          setAccount(response.account)
        }
        else if (response.error) setError(response.error)
      } catch (e) {
        setError((e as Error).message)
      } finally {
        setLoading(false)
      }
    }

    void getPuzzleAccount()
  }, [connected, account?.address])

  return (
    <div>
      {account && connected ? (
        <>
          <p>account: {shortAddress(account?.address)}</p>
          <button onClick={disconnectPuzzleWallet}>disconnect</button>
        </>
      ) : (
        <button
          onClick={connectPuzzleWallet}
          disabled={loading}
        >
          connect to puzzle
        </button>
      )}
      {/*{ data && <p>you did it!</p> }*/}
      {error && <p>error connecting: {error}</p>}
    </div>
  )
}