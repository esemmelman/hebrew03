const lessons = [
  { title: 'It starts with Aleph.', category: 'MEET YOUR FIRST LETTER', intro: 'Aleph is the first letter of the Hebrew alphabet. On its own, it is silent. Add a vowel mark to give it a sound.', tip: 'Look closely at the shape. This is Aleph: א.' },
  { title: 'Your first vowel sounds.', category: 'ADD A VOWEL · READ A SOUND', intro: 'Practice Aleph with Kamatz, Patach, and Segol. Read each row from right to left, then move down to the next row.', tip: 'Kamatz and Patach: “ah” · Segol: “eh” (Modern Hebrew).', vowels: [{mark:'\u05b8',name:'Kamatz',sound:'ah'},{mark:'\u05b7',name:'Patach',sound:'ah'},{mark:'\u05b6',name:'Segol',sound:'eh'}] },
  { title: 'Three more sounds to explore.', category: 'KEEP GOING · MIX IT UP', intro: 'Practice Aleph with Tzere, Cherek, and Cholem in a random mix. Read from right to left. Shuffle whenever you want a new challenge.', tip: 'Cherek is also spelled Hiriq; Cholem is also spelled Holam.', vowels: [{mark:'\u05b5',name:'Tzere',sound:'eh'},{mark:'\u05b4',name:'Cherek',sound:'ee'},{mark:'\u05b9',name:'Cholem',sound:'oh'}] }
];
lessons.push({ vowels: [...lessons[1].vowels, ...lessons[2].vowels] });
lessons.push({ vowels: [
  {mark:'\u05b0',name:'Sheva',sound:'silent / short eh'},
  {mark:'\u05bb',name:'Qibbutz',sound:'oo'},
  {text:'או\u05bc',name:'Shuruq',sound:'oo'},
  {text:'או\u05b9',name:'Cholem vav',sound:'oh'}
] });
lessons.push({ vowels: [...lessons[3].vowels, ...lessons[4].vowels] });
lessons.push({ letter:'ב\u05bc', name:'Bet' });
lessons.push({ letter:'ב\u05bc', name:'Bet', vowels: [...lessons[5].vowels] });
for(const [letter,name] of [['ג','Gimel'],['ד','Dalet'],['ה','Heh']]){
  lessons.push({letter,name});
  lessons.push({letter,name,vowels:[...lessons[5].vowels]});
}
lessons.push({words:true,vowels:[...lessons[5].vowels]});
const practiceLetters=['א','ב\u05bc','ג','ד','ה'];
function withVowel(letter,vowel){return letter+(vowel.text ? vowel.text.slice(1) : vowel.mark);}
let current = 0;
function shuffledVowels(vowels, count=25) {
  // Distribute all lesson vowels evenly, then use a Fisher–Yates shuffle.
  const cells = Array.from({length:count}, (_, i) => vowels[i % vowels.length]);
  for(let i=cells.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[cells[i],cells[j]]=[cells[j],cells[i]];}
  return cells;
}
function render(index) {
  current=index;
  const lesson=lessons[index];
  const baseLetter=lesson.letter ?? 'א';
  const letterName=lesson.name ?? 'Aleph';
  const vowelGlyph=vowel=>vowel.text ? baseLetter+vowel.text.slice(1) : baseLetter+vowel.mark;
  document.getElementById('lessons').value=String(index);
  document.getElementById('shuffle').hidden=!lesson.vowels;
  const practice=document.getElementById('practice');
  const legend=document.getElementById('legend');
  practice.replaceChildren();legend.replaceChildren();
  if(!lesson.vowels){
    const wrapper=document.createElement('div');
    const aleph=document.createElement('span');aleph.className='big-aleph';aleph.lang='he';aleph.textContent=baseLetter;aleph.setAttribute('aria-label',letterName);
    const caption=document.createElement('div');caption.className='letter-caption';caption.textContent=letterName.toUpperCase()+' / '+baseLetter;
    wrapper.append(aleph,caption);practice.append(wrapper);
  }else{
    const grid=document.createElement('div');grid.className=lesson.words ? 'grid word-grid' : 'grid';grid.lang='he';grid.dir='rtl';
    const vowels=shuffledVowels(lesson.vowels);
    const secondVowels=lesson.words ? shuffledVowels(lesson.vowels) : [];
    const letters=lesson.words ? shuffledVowels(practiceLetters,50) : [];
    for(const [position,vowel] of vowels.entries()){
      const cell=document.createElement('span');cell.className='glyph';
      const letter=document.createElement('span');letter.className='numbered-letter';letter.textContent=vowelGlyph(vowel);letter.setAttribute('aria-label',`${letterName} with ${vowel.name}, ${vowel.sound}`);
      if(lesson.words){
        const first=letters[position*2],second=letters[position*2+1];
        letter.textContent=withVowel(first,vowel)+withVowel(second,secondVowels[position]);
        letter.setAttribute('aria-label',`Two-letter combination: ${letter.textContent}`);
      }
      if(position%5===0){
        const number=document.createElement('span');number.className='line-number';number.lang='en';number.dir='ltr';number.textContent=String(position/5+1)+'.';number.setAttribute('aria-label',`Line ${position/5+1}`);letter.append(number);
      }
      cell.append(letter);grid.append(cell);
    }
    practice.append(grid);
    for(const vowel of lesson.vowels){
      const item=document.createElement('div');item.className='legend-item';
      const glyph=document.createElement('span');glyph.className='legend-glyph';glyph.lang='he';glyph.textContent=vowelGlyph(vowel);
      const label=document.createElement('span');label.textContent=`${vowel.name} · ${vowel.sound}`;item.append(glyph,label);legend.append(item);
    }
  }
}
document.getElementById('lessons').addEventListener('change',event=>render(Number(event.target.value)));
document.getElementById('shuffle').addEventListener('click',()=>{render(current);document.getElementById('announcement').textContent='New randomized practice grid ready.';});
render(0);
