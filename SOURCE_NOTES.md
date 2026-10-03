# Academic source and scope

The sole academic source is the supplied **`Week 3-4.docx`**, located in the parent workspace. No external textbook, web article or advanced networking material was used to expand the syllabus. The document's own book references are retained as provenance only; those external works were not independently consulted.

The website rephrases this document into short explanations, conceptual demonstrations and questions. The instructor name, course name, required structure and requested activities come from the user's brief.

| Source section | Website topics |
| --- | --- |
| Week 3, Page 1 | Physical/logical circuit; point-to-point/multipoint |
| Week 3, Page 2 | Simplex; half-duplex; full-duplex; turnaround time |
| Week 3, Page 3 | Multiplexing; guided/wireless media |
| Week 3, Page 4 | Radio; microwave; satellite; media selection factors |
| Week 4, Page 1 | HELLO introduction; digital/analog data; data versus signal |
| Week 4, Page 2 | Digital transmission; coding; conceptual unipolar/bipolar signals |
| Week 4, Page 3 | Analog transmission of digital data; modulation; modem |
| Week 4, Page 4 | Analog voice conversion; codec; end-to-end transmission |

## Teaching boundaries

- CLO 1 and CLO 2 are displayed exactly as supplied. Although CLO 2 mentions error detection and correction, the supplied Week 4 notes do not teach algorithms for these tasks. No parity, checksums, CRC, Hamming codes or other new error-control topics were introduced.
- The cable review is intentionally brief because Week 2 already covered cabling.
- No ASCII encoding is asserted for HELLO or for the editable five-bit sequence. The bit pattern is illustrative.
- Low/high unipolar states follow the source's simplified example. The bipolar demo illustrates polarity changes using zero for 0 and alternating positive/negative marks for successive 1s. This illustrative mapping is explicitly labeled and is not presented as a definition of every bipolar coding scheme. Mathematical voltages and advanced code families are omitted.
- Modulation waveforms show two illustrative bit settings for amplitude, frequency and phase, without formulas or named modulation standards.
- Multiplexing's colored moving labels illustrate several logical communications sharing one physical circuit. Their animation is not intended to teach a particular multiplexing technique or timing rule.
- Media selection scenarios add constraints to the user's general examples so answers can be justified by the document. Fiber is selected for a **cabled high-capacity backbone**, microwave for a **directional building link where cable is impractical**, radio for mobile Wi-Fi and satellite for a satellite-relay path across very large distances. These are suitable examples, not universal design rules.

## Simulator scope

The source explicitly presents digital data → digital transmission, digital data → analog transmission after conversion, and analog data → digital transmission after conversion. The simulator combines these concepts with the Week 3 media categories at a conceptual level.

| Data | Transmission | Medium | Treatment |
| --- | --- | --- | --- |
| Digital | Digital | Copper / Fiber / Wireless | Show discrete physical representation, medium and recovery of data |
| Analog | Digital | Copper / Fiber / Wireless | Show codec conversion, digital network and reconstruction of sound |
| Digital | Analog | Copper | Show a conceptual modem pair with analog signal representation |
| Digital | Analog | Fiber / Wireless | Excluded: these particular modem/medium combinations are not developed in the supplied notes |
| Analog | Analog | Any | Excluded: the provided notes do not develop this path |

Electrical pulses for copper and light pulses for fiber are conceptual combinations of the notes' media and signal discussions. Wireless digital states are labeled as a cross-week conceptual combination, without claiming a specific radio coding scheme. The copper modem path is labeled conceptual: the source does not prescribe a modem standard or detailed physical system. An excluded combination is described as **outside these notes**, never as technically impossible.

## Data and privacy

Progress and best scores are stored only in browser localStorage under `itec300-learning-v1`. The application contains no student identity fields, analytics, trackers, external requests, authentication or server-side student records. The instructor and students can use the website without registering.
