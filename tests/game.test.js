import test from 'node:test';
import assert from 'node:assert/strict';
import { defaultDeck } from '../src/content.js';
import { freshGame, scoreClue, skipClue, undo, startFinal, finishFinal, loadGame, STORAGE_KEY, validateDeck } from '../src/game.js';

test('deck contains exactly six mixed categories, 30 clues, and a final',()=>{
  assert.ok(validateDeck(defaultDeck));
  assert.equal(defaultDeck.categories.filter(c=>c.topic==='mass').length,3);
  assert.equal(defaultDeck.categories.filter(c=>c.topic==='commandments').length,3);
  assert.equal(defaultDeck.categories.flatMap(c=>c.clues).length,30);
  assert.equal(freshGame().teams.length,2);
  assert.equal(freshGame().timer,10);
});
test('correct answer scores once and gives answering team control',()=>{
  const g=scoreClue(freshGame(),'0-4',1,true,4);
  assert.equal(g.teams[1].score,500);assert.equal(g.active,1);assert.deepEqual(g.used,['0-4']);
  assert.equal(scoreClue(g,'0-4',1,true,4),g);
  assert.deepEqual(undo(g),freshGame());
});
test('incorrect answer permits negative scores and passes control',()=>{
  const g=scoreClue(freshGame(),'0-0',0,false,0);
  assert.equal(g.teams[0].score,-100);assert.equal(g.active,1);
  const noPenalty=scoreClue({...freshGame(),penalties:false},'0-0',0,false,0);
  assert.equal(noPenalty.teams[0].score,0);assert.equal(noPenalty.used.length,1);
});
test('skip consumes a clue with no score change and can be undone',()=>{
  const g=skipClue(freshGame(),'2-3');assert.equal(g.used.length,1);assert.equal(g.teams[0].score,0);assert.equal(undo(g).used.length,0);
});
test('final rejects invalid wagers and requires both result decisions',()=>{
  let g=freshGame();g.teams[0].score=300;g.teams[1].score=-100;
  for(const wagers of [[301,0],[200,1],[-1,0],[1.5,0],[NaN,0]])assert.equal(startFinal(g,wagers),g);
  const locked=startFinal(g,[250,0]);assert.equal(locked.final.stage,'clue');
  assert.equal(finishFinal(locked,[true,null]),locked);
  const done=finishFinal(locked,[true,false]);assert.equal(done.teams[0].score,550);assert.equal(done.teams[1].score,-100);
  assert.equal(finishFinal(done,[true,true]),done);assert.equal(undo(done).teams[0].score,300);
  assert.equal(undo(undo(done)).final,null);
});
test('saved game restores progress but discards unchecked history',()=>{
  const g=scoreClue(freshGame(),'1-1',0,true,1);
  const storage={getItem:key=>key===STORAGE_KEY?JSON.stringify(g):null};const restored=loadGame(storage);
  assert.equal(restored.teams[0].score,200);assert.deepEqual(restored.used,['1-1']);assert.deepEqual(restored.history,[]);
});
test('corrupt or unavailable storage safely falls back to a fresh game',()=>{
  for(const bad of ['no-json',JSON.stringify({...freshGame(),teams:[]}),JSON.stringify({...freshGame(),used:['bad']}),JSON.stringify({...freshGame(),final:{stage:'clue',wagers:[],results:[]}})])assert.deepEqual(loadGame({getItem:()=>bad}),freshGame());
  assert.deepEqual(loadGame({getItem:()=>{throw Error('blocked')}}),freshGame());
});
test('sixth-grade update upgrades original clues while preserving teacher edits and progress',()=>{
  const g=scoreClue(freshGame(),'1-1',0,true,1);
  delete g.deckRevision;
  g.deck.categories[0].clues[0]={question:'The first three commandments teach us how to love this person.',answer:'Who is God?',note:''};
  g.deck.categories[0].clues[1].question='Teacher’s custom question';
  const restored=loadGame({getItem:()=>JSON.stringify(g)});
  assert.equal(restored.deck.categories[0].clues[0].question,defaultDeck.categories[0].clues[0].question);
  assert.equal(restored.deck.categories[0].clues[1].question,'Teacher’s custom question');
  assert.equal(restored.teams[0].score,200);assert.deepEqual(restored.used,['1-1']);assert.equal(restored.deckRevision,2);
});
