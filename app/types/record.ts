export interface AmountData {
  amount: string;
}

export interface MicrocreditsData {
  microcredits: string;
}

export interface RecordPlaintext {
  ciphertext: string;
  data: AmountData | MicrocreditsData;
  id: string;
  owner: string;
  plaintext: string;
  program_id: string;
  recordName: string;
  serialNumber: string;
  spent: boolean;
  transactionIdCreated: string;
}