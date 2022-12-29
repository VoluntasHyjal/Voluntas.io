import { getToken } from './core/api.js'
import { buildGuild } from './fetchers/guild.js'
import { renderGuild } from './renderers/guild.js'

getToken(buildGuild).then(renderGuild)
