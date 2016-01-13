/// <reference path="../typings/tsd.d.ts" />

import * as test from 'tape';

import matchDebits from '../match-debits';

const setup = () => {
  return [
    { amount: -10 },
    { amount: 10 }
  ];
}

test('match debits', assert => {
  const fixture = setup();

  const result = matchDebits(fixture);

  assert.deepEqual(result[0].debit, {
    debit: { amount: -10 },
    matches: [{ amount: 10 }]
  }, 'Should do basic match' );

  assert.end();
});
