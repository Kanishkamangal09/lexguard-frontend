import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, Scale, FileText, Sparkles } from 'lucide-react';
import { fetchSamples } from '../utils/api';

const PROGRESS_STEPS = [
  { label: 'Uploading to Judicial Archives...', icon: UploadCloud },
  { label: 'Gemini analyzing document structure...', icon: Sparkles },
  { label: 'Extracting clauses & scoring risk...', icon: Scale },
  { label: 'Structuring judicial findings...', icon: FileText },
];

export default function UploadVault({ onUpload, onSampleAnalysis }) {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [progressStep, setProgressStep] = useState(0);
  const [samples, setSamples] = useState([]);
  const [loadingSample, setLoadingSample] = useState(null);

  useEffect(() => {
    fetchSamples()
      .then(data => setSamples(data.samples || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!isLoading) {
      setProgressStep(0);
      return;
    }
    const intervals = [800, 2500, 5000];
    const timers = intervals.map((delay, i) =>
      setTimeout(() => setProgressStep(i + 1), delay)
    );
    return () => timers.forEach(clearTimeout);
  }, [isLoading]);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = async (file) => {
    if (file.type !== 'application/pdf') {
      setError('Please upload a valid PDF document.');
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      setError('File too large. Maximum size is 20MB.');
      return;
    }
    setError('');
    setIsLoading(true);
    try {
      await onUpload(file);
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  const handleSampleClick = async (sampleId) => {
    setError('');
    setLoadingSample(sampleId);
    setIsLoading(true);
    try {
      await onSampleAnalysis(sampleId);
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
      setLoadingSample(null);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-8 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
        <div className="absolute top-10 left-10 w-96 h-96 border border-lex-walnut rounded-full"></div>
        <div className="absolute -bottom-20 -right-20 w-[500px] h-[500px] border border-lex-walnut rounded-full"></div>
      </div>

      <div className="max-w-3xl w-full z-10">
        <div className="text-center mb-8 md:mb-12">
          <Scale className="mx-auto h-16 w-16 md:h-20 md:w-20 text-lex-brass mb-4 md:mb-6 drop-shadow-sm" />
          <h1 className="text-4xl md:text-6xl font-serif text-lex-walnut mb-3 md:mb-4 tracking-tight">LexGuard Vault</h1>
          <p className="text-lex-walnut/70 text-lg md:text-xl font-serif italic">Secure Document Submission & Judicial Review</p>
        </div>

        <AnimatePresence mode="wait">
          {!isLoading ? (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Upload dropzone */}
              <div
                className={`border border-dashed transition-all duration-500 p-10 md:p-20 text-center 
                  ${isDragging ? 'border-lex-brass bg-lex-beige/30' : 'border-lex-beige bg-lex-ivory shadow-2xl'}
                  relative`}
                style={{ borderRadius: '2px', boxShadow: 'inset 0 0 40px rgba(210, 199, 171, 0.2)' }}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                role="region"
                aria-label="Document upload area. Drag and drop a PDF file or click to browse."
              >
                <input 
                  type="file" 
                  accept=".pdf" 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                  onChange={handleChange}
                  aria-label="Upload PDF document"
                  id="file-upload"
                />
                <div className="flex flex-col items-center pointer-events-none">
                  <UploadCloud className="h-12 w-12 md:h-14 md:w-14 text-lex-brass mb-4 md:mb-6" />
                  <h3 className="text-xl md:text-2xl font-serif text-lex-walnut mb-2 md:mb-3 uppercase tracking-widest">Deposit Document</h3>
                  <p className="text-lex-walnut/60 font-sans text-sm md:text-base">Drag and drop your PDF contract, or click to browse archives.</p>
                  <p className="text-lex-walnut/40 font-sans text-xs mt-2">Maximum file size: 20MB</p>
                </div>
                {error && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 md:mt-8 text-red-900 bg-red-50 border border-red-200 px-4 md:px-6 py-3 font-serif text-sm" role="alert">
                    {error}
                  </motion.div>
                )}
              </div>

              {/* Sample documents */}
              {samples.length > 0 && (
                <div className="mt-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-px flex-1 bg-lex-beige"></div>
                    <span className="text-lex-walnut/40 text-[10px] md:text-xs uppercase tracking-[0.2em] font-bold">Or Try a Sample Dossier</span>
                    <div className="h-px flex-1 bg-lex-beige"></div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {samples.map((sample) => (
                      <motion.button
                        key={sample.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleSampleClick(sample.id)}
                        disabled={isLoading}
                        className="p-4 bg-lex-ivory border border-lex-beige hover:border-lex-brass/50 text-left transition-all shadow-sm hover:shadow-md group"
                      >
                        <div className="flex items-start gap-2 mb-2">
                          <FileText size={16} className="text-lex-brass mt-0.5 shrink-0" />
                          <h4 className="font-serif text-sm font-bold text-lex-walnut group-hover:text-lex-brass transition-colors leading-tight">{sample.name}</h4>
                        </div>
                        <p className="text-[11px] text-lex-walnut/50 leading-relaxed">{sample.description}</p>
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              className="border border-lex-beige bg-lex-ivory shadow-2xl p-10 md:p-16 text-center flex flex-col items-center"
              style={{ borderRadius: '2px' }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                className="mb-6 md:mb-8"
              >
                <Scale className="h-16 w-16 md:h-20 md:w-20 text-lex-brass opacity-80" />
              </motion.div>

              {/* Progress steps */}
              <div className="w-full max-w-md mb-6 md:mb-8">
                {PROGRESS_STEPS.map((step, index) => {
                  const StepIcon = step.icon;
                  const isActive = index === progressStep;
                  const isComplete = index < progressStep;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: isActive || isComplete ? 1 : 0.3, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`flex items-center gap-3 py-2 transition-all ${isActive ? 'text-lex-walnut' : isComplete ? 'text-lex-brass' : 'text-lex-walnut/30'}`}
                    >
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all ${
                        isComplete ? 'bg-lex-brass border-lex-brass text-white' :
                        isActive ? 'border-lex-brass text-lex-brass' :
                        'border-lex-beige text-lex-beige'
                      }`}>
                        {isComplete ? (
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <StepIcon size={12} />
                        )}
                      </div>
                      <span className={`font-serif text-sm ${isActive ? 'font-bold' : ''}`}>
                        {step.label}
                      </span>
                      {isActive && (
                        <motion.div
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{ repeat: Infinity, duration: 1.5 }}
                          className="w-1.5 h-1.5 rounded-full bg-lex-brass ml-auto"
                        />
                      )}
                    </motion.div>
                  );
                })}
              </div>

              <p className="text-lex-walnut/50 italic font-serif text-sm">
                {loadingSample ? 'Analyzing pre-loaded dossier...' : 'Parsing long-context structure and applying judicial compliance auditing.'}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
