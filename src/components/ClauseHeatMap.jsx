import { motion } from 'framer-motion';

export default function ClauseHeatMap({ clauses, onClauseClick, selectedClauseId }) {

  const getRiskBg = (level) => {
    switch (level) {
      case 'CRITICAL': return 'bg-[#4a0d0d]';
      case 'HIGH': return 'bg-[#7a3b1a]';
      case 'MEDIUM': return 'bg-[#8a6820]';
      case 'LOW': return 'bg-[#1b4332]';
      default: return 'bg-[#2C221A]';
    }
  };

  const getRiskText = (level) => {
    switch (level) {
      case 'CRITICAL': return 'text-red-100';
      case 'HIGH': return 'text-orange-100';
      case 'MEDIUM': return 'text-amber-100';
      case 'LOW': return 'text-emerald-100';
      default: return 'text-gray-100';
    }
  };

  // Sort by risk score descending
  const sortedClauses = [...clauses].sort((a, b) => b.risk_score - a.risk_score);

  return (
    <div className="w-full" role="list" aria-label="Clause risk heat map">
      <div className="flex gap-1 items-end h-16">
        {sortedClauses.map((clause, index) => (
          <motion.button
            key={clause.clause_id}
            role="listitem"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ delay: index * 0.05, duration: 0.4, ease: "easeOut" }}
            style={{ originY: 1, height: `${Math.max(clause.risk_score, 12)}%` }}
            className={`flex-1 min-w-[24px] rounded-t-sm cursor-pointer transition-all duration-200 relative group
              ${getRiskBg(clause.risk_category)}
              ${selectedClauseId === clause.clause_id ? 'ring-2 ring-lex-brass ring-offset-1 ring-offset-lex-parchment' : 'hover:opacity-80'}
            `}
            onClick={() => onClauseClick(clause)}
            aria-label={`${clause.title}: ${clause.risk_category} risk, score ${clause.risk_score}`}
          >
            {/* Tooltip */}
            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
              <div className={`px-3 py-2 rounded shadow-lg text-[10px] whitespace-nowrap ${getRiskBg(clause.risk_category)} ${getRiskText(clause.risk_category)}`}>
                <div className="font-bold mb-0.5">{clause.title}</div>
                <div className="opacity-80">{clause.risk_category} · Score: {clause.risk_score}</div>
              </div>
              <div className={`w-2 h-2 rotate-45 mx-auto -mt-1 ${getRiskBg(clause.risk_category)}`}></div>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between mt-3 px-1">
        <div className="flex items-center gap-4">
          {['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].map(level => (
            <div key={level} className="flex items-center gap-1.5">
              <div className={`w-2.5 h-2.5 rounded-sm ${getRiskBg(level)}`}></div>
              <span className="text-[9px] font-bold text-lex-walnut/50 uppercase tracking-widest">{level}</span>
            </div>
          ))}
        </div>
        <span className="text-[9px] text-lex-walnut/40 italic font-serif">
          {clauses.length} clauses analyzed
        </span>
      </div>
    </div>
  );
}
