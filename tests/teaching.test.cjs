const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const crypto = require('node:crypto');
const root = path.join(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'index.html'), 'utf8').match(/<script>([\s\S]*?)<\/script>/)[1];
function app() {
  const nodes = new Map(), storage = new Map();
  const node = id => {
    if (!nodes.has(id)) nodes.set(id, {innerHTML:'',textContent:'',className:'',classList:{toggle(){}},addEventListener(){},style:{}});
    return nodes.get(id);
  };
  const context = vm.createContext({document:{getElementById:node,querySelectorAll:()=>[]},
    localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v),removeItem:k=>storage.delete(k)},
    window:{scrollTo(){}},console,Set,Map,JSON,Math});
  vm.runInContext(source + `\nglobalThis.api={randomizeExamQuestion,loadChoiceHistory,textbookFor,TEXTBOOK_SECTIONS,resetProgress,BANK,randomizeQuestion,buildExam,exact,partialScore,teachingNote,lessonFor,relatedQuestions,personalizedNotes,notesHTML,reviewHTML,studyNotesText,
    setResults:details=>lastResults={details,total:details.length,strict:details.filter(d=>d.strict).length,points:details.reduce((a,d)=>a+d.points,0)}};`, context);
  context.api.storage=storage;
  context.api.seedLearning=()=>vm.runInContext("stats={test:{points:1,total:2}};missed=new Set([180]);session={mode:'full'};lastResults={total:1};saveStats();persistSession();",context);
  context.api.learningState=()=>vm.runInContext("({stats,missed:[...missed],session,lastResults})",context);
  return context.api;
}
const plain = value => JSON.parse(JSON.stringify(value));
function detail(api,q,user){return {q,user,strict:api.exact(user,q.answer),points:q.type==='single'?(api.exact(user,q.answer)?1:0):api.partialScore(user,q.answer)};}

test('all original question content, short explanations, and keys are unchanged',()=>{
  const {BANK}=app();
  assert.equal(BANK.length,239);
  const original=plain(BANK).map(({lesson,...rest})=>rest);
  const hash=crypto.createHash('sha256').update(JSON.stringify(original)).digest('hex');
  assert.equal(hash,fs.readFileSync(path.join(__dirname,'bank-baseline.sha256'),'utf8').trim());
  for(const q of BANK){
    assert.ok(q.lesson.correctIdea&&q.lesson.misconception&&q.lesson.explanation,`lesson ${q.id}`);
    assert.ok(q.lesson.quickCheck&&q.lesson.quickCheckAnswer,`transfer check ${q.id}`);
    for(const opt of q.options)assert.ok(q.lesson.choiceFeedback[opt],`choice ${q.id}: ${opt}`);
  }
});

test('shuffling preserves answer keys AND text-keyed feedback for every choice',()=>{
  const a=app();let checked=0;
  for(const original of a.BANK){
    for(let round=0;round<8;round++){
      const q=a.randomizeQuestion(original);
      assert.deepEqual(plain(q.answer.map(i=>q.options[i])).sort(),plain(original.answer.map(i=>original.options[i])).sort());
      for(let i=0;i<q.options.length;i++){
        const d=detail(a,q,[i]),n=a.teachingNote(d);
        for(const f of n.feedback)assert.equal(f.explanation,original.lesson.choiceFeedback[f.text]);
        assert.deepEqual(plain(n.incorrect),q.answer.includes(i)?[]:[q.options[i]]);
        assert.equal(n.question,q.q);
        checked++;
      }
    }
  }
  assert.equal(checked,965*8);
});

test('exact wrong selection drives acid/base diagnosis and downloadable notes',()=>{
  const a=app(),q=a.randomizeQuestion(a.BANK.find(q=>q.id===180));
  a.setResults([detail(a,q,[q.options.indexOf('releasing only H⁺')])]);
  const n=a.personalizedNotes()[0];
  assert.match(n.diagnosis,/increases acidity/);
  assert.match(a.studyNotesText(),/FROM the solution/);
  assert.match(a.studyNotesText(),/releasing only H⁺/);
  assert.match(a.notesHTML(),/Teach Me This/);
  a.setResults([detail(a,q,[q.options.indexOf('adding neutrons')])]);
  assert.match(a.personalizedNotes()[0].diagnosis,/Neutrons/);
  assert.doesNotMatch(a.studyNotesText(),/releasing only H⁺/);
});

test('select-all distinguishes omitted and extra choices, without unrelated first-shell teaching',()=>{
  const a=app(),q=a.randomizeQuestion(a.BANK.find(q=>q.id===138));
  const first=q.options.indexOf('The first shell can hold two electrons.');
  const falseOption=q.options.indexOf('Every atom currently has eight valence electrons.');
  let d=detail(a,q,q.answer.filter(i=>i!==first));
  assert.equal(d.points,.75);
  let n=a.teachingNote(d);
  assert.deepEqual(plain(n.omitted),['The first shell can hold two electrons.']);
  assert.equal(n.incorrect.length,0);
  assert.equal(n.sections.length,1);
  assert.match(n.sections[0].explanation,/Helium/);
  assert.doesNotMatch(JSON.stringify(n.sections),/magnesium/i);
  d=detail(a,q,[...q.answer.filter(i=>i!==first),falseOption]);
  n=a.teachingNote(d);
  assert.equal(d.points,3/5);
  assert.deepEqual(plain(n.incorrect),['Every atom currently has eight valence electrons.']);
  assert.equal(n.sections.length,2);
  for(const source of a.BANK.filter(q=>q.type==='multi')){
    const shuffled=a.randomizeQuestion(source);
    const missed=a.teachingNote(detail(a,shuffled,[]));
    assert.equal(missed.sections.length,shuffled.answer.length);
    assert.ok(missed.sections.every(s=>s.correctIdea&&s.explanation&&s.quickCheckAnswer));
  }
});

test('unanswered, perfect, legacy saved questions, and missing optional metadata are supported',()=>{
  const a=app(),q=a.randomizeQuestion(a.BANK[179]);
  delete q.lesson;
  assert.ok(a.lessonFor(q).choiceFeedback);
  a.setResults([detail(a,q,[])]);
  assert.match(a.studyNotesText(),/no selected answer/);
  assert.doesNotMatch(a.studyNotesText(),/Why your answer may have been tempting/);
  a.setResults([detail(a,q,q.answer)]);
  assert.equal(a.personalizedNotes().length,0);
  assert.match(a.studyNotesText(),/fully correct/);
  const custom={...q,id:9999,lesson:{explanation:'A short supported explanation.'}};
  assert.doesNotThrow(()=>a.teachingNote(detail(a,custom,[])));
  delete custom.lesson;
  assert.equal(a.lessonFor(custom).explanation,custom.explanation);
});

test('all six modes keep their counts, chapter balance, and unique questions',()=>{
  const a=app();
  for(const [mode,count] of Object.entries({full:50,weak:20,mistakes:20,ch1:30,ch2:30,electron:15})){
    const s=a.buildExam(mode);
    assert.equal(s.questions.length,count);
    assert.equal(new Set(s.questions.map(q=>q.id)).size,count);
    if(mode==='full')assert.equal(s.questions.filter(q=>q.chapter===1).length,25);
    if(mode==='ch1'||mode==='ch2')assert.ok(s.questions.every(q=>q.chapter===Number(mode.at(-1))));
  }
  assert.equal(a.partialScore([0,1],[1,2]),1/3);
  assert.equal(a.partialScore([], [1]),0);
  assert.ok(a.exact([2,1],[1,2]));
});

test('related practice stays within concept and excludes the original question',()=>{
  const a=app();
  for(const q of a.BANK){
    const related=a.relatedQuestions(q);
    const available=a.BANK.filter(other=>other.concept===q.concept&&other.id!==q.id).length;
    assert.equal(related.length,Math.min(3,available));
    assert.ok(related.every(other=>other.id!==q.id&&other.concept===q.concept));
    assert.equal(new Set(related.map(other=>other.id)).size,related.length);
  }
});

test('reset clears only app learning data and in-memory results',()=>{
  const a=app();
  a.seedLearning();
  a.buildExam('full');
  a.storage.set('unrelated_app','keep');
  a.storage.set('ap_v2_motion','paused');
  a.resetProgress();
  for(const key of ['ap_v2_stats','ap_v2_missed','ap_v2_session','ap_v2_choice_history'])assert.equal(a.storage.has(key),false);
  assert.equal(a.storage.get('unrelated_app'),'keep');
  assert.equal(a.storage.get('ap_v2_motion'),'paused');
  assert.deepEqual(plain(a.learningState()),{stats:{},missed:[],session:null,lastResults:null});
});

test('every question has a Chapter 1/2 reading link in teaching and downloads',()=>{
  const a=app();
  for(const original of a.BANK){
    const q=a.randomizeQuestion(original),ref=a.textbookFor(q);
    assert.ok(ref,`reading for ${q.id}`);
    assert.equal(new URL(ref.url).hostname,'openstax.org');
    assert.match(ref.url,/anatomy-and-physiology-2e\/pages\/[12]-[1-7]-/);
    assert.equal(Number(ref.section[0]),q.chapter);
    const d=detail(a,q,[]);a.setResults([d]);
    for(const section of a.teachingNote(d).sections)assert.equal(section.textbook.url,ref.url);
    assert.ok(a.notesHTML().includes(ref.url));
    assert.ok(a.notesHTML().includes('target="_blank" rel="noopener noreferrer"'));
    assert.ok(a.studyNotesText().includes(ref.url));
  }
  assert.equal(a.textbookFor(a.BANK.find(q=>q.id===35)).section,'1.3');
  assert.equal(a.textbookFor(a.BANK.find(q=>q.id===180)).section,'2.4');
  assert.equal(a.textbookFor(a.BANK.find(q=>q.id===124)).section,'2.2');
  const q=a.randomizeQuestion(a.BANK.find(q=>q.id===138));delete q.lesson;
  a.setResults([detail(a,q,q.answer.slice(1))]);
  assert.ok(a.notesHTML().includes(a.textbookFor(q).url));
});


test('repeat exams move correct positions for every question and retain correct answer text',()=>{
  const a=app();
  for(const source of a.BANK){
    let previous=a.randomizeExamQuestion(source);
    for(let attempt=0;attempt<30;attempt++){
      const next=a.randomizeExamQuestion(source);
      assert.notDeepEqual(plain(next.options),plain(previous.options),`layout ${source.id}`);
      if(source.answer.length<source.options.length)assert.notDeepEqual(plain(next.answer),plain(previous.answer),`correct slots ${source.id}`);
      assert.deepEqual(plain(next.answer.map(i=>next.options[i])).sort(),plain(source.answer.map(i=>source.options[i])).sort());
      previous=next;
    }
  }
});
test('exam layouts persist and an old saved session seeds layout history',()=>{
  const a=app(),exam=a.buildExam('electron');
  const stored=JSON.parse(a.storage.get('ap_v2_choice_history'));
  for(const q of exam.questions)assert.deepEqual(stored[q.id].answer,plain(q.answer));
  const old=exam.questions[0];a.storage.delete('ap_v2_choice_history');
  a.storage.set('ap_v2_session',JSON.stringify({questions:[old]}));
  assert.deepEqual(plain(a.loadChoiceHistory()[old.id]),{options:plain(old.options),answer:plain(old.answer)});
  a.storage.set('ap_v2_choice_history','invalid JSON');
  assert.ok(a.loadChoiceHistory()[old.id]);
});
