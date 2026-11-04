(() => {
'use strict';
const data=window.NVX,$=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const motionQuery=matchMedia('(prefers-reduced-motion: reduce)');
const num=n=>String(n+1).padStart(2,'0');
let reduced=motionQuery.matches,lenis=null,heroST=null,filmST=null,sceneIndex=0,filmIndex=0,heroVisible=true;
let cinematicOn=!reduced&&!navigator.connection?.saveData;
let modalFocus=null,sceneProgress=0;
const cinematicLayers=[];
const hero=$('.hero-stage'),filmDialog=$('.film-dialog'),creditsDialog=$('.credits-dialog');
$('.year').textContent=new Date().getFullYear();
$('.manifesto').textContent=data.about;
$$('.discord-link').forEach(a=>{a.href=data.brand.discord;a.target='_blank';a.rel='noopener noreferrer'});
data.scenes.forEach((s,i)=>{
 const poster=document.createElement('div');poster.className='scene-poster';poster.style.opacity=i?0:1;poster.style.backgroundImage=`url("${s.poster}")`;
 const video=document.createElement('video');video.className='scene-video';video.muted=true;video.loop=true;video.playsInline=true;video.preload='none';video.tabIndex=-1;video.setAttribute('aria-hidden','true');video.dataset.src=s.video;
 video.addEventListener('playing',()=>{video.classList.add('ready');if(!canPlayBackground()||Number(poster.style.opacity)===0)video.pause()});
 video.addEventListener('error',()=>{video.classList.remove('ready');video.dataset.failed='true'});
 poster.append(video);$('.scene-posters').append(poster);cinematicLayers.push({poster,video});
 const btn=document.createElement('button');btn.className='scene-select';btn.setAttribute('aria-label','Cinematic '+s.agent);btn.setAttribute('aria-pressed',String(!i));btn.innerHTML=`<small>${num(i)}</small>${s.agent}`;btn.addEventListener('click',()=>goScene(i));$('.scene-nav').append(btn);
});
data.members.forEach((m,i)=>{
 const card=document.createElement('article');card.className='member-card';
 card.innerHTML=`<button class="member-button" data-film="${m.film}" data-member="${i}" aria-label="Tonton cinematic ${m.agent}, pilihan ${m.name}"><div class="member-visual"><img class="member-art" src="assets/${m.agent.toLowerCase()}.webp" alt="Artwork resmi ${m.agent}" loading="lazy" decoding="async" width="2400" height="831"><div class="member-top"><span>NVX / ${num(i)}</span><span>+</span></div><div class="member-agent"><small>${m.type}</small><strong>${m.agent}</strong></div><span class="member-play" aria-hidden="true">▶</span></div><div class="member-info"><div><small>${m.role}</small><h3>${m.name}</h3></div><span>WATCH CINEMATIC ↗</span></div></button><div class="member-motto"><span>${m.motto}</span><span>NVX / ${num(i)}</span></div>`;
 $('.roster-grid').append(card);
});
data.featured.forEach((key,i)=>{
 const f=data.films[key],card=document.createElement('article');card.className='film-card';
 card.innerHTML=`<button class="film-poster-button" data-film="${key}" aria-label="Tonton ${f.title}"><img src="${f.poster}" alt="" width="480" height="360" loading="lazy" decoding="async"><span class="film-code">NVX SCREENING / ${num(i)}</span><span class="film-play" aria-hidden="true">▶</span><span class="film-caption">OFFICIAL VALORANT CINEMATIC</span></button><div class="film-card-info"><h3>${f.title}</h3><span>${f.subtitle}</span></div>`;
 $('.film-track').append(card);
});
Object.values(data.films).forEach(f=>{const a=document.createElement('a');a.href='https://www.youtube.com/watch?v='+f.id;a.target='_blank';a.rel='noopener noreferrer';a.textContent=f.title+' ↗';$('.credits-links').append(a)});
const artLink=document.createElement('a');artLink.href='https://playvalorant.com/en-us/agents/';artLink.target='_blank';artLink.rel='noopener noreferrer';artLink.textContent='Official agent artwork ↗';$('.credits-links').append(artLink);
$('.preloader').addEventListener('animationend',e=>{if(e.animationName==='loader-exit')$('.preloader')?.remove()});
if(reduced){$('.preloader')?.remove()}else{const loadStart=performance.now();function load(t){const el=$('.load-count');if(!el)return;const p=Math.min(1,(t-loadStart)/1000);el.textContent=String(Math.round(p*100)).padStart(3,'0');if(p<1)requestAnimationFrame(load)}requestAnimationFrame(load)}
function closeMenu(){ $('.menu-toggle').setAttribute('aria-expanded','false');$('#mobile-menu').hidden=true;$('.menu-toggle').setAttribute('aria-label','Buka menu') }
$('.menu-toggle').addEventListener('click',()=>{const open=$('#mobile-menu').hidden;$('#mobile-menu').hidden=!open;$('.menu-toggle').setAttribute('aria-expanded',String(open));$('.menu-toggle').setAttribute('aria-label',open?'Tutup menu':'Buka menu')});
$$('#mobile-menu a').forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('#mobile-menu').hidden){closeMenu();$('.menu-toggle').focus()}});
addEventListener('resize',()=>{if(innerWidth>760)closeMenu()});
$$('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const target=document.querySelector(a.getAttribute('href'));if(!target)return;e.preventDefault();closeMenu();if(lenis)lenis.scrollTo(target,{offset:target.id==='top'?0:-75});else target.scrollIntoView({behavior:reduced?'instant':'smooth'})}));
function scrollToPosition(y){if(lenis)lenis.scrollTo(y,{duration:1.15});else window.scrollTo({top:y,behavior:reduced?'instant':'smooth'})}
function goScene(i){if(heroST&&!reduced){scrollToPosition(heroST.start+(heroST.end-heroST.start)*((i+.08)/4))}else setScene(i)}
function setScene(i){
 i=Math.max(0,Math.min(3,i));sceneIndex=i;const s=data.scenes[i];
 $$('.scene-select').forEach((b,n)=>b.setAttribute('aria-pressed',String(n===i)));
 $('.scene-number').textContent=num(i)+' / 04';$('.scene-agent').textContent=s.agent;
 $('.scene-role').textContent=s.role+' / '+s.member;$('.scene-quote').textContent=s.quote;
 $('.hero-trailer').dataset.film=s.film;
 if(!heroST||reduced)blendScenes(i/4);
}
function canPlayBackground(){return cinematicOn&&!reduced&&heroVisible&&!document.hidden&&!filmDialog.open&&!creditsDialog.open}
function updateCinemaButton(){
 $('.cinematic-toggle').setAttribute('aria-pressed',String(cinematicOn));
 $('.cinema-icon').textContent=cinematicOn?'Ⅱ':'▷';
 $('.cinema-label').textContent=cinematicOn?'CINEMATIC ON':'CINEMATIC OFF';
 $('.cinematic-toggle').setAttribute('aria-label',cinematicOn?'Jeda cinematic background':'Aktifkan cinematic background');
}
function blendScenes(progress){
 sceneProgress=progress;const pos=Math.min(3.99999,progress*4),base=Math.floor(pos),mix=Math.max(0,Math.min(1,(pos-base-.78)/.22));
 cinematicLayers.forEach(({poster},i)=>{poster.style.opacity=i===base?'1':i===base+1?String(mix):'0'});
 syncBackground();
}
function syncBackground(){
 cinematicLayers.forEach(({poster,video})=>{
  const active=canPlayBackground()&&Number(poster.style.opacity)>0;
  if(active){
   if(!video.getAttribute('src'))video.src=video.dataset.src;
   if(video.paused&&!video.dataset.failed&&!video.dataset.pending){video.dataset.pending='true';video.play().catch(()=>{video.classList.remove('ready')}).finally(()=>{delete video.dataset.pending})}
  }else if(!video.paused)video.pause();
 });
}
function pauseBackground(){cinematicLayers.forEach(({video})=>video.pause())}
function startBackground(){syncBackground()}
$('.cinematic-toggle').addEventListener('click',()=>{
 if(reduced){openFilm(data.scenes[sceneIndex].film,$('.cinematic-toggle'));return}
 cinematicOn=!cinematicOn;updateCinemaButton();syncBackground();
});
updateCinemaButton();
const heroObserver=new IntersectionObserver(entries=>{heroVisible=entries[0].isIntersecting;syncBackground()},{threshold:.05});heroObserver.observe(hero);
function lockPage(){document.body.classList.add('modal-open');lenis?.stop();pauseBackground()}
function unlockPage(){document.body.classList.remove('modal-open');lenis?.start();if(cinematicOn&&heroVisible)startBackground();modalFocus?.focus({preventScroll:true})}
function openFilm(key,trigger,memberIndex){
 const f=data.films[key];if(!f)return;
 if(!f.preview||(memberIndex!==undefined&&data.members[memberIndex].agent==='CYPHER')){window.open('https://www.youtube.com/watch?v='+f.id,'_blank','noopener,noreferrer');return}
 modalFocus=trigger;const m=memberIndex!==undefined?data.members[memberIndex]:null;
 $('#film-dialog-title').textContent=f.title;$('.dialog-member').textContent=m?`${m.name} / ${m.agent} / ${m.role}`:'NVX FILM SELECTION';
 $('.dialog-description').textContent=f.subtitle+' — Cinematic preview / Riot Games';
 $('.youtube-link').href='https://www.youtube.com/watch?v='+f.id;
 const video=document.createElement('video');video.src=f.preview;video.poster=f.poster;video.controls=true;video.playsInline=true;video.preload='metadata';video.setAttribute('aria-label',f.title+' — cinematic preview');
 $('.dialog-media').replaceChildren(video);filmDialog.showModal();lockPage();video.play().catch(()=>{});
}
document.addEventListener('click',e=>{const b=e.target.closest('[data-film]');if(b)openFilm(b.dataset.film,b,b.hasAttribute('data-member')?Number(b.dataset.member):undefined)});
$('.dialog-close').addEventListener('click',()=>filmDialog.close());
filmDialog.addEventListener('close',()=>{$('.dialog-media video')?.pause();$('.dialog-media').replaceChildren();unlockPage()});
$('.credits-trigger').addEventListener('click',e=>{modalFocus=e.currentTarget;creditsDialog.showModal();lockPage()});
$('.credits-close').addEventListener('click',()=>creditsDialog.close());creditsDialog.addEventListener('close',unlockPage);
[filmDialog,creditsDialog].forEach(d=>d.addEventListener('click',e=>{if(e.target!==d)return;const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close()}));
document.addEventListener('visibilitychange',()=>{if(document.hidden)pauseBackground();else if(heroVisible&&cinematicOn)startBackground()});

// Every main visual transition is a reversible function of scroll position.
const words=data.about.split(' ');$('.manifesto').innerHTML=words.map(w=>'<span class="word">'+w+'</span>').join(' ');
function filmPosition(i){filmIndex=Math.max(0,Math.min(data.featured.length-1,i));$('.film-count').textContent=num(filmIndex)+' / '+String(data.featured.length).padStart(2,'0');$('.film-prev').disabled=filmIndex===0;$('.film-next').disabled=filmIndex===data.featured.length-1}
function moveFilm(delta){
 const target=Math.max(0,Math.min(data.featured.length-1,filmIndex+delta));
 if(filmST&&!reduced)scrollToPosition(filmST.start+(filmST.end-filmST.start)*target/5);
 else{$('.film-window').scrollTo({left:target*($('.film-card').offsetWidth+parseFloat(getComputedStyle($('.film-track')).gap)),behavior:reduced?'instant':'smooth'});filmPosition(target)}
}
$('.film-prev').addEventListener('click',()=>moveFilm(-1));$('.film-next').addEventListener('click',()=>moveFilm(1));filmPosition(0);
$('.film-window').addEventListener('scroll',()=>{if(!filmST)filmPosition(Math.round($('.film-window').scrollLeft/($('.film-card').offsetWidth+parseFloat(getComputedStyle($('.film-track')).gap))))},{passive:true});
if(window.gsap&&window.ScrollTrigger){
 gsap.registerPlugin(ScrollTrigger);ScrollTrigger.config({ignoreMobileResize:true});
 const mm=gsap.matchMedia();
 mm.add('(prefers-reduced-motion: no-preference)',()=>{
  reduced=false;
  if(window.Lenis){lenis=new Lenis({duration:.9,smoothWheel:true});lenis.on('scroll',ScrollTrigger.update);var ticker=time=>lenis?.raf(time*1000);gsap.ticker.add(ticker);gsap.ticker.lagSmoothing(0)}
  const heroTl=gsap.timeline({scrollTrigger:{trigger:'.hero',start:'top top',end:()=>'+='+Math.max(1300,innerHeight*2.25),pin:'.hero-stage',scrub:true,invalidateOnRefresh:true,onUpdate:self=>{
   const p=Math.min(.999999,self.progress);setScene(Math.floor(p*4));blendScenes(p);$$('.scene-select').forEach((b,i)=>b.style.setProperty('--scene-progress',String(Math.max(0,Math.min(1,p*4-i)))));
  }}});
  heroTl.to('.hero-outline',{xPercent:-30,rotation:-8,opacity:.3,ease:'none'},0).to('.hero-grid',{yPercent:15,ease:'none'},0).to('.hero-title',{letterSpacing:'-.045em',ease:'none'},0);
  heroST=heroTl.scrollTrigger;
  gsap.to('.ticker-track',{xPercent:-26,ease:'none',scrollTrigger:{trigger:'.ticker',start:'top bottom',end:'bottom top',scrub:true}});
  gsap.fromTo('.manifesto .word',{opacity:.2},{opacity:1,stagger:.07,ease:'none',scrollTrigger:{trigger:'.manifesto',start:'top 85%',end:'bottom 45%',scrub:true}});
  $$('.reveal-heading').forEach(el=>gsap.fromTo(el,{y:40,opacity:.25},{y:0,opacity:1,ease:'none',scrollTrigger:{trigger:el,start:'top 95%',end:'top 53%',scrub:true}}));
  $$('.member-card').forEach(el=>gsap.fromTo(el,{y:55,opacity:.25},{y:0,opacity:1,ease:'none',scrollTrigger:{trigger:el,start:'top 98%',end:'top 60%',scrub:true}}));
  gsap.from('.signature-line',{scaleX:0,ease:'none',scrollTrigger:{trigger:'.about-signoff',start:'top 90%',end:'top 50%',scrub:true}});
  const track=$('.film-track');
  const filmTween=gsap.to(track,{x:()=>-Math.max(0,track.scrollWidth-$('.film-window').clientWidth),ease:'none',scrollTrigger:{trigger:'.films',start:'top top',end:()=>'+='+Math.max(1600,track.scrollWidth-innerWidth),pin:'.films-stage',scrub:true,invalidateOnRefresh:true,onUpdate:self=>filmPosition(Math.round(self.progress*5))}});
  filmST=filmTween.scrollTrigger;
  gsap.to('.contact-art',{yPercent:12,scale:1.08,ease:'none',scrollTrigger:{trigger:'.contact',start:'top bottom',end:'bottom top',scrub:true}});
  document.fonts.ready.then(()=>ScrollTrigger.refresh());
  return()=>{if(ticker)gsap.ticker.remove(ticker);lenis?.destroy();lenis=null;heroST=null;filmST=null};
 });
}else{document.documentElement.classList.add('motion-fallback')}
motionQuery.addEventListener('change',e=>{reduced=e.matches;if(reduced){cinematicOn=false;pauseBackground();updateCinemaButton()}});
const fine=matchMedia('(pointer:fine) and (min-width:761px)');
if(fine.matches){
 let pointerFrame=0,px=0,py=0;
 addEventListener('pointermove',e=>{px=e.clientX;py=e.clientY;if(pointerFrame||reduced)return;pointerFrame=requestAnimationFrame(()=>{pointerFrame=0;$('.cursor').style.display='flex';$('.cursor').style.transform=`translate3d(${px}px,${py}px,0)`})},{passive:true});
 document.addEventListener('pointerover',e=>$('.cursor').classList.toggle('hover',!!e.target.closest('a,button')));
 document.addEventListener('pointerout',e=>{if(!e.relatedTarget)$('.cursor').style.display='none'});
}

// Sound is opt-in, quiet, synthesized locally, and suspended while films are open.
let soundOn=false,ctx=null,soundTick=0,soundY=scrollY;
const soundBtn=$('.sound-toggle');
function tone(freq=650,time=.04,volume=.022){
 if(!soundOn||!ctx||ctx.state!=='running'||document.hidden||filmDialog.open||creditsDialog.open)return;
 const now=ctx.currentTime,osc=ctx.createOscillator(),g=ctx.createGain();osc.type='sine';osc.frequency.setValueAtTime(freq,now);osc.frequency.exponentialRampToValueAtTime(freq*.5,now+time);g.gain.setValueAtTime(.0001,now);g.gain.exponentialRampToValueAtTime(volume,now+.004);g.gain.exponentialRampToValueAtTime(.0001,now+time);osc.connect(g);g.connect(ctx.destination);osc.start();osc.stop(now+time+.01);osc.onended=()=>{osc.disconnect();g.disconnect()};
}
soundBtn.addEventListener('click',async()=>{
 soundOn=!soundOn;if(soundOn){try{ctx ||=new (window.AudioContext||window.webkitAudioContext)();await ctx.resume()}catch{soundOn=false}}
 soundBtn.setAttribute('aria-pressed',String(soundOn));soundBtn.setAttribute('aria-label',soundOn?'Matikan efek suara':'Aktifkan efek suara');$('.sound-label').textContent=soundOn?'SOUND ON':'SOUND OFF';if(soundOn)tone(880,.07,.03);
});
document.addEventListener('click',e=>{if(e.target.closest('a,button')&&!e.target.closest('.sound-toggle'))tone()});
let scrollFrame=0;
function scrollUI(){
 scrollFrame=0;const total=document.documentElement.scrollHeight-innerHeight;
 $('.page-progress i').style.transform='scaleX('+(total>0?Math.min(1,scrollY/total):0)+')';
 if(soundOn&&!reduced&&Math.abs(scrollY-soundY)>300&&performance.now()-soundTick>280){tone(scrollY>soundY?320:430,.025,.006);soundTick=performance.now();soundY=scrollY}else if(!soundOn)soundY=scrollY;
}
addEventListener('scroll',()=>{if(!scrollFrame)scrollFrame=requestAnimationFrame(scrollUI)},{passive:true});scrollUI();
const labels={hero:'THE ARRIVAL',about:'THE VISION',roster:'THE ROSTER',films:'THE FILMS',contact:'THE NEXT ROUND'};
const locationObserver=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){$('.location-label').textContent=labels[e.target.id]||'NOVANTX';$$('.desktop-nav a').forEach(a=>{if(a.getAttribute('href')==='#'+e.target.id)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current')})}}),{rootMargin:'-10% 0px -60% 0px'});$$('main > section').forEach(el=>locationObserver.observe(el));
})();


