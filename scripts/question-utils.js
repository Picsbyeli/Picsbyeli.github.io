// scripts/question-utils.js
// Non-repeating pool manager for questions

const usedPools = JSON.parse(localStorage.getItem("usedPools")||"{}");

function getUniqueRun(pool, key, count) {
  if (!pool || !pool.length) return [];
  const hist = usedPools[key] || [];
  const available = pool.filter((q,i) => !hist.includes(i));

  let run = [];
  if (available.length >= count) {
    run = shuffle(available).slice(0,count);
  } else {
    run = [...available];
    const refill = shuffle(pool).filter(q => !run.includes(q)).slice(0, count-run.length);
    run.push(...refill);
    usedPools[key] = []; // reset when all used
  }

  // store used indices
  usedPools[key] = [...new Set([...(usedPools[key]||[]), ...run.map(q=>pool.indexOf(q))])];
  localStorage.setItem("usedPools", JSON.stringify(usedPools));
  return run;
}

function shuffle(arr){ 
  const shuffled = arr.slice();
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Utility function to get pool status for debugging
function getPoolStatus() {
  return JSON.parse(localStorage.getItem("usedPools")||"{}");
}

// Reset specific pool
function resetPool(key) {
  const pools = JSON.parse(localStorage.getItem("usedPools")||"{}");
  delete pools[key];
  localStorage.setItem("usedPools", JSON.stringify(pools));
}

// Reset all pools
function resetAllPools() {
  localStorage.removeItem("usedPools");
}

// Export functions for use in other scripts
window.questionUtils = {
  getUniqueRun,
  shuffle,
  getPoolStatus,
  resetPool,
  resetAllPools
};

// Backwards compatibility alias for simpler access
if (!window.getUniqueRun) {
  window.getUniqueRun = getUniqueRun;
}