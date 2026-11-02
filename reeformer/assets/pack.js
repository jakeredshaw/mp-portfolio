/* reef founder funnel: personalised product page (PDP) renderer.
   Retail layout: gallery + buy box, pack selector, add to bag (drawer upsell), trust row, accordions,
   then long form personalised selling sections and "you may also like". */
(function () {
  const R = REEF, C = REEF_CONTENT, CFG = REEF_CONFIG;
  const packId = document.body.dataset.pack, P = C.packs[packId];
  const s = R.fromUrl(), a = s.answers || {};
  const personal = !!a.goal, n = R.first(a), N = n ? R.esc(n) : "";
  const prof = C.profiles[a.goal] || null;
  const pname = personal ? C.profileName(a) : "";
  const rec = personal ? R.recommend(a) : null;
  const matched = rec && rec.pack === packId;
  const q = location.search;
  R.header({ ribbon: `Founder pricing ends the day we open · <b>${R.placesShort(packId)}</b>` });
  R.track("ViewContent", { content_name: P.name, value: P.price, currency: "GBP" });

  const headlines = {
    strength: "{N}this is how you get properly strong again.",
    posture: a.day === "desk" ? "{N}this is how you undo the desk body." : "{N}this is how you stand taller and leave the ache behind.",
    shape: "{N}this is how you feel amazing in your body again.",
    calm: "{N}this is your hour back. Every single week.",
    resilient: "{N}this is how you keep moving without the twinges.",
    comeback: "{N}this is how you feel like you again. Only stronger."
  };
  const H = (t) => t.replace("{N}", N ? N + ", " : "").replace(/^./, c => c.toUpperCase());
  const sec = [];

  /* ================= PDP: gallery + buy box ================= */
  const slides = [R.vsl(packId), ...P.imgs.map(i => R.img(i)), R.img("illo-40s", "illo", false)];
  const brandTile = `<div class="img" style="background:var(--deep);display:grid;place-items:center"><div class="center" style="color:#F3E2C2;padding:20px"><img src="assets/logo/reef-mark-shell.png" alt="" width="110" height="115" style="margin:0 auto 18px;opacity:.95"><div class="caps" style="color:#fff">${P.name}</div><div style="font-family:var(--serif);font-size:30px;color:var(--gold-soft);margin-top:6px">${R.money(P.price)}</div><div class="small" style="margin-top:4px">${P.classes} Reformer classes</div></div></div>`;
  slides.push(brandTile);
  const variants = C.order.slice().reverse().map(id => { const X = C.packs[id]; return `<a class="vr ${id === packId ? "on" : ""}" href="${X.file}${q}" aria-label="${X.name}">${id === "year" ? `<span class="vr-best">Best value</span>` : ""}<b>${R.money(X.perClass)}</b><span>a session</span><em>${X.classes} sessions</em></a>`; }).join("");
  const keyPoints = P.stack.slice(0, 4).map(r => `<li>${r[0]}</li>`).join("");
  const reasons = personal ? R.reasons(a, packId).slice(0, 2) : [];

  const accordions = [
    ["What's included", `<table class="stack">${P.stack.map(r => `<tr><td>${r[0]}</td><td>${r[1] ? R.money(r[1]) : `<span class="muted small">Included</span>`}</td></tr>`).join("")}<tr><td><b>At prices from opening day</b></td><td><s>${R.money(P.value)}</s></td></tr><tr><td><b>Your founder price</b></td><td><b>${R.money(P.price)}</b></td></tr></table><p class="small muted" style="margin-top:10px">${P.validity}.</p>`],
    ["How it works", `<p>Book instructor led classes on the timetable, or step on any free bed for a guided session on your own screen. Every move has an easier version and a harder one, and your first class is with an instructor who sets your springs and footbar for you.</p><p>Open 7am to 10pm. Sessions are about 50 minutes.</p>`],
    ["Your first twelve weeks", C.weeks.map(w => `<p><b>${w[0]}: ${w[1]}.</b> ${w[2]}</p>`).join("")],
    ["The studio and parking", `<p>55 to 57 Wyle Cop, Shrewsbury. Coffee bar, lounge, changing rooms, ten or more Reformer beds, red light, recovery boots and hyperbaric on site.</p><p>St Julian's Friars car park is 122 metres away, about a two minute walk, and free after 6pm.</p>`],
    ["Refunds and terms", `<p>Full ${CFG.refundDays} day refund window on online purchases. Credits start on opening day, ${R.esc(CFG.openingDateText)}, so you never lose time to building work.${CFG.longStopDateText ? ` If opening ever slipped past ${R.esc(CFG.longStopDateText)}, you could have a full refund.` : ""}</p><p>Founder prices and places end on opening day and never return.</p>`]
  ];

  sec.push(`<section style="padding-top:0"><div class="pdp">
    <div class="gal"><div class="track" id="track">${slides.map(sl => `<div class="slide">${sl}</div>`).join("")}</div><div class="dots" id="dots">${slides.map((_, i) => `<i class="${i ? "" : "on"}"></i>`).join("")}</div></div>
    <div class="buy"><div class="buyin">
      <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:14px">${matched ? `<span class="badge blue">Matched to you</span>` : ""}<span class="badge">${P.badge}</span><span class="badge foam">Founder price</span></div>
      ${personal ? `<p class="eyebrow" style="margin-bottom:8px">${N ? N + "'s" : "Your"} plan · ${pname}</p>` : ""}
      <h1 style="font-size:clamp(28px,4vw,38px);margin-bottom:6px">${P.name}</h1>
      <p class="muted" style="margin:0 0 12px">${P.tagline}</p>
      ${R.priceBlock(packId)}
      <p class="small" style="margin:0;color:var(--blue);font-weight:700">Reduced from ${R.money(P.value)}. You pay ${R.money(P.save)} less.${P.perClassWellness ? ` Only ${R.money(P.perClassWellness)} a session once your wellness sessions are counted.` : ""}</p>
      ${R.placesHtml(packId)}
      <div class="caps" style="margin:22px 0 10px;color:var(--deep)">Choose your pack: <span style="color:var(--muted)">${P.name}</span></div>
      <div class="vrs">${variants}</div>
      <a class="link" href="index.html?restart=1" style="display:inline-block;margin:12px 0 0;font-size:10.5px">Which pack is right for me? Take the quiz</a>
      <ul class="ticks small" style="margin:18px 0 18px">${keyPoints}</ul>
      <button class="btn btn-gold btn-block js-buy pulse" type="button">Claim my founder place · ${R.money(P.price)}</button>
      <p class="small center" style="margin:8px 0 0;color:var(--muted)">🛡️ Zero risk. Full refund within ${CFG.refundDays} days.</p>
      ${P.call ? `<div style="margin-top:10px">${R.callHtml("Book a 10 minute call with Ricky") || ""}</div>` : ""}
      <div style="margin-top:16px">${R.guarantee(true)}</div>
      ${R.trustRow()}
      ${R.benefitsNow(packId)}
      <div class="pay"><span>VISA</span><span>MASTERCARD</span><span>AMEX</span><span>APPLE PAY</span><span>GOOGLE PAY</span></div>
      ${reasons.length ? `<div class="card" style="margin-top:18px;background:var(--foam);border-color:var(--sky)"><div class="caps" style="color:var(--blue);margin-bottom:8px">Why this fits you${N ? ", " + N : ""}</div><ul class="ticks small" style="margin:0">${reasons.map(r => `<li>${r}</li>`).join("")}</ul></div>` : ""}
      <div style="margin-top:22px">${accordions.map((x, i) => `<details${i === 0 ? " open" : ""}><summary>${x[0]}</summary><div class="dbody">${x[1]}</div></details>`).join("")}</div>
    </div></div>
  </div></section>`);

  sec.push(R.ticker());
  /* ================= personalised editorial ================= */
  sec.push(`<section class="band-sand center"><div class="narrow">
    <p class="eyebrow">${personal ? pname : "Reformer Pilates on Wyle Cop"}</p>
    <h2>${personal ? H(headlines[a.goal]) : P.sub}</h2>
    ${personal ? `<p class="muted">${prof.why}</p>` : `<p class="muted">Want this page built around you? Answer a few quick questions and we'll personalise your plan and your pack.</p><a class="btn btn-ghost" href="index.html?restart=1">Take the 2 minute quiz</a>`}
  </div></section>`);

  if (personal) {
    const bodyTxt = (a.body || []).filter(b => b !== "none").map(b => R.label("body", b).toLowerCase());
    const items = [
      `You want to <b>${R.label("goal", a.goal).toLowerCase()}</b>.`,
      a.exp === "0" ? "You've <b>never done Reformer</b>, which is exactly who we built reef for." : `You've done <b>${R.label("exp", a.exp).toLowerCase()} classes</b>, so you know what it can do.`,
      bodyTxt.length ? `Your body talks to you most in your <b>${bodyTxt.join(" and ")}</b>.` : "Your body feels good, and you want to <b>keep it that way</b>.",
      `Your week is a <b>${a.pace} out of 5</b>${+a.pace >= 4 ? ", and you give a lot of it to other people" : ""}.`,
      a.metime === "cant" ? "You <b>can't remember</b> the last hour that was just for you." : a.metime === "month" ? "Your last hour to yourself was <b>some time this month</b>." : "",
      `You can come <b>${R.label("freq", a.freq).toLowerCase()}</b>.`
    ].filter(Boolean);
    sec.push(`<section><div class="split"><div>${R.img("concept-lounge-pc")}</div><div class="narrow" style="padding:0">
      <p class="eyebrow">What you told us</p><h2>${N ? N + ", here's" : "Here's"} what we heard.</h2>
      <ul class="ticks">${items.map(i => `<li>${i}</li>`).join("")}</ul>
      <p class="muted">That's why ${matched ? "we matched you to" : "you're looking at"} <b>${P.name}</b>.</p></div></div></section>`);
  }

  const bodies = (a.body && a.body.length ? a.body : ["back", "neck"]).slice(0, 3);
  sec.push(`<section class="band-white"><div class="wrap"><div class="narrow center" style="padding:0"><p class="eyebrow">The real problem</p>
    <h2>${personal ? "It isn't your age. It's what your body hasn't been asked to do." : "Most bodies aren't weak. They're under asked."}</h2>
    <p class="muted">${personal && C.dayModules[a.day] ? C.dayModules[a.day] : "Most of us sit too long, rush too much and train in ways we can't keep up. The deep muscles that hold your spine and pelvis quietly switch off, and the creaks start."}</p></div>
    <div class="grid ${bodies.length > 1 ? "g" + Math.min(3, bodies.length) : ""}" style="margin-top:28px">${bodies.map(b => C.bodyModules[b] ? `<div class="card"><h3>${C.bodyModules[b].t}</h3><p style="margin:0" class="muted">${C.bodyModules[b].b}</p></div>` : "").join("")}</div>
  </div></section>`);

  { const F = R.frame(packId);
    sec.push(`<section><div class="narrow"><div class="fact reveal"><b data-count="${F.pct}">${F.pct}%</b><div>Less per session than walking in once we open. That's <b>${F.per}</b> instead of £25, every single time you come.</div></div></div></section>`); }
  sec.push(`<section class="band-deep" style="padding:0"><div class="split flush"><div>${R.img("concept-studio-pc", "", true)}</div><div style="padding:clamp(40px,7vw,80px) 20px">
    <p class="eyebrow" style="color:#F3E2C2">Why Reformer works</p>
    <h2>A bed on rails, a set of springs, and nowhere to hide.</h2>
    <p>You push the carriage out and control it back. Muscles work on the way out and on the way back, so there's no momentum to cheat with. Because the bed moves, your body stabilises itself the entire time.</p>
    <p>The springs can help you or fight you. So total beginners and athletes use the same machine, on different settings.</p>
    <div class="grid" style="margin-top:22px"><div style="border-top:1px solid rgba(255,255,255,.2);padding-top:14px"><div class="caps" style="color:#F3E2C2">The Twice a Week Standard</div><p class="small" style="margin:6px 0 0">The NHS advises strength work on at least two days a week and names Pilates as an example. Twice a week is the dose the trials used.</p></div>
    <div style="border-top:1px solid rgba(255,255,255,.2);padding-top:14px"><div class="caps" style="color:#F3E2C2">The Reeformer Loop</div><p class="small" style="margin:6px 0 0">Learn it with a teacher. Own it on the screen. Come back stronger.</p></div></div>
  </div></div></section>`);

  sec.push(`<section><div class="wrap"><div class="narrow center" style="padding:0"><p class="eyebrow">Your first moves</p><h2>Here's what you'll actually do.</h2><p class="muted">Every move has an easier version and a harder one. Your instructor shows you each one.</p></div><div style="margin-top:22px">${R.moves()}</div></div></section>`);
  const sciKeys = [...new Set([...(prof ? prof.science : ["backPain", "core228", "classpass"]), ...(["60s", "70s"].includes(a.age) ? ["balance"] : []), ...(a.barrier === "gym" ? ["gym"] : [])])].slice(0, 4);
  sec.push(`<section><div class="wrap"><div class="narrow center" style="padding:0"><p class="eyebrow">The evidence</p>
    <h2>We printed the studies. Including the one that disagrees with us.</h2>
    <p class="muted">Every number comes from published research, collected in The Reeformer Pilates Manual.</p></div>
    <div class="grid ${sciKeys.length > 3 ? "g4" : "g3"}" style="margin-top:28px">${sciKeys.map(k => { const x = C.science[k]; return `<div class="card stat"><b data-count="${parseFloat(x[0]) || ""}">${x[0]}</b><span>${x[1]}</span><div class="src" style="margin-top:8px">${x[2]}</div></div>`; }).join("")}</div>
    <p class="small muted center" style="max-width:640px;margin:22px auto 0"><b style="color:var(--deep)">The honest one:</b> Pilates holds bone, it doesn't build it. A meta analysis of 11 studies in women aged 45 to 78 found bone density barely moved. <span class="src">Fernández Rodríguez et al, PLOS ONE, 2021</span></p>
  </div></section>`);

  const extra = [];
  if (a.age && C.decadeModules[a.age]) extra.push(C.decadeModules[a.age]);
  if (a.sex === "m") extra.push(C.menModule);
  if (a.exp && C.expModules[a.exp]) extra.push({ t: a.exp === "0" ? "Brand new to it" : "Your experience", b: C.expModules[a.exp] });
  if (extra.length) sec.push(`<section class="band-foam"><div class="wrap"><div class="narrow center" style="padding:0"><p class="eyebrow" style="color:var(--blue)">Built for you</p><h2>${N ? N + ", here's" : "Here's"} what this means for you.</h2></div>
    ${a.age && C.decadeIllo[a.age] ? `<div style="max-width:760px;margin:22px auto 0">${R.img(C.decadeIllo[a.age], "illo decade-illo", false)}</div>` : ""}
    <div class="grid ${extra.length > 1 ? "g" + Math.min(3, extra.length) : ""}" style="margin-top:26px">${extra.map(x => `<div class="card" style="border-color:var(--sky)"><h3>${x.t}</h3><p class="muted" style="margin:0">${x.b}</p></div>`).join("")}</div></div></section>`);

  if (packId === "member") {
    const rate = CFG.memberMonthlyRate, std = CFG.memberStandardRate;
    sec.push(`<section class="band-white"><div class="narrow center"><p class="eyebrow">The part nobody else can buy</p><h2>Your founder rate, locked for a year.</h2>
      <p class="muted">Three months of membership takes you right through the twelve week window where habits form. Then your founder monthly rate is locked for the next 12 months.</p>
      ${rate ? `<div class="price" style="justify-content:center"><b>${R.money(rate)} a month</b>${std ? `<s>${R.money(std)}</s>` : ""}</div>` : ""}
      <p class="small muted">Once the doors open, this rate is gone for good. 40 places.</p></div></section>`);
  }
  if (packId === "year") {
    sec.push(`<section class="band-white"><div class="narrow"><p class="eyebrow">A letter about your strongest year</p>
      <h2>The one rule about getting fit we were all taught backwards.</h2>
      <p>We were taught to get fit first, then start. It's backwards. You don't get fit to start. You start to get fit.</p>
      <p>And the people who change most aren't the ones who start hardest. They're the ones who keep going. Twice a week. Every week. For a year.</p>
      <p>That's Founding Year. 96 Reformer classes, eight a month for twelve months. Twelve wellness sessions to recover properly. The full reef merch collection. And your name on <b>The Founding 25</b> panel of the Founders Wall on Wyle Cop. A permanent mark that you were here first.</p>
      <div class="card center" style="margin:26px 0;background:var(--sand)"><div class="caps muted">At prices from opening day</div><div style="font-size:28px;color:var(--muted)"><s>£3,160</s></div>
      <div class="caps" style="margin-top:14px;color:var(--gold)">As one of The Founding 25</div><div style="font-family:var(--serif);font-size:46px;color:var(--deep);line-height:1.1">£1,499</div><div class="small muted">paid once · about £125 a month · £15.61 a class</div></div>
      <p>Peak slots, early mornings and evenings, are open to every founder on equal terms. 25 places. When they're gone, this pack never comes back.</p></div></section>`);
  }

  { const F = R.frame(packId);
    sec.push(`<section class="band-foam"><div class="narrow center">
      <p class="eyebrow" style="color:var(--blue)">The maths</p><h2>Less than you think. Much less.</h2>
      <div style="max-width:440px;margin:18px auto 0">${R.priceBlock(packId)}</div>
      <p class="muted" style="margin-top:14px">${F.line}</p>
      ${R.reassure()}
      <button class="btn btn-gold js-buy" type="button" style="margin-top:6px">Claim ${P.name} · ${F.per} a session</button>
    </div></section>`); }
  const bm = C.barrierModules[a.barrier];
  sec.push(`<section><div class="narrow">
    ${bm ? `<div class="card" style="border-left:3px solid var(--gold);margin-bottom:40px"><p class="eyebrow">You told us this held you back</p><h3>${bm.t}</h3><p style="margin:0">${R.fill(bm.b, a)}</p></div>` : ""}
    <p class="eyebrow center">Every worry, answered</p><h2 class="center">Questions people ask before they join.</h2>
    <div style="margin-top:22px">${C.faq.map(f => `<details><summary>${f[0]}</summary><div class="dbody"><p>${R.fill(f[1], a)}</p></div></details>`).join("")}</div>
  </div></section>`);

  sec.push(`<section class="hero-img" style="min-height:min(70vh,620px)"><img src="assets/img/concept-coffee.jpg" alt="Concept visual of the reef coffee bar"><div class="in">
    <p class="eyebrow">55 to 57 Wyle Cop · Concept visual</p><h2 style="color:#fff">Warm, quiet, and built to be stayed in.</h2>
    <p>The first thing you meet at reef is a coffee bar, not a mirror. The Reformers are further in. That order is deliberate.</p></div></section>`);

  sec.push(`<section class="band-white"><div class="narrow center"><p class="eyebrow">A note from us</p><h2>Why we're building reef.</h2>
    <p>We're a family building reef on Wyle Cop for one reason. We want Shrewsbury and Shropshire healthy in every way.</p>
    <p class="muted">Strength, posture and balance can all be built, at any age, and the Reformer is the kindest, smartest way we know to do it. Our founders are the people who'll shape this place. We'd love you to be one of them.</p>
    <p style="margin-top:20px;font-family:var(--serif);font-style:italic;font-size:20px;color:var(--gold)">${CFG.founderName ? R.esc(CFG.founderName) : "The reef family"}</p></div></section>`);

  const others = C.order.slice().reverse().filter(id => id !== packId);
  sec.push(`<section><div class="wrap"><div style="display:flex;justify-content:space-between;align-items:baseline;gap:12px;flex-wrap:wrap"><h2 style="margin:0">You may also like</h2><a class="link" href="packs.html${q}">Shop all packs</a></div>
    <div class="grid g3" style="margin-top:24px">${others.map(id => { const X = C.packs[id]; return `<a class="pcard" href="${X.file}${q}">${R.img(X.imgs[0], "", false)}<div class="pc-b"><span class="badge ${rec && rec.pack === id ? "blue" : ""}">${rec && rec.pack === id ? "Matched to you" : X.badge}</span><div class="caps" style="margin-top:10px;color:var(--deep)">${X.name}</div><div class="small muted">${X.classes} Reformer classes</div><div style="margin-top:6px"><b style="font-size:20px">${R.money(X.perClass)}</b> <span class="small muted">a session · ${R.money(X.price)}</span></div></div></a>`; }).join("")}</div></div></section>`);

  const down = P.down ? C.packs[P.down] : null;
  sec.push(`<section class="band-sand"><div class="narrow center">
    <img src="assets/logo/reef-mark-gold.png" alt="" width="64" height="67" style="margin:0 auto 14px">
    <h2>Zero risk${N ? ", " + N : ""}. Fully protected.</h2>
    <div style="text-align:left;margin:18px 0">${R.guarantee()}</div>
    <p class="muted">Founder prices end the day we open, ${R.esc(CFG.openingDateText)}. ${R.placesShort(packId)} at this price.</p>
    <button class="btn btn-gold btn-block js-buy pulse" type="button" style="max-width:420px;margin:18px auto 0">Claim ${P.name} · ${R.money(P.perClass)} a session</button>
    ${down ? `<p style="margin-top:18px"><a href="${down.file}${q}">Not ready? Start with ${down.name} for ${R.money(down.price)}</a></p>` : ""}
  </div></section>`);

  document.getElementById("page").innerHTML = sec.join("");
  document.getElementById("foot").innerHTML = R.footer();

  /* gallery dots */
  const track = R.$("#track"), dots = [...document.querySelectorAll("#dots i")];
  track.addEventListener("scroll", () => { const i = Math.round(track.scrollLeft / track.clientWidth); dots.forEach((d, j) => d.classList.toggle("on", i === j)); }, { passive: true });
  dots.forEach((d, i) => d.onclick = () => track.scrollTo({ left: i * track.clientWidth, behavior: "smooth" }));

  /* sticky add to bag */
  const st = document.createElement("div"); st.className = "sticky";
  st.innerHTML = `<div class="p"><b>${R.money(P.perClass)} a session</b>${P.name} · ${R.money(P.price)} · 🛡️ ${CFG.refundDays} day refund</div><button class="btn btn-gold js-buy" type="button">Claim my place</button>`;
  document.body.appendChild(st);
  const firstBuy = R.$(".buy .js-buy");
  addEventListener("scroll", () => { const r = firstBuy.getBoundingClientRect(); st.classList.toggle("show", r.bottom < 0); }, { passive: true });
  document.querySelectorAll(".js-buy").forEach(b => b.onclick = () => R.addToBag(packId));

  /* exit intent downsell */
  const modal = document.createElement("div"); modal.className = "modal"; modal.innerHTML = `<div class="sheet"><button class="x" aria-label="Close" type="button">×</button><div class="body"></div></div>`;
  document.body.appendChild(modal);
  const open = (html) => { modal.querySelector(".body").innerHTML = html; modal.classList.add("open"); };
  const close = () => modal.classList.remove("open");
  modal.querySelector(".x").onclick = close; modal.onclick = (e) => { if (e.target === modal) close(); };
  let exitShown = false; try { exitShown = sessionStorage.getItem("reef_exit_" + packId) === "1"; } catch (e) {}
  const exit = () => {
    if (exitShown || modal.classList.contains("open") || (R.$("#bag") && R.$("#bag").classList.contains("open"))) return; exitShown = true;
    try { sessionStorage.setItem("reef_exit_" + packId, "1"); } catch (e) {}
    R.track("ExitIntent", { pack: packId }, true);
    if (down) {
      open(`<span class="badge">Before you go</span><h2 style="font-size:26px;margin-top:14px">Not quite ready for ${P.name}${N ? ", " + N : ""}?</h2>
        <div class="line-item" style="margin:16px 0">${R.img(down.imgs[0], "", false)}<div><div class="caps" style="color:var(--deep)">${down.name}</div><div class="small muted">${down.classes} classes · ${R.money(down.perClass)} a class</div></div><b>${R.money(down.price)}</b></div>
        <p class="small">Same founder pricing, same ${CFG.refundDays} day refund window, and credits that don't start until opening day.</p>
        <button class="btn btn-primary btn-block" id="d-yes" type="button">Add ${down.name} to bag</button>
        <a class="btn btn-ghost btn-block" href="${down.file}${q}" style="margin-top:10px">View ${down.name}</a>`);
      R.$("#d-yes").onclick = () => { close(); R.addToBag(down.id); };
    } else {
      open(`<span class="badge">Before you go</span><h2 style="font-size:26px;margin-top:14px">Got a question first${N ? ", " + N : ""}?</h2>
        <p>Most people know after the third class whether Reformer is for them. Five classes for £99, a ${CFG.refundDays} day refund window, and credits that don't start until opening day.</p>
        <button class="btn btn-primary btn-block" id="d-yes" type="button">Add Founder 5 to bag</button>
        ${R.callHtml() ? `<div style="margin-top:10px">${R.callHtml("Ask Ricky a question")}</div>` : ""}`);
      R.$("#d-yes").onclick = () => { close(); R.addToBag("founder5"); };
    }
  };
  document.addEventListener("mouseout", (e) => { if (!e.relatedTarget && e.clientY < 8) exit(); });
  let maxY = 0, lastY = 0, lastT = 0;
  addEventListener("scroll", () => {
    const y = scrollY, t = Date.now(), Hh = document.body.scrollHeight - innerHeight;
    maxY = Math.max(maxY, y);
    if (maxY > Hh * 0.55 && lastY - y > 140 && t - lastT < 260) exit();
    lastY = y; lastT = t;
  }, { passive: true });
  if (new URLSearchParams(location.search).get("bag") === "1") R.openBag();
  R.animate();
})();
