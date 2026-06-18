import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Bot } from 'lucide-react';

const parseMarkdown = (text) => {
    if (!text) return null;
    const lines = text.split('\n');
    return lines.map((line, lineIdx) => {
        const parts = line.split(/(\*\*.*?\*\*|\*.*?\*)/g);
        const parsedLine = parts.map((part, partIdx) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={partIdx} className="font-bold">{part.slice(2, -2)}</strong>;
            } else if (part.startsWith('*') && part.endsWith('*')) {
                return <em key={partIdx} className="italic">{part.slice(1, -1)}</em>;
            }
            return part;
        });
        return (
            <React.Fragment key={lineIdx}>
                {parsedLine}
                {lineIdx < lines.length - 1 && <br />}
            </React.Fragment>
        );
    });
};

export default function AITerminal() {
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'ai', content: "Hi, I'm Asmita's personalized agent. Ask me about her??" }
    ]);
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        // Add user message
        const currentInput = inputValue;
        const newMsg = { role: 'user', content: currentInput };
        setMessages(prev => [...prev, newMsg]);
        setInputValue('');
        setIsTyping(true);

        // Fetch real AI response
        try {
            const res = await fetch('http://localhost:8000/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: currentInput })
            });
            const data = await res.json();
            
            setIsTyping(false);
            setMessages(prev => [...prev, { role: 'ai', content: data.response }]);
        } catch (error) {
            setIsTyping(false);
            setMessages(prev => [...prev, { role: 'ai', content: "Network error: Unable to reach the AI backend." }]);
        }
    };

    return (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[100] flex flex-col items-end pointer-events-none w-[calc(100vw-2rem)] sm:w-auto">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20, transition: { duration: 0.2 } }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="mb-4 w-full sm:w-96 h-[30rem] bg-pink-50 border-[3px] border-pink-300 rounded-2xl shadow-[0_20px_60px_-10px_rgba(255,71,133,0.4)] flex flex-col overflow-hidden origin-bottom-right pointer-events-auto"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-5 py-4 border-b-[3px] border-pink-300 bg-pink-100 shadow-sm z-10">
                           <div className="flex items-center gap-3">
                                <span className="relative flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-pink-500 shadow-[0_0_8px_rgba(236,72,153,0.5)]"></span>
                                </span>
                                <span className="font-bold text-pink-900 text-sm tracking-wide">Asmita's Agent</span>
                            </div>
                            <button 
                                onClick={() => setIsOpen(false)} 
                                className="text-pink-500 hover:text-sakura-pink hover:bg-pink-200/50 p-1.5 rounded-full transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Chat Area */}
                        <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-4 flex flex-col relative z-0 bg-pink-50">
                            {messages.map((msg, idx) => (
                                <div key={idx} className={`max-w-[85%] ${msg.role === 'user' ? 'self-end' : 'self-start'}`}>
                                    <div className={`px-4 py-3 text-sm leading-relaxed shadow-sm bg-pink-100 border-[3px] border-pink-300 text-pink-900 font-medium ${msg.role === 'user' ? 'rounded-bl-2xl rounded-t-2xl rounded-br-sm' : 'rounded-br-2xl rounded-t-2xl rounded-bl-sm'}`}>
                                        {parseMarkdown(msg.content)}
                                    </div>
                                </div>
                            ))}
                            {isTyping && (
                                <div className="self-start max-w-[85%]">
                                    <div className="px-4 py-3 bg-pink-100 border-[3px] border-pink-300 rounded-br-2xl rounded-t-2xl rounded-bl-sm shadow-sm flex gap-1.5 items-center h-10">
                                        <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-1.5 h-1.5 bg-sakura-pink rounded-full" />
                                        <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.15 }} className="w-1.5 h-1.5 bg-sakura-pink rounded-full" />
                                        <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.3 }} className="w-1.5 h-1.5 bg-sakura-pink rounded-full" />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-pink-100 border-t-[3px] border-pink-300 shadow-[0_-4px_15px_-10px_rgba(255,71,133,0.05)] z-10 relative">
                            <form onSubmit={handleSend} className="relative flex items-center">
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder="Ask about her resume..."
                                    className="w-full bg-white placeholder-pink-300 text-sm text-pink-900 rounded-full px-5 py-3 pr-12 focus:outline-none transition-all border-[3px] border-pink-300 shadow-sm"
                                />
                                <button 
                                    type="submit" 
                                    disabled={!inputValue.trim() || isTyping} 
                                    className="absolute right-2 p-1.5 rounded-full bg-pink-100 text-pink-500 hover:bg-pink-200 border-[3px] border-pink-300 disabled:opacity-50 disabled:bg-pink-50 transition-all shadow-sm"
                                >
                                    <Send size={15} />
                                </button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toggle Orb */}
            <AnimatePresence>
                {!isOpen && (
                    <motion.button
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1, y: [0, -8, 0] }}
                        exit={{ opacity: 0, scale: 0, transition: { duration: 0.2 } }}
                        transition={{
                            y: { repeat: Infinity, duration: 3, ease: "easeInOut" },
                            opacity: { duration: 0.3 },
                            scale: { type: "spring", stiffness: 200, damping: 15 }
                        }}
                        onClick={() => setIsOpen(true)}
                        className="w-14 h-14 rounded-full bg-white/30 backdrop-blur-md border border-pink-200/50 flex items-center justify-center cursor-pointer shadow-[0_8px_32px_rgba(255,71,133,0.3)] hover:bg-white/50 transition-colors pointer-events-auto"
                    >
                        <Bot className="text-sakura-pink w-6 h-6 drop-shadow-md" />
                    </motion.button>
                )}
            </AnimatePresence>
        </div>
    );
}
