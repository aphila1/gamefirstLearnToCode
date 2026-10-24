import React, { useState, useEffect, useRef } from 'react';

interface BlockNode {
  id: string;
  label: string;
  syntax: { javascript: string; java: string };
  expectedOrder: number;
  color: string;
}

interface BlocklyFlowStudioProps {
  onLevelSuccess: () => void;
}

export default function BlocklyFlowStudio({ onLevelSuccess }: BlocklyFlowStudioProps) {
  const [selectedLang, setSelectedLang] = useState<'javascript' | 'java'>('javascript');
  const [workspace, setWorkspace] = useState<BlockNode[]>([]);
  const [liveCodePreview, setLiveCodePreview] = useState<string>('');
  const [validationResult, setValidationResult] = useState<{ status: 'idle' | 'pass' | 'fail'; msg: string }>({ status: 'idle', msg: '' });

  // LEVEL SETUP BLUEPRINTS
  const initialToolbox: BlockNode[] = [
    { id: 'b_close', label: '} // Close Logic Bracket', syntax: { javascript: '}', java: '}' }, expectedOrder: 3, color: '#475569' },
    { id: 'b_if', label: '🚦 IF ( userRole == "admin" )', syntax: { javascript: 'if (userRole === "admin") {', java: 'if (userRole.equals("admin")) {' }, expectedOrder: 0, color: '#d97706' },
    { id: 'b_action', label: '🔓 grantAccess() / System Boot', syntax: { javascript: '  grantAccess();', java: '  System.out.println("Access Granted");' }, expectedOrder: 1, color: '#2563eb' },
    { id: 'b_else', label: '🛑 ELSE { alert("Denied"); }', syntax: { javascript: '} else {\n  alert("Access Denied");\n}', java: '} else {\n  System.out.println("Access Denied");\n}' }, expectedOrder: 2, color: '#9333ea' }
  ];

  const [toolbox, setToolbox] = useState<BlockNode[]>(initialToolbox);
  
  // UNIFIED TOUCH POINTER MECHANIC TRACKERS
  const [activeActiveBlockId, setActiveBlockId] = useState<string | null>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  // Synchronize Live Code Generator Stream
  useEffect(() => {
    if (workspace.length === 0) {
      setLiveCodePreview(`// Drag logic blocks here...\n// To see live ${selectedLang === 'javascript' ? 'JavaScript' : 'Java'} compilation.`);
      return;
    }
    const compiledText = workspace.map(node => node.syntax[selectedLang]).join('\n');
    setLiveCodePreview(compiledText);
  }, [workspace, selectedLang]);

  // A. STANDARD COMPUTER DESKTOP DRAG EVENTS
  const handleDesktopDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('text/plain', id);
  };

  const handleDesktopDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const draggedId = e.dataTransfer.getData('text/plain');
    executeMoveAction(draggedId);
  };

  // B. UNIFIED MOBILE TOUCH/POINTER EVENTS LOOP
  const handlePointerDown = (blockId: string) => {
    setActiveBlockId(blockId); // Lock block node selection on finger press
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!activeActiveBlockId) return;

    // Check if the coordinates where the user lifted their finger sit inside our target assembly Drop Zone box bounds
    if (dropZoneRef.current) {
      const rect = dropZoneRef.current.getBoundingClientRect();
      const fingerX = e.clientX;
      const fingerY = e.clientY;

      const landedInsideZone = 
        fingerX >= rect.left && 
        fingerX <= rect.right && 
        fingerY >= rect.top && 
        fingerY <= rect.bottom;

      if (landedInsideZone) {
        executeMoveAction(activeActiveBlockId);
      }
    }
    setActiveBlockId(null); // Clear active item tracker
  };

  // C. CENTRALIZED ELEMENT RELOCATION STATE HANDLER
  const executeMoveAction = (targetId: string) => {
    const targetBlock = toolbox.find(b => b.id === targetId);
    if (targetBlock) {
      setWorkspace([...workspace, targetBlock]);
      setToolbox(toolbox.filter(b => b.id !== targetId));
      setValidationResult({ status: 'idle', msg: '' });
    }
  };
   const verifyBlocklySequence = () => {
    if (workspace.length !== initialToolbox.length) {
      setValidationResult({ status: 'fail', msg: '⚠️ Structural Error: Please drop all blocks into the timeline.' });
      return;
    }
    const sequenceIsValid = workspace.every((node, idx) => node.expectedOrder === idx);
    if (sequenceIsValid) {
      setValidationResult({ status: 'pass', msg: `🎉 LOGIC VALIDATED! Secure conditional flow loop unlocked.` });
      onLevelSuccess(); 
    } else {
      setValidationResult({ status: 'fail', msg: '❌ SYNTAX FAULT: Out of order execution block structure.' });
    }
  };

  const reinitializeWorkspaceLevel = () => {
    setToolbox(initialToolbox);
    setWorkspace([]);
    setValidationResult({ status: 'idle', msg: '' });
  };

  return (
    <div style={{ padding: '16px', background: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', fontFamily: 'sans-serif', color: '#f8fafc', boxSizing: 'border-box', width: '100%' }}>
      
      {/* HEADER CONTROLS UTILITY PANEL */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', paddingBottom: '16px', borderBottom: '1px solid #1e293b', marginBottom: '20px' }}>
        <div>
          <h3 style={{ fontSize: '1.1rem', color: '#fff', margin: 0, fontWeight: 'bold' }}>🧩 Control Flow Sandbox Studio</h3>
          <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '4px 0 0 0' }}>Drag blocks or tap-to-route them on mobile devices screen surfaces.</p>
        </div>
        
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', background: '#020617', padding: '3px', borderRadius: '8px', border: '1px solid #1e293b' }}>
            <button onClick={() => setSelectedLang('javascript')} style={{ background: selectedLang === 'javascript' ? '#2563eb' : 'transparent', color: '#fff', border: 'none', padding: '5px 10px', fontSize: '0.7rem', fontWeight: 'bold', borderRadius: '5px', cursor: 'pointer' }}>JavaScript</button>
            <button onClick={() => setSelectedLang('java')} style={{ background: selectedLang === 'java' ? '#d97706' : 'transparent', color: '#fff', border: 'none', padding: '5px 10px', fontSize: '0.7rem', fontWeight: 'bold', borderRadius: '5px', cursor: 'pointer' }}>Java OOP</button>
          </div>
          <button onClick={reinitializeWorkspaceLevel} style={{ padding: '6px 12px', background: '#334155', border: 'none', color: '#fff', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 'bold', cursor: 'pointer' }}>Reset Grid</button>
        </div>
      </div>

      {/* DYNAMIC FLEXBOX WRAPPER: Responsive side-by-side or stacked grid layout tracks */}
      <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '16px', width: '100%', boxSizing: 'border-box' }}>
        
        {/* PANEL A: THE CONTROL BLOCK TOOLBOX */}
        <div style={{ flex: '1 1 260px', background: '#020617', border: '1px solid #1e293b', borderRadius: '12px', padding: '14px', boxSizing: 'border-box' }}>
          <h4 style={{ fontSize: '0.75rem', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 12px 0', fontWeight: 'bold' }}>Blocks Menu</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {toolbox.map(block => (
              <div
                key={block.id}
                draggable
                onDragStart={(e) => handleDesktopDragStart(e, block.id)}
                // Unified pointer event triggers handle clean touch tap mappings on modern mobile screens
                onPointerDown={() => handlePointerDown(block.id)}
                onPointerUp={handlePointerUp}
                style={{ 
                  backgroundColor: block.color, 
                  color: '#fff', 
                  padding: '12px 14px', 
                  borderRadius: '10px', 
                  cursor: 'grab', 
                  fontSize: '0.75rem', 
                  fontWeight: 'bold', 
                  userSelect: 'none', // Prevents selection highlighting crashes on mobile touch drags
                  touchAction: 'none', // Prevents browser window scrolling when moving elements
                  border: '1px solid rgba(0,0,0,0.1)', 
                  boxShadow: '0 2px 4px rgba(0,0,0,0.15)' 
                }}
              >
                {block.label}
              </div>
            ))}
            {toolbox.length === 0 && <p style={{ fontSize: '0.7rem', color: '#334155', textAlign: 'center', fontStyle: 'italic', margin: '10px 0' }}>All block lines routed successfully!</p>}
          </div>
        </div>

        {/* PANEL B: WORKSPACE TARGET DROP INTERFACE */}
        <div 
          ref={dropZoneRef}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDesktopDrop}
          style={{ flex: '1 1 260px', background: '#020617', border: '2px dashed #1e293b', borderRadius: '12px', padding: '14px', minHeight: '220px', display: 'flex', flexDirection: 'column', gap: '8px', boxSizing: 'border-box' }}
        >
          <h4 style={{ fontSize: '0.75rem', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 12px 0', fontWeight: 'bold' }}>Execution Pipeline</h4>
          {workspace.map((block, index) => (
            <div 
              key={index} 
              style={{ 
                backgroundColor: block.color, 
                color: '#fff', 
                padding: '12px 14px', 
                borderRadius: '10px', 
                fontSize: '0.75rem', 
                fontWeight: 'bold', 
                display: 'flex', 
                justifyContent: 'space-between', // Fixed: removed the duplicate 'justifyBetween' typo property string
                alignItems: 'center', 
                border: '1px solid rgba(0,0,0,0.1)' 
              }}
            >
              <span>{block.label}</span>
              <span style={{ fontSize: '9px', background: 'rgba(0,0,0,0.2)', padding: '2px 5px', borderRadius: '4px', fontFamily: 'monospace' }}>#{index + 1}</span>
            </div>
          ))}
          {workspace.length === 0 && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#1e293b', textAlign: 'center', padding: '20px' }}>
              <span style={{ fontSize: '1.25rem', marginBottom: '2px' }}>👇</span>
              <p 
                style={{ 
                  fontSize: '0.7rem', 
                  margin: 0, 
                  fontWeight: 'bold', 
                  lineHeight: '1.4' // 👈 FIXED: Changed 'leading' to 'lineHeight'
                }}
              >
                Drag or click blocks into this container to structure the sequence path.
              </p>
            </div>
          )}
        </div>

        {/* PANEL C: REAL WORLD CODE SYNTAX CONSOLE MIRROR */}
        <div style={{ flex: '1 1 280px', display: 'flex', flexDirection: 'column', gap: '12px', boxSizing: 'border-box' }}>
          <div style={{ background: '#020617', border: '1px solid #1e293b', borderRadius: '12px', padding: '14px', flex: 1, display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '9px', color: '#334155', textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: '0.05em', borderBottom: '1px solid #0f172a', paddingBottom: '6px', marginBottom: '10px' }}>🖥️ Compiled Code Stream</span>
            <pre style={{ margin: 0, fontFamily: 'monospace', fontSize: '0.75rem', color: '#34d399', lineHeight: '1.5', whiteSpace: 'pre-wrap' }}>{liveCodePreview}</pre>
          </div>

          <button onClick={verifyBlocklySequence} style={{ width: '100%', padding: '12px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 'bold', cursor: 'pointer' }}>
            Test Logical Accuracy ▶
          </button>

          {validationResult.status !== 'idle' && (
            <div style={{ padding: '10px 14px', borderRadius: '8px', fontSize: '0.7rem', fontWeight: 'bold', lineHeight: '1.4', background: validationResult.status === 'pass' ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)', border: `1px solid ${validationResult.status === 'pass' ? '#10b981' : '#ef4444'}`, color: validationResult.status === 'pass' ? '#34d399' : '#f87171' }}>
              {validationResult.msg}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}