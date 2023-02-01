import { ILVL_THRESHOLD, SLACK_SCORE_THRESHOLD, LANG } from '../config.js';
import { capitalize, slug } from '../core/string.js';
import { ENCHANTABLE_SLOTS } from '../core/constants.js';

export const createPlayerElement = ({ name, role, equipment, renders, profile }) => {
    const { class: playerClass, title } = profile;
    const { avatar } = renders;
    const { ilvl, slackScore } = equipment;
    const ilvlClass = ilvl < ILVL_THRESHOLD ? 'slack-ilvl' : '';
    const slackScoreClass = slackScore > SLACK_SCORE_THRESHOLD ? 'slack-enchant' : 'no-slack-enchant';

    
    const div = document.createElement('div');
    div.className += 'grid-perso reveal-6'
    div.innerHTML = `
        <div class="espacetgrid">
            <div class="flexboxperso" id="testt">
                <div class="grid-perso2">
                    <div id="perso">
                        <h5><a href="#" data-toggle="modal" data-target="#playerModal">${title}</a></h5>
                    </div>
                    <div class="imgavatar" id="avatar">
                        <a href="#" data-toggle="modal" data-target="#playerModal">
                            <img src="${avatar}" name='${name}' />
                        </a>
                    </div>
                    <div id="classplayer">
                        <a href ="https://worldofwarcraft.com/fr-fr/game/classes/${LANG.PLAYER_CLASS[playerClass]}" target="_blank">
                            <img class="taille" src="./assets/images/player_class/${playerClass.toLowerCase()}.png" alt="playerClass" title="${playerClass}"  height="500rem"/>
                        </a>
                    </div>
                    <span class="${slackScoreClass}" id="slcore">
                        <p>${slackScore}</p>
                    </span>
                    <div class="${ilvlClass}" id="playerilvl">
                        <p>${ilvl}</p>
                    </div>
                    <div id="playerroless">
                        <img src="./assets/images/player_role/${role}.png" alt="role" title="${LANG.PLAYER_ROLE[role]}" />
                    </div>
                </div>
            </div>
        </div>
        <div class="clearfix"></div>
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
        var replacei = enchantments[slot].toLowerCase().replace(/[\s]+$/, '').split(/[\s]/).pop()
        const enchantClass = enchantments[slot] === 'No enchant' ? 'slack-enchant' : 'no-slack-enchant'
        var replacetext = enchantments[slot].toLowerCase().replace(replacei, '')


        var replaceimg = enchantments[slot].toLowerCase().replace(/[\s]+$/, '').split(/[\s]/).pop()
        var rimg = replaceimg.replace('|a:professions-icon-quality-tier', '')
        var rimgi = rimg.replace('-small:20:20|a', '')
        var rimgir = rimgi.replace('enchant', '')

        return `
            <div>
                <span class="modal-subsection-title" id="modif">${LANG.ENCHANTABLE_SLOTS[unslugSlot]}</span>
                <span class="${enchantClass}" id="enchantsize">${replacetext}<img src="./assets/images/GaleryImg/qualite${rimgir}.png" alt=""></span>
            </div>
        `;
    }
).join('');

const printJobs = ({ main, secondary }) => `${main ? printJob(main) : ''} ${secondary ? printJob(secondary) : ''}`;

const printJob = ({ name, skillPoints, maxSkillPoints }) => `
    <div>
        <span class="modal-subsection-title">${LANG.Metier[name]}</span>
        <span>${skillPoints} / ${maxSkillPoints}</span>
    </div>
`;

const printRaidProgress = ({ totalBosses, normalProgress, heroicProgress, mythicProgress }) => `
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
`;

const printMythicPlusProgress = ({ mythicPlusProgress }) => {
    const dungeonHTML = mythicPlusProgress.bestRuns.map(run => {
        if (run.completed !== undefined) {
            const runClass = run.completed ? 'run-completed' : 'run-not-completed'; run.name
            return `
                <div>
                    <span class="modal-subsection-title">${LANG.RUNE_NAMEFR[run.name]}</span>
                    <span class="${runClass}">+${run.level} (${run.score})</span>
                </div>
            `;
        }
        return `
            <div>
                <span class="modal-subsection-title">${LANG.RUNE_NAMEFR[run.name]}</span>
                <span>Not completed yet</span>
            </div>
        `;
    }).join('');

    return `
        ${dungeonHTML}
        <div>
            <span class="modal-subsection-title">Mythic Score</span>
            <span>${mythicPlusProgress.score}</span>
        </div>
    `;
}
