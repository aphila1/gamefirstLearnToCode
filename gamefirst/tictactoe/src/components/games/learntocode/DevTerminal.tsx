import { useState, useEffect } from 'react';
import { useStudio } from '../../../context/StudioContext';
import BlocklyFlowStudio from './BlocklyFlowStudio';

interface DevTerminalProps {
  onExit: () => void;
  onTriggerRules: () => void;
}

// 1. HARDCODED MULTI-LANGUAGE LEVEL BLUEPRINTS WITH MULTI-MODAL BLOCK SUPPORT
const MULTI_LANG_LEVELS = [
  {
    id: 1,
    title: "⚡ System Boot Sequence",
    task: "Every programmer starts here. Print the phrase 'Hello World' directly to the terminal monitor window.",
    startingCode: {
      javascript: 'console.log("Hello World");',
      java: 'System.out.println("Hello World");'
    },
    successHint: "🎉 Success! Mainframe core online. You successfully executed a basic string printing function loop."
  },
  {
    id: 2,
    title: "💾 Variable Buffer Allocation",
    task: "Declare a variable tracker with any name you like, set its internal assignment value to any number, and print it.",
    startingCode: {
      javascript: 'let score = 100;\nconsole.log(score);',
      java: 'int score = 100;\nSystem.out.println(score);'
    },
    successHint: "🎉 Success! Memory slot securely bound. Your variable assignment was read perfectly."
  },
  {
    id: 3,
    title: "🚦 drag and dropp (Control Flow)",
    task: "The text terminal input buffer is locked. Use the visual block studio playground below to assemble a secure conditional IF/ELSE user authorization routine loop.",
    startingCode: {
      javascript: '',
      java: ''
    },
    successHint: "🎉 Success! Conditional matrix gate unlocked. Your block execution order builds a clean logical path across languages."
  }
];

export default function DevTerminal({ onExit, onTriggerRules }: DevTerminalProps) {
  const { user, profile, addXp } = useStudio();
  const [currentLevelIdx, setCurrentLevelIdx] = useState<number>(0);
  const [selectedLang, setSelectedLang] = useState<'javascript' | 'java'>('javascript');
  
  const currentLevel = MULTI_LANG_LEVELS[currentLevelIdx];
  const [inputCode, setInputCode] = useState<string>('');
  const [consoleOutput, setConsoleOutput] = useState<string>('// System idle. Press compile code execution to run.');
  const [isLevelCleared, setIsLevelCleared] = useState<boolean>(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string>('');

  // Automatically switch editor code text templates when language tabs are toggled
  useEffect(() => {
    setInputCode(currentLevel.startingCode[selectedLang]);
    setConsoleOutput('// Workspace changed. Click Run Compiler to evaluate scripts.');
    setFeedbackMessage('');
    setIsLevelCleared(false);
  }, [selectedLang, currentLevelIdx]);

  // DUAL LANGUAGE SYNTAX COMPILER REGEX PARSER ENGINE FOR TEXT LEVELS
  const handleCompileCode = async () => {
    const trimmedCode = inputCode.trim();

    // =========================================================================
    // LEVEL 1: HELLO WORLD (Accepts ANY custom text message inside quotes)
    // =========================================================================
    if (currentLevel.id === 1) {
      const regex = selectedLang === 'javascript' 
        ? /console\.log\s*\(\s*["'`](.*?)["'`]\s*\)\s*;?/
        : /System\.out\.println\s*\(\s*["'`](.*?)["'`]\s*\)\s*;?/;

      const match = trimmedCode.match(regex);
      
      if (match && match[1] !== undefined) {
        setConsoleOutput(match[1]); 
        setFeedbackMessage(currentLevel.successHint);
        setIsLevelCleared(true);
        if (user && profile) await addXp(25);
      } else {
        setConsoleOutput('❌ COMPILER ERROR: Syntax verification failed.');
        setFeedbackMessage(
          selectedLang === 'javascript'
            ? 'JavaScript Hint: Ensure you use console.log("your text here");'
            : 'Java Hint: Ensure you use System.out.println("your text here");'
        );
        setIsLevelCleared(false);
      }
      return;
    }

    // =========================================================================
    // LEVEL 2: VARIABLES (Accepts ANY custom variable name and number values)
    // =========================================================================
    if (currentLevel.id === 2) {
      const varRegex = selectedLang === 'javascript'
        ? /let\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=\s*([0-9]+)\s*;?/
        : /int\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=\s*([0-9]+)\s*;?/;

      const varMatch = trimmedCode.match(varRegex);

      if (varMatch) {
        const customVarName = varMatch[1];
        const customValue = varMatch[2];
        const escapedVarName = customVarName.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        
        const logRegex = selectedLang === 'javascript'
          ? new RegExp(`console\\.log\\s*\\(\\s*${escapedVarName}\\s*\\)\\s*;?`)
          : new RegExp(`System\\.out\\.println\\s*\\(\\s*${escapedVarName}\\s*\\)\\s*;?`);

        const hasLog = logRegex.test(trimmedCode);

        if (hasLog) {
          setConsoleOutput(customValue);
          setFeedbackMessage(currentLevel.successHint);
          setIsLevelCleared(true);
          if (user && profile) await addXp(25);
        } else {
          setConsoleOutput(`❌ RUNTIME ERROR: Cannot find print stream for variable '${customVarName}'.`);
          setFeedbackMessage(`Almost there! You declared '${customVarName}' perfectly. Now log it out using ${selectedLang === 'javascript' ? 'console.log' : 'System.out.println'}(${customVarName});`);
          setIsLevelCleared(false);
        }
      } else {
        setConsoleOutput('❌ COMPILER ERROR: Invalid variable statement structure.');
        setFeedbackMessage(
          selectedLang === 'javascript'
            ? 'JavaScript Hint: Use "let name = number;" allocation.'
            : 'Java Hint: Remember your strict data type declaration: "int name = number;"'
        );
        setIsLevelCleared(false);
      }
      return;
    }
  };
  const handleNextLevel = () => {
    if (currentLevelIdx < MULTI_LANG_LEVELS.length - 1) {
      setCurrentLevelIdx(prev => prev + 1);
    } else {
      setFeedbackMessage('⚡ Master Framework Core complete! You cleared all sandbox developer mainframes.');
    }
  };

  const handleResetCode = () => {
    setInputCode(currentLevel.startingCode[selectedLang]);
    setConsoleOutput('// System re-initialized. Terminal workspace clear.');
    setFeedbackMessage('');
    setIsLevelCleared(false);
  };

  return (
    <div className="game-wrapper-frame" style={{ padding: '20px', background: '#0b0f19', minHeight: '100vh' }}>
      
      {/* MENU TOP BAR CONTROLS WITH RE-ENGINEERED MENU SELECTION */}
      <div className="frame-controls" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px', paddingBottom: '15px', borderBottom: '1px solid #1e293b' }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="back-hub-btn" onClick={onExit} style={{ background: '#1e293b', border: '1px solid #334155', color: '#fff', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' }}>← Exit Hub</button>
          <button className="back-hub-btn" onClick={onTriggerRules} style={{ background: 'transparent', border: '1px solid #10b981', color: '#10b981', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' }}>Rules ℹ️</button>
        </div>

        {/* RE-ENGINEERED LANGUAGE SELECTION TAB MENU */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#0f172a', padding: '4px', borderRadius: '10px', border: '1px solid #1e293b' }}>
          <button 
            onClick={() => setSelectedLang('javascript')} 
            style={{ background: selectedLang === 'javascript' ? '#2563eb' : 'transparent', color: '#fff', border: 'none', padding: '6px 14px', fontSize: '0.8rem', fontWeight: 'bold', borderRadius: '6px', cursor: 'pointer', transition: 'all 0.15s' }}
          >
            JavaScript ES6
          </button>
          <button 
            onClick={() => setSelectedLang('java')} 
            style={{ background: selectedLang === 'java' ? '#d97706' : 'transparent', color: '#fff', border: 'none', padding: '6px 14px', fontSize: '0.8rem', fontWeight: 'bold', borderRadius: '6px', cursor: 'pointer', transition: 'all 0.15s' }}
          >
            Java OOP
          </button>
        </div>
      </div>

      {/* CORE PIPELINE CONTAINER WORKSPACE GRID */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'row', 
        flexWrap: 'wrap', // Forces columns to stack on small screens
        gap: '20px', 
        marginTop: '20px',
        width: '100%'
      }}>
        
        {currentLevel.id === 3 ? (
        /* =========================================================================
            LEVEL 3 CONDITIONAL INJECTION: Mounts your new drag & drop block engine
            ========================================================================= */
          <div style={{ width: '100%' }}>
            <BlocklyFlowStudio
              onLevelSuccess={async () => {
                setIsLevelCleared(true);
                setFeedbackMessage(currentLevel.successHint);
                if (user && profile) await addXp(25);
              }}
            />
            
            {/* Embedded Educational Explanations card box below the layout grid */}
            <div style={{ background: '#1e293b', border: '1px solid #334155', padding: '24px', borderRadius: '12px', marginTop: '20px' }}>
              <h3 style={{ fontSize: '1.2rem', color: '#fff', margin: '0 0 8px 0', fontWeight: 'black' }}>{currentLevel.title}</h3>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.6', margin: 0 }}>{currentLevel.task}</p>
              
              {feedbackMessage && (
                <div style={{ background: '#0f172a', borderLeft: '4px solid #10b981', padding: '14px', borderRadius: '6px', marginTop: '15px', fontSize: '0.85rem', color: '#a7f3d0', lineHeight: '1.5' }}>
                  {feedbackMessage}
                </div>
              )}

              {isLevelCleared && (
                <button className="studio-primary-btn" onClick={handleNextLevel} style={{ marginTop: '20px', width: '100%', backgroundColor: '#3b82f6', color: '#fff', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                  Advance Matrix Sector →
                </button>
              )}
            </div>
          </div>
        ) : (
          /* =========================================================================
             LEVEL 1 & 2 TRADITIONAL SPLIT SCREEN TEXT EDITORS
             ========================================================================= */
          <>
            {/* LEFT SIDE PANEL: TASK READING DESCRIPTION */}
            <div style={{ background: '#1e293b', border: '1px solid #334155', padding: '24px', borderRadius: '12px', flexDirection: 'column', display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <span style={{ 
                  fontSize: '0.75rem', 
                  background: selectedLang === 'javascript' ? '#2563eb' : '#d97706', 
                  padding: '5px 10px', 
                  borderRadius: '5px', 
                  color: '#fff', 
                  fontWeight: 'bold', 
                  letterSpacing: '0.05em' }}>
                  {selectedLang.toUpperCase()} ENGINE active
                </span>
                <h2 style={{ fontSize: '1.4rem', color: '#fff', margin: '16px 0 8px 0', fontWeight: 'black' }}>{currentLevel.title}</h2>
                <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.6', minHeight: '120px' }}>{currentLevel.task}</p>
                
                {feedbackMessage && (
                  <div style={{ background: '#0f172a', borderLeft: `4px solid ${isLevelCleared ? '#10b981' : '#ef4444'}`, padding: '14px', borderRadius: '6px', marginTop: '15px', fontSize: '0.85rem', color: isLevelCleared ? '#a7f3d0' : '#fca5a5', lineHeight: '1.5' }}>
                    {feedbackMessage}
                  </div>
                )}
              </div>

              {isLevelCleared && (
                <button className="studio-primary-btn" onClick={handleNextLevel} style={{ marginTop: '20px', width: '100%', backgroundColor: '#3b82f6', color: '#fff', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                  Advance Matrix Sector →
                </button>
              )}
            </div>

            {/* RIGHT SIDE PANEL: LIVE TEXT WRITING TERMINAL IDE */}
            <div style={{ 
              flex: '1.2 1 360px', 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '15px',
              boxSizing: 'border-box'
            }}>
              <div style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '12px', padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b', fontSize: '0.8rem', paddingBottom: '8px', borderBottom: '1px solid #1e293b', marginBottom: '12px' }}>
                  <span>🖥️ main.{selectedLang === 'javascript' ? 'js' : 'java'}</span>
                  <span style={{ textTransform: 'uppercase', fontSize: '10px', fontWeight: 'bold', color: '#475569' }}>Writable Buffer</span>
                </div>
                
                <textarea
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value)}
                  style={{ width: '100%', height: '180px', background: 'transparent', border: 'none', color: '#34d399', fontFamily: 'Courier New, monospace', fontSize: '0.95rem', outline: 'none', resize: 'none', lineHeight: '1.5' }}
                />
                
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                  <button className="reset-btn" onClick={handleResetCode} style={{ padding: '8px 16px', background: '#7a1818', color: '#fff', borderRadius: '6px', border: '1px solid #475569', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold' }}>
                    Reset File 🔄
                  </button>
                  <button className="reset-btn" onClick={handleCompileCode} style={{ background: '#10b981', color: '#fff', padding: '8px 20px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold' }}>
                    Run Compiler ⚡
                  </button>
                </div>
              </div>

              {/* SIMULATED TERMINAL WINDOW MONITOR LOG */}
              <div style={{ background: '#020617', border: '1px solid #1e293b', borderRadius: '12px', padding: '16px', minHeight: '130px' }}>
                <div style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 'bold', paddingBottom: '6px', borderBottom: '1px solid #0f172a', marginBottom: '10px', textTransform: 'uppercase' }}>
                  📊 Terminal Live Output Logger
                </div>
                <pre style={{ margin: 0, fontFamily: 'Courier New, monospace', fontSize: '0.9rem', color: consoleOutput.startsWith('❌') ? '#ef4444' : '#e2e8f0', whiteSpace: 'pre-wrap' }}>
                  {consoleOutput}
                </pre>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}