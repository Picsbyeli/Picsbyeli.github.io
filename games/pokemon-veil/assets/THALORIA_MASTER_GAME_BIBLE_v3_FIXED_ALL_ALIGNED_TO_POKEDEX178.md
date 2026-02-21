# THALORIA — MASTER TRAINER + STORY + TEAMS PACK (v3)

This file contains:
- Region layout (all locations)
- Gym map (type, leader)
- Critical-path story events (dialogue-only, no narration)
- FULL trainer roster (routes, dungeons, gyms, Team Veil, bosses)
- Rival James teams (starter-branch templates)
- Victory Road, Elite Four, Champion teams
- Boss/legendary battle calls
- Pokédex + encounters (from your combined dexbook/encounter pack)

## REGION LAYOUT — LOCATIONS (CANON)

1. **Sproutshore Town** — x:28.3, y:84.1 — Start town
2. **Tidepath Road** — x:37.6, y:86.3 — Route 2 Tidepath segment (Route 1 == Tidepath Road == Route 2 early road)
3. **Route 2** — x:43.5, y:71.7 — Early encounters; Saber Ruins access later
4. **Verdant Village** — x:47.7, y:87 — Gym 1 town
5. **Celeste Pass** — x:58.7, y:86 — Route between Verdant Village and Castle Celeste
6. **Castle Celeste** — x:71.2, y:86.5 — Gym 2 town
7. **Quarry Tunnel** — x:72.2, y:74.8 — Dungeon to Pophyr Grove
8. **Pophyr Grove** — x:76, y:62.7 — Gym 3 town
9. **Route 7** — x:60, y:62.7 — Connector between Pophyr Grove area and Whisperwoods (named route)
10. **Whisperwoods** — x:67.2, y:52.7 — Forest to Lakespire
11. **Lakespire Town** — x:53.4, y:50 — Gym 4 town; Library (Team Veil reveal)
12. **Route 5** — x:45.4, y:46.7 — To Riverbend Crossing
13. **Riverbend Crossing** — x:42.4, y:40.5 — Gym 5 town
14. **Route 3** — x:33.4, y:41.4 — Toward Route 4 / Cavern / Forge approach
15. **Route 4** — x:29.8, y:31 — Toward Lake Willow / Graxen approach
16. **Gabite's Cavern** — x:42.1, y:20.2 — Dungeon; Forge access gate
17. **Gabite's Forge** — x:38.1, y:12.6 — Gym 8 town (Steel)
18. **Route 6** — x:?? — From Lakespire to Elkspire (use your map path; coord list provides Elkspire only)
19. **Elkspire Town** — x:69.8, y:40 — Gym 6 town (Fairy; swamp region)
20. **Lake Willow** — x:?? — Connector zone to Graxen (coord list provides region marker only)
21. **Graxen City** — x:52.5, y:27.6 — Gym 7 town (Psychic) + Fountain
22. **Saber Ruins** — x:53.1, y:67.2 — Ancient Ruins equivalent; Team Veil lore battles
23. **Hearmist Island** — x:12.8, y:14.7 — Jungle maze; Pytavor
24. **Victory Road** — x:80.2, y:25.7 — Final dungeon to League
25. **Pokemon League** — x:82.4, y:11.9 — Elite Four + Champion
26. **Whitehorn Mountains** — x:51.8, y:8.8 — Late/post access (story hooks only here)
27. **Pillage Post** — x:20.6, y:59.8 — Side location / port (optional)
28. **Azure Sea** — x:14.6, y:38.3 — Surf routes / optional
29. **Indigo Fields** — x:18.6, y:76.7 — Optional field area (early/mid)
30. **Cresent Cavens** — x:83.4, y:38.1 — Optional cave (mid/late)
31. **Route 8** — x:62.9, y:17.4 — Late connector (use as pre-Forge / pre-Victory Road access)

## GYM MAP (TYPE + LOCATION)

- **Gym 1** — **Bug** — **Verdant Village** — Leader: **Dax Mercer**
- **Gym 2** — **Rock** — **Castle Celeste** — Leader: **Marla Quoin**
- **Gym 3** — **Electric** — **Pophyr Grove** — Leader: **Tessa Voltane**
- **Gym 4** — **Ghost** — **Lakespire Town** — Leader: **Rowan Ashveil**
- **Gym 5** — **Dark** — **Riverbend Crossing** — Leader: **Noah “Noct” Carrow**
- **Gym 6** — **Fairy** — **Elkspire Town** — Leader: **Seraphine Lumen**
- **Gym 7** — **Psychic** — **Graxen City** — Leader: **Sel Wynn**
- **Gym 8** — **Steel** — **Gabite's Forge** — Leader: **Viktor Ironwright**

---
# PART A — MAIN STORY SCRIPT (CRITICAL PATH) — EVENT FORMAT

## GLOBAL FLAG CONVENTIONS

F_STARTER_CHOSEN
F_STARTER_INKLET / F_STARTER_TADLANCE / F_STARTER_CINDEROON
F_LAB_INTRO
F_RIVAL1_DONE … F_RIVAL8_DONE
F_RIVAL_FINAL_DONE
F_GYM1_BADGE … F_GYM8_BADGE
F_VEIL_REVEALED
F_FORGE_BLOCKED_SEEN
F_ORB_STOLEN
F_FOUNTAIN_ERUPTED
F_RUINS_CLEARED
F_PYTAVOR_EVENT_DONE
F_JAMES_HUMILIATED
F_JAMES_CORRUPTED
F_FONTESSA_AWAKENED
F_DIRECTOR_DEFEATED
F_FORGE_UNLOCKED
F_VICTORY_ROAD_OPEN

## BATTLE CALL CONVENTION

BATTLE_CALL(TRAINER_ID, VARIANT?)
BATTLE_CALL_RIVAL(RIVAL_BATTLE_NO, STARTER_BRANCH)
BATTLE_CALL_VEIL(GRUNT_ID / CAPTAIN_ID / ADMIN_ID)
BATTLE_CALL_BOSS(BOSS_ID)
BATTLE_CALL_LEGENDARY(LEGENDARY_ID)

## 0) SPROUTSHORE TOWN — PROLOGUE

### EVT_0000_PHONE_CALL_INTRO
* Location: Player Bedroom (Sproutshore Town)
* Trigger: game_start
* Flags: sets F_PHONE_CALL_DONE
* Dialogue:
   * Prof. Fraxinus: "Morning. Is this the new trainer?"
   * Prof. Fraxinus: "Before we begin—are you a boy or a girl?"
   * Choice: CHOICE_GENDER_BOY / CHOICE_GENDER_GIRL
   * Prof. Fraxinus: "And your name?"
   * Input: PLAYER_NAME
   * Prof. Fraxinus: "Good. Meet me at the Lab when you're ready."

### EVT_0001_MOM_WAKEUP
* Location: Player Bedroom (Sproutshore Town)
* Trigger: After EVT_0000_PHONE_CALL_INTRO
* Flags: sets F_MOM_WAKEUP_DONE
* Dialogue:
   * Mom: "Up and at it. Set the clock before you head out."

### EVT_0002_MOM_GIVES_GEAR
* Location: Kitchen (Sproutshore Town)
* Trigger: Talk to Mom
* Flags: sets F_GEAR_RECEIVED
* Dialogue:
   * Mom: "Here are the essentials."
   * Mom: "Bag. Map. ID. Pokégear. Running Shoes."
   * Mom: "Go get James, then head to the Lab together."
* Rewards:
   * ITEM_BAG
   * ITEM_TOWN_MAP
   * ITEM_TRAINER_ID
   * ITEM_POKEGEAR
   * ITEM_RUNNING_SHOES

### EVT_0003_WAKE_JAMES_SEQUENCE
* Location: James House (Sproutshore Town)
* Trigger: Enter James house after F_GEAR_RECEIVED
* Flags: sets F_WAKE_JAMES_STARTED
* Dialogue:
   * James Mom: "Can you try to wake him before I do?"

### EVT_0004_WAKE_JAMES_INTERACT_1
* Location: James Bedroom
* Trigger: Interact with James
* Flags: sets F_WAKE_JAMES_1
* Dialogue:
   * James: "Zzzzz…"

### EVT_0005_WAKE_JAMES_INTERACT_2
* Location: James Bedroom
* Trigger: Interact with James (requires F_WAKE_JAMES_1)
* Flags: sets F_WAKE_JAMES_2
* Dialogue:
   * James: "Five more minutes…"

### EVT_0006_WAKE_JAMES_INTERACT_3
* Location: James Bedroom
* Trigger: Interact with James (requires F_WAKE_JAMES_2)
* Flags: sets F_WAKE_JAMES_3
* Dialogue:
   * James: "Nope."

### EVT_0007_JAMES_MOM_THREAT
* Location: James House (upstairs landing)
* Trigger: After F_WAKE_JAMES_3 (auto)
* Flags: sets F_JAMES_AWAKE
* Dialogue:
   * James Mom: "Get up or you're going to Grandma's with her Glimlot."
   * James: "WHAT!?"
   * James: "Okay okay okay!"

### EVT_0008_JAMES_RUSHES_OFF
* Location: James House (stairs)
* Trigger: After EVT_0007
* Flags: sets F_JAMES_LEFT_HOME
* Dialogue:
   * James: "Move! Emergency hero stuff!"

### EVT_0009_JAMES_MOM_THANKS
* Location: James House (downstairs)
* Trigger: Talk to James Mom after EVT_0008
* Flags: sets F_JAMES_MOM_THANKS
* Dialogue:
   * James Mom: "Thank you. He'll catch up."
   * James Mom: "Head to the Lab."


## 1) SPROUTSHORE LAB — STARTER + RIVAL 1

### EVT_0010_START_LAB
* Location: Sproutshore Lab
* Trigger: Enter lab first time
* Flags: sets F_LAB_INTRO
* Dialogue:
   * Prof. Fraxinus: "Timing's perfect. Three partners, one decision."
   * James: "Pick the one that looks like it pays rent."

### EVT_0011_STARTER_CHOICE
* Location: Sproutshore Lab
* Trigger: Interact with starter table
* Flags: requires F_LAB_INTRO, sets F_STARTER_CHOSEN + F_STARTER_(INKLET/TADLANCE/CINDEROON)
* Dialogue:
   * Prof. Fraxinus: "Treat them well. They'll define your journey."
   * Choice: CHOICE_INKLET / CHOICE_TADLANCE / CHOICE_CINDEROON

### EVT_0012_JAMES_LATE_JOKE
* Location: Sproutshore Lab
* Trigger: After starter choice
* Flags: sets F_JAMES_JOKE_1
* Dialogue:
   * James: "Choosing first only puts you at a disadvantage."
   * James: "Thanks for the handicap."
### EVT_0013_RIVAL_BATTLE_1
* Location: Sproutshore Lab
* Trigger: Talk to James after starter choice
* Flags: requires F_STARTER_CHOSEN, sets F_RIVAL1_DONE
* Dialogue:
   * James: "We battle before we go."
   * James: "I need proof I'm on top of the world."
* Battle Call: BATTLE_CALL_RIVAL(1, STARTER_BRANCH)
* Post:
   * James (defeat): "Okay, okay—your starter has hands."

## 2) ROUTE 2 / TIDEPATH ROAD — THE QUESTION + TRAINERS + RIVAL 2

### EVT_0101_ROUTE2_THE_QUESTION
* Location: Route 2 entrance
* Trigger: First step onto Route 2
* Flags: sets F_QUESTION_SCENE_DONE
* Dialogue:
   * Mysterious Man: "A simple offer. Never die… or never grow old."
   * Choice: CHOICE_NEVER_DIE / CHOICE_NEVER_GROW_OLD / CHOICE_UNSURE
   * Mysterious Man: "Interesting. We will meet again."

### EVT_0102_ROUTE2_RIVAL_BATTLE_2
* Location: Route 2 (end gate before Verdant Village)
* Trigger: Enter gate zone
* Flags: requires F_QUESTION_SCENE_DONE, sets F_RIVAL2_DONE
* Dialogue:
   * James: "Checkpoint! If I win, you owe me a dramatic scream."
* Battle Call: BATTLE_CALL_RIVAL(2, STARTER_BRANCH)


(Full event chain continues in this file: Gym 1 gate → Gym 2 gate via Celeste Pass → Gym 3 relay quest → Gym 4 ward charm + candle trial → Library Veil reveal → Gym 5 hideout → Forge blockade → Gym 6 rescue → Graxen Fountain humiliation/orb theft → Saber Ruins lore → Hearmist Island Pytavor → Fountain Depth corruption → Director defeat + twist → Forge unlock + Gym 8 → Final Rival → Victory Road → Elite Four/Champion.)


---
# PART B — FULL TRAINER ROSTER (EVERY TRAINER)

## RULES APPLIED
- Towns have no wild encounters except Water (Surf/Fish).
- Beginner areas: 2–3 trainers (Route 2 / Tidepath).
- Mid areas: 5–9 trainers.
- End areas: 6–9 trainers.
- Team Veil scaling: early 2–3, mid 5–7, end 7–11.
- Held items + deliberate setup begins at Gym 5 (leaders + bosses).


---
# PART C — RIVAL JAMES (ALL TEAMS)

## STARTER BRANCH MAPPING
- If player chose **Inklet** → James chooses **Tadlance**
- If player chose **Tadlance** → James chooses **Cinderoon**
- If player chose **Cinderoon** → James chooses **Inklet**

## RIVAL TEAMS (EVERY BATTLE)

RIVAL: James
Starter Choice: counter
Intro: "So you're the new trainer? Don't think I'll go easy on you!"
Defeat: "Tch... You got lucky this time!"
Victory: "Ha! Looks like I'm still one step ahead!"
------------------------------------------------------------------------
RIVAL_B1 (Lab) — Jokester
- Starter Lv 5 — (branch)
------------------------------------------------------------------------

RIVAL_B2 (Route 2 pre-Gym1) — Jokester
- Starter Lv 9 — (branch)
- Shinx Lv 9 — Plus
------------------------------------------------------------------------

RIVAL_B3 (Leaving Castle) — Taking notes
- Starter Stage 2 Lv 21 — (Runink / Branquire / Blazit)
- Luxio Lv 21 — Static
- Gravowl Lv 21 — Weak Armor
- Gible (Thalorian Form) Lv 22 — Frozen Forge
------------------------------------------------------------------------

RIVAL_B4 (After Gym3) — Joke turns sinister
- Starter Stage 2 Lv 27
- Luxio Lv 28 — Static
- Gravern Lv 27 — Sand Force
- Gabite (Thalorian Form) Lv 28 — Frozen Forge
- Mothrave Lv 27 — Loomlight Trap
------------------------------------------------------------------------

RIVAL_B5 (Route 5 approach) — Locked roster
- Starter Stage 2 Lv 35
- Luxray Lv 35 — Infiltrator
- Gravern Lv 35 — Sand Force
- Gabite (Thalorian Form) Lv 35 — Frozen Forge
- Mothrave Lv 35 — Tinted Lens
------------------------------------------------------------------------

RIVAL_B6 (Post Gym5) — Pressure begins (6)
- Starter Final Lv 41
- Luxray Lv 41 — Infiltrator
- Gravern Lv 41 — Sand Force
- Gabite (Thalorian Form) Lv 41 — Frozen Forge
- Mothrave Lv 41 — Tinted Lens
- Anvilspecter Lv 41 — Spectral Rivet
- Items: 1× Hyper Potion
------------------------------------------------------------------------

RIVAL_B7 (Graxen Arc) — Serious
- Starter Final Lv 47
- Luxray Lv 47 — Infiltrator — Magnet
- Gargryph Lv 47 — Sturdy — Sitrus Berry
- Gabite (Thalorian Form) Lv 47 — Frozen Forge
- Forgehaunt Lv 47 — Mirror Armor — Leftovers
- Mothrave Lv 47 — Tinted Lens — Wise Glasses
- Items: 2× Hyper Potion
------------------------------------------------------------------------

RIVAL_B8 (Corrupted) — Break point
- Starter Final Lv 59
- Luxray Lv 59 — Infiltrator
- Gargryph Lv 59 — Sturdy
- Forgehaunt Lv 59 — Mirror Armor
- Moldraith Lv 60 — Sovereign Blight
- Garchomp (Thalorian Form) Lv 60 — Frozen Forge
- Items: 3× Hyper Potion
------------------------------------------------------------------------

RIVAL_FINAL (League Gate / pre–Victory Road) — Optimized
- Starter Final Lv 61
- Luxray Lv 61 — Infiltrator
- Gargryph Lv 61 — Sturdy
- Forgehaunt Lv 60 — Mirror Armor
- Mothrave Lv 60 — Tinted Lens
- Garchomp (Thalorian Form) Lv 62 — Frozen Forge (Ace)
- Items: 2× Hyper Potion, 1× Full Restore
------------------------------------------------------------------------


---
# PART D — TEAM VEIL (ALL FIGHTS)

EVIL TEAM: Team Veil
Leader: The Director
Type Theme: multi (control, denial, pressure)
Goal: "To reclaim the Orb and unseal the Fountain's power."
Grunt Intro: "You don’t get to read what we bled for."
Leader Intro: "So, the little hero finally arrives."
------------------------------------------------------------------------

## VEIL FIGHT LIST (EVERY REQUIRED BATTLE)
- VEIL_GRUNT_LIB_01 (Lakespire Library)
- VEIL_GRUNT_HIDEOUT_01 (Route 5 Hideout)
- VEIL_GRUNT_HIDEOUT_02 (Route 5 Hideout)
- VEIL_CAPTAIN_HIDEOUT (Route 5 Hideout mini-boss)
- VEIL_GRAXEN_GRUNT_01 (Graxen City)
- VEIL_GRAXEN_ENFORCER_01 (Graxen City)
- VEIL_RUINS_GRUNT_01 (Saber Ruins)
- VEIL_RUINS_GRUNT_02 (Saber Ruins)
- VEIL_ADMIN_RUINS_01 (Saber Ruins Admin)
- VEIL_DIRECTOR_BOSS (Fountain Depth core)


TRAINER: VEIL_RUINS_GRUNT_01
Class: Team Veil Grunt
Prize: 5200
Intro: "The decree was a cage." 
Defeat: "Then break it yourself." 
Team:
- Murkrow Lv 52 — Prankster
- Skulkid Lv 52 — Nightfeed
- Sporegnash Lv 52 — Poison Point
- Voltigar Lv 53 — Galvanize
- Sageveil Lv 53 — Grassy Surge
- Anvilspecter Lv 53 — Spectral Rivet
- Dreadbramble Lv 53 — Nightfeed
Items: 1× Hyper Potion
------------------------------------------------------------------------

TRAINER: VEIL_RUINS_GRUNT_02
Class: Team Veil Grunt
Prize: 5600
Intro: "You don’t know loss." 
Defeat: "Then learn." 
Team:
- Honchkrow Lv 53 — Corrosion
- Morbaxol Lv 53 — Pickpocket
- Briarovere Lv 53 — Infiltrator
- Glimmerk Lv 54 — Magic Bounce
- Augurusk Lv 54 — Sand Stream
- Forgehaunt Lv 54 — Cursed Body
- Voltigar Lv 54 — Moxie
- Sageveil Lv 54 — Synchronize
- Stormcorv Lv 54 — Wind Rider
Items: 2× Hyper Potion
------------------------------------------------------------------------

BOSS: VEIL_DIRECTOR_BOSS
Intro: "You want the Orb? Then carry what it costs."
Defeat: "I tried to save one life… and learned what loss really is."
Battle Call: BATTLE_CALL_BOSS(VEIL_DIRECTOR)
Team (Boss — 8 Pokémon, items):
- Honchkrow Lv 66 — Moxie — Leftovers
- Dreadbramble Lv 66 — Prankster — Light Clay
- Glimmerk Lv 66 — Magic Bounce — Light Clay
- Augurusk Lv 67 — Sand Stream — TwistedSpoon
- Sageveil Lv 67 — Grassy Surge — Miracle Seed
- Forgehaunt Lv 67 — Mirror Armor — Metal Coat
- Morbaxol Lv 67 — Pickpocket — Mystic Water
- Voltigar Lv 68 — Moxie — Magnet (Ace)
Items: 2× Full Restore, 2× Hyper Potion
------------------------------------------------------------------------


---
# PART E — VICTORY ROAD → ELITE FOUR → CHAMPION (ALL TEAMS)

## ELITE FOUR (Dual-Type Themes)

ELITE FOUR: **Aero Marshal Kaine**
Theme: Flying / Ground (weather control, sandstorm tempo)
Intro: "The sky and the earth both answer to preparation."
Defeat: "You prepared better."
Team:
- Galecrest Lv 63 — Wind Rider — Sharp Beak
- Gargryph Lv 63 — Sturdy — Rocky Helmet
- Quakemaw Lv 64 — Water Absorb — Leftovers
- Monolithorn Lv 64 — Sand Stream — Smooth Rock
- Aeroracle Lv 65 — Cloud Nine — Wise Glasses
- Augurusk Lv 66 — Sand Stream — TwistedSpoon (Ace)
Items: 2× Full Restore
------------------------------------------------------------------------

ELITE FOUR: **Toxic Pyre Liora**
Theme: Poison / Fire (status, chip, denial)
Intro: "If you can’t cure it, you outlast it."
Defeat: "You outlasted me."
Team:
- Sporegnash Lv 63 — Poison Point — Black Sludge
- Herbend Lv 63 — Corrosion — Black Sludge
- Cindermaw Lv 64 — Flash Fire — Charcoal
- Cauterforge Lv 64 — Forgebrand — Metal Coat
- Morbaxol Lv 65 — Pickpocket — Mystic Water
- Dreadbramble Lv 66 — Prankster — Leftovers (Ace)
Items: 2× Full Restore
------------------------------------------------------------------------

ELITE FOUR: **Frostwyrm Sable**
Theme: Ice / Dragon (raw power, KO pressure)
Intro: "No tricks. Just force."
Defeat: "You hit harder."
Team:
- Drakeshard Lv 64 — Tough Claws — Dragon Fang
- Pondrake Lv 64 — Water Absorb — NeverMeltIce
- Garchomp (Thalorian Form) Lv 65 — Frozen Forge — Yache Berry
- Stormcorv Lv 65 — Intimidate — Leftovers
- Pytavor Lv 66 — Verdant Dominion — Dragon Fang
- Fontessa Lv 67 — Moonlit Undertow — Leftovers (Ace)
Items: 2× Full Restore
------------------------------------------------------------------------

ELITE FOUR: **Gravewright Rowan**
Theme: Ghost / Normal (swap traps, Destiny Bond/Perish plays)
Intro: "Sometimes winning means choosing when to lose."
Defeat: "You refused my bargains."
Team:
- Shadewick Lv 64 — Prankster — Focus Sash
- Stitchurn Lv 64 — Levitate — Leftovers
- Forgehaunt Lv 65 — Mirror Armor — Rocky Helmet
- Aged Gargryph (Aged Variant) Lv 65 — Ghost / Rock — Leftovers
- Pipsqueak Lv 66 — Scrappy — Silk Scarf
- Anvilspecter Lv 67 — Spectral Rivet — Leftovers (Ace)
Items: 2× Full Restore
------------------------------------------------------------------------

CHAMPION: **Ricky Spanish**
Role: Champion (all-types, smartest, adapts)
Intro: "A hero isn’t a title. It’s a decision, every turn."
Defeat: "You made the right decisions—consistently."
Team:
- Luxray Lv 66 — Infiltrator — Magnet
- Sageveil Lv 66 — Grassy Surge — Miracle Seed
- Morbaxol Lv 66 — Pickpocket — Mystic Water
- Forgehaunt Lv 67 — Mirror Armor — Metal Coat
- Garchomp (Thalorian Form) Lv 68 — Frozen Forge — Yache Berry
- Justyrn Lv 70 — Pressure — Leftovers (Ace)
Items: 3× Full Restore
------------------------------------------------------------------------


---
# APPENDIX 1 — POKEDEX (YOUR DEXBOOK)

Paste-safe source included below exactly as in your combined dexbook pack.

```text
THALORIA — MASTER POKEDEX (DEX #001–#178) — Movesets + Habitats + Abilities + Base EXP + Pokedex Entries
Format per entry: Dex / Name / Type / Pokedex Entry / Abilities (+Hidden) / Base EXP / Habitat & Encounter / Evolution / Stats / Level-Up Moves

SECTION A — CUSTOM ABILITY EFFECTS (18)

Frozen Forge
How it works: If hit by a Fire-type damaging move, this Pokémon’s next Ice-type damaging move is boosted 1.5×. In doubles, single-target Fire moves aimed at an ally are redirected to this Pokémon (spread moves are not redirected).
Given to: #176 Gible (Thalorian Form), #177 Gabite (Thalorian Form), #178 Garchomp (Thalorian Form)

Verdant Dominion
How it works: On switch-in: sets Grassy Terrain for 5 turns. While Grassy Terrain is active, this Pokémon’s Dragon-type moves gain 1.2× power.
Given to: #167 Pytavor (Legendary)

Moonlit Undertow
How it works: On switch-in: sets Misty Terrain for 5 turns. While Misty Terrain is active, Water-type moves used against this Pokémon deal 0.75× damage.
Given to: #168 Fontessa (Legendary)

Patina Dynamo
How it works: Once per battle: the first time this Pokémon is hit by a super-effective move, damage is reduced by 25%, then this Pokémon gains +1 SpA.
Given to: #169 Aged Titan (Apex)

Sovereign Blight
How it works: On switch-in: opposing Pokémon are inflicted with a weakened Badly Poisoned state (ramps slower) unless they are Steel/Poison or immune. Cleansing moves/items fail for 2 turns.
Given to: #170 Moldraith (Legendary)

Bog Reclaimer
How it works: Poison status heals this Pokémon 1/16 max HP per turn instead of damaging it. While poisoned, its Grass-type moves gain 1.2× power.
Given to: #171 Aged Miregloop (Aged Variant)

Thornrot Crown
How it works: When this Pokémon poisons a target, that target also has its Speed lowered by 1 stage (once per target per switch-in).
Given to: #172 Aged Briarovere (Aged Variant)

Carrion Draft
How it works: After this Pokémon uses a Flying-type damaging move, the opponent’s side gains a 3-turn 'Toxic Gust': grounded foes take 1/16 max HP each end step if they are already statused.
Given to: #173 Aged Honchkrow (Aged Variant)

Gleam Surge
How it works: On switch-in: lowers adjacent foes’ SpA by 1 stage. If hit by a Dark-type move, this Pokémon gains +1 Speed (once per turn).
Given to: #174 Aged Luxray (Aged Variant)

Tomb Rampart
How it works: The first time this Pokémon drops below 50% HP, it gains a 3-turn damage reduction shield (0.8×).
Given to: #175 Aged Gargryph (Aged Variant)

Loomlight Trap
How it works: When an opponent makes contact, it may become ensnared for 2 turns (cannot switch via pivot moves) and its Speed drops by 1 (once per switch-in).
Given to: #013 Threadle, #014 Silkreep, #015 Mothrave

Prism Relay
How it works: The first time each switch-in that this Pokémon would be inflicted with a status condition, it reflects it back (if possible) and gains +1 SpA.
Given to: #069 Prismalia

Reef Covenant
How it works: While Rain is active, this Pokémon heals 1/16 max HP each turn and its Fairy-type moves gain 1.2× power.
Given to: #047 Reefwisp, #105 Coralmason

Delta Silt
How it works: Immune to Sticky Web Speed drops. When it uses a Water-type move, it gains +1 Speed (once per turn).
Given to: #112 Deltaquag, #113 Marshquake

Forgebrand
How it works: If hit by a Water-type damaging move, this Pokémon gains +1 Atk; its next Steel-type damaging move is boosted 1.3× (once per turn).
Given to: #116 Cauterforge

Spectral Rivet
How it works: Contact moves used against this Pokémon prevent the attacker from switching for 2 turns (does not affect Ghost-types).
Given to: #135 Ferrowisp, #136 Anvilspecter

Nightfeed
How it works: At end of turn, if any opposing Pokémon is statused, this Pokémon heals 1/16 max HP (2/16 if any opponent is asleep).
Given to: #126 Skulkid, #127 Nightgraze, #128 Dreadbramble

Drakeshard Aegis
How it works: Once per switch-in: the first Ice- or Fairy-type damaging move against this Pokémon deals 0.75× damage; then this Pokémon gains +1 Atk.
Given to: #123 Hatchling, #124 Wyrmkin, #125 Drakeshard

________________

#001 — Inklet
Type: Water
Pokedex Entry: It is commonly found around coastal shallows. It glides through water with effortless control, striking when currents favor it.
Abilities: Torrent
Hidden Ability: Rain Dish
Base EXP Yield: 63
Habitat/Encounter: coastal shallows | Gift @ Whereabouts Unknown (Starter Gift Line) | — | —
Evolution: —
Stats: HP 80 / Atk 65 / Def 75 / SpA 120 / SpD 95 / Spe 100 (BST 535)
Level-Up Moves:

________________

#002 — Runink
Type: Water
Pokedex Entry: It is commonly found around deep lakes. It glides through water with effortless control, striking when currents favor it.
Abilities: Torrent
Hidden Ability: Rain Dish
Base EXP Yield: 142
Habitat/Encounter: deep lakes | Gift @ Whereabouts Unknown (Starter Gift Line) | — | —
Evolution: —
Stats: —
Level-Up Moves: —

________________

#003 — Arcanquid
Type: Water / Psychic
Pokedex Entry: It is commonly found around abyssal waters. It glides through water with effortless control, striking when currents favor it.
Abilities: Torrent
Hidden Ability: Rain Dish
Base EXP Yield: 239
Habitat/Encounter: abyssal waters | Gift @ Whereabouts Unknown (Starter Gift Line) | — | —
Evolution: —
Stats: —
Level-Up Moves: —

________________

#004 — Tadlance
Type: Grass
Pokedex Entry: It is commonly found around meadow edges. It draws strength from living terrain and grows more dangerous the longer a fight lasts.
Abilities: Overgrow
Hidden Ability: Leaf Guard
Base EXP Yield: 63
Habitat/Encounter: meadow edges | Gift @ Whereabouts Unknown (Starter Gift Line) | — | —
Evolution: —
Stats: HP 95 / Atk 120 / Def 115 / SpA 60 / SpD 90 / Spe 55 (BST 535)
Level-Up Moves:

________________

#005 — Branquire
Type: Grass / Fighting
Pokedex Entry: It is commonly found around forest paths. It draws strength from living terrain and grows more dangerous the longer a fight lasts.
Abilities: Overgrow
Hidden Ability: Leaf Guard
Base EXP Yield: 142
Habitat/Encounter: forest paths | Gift @ Whereabouts Unknown (Starter Gift Line) | — | —
Evolution: —
Stats: —
Level-Up Moves: —

________________

#006 — Thronoak
Type: Grass / Fighting
Pokedex Entry: It is commonly found around ancient groves. It draws strength from living terrain and grows more dangerous the longer a fight lasts.
Abilities: Overgrow
Hidden Ability: Leaf Guard
Base EXP Yield: 239
Habitat/Encounter: ancient groves | Gift @ Whereabouts Unknown (Starter Gift Line) | — | —
Evolution: —
Stats: —
Level-Up Moves: —

________________

#007 — Cinderoon
Type: Fire
Pokedex Entry: It is commonly found around warm trails. It generates intense heat and uses it to pressure opponents into mistakes.
Abilities: Blaze
Hidden Ability: Flame Body
Base EXP Yield: 63
Habitat/Encounter: warm trails | Gift @ Whereabouts Unknown (Starter Gift Line) | — | —
Evolution: —
Stats: HP 75 / Atk 125 / Def 70 / SpA 65 / SpD 70 / Spe 130 (BST 535)
Level-Up Moves:

________________

#008 — Blazit
Type: Fire
Pokedex Entry: It is commonly found around scorched routes. It generates intense heat and uses it to pressure opponents into mistakes.
Abilities: Blaze
Hidden Ability: Flame Body
Base EXP Yield: 142
Habitat/Encounter: scorched routes | Gift @ Whereabouts Unknown (Starter Gift Line) | — | —
Evolution: —
Stats: —
Level-Up Moves: —

________________

#009 — Inferyx
Type: Fire / Dark
Pokedex Entry: It is commonly found around volcanic outskirts. It generates intense heat and uses it to pressure opponents into mistakes.
Abilities: Blaze
Hidden Ability: Flame Body
Base EXP Yield: 239
Habitat/Encounter: volcanic outskirts | Gift @ Whereabouts Unknown (Starter Gift Line) | — | —
Evolution: —
Stats: —
Level-Up Moves: —

________________

#010 — Gravowl
Type: Rock / Flying
Pokedex Entry: It is commonly found around cliff ruins. It hardens its body like stone and punishes careless contact.
Abilities: Weak Armor / Wind Rider
Hidden Ability: Sturdy
Base EXP Yield: 60
Habitat/Encounter: cliff ruins | Land @ Route 4 | 8% | Lv 10–13
Evolution: —
Stats: HP 85 / Atk 113 / Def 118 / SpA 61 / SpD 78 / Spe 80 (BST 535)
Level-Up Moves:

________________

#011 — Gravern
Type: Rock / Flying
Pokedex Entry: It is commonly found around high ridges. It hardens its body like stone and punishes careless contact.
Abilities: Sand Force / Keen Eye
Hidden Ability: Rock Head
Base EXP Yield: 140
Habitat/Encounter: high ridges | Land @ Whitehorn Mountains | 3% | Lv 24–28
Evolution: —
Stats: —
Level-Up Moves: —

________________

#012 — Gargryph
Type: Rock / Flying
Pokedex Entry: It is commonly found around old castles. It hardens its body like stone and punishes careless contact.
Abilities: Sturdy / Gale Wings
Hidden Ability: Sand Stream
Base EXP Yield: 225
Habitat/Encounter: old castles | Land @ Victory Road | 1% | Lv 45–55
Evolution: —
Stats: —
Level-Up Moves: —

________________

#013 — Threadle
Type: Bug
Pokedex Entry: It is commonly found around roadside grass. It overwhelms foes with persistent pressure and clever trapping tactics.
Abilities: Loomlight Trap / Shield Dust
Hidden Ability: Adaptability
Base EXP Yield: 55
Habitat/Encounter: roadside grass | Land @ Tidepath Road | 25% | Lv 2–5
Evolution: —
Stats: HP 75 / Atk 65 / Def 70 / SpA 120 / SpD 85 / Spe 95 (BST 510)
Level-Up Moves:

________________

#014 — Silkreep
Type: Bug
Pokedex Entry: It is commonly found around tall weeds. It overwhelms foes with persistent pressure and clever trapping tactics.
Abilities: Loomlight Trap / Compound Eyes
Hidden Ability: Honey Gather
Base EXP Yield: 130
Habitat/Encounter: tall weeds | Land @ Route 2 | 14% | Lv 5–8
Evolution: —
Stats: —
Level-Up Moves: —

________________

#015 — Mothrave
Type: Bug / Psychic
Pokedex Entry: It is commonly found around moonlit clearings. It overwhelms foes with persistent pressure and clever trapping tactics.
Abilities: Loomlight Trap / Tinted Lens
Hidden Ability: Honey Gather
Base EXP Yield: 185
Habitat/Encounter: moonlit clearings | Land (Night) @ Pophyr Grove | 4% | Lv 18–24
Evolution: —
Stats: —
Level-Up Moves: —

________________

#016 — Mossling
Type: Grass
Pokedex Entry: It is commonly found around mossy banks. It draws strength from living terrain and grows more dangerous the longer a fight lasts.
Abilities: Sap Sipper / Grassy Surge
Hidden Ability: Chlorophyll
Base EXP Yield: 60
Habitat/Encounter: mossy banks | Land @ Tidepath Road | 18% | Lv 2–5
Evolution: —
Stats: HP 88 / Atk 92 / Def 118 / SpA 72 / SpD 95 / Spe 70 (BST 535)
Level-Up Moves:

________________

#017 — Mosslush
Type: Grass
Pokedex Entry: It is commonly found around damp thickets. It draws strength from living terrain and grows more dangerous the longer a fight lasts.
Abilities: Grassy Surge / Overgrow
Hidden Ability: Leaf Guard
Base EXP Yield: 140
Habitat/Encounter: damp thickets | Land @ Swoven Swamp | 10% | Lv 8–12
Evolution: —
Stats: —
Level-Up Moves: —

________________

#018 — Miregloop
Type: Grass / Rock
Pokedex Entry: It is commonly found around bogstone flats. It draws strength from living terrain and grows more dangerous the longer a fight lasts.
Abilities: Overgrow / Rock Head
Hidden Ability: Leaf Guard
Base EXP Yield: 225
Habitat/Encounter: bogstone flats | Land @ Swoven Swamp | 4% | Lv 14–18
Evolution: —
Stats: —
Level-Up Moves: —

________________

#019 — Chickind
Type: Normal
Pokedex Entry: It is commonly found around farm fields. It survives by versatility, learning whatever tools a situation demands.
Abilities: Keen Eye / Adaptability
Hidden Ability: Pickup
Base EXP Yield: 60
Habitat/Encounter: farm fields | Land @ Tidepath Road | 20% | Lv 2–5
Evolution: —
Stats: HP 78 / Atk 70 / Def 72 / SpA 120 / SpD 95 / Spe 100 (BST 535)
Level-Up Moves:

________________

#020 — Roostrik
Type: Normal / Flying
Pokedex Entry: It is commonly found around open routes. It survives by versatility, learning whatever tools a situation demands.
Abilities: Adaptability / Cloud Nine
Hidden Ability: Pickup
Base EXP Yield: 140
Habitat/Encounter: open routes | Land @ Route 3 | 10% | Lv 10–14
Evolution: —
Stats: —
Level-Up Moves: —

________________

#021 — Aeroracle
Type: Flying / Psychic
Pokedex Entry: It is commonly found around windy overlooks. It uses wind and elevation to control spacing and tempo.
Abilities: Cloud Nine / Psychic Surge
Hidden Ability: Wind Rider
Base EXP Yield: 225
Habitat/Encounter: windy overlooks | Land @ Route 7 | 2% | Lv 28–34
Evolution: —
Stats: —
Level-Up Moves: —

________________

#022 — Sprigadet
Type: Grass
Pokedex Entry: It is commonly found around village outskirts. It draws strength from living terrain and grows more dangerous the longer a fight lasts.
Abilities: Sap Sipper / Grassy Surge
Hidden Ability: Chlorophyll
Base EXP Yield: 140
Habitat/Encounter: village outskirts | Land @ Route 3 | 12% | Lv 8–12
Evolution: —
Stats: HP 78 / Atk 75 / Def 80 / SpA 95 / SpD 95 / Spe 82 (BST 505)
Level-Up Moves:

________________

#023 — Cerelodge
Type: Grass / Rock
Pokedex Entry: It is commonly found around terraced hills. It draws strength from living terrain and grows more dangerous the longer a fight lasts.
Abilities: Grassy Surge / Sturdy
Hidden Ability: Chlorophyll
Base EXP Yield: 140
Habitat/Encounter: terraced hills | Land @ Route 6 | 3% | Lv 26–34
Evolution: —
Stats: —
Level-Up Moves: —

________________

#024 — Armaroust
Type: Grass / Steel
Pokedex Entry: It is commonly found around forgeside gardens. It draws strength from living terrain and grows more dangerous the longer a fight lasts.
Abilities: Overgrow / Sturdy
Hidden Ability: Leaf Guard
Base EXP Yield: 140
Habitat/Encounter: forgeside gardens | Land @ Gabite’s Forge | 3% | Lv 26–34
Evolution: —
Stats: —
Level-Up Moves: —

________________

#025 — Herbend
Type: Grass / Poison
Pokedex Entry: It is commonly found around herb marsh. It draws strength from living terrain and grows more dangerous the longer a fight lasts.
Abilities: Chlorophyll / Corrosion
Hidden Ability: Effect Spore
Base EXP Yield: 140
Habitat/Encounter: herb marsh | Land @ Whisperwoods | 4% | Lv 24–30
Evolution: —
Stats: —
Level-Up Moves: —

________________

#026 — Meowth (Thalorian Form)
Type: Steel
Pokedex Entry: It is commonly found around backstreets. Its body is reinforced like metal, shrugging off impacts that would drop other Pokémon.
Abilities: Heatproof / Light Metal
Hidden Ability: Mirror Armor
Base EXP Yield: 70
Habitat/Encounter: backstreets | Land @ Graxen City (Outskirts) | 8% | Lv 16–22
Evolution: —
Stats: —
Level-Up Moves: —

________________

#027 — Ferrser
Type: Steel
Pokedex Entry: It is commonly found around scrapyards. Its body is reinforced like metal, shrugging off impacts that would drop other Pokémon.
Abilities: Light Metal / Heavy Metal
Hidden Ability: Clear Body
Base EXP Yield: 185
Habitat/Encounter: scrapyards | Land @ Gabite’s Forge | 4% | Lv 24–30
Evolution: —
Stats: —
Level-Up Moves: —

________________

#028 — Shinx
Type: Electric
Pokedex Entry: It is commonly found around fence-lines. It stores charge in its body and releases it in precise bursts.
Abilities: Galvanize / Plus
Hidden Ability: Volt Absorb
Base EXP Yield: 60
Habitat/Encounter: fence-lines | Land @ Route 2 | 12% | Lv 4–7
Evolution: —
Stats: HP 81 / Atk 97 / Def 73 / SpA 91 / SpD 70 / Spe 108 (BST 520)
Level-Up Moves:

________________

#029 — Luxio
Type: Electric
Pokedex Entry: It is commonly found around storm paths. It stores charge in its body and releases it in precise bursts.
Abilities: Plus / Static
Hidden Ability: Motor Drive
Base EXP Yield: 140
Habitat/Encounter: storm paths | Land @ Route 6 | 5% | Lv 18–24
Evolution: —
Stats: —
Level-Up Moves: —

________________

#030 — Luxray
Type: Electric / Dark
Pokedex Entry: It is commonly found around night ridges. It stores charge in its body and releases it in precise bursts.
Abilities: Static / Infiltrator
Hidden Ability: Motor Drive
Base EXP Yield: 225
Habitat/Encounter: night ridges | Land (Night) @ Route 8 | 2% | Lv 38–46
Evolution: —
Stats: —
Level-Up Moves: —

________________

#031 — Glimlot
Type: Water
Pokedex Entry: It is commonly found around river shallows. It glides through water with effortless control, striking when currents favor it.
Abilities: Water Absorb / Swift Swim
Hidden Ability: Hydration
Base EXP Yield: 60
Habitat/Encounter: river shallows | Surf @ Riverbend Crossing | 14% | Lv 8–12
Evolution: —
Stats: HP 100 / Atk 78 / Def 79 / SpA 80 / SpD 87 / Spe 96 (BST 520)
Level-Up Moves:

________________

#032 — Fentotl
Type: Water / Dark
Pokedex Entry: It is commonly found around swamp channels. It glides through water with effortless control, striking when currents favor it.
Abilities: Swift Swim / Moxie
Hidden Ability: Hydration
Base EXP Yield: 140
Habitat/Encounter: swamp channels | Surf @ Swoven Swamp | 6% | Lv 14–18
Evolution: —
Stats: —
Level-Up Moves: —

________________

#033 — Morbaxol
Type: Water / Dark
Pokedex Entry: It is commonly found around blackwater pools. It glides through water with effortless control, striking when currents favor it.
Abilities: Rain Dish / Pickpocket
Hidden Ability: Damp
Base EXP Yield: 225
Habitat/Encounter: blackwater pools | Surf @ Whisperwoods | 2% | Lv 28–34
Evolution: —
Stats: —
Level-Up Moves: —

________________

#034 — Snarlil
Type: Fighting
Pokedex Entry: It is commonly found around training trail. It trains relentlessly and breaks defenses with practiced technique.
Abilities: Defiant / Mold Breaker
Hidden Ability: Iron Fist
Base EXP Yield: 60
Habitat/Encounter: training trail | Land @ Route 3 | 10% | Lv 10–14
Evolution: —
Stats: HP 91 / Atk 117 / Def 99 / SpA 60 / SpD 73 / Spe 80 (BST 520)
Level-Up Moves:

________________

#035 — Tasmor
Type: Fighting
Pokedex Entry: It is commonly found around rocky route. It trains relentlessly and breaks defenses with practiced technique.
Abilities: Mold Breaker / Guts
Hidden Ability: Scrappy
Base EXP Yield: 140
Habitat/Encounter: rocky route | Land @ Route 5 | 6% | Lv 16–20
Evolution: —
Stats: —
Level-Up Moves: —

________________

#036 — Devastan
Type: Fighting / Rock
Pokedex Entry: It is commonly found around cliff arenas. It trains relentlessly and breaks defenses with practiced technique.
Abilities: Guts / Rock Head
Hidden Ability: Scrappy
Base EXP Yield: 225
Habitat/Encounter: cliff arenas | Land @ Route 8 | 2% | Lv 34–42
Evolution: —
Stats: —
Level-Up Moves: —

________________

#037 — Spikimp
Type: Dark / Electric
Pokedex Entry: It is commonly found around dock alleys. It fights with ruthless instincts and exploits openings without hesitation.
Abilities: Infiltrator / Motor Drive
Hidden Ability: Moxie
Base EXP Yield: 60
Habitat/Encounter: dock alleys | Land (Night) @ Pillage Post | 8% | Lv 10–14
Evolution: —
Stats: HP 85 / Atk 125 / Def 85 / SpA 80 / SpD 80 / Spe 115 (BST 570)
Level-Up Moves:

________________

#038 — Spiklash
Type: Dark / Electric
Pokedex Entry: It is commonly found around storm docks. It fights with ruthless instincts and exploits openings without hesitation.
Abilities: Prankster / Lightning Rod
Hidden Ability: Pickpocket
Base EXP Yield: 140
Habitat/Encounter: storm docks | Land (Night) @ Riverbend Crossing | 4% | Lv 18–24
Evolution: —
Stats: —
Level-Up Moves: —

________________

#039 — Voltigar
Type: Dark / Electric
Pokedex Entry: It is commonly found around blackout roads. It fights with ruthless instincts and exploits openings without hesitation.
Abilities: Moxie / Galvanize
Hidden Ability: Pressure
Base EXP Yield: 225
Habitat/Encounter: blackout roads | Land (Night) @ Route 8 | 1% | Lv 45–55
Evolution: —
Stats: —
Level-Up Moves: —

________________

#040 — Scorillet
Type: Fire
Pokedex Entry: It is commonly found around warm grass. It generates intense heat and uses it to pressure opponents into mistakes.
Abilities: Competitive / Solar Power
Hidden Ability: Flash Fire
Base EXP Yield: 65
Habitat/Encounter: warm grass | Land @ Route 5 | 12% | Lv 12–16
Evolution: —
Stats: HP 71 / Atk 112 / Def 102 / SpA 69 / SpD 69 / Spe 97 (BST 520)
Level-Up Moves:

________________

#041 — Cindermaw
Type: Fire / Rock
Pokedex Entry: It is commonly found around ash banks. It generates intense heat and uses it to pressure opponents into mistakes.
Abilities: Solar Power / Sturdy
Hidden Ability: Flash Fire
Base EXP Yield: 185
Habitat/Encounter: ash banks | Land @ Forlort Keep (Volcano Slopes) | 4% | Lv 28–34
Evolution: —
Stats: —
Level-Up Moves: —

________________

#042 — Ripplet
Type: Water
Pokedex Entry: It is commonly found around lake edge. It glides through water with effortless control, striking when currents favor it.
Abilities: Torrent / Water Absorb
Hidden Ability: Rain Dish
Base EXP Yield: 60
Habitat/Encounter: lake edge | Surf @ Lakespire Town (Lake) | 16% | Lv 10–14
Evolution: —
Stats: HP 94 / Atk 88 / Def 86 / SpA 89 / SpD 89 / Spe 74 (BST 520)
Level-Up Moves:

________________

#043 — Currentide
Type: Water
Pokedex Entry: It is commonly found around river runs. It glides through water with effortless control, striking when currents favor it.
Abilities: Water Absorb / Swift Swim
Hidden Ability: Hydration
Base EXP Yield: 140
Habitat/Encounter: river runs | Surf @ Riverbend Crossing | 10% | Lv 14–18
Evolution: —
Stats: —
Level-Up Moves: —

________________

#044 — Brineel
Type: Water
Pokedex Entry: It is commonly found around sea shallows. It glides through water with effortless control, striking when currents favor it.
Abilities: Swift Swim / Rain Dish
Hidden Ability: Damp
Base EXP Yield: 225
Habitat/Encounter: sea shallows | Surf @ Azure Sea | 12% | Lv 12–16
Evolution: —
Stats: —
Level-Up Moves: —

________________

#045 — Skerrfin
Type: Water
Pokedex Entry: It is commonly found around reef breaks. It glides through water with effortless control, striking when currents favor it.
Abilities: Rain Dish / Hydration
Hidden Ability: Torrent
Base EXP Yield: 60
Habitat/Encounter: reef breaks | Surf @ Azure Sea | 8% | Lv 18–24
Evolution: —
Stats: HP 100 / Atk 69 / Def 82 / SpA 95 / SpD 106 / Spe 68 (BST 520)
Level-Up Moves:

________________

#046 — Gutterray
Type: Water / Poison
Pokedex Entry: It is commonly found around polluted runoff. It glides through water with effortless control, striking when currents favor it.
Abilities: Hydration / Liquid Ooze
Hidden Ability: Torrent
Base EXP Yield: 140
Habitat/Encounter: polluted runoff | Fishing @ Pillage Post | 6% | Lv 18–24
Evolution: —
Stats: —
Level-Up Moves: —

________________

#047 — Reefwisp
Type: Water / Fairy
Pokedex Entry: It is commonly found around coral glow. It glides through water with effortless control, striking when currents favor it.
Abilities: Reef Covenant / Damp
Hidden Ability: Water Absorb
Base EXP Yield: 225
Habitat/Encounter: coral glow | Surf @ Azure Sea | 3% | Lv 26–34
Evolution: —
Stats: —
Level-Up Moves: —

________________

#048 — Oracub
Type: Psychic
Pokedex Entry: It is commonly found around quiet glades. Its mindpower senses intent before movement, allowing it to answer threats instantly.
Abilities: Synchronize / Inner Focus
Hidden Ability: Telepathy
Base EXP Yield: 65
Habitat/Encounter: quiet glades | Land @ Eternal Myrillfount (Ancient Ruins) | 10% | Lv 12–16
Evolution: —
Stats: HP 74 / Atk 60 / Def 65 / SpA 90 / SpD 95 / Spe 76 (BST 460)
Level-Up Moves:

________________

#049 — Augurusk
Type: Psychic / Rock
Pokedex Entry: It is commonly found around stone circles. Its mindpower senses intent before movement, allowing it to answer threats instantly.
Abilities: Inner Focus / Sand Stream
Hidden Ability: Telepathy
Base EXP Yield: 185
Habitat/Encounter: stone circles | Cave/Ruins @ Eternal Myrillfount (Ancient Ruins) | 4% | Lv 20–26
Evolution: —
Stats: —
Level-Up Moves: —

________________

#050 — Runeling
Type: Psychic
Pokedex Entry: It is commonly found around rune stones. Its mindpower senses intent before movement, allowing it to answer threats instantly.
Abilities: Magic Guard / Telepathy
Hidden Ability: Prankster
Base EXP Yield: 140
Habitat/Encounter: rune stones | Land @ Castle Celeste | 8% | Lv 12–16
Evolution: —
Stats: —
Level-Up Moves: —

________________

#051 — Pixsprout
Type: Fairy / Grass
Pokedex Entry: It is commonly found around flower verge. It manipulates emotion and momentum, turning small advantages into inevitability.
Abilities: Magic Bounce / Sap Sipper
Hidden Ability: Dazzling
Base EXP Yield: 60
Habitat/Encounter: flower verge | Land @ Pophyr Grove | 12% | Lv 10–14
Evolution: —
Stats: —
Level-Up Moves: —

________________

#052 — Gladerin
Type: Fairy / Grass
Pokedex Entry: It is commonly found around garden paths. It manipulates emotion and momentum, turning small advantages into inevitability.
Abilities: Healer / Grassy Surge
Hidden Ability: Cute Charm
Base EXP Yield: 140
Habitat/Encounter: garden paths | Land @ Pophyr Grove | 8% | Lv 14–18
Evolution: —
Stats: —
Level-Up Moves: —

________________

#053 — Lullivy
Type: Fairy / Grass
Pokedex Entry: It is commonly found around soft meadows. It manipulates emotion and momentum, turning small advantages into inevitability.
Abilities: Dazzling / Overgrow
Hidden Ability: Pixilate
Base EXP Yield: 225
Habitat/Encounter: soft meadows | Land @ Route 7 | 10% | Lv 16–20
Evolution: —
Stats: —
Level-Up Moves: —

________________

#054 — Pebblit
Type: Rock
Pokedex Entry: It is commonly found around gravel cuts. It hardens its body like stone and punishes careless contact.
Abilities: Sturdy / Rock Head
Hidden Ability: Solid Rock
Base EXP Yield: 60
Habitat/Encounter: gravel cuts | Land @ Route 2 | 10% | Lv 5–8
Evolution: —
Stats: —
Level-Up Moves: —

________________

#055 — Cairnox
Type: Rock
Pokedex Entry: It is commonly found around stone steps. It hardens its body like stone and punishes careless contact.
Abilities: Rock Head / Sand Stream
Hidden Ability: Weak Armor
Base EXP Yield: 140
Habitat/Encounter: stone steps | Land @ Route 4 | 5% | Lv 16–22
Evolution: —
Stats: —
Level-Up Moves: —

________________

#056 — Monolithorn [ADDED]
Type: Rock / Steel
Pokedex Entry: It is commonly found around rubble. It hardens its body like stone and punishes careless contact.
Abilities: Sand Stream / Light Metal
Hidden Ability: Weak Armor
Base EXP Yield: 225
Habitat/Encounter: rubble | Cave/Ruins @ Victory Road | 1% | Lv 34–42
Evolution: —
Stats: —
Level-Up Moves: —

________________

#057 — Driftkit [ADDED]
Type: Ghost
Pokedex Entry: It is commonly found around twilight glades. It drifts through obstacles and unsettles foes with sudden, silent strikes.
Abilities: Pressure / Prankster
Hidden Ability: Cursed Body
Base EXP Yield: 65
Habitat/Encounter: twilight glades | Land (Night) @ Whisperwoods | 20% | Lv 10–14
Evolution: —
Stats: —
Level-Up Moves: —

________________

#058 — Shadewick [ADDED]
Type: Ghost / Fire
Pokedex Entry: It is commonly found around old eaves. It drifts through obstacles and unsettles foes with sudden, silent strikes.
Abilities: Prankster / Solar Power
Hidden Ability: Cursed Body
Base EXP Yield: 185
Habitat/Encounter: old eaves | Cave/Ruins @ Victory Road | 3% | Lv 26–34
Evolution: —
Stats: —
Level-Up Moves: —

________________

#059 — Bristlet [ADDED]
Type: Bug / Rock
Pokedex Entry: It is commonly found around stone hedges. It overwhelms foes with persistent pressure and clever trapping tactics.
Abilities: Honey Gather / Sturdy
Hidden Ability: Shield Dust
Base EXP Yield: 60
Habitat/Encounter: stone hedges | Land @ Route 4 | 14% | Lv 6–10
Evolution: —
Stats: —
Level-Up Moves: —

________________

#060 — Cragcarap [ADDED]
Type: Bug / Rock
Pokedex Entry: It is commonly found around stone hedges. It overwhelms foes with persistent pressure and clever trapping tactics.
Abilities: Swarm / Rock Head
Hidden Ability: Compound Eyes
Base EXP Yield: 140
Habitat/Encounter: stone hedges | Land @ Route 4 | 5% | Lv 18–24
Evolution: —
Stats: —
Level-Up Moves: —

________________

#061 — Bastilisk [ADDED]
Type: Bug / Rock
Pokedex Entry: It is commonly found around stone hedges. It overwhelms foes with persistent pressure and clever trapping tactics.
Abilities: Shield Dust / Sand Stream
Hidden Ability: Tinted Lens
Base EXP Yield: 225
Habitat/Encounter: stone hedges | Cave/Ruins @ Victory Road | 2% | Lv 34–42
Evolution: —
Stats: —
Level-Up Moves: —

________________

#062 — Budgeon [ADDED]
Type: Normal / Flying
Pokedex Entry: It is commonly found around open routes. It survives by versatility, learning whatever tools a situation demands.
Abilities: Adaptability / Cloud Nine
Hidden Ability: Pickup
Base EXP Yield: 60
Habitat/Encounter: open routes | Land @ Route 4 | 14% | Lv 6–10
Evolution: —
Stats: —
Level-Up Moves: —

________________

#063 — Skylark [ADDED]
Type: Normal / Flying
Pokedex Entry: It is commonly found around roadside grass. It survives by versatility, learning whatever tools a situation demands.
Abilities: Scrappy / Aerilate
Hidden Ability: Serene Grace
Base EXP Yield: 140
Habitat/Encounter: roadside grass | Land @ Route 4 | 6% | Lv 18–24
Evolution: —
Stats: —
Level-Up Moves: —

________________

#064 — Galecrest [ADDED]
Type: Flying
Pokedex Entry: It is commonly found around night thermals. It uses wind and elevation to control spacing and tempo.
Abilities: Aerilate / Wind Rider
Hidden Ability: Gale Wings
Base EXP Yield: 225
Habitat/Encounter: night thermals | Land @ Route 7 | 1% | Lv 34–42
Evolution: —
Stats: —
Level-Up Moves: —

________________

#065 — Burrowbit [ADDED]
Type: Ground
Pokedex Entry: It is commonly found around dry cuts. It reshapes the terrain to deny footing and safe positioning.
Abilities: Anger Point / Sand Veil
Hidden Ability: Water Absorb
Base EXP Yield: 65
Habitat/Encounter: dry cuts | Land @ Route 6 | 10% | Lv 6–10
Evolution: —
Stats: —
Level-Up Moves: —

________________

#066 — Dunejack [ADDED]
Type: Ground
Pokedex Entry: It is commonly found around dry cuts. It reshapes the terrain to deny footing and safe positioning.
Abilities: Sand Veil / Arena Trap
Hidden Ability: Poison Heal
Base EXP Yield: 185
Habitat/Encounter: dry cuts | Land @ Route 8 | 3% | Lv 26–34
Evolution: —
Stats: —
Level-Up Moves: —

________________

#067 — Spritzap [ADDED]
Type: Electric / Fairy
Pokedex Entry: It is commonly found around garden paths. It stores charge in its body and releases it in precise bursts.
Abilities: Volt Absorb / Misty Surge
Hidden Ability: Lightning Rod
Base EXP Yield: 60
Habitat/Encounter: garden paths | Land @ Route 2 | 14% | Lv 6–10
Evolution: —
Stats: —
Level-Up Moves: —

________________

#068 — Glimmerk [ADDED]
Type: Electric / Fairy
Pokedex Entry: It is commonly found around glow pools. It stores charge in its body and releases it in precise bursts.
Abilities: Motor Drive / Magic Bounce
Hidden Ability: Galvanize
Base EXP Yield: 140
Habitat/Encounter: glow pools | Land @ Route 6 | 3% | Lv 18–24
Evolution: —
Stats: —
Level-Up Moves: —

________________

#069 — Prismalia [ADDED]
Type: Electric / Fairy
Pokedex Entry: It is commonly found around flower verge. It stores charge in its body and releases it in precise bursts.
Abilities: Prism Relay / Lightning Rod
Hidden Ability: Plus
Base EXP Yield: 225
Habitat/Encounter: flower verge | Land @ Route 8 | 1% | Lv 34–42
Evolution: —
Stats: —
Level-Up Moves: —

________________

#070 — Bramblet
Type: Grass / Dark
Pokedex Entry: It is commonly found around hedgerows. It draws strength from living terrain and grows more dangerous the longer a fight lasts.
Abilities: Sap Sipper / Pressure
Hidden Ability: Overgrow
Base EXP Yield: 60
Habitat/Encounter: hedgerows | Land @ Route 3 | 12% | Lv 8–12
Evolution: —
Stats: —
Level-Up Moves: —

________________

#071 — Thornshad [ADDED]
Type: Grass / Dark
Pokedex Entry: It is commonly found around damp thickets. It draws strength from living terrain and grows more dangerous the longer a fight lasts.
Abilities: Grassy Surge / Intimidate
Hidden Ability: Chlorophyll
Base EXP Yield: 140
Habitat/Encounter: damp thickets | Land @ Whisperwoods | 6% | Lv 18–24
Evolution: —
Stats: —
Level-Up Moves: —

________________

#072 — Briarovere [ADDED]
Type: Grass / Dark
Pokedex Entry: It is commonly found around roadside grass. It draws strength from living terrain and grows more dangerous the longer a fight lasts.
Abilities: Overgrow / Infiltrator
Hidden Ability: Leaf Guard
Base EXP Yield: 225
Habitat/Encounter: roadside grass | Land @ Route 7 | 2% | Lv 34–42
Evolution: —
Stats: —
Level-Up Moves: —

________________

#073 — Kelpip [ADDED]
Type: Water / Grass
Pokedex Entry: It is commonly found around coastal shallows. It glides through water with effortless control, striking when currents favor it.
Abilities: Water Absorb / Leaf Guard
Hidden Ability: Rain Dish
Base EXP Yield: 65
Habitat/Encounter: coastal shallows | Surf @ Tidepath Road | 18% | Lv 6–10
Evolution: —
Stats: —
Level-Up Moves: —

________________

#074 — Seasilk [ADDED]
Type: Water / Grass
Pokedex Entry: It is commonly found around sea shallows. It glides through water with effortless control, striking when currents favor it.
Abilities: Swift Swim / Effect Spore
Hidden Ability: Hydration
Base EXP Yield: 185
Habitat/Encounter: sea shallows | Surf @ Azure Sea | 3% | Lv 26–34
Evolution: —
Stats: —
Level-Up Moves: —

________________

#075 — Frostlet [ADDED]
Type: Ice
Pokedex Entry: It is commonly found around snow drifts. It chills the air around itself, turning the battlefield into a slower, harsher place.
Abilities: Thick Fat / Refrigerate
Hidden Ability: Snow Cloak
Base EXP Yield: 60
Habitat/Encounter: snow drifts | Snow (Land) @ Victory Road | 10% | Lv 10–14
Evolution: —
Stats: —
Level-Up Moves: —

________________

#076 — Mycelurk
Type: Grass / Poison
Pokedex Entry: It is commonly found around rot beds. It draws strength from living terrain and grows more dangerous the longer a fight lasts.
Abilities: Sap Sipper / Liquid Ooze
Hidden Ability: Overgrow
Base EXP Yield: 140
Habitat/Encounter: rot beds | Land @ Whisperwoods | 6% | Lv 20–26
Evolution: —
Stats: —
Level-Up Moves: —

________________

#077 — Sporegnash [ADDED]
Type: Grass / Poison
Pokedex Entry: It is commonly found around infected thickets. It draws strength from living terrain and grows more dangerous the longer a fight lasts.
Abilities: Grassy Surge / Poison Point
Hidden Ability: Chlorophyll
Base EXP Yield: 225
Habitat/Encounter: infected thickets | Land @ Route 7 | 1% | Lv 26–34
Evolution: —
Stats: —
Level-Up Moves: —

________________

#078 — Glintoad [ADDED]
Type: Water / Fairy
Pokedex Entry: It is commonly found around sea shallows. It glides through water with effortless control, striking when currents favor it.
Abilities: Torrent / Pixilate
Hidden Ability: Swift Swim
Base EXP Yield: 60
Habitat/Encounter: sea shallows | Surf @ Azure Sea | 4% | Lv 18–24
Evolution: —
Stats: —
Level-Up Moves: —

________________

#079 — Murkrow (Thalorian Form)
Type: Poison / Dark
Pokedex Entry: It is commonly found around dock shadows. It relies on gradual debilitation, forcing opponents into unfavorable trades.
Abilities: Poison Touch / Prankster
Hidden Ability: Stench
Base EXP Yield: 151
Habitat/Encounter: dock shadows | Land (Night) @ Pillage Post | 6% | Lv 18–24
Evolution: —
Stats: —
Level-Up Moves: —

________________

#080 — Honchkrow (Thalorian Form)
Type: Poison / Dark
Pokedex Entry: It is commonly found around old eaves. It relies on gradual debilitation, forcing opponents into unfavorable trades.
Abilities: Corrosion / Moxie
Hidden Ability: Merciless
Base EXP Yield: 243
Habitat/Encounter: old eaves | Land (Night) @ Whisperwoods | 2% | Lv 34–42
Evolution: —
Stats: —
Level-Up Moves: —

________________

#081 — Puffsage [ADDED]
Type: Grass / Psychic
Pokedex Entry: It is commonly found around roadside grass. It draws strength from living terrain and grows more dangerous the longer a fight lasts.
Abilities: Effect Spore / Psychic Surge
Hidden Ability: Grassy Surge
Base EXP Yield: 60
Habitat/Encounter: roadside grass | Land @ Pophyr Grove | 18% | Lv 10–14
Evolution: —
Stats: —
Level-Up Moves: —

________________

#082 — Dreamdill [ADDED]
Type: Grass / Psychic
Pokedex Entry: It is commonly found around damp thickets. It draws strength from living terrain and grows more dangerous the longer a fight lasts.
Abilities: Sap Sipper / Prankster
Hidden Ability: Overgrow
Base EXP Yield: 140
Habitat/Encounter: damp thickets | Land @ Swoven Swamp | 4% | Lv 24–30
Evolution: —
Stats: —
Level-Up Moves: —

________________

#083 — Sageveil [ADDED]
Type: Grass / Psychic
Pokedex Entry: It is commonly found around forest paths. It draws strength from living terrain and grows more dangerous the longer a fight lasts.
Abilities: Grassy Surge / Synchronize
Hidden Ability: Chlorophyll
Base EXP Yield: 225
Habitat/Encounter: forest paths | Land @ Route 7 | 1% | Lv 45–55
Evolution: —
Stats: —
Level-Up Moves: —

________________

#084 — Raggle [ADDED]
Type: Normal / Bug
Pokedex Entry: It is commonly found around fields. It survives by versatility, learning whatever tools a situation demands.
Abilities: Run Away / Shield Dust
Hidden Ability: Adaptability
Base EXP Yield: 60
Habitat/Encounter: fields | Land @ Route 2 | 10% | Lv 6–10
Evolution: —
Stats: —
Level-Up Moves: —

________________

#085 — Stitchurn [ADDED]
Type: Bug / Ghost
Pokedex Entry: It is commonly found around ruin vaults. It overwhelms foes with persistent pressure and clever trapping tactics.
Abilities: Shield Dust / Levitate
Hidden Ability: Tinted Lens
Base EXP Yield: 140
Habitat/Encounter: ruin vaults | Land (Night) @ Whisperwoods | 3% | Lv 18–24
Evolution: —
Stats: —
Level-Up Moves: —

________________

#086 — Seamreap [ADDED]
Type: Bug / Ghost
Pokedex Entry: It is commonly found around underbrush. It overwhelms foes with persistent pressure and clever trapping tactics.
Abilities: Compound Eyes / Pressure
Hidden Ability: Adaptability
Base EXP Yield: 225
Habitat/Encounter: underbrush | Cave/Ruins @ Castle Celeste | 1% | Lv 34–42
Evolution: —
Stats: —
Level-Up Moves: —

________________

#087 — Puddlepup [ADDED]
Type: Water / Ground
Pokedex Entry: It is commonly found around coastal shallows. It glides through water with effortless control, striking when currents favor it.
Abilities: Rain Dish / Sand Force
Hidden Ability: Damp
Base EXP Yield: 65
Habitat/Encounter: coastal shallows | Surf @ Riverbend Crossing | 10% | Lv 6–10
Evolution: —
Stats: —
Level-Up Moves: —

________________

#088 — Mudmutt [ADDED]
Type: Water / Ground
Pokedex Entry: It is commonly found around deep basins. It glides through water with effortless control, striking when currents favor it.
Abilities: Hydration / Anger Point
Hidden Ability: Torrent
Base EXP Yield: 185
Habitat/Encounter: deep basins | Surf @ Azure Sea | 3% | Lv 26–34
Evolution: —
Stats: —
Level-Up Moves: —

________________

#089 — Cavernip [ADDED]
Type: Rock / Ground
Pokedex Entry: It is commonly found around gravel cuts. It hardens its body like stone and punishes careless contact.
Abilities: Sand Force / Sand Veil
Hidden Ability: Rock Head
Base EXP Yield: 60
Habitat/Encounter: gravel cuts | Land @ Route 5 | 20% | Lv 6–10
Evolution: —
Stats: —
Level-Up Moves: —

________________

#090 — Drillersk [ADDED]
Type: Rock / Ground
Pokedex Entry: It is commonly found around cliff ruins. It hardens its body like stone and punishes careless contact.
Abilities: Sturdy / Arena Trap
Hidden Ability: Sand Stream
Base EXP Yield: 140
Habitat/Encounter: cliff ruins | Land @ Route 4 | 8% | Lv 18–24
Evolution: —
Stats: —
Level-Up Moves: —

________________

#091 — Quakemaw [ADDED]
Type: Rock / Ground
Pokedex Entry: It is commonly found around old castles. It hardens its body like stone and punishes careless contact.
Abilities: Rock Head / Water Absorb
Hidden Ability: Solid Rock
Base EXP Yield: 225
Habitat/Encounter: old castles | Cave/Ruins @ Gabite Cavern | 2% | Lv 34–42
Evolution: —
Stats: —
Level-Up Moves: —

________________

#092 — Flickerfae [ADDED]
Type: Fairy
Pokedex Entry: It is commonly found around flower verge. It manipulates emotion and momentum, turning small advantages into inevitability.
Abilities: Misty Surge / Magic Bounce
Hidden Ability: Dazzling
Base EXP Yield: 60
Habitat/Encounter: flower verge | Land @ Whisperwoods | 18% | Lv 6–10
Evolution: —
Stats: —
Level-Up Moves: —

________________

#093 — Lanternymph [ADDED]
Type: Fairy / Psychic
Pokedex Entry: It is commonly found around flower verge. It manipulates emotion and momentum, turning small advantages into inevitability.
Abilities: Magic Bounce / Psychic Surge
Hidden Ability: Dazzling
Base EXP Yield: 140
Habitat/Encounter: flower verge | Land @ Swoven Swamp | 5% | Lv 18–24
Evolution: —
Stats: —
Level-Up Moves: —

________________

#094 — Illumoria [ADDED]
Type: Fairy / Psychic
Pokedex Entry: It is commonly found around coral glow. It manipulates emotion and momentum, turning small advantages into inevitability.
Abilities: Healer / Prankster
Hidden Ability: Cute Charm
Base EXP Yield: 225
Habitat/Encounter: coral glow | Land @ Route 7 | 3% | Lv 34–42
Evolution: —
Stats: —
Level-Up Moves: —

________________

#095 — Miremite [ADDED]
Type: Bug / Grass
Pokedex Entry: It is commonly found around roadside grass. It overwhelms foes with persistent pressure and clever trapping tactics.
Abilities: Honey Gather / Overgrow
Hidden Ability: Shield Dust
Base EXP Yield: 65
Habitat/Encounter: roadside grass | Land @ Route 3 | 12% | Lv 6–10
Evolution: —
Stats: —
Level-Up Moves: —

________________

#096 — Fenweevil [ADDED]
Type: Bug / Grass
Pokedex Entry: It is commonly found around roadside grass. It overwhelms foes with persistent pressure and clever trapping tactics.
Abilities: Swarm / Chlorophyll
Hidden Ability: Compound Eyes
Base EXP Yield: 185
Habitat/Encounter: roadside grass | Land @ Route 2 | 3% | Lv 26–34
Evolution: —
Stats: —
Level-Up Moves: —

________________

#097 — Pondrake [ADDED]
Type: Water / Dragon
Pokedex Entry: It is commonly found around coastal shallows. It glides through water with effortless control, striking when currents favor it.
Abilities: Water Absorb / Rivalry
Hidden Ability: Rain Dish
Base EXP Yield: 140
Habitat/Encounter: coastal shallows | Surf @ Azure Sea | 6% | Lv 18–24
Evolution: —
Stats: —
Level-Up Moves: —

________________

#098 — Bloomfin [ADDED]
Type: Water / Fairy
Pokedex Entry: It is commonly found around coral glow. It glides through water with effortless control, striking when currents favor it.
Abilities: Swift Swim / Magic Bounce
Hidden Ability: Hydration
Base EXP Yield: 65
Habitat/Encounter: coral glow | Surf @ Lakespire Town (Lake) | 12% | Lv 10–14
Evolution: —
Stats: —
Level-Up Moves: —

________________

#099 — Floramere
Type: Water / Fairy
Pokedex Entry: It is commonly found around flower plateaus. It glides through water with effortless control, striking when currents favor it.
Abilities: Rain Dish / Healer
Hidden Ability: Damp
Base EXP Yield: 185
Habitat/Encounter: flower plateaus | Land @ Route 7 | 4% | Lv 26–34
Evolution: —
Stats: —
Level-Up Moves: —

________________

#100 — Tidemurk
Type: Water / Dark
Pokedex Entry: It is commonly found around murky shallows. It glides through water with effortless control, striking when currents favor it.
Abilities: Hydration / Pressure
Hidden Ability: Torrent
Base EXP Yield: 140
Habitat/Encounter: murky shallows | Fishing @ Riverbend Crossing | 10% | Lv 14–18
Evolution: —
Stats: —
Level-Up Moves: —

________________

#101 — Brineshade
Type: Water / Ghost
Pokedex Entry: It is commonly found around fog waters. It glides through water with effortless control, striking when currents favor it.
Abilities: Damp / Cursed Body
Hidden Ability: Water Absorb
Base EXP Yield: 140
Habitat/Encounter: fog waters | Surf @ Azure Sea | 3% | Lv 28–34
Evolution: —
Stats: —
Level-Up Moves: —

________________

#102 — Nectip [ADDED]
Type: Bug / Fairy
Pokedex Entry: It is commonly found around roadside grass. It overwhelms foes with persistent pressure and clever trapping tactics.
Abilities: Swarm / Pixilate
Hidden Ability: Compound Eyes
Base EXP Yield: 65
Habitat/Encounter: roadside grass | Land @ Route 3 | 18% | Lv 6–10
Evolution: —
Stats: —
Level-Up Moves: —

________________

#103 — Nectarune [ADDED]
Type: Bug / Fairy
Pokedex Entry: It is commonly found around roadside grass. It overwhelms foes with persistent pressure and clever trapping tactics.
Abilities: Shield Dust / Misty Surge
Hidden Ability: Tinted Lens
Base EXP Yield: 185
Habitat/Encounter: roadside grass | Land @ Tidepath Road | 1% | Lv 26–34
Evolution: —
Stats: —
Level-Up Moves: —

________________

#104 — Reeflet [ADDED]
Type: Water / Rock
Pokedex Entry: It is commonly found around coastal shallows. It glides through water with effortless control, striking when currents favor it.
Abilities: Swift Swim / Solid Rock
Hidden Ability: Hydration
Base EXP Yield: 65
Habitat/Encounter: coastal shallows | Surf @ Tidepath Road | 12% | Lv 10–14
Evolution: —
Stats: —
Level-Up Moves: —

________________

#105 — Coralmason [ADDED]
Type: Water / Rock
Pokedex Entry: It is commonly found around lake edge. It glides through water with effortless control, striking when currents favor it.
Abilities: Reef Covenant / Rain Dish
Hidden Ability: Damp
Base EXP Yield: 185
Habitat/Encounter: lake edge | Surf @ Azure Sea | 3% | Lv 26–34
Evolution: —
Stats: —
Level-Up Moves: —

________________

#106 — Knuckit [ADDED]
Type: Fighting
Pokedex Entry: It is commonly found around training trail. It trains relentlessly and breaks defenses with practiced technique.
Abilities: Defiant / Mold Breaker
Hidden Ability: Iron Fist
Base EXP Yield: 65
Habitat/Encounter: training trail | Land @ Route 3 | 10% | Lv 10–14
Evolution: —
Stats: —
Level-Up Moves: —

________________

#107 — Brawlisk [ADDED]
Type: Fighting / Dark
Pokedex Entry: It is commonly found around sparring trail. It trains relentlessly and breaks defenses with practiced technique.
Abilities: Mold Breaker / Intimidate
Hidden Ability: Iron Fist
Base EXP Yield: 185
Habitat/Encounter: sparring trail | Land @ Route 8 | 3% | Lv 34–42
Evolution: —
Stats: —
Level-Up Moves: —

________________

#108 — Pebbleaf [ADDED]
Type: Rock / Grass
Pokedex Entry: It is commonly found around gravel cuts. It hardens its body like stone and punishes careless contact.
Abilities: Sturdy / Chlorophyll
Hidden Ability: Sand Stream
Base EXP Yield: 65
Habitat/Encounter: gravel cuts | Land @ Route 4 | 18% | Lv 6–10
Evolution: —
Stats: —
Level-Up Moves: —

________________

#109 — Boulderbloom [ADDED]
Type: Rock / Grass
Pokedex Entry: It is commonly found around rubble. It hardens its body like stone and punishes careless contact.
Abilities: Rock Head / Leaf Guard
Hidden Ability: Solid Rock
Base EXP Yield: 185
Habitat/Encounter: rubble | Cave/Ruins @ Victory Road | 1% | Lv 26–34
Evolution: —
Stats: —
Level-Up Moves: —

________________

#110 — Tidekit [ADDED]
Type: Water
Pokedex Entry: It is commonly found around coastal shallows. It glides through water with effortless control, striking when currents favor it.
Abilities: Swift Swim / Rain Dish
Hidden Ability: Damp
Base EXP Yield: 140
Habitat/Encounter: coastal shallows | Surf @ Riverbend Crossing | 20% | Lv 6–10
Evolution: —
Stats: —
Level-Up Moves: —

________________

#111 — Siltseal [ADDED]
Type: Water / Ground
Pokedex Entry: It is commonly found around river runs. It glides through water with effortless control, striking when currents favor it.
Abilities: Rain Dish / Sand Force
Hidden Ability: Damp
Base EXP Yield: 140
Habitat/Encounter: river runs | Surf @ Lakespire Town (Lake) | 4% | Lv 18–24
Evolution: —
Stats: —
Level-Up Moves: —

________________

#112 — Deltaquag [ADDED]
Type: Water / Ground
Pokedex Entry: It is commonly found around reef breaks. It glides through water with effortless control, striking when currents favor it.
Abilities: Delta Silt / Hydration
Hidden Ability: Torrent
Base EXP Yield: 140
Habitat/Encounter: reef breaks | Surf @ Lakespire Town (Lake) | 4% | Lv 18–24
Evolution: —
Stats: —
Level-Up Moves: —

________________

#113 — Marshquake [ADDED]
Type: Water / Ground
Pokedex Entry: It is commonly found around deep basins. It glides through water with effortless control, striking when currents favor it.
Abilities: Delta Silt / Damp
Hidden Ability: Water Absorb
Base EXP Yield: 140
Habitat/Encounter: deep basins | Surf @ Azure Sea | 1% | Lv 34–42
Evolution: —
Stats: —
Level-Up Moves: —

________________

#114 — Emberling [ADDED]
Type: Fire
Pokedex Entry: It is commonly found around warm trails. It generates intense heat and uses it to pressure opponents into mistakes.
Abilities: Blaze / Flash Fire
Hidden Ability: Drought
Base EXP Yield: 60
Habitat/Encounter: warm trails | Land @ Route 5 | 20% | Lv 6–10
Evolution: —
Stats: —
Level-Up Moves: —

________________

#115 — Ashhorn [ADDED]
Type: Fire / Steel
Pokedex Entry: It is commonly found around ash banks. It generates intense heat and uses it to pressure opponents into mistakes.
Abilities: Flash Fire / Heatproof
Hidden Ability: Drought
Base EXP Yield: 140
Habitat/Encounter: ash banks | Land @ Route 5 | 3% | Lv 18–24
Evolution: —
Stats: —
Level-Up Moves: —

________________

#116 — Cauterforge [ADDED]
Type: Fire / Steel
Pokedex Entry: It is commonly found around warm trails. It generates intense heat and uses it to pressure opponents into mistakes.
Abilities: Forgebrand / Flame Body
Hidden Ability: Competitive
Base EXP Yield: 225
Habitat/Encounter: warm trails | Land @ Forlort Keep (Volcano Slopes) | 3% | Lv 34–42
Evolution: —
Stats: —
Level-Up Moves: —

________________

#117 — Pipsqueak [ADDED]
Type: Normal
Pokedex Entry: It is commonly found around fields. It survives by versatility, learning whatever tools a situation demands.
Abilities: Scrappy / Pickup
Hidden Ability: Run Away
Base EXP Yield: 60
Habitat/Encounter: fields | Land @ Route 3 | 14% | Lv 6–10
Evolution: —
Stats: —
Level-Up Moves: —

________________

#118 — Squealot [ADDED]
Type: Normal
Pokedex Entry: It is commonly found around travel roads. It survives by versatility, learning whatever tools a situation demands.
Abilities: Pickup / Serene Grace
Hidden Ability: Keen Eye
Base EXP Yield: 140
Habitat/Encounter: travel roads | Land @ Route 6 | 3% | Lv 18–24
Evolution: —
Stats: —
Level-Up Moves: —

________________

#119 — Boarrier [ADDED]
Type: Normal / Fighting
Pokedex Entry: It is commonly found around fields. It survives by versatility, learning whatever tools a situation demands.
Abilities: Serene Grace / Guts
Hidden Ability: Keen Eye
Base EXP Yield: 225
Habitat/Encounter: fields | Land @ Route 8 | 3% | Lv 34–42
Evolution: —
Stats: —
Level-Up Moves: —

________________

#120 — Glimmergnat
Type: Bug / Electric
Pokedex Entry: It is commonly found around spark reeds. It overwhelms foes with persistent pressure and clever trapping tactics.
Abilities: Swarm / Volt Absorb
Hidden Ability: Compound Eyes
Base EXP Yield: 65
Habitat/Encounter: spark reeds | Land @ Swoven Swamp | 10% | Lv 10–14
Evolution: —
Stats: —
Level-Up Moves: —

________________

#121 — Neonidge [ADDED]
Type: Bug / Electric
Pokedex Entry: It is commonly found around wildflowers. It overwhelms foes with persistent pressure and clever trapping tactics.
Abilities: Shield Dust / Motor Drive
Hidden Ability: Tinted Lens
Base EXP Yield: 185
Habitat/Encounter: wildflowers | Land @ Tidepath Road | 1% | Lv 26–34
Evolution: —
Stats: —
Level-Up Moves: —

________________

#122 — Cindertip [ADDED]
Type: Fire / Fairy
Pokedex Entry: It is commonly found around ash banks. It generates intense heat and uses it to pressure opponents into mistakes.
Abilities: Flame Body / Magic Bounce
Hidden Ability: Competitive
Base EXP Yield: 140
Habitat/Encounter: ash banks | Land @ Victory Road | 10% | Lv 24–30
Evolution: —
Stats: —
Level-Up Moves: —

________________

#123 — Hatchling [ADDED]
Type: Dragon
Pokedex Entry: It is commonly found around high thermals. Its power intensifies as it battles, building toward a decisive finishing blow.
Abilities: Drakeshard Aegis / Sheer Force
Hidden Ability: Pressure
Base EXP Yield: 60
Habitat/Encounter: high thermals | Cave/Ruins @ Castle Celeste | 12% | Lv 10–14
Evolution: —
Stats: —
Level-Up Moves: —

________________

#124 — Wyrmkin [ADDED]
Type: Dragon
Pokedex Entry: It is commonly found around high thermals. Its power intensifies as it battles, building toward a decisive finishing blow.
Abilities: Drakeshard Aegis / Mold Breaker
Hidden Ability: Multiscale
Base EXP Yield: 140
Habitat/Encounter: high thermals | Land @ Route 8 | 4% | Lv 24–30
Evolution: —
Stats: —
Level-Up Moves: —

________________

#125 — Drakeshard [ADDED]
Type: Dragon / Rock
Pokedex Entry: It is commonly found around apex passes. Its power intensifies as it battles, building toward a decisive finishing blow.
Abilities: Drakeshard Aegis / Tough Claws
Hidden Ability: Multiscale
Base EXP Yield: 225
Habitat/Encounter: apex passes | Land @ Route 8 | 3% | Lv 45–55
Evolution: —
Stats: —
Level-Up Moves: —

________________

#126 — Skulkid [ADDED]
Type: Dark
Pokedex Entry: It is commonly found around dock shadows. It fights with ruthless instincts and exploits openings without hesitation.
Abilities: Nightfeed / Intimidate
Hidden Ability: Moxie
Base EXP Yield: 60
Habitat/Encounter: dock shadows | Land (Night) @ Whisperwoods | 10% | Lv 6–10
Evolution: —
Stats: —
Level-Up Moves: —

________________

#127 — Nightgraze [ADDED]
Type: Dark / Grass
Pokedex Entry: It is commonly found around night lanes. It fights with ruthless instincts and exploits openings without hesitation.
Abilities: Nightfeed / Infiltrator
Hidden Ability: Moxie
Base EXP Yield: 140
Habitat/Encounter: night lanes | Land (Night) @ Whisperwoods | 3% | Lv 18–24
Evolution: —
Stats: —
Level-Up Moves: —

________________

#128 — Dreadbramble [ADDED]
Type: Dark / Grass
Pokedex Entry: It is commonly found around raid paths. It fights with ruthless instincts and exploits openings without hesitation.
Abilities: Nightfeed / Prankster
Hidden Ability: Pickpocket
Base EXP Yield: 225
Habitat/Encounter: raid paths | Land (Night) @ Victory Road | 3% | Lv 34–42
Evolution: —
Stats: —
Level-Up Moves: —

________________

#129 — Caveling [ADDED]
Type: Rock
Pokedex Entry: It is commonly found around gravel cuts. It hardens its body like stone and punishes careless contact.
Abilities: Solid Rock / Weak Armor
Hidden Ability: Sturdy
Base EXP Yield: 60
Habitat/Encounter: gravel cuts | Land @ Route 5 | 14% | Lv 6–10
Evolution: —
Stats: —
Level-Up Moves: —

________________

#130 — Stoneling [ADDED]
Type: Rock / Steel
Pokedex Entry: It is commonly found around rubble. It hardens its body like stone and punishes careless contact.
Abilities: Weak Armor / Mirror Armor
Hidden Ability: Sturdy
Base EXP Yield: 140
Habitat/Encounter: rubble | Land @ Route 5 | 4% | Lv 18–24
Evolution: —
Stats: —
Level-Up Moves: —

________________

#131 — Bastionite [ADDED]
Type: Rock / Steel
Pokedex Entry: It is commonly found around gravel cuts. It hardens its body like stone and punishes careless contact.
Abilities: Sand Force / Clear Body
Hidden Ability: Rock Head
Base EXP Yield: 225
Habitat/Encounter: gravel cuts | Land @ Whitehorn Mountains | 2% | Lv 34–42
Evolution: —
Stats: —
Level-Up Moves: —

________________

#132 — Pyrestoat [ADDED]
Type: Fire / Ground
Pokedex Entry: It is commonly found around warm trails. It generates intense heat and uses it to pressure opponents into mistakes.
Abilities: Blaze / Arena Trap
Hidden Ability: Flame Body
Base EXP Yield: 60
Habitat/Encounter: warm trails | Land @ Route 5 | 14% | Lv 6–10
Evolution: —
Stats: —
Level-Up Moves: —

________________

#133 — Cinderdune [ADDED]
Type: Fire / Ground
Pokedex Entry: It is commonly found around scorched routes. It generates intense heat and uses it to pressure opponents into mistakes.
Abilities: Flash Fire / Water Absorb
Hidden Ability: Drought
Base EXP Yield: 140
Habitat/Encounter: scorched routes | Land @ Route 5 | 5% | Lv 18–24
Evolution: —
Stats: —
Level-Up Moves: —

________________

#134 — Duneinferno [ADDED]
Type: Fire / Ground
Pokedex Entry: It is commonly found around ember soil. It generates intense heat and uses it to pressure opponents into mistakes.
Abilities: Flame Body / Poison Heal
Hidden Ability: Competitive
Base EXP Yield: 225
Habitat/Encounter: ember soil | Land @ Forlort Keep (Volcano Slopes) | 2% | Lv 34–42
Evolution: —
Stats: —
Level-Up Moves: —

________________

#135 — Ferrowisp [ADDED]
Type: Steel / Ghost
Pokedex Entry: It is commonly found around ruin vaults. Its body is reinforced like metal, shrugging off impacts that would drop other Pokémon.
Abilities: Spectral Rivet / Light Metal
Hidden Ability: Mirror Armor
Base EXP Yield: 60
Habitat/Encounter: ruin vaults | Land (Night) @ Whisperwoods | 20% | Lv 6–10
Evolution: —
Stats: —
Level-Up Moves: —

________________

#136 — Anvilspecter [ADDED]
Type: Steel / Ghost
Pokedex Entry: It is commonly found around deep works. Its body is reinforced like metal, shrugging off impacts that would drop other Pokémon.
Abilities: Spectral Rivet / Heavy Metal
Hidden Ability: Clear Body
Base EXP Yield: 140
Habitat/Encounter: deep works | Land (Night) @ Whisperwoods | 8% | Lv 18–24
Evolution: —
Stats: —
Level-Up Moves: —

________________

#137 — Forgehaunt [ADDED]
Type: Steel / Ghost
Pokedex Entry: It is commonly found around deep works. Its body is reinforced like metal, shrugging off impacts that would drop other Pokémon.
Abilities: Mirror Armor / Cursed Body
Hidden Ability: Sturdy
Base EXP Yield: 225
Habitat/Encounter: deep works | Cave/Ruins @ Castle Celeste | 2% | Lv 34–42
Evolution: —
Stats: —
Level-Up Moves: —

________________

#138 — Clawbun [ADDED]
Type: Normal
Pokedex Entry: It is commonly found around fields. It survives by versatility, learning whatever tools a situation demands.
Abilities: Run Away / Keen Eye
Hidden Ability: Scrappy
Base EXP Yield: 60
Habitat/Encounter: fields | Land @ Route 4 | 10% | Lv 6–10
Evolution: —
Stats: —
Level-Up Moves: —

________________

#139 — Pounchit [ADDED]
Type: Normal / Fighting
Pokedex Entry: It is commonly found around travel roads. It survives by versatility, learning whatever tools a situation demands.
Abilities: Keen Eye / Scrappy
Hidden Ability: Run Away
Base EXP Yield: 140
Habitat/Encounter: travel roads | Land @ Route 4 | 5% | Lv 18–24
Evolution: —
Stats: —
Level-Up Moves: —

________________

#140 — Brawlapin [ADDED]
Type: Fighting
Pokedex Entry: It is commonly found around sparring trail. It trains relentlessly and breaks defenses with practiced technique.
Abilities: Scrappy / Technician
Hidden Ability: Mold Breaker
Base EXP Yield: 225
Habitat/Encounter: sparring trail | Land @ Route 8 | 1% | Lv 34–42
Evolution: —
Stats: —
Level-Up Moves: —

________________

#141 — Glowmoss [ADDED]
Type: Grass / Fairy
Pokedex Entry: It is commonly found around hedgerows. It draws strength from living terrain and grows more dangerous the longer a fight lasts.
Abilities: Effect Spore / Healer
Hidden Ability: Grassy Surge
Base EXP Yield: 140
Habitat/Encounter: hedgerows | Land @ Route 7 | 10% | Lv 28–34
Evolution: —
Stats: —
Level-Up Moves: —

________________

#142 — Mistraven [ADDED]
Type: Flying / Dark
Pokedex Entry: It is commonly found around windy overlooks. It uses wind and elevation to control spacing and tempo.
Abilities: Aerilate / Pressure
Hidden Ability: Keen Eye
Base EXP Yield: 65
Habitat/Encounter: windy overlooks | Land @ Route 3 | 18% | Lv 10–14
Evolution: —
Stats: —
Level-Up Moves: —

________________

#143 — Stormcorv [ADDED]
Type: Flying / Dark
Pokedex Entry: It is commonly found around windy overlooks. It uses wind and elevation to control spacing and tempo.
Abilities: Wind Rider / Intimidate
Hidden Ability: Gale Wings
Base EXP Yield: 185
Habitat/Encounter: windy overlooks | Land @ Route 7 | 1% | Lv 34–42
Evolution: —
Stats: —
Level-Up Moves: —

________________

#144 — Flintusk [ADDED]
Type: Rock
Pokedex Entry: It is commonly found around gravel cuts. It hardens its body like stone and punishes careless contact.
Abilities: Sturdy / Rock Head
Hidden Ability: Solid Rock
Base EXP Yield: 140
Habitat/Encounter: gravel cuts | Cave/Ruins @ Gabite Cavern | 8% | Lv 28–34
Evolution: —
Stats: —
Level-Up Moves: —

________________

#145 — Timino
Type: Normal / Rock
Pokedex Entry: It is commonly found around lonely roads. It survives by versatility, learning whatever tools a situation demands.
Abilities: Keen Eye / Sand Stream
Hidden Ability: Scrappy
Base EXP Yield: 60
Habitat/Encounter: lonely roads | Land @ Route 8 | 2% | Lv 40–55
Evolution: —
Stats: —
Level-Up Moves: —

________________

#146 — Brutusk
Type: Dark / Rock
Pokedex Entry: It is commonly found around raid paths. It fights with ruthless instincts and exploits openings without hesitation.
Abilities: Prankster / Solid Rock
Hidden Ability: Pickpocket
Base EXP Yield: 140
Habitat/Encounter: raid paths | Land (Night) @ Victory Road | 1% | Lv 45–55
Evolution: —
Stats: —
Level-Up Moves: —

________________

#147 — Justyrn
Type: Rock / Steel
Pokedex Entry: It is commonly found around enforcement ruins. It hardens its body like stone and punishes careless contact.
Abilities: Solid Rock / Heavy Metal
Hidden Ability: Sand Force
Base EXP Yield: 225
Habitat/Encounter: enforcement ruins | Cave/Ruins @ Victory Road | 1% | Lv 50–55
Evolution: —
Stats: —
Level-Up Moves: —

________________

#148 — Eevee
Type: Normal
Pokedex Entry: A remarkably adaptable Pokémon that can adjust its body’s traits to match its surroundings. Trainers in Thaloria prize it for its many potential evolutions.
Abilities: Run Away / Adaptability
Hidden Ability: Anticipation
Base EXP Yield: 65
Habitat/Encounter: town outskirts / meadow edges | Gift @ Sproutshore Town (Professor) | — | Lv 10
Evolution: → #149 Vaporeon (Water Stone) / #151 Jolteon (Thunder Stone) / #153 Flareon (Fire Stone) / #155 Espeon (Friendship Day) / #156 Umbreon (Friendship Night) / #157 Leafeon (Leaf Stone) / #158 Glaceon (Ice Stone) / #159 Sylveon (Friendship + Fairy move) / #165 Drakeon (Dragon Stone)
Stats: HP 55 / Atk 55 / Def 50 / SpA 45 / SpD 65 / Spe 55 (BST 325)
Level-Up Moves: Lv 1 Tackle; Lv 1 Tail Whip; Lv 5 Sand Attack; Lv 10 Quick Attack; Lv 15 Baby-Doll Eyes; Lv 20 Bite; Lv 25 Swift; Lv 30 Refresh; Lv 35 Covet; Lv 40 Take Down; Lv 45 Last Resort; Lv 50 Baton Pass

________________

#149 — Vaporeon
Type: Water
Pokedex Entry: It stores clean water in its cells and can dissolve into the surface of lakes to vanish. Its calm presence is said to steady nervous teams.
Abilities: Water Absorb
Hidden Ability: Hydration
Base EXP Yield: 184
Habitat/Encounter: evolution only | Evolve (Water Stone) @ Any | — | —
Evolution: → #150 Mireeon (Lv. 42)
Stats: HP 130 / Atk 65 / Def 60 / SpA 110 / SpD 95 / Spe 65 (BST 525)
Level-Up Moves: Lv 1 Water Gun; Lv 1 Tail Whip; Lv 1 Helping Hand; Lv 5 Sand Attack; Lv 10 Quick Attack; Lv 15 Baby-Doll Eyes; Lv 20 Aurora Beam; Lv 25 Aqua Ring; Lv 30 Muddy Water; Lv 35 Acid Armor; Lv 40 Haze; Lv 45 Hydro Pump; Lv 50 Last Resort

________________

#150 — Mireeon
Type: Water / Ground
Pokedex Entry: It packs wet clay into armor-like plates, turning swamps into its personal stronghold. Each step leaves a heavy, cooling wake.
Abilities: Water Absorb / Storm Drain
Hidden Ability: Sand Force
Base EXP Yield: 240
Habitat/Encounter: evolution only | Evolve (Lv 42) from Vaporeon | — | —
Evolution: —
Stats: HP 140 / Atk 95 / Def 85 / SpA 115 / SpD 95 / Spe 30 (BST 560)
Level-Up Moves: Lv 1 Mud-Slap; Lv 1 Water Gun; Lv 1 Tail Whip; Lv 1 Sand Attack; Lv 10 Quick Attack; Lv 15 Baby-Doll Eyes; Lv 20 Mud Shot; Lv 25 Aqua Ring; Lv 30 Bulldoze; Lv 35 Muddy Water; Lv 40 Earth Power; Lv 45 Recover; Lv 50 Hydro Pump; Lv 55 Earthquake

________________

#151 — Jolteon
Type: Electric
Pokedex Entry: Its fur crackles with stored electricity, releasing sharp jolts when threatened. It sprints as if riding the wind itself.
Abilities: Volt Absorb
Hidden Ability: Quick Feet
Base EXP Yield: 184
Habitat/Encounter: evolution only | Evolve (Thunder Stone) @ Any | — | —
Evolution: → #152 Zephyreon (Lv. 42)
Stats: HP 65 / Atk 65 / Def 60 / SpA 110 / SpD 95 / Spe 130 (BST 525)
Level-Up Moves: Lv 1 Thunder Shock; Lv 1 Tail Whip; Lv 1 Helping Hand; Lv 5 Sand Attack; Lv 10 Quick Attack; Lv 15 Baby-Doll Eyes; Lv 20 Double Kick; Lv 25 Thunder Fang; Lv 30 Agility; Lv 35 Discharge; Lv 40 Thunder Wave; Lv 45 Thunder; Lv 50 Last Resort

________________

#152 — Zephyreon
Type: Electric / Flying
Pokedex Entry: It rides storm fronts and can fire lightning through cutting air currents. When it dives, the sound resembles a thunderclap.
Abilities: Volt Absorb / Motor Drive
Hidden Ability: Lightning Rod
Base EXP Yield: 240
Habitat/Encounter: evolution only | Evolve (Lv 42) from Jolteon | — | —
Evolution: —
Stats: HP 70 / Atk 80 / Def 75 / SpA 125 / SpD 90 / Spe 120 (BST 560)
Level-Up Moves: Lv 1 Gust; Lv 1 Thunder Shock; Lv 1 Tail Whip; Lv 1 Sand Attack; Lv 10 Quick Attack; Lv 15 Baby-Doll Eyes; Lv 20 Aerial Ace; Lv 25 Double Kick; Lv 30 Agility; Lv 35 Discharge; Lv 40 Air Slash; Lv 45 Thunder Wave; Lv 50 Hurricane; Lv 55 Thunder

________________

#153 — Flareon
Type: Fire
Pokedex Entry: It concentrates heat in its throat sac, then vents it in bursts that scorch the air. Its scent lingers like warm ash.
Abilities: Flash Fire
Hidden Ability: Guts
Base EXP Yield: 184
Habitat/Encounter: evolution only | Evolve (Fire Stone) @ Any | — | —
Evolution: → #154 Forgeon (Lv. 42)
Stats: HP 65 / Atk 130 / Def 60 / SpA 95 / SpD 110 / Spe 65 (BST 525)
Level-Up Moves: Lv 1 Ember; Lv 1 Tail Whip; Lv 1 Helping Hand; Lv 5 Sand Attack; Lv 10 Quick Attack; Lv 15 Baby-Doll Eyes; Lv 20 Fire Fang; Lv 25 Bite; Lv 30 Will-O-Wisp; Lv 35 Lava Plume; Lv 40 Smog; Lv 45 Flamethrower; Lv 50 Last Resort

________________

#154 — Forgeon
Type: Fire / Steel
Pokedex Entry: Its internal furnace tempers steel-like plates along its limbs. Sparks scatter when it moves, as if a forge is walking.
Abilities: Flash Fire / Heatproof
Hidden Ability: Flame Body
Base EXP Yield: 240
Habitat/Encounter: evolution only | Evolve (Lv 42) from Flareon | — | —
Evolution: —
Stats: HP 70 / Atk 135 / Def 90 / SpA 95 / SpD 110 / Spe 60 (BST 560)
Level-Up Moves: Lv 1 Ember; Lv 1 Metal Claw; Lv 1 Tail Whip; Lv 1 Sand Attack; Lv 10 Quick Attack; Lv 15 Baby-Doll Eyes; Lv 20 Fire Fang; Lv 25 Iron Head; Lv 30 Will-O-Wisp; Lv 35 Lava Plume; Lv 40 Flame Charge; Lv 45 Flamethrower; Lv 50 Flash Cannon; Lv 55 Overheat

________________

#155 — Espeon
Type: Psychic
Pokedex Entry: Its psychic senses read tiny shifts in posture and breath to predict attacks. It becomes strongest when it trusts its Trainer.
Abilities: Synchronize
Hidden Ability: Magic Bounce
Base EXP Yield: 184
Habitat/Encounter: evolution only | Evolve (Friendship, Day) from Eevee | — | —
Evolution: → #160 Oraculon (Lv. 44)
Stats: HP 65 / Atk 65 / Def 60 / SpA 130 / SpD 95 / Spe 110 (BST 525)
Level-Up Moves: Lv 1 Confusion; Lv 1 Tail Whip; Lv 1 Helping Hand; Lv 5 Sand Attack; Lv 10 Quick Attack; Lv 15 Baby-Doll Eyes; Lv 20 Psybeam; Lv 25 Morning Sun; Lv 30 Swift; Lv 35 Psychic; Lv 40 Future Sight; Lv 45 Calm Mind; Lv 50 Last Resort

________________

#156 — Oraculon
Type: Normal / Psychic
Pokedex Entry: It endures by staying perfectly still, letting threats tire themselves out. Under moonlight, its rings glow like watchful eyes.
Abilities: Synchronize
Hidden Ability: Inner Focus
Base EXP Yield: 184
Habitat/Encounter: evolution only | Evolve (Lv 44) from Espeon | — | —
Evolution: → #161 Obsideon (Lv. 44)
Stats: HP 95 / Atk 65 / Def 110 / SpA 60 / SpD 130 / Spe 65 (BST 525)
Level-Up Moves: Lv 1 Pursuit; Lv 1 Tail Whip; Lv 1 Helping Hand; Lv 5 Sand Attack; Lv 10 Quick Attack; Lv 15 Baby-Doll Eyes; Lv 20 Confuse Ray; Lv 25 Assurance; Lv 30 Moonlight; Lv 35 Dark Pulse; Lv 40 Screech; Lv 45 Mean Look; Lv 50 Last Resort

________________

#157 — Umbreon
Type: Dark
Pokedex Entry: It sharpens leaf-like blades with precise motions, cutting without wasting energy. It prefers clean, sunlit paths.
Abilities: Leaf Guard
Hidden Ability: Chlorophyll
Base EXP Yield: 184
Habitat/Encounter: evolution only | Evolve (Friendship, Night) from Eevee | — | —
Evolution: → #162 Hemleon (Lv. 42)
Stats: HP 65 / Atk 110 / Def 130 / SpA 60 / SpD 65 / Spe 95 (BST 525)
Level-Up Moves: Lv 1 Razor Leaf; Lv 1 Tail Whip; Lv 1 Helping Hand; Lv 5 Sand Attack; Lv 10 Quick Attack; Lv 15 Baby-Doll Eyes; Lv 20 Magical Leaf; Lv 25 Synthesis; Lv 30 Giga Drain; Lv 35 Leaf Blade; Lv 40 Quick Guard; Lv 45 Sunny Day; Lv 50 Last Resort

________________

#158 — Obsideon
Type: Dark / Rock
Pokedex Entry: It lowers the air temperature around itself, forming frost that hardens into protective crystals. It favors quiet, open snowfields.
Abilities: Snow Cloak
Hidden Ability: Ice Body
Base EXP Yield: 184
Habitat/Encounter: evolution only | Evolve (Lv 44) from Umbreon | — | —
Evolution: → #163 Cryspindle (Lv. 42)
Stats: HP 65 / Atk 60 / Def 110 / SpA 130 / SpD 95 / Spe 65 (BST 525)
Level-Up Moves: Lv 1 Icy Wind; Lv 1 Tail Whip; Lv 1 Helping Hand; Lv 5 Sand Attack; Lv 10 Quick Attack; Lv 15 Baby-Doll Eyes; Lv 20 Ice Shard; Lv 25 Hail; Lv 30 Freeze-Dry; Lv 35 Ice Beam; Lv 40 Mirror Coat; Lv 45 Blizzard; Lv 50 Last Resort

________________

#159 — Leafeon
Type: Grass
Pokedex Entry: It calms conflict with a gentle aura that softens hostile intent. In battle, that same aura can become overwhelming force.
Abilities: Cute Charm
Hidden Ability: Pixilate
Base EXP Yield: 184
Habitat/Encounter: evolution only | Evolve (Leaf Stone) @ Any | — | —
Evolution: → #164 Wraitheon (Lv. 44)
Stats: HP 95 / Atk 65 / Def 65 / SpA 110 / SpD 130 / Spe 60 (BST 525)
Level-Up Moves: Lv 1 Fairy Wind; Lv 1 Tail Whip; Lv 1 Helping Hand; Lv 5 Sand Attack; Lv 10 Quick Attack; Lv 15 Baby-Doll Eyes; Lv 20 Draining Kiss; Lv 25 Light Screen; Lv 30 Misty Terrain; Lv 35 Moonblast; Lv 40 Calm Mind; Lv 45 Psychic; Lv 50 Last Resort

________________

#160 — Hemleon
Type: Grass / Poison
Pokedex Entry: It reads probability like a map, choosing the single best moment to strike. Those who face it feel as if fate turned against them.
Abilities: Synchronize / Trace
Hidden Ability: Magic Bounce
Base EXP Yield: 240
Habitat/Encounter: evolution only | Evolve (Lv 42) from Leafeon | — | —
Evolution: —
Stats: HP 70 / Atk 75 / Def 70 / SpA 140 / SpD 105 / Spe 100 (BST 560)
Level-Up Moves: Lv 1 Confusion; Lv 1 Swift; Lv 1 Tail Whip; Lv 1 Sand Attack; Lv 10 Quick Attack; Lv 15 Baby-Doll Eyes; Lv 20 Psybeam; Lv 25 Assist; Lv 30 Psychic; Lv 35 Calm Mind; Lv 40 Hyper Voice; Lv 45 Future Sight; Lv 50 Psychic Terrain; Lv 55 Psyshock

________________

#161 — Glaceon
Type: Ice
Pokedex Entry: Its body is layered with obsidian-like stone that drinks in light. It waits patiently, then collapses a foe’s momentum in one hit.
Abilities: Sand Stream / Inner Focus
Hidden Ability: Solid Rock
Base EXP Yield: 240
Habitat/Encounter: evolution only | Evolve (Ice Stone) @ Any | — | —
Evolution: —
Stats: HP 110 / Atk 95 / Def 140 / SpA 60 / SpD 110 / Spe 45 (BST 560)
Level-Up Moves: Lv 1 Rock Throw; Lv 1 Pursuit; Lv 1 Tail Whip; Lv 1 Sand Attack; Lv 10 Quick Attack; Lv 15 Baby-Doll Eyes; Lv 20 Confuse Ray; Lv 25 Rock Tomb; Lv 30 Dark Pulse; Lv 35 Crunch; Lv 40 Sandstorm; Lv 45 Stone Edge; Lv 50 Mean Look; Lv 55 Foul Play

________________

#162 — Cryspindle
Type: Ice / Bug
Pokedex Entry: It secretes sweet, aromatic toxins that numb the senses rather than burn. The scent clings to foliage for days.
Abilities: Leaf Guard / Poison Point
Hidden Ability: Chlorophyll
Base EXP Yield: 240
Habitat/Encounter: evolution only | Evolve (Lv 42) from Glaceon | — | —
Evolution: —
Stats: HP 80 / Atk 115 / Def 110 / SpA 85 / SpD 90 / Spe 80 (BST 560)
Level-Up Moves: Lv 1 Razor Leaf; Lv 1 Poison Sting; Lv 1 Tail Whip; Lv 1 Sand Attack; Lv 10 Quick Attack; Lv 15 Baby-Doll Eyes; Lv 20 Magical Leaf; Lv 25 Synthesis; Lv 30 Giga Drain; Lv 35 Poison Jab; Lv 40 Leech Seed; Lv 45 Leaf Blade; Lv 50 Sludge Bomb; Lv 55 Aromatherapy

________________

#163 — Sylveon
Type: Fairy
Pokedex Entry: Its silk-like ice strands trap heat and drain it away, freezing targets from the inside out. Swarms gather wherever it nests.
Abilities: Snow Cloak / Swarm
Hidden Ability: Ice Body
Base EXP Yield: 240
Habitat/Encounter: evolution only | Evolve (Friendship + Fairy move) from Eevee | — | —
Evolution: —
Stats: HP 70 / Atk 80 / Def 95 / SpA 140 / SpD 95 / Spe 80 (BST 560)
Level-Up Moves: Lv 1 Powder Snow; Lv 1 Struggle Bug; Lv 1 Tail Whip; Lv 1 Sand Attack; Lv 10 Quick Attack; Lv 15 Baby-Doll Eyes; Lv 20 Bug Bite; Lv 25 Ice Shard; Lv 30 Freeze-Dry; Lv 35 Ice Beam; Lv 40 Quiver Dance; Lv 45 Bug Buzz; Lv 50 Blizzard; Lv 55 Signal Beam

________________

#164 — Wraitheon
Type: Fairy / Ghost
Pokedex Entry: It slips between shadows and moonbeams, haunting battlefields with soft chimes. Those it chooses to protect feel an icy calm.
Abilities: Cursed Body / Cute Charm
Hidden Ability: Infiltrator
Base EXP Yield: 240
Habitat/Encounter: evolution only | Evolve (Lv 44) from Sylveon | — | —
Evolution: —
Stats: HP 95 / Atk 75 / Def 90 / SpA 130 / SpD 120 / Spe 50 (BST 560)
Level-Up Moves: Lv 1 Astonish; Lv 1 Fairy Wind; Lv 1 Tail Whip; Lv 1 Sand Attack; Lv 10 Quick Attack; Lv 15 Baby-Doll Eyes; Lv 20 Draining Kiss; Lv 25 Shadow Sneak; Lv 30 Misty Terrain; Lv 35 Moonblast; Lv 40 Hex; Lv 45 Calm Mind; Lv 50 Shadow Ball; Lv 55 Destiny Bond

________________

#165 — Drakeon
Type: Dragon
Pokedex Entry: Its unstable draconic cells awaken when exposed to rare stones. As it grows, its breath becomes a focused draconic pulse.
Abilities: Inner Focus / Shed Skin
Hidden Ability: Pressure
Base EXP Yield: 184
Habitat/Encounter: evolution only | Evolve (Dragon Stone) @ Any | — | —
Evolution: → #166 Fighterion (Lv. 42)
Stats: HP 70 / Atk 90 / Def 70 / SpA 110 / SpD 85 / Spe 100 (BST 525)
Level-Up Moves: Lv 1 Twister; Lv 1 Tail Whip; Lv 1 Helping Hand; Lv 5 Sand Attack; Lv 10 Quick Attack; Lv 15 Baby-Doll Eyes; Lv 20 Dragon Breath; Lv 25 Dragon Dance; Lv 30 Swift; Lv 35 Dragon Pulse; Lv 40 Agility; Lv 45 Outrage; Lv 50 Last Resort

________________

#166 — Fighterion
Type: Dragon / Fighting
Pokedex Entry: It channels draconic power through disciplined strikes, shattering stone with controlled force. Its roar is said to rattle iron.
Abilities: Guts / Inner Focus
Hidden Ability: Defiant
Base EXP Yield: 240
Habitat/Encounter: evolution only | Evolve (Lv 42) from Drakeon | — | —
Evolution: —
Stats: HP 80 / Atk 130 / Def 90 / SpA 90 / SpD 90 / Spe 80 (BST 560)
Level-Up Moves: Lv 1 Dragon Breath; Lv 1 Rock Smash; Lv 1 Tail Whip; Lv 1 Sand Attack; Lv 10 Quick Attack; Lv 15 Baby-Doll Eyes; Lv 20 Brick Break; Lv 25 Dragon Dance; Lv 30 Dual Chop; Lv 35 Dragon Pulse; Lv 40 Bulk Up; Lv 45 Close Combat; Lv 50 Outrage; Lv 55 Focus Blast

________________

#176 — Gible (Thalorian Form)
Type: Ice / Rock
Pokedex Entry: It is commonly found around snowfields / rocky ledges. It chills the air around itself, turning the battlefield into a slower, harsher place.
Abilities: Frozen Forge / Ice Body
Hidden Ability: Thick Fat
Base EXP Yield: 65
Habitat/Encounter: snowfields / rocky ledges | Snow (Land) @ Whitehorn Mountains | 6% | Lv 28–34
Evolution: —
Stats: —
Level-Up Moves: —

________________

#177 — Gabite (Thalorian Form)
Type: Ice / Rock
Pokedex Entry: It is commonly found around frozen caverns. It chills the air around itself, turning the battlefield into a slower, harsher place.
Abilities: Frozen Forge / Slush Rush
Hidden Ability: Refrigerate
Base EXP Yield: 156
Habitat/Encounter: frozen caverns | Cave/Ruins @ Gabite Cavern | 2% | Lv 34–42
Evolution: —
Stats: —
Level-Up Moves: —

________________

#178 — Garchomp (Thalorian Form)
Type: Ice / Dragon
Pokedex Entry: It is commonly found around apex passes. It chills the air around itself, turning the battlefield into a slower, harsher place.
Abilities: Frozen Forge / Thick Fat
Hidden Ability: Snow Warning
Base EXP Yield: 292
Habitat/Encounter: apex passes | Snow (Land) @ Victory Road | 1% | Lv 45–55
Evolution: —
Stats: —
Level-Up Moves: —

________________

________________

#167 — Pytavor (Legendary) [ADDED]
Type: Grass / Dragon
Pokedex Entry: It is commonly found around hedgerows. It draws strength from living terrain and grows more dangerous the longer a fight lasts.
Abilities: 
Hidden Ability: 
Base EXP Yield: 
Habitat/Encounter: hedgerows | Land @ Route 7 | 10% | Lv 28–34
Evolution: —
Stats: —
Level-Up Moves: —

________________

#168 — Fontessa (Legendary) [ADDED]
Type: Water / Fairy
Pokedex Entry: It is commonly found around coral glow. It glides through water with effortless control, striking when currents favor it.
Abilities: —
Hidden Ability: —
Base EXP Yield: —
Habitat/Encounter: coral glow | Surf @ Azure Sea | 10% | Lv 28–34
Evolution: —
Stats: —
Level-Up Moves: —

________________

#169 — Aged Titan (Apex) [ADDED]
Type: Rock / Electric
Pokedex Entry: It is commonly found around rubble. It hardens its body like stone and punishes careless contact.
Abilities: —
Hidden Ability: —
Base EXP Yield: —
Habitat/Encounter: rubble | Cave/Ruins @ Gabite Cavern | 10% | Lv 28–34
Evolution: —
Stats: —
Level-Up Moves: —

________________

#170 — Moldraith (Legendary; Weed-Fungus Source) [ADDED]
Type: Grass / Poison
Pokedex Entry: It is commonly found around herb marsh. It draws strength from living terrain and grows more dangerous the longer a fight lasts.
Abilities: 
Hidden Ability: 
Base EXP Yield: 
Habitat/Encounter: herb marsh | Land @ Route 7 | 6% | Lv 28–34
Evolution: —
Stats: —
Level-Up Moves: —

________________

#171 — Aged Miregloop (Aged Variant) [ADDED]
Type: Grass / Poison
Pokedex Entry: It is commonly found around bog roots. It draws strength from living terrain and grows more dangerous the longer a fight lasts.
Abilities: —
Hidden Ability: —
Base EXP Yield: —
Habitat/Encounter: bog roots | Land @ Route 7 | 4% | Lv 28–34
Evolution: —
Stats: —
Level-Up Moves: —

________________

#172 — Aged Briarovere (Aged Variant) [ADDED]
Type: Grass / Poison
Pokedex Entry: It is commonly found around herb marsh. It draws strength from living terrain and grows more dangerous the longer a fight lasts.
Abilities: Thornrot Crown / Effect Spore
Hidden Ability: Grassy Surge
Base EXP Yield: 259
Habitat/Encounter: herb marsh | Land @ Route 7 | 8% | Lv 28–34
Evolution: —
Stats: —
Level-Up Moves: —

________________

#173 — Aged Honchkrow (Thalorian) (Aged Variant) [ADDED]
Type: Poison / Flying
Pokedex Entry: It is commonly found around polluted runoff. It relies on gradual debilitation, forcing opponents into unfavorable trades.
Abilities: Carrion Draft / Merciless
Hidden Ability: Poison Point
Base EXP Yield: 301
Habitat/Encounter: polluted runoff | Land @ Swoven Swamp | 4% | Lv 28–34
Evolution: —
Stats: —
Level-Up Moves: —

________________

#174 — Aged Luxray (Aged Variant) [ADDED]
Type: Electric / Fairy
Pokedex Entry: It is commonly found around garden paths. It stores charge in its body and releases it in precise bursts.
Abilities: Gleam Surge / Plus
Hidden Ability: Volt Absorb
Base EXP Yield: 259
Habitat/Encounter: garden paths | Land @ Route 8 | 6% | Lv 28–34
Evolution: —
Stats: —
Level-Up Moves: —

________________

#175 — Aged Gargryph (Aged Variant) [ADDED]
Type: Rock / Ghost
Pokedex Entry: It is commonly found around old castles. It hardens its body like stone and punishes careless contact.
Abilities: Tomb Rampart / Sturdy
Hidden Ability: Sand Stream
Base EXP Yield: 259
Habitat/Encounter: old castles | Cave/Ruins @ Castle Celeste | 6% | Lv 28–34
Evolution: —
Stats: —
Level-Up Moves: —
```

---
# APPENDIX 2 — ENCOUNTERS BY LOCATION (YOUR TABLE)

```text
========================================================================

THALORIA — ENCOUNTERS BY LOCATION (NORMALIZED IF >100%)

Grouped by Method @ Location. Gift/Legendary/Unknown entries excluded.


Cave/Ruins @ Castle Celeste
---------------------------
  2%  #245 Hexscribe  (Psychic / Ghost)  Lv 34–42
  2%  #281 Obeliskar  (Rock / Steel)  Lv 38–46
Total: 4%

Cave/Ruins @ Eternal Myrillfount (Ancient Ruins)
------------------------------------------------
  4%  #049 Augurusk  (Psychic / Rock)  Lv 20–26
  4%  #199 Augurusk  (Psychic / Rock)  Lv 20–26
  3%  #258 Aged Gargryph (Aged Variant)  (Ghost / Rock)  Lv 26–34
Total: 11%

Cave/Ruins @ Gabite Cavern
--------------------------
  3%  #206 Reliclaw  (Rock / Steel)  Lv 24–30
  2%  #299 Cryptusk  (Ground / Ghost)  Lv 38–46
  2%  #149 Gabite (Thalorian Form)  (Ice / Rock)  Lv 34–42
  2%  #305 Gabite (Thalorian Form)  (Ice / Rock)  Lv 34–42
  2%  #269 Titanapace  (Bug / Rock)  Lv 34–42
Total: 11%

Cave/Ruins @ Gabite’s Forge
---------------------------
  2%  #211 Magnetusk  (Steel)  Lv 34–42
Total: 2%

Cave/Ruins @ Victory Road
-------------------------
  2%  #266 Geargoyle  (Steel / Rock)  Lv 38–46
  1%  #303 Crownmaw  (Dragon / Dark)  Lv 45–55
  1%  #147 Justyrn  (Rock / Steel)  Lv 50–55
  1%  #297 Justyrn  (Rock / Steel)  Lv 50–55
Total: 5%

Fishing @ Azure Sea
-------------------
  6%  #291 Razorroe  (Water / Fighting)  Lv 20–26
Total: 6%

Fishing @ Pillage Post
----------------------
  6%  #046 Gutterray  (Water / Poison)  Lv 18–24
  6%  #196 Gutterray  (Water / Poison)  Lv 18–24
Total: 12%

Fishing @ Riverbend Crossing
----------------------------
 10%  #100 Tidemurk  (Water / Dark)  Lv 14–18
 10%  #250 Tidemurk  (Water / Dark)  Lv 14–18
Total: 20%

Land (Night) @ Castle Celeste
-----------------------------
  4%  #228 Rotbloom  (Grass / Ghost)  Lv 24–30
  3%  #244 Sigilisk  (Psychic / Dark)  Lv 28–34
Total: 7%

Land (Night) @ Eternal Myrillfount (Ancient Ruins)
--------------------------------------------------
  8%  #227 Witherlit  (Grass / Ghost)  Lv 16–20
Total: 8%

Land (Night) @ Pillage Post
---------------------------
  8%  #037 Spikimp  (Dark / Electric)  Lv 10–14
  8%  #187 Spikimp  (Dark / Electric)  Lv 10–14
  6%  #079 Murkrow (Thalorian Form)  (Poison / Dark)  Lv 18–24
  6%  #229 Murkrow (Thalorian Form)  (Poison / Dark)  Lv 18–24
Total: 28%

Land (Night) @ Pophyr Grove
---------------------------
  4%  #015 Mothrave  (Bug / Psychic)  Lv 18–24
  4%  #165 Mothrave  (Bug / Psychic)  Lv 18–24
  3%  #257 Dreadawn  (Dark / Fairy)  Lv 28–34
Total: 11%

Land (Night) @ Riverbend Crossing
---------------------------------
  4%  #038 Spiklash  (Dark / Electric)  Lv 18–24
  4%  #188 Spiklash  (Dark / Electric)  Lv 18–24
Total: 8%

Land (Night) @ Route 8
----------------------
  2%  #030 Luxray  (Electric / Dark)  Lv 38–46
  2%  #180 Luxray  (Electric / Dark)  Lv 38–46
  2%  #301 Moonquill  (Psychic / Flying)  Lv 38–46
  1%  #039 Voltigar  (Dark / Electric)  Lv 45–55
  1%  #189 Voltigar  (Dark / Electric)  Lv 45–55
Total: 8%

Land (Night) @ Victory Road
---------------------------
  1%  #146 Brutusk  (Dark / Rock)  Lv 45–55
  1%  #296 Brutusk  (Dark / Rock)  Lv 45–55
Total: 2%

Land (Night) @ Whisperwoods
---------------------------
  8%  #256 Noxling  (Dark)  Lv 16–20
  6%  #128 Dreadbramble  (Dark / Grass)  Lv 16–20
  6%  #057 Driftkit  (Ghost)  Lv 18–24
  6%  #127 Nightgraze  (Dark / Grass)  Lv 16–20
  6%  #058 Shadewick  (Ghost / Fire)  Lv 18–24
  6%  #126 Skulkid  (Dark)  Lv 16–20
  6%  #271 Wispette  (Fairy / Ghost)  Lv 18–24
  2%  #080 Honchkrow (Thalorian Form)  (Poison / Dark)  Lv 34–42
  2%  #230 Honchkrow (Thalorian Form)  (Poison / Dark)  Lv 34–42
Total: 48%

Land @ Castle Celeste
---------------------
  8%  #050 Runeling  (Psychic)  Lv 12–16
  8%  #200 Runeling  (Psychic)  Lv 12–16
Total: 16%

Land @ E Kespire Town (Outskirts)
---------------------------------
  5%  #277 Capacorn  (Electric / Grass)  Lv 22–28
  3%  #210 Polarm  (Steel / Electric)  Lv 26–34
Total: 8%

Land @ Eternal Myrillfount (Ancient Ruins)
------------------------------------------
 10%  #242 Mindlet  (Psychic)  Lv 14–18
 10%  #048 Oracub  (Psychic)  Lv 12–16
 10%  #198 Oracub  (Psychic)  Lv 12–16
Total: 30%

Land @ Forlort Keep (Volcano Slopes)
------------------------------------
 10%  #273 Magmote  (Fire)  Lv 24–30
  6%  #274 Basalisk  (Fire / Rock)  Lv 28–34
  4%  #041 Cindermaw  (Fire / Rock)  Lv 28–34
  4%  #191 Cindermaw  (Fire / Rock)  Lv 28–34
  3%  #247 Pyrecrown  (Fire / Psychic)  Lv 32–40
Total: 27%

Land @ Gabite’s Forge
---------------------
  8%  #209 Ferrbit  (Steel)  Lv 16–22
  6%  #136 Anvilspecter  (Steel / Ghost)  Lv 16–22
  6%  #135 Ferrowisp  (Steel / Ghost)  Lv 16–22
  6%  #137 Forgehaunt  (Steel / Ghost)  Lv 16–22
  4%  #027 Ferrser  (Steel)  Lv 24–30
  4%  #177 Ferrser  (Steel)  Lv 24–30
  3%  #024 Armaroust  (Grass / Steel)  Lv 26–34
  3%  #174 Armaroust  (Grass / Steel)  Lv 26–34
  2%  #294 Ironmantle  (Steel / Fighting)  Lv 34–42
Total: 42%

Land @ Graxen City (Outskirts)
------------------------------
  8%  #026 Meowth (Thalorian Form)  (Steel)  Lv 16–22
  8%  #176 Meowth (Thalorian Form)  (Steel)  Lv 16–22
  4%  #235 Kenscour  (Fighting / Steel)  Lv 28–34
  4%  #265 Metrowl  (Steel / Flying)  Lv 28–34
Total: 24%

Land @ Lakespire Town (Lake)
----------------------------
  6%  #243 Cerebrant  (Psychic)  Lv 20–26
Total: 6%

Land @ Pophyr Grove
-------------------
 12%  #051 Pixsprout  (Fairy / Grass)  Lv 10–14
 12%  #201 Pixsprout  (Fairy / Grass)  Lv 10–14
 10%  #248 Bloomlet  (Grass / Fairy)  Lv 14–18
 10%  #092 Flickerfae  (Fairy)  Lv 10–14
 10%  #094 Illumoria  (Fairy / Psychic)  Lv 10–14
 10%  #093 Lanternymph  (Fairy / Psychic)  Lv 10–14
  8%  #052 Gladerin  (Fairy / Grass)  Lv 14–18
  8%  #202 Gladerin  (Fairy / Grass)  Lv 14–18
  6%  #218 Hivern  (Bug / Fairy)  Lv 14–18
  4%  #292 Cliffgarde  (Rock / Fairy)  Lv 24–30
  2%  #219 Apiarch  (Bug / Fairy)  Lv 26–34
Total: 92%

Land @ Riverbend Crossing
-------------------------
  6%  #253 Verdantide  (Grass / Flying)  Lv 12–16
Total: 6%

Land @ Route 1 (Castle Celeste Approach)
----------------------------------------
 20%  #282 Ponderpup  (Psychic)  Lv 12–16
Total: 20%

Land @ Route 2
--------------
  9%  #215 Ramlet  (Normal)  Lv 4–7
  9%  #028 Shinx  (Electric)  Lv 4–7
  9%  #178 Shinx  (Electric)  Lv 4–7
  9%  #014 Silkreep  (Bug)  Lv 5–8
  9%  #164 Silkreep  (Bug)  Lv 5–8
  7%  #054 Pebblit  (Rock)  Lv 5–8
  6%  #314 Aged Luxray (Aged Variant)  (Electric / Fairy)  Lv 4–7
  6%  #207 Boltnib  (Electric)  Lv 4–7
  6%  #267 Carapup  (Bug)  Lv 6–10
  6%  #068 Glimmerk  (Electric / Fairy)  Lv 4–7
  6%  #204 Pebblit  (Rock)  Lv 5–8
  6%  #069 Prismalia  (Electric / Fairy)  Lv 4–7
  6%  #252 Salvleaf  (Grass / Dragon)  Lv 6–10
  6%  #067 Spritzap  (Electric / Fairy)  Lv 4–7
Total: 100%

Land @ Route 3
--------------
  4%  #312 Aged Briarovere (Aged Variant)  (Grass / Poison)  Lv 8–12
  4%  #311 Aged Miregloop (Aged Variant)  (Grass / Poison)  Lv 8–12
  4%  #119 Boarrier  (Normal / Fighting)  Lv 8–12
  4%  #070 Bramblet  (Grass / Dark)  Lv 8–12
  4%  #220 Bramblet  (Grass / Dark)  Lv 8–12
  4%  #072 Briarovere  (Grass / Dark)  Lv 8–12
  4%  #138 Clawbun  (Normal)  Lv 8–12
  4%  #082 Dreamdill  (Grass / Psychic)  Lv 8–12
  4%  #141 Glowmoss  (Grass / Fairy)  Lv 8–12
  4%  #310 Moldraith (Weed-Fungus Source)  (Grass / Poison)  Lv 8–12
  4%  #117 Pipsqueak  (Normal)  Lv 8–12
  4%  #139 Pounchit  (Normal / Fighting)  Lv 8–12
  4%  #081 Puffsage  (Grass / Psychic)  Lv 8–12
  4%  #307 Pytavor  (Grass / Dragon)  Lv 8–12
  4%  #084 Raggle  (Normal / Bug)  Lv 8–12
  4%  #083 Sageveil  (Grass / Psychic)  Lv 8–12
  4%  #077 Sporegnash  (Grass / Poison)  Lv 8–12
  4%  #172 Sprigadet  (Grass)  Lv 8–12
  4%  #118 Squealot  (Normal)  Lv 8–12
  4%  #071 Thornshad  (Grass / Dark)  Lv 8–12
  3%  #062 Budgeon  (Normal / Flying)  Lv 8–12
  3%  #254 Pathling  (Normal)  Lv 8–12
  3%  #063 Skylark  (Normal / Flying)  Lv 8–12
  3%  #022 Sprigadet  (Grass)  Lv 8–12
  2%  #020 Roostrik  (Normal / Flying)  Lv 10–14
  2%  #170 Roostrik  (Normal / Flying)  Lv 10–14
  2%  #034 Snarlil  (Fighting)  Lv 10–14
  2%  #184 Snarlil  (Fighting)  Lv 10–14
Total: 100%

Land @ Route 4
--------------
  8%  #264 Cobbolt  (Rock / Ice)  Lv 12–16
  6%  #089 Cavernip  (Rock / Ground)  Lv 10–13
  6%  #090 Drillersk  (Rock / Ground)  Lv 10–13
  6%  #010 Gravowl  (Rock / Flying)  Lv 10–13
  6%  #056 Monolithorn  (Rock / Steel)  Lv 10–13
  5%  #315 Aged Gargryph (Aged Variant)  (Rock / Ghost)  Lv 10–13
  5%  #309 Aged Titan (Apex)  (Rock / Electric)  Lv 10–13
  5%  #131 Bastionite  (Rock / Steel)  Lv 10–13
  5%  #109 Boulderbloom  (Rock / Grass)  Lv 10–13
  5%  #129 Caveling  (Rock)  Lv 10–13
  5%  #216 Craggoat  (Rock / Normal)  Lv 12–16
  5%  #144 Flintusk  (Rock)  Lv 10–13
  5%  #160 Gravowl  (Rock / Flying)  Lv 10–13
  5%  #108 Pebbleaf  (Rock / Grass)  Lv 10–13
  5%  #091 Quakemaw  (Rock / Ground)  Lv 10–13
  5%  #130 Stoneling  (Rock / Steel)  Lv 10–13
  4%  #238 Stampedeer  (Normal / Fighting)  Lv 20–26
  3%  #055 Cairnox  (Rock)  Lv 16–22
  3%  #205 Cairnox  (Rock)  Lv 16–22
  3%  #268 Shellisk  (Bug / Rock)  Lv 16–22
Total: 100%

Land @ Route 5
--------------
  7%  #040 Scorillet  (Fire)  Lv 12–16
  7%  #190 Scorillet  (Fire)  Lv 12–16
  6%  #115 Ashhorn  (Fire / Steel)  Lv 12–16
  6%  #140 Brawlapin  (Fighting)  Lv 14–18
  6%  #107 Brawlisk  (Fighting / Dark)  Lv 14–18
  6%  #116 Cauterforge  (Fire / Steel)  Lv 12–16
  6%  #133 Cinderdune  (Fire / Ground)  Lv 12–16
  6%  #122 Cindertip  (Fire / Fairy)  Lv 12–16
  6%  #134 Duneinferno  (Fire / Ground)  Lv 12–16
  6%  #114 Emberling  (Fire)  Lv 12–16
  6%  #106 Knuckit  (Fighting)  Lv 14–18
  6%  #132 Pyrestoat  (Fire / Ground)  Lv 12–16
  6%  #279 Shardlet  (Rock / Ice)  Lv 14–18
  6%  #234 Strikid  (Fighting)  Lv 14–18
  5%  #035 Tasmor  (Fighting)  Lv 16–20
  5%  #185 Tasmor  (Fighting)  Lv 16–20
  4%  #221 Thornhorn  (Grass / Fighting)  Lv 16–20
Total: 100%

Land @ Route 6
--------------
 10%  #065 Burrowbit  (Ground)  Lv 14–18
 10%  #066 Dunejack  (Ground)  Lv 14–18
 10%  #246 Embril  (Fire)  Lv 14–18
 10%  #231 Trapinch  (Ground)  Lv 14–18
 10%  #276 Voltseed  (Electric / Grass)  Lv 14–18
  6%  #283 Thinkhound  (Psychic)  Lv 24–30
  5%  #029 Luxio  (Electric)  Lv 18–24
  5%  #179 Luxio  (Electric)  Lv 18–24
  4%  #208 Gridjaw  (Electric / Steel)  Lv 20–26
  4%  #272 Seerlynx  (Psychic)  Lv 24–30
  3%  #023 Cerelodge  (Grass / Rock)  Lv 26–34
  3%  #173 Cerelodge  (Grass / Rock)  Lv 26–34
  3%  #298 Vineward  (Grass / Steel)  Lv 32–40
Total: 83%

Land @ Route 7
--------------
 10%  #270 Charmote  (Fairy)  Lv 14–18
 10%  #053 Lullivy  (Fairy / Grass)  Lv 16–20
 10%  #203 Lullivy  (Fairy / Grass)  Lv 16–20
  5%  #064 Galecrest  (Flying)  Lv 28–34
  5%  #142 Mistraven  (Flying / Dark)  Lv 28–34
  5%  #143 Stormcorv  (Flying / Dark)  Lv 28–34
  4%  #099 Floramere  (Water / Fairy)  Lv 26–34
  4%  #249 Floramere  (Water / Fairy)  Lv 26–34
  3%  #293 Aetherwing  (Flying / Fairy)  Lv 28–34
  3%  #259 Citranth  (Grass / Dragon)  Lv 28–34
  2%  #021 Aeroracle  (Flying / Psychic)  Lv 28–34
  2%  #171 Aeroracle  (Flying / Psychic)  Lv 28–34
  2%  #222 Briarwarl  (Grass / Fighting)  Lv 28–34
Total: 65%

Land @ Route 8
--------------
  5%  #280 Splintrum  (Rock / Ice)  Lv 28–34
  4%  #232 Vibrava  (Ground / Dragon)  Lv 28–34
  2%  #036 Devastan  (Fighting / Rock)  Lv 34–42
  2%  #186 Devastan  (Fighting / Rock)  Lv 34–42
  2%  #125 Drakeshard  (Dragon / Rock)  Lv 34–42
  2%  #278 Dynahorn  (Electric / Grass)  Lv 34–42
  2%  #233 Flygon (Thalorian Form)  (Dragon / Bug)  Lv 38–46
  2%  #123 Hatchling  (Dragon)  Lv 34–42
  2%  #260 Pulsrake  (Electric / Dragon)  Lv 38–46
  2%  #145 Timino  (Normal / Rock)  Lv 40–55
  2%  #295 Timino  (Normal / Rock)  Lv 40–55
  2%  #124 Wyrmkin  (Dragon)  Lv 34–42
Total: 29%

Land @ Runeward Crossing
------------------------
 10%  #288 Sapsludge  (Poison)  Lv 10–14
Total: 10%

Land @ Swoven Swamp
-------------------
 12%  #223 Slipvine  (Grass / Poison)  Lv 10–14
 10%  #120 Glimmergnat  (Bug / Electric)  Lv 10–14
 10%  #285 Glimmergnat  (Bug / Electric)  Lv 10–14
 10%  #017 Mosslush  (Grass)  Lv 8–12
 10%  #167 Mosslush  (Grass)  Lv 8–12
  8%  #313 Aged Honchkrow (Thalorian) (Aged Variant)  (Poison / Flying)  Lv 16–22
  6%  #286 Faegnat  (Bug / Fairy)  Lv 16–22
  6%  #289 Fumoss  (Poison / Grass)  Lv 16–22
  6%  #224 Viperoot  (Grass / Poison)  Lv 16–22
  4%  #018 Miregloop  (Grass / Rock)  Lv 14–18
  4%  #168 Miregloop  (Grass / Rock)  Lv 14–18
  3%  #302 Fungalorn  (Grass / Poison)  Lv 32–40
Total: 89%

Land @ Tidepath Road
--------------------
  9%  #013 Threadle  (Bug)  Lv 2–5
  9%  #163 Threadle  (Bug)  Lv 2–5
  8%  #016 Mossling  (Grass)  Lv 2–5
  8%  #166 Mossling  (Grass)  Lv 2–5
  7%  #019 Chickind  (Normal)  Lv 2–5
  7%  #169 Chickind  (Normal)  Lv 2–5
  5%  #059 Bristlet  (Bug / Rock)  Lv 2–5
  5%  #217 Buzzit  (Bug)  Lv 3–5
  5%  #060 Cragcarap  (Bug / Rock)  Lv 2–5
  5%  #237 Rovlet  (Normal)  Lv 2–5
  4%  #061 Bastilisk  (Bug / Rock)  Lv 2–5
  4%  #096 Fenweevil  (Bug / Grass)  Lv 2–5
  4%  #095 Miremite  (Bug / Grass)  Lv 2–5
  4%  #103 Nectarune  (Bug / Fairy)  Lv 2–5
  4%  #102 Nectip  (Bug / Fairy)  Lv 2–5
  4%  #121 Neonidge  (Bug / Electric)  Lv 2–5
  4%  #086 Seamreap  (Bug / Ghost)  Lv 2–5
  4%  #085 Stitchurn  (Bug / Ghost)  Lv 2–5
Total: 100%

Land @ Victory Road
-------------------
  2%  #275 Lavabrawn  (Fire / Fighting)  Lv 38–46
  2%  #284 Mindmaul  (Psychic / Fighting)  Lv 40–55
  1%  #012 Gargryph  (Rock / Flying)  Lv 45–55
  1%  #162 Gargryph  (Rock / Flying)  Lv 45–55
Total: 6%

Land @ Whisperwoods
-------------------
 10%  #225 Sporeshade  (Grass / Ghost)  Lv 14–18
  6%  #076 Mycelurk  (Grass / Poison)  Lv 20–26
  6%  #226 Mycelurk  (Grass / Poison)  Lv 20–26
  4%  #025 Herbend  (Grass / Poison)  Lv 24–30
  4%  #175 Herbend  (Grass / Poison)  Lv 24–30
  3%  #287 Lumenmidge  (Bug / Fairy)  Lv 24–30
  2%  #290 Cankerloom  (Poison / Grass)  Lv 28–34
Total: 35%

Land @ Whitehorn Mountains
--------------------------
  3%  #236 Dojoroar  (Fighting)  Lv 32–40
  3%  #011 Gravern  (Rock / Flying)  Lv 24–28
  3%  #161 Gravern  (Rock / Flying)  Lv 24–28
  2%  #300 Stormsable  (Electric / Rock)  Lv 38–46
  2%  #255 Wayvern  (Dragon / Flying)  Lv 34–42
Total: 13%

Snow (Land) @ Victory Road
--------------------------
  1%  #150 Garchomp (Thalorian Form)  (Ice / Dragon)  Lv 45–55
  1%  #306 Garchomp (Thalorian Form)  (Ice / Dragon)  Lv 45–55
Total: 2%

Snow (Land) @ Whitehorn Mountains
---------------------------------
  8%  #213 Glaciurn  (Ice)  Lv 20–26
  6%  #075 Frostlet  (Ice)  Lv 20–26
  6%  #148 Gible (Thalorian Form)  (Ice / Rock)  Lv 28–34
  6%  #304 Gible (Thalorian Form)  (Ice / Rock)  Lv 28–34
  6%  #214 Snowlark  (Ice / Flying)  Lv 24–30
Total: 32%

Surf @ Azure Sea
----------------
  6%  #044 Brineel  (Water)  Lv 12–16
  6%  #194 Brineel  (Water)  Lv 12–16
  5%  #098 Bloomfin  (Water / Fairy)  Lv 12–16
  5%  #105 Coralmason  (Water / Rock)  Lv 12–16
  5%  #112 Deltaquag  (Water / Ground)  Lv 12–16
  5%  #308 Fontessa  (Water / Fairy)  Lv 12–16
  5%  #078 Glintoad  (Water / Fairy)  Lv 12–16
  5%  #073 Kelpip  (Water / Grass)  Lv 12–16
  5%  #113 Marshquake  (Water / Ground)  Lv 12–16
  5%  #088 Mudmutt  (Water / Ground)  Lv 12–16
  5%  #097 Pondrake  (Water / Dragon)  Lv 12–16
  5%  #087 Puddlepup  (Water / Ground)  Lv 12–16
  5%  #104 Reeflet  (Water / Rock)  Lv 12–16
  5%  #074 Seasilk  (Water / Grass)  Lv 12–16
  5%  #111 Siltseal  (Water / Ground)  Lv 12–16
  5%  #110 Tidekit  (Water)  Lv 12–16
  4%  #045 Skerrfin  (Water)  Lv 18–24
  4%  #195 Skerrfin  (Water)  Lv 18–24
  3%  #047 Reefwisp  (Water / Fairy)  Lv 26–34
  2%  #101 Brineshade  (Water / Ghost)  Lv 28–34
  2%  #251 Brineshade  (Water / Ghost)  Lv 28–34
  2%  #197 Reefwisp  (Water / Fairy)  Lv 26–34
  1%  #263 Deepseer  (Water / Psychic)  Lv 34–42
Total: 100%

Surf @ Lakespire Town (Lake)
----------------------------
 16%  #042 Ripplet  (Water)  Lv 10–14
 16%  #192 Ripplet  (Water)  Lv 10–14
  8%  #261 Lenticor  (Water)  Lv 16–20
  6%  #240 Shellflow  (Water / Rock)  Lv 18–24
  4%  #262 Stillmare  (Water / Psychic)  Lv 24–30
Total: 50%

Surf @ Riverbend Crossing
-------------------------
 14%  #031 Glimlot  (Water)  Lv 8–12
 14%  #181 Glimlot  (Water)  Lv 8–12
 10%  #043 Currentide  (Water)  Lv 14–18
 10%  #193 Currentide  (Water)  Lv 14–18
 10%  #239 Tortide  (Water)  Lv 14–18
  3%  #241 Rivarmor  (Water / Rock)  Lv 26–34
Total: 61%

Surf @ Swoven Swamp
-------------------
  6%  #032 Fentotl  (Water / Dark)  Lv 14–18
  6%  #182 Fentotl  (Water / Dark)  Lv 14–18
Total: 12%

Surf @ Whisperwoods
-------------------
  2%  #033 Morbaxol  (Water / Dark)  Lv 28–34
  2%  #183 Morbaxol  (Water / Dark)  Lv 28–34
Total: 4%

Surf @ Whitehorn Mountains
--------------------------
 10%  #212 Frosplet  (Ice / Water)  Lv 16–22
Total: 10%

========================================================================
END FILE: THALORIA_ENCOUNTERS_BY_LOCATION.txt
========================================================================

========================================================================
```

---
# APPENDIX 3 — ENCOUNTER RATES (YOUR TABLE)

```text
========================================================================

THALORIA — ENCOUNTER RATES (ALL SPECIES, FIXED DEX)

Rule: Gift/Legendary/Unknown entries are marked as not encounterable (—).

Format: #Dex Name | Method @ Location | Rate | Levels

#001 Inklet (Water) | Gift @ Whereabouts Unknown (Starter Gift Line) | — | —
#002 Runink (Water) | Gift @ Whereabouts Unknown (Starter Gift Line) | — | —
#003 Arcanquid (Water / Psychic) | Gift @ Whereabouts Unknown (Starter Gift Line) | — | —
#004 Tadlance (Grass) | Gift @ Whereabouts Unknown (Starter Gift Line) | — | —
#005 Branquire (Grass / Fighting) | Gift @ Whereabouts Unknown (Starter Gift Line) | — | —
#006 Thronoak (Grass / Fighting) | Gift @ Whereabouts Unknown (Starter Gift Line) | — | —
#007 Cinderoon (Fire) | Gift @ Whereabouts Unknown (Starter Gift Line) | — | —
#008 Blazit (Fire) | Gift @ Whereabouts Unknown (Starter Gift Line) | — | —
#009 Inferyx (Fire / Dark) | Gift @ Whereabouts Unknown (Starter Gift Line) | — | —
#010 Gravowl (Rock / Flying) | Land @ Route 4 | 6% | Lv 10–13
#011 Gravern (Rock / Flying) | Land @ Whitehorn Mountains | 3% | Lv 24–28
#012 Gargryph (Rock / Flying) | Land @ Victory Road | 1% | Lv 45–55
#013 Threadle (Bug) | Land @ Tidepath Road | 9% | Lv 2–5
#014 Silkreep (Bug) | Land @ Route 2 | 9% | Lv 5–8
#015 Mothrave (Bug / Psychic) | Land (Night) @ Pophyr Grove | 4% | Lv 18–24
#016 Mossling (Grass) | Land @ Tidepath Road | 8% | Lv 2–5
#017 Mosslush (Grass) | Land @ Swoven Swamp | 10% | Lv 8–12
#018 Miregloop (Grass / Rock) | Land @ Swoven Swamp | 4% | Lv 14–18
#019 Chickind (Normal) | Land @ Tidepath Road | 7% | Lv 2–5
#020 Roostrik (Normal / Flying) | Land @ Route 3 | 2% | Lv 10–14
#021 Aeroracle (Flying / Psychic) | Land @ Route 7 | 2% | Lv 28–34
#022 Sprigadet (Grass) | Land @ Route 3 | 3% | Lv 8–12
#023 Cerelodge (Grass / Rock) | Land @ Route 6 | 3% | Lv 26–34
#024 Armaroust (Grass / Steel) | Land @ Gabite’s Forge | 3% | Lv 26–34
#025 Herbend (Grass / Poison) | Land @ Whisperwoods | 4% | Lv 24–30
#026 Meowth (Thalorian Form) (Steel) | Land @ Graxen City (Outskirts) | 8% | Lv 16–22
#027 Ferrser (Steel) | Land @ Gabite’s Forge | 4% | Lv 24–30
#028 Shinx (Electric) | Land @ Route 2 | 9% | Lv 4–7
#029 Luxio (Electric) | Land @ Route 6 | 5% | Lv 18–24
#030 Luxray (Electric / Dark) | Land (Night) @ Route 8 | 2% | Lv 38–46
#031 Glimlot (Water) | Surf @ Riverbend Crossing | 14% | Lv 8–12
#032 Fentotl (Water / Dark) | Surf @ Swoven Swamp | 6% | Lv 14–18
#033 Morbaxol (Water / Dark) | Surf @ Whisperwoods | 2% | Lv 28–34
#034 Snarlil (Fighting) | Land @ Route 3 | 2% | Lv 10–14
#035 Tasmor (Fighting) | Land @ Route 5 | 5% | Lv 16–20
#036 Devastan (Fighting / Rock) | Land @ Route 8 | 2% | Lv 34–42
#037 Spikimp (Dark / Electric) | Land (Night) @ Pillage Post | 8% | Lv 10–14
#038 Spiklash (Dark / Electric) | Land (Night) @ Riverbend Crossing | 4% | Lv 18–24
#039 Voltigar (Dark / Electric) | Land (Night) @ Route 8 | 1% | Lv 45–55
#040 Scorillet (Fire) | Land @ Route 5 | 7% | Lv 12–16
#041 Cindermaw (Fire / Rock) | Land @ Forlort Keep (Volcano Slopes) | 4% | Lv 28–34
#042 Ripplet (Water) | Surf @ Lakespire Town (Lake) | 16% | Lv 10–14
#043 Currentide (Water) | Surf @ Riverbend Crossing | 10% | Lv 14–18
#044 Brineel (Water) | Surf @ Azure Sea | 6% | Lv 12–16
#045 Skerrfin (Water) | Surf @ Azure Sea | 4% | Lv 18–24
#046 Gutterray (Water / Poison) | Fishing @ Pillage Post | 6% | Lv 18–24
#047 Reefwisp (Water / Fairy) | Surf @ Azure Sea | 3% | Lv 26–34
#048 Oracub (Psychic) | Land @ Eternal Myrillfount (Ancient Ruins) | 10% | Lv 12–16
#049 Augurusk (Psychic / Rock) | Cave/Ruins @ Eternal Myrillfount (Ancient Ruins) | 4% | Lv 20–26
#050 Runeling (Psychic) | Land @ Castle Celeste | 8% | Lv 12–16
#051 Pixsprout (Fairy / Grass) | Land @ Pophyr Grove | 12% | Lv 10–14
#052 Gladerin (Fairy / Grass) | Land @ Pophyr Grove | 8% | Lv 14–18
#053 Lullivy (Fairy / Grass) | Land @ Route 7 | 10% | Lv 16–20
#054 Pebblit (Rock) | Land @ Route 2 | 7% | Lv 5–8
#055 Cairnox (Rock) | Land @ Route 4 | 3% | Lv 16–22
#056 Monolithorn (Rock / Steel) | Land @ Route 4 | 6% | Lv 10–13
#057 Driftkit (Ghost) | Land (Night) @ Whisperwoods | 6% | Lv 18–24
#058 Shadewick (Ghost / Fire) | Land (Night) @ Whisperwoods | 6% | Lv 18–24
#059 Bristlet (Bug / Rock) | Land @ Tidepath Road | 5% | Lv 2–5
#060 Cragcarap (Bug / Rock) | Land @ Tidepath Road | 5% | Lv 2–5
#061 Bastilisk (Bug / Rock) | Land @ Tidepath Road | 4% | Lv 2–5
#062 Budgeon (Normal / Flying) | Land @ Route 3 | 3% | Lv 8–12
#063 Skylark (Normal / Flying) | Land @ Route 3 | 3% | Lv 8–12
#064 Galecrest (Flying) | Land @ Route 7 | 5% | Lv 28–34
#065 Burrowbit (Ground) | Land @ Route 6 | 10% | Lv 14–18
#066 Dunejack (Ground) | Land @ Route 6 | 10% | Lv 14–18
#067 Spritzap (Electric / Fairy) | Land @ Route 2 | 6% | Lv 4–7
#068 Glimmerk (Electric / Fairy) | Land @ Route 2 | 6% | Lv 4–7
#069 Prismalia (Electric / Fairy) | Land @ Route 2 | 6% | Lv 4–7
#070 Bramblet (Grass / Dark) | Land @ Route 3 | 4% | Lv 8–12
#071 Thornshad (Grass / Dark) | Land @ Route 3 | 4% | Lv 8–12
#072 Briarovere (Grass / Dark) | Land @ Route 3 | 4% | Lv 8–12
#073 Kelpip (Water / Grass) | Surf @ Azure Sea | 5% | Lv 12–16
#074 Seasilk (Water / Grass) | Surf @ Azure Sea | 5% | Lv 12–16
#075 Frostlet (Ice) | Snow (Land) @ Whitehorn Mountains | 6% | Lv 20–26
#076 Mycelurk (Grass / Poison) | Land @ Whisperwoods | 6% | Lv 20–26
#077 Sporegnash (Grass / Poison) | Land @ Route 3 | 4% | Lv 8–12
#078 Glintoad (Water / Fairy) | Surf @ Azure Sea | 5% | Lv 12–16
#079 Murkrow (Thalorian Form) (Poison / Dark) | Land (Night) @ Pillage Post | 6% | Lv 18–24
#080 Honchkrow (Thalorian Form) (Poison / Dark) | Land (Night) @ Whisperwoods | 2% | Lv 34–42
#081 Puffsage (Grass / Psychic) | Land @ Route 3 | 4% | Lv 8–12
#082 Dreamdill (Grass / Psychic) | Land @ Route 3 | 4% | Lv 8–12
#083 Sageveil (Grass / Psychic) | Land @ Route 3 | 4% | Lv 8–12
#084 Raggle (Normal / Bug) | Land @ Route 3 | 4% | Lv 8–12
#085 Stitchurn (Bug / Ghost) | Land @ Tidepath Road | 4% | Lv 2–5
#086 Seamreap (Bug / Ghost) | Land @ Tidepath Road | 4% | Lv 2–5
#087 Puddlepup (Water / Ground) | Surf @ Azure Sea | 5% | Lv 12–16
#088 Mudmutt (Water / Ground) | Surf @ Azure Sea | 5% | Lv 12–16
#089 Cavernip (Rock / Ground) | Land @ Route 4 | 6% | Lv 10–13
#090 Drillersk (Rock / Ground) | Land @ Route 4 | 6% | Lv 10–13
#091 Quakemaw (Rock / Ground) | Land @ Route 4 | 5% | Lv 10–13
#092 Flickerfae (Fairy) | Land @ Pophyr Grove | 10% | Lv 10–14
#093 Lanternymph (Fairy / Psychic) | Land @ Pophyr Grove | 10% | Lv 10–14
#094 Illumoria (Fairy / Psychic) | Land @ Pophyr Grove | 10% | Lv 10–14
#095 Miremite (Bug / Grass) | Land @ Tidepath Road | 4% | Lv 2–5
#096 Fenweevil (Bug / Grass) | Land @ Tidepath Road | 4% | Lv 2–5
#097 Pondrake (Water / Dragon) | Surf @ Azure Sea | 5% | Lv 12–16
#098 Bloomfin (Water / Fairy) | Surf @ Azure Sea | 5% | Lv 12–16
#099 Floramere (Water / Fairy) | Land @ Route 7 | 4% | Lv 26–34
#100 Tidemurk (Water / Dark) | Fishing @ Riverbend Crossing | 10% | Lv 14–18
#101 Brineshade (Water / Ghost) | Surf @ Azure Sea | 2% | Lv 28–34
#102 Nectip (Bug / Fairy) | Land @ Tidepath Road | 4% | Lv 2–5
#103 Nectarune (Bug / Fairy) | Land @ Tidepath Road | 4% | Lv 2–5
#104 Reeflet (Water / Rock) | Surf @ Azure Sea | 5% | Lv 12–16
#105 Coralmason (Water / Rock) | Surf @ Azure Sea | 5% | Lv 12–16
#106 Knuckit (Fighting) | Land @ Route 5 | 6% | Lv 14–18
#107 Brawlisk (Fighting / Dark) | Land @ Route 5 | 6% | Lv 14–18
#108 Pebbleaf (Rock / Grass) | Land @ Route 4 | 5% | Lv 10–13
#109 Boulderbloom (Rock / Grass) | Land @ Route 4 | 5% | Lv 10–13
#110 Tidekit (Water) | Surf @ Azure Sea | 5% | Lv 12–16
#111 Siltseal (Water / Ground) | Surf @ Azure Sea | 5% | Lv 12–16
#112 Deltaquag (Water / Ground) | Surf @ Azure Sea | 5% | Lv 12–16
#113 Marshquake (Water / Ground) | Surf @ Azure Sea | 5% | Lv 12–16
#114 Emberling (Fire) | Land @ Route 5 | 6% | Lv 12–16
#115 Ashhorn (Fire / Steel) | Land @ Route 5 | 6% | Lv 12–16
#116 Cauterforge (Fire / Steel) | Land @ Route 5 | 6% | Lv 12–16
#117 Pipsqueak (Normal) | Land @ Route 3 | 4% | Lv 8–12
#118 Squealot (Normal) | Land @ Route 3 | 4% | Lv 8–12
#119 Boarrier (Normal / Fighting) | Land @ Route 3 | 4% | Lv 8–12
#120 Glimmergnat (Bug / Electric) | Land @ Swoven Swamp | 10% | Lv 10–14
#121 Neonidge (Bug / Electric) | Land @ Tidepath Road | 4% | Lv 2–5
#122 Cindertip (Fire / Fairy) | Land @ Route 5 | 6% | Lv 12–16
#123 Hatchling (Dragon) | Land @ Route 8 | 2% | Lv 34–42
#124 Wyrmkin (Dragon) | Land @ Route 8 | 2% | Lv 34–42
#125 Drakeshard (Dragon / Rock) | Land @ Route 8 | 2% | Lv 34–42
#126 Skulkid (Dark) | Land (Night) @ Whisperwoods | 6% | Lv 16–20
#127 Nightgraze (Dark / Grass) | Land (Night) @ Whisperwoods | 6% | Lv 16–20
#128 Dreadbramble (Dark / Grass) | Land (Night) @ Whisperwoods | 6% | Lv 16–20
#129 Caveling (Rock) | Land @ Route 4 | 5% | Lv 10–13
#130 Stoneling (Rock / Steel) | Land @ Route 4 | 5% | Lv 10–13
#131 Bastionite (Rock / Steel) | Land @ Route 4 | 5% | Lv 10–13
#132 Pyrestoat (Fire / Ground) | Land @ Route 5 | 6% | Lv 12–16
#133 Cinderdune (Fire / Ground) | Land @ Route 5 | 6% | Lv 12–16
#134 Duneinferno (Fire / Ground) | Land @ Route 5 | 6% | Lv 12–16
#135 Ferrowisp (Steel / Ghost) | Land @ Gabite’s Forge | 6% | Lv 16–22
#136 Anvilspecter (Steel / Ghost) | Land @ Gabite’s Forge | 6% | Lv 16–22
#137 Forgehaunt (Steel / Ghost) | Land @ Gabite’s Forge | 6% | Lv 16–22
#138 Clawbun (Normal) | Land @ Route 3 | 4% | Lv 8–12
#139 Pounchit (Normal / Fighting) | Land @ Route 3 | 4% | Lv 8–12
#140 Brawlapin (Fighting) | Land @ Route 5 | 6% | Lv 14–18
#141 Glowmoss (Grass / Fairy) | Land @ Route 3 | 4% | Lv 8–12
#142 Mistraven (Flying / Dark) | Land @ Route 7 | 5% | Lv 28–34
#143 Stormcorv (Flying / Dark) | Land @ Route 7 | 5% | Lv 28–34
#144 Flintusk (Rock) | Land @ Route 4 | 5% | Lv 10–13
#145 Timino (Normal / Rock) | Land @ Route 8 | 2% | Lv 40–55
#146 Brutusk (Dark / Rock) | Land (Night) @ Victory Road | 1% | Lv 45–55
#147 Justyrn (Rock / Steel) | Cave/Ruins @ Victory Road | 1% | Lv 50–55
#148 Gible (Thalorian Form) (Ice / Rock) | Snow (Land) @ Whitehorn Mountains | 6% | Lv 28–34
#149 Gabite (Thalorian Form) (Ice / Rock) | Cave/Ruins @ Gabite Cavern | 2% | Lv 34–42
#150 Garchomp (Thalorian Form) (Ice / Dragon) | Snow (Land) @ Victory Road | 1% | Lv 45–55
#151 Inklet (Water) | Gift @ Whereabouts Unknown (Starter Gift Line) | — | —
#152 Runink (Water) | Gift @ Whereabouts Unknown (Starter Gift Line) | — | —
#153 Arcanquid (Water / Psychic) | Gift @ Whereabouts Unknown (Starter Gift Line) | — | —
#154 Tadlance (Grass) | Gift @ Whereabouts Unknown (Starter Gift Line) | — | —
#155 Branquire (Grass / Fighting) | Gift @ Whereabouts Unknown (Starter Gift Line) | — | —
#156 Thronoak (Grass / Fighting) | Gift @ Whereabouts Unknown (Starter Gift Line) | — | —
#157 Cinderoon (Fire) | Gift @ Whereabouts Unknown (Starter Gift Line) | — | —
#158 Blazit (Fire) | Gift @ Whereabouts Unknown (Starter Gift Line) | — | —
#159 Inferyx (Fire / Dark) | Gift @ Whereabouts Unknown (Starter Gift Line) | — | —
#160 Gravowl (Rock / Flying) | Land @ Route 4 | 5% | Lv 10–13
#161 Gravern (Rock / Flying) | Land @ Whitehorn Mountains | 3% | Lv 24–28
#162 Gargryph (Rock / Flying) | Land @ Victory Road | 1% | Lv 45–55
#163 Threadle (Bug) | Land @ Tidepath Road | 9% | Lv 2–5
#164 Silkreep (Bug) | Land @ Route 2 | 9% | Lv 5–8
#165 Mothrave (Bug / Psychic) | Land (Night) @ Pophyr Grove | 4% | Lv 18–24
#166 Mossling (Grass) | Land @ Tidepath Road | 8% | Lv 2–5
#167 Mosslush (Grass) | Land @ Swoven Swamp | 10% | Lv 8–12
#168 Miregloop (Grass / Rock) | Land @ Swoven Swamp | 4% | Lv 14–18
#169 Chickind (Normal) | Land @ Tidepath Road | 7% | Lv 2–5
#170 Roostrik (Normal / Flying) | Land @ Route 3 | 2% | Lv 10–14
#171 Aeroracle (Flying / Psychic) | Land @ Route 7 | 2% | Lv 28–34
#172 Sprigadet (Grass) | Land @ Route 3 | 4% | Lv 8–12
#173 Cerelodge (Grass / Rock) | Land @ Route 6 | 3% | Lv 26–34
#174 Armaroust (Grass / Steel) | Land @ Gabite’s Forge | 3% | Lv 26–34
#175 Herbend (Grass / Poison) | Land @ Whisperwoods | 4% | Lv 24–30
#176 Meowth (Thalorian Form) (Steel) | Land @ Graxen City (Outskirts) | 8% | Lv 16–22
#177 Ferrser (Steel) | Land @ Gabite’s Forge | 4% | Lv 24–30
#178 Shinx (Electric) | Land @ Route 2 | 9% | Lv 4–7
#179 Luxio (Electric) | Land @ Route 6 | 5% | Lv 18–24
#180 Luxray (Electric / Dark) | Land (Night) @ Route 8 | 2% | Lv 38–46
#181 Glimlot (Water) | Surf @ Riverbend Crossing | 14% | Lv 8–12
#182 Fentotl (Water / Dark) | Surf @ Swoven Swamp | 6% | Lv 14–18
#183 Morbaxol (Water / Dark) | Surf @ Whisperwoods | 2% | Lv 28–34
#184 Snarlil (Fighting) | Land @ Route 3 | 2% | Lv 10–14
#185 Tasmor (Fighting) | Land @ Route 5 | 5% | Lv 16–20
#186 Devastan (Fighting / Rock) | Land @ Route 8 | 2% | Lv 34–42
#187 Spikimp (Dark / Electric) | Land (Night) @ Pillage Post | 8% | Lv 10–14
#188 Spiklash (Dark / Electric) | Land (Night) @ Riverbend Crossing | 4% | Lv 18–24
#189 Voltigar (Dark / Electric) | Land (Night) @ Route 8 | 1% | Lv 45–55
#190 Scorillet (Fire) | Land @ Route 5 | 7% | Lv 12–16
#191 Cindermaw (Fire / Rock) | Land @ Forlort Keep (Volcano Slopes) | 4% | Lv 28–34
#192 Ripplet (Water) | Surf @ Lakespire Town (Lake) | 16% | Lv 10–14
#193 Currentide (Water) | Surf @ Riverbend Crossing | 10% | Lv 14–18
#194 Brineel (Water) | Surf @ Azure Sea | 6% | Lv 12–16
#195 Skerrfin (Water) | Surf @ Azure Sea | 4% | Lv 18–24
#196 Gutterray (Water / Poison) | Fishing @ Pillage Post | 6% | Lv 18–24
#197 Reefwisp (Water / Fairy) | Surf @ Azure Sea | 2% | Lv 26–34
#198 Oracub (Psychic) | Land @ Eternal Myrillfount (Ancient Ruins) | 10% | Lv 12–16
#199 Augurusk (Psychic / Rock) | Cave/Ruins @ Eternal Myrillfount (Ancient Ruins) | 4% | Lv 20–26
#200 Runeling (Psychic) | Land @ Castle Celeste | 8% | Lv 12–16
#201 Pixsprout (Fairy / Grass) | Land @ Pophyr Grove | 12% | Lv 10–14
#202 Gladerin (Fairy / Grass) | Land @ Pophyr Grove | 8% | Lv 14–18
#203 Lullivy (Fairy / Grass) | Land @ Route 7 | 10% | Lv 16–20
#204 Pebblit (Rock) | Land @ Route 2 | 6% | Lv 5–8
#205 Cairnox (Rock) | Land @ Route 4 | 3% | Lv 16–22
#206 Reliclaw (Rock / Steel) | Cave/Ruins @ Gabite Cavern | 3% | Lv 24–30
#207 Boltnib (Electric) | Land @ Route 2 | 6% | Lv 4–7
#208 Gridjaw (Electric / Steel) | Land @ Route 6 | 4% | Lv 20–26
#209 Ferrbit (Steel) | Land @ Gabite’s Forge | 8% | Lv 16–22
#210 Polarm (Steel / Electric) | Land @ E Kespire Town (Outskirts) | 3% | Lv 26–34
#211 Magnetusk (Steel) | Cave/Ruins @ Gabite’s Forge | 2% | Lv 34–42
#212 Frosplet (Ice / Water) | Surf @ Whitehorn Mountains | 10% | Lv 16–22
#213 Glaciurn (Ice) | Snow (Land) @ Whitehorn Mountains | 8% | Lv 20–26
#214 Snowlark (Ice / Flying) | Snow (Land) @ Whitehorn Mountains | 6% | Lv 24–30
#215 Ramlet (Normal) | Land @ Route 2 | 9% | Lv 4–7
#216 Craggoat (Rock / Normal) | Land @ Route 4 | 5% | Lv 12–16
#217 Buzzit (Bug) | Land @ Tidepath Road | 5% | Lv 3–5
#218 Hivern (Bug / Fairy) | Land @ Pophyr Grove | 6% | Lv 14–18
#219 Apiarch (Bug / Fairy) | Land @ Pophyr Grove | 2% | Lv 26–34
#220 Bramblet (Grass / Dark) | Land @ Route 3 | 4% | Lv 8–12
#221 Thornhorn (Grass / Fighting) | Land @ Route 5 | 4% | Lv 16–20
#222 Briarwarl (Grass / Fighting) | Land @ Route 7 | 2% | Lv 28–34
#223 Slipvine (Grass / Poison) | Land @ Swoven Swamp | 12% | Lv 10–14
#224 Viperoot (Grass / Poison) | Land @ Swoven Swamp | 6% | Lv 16–22
#225 Sporeshade (Grass / Ghost) | Land @ Whisperwoods | 10% | Lv 14–18
#226 Mycelurk (Grass / Poison) | Land @ Whisperwoods | 6% | Lv 20–26
#227 Witherlit (Grass / Ghost) | Land (Night) @ Eternal Myrillfount (Ancient Ruins) | 8% | Lv 16–20
#228 Rotbloom (Grass / Ghost) | Land (Night) @ Castle Celeste | 4% | Lv 24–30
#229 Murkrow (Thalorian Form) (Poison / Dark) | Land (Night) @ Pillage Post | 6% | Lv 18–24
#230 Honchkrow (Thalorian Form) (Poison / Dark) | Land (Night) @ Whisperwoods | 2% | Lv 34–42
#231 Trapinch (Ground) | Land @ Route 6 | 10% | Lv 14–18
#232 Vibrava (Ground / Dragon) | Land @ Route 8 | 4% | Lv 28–34
#233 Flygon (Thalorian Form) (Dragon / Bug) | Land @ Route 8 | 2% | Lv 38–46
#234 Strikid (Fighting) | Land @ Route 5 | 6% | Lv 14–18
#235 Kenscour (Fighting / Steel) | Land @ Graxen City (Outskirts) | 4% | Lv 28–34
#236 Dojoroar (Fighting) | Land @ Whitehorn Mountains | 3% | Lv 32–40
#237 Rovlet (Normal) | Land @ Tidepath Road | 5% | Lv 2–5
#238 Stampedeer (Normal / Fighting) | Land @ Route 4 | 4% | Lv 20–26
#239 Tortide (Water) | Surf @ Riverbend Crossing | 10% | Lv 14–18
#240 Shellflow (Water / Rock) | Surf @ Lakespire Town (Lake) | 6% | Lv 18–24
#241 Rivarmor (Water / Rock) | Surf @ Riverbend Crossing | 3% | Lv 26–34
#242 Mindlet (Psychic) | Land @ Eternal Myrillfount (Ancient Ruins) | 10% | Lv 14–18
#243 Cerebrant (Psychic) | Land @ Lakespire Town (Lake) | 6% | Lv 20–26
#244 Sigilisk (Psychic / Dark) | Land (Night) @ Castle Celeste | 3% | Lv 28–34
#245 Hexscribe (Psychic / Ghost) | Cave/Ruins @ Castle Celeste | 2% | Lv 34–42
#246 Embril (Fire) | Land @ Route 6 | 10% | Lv 14–18
#247 Pyrecrown (Fire / Psychic) | Land @ Forlort Keep (Volcano Slopes) | 3% | Lv 32–40
#248 Bloomlet (Grass / Fairy) | Land @ Pophyr Grove | 10% | Lv 14–18
#249 Floramere (Water / Fairy) | Land @ Route 7 | 4% | Lv 26–34
#250 Tidemurk (Water / Dark) | Fishing @ Riverbend Crossing | 10% | Lv 14–18
#251 Brineshade (Water / Ghost) | Surf @ Azure Sea | 2% | Lv 28–34
#252 Salvleaf (Grass / Dragon) | Land @ Route 2 | 6% | Lv 6–10
#253 Verdantide (Grass / Flying) | Land @ Riverbend Crossing | 6% | Lv 12–16
#254 Pathling (Normal) | Land @ Route 3 | 3% | Lv 8–12
#255 Wayvern (Dragon / Flying) | Land @ Whitehorn Mountains | 2% | Lv 34–42
#256 Noxling (Dark) | Land (Night) @ Whisperwoods | 8% | Lv 16–20
#257 Dreadawn (Dark / Fairy) | Land (Night) @ Pophyr Grove | 3% | Lv 28–34
#258 Aged Gargryph (Aged Variant) (Ghost / Rock) | Cave/Ruins @ Eternal Myrillfount (Ancient Ruins) | 3% | Lv 26–34
#259 Citranth (Grass / Dragon) | Land @ Route 7 | 3% | Lv 28–34
#260 Pulsrake (Electric / Dragon) | Land @ Route 8 | 2% | Lv 38–46
#261 Lenticor (Water) | Surf @ Lakespire Town (Lake) | 8% | Lv 16–20
#262 Stillmare (Water / Psychic) | Surf @ Lakespire Town (Lake) | 4% | Lv 24–30
#263 Deepseer (Water / Psychic) | Surf @ Azure Sea | 1% | Lv 34–42
#264 Cobbolt (Rock / Ice) | Land @ Route 4 | 8% | Lv 12–16
#265 Metrowl (Steel / Flying) | Land @ Graxen City (Outskirts) | 4% | Lv 28–34
#266 Geargoyle (Steel / Rock) | Cave/Ruins @ Victory Road | 2% | Lv 38–46
#267 Carapup (Bug) | Land @ Route 2 | 6% | Lv 6–10
#268 Shellisk (Bug / Rock) | Land @ Route 4 | 3% | Lv 16–22
#269 Titanapace (Bug / Rock) | Cave/Ruins @ Gabite Cavern | 2% | Lv 34–42
#270 Charmote (Fairy) | Land @ Route 7 | 10% | Lv 14–18
#271 Wispette (Fairy / Ghost) | Land (Night) @ Whisperwoods | 6% | Lv 18–24
#272 Seerlynx (Psychic) | Land @ Route 6 | 4% | Lv 24–30
#273 Magmote (Fire) | Land @ Forlort Keep (Volcano Slopes) | 10% | Lv 24–30
#274 Basalisk (Fire / Rock) | Land @ Forlort Keep (Volcano Slopes) | 6% | Lv 28–34
#275 Lavabrawn (Fire / Fighting) | Land @ Victory Road | 2% | Lv 38–46
#276 Voltseed (Electric / Grass) | Land @ Route 6 | 10% | Lv 14–18
#277 Capacorn (Electric / Grass) | Land @ E Kespire Town (Outskirts) | 5% | Lv 22–28
#278 Dynahorn (Electric / Grass) | Land @ Route 8 | 2% | Lv 34–42
#279 Shardlet (Rock / Ice) | Land @ Route 5 | 6% | Lv 14–18
#280 Splintrum (Rock / Ice) | Land @ Route 8 | 5% | Lv 28–34
#281 Obeliskar (Rock / Steel) | Cave/Ruins @ Castle Celeste | 2% | Lv 38–46
#282 Ponderpup (Psychic) | Land @ Route 1 (Castle Celeste Approach) | 20% | Lv 12–16
#283 Thinkhound (Psychic) | Land @ Route 6 | 6% | Lv 24–30
#284 Mindmaul (Psychic / Fighting) | Land @ Victory Road | 2% | Lv 40–55
#285 Glimmergnat (Bug / Electric) | Land @ Swoven Swamp | 10% | Lv 10–14
#286 Faegnat (Bug / Fairy) | Land @ Swoven Swamp | 6% | Lv 16–22
#287 Lumenmidge (Bug / Fairy) | Land @ Whisperwoods | 3% | Lv 24–30
#288 Sapsludge (Poison) | Land @ Runeward Crossing | 10% | Lv 10–14
#289 Fumoss (Poison / Grass) | Land @ Swoven Swamp | 6% | Lv 16–22
#290 Cankerloom (Poison / Grass) | Land @ Whisperwoods | 2% | Lv 28–34
#291 Razorroe (Water / Fighting) | Fishing @ Azure Sea | 6% | Lv 20–26
#292 Cliffgarde (Rock / Fairy) | Land @ Pophyr Grove | 4% | Lv 24–30
#293 Aetherwing (Flying / Fairy) | Land @ Route 7 | 3% | Lv 28–34
#294 Ironmantle (Steel / Fighting) | Land @ Gabite’s Forge | 2% | Lv 34–42
#295 Timino (Normal / Rock) | Land @ Route 8 | 2% | Lv 40–55
#296 Brutusk (Dark / Rock) | Land (Night) @ Victory Road | 1% | Lv 45–55
#297 Justyrn (Rock / Steel) | Cave/Ruins @ Victory Road | 1% | Lv 50–55
#298 Vineward (Grass / Steel) | Land @ Route 6 | 3% | Lv 32–40
#299 Cryptusk (Ground / Ghost) | Cave/Ruins @ Gabite Cavern | 2% | Lv 38–46
#300 Stormsable (Electric / Rock) | Land @ Whitehorn Mountains | 2% | Lv 38–46
#301 Moonquill (Psychic / Flying) | Land (Night) @ Route 8 | 2% | Lv 38–46
#302 Fungalorn (Grass / Poison) | Land @ Swoven Swamp | 3% | Lv 32–40
#303 Crownmaw (Dragon / Dark) | Cave/Ruins @ Victory Road | 1% | Lv 45–55
#304 Gible (Thalorian Form) (Ice / Rock) | Snow (Land) @ Whitehorn Mountains | 6% | Lv 28–34
#305 Gabite (Thalorian Form) (Ice / Rock) | Cave/Ruins @ Gabite Cavern | 2% | Lv 34–42
#306 Garchomp (Thalorian Form) (Ice / Dragon) | Snow (Land) @ Victory Road | 1% | Lv 45–55
#307 Pytavor (Grass / Dragon) | Land @ Route 3 | 4% | Lv 8–12
#308 Fontessa (Water / Fairy) | Surf @ Azure Sea | 5% | Lv 12–16
#309 Aged Titan (Apex) (Rock / Electric) | Land @ Route 4 | 5% | Lv 10–13
#310 Moldraith (Weed-Fungus Source) (Grass / Poison) | Land @ Route 3 | 4% | Lv 8–12
#311 Aged Miregloop (Aged Variant) (Grass / Poison) | Land @ Route 3 | 4% | Lv 8–12
#312 Aged Briarovere (Aged Variant) (Grass / Poison) | Land @ Route 3 | 4% | Lv 8–12
#313 Aged Honchkrow (Thalorian) (Aged Variant) (Poison / Flying) | Land @ Swoven Swamp | 8% | Lv 16–22
#314 Aged Luxray (Aged Variant) (Electric / Fairy) | Land @ Route 2 | 6% | Lv 4–7
#315 Aged Gargryph (Aged Variant) (Rock / Ghost) | Land @ Route 4 | 5% | Lv 10–13
#316 Aqualythe (Water) | Unknown @ Whereabouts Unknown (Legendary) | — | —
#317 Floravyrn (Drained) (Grass / Ghost) | Unknown @ Whereabouts Unknown (Legendary) | — | —
#318 Vitafera (Dragon / Grass) | Unknown @ Whereabouts Unknown (Legendary) | — | —

========================================================================
END FILE: THALORIA_ENCOUNTER_RATES_ALL.txt
========================================================================

========================================================================
```

---
# APPENDIX 4 — KEY ITEMS + WHERE TO GET THEM

- **Bag / Map / ID / Pokégear / Running Shoes** — Mom (Sproutshore Town) — EVT_0002_MOM_GIVES_GEAR

- **Ward Charm** — Whisperwoods — EVT_0502_WARD_CHARM_OBTAINED

- **Relay Core** — Quarry Tunnel — EVT_0402_RELAY_PART_FOUND

- **Orb Record Fragment** — Lakespire Town Library — post VEIL_GRUNT_LIB_01

- **King Decree Page** — Saber Ruins deep chamber — post VEIL_ADMIN_RUINS_01

- **Orb (Sealed)** — Graxen City Fountain Plaza — stolen during EVT_0902_JAMES_HUMILIATED

- **Victory Road Pass** — Granted after Gym 8 badge (Forge Badge) — set F_VICTORY_ROAD_OPEN


---
# APPENDIX 5 — IMPORTANT NPC DIALOGUE (INTERACTION LIST)

- **Prof. Fraxinus** (Sproutshore Lab): starter guidance, research on Orb/Fountain.
- **Mom** (Sproutshore Town): essentials, guidance toward James/Lab.
- **James Mom** (Sproutshore Town): wake sequence.
- **Lakespire Librarian** (Library): sealed records, Veil reveal.
- **Royal Knights** (Graxen City / Fountain Depth): law, arrest/twist.


---
# FULL TRAINER INDEX (BY AREA)

## ROUTE 2 / TIDEPATH ROAD (Beginner) — Trainer Count: 3

TRAINER: Youngster Iven
Class: Youngster
Prize: 224
Intro: "My team’s fast. Yours better be faster."
Defeat: "Okay… that was a real hit."
Team:
- Budgeon Lv 6 — Adaptability
- Threadle Lv 7 — Shield Dust
------------------------------------------------------------------------
TRAINER: Lass Mina
Class: Lass
Prize: 224
Intro: "I’m practicing for the Gym in Verdant Village!"
Defeat: "I practiced… wrong."
Team:
- Chickind Lv 6 — Keen Eye
- Mossling Lv 7 — Sap Sipper
------------------------------------------------------------------------
TRAINER: Fisher Rook
Class: Fisher
Prize: 256
Intro: "Tidepath fishing is a lifestyle."
Defeat: "Guess the tide turned."
Team:
- Ripplet Lv 7 — Torrent
- Glimlot Lv 8 — Swift Swim
------------------------------------------------------------------------

## CELESTE PASS (Mid-lite) — Trainer Count: 5

TRAINER: Camper Lyle
Class: Camper
Prize: 608
Intro: "This pass is steep. So are my wins."
Defeat: "Not steep enough."
Team:
- Cragcarap Lv 18 — Swarm
- Budgeon Lv 19 — Cloud Nine
------------------------------------------------------------------------
TRAINER: Picnicker Orla
Class: Picnicker
Prize: 608
Intro: "I brought snacks. And trouble."
Defeat: "I’m out of both."
Team:
- Pipsqueak Lv 19 — Scrappy
- Mosslush Lv 19 — Overgrow
------------------------------------------------------------------------
TRAINER: Hiker Sato
Class: Hiker
Prize: 672
Intro: "Rocks don’t flinch. Neither do I."
Defeat: "I flinched."
Team:
- Cavernip Lv 20 — Sand Veil
- Pebblit Lv 19 — Rock Head
------------------------------------------------------------------------
TRAINER: Squire Halden
Class: Squire
Prize: 720
Intro: "Castle Celeste doesn’t let just anyone in."
Defeat: "Fine. You can pass."
Team:
- Pebblit Lv 18 — Sturdy
- Flintusk Lv 19 — Sturdy
------------------------------------------------------------------------
TRAINER: Scholar Venn
Class: Scholar
Prize: 720
Intro: "Knowledge is power. Let’s test it."
Defeat: "I miscalculated."
Team:
- Oracub Lv 19 — Synchronize
- Runeling Lv 20 — Magic Guard
------------------------------------------------------------------------

## VERDANT VILLAGE — GYM 1 (Bug) — Trainer Count: 4 + Leader

TRAINER: Bug Catcher Senn
Class: Bug Catcher
Prize: 416
Intro: "My bugs are tougher than they look."
Defeat: "I got caught…"
Team:
- Bristlet Lv 13 — Sturdy
- Raggle Lv 13 — Shield Dust
------------------------------------------------------------------------
TRAINER: Bug Catcher Yara
Class: Bug Catcher
Prize: 416
Intro: "Webs first, panic later."
Defeat: "I panicked."
Team:
- Threadle Lv 12 — Loomlight Trap
- Miremite Lv 13 — Overgrow
------------------------------------------------------------------------
TRAINER: Camper Jett
Class: Camper
Prize: 448
Intro: "If it crawls, I train it."
Defeat: "It crawled over me."
Team:
- Cragcarap Lv 14 — Swarm
------------------------------------------------------------------------
TRAINER: Apprentice Noll
Class: Apprentice
Prize: 480
Intro: "I won’t run this time."
Defeat: "I ran… again."
Team:
- Bristlet Lv 14 — Honey Gather
------------------------------------------------------------------------
GYM LEADER: Dax Mercer
Type: Bug
Badge: Verdant Badge
Location: Verdant Village
Intro: "You want the badge? Prove you don't flinch."
Defeat: "You didn't flinch. Take it."
Team:
- Bristlet Lv 14 — Sturdy
- Raggle Lv 15 — Shield Dust
- Mothrave Lv 16 — Loomlight Trap (Ace)
------------------------------------------------------------------------

## CASTLE CELESTE — GYM 2 (Rock) — Trainer Count: 5 + Leader

TRAINER: Hiker Ramm
Class: Hiker
Prize: 880
Intro: "Rock-types don’t need luck."
Defeat: "I ran out of rock."
Team:
- Cairnox Lv 21 — Sand Stream
------------------------------------------------------------------------
TRAINER: Lass Perri
Class: Lass
Prize: 840
Intro: "I like sturdy Pokémon. They last."
Defeat: "Mine didn’t."
Team:
- Pebbleaf Lv 21 — Sturdy
- Mosslush Lv 21 — Overgrow
------------------------------------------------------------------------
TRAINER: Ranger Edd
Class: Ranger
Prize: 912
Intro: "Castle stones remember every battle."
Defeat: "Now they remember this one."
Team:
- Gravowl Lv 21 — Weak Armor
------------------------------------------------------------------------
TRAINER: Collector Nyx
Class: Collector
Prize: 960
Intro: "Rare rocks. Rare wins."
Defeat: "Not rare enough."
Team:
- Timino Lv 22 — Sand Stream
------------------------------------------------------------------------
TRAINER: Hiker Jorn
Class: Hiker
Prize: 960
Intro: "One good hit is all it takes."
Defeat: "You landed it."
Team:
- Stoneling Lv 22 — Weak Armor
------------------------------------------------------------------------
GYM LEADER: Marla Quoin
Type: Rock
Badge: Celeste Badge
Location: Castle Celeste
Intro: "The castle stands because it endures. Show me you can, too."
Defeat: "Endurance with purpose… that's strength."
Team:
- Gravowl Lv 22 — Weak Armor
- Cairnox Lv 23 — Rock Head
- Gravern Lv 24 — Sand Force (Ace)
------------------------------------------------------------------------

## QUARRY TUNNEL (Mid) — Trainer Count: 7

TRAINER: Miner Deke
Class: Miner
Prize: 1000
Intro: "If you can dig, you can win."
Defeat: "Guess you dug deeper."
Team:
- Cavernip Lv 24 — Sand Force
- Drillersk Lv 25 — Arena Trap
------------------------------------------------------------------------
TRAINER: Worker Isha
Class: Worker
Prize: 960
Intro: "Safety first. Battle second."
Defeat: "I forgot battle."
Team:
- Ferrser Lv 25 — Light Metal
- Pebblit Lv 24 — Sturdy
------------------------------------------------------------------------
TRAINER: Hiker Marn
Class: Hiker
Prize: 1008
Intro: "Tunnels echo. So do losses."
Defeat: "Yeah…"
Team:
- Dunejack Lv 25 — Arena Trap
------------------------------------------------------------------------
TRAINER: Engineer Pell
Class: Engineer
Prize: 1056
Intro: "A working relay needs power."
Defeat: "You cut the power."
Team:
- Spritzap Lv 25 — Volt Absorb
- Glimmergnat Lv 24 — Volt Absorb
------------------------------------------------------------------------
TRAINER: Ruin Maniac Sol
Class: Ruin Maniac
Prize: 1088
Intro: "Old stone, old secrets."
Defeat: "Still secret."
Team:
- Runeling Lv 25 — Telepathy
------------------------------------------------------------------------
TRAINER: Miner Korr
Class: Miner
Prize: 1120
Intro: "This place is mine."
Defeat: "Not anymore."
Team:
- Cairnox Lv 26 — Sand Stream
------------------------------------------------------------------------
TRAINER: Foreman Bradd
Class: Foreman
Prize: 1248
Intro: "No shortcuts. Earn it."
Defeat: "I did."
Team:
- Cindermaw Lv 26 — Sturdy
------------------------------------------------------------------------

## POPHYR GROVE — GYM 3 (Electric) — Trainer Count: 6 + Leader

TRAINER: Tech Nilo
Class: Tech
Prize: 1040
Intro: "Voltage is a language."
Defeat: "You spoke louder."
Team:
- Spritzap Lv 25 — Misty Surge
------------------------------------------------------------------------
TRAINER: Juggler Cato
Class: Juggler
Prize: 1040
Intro: "Watch the sparks—then the sting."
Defeat: "Ouch."
Team:
- Glimmergnat Lv 26 — Swarm
- Neonidge Lv 26 — Motor Drive
------------------------------------------------------------------------
TRAINER: Ace Trainee Vale
Class: Ace Trainee
Prize: 1120
Intro: "Fast turns win fights."
Defeat: "You turned it around."
Team:
- Luxio Lv 26 — Static
------------------------------------------------------------------------
TRAINER: Tech Rina
Class: Tech
Prize: 1120
Intro: "Reflect, redirect, repeat."
Defeat: "I got reflected."
Team:
- Glimmerk Lv 27 — Magic Bounce
------------------------------------------------------------------------
TRAINER: Kid Ziv
Class: Kid
Prize: 832
Intro: "My Pokémon are super charged!"
Defeat: "Not charged enough."
Team:
- Spritzap Lv 26 — Volt Absorb
------------------------------------------------------------------------
TRAINER: Sparker Wren
Class: Sparker
Prize: 1184
Intro: "You can’t outrun lightning."
Defeat: "I did."
Team:
- Neonidge Lv 27 — Shield Dust
------------------------------------------------------------------------
GYM LEADER: Tessa Voltane
Type: Electric
Badge: Grove Badge
Location: Pophyr Grove
Intro: "Keep up, or get left in the dark."
Defeat: "You stayed in tempo. Badge is yours."
Team:
- Luxio Lv 26 — Static
- Luxio Lv 27 — Plus
- Neonidge Lv 27 — Motor Drive
- Glimmerk Lv 28 — Motor Drive (Ace)
------------------------------------------------------------------------

## ROUTE 7 (Mid) — Trainer Count: 6

TRAINER: Ranger Toma
Class: Ranger
Prize: 1344
Intro: "This trail bites back."
Defeat: "I got bitten."
Team:
- Mosslush Lv 28 — Grassy Surge
- Budgeon Lv 29 — Adaptability
------------------------------------------------------------------------
TRAINER: Hex Maniac Lysa
Class: Hex Maniac
Prize: 1456
Intro: "I collect whispers."
Defeat: "Now I collect losses."
Team:
- Driftkit Lv 28 — Prankster
- Shadewick Lv 29 — Prankster
------------------------------------------------------------------------
TRAINER: Camper Jett
Class: Camper
Prize: 1344
Intro: "Same route, new rematch!"
Defeat: "Still lost!"
Team:
- Threadle Lv 27 — Loomlight Trap
- Fenweevil Lv 29 — Chlorophyll
------------------------------------------------------------------------
TRAINER: Psychic Adept Nera
Class: Psychic Adept
Prize: 1568
Intro: "Focus makes the future clear."
Defeat: "Not clear enough."
Team:
- Oracub Lv 29 — Synchronize
- Puffsage Lv 29 — Psychic Surge
------------------------------------------------------------------------
TRAINER: Twins Mira & Miko
Class: Twins
Prize: 1600
Intro: "Double battle, double trouble!"
Defeat: "Double… defeat."
Team:
- Pixsprout Lv 28 — Magic Bounce
- Flickerfae Lv 28 — Misty Surge
------------------------------------------------------------------------
TRAINER: Hiker Bronn
Class: Hiker
Prize: 1632
Intro: "My boots know this path."
Defeat: "Your team does, too."
Team:
- Drillersk Lv 30 — Sturdy
------------------------------------------------------------------------

## WHISPERWOODS (Mid) — Trainer Count: 8

TRAINER: Medium Corin
Class: Medium
Prize: 1856
Intro: "Spirits follow the lost."
Defeat: "Then follow this loss."
Team:
- Driftkit Lv 30 — Pressure
- Brineshade Lv 30 — Cursed Body
------------------------------------------------------------------------
TRAINER: Lost Acolyte Fen
Class: Acolyte
Prize: 1824
Intro: "Ward charm stays with the worthy."
Defeat: "Then earn it."
Team:
- Stitchurn Lv 31 — Levitate
------------------------------------------------------------------------
TRAINER: Ranger Ceda
Class: Ranger
Prize: 1760
Intro: "Stay on the trail."
Defeat: "I should’ve."
Team:
- Thornshad Lv 31 — Intimidate
- Skylark Lv 31 — Aerilate
------------------------------------------------------------------------
TRAINER: Camper Dall
Class: Camper
Prize: 1696
Intro: "I’m not scared. I’m excited."
Defeat: "I’m scared now."
Team:
- Threadle Lv 30 — Loomlight Trap
------------------------------------------------------------------------
TRAINER: Hex Maniac Drea
Class: Hex Maniac
Prize: 1936
Intro: "Your shadow is loud."
Defeat: "Mine got silenced."
Team:
- Stitchurn Lv 31 — Levitate
------------------------------------------------------------------------
TRAINER: Psychic Rynn
Class: Psychic
Prize: 2016
Intro: "The woods distort thought."
Defeat: "Not mine."
Team:
- Runeling Lv 31 — Magic Guard
------------------------------------------------------------------------
TRAINER: Hiker Voss
Class: Hiker
Prize: 1984
Intro: "These roots trip everyone."
Defeat: "Not you."
Team:
- Mosslush Lv 32 — Overgrow
------------------------------------------------------------------------
TRAINER: Ranger Elow
Class: Ranger
Prize: 1952
Intro: "No shortcuts through the mist."
Defeat: "Okay…"
Team:
- Fenweevil Lv 32 — Chlorophyll
------------------------------------------------------------------------

## LAKESPIRE TOWN — GYM 4 (Ghost) — Trainer Count: 5 + Leader

TRAINER: Channeler Sable
Class: Channeler
Prize: 1984
Intro: "Light the candles. Face the dark."
Defeat: "The dark won."
Team:
- Driftkit Lv 31 — Prankster
- Brineshade Lv 31 — Cursed Body
------------------------------------------------------------------------
TRAINER: Hex Maniac Drea
Class: Hex Maniac
Prize: 2048
Intro: "If you blink, it moves."
Defeat: "I blinked."
Team:
- Stitchurn Lv 31 — Levitate
------------------------------------------------------------------------
TRAINER: Mystic Holt
Class: Mystic
Prize: 2112
Intro: "Shadows learn your habits."
Defeat: "Mine learned defeat."
Team:
- Shadewick Lv 32 — Solar Power
------------------------------------------------------------------------
TRAINER: Medium Rusk
Class: Medium
Prize: 2176
Intro: "The room listens."
Defeat: "Then it heard me lose."
Team:
- Brineshade Lv 32 — Damp
------------------------------------------------------------------------
TRAINER: Acolyte Fen
Class: Acolyte
Prize: 2176
Intro: "One more candle."
Defeat: "One more loss."
Team:
- Stitchurn Lv 32 — Levitate
------------------------------------------------------------------------
GYM LEADER: Rowan Ashveil
Type: Ghost
Badge: Wraith Badge
Location: Lakespire Town
Intro: "Light the path. Then walk it."
Defeat: "You walked through the dark and kept moving."
Team:
- Brineshade Lv 32 — Cursed Body
- Stitchurn Lv 32 — Levitate
- Anvilspecter Lv 33 — Spectral Rivet
- Shadewick Lv 34 — Prankster (Ace)
------------------------------------------------------------------------

## LAKESPIRE TOWN — LIBRARY (TEAM VEIL REVEAL) — Battles: 1

EVIL TEAM: Team Veil (Library)
Grunt Intro: "Those records don’t belong to you."
------------------------------------------------------------------------
TRAINER: VEIL_GRUNT_LIB_01
Class: Team Veil Grunt
Prize: 1860
Intro: "Restricted? Then we take it." 
Defeat: "We only needed one page." 
Team:
- Murkrow (Thalorian) Lv 31 — Prankster
- Skulkid Lv 31 — Intimidate
------------------------------------------------------------------------

## ROUTE 5 (Mid) — Trainer Count: 7

TRAINER: Courier Lann
Class: Courier
Prize: 2144
Intro: "Signed, sealed, delivered—battle."
Defeat: "Returned to sender."
Team:
- Budgeon Lv 33 — Adaptability
- Pipsqueak Lv 33 — Scrappy
------------------------------------------------------------------------
TRAINER: Punk Jory
Class: Punk
Prize: 2240
Intro: "Rules are suggestions."
Defeat: "So is winning."
Team:
- Spiklash Lv 34 — Prankster
- Bramblet Lv 34 — Pressure
------------------------------------------------------------------------
TRAINER: Fisher Noll
Class: Fisher
Prize: 2304
Intro: "Big catch, big win."
Defeat: "Small win, big loss."
Team:
- Fentotl Lv 34 — Moxie
- Gutterray Lv 35 — Liquid Ooze
------------------------------------------------------------------------
TRAINER: Ranger Ceda
Class: Ranger
Prize: 2336
Intro: "Eyes up. Trouble ahead."
Defeat: "Trouble was me."
Team:
- Thornshad Lv 35 — Intimidate
- Skylark Lv 35 — Aerilate
------------------------------------------------------------------------
TRAINER: Ace Trainer Bren
Class: Ace Trainer
Prize: 2520
Intro: "No gimmicks. Just skill."
Defeat: "Skill beats me."
Team:
- Luxio Lv 35 — Static
- Cairnox Lv 35 — Rock Head
------------------------------------------------------------------------
TRAINER: Breeder Sumi
Class: Breeder
Prize: 2240
Intro: "Cute Pokémon can still win."
Defeat: "Mine couldn’t."
Team:
- Pixsprout Lv 34 — Dazzling
- Mosslush Lv 35 — Overgrow
------------------------------------------------------------------------
TRAINER: Veteran Rell
Class: Veteran
Prize: 2800
Intro: "You’re getting close to real fights."
Defeat: "I felt it."
Team:
- Quakemaw Lv 36 — Rock Head
------------------------------------------------------------------------

## ROUTE 5 — TEAM VEIL HIDEOUT (Mid) — Battles: 3

TRAINER: VEIL_GRUNT_HIDEOUT_01
Class: Team Veil Grunt
Prize: 2300
Intro: "Keep walking. Or get moved." 
Defeat: "Fine. Next room." 
Team:
- Murkrow Lv 36 — Poison Touch
- Spikimp Lv 36 — Infiltrator
- Bramblet Lv 36 — Pressure
- Runeling Lv 37 — Magic Guard
- Nightgraze Lv 37 — Infiltrator
------------------------------------------------------------------------
TRAINER: VEIL_GRUNT_HIDEOUT_02
Class: Team Veil Grunt
Prize: 2400
Intro: "You don’t understand what we’re fixing." 
Defeat: "We’re not stopping." 
Team:
- Skulkid Lv 36 — Nightfeed
- Herbend Lv 36 — Corrosion
- Tidemurk Lv 37 — Pressure
- Sporegnash Lv 37 — Poison Point
- Stitchurn Lv 37 — Levitate
- Neonidge Lv 37 — Motor Drive
------------------------------------------------------------------------
TRAINER: VEIL_CAPTAIN_HIDEOUT
Class: Team Veil Captain
Prize: 3200
Intro: "You’re late. We already took what matters." 
Defeat: "You can’t stop the Director." 
Team:
- Honchkrow Lv 38 — Moxie
- Voltigar Lv 38 — Moxie
- Dreadbramble Lv 39 — Prankster
- Morbaxol Lv 39 — Pickpocket
- Sageveil Lv 39 — Synchronize
- Anvilspecter Lv 39 — Spectral Rivet
- Glimmerk Lv 39 — Magic Bounce
Items: 1× Hyper Potion
------------------------------------------------------------------------

## RIVERBEND CROSSING — GYM 5 (Dark) — Trainer Count: 6 + Leader

TRAINER: Punk Sable
Class: Punk
Prize: 2464
Intro: "Dark types don’t ask permission."
Defeat: "I should’ve asked."
Team:
- Bramblet Lv 37 — Pressure — BlackGlasses
- Spiklash Lv 37 — Prankster
------------------------------------------------------------------------
TRAINER: Roughneck Dain
Class: Roughneck
Prize: 2560
Intro: "One mistake is enough."
Defeat: "I made it."
Team:
- Brutusk Lv 38 — Prankster
------------------------------------------------------------------------
TRAINER: Ace Trainer Kio
Class: Ace Trainer
Prize: 2720
Intro: "Keep your guard up."
Defeat: "I dropped mine."
Team:
- Nightgraze Lv 38 — Nightfeed — Sitrus Berry
------------------------------------------------------------------------
TRAINER: Grunt Defector Jax
Class: Defector
Prize: 0
Intro: "I’m done with them. Let me prove it."
Defeat: "Still… not enough."
Team:
- Skulkid Lv 37 — Intimidate
- Murkrow Lv 37 — Prankster
------------------------------------------------------------------------
TRAINER: Dark Tamer Nix
Class: Dark Tamer
Prize: 2848
Intro: "Speed wins in the dark."
Defeat: "You were faster."
Team:
- Voltigar Lv 39 — Galvanize — Magnet
------------------------------------------------------------------------
TRAINER: Veteran Sorn
Class: Veteran
Prize: 3000
Intro: "This Gym doesn’t play nice."
Defeat: "Neither do you."
Team:
- Morbaxol Lv 39 — Pickpocket
------------------------------------------------------------------------
GYM LEADER: Noah “Noct” Carrow
Type: Dark
Badge: Dusk Badge
Location: Riverbend Crossing
Intro: "In the dark, you learn what you really are."
Defeat: "You didn’t blink. That’s rare."
Team:
- Luxray Lv 38 — Infiltrator — Chesto Berry
- Morbaxol Lv 39 — Pickpocket — Mystic Water
- Voltigar Lv 39 — Moxie — Magnet
- Briarovere Lv 39 — Infiltrator — Leftovers
- Dreadbramble Lv 40 — Prankster — Leftovers (Ace)
Items: 2× Hyper Potion
------------------------------------------------------------------------

## ROUTE 3 (Mid) — Trainer Count: 6

TRAINER: Hiker Mott
Class: Hiker
Prize: 3200
Intro: "You want the Forge? Earn the road."
Defeat: "Earned."
Team:
- Drillersk Lv 40 — Arena Trap
------------------------------------------------------------------------
TRAINER: Ranger Sia
Class: Ranger
Prize: 3072
Intro: "I guard this path. You’re the test."
Defeat: "I failed."
Team:
- Boulderbloom Lv 40 — Rock Head
- Seasilk Lv 40 — Effect Spore
------------------------------------------------------------------------
TRAINER: Psychic Rynn
Class: Psychic
Prize: 3360
Intro: "The mind wins fights first."
Defeat: "My mind lost."
Team:
- Runeling Lv 41 — Magic Guard
- Lanternymph Lv 41 — Psychic Surge
------------------------------------------------------------------------
TRAINER: Ace Trainer Kade
Class: Ace Trainer
Prize: 3520
Intro: "No warmups. Let’s go."
Defeat: "I got warmed up."
Team:
- Luxio Lv 40 — Motor Drive
- Devastan Lv 41 — Rock Head
------------------------------------------------------------------------
TRAINER: Fisher Voss
Class: Fisher
Prize: 3200
Intro: "Current’s strong here."
Defeat: "So are you."
Team:
- Currentide Lv 41 — Water Absorb
------------------------------------------------------------------------
TRAINER: Veteran Rook
Class: Veteran
Prize: 3840
Intro: "This is where teams break."
Defeat: "Not yours."
Team:
- Stormcorv Lv 42 — Intimidate
------------------------------------------------------------------------

## ROUTE 4 (Mid) — Trainer Count: 7

TRAINER: Blackbelt Surn
Class: Blackbelt
Prize: 3584
Intro: "Hands up. Battle time."
Defeat: "Hands down."
Team:
- Brawlisk Lv 42 — Intimidate
------------------------------------------------------------------------
TRAINER: Hiker Pell
Class: Hiker
Prize: 3520
Intro: "Rock and water. Both crush."
Defeat: "I got crushed."
Team:
- Quakemaw Lv 42 — Water Absorb
------------------------------------------------------------------------
TRAINER: Ranger Noma
Class: Ranger
Prize: 3488
Intro: "Wind cuts clean."
Defeat: "You cut cleaner."
Team:
- Galecrest Lv 42 — Wind Rider
------------------------------------------------------------------------
TRAINER: Psychic Vale
Class: Psychic
Prize: 3744
Intro: "I see your next move."
Defeat: "You ignored it."
Team:
- Augurusk Lv 43 — Sand Stream
------------------------------------------------------------------------
TRAINER: Ace Trainer Della
Class: Ace Trainer
Prize: 4000
Intro: "I train for the League."
Defeat: "Me too."
Team:
- Glimmerk Lv 43 — Magic Bounce
- Floramere Lv 43 — Healer
------------------------------------------------------------------------
TRAINER: Tamer Rhys
Class: Tamer
Prize: 3904
Intro: "If it bites, I train it."
Defeat: "It bit me."
Team:
- Brutusk Lv 43 — Solid Rock
------------------------------------------------------------------------
TRAINER: Veteran Honn
Class: Veteran
Prize: 4200
Intro: "Last warning before the Cavern."
Defeat: "I’m ready."
Team:
- Neonidge Lv 44 — Motor Drive
------------------------------------------------------------------------

## GABITE'S CAVERN (Mid→Late) — Trainer Count: 8

TRAINER: Miner Krail
Class: Miner
Prize: 4288
Intro: "The Cavern keeps what it takes."
Defeat: "Not today."
Team:
- Stoneling Lv 44 — Mirror Armor
------------------------------------------------------------------------
TRAINER: Hiker Odo
Class: Hiker
Prize: 4224
Intro: "You can’t brute-force stone."
Defeat: "I did."
Team:
- Bastionite Lv 45 — Clear Body
------------------------------------------------------------------------
TRAINER: Ranger Fenn
Class: Ranger
Prize: 4160
Intro: "Water veins run under this place."
Defeat: "Then I’ll follow them."
Team:
- Pondrake Lv 45 — Water Absorb
------------------------------------------------------------------------
TRAINER: Ace Trainer Sera
Class: Ace Trainer
Prize: 4480
Intro: "No pity. No pause."
Defeat: "No win."
Team:
- Drakeshard Lv 46 — Drakeshard Aegis
------------------------------------------------------------------------
TRAINER: Psychic Lune
Class: Psychic
Prize: 4704
Intro: "Deep places distort resolve."
Defeat: "Mine held."
Team:
- Sageveil Lv 46 — Grassy Surge
------------------------------------------------------------------------
TRAINER: Veteran Cato
Class: Veteran
Prize: 5040
Intro: "Metal and heat. That’s the Forge way."
Defeat: "I felt it."
Team:
- Cauterforge Lv 46 — Forgebrand
------------------------------------------------------------------------
TRAINER: Tamer Bronn
Class: Tamer
Prize: 4704
Intro: "Storms happen underground too."
Defeat: "Then I’m the storm."
Team:
- Stormcorv Lv 47 — Wind Rider
------------------------------------------------------------------------
TRAINER: Gate Warden Dorr
Class: Gate Warden
Prize: 5600
Intro: "One more step and you’re done."
Defeat: "Not done."
Team:
- Monolithorn Lv 47 — Sand Stream
Items: 1× Hyper Potion
------------------------------------------------------------------------

## ROUTE 6 (Mid) — Trainer Count: 7

TRAINER: Swamp Ranger Ysolde
Class: Ranger
Prize: 3744
Intro: "Swamp paths don’t forgive."
Defeat: "Neither do I."
Team:
- Puddlepup Lv 44 — Rain Dish
- Mudmutt Lv 45 — Anger Point
------------------------------------------------------------------------
TRAINER: Hex Maniac Pira
Class: Hex Maniac
Prize: 4032
Intro: "Fog hides the best curses."
Defeat: "Not yours."
Team:
- Driftkit Lv 45 — Prankster
------------------------------------------------------------------------
TRAINER: Breeder Melli
Class: Breeder
Prize: 3904
Intro: "Fairy-types love attention."
Defeat: "Mine loved winning."
Team:
- Flickerfae Lv 44 — Magic Bounce
- Nectip Lv 45 — Pixilate
------------------------------------------------------------------------
TRAINER: Ace Trainer Daxen
Class: Ace Trainer
Prize: 4480
Intro: "Route 6 is a filter."
Defeat: "I passed."
Team:
- Glimmerk Lv 46 — Motor Drive
- Reefwisp Lv 46 — Reef Covenant
------------------------------------------------------------------------
TRAINER: Fisher Hobb
Class: Fisher
Prize: 4160
Intro: "Swamp fish fight dirty."
Defeat: "So do I."
Team:
- Brineel Lv 46 — Rain Dish
------------------------------------------------------------------------
TRAINER: Ranger Nori
Class: Ranger
Prize: 4256
Intro: "You’ll get lost if you rush."
Defeat: "I didn’t."
Team:
- Thornshad Lv 46 — Intimidate
------------------------------------------------------------------------
TRAINER: Swamp Veteran Krae
Class: Veteran
Prize: 5200
Intro: "You’re close to Graxen trouble."
Defeat: "I know."
Team:
- Sporegnash Lv 47 — Poison Point
------------------------------------------------------------------------

## ELKSPIRE TOWN — GYM 6 (Fairy) — Trainer Count: 7 + Leader

TRAINER: Acolyte Lira
Class: Acolyte
Prize: 3520
Intro: "Light wins in dark places."
Defeat: "Light lost."
Team:
- Pixsprout Lv 43 — Dazzling — Sitrus Berry
------------------------------------------------------------------------
TRAINER: Mystic Doin
Class: Mystic
Prize: 3584
Intro: "Fairy tricks aren’t tricks. They’re rules."
Defeat: "Rules broke."
Team:
- Lanternymph Lv 44 — Magic Bounce
------------------------------------------------------------------------
TRAINER: Tamer Suri
Class: Tamer
Prize: 3648
Intro: "Healing wins long fights."
Defeat: "Not long enough."
Team:
- Floramere Lv 44 — Healer
------------------------------------------------------------------------
TRAINER: Fairy Tale Duo
Class: Duo
Prize: 3840
Intro: "Two voices, one spell."
Defeat: "Spell failed."
Team:
- Reeflet Lv 44 — Solid Rock
- Glintoad Lv 44 — Pixilate
------------------------------------------------------------------------
TRAINER: Ranger Elow
Class: Ranger
Prize: 3776
Intro: "Swamp lights lie."
Defeat: "Not mine."
Team:
- Glowmoss Lv 45 — Healer
------------------------------------------------------------------------
TRAINER: Adept Rhea
Class: Adept
Prize: 3904
Intro: "I’ll move first. Always."
Defeat: "Not always."
Team:
- Illumoria Lv 45 — Prankster — Wise Glasses
------------------------------------------------------------------------
TRAINER: Veteran Seris
Class: Veteran
Prize: 4200
Intro: "Leader won’t open until the swamp stops taking people."
Defeat: "Then help."
Team:
- Lullivy Lv 45 — Dazzling
------------------------------------------------------------------------
GYM LEADER: Seraphine Lumen
Type: Fairy
Badge: Bloom Badge
Location: Elkspire Town
Intro: "Bring them home. Then we battle."
Defeat: "Your heart stayed steady. Take the badge."
Team:
- Prismalia Lv 44 — Prism Relay — Magnet
- Floramere Lv 45 — Healer — Sitrus Berry
- Reefwisp Lv 45 — Reef Covenant — Mystic Water
- Lullivy Lv 45 — Dazzling — Leftovers
- Nectarune Lv 45 — Misty Surge
- Illumoria Lv 46 — Prankster — Wise Glasses (Ace)
Items: 2× Hyper Potion
------------------------------------------------------------------------

## LAKE WILLOW (Mid) — Trainer Count: 6

TRAINER: Fisher Marn
Class: Fisher
Prize: 4128
Intro: "Lake Willow feeds Graxen."
Defeat: "Then I’ll pass through."
Team:
- Skerrfin Lv 47 — Hydration
- Gutterray Lv 48 — Liquid Ooze
------------------------------------------------------------------------
TRAINER: Ranger Rila
Class: Ranger
Prize: 4256
Intro: "The lake keeps old stories."
Defeat: "I’ll write a new one."
Team:
- Coralmason Lv 48 — Reef Covenant
------------------------------------------------------------------------
TRAINER: Psychic Senn
Class: Psychic
Prize: 4704
Intro: "Pressure makes minds crack."
Defeat: "Mine didn’t."
Team:
- Runeling Lv 48 — Magic Guard
- Augurusk Lv 49 — Sand Stream
------------------------------------------------------------------------
TRAINER: Veteran Vail
Class: Veteran
Prize: 5400
Intro: "Status wins fights here."
Defeat: "Not today."
Team:
- Spiklash Lv 49 — Lightning Rod
------------------------------------------------------------------------
TRAINER: Hex Maniac Yori
Class: Hex Maniac
Prize: 4800
Intro: "This water remembers names."
Defeat: "Remember mine."
Team:
- Shadewick Lv 49 — Prankster
------------------------------------------------------------------------
TRAINER: Ace Trainer Pex
Class: Ace Trainer
Prize: 5200
Intro: "Graxen is ahead. Don’t go soft."
Defeat: "I won’t."
Team:
- Aeroracle Lv 50 — Cloud Nine
------------------------------------------------------------------------

## GRAXEN CITY — TEAM VEIL PRESENCE (Late) — Battles: 2

TRAINER: VEIL_GRAXEN_GRUNT_01
Class: Team Veil Grunt
Prize: 4200
Intro: "Stay out of the plaza." 
Defeat: "You’re too late." 
Team:
- Runeling Lv 49 — Magic Guard
- Sageveil Lv 49 — Synchronize
- Morbaxol Lv 49 — Rain Dish
- Voltigar Lv 50 — Moxie
- Honchkrow Lv 50 — Corrosion
- Anvilspecter Lv 50 — Spectral Rivet
- Glimmerk Lv 50 — Magic Bounce
Items: 1× Hyper Potion
------------------------------------------------------------------------
TRAINER: VEIL_GRAXEN_ENFORCER_01
Class: Team Veil Enforcer
Prize: 5200
Intro: "We don’t negotiate." 
Defeat: "The Director already has the Orb." 
Team:
- Augurusk Lv 50 — Sand Stream
- Dreadbramble Lv 50 — Prankster
- Briarovere Lv 50 — Infiltrator
- Stormcorv Lv 50 — Intimidate
- Sporegnash Lv 51 — Poison Point
- Sageveil Lv 51 — Grassy Surge
- Voltigar Lv 51 — Pressure
- Anvilspecter Lv 51 — Spectral Rivet
- Morbaxol Lv 51 — Pickpocket
Items: 2× Hyper Potion
------------------------------------------------------------------------

## GRAXEN CITY — GYM 7 (Psychic) — Trainer Count: 8 + Leader

TRAINER: Psychic Adept Venn
Class: Psychic
Prize: 4608
Intro: "The mind is the first arena."
Defeat: "Mine lost."
Team:
- Oracub Lv 48 — Telepathy
- Runeling Lv 49 — Magic Guard
------------------------------------------------------------------------
TRAINER: Sage Acolyte Nia
Class: Acolyte
Prize: 4480
Intro: "You’ll lose your focus."
Defeat: "I did."
Team:
- Puffsage Lv 49 — Psychic Surge
------------------------------------------------------------------------
TRAINER: Psychic Rook
Class: Psychic
Prize: 4704
Intro: "See it. Decide it. Do it."
Defeat: "I couldn’t."
Team:
- Lanternymph Lv 49 — Psychic Surge
------------------------------------------------------------------------
TRAINER: Analyst Jex
Class: Analyst
Prize: 4864
Intro: "Your patterns are obvious."
Defeat: "Not obvious enough."
Team:
- Augurusk Lv 50 — Inner Focus
------------------------------------------------------------------------
TRAINER: Mystic Kora
Class: Mystic
Prize: 4960
Intro: "Your aura is loud."
Defeat: "Then hear it."
Team:
- Aeroracle Lv 50 — Psychic Surge
------------------------------------------------------------------------
TRAINER: Adept Yul
Class: Adept
Prize: 5000
Intro: "One turn is all it takes."
Defeat: "It took more."
Team:
- Sageveil Lv 50 — Synchronize
------------------------------------------------------------------------
TRAINER: Veteran Seln
Class: Veteran
Prize: 5600
Intro: "Graxen doesn't forgive errors."
Defeat: "I made one."
Team:
- Runeling Lv 51 — Magic Guard
------------------------------------------------------------------------
TRAINER: Final Gatekeeper
Class: Gatekeeper
Prize: 0
Intro: "Leader won’t see you without proof."
Defeat: "Proof given."
Team:
- Sageveil Lv 51 — Grassy Surge — Sitrus Berry
------------------------------------------------------------------------
GYM LEADER: Sel Wynn
Type: Psychic
Badge: Crest Badge
Location: Graxen City
Intro: "Control yourself, or the Fountain will control you."
Defeat: "You kept control when it mattered."
Team:
- Augurusk Lv 50 — Sand Stream — TwistedSpoon
- Aeroracle Lv 50 — Cloud Nine — Wise Glasses
- Runeling Lv 51 — Magic Guard
- Sageveil Lv 51 — Synchronize — Sitrus Berry
- Mothrave Lv 51 — Tinted Lens — Leftovers
- Sageveil Lv 52 — Grassy Surge — Miracle Seed (Ace)
Items: 2× Hyper Potion
------------------------------------------------------------------------

## SABER RUINS (Ancient Ruins) (End) — Trainer Count: 8 + Veil Admin

TRAINER: Ruin Maniac Sol
Class: Ruin Maniac
Prize: 5200
Intro: "These stones are older than fear."
Defeat: "Still scared."
Team:
- Runeling Lv 52 — Magic Guard
- Augurusk Lv 52 — Sand Stream
------------------------------------------------------------------------
TRAINER: Hex Maniac Vei
Class: Hex Maniac
Prize: 5376
Intro: "Ruins have hungry shadows."
Defeat: "Mine got fed."
Team:
- Stitchurn Lv 52 — Levitate
- Shadewick Lv 53 — Prankster
------------------------------------------------------------------------
TRAINER: Ranger Keln
Class: Ranger
Prize: 5408
Intro: "Don’t touch the carvings."
Defeat: "I touched victory."
Team:
- Gargryph Lv 53 — Sturdy
------------------------------------------------------------------------
TRAINER: Veteran Bryn
Class: Veteran
Prize: 6120
Intro: "Iron spirits haunt this place."
Defeat: "They haunt me."
Team:
- Forgehaunt Lv 53 — Mirror Armor
------------------------------------------------------------------------
TRAINER: Psychic Acolyte Rin
Class: Acolyte
Prize: 5600
Intro: "The Orb has a voice."
Defeat: "I heard it."
Team:
- Sageveil Lv 53 — Synchronize
------------------------------------------------------------------------
TRAINER: Tamer Sorn
Class: Tamer
Prize: 5760
Intro: "If it’s dangerous, I want it."
Defeat: "I got it."
Team:
- Honchkrow Lv 53 — Moxie
------------------------------------------------------------------------
TRAINER: Explorer Jax
Class: Explorer
Prize: 5904
Intro: "One relic changes everything."
Defeat: "Not today."
Team:
- Monolithorn Lv 54 — Sand Stream
------------------------------------------------------------------------
TRAINER: Old Knight Remnant
Class: Knight
Prize: 6400
Intro: "The King’s decree stands."
Defeat: "Not anymore."
Team:
- Bastionite Lv 54 — Clear Body
------------------------------------------------------------------------
TRAINER: VEIL_ADMIN_RUINS_01
Class: Team Veil Admin
Prize: 9000
Intro: "You’re standing in the wrong century." 
Defeat: "Then learn what we learned." 
Team:
- Honchkrow Lv 55 — Moxie
- Dreadbramble Lv 55 — Prankster
- Morbaxol Lv 55 — Rain Dish
- Voltigar Lv 55 — Moxie
- Augurusk Lv 55 — Sand Stream
- Sageveil Lv 55 — Grassy Surge
- Forgehaunt Lv 55 — Mirror Armor
- Glimmerk Lv 55 — Magic Bounce
- Briarovere Lv 55 — Infiltrator
- Stormcorv Lv 55 — Intimidate
- Sporegnash Lv 55 — Poison Point
Items: 3× Hyper Potion
------------------------------------------------------------------------

## HEARMIST ISLAND (End) — Trainer Count: 7

TRAINER: Ranger Kael
Class: Ranger
Prize: 6400
Intro: "Jungle rules are simple: survive."
Defeat: "I didn’t."
Team:
- Seasilk Lv 55 — Effect Spore
- Boulderbloom Lv 55 — Solid Rock
------------------------------------------------------------------------
TRAINER: Ace Trainer Myra
Class: Ace Trainer
Prize: 7200
Intro: "You’re not the only one hunting legends."
Defeat: "I’m done hunting."
Team:
- Aeroracle Lv 56 — Psychic Surge
- Galecrest Lv 56 — Gale Wings
------------------------------------------------------------------------
TRAINER: Hex Maniac Rell
Class: Hex Maniac
Prize: 6912
Intro: "The maze watches you."
Defeat: "Then watch this."
Team:
- Shadewick Lv 56 — Prankster
------------------------------------------------------------------------
TRAINER: Veteran Sato
Class: Veteran
Prize: 7800
Intro: "Dragon marks are everywhere."
Defeat: "I missed them."
Team:
- Drakeshard Lv 56 — Tough Claws
------------------------------------------------------------------------
TRAINER: Psychic Niva
Class: Psychic
Prize: 7488
Intro: "Your intent is loud."
Defeat: "So is yours."
Team:
- Sageveil Lv 56 — Synchronize
------------------------------------------------------------------------
TRAINER: Jungle Tamer Bronn
Class: Tamer
Prize: 7200
Intro: "If it roars, I answer."
Defeat: "It answered me."
Team:
- Honchkrow Lv 57 — Moxie
------------------------------------------------------------------------
TRAINER: Maze Gatekeeper
Class: Gatekeeper
Prize: 8400
Intro: "Turn back or get lost."
Defeat: "I won’t."
Team:
- Gargryph Lv 57 — Gale Wings
- Forgehaunt Lv 57 — Mirror Armor
Items: 1× Hyper Potion
------------------------------------------------------------------------

## FOUNTAIN DEPTH APPROACH (End) — Trainer Count: 8

TRAINER: Royal Knight Remnant
Class: Knight
Prize: 8200
Intro: "The Fountain is sealed by law."
Defeat: "Law broke."
Team:
- Monolithorn Lv 58 — Sand Stream
- Bastionite Lv 58 — Clear Body
------------------------------------------------------------------------
TRAINER: Veil Zealot 1
Class: Zealot
Prize: 8400
Intro: "Pain teaches. We teach pain."
Defeat: "Lesson failed."
Team:
- Dreadbramble Lv 58 — Prankster
- Forgehaunt Lv 58 — Mirror Armor
- Voltigar Lv 58 — Pressure
Items: 1× Hyper Potion
------------------------------------------------------------------------
TRAINER: Veil Zealot 2
Class: Zealot
Prize: 8400
Intro: "You’re too late to save anything."
Defeat: "Try me."
Team:
- Honchkrow Lv 58 — Moxie
- Sporegnash Lv 59 — Poison Point
Items: 1× Hyper Potion
------------------------------------------------------------------------
TRAINER: Depth Tactician
Class: Veteran
Prize: 9000
Intro: "Every turn matters now."
Defeat: "I wasted mine."
Team:
- Glimmerk Lv 59 — Magic Bounce
- Stormcorv Lv 59 — Intimidate
------------------------------------------------------------------------
TRAINER: Depth Acolyte
Class: Acolyte
Prize: 8800
Intro: "The Orb isn’t yours."
Defeat: "It will be."
Team:
- Sageveil Lv 59 — Grassy Surge
------------------------------------------------------------------------
TRAINER: Knight Commander Remnant
Class: Commander
Prize: 9800
Intro: "Stand down."
Defeat: "No."
Team:
- Gargryph Lv 60 — Sturdy
------------------------------------------------------------------------
TRAINER: Veil Vanguard
Class: Vanguard
Prize: 9800
Intro: "Director’s will is absolute."
Defeat: "Not to me."
Team:
- Briarovere Lv 60 — Infiltrator
- Morbaxol Lv 60 — Pickpocket
------------------------------------------------------------------------
TRAINER: Depth Gatekeeper
Class: Gatekeeper
Prize: 11000
Intro: "Last step before the core."
Defeat: "Then I’m there."
Team:
- Augurusk Lv 60 — Sand Stream
- Anvilspecter Lv 60 — Spectral Rivet
Items: 1× Hyper Potion
------------------------------------------------------------------------

## GABITE'S FORGE — GYM 8 (Steel) — Trainer Count: 7 + Leader

TRAINER: Smith Adept Korr
Class: Adept
Prize: 6400
Intro: "Steel remembers pressure."
Defeat: "So do I."
Team:
- Ferrser Lv 55 — Light Metal
------------------------------------------------------------------------
TRAINER: Welder Nia
Class: Worker
Prize: 6400
Intro: "Heat makes the strongest metal."
Defeat: "Heat broke me."
Team:
- Cauterforge Lv 56 — Forgebrand
------------------------------------------------------------------------
TRAINER: Machinist Pell
Class: Tech
Prize: 6560
Intro: "Precision wins wars."
Defeat: "I lost the war."
Team:
- Anvilspecter Lv 56 — Spectral Rivet
------------------------------------------------------------------------
TRAINER: Knight Artificer
Class: Knight
Prize: 6800
Intro: "Armor doesn’t crack."
Defeat: "Mine did."
Team:
- Bastionite Lv 56 — Clear Body
------------------------------------------------------------------------
TRAINER: Foreman Bradd
Class: Foreman
Prize: 7000
Intro: "One more test before Viktor."
Defeat: "Test passed."
Team:
- Monolithorn Lv 57 — Sand Stream
------------------------------------------------------------------------
TRAINER: Steel Veteran Sorn
Class: Veteran
Prize: 7600
Intro: "No soft hits here."
Defeat: "I got hit hard."
Team:
- Forgehaunt Lv 57 — Mirror Armor
------------------------------------------------------------------------
TRAINER: Foundry Guard Halden
Class: Guard
Prize: 7600
Intro: "Only the best face the leader."
Defeat: "Then it’s me."
Team:
- Ferrser Lv 57 — Light Metal
- Cauterforge Lv 57 — Forgebrand
------------------------------------------------------------------------
GYM LEADER: Viktor Ironwright
Type: Steel
Badge: Forge Badge
Location: Gabite's Forge
Intro: "Steel is discipline. Show me yours."
Defeat: "Good. You’re ready for the League."
Team:
- Ferrser Lv 56 — Light Metal
- Bastionite Lv 56 — Clear Body
- Monolithorn Lv 57 — Sand Stream
- Armaroust Lv 57 — Battle Hardened
- Cauterforge Lv 57 — Forgebrand
- Forgehaunt Lv 58 — Mirror Armor (Ace)
Items: 2× Hyper Potion
------------------------------------------------------------------------

## VICTORY ROAD (End) — Trainer Count: 8

TRAINER: Ace Trainer Vale
Class: Ace Trainer
Prize: 9000
Intro: "No one coasts into the League."
Defeat: "I didn’t."
Team:
- Aeroracle Lv 60 — Psychic Surge
- Stormcorv Lv 60 — Intimidate
------------------------------------------------------------------------
TRAINER: Veteran Rell
Class: Veteran
Prize: 9800
Intro: "One last climb."
Defeat: "I slipped."
Team:
- Gargryph Lv 61 — Sturdy
------------------------------------------------------------------------
TRAINER: Hiker Jorn
Class: Hiker
Prize: 8600
Intro: "Victory Road is stone and sweat."
Defeat: "I’m out of both."
Team:
- Gravern Lv 61 — Sand Force
------------------------------------------------------------------------
TRAINER: Psychic Adept Nera
Class: Psychic
Prize: 9400
Intro: "Your focus will crack here."
Defeat: "It won’t."
Team:
- Sageveil Lv 61 — Synchronize
- Runeling Lv 61 — Magic Guard
------------------------------------------------------------------------
TRAINER: Ranger Ceda
Class: Ranger
Prize: 9200
Intro: "Wilds here don’t forgive mistakes."
Defeat: "Neither do trainers."
Team:
- Galecrest Lv 62 — Wind Rider
------------------------------------------------------------------------
TRAINER: Blackbelt Surn
Class: Blackbelt
Prize: 9200
Intro: "Prove your strength."
Defeat: "Proved."
Team:
- Brawlisk Lv 62 — Intimidate
------------------------------------------------------------------------
TRAINER: Hex Maniac Lysa
Class: Hex Maniac
Prize: 9600
Intro: "Spirits crowd this road."
Defeat: "They crowded me."
Team:
- Shadewick Lv 62 — Prankster
- Forgehaunt Lv 62 — Mirror Armor
------------------------------------------------------------------------
TRAINER: Victory Gatekeeper
Class: Gatekeeper
Prize: 12000
Intro: "Only champions pass me."
Defeat: "I will."
Team:
- Justyrn Lv 63 — Pressure
Items: 1× Hyper Potion
------------------------------------------------------------------------

---
# ADDITIONAL OPTIONAL AREAS — FULL TRAINER ROSTERS

## INDIGO FIELDS (Early/Mid Optional) — Trainer Count: 4

TRAINER: Farmer Juno
Class: Farmer
Prize: 560
Intro: "My fields grow strong Pokémon."
Defeat: "Stronger than my crops."
Team:
- Mossling Lv 12 — Sap Sipper
- Budgeon Lv 13 — Adaptability
------------------------------------------------------------------------

TRAINER: Schoolkid Tavi
Class: Schoolkid
Prize: 520
Intro: "I learned type matchups!"
Defeat: "I learned pain."
Team:
- Threadle Lv 12 — Shield Dust
- Chickind Lv 13 — Keen Eye
------------------------------------------------------------------------

TRAINER: Ranger Elin
Class: Ranger
Prize: 704
Intro: "Stay out of the tall grass if you're not ready."
Defeat: "I was ready."
Team:
- Raggle Lv 14 — Shield Dust
- Cragcarap Lv 14 — Swarm
------------------------------------------------------------------------

TRAINER: Ace Trainee Nix
Class: Ace Trainee
Prize: 896
Intro: "Optional route, real trainer."
Defeat: "Real loss."
Team:
- Runeling Lv 15 — Magic Guard
- Ripplet Lv 15 — Torrent
------------------------------------------------------------------------

## PILLAGE POST (Mid Optional Port) — Trainer Count: 4

TRAINER: Sailor Kade
Class: Sailor
Prize: 1728
Intro: "Port battles are quick and dirty."
Defeat: "So was that win."
Team:
- Currentide Lv 27 — Water Absorb
- Gutterray Lv 27 — Liquid Ooze
------------------------------------------------------------------------

TRAINER: Dockworker Sorn
Class: Dockworker
Prize: 1760
Intro: "Heavy loads, heavy hits."
Defeat: "I dropped it."
Team:
- Ferrser Lv 28 — Light Metal
------------------------------------------------------------------------

TRAINER: Punk Rill
Class: Punk
Prize: 1888
Intro: "Tourists get taxed."
Defeat: "I didn’t pay."
Team:
- Spiklash Lv 29 — Prankster
- Skulkid Lv 29 — Intimidate
------------------------------------------------------------------------

TRAINER: Captain Orla
Class: Captain
Prize: 2400
Intro: "Respect the sea."
Defeat: "I do."
Team:
- Brineel Lv 30 — Rain Dish
- Stormcorv Lv 30 — Intimidate
------------------------------------------------------------------------

## AZURE SEA (Surf Route) — Trainer Count: 5

TRAINER: Swimmer Mina
Class: Swimmer
Prize: 2200
Intro: "Waves make fighters."
Defeat: "I got washed."
Team:
- Skerrfin Lv 34 — Hydration
------------------------------------------------------------------------

TRAINER: Swimmer Jett
Class: Swimmer
Prize: 2200
Intro: "My team is built for currents."
Defeat: "Mine isn’t."
Team:
- Currentide Lv 35 — Water Absorb
------------------------------------------------------------------------

TRAINER: Fisher Rook
Class: Fisher
Prize: 2400
Intro: "Deep water, deep strategy."
Defeat: "You went deeper."
Team:
- Gutterray Lv 35 — Liquid Ooze
- Fentotl Lv 35 — Moxie
------------------------------------------------------------------------

TRAINER: Sailor Halden
Class: Sailor
Prize: 2600
Intro: "Rough seas, rough battles."
Defeat: "You were rougher."
Team:
- Stormcorv Lv 36 — Wind Rider
------------------------------------------------------------------------

TRAINER: Ace Swimmer Vale
Class: Ace Trainer
Prize: 3200
Intro: "No land. No cover. Pure skill."
Defeat: "Pure loss."
Team:
- Aeroracle Lv 37 — Cloud Nine
------------------------------------------------------------------------

## CRESENT CAVENS (Mid/Late Optional Cave) — Trainer Count: 6

TRAINER: Ruin Maniac Perri
Class: Ruin Maniac
Prize: 4800
Intro: "Caves hide the best relics."
Defeat: "And the worst losses."
Team:
- Stoneling Lv 49 — Weak Armor
------------------------------------------------------------------------

TRAINER: Hiker Bradd
Class: Hiker
Prize: 4700
Intro: "This cave chews boots."
Defeat: "It chewed me."
Team:
- Gravern Lv 50 — Sand Force
------------------------------------------------------------------------

TRAINER: Miner Isha
Class: Miner
Prize: 4900
Intro: "Don’t touch the glowing rock."
Defeat: "Too late."
Team:
- Glimmerk Lv 50 — Magic Bounce
------------------------------------------------------------------------

TRAINER: Psychic Lune
Class: Psychic
Prize: 5200
Intro: "Dark places sharpen focus."
Defeat: "Then I’m sharp."
Team:
- Runeling Lv 51 — Magic Guard
------------------------------------------------------------------------

TRAINER: Veteran Korr
Class: Veteran
Prize: 6000
Intro: "Optional doesn’t mean easy."
Defeat: "I noticed."
Team:
- Forgehaunt Lv 52 — Mirror Armor
------------------------------------------------------------------------

TRAINER: Caven Boss Remnant
Class: Boss
Prize: 7000
Intro: "Only the worthy leave with answers."
Defeat: "Then I leave."
Team:
- Monolithorn Lv 52 — Sand Stream
- Anvilspecter Lv 52 — Spectral Rivet
Items: 1× Hyper Potion
------------------------------------------------------------------------

## ROUTE 8 (Late Connector) — Trainer Count: 6

TRAINER: Ace Trainer Sera
Class: Ace Trainer
Prize: 7000
Intro: "Your badge set looks real."
Defeat: "It is."
Team:
- Luxray Lv 56 — Infiltrator
------------------------------------------------------------------------

TRAINER: Ranger Noma
Class: Ranger
Prize: 6800
Intro: "This route feeds Victory Road."
Defeat: "Then I’m headed there."
Team:
- Galecrest Lv 56 — Wind Rider
------------------------------------------------------------------------

TRAINER: Hiker Odo
Class: Hiker
Prize: 6600
Intro: "Stone steps don’t forgive slips."
Defeat: "I won’t slip."
Team:
- Gargryph Lv 56 — Sturdy
------------------------------------------------------------------------

TRAINER: Psychic Adept Venn
Class: Psychic
Prize: 7200
Intro: "I’ll stop you with one clean thought."
Defeat: "Not clean enough."
Team:
- Sageveil Lv 57 — Synchronize
------------------------------------------------------------------------

TRAINER: Hex Maniac Drea
Class: Hex Maniac
Prize: 7400
Intro: "Late-game ghosts hit harder."
Defeat: "So do you."
Team:
- Shadewick Lv 57 — Prankster
------------------------------------------------------------------------

TRAINER: Veteran Gatewatch
Class: Veteran
Prize: 9000
Intro: "This is your last warm-up."
Defeat: "Then I’m done warming up."
Team:
- Garchomp (Thalorian Form) Lv 58 — Frozen Forge
Items: 1× Hyper Potion
------------------------------------------------------------------------

## WHITEHORN MOUNTAINS (Late/Post Hook) — Trainer Count: 6

TRAINER: Skier Lira
Class: Skier
Prize: 7600
Intro: "Ice punishes impatience."
Defeat: "I was impatient."
Team:
- Pondrake Lv 58 — Water Absorb
------------------------------------------------------------------------

TRAINER: Hiker Jorn
Class: Hiker
Prize: 7400
Intro: "Thin air, thick battles."
Defeat: "I choked."
Team:
- Augurusk Lv 58 — Sand Stream
------------------------------------------------------------------------

TRAINER: Ranger Elow
Class: Ranger
Prize: 7600
Intro: "Tracks tell the truth."
Defeat: "Truth is, you won."
Team:
- Stormcorv Lv 59 — Intimidate
------------------------------------------------------------------------

TRAINER: Mystic Sable
Class: Mystic
Prize: 7800
Intro: "The mountain amplifies spirits."
Defeat: "It amplified my loss."
Team:
- Stitchurn Lv 59 — Levitate
------------------------------------------------------------------------

TRAINER: Ace Trainer Kaine
Class: Ace Trainer
Prize: 8600
Intro: "Ice and steel both demand precision."
Defeat: "I wasn’t precise."
Team:
- Forgehaunt Lv 60 — Mirror Armor
- Cauterforge Lv 60 — Forgebrand
------------------------------------------------------------------------

TRAINER: Whitehorn Sentinel
Class: Boss
Prize: 12000
Intro: "No one takes the summit for free."
Defeat: "Then I pay in wins."
Team:
- Justyrn Lv 62 — Pressure
- Fontessa Lv 62 — Moonlit Undertow
Items: 1× Full Restore
------------------------------------------------------------------------

---
# BOSS + LEGENDARY BATTLES (ALL)

## LEGENDARY: PYTAVOR (Hearmist Island)
- Trigger: EVT_1103_PYTAVOR_ENCOUNTER
- Battle Call: BATTLE_CALL_LEGENDARY(PYTAVOR)
- Level: 60
- Catchable: Yes
- Notes: Jungle maze altar fight.

## LEGENDARY: FONTESSA (Fountain Depth)
- Trigger: After Orb use cutscene (sets F_FONTESSA_AWAKENED)
- Battle Call: BATTLE_CALL_LEGENDARY(FONTESSA)
- Level: 67
- Catchable: Story-dependent (configure)

## BOSS: JAMES (CORRUPTED) — RIVAL_B8
- Trigger: EVT_1202_RIVAL_BATTLE_8_CORRUPTED
- Battle Call: BATTLE_CALL_RIVAL(8, STARTER_BRANCH)
- Special: Moldraith is temporary (removed after battle).

## BOSS: VEIL DIRECTOR
- Trigger: EVT_1301_DIRECTOR_DEFEAT
- Battle Call: BATTLE_CALL_BOSS(VEIL_DIRECTOR)
- Notes: Post-fight 'arrest' twist.
