const { test, expect } = require('@playwright/test');

const TEST_BASE = process.env.TEST_BASE || 'http://127.0.0.1:8001';

async function setupPage(page, path) {
  await page.goto(`${TEST_BASE}${path}`);
  await page.waitForLoadState('networkidle');
}

test.describe('Pokemon Veil mechanics', () => {
  test('blackout returns player to default respawn and heals party', async ({ page }) => {
    await setupPage(page, '/games/pokemon-veil/index.html');
    const result = await page.evaluate(async () => {
      localStorage.clear();
      window.delay = () => Promise.resolve();
      showScreen('game-screen');
      G.money = 500;
      G.respawn = { ...DEFAULT_RESPAWN };
      G.loc = 'route1';
      G.interior = null;
      G.floor = null;
      G.px = 5 * TILE;
      G.py = 7 * TILE;
      G.dir = 'left';
      G.party = [
        new Pokemon('sproutling', 10, { hp: 0 }),
        new Pokemon('puddlehop', 9, { hp: 4 })
      ];
      B.active = true;
      B.type = 'wild';
      B.pIdx = 0;
      B.enemy = [new Pokemon('flutterby', 8)];
      B.eIdx = 0;
      B.participants = new Set();

      await triggerBlackout();

      return {
        loc: G.loc,
        interior: G.interior,
        floor: G.floor,
        px: G.px,
        py: G.py,
        dir: G.dir,
        money: G.money,
        hp: G.party.map(p => p.hp),
        stats: G.party.map(p => p.stats.hp),
        label: G.respawn.label
      };
    });

    expect(result.loc).toBe('uproot');
    expect(result.interior).toBe(null);
    expect(result.floor).toBe(null);
    expect(result.dir).toBe('down');
    expect(result.px).toBe(12 * 16);
    expect(result.py).toBe(8 * 16);
    expect(result.money).toBe(300);
    expect(result.label.toLowerCase()).toContain('home');
    result.hp.forEach((hp, idx) => {
      expect(hp).toBe(result.stats[idx]);
    });
  });

  test('blackout from gym respawns at Pokemon Center checkpoint', async ({ page }) => {
    await setupPage(page, '/games/pokemon-veil/index.html');
    const result = await page.evaluate(async () => {
      localStorage.clear();
      window.delay = () => Promise.resolve();
      showScreen('interior-screen');
      setRespawnPoint({
        loc: 'springvale',
        interior: 'pokecenter',
        floor: null,
        px: 6 * TILE,
        py: 5 * TILE,
        dir: 'up',
        label: 'Springvale Pokemon Center'
      });
      G.loc = 'springvale';
      G.interior = 'gym1';
      G.floor = null;
      G.px = 7 * TILE;
      G.py = 4 * TILE;
      G.dir = 'right';
      G.money = 1234;
      G.party = [
        new Pokemon('blazecoon', 15, { hp: 0 }),
        new Pokemon('inklet', 14, { hp: 10 })
      ];
      B.active = true;
      B.type = 'trainer';
      B.isGymLeader = true;
      B.trainer = { name: 'Leader Fern', defeated: [] };
      B.pIdx = 0;
      B.enemy = [new Pokemon('sproutling', 10)];
      B.eIdx = 0;
      B.participants = new Set([0]);

      await triggerBlackout();

      return {
        loc: G.loc,
        interior: G.interior,
        floor: G.floor,
        px: G.px,
        py: G.py,
        dir: G.dir,
        money: G.money,
        label: G.respawn.label,
        hp: G.party.map(p => p.hp),
        stats: G.party.map(p => p.stats.hp)
      };
    });

    expect(result.loc).toBe('springvale');
    expect(result.interior).toBe('pokecenter');
    expect(result.dir).toBe('up');
    expect(result.px).toBe(6 * 16);
    expect(result.py).toBe(5 * 16);
    expect(result.money).toBe(1234 - 15 * 20);
    expect(result.label).toContain('Pokemon');
    result.hp.forEach((hp, idx) => {
      expect(hp).toBe(result.stats[idx]);
    });
  });

  test('multi-participant battles grant shared experience', async ({ page }) => {
    await setupPage(page, '/games/pokemon-veil/index.html');
    const data = await page.evaluate(async () => {
      localStorage.clear();
      window.delay = () => Promise.resolve();
      G.money = 0;
      G.defeated = [];
      G.party = [
        new Pokemon('sproutling', 10),
        new Pokemon('puddlehop', 9),
        new Pokemon('flutterby', 8)
      ];
      G.party.forEach(p => p.fullHeal());

      B.active = true;
      B.type = 'trainer';
      B.isRival = false;
      B.trainer = { name: 'Unit Trainer', defeated: [] };
      B.pIdx = 0;
      B.enemy = [new Pokemon('marshleap', 12)];
      B.enemy[0].hp = 0;
      B.eIdx = 0;
      B.participants = new Set([0, 1]);

      const participants = Array.from(B.participants);
      const enemy = B.enemy[B.eIdx];
      const baseYield = enemy.sp.xp;
      const baseReward = Math.max(0, Math.floor((baseYield * enemy.lvl) / 7));
      const baseShares = new Map();
      if (participants.length && baseReward > 0) {
        const baseShare = Math.floor(baseReward / participants.length);
        let remainder = baseReward - baseShare * participants.length;
        for (const idx of participants) {
          let bonus = 0;
          if (idx === B.pIdx && remainder > 0) {
            bonus = remainder;
            remainder = 0;
          } else if (remainder > 0) {
            bonus = 1;
            remainder--;
          }
          baseShares.set(idx, baseShare + bonus);
        }
        if (remainder > 0 && participants.length) {
          const first = participants[0];
          baseShares.set(first, (baseShares.get(first) || 0) + remainder);
        }
      }
      const trainerMultiplier = B.type === 'trainer' ? 1.5 : 1;
      const expectedShares = {};
      for (const idx of participants) {
        const share = baseShares.get(idx) || 0;
        expectedShares[idx] = Math.max(0, Math.floor(share * trainerMultiplier));
      }

      showScreen('battle-screen');
      updateBattleUI();

      const xpLog = [];
      const originalGainExp = Pokemon.prototype.gainExp;
      Pokemon.prototype.gainExp = function(amount) {
        const idx = G.party.indexOf(this);
        xpLog.push({ index: idx, amount });
        return originalGainExp.call(this, amount);
      };

      try {
        await handleEnemyFaint();
      } finally {
        Pokemon.prototype.gainExp = originalGainExp;
      }

      return {
        expectedShares,
        xpLog,
        levels: G.party.map(p => p.lvl),
        defeated: G.defeated.slice(),
        money: G.money
      };
    });

    const activeLog = data.xpLog.find(entry => entry.index === 0);
    const partnerLog = data.xpLog.find(entry => entry.index === 1);
    expect(activeLog).toBeDefined();
    expect(partnerLog).toBeDefined();
    expect(activeLog.amount).toBe(data.expectedShares['0']);
    expect(partnerLog.amount).toBe(data.expectedShares['1']);
    expect(data.levels[0]).toBeGreaterThanOrEqual(10);
    expect(data.levels[1]).toBeGreaterThanOrEqual(9);
    expect(data.money).toBe(100);
    expect(data.defeated).toContain('Unit Trainer');
  });
});
