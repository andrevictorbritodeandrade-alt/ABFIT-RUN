import React, { useState, useEffect, useMemo } from 'react';
import { 
  Activity, Users, LogOut, CheckCircle2, Clock, 
  Target, Plus, Save, Trash2, X, ArrowRight, 
  Timer, AlertCircle, Sparkles, Phone, Lock, 
  ChevronDown, Dumbbell, Ruler, Scale, HeartPulse,
  Flame, Mountain, Zap, Repeat, LayoutDashboard,
  ClipboardList, Search, UserCheck, CalendarDays,
  Stethoscope, FileText, Info, Brain, ChevronRight, ChevronLeft,
  Play, BarChart3, Download
} from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { 
  getFirestore, collection, doc, setDoc, 
  onSnapshot, addDoc, deleteDoc, updateDoc
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
const appId = 'runtrack-elite-v4';

// --- CUSTOM ICONS (SVG) ---

const RunnerLogoIcon = ({ className, size = 24 }: { className?: string, size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M17 16l-3-1" />
      <path d="M19.78 15.68c.24-1.28-1.55-2.61-2.9-2.93l-4.59-1.07a3 3 0 0 1-1.68-1.06l-1.92-2.73a4 4 0 0 0-3.32-1.73A3.75 3.75 0 0 0 2 9.5a1.2 1.2 0 0 0 .33.8l2.6 2.87" />
      <path d="M4.38 12.8c-1.23.6-2.07 1.95-2.29 3.32-.23 1.48.51 3.23 2.13 3.66l9.64 2.16a6.6 6.6 0 0 0 7.82-4.5c.24-1.06-.35-1.98-1.4-2.22" />
      <path d="M2.5 15a4.5 4.5 0 0 1 5-4" />
      <path d="M15 17h.01" />
  </svg>
);

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

const WorkoutLegend = () => (
    <div className="glass-panel rounded-2xl p-6 mt-8">
        <h5 className="font-black italic uppercase text-zinc-500 text-[10px] tracking-widest mb-4 flex items-center gap-2 font-display">
            <Info size={14} className="text-brand-neon"/> Legenda
        </h5>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              {short: 'AQ', long: 'Aquecimento'},
              {short: 'CO', long: 'Corrida'},
              {short: 'CA', long: 'Caminhada'},
              {short: 'VC', long: 'Volta à Calma'},
              {short: 'REC', long: 'Recuperação'},
              {short: ':', long: 'Alternância'}
            ].map(item => (
              <div key={item.short} className="flex flex-col border-l-2 border-zinc-800 pl-3">
                  <span className="font-black text-brand-neon text-sm font-display">{item.short}</span>
                  <span className="text-[10px] font-bold text-zinc-500 uppercase">{item.long}</span>
              </div>
            ))}
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

interface UserProfile {
  id: string;
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
  type: 'longao' | 'fartlek' | 'tiro' | 'ritmo' | 'subida' | 'regenerativo';
  dayOfWeek: string;
  warmupTime?: string;
  cooldownTime?: string;
  distance?: string; 
  totalTime?: string;
  pace?: string;
  sets?: string;
  reps?: string;
  stimulusTime?: string;
  recoveryTime?: string;
  fastTime?: string;
  slowTime?: string;
  description?: string;
  color?: string;
}

// --- WORKOUT CARD COMPONENT ---

const WorkoutCard: React.FC<{ workout: WorkoutModel, onDelete?: () => void }> = ({ workout, onDelete }) => {
    const isInterval = workout.type === 'tiro' || workout.type === 'subida';
    const isFartlek = workout.type === 'fartlek';
    
    return (
        <div className="bg-brand-light/40 border border-white/5 p-6 rounded-3xl relative group hover:bg-brand-light/60 transition-all hover:border-brand-neon/30">
            {onDelete && (
                <button onClick={onDelete} className="absolute top-6 right-6 text-zinc-500 hover:text-red-500 p-2 rounded-xl transition-all opacity-0 group-hover:opacity-100">
                    <Trash2 size={18} />
                </button>
            )}
            
            <div className="flex flex-col mb-6">
                <span className="text-[10px] font-black uppercase tracking-widest text-brand-neon mb-1 flex items-center gap-2 font-display">
                    <CalendarDays size={10} /> {workout.dayOfWeek}
                </span>
                <h4 className="text-3xl font-black italic uppercase text-white leading-none tracking-tighter font-display">
                    {workout.type}
                </h4>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
                 {isInterval ? (
                    <>
                        <div className="flex flex-col bg-brand-dark/50 p-3 rounded-xl border border-white/5">
                             <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Aquecimento</span>
                             <span className="font-bold text-white text-lg">{workout.warmupTime} min</span>
                        </div>
                         <div className="flex flex-col bg-brand-dark/50 p-3 rounded-xl border border-white/5">
                             <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Série</span>
                             <span className="font-bold text-white text-lg">{workout.sets}x {workout.reps} <span className="text-brand-neon text-xs">({workout.stimulusTime}/{workout.recoveryTime})</span></span>
                        </div>
                    </>
                 ) : isFartlek ? (
                     <>
                        <div className="flex flex-col bg-brand-dark/50 p-3 rounded-xl border border-white/5">
                             <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Total</span>
                             <span className="font-bold text-white text-lg">{workout.totalTime} min</span>
                        </div>
                        <div className="flex flex-col bg-brand-dark/50 p-3 rounded-xl border border-white/5">
                             <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Var</span>
                             <span className="font-bold text-white text-lg">{workout.fastTime}' Ft / {workout.slowTime}' Lv</span>
                        </div>
                     </>
                 ) : (
                    <>
                        <div className="flex flex-col bg-brand-dark/50 p-3 rounded-xl border border-white/5">
                             <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Volume</span>
                             <span className="font-bold text-white text-lg">{workout.distance ? `${workout.distance}km` : `${workout.totalTime}min`}</span>
                        </div>
                        <div className="flex flex-col bg-brand-dark/50 p-3 rounded-xl border border-white/5">
                             <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Ritmo</span>
                             <span className="font-bold text-white text-lg">{workout.pace || 'Livre'}</span>
                        </div>
                    </>
                 )}
            </div>

            {workout.description && (
                <div className="p-4 rounded-xl border-l-2 border-brand-neon bg-brand-neon/5">
                    <p className="text-xs text-zinc-300 font-medium leading-relaxed italic">"{workout.description}"</p>
                </div>
            )}
        </div>
    )
}

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
    // Listen for PWA install prompt
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setInstallPrompt(e);
    });

    // Tenta autenticação anônima para permitir leitura/escrita no Firestore
    signInAnonymously(auth).catch((error) => {
      console.error("Auth failed:", error);
      // Fallback para UI
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
    try {
      // Escuta em tempo real a coleção de usuários no Firestore
      const unsub = onSnapshot(collection(db, 'artifacts', appId, 'users'), (snap) => {
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
    setActiveProfile(profile);
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
                onCancel={() => setView('dashboard')}
                onComplete={(newStudentId) => {
                    setSelectedStudentId(newStudentId);
                    setView('dashboard');
                }}
            />
        )}

        {view === 'dashboard' && role === 'professor' && (
            <ProfessorDashboard 
                students={students} 
                selectedStudentId={selectedStudentId}
                onSelectStudent={setSelectedStudentId}
                onNewStudent={() => setView('new-athlete-assessment')}
            />
        )}

        {view === 'dashboard' && role === 'student' && activeProfile && (
             <StudentView profile={activeProfile} />
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
    const [selectedForAuth, setSelectedForAuth] = useState<UserProfile | null>(null);
    const [phoneInput, setPhoneInput] = useState("");
    const [error, setError] = useState("");

    const filtered = students.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const handleAuth = () => {
        if (!selectedForAuth) return;
        const storedPhone = selectedForAuth.phone.replace(/\D/g, '');
        const inputPhone = phoneInput.replace(/\D/g, '');

        if (storedPhone === inputPhone && inputPhone.length > 5) {
            onLogin(selectedForAuth);
        } else {
            setError("Número incorreto.");
        }
    }

    return (
        <div className="max-w-2xl mx-auto pt-10">
            <div className="flex items-center gap-4 mb-10">
                <button onClick={onBack} className="p-4 bg-brand-surface rounded-full border border-white/10 text-zinc-400 hover:text-white transition-all hover:border-brand-neon/50">
                    <ArrowRight className="rotate-180" size={20} />
                </button>
                <h2 className="text-4xl font-black uppercase italic tracking-tighter text-white font-display">Selecionar Perfil</h2>
            </div>

            <div className="relative mb-10 group">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-brand-neon transition-colors" size={20} />
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
                    <div key={student.id} onClick={() => { setSelectedForAuth(student); setError(""); setPhoneInput(""); }} 
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

            {selectedForAuth && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-6">
                    <Card className="max-w-md w-full animate-in zoom-in-95 duration-200 border-brand-neon/20 shadow-[0_0_50px_-10px_rgba(207,255,4,0.1)]">
                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <h3 className="text-3xl font-black italic uppercase tracking-tighter text-white font-display">Segurança</h3>
                                <p className="text-zinc-400 text-xs mt-1 uppercase tracking-wider">Confirme seu número</p>
                            </div>
                            <button onClick={() => setSelectedForAuth(null)} className="text-zinc-500 hover:text-white"><X /></button>
                        </div>
                        <div className="space-y-6">
                            <Input label="Celular Cadastrado" placeholder="11999999999" value={phoneInput} onChange={setPhoneInput} type="tel" className="bg-brand-dark" />
                            {error && <p className="text-red-500 text-xs font-bold flex items-center gap-2 uppercase tracking-wide"><AlertCircle size={14}/> {error}</p>}
                            <Button onClick={handleAuth} className="w-full py-5 text-sm">Acessar Painel</Button>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    )
}

// --- WIZARD DE AVALIAÇÃO ---

function AthleteAssessmentWizard({ onCancel, onComplete }: { onCancel: () => void, onComplete: (id: string) => void }) {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [calculatedAge, setCalculatedAge] = useState<number | null>(null);
    const [formData, setFormData] = useState<Partial<UserProfile>>({
        role: 'student',
        anamnesisComplete: true,
        gender: 'male',
        mainGoal: 'health',
        availabilityDays: '3',
        medicalClearance: true
    });

    useEffect(() => {
        if (formData.birthDate) {
            // CORREÇÃO IDADE: Força o horário para meio-dia para evitar problemas de fuso horário
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
            const docRef = await addDoc(collection(db, 'artifacts', appId, 'users'), {
                ...formData,
                createdAt: new Date().toISOString()
            });
            onComplete(docRef.id);
        } catch (e) {
            console.error("Error saving to Firestore:", e);
            alert("Erro ao salvar no banco de dados. Verifique sua conexão e tente novamente.");
        } finally {
            setLoading(false);
        }
    };

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
                                    <Input 
                                        label="FC Máxima (Calc)" 
                                        type="number" 
                                        value={formData.maxHeartRate || ''} 
                                        onChange={(v: string) => updateData('maxHeartRate', v)} 
                                        className="text-brand-neon border-brand-neon/30"
                                    />
                                    <Sparkles className="absolute right-4 top-10 text-brand-neon animate-pulse" size={20} />
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-6 animate-in slide-in-from-right-8 duration-300">
                            <TextArea label="Lesões" value={formData.injuries || ''} onChange={(v: string) => updateData('injuries', v)} placeholder="Descreva limitações..." />
                            <TextArea label="Medicamentos" value={formData.medications || ''} onChange={(v: string) => updateData('medications', v)} placeholder="Uso contínuo..." />
                             <Select label="Atestado / PAR-Q" value={formData.medicalClearance ? 'yes' : 'no'} onChange={(v: string) => updateData('medicalClearance', v === 'yes')} options={[
                                {value: 'yes', label: 'Aprovado / Sem restrições'}, {value: 'no', label: 'Pendente / Restrito'}
                            ]} />
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
                            <Select label="Foco Principal" value={formData.mainGoal} onChange={(v: string) => updateData('mainGoal', v)} options={[
                                {value: 'health', label: 'Lifestyle / Saúde'},
                                {value: 'performance_5k', label: 'Performance 5km'},
                                {value: 'performance_10k', label: 'Performance 10km'},
                                {value: 'half_marathon', label: 'Meia Maratona (21k)'},
                                {value: 'marathon', label: 'Maratona (42k)'}
                            ]} />
                            <Select label="Freq. Semanal" value={formData.availabilityDays} onChange={(v: string) => updateData('availabilityDays', v)} options={[
                                {value: '3', label: '3 Treinos'},
                                {value: '4', label: '4 Treinos'},
                                {value: '5', label: '5 Treinos'},
                                {value: '6', label: '6 Treinos (Elite)'}
                            ]} />
                        </div>
                    )}
                </div>

                <div className="flex justify-between items-center pt-6 border-t border-white/5">
                    <Button variant="ghost" disabled={step === 1} onClick={() => setStep(s => s - 1)}>
                        VOLTAR
                    </Button>
                    
                    {step < 4 ? (
                         <Button onClick={() => setStep(s => s + 1)} className="px-10">
                            PRÓXIMO <ChevronRight size={16}/>
                        </Button>
                    ) : (
                        <Button variant="primary" loading={loading} onClick={handleFinish} className="px-12 py-5 text-sm">
                            <Save size={18} /> FINALIZAR CADASTRO
                        </Button>
                    )}
                </div>
            </div>
        </div>
    )
}

// --- PROFESSOR DASHBOARD ---

function ProfessorDashboard({ students, selectedStudentId, onSelectStudent, onNewStudent }: any) {
    const [searchTerm, setSearchTerm] = useState("");

    if (selectedStudentId) {
        const student = students.find((s: UserProfile) => s.id === selectedStudentId);
        if (!student) return <div className="p-10 text-center text-zinc-500 font-mono">CARREGANDO...</div>;

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

    const filteredStudents = students.filter((s: UserProfile) => s.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="max-w-7xl mx-auto">
             {/* HEADER DASHBOARD UNIFICADO (COMMAND PANEL) */}
            <div className="relative rounded-[2.5rem] bg-zinc-900 border border-white/5 overflow-hidden mb-10 p-8 md:p-12 shadow-2xl">
                {/* Background decoration */}
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
                         {/* Search within dashboard */}
                         <div className="flex-1 md:w-64 bg-black/20 p-1 rounded-2xl border border-white/5 backdrop-blur-sm flex items-center">
                            <Search className="ml-4 text-zinc-500" size={16} />
                            <input 
                                type="text" 
                                placeholder="BUSCAR..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-4 py-3 bg-transparent text-white font-bold text-xs outline-none placeholder:text-zinc-600 uppercase"
                            />
                         </div>
                         
                         <Button onClick={onNewStudent} className="shadow-lg shadow-brand-neon/10 py-4 px-8 text-xs h-full whitespace-nowrap">
                            <Plus size={16} /> Novo Atleta
                        </Button>
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
                            
                            <div className="flex justify-between items-center pt-4 border-t border-white/5">
                                <p className="text-xs font-bold text-zinc-400 font-mono">{s.weeklyVolume || '0'}KM <span className="text-zinc-600">/SEM</span></p>
                                <ArrowRight size={16} className="text-brand-neon opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
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
    const imc = student.weight && student.height ? (parseFloat(student.weight) / Math.pow(parseFloat(student.height)/100, 2)).toFixed(1) : '--';

    return (
        <Card className="h-full bg-brand-surface border-t-4 border-t-brand-neon">
            <div className="mb-8">
                <h3 className="text-4xl font-black italic uppercase leading-none text-white mb-2 font-display">{student.name}</h3>
                <div className="flex gap-2">
                    <span className="px-2 py-1 bg-white/5 rounded text-[10px] font-bold uppercase tracking-wider text-zinc-400">{student.gender === 'male' ? 'MASC' : 'FEM'}</span>
                    <span className="px-2 py-1 bg-white/5 rounded text-[10px] font-bold uppercase tracking-wider text-zinc-400">{new Date().getFullYear() - new Date(student.birthDate || '').getFullYear()} ANOS</span>
                </div>
            </div>

            <div className="space-y-6">
                <div className="grid grid-cols-3 gap-2">
                    <div className="bg-brand-dark p-3 rounded-xl text-center border border-white/5">
                        <p className="text-[9px] font-black text-zinc-500 uppercase">IMC</p>
                        <p className="text-lg font-black text-white">{imc}</p>
                    </div>
                    <div className="bg-brand-dark p-3 rounded-xl text-center border border-white/5">
                        <p className="text-[9px] font-black text-zinc-500 uppercase">FCR</p>
                        <p className="text-lg font-black text-brand-neon">{student.restingHeartRate || '--'}</p>
                    </div>
                    <div className="bg-brand-dark p-3 rounded-xl text-center border border-white/5">
                        <p className="text-[9px] font-black text-zinc-500 uppercase">FCMáx</p>
                        <p className="text-lg font-black text-white">{student.maxHeartRate || '--'}</p>
                    </div>
                </div>
                
                <div className="p-4 rounded-2xl bg-brand-neon/10 border border-brand-neon/20">
                    <p className="text-[9px] font-black text-brand-neon uppercase mb-1">Foco Principal</p>
                    <p className="text-md font-bold text-white uppercase italic flex items-center gap-2 font-display">
                        <Target size={14} /> 
                        {student.mainGoal?.replace(/_/g, ' ')}
                    </p>
                </div>

                <div className="space-y-2">
                     <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Médico / Bio</p>
                     <div className="p-4 bg-brand-dark rounded-xl border border-white/5 text-xs text-zinc-400 font-medium leading-relaxed">
                        {student.injuries ? <span className="block mb-2 text-red-400">⚠️ {student.injuries}</span> : <span className="block mb-2 text-emerald-500">✓ Sem lesões recentes</span>}
                        {student.medications && <span className="block text-zinc-300">Med: {student.medications}</span>}
                     </div>
                </div>
            </div>
        </Card>
    )
}

function WorkoutManager({ student }: { student: UserProfile }) {
    const [workouts, setWorkouts] = useState<WorkoutModel[]>([]);
    const [isCreating, setIsCreating] = useState(false);
    
    useEffect(() => {
        const q = collection(db, 'artifacts', appId, 'workouts');
        const unsub = onSnapshot(q, (snap) => {
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

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center p-2">
                <h3 className="text-2xl font-black italic uppercase tracking-tighter text-white flex items-center gap-3 font-display">
                    <Flame className="text-brand-neon" /> Plano de Treino
                </h3>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {workouts.length === 0 ? (
                    <div className="col-span-full py-20 text-center border-2 border-dashed border-zinc-800 rounded-3xl">
                        <p className="font-bold text-zinc-600">SEM TREINOS PRESCRITOS</p>
                    </div>
                ) : (
                   workouts.sort((a,b) => getDayIndex(a.dayOfWeek) - getDayIndex(b.dayOfWeek)).map(w => (
                       <WorkoutCard key={w.id} workout={w} onDelete={() => deleteWorkout(w.id)} />
                   )) 
                )}
            </div>
            
            <WorkoutLegend />
        </div>
    )
}

// --- WORKOUT BUILDER ---

function WorkoutBuilder({ student, onClose }: { student: UserProfile, onClose: () => void }) {
    const [type, setType] = useState<WorkoutModel['type']>('longao');
    const [day, setDay] = useState('Segunda');
    const [loading, setLoading] = useState(false);

    // Form States
    const [common, setCommon] = useState({ distance: '', time: '', pace: '', description: '', warmup: '10', cooldown: '5' });
    const [interval, setInterval] = useState({ sets: '1', reps: '10', stim: '2', rec: '1', recType: 'min' });
    const [fartlek, setFartlek] = useState({ fast: '1', slow: '1' });

    // Recommendation Engine
    const recommendation = useMemo(() => {
        let advice = { title: "Geral", volume: "Moderado", intensity: "Zona 2", notes: [] as string[] };
        if (type === 'longao') {
            advice.title = "Longo";
            advice.intensity = "65-75% FCmáx";
            advice.volume = "20-30% Vol. Semanal";
        } else if (type === 'tiro') {
            advice.title = "Intervalado";
            advice.intensity = "90-95% FCmáx";
            advice.volume = "Alta Intensidade";
            advice.notes.push("Aquecimento de 15min obrigatório");
        }
        return advice;
    }, [type, student]);

    const handleSave = async () => {
        setLoading(true);
        try {
            const payload: any = {
                studentId: student.id,
                type,
                dayOfWeek: day,
                warmupTime: common.warmup,
                cooldownTime: common.cooldown,
                description: common.description,
                createdAt: new Date().toISOString()
            };

            let estimatedTotal = 0;
            const w = Number(common.warmup) || 0;
            const c = Number(common.cooldown) || 0;

            if (type === 'longao' || type === 'ritmo' || type === 'regenerativo') {
                payload.distance = common.distance;
                payload.pace = common.pace;
                payload.totalTime = common.time; 
            } else if (type === 'tiro' || type === 'subida') {
                payload.sets = interval.sets;
                payload.reps = interval.reps;
                payload.stimulusTime = interval.stim;
                payload.recoveryTime = interval.rec;
                estimatedTotal = w + c + ((Number(interval.sets)||1) * (Number(interval.reps)||1) * ((Number(interval.stim)||0) + (Number(interval.rec)||0)));
                payload.totalTime = String(estimatedTotal);
            } else if (type === 'fartlek') {
                payload.totalTime = common.time;
                payload.fastTime = fartlek.fast;
                payload.slowTime = fartlek.slow;
            }

            await addDoc(collection(db, 'artifacts', appId, 'workouts'), payload);
            onClose();
        } catch (e) { console.error(e); } finally { setLoading(false); }
    };

    return (
        <div className="flex flex-col gap-6 animate-in zoom-in-95 duration-200">
             {/* AI INSIGHT MOVED TO TOP */}
             <div className="w-full">
                <div className="bg-brand-surface border border-white/5 p-6 rounded-3xl h-full shadow-lg shadow-black/50">
                    <div className="flex items-center gap-2 mb-4 text-brand-neon">
                        <Brain size={18} /> <span className="text-xs font-black uppercase tracking-widest font-display">Insight IA</span>
                    </div>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <h3 className="text-2xl font-black italic uppercase text-white font-display">{recommendation.title}</h3>
                        <div className="flex gap-4">
                             <div>
                                <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest block mb-1">Intensidade Alvo</span>
                                <p className="text-white font-bold">{recommendation.intensity}</p>
                            </div>
                            <div>
                                <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest block mb-1">Guia de Volume</span>
                                <p className="text-white font-bold">{recommendation.volume}</p>
                            </div>
                        </div>
                    </div>
                        {recommendation.notes.length > 0 && (
                            <div className="pt-4 border-t border-white/5 mt-4">
                                <ul className="text-xs text-zinc-400 space-y-2">
                                    {recommendation.notes.map((n, i) => <li key={i}>• {n}</li>)}
                                </ul>
                            </div>
                        )}
                </div>
            </div>

            <div className="w-full bg-brand-light/20 border border-white/5 rounded-3xl p-6 relative">
                <button onClick={onClose} className="absolute top-6 right-6 text-zinc-500 hover:text-white"><X /></button>
                <h4 className="text-xl font-black italic uppercase mb-8 text-brand-neon font-display">Nova Sessão</h4>
                
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

                <div className="space-y-6 mb-8">
                    {(type === 'longao' || type === 'ritmo' || type === 'regenerativo') && (
                        <div className="grid grid-cols-2 gap-4">
                            <Input label="Km" type="number" value={common.distance} onChange={(v: string) => setCommon({...common, distance: v})} />
                            <Input label="Minutos" type="number" value={common.time} onChange={(v: string) => setCommon({...common, time: v})} />
                            <Input label="Pace (min/km)" value={common.pace} onChange={(v: string) => setCommon({...common, pace: v})} className="col-span-2" />
                        </div>
                    )}

                    {(type === 'tiro' || type === 'subida') && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-3 gap-4">
                                <Input label="Aquecimento" type="number" value={common.warmup} onChange={(v: string) => setCommon({...common, warmup: v})} />
                                <Input label="Desaquecimento" type="number" value={common.cooldown} onChange={(v: string) => setCommon({...common, cooldown: v})} />
                                <Input label="Séries" type="number" value={interval.sets} onChange={(v: string) => setInterval({...interval, sets: v})} />
                            </div>
                            <div className="p-4 bg-brand-dark rounded-xl border border-white/5 grid grid-cols-3 gap-4">
                                <Input label="Reps" type="number" value={interval.reps} onChange={(v: string) => setInterval({...interval, reps: v})} />
                                <Input label="Estímulo" value={interval.stim} onChange={(v: string) => setInterval({...interval, stim: v})} />
                                <Input label="Recuperação" value={interval.rec} onChange={(v: string) => setInterval({...interval, rec: v})} />
                            </div>
                        </div>
                    )}

                    {type === 'fartlek' && (
                        <div className="grid grid-cols-2 gap-4">
                             <Input label="Tempo Total" type="number" value={common.time} onChange={(v: string) => setCommon({...common, time: v})} className="col-span-2" />
                             <Input label="Forte" type="number" value={fartlek.fast} onChange={(v: string) => setFartlek({...fartlek, fast: v})} />
                             <Input label="Leve" type="number" value={fartlek.slow} onChange={(v: string) => setFartlek({...fartlek, slow: v})} />
                        </div>
                    )}
                    
                    <TextArea label="Instruções" value={common.description} onChange={(v: string) => setCommon({...common, description: v})} placeholder="Ex: Manter postura, final forte..." />
                </div>

                <Button onClick={handleSave} loading={loading} className="w-full">Criar Treino</Button>
            </div>
        </div>
    );
}

// --- STUDENT VIEW ---

function StudentView({ profile }: { profile: UserProfile }) {
    const [workouts, setWorkouts] = useState<WorkoutModel[]>([]);

    useEffect(() => {
        if (!profile.id) return;
        const q = collection(db, 'artifacts', appId, 'workouts');
        const unsub = onSnapshot(q, (snap) => {
            const data = snap.docs.map(d => ({id: d.id, ...d.data()} as WorkoutModel));
            setWorkouts(data.filter(w => w.studentId === profile.id));
        });
        return () => unsub();
    }, [profile.id]);

    const sortedWorkouts = workouts.sort((a,b) => getDayIndex(a.dayOfWeek) - getDayIndex(b.dayOfWeek));
    const daysMap = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    const todayName = daysMap[new Date().getDay()];
    const todayWorkout = workouts.find(w => w.dayOfWeek.includes(todayName.split('-')[0]));

    return (
        <div className="max-w-md mx-auto space-y-10 pb-24 animate-in fade-in duration-700">
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

            {/* HERO CARD */}
            {todayWorkout ? (
                <div className="relative overflow-hidden rounded-[2.5rem] bg-zinc-900 border border-white/10 group">
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-neon/20 to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />
                    <div className="relative z-10 p-8">
                        <div className="flex justify-between items-start mb-12">
                            <span className="bg-brand-neon text-brand-dark px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-widest font-display">Treino de Hoje</span>
                            <Play className="text-white fill-white" size={24} />
                        </div>
                        
                        <h3 className="text-5xl font-black italic uppercase mb-2 leading-[0.85] tracking-tighter text-white font-display">{todayWorkout.type}</h3>
                        <p className="text-zinc-400 font-medium text-sm line-clamp-2 mb-8">{todayWorkout.description || 'Foco na técnica.'}</p>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-black/40 backdrop-blur-md p-4 rounded-2xl border border-white/5">
                                <span className="text-[9px] uppercase text-zinc-400 font-black tracking-wider block mb-1">Volume</span>
                                <span className="text-2xl font-black tracking-tight text-white">
                                    {todayWorkout.distance ? `${todayWorkout.distance}km` : `${todayWorkout.totalTime}'`}
                                </span>
                            </div>
                            <div className="bg-black/40 backdrop-blur-md p-4 rounded-2xl border border-white/5">
                                <span className="text-[9px] uppercase text-zinc-400 font-black tracking-wider block mb-1">Intensidade</span>
                                <span className="text-2xl font-black tracking-tight text-brand-neon">
                                    {todayWorkout.pace || 'Livre'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                 <div className="bg-brand-surface rounded-[2.5rem] p-10 text-center border border-white/5 flex flex-col items-center justify-center h-80 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/5 to-transparent" />
                    <div className="relative z-10">
                        <div className="w-16 h-16 bg-brand-dark rounded-full flex items-center justify-center mx-auto mb-6 text-zinc-500 border border-white/5">
                            <Zap size={24} />
                        </div>
                        <p className="text-white font-black text-2xl italic uppercase tracking-tighter font-display">Descanso</p>
                        <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-2">Recuperar & Hidratar</p>
                    </div>
                </div>
            )}

            <div className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                    <BarChart3 size={20} className="text-brand-neon"/>
                    <h3 className="text-xl font-black italic uppercase text-white tracking-tighter font-display">Semana</h3>
                </div>
                {sortedWorkouts.map(w => (
                    <WorkoutCard key={w.id} workout={w} />
                ))}
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