import React, { useState } from 'react';
import { 
  Compass, Settings, ShieldCheck, Heart, X, Volume2, Sparkles, Globe
} from 'lucide-react';

const apiKey = ""; 

const App = () => {
  const [val, setVal] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const sanitizeForVoice = (text) => {
    if (!text) return "";
    return text.replace(/[*#_~`\[\]()<>]/g, '').replace(/\n\n/g, '. ').replace(/\n/g, '. '); 
  };

  const speak = (text) => {
    const speech = new SpeechSynthesisUtterance(sanitizeForVoice(text));
    window.speechSynthesis.speak(speech);
  };

  const callAI = async (prompt) => {
    setIsProcessing(true);
    const sys = "Impact auditor for Rotary Abuja HighRise. Apply the 4-way test. Plain text only. No markdown.";
    const delays = [1000, 2000, 4000, 8000, 16000];
    
    for (let i = 0; i <= delays.length; i++) {
      try {
        const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, { 
          method: 'POST', 
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            systemInstruction: { parts: [{ text: sys }] }
          }) 
        });
        if (!r.ok) throw new Error();
        const d = await r.json();
        return d.candidates[0].content.parts[0].text;
      } catch (e) {
        if (i === delays.length) return "Audit interrupted.";
        await new Promise(res => setTimeout(res, delays[i]));
      }
    }
    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col font-sans">
      <nav className="p-6 border-b border-white/10 bg-black/50 flex justify-between items-center backdrop-blur-md">
        <div className="flex items-center gap-3 uppercase font-black tracking-widest text-sm text-blue-400">
          <Compass size={20}/> Impact Auditor
        </div>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center p-6 space-y-12">
        <div className="text-center space-y-4 max-w-3xl">
            <h1 className="text-5xl lg:text-7xl font-black text-white uppercase tracking-tighter leading-none">
                Service <br/><span className="text-blue-500 italic">Audit</span>
            </h1>
            <p className="text-xl text-slate-400 font-light">Measuring goodwill using the Rotary 4-Way Test.</p>
        </div>

        <div className="w-full max-w-xl bg-white/5 p-12 rounded-[50px] border border-white/10 shadow-2xl text-center space-y-8 backdrop-blur-sm">
            <div className="flex justify-center"><Globe className="text-blue-500" size={60} /></div>
            <input 
              value={val}
              onChange={(e) => setVal(e.target.value)}
              className="w-full bg-black/50 p-6 rounded-2xl text-white text-center text-xl outline-none border border-white/10 focus:border-blue-500 transition-all"
              placeholder="e.g. Garki Water Project"
            />
            <button 
                onClick={async () => { const res = await callAI(`Audit Project: ${val}`); setResult(res); setShowModal(true); }}
                className="w-full py-6 rounded-2xl font-black text-xl uppercase shadow-xl transition-all bg-blue-600 text-white hover:bg-blue-500"
            >
                Audit Impact
            </button>
        </div>
      </main>

      <footer className="bg-blue-900 h-20 border-t-8 border-yellow-500 flex items-center justify-between px-10">
        <div className="flex items-center gap-4">
          <Settings className="text-yellow-500 animate-spin-slow" size={24} />
          <p className="text-sm font-black text-white uppercase tracking-tight">The Rotary Club of Abuja HighRise</p>
        </div>
      </footer>

      {showModal && (
        <div className="fixed inset-0 bg-black/98 backdrop-blur-3xl z-[100] flex items-center justify-center p-6">
          <div className="bg-slate-900 border-2 border-blue-500/50 rounded-[40px] w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-8 border-b border-white/10 flex justify-between items-center bg-white/5">
              <h2 className="text-2xl font-black text-white uppercase tracking-tighter text-blue-400">Audit Results</h2>
              <div className="flex gap-4">
                <button onClick={() => speak(result)} className="bg-blue-600 hover:bg-blue-500 p-3 rounded-xl text-white flex items-center gap-2 font-bold px-6">
                  <Volume2 size={20}/> Listen
                </button>
                <button onClick={() => setShowModal(false)} className="bg-white/10 p-3 rounded-xl text-white"><X/></button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-12 text-xl text-slate-300 leading-relaxed whitespace-pre-wrap">
              {result}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App; 
