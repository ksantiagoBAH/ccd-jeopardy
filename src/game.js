import { migrateDeck } from './deck-migrations.js';
import { defaultDeck, DECK_REVISION } from './content.js';
export const STORAGE_KEY = 'midnight-show-v1';
export const copy = value => JSON.parse(JSON.stringify(value));
export const freshGame = () => ({ version: 1, deckRevision: DECK_REVISION, deck: copy(defaultDeck), teams: [{ name: 'Saint Francis', score: 0 }, { name: 'Saint Clare', score: 0 }], active: 0, used: [], history: [], sound: true, timer: 10, penalties: true, final: null });
export const clueId = (category, row) => `${category}-${row}`;
export const clueValue = row => (row + 1) * 100;
export function validateDeck(deck) {
  const text = value => typeof value === 'string' && value.trim().length > 0 && value.length <= 2000;
  if (!deck || !text(deck.title) || !text(deck.subtitle) || !Array.isArray(deck.categories) || deck.categories.length !== 6) return false;
  if (!deck.categories.every(c => text(c.name) && ['mass', 'commandments'].includes(c.topic) && Array.isArray(c.clues) && c.clues.length === 5 && c.clues.every(q => text(q.question) && text(q.answer) && (q.note === undefined || typeof q.note === 'string' && q.note.length <= 2000)))) return false;
  return deck.final && ['category', 'question', 'answer'].every(key => text(deck.final[key])) && (deck.final.note === undefined || typeof deck.final.note === 'string');
}
function snapshot(g) { return copy({ teams: g.teams, active: g.active, used: g.used, final: g.final, deck: g.deck, sound: g.sound, timer: g.timer, penalties: g.penalties }); }
export function commit(g, change) { return { ...g, ...change, history: [...g.history.slice(-49), snapshot(g)] }; }
export function scoreClue(g, id, team, correct, row) {
  if (g.used.includes(id) || ![0, 1].includes(team)) return g;
  const delta = correct ? clueValue(row) : g.penalties ? -clueValue(row) : 0;
  return commit(g, { teams: g.teams.map((t, i) => i === team ? { ...t, score: t.score + delta } : t), used: [...g.used, id], active: correct ? team : 1 - team });
}
export function skipClue(g, id) { return g.used.includes(id) ? g : commit(g, { used: [...g.used, id] }); }
export function undo(g) { return g.history.length ? { ...g, ...g.history[g.history.length - 1], history: g.history.slice(0, -1) } : g; }
export const maxWager = score => Math.max(0, score);
export function validWagers(g, wagers) { return Array.isArray(wagers) && wagers.length === 2 && wagers.every((n, i) => Number.isSafeInteger(n) && n >= 0 && n <= maxWager(g.teams[i].score)); }
export function startFinal(g, wagers) { return g.final || !validWagers(g, wagers) ? g : commit(g, { final: { stage: 'clue', wagers: [...wagers], revealed: false, results: [null, null] } }); }
export function finishFinal(g, results) {
  if (!g.final || g.final.stage === 'done' || !Array.isArray(results) || results.length !== 2 || !results.every(r => typeof r === 'boolean')) return g;
  return commit(g, { teams: g.teams.map((t, i) => ({ ...t, score: t.score + (results[i] ? 1 : -1) * g.final.wagers[i] })), final: { ...g.final, stage: 'done', results } });
}
export function loadGame(storage) {
  try {
    const g = JSON.parse(storage.getItem(STORAGE_KEY));
    if (!g || g.version !== 1 || !validateDeck(g.deck) || !Array.isArray(g.teams) || g.teams.length !== 2 || !g.teams.every(t => typeof t.name === 'string' && t.name.trim() && t.name.length <= 40 && Number.isSafeInteger(t.score)) || ![0, 1].includes(g.active) || !Array.isArray(g.used) || !g.used.every(id => /^[0-5]-[0-4]$/.test(id)) || ![0, 10, 15, 30, 45, 60].includes(g.timer) || typeof g.sound !== 'boolean' || typeof g.penalties !== 'boolean') return freshGame();
    if (g.final && (!['clue', 'done'].includes(g.final.stage) || !Array.isArray(g.final.wagers) || g.final.wagers.length !== 2 || !g.final.wagers.every(n => Number.isSafeInteger(n) && n >= 0) || !Array.isArray(g.final.results) || g.final.results.length !== 2 || !g.final.results.every(r => r === null || typeof r === 'boolean'))) return freshGame();
    // History is session-only: restored data never becomes an unchecked undo snapshot.
    return { ...g, deckRevision: DECK_REVISION, deck: g.deckRevision === DECK_REVISION ? g.deck : migrateDeck(g.deck, defaultDeck), history: [], used: [...new Set(g.used)] };
  } catch { return freshGame(); }
}
