import * as moment from 'moment';

import DebitResult from './DebitResult';

export default (debitResults: DebitResult[]) => {
  const rows = debitResults.map(r => ([
    r.debit.amount,
    moment(r.debit.date).format('DD-MM-YY'),
    r.debit.payee,
    r.credits.length > 0 ? 'Y' : 'N',
    r.credits.length,
    r.conflict ? r.conflict.substring(0, 5) : ''
    ].join(',')
  ));

  rows.shift();

  console.log(rows.join('\n'));
}
