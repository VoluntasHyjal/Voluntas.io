import { callApi, getGuildRaidProgressUrl } from '../core/api.js'
import { CURRENT_PROGRESS_BOSS_SLUGS, ENCHANTABLE_SLOTS } from '../core/constants.js'
import { PLAYERS_ROSTER_1, PLAYERS_ROSTER_2 } from '../config.js'

import { buildPlayer } from './player.js'

export const buildGuild = async (token) => ({
  rosters: [
    await buildRoster(PLAYERS_ROSTER_1, token),
    await buildRoster(PLAYERS_ROSTER_2, token)
  ],
  progress: await buildGuildProgress(CURRENT_PROGRESS_BOSS_SLUGS)
})

const buildRoster = async (players, token) =>
  await Promise.all(players.map(async (player) => (await buildPlayer(player, token))))

const buildGuildProgress = async (bossSlugs) => ({
  normal: await buildGuildProgressMode(bossSlugs, 'normal'),
  heroic: await buildGuildProgressMode(bossSlugs, 'heroic'),
  mythic: await buildGuildProgressMode(bossSlugs, 'mythic'),
})

const buildGuildProgressMode = async (bossSlugs, mode) =>  {
  const urls = bossSlugs.map(slug => getGuildRaidProgressUrl(slug, mode))
  return await Promise.all(urls.map(async (url) => (await callApi(url, (data) => {
    return data.kill?.defeatedAt || null
  }))))
}
