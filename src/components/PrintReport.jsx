import { Scale, ShieldAlert, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function PrintReport({ data }) {
  const getRiskLabel = (score) => {
    if (score >= 75) return 'CRITICAL';
    if (score >= 50) return 'HIGH';
    if (score >= 25) return 'MEDIUM';
    return 'LOW';
  };

  return (
    <div className="print-report bg-white text-[#2C221A] font-serif p-16 max-w-4xl mx-auto">
      <style>{`
        @media print {
          body { margin: 0; padding: 0; }
          .no-print { display: none !important; }
          .print-report { padding: 40px; font-size: 11pt; }
          .page-break { page-break-before: always; }
        }
      `}</style>

      {/* Letterhead */}
      <header className="border-b-2 border-[#C5A059] pb-6 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Scale className="h-8 w-8 text-[#C5A059]" />
            <div>
              <h1 className="text-2xl font-bold tracking-tight">LexGuard</h1>
              <p className="text-xs text-[#2C221A]/50 uppercase tracking-[0.3em]">AI Legal Intelligence Report</p>
            </div>
          </div>
          <div className="text-right text-xs text-[#2C221A]/60">
            <p>Generated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            <p>Classification: CONFIDENTIAL</p>
          </div>
        </div>
      </header>

      {/* Document Info */}
      <section className="mb-8">
        <h2 className="text-lg font-bold mb-2 uppercase tracking-widest text-xs text-[#C5A059]">Document Under Review</h2>
        <p className="text-xl font-bold">{data.document_name}</p>
        <div className="flex gap-4 mt-3">
          <span className="text-sm">Overall Risk Score: <strong className="text-lg">{data.overall_risk_score}/100</strong></span>
          <span className="text-sm">Classification: <strong>{getRiskLabel(data.overall_risk_score)}</strong></span>
        </div>
      </section>

      {/* Legal Stamps */}
      <section className="mb-8">
        <h2 className="text-xs font-bold uppercase tracking-widest text-[#C5A059] mb-3">Applied Legal Stamps</h2>
        <div className="flex gap-2 flex-wrap">
          {data.legal_stamps.map((stamp, i) => (
            <span key={i} className="px-3 py-1 border border-[#2C221A]/20 text-xs uppercase tracking-wider">{stamp}</span>
          ))}
        </div>
      </section>

      {/* Executive Summary */}
      <section className="mb-8">
        <h2 className="text-xs font-bold uppercase tracking-widest text-[#C5A059] mb-3">Executive Summary</h2>
        <p className="leading-relaxed text-sm">{data.summary}</p>
      </section>

      {/* Missing Protections */}
      {data.missing_protections && data.missing_protections.length > 0 && (
        <section className="mb-8 bg-[#fcf8f8] border-l-3 border-[#4a0d0d] p-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#4a0d0d] mb-3 flex items-center gap-2">
            <AlertTriangle size={14} />
            Missing Legal Protections
          </h2>
          <ul className="list-disc list-inside text-sm space-y-1">
            {data.missing_protections.map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </ul>
        </section>
      )}

      {/* Clause Analysis */}
      <section>
        <h2 className="text-xs font-bold uppercase tracking-widest text-[#C5A059] mb-6">Detailed Clause Analysis</h2>
        {data.analyzed_clauses.map((clause, index) => (
          <div key={clause.clause_id} className={`mb-6 pb-6 ${index < data.analyzed_clauses.length - 1 ? 'border-b border-[#D2C7AB]' : ''}`}>
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-base">{clause.title}</h3>
              <span className="text-xs px-2 py-0.5 border uppercase tracking-wider">
                {clause.risk_category} ({clause.risk_score})
              </span>
            </div>
            
            <div className="mb-3">
              <p className="text-xs uppercase tracking-wider text-[#2C221A]/40 mb-1">Assessment</p>
              <p className="text-sm leading-relaxed">{clause.plain_english_explanation}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs uppercase tracking-wider text-[#2C221A]/40 mb-1">Original Text</p>
                <p className="italic text-[#2C221A]/60 text-xs leading-relaxed">{clause.original_text}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-[#C5A059] mb-1">Suggested Amendment</p>
                <p className="text-xs leading-relaxed">{clause.suggested_rewrite}</p>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Footer */}
      <footer className="mt-12 pt-6 border-t border-[#D2C7AB] text-center text-xs text-[#2C221A]/40">
        <p className="italic">LexGuard is an AI assistant and does not constitute licensed legal counsel. This report is for informational purposes only.</p>
        <p className="mt-1">Powered by Google Gemini · © {new Date().getFullYear()} LexGuard AI</p>
      </footer>
    </div>
  );
}
