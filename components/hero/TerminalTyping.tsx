'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const TYPING_LINES = [
  { prompt: '~$', command: 'echo "Welcome to RETURN 0;"', output: 'Welcome to RETURN 0;' },
  { prompt: '~$', command: 'gcc -o success competitive_programming.c', output: '' },
  { prompt: '~$', command: './success', output: 'Executing flawless code...' },
  { prompt: '~$', command: 'return 0;', output: '✓ Program executed successfully' },
];

export function TerminalTyping() {
  const [currentLine, setCurrentLine] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);
  const [showOutput, setShowOutput] = useState(false);
  const [completedLines, setCompletedLines] = useState<number[]>([]);
  const [isTyping, setIsTyping] = useState(true);

  const line = TYPING_LINES[currentLine];
  const displayedCommand = line?.command.slice(0, currentChar) || '';

  useEffect(() => {
    if (!line) return;

    if (currentChar < line.command.length) {
      // Typing the command
      const typingDelay = Math.random() * 50 + 30; // Random typing speed
      const timer = setTimeout(() => {
        setCurrentChar((prev) => prev + 1);
      }, typingDelay);
      return () => clearTimeout(timer);
    } else if (!showOutput) {
      // Show output after typing completes
      const timer = setTimeout(() => {
        setShowOutput(true);
        setIsTyping(false);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      // Move to next line
      const timer = setTimeout(() => {
        setCompletedLines((prev) => [...prev, currentLine]);
        if (currentLine < TYPING_LINES.length - 1) {
          setCurrentLine((prev) => prev + 1);
          setCurrentChar(0);
          setShowOutput(false);
          setIsTyping(true);
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [currentChar, currentLine, line, showOutput]);

  // Restart animation after completion
  useEffect(() => {
    if (currentLine === TYPING_LINES.length - 1 && showOutput) {
      const timer = setTimeout(() => {
        setCurrentLine(0);
        setCurrentChar(0);
        setShowOutput(false);
        setCompletedLines([]);
        setIsTyping(true);
      }, 5000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [currentLine, showOutput]);

  return (
    <div className="mx-auto max-w-2xl overflow-hidden rounded-lg border border-white/10 bg-background/80 font-mono text-sm backdrop-blur-sm">
      {/* Terminal header */}
      <div className="flex items-center gap-2 border-b border-white/10 bg-white/5 px-4 py-3">
        <div className="h-3 w-3 rounded-full bg-red-500" />
        <div className="h-3 w-3 rounded-full bg-yellow-500" />
        <div className="h-3 w-3 rounded-full bg-green-500" />
        <span className="ml-4 text-xs text-white/40">return0@iiitdwd ~ bash</span>
      </div>

      {/* Terminal content */}
      <div className="p-4 text-left">
        {/* Completed lines */}
        <AnimatePresence>
          {completedLines.map((lineIndex) => {
            const completedLine = TYPING_LINES[lineIndex];
            if (!completedLine) return null;
            return (
              <motion.div
                key={lineIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-2"
              >
                <div className="flex items-center gap-2">
                  <span className="text-neon-cyan">{completedLine.prompt}</span>
                  <span className="text-white">{completedLine.command}</span>
                </div>
                {completedLine.output && (
                  <div className="mt-1 text-white/60 pl-6">
                    {completedLine.output}
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Current line */}
        {line && !completedLines.includes(currentLine) && (
          <div>
            <div className="flex items-center gap-2">
              <span className="text-neon-cyan">{line.prompt}</span>
              <span className="text-white">
                {displayedCommand}
                {/* Blinking cursor */}
                {isTyping && (
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                    className="ml-0.5 inline-block h-4 w-2 bg-neon-pink"
                  />
                )}
              </span>
            </div>

            {/* Output */}
            <AnimatePresence>
              {showOutput && line.output && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={cn(
                    'mt-1 pl-6',
                    line.output.includes('✓') ? 'text-green-400' : 'text-white/60'
                  )}
                >
                  {line.output}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}