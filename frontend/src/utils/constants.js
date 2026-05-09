/* Hero list — replace with GET /api/heroes/ when backend is ready */
export const HEROES = [
  { id: 1,  name: 'Chou',        role: 'Fighter',   initial: 'C' },
  { id: 2,  name: 'Layla',       role: 'Marksman',  initial: 'L' },
  { id: 3,  name: 'Tigreal',     role: 'Tank',      initial: 'T' },
  { id: 4,  name: 'Eudora',      role: 'Mage',      initial: 'E' },
  { id: 5,  name: 'Karina',      role: 'Assassin',  initial: 'K' },
  { id: 6,  name: 'Estes',       role: 'Support',   initial: 'E' },
  { id: 7,  name: 'Gusion',      role: 'Assassin',  initial: 'G' },
  { id: 8,  name: 'Lancelot',    role: 'Assassin',  initial: 'L' },
  { id: 9,  name: 'Kagura',      role: 'Mage',      initial: 'K' },
  { id: 10, name: 'Franco',      role: 'Tank',      initial: 'F' },
  { id: 11, name: 'Hayabusa',    role: 'Assassin',  initial: 'H' },
  { id: 12, name: 'Fanny',       role: 'Assassin',  initial: 'F' },
  { id: 13, name: 'Aldous',      role: 'Fighter',   initial: 'A' },
  { id: 14, name: 'Claude',      role: 'Marksman',  initial: 'C' },
  { id: 15, name: 'Lunox',       role: 'Mage',      initial: 'L' },
  { id: 16, name: 'Khufra',      role: 'Tank',      initial: 'K' },
  { id: 17, name: 'Diggie',      role: 'Support',   initial: 'D' },
  { id: 18, name: 'Granger',     role: 'Marksman',  initial: 'G' },
]

/* Role colours — keyed by role name */
export const ROLE_COLOURS = {
  Fighter:  '#ff6b35',
  Marksman: '#00d4ff',
  Tank:     '#3b6bff',
  Mage:     '#b44fff',
  Assassin: '#ff4d6a',
  Support:  '#00e5a0',
}

/* Rank options — replace bans count with backend config if needed */
export const RANKS = [
  { id: 'epic',   label: 'Epic or lower', bans: 3 },
  { id: 'legend', label: 'Legend',        bans: 4 },
  { id: 'mythic', label: 'Mythic+',       bans: 5 },
]

/* Pick count per team — fixed game rule */
export const PICK_COUNT = 5