// Pure-Node unit test for drawFromPool and shuffleArray behavior
// Implements a small in-memory "localStorage" and the drawFromPool API used by the app.

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Simple in-memory storage to mimic localStorage for tests
const storage = new Map();
const localStorage = {
  getItem(key) { return storage.has(key) ? storage.get(key) : null; },
  setItem(key, value) { storage.set(key, String(value)); },
  removeItem(key) { storage.delete(key); },
  clear() { storage.clear(); }
};

function drawFromPool(name, difficulty, allItems, count) {
  const key = `pool::${name}::${difficulty}`;
  let pool = [];
  try {
    const raw = localStorage.getItem(key);
    if (raw) pool = JSON.parse(raw) || [];
  } catch (e) { pool = []; }
  if (!Array.isArray(pool) || pool.length === 0) pool = shuffleArray(allItems.slice());
  const drawn = [];
  for (let i = 0; i < count && pool.length > 0; i++) drawn.push(pool.shift());
  if (pool.length === 0) pool = shuffleArray(allItems.slice().filter(it => !drawn.includes(it)));
  try { localStorage.setItem(key, JSON.stringify(pool)); } catch (e) {}
  return drawn;
}

(function runTests(){
  const questions = [
    { question: 'Q1' },
    { question: 'Q2' },
    { question: 'Q3' },
    { question: 'Q4' }
  ];

  localStorage.clear();

  const first = drawFromPool('unit-test', 'd1', questions, 2);
  if (!Array.isArray(first) || first.length !== 2) {
    console.error('Expected first draw to return 2 items, got', first && first.length);
    process.exit(3);
  }

  const second = drawFromPool('unit-test', 'd1', questions, 2);
  if (!Array.isArray(second) || second.length !== 2) {
    console.error('Expected second draw to return 2 items, got', second && second.length);
    process.exit(4);
  }

  const ids1 = new Set(first.map(x => JSON.stringify(x)));
  const overlap = second.filter(x => ids1.has(JSON.stringify(x)));
  if (overlap.length !== 0) {
    console.error('Overlap detected between draws:', overlap);
    process.exit(5);
  }

  const third = drawFromPool('unit-test', 'd1', questions, 4);
  if (!Array.isArray(third) || third.length !== 4) {
    console.error('Expected third draw to return 4 items after refill, got', third && third.length);
    process.exit(6);
  }

  console.log('PASS');
  process.exit(0);
})();
