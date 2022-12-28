import { 
  REGION,
  REALM,
  GUILD,
  LOCALE,
  CURRENT_PROGRESS,
  BNET_CLIENT_ID,
  BNET_CLIENT_SECRET
} from '../config.js'

const BNET_HOST = `https://${REGION}.api.blizzard.com/profile/wow/character/${REALM}`
export const getPlayerProfileUrl = (player, token) => 
  `${BNET_HOST}/${player}?namespace=profile-${REGION}&locale=${LOCALE}&access_token=${token}`
export const getPlayerAvatarUrl = (player, token) => 
  `${BNET_HOST}/${player}/character-media?namespace=profile-${REGION}&locale=${LOCALE}&access_token=${token}`
export const getPlayerEquipmentUrl = (player, token) => 
  `${BNET_HOST}/${player}/equipment?namespace=profile-${REGION}&locale=${LOCALE}&access_token=${token}`
export const getPlayerJobsUrl = (player, token) => 
  `${BNET_HOST}/${player}/professions?namespace=profile-${REGION}&locale=${LOCALE}&access_token=${token}`

const RIO_HOST = 'https://raider.io/api/v1'
export const getPlayerProgressUrl = (player) =>
  `${RIO_HOST}/characters/profile?region=${REGION}&realm=${REALM}&name=${player}&fields=raid_progression,mythic_plus_best_runs:all,mythic_plus_scores`
export const getGuildRaidProgressUrl = (boss, mode) =>
  `${RIO_HOST}/guilds/boss-kill?region=${REGION}&realm=${REALM}&guild=${GUILD}&raid=${CURRENT_PROGRESS}&boss=${boss}&difficulty=${mode}`

export const jsonFetch = (url, params = { method: 'GET' }) =>
  fetch(url, params)
    .then(response => response.json())
    .catch(err => alert(err))

export const callApi = async (url, callback) => {
  if (callApi.PROGRESS_BAR === undefined)
    callApi.PROGRESS_BAR = 0

  const PROGRESS = 175 // find a formula to compute the total number of callApi that will be done to fetch all the data
  const updateProgressBar = () => {
    callApi.PROGRESS_BAR++
    document.getElementById('progress-bar').style.width = Math.round((callApi.PROGRESS_BAR / PROGRESS) * 100) + '%'
  }

  const data = (await jsonFetch(url))
  updateProgressBar()
  return callback(data)
}

export async function getToken(callback) {
    let url = `https://${REGION}.battle.net/oauth/token?client_id=${BNET_CLIENT_ID}&client_secret=${BNET_CLIENT_SECRET}&grant_type=client_credentials`

  let token = (await jsonFetch(url, { method: 'POST'})).access_token
    return callback(token)
}
