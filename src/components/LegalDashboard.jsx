import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, BookOpen, ScrollText, CheckCircle2, ArrowLeft, Download, AlertTriangle, Printer } from 'lucide-react';
import DocumentChat from './DocumentChat';
import RiskGauge from './RiskGauge';
import ClauseHeatMap from './ClauseHeatMap';
import PrintReport from './PrintReport';

export default function LegalDashboard({ data, cacheName, onReset }) {
  const [selectedClause, setSelectedClause] = useState(data.analyzed_clauses[0]);
  const [showPrintView, setShowPrintView] = useState(false);
  const reportRef = useRef(null);

  const getRiskColor = (level) => {
    switch (level) {
      case 'CRITICAL': return 'bg-[#4a0d0d] text-red-50 border-[#300505]';
      case 'HIGH': return 'bg-[#7a3b1a] text-orange-50 border-[#5a280f]';
      case 'MEDIUM': return 'bg-[#8a6820] text-amber-50 border-[#6a4e15]';
      case 'LOW': return 'bg-[#1b4332] text-emerald-50 border-[#0d2a1f]';
      default: return 'bg-[#2C221A] text-gray-50 border-[#1a130f]';
    }
  };

  const handleDownloadReport = async () => {
    setShowPrintView(true);
    setTimeout(() => {
      window.print();
      setShowPrintView(false);
    }, 500);
  };

  if (showPrintView) {
    return (
      <div ref={reportRef}>
        <PrintReport data={data} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-lex-parchment p-4 md:p-6 lg:p-10 flex flex-col">
      {/* Header Ledger */}
      <header className="mb-6 lg:mb-10 border-b border-lex-brass pb-4 lg:pb-6 relative">
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-lex-walnut/10 mt-[2px]"></div>
        
        {/* Top bar with actions */}
        <div className="flex items-center justify-between mb-4 no-print">
          <button
            onClick={onReset}
            className="flex items-center gap-2 text-lex-walnut/60 hover:text-lex-walnut transition-colors font-serif text-sm"
            aria-label="Analyze a new document"
          >
            <ArrowLeft size={16} />
            <span className="hidden sm:inline">New Analysis</span>
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadReport}
              className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-lex-walnut text-lex-parchment text-xs font-serif uppercase tracking-widest hover:bg-lex-walnut/90 transition-colors"
              aria-label="Download analysis report as PDF"
            >
              <Printer size={14} />
              <span className="hidden sm:inline">Print Report</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif text-lex-walnut mb-2 lg:mb-3 font-bold tracking-tight">Supreme Court Dossier</h1>
            <p className="text-lex-walnut/60 uppercase tracking-[0.15em] md:tracking-[0.2em] text-[10px] md:text-xs font-bold">
              Document Reference: <span className="text-lex-walnut">{data.document_name}</span>
            </p>
            {/* Legal Stamps - moved from clause view to header */}
            <div className="flex gap-2 flex-wrap mt-3">
              {data.legal_stamps.map((stamp, i) => (
                <span key={i} className="px-3 py-1 bg-lex-beige/20 text-lex-walnut text-[9px] md:text-[10px] font-bold uppercase tracking-widest border border-lex-beige/50">
                  {stamp}
                </span>
              ))}
            </div>
          </div>
          
          {/* Animated Risk Gauge */}
          <div className="flex-shrink-0">
            <RiskGauge score={data.overall_risk_score} size={180} />
          </div>
        </div>
      </header>

      {/* Executive Summary */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 bg-lex-ivory border border-lex-beige p-4 md:p-6 shadow-sm"
      >
        <h2 className="font-serif text-xs uppercase tracking-widest font-bold text-lex-brass mb-2 flex items-center gap-2">
          <BookOpen size={14} />
          Executive Summary
        </h2>
        <p className="text-lex-walnut font-sans text-sm md:text-[15px] leading-relaxed">
          {data.summary}
        </p>
      </motion.div>

      {/* Missing Protections Alert */}
      {data.missing_protections && data.missing_protections.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 bg-[#fcf8f8] border-l-[3px] border-[#4a0d0d] p-4 md:p-5 shadow-sm"
        >
          <h2 className="flex items-center gap-2 font-bold text-[#4a0d0d] mb-3 uppercase text-[10px] md:text-[11px] tracking-widest">
            <AlertTriangle size={14} />
            Missing Legal Protections
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {data.missing_protections.map((protection, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-lex-walnut">
                <span className="text-[#4a0d0d] mt-0.5">•</span>
                <span>{protection}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Clause Heat Map */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-6 bg-lex-ivory border border-lex-beige p-4 md:p-5 shadow-sm"
      >
        <h2 className="font-serif text-xs uppercase tracking-widest font-bold text-lex-brass mb-4 flex items-center gap-2">
          <ShieldAlert size={14} />
          Risk Heat Map
        </h2>
        <ClauseHeatMap
          clauses={data.analyzed_clauses}
          onClauseClick={setSelectedClause}
          selectedClauseId={selectedClause?.clause_id}
        />
      </motion.div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 max-w-[1500px] mx-auto w-full flex-grow lg:h-[calc(100vh-620px)] min-h-[500px]">
        
        {/* Left Column: The Archive Ledger + Chat Interrogation */}
        <div className="w-full lg:w-[30%] flex flex-col gap-4 lg:gap-6 lg:h-full">
          <div className="flex flex-col lg:h-[55%] min-h-[250px] border border-lex-beige bg-lex-ivory shadow-lg">
            <h2 className="font-serif text-sm bg-lex-beige/30 p-3 text-lex-walnut border-b border-lex-beige flex items-center gap-3 uppercase tracking-widest font-bold">
              <BookOpen size={16} className="text-lex-brass" />
              Clause Inventory
            </h2>
            <div className="flex flex-col overflow-y-auto custom-scrollbar flex-grow p-3 gap-2 bg-lex-parchment/30">
              {data.analyzed_clauses.map((clause) => (
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  key={clause.clause_id}
                  onClick={() => setSelectedClause(clause)}
                  aria-pressed={selectedClause?.clause_id === clause.clause_id}
                  className={`text-left p-3 md:p-4 transition-all duration-300 relative border-l-[3px] shadow-sm ${
                    selectedClause?.clause_id === clause.clause_id
                      ? 'bg-white border-l-lex-brass border-y border-r border-y-lex-beige border-r-lex-beige'
                      : 'bg-lex-ivory/50 border-l-transparent border border-lex-beige/50 hover:bg-white hover:border-lex-beige'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-serif text-sm md:text-[1rem] font-bold text-lex-walnut leading-snug">{clause.title}</h3>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-[8px] md:text-[9px] font-bold px-2 py-0.5 uppercase tracking-widest border ${getRiskColor(clause.risk_category)}`}>
                      {clause.risk_category}
                    </span>
                    <span className="text-[10px] md:text-[11px] font-serif text-lex-walnut/70 border-l border-lex-beige pl-3 italic">
                      Weight: {clause.risk_score}
                    </span>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Interactive Chat Panel */}
          <div className="lg:h-[45%] min-h-[300px]">
            <DocumentChat cacheName={cacheName} />
          </div>
        </div>

        {/* Right Column: The Judicial Evaluation Chambers */}
        <div className="w-full lg:w-[70%] bg-lex-ivory border border-lex-beige shadow-2xl p-6 md:p-8 lg:p-12 flex flex-col overflow-y-auto custom-scrollbar relative min-h-[400px]">
          {/* Decorative corners */}
          <div className="absolute top-2 left-2 w-4 h-4 border-t border-l border-lex-beige hidden lg:block"></div>
          <div className="absolute top-2 right-2 w-4 h-4 border-t border-r border-lex-beige hidden lg:block"></div>
          <div className="absolute bottom-2 left-2 w-4 h-4 border-b border-l border-lex-beige hidden lg:block"></div>
          <div className="absolute bottom-2 right-2 w-4 h-4 border-b border-r border-lex-beige hidden lg:block"></div>

          <AnimatePresence mode="wait">
            {selectedClause ? (
              <motion.div 
                key={selectedClause.clause_id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <div className="border-b-2 border-lex-brass pb-4 lg:pb-6 mb-6 lg:mb-8 relative">
                  <div className="absolute -bottom-[1px] left-0 w-full h-[1px] bg-lex-brass/30"></div>
                  <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl text-lex-walnut mb-3 lg:mb-4 flex items-center gap-3 lg:gap-4">
                    <ScrollText className="text-lex-brass shrink-0" size={28} />
                    {selectedClause.title}
                  </h2>
                  <div className="flex items-center gap-3">
                    <span className={`text-[9px] md:text-[10px] font-bold px-3 py-1 uppercase tracking-widest border ${getRiskColor(selectedClause.risk_category)}`}>
                      {selectedClause.risk_category} · Score: {selectedClause.risk_score}
                    </span>
                  </div>
                </div>

                {/* Plain English Assessment */}
                <div className="mb-6 lg:mb-10 bg-[#fcf8f8] border-l-[3px] border-[#4a0d0d] p-4 md:p-6 shadow-sm">
                  <h4 className="flex items-center gap-2 font-bold text-[#4a0d0d] mb-2 lg:mb-3 uppercase text-[10px] md:text-[11px] tracking-widest">
                    <ShieldAlert size={16} />
                    Plain-English Assessment
                  </h4>
                  <p className="text-lex-walnut font-sans leading-relaxed text-sm md:text-[15px]">
                    {selectedClause.plain_english_explanation}
                  </p>
                </div>

                {/* Side by Side Comparison */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10">
                  {/* Original Text */}
                  <div className="flex flex-col">
                    <h4 className="font-serif text-lex-walnut/40 uppercase tracking-widest text-[10px] md:text-[11px] mb-3 lg:mb-4 border-b border-lex-beige pb-3 font-bold">
                      Original Predatory Text
                    </h4>
                    <div className="font-serif text-sm md:text-[15px] italic text-lex-walnut/60 leading-relaxed bg-lex-parchment/60 p-5 md:p-7 border border-lex-beige/80 line-through decoration-[#4a0d0d]/30 decoration-2 flex-grow">
                      {selectedClause.original_text}
                    </div>
                  </div>

                  {/* Proposed Rewrite */}
                  <div className="flex flex-col">
                    <h4 className="font-serif text-lex-brass uppercase tracking-widest text-[10px] md:text-[11px] mb-3 lg:mb-4 border-b border-lex-brass/30 pb-3 font-bold">
                      Proposed Balanced Amendment
                    </h4>
                    <div className="font-serif text-sm md:text-[15px] text-lex-walnut leading-relaxed bg-white p-5 md:p-7 border border-lex-brass shadow-[inset_0_0_30px_rgba(197,160,89,0.08)] relative flex-grow">
                      <div className="absolute -top-3 -right-3 md:-top-4 md:-right-4 bg-white p-1 rounded-full border border-lex-brass/20">
                        <CheckCircle2 className="text-lex-brass" size={20} />
                      </div>
                      {selectedClause.suggested_rewrite}
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="h-full flex items-center justify-center text-lex-walnut/30 font-serif text-xl md:text-2xl italic tracking-wide">
                Select a clause from the ledger to begin judicial review.
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
