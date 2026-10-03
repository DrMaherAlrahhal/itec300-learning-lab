export function digitalLevels(bits,bipolar=false){let sign=-1;return bits.map(bit=>{if(!bit)return 0;if(bipolar){sign*=-1;return sign;}return 1;});}
export function scoreQuiz(questions,answers){return questions.reduce((score,q,i)=>score+(answers[i]===q.answer?1:0),0);}
export function transmissionPath(data,transmission,medium){
 if(!['Analog','Digital'].includes(data)||!['Analog','Digital'].includes(transmission)||!['Copper','Fiber','Wireless'].includes(medium))throw new Error('Choose a listed data type, transmission type and medium.');
 if(transmission==='Analog'&&(data==='Analog'||medium!=='Copper'))return {supported:false,reason:data==='Analog'?'These notes do not develop an analog-data → analog-transmission example. Try analog data with digital transmission.':'These notes explain modem-based analog transmission of digital data, but do not specify its use over fiber or wireless. Choose copper for the conceptual modem path, or choose digital transmission.'};
 if(transmission==='Analog')return {supported:true,steps:['Computer','Digital data','Modem: modulate','Analog signal','Copper medium','Modem: demodulate','Digital data','Computer'],note:'Conceptual modem path. Copper is a guided medium from Week 3; the notes do not prescribe a particular modem standard.'};
 const representation={Copper:'Electrical pulses',Fiber:'Light pulses',Wireless:'Wireless signal states'}[medium];
 const start=data==='Analog'?['Human voice','Analog sound','Codec: digital conversion','Digital data']:['Computer','Digital data'];
 const end=data==='Analog'?['Digital data received','Conversion to sound','Listener']:['Digital data received','Computer'];
 return {supported:true,steps:[...start,representation,medium+' medium',...end],note:medium==='Wireless'?'Conceptual combination: Week 3 supplies the wireless medium; Week 4 supplies discrete signal states. No specific wireless coding scheme is implied.':'Digital transmission uses discrete physical signal states. The medium carries the signal, and the receiver recovers the information.'};
}
export const storageKey='itec300-learning-v1';
export function readProgress(storage){try{const data=JSON.parse(storage.getItem(storageKey)||'{}');return {completed:Array.isArray(data.completed)?data.completed.filter(v=>typeof v==='string'):[],scores:data.scores&&typeof data.scores==='object'?data.scores:{}};}catch{return {completed:[],scores:{}};}}
