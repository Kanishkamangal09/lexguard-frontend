import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Scale, Send, History } from 'lucide-react';
import { chatWithContract, streamChatWithContract } from '../utils/api';

export default function DocumentChat({ cacheName }) {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'The judicial ledger is open. You may interrogate the document context directly.' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setInput('');
    setIsTyping(true);

    // Try streaming first, fall back to regular
    try {
      let streamedContent = '';
      const streamMsgIndex = messages.length + 1; // +1 for user message

      // Add placeholder for streaming message
      setMessages(prev => [...prev, { role: 'assistant', content: '', streaming: true }]);

      await streamChatWithContract(cacheName, userMessage, (chunk) => {
        streamedContent += chunk;
        setMessages(prev => {
          const updated = [...prev];
          const lastAssistant = updated.findLast(m => m.streaming);
          if (lastAssistant) {
            lastAssistant.content = streamedContent;
          }
          return [...updated];
        });
      });

      // Finalize streaming message
      setMessages(prev => prev.map(m => m.streaming ? { ...m, streaming: false } : m));

    } catch (streamError) {
      // Fallback to non-streaming
      try {
        // Remove the streaming placeholder if it was added
        setMessages(prev => prev.filter(m => !m.streaming));
        
        const response = await chatWithContract(cacheName, userMessage);
        setMessages(prev => [...prev, { role: 'assistant', content: response.reply }]);
      } catch (error) {
        setMessages(prev => {
          const filtered = prev.filter(m => !m.streaming);
          return [...filtered, { role: 'assistant', content: 'Error: Connection to judicial archives lost. The session cache may have expired.' }];
        });
      }
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-full border border-lex-beige bg-lex-ivory shadow-lg relative">
      <div className="flex items-center gap-2 bg-lex-beige/30 p-3 border-b border-lex-beige flex-shrink-0">
        <History size={16} className="text-lex-brass" />
        <h3 className="font-serif text-xs uppercase tracking-widest font-bold text-lex-walnut">Interrogation Ledger</h3>
      </div>
      
      <div 
        className="flex-grow overflow-y-auto p-4 flex flex-col gap-4 custom-scrollbar"
        style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 27px,
            rgba(210, 199, 171, 0.15) 27px,
            rgba(210, 199, 171, 0.15) 28px
          )`,
          backgroundSize: '100% 28px'
        }}
      >
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[90%] p-3 border font-serif text-[14px] leading-relaxed shadow-sm ${
              msg.role === 'user' 
                ? 'bg-[#2C221A] text-lex-parchment border-[#1a130f] rounded-tl-md rounded-tr-md rounded-bl-md' 
                : 'bg-white border-lex-beige text-lex-walnut rounded-tl-md rounded-tr-md rounded-br-md relative ml-2'
            }`}>
              {msg.role === 'assistant' && (
                <Scale className="absolute -top-2 -left-3 text-lex-brass bg-white rounded-full p-0.5 border border-lex-beige/50" size={18} />
              )}
              {msg.content}
              {msg.streaming && (
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ repeat: Infinity, duration: 0.7 }}
                  className="inline-block w-1.5 h-4 bg-lex-brass ml-0.5 align-middle"
                />
              )}
            </div>
          </div>
        ))}
        {isTyping && !messages.some(m => m.streaming) && (
          <div className="flex justify-start ml-2">
            <div className="bg-white border border-lex-beige p-3 text-lex-walnut/60 font-serif italic text-sm rounded-tl-md rounded-tr-md rounded-br-md flex items-center gap-2 shadow-sm">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              >
                <Scale size={14} className="text-lex-brass" />
              </motion.div>
              Consulting Legal Records...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="border-t border-lex-beige p-2 bg-white flex gap-2 flex-shrink-0">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question..."
          aria-label="Ask a question about the contract"
          className="flex-grow bg-transparent border-none outline-none font-serif text-sm text-lex-walnut placeholder:text-lex-walnut/40 px-2"
        />
        <button 
          type="submit" 
          disabled={!input.trim() || isTyping}
          aria-label="Send message"
          className="p-1.5 bg-lex-beige/20 hover:bg-lex-beige/40 text-lex-brass rounded transition-colors disabled:opacity-50"
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}
