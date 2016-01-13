interface Transaction {
  date: Date,
  amount: string,
  payee: string,
  particulars: string,
  code: string,
  reference: string,
  type: string
}

export default Transaction;
