/* reef founder funnel: personalised pack page renderer.
   Every page rebuilds itself from the visitor's quiz answers:
   headline (goal), mirror (all answers), pain module (body + day), science (goal + decade),
   objection killer (barrier), decade, experience, men module, pack logic and bump/downsell. */
(function () {
  const R = REEF, C = REEF_CONTENT, CFG = REEF_CONFIG;
  const packId = document.body.dataset.pack, P = C.packs[packId];
  const s = R.fromUrl(), a = s.answers || {};
  const personal = !!a.goal, n = R.first(a), N = n ? R.esc(n) : "";
  const prof = C.profiles[a.goal] || null;
  const pname = personal ? C.profileName(a) : "";
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
  const ctaTxt = `Claim my ${P.name} place`;
  const microcopy = `${R.money(P.perClass)} a class · ${CFG.refundDays} day refund window · Credits start on opening day`;

  const sec = [];

  /* HERO */
  sec.push(`<section style="padding-top:20px"><div class="narrow center">
    <p class="eyebrow">${personal ? `${N ? N + "'s" : "Your"} plan · ${pname}` : `Founder pack · ${P.badge}`}</p>
    <h1>${personal ? H(headlines[a.goal]) : P.tagline}</h1>
    <p style="font-size:18px;color:var(--muted);max-width:56ch;margin:0 auto 22px">${personal ? P.tagline + " " + (packId === "plus" ? "Founder pricing for the first 60 people in Shrewsbury." : "") : P.sub}</p>
    ${R.videoHtml(CFG.videos[packId], packId === "plus" ? "45 second founder video coming soon" : packId === "member" ? "Founder video coming soon" : "Video coming soon")}
    <div style="margin-top:22px"><button class="btn btn-gold btn-block js-buy" type="button">${ctaTxt} · ${R.money(P.price)}</button>
    <p class="small muted" style="margin:10px 0 0">${microcopy}</p>${R.placesHtml(packId)}</div>
  </div></section>`);

  /* MIRROR */
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
    sec.push(`<section class="band-white"><div class="narrow"><p class="eyebrow">What you told us</p>
      <h2>${N ? N + ", here's" : "Here's"} what we heard.</h2><ul class="ticks">${items.map(i => `<li>${i}</li>`).join("")}</ul>
      <p>${prof.why}</p><p class="muted">That's why we matched you to <b>${P.name}</b>. Here's exactly what it does for you.</p></div></section>`);
  } else {
    sec.push(`<section class="band-white"><div class="narrow center"><p class="eyebrow">Two minute quiz</p><h2>Want this page built around you?</h2>
      <p class="muted">Answer a few quick questions and we'll personalise your plan, your twelve weeks and your founder pack.</p>
      <a class="btn btn-ghost" href="index.html">Take the quiz</a></div></section>`);
  }

  /* PAIN / PROBLEM */
  const bodies = (a.body && a.body.length ? a.body : ["back", "neck"]).slice(0, 3);
  sec.push(`<section><div class="narrow"><p class="eyebrow">The real problem</p>
    <h2>${personal ? "It isn't your age. It's what your body hasn't been asked to do." : "Most bodies aren't weak. They're under asked."}</h2>
    ${personal && C.dayModules[a.day] ? `<p>${C.dayModules[a.day]}</p>` : `<p>Most of us sit too long, rush too much and train in ways we can't keep up. The deep muscles that hold your spine and pelvis quietly switch off, and the creaks start.</p>`}
    <div class="grid" style="margin-top:20px">${bodies.map(b => C.bodyModules[b] ? `<div class="card"><h3>${C.bodyModules[b].t}</h3><p style="margin:0" class="muted">${C.bodyModules[b].b}</p></div>` : "").join("")}</div>
  </div></section>`);

  /* MECHANISM */
  sec.push(`<section class="band-deep"><div class="narrow"><p class="eyebrow" style="color:#F3E2C2">Why Reformer works</p>
    <h2>A bed on rails, a set of springs, and nowhere to hide.</h2>
    <p>You push the carriage out and control it back. Muscles work on the way out and on the way back, so there's no momentum to cheat with. Because the bed moves, your body stabilises itself the entire time. That's why people who lift heavy come out of their first class shaking.</p>
    <p>The springs can help you or fight you. A lighter spring can make a move easier, or make your core work much harder. So total beginners and athletes use the same machine, on different settings.</p>
    <div class="grid g2" style="margin-top:24px">
      <div class="card" style="background:rgba(255,255,255,.06);border-color:rgba(255,255,255,.14);box-shadow:none"><p class="eyebrow" style="color:#F3E2C2">The Twice a Week Standard</p><p style="margin:0">The NHS advises strength work on at least two days a week and names Pilates as an example. Twice a week is the dose the trials used. Your pack is built around it.</p></div>
      <div class="card" style="background:rgba(255,255,255,.06);border-color:rgba(255,255,255,.14);box-shadow:none"><p class="eyebrow" style="color:#F3E2C2">The Reeformer Loop</p><p style="margin:0">Learn it with a teacher. Own it on the screen. Come back stronger. Instructor led classes plus more than 800 guided sessions on your own bed.</p></div>
    </div></div></section>`);

  /* SCIENCE */
  const sciKeys = [...new Set([...(prof ? prof.science : ["backPain", "core228", "classpass"]), ...(["60s", "70s"].includes(a.age) ? ["balance"] : []), ...(a.barrier === "gym" ? ["gym"] : [])])].slice(0, 4);
  sec.push(`<section><div class="wrap"><div class="narrow center" style="padding:0"><p class="eyebrow">The evidence</p>
    <h2>We printed the studies. Including the one that disagrees with us.</h2>
    <p class="muted">Every number here comes from published research, collected in The Reeformer Pilates Manual. Where the evidence is strong we say so. Where it's early or mixed, we say that too.</p></div>
    <div class="grid ${sciKeys.length > 3 ? "g2" : "g3"}" style="margin-top:24px">${sciKeys.map(k => { const x = C.science[k]; return `<div class="card stat"><b>${x[0]}</b><span>${x[1]}</span><div class="src" style="margin-top:8px">${x[2]}</div></div>`; }).join("")}</div>
    <div class="card" style="margin-top:16px;border-style:dashed;box-shadow:none"><p style="margin:0"><b style="color:var(--deep)">The honest one:</b> Pilates holds bone, it doesn't build it. A meta analysis of 11 studies in women aged 45 to 78 found bone density barely moved. We tell you because the case for Reformer is strong enough to survive honesty. <span class="src">Fernández Rodríguez et al, PLOS ONE, 2021</span></p></div>
  </div></section>`);

  /* DECADE + MEN + EXPERIENCE */
  const extra = [];
  if (a.age && C.decadeModules[a.age]) extra.push(C.decadeModules[a.age]);
  if (a.sex === "m") extra.push(C.menModule);
  if (a.exp && C.expModules[a.exp]) extra.push({ t: a.exp === "0" ? "Brand new to it" : "Your experience", b: C.expModules[a.exp] });
  if (extra.length) sec.push(`<section class="band-foam"><div class="wrap"><div class="narrow center" style="padding:0"><p class="eyebrow">Built for you</p><h2>${N ? N + ", here's" : "Here's"} what this means for you.</h2></div>
    <div class="grid ${extra.length > 1 ? "g" + Math.min(3, extra.length) : ""}" style="margin-top:22px">${extra.map(x => `<div class="card"><h3>${x.t}</h3><p class="muted" style="margin:0">${x.b}</p></div>`).join("")}</div></div></section>`);

  /* TWELVE WEEKS */
  sec.push(`<section><div class="narrow"><p class="eyebrow">What changes, and when</p><h2>Your first twelve weeks.</h2>
    ${C.weeks.map(w => `<div style="display:flex;gap:16px;padding:14px 0;border-bottom:1px solid var(--line)"><div style="flex:none;width:96px;color:var(--gold);font-size:12px;letter-spacing:.12em;text-transform:uppercase;padding-top:4px">${w[0]}</div><div><h3 style="margin:0 0 4px">${w[1]}</h3><p class="muted" style="margin:0">${w[2]}</p></div></div>`).join("")}
  </div></section>`);

  /* PACK SPECIFIC */
  if (packId === "member") {
    const rate = CFG.memberMonthlyRate, std = CFG.memberStandardRate;
    sec.push(`<section class="band-white"><div class="narrow"><p class="eyebrow">The part nobody else can buy</p><h2>Your founder rate, locked for a year.</h2>
      <p>Most people stop exercising when the novelty runs out. Founding Member is built so you don't. Three months of membership takes you right through the twelve week window where habits form, then your founder monthly rate is locked for the next 12 months.</p>
      ${rate ? `<div class="card" style="display:flex;justify-content:space-between;align-items:center"><span>Founder monthly rate, locked 12 months</span><b style="font-size:28px;color:var(--deep)">${R.money(rate)}${std ? ` <s class="muted" style="font-size:16px">${R.money(std)}</s>` : ""}</b></div>` : ""}
      <p class="muted">Once the doors open, this rate is gone for good. 40 places.</p>${R.callHtml("Questions first? Book a 10 minute call with Ricky")}</div></section>`);
  }
  if (packId === "year") {
    sec.push(`<section class="band-white"><div class="narrow"><p class="eyebrow">A letter about your strongest year</p>
      <h2>The one rule about getting fit we were all taught backwards.</h2>
      <p>We were taught to get fit first, then start. Lose a bit, tone a bit, then join the class. It's backwards. You don't get fit to start. You start to get fit.</p>
      <p>And the people who change most aren't the ones who start hardest. They're the ones who keep going. Twice a week. Every week. For a year.</p>
      <p>That's what Founding Year is. 96 Reformer classes, eight a month for twelve months. Twelve wellness sessions to recover properly: hyperbaric, red light and recovery boots. The full reef merch collection. And your name on <b>The Founding 25</b> panel of the Founders Wall on Wyle Cop. A permanent mark that you were here first.</p>
      <div class="card" style="margin:22px 0"><p style="margin:0 0 6px" class="muted">At our prices from opening day, that's</p><p style="font-size:34px;color:var(--muted);margin:0"><s>£3,160</s></p>
      <p style="margin:14px 0 6px" class="muted">As a Founding 25 member</p><p style="font-size:44px;color:var(--deep);font-weight:700;margin:0;line-height:1">£1,499 <span style="font-size:16px;font-weight:400" class="muted">paid once</span></p>
      <p style="margin:12px 0 0">That's about <b>£125 a month</b>, or <b>£15.61 a class</b>, with twelve wellness sessions on top.</p></div>
      <p>Peak slots, early mornings and evenings, are open to every founder on equal terms. 25 places. When they're gone, this pack never comes back.</p>
      ${R.callHtml("Rather talk it through? Book a 10 minute call with Ricky")}</div></section>`);
  }

  /* OFFER STACK */
  const rows = P.stack.map(r => `<tr><td>${r[0]}</td><td style="text-align:right;white-space:nowrap">${r[1] ? R.money(r[1]) : `<span class="muted small">Included</span>`}</td></tr>`).join("");
  sec.push(`<section id="offer" class="band-deep"><div class="narrow"><p class="eyebrow" style="color:#F3E2C2">Everything in ${P.name}</p>
    <h2>${N ? N + ", here's" : "Here's"} your founder pack.</h2>
    <div class="card" style="color:var(--ink);margin-top:20px">
      <table style="width:100%;border-collapse:collapse;font-size:15px">${rows}
      <tr><td style="border-top:1px solid var(--line);padding-top:12px"><b>At our prices from opening day</b></td><td style="border-top:1px solid var(--line);padding-top:12px;text-align:right"><s>${R.money(P.value)}</s></td></tr></table>
      <div class="price" style="margin-top:14px"><b>${R.money(P.price)}</b><span class="save">You pay ${R.money(P.save)} less</span></div>
      <p class="small muted" style="margin:4px 0 14px">${R.money(P.perClass)} a class${P.perClassWellness ? `, or ${R.money(P.perClassWellness)} a class with your wellness sessions counted` : ""}. ${P.validity}.</p>
      ${R.placesHtml(packId)}
      <button class="btn btn-gold btn-block js-buy" type="button">${ctaTxt} · ${R.money(P.price)}</button>
      ${P.call ? `<div style="margin-top:10px">${R.callHtml()}</div>` : ""}
      <p class="small muted center" style="margin:12px 0 0">Secure checkout through Momence · ${CFG.refundDays} day refund window</p>
    </div>
    <style>#offer td{padding:9px 0;border-bottom:1px solid #f0ebe0;vertical-align:top}</style>
  </div></section>`);

  /* OBJECTION KILLER + FAQ */
  const bm = C.barrierModules[a.barrier];
  sec.push(`<section><div class="narrow">
    ${bm ? `<div class="card" style="border-left:4px solid var(--gold);margin-bottom:34px"><p class="eyebrow">You told us this held you back</p><h3>${bm.t}</h3><p style="margin:0">${R.fill(bm.b, a)}</p></div>` : ""}
    <p class="eyebrow">Every worry, answered</p><h2>Questions people ask before they join.</h2>
    ${C.faq.map(f => `<details><summary>${f[0]}</summary><p>${R.fill(f[1], a)}</p></details>`).join("")}
  </div></section>`);

  /* STUDIO */
  sec.push(`<section class="band-foam"><div class="narrow"><p class="eyebrow">55 to 57 Wyle Cop</p><h2>Warm, quiet, and built to be stayed in.</h2>
    <p>The first thing you meet at reef is a coffee bar, not a mirror. The Reformers are further in. That order is deliberate.</p>
    <ul class="ticks"><li>Ten or more Reformer beds in a quiet, low noise studio</li><li>Your own screen with more than 800 guided sessions, and Bluetooth headphones</li><li>Open 7am to 10pm, seven days</li><li>Changing rooms, a lounge and a work friendly corner</li><li>Red light, recovery boots and hyperbaric, all on site</li><li>St Julian's Friars car park 122 metres away, free after 6pm</li></ul>
    <p class="small muted">The first full Reformer studio inside Shrewsbury town centre, with ten or more beds, in a Grade II listed building on the oldest shopping street in town.</p></div></section>`);

  /* FOUNDER NOTE */
  sec.push(`<section><div class="narrow"><p class="eyebrow">A note from us</p><h2>Why we're building reef.</h2>
    <p>We're a family building reef on Wyle Cop for one reason. We want Shrewsbury and Shropshire healthy in every way.</p>
    <p>We've watched too many people we love feel their body slip and quietly decide that's just what happens. It isn't. Strength, posture and balance can all be built, at any age, and the Reformer is the kindest, smartest way we know to do it.</p>
    <p>Our founders are the people who'll shape this place. You'll get first choice of sessions, a price nobody can buy after opening day, and you'll be in the room from the very first week. We'd love you to be one of them.</p>
    <p style="margin-top:20px"><em style="font-size:20px">${CFG.founderName ? R.esc(CFG.founderName) : "The reef family"}</em><br><span class="small muted">Founder, reef</span></p></div></section>`);

  /* GUARANTEE + FINAL CTA */
  const down = P.down ? C.packs[P.down] : null;
  sec.push(`<section class="band-white"><div class="narrow center">
    <img src="assets/logo/reef-mark-gold.png" alt="" width="70" height="73" style="margin:0 auto 14px">
    <h2>Zero risk, ${N || "friend"}.</h2>
    <p>Full ${CFG.refundDays} day refund window on online purchases. Your credits don't start until opening day, so you never lose a class to building delays.${CFG.longStopDateText ? ` And if we ever slipped past ${R.esc(CFG.longStopDateText)}, you could have a full refund.` : ""}</p>
    <p class="muted">Founder prices end the day we open, ${R.esc(CFG.openingDateText)}. ${R.placesShort(packId)}.</p>
    <button class="btn btn-gold btn-block js-buy" type="button" style="margin-top:8px">${ctaTxt} · ${R.money(P.price)}</button>
    ${down ? `<p style="margin-top:18px"><a href="${down.file}${location.search}">Not ready for ${P.name}? Start with ${down.name} for ${R.money(down.price)}</a></p>` : ""}
    <p><a href="packs.html${location.search}">Compare all four founder packs</a></p>
  </div></section>`);

  document.getElementById("page").innerHTML = sec.join("");
  document.getElementById("foot").innerHTML = R.footer();

  /* STICKY CTA */
  const st = document.createElement("div"); st.className = "sticky";
  st.innerHTML = `<div class="p"><b>${P.name} · ${R.money(P.price)}</b>${R.placesShort(packId)}</div><button class="btn btn-gold js-buy" type="button">Claim my place</button>`;
  document.body.appendChild(st);
  addEventListener("scroll", () => st.classList.toggle("show", scrollY > 700), { passive: true });

  /* MODALS: order bump on checkout, downsell on exit */
  const modal = document.createElement("div"); modal.className = "modal"; modal.innerHTML = `<div class="sheet" style="position:relative"><button class="x" aria-label="Close" type="button">×</button><div class="body"></div></div>`;
  document.body.appendChild(modal);
  const open = (html) => { modal.querySelector(".body").innerHTML = html; modal.classList.add("open"); };
  const close = () => modal.classList.remove("open");
  modal.querySelector(".x").onclick = close; modal.onclick = (e) => { if (e.target === modal) close(); };

  let bumped = false;
  const buy = () => {
    if (P.bump && !bumped) {
      bumped = true;
      const T = C.packs[P.bump.to];
      open(`<p class="eyebrow">Wait${N ? ", " + N : ""}. One quick upgrade</p><h2 style="font-size:26px">${T.name} for ${R.money(P.bump.extra)} more?</h2>
        <p>${P.bump.line}</p>
        <div class="card" style="padding:14px 16px;margin:14px 0"><div style="display:flex;justify-content:space-between"><span>${P.name}</span><b>${R.money(P.price)}</b></div><div style="display:flex;justify-content:space-between;margin-top:6px"><span>${T.name}</span><b>${R.money(T.price)}</b></div><div class="small muted" style="margin-top:8px">${T.classes} classes · ${R.money(T.perClass)} a class · ${R.money(T.value)} at prices from opening day</div></div>
        <button class="btn btn-gold btn-block" id="b-yes" type="button">Yes, upgrade me to ${T.name}</button>
        <button class="link-quiet" id="b-no" type="button" style="display:block;margin:6px auto 0">No thanks, continue with ${P.name}</button>`);
      R.$("#b-yes").onclick = () => { R.track("BumpAccepted", { from: packId, to: T.id }, true); if (T.call) location.href = T.file + location.search; else R.goCheckout(T.id); };
      R.$("#b-no").onclick = () => { close(); R.goCheckout(packId); };
      return;
    }
    R.goCheckout(packId);
  };
  document.querySelectorAll(".js-buy").forEach(b => b.onclick = buy);

  let exitShown = false; try { exitShown = sessionStorage.getItem("reef_exit_" + packId) === "1"; } catch (e) {}
  const exit = () => {
    if (exitShown || modal.classList.contains("open")) return; exitShown = true;
    try { sessionStorage.setItem("reef_exit_" + packId, "1"); } catch (e) {}
    R.track("ExitIntent", { pack: packId }, true);
    if (down) {
      open(`<p class="eyebrow">Before you go${N ? ", " + N : ""}</p><h2 style="font-size:26px">Not quite ready for ${P.name}?</h2>
        <p>Start smaller. <b>${down.name}</b> is ${down.classes} Reformer classes for ${R.money(down.price)}, ${R.money(down.perClass)} a class. Same founder pricing, same ${CFG.refundDays} day refund window.</p>
        <button class="btn btn-gold btn-block" id="d-yes" type="button">Get ${down.name} for ${R.money(down.price)}</button>
        <a class="btn btn-ghost btn-block" href="${down.file}${location.search}" style="margin-top:10px">See what's in ${down.name}</a>
        ${R.callHtml() ? `<div style="margin-top:10px">${R.callHtml("Or ask Ricky a question first")}</div>` : ""}`);
      R.$("#d-yes").onclick = () => { if (down.call) location.href = down.file + location.search; else R.goCheckout(down.id); };
    } else {
      open(`<p class="eyebrow">Before you go${N ? ", " + N : ""}</p><h2 style="font-size:26px">Got a question first?</h2>
        <p>Most people know after the third class whether Reformer is for them. Five classes for £99, a ${CFG.refundDays} day refund window, and credits that don't start until opening day. If something's holding you back, Ricky will answer it in ten minutes.</p>
        <button class="btn btn-gold btn-block" id="d-yes" type="button">Claim Founder 5 for £99</button>
        ${R.callHtml() ? `<div style="margin-top:10px">${R.callHtml("Ask Ricky a question")}</div>` : ""}`);
      R.$("#d-yes").onclick = () => R.goCheckout("founder5");
    }
  };
  document.addEventListener("mouseout", (e) => { if (!e.relatedTarget && e.clientY < 8) exit(); });
  // mobile: a fast scroll back up after reading most of the page
  let maxY = 0, lastY = 0, lastT = 0;
  addEventListener("scroll", () => {
    const y = scrollY, t = Date.now(), H = document.body.scrollHeight - innerHeight;
    maxY = Math.max(maxY, y);
    if (maxY > H * 0.55 && lastY - y > 140 && t - lastT < 260) exit();
    lastY = y; lastT = t;
  }, { passive: true });
})();
