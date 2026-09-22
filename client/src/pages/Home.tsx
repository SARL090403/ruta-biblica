import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  BookOpen,
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

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setCompleted(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(completed));
  }, [completed]);

  const visibleStages = useMemo(
    () => filter === "all" ? stages : stages.filter((stage) => stage.testament === filter),
    [filter],
  );
  const progress = Math.round((completed.length / stages.length) * 100);

  const toggleComplete = (id: number) => {
    setCompleted((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  };

  const resetProgress = () => {
    setCompleted([]);
    setAnswers({});
    setOpenStage(1);
  };

  return (
    <div className="min-h-screen overflow-hidden bg-[#f5f0e7] text-[#25211d]">
      <header className="relative border-b border-[#d7cabb] bg-[#25211d] text-[#f8f2e7]">
        <div className="absolute inset-0 opacity-25 paper-noise" />
        <div className="relative mx-auto max-w-7xl px-5 pb-16 pt-6 sm:px-8 lg:px-12">
          <nav className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-sm font-semibold tracking-[0.16em] uppercase">
              <span className="grid size-9 place-items-center rounded-full border border-[#d8a66a]/50 bg-[#d8a66a]/10 text-[#e8b97d]"><Compass size={17} /></span>
              Ruta Bíblica
            </div>
            <button onClick={resetProgress} className="flex items-center gap-2 text-xs font-semibold text-[#cfc2b0] transition hover:text-white"><RotateCcw size={14} /> Reiniciar avance</button>
          </nav>
          <div className="mt-16 max-w-3xl animate-rise">
            <p className="mb-5 flex items-center gap-2 text-xs font-bold tracking-[0.24em] text-[#d8a66a] uppercase"><Sparkles size={15} /> La gran historia</p>
            <h1 className="font-display text-5xl leading-[0.98] tracking-[-0.04em] sm:text-7xl">Lee la Biblia.<br /><em className="text-[#d8a66a]">Entiende la historia.</em></h1>
            <p className="mt-7 max-w-xl text-base leading-7 text-[#d8d0c4] sm:text-lg">Una ruta interactiva por los 66 libros: descubre cada etapa, marca tu avance y comprueba lo aprendido con un mini quiz.</p>
          </div>
          <div className="mt-12 grid max-w-3xl gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
            <div>
              <div className="mb-3 flex items-end justify-between text-sm"><span className="text-[#cfc2b0]">Tu recorrido</span><strong className="font-display text-3xl text-[#f8f2e7]">{progress}%</strong></div>
              <Progress value={progress} className="h-2 bg-white/10 [&>div]:bg-[#d8a66a]" />
              <p className="mt-3 text-xs text-[#a99d8d]">{completed.length} de {stages.length} estudios completados</p>
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
              {isOpen && <div className="border-t border-[#e6ddd2] px-5 pb-6 pt-5 sm:px-6"><p className="max-w-xl text-sm leading-6 text-[#62584f]">{stage.summary}</p><div className="mt-4 rounded-xl border-l-2 border-[#c68f61] bg-[#f4eee5] px-4 py-3 text-sm leading-6 text-[#65574b]"><span className="font-bold text-[#a26745]">Enfoque · </span>{stage.focus}</div><a href={getReadingUrl(stage.id)} target="_blank" rel="noreferrer" className="mt-5 flex items-center justify-between gap-3 rounded-2xl border border-[#d9c5ae] bg-[#fffaf2] px-4 py-3 text-sm font-bold text-[#805438] transition hover:border-[#a26745] hover:bg-[#f9eee1]"><span className="flex items-center gap-3"><BookOpen size={18} /> Leer en RVR 1960</span><ExternalLink size={16} /></a><p className="mt-2 text-[11px] text-[#948577]">Se abrirá el pasaje en un lector bíblico externo.</p><div className="mt-6 rounded-2xl bg-[#25211d] p-5 text-[#f8f2e7]"><div className="mb-4 flex items-center gap-2 text-xs font-bold tracking-[0.12em] text-[#e8b97d] uppercase"><CircleHelp size={16} /> Mini quiz</div><p className="mb-4 font-display text-xl leading-tight">{stage.quiz.question}</p><div className="grid gap-2 sm:grid-cols-2">{stage.quiz.options.map((option, optionIndex) => <button key={option} onClick={() => setAnswers((current) => ({ ...current, [stage.id]: optionIndex }))} className={cn("rounded-xl border px-3 py-3 text-left text-sm transition", !quizAnswered && "border-white/10 bg-white/5 hover:border-[#d8a66a]/70 hover:bg-white/10", quizAnswered && optionIndex === stage.quiz.answer && "border-[#91a978] bg-[#91a978]/20 text-[#dbe8d1]", quizAnswered && optionIndex === answer && optionIndex !== stage.quiz.answer && "border-[#d88968] bg-[#d88968]/20 text-[#ffd9ca]", quizAnswered && optionIndex !== answer && optionIndex !== answer && "border-white/5 bg-white/[0.02] text-white/40")}>{option}</button>)}</div>{quizAnswered && <p className={cn("mt-4 flex items-center gap-2 text-sm", quizCorrect ? "text-[#b8d6a5]" : "text-[#f1b09a]")}>{quizCorrect ? <><Trophy size={15} /> ¡Exacto! Tu comprensión va tomando forma.</> : <>Casi. Revisa el enfoque de esta etapa e inténtalo otra vez.</>}</p>}</div><div className="mt-5 flex flex-wrap items-center justify-between gap-3"><button onClick={() => toggleComplete(stage.id)} className={cn("flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-bold transition", isDone ? "bg-[#dce7d5] text-[#526443]" : "bg-[#a26745] text-white hover:bg-[#874e31]")}>{isDone ? <><Check size={16} /> Estudio completado</> : <><BookOpen size={16} /> Marcar como leído</>}</button><button onClick={() => setOpenStage(stage.id + 1 <= stages.length ? stage.id + 1 : 1)} className="flex items-center gap-2 text-sm font-semibold text-[#80624d] hover:text-[#a26745]">Siguiente etapa <ArrowRight size={16} /></button></div></div>}
            </article>;
          })}
        </div>

        <section className="relative mt-16 overflow-hidden rounded-[2rem] bg-[#dfc29e] p-7 sm:p-10"><div className="absolute -right-10 -top-16 size-64 rounded-full border-[24px] border-[#c29462]/25" /><div className="relative max-w-2xl"><div className="mb-4 flex items-center gap-2 text-xs font-bold tracking-[0.18em] text-[#735035] uppercase"><Flame size={16} /> Una ruta, una historia</div><h3 className="font-display text-3xl leading-tight tracking-[-0.02em] sm:text-4xl">No se trata de terminar rápido.<br />Se trata de entender mejor.</h3><p className="mt-4 max-w-xl leading-7 text-[#634d3b]">Cada etapa conecta con la siguiente. Lee con calma, responde el quiz y vuelve cuando quieras: tu avance queda guardado en este navegador.</p><div className="mt-6 flex items-center gap-2 text-sm font-semibold text-[#735035]"><LockKeyhole size={15} /> Progreso privado en tu dispositivo</div></div></section>
      </main>
      <footer className="border-t border-[#d7cabb] px-5 py-8 text-center text-xs text-[#948577]">A tu ritmo · By SARL° · Ruta Bíblica</footer>
    </div>
  );
}
