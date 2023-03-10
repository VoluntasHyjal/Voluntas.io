import { slug } from './string.js'

export const CURRENT_PROGRESS_BOSS = [
    'Eranog',
    'Terros',
    'The Primal Council',
    'Sennarth the Cold Breath',
    'Kurog Grimtotem',
    'Dathea Ascended',
    'Broodkeeper Diurna',
    'Raszageth the-stormeater',
    //'Dathea, Ascended',
    //'Stone Legion Generals',
    //'Sire Denathrius'
]

export const CURRENT_PROGRESS_BOSS_SLUGS = CURRENT_PROGRESS_BOSS.map(boss => slug(boss))

export const CURRENT_DUNGEONS = [
    'Algeth\'ar Academy',
    'Ruby Life Pools',
    'The Azure Vault',
    'Court of Stars',
    'Shadowmoon Burial Grounds',
    'The Nokhud Offensive',
    'Temple of the Jade Serpent',
    'Halls of Valor',
]

export const ENCHANTABLE_SLOTS = [
    'BACK',
    'CHEST',
    'WRIST',
    'FEET',
    'MAIN_HAND',
    //'OFF_HAND',
    'FINGER_1',
    'FINGER_2',
]
