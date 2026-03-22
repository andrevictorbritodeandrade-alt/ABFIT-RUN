import React, { useState, useEffect, useMemo } from 'react';
import { 
  Activity, Users, LogOut, CheckCircle2, Clock, 
  Target, Plus, Save, Trash2, X, ArrowRight, 
  Timer, AlertCircle, Sparkles, Phone, Lock, 
  ChevronDown, Dumbbell, Ruler, Scale, HeartPulse,
  Flame, Mountain, Zap, Repeat, LayoutDashboard,
  ClipboardList, Search, UserCheck, CalendarDays,
  Stethoscope, FileText, Info, Brain, ChevronRight, ChevronLeft,
  Play, BarChart3, Download, Check, CloudUpload, CloudDownload
} from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { 
  getFirestore, collection, doc, addDoc, deleteDoc, onSnapshot, setDoc, query, where, getDocs, getDoc
} from 'firebase/firestore';
import { 
  getAuth, signInAnonymously, onAuthStateChanged 
} from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

// --- CONFIGURAÇÃO FIREBASE (PROJETO CHAVEUNICA) ---
const firebaseConfig = {
  apiKey: "AIzaSyD_C_yn_RyBSopY7Tb9aqLW8akkXJR94Vg",
  authDomain: "chaveunica-225e0.firebaseapp.com",
  projectId: "chaveunica-225e0",
  storageBucket: "chaveunica-225e0.firebasestorage.app",
  messagingSenderId: "324211037832",
  appId: "1:324211037832:web:362a46e6446ea37b85b13d",
  measurementId: "G-MRBDJC3QXZ"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app); // Métricas de uso
const auth = getAuth(app); // Autenticação
const db = getFirestore(app); // Banco de Dados em Tempo Real

// ID da coleção raiz para separar dados desta versão do app
const appId = 'runtrack-elite-v2';

// --- CUSTOM ICONS (SVG) ---

const HeartPulseLogo = ({ size = 120, className = "" }: { size?: number, className?: string }) => (
  <div className={`rounded-full bg-brand-neon flex items-center justify-center shadow-[0_0_50px_rgba(207,255,4,0.5)] ${className}`} style={{ width: size, height: size }}>
    <svg width={size * 0.5} height={size * 0.5} viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  </div>
);

// --- COMPONENTES DE UI (DESIGN SYSTEM 2026) ---

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  glass?: boolean;
}

const Card: React.FC<CardProps> = ({ children, className = "", onClick, glass = false }) => (
  <div 
    onClick={onClick}
    className={`
      rounded-3xl p-6 transition-all duration-300 relative overflow-hidden group
      ${glass 
        ? 'glass-panel' 
        : 'bg-brand-surface border border-zinc-800'
      }
      ${onClick ? 'cursor-pointer hover:border-brand-neon/50 hover:shadow-[0_0_30px_-10px_rgba(207,255,4,0.15)] hover:-translate-y-1' : ''} 
      ${className}
    `}
  >
    {children}
  </div>
);

const Button = ({ children, onClick, variant = "primary", className = "", loading = false, disabled = false }: any) => {
  const variants: any = {
    primary: "bg-brand-neon text-brand-dark hover:bg-brand-neonHover neon-glow font-display",
    secondary: "bg-brand-light text-white hover:bg-zinc-700 border border-zinc-700 font-display",
    success: "bg-emerald-500 text-white hover:bg-emerald-400 shadow-[0_0_20px_-5px_rgba(16,185,129,0.4)] font-display",
    danger: "bg-red-500/10 text-red-500 border border-red-500/50 hover:bg-red-500 hover:text-white font-display",
    ghost: "bg-transparent hover:bg-white/5 text-zinc-400 hover:text-white font-display",
    outline: "border-2 border-zinc-700 text-zinc-300 hover:border-brand-neon hover:text-brand-neon bg-transparent font-display"
  };
  return (
    <button 
      onClick={onClick} 
      disabled={disabled || loading}
      className={`px-8 py-4 rounded-xl font-bold uppercase tracking-wider text-xs transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
    >
      {loading ? <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" /> : children}
    </button>
  );
};

const Input = ({ label, value, onChange, type = "text", placeholder, className = "" }: any) => (
  <div className="flex flex-col gap-2 w-full group">
    {label && <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 group-focus-within:text-brand-neon transition-colors ml-1 font-display">{label}</label>}
    <input 
      type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} 
      className={`px-6 py-4 rounded-2xl bg-brand-light/50 border border-zinc-800 focus:border-brand-neon/50 focus:bg-brand-light focus:ring-1 focus:ring-brand-neon/50 outline-none font-bold text-white placeholder:text-zinc-600 w-full transition-all ${className}`} 
    />
  </div>
);

const TextArea = ({ label, value, onChange, placeholder, className = "" }: any) => (
  <div className="flex flex-col gap-2 w-full group">
    {label && <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 group-focus-within:text-brand-neon transition-colors ml-1 font-display">{label}</label>}
    <textarea 
      value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={4}
      className={`px-6 py-4 rounded-2xl bg-brand-light/50 border border-zinc-800 focus:border-brand-neon/50 focus:bg-brand-light focus:ring-1 focus:ring-brand-neon/50 outline-none font-bold text-white placeholder:text-zinc-600 w-full transition-all resize-none ${className}`} 
    />
  </div>
);

const Select = ({ label, value, onChange, options }: any) => (
  <div className="flex flex-col gap-2 w-full relative group">
    {label && <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 group-focus-within:text-brand-neon transition-colors ml-1 font-display">{label}</label>}
    <div className="relative">
      <select 
        value={value} onChange={(e) => onChange(e.target.value)} 
        className="w-full px-6 py-4 rounded-2xl bg-brand-light/50 border border-zinc-800 focus:border-brand-neon/50 focus:bg-brand-light focus:ring-1 focus:ring-brand-neon/50 outline-none font-bold appearance-none cursor-pointer text-white pr-10 transition-all"
      >
        {options.map((o: any) => <option key={o.value} value={o.value} className="bg-brand-surface text-zinc-300">{o.label}</option>)}
      </select>
      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500 group-hover:text-brand-neon transition-colors" size={18} />
    </div>
  </div>
);

const Footer = () => (
    <footer className="w-full py-12 mt-auto text-center relative z-10 border-t border-white/5 bg-transparent">
        <h6 className="text-white font-black italic uppercase tracking-wider text-sm md:text-base font-display mb-2">
            ABFIT RUN - GESTÃO DE PERFORMANCE
        </h6>
        <p className="text-zinc-500 text-[10px] uppercase tracking-widest font-bold mb-6">
            Desenvolvido por André Brito
        </p>
        <a href="https://wa.me/5521994527694" target="_blank" rel="noreferrer" 
           className="inline-flex items-center gap-3 bg-white/5 hover:bg-white/10 hover:border-brand-neon/30 border border-white/10 rounded-full px-6 py-3 transition-all group backdrop-blur-sm">
           <Phone size={14} className="text-brand-neon group-hover:scale-110 transition-transform" />
           <span className="text-xs font-bold text-zinc-300 group-hover:text-white tracking-wider">21 994 527 694</span>
        </a>
    </footer>
);

// --- TYPES ---
type UserRole = 'professor' | 'student';

const WORKOUT_LABELS: Record<string, string> = {
    'longao': 'Longão',
    'tiro': 'Intervalado',
    'fartlek': 'Fartlek',
    'ritmo': 'Ritmo / Tempo',
    'subida': 'Subida',
    'regenerativo': 'Regenerativo'
};

interface UserProfile {
  id: string;
  professorId?: string;
  name: string;
  phone: string; 
  role: UserRole;
  anamnesisComplete: boolean;
  birthDate?: string;
  gender?: string;
  weight?: string;
  height?: string;
  restingHeartRate?: string;
  maxHeartRate?: string;
  injuries?: string;
  medications?: string;
  surgery?: string;
  medicalClearance?: boolean;
  runningYears?: string;
  weeklyVolume?: string;
  recentPace?: string;
  best5k?: string;
  best10k?: string;
  mainGoal?: string;
  targetDistance?: string;
  availabilityDays?: string;
  createdAt: string;
}

interface WorkoutModel {
  id: string;
  studentId: string;
  type: string;
  dayOfWeek: string;
  warmupTime?: string;
  cooldownTime?: string;
  sets?: string;
  reps?: string;
  stimulusTime?: string; // Usado para Tempo ou Distancia do estimulo
  recoveryTime?: string;
  speed?: string; // Velocidade em Km/h
  description?: string;
  createdAt: string;
}

interface CheckIn {
  id: string;
  studentId: string;
  workoutId: string;
  date: string; // YYYY-MM-DD
  completedAt: string;
  status: 'completed';
}

// --- UTILS ---
const getDayName = (date: Date) => {
    const days = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    return days[date.getDay()];
};

const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
};

const calculateWorkoutTime = (w: WorkoutModel, prog?: any) => {
    let total = 0;
    total += Number(w.warmupTime) || 0;
    total += Number(w.cooldownTime) || 0;
    
    const sets = Number(w.sets) || 1;
    const recovery = Number(w.recoveryTime) || 0;
    
    let stimulusTime = 0;
    const stimVal = prog?.stimulus || w.stimulusTime;
    const speedVal = prog?.speed || w.speed;

    if (stimVal) {
        if (!isNaN(Number(stimVal))) {
            stimulusTime = Number(stimVal);
        } else if (typeof stimVal === 'string' && stimVal.toLowerCase().includes('km')) {
            const dist = parseFloat(stimVal.replace(',', '.'));
            const speed = parseFloat(typeof speedVal === 'string' ? speedVal.replace(',', '.') : '0');
            if (speed > 0 && !isNaN(dist)) {
                stimulusTime = (dist / speed) * 60;
            }
        }
    }
    
    total += sets * (stimulusTime + recovery);
    return Math.round(total);
};

// Global Sync State
export const syncState = {
    pendingWrites: false,
    fromCache: false,
    listeners: [] as Function[],
    update(pending: boolean, cache: boolean) {
        this.pendingWrites = pending;
        this.fromCache = cache;
        this.listeners.forEach(l => l({ pendingWrites: this.pendingWrites, fromCache: this.fromCache }));
    }
};

function useSyncState() {
    const [state, setState] = useState({ pendingWrites: false, fromCache: false });
    useEffect(() => {
        const handler = (s: any) => setState(s);
        syncState.listeners.push(handler);
        return () => { syncState.listeners = syncState.listeners.filter(l => l !== handler); };
    }, []);
    return state;
}

const SyncIndicator = () => {
    const { pendingWrites, fromCache } = useSyncState();
    
    return (
        <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest bg-black/40 px-3 py-1.5 rounded-full border border-white/5">
            {pendingWrites ? (
                <span className="flex items-center gap-1 text-amber-500"><CloudUpload size={12} className="animate-bounce" /> Enviando...</span>
            ) : (
                <span className="flex items-center gap-1 text-emerald-500"><CloudUpload size={12} /> Salvo</span>
            )}
            <span className="text-zinc-700">|</span>
            {fromCache ? (
                <span className="flex items-center gap-1 text-amber-500"><CloudDownload size={12} className="animate-pulse" /> Offline</span>
            ) : (
                <span className="flex items-center gap-1 text-emerald-500"><CloudDownload size={12} /> Sincronizado</span>
            )}
        </div>
    );
};

// --- COMPACT WORKOUT CARD COMPONENT (JUSTIFIED / ONE LINE) ---

const CompactWorkoutCard: React.FC<{ 
    workout: WorkoutModel, 
    date?: Date,
    isCompleted?: boolean,
    onCheckIn?: () => void,
    readonly?: boolean,
    onDelete?: () => void
}> = ({ workout, date, isCompleted, onCheckIn, readonly = false, onDelete }) => {
    
    // PROGRESSION LOGIC (OVERLOAD)
    const calculateProgression = () => {
        if (!date || !workout.createdAt) return { speed: workout.speed, stimulus: workout.stimulusTime, increase: 0 };
        
        const created = new Date(workout.createdAt);
        const targetDate = new Date(date);
        const diffTime = Math.abs(targetDate.getTime() - created.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
        
        let increasePercentage = 0;
        if (diffDays > 28) increasePercentage = 0.10; // > 4 weeks = 10%
        else if (diffDays > 14) increasePercentage = 0.05; // > 2 weeks = 5%

        if (increasePercentage === 0) return { speed: workout.speed, stimulus: workout.stimulusTime, increase: 0 };

        let newSpeed = workout.speed;
        let newStimulus = workout.stimulusTime;

        // Apply to speed if numeric
        if (workout.speed && typeof workout.speed === 'string' && !isNaN(parseFloat(workout.speed.replace(',','.')))) {
             const val = parseFloat(workout.speed.replace(',','.'));
             newSpeed = (val * (1 + increasePercentage)).toFixed(1).replace('.', ',');
        }

        // Apply to stimulus time if purely numeric (minutes)
        if (workout.stimulusTime && typeof workout.stimulusTime === 'string' && !isNaN(parseFloat(workout.stimulusTime))) {
             const val = parseFloat(workout.stimulusTime);
             newStimulus = Math.round(val * (1 + increasePercentage)).toString();
        }

        return { speed: newSpeed, stimulus: newStimulus, increase: increasePercentage * 100 };
    };

    const prog = calculateProgression();

    return (
        <div 
            onClick={!readonly && onCheckIn ? onCheckIn : undefined}
            className={`
                relative w-full p-5 rounded-xl border bg-[#050505] transition-all
                ${isCompleted 
                    ? 'border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.2)]' 
                    : 'border-zinc-800 hover:border-zinc-600'
                }
                ${!readonly ? 'cursor-pointer' : ''}
            `}
        >
            {onDelete && (
                <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="absolute top-2 right-2 text-zinc-600 hover:text-red-500">
                    <Trash2 size={14} />
                </button>
            )}

            {/* HEADER: DATE & TYPE */}
            <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 bg-zinc-900 px-2 py-1 rounded">
                        {date ? date.toLocaleDateString('pt-BR', {day: '2-digit', month: '2-digit'}) : workout.dayOfWeek}
                    </span>
                    <span className="text-xs font-black italic uppercase text-white font-display">
                        {WORKOUT_LABELS[workout.type] || workout.type}
                    </span>
                </div>
                {prog.increase > 0 && (
                    <span className="text-[9px] font-bold text-brand-neon bg-brand-neon/10 px-2 py-0.5 rounded border border-brand-neon/20 animate-pulse">
                        +{prog.increase}% INTENSIDADE
                    </span>
                )}
                 {isCompleted && (
                    <div className="flex items-center gap-1 text-emerald-500">
                        <CheckCircle2 size={14} fill="currentColor" className="text-emerald-900" />
                        <span className="text-[9px] font-black uppercase">Feito</span>
                    </div>
                )}
            </div>

            {/* THE STRIP: JUSTIFIED CONTENT */}
            <div className="flex flex-col gap-3 text-sm font-sans tracking-tight text-zinc-300 leading-relaxed bg-zinc-900/50 p-4 rounded-xl border border-white/5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                        <span className="font-bold text-white whitespace-nowrap">{workout.warmupTime || '0'}' AQ</span>
                        <span className="text-red-600 font-bold">+</span>
                    </div>
                    
                    <div className="flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-lg border border-white/5 flex-1 justify-center min-w-[200px]">
                        <span className="font-bold text-white">{workout.sets || '1'}x</span>
                        <span className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider">blocos</span>
                        <span className="text-white font-bold whitespace-nowrap">{prog.stimulus || '0'} {isNaN(Number(prog.stimulus)) ? '' : "'"} CO</span>
                        {prog.speed && prog.speed !== '0' && <span className="text-brand-neon text-xs font-bold">@{prog.speed}km/h</span>}
                        <span className="text-zinc-500 font-bold">:</span>
                        <span className="text-zinc-400 whitespace-nowrap font-bold">{workout.recoveryTime || '0'}' REC</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-red-600 font-bold">+</span>
                        <span className="font-bold text-white whitespace-nowrap">{workout.cooldownTime || '0'}' DES</span>
                    </div>
                </div>
                
                <div className="flex justify-between items-center pt-2 border-t border-white/5">
                    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Tempo Estimado</span>
                    <span className="text-brand-neon font-black text-sm">{calculateWorkoutTime(workout, prog)} MINUTOS</span>
                </div>
            </div>

            {workout.description && (
                <p className="mt-4 text-xs text-zinc-300 font-medium uppercase tracking-wide leading-relaxed text-justify font-sans">
                    <span className="text-brand-neon font-bold">OBS:</span> {workout.description}
                </p>
            )}
        </div>
    )
}

const WorkoutLegend = () => (
    <div className="grid grid-cols-4 gap-2 mt-6 pt-6 border-t border-white/5 opacity-50 hover:opacity-100 transition-opacity">
        <div className="text-center">
            <span className="block text-[10px] font-black text-zinc-400">AQ</span>
            <span className="block text-[8px] font-bold text-zinc-600 uppercase tracking-wider">Aquece</span>
        </div>
        <div className="text-center">
            <span className="block text-[10px] font-black text-white">CO</span>
            <span className="block text-[8px] font-bold text-zinc-600 uppercase tracking-wider">Corrida</span>
        </div>
        <div className="text-center">
            <span className="block text-[10px] font-black text-zinc-400">REC</span>
            <span className="block text-[8px] font-bold text-zinc-600 uppercase tracking-wider">Recupera</span>
        </div>
        <div className="text-center">
            <span className="block text-[10px] font-black text-zinc-400">DES</span>
            <span className="block text-[8px] font-bold text-zinc-600 uppercase tracking-wider">Desaquece</span>
        </div>
    </div>
);

// --- MAIN COMPONENT ---

export default function App() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [activeProfile, setActiveProfile] = useState<UserProfile | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [view, setView] = useState<'login' | 'student-select' | 'dashboard' | 'new-athlete-assessment'>('login');
  
  // Data State
  const [students, setStudents] = useState<UserProfile[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // PWA Install State
  const [installPrompt, setInstallPrompt] = useState<any>(null);

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setInstallPrompt(e);
    });

    signInAnonymously(auth).catch((error) => {
      console.error("Auth failed:", error);
      setCurrentUser({ uid: 'fallback-user', isAnonymous: true });
      setLoading(false);
    });
    
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      if (u) {
        setCurrentUser(u);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!currentUser) return;

    const seedAndre = async () => {
      try {
        const q = query(collection(db, 'artifacts', appId, 'users'), where('name', '==', 'André Brito'));
        const snap = await getDocs(q);
        let andre = snap.docs.length > 0 ? { id: snap.docs[0].id, ...snap.docs[0].data() } as UserProfile : undefined;
        
        if (!andre) {
          const q2 = query(collection(db, 'artifacts', appId, 'users'), where('name', '==', 'Andre Brito'));
          const snap2 = await getDocs(q2);
          andre = snap2.docs.length > 0 ? { id: snap2.docs[0].id, ...snap2.docs[0].data() } as UserProfile : undefined;
        }
        
        if (!andre) {
          const andreData = {
            name: 'André Brito',
            phone: '11999999999',
            role: 'student',
            anamnesisComplete: true,
            gender: 'male',
            birthDate: '1989-01-01', // 36 years old
            weight: '90', // IMC 30.6 -> height 171
            height: '171',
            restingHeartRate: '75',
            maxHeartRate: '184',
            mainGoal: 'health',
            injuries: '⚠️ Patela esquerda já saiu do lugar 4 vezes em um intervalo de 14 meses.',
            medications: 'BUP, Venvanse, Vitaminas bariátricas, Topiramato, Sertralina',
            weeklyVolume: '250',
            createdAt: new Date().toISOString()
          };
          const docRef = await addDoc(collection(db, 'artifacts', appId, 'users'), andreData);
          andre = { id: docRef.id, ...andreData } as UserProfile;
        }
        
        const wq = collection(db, 'artifacts', appId, 'workouts');
        const wsnap = await getDocs(wq);
        const workouts = wsnap.docs.map(d => ({id: d.id, ...d.data()} as WorkoutModel));
        const andreWorkouts = workouts.filter(w => w.studentId === andre!.id);
        
        if (andreWorkouts.length === 0) {
          const newWorkouts = [
            {
              studentId: andre!.id,
              type: 'regenerativo',
              dayOfWeek: 'Segunda',
              warmupTime: '10',
              cooldownTime: '10',
              sets: '10',
              reps: '1',
              stimulusTime: '1',
              recoveryTime: '2',
              speed: '9',
              description: '',
              createdAt: new Date().toISOString()
            },
            {
              studentId: andre!.id,
              type: 'longao',
              dayOfWeek: 'Terça',
              warmupTime: '10',
              cooldownTime: '10',
              sets: '1',
              reps: '1',
              stimulusTime: '30',
              recoveryTime: '0',
              speed: '6',
              description: 'Caminhada contínua forte',
              createdAt: new Date().toISOString()
            },
            {
              studentId: andre!.id,
              type: 'ritmo',
              dayOfWeek: 'Quarta',
              warmupTime: '10',
              cooldownTime: '10',
              sets: '6',
              reps: '1',
              stimulusTime: '3',
              recoveryTime: '3',
              speed: '8',
              description: '',
              createdAt: new Date().toISOString()
            },
            {
              studentId: andre!.id,
              type: 'longao',
              dayOfWeek: 'Quinta',
              warmupTime: '10',
              cooldownTime: '10',
              sets: '1',
              reps: '1',
              stimulusTime: '30',
              recoveryTime: '0',
              speed: '6',
              description: 'Caminhada contínua forte',
              createdAt: new Date().toISOString()
            },
            {
              studentId: andre!.id,
              type: 'tiro',
              dayOfWeek: 'Sexta',
              warmupTime: '10',
              cooldownTime: '10',
              sets: '8',
              reps: '1',
              stimulusTime: '2',
              recoveryTime: '1',
              speed: '8',
              description: '',
              createdAt: new Date().toISOString()
            }
          ];
          for (const w of newWorkouts) {
            await addDoc(collection(db, 'artifacts', appId, 'workouts'), w);
          }
        }
      } catch (e) {
        console.error("Error seeding Andre Brito:", e);
      }
    };
    
    const seedMarcelly = async () => {
      try {
        const q = query(collection(db, 'artifacts', appId, 'users'), where('name', '==', 'Marcelly Bispo'));
        const snap = await getDocs(q);
        let marcelly = snap.docs.length > 0 ? { id: snap.docs[0].id, ...snap.docs[0].data() } as UserProfile : undefined;
        
        let marcellyWorkouts: WorkoutModel[] = [];
        if (marcelly) {
            const wq = query(collection(db, 'artifacts', appId, 'workouts'), where('studentId', '==', marcelly.id));
            const wsnap = await getDocs(wq);
            marcellyWorkouts = wsnap.docs.map(d => ({id: d.id, ...d.data()} as WorkoutModel));
        }

        // Verifica se precisa atualizar (se não existe, se o peso está errado, ou se tem menos de 5 treinos)
        const needsUpdate = !marcelly || marcelly.weight !== '58.5' || marcelly.restingHeartRate !== '75' || marcellyWorkouts.length < 5;

        if (!needsUpdate) return;

        const marcellyData = {
          name: 'Marcelly Bispo',
          phone: marcelly ? marcelly.phone : '11988888888',
          role: 'student',
          anamnesisComplete: true,
          gender: 'female',
          birthDate: '1990-01-01', // 34 years old in 2024/2026
          weight: '58.5', // IMC 21.5 -> height 165
          height: '165',
          restingHeartRate: '75',
          maxHeartRate: '192',
          mainGoal: 'health',
          injuries: 'Nada',
          medications: 'Nada',
          weeklyVolume: '150',
          createdAt: marcelly ? marcelly.createdAt : new Date().toISOString()
        };

        if (!marcelly) {
          const docRef = await addDoc(collection(db, 'artifacts', appId, 'users'), marcellyData);
          marcelly = { id: docRef.id, ...marcellyData } as UserProfile;
        } else {
          await setDoc(doc(db, 'artifacts', appId, 'users', marcelly.id), marcellyData, { merge: true });
          marcelly = { id: marcelly.id, ...marcellyData } as UserProfile;
        }
        
        // Delete old workouts to avoid duplicates
        for (const w of marcellyWorkouts) {
          await deleteDoc(doc(db, 'artifacts', appId, 'workouts', w.id));
        }
        
        const newWorkouts = [
            {
              studentId: marcelly!.id,
              type: 'tiro', // Intervalado
              dayOfWeek: 'Segunda',
              warmupTime: '10',
              cooldownTime: '5',
              sets: '5',
              reps: '1',
              stimulusTime: '1',
              recoveryTime: '2',
              speed: '8',
              description: '',
              createdAt: new Date().toISOString()
            },
            {
              studentId: marcelly!.id,
              type: 'longao',
              dayOfWeek: 'Terça',
              warmupTime: '5',
              cooldownTime: '5',
              sets: '1',
              reps: '1',
              stimulusTime: '20',
              recoveryTime: '0',
              speed: '6',
              description: 'Caminhada contínua forte',
              createdAt: new Date().toISOString()
            },
            {
              studentId: marcelly!.id,
              type: 'tiro', // Intervalado
              dayOfWeek: 'Quarta',
              warmupTime: '10',
              cooldownTime: '5',
              sets: '5',
              reps: '1',
              stimulusTime: '1',
              recoveryTime: '2',
              speed: '8',
              description: '',
              createdAt: new Date().toISOString()
            },
            {
              studentId: marcelly!.id,
              type: 'longao',
              dayOfWeek: 'Quinta',
              warmupTime: '5',
              cooldownTime: '5',
              sets: '1',
              reps: '1',
              stimulusTime: '20',
              recoveryTime: '0',
              speed: '6',
              description: 'Caminhada contínua forte',
              createdAt: new Date().toISOString()
            },
            {
              studentId: marcelly!.id,
              type: 'tiro', // Intervalado
              dayOfWeek: 'Sexta',
              warmupTime: '10',
              cooldownTime: '5',
              sets: '5',
              reps: '1',
              stimulusTime: '1',
              recoveryTime: '2',
              speed: '8',
              description: '',
              createdAt: new Date().toISOString()
            }
          ];
          for (const w of newWorkouts) {
            await addDoc(collection(db, 'artifacts', appId, 'workouts'), w);
          }
      } catch (e) {
        console.error("Error seeding Marcelly Bispo:", e);
      }
    };
    
    seedAndre();
    seedMarcelly();
  }, [currentUser]);

  useEffect(() => {
    try {
      const q = collection(db, 'artifacts', appId, 'users');
      const unsub = onSnapshot(q, { includeMetadataChanges: true }, (snap) => {
        syncState.update(snap.metadata.hasPendingWrites, snap.metadata.fromCache);
        const allUsers = snap.docs.map(d => ({ id: d.id, ...d.data() } as UserProfile));
        setStudents(allUsers.filter(u => u.role === 'student'));
      }, (error) => console.error(error));
      return () => unsub();
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Login Handlers
  const loginAsProfessor = () => {
    setRole('professor');
    setView('dashboard');
  };

  const loginAsStudent = (profile: UserProfile) => {
    setRole('student');
    setSelectedStudentId(profile.id);
    setView('dashboard');
  };

  const handleInstallClick = () => {
    if (installPrompt) {
        installPrompt.prompt();
        installPrompt.userChoice.then((choiceResult: any) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('User accepted the install prompt');
            }
            setInstallPrompt(null);
        });
    }
  };

  if (loading) return <div className="h-screen w-full flex items-center justify-center bg-brand-dark"><div className="w-10 h-10 border-4 border-brand-neon border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="min-h-screen bg-brand-dark text-white font-sans selection:bg-brand-neon selection:text-brand-dark flex flex-col">
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-brand-neon/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-zinc-900/10 rounded-full blur-[100px]" />
      </div>

      {/* Header */}
      {view !== 'login' && view !== 'new-athlete-assessment' && (
        <header className="fixed top-0 left-0 right-0 h-20 glass-panel z-50 px-6 flex items-center justify-between border-b border-white/5">
            <div className="flex items-center gap-3">
                <div className="text-brand-neon">
                    <HeartPulseLogo size={24} className="shadow-none !bg-transparent text-brand-neon" />
                </div>
                <div>
                    <h1 className="text-xl font-black italic uppercase tracking-tighter leading-none text-white font-display">ABFIT <span className="text-brand-neon">RUN</span></h1>
                    <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Elite Performance</p>
                </div>
            </div>
            
            <div className="flex items-center gap-4">
                <SyncIndicator />
                {role === 'professor' && selectedStudentId && (
                   <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-brand-light/50 rounded-full border border-white/10">
                      <UserCheck size={14} className="text-brand-neon"/>
                      <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider">{students.find(s => s.id === selectedStudentId)?.name}</span>
                   </div> 
                )}
                <button onClick={() => { setView('login'); setRole(null); setActiveProfile(null); setSelectedStudentId(null); }} className="p-2 hover:bg-white/10 rounded-full text-zinc-400 hover:text-white transition-colors">
                    <LogOut size={20} />
                </button>
            </div>
        </header>
      )}

      {/* Main Content */}
      <main className={`relative z-10 transition-all duration-500 flex-1 ${view !== 'login' && view !== 'new-athlete-assessment' ? 'pt-28 pb-12 px-6' : ''}`}>
        
        {view === 'login' && (
          <LoginScreen 
            onSelectProfessor={loginAsProfessor} 
            onSelectStudent={() => setView('student-select')}
            installPrompt={installPrompt}
            onInstall={handleInstallClick}
          />
        )}

        {view === 'student-select' && (
          <StudentLoginList 
            students={students} 
            onLogin={loginAsStudent} 
            onBack={() => setView('login')} 
          />
        )}

        {view === 'new-athlete-assessment' && role === 'professor' && (
            <AthleteAssessmentWizard 
                currentUser={currentUser}
                onCancel={() => setView('dashboard')}
                onComplete={(newStudentId) => {
                    setSelectedStudentId(newStudentId);
                    setView('dashboard');
                }}
            />
        )}

        {view === 'dashboard' && role === 'professor' && (
            <ProfessorDashboard 
                currentUser={currentUser}
                students={students} 
                selectedStudentId={selectedStudentId}
                onSelectStudent={setSelectedStudentId}
                onNewStudent={() => setView('new-athlete-assessment')}
            />
        )}

        {view === 'dashboard' && role === 'student' && selectedStudentId && (
             <StudentView profile={students.find(s => s.id === selectedStudentId)!} />
        )}

      </main>

      <Footer />
    </div>
  );
}

// --- SUB-SCREENS ---

function LoginScreen({ onSelectProfessor, onSelectStudent, installPrompt, onInstall }: any) {
    return (
        <div className="h-full flex flex-col p-6 relative overflow-hidden items-center justify-center">
             {/* Geometric Background Shapes */}
             <div className="absolute inset-0 z-0 opacity-20 overflow-hidden pointer-events-none">
                 <div className="absolute top-0 right-0 w-[80vw] h-[80vw] bg-[#0f172a] rotate-12 origin-top-right transform translate-x-1/3 -translate-y-1/3" />
                 <div className="absolute bottom-0 left-0 w-[90vw] h-[90vw] bg-[#0f172a] -rotate-12 origin-bottom-left transform -translate-x-1/3 translate-y-1/3" />
             </div>

             {/* INSTALL BUTTON (TOP RIGHT) */}
             {installPrompt && (
                <button 
                    onClick={onInstall}
                    className="absolute top-6 right-6 z-50 flex items-center gap-2 bg-brand-neon/10 border border-brand-neon/50 text-brand-neon px-4 py-2 rounded-full font-black uppercase text-[10px] tracking-widest hover:bg-brand-neon hover:text-brand-dark transition-all animate-bounce"
                >
                    <Download size={14} /> Instalar App
                </button>
             )}
             
             {/* HEADER AREA - CENTERED */}
            <div className="flex-1 flex flex-col items-center justify-center relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700 w-full max-w-md my-auto">
                
                {/* HEART PULSE LOGO */}
                <div className="mb-12">
                     <HeartPulseLogo size={140} />
                </div>

                {/* TEXT */}
                <h1 className="text-6xl font-black italic tracking-tighter text-white mb-2 font-display text-center leading-none">
                    ABFIT <span className="text-brand-neon">RUN</span>
                </h1>
                
                {/* DIVIDER */}
                <div className="h-[2px] w-full bg-brand-neon mb-4 shadow-[0_0_10px_#CFFF04]"></div>
                
                <p className="text-white text-xs font-bold uppercase tracking-[0.2em] font-display mb-20 text-center">
                    INTELIGÊNCIA DE PERFORMANCE
                </p>

                {/* BUTTONS AREA - BOTTOM */}
                <div className="w-full grid grid-cols-2 gap-4">
                    {/* COACH BUTTON */}
                    <button 
                        onClick={onSelectProfessor}
                        className="group relative h-48 bg-[#0f172a]/60 backdrop-blur-md rounded-2xl border border-white/10 flex flex-col items-center justify-center p-4 hover:border-brand-neon/50 transition-all duration-300 active:scale-95"
                    >
                         <ClipboardList className="w-12 h-12 text-brand-neon mb-4 drop-shadow-[0_0_8px_rgba(207,255,4,0.5)]" />
                         <h2 className="text-white font-black uppercase text-sm leading-none mb-2 font-display tracking-wider">TREINADOR</h2>
                         <p className="text-[9px] text-zinc-300 font-bold uppercase tracking-widest text-center">CENTRO DE COMANDO</p>
                    </button>

                    {/* ATHLETE BUTTON */}
                    <button 
                        onClick={onSelectStudent}
                        className="group relative h-48 bg-[#0f172a]/60 backdrop-blur-md rounded-2xl border border-white/10 flex flex-col items-center justify-center p-4 hover:border-brand-neon/50 transition-all duration-300 active:scale-95"
                    >
                         <HeartPulse className="w-12 h-12 text-brand-neon mb-4 drop-shadow-[0_0_8px_rgba(207,255,4,0.5)]" />
                         <h2 className="text-white font-black uppercase text-sm leading-none mb-2 font-display tracking-wider">ATLETA</h2>
                         <p className="text-[9px] text-zinc-300 font-bold uppercase tracking-widest text-center">ZONA DE PERFORMANCE</p>
                    </button>
                 </div>
            </div>
        </div>
    )
}

function StudentLoginList({ students, onLogin, onBack }: { students: UserProfile[], onLogin: (p: UserProfile) => void, onBack: () => void }) {
    const [searchTerm, setSearchTerm] = useState("");

    const filtered = students.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="max-w-2xl mx-auto pt-10">
            <div className="flex items-center gap-4 mb-10">
                <button onClick={onBack} className="p-4 bg-brand-surface rounded-full border border-white/10 text-zinc-400 hover:text-white transition-all hover:border-brand-neon/50">
                    <ArrowRight className="rotate-180" size={20} />
                </button>
                <h2 className="text-4xl font-black uppercase italic tracking-tighter text-white font-display">Selecionar Perfil</h2>
            </div>

            <div className="relative mb-8 group">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-brand-neon transition-colors" size={24} />
                <input 
                    type="text" 
                    placeholder="BUSCAR ATLETA..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-16 pr-6 py-6 rounded-[2rem] bg-brand-surface border border-zinc-800 focus:border-brand-neon focus:ring-1 focus:ring-brand-neon outline-none font-black uppercase text-xl text-white placeholder:text-zinc-700 transition-all font-display"
                />
            </div>

            <div className="grid gap-3">
                {filtered.map(student => (
                    <div key={student.id} onClick={() => onLogin(student)} 
                        className="flex items-center justify-between p-5 bg-brand-light/30 border border-transparent hover:border-brand-neon/30 hover:bg-brand-light/50 rounded-2xl cursor-pointer transition-all group">
                        <div className="flex items-center gap-5">
                            <div className="w-12 h-12 bg-brand-dark rounded-xl flex items-center justify-center text-zinc-500 font-black text-lg group-hover:text-brand-neon transition-colors border border-white/5 font-display">
                                {student.name.charAt(0)}
                            </div>
                            <div>
                                <h3 className="font-black text-lg text-white uppercase italic tracking-tight group-hover:translate-x-1 transition-transform font-display">{student.name}</h3>
                                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Atleta</p>
                            </div>
                        </div>
                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-zinc-600 group-hover:text-brand-neon group-hover:translate-x-1 transition-all">
                            <ChevronRight size={24} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

function AthleteAssessmentWizard({ onCancel, onComplete, currentUser }: { onCancel: () => void, onComplete: (id: string) => void, currentUser: any }) {
    // ... (Mantendo o código do Wizard existente sem alterações)
    // Para simplificar a resposta, assumo que o wizard não precisa de alterações visuais
    // Copiando a lógica para garantir funcionalidade
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [calculatedAge, setCalculatedAge] = useState<number | null>(null);
    const [docId, setDocId] = useState<string | null>(null);
    const [showDraftPrompt, setShowDraftPrompt] = useState(false);
    const [draftIdToLoad, setDraftIdToLoad] = useState<string | null>(null);

    const [formData, setFormData] = useState<Partial<UserProfile>>({
        role: 'student',
        anamnesisComplete: false,
        gender: 'male',
        mainGoal: 'health',
        availabilityDays: '3',
        medicalClearance: true,
        professorId: currentUser?.uid
    });

    useEffect(() => {
        const draftId = localStorage.getItem('draftStudentId');
        if (draftId) {
            setDraftIdToLoad(draftId);
            setShowDraftPrompt(true);
        } else {
            startNewDraft();
        }
    }, []);

    const startNewDraft = () => {
        localStorage.removeItem('draftStudentId');
        const newRef = doc(collection(db, 'artifacts', appId, 'users'));
        setDocId(newRef.id);
        localStorage.setItem('draftStudentId', newRef.id);
        setShowDraftPrompt(false);
    };

    const loadDraft = () => {
        if (draftIdToLoad) {
            setDocId(draftIdToLoad);
            getDoc(doc(db, 'artifacts', appId, 'users', draftIdToLoad)).then(snap => {
                if (snap.exists()) {
                    setFormData(snap.data() as Partial<UserProfile>);
                }
            });
        }
        setShowDraftPrompt(false);
    };

    // Debounced Auto-Save
    useEffect(() => {
        if (!docId || showDraftPrompt) return;
        const timer = setTimeout(() => {
            if (formData.name || formData.phone) {
                setDoc(doc(db, 'artifacts', appId, 'users', docId), {
                    ...formData,
                    updatedAt: new Date().toISOString()
                }, { merge: true }).catch(console.error);
            }
        }, 2000);
        return () => clearTimeout(timer);
    }, [formData, docId, showDraftPrompt]);

    useEffect(() => {
        if (formData.birthDate) {
            const birthDate = new Date(formData.birthDate + "T12:00:00");
            if (!isNaN(birthDate.getTime())) {
                const today = new Date();
                let age = today.getFullYear() - birthDate.getFullYear();
                const m = today.getMonth() - birthDate.getMonth();
                if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                    age--;
                }
                setCalculatedAge(age);
                if (age > 0 && formData.gender) {
                    const calculatedMax = formData.gender === 'female' ? (226 - age) : (220 - age);
                    setFormData(prev => {
                        if (prev.maxHeartRate === calculatedMax.toString()) return prev;
                        return { ...prev, maxHeartRate: calculatedMax.toString() };
                    });
                }
            }
        }
    }, [formData.birthDate, formData.gender]);

    const updateData = (key: keyof UserProfile, value: any) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    }

    const handleFinish = async () => {
        if (!formData.name || !formData.phone) {
            alert("Dados obrigatórios.");
            return;
        }
        setLoading(true);
        try {
            // Removemos o await para evitar congelamento caso a rede esteja lenta.
            // O Firestore atualiza o cache local instantaneamente.
            setDoc(doc(db, 'artifacts', appId, 'users', docId!), {
                ...formData,
                role: 'student', // Garante que o role seja student para aparecer na lista
                anamnesisComplete: true,
                createdAt: formData.createdAt || new Date().toISOString()
            }, { merge: true }).catch(e => console.error("Background save error:", e));
            
            localStorage.removeItem('draftStudentId');
            onComplete(docId!);
        } catch (e) {
            console.error("Error saving to Firestore:", e);
            alert("Erro ao salvar no banco de dados.");
        } finally {
            setLoading(false);
        }
    };

    if (showDraftPrompt) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-brand-dark p-6">
                <Card className="max-w-md w-full text-center space-y-6">
                    <h3 className="text-2xl font-black italic uppercase text-white font-display">Rascunho Encontrado</h3>
                    <p className="text-zinc-400 text-sm">Você tem um cadastro de atleta em andamento. Deseja continuar de onde parou?</p>
                    <div className="flex gap-4 justify-center mt-6">
                        <Button variant="ghost" onClick={startNewDraft}>Novo Cadastro</Button>
                        <Button variant="primary" onClick={loadDraft}>Continuar Rascunho</Button>
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-brand-dark">
            <div className="h-1 w-full bg-zinc-800">
                <div className="h-full bg-brand-neon transition-all duration-500 shadow-[0_0_15px_rgba(207,255,4,0.5)]" style={{ width: `${(step/4)*100}%` }} />
            </div>
            
            <div className="flex-1 max-w-4xl mx-auto w-full p-6 flex flex-col justify-center">
                <div className="mb-10">
                    <button onClick={onCancel} className="text-zinc-500 hover:text-white flex items-center gap-2 text-[10px] font-black uppercase tracking-widest mb-6">
                        <X size={14} /> Cancelar
                    </button>
                    <h2 className="text-5xl md:text-6xl font-black italic uppercase text-white leading-[0.9] tracking-tighter mb-2 font-display">
                        {step === 1 && "Largada"}
                        {step === 2 && "Bio & Físico"}
                        {step === 3 && "Histórico"}
                        {step === 4 && "Objetivos"}
                    </h2>
                    <p className="text-brand-neon font-mono text-sm uppercase tracking-wider">Passo 0{step} / 04</p>
                </div>

                <div className="flex-1 max-h-[60vh] overflow-y-auto mb-8 pr-2">
                    {step === 1 && (
                        <div className="space-y-6 animate-in slide-in-from-right-8 duration-300">
                            <Input label="Nome Completo" value={formData.name || ''} onChange={(v: string) => updateData('name', v)} placeholder="NOME DO ATLETA" className="text-xl" />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Input label="Celular (ID)" value={formData.phone || ''} onChange={(v: string) => updateData('phone', v)} placeholder="119..." type="tel" />
                                <Input label="Nascimento" value={formData.birthDate || ''} onChange={(v: string) => updateData('birthDate', v)} type="date" />
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="flex-1">
                                    <Select label="Gênero" value={formData.gender} onChange={(v: string) => updateData('gender', v)} options={[
                                        {value: 'male', label: 'Masculino'}, {value: 'female', label: 'Feminino'}
                                    ]} />
                                </div>
                                {calculatedAge !== null && (
                                    <div className="bg-brand-surface border border-brand-neon/20 px-4 py-3 rounded-xl mt-4">
                                        <p className="text-[10px] font-black text-zinc-500 uppercase">Idade</p>
                                        <p className="text-xl font-black text-brand-neon font-display">{calculatedAge}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                    
                    {step === 2 && (
                         <div className="space-y-8 animate-in slide-in-from-right-8 duration-300">
                            <div className="grid grid-cols-2 gap-8">
                                <Input label="Peso (kg)" type="number" value={formData.weight || ''} onChange={(v: string) => updateData('weight', v)} className="text-3xl font-black" />
                                <Input label="Altura (cm)" type="number" value={formData.height || ''} onChange={(v: string) => updateData('height', v)} className="text-3xl font-black" />
                            </div>
                            <div className="grid grid-cols-2 gap-8">
                                <Input label="FC Repouso" type="number" value={formData.restingHeartRate || ''} onChange={(v: string) => updateData('restingHeartRate', v)} placeholder="--" />
                                <div className="relative">
                                    <Input label="FC Máxima (Calc)" type="number" value={formData.maxHeartRate || ''} onChange={(v: string) => updateData('maxHeartRate', v)} className="text-brand-neon border-brand-neon/30" />
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-6 animate-in slide-in-from-right-8 duration-300">
                            <TextArea label="Lesões" value={formData.injuries || ''} onChange={(v: string) => updateData('injuries', v)} placeholder="Descreva limitações..." />
                            <TextArea label="Medicamentos" value={formData.medications || ''} onChange={(v: string) => updateData('medications', v)} placeholder="Uso contínuo..." />
                            <Select label="Atestado / PAR-Q" value={formData.medicalClearance ? 'yes' : 'no'} onChange={(v: string) => updateData('medicalClearance', v === 'yes')} options={[ {value: 'yes', label: 'Aprovado / Sem restrições'}, {value: 'no', label: 'Pendente / Restrito'} ]} />
                        </div>
                    )}

                    {step === 4 && (
                        <div className="space-y-6 animate-in slide-in-from-right-8 duration-300">
                             <div className="grid grid-cols-2 gap-6">
                                <Input label="Anos de Corrida" type="number" value={formData.runningYears || ''} onChange={(v: string) => updateData('runningYears', v)} />
                                <Input label="Volume (km/sem)" type="number" value={formData.weeklyVolume || ''} onChange={(v: string) => updateData('weeklyVolume', v)} />
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <Input label="Melhor 5k" value={formData.best5k || ''} onChange={(v: string) => updateData('best5k', v)} placeholder="00:00" />
                                <Input label="Melhor 10k" value={formData.best10k || ''} onChange={(v: string) => updateData('best10k', v)} placeholder="00:00" />
                            </div>
                            <Select label="Foco Principal" value={formData.mainGoal} onChange={(v: string) => updateData('mainGoal', v)} options={[ {value: 'health', label: 'Lifestyle / Saúde'}, {value: 'performance_5k', label: 'Performance 5km'}, {value: 'performance_10k', label: 'Performance 10km'}, {value: 'half_marathon', label: 'Meia Maratona (21k)'}, {value: 'marathon', label: 'Maratona (42k)'} ]} />
                            <Select label="Freq. Semanal" value={formData.availabilityDays} onChange={(v: string) => updateData('availabilityDays', v)} options={[ {value: '3', label: '3 Treinos'}, {value: '4', label: '4 Treinos'}, {value: '5', label: '5 Treinos'}, {value: '6', label: '6 Treinos (Elite)'} ]} />
                        </div>
                    )}
                </div>

                <div className="flex justify-between items-center pt-6 border-t border-white/5">
                    <Button variant="ghost" disabled={step === 1} onClick={() => setStep(s => s - 1)}>VOLTAR</Button>
                    {step < 4 ? (<Button onClick={() => setStep(s => s + 1)} className="px-10">PRÓXIMO <ChevronRight size={16}/></Button>) : (<Button variant="primary" loading={loading} onClick={handleFinish} className="px-12 py-5 text-sm"><Save size={18} /> FINALIZAR CADASTRO</Button>)}
                </div>
            </div>
        </div>
    )
}

function ProfessorDashboard({ students, selectedStudentId, onSelectStudent, onNewStudent, currentUser }: any) {
    const [searchTerm, setSearchTerm] = useState("");

    if (selectedStudentId) {
        const student = students.find((s: UserProfile) => s.id === selectedStudentId);
        if (!student) {
            return (
                <div className="p-20 flex flex-col items-center justify-center space-y-6">
                    <div className="w-10 h-10 border-4 border-brand-neon border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-zinc-500 font-mono text-sm uppercase tracking-widest animate-pulse">Sincronizando Perfil...</p>
                    <button onClick={() => onSelectStudent(null)} className="mt-4 px-6 py-2 rounded-full border border-zinc-700 text-zinc-400 hover:text-white hover:border-brand-neon transition-all text-xs font-bold uppercase tracking-wider">
                        Voltar para o Painel
                    </button>
                </div>
            );
        }

        return (
            <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <button onClick={() => onSelectStudent(null)} className="flex items-center gap-2 text-zinc-500 hover:text-brand-neon transition-colors font-black uppercase text-[10px] tracking-widest mb-4">
                    <ArrowRight className="rotate-180" size={14} /> Voltar para o Squad
                </button>
                
                <div className="flex flex-col xl:flex-row gap-8">
                    <div className="w-full xl:w-[350px] space-y-6">
                        <StudentProfileCard student={student} />
                    </div>
                    <div className="flex-1">
                        <WorkoutManager student={student} />
                    </div>
                </div>
            </div>
        );
    }

    const myStudents = students; // Mostra todos os alunos para evitar perda de dados por troca de sessão anônima
    const filteredStudents = myStudents.filter((s: UserProfile) => s.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="max-w-7xl mx-auto">
            {/* Header com pesquisa e botão novo */}
             <div className="relative rounded-[2.5rem] bg-zinc-900 border border-white/5 overflow-hidden mb-10 p-8 md:p-12 shadow-2xl">
                <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-brand-neon/5 blur-[100px] rounded-full pointer-events-none" />
                <div className="relative z-10 flex flex-col xl:flex-row justify-between items-end gap-8">
                    <div className="w-full md:w-auto">
                         <div className="flex items-center gap-3 mb-2">
                            <Users className="text-brand-neon" size={20} />
                            <span className="text-xs font-bold text-zinc-500 uppercase tracking-[0.2em]">Gestão de Equipe</span>
                         </div>
                         <h2 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter text-white leading-[0.85] font-display">
                            Meus <span className="text-brand-neon">Alunos</span>
                         </h2>
                    </div>
                    <div className="flex flex-col md:flex-row gap-4 w-full xl:w-auto">
                         <div className="flex-1 md:w-64 bg-black/20 p-1 rounded-2xl border border-white/5 backdrop-blur-sm flex items-center">
                            <Search className="ml-4 text-zinc-500" size={16} />
                            <input type="text" placeholder="BUSCAR..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full px-4 py-3 bg-transparent text-white font-bold text-xs outline-none placeholder:text-zinc-600 uppercase" />
                         </div>
                         <Button onClick={onNewStudent} className="shadow-lg shadow-brand-neon/10 py-4 px-8 text-xs h-full whitespace-nowrap"> <Plus size={16} /> Novo Atleta </Button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredStudents.length > 0 ? (
                    filteredStudents.map((s: UserProfile) => (
                        <Card key={s.id} onClick={() => onSelectStudent(s.id)} className="group border border-white/5 bg-brand-light/20 hover:bg-brand-light/50">
                            <div className="flex items-center justify-between mb-8">
                                <div className="w-14 h-14 bg-brand-dark rounded-2xl flex items-center justify-center text-zinc-400 font-black text-xl border border-white/5 group-hover:border-brand-neon/50 group-hover:text-brand-neon transition-colors font-display">
                                    {s.name.charAt(0)}
                                </div>
                                <div className={`w-2 h-2 rounded-full ${s.medicalClearance ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-amber-500'}`} />
                            </div>
                            <h3 className="text-2xl font-black uppercase italic text-white truncate leading-none mb-1 group-hover:translate-x-1 transition-transform font-display">{s.name}</h3>
                            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-6">{s.mainGoal?.replace('_', ' ').toUpperCase()}</p>
                        </Card>
                    ))
                ) : (
                     <div className="col-span-full py-20 text-center border-2 border-dashed border-zinc-800 rounded-3xl">
                        <p className="font-bold text-zinc-600">NENHUM ATLETA ENCONTRADO</p>
                    </div>
                )}
            </div>
        </div>
    );
}

function StudentProfileCard({ student }: { student: UserProfile }) {
    // ... Mesmo código de StudentProfileCard
     const imc = student.weight && student.height ? (parseFloat(student.weight) / Math.pow(parseFloat(student.height)/100, 2)).toFixed(1) : '--';
    return (
        <Card className="h-full bg-brand-surface border-t-4 border-t-brand-neon">
            <div className="mb-8">
                <h3 className="text-4xl font-black italic uppercase leading-none text-white mb-2 font-display">{student.name}</h3>
                <div className="flex gap-2">
                    <span className="px-2 py-1 bg-white/5 rounded text-[10px] font-bold uppercase tracking-wider text-zinc-400">{student.gender === 'male' ? 'MASC' : 'FEM'}</span>
                    <span className="px-2 py-1 bg-white/5 rounded text-[10px] font-bold uppercase tracking-wider text-zinc-400">{student.birthDate ? new Date().getFullYear() - new Date(student.birthDate).getFullYear() + ' ANOS' : '-- ANOS'}</span>
                </div>
            </div>
             <div className="space-y-6">
                <div className="grid grid-cols-3 gap-2">
                    <div className="bg-brand-dark p-3 rounded-xl text-center border border-white/5"><p className="text-[9px] font-black text-zinc-500 uppercase">IMC</p><p className="text-lg font-black text-white">{imc}</p></div>
                    <div className="bg-brand-dark p-3 rounded-xl text-center border border-white/5"><p className="text-[9px] font-black text-zinc-500 uppercase">FCR</p><p className="text-lg font-black text-brand-neon">{student.restingHeartRate || '--'}</p></div>
                    <div className="bg-brand-dark p-3 rounded-xl text-center border border-white/5"><p className="text-[9px] font-black text-zinc-500 uppercase">FCMáx</p><p className="text-lg font-black text-white">{student.maxHeartRate || '--'}</p></div>
                </div>
                <div className="p-4 rounded-2xl bg-brand-neon/10 border border-brand-neon/20"><p className="text-[9px] font-black text-brand-neon uppercase mb-1">Foco Principal</p><p className="text-md font-bold text-white uppercase italic flex items-center gap-2 font-display"><Target size={14} /> {student.mainGoal?.replace(/_/g, ' ')}</p></div>
                 <div className="space-y-2"><p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Médico / Bio</p><div className="p-4 bg-brand-dark rounded-xl border border-white/5 text-xs text-zinc-400 font-medium leading-relaxed">{student.injuries ? <span className="block mb-2 text-red-400">⚠️ {student.injuries}</span> : <span className="block mb-2 text-emerald-500">✓ Sem lesões recentes</span>}{student.medications && <span className="block text-zinc-300">Med: {student.medications}</span>}</div></div>
            </div>
        </Card>
    )
}

function WorkoutManager({ student }: { student: UserProfile }) {
    const [workouts, setWorkouts] = useState<WorkoutModel[]>([]);
    const [isCreating, setIsCreating] = useState(false);
    
    useEffect(() => {
        const q = collection(db, 'artifacts', appId, 'workouts');
        const unsub = onSnapshot(q, { includeMetadataChanges: true }, (snap) => {
            syncState.update(snap.metadata.hasPendingWrites, snap.metadata.fromCache);
            const data = snap.docs.map(d => ({id: d.id, ...d.data()} as WorkoutModel));
            setWorkouts(data.filter(w => w.studentId === student.id));
        });
        return () => unsub();
    }, [student.id]);

    const deleteWorkout = async (id: string) => {
        if(confirm("Deletar este treino?")) {
            await deleteDoc(doc(db, 'artifacts', appId, 'workouts', id));
        }
    };

    const totalWeeklyTime = workouts.reduce((acc, w) => acc + calculateWorkoutTime(w), 0);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center p-2">
                <div>
                    <h3 className="text-2xl font-black italic uppercase tracking-tighter text-white flex items-center gap-3 font-display">
                        <Flame className="text-brand-neon" /> Plano Semanal
                    </h3>
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">
                        Volume Total: <span className="text-brand-neon">{totalWeeklyTime} MIN</span>
                    </p>
                </div>
                <Button onClick={() => setIsCreating(true)} variant="secondary">
                   <Plus size={16} /> Adicionar
                </Button>
            </div>

            {isCreating && (
                <WorkoutBuilder 
                    student={student}
                    onClose={() => setIsCreating(false)} 
                />
            )}

            <div className="flex flex-col gap-3">
                {workouts.length === 0 ? (
                    <div className="col-span-full py-20 text-center border-2 border-dashed border-zinc-800 rounded-3xl">
                        <p className="font-bold text-zinc-600">SEM TREINOS PRESCRITOS</p>
                    </div>
                ) : (
                   workouts.sort((a,b) => getDayIndex(a.dayOfWeek) - getDayIndex(b.dayOfWeek)).map(w => (
                       <CompactWorkoutCard key={w.id} workout={w} onDelete={() => deleteWorkout(w.id)} />
                   )) 
                )}
            </div>
            
            <WorkoutLegend />
        </div>
    )
}

function WorkoutBuilder({ student, onClose }: { student: UserProfile, onClose: () => void }) {
    const [day, setDay] = useState('Segunda');
    const [type, setType] = useState('longao');
    const [loading, setLoading] = useState(false);

    // Unified Form State for ALL types
    const [formData, setFormData] = useState({
        warmup: '10',
        cooldown: '5',
        sets: '1',
        reps: '1',
        stimulus: '5', // Km or Minutes
        recovery: '2', // Minutes
        speed: '0', // km/h
        description: ''
    });

    const updateForm = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    }

    const handleSave = async () => {
        setLoading(true);
        const payload: any = {
            studentId: student.id,
            type,
            dayOfWeek: day,
            warmupTime: formData.warmup,
            cooldownTime: formData.cooldown,
            sets: formData.sets,
            reps: formData.reps,
            stimulusTime: formData.stimulus, 
            recoveryTime: formData.recovery,
            speed: formData.speed,
            description: formData.description,
            createdAt: new Date().toISOString()
        };

        try {
            await addDoc(collection(db, 'artifacts', appId, 'workouts'), payload);
            onClose(); // Close the form after successful save
        } catch (e) {
            console.error(e);
        }
            
        setLoading(false);
    };

    return (
        <div className="flex flex-col gap-6 animate-in zoom-in-95 duration-200">
             <div className="flex justify-between items-center bg-black rounded-t-3xl p-4 -mb-6 relative z-10 border-b border-zinc-800">
                 <h4 className="text-xl font-black italic uppercase text-red-500 font-display">NOVA SESSÃO</h4>
                 <button onClick={onClose} className="text-zinc-500 hover:text-white"><X /></button>
             </div>

            <div className="w-full bg-black border border-zinc-800 rounded-3xl p-6 relative">
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <Select label="Dia" value={day} onChange={setDay} options={[
                        {value: 'Segunda', label: 'Segunda'}, {value: 'Terça', label: 'Terça'}, {value: 'Quarta', label: 'Quarta'},
                        {value: 'Quinta', label: 'Quinta'}, {value: 'Sexta', label: 'Sexta'}, {value: 'Sábado', label: 'Sábado'}, {value: 'Domingo', label: 'Domingo'}
                    ]} />
                    <Select label="Tipo" value={type} onChange={setType} options={[
                        {value: 'longao', label: 'Longão'}, {value: 'tiro', label: 'Intervalado'}, {value: 'fartlek', label: 'Fartlek'},
                        {value: 'ritmo', label: 'Ritmo / Tempo'}, {value: 'subida', label: 'Subida'}, {value: 'regenerativo', label: 'Regenerativo'}
                    ]} />
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                     <Input label="Aquecimento (min)" type="number" value={formData.warmup} onChange={(v: string) => updateForm('warmup', v)} className="bg-zinc-900 border-zinc-800" />
                     <Input label="Desaquecimento (min)" type="number" value={formData.cooldown} onChange={(v: string) => updateForm('cooldown', v)} className="bg-zinc-900 border-zinc-800" />
                     <Input label="Séries (Blocos)" type="number" value={formData.sets} onChange={(v: string) => updateForm('sets', v)} className="bg-zinc-900 border-zinc-800" />
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                     {/* Reps field hidden or repurposed as it usually is 1 for block based */}
                     <Input label="Estímulo (Km ou Min)" value={formData.stimulus} onChange={(v: string) => updateForm('stimulus', v)} className="bg-zinc-900 border-zinc-800" />
                     <Input label="Recuperação (Min)" value={formData.recovery} onChange={(v: string) => updateForm('recovery', v)} className="bg-zinc-900 border-zinc-800" />
                     <Input label="Velocidade (km/h)" value={formData.speed} onChange={(v: string) => updateForm('speed', v)} className="bg-zinc-900 border-zinc-800" placeholder="Ex: 12.5" />
                </div>
                    
                <TextArea label="Instruções" value={formData.description} onChange={(v: string) => updateForm('description', v)} placeholder="Ex: Manter postura, final forte..." className="bg-zinc-900 border-zinc-800 mb-6" />

                <Button onClick={handleSave} loading={loading} className="w-full">Salvar Treino</Button>
            </div>
        </div>
    );
}

// --- STUDENT VIEW ---

function StudentView({ profile }: { profile: UserProfile }) {
    const [workouts, setWorkouts] = useState<WorkoutModel[]>([]);
    const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
    const [currentMonth, setCurrentMonth] = useState(new Date());

    useEffect(() => {
        if (!profile.id) return;
        // Fetch Workouts (Templates)
        const qW = query(collection(db, 'artifacts', appId, 'workouts'), where('studentId', '==', profile.id));
        const unsubW = onSnapshot(qW, (snap) => {
            const data = snap.docs.map(d => ({id: d.id, ...d.data()} as WorkoutModel));
            setWorkouts(data);
        });

        // Fetch Check-ins
        const qC = query(collection(db, 'artifacts', appId, 'checkins'), where('studentId', '==', profile.id));
        const unsubC = onSnapshot(qC, (snap) => {
            const data = snap.docs.map(d => ({id: d.id, ...d.data()} as CheckIn));
            setCheckIns(data);
        });

        return () => { unsubW(); unsubC(); };
    }, [profile.id]);

    const handleCheckIn = async (workout: WorkoutModel, date: Date) => {
        if(confirm(`Confirmar treino de ${getDayName(date)}?`)) {
            const dateStr = formatDate(date);
            const checkInId = `${profile.id}_${workout.id}_${dateStr}`;
            const checkIn: CheckIn = {
                id: checkInId,
                studentId: profile.id,
                workoutId: workout.id,
                date: dateStr,
                completedAt: new Date().toISOString(),
                status: 'completed'
            };
            await setDoc(doc(db, 'artifacts', appId, 'checkins', checkInId), checkIn);
        }
    };

    // Calendar Generation
    const getCalendarDays = () => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        
        const days = [];
        for (let d = 1; d <= lastDay.getDate(); d++) {
            days.push(new Date(year, month, d));
        }
        return days;
    };

    const days = getCalendarDays();
    const completedCount = checkIns.filter(c => c.date.startsWith(currentMonth.toISOString().slice(0, 7))).length;

    return (
        <div className="max-w-md mx-auto space-y-8 pb-24 animate-in fade-in duration-700">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-4xl font-black italic uppercase tracking-tighter text-white leading-none font-display">
                        Olá,<br/>{profile.name.split(' ')[0]}
                    </h2>
                </div>
                <div className="w-16 h-16 bg-brand-neon text-brand-dark rounded-2xl flex items-center justify-center text-2xl font-black shadow-[0_0_20px_rgba(207,255,4,0.4)] font-display">
                    {profile.name.charAt(0)}
                </div>
            </div>

            {/* PERFORMANCE FEED */}
            <div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-2xl flex items-center justify-between">
                <div>
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Performance Mensal</p>
                    <p className="text-2xl font-black text-white italic">{completedCount} <span className="text-sm text-zinc-600">TREINOS</span></p>
                </div>
                <div className="h-10 w-10 rounded-full bg-brand-neon flex items-center justify-center text-brand-dark">
                    <Activity size={20} />
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                     <h3 className="text-xl font-black italic uppercase text-white tracking-tighter font-display flex items-center gap-2">
                        <CalendarDays className="text-brand-neon" size={20} /> 
                        {currentMonth.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                     </h3>
                </div>

                <div className="space-y-3">
                    {days.map(date => {
                        const dayName = getDayName(date);
                        // Find template for this weekday
                        const workout = workouts.find(w => w.dayOfWeek === dayName);
                        
                        if (!workout) return null;

                        const dateStr = formatDate(date);
                        const isCompleted = checkIns.some(c => c.workoutId === workout.id && c.date === dateStr);
                        
                        // Only show future days or past days that had a workout
                        return (
                             <CompactWorkoutCard 
                                key={dateStr} 
                                workout={workout} 
                                date={date} 
                                isCompleted={isCompleted}
                                onCheckIn={() => !isCompleted && handleCheckIn(workout, date)}
                             />
                        );
                    })}
                    
                    {days.filter(d => workouts.find(w => w.dayOfWeek === getDayName(d))).length === 0 && (
                        <div className="py-10 text-center text-zinc-500 font-bold uppercase text-xs">
                            Sem treinos este mês
                        </div>
                    )}
                </div>
            </div>

            <WorkoutLegend />
        </div>
    )
}

function getDayIndex(day: string): number {
    const days = ['segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado', 'domingo'];
    const d = day.toLowerCase().split('-')[0];
    const idx = days.findIndex(x => x === d);
    return idx === -1 ? 99 : idx;
}