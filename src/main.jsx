import { render } from 'preact';
import { useEffect, useLayoutEffect, useRef, useState } from 'preact/hooks';
import { defaultDeck, sources } from './content.js';
import { STORAGE_KEY, copy, freshGame, loadGame, clueId, clueValue, scoreClue, skipClue, commit, undo, maxWager, startFinal, finishFinal, validateDeck } from './game.js';
import './styles.css';
import './arcade.css';

const paths = {
  star: 'm12 2 2.7 7.3L22 12l-7.3 2.7L12 22l-2.7-7.3L2 12l7.3-2.7Z',
  settings: 'M4 7h16M4 17h16M8 4v6m8 4v6',
  sound: 'm11 5-6 4H2v6h3l6 4ZM15 8a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14',
  mute: 'm11 5-6 4H2v6h3l6 4ZM16 9l6 6m0-6-6 6',
  expand: 'M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5',
  undo: 'M9 4 3 10l6 6M3 10h11a6 6 0 0 1 0 12',
  arrow: 'M4 12h16m-6-6 6 6-6 6',
  close: 'm6 6 12 12M6 18 18 6',
  clock: 'M12 8v5l3 2M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0',
  trophy: 'M8 3h8v7a4 4 0 0 1-8 0ZM8 5H3v3a4 4 0 0 0 5 4m8-7h5v3a4 4 0 0 1-5 4M12 14v6m-5 1h10',
  check: 'm5 12 4 4L19 6',
  book: 'M12 5v16M12 5C8 2 4 3 2 4v15c3-1 7-1 10 2m0-16c4-3 8-2 10-1v15c-3-1-7-1-10 2',
  pause: 'M8 5v14M16 5v14',
  play: 'm8 4 12 8-12 8Z'
};
function Icon({ name, size = 18 }) { return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d={paths[name] || paths.star}/></svg>; }
const artURL = name => `${import.meta.env.BASE_URL}clipart/${name}.png`;
function Art({ name, className = '', alt = '' }) { return <img class={`clip-art ${className}`} src={artURL(name)} alt={alt} decoding="async" draggable={false}/>; }
const categoryArt = ['commandment-tablets', 'church-entrance', 'helping-hands', 'open-bible', 'faith-footsteps', 'chalice-and-host'];
function Celebration({ value = 0, team = '', final = false }) {
  return <div class={`celebration ${final ? 'final-celebration' : ''}`} aria-hidden="true"><div class="celebration-callout"><span>{final ? 'QUEST COMPLETE!' : 'LEVEL UP!'}</span>{!final && <strong>+{value}</strong>}<small>{team}</small></div>{Array.from({ length: 28 }, (_, i) => <i class="pixel-confetti" key={i} style={{ '--x': `${Math.cos(Math.PI + i / 27 * Math.PI) * (160 + i % 5 * 65)}px`, '--y': `${Math.sin(Math.PI + i / 27 * Math.PI) * (210 + i % 5 * 65) - 80}px`, '--spin': `${i * 43}deg`, '--wait': `${i % 4 * .035}s` }}/>)}</div>;
}
const points = n => n.toLocaleString('en-US');
let audioContext;
function chime(kind, enabled) {
  if (!enabled) return;
  try {
    audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
    audioContext.resume().catch(() => {});
    const frequencies = kind === 'correct' ? [523, 659, 784] : kind === 'time' ? [330, 260] : kind === 'wrong' ? [240, 180] : [440, 660];
    frequencies.forEach((frequency, i) => {
      const osc = audioContext.createOscillator(), gain = audioContext.createGain(), t = audioContext.currentTime + i * .12;
      osc.type = 'sine'; osc.frequency.value = frequency; gain.gain.setValueAtTime(0, t); gain.gain.linearRampToValueAtTime(.06, t + .015); gain.gain.exponentialRampToValueAtTime(.001, t + .25);
      osc.connect(gain); gain.connect(audioContext.destination); osc.start(t); osc.stop(t + .26);
    });
  } catch { /* Sound is optional on unsupported browsers. */ }
}
function Modal({ title, children, onClose, wide = false, className = '' }) {
  const ref = useRef(null);
  useLayoutEffect(() => {
    const dialog = ref.current, focused = document.activeElement;
    dialog.showModal();
    return () => { dialog.close(); if (focused?.isConnected && !focused.disabled) focused.focus(); else document.querySelector('.host-button')?.focus(); };
  }, []);
  return <dialog ref={ref} class={`modal ${wide ? 'modal-wide' : ''} ${className}`} onCancel={e => { e.preventDefault(); onClose(); }} onClick={e => { if (e.target === ref.current) { const rect = ref.current.getBoundingClientRect(); if (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom) onClose(); } }}>
    <div class="modal-header"><span class="eyebrow">{title}</span><button class="icon-button" onClick={onClose} aria-label="Close dialog"><Icon name="close"/></button></div>{children}
  </dialog>;
}
function Timer({ duration, sound, stopped, resetKey }) {
  const [remaining, setRemaining] = useState(duration), [running, setRunning] = useState(Boolean(duration && !stopped));
  const deadline = useRef(0);
  useLayoutEffect(() => { setRemaining(duration); deadline.current = Date.now() + duration * 1000; setRunning(Boolean(duration && !stopped)); }, [resetKey, duration]);
  useLayoutEffect(() => { if (stopped) setRunning(false); }, [stopped]);
  useLayoutEffect(() => {
    if (!running) return;
    const interval = setInterval(() => { const left = Math.max(0, Math.ceil((deadline.current - Date.now()) / 1000)); setRemaining(left); if (!left) { setRunning(false); chime('time', sound); } }, 150);
    return () => clearInterval(interval);
  }, [running, sound]);
  function toggle() { if (stopped || !remaining) return; if (!running) deadline.current = Date.now() + remaining * 1000; setRunning(!running); }
  useLayoutEffect(() => {
    const handler = e => { if (e.code === 'Space' && !['INPUT','TEXTAREA','SELECT','BUTTON'].includes(e.target.tagName)) { e.preventDefault(); toggle(); } };
    window.addEventListener('keydown', handler); return () => window.removeEventListener('keydown', handler);
  }, [running, remaining, stopped]);
  if (!duration) return null;
  return <div class={`timer ${remaining <= 5 ? 'urgent' : ''}`}><button class="timer-toggle" onClick={toggle} disabled={stopped || !remaining} aria-label={running ? 'Pause timer' : 'Start timer'}><Icon name={running ? 'pause' : 'play'} size={16}/><span>{remaining}<small>{remaining ? 'sec' : 'Time’s up'}</small></span></button><div class="timer-track"><div style={{ width: `${remaining / duration * 100}%` }}/></div><button class="text-button" onClick={() => { setRemaining(duration); deadline.current = Date.now() + duration * 1000; setRunning(true); }} disabled={stopped}>Reset</button><span class="sr-only" role="status">{remaining === 0 ? 'Time is up. The host can still score the answer.' : ''}</span></div>;
}
function ClueModal({ game, selected, onClose, onScore, onSkip }) {
  const [revealed, setRevealed] = useState(false), [team, setTeam] = useState(game.active);
  const category = game.deck.categories[selected.category], clue = category.clues[selected.row], value = clueValue(selected.row);
  useEffect(() => {
    const handler = e => { if (e.key.toLowerCase() === 'r' && !['INPUT','TEXTAREA','SELECT'].includes(e.target.tagName)) setRevealed(true); };
    window.addEventListener('keydown', handler); return () => window.removeEventListener('keydown', handler);
  }, []);
  return <Modal title={`${category.name} · ${points(value)} points`} onClose={onClose} wide className="clue-modal">
    <div class="clue-illustration">{categoryArt[selected.category] ? <Art name={categoryArt[selected.category]}/> : <Icon name="book" size={60}/>}</div><div class="clue-content"><span class="clue-topic">{category.topic === 'mass' ? 'Parts of the Mass' : 'Ten Commandments'}</span><h2>{clue.question}</h2>
      {revealed ? <div class="answer-panel"><span class="eyebrow">The answer</span><h3>{clue.answer}</h3>{clue.note && <p>{clue.note}</p>}</div> : <p class="clue-hint">Discuss with your team. Answer in the form of a question.</p>}
    </div>
    <Timer duration={game.timer} sound={game.sound} stopped={revealed} resetKey={selected.id}/>
    {!revealed ? <div class="clue-footer"><button class="primary" onClick={() => setRevealed(true)}>Reveal answer <span class="key">R</span></button><button class="text-button" onClick={onSkip}>No answer · retire clue</button></div> : <div class="judging"><span class="eyebrow">Who answered?</span><div class="team-picker">{game.teams.map((t, i) => <button class={team === i ? 'selected' : ''} aria-pressed={team === i} onClick={() => setTeam(i)} key={i}>{t.name}</button>)}</div><div class="score-actions"><button class="correct" onClick={() => onScore(team, true)}><Icon name="check"/>Correct +{value}</button><button class="incorrect" onClick={() => onScore(team, false)}><Icon name="close"/>Incorrect {game.penalties ? `−${value}` : '· no deduction'}</button><button class="text-button" onClick={onSkip}>No points</button></div><p class="subtle">Scoring closes this clue. Use Undo on the board to correct a decision.</p></div>}
  </Modal>;
}
function HostModal({ game, onSave, onClose, onNew }) {
  const [tab, setTab] = useState('settings'), [draft, setDraft] = useState(copy(game)), [category, setCategory] = useState(0), [row, setRow] = useState(0), [error, setError] = useState(''), [confirmReset, setConfirmReset] = useState(false);
  function update(field, value) { setDraft(d => ({ ...d, [field]: value })); }
  function updateTeam(i, field, value) { setDraft(d => ({ ...d, teams: d.teams.map((t, j) => i === j ? { ...t, [field]: value } : t) })); }
  function updateCategory(field, value) { setDraft(d => { const next = copy(d); next.deck.categories[category][field] = value; return next; }); }
  function updateClue(field, value) { setDraft(d => { const next = copy(d); const target = category === 6 ? next.deck.final : next.deck.categories[category].clues[row]; target[field] = value; return next; }); }
  function save() {
    if (!draft.teams.every(t => t.name.trim() && Number.isSafeInteger(Number(t.score)) && Math.abs(Number(t.score)) <= 10000000)) return setError('Give both teams a name and a whole-number score between −10,000,000 and 10,000,000.');
    if (!validateDeck(draft.deck)) return setError('Complete every title, category, clue, and answer before saving.');
    onSave({ ...draft, teams: draft.teams.map(t => ({ name: t.name.trim(), score: Number(t.score) })) });
  }
  const q = category === 6 ? draft.deck.final : draft.deck.categories[category].clues[row];
  return <Modal title="Behind the curtain" onClose={onClose} wide>
    <h2 class="host-heading">The teacher’s desk</h2><div class="tabs" role="tablist" aria-label="Teacher tools">{[['settings','Game settings'],['clues','Edit clues'],['guide','How to play']].map(([id, name]) => <button key={id} id={`tab-${id}`} role="tab" aria-selected={tab === id} aria-controls={`panel-${id}`} class={tab === id ? 'selected' : ''} onClick={() => { setTab(id); setError(''); }}>{name}</button>)}</div>
    <div id={`panel-${tab}`} role="tabpanel" aria-labelledby={`tab-${tab}`}>
      {tab === 'settings' && <div class="settings-panel"><div class="form-grid">{draft.teams.map((t,i) => <fieldset key={i}><legend>Team {i+1}</legend><label>Team name<input maxLength={40} value={t.name} onInput={e => updateTeam(i,'name',e.currentTarget.value)}/></label><label>Score<input type="number" step="1" value={t.score} onInput={e => updateTeam(i,'score',e.currentTarget.value)} disabled={Boolean(game.final && game.final.stage !== 'done')}/></label></fieldset>)}</div><div class="form-grid"><label>Clue timer<select value={draft.timer} onChange={e => update('timer',Number(e.currentTarget.value))}>{[0,10,15,30,45,60].map(t => <option key={t} value={t}>{t ? `${t} seconds` : 'No timer'}</option>)}</select></label><label>Incorrect answers<select value={String(draft.penalties)} onChange={e => update('penalties',e.currentTarget.value === 'true')}><option value="true">Subtract the clue value</option><option value="false">No point deduction</option></select></label></div><label class="checkbox"><input type="checkbox" checked={draft.sound} onChange={e => update('sound',e.currentTarget.checked)}/>Play game-show sound effects</label><div class="reset-area"><div><h3>A fresh start</h3><p>Clear scores, played clues, and final wagers. Keep your edited clues, team names, and settings.</p></div>{confirmReset ? <div class="reset-confirm"><p>Start a new game?</p><button class="danger" onClick={() => onNew(draft)}>Yes, reset game</button><button class="secondary" onClick={() => setConfirmReset(false)}>Cancel</button></div> : <button class="secondary" onClick={() => setConfirmReset(true)}>New game</button>}</div></div>}
      {tab === 'clues' && <div class="settings-panel"><div class="form-grid"><label>Game title<input maxLength={100} value={draft.deck.title} onInput={e => setDraft(d=>({...d,deck:{...d.deck,title:e.currentTarget.value}}))}/></label><label>Subtitle<input maxLength={150} value={draft.deck.subtitle} onInput={e => setDraft(d=>({...d,deck:{...d.deck,subtitle:e.currentTarget.value}}))}/></label></div><div class="editor-pickers"><label>Category<select value={category} onChange={e => { setCategory(Number(e.currentTarget.value)); setRow(0); }}>{draft.deck.categories.map((c,i)=><option key={i} value={i}>{c.name}</option>)}<option value={6}>Final challenge</option></select></label>{category < 6 && <label>Value<select value={row} onChange={e=>setRow(Number(e.currentTarget.value))}>{[0,1,2,3,4].map(r=><option key={r} value={r}>{clueValue(r)} points</option>)}</select></label>}</div>{category<6 ? <label>Category name<input maxLength={40} value={draft.deck.categories[category].name} onInput={e=>updateCategory('name',e.currentTarget.value)}/></label> : <label>Final category<input value={q.category} onInput={e=>updateClue('category',e.currentTarget.value)}/></label>}<label>Clue<textarea rows={3} maxLength={2000} value={q.question} onInput={e=>updateClue('question',e.currentTarget.value)}/></label><label>Answer<textarea rows={2} maxLength={2000} value={q.answer} onInput={e=>updateClue('answer',e.currentTarget.value)}/></label><label>Teacher note <span class="optional">(optional)</span><textarea rows={2} maxLength={2000} value={q.note || ''} onInput={e=>updateClue('note',e.currentTarget.value)}/></label><p class="subtle">Edits are saved in this browser. To change the default deck for everyone, edit src/content.js.</p></div>}
      {tab === 'guide' && <div class="guide"><ol><li><strong>Split into two teams.</strong> Choose a team card to give that team control of the board.</li><li><strong>Choose a category and value.</strong> Read the clue aloud. The countdown starts automatically when a clue opens. Pause it if needed.</li><li><strong>Reveal and judge.</strong> Select the team that answered, then score correct or incorrect. A correct team chooses next; an incorrect answer passes control. Each scoring decision retires the clue.</li><li><strong>Finish with a wager.</strong> Each team writes down a wager, then the host enters and locks both wagers before showing the final clue. Teams write their answers privately.</li></ol><p>You may accept equivalent wording and thoughtful responses to discussion clues. Catholic commandment numbering is used throughout.</p><div class="guide-shortcuts"><span><kbd>R</kbd> Reveal clue answer</span><span><kbd>Esc</kbd> Close dialog</span></div><h3>Teacher references</h3>{sources.map(s=><a href={s.url} target="_blank" rel="noreferrer" key={s.url}>{s.title}<Icon name="arrow" size={14}/></a>)}</div>}
    </div>
    {error && <p class="error" role="alert">{error}</p>}<div class="modal-actions"><button class="text-button" onClick={onClose}>Close without saving</button><button class="primary" onClick={save}>Save changes <Icon name="check"/></button></div>
  </Modal>;
}
function FinalModal({ game, onChange, onClose }) {
  const [wagers, setWagers] = useState(['0','0']), [error, setError] = useState('');
  const final = game.final, q = game.deck.final;
  function lock() { const next = startFinal(game,wagers.map(w => w.trim() ? Number(w) : NaN)); if(next === game) setError('Enter a whole-number wager within each team’s allowed range.'); else { onChange(next); chime('open',game.sound); } }
  const scores=game.teams.map(t=>t.score), tied=scores[0]===scores[1], winner=scores[0]>scores[1]?0:1;
  return <Modal title="The final challenge" onClose={onClose} wide className="final-modal">
    {final?.stage === 'done' ? <div class="results"><Celebration final/><div class="trophy"><Icon name="trophy" size={46}/></div><span class="eyebrow">What a show.</span><h2>{tied?'A brilliant tie!':`${game.teams[winner].name} wins!`}</h2><p>Two teams. Big ideas. A little more wisdom.</p><div class="final-scores">{game.teams.map((t,i)=><div key={i} class={`result-card ${!tied&&i===winner?'winner':''}`}><span>{t.name}</span><strong>{points(t.score)}</strong><small>{final.results[i]?'Correct':'Incorrect'} · wager {points(final.wagers[i])}</small></div>)}</div><button class="primary" onClick={onClose}>Back to the board <Icon name="arrow"/></button></div> : !final ? <div class="wager-content"><Art name="commandment-tablets" className="final-art"/><span class="eyebrow">Final category</span><h2>{q.category}</h2><p>Have each team write its wager privately. Enter both below, then lock them before revealing the clue.</p>{game.used.length<30 && <div class="notice">{30-game.used.length} clues are still available. You can finish early; locking wagers ends regular board play.</div>}<div class="form-grid wager-fields">{game.teams.map((t,i)=><label key={i}><span>{t.name}</span><small>{points(t.score)} points · Wager 0–{points(maxWager(t.score))}</small><input type="number" min="0" max={maxWager(t.score)} step="1" value={wagers[i]} onInput={e=>setWagers(w=>w.map((v,j)=>i===j?e.currentTarget.value:v))}/></label>)}</div><p class="subtle">Teams with zero or negative scores may play with a zero-point wager.</p>{error&&<p class="error" role="alert">{error}</p>}<button class="primary" onClick={lock}>Lock wagers & show clue <Icon name="arrow"/></button></div> : <><div class="clue-content"><span class="clue-topic">{q.category}</span><h2>{q.question}</h2>{final.revealed?<div class="answer-panel"><span class="eyebrow">The answer</span><h3>{q.answer}</h3>{q.note&&<p>{q.note}</p>}</div>:<p class="clue-hint">Both teams: write your answers, then hand them to the host.</p>}</div><Timer duration={game.timer} stopped={final.revealed} sound={game.sound} resetKey="final"/>{!final.revealed?<div class="clue-footer"><button class="primary" onClick={()=>onChange({...game,final:{...final,revealed:true}})}>Reveal final answer</button></div>:<div class="final-judge"><div class="form-grid">{game.teams.map((t,i)=><div class="judge-card" key={i}><h3>{t.name}</h3><p>Wager: {points(final.wagers[i])}</p><div class="team-picker">{[true,false].map(correct=><button key={String(correct)} aria-pressed={final.results[i]===correct} class={final.results[i]===correct?'selected':''} onClick={()=>onChange({...game,final:{...final,results:final.results.map((r,j)=>i===j?correct:r)}})}>{correct?'Correct':'Incorrect'}</button>)}</div></div>)}</div><button class="primary" disabled={final.results.some(r=>r===null)} onClick={()=>{onChange(finishFinal(game,final.results));chime('correct',game.sound);}}>Reveal the winners <Icon name="trophy"/></button></div>}</>}
  </Modal>;
}
function App() {
  const [game, setGame] = useState(()=>{try{return loadGame(window.localStorage);}catch{return freshGame();}}), [selected,setSelected] = useState(null), [host,setHost] = useState(false), [finalOpen,setFinalOpen] = useState(false), [toast,setToast] = useState(''), [saveError,setSaveError] = useState(false), [celebration,setCelebration] = useState(null);
  useLayoutEffect(()=>{try{localStorage.setItem(STORAGE_KEY,JSON.stringify({...game,history:[]}));setSaveError(false);}catch{setSaveError(true);}},[game]);
  useEffect(()=>{if(!toast)return;const t=setTimeout(()=>setToast(''),4000);return()=>clearTimeout(t);},[toast]);
  useEffect(()=>{if(!celebration)return;const timeout=setTimeout(()=>setCelebration(null),1500);return()=>clearTimeout(timeout);},[celebration]);
  const remaining=30-game.used.length;
  function score(team,correct){setGame(g=>scoreClue(g,selected.id,team,correct,selected.row));setSelected(null);chime(correct?'correct':'wrong',game.sound);if(correct)setCelebration({value:clueValue(selected.row),team:game.teams[team].name,id:Date.now()});setToast(`${game.teams[team].name}: ${correct?'+':game.penalties?'−':''}${correct||game.penalties?clueValue(selected.row):'no deduction'} points`);}
  async function fullscreen(){try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();}catch{setToast('Fullscreen is unavailable in this browser.');}}
  return <div class="app-shell"><header class="app-header"><a href="./" class="brand" aria-label="Faith Frenzy home" onClick={e=>e.preventDefault()}><span class="brand-mark"><Icon name="star" size={22}/></span><span>FAITH<span class="brand-show">FRENZY</span></span><span class="edition">CCD ARCADE CLUB</span></a><nav class="header-tools" aria-label="Game controls"><button class="tool sound-tool" aria-label={`Sound effects ${game.sound?'on':'off'}`} aria-pressed={game.sound} onClick={()=>setGame(g=>({...g,sound:!g.sound}))}><Icon name={game.sound?'sound':'mute'}/><span>Sound {game.sound?'on':'off'}</span></button><button class="tool icon-only" onClick={fullscreen} aria-label="Toggle fullscreen"><Icon name="expand"/></button><button class="tool host-button" aria-label="Host tools" onClick={()=>setHost(true)}><Icon name="settings"/><span>Host tools</span></button></nav></header>
    <main><section class="hero" aria-labelledby="game-title"><div class="hero-copy"><div class="eyebrow hero-eyebrow"><span class="live-dot"/>GRADE 6 <span class="divider">/</span> TWO TEAMS. ONE BIG SHOWDOWN.</div><h1 id="game-title">{game.deck.title}</h1><p>{game.deck.subtitle}</p><div class="arcade-tag"><span>★</span>{game.final ? 'FINAL LEVEL' : 'PICK A CLUE. MAKE YOUR MOVE.'}</div></div><div class="hero-art" aria-hidden="true"><div class="art-halo"/><Art name="moses" className="hero-moses"/><Art name="jesus" className="hero-jesus"/><div class="mass-props"><Art name="bread-and-wheat"/><Art name="wine-cruet"/></div></div></section>
    <div class={`board-meta player-${game.active+1}`}><div class="turn-banner" role="status" aria-live="polite"><span class="turn-icon"><Icon name={game.final?'trophy':'play'} size={24}/></span><div class="turn-copy"><span class="turn-label">{game.final?'FINAL ROUND':'YOUR TURN · PICK A CLUE'}</span><strong>{game.final?'Both teams, ready!':game.teams[game.active].name}</strong></div></div><span class="clues-remaining">{remaining} <span class="hide-tiny">of 30</span> clues remaining</span></div>
    <section class="board" aria-label="Game board"><div class="category-row">{game.deck.categories.map((c,i)=><div class="category" key={i}><div class="category-art">{categoryArt[i] ? <Art name={categoryArt[i]}/> : <Icon name="book" size={40}/>}</div><span class="category-topic">{c.topic==='mass'?'THE MASS':'COMMANDMENTS'}</span><h2>{c.name}</h2><div class="category-line"/></div>)}</div><div class="clue-grid">{[0,1,2,3,4].flatMap(row=>game.deck.categories.map((c,category)=>{const id=clueId(category,row),used=game.used.includes(id);return <button key={id} class={`tile ${used?'played':''}`} disabled={used||Boolean(game.final)} aria-label={`${c.name}, ${clueValue(row)} points${used?', played':''}`} onClick={()=>{setSelected({category,row,id});chime('open',game.sound);}} style={{'--delay':`${row*30+category*12}ms`}}>{used?<Icon name="star" size={22}/>:<span>{clueValue(row)}</span>}</button>;}))}</div></section>
    <section class="scoreboard" aria-label="Team scores">{game.teams.map((team,i)=><button class={`team-card ${game.active===i?'active':''}`} aria-pressed={game.active===i} key={i} disabled={Boolean(game.final)} onClick={()=>setGame(g=>({...g,active:i}))}><div class="team-avatar">{String(i+1).padStart(2,'0')}</div><div class="team-info"><span class="team-name">{team.name}</span><span class="team-status">{game.final?'FINAL ROUND':game.active===i?'YOUR PICK':'READY TO PLAY'}</span></div><div class="team-score"><strong>{points(team.score)}</strong><span>POINTS</span></div>{game.active===i&&<span class="active-indicator"/>}</button>)}</section>
    <div class="board-footer"><div class="footer-left"><button class="text-button undo-button" disabled={!game.history.length} onClick={()=>{setGame(g=>undo(g));setToast('Last score or round action undone.');}}><Icon name="undo" size={16}/>Undo</button><span class="footer-note"><span class="saved-dot"/>{saveError?'Saving unavailable':'Progress saved in this browser'}</span></div><button class="primary final-button" onClick={()=>setFinalOpen(true)}>{game.final?.stage==='done'?'View results':game.final?'Resume final challenge':'Final challenge'}<Icon name={game.final?.stage==='done'?'trophy':'arrow'}/></button></div>
    {remaining===0&&!game.final&&<div class="board-complete"><Icon name="trophy"/>The board is complete. Time for the final challenge.</div>}
    <footer class="site-footer"><span>BIG QUESTIONS. BRILLIANT TEAMWORK.</span><span>LEARN. PLAY. LEVEL UP. <span class="footer-star">✦</span></span></footer>
    </main>
    {selected&&<ClueModal key={selected.id} game={game} selected={selected} onClose={()=>setSelected(null)} onScore={score} onSkip={()=>{setGame(g=>skipClue(g,selected.id));setSelected(null);setToast('Clue retired without points.');}}/>}
    {host&&<HostModal game={game} onClose={()=>setHost(false)} onSave={draft=>{setGame(g=>commit(g,{teams:draft.teams,deck:draft.deck,timer:draft.timer,penalties:draft.penalties,sound:draft.sound}));setHost(false);setToast('Teacher settings saved.');}} onNew={draft=>{setGame({...freshGame(),deck:validateDeck(draft.deck)?draft.deck:copy(defaultDeck),teams:draft.teams.map((t,i)=>({name:t.name.trim()||`Team ${i+1}`,score:0})),sound:draft.sound,timer:draft.timer,penalties:draft.penalties});setHost(false);setToast('New game. Ready, players?');}}/>}
    {finalOpen&&<FinalModal game={game} onChange={setGame} onClose={()=>setFinalOpen(false)}/>}
    {celebration&&<Celebration key={celebration.id} value={celebration.value} team={celebration.team}/>}
    <div class={`toast ${toast?'visible':''}`} role="status">{toast}</div>
  </div>;
}
render(<App/>,document.getElementById('app'));
