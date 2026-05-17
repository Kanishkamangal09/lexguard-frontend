import { useState } from 'react';
import UploadVault from './components/UploadVault';
import LegalDashboard from './components/LegalDashboard';
import ErrorBoundary from './components/ErrorBoundary';
import { analyzeContract, analyzeSampleContract } from './utils/api';

function App() {
  const [analysisData, setAnalysisData] = useState(null);
  const [cacheName, setCacheName] = useState(null);

  const handleUpload = async (file) => {
    try {
      const response = await analyzeContract(file);
      setAnalysisData(response.analysis);
      setCacheName(response.cache_name);
    } catch (error) {
      console.error("Analysis Failed:", error);
      throw error; 
    }
  };

  const handleSampleAnalysis = async (sampleId) => {
    try {
      const response = await analyzeSampleContract(sampleId);
      setAnalysisData(response.analysis);
      setCacheName(response.cache_name);
    } catch (error) {
      console.error("Sample Analysis Failed:", error);
      throw error;
    }
  };

  const handleReset = () => {
    setAnalysisData(null);
    setCacheName(null);
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-lex-parchment text-lex-walnut font-sans selection:bg-lex-brass/30 selection:text-lex-walnut">
        {!analysisData ? (
          <UploadVault onUpload={handleUpload} onSampleAnalysis={handleSampleAnalysis} />
        ) : (
          <LegalDashboard data={analysisData} cacheName={cacheName} onReset={handleReset} />
        )}
      </div>
    </ErrorBoundary>
  );
}

export default App;
