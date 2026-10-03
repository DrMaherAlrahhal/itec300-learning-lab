export const weeks = {
  3: { title: 'Circuits & Communication Media', fullTitle: 'Circuits and Communication Media', clo: 'CLO 1: Select the transmission media and relate it with the network model as per the given scenario to identify solutions.', summary: 'Build a connection. Choose its direction. Find the right medium.', topics: [
    ['circuit', 'Network circuit', 'A connection needs a path', 'A circuit provides a communication connection between devices. A physical circuit is the actual medium. A logical circuit describes the communication connection and its transmission characteristics.', 'A cable is a physical path. The communication using that path is a logical connection.', 'Page 1'],
    ['configuration', 'Circuit configuration', 'Dedicated or shared?', 'Point-to-point directly connects two devices. Multipoint lets several devices share one circuit, so they must coordinate its use.', 'Sharing a circuit can reduce the number of separate physical connections.', 'Page 1'],
    ['flow', 'Data flow', 'Who can talk, and when?', 'Simplex sends in one direction. Half-duplex allows both directions, one at a time. Full-duplex allows both directions simultaneously.', 'Two-way communication does not always mean simultaneous communication.', 'Page 2'],
    ['multiplexing', 'Multiplexing', 'Many conversations, one physical circuit', 'Multiplexing allows several lower-speed logical communications to share a higher-speed physical circuit.', 'A multiplexer combines communications so available circuit capacity can be shared.', 'Page 3'],
    ['media', 'Communication media', 'Every signal needs a medium', 'Guided media carry signals along a physical cable. Wireless media carry signals through the air. The medium carries the signal for the circuit.', 'Choose for the situation: distance, capacity, cost, reliability, security and environment.', 'Page 3–4'],
    ['wireless', 'Radio, microwave & satellite', 'Follow a signal through the air', 'Radio supports mobile users. Microwave can connect locations using directional transmission. Satellite can support communication over very large distances.', 'Wireless still uses a communication medium: the wireless environment.', 'Page 4'],
    ['selection', 'Media selection challenge', 'Design for the situation', 'There is no single best medium for every network. Read each scenario, select a suitable medium, and compare the explanation.', 'More than one medium may work. The requirements decide which is suitable.', 'Page 4'],
    ['story3', 'Put the connection together', 'The complete Week 3 story', 'Devices need a circuit, a connection arrangement, a data-flow mode and a communication medium to reach a destination.', 'Configuration, data flow and medium describe different parts of the same connection.', 'Pages 1–4']
  ]},
  4: { title: 'Analog & Digital Transmission', fullTitle: 'Analog Transmission and Digital Transmission', clo: 'CLO 2: Identify the digital transmission data to detect and correct errors in a variety of professional contexts.', summary: 'Turn information into signals. Follow it to the receiver.', topics: [
    ['hello', 'From data to signals', 'Can HELLO travel inside a cable?', 'A computer wants to send HELLO. The word itself cannot physically travel inside a cable. A physical signal must represent the information.', 'Data → Signal → Transmission medium → Receiver', 'Page 1'],
    ['digital', 'Digital data', 'Start with 0 and 1', 'Digital data uses discrete values. Computers work with binary values: 0 and 1. Text, images, video and files can be represented digitally.', 'A bit has one of two values: 0 or 1.', 'Page 1'],
    ['analog', 'Analog data', 'Information that changes continuously', 'Analog data varies continuously. Your voice is an example: sound changes smoothly over time rather than using only two values.', 'The wave is a conceptual picture of continuously changing information.', 'Page 1'],
    ['compare', 'Analog vs digital', 'Continuous or discrete?', 'Analog signals change continuously. Digital signals use discrete states. Keep the original data separate from the signal used to carry it.', 'Digital data can also be represented by an analog signal.', 'Pages 1–2'],
    ['transmission', 'Digital transmission', 'Watch bits become physical changes', 'Digital transmission represents information using discrete signal states, such as electrical or light pulses.', 'In this simplified example, 0 is low and 1 is high.', 'Page 2'],
    ['coding', 'Coding', 'Agree on what each state means', 'Coding defines how digital data is represented by physical signals. Sender and receiver need to follow the same agreed coding scheme.', 'Change a bit. The corresponding part of the signal changes too.', 'Page 2'],
    ['polarity', 'Unipolar & bipolar', 'Represent bits electrically', 'A simplified unipolar signal uses zero and a positive voltage. Bipolar representation uses polarity changes. The key idea is a physical representation for binary data.', 'These are conceptual illustrations, not rules for every coding scheme.', 'Page 2'],
    ['digitalpath', 'Digital transmission example', 'Follow the data from end to end', 'Computer data becomes a digital signal. The signal travels through the medium. The receiver interprets the signal to recover the data.', 'Digital transmission supports efficient integration of voice, video and data.', 'Page 2'],
    ['conversion', 'Digital data, analog transmission', 'What if the system expects analog?', 'Digital computer data may need to use an analog communication system. The data is converted to a suitable analog signal.', 'The original data remains digital information even when the transmitted signal is analog.', 'Page 3'],
    ['modulation', 'Modulation', 'Change a carrier to carry information', 'An analog carrier can represent digital information by changing its amplitude, frequency or phase.', 'Amplitude = height. Frequency = repetition rate. Phase = position in the cycle.', 'Page 3'],
    ['modem', 'The modem', 'Convert at both ends', 'The sending modem converts digital data into analog form. The receiving modem converts that analog signal back into digital data.', 'MODulator + DEModulator = MODEM', 'Page 3'],
    ['voice', 'Analog voice to digital', 'From your voice to someone else’s ears', 'A codec converts analog voice into digital form. The network carries the digital information, which is reconstructed as sound at the receiving end.', 'Voice can begin as analog information and travel using digital transmission.', 'Page 4'],
    ['simulator', 'Transmission simulator', 'Choose the data. Trace the signal.', 'Select a data type, transmission type and medium. Explore the conversion steps supported by these Week 3 and Week 4 notes.', 'Data → Analog/Digital → Signal representation → Transmission → Communication medium → Receiver', 'Pages 1–4']
  ]}
};
for (const [week, info] of Object.entries(weeks)) info.topics = info.topics.map(([id,title,lead,body,takeaway,source])=>({id,title,lead,body,takeaway,source,week:Number(week)}));
export const topics = Object.values(weeks).flatMap(w=>w.topics);
const q=(prompt,options,answer,explanation,hint)=>({prompt,options,answer,explanation,hint});
export const quizzes={
3:[
 q('Which is a physical circuit?', ['The actual cable between devices','The meaning of a message','The choice of when to speak'],0,'A physical circuit is the actual medium connecting devices.','Look for the physical path.'),
 q('Computer A has a dedicated connection to Computer B. Which configuration is this?', ['Multipoint','Point-to-point','Multiplexing'],1,'Point-to-point directly connects two devices.','Count the two endpoints on the dedicated circuit.'),
 q('Several devices use the same communication circuit. What must they do?', ['All use separate cables','Avoid wireless signals','Coordinate their use'],2,'Multipoint devices share a communication resource and must coordinate.','They are sharing a resource.'),
 q('A traditional radio station broadcasts to listeners. Which data flow is this?', ['Simplex','Half-duplex','Full-duplex'],0,'The station sends and the listeners receive: one direction.','Do listeners send back through the same broadcast process?'),
 q('Two people take turns speaking on walkie-talkies. Which mode is this?', ['Full-duplex','Half-duplex','Simplex'],1,'Both can transmit, but only one transmits at a time.','Both directions are possible, but they take turns.'),
 q('Both ends send and receive at the same time. Which mode is this?', ['Multipoint','Simplex','Full-duplex'],2,'Full-duplex supports simultaneous two-way communication.','Look for simultaneous communication.'),
 q('What does multiplexing allow?', ['Several logical communications to share a higher-speed physical circuit','Only one device to communicate ever','Signals to travel without a medium'],0,'Multiplexing shares higher-capacity physical resources among logical communications.','Think of several users sharing capacity.'),
 q('Which set contains only guided media?', ['Radio, microwave, satellite','Twisted-pair, coaxial, fiber-optic','Fiber-optic, radio, satellite'],1,'Guided media carry signals along a physical cable.','Guided means a cable guides the signal.'),
 q('Which path describes satellite communication?', ['Computer → cable → switch','Building → direct cable → building','Ground station → satellite → ground station'],2,'A satellite relays communication between ground stations over very large distances.','The signal travels through a satellite.'),
 q('How should a designer select a medium?', ['Always choose fiber','Consider distance, capacity, cost and the environment','Always choose wireless'],1,'The appropriate medium depends on the network’s requirements, including reliability and security.','There is no single best medium for every situation.')
],
4:[
 q('What physically carries the information HELLO through a medium?', ['The printed word','A signal representing the data','A logical sentence'],1,'Information must be represented by a physical signal.','Think about representation.'),
 q('Which values does binary digital data use?', ['0 and 1','Only positive numbers','Every continuously changing value'],0,'Binary uses two discrete values: 0 and 1.','Binary means two values.'),
 q('Which is an example of analog data?', ['A stored binary sequence','Five selected bits','Continuously changing human voice'],2,'Human voice changes continuously over time.','Look for a continuous change.'),
 q('Why must the sender and receiver agree on coding?', ['To choose the same room','To interpret signal states as the same bits','To remove the medium'],1,'Coding defines how the physical signal represents digital data.','They need the same meaning for each state.'),
 q('Which describes the simplified unipolar example?', ['Zero and positive levels','Only sound waves','No physical states'],0,'The conceptual unipolar example uses zero and a positive voltage.','Uni refers here to one voltage polarity.'),
 q('Which modulation property changes wave height?', ['Frequency','Phase','Amplitude'],2,'Amplitude is the strength or height of the signal.','Find the property related to height.'),
 q('Which modulation property changes how rapidly a wave repeats?', ['Frequency','Amplitude','Phase'],0,'Frequency describes how rapidly the waveform repeats.','Count the cycles in the same time.'),
 q('Where does the word MODEM come from?', ['Medium + memory','MODulator + DEModulator','Mode + medium'],1,'Modems convert digital data to analog form and back.','It combines the two conversion operations.'),
 q('What converts analog voice into digital form?', ['Only a cable','Only a satellite','A codec'],2,'The notes identify a codec as the device/process for this conversion.','Think about conversion of voice.'),
 q('Can digital data use analog transmission?', ['Yes, after suitable conversion','No, data and signal must always match','Only if the data is erased'],0,'The original data and transmitted signal can have different forms.','A modem demonstrates this conversion.')
]};
export const checkpoints={
 flow:{kind:'flow',title:'Which way can it travel?'},
 wireless:{kind:'matching',title:'Match the medium to its family'},
 story3:{kind:'question',question:quizzes[3][9],title:'Think like a network designer'},
 analog:{kind:'classify',title:'Analog or digital data?'},
 coding:{kind:'question',question:quizzes[4][3],title:'An agreement at both ends'},
 conversion:{kind:'diagram',title:'Choose the signal path'},
 voice:{kind:'question',question:quizzes[4][8],title:'Follow a voice call'}
};
export const scenarios=[
 {title:'A small office',brief:'Connect fixed desktop computers inside a small office using cable.',answers:['Twisted-pair'],reason:'The notes give twisted-pair Ethernet as an example for office computers.',hint:'Look for the guided medium used for office computers.'},
 {title:'Two university buildings',brief:'Connect two buildings with a high-capacity backbone. Installing cable is practical.',answers:['Fiber-optic'],reason:'The notes use fiber as an example for a high-capacity backbone. Actual cost and installation conditions still matter.',hint:'The priority here is a high-capacity cabled backbone.'},
 {title:'Cable installation is difficult',brief:'Connect two locations using a directional wireless connection instead of laying cable.',answers:['Microwave'],reason:'The notes describe microwave as directional transmission between locations without installing a cable.',hint:'Which wireless option is described as directional between locations?'},
 {title:'Mobile students',brief:'Students need Wi-Fi while moving around a study area.',answers:['Radio'],reason:'Radio supports mobility. Wi-Fi is the everyday example in the notes.',hint:'Which medium carries Wi-Fi?'},
 {title:'Very large distances',brief:'Choose the wireless path that uses a relay above the ground for a very long-distance connection.',answers:['Satellite'],reason:'Satellite communication follows ground station → satellite → ground station over very large distances.',hint:'Look for a relay between ground stations.'}
];
