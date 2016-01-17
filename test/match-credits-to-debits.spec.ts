import * as test from 'tape';

import Transaction from '../Transaction';
import TransactionType from '../TransactionType';
import DebitResult from '../DebitResult';
import matchCreditsToDebits from '../match-credits-to-debits';
import makeDebitResults from '../make-debit-results';

const setup = () => {
  const transactions = [
    { amount: '10.00', type: TransactionType.Credit },
    { amount: '-10.00', type: TransactionType.Debit }
  ];

  const results = makeDebitResults([], transactions);

  return { results, transactions };
};

export default () => {
  test('match debits', assert => {
    const { results, transactions } = setup();

    const result = matchCreditsToDebits(results, transactions);

    assert.deepEqual(result[0], {
      debit: { amount: '-10.00', type: 1 },
      credits: [{ amount: '10.00', type: 0 }]
    }, 'Should do basic match' );

    assert.end();
  });
}
