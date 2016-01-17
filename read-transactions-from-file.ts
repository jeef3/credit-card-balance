
export default (csvFileName) {
  return readFileSync(csvFileName)
    .toString()
    .split('\r')
    .map(row => row.split(','))
    // Remove rows where the amount is invalid
    .filter(parts => parseInt(parts[1], 10))
    .map(parts => ({
      date: moment(parts[0], 'DD/MM/YY').toDate(),
      amount: parts[1],
      payee: parts[2],
      particulars: parts[3],
      code: parts[4],
      reference: parts[5],
      type: parts[6] === 'PAY' ? 0 : 1
    }));
}
