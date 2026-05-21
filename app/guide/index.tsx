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
  {
    id: 'anamnese',
    title: 'Fysioterapeutisk anamnese',
    icon: 'chatbubble-ellipses-outline',
    color: Colors.primary,
    intro: 'Systematisk kortlægning af patientens problematik, sygehistorie og kontekst. Brug ICF-rammen: kropsstruktur/funktion → aktivitet → deltagelse → kontekstuelle faktorer.',
    groups: [
      {
        heading: 'Aktuel klage (OPQRST)',
        items: [
          { label: 'Onset', detail: 'Hvornår begyndte det? Akut, gradvis eller anfaldvis?' },
          { label: 'Provokation / lindring', detail: 'Hvad forværrer? Hvad lindrer? Hvile, bevægelse, stilling?' },
          { label: 'Kvalitet', detail: 'Hvordan føles det? Stikkende, brændende, dunkende, ømhed, stivhed?' },
          { label: 'Region og udstråling', detail: 'Præcis lokalisering. Stråler det ud? Dermatom-mønster?' },
          { label: 'Sværhedsgrad', detail: 'NRS 0–10 i hvile og aktivitet. Hvad er uudholdelig vs. acceptabel?' },
          { label: 'Tidsmønster', detail: 'Konstant eller intermitterende? Bedre/værre på bestemt tidspunkt?' },
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
  {
    id: 'undersøgelse',
    title: 'Objektiv undersøgelse',
    icon: 'body-outline',
    color: Colors.modeAnatomy,
    intro: 'Systematisk og hypotesedrevet undersøgelse. Prioritér tests baseret på anamnesehypotesen. Dokumentér fund objektivt og reproducerbart.',
    groups: [
      {
        heading: 'Generel observation',
        items: [
          { label: 'Holdning og symmetri', detail: 'Skulderstand, bækkentilt, valgus/varus, hoved fremad?' },
          { label: 'Gangmønster', detail: 'Antalgisk, Trendelenburg, spastisk, ataktisk, shuffling?' },
          { label: 'Ansigtsudtryk og adfærd', detail: 'Smerteadfærd, beskyttende bevægelse, "guarding"' },
          { label: 'Muskeltrofik', detail: 'Atrofi? Ødemer? Asymmetri?' },
        ],
      },
      {
        heading: 'Bevægeapparatsundersøgelse',
        items: [
          { label: 'Aktiv ROM', detail: 'Lad patienten bevæge sig — hvor langt, er der smerte, er der mønster?' },
          { label: 'Passiv ROM', detail: 'Bevæg led passivt — end-feel, kapsel, muskel, knogle-stop?' },
          { label: 'Muskelstyrke (MMT)', detail: 'Test relevante muskelgrupper graderet 0–5. Sammenlign bilat.' },
          { label: 'Palpation', detail: 'Knoglepunkter, muskelbuge, sener, ligamenter — lokal ømhed?' },
          { label: 'Specielle tests', detail: 'Kontekstafhængige: Lachman, FABERS, Spurlings, SLR, Hawkins, m.fl.' },
        ],
      },
      {
        heading: 'Neurologisk undersøgelse',
        items: [
          { label: 'Sensibilitet', detail: 'Let berøring, stik, vibration — dermatomfordelingen?' },
          { label: 'Reflekser', detail: 'Patellar-, Achilles-, biceps-, tricepsrefleks. Hypo/hyperrefleksi?' },
          { label: 'Neural spænding', detail: 'SLR, Slump, ULTT1-4 — reproducerer det symptomerne?' },
          { label: 'Koordination', detail: 'Finger-næse, hæl-skinneben, Romberg — cerebellar funktion?' },
          { label: 'UMN-tegn', detail: 'Babinski, klonus, spasticitet, hyperrefleksi — central påvirkning?' },
        ],
      },
      {
        heading: 'Funktionelle og standardiserede tests',
        items: [
          { label: '10 Meter Walk Test', detail: 'Ganghastighed — normalværdi voksne: 1,2–1,4 m/s' },
          { label: 'Timed Up and Go (TUG)', detail: 'Funktionel mobilitet — > 12 sek indikerer faldrisiko' },
          { label: '6 Minutters Gangtest', detail: 'Gangkapacitet og konditionelt niveau' },
          { label: '5x Sit-to-Stand', detail: 'Benstyrke og funktionel overfladeoverflytning' },
          { label: 'Berg Balance Scale', detail: '14 items — score < 45 indikerer øget faldrisiko' },
        ],
      },
    ],
  },
  {
    id: 'raesonnering',
    title: 'Klinisk ræsonnering',
    icon: 'git-network-outline',
    color: Colors.modeExam,
    intro: 'Klinisk ræsonnering er processen at integrere information fra anamnese og undersøgelse til en velbegrundet hypotese — og derved en behandlingsplan. Brug ICF og biopsykosocial model som ramme.',
    groups: [
      {
        heading: 'Hypotesekategorier',
        items: [
          { label: 'Smerdens kilde (nociception)', detail: 'Vævsstruktur, smertemekanisme (nociceptiv, neuropatisk, nociplastisk)' },
          { label: 'Patofysiologi', detail: 'Inflammation, degenerativ, neuromuskulær, vaskulær, autoimmun?' },
          { label: 'Bidragende faktorer', detail: 'Biomekaniske, neurologiske, psykosociale, livsstilsrelaterede' },
          { label: 'Prognose', detail: 'Favourable vs. unfavourable faktorer — røde flag, gule flag' },
          { label: 'Behandlingstilgang', detail: 'Lokalbehandling, motorisk kontrol, neurorehabilitering, edukation, self-management' },
        ],
      },
      {
        heading: 'Biopsykosocial vurdering',
        items: [
          { label: 'Biologisk', detail: 'Vævstilstand, neurologi, kardiovaskulær, komorbiditet' },
          { label: 'Psykologisk', detail: 'Katastrofetanker (PCS), frygt-undvigelse (TSK), depression (PHQ-9), angst (GAD-7)' },
          { label: 'Social', detail: 'Støtte, arbejdssituation, socialt netværk, økonomi' },
        ],
      },
      {
        heading: 'Gule flag (psykosociale risikofaktorer)',
        items: [
          { label: 'Katastrofetanker', detail: '"Det er slemt, det bliver kun værre, jeg kan ikke klare det"' },
          { label: 'Frygt-undvigelsesadfærd', detail: 'Undgår aktivitet pga. smerte/frygt for skade' },
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
          { label: 'Effektmål', detail: 'Hvad måler du? NRS, ROM, funktionstest, patientspecifikt mål (PSK)?' },
          { label: 'Genundersøgelsestidspunkt', detail: 'Hvornår revurderer du hypotesen? 2–4 uger er typisk' },
        ],
      },
    ],
  },
  {
    id: 'roede-flag',
    title: 'Røde flag',
    icon: 'warning-outline',
    color: Colors.incorrect,
    intro: 'Røde flag er symptomer og tegn, der kan indikere alvorlig, potentielt livstruende patologi. Identificér dem, inden du starter behandling. Disse patienter kræver akut medicinsk vurdering.',
    groups: [
      {
        heading: 'Malignitet',
        items: [
          { label: 'Uforklaret vægttab', detail: '> 5% af kropsvægt over 3 måneder uden diæt' },
          { label: 'Nattesmerter der vækker fra søvn', detail: 'Særligt i kombination med vægttab og træthed' },
          { label: 'Tidligere malign sygdom', detail: 'Ny smerte hos kræftpatient → metasase-screening' },
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
          { label: 'Infektion i columna', detail: 'Feber + svere rygsmerter + immunkompromitteret' },
        ],
      },
      {
        heading: 'Vaskulær og kardiovaskulær',
        items: [
          { label: 'Aortaaneurisme', detail: 'Pulserende abdominal masse + lændesmerter hos ældre mand' },
          { label: 'DVT', detail: 'Ensidig hævelse + rødme + varme i underben — Homans tegn' },
          { label: 'Apopleksi / TIA', detail: 'Pludselig kraftnedsættelse, talebesvær, ansivlopsymetri, synsforstyrrelser — AKUT' },
          { label: 'Hjerteinfarkt med atypisk præsentation', detail: 'Venstre armsmerte + brysttrykken + dyspnø hos risikogruppe' },
        ],
      },
      {
        heading: 'Neurologiske nødsituationer',
        items: [
          { label: 'Akut kraftigt forværret kraftnedsættelse', detail: 'Pludselig bilateral benlammelse — akut hospitalsindlæggelse' },
          { label: 'Akutte bevidsthedsændringer', detail: 'Konfusion, desorientering, tab af bevidsthed' },
          { label: 'Meningismus', detail: 'Nakkestivhed + feber + lysskræk → meningit?' },
          { label: 'Hyperakut hovedpine', detail: '"Thunderclap headache" — subaraknoidalblødning?' },
        ],
      },
      {
        heading: 'Andre røde flag',
        items: [
          { label: 'Uforklaret feber', detail: 'Særligt i kombination med lokal smerte og inflammatoriske markører' },
          { label: 'Immunsupprimeret patient', detail: 'Kortikosteroider, biologisk behandling, HIV — lav tærskel for udredning' },
          { label: 'Barnesygdomme', detail: 'Ny halter hos barn, unilateral hofteømhed → Mb. Perthes, epifyseolysis' },
          { label: 'Frakturmistanke', detail: 'Direkte traume + lokal ømhed + smerter ved aksial belastning' },
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
