function conflictId() {
  var pattern = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
  return pattern.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0;
    var v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

module.exports = function findConflicts(matched) {
  const conflictsMatched = matched.slice();

  conflictsMatched.forEach(m1 => {
    // If there are no matches anyway, then there's no conflicts.
    if (m1.conflict || !m1.matches.length) { return; }

    // FIXME: Consider debit === null && matches.length === 1
    // Conflicts based on multiple debits of the same amount
    const conflicts = matched.filter(m2 => {
      return m1 !== m2 && m1.debit && m2.debit ?
        Math.abs(m1.debit.amount) === Math.abs(m2.debit.amount) :
        false;
    });

    if (!conflicts.length) { return; }

    const cid = conflictId();
    m1.conflict = cid;

    // While we've got them, give the conflicts the id.
    conflicts.forEach(m2 => m2.conflict = cid);
  });

  return conflictsMatched;
}
