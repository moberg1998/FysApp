import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { Colors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';

// ─── Guide data ────────────────────────────────────────────────────────────

interface GuideItem {
  label: string;
  detail?: string;
}

interface GuideSection {
  id: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  intro: string;
  groups: { heading?: string; items: GuideItem[] }[];
}

const GUIDE_SECTIONS: GuideSection[] = [
  // ─── 1. Lyn-ICF ────────────────────────────────────────────────────────────
  {
    id: 'lyn-icf',
    title: 'Lyn-ICF',
    icon: 'flash-outline',
    color: Colors.info,
    intro: 'Seks hurtige spørgsmål der dækker ICF-rammen på under 3 minutter. Brug dem til at sætte rammen for konsultationen og identificere, hvad der er vigtigst for patienten.',
    groups: [
      {
        items: [
          { label: '1 · Kropsstruktur / funktion', detail: '"Hvad er selve problemet? Smerte, svaghed, stivhed, koordinationsbesvær — eller noget andet?"' },
          { label: '2 · Aktivitet', detail: '"Hvad kan du ikke gøre nu, som du gerne vil? Hvad er du holdt op med at gøre?"' },
          { label: '3 · Deltagelse', detail: '"Hvad påvirker det i dit daglige liv — arbejde, fritid, familieliv, sociale aktiviteter?"' },
          { label: '4 · Kontekstuelle faktorer', detail: '"Hvad i dine omgivelser gør det bedre eller værre? Bolig, arbejdsforhold, adgang til hjælp?"' },
          { label: '5 · Personlige faktorer', detail: '"Hvad tænker du selv om, hvad der er galt? Hvad bekymrer dig mest?"' },
          { label: '6 · Mål', detail: '"Hvad vil du gerne opnå her? Hvad er det vigtigste for dig at få tilbage?"' },
        ],
      },
    ],
  },

  // ─── 2. Anamnese ──────────────────────────────────────────────────────────
  {
    id: 'anamnese',
    title: 'Fysioterapeutisk anamnese',
    icon: 'chatbubble-ellipses-outline',
    color: Colors.primary,
    intro: 'Systematisk kortlægning af klage, sygehistorie og kontekst. OPQRST for symptomkarakter, SINSS-light for klinisk sværhedsgrad.',
    groups: [
      {
        heading: 'Aktuel klage (OPQRST)',
        items: [
          { label: 'Onset', detail: 'Hvornår begyndte det? Akut, gradvis eller anfaldvis?' },
          { label: 'Provokation / lindring', detail: 'Hvad forværrer? Hvad lindrer? Hvile, bevægelse, stilling?' },
          { label: 'Kvalitet', detail: 'Hvordan føles det? Stikkende, brændende, dunkende, ømhed, stivhed?' },
          { label: 'Region og udstråling', detail: 'Præcis lokalisering. Stråler det ud? Dermatommønster?' },
          { label: 'Sværhedsgrad', detail: 'NRS 0–10 i hvile og aktivitet. Hvad er uudholdelig vs. acceptabel?' },
          { label: 'Tidsmønster', detail: 'Konstant eller intermitterende? Bedre/værre på bestemt tidspunkt?' },
        ],
      },
      {
        heading: 'SINSS-light — klinisk sværhedsgrad',
        items: [
          { label: 'Severity (Sværhedsgrad)', detail: 'NRS hvile / aktivitet / nat. Hvad forhindrer patienten i at gøre?' },
          { label: 'Irritability (Irritabilitet)', detail: 'Hvad skal til for at udløse smerte? Hvor lang tid tager det at falde til ro igen?' },
          { label: 'Nature (Karakter)', detail: 'Hvad er den sandsynlige vævstype og mekanisme? Nociceptiv, neuropatisk, nociplastisk?' },
          { label: 'Stage (Stadium)', detail: 'Akut < 6 uger · Subakut 6–12 uger · Kronisk > 12 uger' },
          { label: 'Stability (Stabilitet)', detail: 'Er tilstanden i bedring, forværring eller på et plateau? Uge for uge?' },
        ],
      },
      {
        heading: 'Funktionskonsekvenser (ICF)',
        items: [
          { label: 'Aktivitetsbegrænsning', detail: 'Hvad kan patienten IKKE gøre nu? Hvad har de givet op?' },
          { label: 'Deltagelsesreduktion', detail: 'Hvad påvirkes i arbejde, socialt liv, fritidsaktiviteter, familieliv?' },
          { label: 'Patientens mål', detail: 'Hvad ønsker patienten at opnå? Hvad er vigtigst for dem?' },
        ],
      },
      {
        heading: 'Sygehistorie',
        items: [
          { label: 'Tidligere episoder', detail: 'Har de haft dette før? Varighed, behandling, resultat?' },
          { label: 'Medicinsk sygehistorie', detail: 'Relevante diagnoser, operationer, hospitalsindlæggelser' },
          { label: 'Medicin', detail: 'Aktuel medicinering — inkl. antikoagulantia, kortikosteroider, immunmodulerende' },
          { label: 'Familiær disposition', detail: 'Relevant ved inflammatorisk sygdom, malignitet, kardiovaskulær sygdom' },
        ],
      },
      {
        heading: 'Kontekstuelle faktorer',
        items: [
          { label: 'Erhverv og arbejde', detail: 'Stillesiddende, fysisk krævende? Sygemeldt?' },
          { label: 'Bolig og socialt', detail: 'Trapper, eneforælder, pårørendebelastning?' },
          { label: 'Aktivitetsniveau', detail: 'Motion, sport, hverdagsaktivitet — og ændringer heri?' },
          { label: 'Psykosociale faktorer', detail: 'Stressniveau, katastrofetanker, frygt-undvigelsesadfærd, depressive symptomer?' },
          { label: 'Forventninger til behandling', detail: 'Hvad tror patienten vil hjælpe? Hvad forventer de af forløbet?' },
        ],
      },
    ],
  },

  // ─── 3. Objektiv undersøgelse ─────────────────────────────────────────────
  {
    id: 'undersøgelse',
    title: 'Objektiv undersøgelse',
    icon: 'body-outline',
    color: Colors.modeAnatomy,
    intro: 'Hypotesedrevet undersøgelse — prioritér tests baseret på anamnesefundene. Dokumentér fund objektivt med enheder og sideangivelse.',
    groups: [
      {
        heading: 'Generel observation',
        items: [
          { label: 'Holdning og symmetri', detail: 'Skulderstand, bækkentilt, valgus/varus, hoved fremad?' },
          { label: 'Gangmønster', detail: 'Antalgisk, Trendelenburg, spastisk, ataktisk, shuffling?' },
          { label: 'Smerteadfærd', detail: 'Beskyttende bevægelse, guarding, overdreven grimassering?' },
          { label: 'Muskeltrofik', detail: 'Atrofi, ødemer, asymmetri?' },
        ],
      },
      {
        heading: 'Bevægeapparatsundersøgelse',
        items: [
          { label: 'Aktiv ROM', detail: 'Lad patienten bevæge sig — amplitude, smerteprovokation, bevægemønster?' },
          { label: 'Passiv ROM', detail: 'Bevæg led passivt — end-feel: kapsel, muskel, knoglestopp?' },
          { label: 'Muskelstyrke (MMT)', detail: 'Test relevante muskelgrupper graderet 0–5. Sammenlign bilateralt.' },
          { label: 'Palpation', detail: 'Knoglepunkter, muskelbuge, sener, ligamenter — lokal ømhed?' },
          { label: 'Specielle tests', detail: 'Kontekstafhængige: Lachman, FABERS, Spurlings, SLR, Hawkins m.fl.' },
        ],
      },
      {
        heading: 'Neurologisk undersøgelse',
        items: [
          { label: 'Sensibilitet', detail: 'Let berøring, stik, vibration — dermatomfordeling?' },
          { label: 'Reflekser', detail: 'Patellar-, Achilles-, biceps-, tricepsrefleks. Hypo/hyperrefleksi?' },
          { label: 'Neural spænding', detail: 'SLR, Slump, ULTT1–4 — reproducerer det symptomerne?' },
          { label: 'Koordination', detail: 'Finger-næse, hæl-skinneben, Romberg — cerebellar funktion?' },
          { label: 'UMN-tegn', detail: 'Babinski, klonus, spasticitet, hyperrefleksi — central påvirkning?' },
        ],
      },
    ],
  },

  // ─── 4. Funktionsundersøgelser ────────────────────────────────────────────
  {
    id: 'funktionstest',
    title: 'Funktionsundersøgelser',
    icon: 'walk-outline',
    color: '#3FB950',
    intro: 'Standardiserede funktionstest giver objektive, reproducerbare mål. Vælg tests baseret på patientens primære problematik og brug de samme tests til genundersøgelse.',
    groups: [
      {
        heading: 'Gang',
        items: [
          { label: '10 Meter Walk Test (10MWT)', detail: 'Ganghastighed. Normal voksne: 1,2–1,4 m/s. < 0,8 m/s = begrænset udendørsmobilitet.' },
          { label: '6 Minutters Gangtest (6MWT)', detail: 'Gangkapacitet og kardiorespiratorisk kondition. Fald i hastighed undervejs = træthedssignatur.' },
          { label: 'Timed Up and Go (TUG)', detail: 'Funktionel mobilitet inkl. rejsning, gang og drejning. > 12 sek = øget faldrisiko.' },
          { label: 'Gangobservation', detail: 'Hæl-isæt, fodclearing, knæfleksion svingfase, armsving, drejeteknik.' },
        ],
      },
      {
        heading: 'Balance',
        items: [
          { label: 'Berg Balance Scale', detail: '14 opgaver. Score < 45/56 = forhøjet faldrisiko.' },
          { label: 'Mini-BESTest', detail: 'Anticipatorisk, reaktiv, sensorisk og dynamisk balance. 28 point.' },
          { label: 'Romberg', detail: 'Stående balance med åbne/lukkede øjne. Positiv ved lukkede øjne = sensorisk ataksi.' },
          { label: 'Énbens-standfase', detail: 'Normal > 10 sek. Reduceret = øget faldrisiko og gluteus medius-svaghed.' },
        ],
      },
      {
        heading: 'Rejse-sætte-sig',
        items: [
          { label: '5x Sit-to-Stand (5xSTS)', detail: 'Benstyrke og overfladeoverflytning. Normal 60-årig < 12 sek.' },
          { label: '30-sekunders Chair Stand Test', detail: 'Antal rejsninger på 30 sek. Normdata opdelt på alder og køn.' },
        ],
      },
      {
        heading: 'Trapper',
        items: [
          { label: 'Trappegang — observation', detail: 'Trin-for-trin vs. alternerende? Støttebehov? Smerter? Hastighed?' },
          { label: 'Stair Climb Test', detail: 'Tid op og ned 10–12 trapper. Relevant ved knæ/hofte-patologi.' },
        ],
      },
      {
        heading: 'Overekstremitet',
        items: [
          { label: 'Håndgrebsstyrke (dynamometer)', detail: 'Normdata aldersspecifikke. Sammenlign dominante/ikke-dominante.' },
          { label: 'Box and Block Test (BBT)', detail: 'Grov manuelle funktion. 60 sek, antal blokke. Relevant ved apopleksi.' },
          { label: '9-Hole Peg Test (9HPT)', detail: 'Fin manuelle funktion og koordination. Seconds/timed. Relevant ved MS, apopleksi.' },
        ],
      },
      {
        heading: 'Hjemmefunktion',
        items: [
          { label: 'Patientspecifikke aktiviteter', detail: 'Bed patienten demonstrere en konkret opgave: tage tøj på, gå i haven, løfte en taske.' },
          { label: 'Patient-Specific Functional Scale (PSFS)', detail: '3 aktiviteter patienten selv vælger. NRS 0–10 for hver. Sensitiv til forandring.' },
        ],
      },
    ],
  },

  // ─── 5. Hypotesebank ──────────────────────────────────────────────────────
  {
    id: 'hypotesebank',
    title: 'Hypotesebank',
    icon: 'git-branch-outline',
    color: Colors.modeExam,
    intro: 'Otte kliniske problemkategorier. Identificér hvilken kategori (eller kombination) der bedst forklarer patientens præsentation — det styrer undersøgelsen og behandlingsvalget.',
    groups: [
      {
        items: [
          { label: '1 · Mekanisk', detail: 'Strukturel overbelastning, instabilitet, degenerativ forandring, hypo- eller hypermobilitet. Bevægelsesbetinget smerte, klar provokation/lindring.' },
          { label: '2 · Radikulært', detail: 'Nerverodsinvolvering fra diskusprolaps eller foraminastenose. Dermatom/myotommønster, NRS-udstråling > lokal smerte, positiv neural spændingstest.' },
          { label: '3 · Inflammatorisk', detail: 'RA, SpA, krystalartropati. Bilaterale symptomer, morgenopstivning > 30 min, systemiske tegn (træthed, feber), respons på NSAID.' },
          { label: '4 · Vaskulært', detail: 'Claudicatio intermittens (gang → bedring ved hvile), DVT (ensidig læghævelse + rødme + varme), CRPS, Raynauds fænomen.' },
          { label: '5 · Neurologisk centralt', detail: 'UMN-tegn, koordinationsdeficit, kognitive ændringer. CNS-læsion (apopleksi, MS, Parkinson, cervikal myelopati).' },
          { label: '6 · Nociplastisk', detail: 'Generaliseret, uforholdsmæssig smerte. Sensitisering af nervesystemet. Mange systemer involveret. Psykosociale drivere og gule flag fremtrædende.' },
          { label: '7 · Postoperativt', detail: 'Ardannelse, adhærencer, koordinationssvigt post-immobilisering, dekonditionering. Smertemønster og funktion passer til operationstype og forløb.' },
          { label: '8 · Funktions-/kapacitetsproblem', detail: 'Dekonditionering, muskelatrofi, kardiorespiratorisk svaghed uden klar strukturel diagnose. Inaktivitetsdrevet. Kapacitetsopbygning er kerneinterventionen.' },
        ],
      },
    ],
  },

  // ─── 6. Klinisk ræsonnering ───────────────────────────────────────────────
  {
    id: 'raesonnering',
    title: 'Klinisk ræsonnering',
    icon: 'git-network-outline',
    color: Colors.modeExam,
    intro: 'Integrer anamnesefund og undersøgelsesresultater i en begrundet hypotese. Brug ICF og biopsykosocial model som ramme for behandlingsplanen.',
    groups: [
      {
        heading: 'Smertens kilde og mekanisme',
        items: [
          { label: 'Nociceptiv', detail: 'Lokal vævsskade eller overbelastning. Klar provokation, lokal ømhed, bevægelsesbetinget.' },
          { label: 'Neuropatisk', detail: 'Nervepåvirkning. Brændende/stikkende/elektrisk, dermatomfordeling, neural spændingstest positiv.' },
          { label: 'Nociplastisk', detail: 'Centralt sensibiliseret nervesystem. Diffus, uforholdsmæssig, mange systemer, psykosociale faktorer.' },
        ],
      },
      {
        heading: 'Biopsykosocial vurdering',
        items: [
          { label: 'Biologisk', detail: 'Vævstilstand, neurologi, kardiovaskulær status, komorbiditet' },
          { label: 'Psykologisk', detail: 'Katastrofetanker (PCS), frygt-undvigelse (TSK), depression (PHQ-9), angst (GAD-7)' },
          { label: 'Social', detail: 'Støtte, arbejdssituation, socialt netværk, økonomi' },
        ],
      },
      {
        heading: 'Gule flag (psykosociale risikofaktorer)',
        items: [
          { label: 'Katastrofetanker', detail: '"Det er slemt, det bliver kun værre, jeg kan ikke klare det"' },
          { label: 'Frygt-undvigelsesadfærd', detail: 'Undgår aktivitet pga. smerte eller frygt for skade' },
          { label: 'Passivt sygdomsbegreb', detail: 'Tror kun ekstern behandling virker — lav self-efficacy' },
          { label: 'Krav om total smertefrihed', detail: 'Urealistisk mål der forhindrer funktionel fremgang' },
          { label: 'Psykisk komorbiditet', detail: 'Depression, angst, somatisering, PTSD' },
        ],
      },
      {
        heading: 'Behandlingsræsonnering',
        items: [
          { label: 'Mål', detail: 'Patientens mål → kortsigtet (4 uger) og langsigtet (3–6 mdr.)' },
          { label: 'Dosis og intensitet', detail: 'Frekvens, varighed, progression — FITT-princip' },
          { label: 'Modalitetsvalg', detail: 'Manuel terapi, øvelse, edukation, ortose, hjælpemidler, tværfaglig?' },
          { label: 'Effektmål', detail: 'Hvad måler du? NRS, ROM, funktionstest, patientspecifikt mål (PSFS)?' },
          { label: 'Genundersøgelse', detail: 'Hvornår revurderer du hypotesen? 2–4 uger er typisk.' },
        ],
      },
    ],
  },

  // ─── 7. Røde flag ─────────────────────────────────────────────────────────
  {
    id: 'roede-flag',
    title: 'Røde flag',
    icon: 'warning-outline',
    color: Colors.incorrect,
    intro: 'Symptomer der kan indikere alvorlig patologi. Screén systematisk og henvis til medicinsk vurdering, hvis et eller flere er til stede. Tidlig identifikation kan være afgørende.',
    groups: [
      {
        heading: 'Malignitet',
        items: [
          { label: 'Uforklaret vægttab', detail: '> 5% af kropsvægt over 3 måneder uden diæt' },
          { label: 'Nattesmerter der vækker fra søvn', detail: 'Særligt i kombination med vægttab og træthed' },
          { label: 'Tidligere malign sygdom', detail: 'Ny smerte hos kræftpatient → metastase-screening' },
          { label: 'Konstant, uafhjælpelig smerte', detail: 'Responderer ikke på stilling, hvile eller bevægelse' },
          { label: 'Palperbar masse', detail: 'Ukendt fast masse — hurtig udredning' },
        ],
      },
      {
        heading: 'Alvorlig spinal patologi',
        items: [
          { label: 'Cauda equina syndrom', detail: 'Bilateral bensvaghed + blære/tarm-dysfunktion + sadelbedøvelse → AKUT' },
          { label: 'Rygsøjlefraktur', detail: 'Svært traume, osteoporose, langvarig steroidbehandling' },
          { label: 'Rygmarvskompression', detail: 'UMN-tegn + nakkesmerter → cervikal myelopati' },
          { label: 'Infektion i columna', detail: 'Feber + svære rygsmerter + immunkompromitteret' },
        ],
      },
      {
        heading: 'Vaskulær og kardiovaskulær',
        items: [
          { label: 'Aortaaneurisme', detail: 'Pulserende abdominal masse + lændesmerter hos ældre mand' },
          { label: 'DVT-symptomer', detail: 'Ensidig læghævelse + rødme + varme — evt. spænding i læggen uden traume' },
          { label: 'Apopleksi / TIA', detail: 'Pludselig kraftnedsættelse, talebesvær, ansigtsasymmetri, synsforstyrrelser — AKUT' },
          { label: 'Hjerteinfarkt (atypisk)', detail: 'Venstre armsmerte + brysttrykken + dyspnø hos risikogruppe' },
        ],
      },
      {
        heading: 'Neurologiske nødsituationer',
        items: [
          { label: 'Pludselig bilateral benlammelse', detail: 'Akut kraftig forværring — akut hospitalsindlæggelse' },
          { label: 'Bevidsthedsændringer', detail: 'Konfusion, desorientering, tab af bevidsthed' },
          { label: 'Meningismus', detail: 'Nakkestivhed + feber + lysskræk → meningitis?' },
          { label: 'Hyperakut hovedpine', detail: '"Thunderclap headache" — subaraknoidalblødning?' },
        ],
      },
      {
        heading: 'Andre røde flag',
        items: [
          { label: 'Uforklaret feber', detail: 'Særligt i kombination med lokal smerte og forhøjede inflammationsmarkører' },
          { label: 'Immunsupprimeret patient', detail: 'Kortikosteroider, biologisk behandling, HIV — lav tærskel for udredning' },
          { label: 'Barn der halter', detail: 'Ny halter + unilateral hofteømhed → Mb. Perthes, epifyseolysis' },
          { label: 'Frakturmistanke', detail: 'Direkte traume + lokal ømhed + smerter ved aksial belastning' },
        ],
      },
    ],
  },

  // ─── 8. Patientkommunikation ──────────────────────────────────────────────
  {
    id: 'kommunikation',
    title: 'Patientkommunikation',
    icon: 'chatbubbles-outline',
    color: Colors.modeFlashcard,
    intro: 'Nøglesætninger til at forklare komplekse kliniske begreber i et sprog patienten forstår. Tilpas til den individuelle patient.',
    groups: [
      {
        heading: 'Artrose',
        items: [
          { label: 'Om brusk', detail: '"Brusk kan ikke reparere sig selv, men det er ikke hele historien. Ledet kan styrkes, smerter kan reduceres markant — med bevægelse."' },
          { label: 'Om smerte og aktivitet', detail: '"Smerter ved bevægelse er ikke et tegn på skade. Det er et overfølsomt alarmsystem, der kan dæmpes med regelmæssig træning."' },
          { label: 'Om prognose', detail: '"Mange med samme røntgenbillede som dig har ingen smerter. Det er ikke billedet, der bestemmer din smerte — det er dit nervesystem og dine muskler."' },
        ],
      },
      {
        heading: 'Langvarige smerter',
        items: [
          { label: 'Om sensibilisering', detail: '"Nervesystemet er blevet overfølsomt — som en brandalarmsmelder der reagerer på damp. Det er ikke fare i sig selv, men systemet er skruet for højt op."' },
          { label: 'Om aktivitet', detail: '"Det er sikkert at bevæge sig, selv om det gør ondt. Faktisk er bevægelse en af de bedste måder at dæmpe alarmsystemet på."' },
          { label: 'Om forventninger', detail: '"Målet er ikke nødvendigvis nul i smerte — det er at komme til at leve et liv, der er meningsfuldt for dig, trods smerterne."' },
        ],
      },
      {
        heading: 'Frygt for bevægelse',
        items: [
          { label: 'Normalisering', detail: '"Det er meget naturligt at beskytte noget, der gør ondt. Men kroppen er stærk og robust — og forsigtig bevægelse er det, der hjælper mest."' },
          { label: 'Gradvis eksponering', detail: '"Vi starter med det, du kan — og bygger langsomt op. Du bestemmer tempoet, men vi holder retningen mod det, du vil klare."' },
        ],
      },
      {
        heading: 'Neurologi',
        items: [
          { label: 'Om neuroplasticitet', detail: '"Hjernen og nervesystemet er plastiske — de kan genoplære bevægelser. Det kræver gentagelse og tålmodighed, men det sker."' },
          { label: 'Om træthed (MS/Parkinson)', detail: '"Den træthed du mærker er neurologisk — det er ikke dovenskab. Men paradoksalt nok er regelmæssig træning det, der reducerer den mest."' },
        ],
      },
      {
        heading: 'Hjemmebehandling',
        items: [
          { label: 'Om hjemmetræningens rolle', detail: '"Det, du gør hjemme de øvrige 23 timer, er vigtigere end det, vi gør her i en time. Konsistens slår intensitet."' },
          { label: 'Om compliance', detail: '"Du behøver ikke gøre det perfekt — du skal bare gøre det. 10 minutter 5 dage er bedre end 50 minutter én dag."' },
        ],
      },
    ],
  },

  // ─── 9. Første konsultation — 8-trins flow ───────────────────────────────
  {
    id: 'forste-konsultation',
    title: 'Første konsultation — 8-trins flow',
    icon: 'list-outline',
    color: Colors.primary,
    intro: 'Et struktureret flow for den initiale konsultation på ca. 45–60 min. Juster tiderne til din kontekst — men hold rækkefølgen.',
    groups: [
      {
        items: [
          { label: '1 · Velkomst og ramme (3 min)', detail: 'Præsentér dig, forklar hvad der sker i dag. "Vi bruger tid på at forstå dit problem, undersøger dig og lægger en plan sammen."' },
          { label: '2 · Aktuel klage og debut (8 min)', detail: 'Lad patienten fortælle frit i 1–2 min. Brug derefter OPQRST og SINSS-light til at strukturere klagen.' },
          { label: '3 · Røde flag screening (3 min)', detail: 'Screén systematisk: vægttab, nattesmerter, neurologiske symptomer, blære/tarm, feber. Stil spørgsmålene direkte.' },
          { label: '4 · ICF-kortlægning (5 min)', detail: 'Aktivitet, deltagelse, kontekst og mål. Brug Lyn-ICF-spørgsmålene. Find ud af, hvad der er vigtigst for patienten.' },
          { label: '5 · Objektiv undersøgelse — hypotesedrevet (20 min)', detail: 'Undersøg baseret på din anamnesehypotese. Prioritér test der bekræfter eller afkræfter den mest sandsynlige diagnose.' },
          { label: '6 · Klinisk konklusion og forklaring (5 min)', detail: 'Fortæl patienten, hvad du fandt. Brug patientvenligt sprog. Forklar mekanismen bag symptomerne.' },
          { label: '7 · Målsætning og behandlingsplan (5 min)', detail: 'Sæt 1–2 kortsigtede mål i samarbejde med patienten. Forklar hvad I skal gøre og hvorfor.' },
          { label: '8 · Dokumentation og næste aftale (3 min)', detail: 'Skriv klagebeskrivelse, objektive fund, konklusion, mål og plan. Aftal genundersøgelsestidspunkt.' },
        ],
      },
    ],
  },

  // ─── 10. Dokumentation ────────────────────────────────────────────────────
  {
    id: 'dokumentation',
    title: 'Dokumentation',
    icon: 'document-text-outline',
    color: Colors.primary,
    intro: 'God dokumentation er kommunikation — til dig selv ved næste session, til kollegaer og til tværfagligt samarbejde. Dokumentér specifikt, objektivt og reproducerbart.',
    groups: [
      {
        heading: 'Klagebeskrivelse',
        items: [
          { label: 'Hvem', detail: 'Alder, køn, erhverv, relevant sygehistorie' },
          { label: 'Hvad', detail: 'Symptomkarakter, lokalisering, udstråling — patientens egne ord i citationstegn' },
          { label: 'Hvornår', detail: 'Debutdato, forløb, tidligere episoder' },
          { label: 'Provokation/lindring', detail: 'Hvad forværrer, hvad lindrer — specifikt og konkret' },
          { label: 'Funktionspåvirkning', detail: 'Hvilke aktiviteter er begrænsede? Hvilke er givet op?' },
        ],
      },
      {
        heading: 'Objektive fund',
        items: [
          { label: 'ROM med grader og sideangivelse', detail: 'F.eks. "aktiv cervikal rotation hø. 45°, ve. 60° (normal 70–80°)"' },
          { label: 'Styrke med MMT og sideangivelse', detail: 'F.eks. "quadriceps hø. 4/5, ve. 5/5"' },
          { label: 'Standardiserede test-scores', detail: 'Altid med enhed, dato og kontekst: "TUG 14 sek (inkl. stok)"' },
          { label: 'Neurologisk status', detail: 'Sensibilitet, reflekser, UMN/LMN-tegn — specifikt og reproducerbart' },
          { label: 'Specielle tests', detail: 'Testens navn + resultat + klinisk betydning' },
        ],
      },
      {
        heading: 'Klinisk konklusion og plan',
        items: [
          { label: 'Hypotese', detail: 'Din bedste forklaring på patientens præsentation — inkl. bidragende faktorer' },
          { label: 'Kortsigtede mål (4 uger)', detail: 'SMART: specifikke, målbare, realistiske og tidsafgrænsede' },
          { label: 'Langsigtede mål (3–6 mdr.)', detail: 'Hvad er den ønskede slutfunktion? Hvad vil patienten tilbage til?' },
          { label: 'Plan', detail: 'Interventioner, frekvens (f.eks. 1x ugentlig i 8 uger), hjemmeprogram' },
          { label: 'Genundersøgelse', detail: 'Dato for revurdering af hypotese og fremgang — typisk 4 uger' },
        ],
      },
    ],
  },

  // ─── 11. Mini-specialguider ───────────────────────────────────────────────
  {
    id: 'specialguider',
    title: 'Mini-specialguider',
    icon: 'medical-outline',
    color: Colors.modeFlashcard,
    intro: 'Hurtige kliniske tjeklister for de fire primære diagnoser i FysApp. Brug som supplement til de fulde emner.',
    groups: [
      {
        heading: 'Parkinson',
        items: [
          { label: 'Nøgletests', detail: 'TUG · FOG-Q · Mini-BESTest · 10MWT · postural BT (OH-screening)' },
          { label: 'Kernepunkter', detail: 'Amplitude > hastighed. Cueing (auditiv, visuel). Drejetræning. Reaktiv balance. Medicintiming.' },
          { label: 'Rødt flag', detail: 'Pludselig motorisk forværring eller ny kognitiv ændring → kontakt neurolog.' },
        ],
      },
      {
        heading: 'Multipel sclerose',
        items: [
          { label: 'Nøgletests', detail: 'FSS / MFIS · 6MWT · TUG (dual-task) · Berg Balance Scale' },
          { label: 'Kernepunkter', detail: 'Aerob træning reducerer central træthed. Energipacing. Kølestrategier. Uhthoffs fænomen ved feber.' },
          { label: 'Rødt flag', detail: 'Ny neurologisk symptom (synstab, diplopi, ny kraftnedsættelse) → kontakt neurolog.' },
        ],
      },
      {
        heading: 'Apopleksi / stroke',
        items: [
          { label: 'Nøgletests', detail: '10MWT · TUG · Fugl-Meyer (UE) · Modificeret Ashworth · Berg Balance Scale' },
          { label: 'Kernepunkter', detail: 'Intensiv, opgavespecifik træning i det tidlige vindue (0–6 mdr.). Skulderpositionering. AFO-vurdering.' },
          { label: 'Rødt flag', detail: 'TIA-symptomer: pludselig talebesvær, kraftnedsættelse, ansigtsasymmetri → AKUT til skadestue.' },
        ],
      },
      {
        heading: 'Artrose / GLA:D',
        items: [
          { label: 'Nøgletests', detail: '5xSTS · 30-sek Chair Stand Test · TUG · NRS hvile/aktivitet · KOOS/HOOS PRO' },
          { label: 'Kernepunkter', detail: 'Patientedukation om artrose er behandling. Progressiv styrketræning. Vægttab ved BMI > 25. Bevægelse er medicin.' },
          { label: 'Rødt flag', detail: 'Nattesmerter + systemiske tegn (feber, vægttab) → malignitet/inflammatorisk udredning.' },
        ],
      },
    ],
  },
];

// ─── Components ─────────────────────────────────────────────────────────────

function GuideCard({ section, onPress, isOpen }: {
  section: GuideSection;
  onPress: () => void;
  isOpen: boolean;
}) {
  return (
    <View style={styles.card}>
      <TouchableOpacity onPress={onPress} activeOpacity={0.75} style={styles.cardHeader}>
        <View style={[styles.iconWrap, { backgroundColor: section.color + '22' }]}>
          <Ionicons name={section.icon} size={20} color={section.color} />
        </View>
        <Text style={styles.cardTitle}>{section.title}</Text>
        <Ionicons
          name={isOpen ? 'chevron-up' : 'chevron-down'}
          size={18}
          color={Colors.textMuted}
        />
      </TouchableOpacity>

      {isOpen && (
        <View style={styles.cardBody}>
          <Text style={styles.intro}>{section.intro}</Text>
          {section.groups.map((group, gi) => (
            <View key={gi} style={styles.group}>
              {group.heading && (
                <Text style={[styles.groupHeading, { color: section.color }]}>{group.heading}</Text>
              )}
              {group.items.map((item, ii) => (
                <View key={ii} style={styles.item}>
                  <View style={[styles.itemDot, { backgroundColor: section.color }]} />
                  <View style={styles.itemText}>
                    <Text style={styles.itemLabel}>{item.label}</Text>
                    {item.detail && <Text style={styles.itemDetail}>{item.detail}</Text>}
                  </View>
                </View>
              ))}
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

// ─── Screen ──────────────────────────────────────────────────────────────────

export default function GuideScreen() {
  const router = useRouter();
  const [openId, setOpenId] = useState<string | null>(null);

  const toggle = (id: string) => setOpenId((prev) => (prev === id ? null : id));

  return (
    <View style={styles.screen}>
      <ScreenHeader
        title="Klinisk guide"
        subtitle="Anamnese · Undersøgelse · Ræsonnering · Røde flag"
        onBack={() => router.back()}
      />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.pageIntro}>
          Klinisk referenceværktøj til fysioterapeutisk praksis. Tryk på en sektion for at udvide.
        </Text>
        {GUIDE_SECTIONS.map((section) => (
          <GuideCard
            key={section.id}
            section={section}
            isOpen={openId === section.id}
            onPress={() => toggle(section.id)}
          />
        ))}
        <View style={styles.footer} />
      </ScrollView>
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: Layout.spacing.md,
    gap: Layout.spacing.sm,
  },
  pageIntro: {
    fontSize: 13,
    color: Colors.textMuted,
    lineHeight: 19,
    marginBottom: Layout.spacing.xs,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Layout.radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Layout.spacing.md,
    gap: Layout.spacing.sm,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  cardBody: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    padding: Layout.spacing.md,
    gap: Layout.spacing.md,
  },
  intro: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 19,
  },
  group: {
    gap: 8,
  },
  groupHeading: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  item: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
  },
  itemDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    marginTop: 7,
    flexShrink: 0,
  },
  itemText: {
    flex: 1,
    gap: 2,
  },
  itemLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  itemDetail: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 17,
  },
  footer: {
    height: Layout.spacing.xxl,
  },
});
