import { ILVL_THRESHOLD, SLACK_SCORE_THRESHOLD } from '../config.js'
import { capitalize, slug } from '../core/string.js'
import { ENCHANTABLE_SLOTS } from '../core/constants.js'

const links = {
  ['Chasseur']: 'hunter',
  ['Démoniste']: 'warlock',
  ['Chevalier de la mort']: 'death-knight',
  ['Chasseur de démons']: 'demon-hunter',
  ['Druide']: 'druid',
  ['Mage']: 'mage',
  ['Moine']: 'monk',
  ['Voleur']: 'rogue',
  ['Chaman']: 'shaman',
  ['Guerrier']: 'warrior',
  ['Paladin']: 'paladin',
  ['Évocateur']: 'evoker',
  ['Prêtre']: 'priest'
}

const linksrole = {
  ['tank']: 'Tank',
  ['dps']: 'Dégat',
  ['heal']: 'Soin'
}

export const createPlayerElement = ({ name, role, equipment, renders, profile }) => {
  const { class: playerClass, title } = profile
  const { avatar } = renders
  const { ilvl, slackScore } = equipment
  const ilvlClass = ilvl < ILVL_THRESHOLD ? 'slack-ilvl' : ''
  const slackScoreClass = slackScore > SLACK_SCORE_THRESHOLD ? 'slack-enchant' : 'no-slack-enchant'




//<span class="cadre ${slug(playerClass)}">${playerClass}</span>
  const div = document.createElement('div')
  div.className += 'grid-perso'
  div.innerHTML = `
  <div class="espacetgrid">
  <div class="flexboxperso" id="testt">
  <div class="grid-perso2">
  <div id="perso">
      <h5><a href="#" data-toggle="modal" data-target="#playerModal">${title}</a></h5>
  </div>
  <div class="imgavatar" id="avatar">
      <a href="#" data-toggle="modal" data-target="#playerModal">
          <img src="${avatar}" name='${name}'/>
          </a>
  </div>
  <div id="classplayer">
      <a href ="https://worldofwarcraft.com/fr-fr/game/classes/${links[playerClass]}" target="_blank"><img class="taille" src="./Source/Img/${playerClass}.png" alt=""/ title="${playerClass}"></a>
  </div>
  <span class="${slackScoreClass}" id="slcore">
      <p>${slackScore}</p>
  </span>
  <div class="${ilvlClass}" id="playerilvl">
      <p>${ilvl}</p>
  </div>
  <div id="playerroless">
      <img src="./Source/Img/${role}.png" alt="" title="${linksrole[role]}"/>
  </div>
  </div>
</div>
</div>
<div class="clearfix"> </div>
  `
  return div
}

// do not use ES6 syntax as it does not allow .bind()
export function handleClickOnPlayer() {
  const { name, renders, progress, equipment, jobs, profile } = this

  document.getElementById('modal-title').innerText = capitalize(profile.title)
  document.getElementById('modal-avatar').src = renders.mainRaw
  document.getElementById('modal-enchantments').innerHTML = printEnchantments(equipment.enchantments)
  document.getElementById('modal-jobs').innerHTML = printJobs(jobs)
  document.getElementById('modal-raid-progress').innerHTML = printRaidProgress(progress)
  document.getElementById('modal-mythic-progress').innerHTML = printMythicPlusProgress(progress)
}

const printEnchantments = (enchantments) => 
  ENCHANTABLE_SLOTS.map(slot => {
    if (enchantments[slot] === undefined)
      return ''

    const unslugSlot = slot.toLowerCase().replace('_', '')
    const enchantClass = enchantments[slot] === 'No enchant' ? 'slack-enchant' : 'no-slack-enchant'
    return `
      <div>
        <span class="modal-subsection-title">${unslugSlot}</span>
        <span class="${enchantClass}">${enchantments[slot]}</span>
      </div>
      `
  }
  ).join('')

const printJobs = ({ main, secondary }) =>
  `${main ? printJob(main) : ''}
   ${secondary ? printJob(secondary) : ''}
  `

const printJob = ({ name, skillPoints, maxSkillPoints }) =>
  `
    <div>
      <span class="modal-subsection-title">${name}</span>
      <span>${skillPoints} / ${maxSkillPoints}</span>
    </div>
  `

const printRaidProgress = ({ totalBosses, normalProgress, heroicProgress, mythicProgress }) => 
  `
    <div>
      <span class="modal-subsection-title">Normal</span>
      <span>${normalProgress} / ${totalBosses}</span>
    </div>
    <div>
      <span class="modal-subsection-title">Heroic</span>
      <span>${heroicProgress} / ${totalBosses}</span>
    </div>
    <div>
      <span class="modal-subsection-title">Mythic</span>
      <span>${mythicProgress} / ${totalBosses}</span>
    </div>
  `


const printMythicPlusProgress = ({ mythicPlusProgress }) => {
  const dungeonHTML = mythicPlusProgress.bestRuns.map(run => {
    if (run.completed !== undefined) {
      const runClass = run.completed ? 'run-completed' : 'run-not-completed'
      return `
        <div>
          <span class="modal-subsection-title">${run.name}</span>
          <span class="${runClass}">+${run.level} (${run.score})</span>
        </div>
      `
    }
      return `
        <div>
          <span class="modal-subsection-title">${run.name}</span>
          <span>Not completed yet</span>
        </div>
      `
  }).join('')

  return `
    ${dungeonHTML}
    <div>
      <span class="modal-subsection-title">Mythic Score</span>
      <span>${mythicPlusProgress.score}</span>
    </div>
    `
}
