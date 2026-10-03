// Dependency-free browser QA using Chrome/Edge's DevTools protocol.
// Uses an isolated headless profile, never the user's ordinary browser profile.
import {spawn} from 'node:child_process';
import {mkdir,readFile,writeFile,access} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import assert from 'node:assert/strict';
import {topics,quizzes,scenarios,checkpoints} from '../dist/course.js';
import {DevToolsSocket} from './devtools-socket.mjs';
const project=fileURLToPath(new URL('../',import.meta.url));
const out=path.join(project,'test-results');await mkdir(out,{recursive:true});
const candidates=[process.env.BROWSER_PATH,'C:/Program Files/Google/Chrome/Application/chrome.exe','C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe','/usr/bin/google-chrome','/usr/bin/chromium','/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'].filter(Boolean);
let browserPath;for(const candidate of candidates){try{await access(candidate);browserPath=candidate;break;}catch{}}
if(!browserPath)throw Error('Set BROWSER_PATH to a Chrome or Edge executable to run browser tests.');
const profile=path.join(out,'browser-profile-'+Date.now());
const containedTest=process.env.ITEC_CONTAINED_BROWSER_TEST==='1';
const browser=spawn(browserPath,['--headless=new','--disable-gpu',...(containedTest?['--no-sandbox','--in-process-gpu','--use-angle=swiftshader']:[]),'--no-first-run','--no-default-browser-check','--remote-debugging-port=0','--remote-debugging-address=127.0.0.1','--user-data-dir='+profile,'about:blank'],{windowsHide:true,stdio:['ignore','ignore','pipe']});
let stderr='';browser.stderr.on('data',b=>stderr+=b);
let ws,server;
const pause=ms=>new Promise(r=>setTimeout(r,ms));
let checks=0;const check=(condition,message)=>{assert.ok(condition,message);checks++;};
try{
 let port;for(let i=0;i<100;i++){try{port=Number((await readFile(path.join(profile,'DevToolsActivePort'),'utf8')).split('\n')[0]);break;}catch{await pause(100);}}
 if(!port)throw Error('Browser did not start: '+stderr.slice(-1500));
 const targets=await(await fetch(`http://127.0.0.1:${port}/json/list`)).json();
 ws=new DevToolsSocket(targets.find(t=>t.type==='page').webSocketDebuggerUrl);
 await new Promise((resolve,reject)=>{ws.onopen=resolve;ws.onerror=reject;});
 let serial=0;const pending=new Map(),errors=[];
 ws.onclose=e=>{for(const p of pending.values())p.reject(Error('Browser socket closed: '+e.code+' '+stderr.slice(-1800)));pending.clear();};
 ws.onmessage=e=>{const m=JSON.parse(e.data);if(m.id){const p=pending.get(m.id);if(!p)return;pending.delete(m.id);m.error?p.reject(Error(m.error.message)):p.resolve(m.result);}else if(m.method==='Runtime.exceptionThrown')errors.push(m.params.exceptionDetails.text+': '+m.params.exceptionDetails.exception?.description);};
 const send=(method,params={})=>new Promise((resolve,reject)=>{const id=++serial;const timeout=setTimeout(()=>{pending.delete(id);reject(Error('Timeout: '+method+' '+stderr.slice(-1500)));},15000);pending.set(id,{resolve:r=>{clearTimeout(timeout);resolve(r);},reject:e=>{clearTimeout(timeout);reject(e);}});ws.send(JSON.stringify({id,method,params}));});
 const evaluate=async expression=>{const r=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw Error(r.exceptionDetails.exception?.description||r.exceptionDetails.text);return r.result.value;};
 const eventually=async expression=>{for(let i=0;i<50;i++){if(await evaluate(expression))return true;await pause(100);}return false;};
 const browserVersion=await send('Browser.getVersion');await send('Page.enable');await send('Runtime.enable');
 await send('Page.addScriptToEvaluateOnNewDocument',{source:`Object.defineProperty(document,'modelContext',{value:{registerTool(tool){window.registeredLearningTool=tool;}},configurable:true});`});
 // Start a private test server, independent of the development preview.
 server=spawn(process.execPath,['scripts/serve.mjs'],{cwd:project,env:{...process.env,PORT:'4174'},windowsHide:true,stdio:['ignore','pipe','pipe']});
 let ready=false;for(let i=0;i<50;i++){try{const r=await fetch('http://127.0.0.1:4174');if(r.ok){ready=true;break;}}catch{}await pause(100);}assert.ok(ready,'Test server ready');
 const go=async route=>{await send('Page.navigate',{url:'http://127.0.0.1:4174/#'+route});for(let i=0;i<40;i++){if(await evaluate('document.querySelector("#main")?.children.length>0'))break;await pause(50);}await pause(70);};
 const click=async selector=>{check(await evaluate(`!!document.querySelector(${JSON.stringify(selector)})`),'Control exists: '+selector);await evaluate(`document.querySelector(${JSON.stringify(selector)}).click()`);await pause(25);};
 const text=selector=>evaluate(`document.querySelector(${JSON.stringify(selector)})?.textContent||''`);
 const select=async(key,value)=>{await evaluate(`{const e=document.querySelector('[data-select="${key}"]');e.value=${JSON.stringify(value)};e.dispatchEvent(new Event('change',{bubbles:true}));}`);};
 await send('Emulation.setDeviceMetricsOverride',{width:1440,height:1000,deviceScaleFactor:1,mobile:false});
 await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'no-preference'}]});
 await go('home');await evaluate('localStorage.clear()');await go('home');
 check((await text('h1')).includes('Make the connection'),'Home renders');
 await writeFile(path.join(out,'home-desktop.png'),Buffer.from((await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:true})).data,'base64'));
 // Test navigation through every topic and every demo mode.
 for(const topic of topics){await go(`week${topic.week}/${topic.id}`);check((await text('.lesson-content h1'))===topic.title,'Topic route '+topic.id);check(await evaluate('document.querySelector("#demo").children.length>0'),'Demo exists '+topic.id);
 const modes=await evaluate('[...document.querySelectorAll("#demo [data-action=mode]")].map(b=>b.dataset.value)');for(const mode of modes){await click(`#demo [data-action="mode"][data-value="${mode}"]`);check(await evaluate(`document.querySelector('#demo [data-value="${mode}"]').getAttribute('aria-pressed')==='true'`),'Mode updates '+mode);}
 }
 await go('week3/flow');await click('[data-value="Half-duplex"]');await click('[data-value="B"]');check((await text('.demo-caption')).includes('Only B'),'Half duplex B transmits');check(await evaluate('document.querySelectorAll(".lane").length===1'),'Only one half-duplex lane');await click('[data-value="A"]');check((await text('.demo-caption')).includes('Only A'),'Half duplex A transmits');await click('[data-value="Full-duplex"]');check(await evaluate('document.querySelectorAll(".lane").length===2'),'Full duplex simultaneous lanes');await click('[data-value="Simplex"]');check(await evaluate('document.querySelectorAll(".lane").length===1'),'Simplex single lane');
 await go('week3/configuration');await click('[data-action="explain"]');check((await text('.demo-caption')).includes('Exactly two'),'Point-to-point explanation');await click('[data-value="Multipoint"]');await click('[data-action="explain"]');check((await text('.demo-caption')).includes('share one path'),'Multipoint explanation');
 await go('week3/media');for(const family of ['Guided','Wireless']){await click(`[data-value="${family}"]`);const media=await evaluate('[...document.querySelectorAll("[data-action=medium]")].map(b=>b.dataset.value)');for(const medium of media){await click(`[data-value="${medium}"]`);check((await text('.demo-caption')).length>35,'Medium explanation '+medium);}}
 await go('week3/selection');for(let i=0;i<scenarios.length;i++){await click(`[data-action="answer"][data-value="${scenarios[i].answers[0]}"]`);check((await text('.feedback')).startsWith('Correct'),'Media scenario '+i);if(i<scenarios.length-1)await click('[data-action="scenario-next"]');}check(await evaluate('document.querySelector("[data-action=scenario-next]").disabled'),'Last scenario bounded');await click('[data-action="scenario-prev"]');check((await text('.scenario-counter')).includes('4'),'Previous scenario');
 await go('week4/coding');const initial=await evaluate('document.querySelector(".signal-line").getAttribute("d")');await click('[data-action="bit"][data-index="0"]');check(await evaluate('document.querySelector(".signal-line").getAttribute("d")')!==initial,'Editing bit updates signal');
 await go('week4/modulation');const paths=[];for(const mode of ['Amplitude','Frequency','Phase']){await click(`[data-value="${mode}"]`);const before=await evaluate('document.querySelector(".signal-line").getAttribute("d")');await click('[data-action="carrier"][data-value="1"]');const after=await evaluate('document.querySelector(".signal-line").getAttribute("d")');check(before!==after,'Modulation bit change '+mode);paths.push(after);await click('[data-action="carrier"][data-value="0"]');}check(new Set(paths).size===3,'Three distinct modulation visualizations');
 await go('week4/analog');await evaluate('{const e=document.querySelector("input[type=range]");e.value="40";e.dispatchEvent(new Event("input",{bubbles:true}));}');check((await evaluate('document.querySelector(".signal-line").style.transform')).includes('0.4'),'Analog strength slider');
 await go('week4/simulator');for(const data of ['Analog','Digital'])for(const tx of ['Analog','Digital'])for(const medium of ['Copper','Fiber','Wireless']){await select('data',data);await select('transmission',tx);await select('medium',medium);const supported=tx==='Digital'||(data==='Digital'&&medium==='Copper');check(await evaluate('!document.querySelector("[data-action=trace]").disabled')===supported,`Simulator ${data}/${tx}/${medium}`);}
 for(const [id,total] of [['hello',4],['digitalpath',5],['conversion',3],['modem',7],['voice',6]]){await go('week4/'+id);await click('[data-action="trace"]');check(await evaluate('document.querySelector(".path-node.lit small").textContent')==='01','Trace starts '+id);check(await eventually('Number(document.querySelector(".path-node.lit small").textContent)>=2'),'Trace advances '+id);}
 await go('week4/transmission');await click('[data-action="sendbits"]');check((await text('.transmit-bits')).includes('Sending bit 1'),'Bit animation starts');await pause(1200);check((await text('.transmit-bits')).includes('Sending bit 2'),'Bit animation advances');
 await go('week3/circuit');await click('#complete');await go('home');check((await text('.overall-progress')).includes('1 of 21'),'Progress persists across navigation');await send('Page.reload');await pause(180);check((await text('.overall-progress')).includes('1 of 21'),'Progress survives reload');
 await go('week3/wireless');await click('[data-item="Radio"]');await click('[data-zone="Guided"]');check((await text('#checkpoint .feedback')).startsWith('Try Again'),'Wrong matching hint');await click('[data-zone="Wireless"]');check((await text('.activity-count')).includes('1 / 6'),'Touch / keyboard matching works');
 await evaluate(`{const dt=new DataTransfer();dt.setData('text/plain','Fiber-optic');document.querySelector('[data-zone="Guided"]').dispatchEvent(new DragEvent('drop',{bubbles:true,dataTransfer:dt}));}`);check((await text('.activity-count')).includes('2 / 6'),'Drag/drop matching works');
 await go('week3/flow');await click('#checkpoint [data-answer="1"]');check((await text('#checkpoint .feedback')).startsWith('Try Again'),'Practice wrong answer feedback');await click('#checkpoint [data-answer="0"]');check((await text('#checkpoint .feedback')).startsWith('Correct'),'Practice correct feedback');await click('[data-next]');check((await text('#checkpoint h4')).includes('walkie'),'Next practice scenario');
 for(const id of ['story3','coding','voice']){const topic=topics.find(t=>t.id===id);await go(`week${topic.week}/${id}`);await click(`#checkpoint [data-answer="${checkpoints[id].question.answer}"]`);check((await text('#checkpoint .feedback')).startsWith('Correct'),'Checkpoint '+id);}
 await go('week4/conversion');await click('#checkpoint [data-answer="1"]');check((await text('#checkpoint .feedback')).startsWith('Try Again'),'Diagram hint');await click('#checkpoint [data-answer="0"]');check((await text('#checkpoint .feedback')).startsWith('Correct'),'Correct diagram');
 await go('week4/analog');for(const answer of [0,1,1]){await click(`#checkpoint [data-answer="${answer}"]`);check((await text('#checkpoint .feedback')).startsWith('Correct'),'Analog/digital classification');await click('#checkpoint [data-next]');}
 await go('week3/circuit');await click('.topic-pagination a:last-child');check((await text('.lesson-content h1'))==='Circuit configuration','Next Topic navigation');await click('.topic-pagination a:first-child');check((await text('.lesson-content h1'))==='Network circuit','Previous Topic navigation');
 await go('activities/week4');check(await evaluate('document.querySelectorAll(".activity").length===4'),'Week 4 activities');await go('activities/week3');check(await evaluate('document.querySelectorAll(".activity").length===4'),'Week 3 activities');
 // Complete both quizzes, retry, and verify best score cannot decrease.
 for(const week of [3,4]){await go('quiz/'+week);for(let i=0;i<10;i++){await click(`[data-option="${quizzes[week][i].answer}"]`);await click('#quiz-action');check((await text('.feedback')).startsWith('Correct'),'Quiz feedback '+week+'/'+i);await click('#quiz-action');}check((await text('.score-ring')).includes('Score: 10/10'),'Perfect quiz '+week);check(await evaluate('document.querySelectorAll(".answer-review article").length===10'),'Quiz review complete');await click('#retry');check((await text('.lesson-meta')).includes('QUESTION 1'),'Retry resets quiz');}
 await go('quiz/3');for(const q of quizzes[3]){await click(`[data-option="${(q.answer+1)%3}"]`);await click('#quiz-action');check((await text('.feedback')).startsWith('Try Again'),'Wrong quiz feedback');await click('#quiz-action');}check((await text('.score-ring')).includes('Score: 0/10'),'Zero score correct');await go('quiz');check((await text('.quiz-cards')).includes('Best score: 10/10'),'Best score preserved');
 // Responsive smoke test every learning surface at mobile/tablet/projector widths.
 for(const width of [375,768,1440]){await send('Emulation.setDeviceMetricsOverride',{width,height:950,deviceScaleFactor:1,mobile:false});for(const route of ['home','activities/week3','activities/week4','quiz',...topics.map(t=>`week${t.week}/${t.id}`)]){await go(route);const sizes=await evaluate('({scroll:document.documentElement.scrollWidth,width:innerWidth})');check(sizes.scroll<=sizes.width+1,'No horizontal overflow '+width+' '+route);}
 if(width===375){await go('week3/flow');await writeFile(path.join(out,'flow-mobile.png'),Buffer.from((await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:true})).data,'base64'));}if(width===1440){await go('week4/modulation');await writeFile(path.join(out,'modulation-desktop.png'),Buffer.from((await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:true})).data,'base64'));}}
 await click('#motion');check(await evaluate('document.body.classList.contains("paused")'),'Pause animations');await click('#motion');check(await evaluate('!document.body.classList.contains("paused")'),'Resume animations');
 await go('week4/modem');await click('#motion');for(let i=0;i<7;i++){await click('[data-action="trace"]');check(await evaluate('Number(document.querySelector(".path-node.lit small").textContent)')===i+1,'Paused manual step '+i);}
 check((await evaluate('document.querySelector(".wave").getAttribute("aria-label")')).includes('Unipolar'),'Modem output is digital again');await click('#motion');
 await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});await send('Page.reload');await pause(200);check(await evaluate('document.body.classList.contains("paused")'),'Reduced-motion preference respected');
 check(await evaluate('window.registeredLearningTool?.name')==='read_learning_progress','Optional progress tool registered against test interface');check(await evaluate('window.registeredLearningTool.execute({}).totalTopics')===21,'Optional tool reads same progress');check(await evaluate('(()=>{try{window.registeredLearningTool.execute({invalid:true});return false;}catch{return true;}})()'),'Optional tool rejects invalid input');
 check(errors.length===0,'No browser runtime errors: '+errors.join('\n'));
 const report={checks,passed:true,browser:browserPath,browserVersion:browserVersion.product,containedTest,widths:[375,768,1440],topics:topics.length,quizQuestions:20,webmcp:'Registration and execution tested using injected interface; native WebMCP host unavailable.',errors,timestamp:new Date().toISOString()};await writeFile(path.join(out,'browser-report.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
 await send('Browser.close');
}finally{ws?.close();server?.kill();browser.kill();}





