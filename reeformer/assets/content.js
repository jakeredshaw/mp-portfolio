/* reef founder funnel: all copy and personalisation modules.
   House rules: no dashes or hyphens in customer copy, "reef" always lowercase,
   no invented reviews or numbers, every statistic carries its source (from The Reformer Pilates Manual). */
(function () {
  const C = {};

  /* ------------------------------------------------------------------ PACKS */
  C.packs = {
    founder5: {
      id: "founder5", file: "founder-5.html", imgs: ["concept-studio-pr", "concept-coffee-pl", "concept-lounge-pc"], name: "Founder 5", price: 99, badge: "Best first step",
      classes: 5, value: 125, save: 26, perClass: "19.80", perClassWellness: null,
      validity: "Use them any time in your first three months",
      tagline: "Five classes, and by the third one you'll know whether this is yours.",
      sub: "The smallest commitment you can make. Five classes at £19.80 each, in the middle of Shrewsbury, with no experience needed.",
      stack: [
        ["5 Reformer classes", 125],
        ["Guided moves on your own screen, every class", null],
        ["Open 5am to 10pm, every day", null],
        ["3 Guest Passes to give friends a free first class", null]
      ],
      bump: { to: "plus", extra: 200, line: "For £200 more, Founder Plus gives you 14 classes, red light, recovery boots and a reef tote. That's £465 at our prices from opening day." },
      down: null,
      call: false
    },
    plus: {
      id: "plus", file: "founder-plus.html", imgs: ["concept-lounge-pc", "concept-studio-pc", "concept-coffee-pc"], name: "Founder Plus", price: 299, badge: "Our pick",
      classes: 14, value: 465, save: 166, perClass: "21.36", perClassWellness: "13.14",
      validity: "Use them any time in your first six months",
      tagline: "Fourteen classes is twice a week for seven weeks, which is long enough to stop deciding.",
      sub: "Fourteen classes, a red light session, recovery boots and a tote. £299 for the first 60 people in Shrewsbury, and never this price again.",
      stack: [
        ["14 Reformer classes", 350],
        ["1 red light session", 65],
        ["1 recovery boots session", 50],
        ["A reef tote, our gift to you", null],
        ["3 Guest Passes to give friends a free first class", null]
      ],
      bump: { to: "member", extra: 250, line: "Make it a habit. Founding Member gives you 30 classes, a hyperbaric session and your founder monthly rate locked for 12 months after. £250 more." },
      down: "founder5",
      call: false
    },
    member: {
      id: "member", file: "founding-member.html", imgs: ["concept-studio-pl", "concept-hallway-pr", "concept-lounge-pr"], name: "Founding Member", price: 549, badge: "Build the habit",
      classes: 30, value: 940, save: 391, perClass: "18.30", perClassWellness: "11.97",
      validity: "3 months of membership from opening day, then your founder rate locked for 12 months",
      tagline: "Thirty classes over three months, and then your founder rate stays locked for a year.",
      sub: "£940 of reef for £549, plus a monthly rate nobody can buy after opening day. 40 places.",
      stack: [
        ["30 Reformer classes (10 a month for 3 months)", 750],
        ["1 hyperbaric session", 75],
        ["1 red light session", 65],
        ["1 recovery boots session", 50],
        ["Founder merch bundle", null],
        ["Your founder monthly rate, locked for 12 months after", null],
        ["3 Guest Passes to give friends a free first class", null]
      ],
      bump: { to: "year", extra: 950, line: "Going all in? Founding Year is 96 classes, 12 wellness sessions, the full merch collection and your name on the Founders Wall. £3,160 of reef for £1,499." },
      down: "plus",
      call: true
    },
    year: {
      id: "year", file: "founding-year.html", imgs: ["concept-coffee-pl", "concept-studio-pr", "concept-lounge-pc", "concept-hallway-pc"], name: "Founding Year", price: 1499, badge: "The Founding 25",
      classes: 96, value: 3160, save: 1661, perClass: "15.61", perClassWellness: null,
      validity: "12 months from opening day. About £125 a month, paid once",
      tagline: "Eight classes a month, every month, for a year. This is the one that changes something.",
      sub: "96 Reformer classes, 12 wellness sessions, the full merch collection and your name on the wall. £3,160 of reef for £1,499. 25 places, then never again.",
      stack: [
        ["96 Reformer classes (8 a month for 12 months)", 2400],
        ["4 hyperbaric sessions", 300],
        ["4 red light sessions", 260],
        ["4 recovery boots sessions", 200],
        ["The full reef merch collection", null],
        ["Your name on The Founding 25 panel of the Founders Wall", null],
        ["3 Guest Passes to give friends a free first class", null]
      ],
      bump: null,
      down: "member",
      call: true
    }
  };
  C.order = ["founder5", "plus", "member", "year"];

  /* ------------------------------------------------------------------ QUIZ */
  // type: single (auto advance), multi, scale, text, hook (interstitial)
  // NHS mini guess, shown on the first encouragement screen
  const NHS_GUESS = { q: "Quick guess! The NHS says adults should do strength exercise how many days a week?", opts: ["1 day", "2 days", "5 days"], answer: "2 days",
    reveal: "2 days a week, and the NHS names Pilates as one way to do it. That's why your plan is 2 classes a week." };

  C.steps = [
    { id: "name", type: "text", q: "What is your full name?", help: "Your first name, then your surname. We need both to build your plan.", cta: "Let's go" },
    { id: "goal", type: "single", q: "{n}, picture yourself 3 months from now. What has changed?",
      opts: [
        ["strength", "I feel strong again.", "💪"],
        ["posture", "I stand tall and my back feels good.", "🧍"],
        ["shape", "I'm toned and I love how I feel.", "✨"],
        ["calm", "I'm calmer and I sleep better.", "🌊"],
        ["resilient", "I move freely. No more twinges.", "🦵"],
        ["comeback", "I feel like me again.", "🌱"]
      ] },
    { id: "exp", type: "single", q: "Have you done Pilates before?",
      opts: [["0", "Never"], ["1-5", "A few times (1 to 5 classes)"], ["6-20", "Quite a bit (6 to 20 classes)"], ["20+", "Lots (20+ classes)"]] },
    { id: "hook_exp", type: "hook" },
    { id: "body", type: "multi", q: "Where do you feel stiff or achy?", help: "Pick all that apply.",
      opts: [["back", "Lower back"], ["neck", "Neck and shoulders"], ["hips", "Hips"], ["knees", "Knees"], ["none", "Nowhere yet"]] },
    { id: "hook_body", type: "hook" },
    { id: "day", type: "single", q: "What's your normal day like?",
      opts: [["desk", "Sitting at a desk or driving"], ["feet", "On my feet all day"], ["rush", "Always rushing"], ["parent", "Busy with my family"], ["flex", "Retired or flexible"]] },
    { id: "pace", type: "scale", q: "How busy is your week?", lo: "Calm", hi: "Flat out" },
    { id: "hook_pace", type: "hook" },
    { id: "metime", type: "single", q: "When did you last have an hour just for you?",
      opts: [["week", "This week"], ["month", "This month"], ["cant", "I can't remember"]] },
    { id: "barrier", type: "single",
      q: (a) => (a.exp === "6-20" || a.exp === "20+") ? "What's stopped you doing Reformer Pilates more often?" : "What's stopped you starting Reformer Pilates before now?",
      optsFor: (a) => (a.exp === "6-20" || a.exp === "20+")
        ? [["full", "Classes were always full"], ["far", "The studio was too far away"], ["pricey", "It got too expensive"], ["injury", "An injury set me back"], ["busy", "Life got too busy"], ["bored", "I got bored of the same class"]]
        : [["intimidated", "I was nervous I'd feel out of place"], ["notfit", "I didn't feel fit enough"], ["time", "I didn't have time"], ["cost", "I was worried about the cost"], ["injury", "I have an old injury"], ["gym", "The gym never stuck for me"], ["nearby", "There was no studio nearby"]],
      opts: [["intimidated", "Feeling out of place"], ["notfit", "Not fit enough"], ["time", "No time"], ["cost", "Cost"], ["injury", "Old injury"], ["gym", "Gym never stuck"], ["nearby", "No studio nearby"], ["full", "Classes always full"], ["far", "Studio too far"], ["pricey", "Too expensive"], ["busy", "Life got busy"], ["bored", "Bored of the same class"]] },
    { id: "hook_barrier", type: "hook" },
    { id: "age", type: "single", q: "How old are you?",
      opts: [["20s", "20s"], ["30s", "30s"], ["40s", "40s"], ["50s", "50s"], ["60s", "60s"], ["70s", "70+"]] },
    { id: "sex", type: "single", q: "Are you…",
      opts: [["f", "A woman"], ["m", "A man"], ["x", "Rather not say"]] },
    { id: "freq", type: "single", q: "How often could you come?", help: "We're open 5am to 10pm, every day.",
      opts: [["1", "Once a week"], ["2", "Twice a week"], ["3", "3 or more times a week"], ["unsure", "Not sure yet"]] },
    { id: "ready", type: "single", q: "Last one! How ready are you to start?",
      opts: [["now", "Ready now"], ["keen", "Keen. I just need the right plan"], ["curious", "Just curious"]] },
    { id: "capture", type: "capture" }
  ];

  C.short = {
    goal: { strength: "Feel strong again", posture: "Stand tall, back feels good", shape: "Toned and feeling great", calm: "Calmer, sleeping better", resilient: "Move freely, no twinges", comeback: "Feel like me again" },
    exp: { "0": "Never", "1-5": "1 to 5", "6-20": "6 to 20", "20+": "20+" },
    body: { back: "Lower back", neck: "Neck and shoulders", hips: "Hips", knees: "Knees", none: "Nowhere yet" },
    day: { desk: "Desk or driving", feet: "On my feet all day", rush: "Always rushing", parent: "Busy with family", flex: "Retired or flexible" },
    metime: { week: "This week", month: "This month", cant: "Can't remember" },
    barrier: { intimidated: "Feeling out of place", notfit: "Not fit enough", time: "No time", cost: "The cost", injury: "An injury", gym: "The gym never stuck", nearby: "No studio nearby", full: "Classes always full", far: "Studio too far", pricey: "Too expensive", busy: "Life got busy", bored: "Bored of the same class" },
    age: { "20s": "20s", "30s": "30s", "40s": "40s", "50s": "50s", "60s": "60s", "70s": "70+" },
    sex: { f: "Woman", m: "Man", x: "Rather not say" },
    freq: { "1": "Once a week", "2": "Twice a week", "3": "3+ a week", unsure: "Not sure yet" },
    ready: { now: "Ready now", keen: "Keen", curious: "Curious" }
  };

  // Encouragement screens: short title, punchy fact cards, sometimes a quick tap to answer.
  // facts: [big, line, source]
  C.hooks = {
    hook_exp(a) {
      if (a.exp === "0") return { kicker: "Good news, {n}", title: "You don't need any experience.",
        facts: [["No experience needed", "Your instructor sets the machine up for you, then walks you through your first slow, shaky, brilliant session."], ["The springs help you", "They lift and support you at first, then make every move burn once you're ready."], ["The world's No.1 workout", "Pilates is the most booked workout on ClassPass worldwide, three years running.", "ClassPass, 2025"]],
        quiz: NHS_GUESS };
      if (a.exp === "1-5") return { kicker: "Great, {n}", title: "You've made a start. We'll make the rest easy.",
        line: "Never used the machine? Not sure what to do? That's normal. Here's how we help.",
        facts: [["We set it up for you", "An instructor sets your springs and footbar on day one."], ["Every move on screen", "Each move is shown on a screen right in front of you."], ["You're in control", "The bed only moves when you push it."]],
        quiz: NHS_GUESS };
      return { kicker: "Love it, {n}", title: "Now make it part of your week.",
        facts: [["9 beds on Wyle Cop", "Warm lights, music in your ears, and that deep burn you've been missing."], ["Open 5am to 10pm", "Every day, so it fits around your week."], ["800+ guided classes", "On your own screen, whenever you want."]],
        quiz: NHS_GUESS };
    },
    hook_body(a) {
      const b = (a.body || []).filter(x => x !== "none");
      if (!b.length) return { kicker: "Smart, {n}", title: "Start before anything hurts.",
        facts: [["Most adults don't do enough", "Only about 1 in 20 adults in England do enough exercise to keep their muscles strong.", "Strain et al, 253,423 adults"], ["You'll feel it in 12 weeks", "Most Pilates studies last 12 weeks, and that's where they see real changes. Taller. Stronger. Calmer."]] };
      if (b.includes("back")) return { kicker: "We hear you, {n}", title: "Back pain is common, and resting it is rarely the whole answer.",
        facts: [["Pilates lowers back pain", "In 10 studies, people who did Pilates had less back pain than people who did almost nothing.", "Cochrane review, 510 adults"], ["You're not alone", "About 1 in 6 adults in England live with back pain.", "Versus Arthritis"], ["Gentle on your body", "The bed glides smoothly under you. No jumping, no pounding, just a slow, deep burn."]] };
      if (b.includes("neck")) return { kicker: "We hear you, {n}", title: "That tight neck probably comes from your phone and your desk.",
        facts: [["Your phone strains your neck", "Looking down at a phone makes your head feel about 5 times heavier to your neck.", "Hansraj, 2014"], ["Reformer straightens you up", "In one study, beginners held their heads much straighter after a Reformer course.", "Sim et al, 2022"]] };
      return { kicker: "We hear you, {n}", title: "Stiff joints loosen up with gentle movement, not more sitting still.",
        facts: [["Gentle on your joints", "The bed glides smoothly under you and supports you the whole time. No jumping, no pounding."], ["Pilates makes you more flexible", "Across 12 studies, people got more flexible. It's one of the most reliable results in the research.", "Bajčetić et al, 2026"]] };
    },
    hook_pace(a) {
      if ((+a.pace || 3) >= 4) return { kicker: "Read this, {n}", title: "This hour is just for you.",
        line: "50 minutes. Headphones on, warm lights down, and nobody needs a single thing from you.",
        facts: [["Reformer lowers anxiety", "Across controlled trials Pilates lowered anxiety, and it's one of the largest effects the Pilates trials recorded for anything they measured.", "Fleming and Herring, 2018"], ["Then, a coffee you'll crave", "After a leg shaking, glowing session, sink into the lounge with a rich, velvety flat white, made by hand just for you."]] };
      return { kicker: "Perfect, {n}", title: "A calm week is the best time to start.",
        facts: [["2 classes a week", "That's what the research used, so it's what your plan uses."], ["You'll feel it in 12 weeks", "Long enough to feel stronger and stand taller. Short enough to stick with it."]] };
    },
    hook_barrier(a) {
      const FAIR = [["Founders hear first", "You'll hear about our opening offer before anyone else."], ["No hidden fees", "No joining fee, and no contract tying you in."], ["No pressure", "This quiz is free and commits you to nothing."]];
      const H = {
        intimidated: ["You won't feel out of place.", [["Coffee first, not mirrors", "You walk into the smell of fresh coffee and soft, warm lighting. Not a cold wall of mirrors."], ["Nobody is watching", "You have your own screen and headphones."], ["Everyone is new", "Every founder starts the week we open, so nobody else knows what they're doing either."]]],
        notfit: ["You don't need to be fit to start.", [["We start you easy", "Light springs to start. You'll still feel that deep, satisfying shake."], ["Built for beginners", "Beginners and pro athletes use the same machine, just on different settings."], ["Pros use it too", "Professional athletes train on the exact same machine you'll use."]]],
        time: ["There's always an hour that works.", [["Open 5am to 10pm", "Every day of the week."], ["No waiting for a class", "A guided class starts the moment you step on a free bed."], ["Park 2 minutes away", "The car park is free after 6pm, at the time of writing."]]],
        cost: ["We'll keep it fair.", FAIR],
        injury: ["Reformer is kind to your body.", [["Gentle on your body", "The bed glides smoothly under you. No jumping, no pounding."], ["The springs can help", "They can take weight off a move, so you can work around a sore spot."], ["We adapt every move", "Tell your instructor on day one and they'll change anything you need."]]],
        gym: ["The gym not sticking wasn't your fault.", [["Gym memberships get wasted", "People in the UK spent £503 million on gym memberships they didn't use, in one year.", "PA Life survey, 2025"], ["People come back to Pilates", "It's the most booked workout on ClassPass worldwide, three years running.", "ClassPass, 2025"], ["You're never on your own", "Every class is guided, so you always know what to do."]]],
        nearby: ["Now there's one.", [["Right on Wyle Cop", "In the middle of Shrewsbury."], ["9 Reformer beds", "A proper studio, not a back room."], ["Founders book first", "You pick your classes before anyone else."]]],
        full: ["Getting a spot is easier here.", [["9 beds", "More beds means more spaces in each class."], ["Start any time", "A guided class starts on any free bed."], ["Founders book first", "You pick your classes before anyone else."]]],
        far: ["We're right in town.", [["Right in town", "On Wyle Cop, in the middle of Shrewsbury."], ["Park 2 minutes away", "At St Julian's Friars car park."], ["Free evening parking", "After 6pm, at the time of writing."]]],
        pricey: ["We'll keep it fair.", FAIR],
        busy: ["We fit around your life.", [["Open 5am to 10pm", "Every day of the week."], ["In and out in 50 minutes", "Walk out glowing, with the car park 2 minutes away."], ["Start any time", "A guided class starts the moment you step on a free bed."]]],
        bored: ["You won't get bored here.", [["800+ guided classes", "On your own screen, so it's never the same twice."], ["Mix it up", "Instructor classes, screen classes and one to one sessions."], ["Recovery too", "Melt under the warm glow of the red light bed, or let the recovery boots gently squeeze your tired legs."]]]
      }[a.barrier] || ["Got it.", []];
      return { kicker: "We've got you, {n}", title: H[0], facts: H[1] };
    }
  };

  /* -------------------------------------------------------------- PROFILES */
  C.profiles = {
    strength: { name: "The Strength Rebuilder", emoji: "💪",
      line: "Get strong enough that stairs, shopping and lifting feel easy again.",
      why: "You want the kind of strength you actually use, so stairs stop being a decision and lifting stops being a job. Reformer is strength training with springs instead of weights, and every muscle works on the way out and on the way back.",
      science: ["strengthGuideline", "chairStand", "nhs"] },
    posture: { name: "The Posture Reset", emoji: "🧍",
      line: "Stand taller and give your back the support it has been missing.",
      why: "You want to stand taller and stop carrying your whole day in your back and shoulders. Joseph Pilates was a sickly child who built this machine to fix his own body, and studies show it helps your posture.",
      science: ["backPain", "headOffCentre", "neckLoad"] },
    shape: { name: "The Sculptor", emoji: "✨",
      line: "Get stronger first. A toned, sculpted body follows.",
      why: "You want to feel great in your body. Reformer works the deep muscles and the long ones together under spring tension, so you can expect to leave shaking a bit and aching in places the gym never found.",
      science: ["core228", "flex", "classpass"] },
    calm: { name: "The Hour Back", emoji: "🌊",
      line: "A calmer mind, deeper sleep, and an hour that is just for you.",
      why: "You want calm, and an hour that's genuinely yours. The breathing is built into every exercise, and studies show it lowers anxiety more than almost anything else they measured.",
      science: ["anxiety", "energy", "classpass"] },
    resilient: { name: "The Resilient Mover", emoji: "🦵",
      line: "Move freely again, on a machine that is kind to your joints.",
      why: "You want to keep moving without the twinges. Reformer is low impact, so the carriage takes some of the work off your joints and the springs let you load the muscle without loading your spine.",
      science: ["backPain", "balance", "flex"] },
    comeback: { name: "The Comeback", emoji: "🌱",
      line: "Feel like yourself again, one class at a time.",
      why: "Life has changed and your body has noticed. Reformer starts wherever you're today, with springs that take some of the weight until you're ready for more, and builds you up a class at a time.",
      science: ["energy", "core228", "nhs"] }
  };
  // desk workers with posture goal get the sharper name
  // Plain plan names built from their answers, e.g. "The Beginner's Strong Back Plan"
  C.profileName = (a) => {
    const b = a.body || [], g = a.goal || "strength";
    let base = ({ strength: "Strength Builder Plan", shape: "Tone and Sculpt Plan", calm: "Stress Relief Plan", comeback: "Fresh Start Plan" })[g];
    if (g === "posture") base = b.includes("back") ? "Strong Back Plan" : b.includes("neck") ? "Neck and Posture Plan" : a.day === "desk" ? "Desk Posture Plan" : "Stand Tall Plan";
    if (g === "resilient") base = b.includes("back") ? "Strong Back Plan" : (b.includes("knees") || b.includes("hips")) ? "Joint Friendly Strength Plan" : "Move Freely Plan";
    return "The " + (a.exp === "0" ? "Beginner's " : "") + base;
  };

  /* -------------------------------------------------------------- SCIENCE */
  C.science = {
    backPain: ["Pilates lowers back pain", "In 10 studies, people who did Pilates had less back pain than people who did almost nothing.", "Cochrane review, 510 adults"],
    headOffCentre: ["Reformer straightens you up", "In one study, beginners held their heads much straighter after a Reformer course.", "Sim et al, 2022"],
    neckLoad: ["Your phone strains your neck", "Looking down at a phone makes your head feel about 5 times heavier to your neck.", "Hansraj, 2014"],
    core228: ["Lighter springs, stronger tummy", "With a lighter spring, people's deep tummy muscles worked more than 3 times harder in the same move.", "Kim et al, 2024"],
    flex: ["Pilates makes you more flexible", "Across 12 studies, people got more flexible. It's one of the most reliable results in the research.", "Bajčetić et al, 2026"],
    anxiety: ["Reformer lowers anxiety", "Across controlled trials Pilates lowered anxiety, and it's one of the largest effects the Pilates trials recorded for anything they measured.", "Fleming and Herring, 2018"],
    energy: ["Pilates gives you more energy", "Across the Pilates trials, people felt less tired and had more energy, and the difference was a big one.", "Fleming and Herring, 2018"],
    balance: ["Better balance after 60", "In studies of adults over 60, Pilates improved balance a lot.", "Barker et al, 2015"],
    chairStand: ["Stronger legs in 12 weeks", "After twelve weeks, women over 60 could stand up from a chair more times in 30 seconds.", "García Garro et al, 2020"],
    strengthGuideline: ["Most adults don't do enough", "Only about 1 in 20 adults in England do enough exercise to keep their muscles strong.", "Strain et al, 253,423 adults"],
    nhs: ["The NHS says 2 days a week", "Adults should do strength exercise at least 2 days a week, and the NHS names Pilates as one way to do it.", "NHS"],
    classpass: ["The world's No.1 workout", "Pilates is the most booked workout on ClassPass worldwide, three years running.", "ClassPass, 2025"],
    gym: ["Gym memberships get wasted", "People in the UK spent £503 million on gym memberships they didn't use, in one year.", "PA Life survey, 2025"]
  };


  /* -------------------------------------------------------------- MODULES */
  C.bodyModules = {
    back: { t: "Your lower back", b: "Around one in six adults in England lives with back pain, and usually there's no single cause to point at. In 10 studies, people with back pain who did Pilates ended up with less pain than people who did almost nothing." },
    neck: { t: "Your neck and shoulders", b: "Upright, your neck carries about 12lb. Tip it forward over a phone and that goes up to about 60lb. Held forward long enough it drags your shoulders with it, and Reformer trains the muscles that pull you back up." },
    hips: { t: "Your hips", b: "Hours of sitting tightens the front of your hips and lets your backside stop pulling its weight. The footwork and the leg work on the Reformer opens the front and wakes up the muscles behind, with the springs controlling every inch." },
    knees: { t: "Your knees", b: "Reformer lets you build the muscles around the knee lying down, with no impact and no body weight on the joint unless you choose it. The springs take the load you can't, and give it back as you get stronger." },
    none: { t: "Keeping it that way", b: "You're starting from a strong place, which is the smartest time to begin. Strength and balance are far easier to keep than to win back, and most Pilates studies see real changes within 12 weeks." }
  };

  C.dayModules = {
    desk: "Hours at a desk or behind the wheel leave their mark. Your head drifts forward, your shoulders round over and your hips get tight. Reformer works all of that in the opposite direction.",
    feet: "On your feet all day, your body is tired but not trained. Reformer lets you lie down and still build serious strength, with the springs supporting your joints instead of loading them.",
    rush: "Always rushing means your body never gets a proper reset. A session starts the moment you step on the bed, so 50 minutes is 50 minutes, and the lounge is there if you want ten more.",
    parent: "When everyone needs you, an hour away is the hardest thing to find and the thing that helps most. We open at 5am and close at 10pm, so you can go when the house is covered.",
    flex: "Flexible days mean you can choose the quiet slots and build a proper routine. Twice a week, every week, is what the studies used."
  };

  C.barrierModules = {
    intimidated: { t: "Worried you'd feel out of place?", b: "We built reef around that worry. You walk into a coffee bar, not a wall of mirrors, and the studio is further in. Your own screen and headphones mean nobody is watching. And every founder starts the week we open, so nobody else in the room knows what they're doing either." },
    notfit: { t: "Think you need to get fit first?", b: "That rule is backwards. You start in order to get fit, not the other way round. The springs set the effort, so you learn on light ones and move up as you get stronger. Pilates builds flexibility, it doesn't ask you to arrive with it." },
    time: { t: "Worried about finding the time?", b: "We're open 5am to 10pm. A guided session begins the moment you step on the bed rather than on the hour, and St Julian's Friars car park is about a two minute walk away." },
    cost: { t: "Worried about the cost?", b: "We get it. There's no joining fee and no contract tying you in, and founders hear about our opening offer before anyone else. This quiz is free and commits you to nothing." },
    injury: { t: "Worried about an old injury?", b: "Reformer is low impact and the carriage supports your joints. A spring can take weight out of a movement as well as add to it, so you train around a niggle. Tell your instructor on day one, and speak to your GP first if you have a condition." },
    gym: { t: "The gym never stuck?", b: "You're not the problem. Britain spends £503 million a year on gym memberships nobody uses. Pilates, meanwhile, was the most booked workout on ClassPass worldwide for the third year running." },
    nearby: { t: "Never had a proper studio nearby?", b: "Now you will. reef is a full Reformer studio right in the middle of Shrewsbury, with nine beds, on Wyle Cop. Founders get first choice before anyone else." },
    full: { t: "Classes always full?", b: "We have nine beds, so a class is a class, not a queue. Digital sessions start the moment you step on a free bed, and founders book before anyone else." },
    far: { t: "Studio too far away?", b: "reef is on Wyle Cop, right in the middle of Shrewsbury. St Julian's Friars car park is a two minute walk away, and it's free after 6pm." },
    pricey: { t: "Got too expensive?", b: "We get it. There's no joining fee and no contract tying you in, and founders hear about our opening offer before anyone else. This quiz is free and commits you to nothing." },
    busy: { t: "Life got busy?", b: "We're open 5am to 10pm, every day. A guided session on your own screen starts whenever you step on a free bed, so you never wait for a class time." },
    bored: { t: "Got bored of the same class?", b: "You get instructor classes, more than 800 guided digital sessions on your own screen, and red light, recovery boots and hyperbaric for recovery." }
  };

  C.decadeModules = {
    "20s": { t: "Your 20s", b: "This is the decade you build the body you'll live in. The habits you set in this decade tend to be the ones you keep." },
    "30s": { t: "Your 30s", b: "Time gets tight and the first niggles arrive. This is the decade to put strength in the bank, while it's still easy to build. A bed and a screen ready from 5am to 10pm fits around everything else." },
    "40s": { t: "Your 40s", b: "The first creaks. Hormones start to shift, muscle starts to slip, and the back starts to complain. Twice a week on the Reformer is the simplest, lowest impact way to hold onto what you have and build more." },
    "50s": { t: "Your 50s", b: "This is the decade to train more cleverly rather than more brutally. Reformer loads the muscle without loading your spine. We will also be straight with you: Pilates holds bone rather than building it, so what it's genuinely brilliant for is strength, posture and balance." },
    "60s": { t: "Your 60s", b: "Balance, posture and confidence on the stairs. In studies of adults over 60, Pilates improved balance a lot. Balance sounds like a small thing, but it's what keeps you living on your own terms." },
    "70s": { t: "Your 70s and beyond", b: "Keep doing everything you love. Start with a lighter spring and a short range, and build. Begin with an instructor who sets everything up for you, and answers the getting on and off question in the first two minutes." }
  };

  C.expModules = {
    "0": "Never done it before? That's honestly the easiest place to start from. Every move has an easier version and a harder one, your first class is with an instructor, and the screen on your bed shows you each move as you go.",
    "1-5": "You have had a taste of it before. A studio in the middle of town, open 5am to 10pm, is what makes it stick this time.",
    "6-20": "You know the shake. Now you get nine beds, more than 800 guided sessions on your own screen and hours that fit your life.",
    "20+": "You're experienced, so you'll want heavier springs, harder progressions and the freedom to train on your own schedule. That's why the screens are there, and why we open early and close late."
  };

  C.menModule = { t: "Yes, Reformer is for men", b: "Joseph Pilates was a boxer, and he built the Reformer to rehabilitate men. Lifters, runners, golfers and riders tend to be surprised by it, because the deep muscles that hold your spine and pelvis work the whole time. We want men on the beds from day one." };

  /* ---------------------------------------------------------------- FAQ */
  C.faq = [
    ["Do I need any experience?", "None at all. Every move has an easier version and a harder one, and your first class is with an instructor who sets your springs and footbar for you."],
    ["When do you open?", "{open}. You'll hear first, by email and text, and founders get first choice of booking slots before anyone else."],
    ["Where do I park?", "St Julian's Friars car park is about a two minute walk away, it's open 24 hours, and at the time of writing it's free after 6pm."],
    ["What are the hours?", "5am to 10pm. Instructor led classes run on the timetable, and digital sessions on your own screen start whenever you step on the bed."],
    ["What should I wear?", "Comfortable fitted clothes you can move in, and grip socks. If you forget your socks there are some on the counter, so don't worry if yours are in the wash."],
    ["I have a health condition, am pregnant or recovering from an injury.", "Please speak to your GP, consultant or midwife before you start, and tell your instructor before your first class. This page shares published research, not personal medical advice."],
    ["Can I bring a friend?", "Yes. Send them this quiz, so they get their own plan too. You don't have to walk in on your own."]
  ];

  C.weeks = [
    ["Weeks 1 to 4", "Learn the machine", "Your instructor sets your springs and shows you the basics: how to move, how to breathe and how to stay in control."],
    ["Weeks 5 to 8", "Feel the change", "Moves that made your legs shake start to feel strong and steady. This is when studies start to see better posture, a stronger middle and more flexibility."],
    ["Weeks 9 to 12", "Own it", "By week 12, studies see less anxiety and more energy. You stand taller, you sleep deeper, and you crave your next class."]
  ];

  /* ------------------------------------------------------------- VSLs
     One talking head video per page. Placeholders show the hook + outline until you paste a video URL into config.js */
  C.vsls = {
    quiz:     { len: "45 sec", who: "Founder", title: "A quick hello from reef", hook: "Let's work out what Reformer would do for you.",
                beats: ["Hook: what would Reformer actually do for you?", "Who we are: a family building reef on Wyle Cop", "What the quiz does: 2 minutes, your own plan", "Call to action: tap the button and start"] },
    result:   { len: "60 sec", who: "Founder", title: "Your plan, explained", hook: "This is exactly how your first twelve weeks will feel.",
                beats: ["Congratulate them on taking the first step", "Twice a week: what the research used", "Why the bigger packs cost less a class", "The Founders Guarantee, and what it does and doesn't cover", "Pick your pack below"] },
    packs:    { len: "60 sec", who: "Founder", title: "Which founder pack is right for you?", hook: "The more classes you buy, the less each one costs.",
                beats: ["The four packs in one sentence each", "Price per class, from £15.61", "Why founder prices end on opening day", "14 day full refund"] },
    founder5: { len: "45 sec", who: "Instructor", title: "Your first five classes", hook: "Five classes is enough to know whether this is for you.",
                beats: ["What happens in your first class", "Springs set for you, no experience needed", "What you'll have learned by the third class", "£19.80 a class, and 14 days to change your mind"] },
    plus:     { len: "45 sec", who: "Founder", title: "Why Founder Plus is our pick", hook: "This is where you'll get stronger. I'd love you to be one of our first.",
                beats: ["Hand on a Reformer bed inside the studio", "14 classes: twice a week for seven weeks", "Red light and recovery boots included", "60 places, then never again"] },
    member:   { len: "3 to 4 min", who: "Founder", title: "The habit that changes everything", hook: "When did the stairs start feeling like a decision?",
                beats: ["The strength cliff: why it happens", "Thirty classes takes you through the twelve week window", "Your founder rate, locked for a year", "The Founders Guarantee", "Book a call or claim your place"] },
    year:     { len: "4 to 5 min", who: "Founder", title: "Your strongest year", hook: "The one rule about getting fit we were all taught backwards.",
                beats: ["Why a year is the unit that matters", "96 classes: eight a month for a whole year", "£15.61 a class, £4.11 a day", "Your name on the Founders Wall", "Only 25 places, and 14 days to change your mind."] },
    thanks:   { len: "30 sec", who: "Founder", title: "Welcome to the founders", hook: "Thank you. You're one of the first.",
                beats: ["Genuine thank you", "What happens between now and opening day", "Send your Guest Passes to three friends"] }
  };

  C.moves = [
    ["1", "Footwork", "Lying on your back, you press the carriage away and control it all the way home. Your legs start talking to you by the eighth one."],
    ["2", "The Hundred", "Head and shoulders lifted, arms pumping while you breathe. This is the one that finds a stomach muscle you forgot you had."],
    ["3", "Frog and leg circles", "Feet in the straps, and the spring carries the weight of your legs. Your hips open up without you forcing anything."],
    ["4", "Short spine", "You roll your spine up and down one bone at a time. It feels like a massage from the inside."]
  ];
  C.decadeIllo = { "20s": "illo-20s", "30s": "illo-30s", "40s": "illo-40s", "50s": "illo-50s", "60s": "illo-60s", "70s": "illo-70s" };

  window.REEF_CONTENT = C;
})();
