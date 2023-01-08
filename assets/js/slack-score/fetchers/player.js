import {
  callApi,
  getPlayerProfileUrl,
  getPlayerAvatarUrl,
  getPlayerEquipmentUrl,
  getPlayerJobsUrl,
  getPlayerProgressUrl,
} from '../core/api.js'
import { capitalize } from '../core/string.js'
import { ENCHANTABLE_SLOTS, CURRENT_DUNGEONS } from '../core/constants.js'


export const buildPlayer = async ({ name, role }, token) => ({
    name,
    role,
    profile: await buildProfile(name, token),
    renders: await buildAvatar(name, token),
    equipment: await buildEquipment(name, token),
    jobs: await buildJobs(name, token),
    progress: await buildProgress(name, token),
})

const buildProfile = async (player, token) => await callApi(getPlayerProfileUrl(player, token), ({ character_class, active_title }) => ({
    class: character_class.name,
    title: active_title?.display_string.replace('{name}', capitalize(player)) || capitalize(player),
}))

const buildAvatar = async (player, token) => await callApi(getPlayerAvatarUrl(player, token), ({ assets }) => ({
    avatar: assets[0].value,
    main: assets[2].value,
    mainRaw: assets[3].value,
}))

const buildEquipment = async (player, token) => {
    const {
        ilvlSum,
        ilvlDivider,
        slackScore,
        playerEnchantments
    } = await callApi(getPlayerEquipmentUrl(player, token), (({ equipped_items }) =>
        equipped_items.reduce(({ ilvlSum, ilvlDivider, slackScore, playerEnchantments }, item) => {
            const { level, slot } = item

            // ignore low level items
            if (level.value < 50) {
                return { ilvlSum, ilvlDivider, slackScore, playerEnchantments }
            }

            // handle enchantable item
            if (ENCHANTABLE_SLOTS.includes(slot.type)) {
                slackScore++
                playerEnchantments[slot.type] = "No enchant"

                if (item.enchantments) {
                    slackScore--
                    playerEnchantments[slot.type] = item.enchantments[0].display_string.replace('Enchanted: ', '')
                }
            }

            return {
                ilvlSum: ilvlSum + level.value,
                ilvlDivider: ilvlDivider + 1,
                slackScore,
                playerEnchantments
            }
        }, { ilvlSum: 0, ilvlDivider: 0, slackScore: 0, playerEnchantments: {} })
    ))

    return {
        ilvl: parseFloat((ilvlSum / ilvlDivider).toFixed(2)),
        enchantments: playerEnchantments,
        slackScore,
    }
}

const buildJobs = async (player, token) => await callApi(getPlayerJobsUrl(player, token), data => ({
    main: (data.primaries?.length >= 1) ? buildJob(data.primaries[0]) : null,
    secondary: (data.primaries?.length >= 2) ? buildJob(data.primaries[1]) : null,
}))

const buildJob = (primary) => {
    const { tiers } = primary
    const { skill_points, max_skill_points, tier } = tiers[tiers.length - 1]

    return {
        name: tier.name,
        skillPoints: skill_points,
        maxSkillPoints: max_skill_points
    }
}

//raid_progression['vault-of-the-incarnates']
const buildProgress = async (player) => await callApi(getPlayerProgressUrl(player), ({ raid_progression, mythic_plus_best_runs, mythic_plus_scores }) => {
    const { total_bosses, normal_bosses_killed, heroic_bosses_killed, mythic_bosses_killed } = raid_progression
    return {
        totalBosses: total_bosses,
        normalProgress: normal_bosses_killed,
        heroicProgress: heroic_bosses_killed,
        mythicProgress: mythic_bosses_killed,
        mythicPlusProgress: buildMythicPlusProgress(mythic_plus_best_runs, mythic_plus_scores.all)
    }
})

const buildMythicPlusProgress = (mythicPlusBestRuns, score) => ({
    bestRuns: CURRENT_DUNGEONS.map(dungeonName => {
        const bestRun = mythicPlusBestRuns.find(({ dungeon }) => dungeon === dungeonName)
        return bestRun ? {
            name: dungeonName,
            level: bestRun.mythic_level,
            completed: bestRun.num_keystone_upgrades > 0,
            score: bestRun.score
        } : {
            name: dungeonName,
            completed: undefined,
        }
    }),
    score
})
