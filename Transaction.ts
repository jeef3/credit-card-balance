import TransactionType from './TransactionType';

interface Transaction {
  date?: Date,
  amount: string,
  type: TransactionType

  payee?: string,

  particulars?: string,
  code?: string,
  reference?: string,
}

export default Transaction;
