export const formatPublicBalance = (balance: string) => {
  const bal = balance.replace(/u64/g, '')
  const numberBalance = parseInt(bal) / 1_000_000

  return numberBalance.toLocaleString()
}