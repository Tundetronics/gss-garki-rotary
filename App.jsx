import React, { useState } from 'react';
import { ShieldAlert, Volume2, X, Compass, Heart, ShieldCheck } from 'lucide-react';

/**
 * Gift 5 - Rotary Impact Auditor
 * RC Abuja HighRise Vocational Project 2026
 * Architect: Rtn. Babatunde Adesina — The Agentic Orchestrator
 */

const apiKey = ""; 

const App = () => {
  const [val, setVal] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const sanitize = (text) => text.replace(/[*#_~`\[\]()<>|]/g, '').trim();

  const speak = (text) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(new SpeechSynthesisUtterance(text.replace(/\n/g, '. ')));
  };

  const callAI = async (prompt) => {
    setIsProcessing(true);
    const sys = "Impact Auditor for RC Abuja HighRise. Analyze projects against the Rotary 4-Way Test. Use PLAIN CONVERSATIONAL TEXT ONLY. No markdown symbols.";
    const delays = [1000, 2000, 4000, 8000];
    
    for (let i = 0; i <= delays.length; i++) {
      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, { 
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], systemInstruction: { parts: [{ text: sys }] } }) 
        });
        if (!response.ok) throw new Error();
        const data = await response.json();
        setResult(sanitize(data.candidates?.[0]?.content?.parts?.[0]?.text || ""));
        setShowModal(true);
        setIsProcessing(false);
        return;
      } catch (e) {
        if (i === delays.length) {
          setResult("Analysis Interrupted. Please check signal.");
          setShowModal(true);
          setIsProcessing(false);
        } else {
          await new Promise(res => setTimeout(res, delays[i]));
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col font-sans selection:bg-blue-600">
      <nav className="p-6 border-b border-white/10 bg-black/50 flex justify-between items-center backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg"><Compass size={24} className="text-white" /></div>
          <div><span className="font-black tracking-widest uppercase text-sm block leading-none">RC Abuja HighRise</span><span className="text-[10px] text-blue-400 font-bold uppercase tracking-[0.3em]">Impact Auditor</span></div>
        </div>
        <Heart className="text-white/20" />
      </nav>
      <main className="flex-1 flex flex-col items-center justify-center p-6 space-y-12 text-center">
        <h1 className="text-6xl lg:text-8xl font-black uppercase italic tracking-tighter leading-none italic animate-in fade-in duration-1000">Impact <br/><span className="text-blue-500 not-italic">Auditor</span></h1>
        <div className="w-full max-w-xl bg-white/5 p-12 rounded-[50px] border border-white/10 shadow-2xl space-y-8 backdrop-blur-xl relative">
          <input value={val} onChange={(e) => setVal(e.target.value)} className="w-full bg-black/50 p-6 rounded-2xl text-center text-xl outline-none border border-white/10 focus:border-blue-500 transition-all font-bold" placeholder="Describe Project to Audit" />
          <button disabled={isProcessing || !val.trim()} onClick={() => callAI(`Audit Project: ${val}`)} className="w-full bg-blue-600 hover:bg-blue-500 py-6 rounded-2xl font-black text-xl uppercase tracking-widest text-white shadow-xl flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-50">
            {isProcessing ? <div className="h-6 w-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div> : <ShieldAlert size={24} />}
            {isProcessing ? "Analyzing..." : "Audit Project"}
          </button>
        </div>
      </main>
      <footer className="bg-blue-900 h-28 border-t-8 border-yellow-500 flex items-center justify-between px-12 mt-auto">
        <div className="text-left font-black uppercase tracking-widest"><p className="text-sm text-white leading-none mb-1">RC Abuja HighRise</p><p className="text-[10px] text-white/40 uppercase tracking-[0.2em]">Architect: Rtn. Babatunde Adesina</p></div>
        <Heart className="text-yellow-500 fill-yellow-500 animate-pulse" size={24} />
      </footer>
      {showModal && (
        <div className="fixed inset-0 bg-black/98 backdrop-blur-3xl z-[100] flex items-center justify-center p-6 animate-in zoom-in duration-300">
          <div className="bg-slate-900 border-2 border-blue-500/30 rounded-[40px] w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-8 border-b border-white/10 flex justify-between items-center bg-white/5">
              <div><h2 className="text-2xl font-black uppercase tracking-tighter text-blue-400">Analysis Result</h2><p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2">4-Way Test Report</p></div>
              <div className="flex gap-4">
                <button onClick={() => speak(result)} className="bg-blue-600 hover:bg-blue-500 px-8 py-2 rounded-xl text-white font-bold flex items-center gap-2 active:scale-95 transition-all shadow-lg"><Volume2 size={20}/> Listen</button>
                <button onClick={() => setShowModal(false)} className="bg-white/5 p-3 rounded-xl hover:bg-red-500 border border-white/10 transition-colors shadow-lg"><X/></button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-12 text-xl text-slate-300 leading-relaxed whitespace-pre-wrap font-light italic">{result}</div>
          </div>
        </div>
      )}
    </div>
  );
};
export default App;
