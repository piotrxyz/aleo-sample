import { WalletMultiButton } from '@demox-labs/aleo-wallet-adapter-reactui'
// import { ConnectPuzzleWallet } from '@/app/components/ConnectPuzzleWallet'
import Link from 'next/link'
import { TokenBalance } from '@/app/components/TokenBalance'
import { useToken } from '@/app/hooks'
import { program } from '@/app/config'

export const Header = () => {
  const { tokenBalance, tokenPublicBalance, tokenName } = useToken(program)

  return (
    <header className="flex flex-col gap-5">
      <div className="px-10 pt-10 flex justify-between items-center">
        <div className="flex gap-6 items-center">
          <Link href="/">
            <h1 className="text-4xl font-bold">
              ZK<span className="text-gray-500">App</span>
            </h1>
          </Link>
          <Link href="/record" className="text-md font-bold">
            DECRYPT RECORD
          </Link>
          <Link href="/mint" className="text-md font-bold">
            MINT TOKEN
          </Link>
          <Link href="/deploy" className="text-md font-bold">
            DEPLOY
          </Link>
          <Link href="/merge" className="text-md font-bold">
            MERGE
          </Link>
        </div>
        <div>
          <WalletMultiButton />
          {/*<ConnectPuzzleWallet />*/}
        </div>
      </div>
      <TokenBalance balance={tokenBalance} publicBalance={tokenPublicBalance} tokenName={tokenName} />
    </header>
  )
}
