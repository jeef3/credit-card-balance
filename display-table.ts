const Table = require('cli-table');
import * as chalk from 'chalk';
import * as moment from 'moment';

import DebitResult from './DebitResult';

export default (debitResults: DebitResult[]) => {
  const display = new Table({
    head: [
      'Amount',
      'Date',
      'Payee',
      'Paid',
      'Credits',
      'Conflict'
    ]
  });

  debitResults
    .forEach(debitResult => {
      const {
        debit,
        credits,
        conflict
      } = debitResult;

      let paid;
      if (credits.length === 1) {
        paid = chalk.green('✓');
      } else if (credits.length) {
        paid = chalk.yellow.bold('?');
      } else {
        paid = chalk.red('✘');
      }

      if (debit) {
        display.push([
          `$ ${debit.amount}`,
          moment(debit.date).format('DD-MM-YY'),
          debit.payee || '',
          paid,
          credits.length,
          (conflict || '').substring(0, 5)
        ]);
      } else {
        display.push([
          '',
          '',
          '',
          paid,
          credits.length,
          ''
        ])
      }
    })

  console.log(display.toString());
}
