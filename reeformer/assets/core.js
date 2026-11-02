/* reef founder funnel: shared engine (state, recommendation, Momence, tracking, checkout) */
(function () {
  const CFG = window.REEF_CONFIG, C = window.REEF_CONTENT;
  const KEY = "reef_founder_quiz_v1";
  const R = {};

  /* ---------- state ---------- */
  R.load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return R._mem || {}; } };
  R.save = (s) => { R._mem = s; try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {} };
  R.update = (patch) => { const s = Object.assign(R.load(), patch); R.save(s); return s; };

  // Answers can also arrive by URL, so email links and ads deep link into a personalised page.
  // ?r=<base64 json> (from our emails)  or plain params ?goal=posture&age=40s&barrier=time&n=Sarah
  R.fromUrl = () => {
    const p = new URLSearchParams(location.search), s = R.load();
    s.answers = s.answers || {};
    if (p.get("r")) { try { const d = JSON.parse(decodeURIComponent(escape(atob(p.get("r"))))); Object.assign(s.answers, d); } catch (e) {} }
    ["goal", "exp", "day", "barrier", "age", "sex", "freq", "ready", "pace", "metime"].forEach(k => { if (p.get(k)) s.answers[k] = p.get(k); });
    if (p.get("body")) s.answers.body = p.get("body").split(",");
    if (p.get("n")) s.answers.name = p.get("n");
    ["utm_source", "utm_medium", "utm_campaign", "utm_content", "fbclid"].forEach(k => { if (p.get(k)) { s.utm = s.utm || {}; s.utm[k] = p.get(k); } });
    R.save(s); return s;
  };
  R.shareCode = (a) => btoa(unescape(encodeURIComponent(JSON.stringify(a))));

  /* ---------- helpers ---------- */
  R.$ = (sel, el) => (el || document).querySelector(sel);
  R.esc = (t) => String(t == null ? "" : t).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  R.first = (a) => (a && a.name ? String(a.name).trim().split(/\s+/)[0] : "");
  R.fill = (txt, a) => {
    const n = R.first(a);
    return String(txt)
      .replace(/\{n\}/g, n ? R.esc(n) : "friend")
      .replace(/\{refund\}/g, CFG.refundDays)
      .replace(/\{open\}/g, R.esc(CFG.openingDateText))
      .replace(/\{longstop\}/g, CFG.longStopDateText ? "If we ever slipped past " + R.esc(CFG.longStopDateText) + ", you could have a full refund." : "");
  };
  R.money = (v) => "£" + Number(v).toLocaleString("en-GB", { minimumFractionDigits: v % 1 ? 2 : 0, maximumFractionDigits: 2 });
  R.label = (stepId, val) => {
    const st = C.steps.find(s => s.id === stepId); if (!st || !st.opts) return val;
    const o = st.opts.find(o => o[0] === val); return o ? o[1] : val;
  };

  /* ---------- recommendation ---------- */
  R.recommend = (a) => {
    const exp = { "0": 0, "1-5": 1, "6-20": 2, "20+": 3 }[a.exp] || 0;
    const f = a.freq, r = a.ready;
    let pack;
    if (r === "curious") pack = "founder5";
    else if (f === "unsure") pack = r === "now" ? "plus" : "founder5";
    else if (f === "1") pack = (r === "now") ? "plus" : "founder5";
    else if (f === "3") pack = (r === "now" && exp >= 1) ? "year" : "member";
    else pack = (r === "now" && exp >= 2) ? "member" : "plus";
    // the cost objection plus not fully ready lands on the lowest risk step
    if (a.barrier === "cost" && r !== "now" && pack !== "founder5") pack = C.order[Math.max(0, C.order.indexOf(pack) - 1)];
    const i = C.order.indexOf(pack);
    return { pack, up: C.order[i + 1] || null, down: C.order[i - 1] || null };
  };

  R.reasons = (a, packId) => {
    const out = [];
    const freqTxt = { "1": "once a week", "2": "twice a week", "3": "three or more times a week", "unsure": "when you can" }[a.freq];
    const P = C.packs[packId];
    if (a.freq === "2" || a.freq === "3") out.push(`You can come ${freqTxt}, which matches the Twice a Week Standard the published trials used.`);
    if (a.freq === "1") out.push("You said once a week to start. This pack lets you begin there and build to twice, which is where the results in the trials come from.");
    if (a.exp === "0") out.push("You're new to Reformer, so you start with an instructor setting your springs and build from there.");
    if (packId === "founder5") out.push("It's the lowest risk way to feel it for yourself. Most people know after the third class.");
    if (packId === "plus") out.push("14 classes is about two a week for your first seven weeks, the routine that makes it stick.");
    if (packId === "member") out.push("30 classes over three months takes you right through the twelve week window, then locks your founder rate for a year.");
    if (packId === "year") out.push("96 classes is two a week for a whole year, with the wellness sessions to recover properly in between.");
    if (+a.pace >= 4 || a.metime === "cant") out.push("You need an hour that is genuinely yours. This builds it into your week.");
    if (P.perClassWellness) out.push(`Works out at ${R.money(P.perClassWellness)} a class once the wellness sessions are counted.`);
    return out.slice(0, 4);
  };

  /* ---------- Momence lead ---------- */
  R.sendLead = async (s) => {
    const a = s.answers || {}, m = CFG.momence;
    if (CFG.testMode) {
      const log = (R.load().testLeads || []); log.push({ at: new Date().toISOString(), email: s.email, phone: s.phone, profile: C.profileName(a), pack: C.packs[s.pack].name, answers: a });
      R.update({ testLeads: log.slice(-50) }); console.info("[reef TEST] lead captured, not sent", log[log.length - 1]); return;
    }
    const parts = String(a.name || "").trim().split(/\s+/);
    const base = { token: m.token, sourceId: m.sourceId, firstName: parts[0] || "", lastName: parts.slice(1).join(" ") || "", email: s.email, phoneNumber: s.phone || "" };
    const extra = {
      quizProfile: C.profileName(a), recommendedPack: C.packs[s.pack].name, goal: a.goal, experience: a.exp,
      body: (a.body || []).join(","), day: a.day, weekPace: a.pace, meTime: a.metime, barrier: a.barrier,
      ageBand: a.age, sex: a.sex, frequency: a.freq, readiness: a.ready, smsConsent: s.sms ? "yes" : "no",
      utm: s.utm ? JSON.stringify(s.utm) : ""
    };
    const post = (url, body) => fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body), keepalive: true });
    if (m.hostId && m.token) {
      const url = `https://api.momence.com/integrations/customer-leads/${encodeURIComponent(m.hostId)}/collect`;
      try {
        const res = await post(url, m.sendQuizAnswers ? Object.assign({}, base, extra) : base);
        if (!res.ok && m.sendQuizAnswers) await post(url, base); // retry with core fields only
      } catch (e) { console.warn("Momence lead failed", e); }
    } else console.warn("[reef] Momence hostId/token not set in config.js. Lead not sent.");
    if (m.backupWebhook) { try { await post(m.backupWebhook, Object.assign({}, base, extra, { token: undefined, answers: a })); } catch (e) {} }
  };

  /* ---------- tracking ---------- */
  R.initTracking = () => {
    if (CFG.metaPixelId && !window.fbq) {
      !function (f, b, e, v, n, t, s) { if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments) }; if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = []; t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s) }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', CFG.metaPixelId); fbq('track', 'PageView');
    }
    if (CFG.ga4Id && !window.gtag) {
      const s = document.createElement("script"); s.async = true; s.src = "https://www.googletagmanager.com/gtag/js?id=" + CFG.ga4Id; document.head.appendChild(s);
      window.dataLayer = window.dataLayer || []; window.gtag = function () { dataLayer.push(arguments); }; gtag("js", new Date()); gtag("config", CFG.ga4Id);
    }
  };
  R.track = (ev, data, custom) => {
    try { if (window.fbq) custom ? fbq("trackCustom", ev, data || {}) : fbq("track", ev, data || {}); } catch (e) {}
    try { if (window.gtag) gtag("event", ev, data || {}); } catch (e) {}
  };

  /* ---------- places + dates ---------- */
  R.placesHtml = (packId) => {
    const p = CFG.places[packId]; if (!p || p.left == null) return "";
    const pct = Math.max(4, Math.min(100, 100 - (p.left / p.total) * 100));
    return `<div class="spots"><div class="bar"><i style="width:${pct}%"></i></div><div class="lbl"><span><b>${p.left} of ${p.total}</b> founder places left</span><span>Closes on opening day</span></div></div>`;
  };
  R.placesShort = (packId) => { const p = CFG.places[packId]; return p && p.left != null ? `${p.left} of ${p.total} places left` : `${p.total} places only`; };

  /* ---------- bag + checkout ---------- */
  R.img = (name, cls, cv) => `<div class="img ${cls || ""}"><img src="assets/img/${name}.jpg" alt="Concept visual of reef on Wyle Cop" loading="lazy">${cv === false ? "" : `<span class="cv">Concept visual</span>`}</div>`;
  R.bagCount = () => (R.load().bag ? 1 : 0);
  R.addToBag = (packId) => {
    R.update({ bag: packId });
    const P = C.packs[packId];
    R.track("AddToCart", { value: P.price, currency: "GBP", content_name: P.name });
    R.renderBadge(); R.openBag(true);
  };
  R.renderBadge = () => { const el = document.querySelector(".nav .bag i"); if (el) { el.textContent = R.bagCount(); el.style.display = R.bagCount() ? "" : "none"; } };
  R.ensureDrawer = () => {
    if (R.$("#bag")) return;
    const d = document.createElement("div");
    d.innerHTML = `<div class="scrim" id="bagScrim"></div><aside class="drawer" id="bag" aria-label="Your bag"><div class="hd"><span class="caps">Your bag</span><button class="x" id="bagX" aria-label="Close" type="button">×</button></div><div class="bd" id="bagBd"></div><div class="ft" id="bagFt"></div></aside>`;
    document.body.appendChild(d);
    R.$("#bagScrim").onclick = R.closeBag; R.$("#bagX").onclick = R.closeBag;
  };
  R.closeBag = () => { R.$("#bag").classList.remove("open"); R.$("#bagScrim").classList.remove("open"); };
  R.openBag = (justAdded) => {
    R.ensureDrawer();
    const s = R.load(), id = s.bag, bd = R.$("#bagBd"), ft = R.$("#bagFt");
    if (!id) {
      bd.innerHTML = `<p class="muted" style="margin-top:20px">Your bag is empty.</p><a class="btn btn-ghost btn-block" href="packs.html">Shop founder packs</a><p class="small muted center" style="margin-top:14px">Not sure which? <a href="index.html?restart=1">Take the 2 minute quiz</a></p>`;
      ft.innerHTML = "";
    } else {
      const P = C.packs[id], U = P.bump ? C.packs[P.bump.to] : null, n = R.first(s.answers);
      bd.innerHTML = `${justAdded ? `<p class="small" style="color:var(--ok);margin:0 0 14px">✓ Added to your bag${n ? ", " + R.esc(n) : ""}. Great choice.</p>` : ""}
        <div class="line-item">${R.img(P.imgs[0], "", false)}<div><div class="caps" style="color:var(--deep)">${P.name}</div><div class="small muted">${P.classes} Reformer classes · ${P.validity}</div><span class="badge" style="margin-top:8px">${P.badge}</span></div><div style="text-align:right"><b>${R.money(P.price)}</b><br><s class="small muted">${R.money(P.value)}</s></div></div>
        <button class="link-quiet" id="bagRm" type="button" style="padding:8px 0">Remove</button>
        ${U ? `<div class="card" style="margin-top:18px;background:var(--foam);border-color:var(--sky)"><span class="badge blue">Upgrade and save more</span><h3 style="margin:12px 0 6px;font-size:19px">${U.name} for ${R.money(P.bump.extra)} more</h3><p class="small" style="margin:0 0 12px">${P.bump.line}</p><button class="btn btn-ghost btn-block" id="bagUp" type="button">Upgrade to ${U.name}</button></div>` : ""}
        <ul class="ticks small" style="margin-top:20px"><li>${CFG.refundDays} day refund window</li><li>Credits start on opening day, so you never lose a class</li><li>3 Guest Passes included for friends</li></ul>`;
      ft.innerHTML = `<div style="display:flex;justify-content:space-between;margin-bottom:4px"><span class="caps">Subtotal</span><b>${R.money(P.price)}</b></div>
        <div class="small" style="color:var(--blue);margin-bottom:12px">You pay ${R.money(P.save)} less than prices from opening day</div>
        <button class="btn btn-primary btn-block" id="bagGo" type="button">Checkout securely · ${R.money(P.price)}</button>
        <div class="pay"><span>VISA</span><span>MASTERCARD</span><span>AMEX</span><span>APPLE PAY</span><span>GOOGLE PAY</span></div>`;
      R.$("#bagRm").onclick = () => { R.update({ bag: null }); R.renderBadge(); R.openBag(); };
      if (U) R.$("#bagUp").onclick = () => { R.track("BumpAccepted", { from: id, to: U.id, where: "bag" }, true); if (U.call && !CFG.testMode && !CFG.checkout[U.id]) { location.href = U.file; return; } R.update({ bag: U.id }); R.renderBadge(); R.openBag(); };
      R.$("#bagGo").onclick = () => R.goCheckout(id);
    }
    R.$("#bag").classList.add("open"); R.$("#bagScrim").classList.add("open");
  };
  R.goCheckout = (packId) => {
    R.update({ lastCheckout: packId, lastCheckoutAt: Date.now() });
    const P = C.packs[packId];
    R.track("InitiateCheckout", { value: P.price, currency: "GBP", content_name: P.name });
    if (CFG.testMode) { location.href = "checkout.html?pack=" + packId; return; }
    const url = CFG.checkout[packId];
    if (!url) { R.toast("Checkout link for " + P.name + " is not set yet (assets/config.js)."); return; }
    location.href = url;
  };
  R.toast = (msg) => {
    let t = R.$("#reef-toast");
    if (!t) { t = document.createElement("div"); t.id = "reef-toast"; t.className = "toast"; document.body.appendChild(t); }
    t.textContent = msg; t.style.display = "block"; clearTimeout(t._h); t._h = setTimeout(() => t.style.display = "none", 4000);
  };

  /* ---------- header ---------- */
  R.header = (opts) => {
    opts = opts || {};
    const el = document.getElementById("hdr"); if (!el) return;
    el.innerHTML = `${CFG.testMode ? `<div class="testbar">Test mode: payments are simulated · <a href="lab.html">Open the Funnel Lab</a></div>` : ""}
      <div class="ribbon">${opts.ribbon || "Founder pricing ends for good on opening day · <b>205 places</b>"}</div>
      <nav class="nav"><div class="in"><div class="l"><a href="packs.html">Shop packs</a><a class="hide-m" href="index.html?restart=1">Take the quiz</a></div>
      <a class="logo" href="index.html"><img src="assets/logo/reef-lockup-horizontal-gold.png" alt="Reeformer Pilates" width="100" height="40"></a>
      <div class="r">${opts.noBag ? "" : `<button class="bag" type="button" aria-label="Open bag">Bag <i>0</i></button>`}</div></div></nav>`;
    const b = el.querySelector(".bag"); if (b) b.onclick = () => R.openBag();
    R.renderBadge();
  };
  R.trustRow = () => `<div class="trust">
    <div><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 12a9 9 0 1 0 3-6.7M3 4v4h4"/></svg>${CFG.refundDays} day refund window</div>
    <div><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="5" width="18" height="16"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>Credits start on opening day</div>
    <div><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="5" y="11" width="14" height="10"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>Secure checkout</div></div>`;

  /* ---------- video ---------- */
  R.videoHtml = (url, label) => {
    if (url) {
      if (/\.(mp4|webm|mov)(\?|$)/i.test(url)) return `<div class="vsl"><video src="${R.esc(url)}" controls playsinline preload="metadata"></video></div>`;
      return `<div class="vsl"><iframe src="${R.esc(url)}" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen title="${R.esc(label)}"></iframe></div>`;
    }
    return `<div class="vsl" role="img" aria-label="Video coming soon"><img src="assets/img/concept-studio.jpg" alt=""><div><div class="play"></div><div class="ph">${R.esc(label)}</div></div></div>`;
  };

  R.callHtml = (txt) => CFG.callBookingUrl ? `<a class="btn btn-ghost btn-block" href="${R.esc(CFG.callBookingUrl)}" target="_blank" rel="noopener" onclick="REEF.track('Schedule',{},false)">${txt || "Book a 10 minute call with Ricky"}</a>` :
    (CFG.whatsappNumber ? `<a class="btn btn-ghost btn-block" href="https://wa.me/${CFG.whatsappNumber}?text=${encodeURIComponent("Hi Ricky, I've just done the reef quiz and I'd love a quick chat about founder packs.")}" target="_blank" rel="noopener">${txt || "Message Ricky on WhatsApp"}</a>` : "");

  R.footer = () => `<footer class="footer"><img src="assets/logo/reef-lockup-stacked-gold.png" alt="Reeformer Pilates" width="60" height="55">
    <div>reef · Reeformer Pilates · 55 to 57 Wyle Cop, Shrewsbury · <a href="mailto:${CFG.email}">${CFG.email}</a></div>
    <p class="small" style="max-width:640px;margin:14px auto 0">This page shares published research about Pilates. It is information, not personal medical advice. If you have a health condition, are pregnant or are recovering from surgery or injury, speak to your GP, consultant or midwife before starting. Prices from opening day are the standard prices reef will charge once the studio opens. Founder places are limited to the numbers shown and close on opening day.</p></footer>`;

  window.REEF = R;
  R.initTracking();
})();
