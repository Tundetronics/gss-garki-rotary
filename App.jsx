import React, { useState } from 'react';
import { Compass, Volume2, X, Settings, Globe, Heart, ShieldAlert } from 'lucide-react';

/**
 * Gift 4 - Rotary Impact Auditor
 * Architect: Rtn. Babatunde Adesina — The Agentic Orchestrator
 * RC Abuja HighRise Vocational Service Project 2026
 */

// The execution environment provides the key at runtime.
const apiKey = ""; 

const App = () => {
  const [val, setVal] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // --- CLEAN-STREAM PROTOCOL: AUDIO & READING OPTIMIZATION ---
  const sanitizeText = (text) => {
    return text
      .replace(/[*#_~`\[\]()<>|]/g, '') // Remove markdown special characters
      .replace(/\n\s*\n/g, '\n\n')    // Normalize spacing
      .trim();
  };

  const speak = (text) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    // Pause at line breaks for better oral delivery
    const speech = new SpeechSynthesisUtterance(text.replace(/\n/g, '. '));
    window.speechSynthesis.speak(speech);
  };

  // --- AI IMPACT AUDIT ENGINE ---
  const callAI = async (prompt) => {
    setIsProcessing(true);
    const systemPrompt = "You are the 'RC Abuja HighRise Impact Auditor'. Your mission is to analyze projects against the Rotary 4-Way Test. Provide clear, professional, conversational paragraphs. USE PLAIN TEXT ONLY. Do not use asterisks, hashes, or markdown symbols. Ensure the output is easy to read and listen to.";
    
    const delays = [1000, 2000, 4000, 8000, 16000];
    
    for (let i = 0; i <= delays.length; i++) {
      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, { 
          method: 'POST', 
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            contents: [{ parts: [{ text: prompt }] }], 
            systemInstruction: { parts: [{ text: systemPrompt }] } 
          }) 
        });

        if (!response.ok) throw new Error("Network Response Fail");

        const data = await response.json();
        const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
        return sanitizeText(rawText);
      } catch (e) {
        if (i === delays.length) {
          setIsProcessing(false);
          return "DIAGNOSTIC: Connection Interrupted. Please check your internet signal and try again.";
        }
        await new Promise(res => setTimeout(res, delays[i]));
      }
    }
    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col font-sans selection:bg-blue-600">
      {/* Premium Navbar */}
      <nav className="p-6 border-b border-white/10 bg-black/50 flex justify-between items-center backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Compass size={24} className="text-white animate-pulse" />
          </div>
          <div>
            <span className="font-black tracking-widest uppercase text-sm block">RC Abuja HighRise</span>
            <span className="text-[10px] text-blue-400 font-bold uppercase tracking-[0.3em]">Impact Auditor</span>
          </div>
        </div>
        <div className="hidden md:block">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Vocational Excellence Suite</p>
        </div>
      </nav>

      {/* Main Orchestration Interface */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 space-y-12 text-center">
        <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-1000">
          <h1 className="text-6xl font-black text-white uppercase italic tracking-tighter leading-none">
            Service <br/><span className="text-blue-500 not-italic">Audit Engine</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-xl mx-auto font-light leading-relaxed">
            Orchestrate a deep analysis of your community project using the Rotary 4-Way Test framework.
          </p>
        </div>

        <div className="w-full max-w-xl bg-white/5 p-12 rounded-[50px] border border-white/10 shadow-2xl space-y-8 backdrop-blur-xl relative overflow-hidden">
          <div className="absolute -top-10 -right-10 opacity-10">
            <Globe size={180} />
          </div>
          
          <div className="space-y-4 relative z-10">
            <label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Project Description</label>
            <input 
              value={val} 
              onChange={(e) => setVal(e.target.value)} 
              onKeyDown={(e) => e.key === 'Enter' && !isProcessing && val.trim() && callAI(`Audit Project: ${val}`).then(res => { setResult(res); setShowModal(true); })}
              className="w-full bg-black/50 p-6 rounded-2xl text-white text-center text-xl outline-none border border-white/10 focus:border-blue-500 transition-all placeholder:text-slate-700" 
              placeholder="e.g. Garki Computer Literacy Project" 
            />
          </div>

          <button 
            disabled={isProcessing || !val.trim()}
            onClick={async () => { const res = await callAI(`Audit Project: ${val}`); setResult(res); setShowModal(true); }} 
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 py-6 rounded-2xl font-black text-xl uppercase tracking-widest text-white shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3"
          >
            {isProcessing ? (
              <div className="h-6 w-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <ShieldAlert size={24} />
            )}
            {isProcessing ? "Analyzing..." : "Audit Impact"}
          </button>
        </div>

        <div className="flex gap-8 text-slate-500 font-black text-[10px] uppercase tracking-[0.3em]">
          <span>Is it the Truth?</span>
          <span>Is it Fair?</span>
          <span>Will it build Goodwill?</span>
        </div>
      </main>

      {/* Legacy Footer */}
      <footer className="bg-blue-900 h-28 border-t-8 border-yellow-500 flex items-center justify-between px-12 mt-auto">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-4">
            <Settings className="text-yellow-500 animate-spin-slow" size={24} />
            <p className="text-sm font-black text-white uppercase tracking-widest">RC Abuja HighRise</p>
          </div>
          <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] ml-10">Architect: Rtn. Babatunde Adesina — The Orchestrator</p>
        </div>
        <Heart className="text-yellow-500 fill-yellow-500 animate-pulse" size={24} />
      </footer>

      {/* Result Terminal Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/98 backdrop-blur-3xl z-[100] flex items-center justify-center p-6 animate-in zoom-in duration-300">
          <div className="bg-slate-900 border-2 border-blue-500/30 rounded-[40px] w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-8 border-b border-white/10 flex justify-between items-center bg-white/5">
              <div>
                <h2 className="text-2xl font-black text-white uppercase tracking-tighter text-blue-400">Impact Audit Results</h2>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Vocational Service Compliance Report</p>
              </div>
              <div className="flex gap-4">
                <button 
                  onClick={() => speak(result)} 
                  className="bg-blue-600 hover:bg-blue-500 px-8 py-2 rounded-xl text-white font-bold flex items-center gap-2 transition-all active:scale-95 shadow-lg"
                >
                  <Volume2 size={20}/> Listen
                </button>
                <button 
                  onClick={() => setShowModal(false)} 
                  className="bg-white/5 p-3 rounded-xl text-white hover:bg-red-500 transition-colors border border-white/10"
                >
                  <X size={24}/>
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-12 text-xl text-slate-300 leading-relaxed whitespace-pre-wrap font-light">
              {result}
            </div>
            <div className="p-6 bg-blue-600/5 border-t border-white/5 text-center">
              <p className="text-[10px] font-bold text-blue-400/50 uppercase tracking-[0.4em]">Rotary 4-Way Test Digitized Audit</p>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } } 
        .animate-spin-slow { animation: spin-slow 20s linear infinite; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default App;
