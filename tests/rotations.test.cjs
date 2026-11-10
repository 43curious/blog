const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const assert = require('node:assert/strict');
const { test } = require('node:test');

const html = readFileSync(join(__dirname, '../src/pages/taldeak/index.html'), 'utf8');
const rounds = JSON.parse(html.match(/const rounds=(\[[\s\S]*?\]);/)[1]);
const stations = ['T', 'N', 'A'];
const people = ['T', 'N', 'A', 'R'].flatMap(team =>
  Array.from({ length: 5 }, (_, index) => `${team}${index + 1}`),
);
const fixedTarotists = ['T1', 'T2'];
const visitorsPerStation = { T: 3, N: 4, A: 4 };

test('five rounds assign everyone once, with two hosts and the required players per station', () => {
  assert.equal(rounds.length, 5);
  for (const round of rounds) {
    assert.deepEqual(Object.keys(round).sort(), [...people].sort());
    assert.ok(Object.values(round).every(site => [...stations, 'O'].includes(site)));
    for (const person of fixedTarotists) assert.equal(round[person], 'T');
    for (const site of stations) {
      const occupants = people.filter(person => round[person] === site);
      const hosts = occupants.filter(person => person[0] === site);
      assert.equal(hosts.length, 2);
      assert.equal(occupants.length - hosts.length, visitorsPerStation[site], site);
    }
    assert.equal(people.filter(person => round[person] === 'O').length, 3);
  }
});

test('everyone visits every other station, with the minimum repeats and at most one per person', () => {
  let repeats = 0;
  for (const person of people.filter(person => !fixedTarotists.includes(person))) {
    const sequence = rounds.map(round => round[person]);
    const visits = sequence.filter(site => site !== 'O' && site !== person[0]);
    const uniqueVisits = [...new Set(visits)];
    assert.deepEqual(uniqueVisits.sort(), stations.filter(site => site !== person[0]).sort(), person);
    const personalRepeats = visits.length - uniqueVisits.length;
    assert.ok(personalRepeats <= 1, person);
    repeats += personalRepeats;
    for (let index = 1; index < sequence.length; index++) {
      if (sequence[index] !== 'O' && sequence[index] !== person[0]) {
        assert.notEqual(sequence[index], sequence[index - 1], `Consecutive repeat for ${person}`);
      }
    }
  }
  const minimumRepeats = stations.reduce((total, site) => {
    const distinctVisitors = people.filter(person =>
      person[0] !== site && !fixedTarotists.includes(person),
    ).length;
    return total + Math.max(0, rounds.length * visitorsPerStation[site] - distinctVisitors);
  }, 0);
  assert.equal(repeats, minimumRepeats);
});

test('researchers and actors each host twice; only T1 and T2 host the tarot station', () => {
  for (const person of people.filter(person => ['N', 'A'].includes(person[0]))) {
    assert.equal(rounds.filter(round => round[person] === person[0]).length, 2, person);
  }
  for (const round of rounds) {
    assert.deepEqual(people.filter(person => person[0] === 'T' && round[person] === 'T'), fixedTarotists);
  }
});
