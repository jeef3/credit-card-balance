function conflictId() {
  var pattern = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
  return pattern.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0;
    var v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export default function findConflicts(matched) {
  const conflictsMatched = matched.slice();

  conflictsMatched.forEach(m1 => {
    if (m1.conflict) { return; }

    const conflicts = matched.filter(m2 => {
      return m1 !== m2 && m1.debit && m2.debit ?
        Math.abs(m1.debit.amount) === Math.abs(m2.debit.amount) :
        false;
    });

    if (conflicts.length) {
      let cid = conflictId();

      m1.conflict = cid;
      conflicts.forEach(m2 => m2.conflict = cid);
    }
  });

  return conflictsMatched;
}
