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
  R.label = (stepId, val, full) => {
    if (!full && C.short && C.short[stepId] && C.short[stepId][val]) return C.short[stepId][val];
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
    if ((a.barrier === "cost" || a.barrier === "pricey") && r !== "now" && pack !== "founder5") pack = C.order[Math.max(0, C.order.indexOf(pack) - 1)];
    const i = C.order.indexOf(pack);
    return { pack, up: C.order[i + 1] || null, down: C.order[i - 1] || null };
  };

  R.reasons = (a, packId) => {
    const out = [];
    const freqTxt = { "1": "once a week", "2": "twice a week", "3": "three or more times a week", "unsure": "when you can" }[a.freq];
    const P = C.packs[packId];
    if (a.freq === "2" || a.freq === "3") out.push(`You can come ${freqTxt}, which is the same twice a week the published trials used.`);
    if (a.freq === "1") out.push("You said once a week to start. This pack lets you begin there and build to twice, which is where the results in the trials come from.");
    if (a.exp === "0") out.push("Being new to Reformer is the easy bit. An instructor sets your springs on day one and you build from there.");
    if (packId === "founder5") out.push("It is the smallest commitment you can make, and five classes is enough to know whether this is for you.");
    if (packId === "plus") out.push("Fourteen classes is twice a week for seven weeks, which is about how long it takes to stop deciding every time.");
    if (packId === "member") out.push("30 classes over three months takes you right through the twelve week window, then locks your founder rate for a year.");
    if (packId === "year") out.push("96 classes is eight a month for a whole year, with the recovery sessions to go in between.");
    if (+a.pace >= 4 || a.metime === "cant") out.push("Your week is full, so this puts fifty minutes back into it that nobody else can have.");
    if (P.perClassWellness) out.push(`Counting the recovery sessions at what they cost on their own, the classes work out at ${R.money(P.perClassWellness)} each.`);
    return out.slice(0, 4);
  };

  /* ---------- Momence lead ----------
     Posts once, to our own endpoint at /api/quiz-lead, which then writes three
     things into Momence: the lead with every answer on it, the customer profile
     with their name, email and phone, and the tags staff read at a glance.
     The code for that endpoint is in reeformer-pilates/api/quiz-lead.js and the
     Momence passwords live in Vercel, never in this file. ---------- */

  /* One plain paragraph a member of staff can read in ten seconds, before they
     walk over to somebody. Momence strips line breaks out of this field, so it
     must stay a single run of short sentences. */
  R.staffBriefing = (s) => {
    const a = s.answers || {}, out = [];
    const and = (xs) => xs.length < 2 ? (xs[0] || "") : xs.slice(0, -1).join(", ") + " and " + xs[xs.length - 1];

    out.push({ "0": "New to Reformer.", "1-5": "Has done 1 to 5 Pilates classes.",
               "6-20": "Has done 6 to 20 Pilates classes.", "20+": "Has done 20 or more Pilates classes." }[a.exp] || "");

    const who = [a.sex === "f" ? "Woman" : a.sex === "m" ? "Man" : "",
                 a.age === "70s" ? "70 or over" : a.age || ""].filter(Boolean).join(", ");
    if (who) out.push(who + ".");

    const goal = { strength: "feel strong again", posture: "stand tall and stop their back aching",
                   shape: "tone up and feel good in their body", calm: "feel calmer and sleep better",
                   resilient: "move freely without the twinges", comeback: "feel like themselves again" }[a.goal];
    if (goal) out.push("Wants to " + goal + ".");

    const sore = (a.body || []).filter((b) => b !== "none").map((b) => R.label("body", b).toLowerCase());
    out.push(sore.length ? "Stiff in the " + and(sore) + "." : (a.body || []).includes("none") ? "Nothing aching yet." : "");

    const day = { desk: "Sits at a desk or drives all day", feet: "On their feet all day",
                  rush: "Always rushing", parent: "Busy with family", flex: "Retired or flexible days" }[a.day];
    if (day) out.push(day + (a.pace ? ", week is " + a.pace + " out of 5 for busy" : "") + ".");
    else if (a.pace) out.push("Week is " + a.pace + " out of 5 for busy.");

    if (a.metime === "cant") out.push("Cannot remember their last hour to themselves.");
    else if (a.metime === "month") out.push("Last hour to themselves was weeks ago.");

    const freq = { "1": "Can come once a week.", "2": "Can come twice a week.",
                   "3": "Can come three or more times a week.", unsure: "Not sure yet how often they can come." }[a.freq];
    if (freq) out.push(freq);

    const worry = { intimidated: "feeling out of place", notfit: "not feeling fit enough", time: "no time",
                    cost: "the cost", injury: "an old injury", gym: "the gym never sticking",
                    nearby: "no studio nearby", full: "classes always being full", far: "the studio being too far",
                    pricey: "it being too expensive", busy: "life getting busy", bored: "getting bored" }[a.barrier];
    if (worry) out.push("Main worry is " + worry + ".");

    const ready = { now: "Ready to start now.", keen: "Keen, just needs the right plan.", curious: "Only curious so far." }[a.ready];
    if (ready) out.push(ready);

    if (C.packs[s.pack]) out.push("Matched pack: " + C.packs[s.pack].name + ".");

    return out.filter(Boolean).join(" ").replace(/\s+/g, " ").trim();
  };

  // Human readable values, because a member of staff reads these, not a machine.
  R.leadFields = (s) => {
    const a = s.answers || {}, sh = C.short || {};
    const lbl = (k, v) => (sh[k] && sh[k][v]) || v || "";
    return {
      staffBriefing:         R.staffBriefing(s),
      pilatesProfile:        C.profileName(a),
      recommendedPack:       (C.packs[s.pack] || {}).name || "",
      mainGoal:              lbl("goal", a.goal),
      pilatesExperience:     lbl("exp", a.exp),
      stiffAreas:            (a.body || []).map((b) => lbl("body", b)).join(", "),
      typicalDay:            lbl("day", a.day),
      weekBusyness:          a.pace == null ? "" : Number(a.pace),   // a Number in Momence
      lastTimeForThemselves: lbl("metime", a.metime),
      whatStoppedThem:       lbl("barrier", a.barrier),
      ageBand:               lbl("age", a.age),
      gender:                lbl("sex", a.sex),
      classesPerWeek:        lbl("freq", a.freq),
      readinessToStart:      lbl("ready", a.ready),
      smsConsent:            s.sms ? "Yes" : "No",
      utmSource:             (s.utm && (s.utm.utm_source || s.utm.source)) || ""
    };
  };

  // The few things an instructor wants to see without opening anything.
  // Every name here must exist as a tag in Momence or it is quietly skipped.
  R.leadTags = (s) => {
    const a = s.answers || {}, sh = C.short || {}, t = ["Quiz completed"];
    const exp = { "0": "New to Pilates", "1-5": "Pilates: 1 to 5 classes", "6-20": "Pilates: 6 to 20 classes", "20+": "Pilates: 20+ classes" };
    if (exp[a.exp]) t.push(exp[a.exp]);
    (a.body || []).forEach((b) => { if (b !== "none" && sh.body && sh.body[b]) t.push("Stiff: " + sh.body[b]); });
    if (sh.freq && sh.freq[a.freq]) t.push("Can come: " + sh.freq[a.freq]);
    if (C.packs[s.pack]) t.push("Match: " + C.packs[s.pack].name);
    return t;
  };

  R.sendLead = async (s) => {
    const m = CFG.momence || {};
    const fields = R.leadFields(s), tags = R.leadTags(s);

    if (CFG.testMode && !m.liveLeads) {
      const log = (R.load().testLeads || []);
      log.push({ at: new Date().toISOString(), name: (s.answers || {}).name, email: s.email, phone: s.phone, fields: fields, tags: tags });
      R.update({ testLeads: log.slice(-50) });
      console.info("[reef TEST] lead captured, not sent", log[log.length - 1]);
      return;
    }

    // Rename our keys to whatever the Momence custom field Codes actually are.
    const codes = m.fieldCodes || {}, out = {};
    Object.keys(fields).forEach((k) => {
      const code = Object.prototype.hasOwnProperty.call(codes, k) ? codes[k] : k;
      if (code && fields[k] !== "") out[code] = fields[k];
    });

    const payload = {
      name: (s.answers || {}).name || "",
      email: s.email,
      phone: s.phone || "",
      website: "",                       // honeypot, stays empty
      fields: m.sendQuizAnswers === false ? {} : out,
      tags: tags
    };

    const post = (url, body) => fetch(url, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body), keepalive: true
    });

    if (m.endpoint) {
      try { await post(m.endpoint, payload); }
      catch (e) { console.warn("[reef] lead endpoint failed", e); }
    } else {
      console.warn("[reef] momence.endpoint not set in config.js. Lead not sent.");
    }

    if (m.backupWebhook) { try { await post(m.backupWebhook, payload); } catch (e) {} }
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
  R.totalPlaces = () => Object.keys(CFG.places).reduce((n, k) => n + (CFG.places[k].total || 0), 0);
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
      bd.innerHTML = `${justAdded ? `<p class="small" style="color:var(--ok);margin:0 0 14px">✓ Added to your bag${n ? ", " + R.esc(n) : ""}.</p>` : ""}
        <div class="line-item">${R.img(P.imgs[0], "", false)}<div><div class="caps" style="color:var(--deep)">${P.name}</div><div class="small muted">${P.classes} Reformer classes. ${P.validity}.</div><span class="badge" style="margin-top:8px">${P.badge}</span></div><div style="text-align:right"><b>${R.money(P.price)}</b><br><span class="small muted">${R.money(P.value)} at opening day prices</span></div></div>
        <button class="link-quiet" id="bagRm" type="button" style="padding:8px 0">Remove</button>
        ${U ? `<div class="card" style="margin-top:18px;background:rgba(234,243,244,.85);border-color:var(--sky)"><span class="badge blue">${+U.perClass < +P.perClass ? "Pay less per class" : "One thing before you check out"}</span><h3 style="margin:12px 0 6px;font-size:19px">${U.name} for ${R.money(P.bump.extra)} more</h3><p style="margin:0 0 6px;font-weight:700;color:var(--deep)">${+U.perClass < +P.perClass ? `${R.money(U.perClass)} a class instead of ${R.money(P.perClass)}` : `${U.classes} classes instead of ${P.classes}`}</p><p class="small" style="margin:0 0 12px">${P.bump.line}</p><button class="btn btn-ghost btn-block" id="bagUp" type="button">Upgrade to ${U.name}</button></div>` : ""}
        <div style="margin-top:18px">${R.guarantee(true)}</div>`;
      ft.innerHTML = `<div style="display:flex;justify-content:space-between;margin-bottom:4px"><span class="caps">Subtotal</span><b>${R.money(P.price)}</b></div>
        <div class="small" style="color:var(--blue);margin-bottom:12px"><b>${R.money(P.perClass)} a class</b>, against ${R.money(WALKIN)} a class from opening day</div>
        <button class="btn btn-gold btn-block pulse" id="bagGo" type="button">🔒 Checkout securely · ${R.money(P.price)}</button>
        <p class="small center muted" style="margin:8px 0 0">🛡️ You have your usual ${CFG.refundDays} days to change your mind.</p>
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
      <div class="ribbon">${opts.ribbon || `Founder pricing ends for good on opening day · <b>${R.totalPlaces()} places</b>`}</div>
      <nav class="nav"><div class="in"><div class="l"><a href="packs.html">Shop packs</a><a class="hide-m" href="index.html?restart=1">Take the quiz</a></div>
      <a class="logo" href="index.html"><img src="assets/logo/reef-lockup-horizontal-gold.png" alt="reef" width="100" height="40"></a>
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

  R.footer = () => `<footer class="footer"><img src="assets/logo/reef-lockup-stacked-gold.png" alt="reef" width="60" height="55">
    <div>reef · 57 Wyle Cop, Shrewsbury · <a href="mailto:${CFG.email}">${CFG.email}</a></div>
    <p class="small" style="max-width:640px;margin:14px auto 0">This page shares published research about Pilates. It is information, not personal medical advice. If you have a health condition, are pregnant or are recovering from surgery or injury, speak to your GP, consultant or midwife before starting. Prices from opening day are the standard prices reef will charge once the studio opens. Founder places are limited to the numbers shown and close on opening day.</p></footer>`;

  /* ---------- most expensive first, then 2 more ---------- */
  R.recommend3 = (a) => {
    const m = R.recommend(a).pack, out = ["year"];
    const add = (id) => { if (id && !out.includes(id) && out.length < 3) out.push(id); };
    add(m === "year" ? "member" : m);
    const second = out[1];
    add(C.packs[second].down); add(C.packs[second].bump && C.packs[second].bump.to);
    ["member", "plus", "founder5"].forEach(add);
    return { list: out, matched: m };
  };

  /* ---------- price framing: make every pack feel small ---------- */
  const WALKIN = 25;
  R.walkin = WALKIN;
  C.frames = {
    year: { weekly: "eight classes a month, every month, for a whole year", weeks: 52, daily: true },
    member: { weekly: "about two to three classes a week for three months", weeks: 13 },
    plus: { weekly: "twice a week for your first seven weeks", weeks: 7 },
    founder5: { weekly: "five classes to feel the difference for yourself", weeks: null }
  };
  R.frame = (id) => {
    const P = C.packs[id], f = C.frames[id], per = +P.perClass;
    const pct = Math.round((1 - per / WALKIN) * 100);
    return {
      per: R.money(P.perClass), pct,
      weekly: f.weekly,
      perWeek: f.weeks ? R.money((P.price / f.weeks).toFixed(2)) : null,
      perDay: f.daily ? R.money((P.price / 365).toFixed(2)) : null,
      line: `That is ${f.weekly}, and it works out at ${R.money(P.perClass)} a class. From opening day a single class is £${WALKIN}.`,
      vsLine: `${R.money(P.perClass)} a class now, £${WALKIN} a class from opening day`
    };
  };
  // The big price block: price per session HUGE, full price small
  R.priceBlock = (id, opts) => {
    opts = opts || {}; const P = C.packs[id], F = R.frame(id);
    return `<div class="pblock ${opts.light ? "light" : ""}">
      <div class="pb-per"><span class="pb-big" data-count="${P.perClass}">${F.per}</span><span class="pb-unit">a class</span></div>
      <div class="pb-sub"><span>A single class is £${WALKIN} from opening day</span></div>
      <div class="pb-total">${R.money(P.price)} in total${P.id === "year" ? ", paid once" : ""}</div>
      <p class="pb-line">That is <b>${F.weekly}</b>${F.perDay ? `, which comes to about <b>${F.perDay} a day</b>` : F.perWeek ? `, which comes to about <b>${F.perWeek} a week</b>` : ""}.</p>
    </div>`;
  };

  /* ---------- reassurance ---------- */
  R.guarantee = (compact) => {
    const G = CFG.guarantee;
    return `<div class="guar ${compact ? "compact" : ""} reveal"><div class="seal"><svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="29" fill="none" stroke="currentColor" stroke-width="2"/><circle class="ring2" cx="32" cy="32" r="23" fill="none" stroke="currentColor" stroke-width="1.2" stroke-dasharray="2 3"/><path d="M21 33l7 7 15-16" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
      <div><div class="g-name">${R.esc(G.name)}</div><div class="g-sub">Here is exactly what you are covered for.</div>
      <ul class="g-list">${G.lines.map(l => `<li>${R.esc(l)}</li>`).join("")}</ul></div></div>`;
  };
  R.reassure = () => `<div class="chips-pop">
    <span class="chip-pop float1">🛡️ ${CFG.refundDays} days to change your mind</span><span class="chip-pop float2">🔒 Secure checkout</span>
    <span class="chip-pop float3">📅 Starts on opening day</span><span class="chip-pop float1">✨ No experience needed</span>
    <span class="chip-pop float2">💛 Founder price locked</span></div>`;
  R.ticker = () => {
    const items = [`Your usual ${CFG.refundDays} day cancellation right`, "Your classes start on opening day, so a delay never costs you one", "A founder price that is never offered again", "No joining fee and no minimum term", "Open 5am to 10pm, every day", "Three Guest Passes so friends come free", "Car park two minutes away, free after 6pm at the time of writing"];
    const row = items.map(i => `<span>✦ ${i}</span>`).join("");
    return `<div class="ticker" aria-label="${items.join(". ")}"><div class="tk-in">${row}${row}</div></div>`;
  };
  R.benefitsNow = (id) => {
    const P = C.packs[id], F = R.frame(id);
    return `<div class="why-now reveal"><div class="caps" style="color:var(--gold);margin-bottom:10px">Why this is cheaper today than it will ever be again</div>
      <ul class="ticks"><li><b>${F.per} a class instead of £${WALKIN}.</b> That is what a single class costs from opening day, and this price is not offered again.</li>
      <li><b>Founders book first.</b> You get the pick of the timetable before anyone else does, which matters at 7am on a Monday.</li>
      <li>Change your mind within ${CFG.refundDays} days of buying online and you get a full refund, and until we open your classes simply sit there waiting for you.</li>
      <li><b>Three Guest Passes</b>, so three friends get a free first class and you do not have to walk in on your own.</li>
      <li>There are only <b>${CFG.places[id].total} places</b> at this price. Once they are taken, that is the end of it.</li></ul></div>`;
  };

  /* ---------- motion: reveal on scroll + count up ---------- */
  R.animate = () => {
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.documentElement.classList.add("js-anim");
    R.scrollFx();
    document.querySelectorAll(".ticks").forEach(ul => ul.querySelectorAll("li").forEach((li, i) => { li.classList.add("reveal", "rv-li"); li.style.transitionDelay = (i * 70) + "ms"; }));
    document.querySelectorAll(".split > div:first-child").forEach(e => e.classList.add("reveal", "rv-l"));
    document.querySelectorAll(".split > div:last-child").forEach(e => e.classList.add("reveal", "rv-r"));
    document.querySelectorAll(".img:not(.illo)").forEach(e => e.classList.add("reveal", "rv-zoom"));
    const els = document.querySelectorAll(".reveal:not(.in), .card, .stat, .pcard, .tile, details, .guar, .why-now, .reco, .vslx, .fact, .pblock, .chip-pop");
    const count = (el) => {
      const target = parseFloat(el.dataset.count); if (isNaN(target) || el._done) return; el._done = true;
      if (reduce) return; const m = el.textContent.trim().match(/^(£?)([\d.,]+)(.*)$/); if (!m) return;
      const t0 = performance.now(), dur = 1100, dec = (m[2].split(".")[1] || "").length, pre = m[1], suf = m[3];
      const step = (t) => { const k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3); el.textContent = pre + (target * e).toFixed(dec) + suf; if (k < 1) requestAnimationFrame(step); };
      requestAnimationFrame(step);
    };
    if (reduce || !("IntersectionObserver" in window)) { els.forEach(e => e.classList.add("in")); return; }
    const io = new IntersectionObserver((ents) => ents.forEach(en => { if (en.isIntersecting) { en.target.classList.add("in"); en.target.querySelectorAll("[data-count]").forEach(count); io.unobserve(en.target); } }), { threshold: 0, rootMargin: "600px 0px 100px 0px" });
    els.forEach((e, i) => { e.classList.add("reveal"); if (!e.style.transitionDelay) e.style.transitionDelay = (i % 4) * 60 + "ms"; io.observe(e); });
    // safety: anything still hidden after 2.5s becomes visible
    setTimeout(() => document.querySelectorAll(".reveal:not(.in)").forEach(e => { const r = e.getBoundingClientRect(); if (r.top < innerHeight * 2) e.classList.add("in"); }), 1200);
  };

  /* ---------- VSL slot (talking head) ---------- */
  R.vsl = (key, opts) => {
    opts = opts || {}; const V = C.vsls[key] || { title: "Video", hook: "", beats: [], len: "", who: "" };
    const url = CFG.videos[key];
    if (url) return R.videoHtml(url, V.title);
    if (!CFG.showVideoPlaceholders) return "";
    return `<div class="vslx ${opts.wide ? "wide" : ""}" role="img" aria-label="${R.esc(V.title)}: video coming soon">
      <div class="vx-bg"></div>
      <svg class="vx-person" viewBox="0 0 200 240" aria-hidden="true"><circle cx="100" cy="78" r="38"/><path d="M28 240c0-52 32-86 72-86s72 34 72 86z"/></svg>
      <div class="vx-top"><span class="vx-live"><i></i>VSL</span><span class="vx-len">${R.esc(V.len)}</span></div>
      <div class="vx-mid"><div class="vx-play"></div><div class="vx-t">${R.esc(V.title)}</div><div class="vx-w">${R.esc(V.who)} speaking to camera · coming soon</div></div>
      <div class="vx-cap"><span>${R.esc(V.hook)}</span></div>
      ${CFG.testMode && V.beats.length ? `<details class="vx-beats"><summary>Script outline</summary><ol>${V.beats.map(b => `<li>${R.esc(b)}</li>`).join("")}</ol></details>` : ""}
    </div>`;
  };
  R.moves = () => `<p class="swipe-hint">Swipe to see more →</p><div class="moves">${C.moves.map(m => `<figure class="move"><div class="mv-n">${m[0]}</div><figcaption><b>${m[1]}</b><span>${m[2]}</span></figcaption></figure>`).join("")}</div>`;

  /* ---------- scroll FX: progress bar, parallax, carriage slide ---------- */
  R.scrollFx = () => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let bar = document.getElementById("sbar");
    if (!bar) { bar = document.createElement("div"); bar.id = "sbar"; document.body.appendChild(bar); }
    let ticking = false;
    const run = () => {
      const y = scrollY, h = document.documentElement.scrollHeight - innerHeight;
      bar.style.transform = `scaleX(${h > 0 ? Math.min(1, y / h) : 0})`;
      document.querySelectorAll(".hero-img > img").forEach(img => { const r = img.parentElement.getBoundingClientRect(); if (r.bottom > 0 && r.top < innerHeight) img.style.transform = `translateY(${(-r.top * 0.18).toFixed(1)}px) scale(1.08)`; });
      document.querySelectorAll(".img.illo img").forEach(img => { const r = img.getBoundingClientRect(); if (r.bottom > 0 && r.top < innerHeight) { const p = (r.top + r.height / 2) / innerHeight - .5; img.style.transform = `translateX(${(p * -26).toFixed(1)}px) scale(1.06)`; } });
      ticking = false;
    };
    addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(run); } }, { passive: true });
    run();
  };

  window.REEF = R;
  R.initTracking();
})();
