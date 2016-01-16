import Transaction from './Transaction';

interface DebitResult {
  debit: Transaction,
  credits: Transaction[],
  conflict?: string
}

export default DebitResult;
