import React, { useState, useEffect } from 'react';
import { 
  MapPin, ShoppingBag, Heart, User, Search, Clock, ArrowLeft, Star, QrCode, 
  ChevronRight, CheckCircle, Bell, Navigation, Settings, CreditCard, Leaf, 
  Map as MapIcon, List, Mail, Lock, Eye, LogOut, TrendingUp, Info, 
  Store, BarChart3, Camera, Plus, Minus, CheckSquare, Globe, Zap, Target, 
  Briefcase, ShieldCheck, ArrowDown, Users, Award, ArrowRight, Sparkles, 
  ChefHat, Wand2, Loader2, Download
} from 'lucide-react';
import iconImg from './icon.png';

// --- MOCK DATA ---
const OFFERS = [
  { id: 1, name: "Boulangerie L'Artisan", type: "Panier Viennoiseries", desc: "Un assortiment surprise de nos viennoiseries du jour qui n'ont pas trouvé preneur.", price: 30, oldPrice: 90, distance: "400m", time: "Auj. 18:00 - 20:00", rating: 4.8, img: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&q=80", category: "Boulangerie", tags: ["Végétarien"] },
  { id: 2, name: "Restaurant Le Médina", type: "Panier Repas Chaud", desc: "Un délicieux repas invendu de notre service du midi.", price: 45, oldPrice: 120, distance: "850m", time: "Auj. 21:30 - 22:30", rating: 4.5, img: "https://images.unsplash.com/photo-1541518763669-27fef04b14ea?w=600&q=80", category: "Repas", tags: ["Halal", "Plat Chaud"] },
  { id: 3, name: "Café de la Gare", type: "Panier Pâtisseries", desc: "Nos gâteaux et pâtisseries du jour pour vous régaler à petit prix.", price: 20, oldPrice: 60, distance: "1.2km", time: "Auj. 19:00 - 20:00", rating: 4.2, img: "https://images.unsplash.com/photo-1550617931-e17a7b70dce2?w=600&q=80", category: "Café", tags: ["Sucré"] },
];

const PAST_ORDERS = [
  { id: 101, name: "Boulangerie L'Artisan", date: "Hier", price: 30, rating: 5, status: "completed", img: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200&q=80" },
  { id: 102, name: "Café de la Gare", date: "12 Oct", price: 20, rating: 4, status: "completed", img: "https://images.unsplash.com/photo-1550617931-e17a7b70dce2?w=200&q=80" },
];

const B2B_ORDERS = [
  { id: "G849", customer: "Ziad M.", time: "18:30", status: "pending", qty: 1, type: "Panier Viennoiseries" },
  { id: "G210", customer: "Sara K.", time: "18:45", status: "completed", qty: 2, type: "Panier Mixte" },
  { id: "G551", customer: "Amine T.", time: "19:15", status: "pending", qty: 1, type: "Panier Viennoiseries" },
];

const FAVORITES = [OFFERS[0], OFFERS[1]];

// --- GEMINI API HELPER ---
const callGeminiAPI = async (prompt) => {
  const apiKey = ""; // La clé API est injectée par l'environnement d'exécution (ou via les variables d'environnement Vercel)
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
  
  const payload = {
      contents: [{ parts: [{ text: prompt }] }]
  };

  let retries = 5;
  let delay = 1000;

  while (retries > 0) {
      try {
          const response = await fetch(url, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload)
          });

          if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
          
          const result = await response.json();
          return result.candidates?.[0]?.content?.parts?.[0]?.text || "Pas de réponse générée.";
      } catch (error) {
          retries--;
          if (retries === 0) {
              console.error("Gemini API Error:", error);
              return "Oups ! Une erreur est survenue avec l'IA. Veuillez réessayer plus tard.";
          }
          await new Promise(resolve => setTimeout(resolve, delay));
          delay *= 2;
      }
  }
};

// --- CUSTOM ICONS ---
const AppleLogo = ({ size = 22, className = "" }) => (
  <svg viewBox="0 0 384 512" width={size} height={size} fill="currentColor" className={className}>
    <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/>
  </svg>
);

const BrandLogo = ({ size = 40, color = "#2ECC71", className = "" }) => {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M49.5 12C36 12 24.5 19.5 18 30.5" stroke={color} strokeWidth="8" strokeLinecap="round"/>
        <polygon points="12,28 25,28 18,40" fill={color} />
        <path d="M14.5 60C18 73.5 29.5 83 43.5 86.5" stroke={color} strokeWidth="8" strokeLinecap="round"/>
        <polygon points="40,93 40,80 55,87" fill={color} />
        <path d="M82.5 56C81 40.5 73.5 27 60.5 19.5" stroke={color} strokeWidth="8" strokeLinecap="round"/>
        <polygon points="63,12 55,23 68,23" fill={color} />
        <path d="M38 38V52C38 56 42 58 46 58V72" stroke={color} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M32 38V48M44 38V48" stroke={color} strokeWidth="4" strokeLinecap="round"/>
        <path d="M68 40C68 40 58 45 58 55C58 65 68 70 68 70" stroke={color} strokeWidth="5" strokeLinecap="round"/>
      </svg>
    );
  }

  return (
    <div 
      style={{ width: size, height: size }} 
      className={`overflow-hidden rounded-full bg-white flex items-center justify-center shadow-lg ${className}`}
    >
      <img 
        src={iconImg} 
        alt="GastroCycle Logo" 
        className="w-full h-full object-cover p-0.5"
        onError={() => setHasError(true)}
      />
    </div>
  );
};

const IosIcons = ({ colorClass }) => (
  <div className={`flex items-center gap-1.5 ${colorClass}`}>
    <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><rect x="1" y="8" width="3" height="4" rx="1"/><rect x="5" y="6" width="3" height="6" rx="1"/><rect x="9" y="3" width="3" height="9" rx="1"/><rect x="13" y="0" width="3" height="12" rx="1"/></svg>
    <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M8 12C8.6 12 9 11.6 9 11C9 10.4 8.6 10 8 10C7.4 10 7 10.4 7 11C7 11.6 7.4 12 8 12Z"/><path d="M11 8.5C10.2 7.7 9.1 7.2 8 7.2C6.9 7.2 5.8 7.7 5 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M13.5 5.5C12 4.1 10.1 3.2 8 3.2C5.9 3.2 4 4.1 2.5 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M15.5 3C13.5 1.1 10.9 0 8 0C5.1 0 2.5 1.1 0.5 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
    <svg width="22" height="12" viewBox="0 0 22 12" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="0.5" y="0.5" width="19" height="11" rx="3.5" stroke="currentColor" strokeWidth="1"/><rect x="2" y="2" width="13" height="8" rx="2" fill="currentColor"/><path d="M21 4V8C21.6 8 22 7.6 22 7V5C22 4.4 21.6 4 21 4Z" fill="currentColor"/></svg>
  </div>
);

export default function App() {
  const [appMode, setAppMode] = useState('b2c');
  const [currentScreen, setCurrentScreen] = useState('splash');
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [activeTab, setActiveTab] = useState('home');
  const [viewMode, setViewMode] = useState('list');
  const [ordersTab, setOrdersTab] = useState('active');
  const [activeOrders, setActiveOrders] = useState([]);
  const [onboardingSlide, setOnboardingSlide] = useState(0);

  const [basketQty, setBasketQty] = useState(5);
  const [isPublished, setIsPublished] = useState(true);

  const [recipeIngredients, setRecipeIngredients] = useState("");
  const [recipeLoading, setRecipeLoading] = useState(false);
  const [recipeResult, setRecipeResult] = useState("");

  const [descItems, setDescItems] = useState("");
  const [descLoading, setDescLoading] = useState(false);
  const [descResult, setDescResult] = useState("Un assortiment surprise de nos viennoiseries du jour qui n'ont pas trouvé preneur.");

  // For the Download Project Feature
  const [isDownloading, setIsDownloading] = useState(false);

  const isDarkStatusBar = !['splash', 'details', 'success', 'b2b_scanner'].includes(currentScreen);
  const statusBarColor = isDarkStatusBar ? 'text-gray-900' : 'text-white';

  useEffect(() => {
    if (!document.getElementById('gastro-premium-fonts')) {
      const style = document.createElement('style');
      style.id = 'gastro-premium-fonts';
      style.innerHTML = `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Outfit:wght@400;500;600;700;800;900&display=swap');
        .font-inter { font-family: 'Inter', sans-serif; }
        .font-outfit { font-family: 'Outfit', sans-serif; }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .premium-shadow { box-shadow: 0 0 0 1px #333, 0 30px 60px -15px rgba(0, 0, 0, 0.6); }
        .glass-panel { background: rgba(255, 255, 255, 0.85); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); }
        
        @keyframes slideUp { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .animate-slide-up { animation: slideUp 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }
        @keyframes scaleUp { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .animate-scale-up { animation: scaleUp 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
        @keyframes scanline { 0% { top: 0; } 50% { top: 100%; } 100% { top: 0; } }
        .animate-scanline { animation: scanline 2s linear infinite; }
        @keyframes scroll-bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(10px); } }
        .animate-scroll-bounce { animation: scroll-bounce 2s infinite; }
        @keyframes spin-slow { 100% { transform: rotate(360deg); } }
        .animate-spin-slow { animation: spin-slow 2s linear infinite; }
      `;
      document.head.appendChild(style);
    }
    
    if (currentScreen === 'splash') {
      const timer = setTimeout(() => setCurrentScreen(appMode === 'b2c' ? 'onboarding' : 'b2b_home'), 2000);
      return () => clearTimeout(timer);
    }
  }, [currentScreen, appMode]);

  const switchAppMode = (mode) => {
    setAppMode(mode);
    if (mode === 'b2c') {
      setCurrentScreen('home');
      setActiveTab('home');
    } else {
      setCurrentScreen('b2b_home');
      setActiveTab('b2b_home');
    }
  };

  const navigate = (screen, data = null) => {
    if (data) setSelectedOffer(data);
    setCurrentScreen(screen);
    if(['home', 'favorites', 'orders', 'profile', 'b2b_home', 'b2b_inventory', 'b2b_scanner', 'b2b_profile'].includes(screen)) {
      setActiveTab(screen);
    }
  };

  const handlePurchase = () => {
    setActiveOrders([...activeOrders, { ...selectedOffer, orderId: `G${Math.floor(1000 + Math.random() * 9000)}` }]);
    navigate('success', selectedOffer);
  };

  const handleGenerateRecipe = async () => {
    if(!recipeIngredients) return;
    setRecipeLoading(true);
    const prompt = `Agis comme un chef anti-gaspillage sympathique. Je viens d'acheter un panier surprise boulangerie/traiteur et dans mon frigo j'ai aussi : ${recipeIngredients}. Propose-moi UNE recette très courte et facile pour combiner tout ça sans rien jeter. Utilise des emojis. Garde ça sous 4 phrases.`;
    const result = await callGeminiAPI(prompt);
    setRecipeResult(result);
    setRecipeLoading(false);
  };

  const handleGenerateDescription = async () => {
    if(!descItems) return;
    setDescLoading(true);
    const prompt = `Tu es un expert en marketing écologique pour la plateforme "GastroCycle". Écris une courte description (1 à 2 phrases maximum) ultra-appétissante pour vendre un panier surprise contenant principalement : ${descItems}. L'objectif est de donner faim et de valoriser l'aspect anti-gaspillage. Ajoute 2 ou 3 emojis pertinents.`;
    const result = await callGeminiAPI(prompt);
    setDescResult(result);
    setDescLoading(false);
  };

  // --- DOWNLOAD PROJECT HANDLER ---
  const handleDownloadProject = async () => {
    setIsDownloading(true);
    try {
      // Load JSZip dynamically
      if (!window.JSZip) {
        await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });
      }
      
      const zip = new window.JSZip();
      
      // Setup Project Root Files
      zip.file("package.json", JSON.stringify({
        name: "gastrocycle-app",
        private: true,
        version: "1.0.0",
        type: "module",
        scripts: {
          dev: "vite",
          build: "vite build",
          preview: "vite preview"
        },
        dependencies: {
          "lucide-react": "^0.263.1",
          "react": "^18.2.0",
          "react-dom": "^18.2.0"
        },
        devDependencies: {
          "@vitejs/plugin-react": "^4.0.3",
          "autoprefixer": "^10.4.14",
          "postcss": "^8.4.27",
          "tailwindcss": "^3.3.3",
          "vite": "^5.0.0"
        }
      }, null, 2));

      zip.file("tailwind.config.js", `/** @type {import('tailwindcss').Config} */\nexport default {\n  content: [\n    "./index.html",\n    "./src/**/*.{js,ts,jsx,tsx}",\n  ],\n  theme: {\n    extend: {},\n  },\n  plugins: [],\n}`);
      zip.file("postcss.config.js", `export default {\n  plugins: {\n    tailwindcss: {},\n    autoprefixer: {},\n  },\n}`);
      zip.file("vite.config.js", `import { defineConfig } from 'vite'\nimport react from '@vitejs/plugin-react'\n\nexport default defineConfig({\n  plugins: [react()],\n})`);
      zip.file("index.html", `<!doctype html>\n<html lang="fr">\n  <head>\n    <meta charset="UTF-8" />\n    <link rel="icon" type="image/jpeg" href="/icon.jpg" />\n    <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n    <title>GastroCycle App</title>\n  </head>\n  <body>\n    <div id="root"></div>\n    <script type="module" src="/src/main.jsx"><\/script>\n  </body>\n</html>`);
      
      // Setup Src Folder
      const src = zip.folder("src");
      src.file("main.jsx", `import React from 'react'\nimport ReactDOM from 'react-dom/client'\nimport App from './App.jsx'\nimport './index.css'\n\nReactDOM.createRoot(document.getElementById('root')).render(\n  <React.StrictMode>\n    <App />\n  </React.StrictMode>,\n)`);
      src.file("index.css", `@tailwind base;\n@tailwind components;\n@tailwind utilities;\n\nbody {\n  margin: 0;\n  padding: 0;\n  background-color: #0A0A0A;\n}`);

      // Fetch the actual App.jsx code running right now! (Works in Vite dev mode)
      let appCode = "// Impossible de récupérer le code source depuis le navigateur.\n// Veuillez copier le code d'App.jsx depuis votre éditeur.";
      try {
        const response = await fetch('/src/App.jsx');
        if (response.ok) {
          appCode = await response.text();
        }
      } catch (e) {
        console.warn("Could not fetch App.jsx directly.");
      }
      src.file("App.jsx", appCode);

      // Fetch the icon image
      try {
        const iconRes = await fetch('/icon.jpg');
        if (iconRes.ok) {
          const iconBlob = await iconRes.blob();
          zip.folder("public").file("icon.jpg", iconBlob);
        }
      } catch(e) {}

      // Generate the ZIP file
      const content = await zip.generateAsync({type: "blob"});
      const url = window.URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = url;
      link.download = "GastroCycle_Project.zip";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la génération du fichier ZIP.");
    } finally {
      setIsDownloading(false);
    }
  };

  // ---------------------------------------------------------
  // RENDERERS
  // ---------------------------------------------------------

  const renderSplashScreen = () => (
    <div className="flex-1 min-h-0 bg-[#2ECC71] flex flex-col items-center justify-center text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-10"></div>
      <BrandLogo size={120} color="#FFFFFF" className="animate-bounce" />
      <h1 className="text-4xl font-outfit font-extrabold mt-6 tracking-tight animate-fade-in">GastroCycle</h1>
      <p className="mt-2 font-inter font-semibold opacity-90 text-sm tracking-widest uppercase animate-fade-in">Maroc</p>
    </div>
  );

  const renderOnboarding = () => {
    const slides = [
      { title: "Sauvez des repas", desc: "Récupérez les invendus de vos commerçants préférés à petit prix.", icon: <ShoppingBag size={80} color="#2ECC71"/> },
      { title: "Jusqu'à -70%", desc: "Des paniers surprises de grande qualité pour soulager votre portefeuille.", icon: <TrendingUp size={80} color="#E67E22"/> },
      { title: "Impact Positif", desc: "Chaque panier sauvé évite l'émission de CO2 liée au gaspillage.", icon: <Leaf size={80} color="#34495E"/> }
    ];
    return (
      <div className="flex-1 min-h-0 bg-white flex flex-col animate-fade-in relative pt-14 overflow-hidden">
        <div className="flex-1 min-h-0 flex flex-col items-center justify-center p-8 text-center mt-4">
          <div className="h-48 w-48 bg-gray-50 rounded-full flex items-center justify-center mb-8 animate-scale-up shadow-inner">
            {slides[onboardingSlide].icon}
          </div>
          <h2 className="text-3xl font-outfit font-extrabold text-[#111] mb-3 animate-slide-up">{slides[onboardingSlide].title}</h2>
          <p className="text-gray-500 font-inter font-medium leading-relaxed animate-slide-up px-4">{slides[onboardingSlide].desc}</p>
        </div>
        <div className="p-8 pb-12 shrink-0">
          <div className="flex justify-center gap-2 mb-10">
            {slides.map((_, i) => <div key={i} className={`h-2 rounded-full transition-all duration-300 ${i === onboardingSlide ? 'w-8 bg-[#2ECC71]' : 'w-2 bg-gray-200'}`} />)}
          </div>
          <button onClick={() => onboardingSlide < 2 ? setOnboardingSlide(onboardingSlide + 1) : navigate('auth')} className="w-full bg-[#111] text-white py-4 rounded-2xl font-inter font-bold text-lg active:scale-95 transition-transform shadow-lg">
            {onboardingSlide < 2 ? "Continuer" : "C'est parti !"}
          </button>
        </div>
      </div>
    );
  };

  const renderAuth = () => (
    <div className="flex-1 min-h-0 bg-white flex flex-col animate-fade-in p-6 pt-24 overflow-y-auto hide-scrollbar">
      <BrandLogo size={50} color="#2ECC71" className="mb-6 shrink-0" />
      <h2 className="text-4xl font-outfit font-extrabold text-[#111] mb-2 shrink-0">Connexion</h2>
      <p className="text-gray-500 font-inter font-medium mb-10 leading-relaxed shrink-0">Rejoignez le mouvement anti-gaspi marocain.</p>
      <div className="space-y-4 mb-8 shrink-0">
        <div className="relative group">
          <span className="absolute left-4 top-4 text-gray-400 group-focus-within:text-[#2ECC71] transition-colors"><Mail size={20} /></span>
          <input type="email" placeholder="Email" className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 pl-12 pr-4 font-inter font-medium text-[#111] outline-none focus:border-[#2ECC71] focus:bg-white transition-all" />
        </div>
        <div className="relative group">
          <span className="absolute left-4 top-4 text-gray-400 group-focus-within:text-[#2ECC71] transition-colors"><Lock size={20} /></span>
          <input type="password" placeholder="Mot de passe" className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 pl-12 pr-4 font-inter font-medium text-[#111] outline-none focus:border-[#2ECC71] focus:bg-white transition-all" />
        </div>
      </div>
      <button onClick={() => navigate('home')} className="w-full bg-[#2ECC71] text-white py-4 rounded-2xl font-inter font-bold text-lg shadow-lg shadow-[#2ECC71]/30 active:scale-95 transition-all mb-8 shrink-0">
        Se connecter
      </button>

      <div className="relative flex items-center justify-center mb-8 shrink-0">
        <div className="border-t border-gray-200 w-full absolute"></div>
        <span className="bg-white px-4 text-xs font-inter font-semibold text-gray-400 relative tracking-wider">OU CONTINUER AVEC</span>
      </div>

      <div className="flex gap-4 shrink-0">
        <button className="flex-1 bg-white border border-gray-200 py-3.5 rounded-2xl flex justify-center items-center active:bg-gray-50 transition-colors shadow-sm">
          <AppleLogo size={22} className="text-[#111]" />
        </button>
        <button className="flex-1 bg-white border border-gray-200 py-3.5 rounded-2xl flex justify-center items-center active:bg-gray-50 transition-colors shadow-sm font-bold text-gray-600 text-lg">
          G
        </button>
      </div>
    </div>
  );

  const renderHome = () => (
    <div className="flex-1 min-h-0 flex flex-col bg-[#F9FAFB] overflow-hidden animate-fade-in pb-20 pt-14">
      <div className="bg-white px-6 pb-4 pt-2 rounded-b-[2rem] shadow-sm z-20 shrink-0">
        <div className="flex justify-between items-center mb-5">
          <div>
            <p className="text-[10px] font-inter font-bold text-gray-400 uppercase tracking-widest mb-0.5">Votre Position</p>
            <div className="flex items-center gap-1 text-[#111] font-outfit font-bold text-lg cursor-pointer">Rabat, Agdal <ChevronRight size={16} /></div>
          </div>
          <button className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-[#111] relative active:scale-95 transition-transform">
            <Bell size={20} /><span className="absolute top-2 right-2 w-2.5 h-2.5 bg-[#E67E22] rounded-full border-2 border-white"></span>
          </button>
        </div>
        <div className="relative">
          <div className="w-full bg-gray-100 border border-transparent rounded-2xl py-3.5 px-11 text-sm font-inter font-medium text-gray-400">Chercher commerce...</div>
          <span className="absolute left-4 top-3.5 text-gray-400"><Search size={18} /></span>
        </div>
      </div>

      <div className="flex-1 min-h-0 relative overflow-hidden">
        <div className="absolute top-4 right-4 z-30 glass-panel shadow-lg rounded-full flex p-1 border border-white">
          <button onClick={() => setViewMode('list')} className={`p-2 rounded-full transition-colors ${viewMode === 'list' ? 'bg-[#111] text-white shadow-sm' : 'text-gray-500'}`}><List size={16} /></button>
          <button onClick={() => setViewMode('map')} className={`p-2 rounded-full transition-colors ${viewMode === 'map' ? 'bg-[#111] text-white shadow-sm' : 'text-gray-500'}`}><MapIcon size={16} /></button>
        </div>

        {viewMode === 'map' ? (
          <div className="w-full h-full bg-[#E5F5EF] relative animate-fade-in overflow-hidden">
             <div className="absolute inset-0 opacity-40"></div>
             <div className="absolute top-24 left-8 p-2 rounded-full bg-white shadow-xl border-2 border-white text-[#E67E22]"><ShoppingBag size={18}/></div>
             <div className="absolute top-48 right-12 p-2 rounded-full bg-white shadow-xl border-2 border-white text-[#2ECC71]"><ShoppingBag size={18}/></div>
             <div className="absolute bottom-1/3 left-1/4 p-3.5 rounded-full bg-[#2ECC71] shadow-[0_10px_20px_rgba(46,204,113,0.4)] border-2 border-white text-white z-10 animate-bounce"><ShoppingBag size={22}/></div>
             
             <div className="absolute bottom-6 inset-x-4 glass-panel rounded-[2rem] p-4 shadow-xl flex gap-4 cursor-pointer border border-white" onClick={() => navigate('details', OFFERS[0])}>
                <img src={OFFERS[0].img} alt="" className="w-20 h-20 rounded-2xl object-cover shadow-sm shrink-0" />
                <div className="flex-1 flex flex-col justify-between py-1 overflow-hidden">
                  <div>
                    <h4 className="font-outfit font-bold text-base text-[#111] leading-tight truncate">{OFFERS[0].name}</h4>
                    <p className="text-xs text-gray-500 font-inter mt-1 truncate">{OFFERS[0].type}</p>
                  </div>
                  <div className="flex justify-between items-end">
                    <span className="text-xs text-gray-500 font-inter font-medium bg-white px-2 py-1 rounded-md shadow-sm shrink-0"><MapPin size={10} color="#E67E22" className="mr-1"/>{OFFERS[0].distance}</span>
                    <span className="font-outfit font-black text-lg text-[#2ECC71] shrink-0">{OFFERS[0].price} DH</span>
                  </div>
                </div>
             </div>
          </div>
        ) : (
          <div className="w-full h-full overflow-y-auto hide-scrollbar animate-fade-in">
            <div className="flex gap-2.5 px-6 py-5 overflow-x-auto hide-scrollbar shrink-0">
              <button className="px-5 py-2 bg-[#111] text-white rounded-full font-inter font-semibold text-sm whitespace-nowrap shadow-md">Tous</button>
              <button className="px-5 py-2 bg-white border border-gray-200 text-gray-600 rounded-full font-inter font-medium text-sm whitespace-nowrap shadow-sm">🥐 Boulangeries</button>
              <button className="px-5 py-2 bg-white border border-gray-200 text-gray-600 rounded-full font-inter font-medium text-sm whitespace-nowrap shadow-sm">🍲 Repas Chauds</button>
            </div>

            <div className="px-6 pb-6">
              <h2 className="text-xl font-outfit font-bold text-[#111] mb-4">Près de chez vous</h2>
              <div className="space-y-4">
                {OFFERS.map(offer => (
                  <button key={offer.id} onClick={() => navigate('details', offer)} className="w-full text-left bg-white rounded-[2rem] p-3 shadow-sm border border-gray-100 flex gap-4 active:scale-[0.97] transition-transform">
                    <img src={offer.img} alt="" className="w-[100px] h-[100px] rounded-[1.5rem] object-cover bg-gray-50 shrink-0" />
                    <div className="flex-1 flex flex-col justify-between py-1.5 pr-2 overflow-hidden">
                      <div>
                        <div className="flex justify-between items-start">
                          <h4 className="font-outfit font-bold text-base leading-tight text-[#111] pr-2 line-clamp-1">{offer.name}</h4>
                          <div className="flex items-center gap-1 text-[10px] font-inter font-bold bg-[#FEF3C7] text-[#D97706] px-1.5 py-0.5 rounded-md shrink-0">
                            <Star size={10} color="currentColor" fill="currentColor" /> {offer.rating}
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 font-inter mt-1 line-clamp-1">{offer.type}</p>
                      </div>
                      <div className="flex justify-between items-end mt-2">
                        <p className="text-[11px] text-gray-500 font-inter font-medium flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-md shrink-0">
                          <MapPin size={10} color="#2ECC71"/> {offer.distance}
                        </p>
                        <div className="text-right flex items-center gap-2 shrink-0">
                          <span className="text-xs text-gray-400 line-through font-inter font-medium">{offer.oldPrice} DH</span>
                          <span className="font-outfit font-black text-lg text-[#2ECC71]">{offer.price} DH</span>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderFavorites = () => (
    <div className="flex-1 min-h-0 flex flex-col bg-[#F9FAFB] overflow-hidden animate-fade-in pb-20 pt-14">
      <div className="bg-[#F9FAFB] px-6 pb-2 z-10 sticky top-0 shrink-0">
        <h2 className="text-3xl font-outfit font-bold text-[#111] mb-6">Favoris</h2>
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto px-6 hide-scrollbar pb-6">
        <div className="space-y-4">
          {FAVORITES.map(offer => (
            <div key={offer.id} className="w-full bg-white rounded-[2rem] p-3 shadow-sm border border-gray-100 flex gap-4">
              <img src={offer.img} alt="" className="w-20 h-20 rounded-2xl object-cover bg-gray-50 shrink-0" />
              <div className="flex-1 flex flex-col justify-center overflow-hidden">
                <div className="flex justify-between items-start">
                  <h4 className="font-outfit font-bold text-base leading-tight text-[#111] pr-2 truncate">{offer.name}</h4>
                  <Heart size={18} color="#ef4444" fill="#ef4444" className="shrink-0" />
                </div>
                <p className="text-xs text-gray-500 font-inter mt-1 mb-2 truncate">{offer.category}</p>
                <button onClick={() => navigate('details', offer)} className="self-start text-xs font-inter font-bold text-white bg-[#111] px-4 py-1.5 rounded-lg active:scale-95 transition-transform shrink-0">
                  Voir les offres
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderDetails = () => (
    <div className="flex-1 min-h-0 flex flex-col bg-white z-20 animate-slide-up relative overflow-hidden">
      <div className="h-[340px] relative shrink-0">
        <img src={selectedOffer.img} alt={selectedOffer.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-black/20 to-black/50"></div>
        <button onClick={() => navigate('home')} className="absolute top-16 left-6 w-10 h-10 glass-panel rounded-full flex items-center justify-center text-white active:scale-95 transition-transform"><ArrowLeft size={20} color="#111" /></button>
        
        <div className="absolute bottom-8 left-6 right-6">
          <div className="flex gap-2 flex-wrap mb-3">
             <div className="px-3 py-1 bg-[#2ECC71] rounded-lg text-white text-xs font-inter font-bold uppercase tracking-wider shadow-sm">{selectedOffer.category}</div>
          </div>
          <h1 className="text-3xl font-outfit font-bold text-white leading-tight drop-shadow-md">{selectedOffer.name}</h1>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto px-6 pt-6 pb-36 bg-white rounded-t-[2.5rem] -mt-6 relative z-10 hide-scrollbar">
        <h2 className="text-xl font-outfit font-bold text-[#111] mb-4">{selectedOffer.type}</h2>
        
        <div className="flex items-center gap-4 text-sm font-inter font-medium text-gray-600 mb-8 bg-gray-50 p-4 rounded-2xl border border-gray-100 shrink-0">
          <span className="flex items-center gap-1.5 text-[#D97706] bg-[#FEF3C7] px-2 py-1 rounded-md shrink-0"><Star size={14} color="currentColor" fill="currentColor"/> {selectedOffer.rating}</span>
          <span className="flex items-center gap-1.5 text-[#E67E22] shrink-0"><MapPin size={14}/> {selectedOffer.distance}</span>
        </div>

        <div className="space-y-4 mb-8 shrink-0">
          <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
            <div className="w-12 h-12 rounded-xl bg-[#E8F8F5] flex items-center justify-center text-[#2ECC71] shrink-0"><Clock size={22} /></div>
            <div>
              <p className="text-gray-400 text-[10px] uppercase font-inter font-bold tracking-widest mb-0.5">Collecte</p>
              <p className="font-outfit font-bold text-base text-[#111]">{selectedOffer.time}</p>
            </div>
          </div>
        </div>

        <div className="mb-8 shrink-0">
          <h3 className="font-outfit font-bold text-[#111] mb-3 text-lg flex items-center gap-2"><Info size={18} color="#9ca3af"/> Le Concept</h3>
          <p className="text-[14px] text-gray-500 font-inter leading-relaxed bg-gray-50 p-5 rounded-[2rem] border border-gray-100">{selectedOffer.desc}</p>
        </div>
      </div>

      <div className="absolute bottom-0 inset-x-0 glass-panel border-t border-gray-100 p-6 pb-10 z-20 shrink-0">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-[11px] text-gray-500 font-inter font-bold uppercase tracking-widest mb-0.5">Total</p>
            <div className="flex items-end gap-2">
              <p className="text-3xl font-outfit font-black text-[#111] leading-none">{selectedOffer.price} DH</p>
            </div>
          </div>
          <button onClick={() => navigate('checkout', selectedOffer)} className="bg-[#2ECC71] text-white px-10 py-4 rounded-[1.25rem] font-inter font-bold active:scale-95 transition-transform text-[15px] shadow-[0_10px_20px_rgba(46,204,113,0.3)] shrink-0">
            Réserver
          </button>
        </div>
      </div>
    </div>
  );

  const renderCheckout = () => (
    <div className="flex-1 min-h-0 flex flex-col bg-[#F9FAFB] z-30 animate-slide-up relative pt-14 overflow-hidden">
      <div className="bg-[#F9FAFB] pb-4 px-6 flex items-center gap-4 z-10 sticky top-0 shrink-0">
        <button onClick={() => navigate('details', selectedOffer)} className="w-10 h-10 bg-white shadow-sm border border-gray-100 rounded-full flex items-center justify-center text-[#111] active:scale-95 transition-transform shrink-0"><ArrowLeft size={20} /></button>
        <h2 className="text-2xl font-outfit font-bold text-[#111]">Paiement</h2>
      </div>
      
      <div className="flex-1 min-h-0 overflow-y-auto p-6 pb-32 hide-scrollbar">
        <h3 className="font-inter font-bold text-gray-400 mb-4 uppercase tracking-widest text-[11px]">Résumé</h3>
        <div className="bg-white p-4 rounded-[2rem] shadow-sm border border-gray-100 flex gap-4 mb-8">
          <img src={selectedOffer.img} className="w-16 h-16 rounded-xl object-cover shrink-0" alt=""/>
          <div className="flex-1 overflow-hidden">
            <h4 className="font-outfit font-bold text-[#111] text-base truncate">{selectedOffer.name}</h4>
            <p className="text-xs text-gray-500 font-inter mt-0.5 truncate">{selectedOffer.type}</p>
            <div className="flex justify-between items-end mt-2">
              <span className="text-sm font-outfit font-black text-[#2ECC71]">{selectedOffer.price} DH</span>
            </div>
          </div>
        </div>

        <h3 className="font-inter font-bold text-gray-400 mb-4 uppercase tracking-widest text-[11px]">Moyen de paiement</h3>
        <div className="space-y-3">
          <label className="flex items-center justify-between p-4 bg-white border-2 border-[#111] rounded-[1.5rem] cursor-pointer shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-[#111] shrink-0"><CreditCard size={20}/></div>
              <span className="font-inter font-semibold text-[#111]">Carte bancaire<br/><span className="text-xs text-gray-400 font-normal">••• 4242</span></span>
            </div>
            <div className="w-6 h-6 rounded-full border-[6px] border-[#111] flex items-center justify-center shrink-0"></div>
          </label>
        </div>
      </div>

      <div className="absolute bottom-0 inset-x-0 glass-panel border-t border-gray-100 p-6 pb-10">
        <button onClick={handlePurchase} className="w-full bg-[#111] text-white py-4 rounded-2xl font-inter font-bold text-lg active:scale-95 transition-transform shadow-[0_10px_20px_rgba(0,0,0,0.2)] flex items-center justify-center gap-2">
          Confirmer {selectedOffer.price} DH
        </button>
        <p className="text-center text-[10px] text-gray-500 font-inter font-medium mt-4 flex items-center justify-center gap-1.5"><ShieldCheck size={14} color="#2ECC71"/> Paiement 100% sécurisé</p>
      </div>
    </div>
  );

  const renderSuccess = () => (
    <div className="flex-1 min-h-0 flex flex-col bg-[#111] z-40 animate-fade-in relative text-center px-6 pt-14 overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-[#2ECC71] rounded-full blur-[100px] opacity-30"></div>
      </div>
      
      <div className="relative z-10 flex-1 min-h-0 flex flex-col items-center justify-center">
          <div className="w-20 h-20 bg-[#2ECC71] rounded-full flex items-center justify-center text-white mb-6 shadow-[0_0_40px_rgba(46,204,113,0.5)] animate-scale-up shrink-0"><CheckCircle size={40} /></div>
          <h2 className="text-4xl font-outfit font-extrabold text-white mb-2">C'est validé !</h2>
          <p className="text-gray-300 font-inter font-medium text-sm mb-10 max-w-xs">Votre panier vous attend chez <br/><span className="text-white font-bold">{selectedOffer.name}</span></p>
          
          <div className="bg-white text-[#111] p-8 rounded-[2.5rem] w-full shadow-2xl relative animate-slide-up" style={{animationDelay: '100ms'}}>
            <p className="text-[11px] font-inter font-bold text-gray-400 uppercase tracking-widest mb-1 mt-2">Collecte</p>
            <p className="font-outfit font-bold text-[#E67E22] mb-8 text-base">{selectedOffer.time}</p>
            <div className="w-36 h-36 mx-auto bg-gray-50 rounded-[2rem] border border-gray-100 flex items-center justify-center mb-8 text-[#111] shadow-inner shrink-0"><QrCode size={80} strokeWidth={1.5} /></div>
            <p className="text-[10px] font-inter font-bold text-gray-400 uppercase tracking-widest mb-1">Code Secret</p>
            <p className="text-4xl font-outfit font-black tracking-widest text-[#111]">G849</p>
          </div>
      </div>

      <div className="relative z-10 pb-10 w-full mt-8 shrink-0">
        <button onClick={() => navigate('orders')} className="w-full bg-white/10 text-white py-4 rounded-2xl font-inter font-bold text-sm active:bg-white/20 transition-colors">Voir mes commandes</button>
      </div>
    </div>
  );

  const renderOrders = () => (
    <div className="flex-1 min-h-0 flex flex-col bg-[#F9FAFB] overflow-hidden animate-fade-in pb-20 pt-14">
      <div className="bg-[#F9FAFB] px-6 pb-2 z-10 sticky top-0 shrink-0">
        <h2 className="text-3xl font-outfit font-bold text-[#111] mb-6">Paniers</h2>
        <div className="flex gap-6 border-b border-gray-200">
          <button onClick={() => setOrdersTab('active')} className={`pb-3 font-inter font-semibold text-sm transition-colors relative ${ordersTab === 'active' ? 'text-[#111]' : 'text-gray-400'}`}>En cours ({activeOrders.length}){ordersTab === 'active' && <div className="absolute bottom-0 inset-x-0 h-0.5 bg-[#111] rounded-t-full"></div>}</button>
          <button onClick={() => setOrdersTab('history')} className={`pb-3 font-inter font-semibold text-sm transition-colors relative ${ordersTab === 'history' ? 'text-[#111]' : 'text-gray-400'}`}>Historique{ordersTab === 'history' && <div className="absolute bottom-0 inset-x-0 h-0.5 bg-[#111] rounded-t-full"></div>}</button>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto p-6 hide-scrollbar">
        {ordersTab === 'active' ? (
          activeOrders.length > 0 ? (
            <div className="space-y-4">
              {activeOrders.map((order, i) => (
                <div key={i} className="bg-white rounded-[2rem] p-4 shadow-sm border border-[#2ECC71]/40 relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-[#2ECC71] text-white px-3 py-1.5 rounded-bl-xl text-[9px] font-inter font-bold uppercase tracking-wider">À récupérer</div>
                  <div className="flex gap-4 mb-4">
                    <img src={order.img} className="w-16 h-16 rounded-xl object-cover shrink-0" alt=""/>
                    <div className="pr-4 mt-2 overflow-hidden">
                      <h4 className="font-outfit font-bold text-[#111] text-base truncate">{order.name}</h4>
                    </div>
                  </div>
                  <div className="bg-[#F8FAFC] p-3.5 rounded-xl flex justify-between items-center border border-gray-100">
                    <div>
                      <p className="text-[10px] text-gray-500 font-inter font-bold uppercase tracking-wider mb-0.5">Code</p>
                      <p className="font-outfit font-bold text-[#111]">{order.orderId}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-gray-500 font-inter font-bold uppercase tracking-wider mb-0.5">Aujourd'hui</p>
                      <p className="font-outfit font-black text-[#E67E22] text-sm">{order.time.split(', ')[1] || order.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
             <div className="flex flex-col items-center justify-center h-full text-center mt-20">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4"><ShoppingBag size={32} color="#d1d5db" /></div>
              <p className="font-inter font-medium text-gray-500">Aucune commande en cours.</p>
            </div>
          )
        ) : (
          <div className="space-y-4">
             {PAST_ORDERS.map(order => (
               <div key={order.id} className="bg-white rounded-[2rem] p-4 shadow-sm border border-gray-100 flex gap-4">
                 <img src={order.img} className="w-16 h-16 rounded-xl object-cover grayscale opacity-60 shrink-0" alt=""/>
                 <div className="flex-1 flex flex-col justify-between py-1 overflow-hidden">
                   <div>
                     <h4 className="font-outfit font-bold text-[#111] text-sm truncate">{order.name}</h4>
                     <p className="text-[11px] text-gray-400 font-inter mt-0.5">{order.date}</p>
                   </div>
                   <div className="flex justify-between items-end">
                     <span className="font-outfit font-bold text-[#111] text-sm">{order.price} DH</span>
                   </div>
                 </div>
               </div>
             ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="flex-1 min-h-0 flex flex-col bg-[#F9FAFB] animate-fade-in pb-20 pt-14 overflow-hidden">
       <div className="px-6 pb-6 shadow-sm z-10 shrink-0">
          <div className="flex items-center justify-between mb-8">
             <h2 className="text-3xl font-outfit font-bold text-[#111]">Profil</h2>
          </div>
          <div className="flex items-center gap-4 bg-white p-4 rounded-[2rem] border border-gray-100 shadow-sm">
            <div className="w-14 h-14 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 font-bold shrink-0">ZM</div>
            <div className="overflow-hidden">
              <h2 className="text-xl font-outfit font-bold text-[#111] truncate">Ziad M.</h2>
              <p className="text-xs font-inter font-medium text-gray-500 mt-0.5 truncate">Membre depuis Oct 2025</p>
            </div>
          </div>
       </div>

       <div className="flex-1 min-h-0 overflow-y-auto px-6 pb-24 hide-scrollbar">
          {/* --- AI FEATURE : RECIPE GENERATOR --- */}
          <div className="mb-8">
            <h3 className="font-inter font-bold text-gray-400 mb-4 text-[11px] uppercase tracking-widest flex items-center gap-2">
               <Sparkles size={14} color="#E67E22" /> Chef Anti-Gaspi IA
            </h3>
            <div className="bg-white p-5 rounded-[2rem] border border-gray-100 shadow-sm">
               <p className="text-sm font-inter font-medium text-gray-600 mb-4">
                 Générateur de recette magique 🪄 ! Que vous reste-t-il dans le frigo pour accompagner vos paniers surprises ?
               </p>
               <textarea 
                  value={recipeIngredients}
                  onChange={(e) => setRecipeIngredients(e.target.value)}
                  placeholder="Ex: 2 tomates un peu molles, 1 oeuf..."
                  className="w-full bg-gray-50 rounded-2xl p-4 text-sm font-inter text-[#111] border border-transparent focus:border-[#E67E22] outline-none mb-3 resize-none h-20"
               ></textarea>
               <button 
                 onClick={handleGenerateRecipe}
                 disabled={recipeLoading || !recipeIngredients}
                 className="w-full py-3 bg-[#E67E22] text-white rounded-xl font-inter font-bold text-sm active:scale-95 transition-transform flex justify-center items-center gap-2 disabled:opacity-50"
               >
                 {recipeLoading ? <Loader2 size={16} className="animate-spin-slow" /> : <ChefHat size={16} />}
                 Trouver une recette
               </button>

               {recipeResult && (
                 <div className="mt-4 p-4 bg-[#FEF3C7]/40 border border-[#FEF3C7] rounded-xl text-sm font-inter text-gray-700">
                   <p className="whitespace-pre-line">{recipeResult}</p>
                 </div>
               )}
            </div>
          </div>

          <h3 className="font-inter font-bold text-gray-400 mb-4 text-[11px] uppercase tracking-widest">Mon Impact Écologique</h3>
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-[#2ECC71] p-5 rounded-[2rem] text-white shadow-[0_10px_20px_rgba(46,204,113,0.2)]">
              <div className="mb-3 opacity-80"><Leaf size={20} color="currentColor" /></div>
              <p className="text-3xl font-outfit font-black mb-0.5">{activeOrders.length + 2}</p>
              <p className="text-xs font-inter font-medium opacity-90">Paniers sauvés</p>
            </div>
            <div className="bg-[#111] p-5 rounded-[2rem] text-white shadow-lg">
              <div className="mb-3 text-[#E67E22]"><TrendingUp size={20} color="currentColor" /></div>
              <p className="text-3xl font-outfit font-black mb-0.5">{(activeOrders.length * 30) + 50} <span className="text-base">DH</span></p>
              <p className="text-xs font-inter font-medium text-gray-400">Économisés</p>
            </div>
          </div>
          
          <button onClick={() => navigate('auth')} className="w-full mt-4 py-4 bg-white border border-gray-200 text-red-500 rounded-2xl font-inter font-bold text-sm active:bg-gray-50 transition-colors flex justify-center items-center gap-2">
            <LogOut size={16} color="currentColor" /> Déconnexion
          </button>
       </div>
    </div>
  );

  // ---------------------------------------------------------
  // B2B SCREENS (SELLER MODE)
  // ---------------------------------------------------------

  const renderB2BHome = () => (
    <div className="flex-1 min-h-0 flex flex-col bg-[#F9FAFB] overflow-hidden animate-fade-in">
      <div className="bg-[#111] px-6 pt-14 pb-8 rounded-b-[2.5rem] shadow-xl z-20 relative shrink-0">
         <div className="absolute top-0 right-0 w-40 h-40 bg-[#E67E22] blur-[60px] opacity-30 rounded-full pointer-events-none"></div>
         <p className="text-gray-400 text-xs font-inter font-bold uppercase tracking-widest mb-1 relative z-10">Aujourd'hui</p>
         <h2 className="text-2xl font-outfit font-bold text-white relative z-10 truncate">Boulangerie L'Artisan</h2>
         
         <div className="flex gap-4 mt-8 relative z-10">
            <div className="flex-1 bg-white/10 backdrop-blur-md p-4 rounded-[1.5rem] border border-white/10">
               <p className="text-xs text-gray-300 font-inter font-medium mb-1">Revenus (est.)</p>
               <p className="text-2xl font-outfit font-black text-[#2ECC71]">240 DH</p>
            </div>
            <div className="flex-1 bg-white/10 backdrop-blur-md p-4 rounded-[1.5rem] border border-white/10">
               <p className="text-xs text-gray-300 font-inter font-medium mb-1">Paniers vendus</p>
               <p className="text-2xl font-outfit font-black text-white">8 <span className="text-sm font-medium text-gray-400">/ 10</span></p>
            </div>
         </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto p-6 hide-scrollbar">
         <h3 className="font-outfit font-bold text-[#111] text-lg mb-4">Commandes à retirer</h3>
         <div className="space-y-4">
           {B2B_ORDERS.map(order => (
             <div key={order.id} className={`bg-white rounded-[2rem] p-5 border border-gray-100 shadow-sm ${order.status === 'completed' ? 'opacity-60' : ''}`}>
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-outfit font-bold text-sm shrink-0 ${order.status === 'completed' ? 'bg-gray-100 text-gray-400' : 'bg-[#E8F8F5] text-[#2ECC71]'}`}>
                      {order.customer.charAt(0)}
                    </div>
                    <div className="overflow-hidden">
                      <p className="font-outfit font-bold text-[#111] truncate">{order.customer}</p>
                      <p className="text-[11px] text-gray-500 font-inter font-medium">Code: <span className="font-bold text-[#111]">{order.id}</span></p>
                    </div>
                  </div>
                  <div className="text-right shrink-0 ml-2">
                    <p className="text-[11px] text-gray-400 font-inter font-bold">Heure</p>
                    <p className="font-outfit font-bold text-[#E67E22]">{order.time}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <p className="text-xs font-inter font-semibold text-[#34495E] truncate pr-2"><span className="text-[#2ECC71] font-black">{order.qty}x</span> {order.type}</p>
                  {order.status === 'completed' ? 
                    <CheckSquare size={16} color="#2ECC71" className="shrink-0" /> : 
                    <div className="text-[10px] font-bold text-white bg-[#111] px-3 py-1 rounded-full uppercase shrink-0">En attente</div>
                  }
                </div>
             </div>
           ))}
         </div>
      </div>
    </div>
  );

  const renderB2BInventory = () => (
    <div className="flex-1 min-h-0 flex flex-col bg-[#F9FAFB] overflow-hidden animate-fade-in pt-14">
       <div className="px-6 pb-4 shrink-0">
          <h2 className="text-3xl font-outfit font-bold text-[#111]">Mes Paniers</h2>
          <p className="text-sm text-gray-500 font-inter mt-1">Gérez vos invendus du jour.</p>
       </div>
       <div className="flex-1 min-h-0 overflow-y-auto p-6 hide-scrollbar">
          <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100 relative overflow-hidden mb-6">
             <div className={`absolute top-0 inset-x-0 h-2 ${isPublished ? 'bg-[#2ECC71]' : 'bg-gray-300'} transition-colors`}></div>
             
             <div className="flex gap-4 mb-6 pt-2">
               <img src="https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200&q=80" className="w-16 h-16 rounded-xl object-cover shrink-0" alt="Panier"/>
               <div className="overflow-hidden">
                 <h4 className="font-outfit font-bold text-[#111] text-lg truncate">Panier Surprise</h4>
                 <p className="text-xs text-gray-500 font-inter">Prix : <span className="font-bold text-[#2ECC71]">30 DH</span></p>
               </div>
             </div>

             <div className="bg-gray-50 rounded-2xl p-4 flex items-center justify-between mb-6 border border-gray-100">
                <p className="font-inter font-semibold text-[#34495E] text-sm">Quantité dispo.</p>
                <div className="flex items-center gap-4">
                   <button onClick={() => setBasketQty(Math.max(0, basketQty - 1))} className="w-10 h-10 bg-white shadow-sm rounded-full flex items-center justify-center text-gray-600 active:scale-95 shrink-0"><Minus size={18}/></button>
                   <span className="font-outfit font-black text-2xl w-6 text-center">{basketQty}</span>
                   <button onClick={() => setBasketQty(basketQty + 1)} className="w-10 h-10 bg-white shadow-sm rounded-full flex items-center justify-center text-gray-600 active:scale-95 shrink-0"><Plus size={18}/></button>
                </div>
             </div>

             <button 
               onClick={() => setIsPublished(!isPublished)}
               className={`w-full py-4 rounded-2xl font-inter font-bold text-lg active:scale-95 transition-all shadow-lg ${isPublished ? 'bg-[#2ECC71] text-white shadow-[#2ECC71]/30' : 'bg-gray-200 text-gray-500 shadow-none'}`}
             >
               {isPublished ? "Panier en ligne" : "Publier le panier"}
             </button>
          </div>

          {/* --- AI FEATURE : DESCRIPTION GENERATOR --- */}
          <div className="bg-gradient-to-br from-[#2ECC71]/10 to-white p-6 rounded-[2.5rem] border border-[#2ECC71]/20">
             <h3 className="font-inter font-bold text-[#34495E] mb-2 text-[12px] uppercase tracking-widest flex items-center gap-2">
                <Wand2 size={16} color="#2ECC71" /> Assistant Marketing IA
             </h3>
             <p className="text-xs font-inter text-gray-500 mb-4">Générez une description alléchante pour votre panier du jour !</p>
             
             <textarea 
                value={descItems}
                onChange={(e) => setDescItems(e.target.value)}
                placeholder="Qu'y a-t-il dans le panier aujourd'hui ? (ex: 3 croissants...)"
                className="w-full bg-white rounded-xl p-3 text-sm font-inter text-[#111] border border-gray-200 focus:border-[#2ECC71] outline-none mb-3 resize-none h-16"
             ></textarea>
             
             <button 
               onClick={handleGenerateDescription}
               disabled={descLoading || !descItems}
               className="w-full py-3 bg-[#34495E] text-white rounded-xl font-inter font-bold text-sm active:scale-95 transition-transform flex justify-center items-center gap-2 disabled:opacity-50"
             >
               {descLoading ? <Loader2 size={16} className="animate-spin-slow" /> : <Sparkles size={16} color="#2ECC71" />}
               Générer la description
             </button>

             <div className="mt-4 p-3 bg-white border border-gray-100 rounded-xl text-xs font-inter text-gray-700 italic">
                "{descResult}"
             </div>
          </div>
       </div>
    </div>
  );

  const renderB2BScanner = () => (
    <div className="flex-1 min-h-0 bg-black flex flex-col items-center justify-center relative animate-fade-in overflow-hidden">
       <div className="absolute inset-0 opacity-30 flex items-center justify-center pointer-events-none">
         <Camera size={150} color="#FFFFFF" />
       </div>
       
       <h2 className="text-2xl font-outfit font-bold text-white mb-8 relative z-10 drop-shadow-md">Scanner le ticket</h2>
       
       <div className="w-64 h-64 border-[4px] border-white/20 rounded-[2rem] relative z-10 overflow-hidden shadow-[0_0_0_9999px_rgba(0,0,0,0.7)] shrink-0">
          <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-[#2ECC71] rounded-tl-[1.5rem]"></div>
          <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-[#2ECC71] rounded-tr-[1.5rem]"></div>
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-[#2ECC71] rounded-bl-[1.5rem]"></div>
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-[#2ECC71] rounded-br-[1.5rem]"></div>
          <div className="absolute left-0 w-full h-[2px] bg-[#2ECC71] shadow-[0_0_15px_#2ECC71] animate-scanline"></div>
       </div>
       
       <p className="text-gray-400 font-inter font-medium text-sm mt-8 relative z-10 px-6 text-center">Placez le QR Code du client dans le cadre.</p>
       
       <button className="mt-10 bg-white/20 backdrop-blur-md px-6 py-3 rounded-full text-white font-inter font-bold text-sm relative z-10">
         Saisir le code (Ex: G849)
       </button>
    </div>
  );

  const renderB2BProfile = () => (
    <div className="flex-1 min-h-0 flex flex-col bg-[#F9FAFB] animate-fade-in pb-20 pt-14 overflow-hidden">
       <div className="px-6 pb-6 shadow-sm z-10 shrink-0">
          <h2 className="text-3xl font-outfit font-bold text-[#111] mb-6">Ma Boutique</h2>
          <div className="flex items-center gap-4 bg-white p-4 rounded-[2rem] border border-gray-100 shadow-sm">
            <div className="w-14 h-14 bg-[#E67E22] rounded-full flex items-center justify-center text-white shrink-0"><Store size={24} color="currentColor"/></div>
            <div className="overflow-hidden">
              <h2 className="text-xl font-outfit font-bold text-[#111] truncate">Boulangerie L'Artisan</h2>
              <p className="text-xs font-inter font-medium text-[#2ECC71] mt-0.5">Partenaire vérifié</p>
            </div>
          </div>
       </div>

       <div className="flex-1 min-h-0 overflow-y-auto px-6 pb-24 hide-scrollbar">
          <button onClick={() => switchAppMode('b2c')} className="w-full mt-8 py-4 bg-white border border-gray-200 text-[#34495E] rounded-2xl font-inter font-bold text-sm active:bg-gray-50 transition-colors flex justify-center items-center gap-2">
            Quitter le mode commerçant
          </button>
       </div>
    </div>
  );


  // ---------------------------------------------------------
  // MAIN WRAPPER (SPLIT SCREEN LAYOUT)
  // ---------------------------------------------------------
  return (
    <div className="bg-[#0A0A0A] min-h-screen lg:h-screen font-inter text-white selection:bg-[#2ECC71] selection:text-white flex justify-center lg:overflow-hidden">
      <div className="w-full max-w-[1600px] flex flex-col lg:flex-row relative lg:h-full">
        
        {/* LEFT COLUMN: SCROLLABLE PRESENTATION PITCH DECK */}
        <div className="w-full lg:w-[55%] xl:w-[60%] p-8 lg:p-16 lg:py-24 space-y-32 lg:overflow-y-auto lg:h-full hide-scrollbar">
          
          <section className="min-h-[80vh] flex flex-col justify-center relative">
            <BrandLogo size={80} color="#2ECC71" className="mb-8" />
            <h1 className="text-6xl lg:text-8xl font-outfit font-black tracking-tight leading-[1.1] mb-6">
              Construire un futur <span className="text-[#2ECC71]">sans gaspillage.</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-xl leading-relaxed mb-12">
              Plateforme digitale dédiée à la valorisation des invendus alimentaires pour reconnecter commerçants et citoyens.
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-500 font-bold tracking-widest uppercase">
              <div className="w-10 h-px bg-gray-600"></div>
              Présenté par Tibche Othman
            </div>
          </section>

          <section className="flex flex-col justify-center">
            <p className="text-[#E67E22] font-bold tracking-widest uppercase mb-4 text-sm flex items-center gap-2"><span className="w-2 h-2 bg-[#E67E22] rounded-full"></span> Le Problème</p>
            <h2 className="text-4xl lg:text-5xl font-outfit font-extrabold mb-12">Un gaspillage massif aux <br/> conséquences multiples.</h2>
            
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="bg-white/5 border border-white/10 rounded-[2rem] p-8 hover:bg-white/10 transition-colors">
                <div className="text-5xl font-outfit font-black text-white mb-2">3.3M <span className="text-2xl text-gray-400">Tonnes</span></div>
                <p className="text-gray-400">Gaspillées chaque année au Maroc, majoritairement par les professionnels.</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-[2rem] p-8 hover:bg-white/10 transition-colors">
                <div className="text-5xl font-outfit font-black text-white mb-2">73 000 <span className="text-2xl text-gray-400">Restos</span></div>
                <p className="text-gray-400">Subissent des pertes financières importantes liées aux invendus jetés.</p>
              </div>
            </div>
            
            <div className="mt-6 bg-[#2ECC71]/10 border border-[#2ECC71]/20 rounded-[2rem] p-8 flex items-center gap-6">
              <div className="w-16 h-16 bg-[#2ECC71] rounded-2xl flex items-center justify-center text-[#111] shrink-0"><Users size={32} color="currentColor"/></div>
              <div>
                <h3 className="text-xl font-outfit font-bold text-white mb-1">Impact sur le pouvoir d'achat</h3>
                <p className="text-[#2ECC71] font-medium">Les étudiants et familles cherchent activement des repas de qualité à prix abordable.</p>
              </div>
            </div>
          </section>

          <section className="flex flex-col justify-center">
            <p className="text-[#2ECC71] font-bold tracking-widest uppercase mb-4 text-sm flex items-center gap-2"><span className="w-2 h-2 bg-[#2ECC71] rounded-full"></span> La Solution</p>
            <h2 className="text-4xl lg:text-5xl font-outfit font-extrabold mb-12">Un écosystème <span className="text-[#2ECC71]">Gagnant-Gagnant</span></h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-center gap-4 border-b border-white/10 pb-4">
                  <User color="#2ECC71" size={28}/>
                  <h3 className="text-2xl font-outfit font-bold">Pour les Clients</h3>
                </div>
                <ul className="space-y-4 text-gray-300">
                  <li className="flex items-start gap-3"><CheckCircle size={20} color="#2ECC71" className="shrink-0 mt-0.5"/> Repas à prix réduit (-50% à -70%)</li>
                  <li className="flex items-start gap-3"><CheckCircle size={20} color="#2ECC71" className="shrink-0 mt-0.5"/> Action écologique concrète</li>
                  <li className="flex items-start gap-3"><CheckCircle size={20} color="#2ECC71" className="shrink-0 mt-0.5"/> Découverte de commerces locaux</li>
                </ul>
              </div>
              <div className="space-y-6">
                <div className="flex items-center gap-4 border-b border-white/10 pb-4">
                  <Store color="#E67E22" size={28}/>
                  <h3 className="text-2xl font-outfit font-bold">Pour les Restaurants</h3>
                </div>
                <ul className="space-y-4 text-gray-300">
                  <li className="flex items-start gap-3"><CheckCircle size={20} color="#E67E22" className="shrink-0 mt-0.5"/> Revenus additionnels sur les pertes</li>
                  <li className="flex items-start gap-3"><CheckCircle size={20} color="#E67E22" className="shrink-0 mt-0.5"/> Attirer une nouvelle clientèle</li>
                  <li className="flex items-start gap-3"><CheckCircle size={20} color="#E67E22" className="shrink-0 mt-0.5"/> Amélioration de l'image de marque</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="flex flex-col justify-center">
            <p className="text-gray-400 font-bold tracking-widest uppercase mb-4 text-sm flex items-center gap-2"><span className="w-2 h-2 bg-gray-400 rounded-full"></span> Business Model</p>
            <h2 className="text-4xl lg:text-5xl font-outfit font-extrabold mb-12">Comment ça marche ?</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                <div className="mb-3"><Zap color="#E67E22" size={24}/></div>
                <h4 className="font-outfit font-bold mb-2">Activités Clés</h4>
                <p className="text-sm text-gray-400 leading-relaxed">Développement App, Gestion des partenaires, Marketing.</p>
              </div>
              <div className="bg-[#2ECC71] p-6 rounded-2xl text-[#111] md:col-span-2 row-span-2 flex flex-col justify-center">
                <div className="mb-4"><Award size={32} color="currentColor"/></div>
                <h4 className="text-2xl font-outfit font-black mb-2">Proposition de Valeur</h4>
                <p className="font-medium opacity-90 text-lg">Connecter les invendus des professionnels aux consommateurs cherchant du pouvoir d'achat.</p>
              </div>
              <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                <div className="mb-3"><Target color="#E67E22" size={24}/></div>
                <h4 className="font-outfit font-bold mb-2">Cibles</h4>
                <p className="text-sm text-gray-400 leading-relaxed">Étudiants, jeunes actifs, boulangeries, hôtels.</p>
              </div>
              
              <div className="bg-white/5 p-6 rounded-2xl border border-white/10 md:col-span-3 flex items-center justify-between mt-4">
                <div>
                  <h4 className="font-outfit font-bold mb-1 text-[#2ECC71]">Sources de revenus</h4>
                  <p className="text-sm text-gray-400">Commission sur chaque vente + Abonnements B2B Premium</p>
                </div>
                <div className="text-right">
                  <h4 className="font-outfit font-bold mb-1 text-red-400">Structure de coûts</h4>
                  <p className="text-sm text-gray-400">Tech, Marketing, Serveurs</p>
                </div>
              </div>
            </div>
          </section>

          <section className="flex flex-col justify-center">
            <p className="text-[#2ECC71] font-bold tracking-widest uppercase mb-4 text-sm flex items-center gap-2"><span className="w-2 h-2 bg-[#2ECC71] rounded-full"></span> Scalabilité</p>
            <h2 className="text-4xl lg:text-5xl font-outfit font-extrabold mb-12">Prévisions Financières</h2>
            
            <div className="space-y-6">
              <div className="bg-white/5 border border-white/10 rounded-[2rem] p-8 flex flex-col sm:flex-row justify-between items-center gap-6">
                <div>
                  <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mb-2">Phase Pilote (30 Restos)</p>
                  <p className="text-xl text-white">8 Ventes/jour à 30 DH <br/><span className="text-[#2ECC71] font-bold">Commission : 20%</span></p>
                </div>
                <div className="text-right">
                  <p className="text-4xl font-outfit font-black text-white">~43 000 <span className="text-xl text-gray-400">DH/mois</span></p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-[#2ECC71]/20 to-transparent border border-[#2ECC71]/30 rounded-[2rem] p-8 flex flex-col sm:flex-row justify-between items-center gap-6">
                <div>
                  <p className="text-[#2ECC71] font-bold uppercase tracking-widest text-xs mb-2">Croissance (100 Restos)</p>
                  <p className="text-xl text-white">Le modèle ne nécessite pas de stock physique.</p>
                </div>
                <div className="text-right">
                  <p className="text-5xl font-outfit font-black text-[#2ECC71]">~144 000 <span className="text-xl text-gray-400">DH/mois</span></p>
                </div>
              </div>
            </div>
          </section>

          <section className="min-h-[60vh] flex flex-col justify-center pb-24">
            <p className="text-gray-400 font-bold tracking-widest uppercase mb-4 text-sm flex items-center gap-2"><span className="w-2 h-2 bg-gray-400 rounded-full"></span> Perspectives</p>
            <h2 className="text-4xl lg:text-5xl font-outfit font-extrabold mb-12">Vision Future</h2>
            
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
                <div className="mb-4"><Globe color="#2ECC71" size={32}/></div>
                <h4 className="text-xl font-outfit font-bold mb-2 text-white">Développement National</h4>
                <p className="text-gray-400">Expansion de Rabat vers Casablanca et Marrakech.</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
                <div className="mb-4"><BarChart3 color="#E67E22" size={32}/></div>
                <h4 className="text-xl font-outfit font-bold mb-2 text-white">Intégration IA</h4>
                <p className="text-gray-400">Prédiction des invendus pour optimiser la production des commerçants.</p>
              </div>
            </div>

            <div className="mt-24 text-center">
              <BrandLogo size={60} color="#2ECC71" className="mx-auto mb-6" />
              <h2 className="text-4xl font-outfit font-black text-white mb-4">Merci de votre attention.</h2>
              <p className="text-gray-400 font-medium flex items-center justify-center gap-2 mb-8">Testez l'application ci-contre <ArrowRight size={20} color="currentColor" className="hidden lg:block"/></p>
            </div>
          </section>

        </div>

        {/* RIGHT COLUMN: STICKY MOBILE DEVICE SHOWCASE */}
        <div className="hidden lg:flex w-[45%] xl:w-[40%] sticky top-0 h-screen flex-col items-center justify-center p-8 bg-[#111] border-l border-white/10 relative overflow-hidden">
          
          <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[800px] rounded-full blur-[150px] opacity-20 transition-colors duration-1000 ${appMode === 'b2c' ? 'bg-[#2ECC71]' : 'bg-[#E67E22]'}`}></div>

          <div className="absolute top-10 right-10 bg-white/10 backdrop-blur-md p-1.5 rounded-2xl flex border border-white/10 z-20 shadow-2xl">
             <button 
               onClick={() => switchAppMode('b2c')} 
               className={`px-5 py-2 rounded-xl font-inter font-bold text-sm transition-all ${appMode === 'b2c' ? 'bg-[#2ECC71] text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
             >
               Vue Client
             </button>
             <button 
               onClick={() => switchAppMode('b2b')} 
               className={`px-5 py-2 rounded-xl font-inter font-bold text-sm transition-all ${appMode === 'b2b' ? 'bg-[#E67E22] text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
             >
               Vue Vendeur
             </button>
          </div>

          <div className="absolute top-12 left-10 text-white/50 font-inter font-bold text-xs uppercase tracking-widest flex flex-col items-center gap-2 animate-scroll-bounce">
            <ArrowDown size={20} color="currentColor" />
            Scroll
          </div>

          {/* THE iPHONE 17 PRO MAX MOCKUP */}
          <div className="relative w-full max-w-[390px] h-[844px] max-h-[85vh] z-10 flex items-center justify-center transform scale-[0.95] xl:scale-100 transition-transform">
            
            <div className="absolute left-[-4px] top-[140px] w-[4px] h-[26px] bg-[#333] rounded-l-md border-l border-gray-600"></div>
            <div className="absolute left-[-4px] top-[190px] w-[4px] h-[55px] bg-[#333] rounded-l-md border-l border-gray-600"></div>
            <div className="absolute left-[-4px] top-[260px] w-[4px] h-[55px] bg-[#333] rounded-l-md border-l border-gray-600"></div>
            <div className="absolute right-[-4px] top-[210px] w-[4px] h-[80px] bg-[#333] rounded-r-md border-r border-gray-600"></div>

            <div className="w-full h-full bg-black rounded-[3.5rem] border-[8px] border-[#18181b] overflow-hidden relative premium-shadow flex flex-col">
              
              <div className="absolute top-0 inset-x-0 h-14 z-50 flex items-center justify-between px-7 pointer-events-none">
                <span className={`text-[14px] font-inter font-semibold tracking-tight mt-1 ${statusBarColor} transition-colors duration-300`}>9:41</span>
                <div className="absolute left-1/2 -translate-x-1/2 top-3 w-[115px] h-[33px] bg-black rounded-full flex items-center justify-end px-2.5 gap-2 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)]">
                   <div className="w-2.5 h-2.5 rounded-full bg-[#111] shadow-[inset_0_0_3px_rgba(255,255,255,0.2)]"></div>
                   <div className="w-2.5 h-2.5 rounded-full bg-[#111] shadow-[inset_0_0_3px_rgba(255,255,255,0.2)] mr-1"></div>
                </div>
                <IosIcons colorClass={`${statusBarColor} transition-colors duration-300 mt-1`} />
              </div>

              {appMode === 'b2c' ? (
                 <>
                    {currentScreen === 'splash' && renderSplashScreen()}
                    {currentScreen === 'onboarding' && renderOnboarding()}
                    {currentScreen === 'auth' && renderAuth()}
                    {currentScreen === 'home' && renderHome()}
                    {currentScreen === 'favorites' && renderFavorites()}
                    {currentScreen === 'details' && renderDetails()}
                    {currentScreen === 'checkout' && renderCheckout()}
                    {currentScreen === 'success' && renderSuccess()}
                    {currentScreen === 'orders' && renderOrders()}
                    {currentScreen === 'profile' && renderProfile()}
                 </>
              ) : (
                 <>
                    {currentScreen === 'splash' && renderSplashScreen()}
                    {currentScreen === 'b2b_home' && renderB2BHome()}
                    {currentScreen === 'b2b_inventory' && renderB2BInventory()}
                    {currentScreen === 'b2b_scanner' && renderB2BScanner()}
                    {currentScreen === 'b2b_profile' && renderB2BProfile()}
                 </>
              )}

              {['home', 'favorites', 'orders', 'profile', 'b2b_home', 'b2b_inventory', 'b2b_scanner', 'b2b_profile'].includes(currentScreen) && (
                <div className="absolute bottom-0 inset-x-0 glass-panel border-t border-gray-100/50 px-6 pt-3 pb-8 flex justify-between items-center z-50">
                  {appMode === 'b2c' ? (
                     <>
                      {[
                        { id: 'home', icon: <Search size={22} strokeWidth={2.5} />, label: 'Découvrir' },
                        { id: 'favorites', icon: <Heart size={22} strokeWidth={2.5} />, label: 'Favoris' },
                        { id: 'orders', icon: <ShoppingBag size={22} strokeWidth={2.5} />, label: 'Paniers' },
                        { id: 'profile', icon: <User size={22} strokeWidth={2.5} />, label: 'Profil' }
                      ].map(tab => (
                        <button key={tab.id} onClick={() => navigate(tab.id)} className={`flex flex-col items-center gap-1 w-16 transition-colors focus-visible:outline-none ${activeTab === tab.id ? 'text-[#111]' : 'text-gray-400 hover:text-gray-600'}`}>
                          {tab.icon}
                          <span className={`text-[10px] font-inter font-bold ${activeTab === tab.id ? 'opacity-100' : 'opacity-0'}`}>{tab.label}</span>
                        </button>
                      ))}
                     </>
                  ) : (
                     <>
                      {[
                        { id: 'b2b_home', icon: <BarChart3 size={22} strokeWidth={2.5} />, label: 'Tableau' },
                        { id: 'b2b_inventory', icon: <ShoppingBag size={22} strokeWidth={2.5} />, label: 'Paniers' },
                        { id: 'b2b_scanner', icon: <Camera size={22} strokeWidth={2.5} />, label: 'Scanner' },
                        { id: 'b2b_profile', icon: <Store size={22} strokeWidth={2.5} />, label: 'Boutique' }
                      ].map(tab => (
                        <button key={tab.id} onClick={() => navigate(tab.id)} className={`flex flex-col items-center gap-1 w-16 transition-colors focus-visible:outline-none ${activeTab === tab.id ? 'text-[#E67E22]' : 'text-gray-400 hover:text-gray-600'}`}>
                          {tab.icon}
                          <span className={`text-[10px] font-inter font-bold ${activeTab === tab.id ? 'opacity-100' : 'opacity-0'}`}>{tab.label}</span>
                        </button>
                      ))}
                     </>
                  )}
                </div>
              )}

              <div className="absolute bottom-2 inset-x-0 flex justify-center z-50 pointer-events-none">
                <div className={`w-[35%] h-[5px] rounded-full transition-colors duration-300 ${isDarkStatusBar ? 'bg-black' : 'bg-white'}`}></div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}