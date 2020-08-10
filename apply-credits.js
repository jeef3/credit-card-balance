module.exports = function applyCredits(conflictsMatched) {
  const creditsApplied = conflictsMatched.slice();

  creditsApplied.forEach(c1 => {
    if (!c1.conflict) {
      c1.credit = c1.matches[0] || null;
    }

    const conflicts = conflictsMatched
      .filter(c2 => c2.conflict === c1.conflict);

    const credits = c1.matches.slice();

    // If there are the same number of credits and debits, consider this solved
    if (conflicts.length === c1.matches.length) {
      conflicts.forEach(c => c.credit = credits.pop());
    }

    return;
  });

  return creditsApplied;
}
