import { slug } from './string.js'

export const CURRENT_PROGRESS_BOSS = [
        'Kazzara',
        'The Amalgamation Chamber',
        'The Forgotten Experiments,
        'Assault of the Zaqali',
        'Rashok, the Elder',
        'Zskarn',
        'Echo of Neltharion',
        'Scalecommander Sarkareth',
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
