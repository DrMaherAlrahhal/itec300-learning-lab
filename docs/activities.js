import {quizzes} from './course.js';
const flowScenarios=[['A traditional radio broadcast','Simplex','Only the station sends through this process.'],['A walkie-talkie conversation','Half-duplex','Both people can send, but they take turns.'],['A telephone conversation','Full-duplex','Both people can speak and hear at the same time.']];
export function mountActivity(host,activity){
 let index=0,selected=null,matched={},feedback='',correct=false;
 const render=()=>{
 let body='';
 if(activity.kind==='matching'){
 const items=['Twisted-pair','Coaxial','Fiber-optic','Radio','Microwave','Satellite'];
 body=`<p>Drag each medium to its family, or select a medium and then a family. The buttons also work with keyboard and touch.</p><div class="match-items">${items.map(x=>`<button draggable="true" data-item="${x}" class="${selected===x?'selected':''}" ${matched[x]?'disabled':''}>${x}${matched[x]?' ✓':''}</button>`).join('')}</div><div class="match-zones">${['Guided','Wireless'].map(x=>`<button class="drop-zone" data-zone="${x}"><strong>${x}</strong><span>${items.filter(i=>matched[i]===x).join(' · ')||'Place media here'}</span></button>`).join('')}</div><p class="activity-count">${Object.keys(matched).length} / 6 matched</p>`;
 }else{
 let prompt,options;
 if(activity.kind==='flow'){[prompt]=flowScenarios[index];options=['Simplex','Half-duplex','Full-duplex'];}
 if(activity.kind==='classify'){prompt=['Human voice as continuously changing sound','A computer’s sequence of 0s and 1s','A stored binary representation of a photograph'][index];options=['Analog','Digital'];}
 if(activity.kind==='diagram'){prompt='Digital computer data must use analog transmission. Which diagram fits?';options=['Digital data → conversion → analog signal','Digital data → no signal → receiver','Analog sound → cable → no conversion'];}
 if(activity.kind==='question'){prompt=activity.question.prompt;options=activity.question.options;}
 body=`<h4>${prompt}</h4><div class="choice-grid">${options.map((o,i)=>`<button data-answer="${i}" class="${selected===i?'selected':''}">${o}</button>`).join('')}</div>${['flow','classify'].includes(activity.kind)?`<div class="activity-pager"><span>Example ${index+1} / 3</span><button data-next ${!correct?'disabled':''}>${index===2?'Practice again':'Next example'}</button></div>`:''}`;
 }
 host.innerHTML=`<div class="activity-heading"><span class="eyebrow">CHECK YOUR UNDERSTANDING</span><h3>${activity.title}</h3></div>${body}<div class="feedback ${correct?'correct':''}" role="status">${feedback||'Choose an answer to get immediate feedback.'}</div>`;
 };
 function match(item,zone){if(!item||matched[item])return;const right=['Twisted-pair','Coaxial','Fiber-optic'].includes(item)?'Guided':'Wireless';correct=right===zone;if(correct){matched[item]=zone;selected=null;feedback=`Correct ✓ ${item} is ${zone.toLowerCase()} media. ${zone==='Guided'?'The signal follows a cable.':'The signal travels through the air.'}`;}else feedback='Try Again — guided uses a cable; wireless travels through the air.';render();host.querySelector(`[data-zone="${zone}"]`)?.focus({preventScroll:true});}
 function click(e){let b=e.target.closest('button');if(!b)return;if(b.dataset.item){selected=b.dataset.item;render();host.querySelector(`[data-item="${selected}"]`).focus();return;}if(b.dataset.zone){if(!selected){feedback='Select a medium first, then choose its family.';render();}else match(selected,b.dataset.zone);return;}if(b.hasAttribute('data-next')){index=(index+1)%3;selected=null;feedback='';correct=false;render();return;}if(b.dataset.answer!==undefined){selected=Number(b.dataset.answer);let answer,explanation,hint;
 if(activity.kind==='flow'){answer=['Simplex','Half-duplex','Full-duplex'].indexOf(flowScenarios[index][1]);explanation=flowScenarios[index][2];hint='Ask whether communication is one-way, taking turns, or simultaneous.';}
 if(activity.kind==='classify'){answer=index===0?0:1;explanation=index===0?'Voice changes continuously.':'Binary information uses discrete values, even when it represents a picture.';hint='Classify the data as presented: continuously changing sound or stored binary values.';}
 if(activity.kind==='diagram'){answer=0;explanation='Conversion gives digital data a suitable analog signal representation.';hint='The information needs conversion into a signal that the system can carry.';}
 if(activity.kind==='question')({answer,explanation,hint}=activity.question);
 correct=selected===answer;feedback=correct?'Correct ✓ '+explanation:'Try Again — '+hint;render();host.querySelector(`[data-answer="${selected}"]`).focus({preventScroll:true});}}
 function drag(e){const b=e.target.closest('[data-item]');if(b&&!matched[b.dataset.item]){selected=b.dataset.item;e.dataTransfer.setData('text/plain',selected);}}
 function over(e){if(e.target.closest('[data-zone]'))e.preventDefault();}
 function drop(e){const zone=e.target.closest('[data-zone]');if(zone){e.preventDefault();const item=e.dataTransfer.getData('text/plain');if(['Twisted-pair','Coaxial','Fiber-optic','Radio','Microwave','Satellite'].includes(item))match(item,zone.dataset.zone);}}
 host.addEventListener('click',click);host.addEventListener('dragstart',drag);host.addEventListener('dragover',over);host.addEventListener('drop',drop);render();
 return()=>{host.removeEventListener('click',click);host.removeEventListener('dragstart',drag);host.removeEventListener('dragover',over);host.removeEventListener('drop',drop);};
}
