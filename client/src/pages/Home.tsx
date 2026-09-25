import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  BrainCircuit,
  Check,
  ChevronDown,
  CircleHelp,
  Compass,
  Flame,
  LockKeyhole,
  ExternalLink,
  RotateCcw,
  Sparkles,
  Trophy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

type Stage = {
  id: number;
  number: string;
  testament: "Antiguo Testamento" | "Nuevo Testamento";
  icon: string;
  title: string;
  books: string;
  summary: string;
  focus: string;
  accent: string;
  quiz: { question: string; options: string[]; answer: number };
};

type BibleBook = { id: number; name: string; short: string };

const bibleBooks: BibleBook[] = [
  ["Génesis", "Gn"], ["Éxodo", "Ex"], ["Levítico", "Lv"], ["Números", "Nm"], ["Deuteronomio", "Dt"], ["Josué", "Jos"], ["Jueces", "Jue"], ["Rut", "Rt"], ["1 Samuel", "1 S"], ["2 Samuel", "2 S"], ["1 Reyes", "1 R"], ["2 Reyes", "2 R"], ["1 Crónicas", "1 Cr"], ["2 Crónicas", "2 Cr"], ["Esdras", "Esd"], ["Nehemías", "Neh"], ["Ester", "Est"], ["Job", "Job"], ["Salmos", "Sal"], ["Proverbios", "Pr"], ["Eclesiastés", "Ec"], ["Cantares", "Cnt"], ["Isaías", "Is"], ["Jeremías", "Jer"], ["Lamentaciones", "Lm"], ["Ezequiel", "Ez"], ["Daniel", "Dn"], ["Oseas", "Os"], ["Joel", "Jl"], ["Amós", "Am"], ["Abdías", "Abd"], ["Jonás", "Jon"], ["Miqueas", "Mi"], ["Nahúm", "Nah"], ["Habacuc", "Hab"], ["Sofonías", "Sof"], ["Hageo", "Hag"], ["Zacarías", "Zac"], ["Malaquías", "Mal"], ["Mateo", "Mt"], ["Marcos", "Mr"], ["Lucas", "Lc"], ["Juan", "Jn"], ["Hechos", "Hch"], ["Romanos", "Ro"], ["1 Corintios", "1 Co"], ["2 Corintios", "2 Co"], ["Gálatas", "Ga"], ["Efesios", "Ef"], ["Filipenses", "Fil"], ["Colosenses", "Col"], ["1 Tesalonicenses", "1 Ts"], ["2 Tesalonicenses", "2 Ts"], ["1 Timoteo", "1 Ti"], ["2 Timoteo", "2 Ti"], ["Tito", "Tit"], ["Filemón", "Flm"], ["Hebreos", "He"], ["Santiago", "Stg"], ["1 Pedro", "1 P"], ["2 Pedro", "2 P"], ["1 Juan", "1 Jn"], ["2 Juan", "2 Jn"], ["3 Juan", "3 Jn"], ["Judas", "Jud"], ["Apocalipsis", "Ap"],
].map(([name, short], index) => ({ id: index + 1, name, short }));

const stageBookRanges: Record<number, number[]> = {
  1: [1], 2: [1], 3: [2], 4: [3], 5: [4], 6: [5], 7: [6], 8: [7, 8], 9: [9, 10], 10: [11, 12, 13, 14], 11: [23, 24, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39], 12: [12, 25], 13: [15, 16, 17], 14: [18, 19, 20, 21, 22], 15: [40, 41, 42, 43], 16: [44], 17: [45, 46, 47, 48, 49, 50, 51, 52], 18: [53, 54, 55], 19: [56, 58, 59, 60, 61, 62, 63, 64, 65], 20: [66],
};

const stages: Stage[] = [
  { id: 1, number: "01", testament: "Antiguo Testamento", icon: "🌎", title: "Los comienzos", books: "Génesis 1–11", summary: "Creación, humanidad, pecado, diluvio y dispersión de las naciones.", focus: "El origen del mundo, del ser humano y de la necesidad de redención.", accent: "clay", quiz: { question: "¿Qué entra en la historia humana en Génesis 3?", options: ["La monarquía", "El pecado", "El templo", "El exilio"], answer: 1 } },
  { id: 2, number: "02", testament: "Antiguo Testamento", icon: "👨‍👩‍👦", title: "Los patriarcas", books: "Génesis 12–50", summary: "Abraham, Isaac, Jacob y José: la familia que se convierte en pueblo.", focus: "Dios establece su pacto y comienza la historia de Israel.", accent: "olive", quiz: { question: "¿Con quién establece Dios el pacto que inicia esta etapa?", options: ["Moisés", "David", "Abraham", "Josué"], answer: 2 } },
  { id: 3, number: "03", testament: "Antiguo Testamento", icon: "🔥", title: "Liberación y pacto", books: "Éxodo", summary: "Moisés, las plagas, Pascua, Mar Rojo, Sinaí y el tabernáculo.", focus: "Dios libera a su pueblo y establece su pacto con Israel.", accent: "ember", quiz: { question: "¿Qué evento marca la salida de Israel de Egipto?", options: ["La Pascua", "La coronación", "El cautiverio", "El Jordán"], answer: 0 } },
  { id: 4, number: "04", testament: "Antiguo Testamento", icon: "⛺", title: "Santidad", books: "Levítico", summary: "Sacrificios, sacerdocio, pureza, expiación y adoración.", focus: "Cómo debía acercarse Israel a un Dios santo.", accent: "sage", quiz: { question: "¿Cuál es el llamado central de Levítico?", options: ["Sean santos", "Construyan una ciudad", "Elijan un rey", "Vayan al exilio"], answer: 0 } },
  { id: 5, number: "05", testament: "Antiguo Testamento", icon: "🏜️", title: "El desierto", books: "Números", summary: "El viaje, las rebeliones, los espías y los cuarenta años.", focus: "La fidelidad de Dios frente a la incredulidad de Israel.", accent: "sand", quiz: { question: "¿Cuánto duró el tiempo de Israel en el desierto?", options: ["7 años", "12 años", "40 años", "70 años"], answer: 2 } },
  { id: 6, number: "06", testament: "Antiguo Testamento", icon: "📜", title: "Renovación del pacto", books: "Deuteronomio", summary: "Moisés recuerda la historia, explica la Ley y deja sus últimas palabras.", focus: "Recordar, obedecer y permanecer fieles a Dios.", accent: "ink", quiz: { question: "¿Qué enfatiza Deuteronomio antes de entrar en Canaán?", options: ["La sabiduría griega", "La obediencia", "La expansión romana", "La construcción del palacio"], answer: 1 } },
  { id: 7, number: "07", testament: "Antiguo Testamento", icon: "⚔️", title: "La tierra prometida", books: "Josué", summary: "Cruce del Jordán, Jericó, conquista y repartición de la tierra.", focus: "Dios cumple la promesa dada a los patriarcas.", accent: "olive", quiz: { question: "¿Qué río cruza Israel al entrar en Canaán?", options: ["Nilo", "Éufrates", "Jordán", "Tigris"], answer: 2 } },
  { id: 8, number: "08", testament: "Antiguo Testamento", icon: "🔄", title: "El ciclo de los jueces", books: "Jueces + Rut", summary: "Pecado, opresión, clamor y liberación; Rut revela fidelidad y redención.", focus: "La misericordia de Dios en medio de la inestabilidad humana.", accent: "clay", quiz: { question: "¿Cuál es el ciclo que se repite en Jueces?", options: ["Paz → reino → templo", "Pecado → opresión → clamor → liberación", "Exilio → retorno → pacto", "Ley → sabiduría → poesía"], answer: 1 } },
  { id: 9, number: "09", testament: "Antiguo Testamento", icon: "👑", title: "Samuel y la monarquía", books: "1–2 Samuel", summary: "Samuel, Saúl y David: el nacimiento de la monarquía de Israel.", focus: "La promesa relacionada con la descendencia de David.", accent: "ember", quiz: { question: "¿A quién escoge Dios como rey después del fracaso de Saúl?", options: ["David", "Salomón", "Samuel", "Ezequías"], answer: 0 } },
  { id: 10, number: "10", testament: "Antiguo Testamento", icon: "🏛️", title: "Reino dividido", books: "1–2 Reyes + 1–2 Crónicas", summary: "Salomón, el templo, Israel al norte, Judá al sur y la caída.", focus: "Qué ocurre cuando el pueblo y sus reyes abandonan a Dios.", accent: "ink", quiz: { question: "¿Qué construye Salomón como centro de adoración?", options: ["Una muralla", "El templo", "Un arca nueva", "Una torre"], answer: 1 } },
  { id: 11, number: "11", testament: "Antiguo Testamento", icon: "📣", title: "Los profetas", books: "Isaías → Malaquías", summary: "Advertencia, juicio, arrepentimiento, esperanza y restauración.", focus: "Dios confronta el pecado y anuncia esperanza.", accent: "clay", quiz: { question: "¿Qué anuncian juntos juicio y profetas?", options: ["Solo prosperidad", "Juicio y restauración", "El fin de la Ley", "La desaparición de Israel"], answer: 1 } },
  { id: 12, number: "12", testament: "Antiguo Testamento", icon: "🏚️", title: "Exilio y lamento", books: "2 Reyes 24–25 + Lamentaciones", summary: "La caída de Jerusalén, el dolor del pueblo y la esperanza en la misericordia.", focus: "El juicio no cancela el propósito de Dios.", accent: "sand", quiz: { question: "¿Qué expresa Lamentaciones?", options: ["El dolor por Jerusalén", "La coronación de David", "La creación", "El nacimiento de la Iglesia"], answer: 0 } },
  { id: 13, number: "13", testament: "Antiguo Testamento", icon: "🏗️", title: "Regreso y restauración", books: "Esdras + Nehemías + Ester", summary: "Regreso a Jerusalén, templo, murallas y preservación del pueblo.", focus: "Dios preserva a su pueblo durante y después del exilio.", accent: "olive", quiz: { question: "¿Qué reconstruye Nehemías?", options: ["El arca", "Las murallas", "El palacio de Saúl", "El Mar Rojo"], answer: 1 } },
  { id: 14, number: "14", testament: "Antiguo Testamento", icon: "🎵", title: "Sabiduría y adoración", books: "Job + Salmos + Proverbios + Eclesiastés + Cantar", summary: "Sufrimiento, oración, sabiduría, sentido de la vida y amor.", focus: "Vivir delante de Dios en todas las estaciones de la vida.", accent: "sage", quiz: { question: "¿Qué libro explora especialmente el sufrimiento?", options: ["Job", "Rut", "Hechos", "Malaquías"], answer: 0 } },
  { id: 15, number: "15", testament: "Nuevo Testamento", icon: "✝️", title: "La llegada del Mesías", books: "Mateo + Marcos + Lucas + Juan", summary: "Cuatro perspectivas de la vida, muerte y resurrección de Jesucristo.", focus: "Jesús es el centro de la historia y el cumplimiento de la promesa.", accent: "ember", quiz: { question: "¿Qué comparten los cuatro Evangelios?", options: ["La vida de David", "La historia de Jesús", "La caída de Jerusalén", "Los viajes de Pablo"], answer: 1 } },
  { id: 16, number: "16", testament: "Nuevo Testamento", icon: "🔥", title: "Nacimiento de la Iglesia", books: "Hechos", summary: "Pentecostés, Espíritu Santo, Pedro, Pablo y la expansión del Evangelio.", focus: "El Evangelio pasa de Jerusalén hacia las naciones.", accent: "clay", quiz: { question: "¿Qué sucede en Pentecostés?", options: ["El diluvio", "La venida del Espíritu Santo", "La caída de Roma", "La coronación de Jesús"], answer: 1 } },
  { id: 17, number: "17", testament: "Nuevo Testamento", icon: "✉️", title: "La enseñanza de Pablo", books: "Romanos → 2 Tesalonicenses", summary: "Evangelio, gracia, fe, vida nueva, iglesia y regreso de Cristo.", focus: "La identidad y la vida de las comunidades en Cristo.", accent: "olive", quiz: { question: "¿Qué tema destaca Gálatas?", options: ["La gracia y la libertad", "La construcción del templo", "El exilio", "Los jueces"], answer: 0 } },
  { id: 18, number: "18", testament: "Nuevo Testamento", icon: "👨‍🏫", title: "Liderazgo de la iglesia", books: "1–2 Timoteo + Tito", summary: "Doctrina, conducta, enseñanza, liderazgo y perseverancia.", focus: "Cuidar la verdad y formar comunidades sanas.", accent: "ink", quiz: { question: "¿Qué tipo de guía ofrecen estas cartas?", options: ["Navegación", "Liderazgo y doctrina", "Agricultura", "Guerra"], answer: 1 } },
  { id: 19, number: "19", testament: "Nuevo Testamento", icon: "🤝", title: "Vida cristiana", books: "Filemón + Hebreos + Santiago + 1–3 Juan + Judas", summary: "Fe visible, reconciliación, perseverancia, amor, verdad y santidad.", focus: "Una fe que se demuestra mediante la vida.", accent: "sage", quiz: { question: "¿Qué enseña Santiago sobre la fe?", options: ["Debe demostrarse con la vida", "Es solo una idea", "No necesita obras", "Solo pertenece a los líderes"], answer: 0 } },
  { id: 20, number: "20", testament: "Nuevo Testamento", icon: "👑", title: "El final de la historia", books: "Apocalipsis", summary: "Juicio, victoria de Cristo, nueva creación y presencia de Dios.", focus: "Dios lleva la historia hacia su consumación.", accent: "ember", quiz: { question: "¿Cómo termina la historia bíblica?", options: ["En un nuevo exilio", "En cielo nuevo y tierra nueva", "Con otra esclavitud", "Sin esperanza"], answer: 1 } },
];

const STORAGE_KEY = "ruta-biblica-progress-v1";
const CHAPTER_STORAGE_KEY = "ruta-biblica-chapters-v2";
const recallStopWords = new Set("a al algo ante antes como con contra cual de del desde donde dos el ella ellas ellos en entre era es esta este esto fue ha hay hasta la las le les lo los más me mi muy no nos o para pero por que se sin sobre su sus también te tu un una uno y ya yo dios señor".split(" "));
const conceptLexicon = [
  { label: "creación", terms: ["creo", "crio", "crear", "creacion"] },
  { label: "luz", terms: ["luz", "lumbrera", "lumbreras"] },
  { label: "cielos", terms: ["cielo", "cielos", "expansion"] },
  { label: "tierra", terms: ["tierra", "seca", "terreno"] },
  { label: "aguas", terms: ["agua", "aguas", "mares", "mar"] },
  { label: "vida", terms: ["vida", "viviente", "vivientes", "seres"] },
  { label: "humanidad", terms: ["hombre", "mujer", "imagen", "semejanza"] },
  { label: "bendición", terms: ["bendijo", "bendecir", "bendicion"] },
  { label: "pacto", terms: ["pacto", "alianza", "promesa"] },
  { label: "familia", terms: ["familia", "padre", "madre", "hijo", "hijos"] },
  { label: "pecado", terms: ["pecado", "pecar", "iniquidad", "culpa"] },
  { label: "reino", terms: ["reino", "rey", "reyes", "trono"] },
  { label: "liberación", terms: ["libertad", "liberar", "libertado", "salvo", "salvacion"] },
  { label: "templo", terms: ["templo", "altar", "santuario"] },
  { label: "profeta", terms: ["profeta", "profetas", "profetizo"] },
  { label: "esperanza", terms: ["esperanza", "esperar", "consuelo", "restauracion"] },
  { label: "oración", terms: ["oracion", "orar", "suplicar", "clamor"] },
  { label: "sabiduría", terms: ["sabiduria", "sabio", "entendimiento", "conocimiento"] },
  { label: "Jesús", terms: ["jesus", "cristo", "mesias"] },
  { label: "espíritu", terms: ["espiritu", "pentecostes"] },
  { label: "iglesia", terms: ["iglesia", "discipulos", "apostoles"] },
  { label: "fe", terms: ["fe", "creer", "creyente"] },
  { label: "amor", terms: ["amor", "amar", "amado"] },
];

function normalizeForRecall(value: string) {
  return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

const readingRefs: Record<number, string> = {
  1: "Genesis 1-11",
  2: "Genesis 12-50",
  3: "Exodus",
  4: "Leviticus",
  5: "Numbers",
  6: "Deuteronomy",
  7: "Joshua",
  8: "Judges; Ruth",
  9: "1 Samuel; 2 Samuel",
  10: "1 Kings; 2 Kings; 1 Chronicles; 2 Chronicles",
  11: "Isaiah; Jeremiah; Ezekiel; Daniel; Hosea; Joel; Amos; Obadiah; Jonah; Micah; Nahum; Habakkuk; Zephaniah; Haggai; Zechariah; Malachi",
  12: "2 Kings 24-25; Lamentations",
  13: "Ezra; Nehemiah; Esther",
  14: "Job; Psalms; Proverbs; Ecclesiastes; Song of Solomon",
  15: "Matthew; Mark; Luke; John",
  16: "Acts",
  17: "Romans; 1 Corinthians; 2 Corinthians; Galatians; Ephesians; Philippians; Colossians; 1 Thessalonians; 2 Thessalonians",
  18: "1 Timothy; 2 Timothy; Titus",
  19: "Philemon; Hebrews; James; 1 Peter; 2 Peter; 1 John; 2 John; 3 John; Jude",
  20: "Revelation",
};

function getReadingUrl(stageId: number) {
  return `https://www.biblegateway.com/passage/?search=${encodeURIComponent(readingRefs[stageId])}&version=RVR1960`;
}

export default function Home() {
  const [completed, setCompleted] = useState<number[]>([]);
  const [openStage, setOpenStage] = useState(1);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [filter, setFilter] = useState<"all" | "Antiguo Testamento" | "Nuevo Testamento">("all");
  const [readerStage, setReaderStage] = useState<number | null>(1);
  const [readerBook, setReaderBook] = useState(1);
  const [readerChapter, setReaderChapter] = useState(1);
  const [chapterVerses, setChapterVerses] = useState<{ title: string; content: string }[]>([]);
  const [readerLoading, setReaderLoading] = useState(false);
  const [bookChapterCount, setBookChapterCount] = useState(1);
  const [chapterProgress, setChapterProgress] = useState<Record<string, { read: boolean; score: number }>>({});
  const [recall, setRecall] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [chapterQuizAnswer, setChapterQuizAnswer] = useState<number | null>(null);
  const [connectionAnswer, setConnectionAnswer] = useState<number | null>(null);
  const [recallFeedback, setRecallFeedback] = useState<string | null>(null);
  const [adventureMode, setAdventureMode] = useState(false);
  const [celebration, setCelebration] = useState(false);

  const chapterKey = `${readerBook}-${readerChapter}`;
  const currentChapterProgress = chapterProgress[chapterKey];
  const currentStage = stages.find((stage) => stage.id === (readerStage ?? 1)) ?? stages[0];
  const chapterQuizOptions = [
    "Puedo explicar con mis palabras qué sucede y por qué importa.",
    "Solo reconozco el título, pero no recuerdo el contenido.",
    "Necesito volver a leerlo antes de poder explicarlo.",
  ];

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setCompleted(JSON.parse(saved));
    const savedChapters = localStorage.getItem(CHAPTER_STORAGE_KEY);
    if (savedChapters) setChapterProgress(JSON.parse(savedChapters));
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(completed));
  }, [completed]);

  useEffect(() => {
    localStorage.setItem(CHAPTER_STORAGE_KEY, JSON.stringify(chapterProgress));
  }, [chapterProgress]);

  useEffect(() => {
    if (!readerStage) return;
    let cancelled = false;
    setReaderLoading(true);
    fetch(`${import.meta.env.BASE_URL}data/rvr1909/${String(readerBook).padStart(2, "0")}.content.json`)
      .then((response) => response.json())
      .then((verses: { title: string; index_reference: string; content: string }[]) => {
        if (cancelled) return;
        const chapters = verses.map((verse) => Number(verse.index_reference.slice(2, 5))).filter(Boolean);
        setBookChapterCount(Math.max(...chapters, 1));
        const chapter = String(readerBook).padStart(2, "0") + String(readerChapter).padStart(3, "0");
        setChapterVerses(verses.filter((verse) => verse.index_reference.startsWith(chapter)).map(({ title, content }) => ({ title, content })));
      })
      .catch(() => setChapterVerses([]))
      .finally(() => !cancelled && setReaderLoading(false));
    return () => { cancelled = true; };
  }, [readerBook, readerChapter, readerStage]);

  const visibleStages = useMemo(
    () => filter === "all" ? stages : stages.filter((stage) => stage.testament === filter),
    [filter],
  );
  const masteredChapters = Object.values(chapterProgress).filter((item) => item.read).length;
  const progress = Math.round((masteredChapters / 1189) * 100);

  const toggleComplete = (id: number) => {
    setCompleted((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  };

  const resetProgress = () => {
    setCompleted([]);
    setAnswers({});
    setChapterProgress({});
    setRecall("");
    setRevealed(false);
    setChapterQuizAnswer(null);
    setConnectionAnswer(null);
    setOpenStage(1);
  };

  const openReader = (stageId: number) => {
    const firstBook = stageBookRanges[stageId][0];
    setReaderStage(stageId);
    setReaderBook(firstBook);
    setReaderChapter(1);
    setRecall("");
    setRevealed(false);
    setChapterQuizAnswer(null);
    setConnectionAnswer(null);
  };

  const markChapterComplete = () => {
    const score = Number(recallValid) + Number(chapterQuizAnswer === 0) + Number(connectionAnswer === currentStage.quiz.answer);
    if (!recallValid) {
      setRecallFeedback(recall.trim().length < 40 ? "Escribe al menos 40 caracteres con tus propias palabras." : `Tu resumen todavía no conecta con suficientes ideas del capítulo. Intenta incluir ${chapterKeywords.slice(0, 4).join(", ")}.`);
      return;
    }
    if (score < 2) {
      setRecallFeedback("Aún falta una señal de comprensión: revisa la autoevaluación y la conexión con la etapa.");
      return;
    }
    setRecallFeedback(`Bien: tu respuesta recuperó ${recallMatches.length} palabras clave del capítulo.`);
    setCelebration(true);
    window.setTimeout(() => setCelebration(false), 700);
    setChapterProgress((current) => ({ ...current, [chapterKey]: { read: true, score } }));
  };

  const nextChapter = () => {
    if (!currentChapterProgress?.read || readerChapter >= bookChapterCount) return;
    setReaderChapter((chapter) => chapter + 1);
    setRecall("");
    setRevealed(false);
    setChapterQuizAnswer(null);
    setConnectionAnswer(null);
  };

  const chapterKeywords = useMemo(() => {
    const text = normalizeForRecall(chapterVerses.map((verse) => verse.content.replace(/<[^>]+>/g, " ")).join(" "));
    const semanticMatches = conceptLexicon.filter((concept) => concept.terms.some((term) => new RegExp(`(^|[^a-zñ])${term}([^a-zñ]|$)`).test(text))).map((concept) => concept.label);
    const words = text.match(/[a-zñ]{5,}/g) ?? [];
    const counts = words.reduce<Record<string, number>>((result, word) => {
      if (!recallStopWords.has(word)) result[word] = (result[word] ?? 0) + 1;
      return result;
    }, {});
    const fallback = Object.entries(counts).sort(([, a], [, b]) => b - a).map(([word]) => word).filter((word) => !["segun", "tarde", "hizo", "dijo", "fuere", "aqui", "alli", "cosa", "toda", "todo"].includes(word));
    return [...semanticMatches, ...fallback.filter((word) => !semanticMatches.includes(word))].slice(0, 10);
  }, [chapterVerses]);

  const recallMatches = useMemo(() => {
    const answerWords = new Set(normalizeForRecall(recall).match(/[a-zñ]{5,}/g) ?? []);
    return chapterKeywords.filter((keyword) => answerWords.has(keyword));
  }, [chapterKeywords, recall]);
  const recallValid = recall.trim().length >= 40 && recallMatches.length >= 2;

  const readerBooks = readerStage ? stageBookRanges[readerStage].map((id) => bibleBooks[id - 1]) : [];
  const chapterOptions = bookChapterCount;

  return (
    <div className={cn("min-h-screen overflow-hidden bg-[#f5f0e7] text-[#25211d]", adventureMode && "adventure-mode")}>
      <header className="relative border-b border-[#d7cabb] bg-[#25211d] text-[#f8f2e7]">
        <div className="absolute inset-0 opacity-25 paper-noise" />
        <div className="relative mx-auto max-w-7xl px-5 pb-16 pt-6 sm:px-8 lg:px-12">
            <nav className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-sm font-semibold tracking-[0.16em] uppercase">
              <span className="grid size-9 place-items-center rounded-full border border-[#d8a66a]/50 bg-[#d8a66a]/10 text-[#e8b97d]"><Compass size={17} /></span>
              Ruta Bíblica
            </div>
            <div className="flex items-center gap-2"><button onClick={() => setAdventureMode((value) => !value)} className="adventure-toggle flex items-center gap-2 rounded-full border border-[#d8a66a]/40 px-3 py-2 text-xs font-bold text-[#e8b97d] transition hover:bg-[#d8a66a]/15">{adventureMode ? "Modo clásico" : "Modo aventura"}</button><button onClick={resetProgress} className="flex items-center gap-2 text-xs font-semibold text-[#cfc2b0] transition hover:text-white"><RotateCcw size={14} /> Reiniciar avance</button></div>
          </nav>
          <div className="mt-16 max-w-3xl animate-rise">
            <p className="mb-5 flex items-center gap-2 text-xs font-bold tracking-[0.24em] text-[#d8a66a] uppercase"><Sparkles size={15} /> La gran historia</p>
            <h1 className="font-display text-5xl leading-[0.98] tracking-[-0.04em] sm:text-7xl">Lee la Biblia.<br /><em className="text-[#d8a66a]">Entiende la historia.</em></h1>
              <p className="mt-7 max-w-xl text-base leading-7 text-[#d8d0c4] sm:text-lg">Lee de forma continua, capítulo por capítulo: recupera lo aprendido, conecta las ideas y avanza solo cuando el conocimiento se queda contigo.</p>
              {adventureMode && <div className="mt-6 inline-flex animate-bounce-in items-center gap-3 rounded-2xl border border-[#d8a66a]/30 bg-[#d8a66a]/10 px-4 py-3 text-sm text-[#f4d4a5]"><span className="text-xl">⭐</span><span><strong className="block">Misión activa</strong><span className="text-[#cfc2b0]">Descubre, recuerda y conecta.</span></span></div>}
          </div>
          <div className="mt-12 grid max-w-3xl gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
            <div>
              <div className="mb-3 flex items-end justify-between text-sm"><span className="text-[#cfc2b0]">Tu recorrido</span><strong className="font-display text-3xl text-[#f8f2e7]">{progress}%</strong></div>
              <Progress value={progress} className="h-2 bg-white/10 [&>div]:bg-[#d8a66a]" />
              <p className="mt-3 text-xs text-[#a99d8d]">{masteredChapters} capítulos dominados · lectura continua</p>
            </div>
            <div className="flex gap-2 text-center">
              <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3"><div className="font-display text-2xl">66</div><div className="text-[10px] tracking-wider text-[#a99d8d] uppercase">libros</div></div>
              <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3"><div className="font-display text-2xl">20</div><div className="text-[10px] tracking-wider text-[#a99d8d] uppercase">etapas</div></div>
            </div>
          </div>
        </div>
        <div className="absolute -bottom-10 right-[-2rem] hidden size-52 rounded-full border border-[#d8a66a]/20 sm:block" />
      </header>

      <main className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-12">
        <div className="mb-10 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div><p className="mb-2 text-xs font-bold tracking-[0.2em] text-[#a26745] uppercase">Tu mapa de lectura</p><h2 className="font-display text-4xl tracking-[-0.03em] sm:text-5xl">Camina la historia</h2></div>
          <div className="flex flex-wrap gap-2">
            {(["all", "Antiguo Testamento", "Nuevo Testamento"] as const).map((item) => <button key={item} onClick={() => setFilter(item)} className={cn("rounded-full border px-4 py-2 text-xs font-semibold transition", filter === item ? "border-[#25211d] bg-[#25211d] text-white" : "border-[#d7cabb] bg-[#fbf8f2] text-[#776b5f] hover:border-[#a26745]")}>{item === "all" ? "Toda la ruta" : item}</button>)}
          </div>
        </div>

        <section className="mb-12 overflow-hidden rounded-[2rem] border border-[#3d3934] bg-[#2b2824] text-[#f8f2e7] shadow-[0_22px_60px_rgba(42,31,22,0.16)]">
          <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[.8fr_1.2fr] lg:p-10">
            <div>
              <p className="mb-3 flex items-center gap-2 text-xs font-bold tracking-[0.18em] text-[#d8a66a] uppercase"><BrainCircuit size={16} /> Laboratorio de memoria</p>
              <h3 className="font-display text-3xl leading-tight sm:text-4xl">Un capítulo a la vez.<br /><em className="text-[#d8a66a]">Sin saltos.</em></h3>
              <p className="mt-5 max-w-md text-sm leading-6 text-[#cfc2b0]">Lee el capítulo, cierra el texto y recupera lo aprendido. La siguiente lectura se desbloquea cuando demuestras comprensión, no solo cuando llegas al final.</p>
              <div className="mt-7 grid grid-cols-3 gap-2 text-center text-xs"><div className="rounded-xl border border-white/10 bg-white/5 px-2 py-3"><div className="font-display text-xl text-[#e8b97d]">1</div><span className="text-[#a99d8d]">leer</span></div><div className="rounded-xl border border-white/10 bg-white/5 px-2 py-3"><div className="font-display text-xl text-[#e8b97d]">2</div><span className="text-[#a99d8d]">recordar</span></div><div className="rounded-xl border border-white/10 bg-white/5 px-2 py-3"><div className="font-display text-xl text-[#e8b97d]">3</div><span className="text-[#a99d8d]">conectar</span></div></div>
            </div>
            <div className={cn("rounded-[1.5rem] bg-[#f8f2e7] p-5 text-[#25211d] sm:p-6", celebration && "chapter-celebration")}>
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e0d4c5] pb-4"><div><p className="text-[10px] font-bold tracking-[0.16em] text-[#a26745] uppercase">Sesión actual</p><h4 className="font-display text-2xl">{bibleBooks[readerBook - 1]?.name} · capítulo {readerChapter}</h4></div><button onClick={() => openReader(readerStage ?? 1)} className="rounded-full border border-[#d7cabb] px-3 py-2 text-xs font-bold text-[#805438] transition hover:border-[#a26745]">Cambiar libro</button></div>
              <div className="mt-5 flex items-center justify-between text-xs"><span className="font-semibold text-[#776b5f]">Lectura del capítulo</span><span className="rounded-full bg-[#e9e0d4] px-3 py-1 font-bold text-[#805438]">{currentChapterProgress?.read ? "Completado" : "Pendiente"}</span></div>
              <div className="mt-3 max-h-64 overflow-y-auto rounded-xl border border-[#e3d8ca] bg-[#fffaf3] p-4"><div className="bible-copy">{readerLoading ? <p>Cargando capítulo…</p> : chapterVerses.length ? chapterVerses.map((verse) => <div key={verse.title} dangerouslySetInnerHTML={{ __html: verse.content }} />) : <p>Abre una etapa para comenzar la lectura continua.</p>}</div></div>
              <div className="chapter-map mt-5 overflow-hidden rounded-2xl border border-[#d9c7b2] bg-[#f3e6d6] p-4 sm:p-5"><div className="flex items-center justify-between gap-3"><div><p className="text-[10px] font-bold tracking-[0.16em] text-[#a26745] uppercase">Mapa visual del capítulo</p><p className="mt-1 text-sm text-[#735b49]">Lo más relevante que aparece en esta lectura</p></div><span className="chapter-map-compass">✦</span></div><div className="relative mt-4 min-h-36 overflow-hidden rounded-xl border border-[#decab4] bg-[#fffaf3]"><div className="chapter-map-line chapter-map-line-one" /><div className="chapter-map-line chapter-map-line-two" /><div className="chapter-map-center"><span className="text-[10px] font-bold tracking-[0.12em] text-[#a26745] uppercase">Cap.</span><strong>{readerChapter}</strong></div>{chapterKeywords.slice(0, 6).map((keyword, index) => <span key={keyword} className={`chapter-node chapter-node-${index + 1}`}>{keyword}</span>)}</div><div className="mt-3 grid gap-2 text-xs text-[#735b49] sm:grid-cols-3"><div className="rounded-lg bg-white/60 px-3 py-2"><strong className="block text-[#a26745]">Contexto</strong>{currentStage.title}</div><div className="rounded-lg bg-white/60 px-3 py-2"><strong className="block text-[#a26745]">Hilo principal</strong>{chapterKeywords.slice(0, 2).join(" · ") || "En construcción"}</div><div className="rounded-lg bg-white/60 px-3 py-2"><strong className="block text-[#a26745]">Conexión</strong>{currentStage.focus}</div></div></div><div className="mt-5 grid gap-4"><label className="text-sm font-bold">1. Recuperación libre <span className="font-normal text-[#8d7d6d]">· sin mirar el texto</span><textarea value={recall} onChange={(event) => { setRecall(event.target.value); setRecallFeedback(null); }} placeholder="Escribe 2–3 frases: ¿qué ocurrió, quién participó y qué idea conecta con la historia?" className="mt-2 min-h-20 w-full resize-y rounded-xl border border-[#d7cabb] bg-white px-3 py-3 text-sm font-normal outline-none transition placeholder:text-[#a99d8d] focus:border-[#a26745]" /></label>{recall.length > 0 && <p className={cn("-mt-2 text-xs", recallValid ? "text-[#6f805b]" : "text-[#a26745]")}>{recallValid ? `✓ Resumen válido · ${recallMatches.length} palabras clave detectadas` : `Faltan ${Math.max(0, 40 - recall.trim().length)} caracteres o ${Math.max(0, 2 - recallMatches.length)} palabras clave del capítulo`}</p>}<div><p className="text-sm font-bold">2. Comprensión</p><div className="mt-2 grid gap-2">{chapterQuizOptions.map((option, index) => <button key={option} onClick={() => setChapterQuizAnswer(index)} className={cn("rounded-xl border px-3 py-2.5 text-left text-sm transition", chapterQuizAnswer === index ? "border-[#a26745] bg-[#f3e2d2] text-[#70472e]" : "border-[#e2d7c9] hover:border-[#c69a72]")}>{option}</button>)}</div></div><div><p className="text-sm font-bold">3. Conexión con la etapa</p><p className="mt-1 text-xs text-[#88786a]">¿Qué enfoque de esta etapa ilumina lo que acabas de leer?</p><div className="mt-2 grid gap-2 sm:grid-cols-2">{currentStage.quiz.options.map((option, index) => <button key={option} onClick={() => setConnectionAnswer(index)} className={cn("rounded-xl border px-3 py-2.5 text-left text-sm transition", connectionAnswer === index ? "border-[#a26745] bg-[#f3e2d2] text-[#70472e]" : "border-[#e2d7c9] hover:border-[#c69a72]")}>{option}</button>)}</div></div></div>
              {revealed && <div className="mt-4 rounded-xl border-l-2 border-[#6f805b] bg-[#e5eddc] px-4 py-3 text-sm leading-6 text-[#526443]"><strong>Guía de autoevaluación:</strong> tu respuesta debe mencionar un hecho concreto del capítulo, su significado y una relación con {currentStage.title.toLowerCase()}. Si no puedes, vuelve al texto y prueba otra vez.</div>}
              {recallFeedback && <p className={cn("mt-4 rounded-xl px-4 py-3 text-sm", recallFeedback.startsWith("Bien") ? "bg-[#e5eddc] text-[#526443]" : "bg-[#f5e1d5] text-[#805438]")}>{recallFeedback}</p>}<div className="mt-5 flex flex-wrap items-center justify-between gap-3"><button onClick={() => setRevealed(true)} className="text-sm font-bold text-[#805438] hover:text-[#a26745]">Mostrar guía</button><div className="flex gap-2"><button onClick={markChapterComplete} disabled={chapterQuizAnswer === null || connectionAnswer === null} className="rounded-full bg-[#a26745] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#874e31] disabled:cursor-not-allowed disabled:opacity-40">Comprobar capítulo</button><button onClick={nextChapter} disabled={!currentChapterProgress?.read || readerChapter >= bookChapterCount} className="flex items-center gap-2 rounded-full border border-[#cdbba8] px-4 py-2.5 text-sm font-bold text-[#805438] transition hover:border-[#a26745] disabled:cursor-not-allowed disabled:opacity-40">Siguiente <ArrowRight size={15} /></button></div></div>
              {currentChapterProgress?.read && <p className="mt-3 flex items-center justify-end gap-1 text-right text-xs font-semibold text-[#6f805b]">{adventureMode ? "⭐" : "✓"} Dominio mínimo alcanzado · {currentChapterProgress.score}/3 señales de comprensión</p>}
            </div>
          </div>
        </section>

        <div className="grid gap-5 lg:grid-cols-2">
          {visibleStages.map((stage, index) => {
            const isOpen = openStage === stage.id;
            const isDone = completed.includes(stage.id);
            const answer = answers[stage.id];
            const quizAnswered = answer !== undefined;
            const quizCorrect = answer === stage.quiz.answer;
            return <article key={stage.id} className={cn("group overflow-hidden rounded-[1.6rem] border bg-[#fbf8f2] transition-all duration-300", isOpen ? "border-[#a26745]/50 shadow-[0_18px_50px_rgba(78,53,35,0.11)]" : "border-[#ded4c7] hover:-translate-y-1 hover:border-[#c59a72] hover:shadow-[0_12px_30px_rgba(78,53,35,0.08)]")} style={{ animationDelay: `${index * 45}ms` }}>
              <button onClick={() => setOpenStage(isOpen ? 0 : stage.id)} className="flex w-full items-start gap-4 p-5 text-left sm:p-6">
                <span className={cn("grid size-12 shrink-0 place-items-center rounded-2xl text-2xl", `accent-${stage.accent}`)}>{stage.icon}</span>
                <span className="min-w-0 flex-1"><span className="mb-1 flex items-center gap-2 text-[10px] font-bold tracking-[0.16em] text-[#a26745] uppercase">{stage.number} <span className="h-px w-5 bg-[#cdbba8]" /> {stage.testament === "Nuevo Testamento" ? "Nuevo" : "Antiguo"}</span><strong className="block font-display text-2xl leading-tight">{stage.title}</strong><span className="mt-1 block text-sm text-[#87796b]">{stage.books}</span></span>
                <span className="mt-2 flex shrink-0 items-center gap-2">{isDone && <span className="grid size-6 place-items-center rounded-full bg-[#6f805b] text-white"><Check size={14} /></span>}<ChevronDown size={18} className={cn("text-[#9a8b7b] transition-transform", isOpen && "rotate-180")} /></span>
              </button>
              {isOpen && <div className="border-t border-[#e6ddd2] px-5 pb-6 pt-5 sm:px-6"><p className="max-w-xl text-sm leading-6 text-[#62584f]">{stage.summary}</p><div className="mt-4 rounded-xl border-l-2 border-[#c68f61] bg-[#f4eee5] px-4 py-3 text-sm leading-6 text-[#65574b]"><span className="font-bold text-[#a26745]">Enfoque · </span>{stage.focus}</div><div className="mt-5 grid gap-2 sm:grid-cols-2"><button onClick={() => openReader(stage.id)} className="flex items-center justify-between gap-3 rounded-2xl bg-[#a26745] px-4 py-3 text-left text-sm font-bold text-white transition hover:bg-[#874e31]"><span className="flex items-center gap-3"><BookOpen size={18} /> Leer aquí · RVR 1909</span><ArrowRight size={16} /></button><a href={getReadingUrl(stage.id)} target="_blank" rel="noreferrer" className="flex items-center justify-between gap-3 rounded-2xl border border-[#d9c5ae] bg-[#fffaf2] px-4 py-3 text-left text-sm font-bold text-[#805438] transition hover:border-[#a26745] hover:bg-[#f9eee1]"><span className="flex items-center gap-3"><BookOpen size={18} /> Comparar con RVR 1960</span><ExternalLink size={16} /></a></div><p className="mt-2 text-[11px] text-[#948577]">La RVR 1909 está integrada en la app; la RVR 1960 se abre externamente.</p>{readerStage === stage.id && <div className="mt-5 overflow-hidden rounded-2xl border border-[#d7c8b6] bg-[#fffaf3]"><div className="flex flex-col gap-3 border-b border-[#e6ddd2] bg-[#f2e8da] p-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-[10px] font-bold tracking-[0.16em] text-[#a26745] uppercase">Lectura integrada</p><h4 className="font-display text-2xl">RVR 1909</h4></div><div className="flex flex-wrap gap-2"><select aria-label="Libro bíblico" value={readerBook} onChange={(event) => { setReaderBook(Number(event.target.value)); setReaderChapter(1); }} className="rounded-lg border border-[#d2c0aa] bg-[#fffaf3] px-3 py-2 text-xs font-semibold text-[#604d3c]">{readerBooks.map((book) => <option key={book.id} value={book.id}>{book.short} · {book.name}</option>)}</select><select aria-label="Capítulo" value={readerChapter} onChange={(event) => setReaderChapter(Number(event.target.value))} className="rounded-lg border border-[#d2c0aa] bg-[#fffaf3] px-3 py-2 text-xs font-semibold text-[#604d3c]">{Array.from({ length: chapterOptions }, (_, index) => <option key={index + 1} value={index + 1}>Cap. {index + 1}</option>)}</select></div></div><div className="max-h-[28rem] overflow-y-auto px-5 py-5 sm:px-7">{readerLoading ? <p className="py-10 text-center text-sm text-[#88786a]">Cargando el capítulo…</p> : chapterVerses.length ? <div className="bible-copy">{chapterVerses.map((verse) => <div key={verse.title} dangerouslySetInnerHTML={{ __html: verse.content }} />)}</div> : <p className="py-10 text-center text-sm text-[#88786a]">No se encontró el capítulo seleccionado.</p>}</div><div className="border-t border-[#e6ddd2] px-5 py-3 text-[11px] text-[#948577]">Texto de dominio público · Reina-Valera 1909</div></div>}<div className="mt-6 rounded-2xl bg-[#25211d] p-5 text-[#f8f2e7]"><div className="mb-4 flex items-center gap-2 text-xs font-bold tracking-[0.12em] text-[#e8b97d] uppercase"><CircleHelp size={16} /> Mini quiz</div><p className="mb-4 font-display text-xl leading-tight">{stage.quiz.question}</p><div className="grid gap-2 sm:grid-cols-2">{stage.quiz.options.map((option, optionIndex) => <button key={option} onClick={() => setAnswers((current) => ({ ...current, [stage.id]: optionIndex }))} className={cn("rounded-xl border px-3 py-3 text-left text-sm transition", !quizAnswered && "border-white/10 bg-white/5 hover:border-[#d8a66a]/70 hover:bg-white/10", quizAnswered && optionIndex === stage.quiz.answer && "border-[#91a978] bg-[#91a978]/20 text-[#dbe8d1]", quizAnswered && optionIndex === answer && optionIndex !== stage.quiz.answer && "border-[#d88968] bg-[#d88968]/20 text-[#ffd9ca]", quizAnswered && optionIndex !== answer && optionIndex !== answer && "border-white/5 bg-white/[0.02] text-white/40")}>{option}</button>)}</div>{quizAnswered && <p className={cn("mt-4 flex items-center gap-2 text-sm", quizCorrect ? "text-[#b8d6a5]" : "text-[#f1b09a]")}>{quizCorrect ? <><Trophy size={15} /> ¡Exacto! Tu comprensión va tomando forma.</> : <>Casi. Revisa el enfoque de esta etapa e inténtalo otra vez.</>}</p>}</div><div className="mt-5 flex flex-wrap items-center justify-between gap-3"><button onClick={() => toggleComplete(stage.id)} className={cn("flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-bold transition", isDone ? "bg-[#dce7d5] text-[#526443]" : "bg-[#a26745] text-white hover:bg-[#874e31]")}>{isDone ? <><Check size={16} /> Estudio completado</> : <><BookOpen size={16} /> Marcar como leído</>}</button><button onClick={() => setOpenStage(stage.id + 1 <= stages.length ? stage.id + 1 : 1)} className="flex items-center gap-2 text-sm font-semibold text-[#80624d] hover:text-[#a26745]">Siguiente etapa <ArrowRight size={16} /></button></div></div>}
            </article>;
          })}
        </div>

        <section className="relative mt-16 overflow-hidden rounded-[2rem] bg-[#dfc29e] p-7 sm:p-10"><div className="absolute -right-10 -top-16 size-64 rounded-full border-[24px] border-[#c29462]/25" /><div className="relative max-w-2xl"><div className="mb-4 flex items-center gap-2 text-xs font-bold tracking-[0.18em] text-[#735035] uppercase"><Flame size={16} /> Una ruta, una historia</div><h3 className="font-display text-3xl leading-tight tracking-[-0.02em] sm:text-4xl">No se trata de terminar rápido.<br />Se trata de entender mejor.</h3><p className="mt-4 max-w-xl leading-7 text-[#634d3b]">Cada etapa conecta con la siguiente. Lee con calma, responde el quiz y vuelve cuando quieras: tu avance queda guardado en este navegador.</p><div className="mt-6 flex items-center gap-2 text-sm font-semibold text-[#735035]"><LockKeyhole size={15} /> Progreso privado en tu dispositivo</div></div></section>
      </main>
      <footer className="border-t border-[#d7cabb] px-5 py-8 text-center text-xs text-[#948577]">A tu ritmo · By SARL° · Ruta Bíblica</footer>
    </div>
  );
}
