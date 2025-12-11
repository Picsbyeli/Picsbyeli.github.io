// ==================== COMBAT MODULE ====================
// Handles classes, projectiles, enemies, and combat mechanics

import { player } from './player.js';
import { createFloatingText, createAbilityEffect, screenShake } from './ui.js';
import { playSFX } from './audio.js';

// ==================== CLASSES ====================
// Combined classes as requested: Archer+Hunter=Archer, Assassin+Thief=Thief
export const CLASSES = {
  Hunter: {
    name: "Hunter",
    icon: "🏹",
    description: "Master of ranged combat with precise arrows",
    color: "#44aa44",
    projectile: "🏹", // Arrow emoji
    stats: { hp: 100, damage: 12, attackSpeed: 1.2, critChance: 0.1 },
    abilities: [
      {
        id: "rapidFire",
        name: "Rapid Fire",
        icon: "🏹",
        key: "Q",
        description: "Fire 5 arrows in quick succession",
        damage: 8,
        cooldown: 8,
        special: "Multi-shot"
      },
      {
        id: "huntersMark",
        name: "Hunter's Mark",
        icon: "🎯",
        key: "E",
        description: "Mark target for 50% extra damage",
        damage: 0,
        cooldown: 15,
        special: "Debuff"
      }
    ]
  },
  
  Knight: {
    name: "Knight",
    icon: "⚔️",
    description: "Noble warrior with sword strikes",
    color: "#ffaa00",
    projectile: "🗡️", // Sword emoji
    stats: { hp: 150, damage: 15, attackSpeed: 0.8, critChance: 0.08 },
    abilities: [
      {
        id: "shieldBash",
        name: "Shield Bash",
        icon: "🛡️",
        key: "Q",
        description: "Bash enemies with your shield, stunning them",
        damage: 20,
        cooldown: 10,
        special: "Stun 2s"
      },
      {
        id: "valorousCharge",
        name: "Valorous Charge",
        icon: "⚔️",
        key: "E",
        description: "Charge forward dealing damage to all in path",
        damage: 35,
        cooldown: 12,
        special: "Line damage"
      }
    ]
  },
  
  Thief: {
    name: "Thief",
    icon: "🔪",
    description: "Swift assassin who throws deadly knives",
    color: "#aa44aa",
    projectile: "🔪", // Knife emoji as requested
    stats: { hp: 80, damage: 18, attackSpeed: 1.5, critChance: 0.25 },
    abilities: [
      {
        id: "shadowStrike",
        name: "Shadow Strike",
        icon: "🌑",
        key: "Q",
        description: "Teleport behind enemy and strike for massive damage",
        damage: 50,
        cooldown: 10,
        special: "Guaranteed crit"
      },
      {
        id: "poisonBlade",
        name: "Poison Blade",
        icon: "☠️",
        key: "E",
        description: "Apply deadly poison that deals damage over time",
        damage: 5,
        cooldown: 8,
        special: "DoT: 5 damage/sec for 6s"
      }
    ]
  },
  
  Tank: {
    name: "Tank",
    icon: "🛡️",
    description: "Unstoppable defender with shield throws",
    color: "#4488ff",
    projectile: "🛡️", // Shield emoji with knockback
    stats: { hp: 200, damage: 10, attackSpeed: 0.6, critChance: 0.05 },
    abilities: [
      {
        id: "fortify",
        name: "Fortify",
        icon: "🏰",
        key: "Q",
        description: "Become invulnerable for 3 seconds",
        damage: 0,
        cooldown: 20,
        special: "Invulnerability"
      },
      {
        id: "shieldThrow",
        name: "Shield Throw",
        icon: "🛡️",
        key: "E",
        description: "Throw shield that bounces between enemies with knockback",
        damage: 25,
        cooldown: 8,
        special: "Knockback + Bounce"
      }
    ]
  },
  
  Mage: {
    name: "Mage",
    icon: "🔮",
    description: "Master of arcane magic",
    color: "#8844ff",
    projectile: "✨",
    stats: { hp: 85, damage: 20, attackSpeed: 0.9, critChance: 0.12 },
    abilities: [
      {
        id: "fireball",
        name: "Fireball",
        icon: "🔥",
        key: "Q",
        description: "Launch an explosive fireball",
        damage: 40,
        cooldown: 6,
        special: "AoE explosion"
      },
      {
        id: "iceStorm",
        name: "Ice Storm",
        icon: "❄️",
        key: "E",
        description: "Freeze all nearby enemies",
        damage: 15,
        cooldown: 15,
        special: "Freeze 3s"
      }
    ]
  },
  
  EvolLegend: {
    name: "Evol Legend",
    icon: "🌟",
    description: "The legendary hero with black hole powers",
    color: "#ff00ff",
    projectile: "⚫", // Black hole as requested
    stats: { hp: 120, damage: 25, attackSpeed: 1.0, critChance: 0.15 },
    abilities: [
      {
        id: "blackHole",
        name: "Black Hole",
        icon: "🌀",
        key: "Q",
        description: "Create a black hole that pulls in and damages all enemies",
        damage: 60,
        cooldown: 18,
        special: "Pull + AoE"
      },
      {
        id: "cosmicRay",
        name: "Cosmic Ray",
        icon: "💫",
        key: "E",
        description: "Fire a devastating beam across the screen",
        damage: 100,
        cooldown: 25,
        special: "Piercing beam"
      }
    ]
  }
};

// ==================== PROJECTILE SYSTEM ====================
export const projectiles = [];

export function createProjectile(x, y, targetX, targetY, owner = 'player') {
  const classData = CLASSES[player.selectedClass] || CLASSES.Hunter;
  
  const dx = targetX - x;
  const dy = targetY - y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const speed = 8;
  
  const projectile = {
    x,
    y,
    vx: (dx / dist) * speed,
    vy: (dy / dist) * speed,
    icon: classData.projectile,
    damage: classData.stats.damage * (1 + player.damage / 100),
    owner,
    color: classData.color,
    size: 24,
    isCrit: Math.random() < player.critChance,
    knockback: classData.name === 'Tank' ? 30 : 0,
    pierce: 0,
    maxPierce: classData.name === 'EvolLegend' ? 3 : 0
  };
  
  if (projectile.isCrit) {
    projectile.damage *= player.critMultiplier;
    projectile.size = 32;
  }
  
  projectiles.push(projectile);
  playSFX('shoot');
  
  return projectile;
}

// Update all projectiles
export function updateProjectiles(canvas, enemies, onHit) {
  for (let i = projectiles.length - 1; i >= 0; i--) {
    const p = projectiles[i];
    
    p.x += p.vx;
    p.y += p.vy;
    
    // Remove if out of bounds
    if (p.x < -50 || p.x > canvas.width + 50 || p.y < -50 || p.y > canvas.height + 50) {
      projectiles.splice(i, 1);
      continue;
    }
    
    // Check collision with enemies
    if (p.owner === 'player') {
      for (const enemy of enemies) {
        if (checkCollision(p, enemy)) {
          onHit(enemy, p);
          
          // Knockback for Tank
          if (p.knockback > 0) {
            const angle = Math.atan2(p.vy, p.vx);
            enemy.x += Math.cos(angle) * p.knockback;
            enemy.y += Math.sin(angle) * p.knockback;
          }
          
          p.pierce++;
          if (p.pierce > p.maxPierce) {
            projectiles.splice(i, 1);
          }
          break;
        }
      }
    }
  }
}

// Draw projectiles on canvas
export function drawProjectiles(ctx) {
  for (const p of projectiles) {
    ctx.save();
    ctx.font = `${p.size}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Special effect for Evol Legend black hole
    if (p.icon === '⚫') {
      // Draw black hole effect
      ctx.beginPath();
      ctx.arc(p.x, p.y, 20, 0, Math.PI * 2);
      const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 25);
      gradient.addColorStop(0, '#000000');
      gradient.addColorStop(0.5, '#4400ff');
      gradient.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient;
      ctx.fill();
      
      // Swirl effect
      ctx.strokeStyle = '#8800ff';
      ctx.lineWidth = 2;
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        const angle = (Date.now() / 200 + i * 2) % (Math.PI * 2);
        ctx.arc(p.x, p.y, 15 + i * 5, angle, angle + 1);
        ctx.stroke();
      }
    } else {
      // Regular emoji projectile
      if (p.isCrit) {
        ctx.shadowColor = '#ffff00';
        ctx.shadowBlur = 15;
      }
      ctx.fillText(p.icon, p.x, p.y);
    }
    
    ctx.restore();
  }
}

// ==================== ABILITY EFFECTS ====================
export function useAbility(ability) {
  playSFX('ability');
  
  switch(ability.id) {
    case 'blackHole':
      createAbilityEffect(600, 350, 'blackhole');
      screenShake(10, 500);
      break;
    case 'fireball':
      createAbilityEffect(600, 350, 'fire');
      screenShake(5, 200);
      break;
    case 'shieldBash':
    case 'fortify':
      createAbilityEffect(player.x, player.y, 'shield');
      break;
    case 'shadowStrike':
      createAbilityEffect(player.x, player.y, 'explosion');
      screenShake(8, 300);
      break;
    default:
      createAbilityEffect(player.x, player.y, 'explosion');
  }
  
  return ability.damage;
}

// ==================== HELPER FUNCTIONS ====================
function checkCollision(a, b) {
  const ax = a.x - (a.size || 10) / 2;
  const ay = a.y - (a.size || 10) / 2;
  const aw = a.size || 20;
  const ah = a.size || 20;
  
  return ax < b.x + b.w &&
         ax + aw > b.x &&
         ay < b.y + b.h &&
         ay + ah > b.y;
}

// Apply class stats to player
export function applyClassStats(className) {
  const classData = CLASSES[className];
  if (!classData) return;
  
  player.selectedClass = className;
  player.maxHp = classData.stats.hp + (player.level - 1) * 10;
  player.hp = player.maxHp;
  player.damage = classData.stats.damage;
  player.attackSpeed = classData.stats.attackSpeed;
  player.critChance = classData.stats.critChance;
}

// Get class abilities
export function getClassAbilities(className) {
  const classData = CLASSES[className || player.selectedClass];
  return classData ? classData.abilities : [];
}
