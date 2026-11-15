// Opening screen: plays once per visit, then rolls up
(function(){
  const intro=document.getElementById('intro'), body=document.body;
  if(!intro) return;
  let seen=false; try{seen=sessionStorage.getItem('zsIntro')==='1'}catch(e){}
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(seen||reduce){intro.remove();body.classList.remove('intro-on');return;}
  try{sessionStorage.setItem('zsIntro','1')}catch(e){}
  setTimeout(()=>{intro.classList.add('up');body.classList.remove('intro-on');},2900);
  intro.addEventListener('transitionend',()=>intro.remove());
  intro.addEventListener('click',()=>{intro.classList.add('up');body.classList.remove('intro-on');});
})();
// ---- EDIT ME ----
const ENQUIRY_EMAIL = "hello@zoesmithleather.co.uk";   // Zoe's real email
const FACEBOOK_URL  = "https://www.facebook.com/";      // Zoe's Facebook page link
// -----------------

document.getElementById('yr').textContent = new Date().getFullYear();
document.getElementById('fbLink').href = FACEBOOK_URL;


const nav = document.getElementById('nav'), btn = document.getElementById('menuBtn');
btn.addEventListener('click', () => { const o = nav.classList.toggle('open'); btn.setAttribute('aria-expanded', o); });
document.querySelectorAll('.drawer a').forEach(a => a.addEventListener('click', () => { nav.classList.remove('open'); btn.setAttribute('aria-expanded', false); }));

// Gallery
const mainImg = document.getElementById('mainImg');
if (mainImg)
document.querySelectorAll('.thumbs button').forEach(b => b.addEventListener('click', () => {
  document.querySelectorAll('.thumbs button').forEach(x => x.setAttribute('aria-current', 'false'));
  b.setAttribute('aria-current', 'true');
  mainImg.style.opacity = 0;
  setTimeout(() => { mainImg.src = b.dataset.src; mainImg.alt = b.dataset.alt; mainImg.style.opacity = 1; }, 250);
}));

// Pre-select the form option from buttons like "Begin a commission"
document.querySelectorAll('[data-interest]').forEach(a => a.addEventListener('click', () => {
  const sel = document.getElementById('interest'); if (sel) sel.value = a.dataset.interest;
}));

// Reveal on scroll
const io = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return;
  e.target.classList.add('in');
  io.unobserve(e.target);
}), {threshold:.15});
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// Enquiry form: opens the visitor's email app with the enquiry filled in
const form = document.getElementById('enquiryForm');
if (form) form.addEventListener('submit', e => {
  e.preventDefault();
  const f = e.target;
  if (!f.name.value.trim()) return f.name.focus();
  if (!/\S+@\S+\.\S+/.test(f.email.value)) return f.email.focus();
  const body = `Name: ${f.name.value}\nEmail: ${f.email.value}\nTelephone: ${f.phone.value}\nInterested in: ${f.interest.value}\n\n${f.message.value}`;
  location.href = `mailto:${ENQUIRY_EMAIL}?subject=${encodeURIComponent('Enquiry: ' + f.interest.value)}&body=${encodeURIComponent(body)}`;
  document.getElementById('thanks').style.display = 'block';
});
