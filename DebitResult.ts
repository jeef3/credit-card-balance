import Transaction from './Transaction';

interface DebitResult {
  debit: Transaction,
  credits: Array<Transaction>,
  conflict?: string
}

export default DebitResult;
