const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const embedded = (()=>{try{return window.self!==window.top}catch(e){return true}})();
function onReady(fn){let done=false;const go=()=>{if(done)return;done=true;fn()};
  if(document.readyState==='complete')go();else addEventListener('load',go,{once:true});
  setTimeout(go,900)}
// preloader
onReady(()=>{const p=document.getElementById('pre');if(!p)return;
  const kill=()=>{p.classList.add('done');p.style.display='none'};
  if(reduce||embedded||document.visibilityState!=='visible'){kill();return}
  setTimeout(()=>{p.classList.add('done');setTimeout(kill,900)},180)});
// header
const hdr=document.getElementById('hdr');
if(hdr)addEventListener('scroll',()=>hdr.classList.toggle('scrolled',scrollY>40));
// mobile nav: toggle + focus trap
(function(){
  const btn=document.getElementById('menuBtn'),nav=document.getElementById('nav');
  if(!btn||!nav)return;
  function close(){nav.classList.remove('open');btn.setAttribute('aria-expanded','false')}
  function open(){nav.classList.add('open');btn.setAttribute('aria-expanded','true');const f=nav.querySelector('a');if(f)f.focus()}
  btn.addEventListener('click',()=>nav.classList.contains('open')?close():open());
  document.addEventListener('keydown',e=>{
    if(e.key==='Escape'&&nav.classList.contains('open')){close();btn.focus();return}
    if(e.key==='Tab'&&nav.classList.contains('open')){
      const items=[...nav.querySelectorAll('a')];const first=items[0],last=items[items.length-1];
      if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}
      else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}
    }
  });
  document.addEventListener('click',e=>{if(nav.classList.contains('open')&&!nav.contains(e.target)&&e.target!==btn)close()});
})();
// hero embers (home page only)
(function(){
  const cv=document.getElementById('embers');if(!cv||reduce)return;const ctx=cv.getContext('2d');let W,H,P=[];
  function rs(){W=cv.width=cv.offsetWidth;H=cv.height=cv.offsetHeight}
  function mk(){return{x:Math.random()*W,y:H+Math.random()*H*.4,r:Math.random()*2+.5,s:Math.random()*.5+.15,a:Math.random()*.5+.2,d:Math.random()*.5-.25}}
  rs();addEventListener('resize',rs);for(let i=0;i<60;i++)P.push(mk());
  (function draw(){ctx.clearRect(0,0,W,H);for(const p of P){p.y-=p.s;p.x+=p.d;p.a-=.0011;if(p.y<-10||p.a<=0){Object.assign(p,mk())}
    ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,6.283);ctx.fillStyle=`rgba(232,178,110,${p.a})`;ctx.shadowBlur=8;ctx.shadowColor='rgba(232,162,74,.6)';ctx.fill()}
    requestAnimationFrame(draw)})();
})();
// animated wave (home page only)
addEventListener('DOMContentLoaded',()=>{
  const path=document.getElementById('wavePath');
  if(path&&!reduce){let t=0;(function a(){t+=.03;let d='M0 30';for(let x=0;x<=540;x+=18){const y=30+Math.sin(x*0.028+t)*11*Math.sin(t*0.5+x*0.005);d+=` L ${x} ${y.toFixed(1)}`}path.setAttribute('d',d);requestAnimationFrame(a)})()}
});
// pause other videos
document.querySelectorAll('video').forEach(v=>v.addEventListener('play',()=>document.querySelectorAll('video').forEach(o=>{if(o!==v)o.pause()})));
// Reveal everything with no animation. Safe to call twice.
function revealAll(){
  document.querySelectorAll('.reveal').forEach(e=>{e.style.opacity=1;e.style.transform='none'});
  document.querySelectorAll('.hero h1 .ln span').forEach(s=>s.style.transform='none');
  document.querySelectorAll('.split .imgclip').forEach(c=>{c.style.clipPath='none'});
  ['#heroEyebrow','#heroLede','#heroActions','#waveSvg'].forEach(s=>{const e=document.querySelector(s);if(e)e.style.opacity=1});
}
const failsafe=setTimeout(revealAll,2200);
// Lenis + GSAP (deferred scripts)
function boot(skipIntro){
  let lenis;
  if(window.Lenis&&!reduce&&!embedded){lenis=new Lenis({lerp:.09,wheelMultiplier:.9});function raf(t){lenis.raf(t);requestAnimationFrame(raf)}requestAnimationFrame(raf);
    document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const t=document.querySelector(a.getAttribute('href'));if(t){e.preventDefault();lenis.scrollTo(t,{offset:-60})}}))}
  if(window.gsap&&!reduce){
    window.__introStarted=true;
    clearTimeout(failsafe);
    gsap.registerPlugin(ScrollTrigger);
    if(lenis)lenis.on('scroll',ScrollTrigger.update);
    if(!skipIntro&&document.getElementById('hero')){
      const tl=gsap.timeline({delay:embedded?.1:.25});
      tl.to('#heroEyebrow',{opacity:1,y:0,duration:.8,ease:'power2.out'})
        .to('.hero h1 .ln span',{yPercent:0,duration:1,ease:'power4.out',stagger:.12},'-=.4')
        .to('#waveSvg',{opacity:1,duration:.8},'-=.4')
        .to('#heroLede',{opacity:1,y:0,duration:.8},'-=.5')
        .to('#heroActions',{opacity:1,y:0,duration:.8},'-=.5');
      gsap.fromTo('#heroBg',{scale:1.14},{scale:1,duration:2.6,ease:'power2.out'});
    }
    if(document.getElementById('hero')){
      gsap.to('#heroBg',{yPercent:18,ease:'none',scrollTrigger:{trigger:'#hero',start:'top top',end:'bottom top',scrub:true}});
      gsap.to('#embers',{opacity:0,ease:'none',scrollTrigger:{trigger:'#hero',start:'center top',end:'bottom top',scrub:true}});
    }
    // media clip reveals + parallax on every split image
    gsap.utils.toArray('.split .imgclip img').forEach(img=>{
      gsap.fromTo(img,{scale:1.3},{scale:1.05,ease:'none',scrollTrigger:{trigger:img.closest('section'),start:'top bottom',end:'bottom top',scrub:true}});
    });
    gsap.utils.toArray('.split .imgclip').forEach(clip=>{
      gsap.fromTo(clip,{clipPath:'inset(100% 0 0 0)'},{clipPath:'inset(0% 0 0 0)',duration:1.2,ease:'power3.out',scrollTrigger:{trigger:clip,start:'top 82%'}});
    });
    // pinned gong scale
    if(document.getElementById('gong')){
      gsap.to('#bandBg',{scale:1.18,ease:'none',scrollTrigger:{trigger:'#gong',start:'top bottom',end:'bottom top',scrub:true}});
      gsap.fromTo('.band .inner',{opacity:0,scale:.94},{opacity:1,scale:1,ease:'power2.out',scrollTrigger:{trigger:'#gong',start:'top 60%'}});
    }
    gsap.utils.toArray('.reveal').forEach(el=>gsap.to(el,{opacity:1,y:0,duration:1,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 88%'}}));
  }else{clearTimeout(failsafe);revealAll();}
}
onReady(()=>{
  if(document.visibilityState==='visible'){boot(false);return}
  clearTimeout(failsafe);
  revealAll();
  document.addEventListener('visibilitychange',function once(){
    if(document.visibilityState!=='visible')return;
    document.removeEventListener('visibilitychange',once);
    boot(true);
  });
});
