interface TokenBalanceProps {
  balance: number
  publicBalance: number
  tokenName: string
}

export const TokenBalance = ({ balance, publicBalance, tokenName }: TokenBalanceProps) => {
  return (
    <div className="flex items-center gap-4 px-10">
      <h2 className="text-2xl">Balance: </h2>
      <div className="flex gap-2 items-center w-fit">
        <span className="text-xl font-bold relative">
          <span className="absolute -top-3 -left-0 text-xs text-red-500">private</span>
          {balance}
        </span> |
        <span className="text-xl font-bold relative">
          <span className="absolute -top-3 -left-0 text-xs text-green-500">public</span>
          {publicBalance}
        </span>
        <span className="text-md p-2 bg-blue-800 text-white rounded-full">{tokenName}</span>
      </div>
    </div>
  )
}