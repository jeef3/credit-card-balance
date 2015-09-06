#!/usr/bin/env babel-node

import fs from 'fs';

import minimist from 'minimist';
import chalk from 'chalk';
import Table from 'cli-table';

const argv = minimist(process.argv.slice(2));
const csvFileName = argv._[0];

const transactions = fs
  .readFileSync(csvFileName)
  .toString()
  .split('\n')
  .map(row => {
    const parts = row.split(',');
    return {
      date: parts[0],
      amount: parseInt(parts[1] * 100, 10),
      particulars: parts[2],
      code: parts[3],
      reference: parts[4],
      type: parts[5]
    };
  });

const credits = transactions.filter(t => t.amount > 0);
const debits = transactions.filter(t => t.amount < 0);

const matchedDebits = debits
  .map(debit => {
    const matches = credits
      .filter(credit => debit.amount + credit.amount === 0);

    return { debit, matches };
  });

const display = new Table({
  head: [
    'Amount',
    'Date',
    'Particulars',
    'Paid'
  ]
});

matchedDebits.forEach(match => {
  const { debit, matches } = match;

  let paid;
  if (matches.length === 0) {
    paid = chalk.red('✘');
  } else if (matches.length === 1) {
    paid = chalk.green('✓');
  } else {
    paid = chalk.yellow.bold('?');
  }

  display.push([
    '$ ' + Math.abs(debit.amount / 100).toFixed(2),
    debit.date,
    debit.particulars,
    paid
  ]);
})
console.log(display.toString());
