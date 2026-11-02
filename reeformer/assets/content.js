/* reef founder funnel: all copy and personalisation modules.
   House rules: no dashes or hyphens in customer copy, "reef" always lowercase,
   no invented reviews or numbers, every statistic carries its source (from The Reeformer Pilates Manual). */
(function () {
  const C = {};

  /* ------------------------------------------------------------------ PACKS */
  C.packs = {
    founder5: {
      id: "founder5", file: "founder-5.html", imgs: ["concept-studio-pr", "concept-coffee-pl", "concept-lounge-pc"], name: "Founder 5", price: 99, badge: "Best first step",
      classes: 5, value: 125, save: 26, perClass: "19.80", perClassWellness: null,
      validity: "Valid for 3 months from opening day",
      tagline: "Five Reformer classes. £99. No experience needed.",
      sub: "The simplest way to feel what Reformer does for your body, at £19.80 a class, in the heart of Shrewsbury.",
      stack: [
        ["5 Reformer classes", 125],
        ["Guided moves on your own screen, every class", null],
        ["Open 7am to 10pm, seven days", null],
        ["3 Guest Passes to give friends a free first class", null]
      ],
      bump: { to: "plus", extra: 200, line: "For £200 more, Founder Plus gives you 14 classes, red light, recovery boots and a reef tote. That is £465 at our prices from opening day." },
      down: null,
      call: false
    },
    plus: {
      id: "plus", file: "founder-plus.html", imgs: ["concept-lounge-pc", "concept-studio-pc", "concept-coffee-pc"], name: "Founder Plus", price: 299, badge: "Our pick",
      classes: 14, value: 465, save: 166, perClass: "21.36", perClassWellness: "13.14",
      validity: "Credits valid for 6 months from opening day",
      tagline: "14 Reformer classes, red light, recovery boots and a tote. £299.",
      sub: "£465 of reef for £299. Founder pricing for the first 60 people in Shrewsbury, and never again after we open.",
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
      tagline: "Thirty classes. Three months. Then your founder rate, locked for a year.",
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
      tagline: "Your strongest year starts on Wyle Cop.",
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
  const NHS_GUESS = { q: "Quick guess. How many days a week does the NHS say adults should do strength exercise?", opts: ["1 day", "2 days", "5 days"], answer: "2 days",
    reveal: "It's 2 days a week, and the NHS names Pilates as an example. That's exactly what your plan is built on." };

  C.steps = [
    { id: "name", type: "text", q: "What's your first name?", placeholder: "First name", cta: "Let's go" },
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
      q: (a) => (a.exp === "6-20" || a.exp === "20+") ? "What's stopped you doing Reeformer Pilates more often?" : "What's stopped you starting Reeformer Pilates before now?",
      optsFor: (a) => (a.exp === "6-20" || a.exp === "20+")
        ? [["full", "Classes were always full"], ["far", "The studio was too far away"], ["pricey", "It got too expensive"], ["injury", "An injury set me back"], ["busy", "Life got too busy"], ["bored", "I got bored of the same class"]]
        : [["intimidated", "I was nervous I'd feel out of place"], ["notfit", "I didn't feel fit enough"], ["time", "I didn't have time"], ["cost", "I was worried about the cost"], ["injury", "I have an old injury"], ["gym", "The gym never stuck for me"], ["nearby", "There was no studio nearby"]],
      opts: [["intimidated", "Feeling out of place"], ["notfit", "Not fit enough"], ["time", "No time"], ["cost", "Cost"], ["injury", "Old injury"], ["gym", "Gym never stuck"], ["nearby", "No studio nearby"], ["full", "Classes always full"], ["far", "Studio too far"], ["pricey", "Too expensive"], ["busy", "Life got busy"], ["bored", "Bored of the same class"]] },
    { id: "hook_barrier", type: "hook" },
    { id: "age", type: "single", q: "How old are you?",
      opts: [["20s", "20s"], ["30s", "30s"], ["40s", "40s"], ["50s", "50s"], ["60s", "60s"], ["70s", "70+"]] },
    { id: "sex", type: "single", q: "Are you…",
      opts: [["f", "A woman"], ["m", "A man"], ["x", "Rather not say"]] },
    { id: "freq", type: "single", q: "How often could you come?", help: "We're open 7am to 10pm, every day.",
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
        facts: [["Day 1", "Your instructor sets up the machine for you."], ["Springs", "They help you first. Then they challenge you."], ["No.1", "Pilates is the most booked workout in the world.", "ClassPass, 2025"]],
        quiz: NHS_GUESS };
      if (a.exp === "1-5") return { kicker: "Great, {n}", title: "You've made a start. We'll make the rest easy.",
        line: "New to the machine? Not sure what to do? That's normal. Here's how we help.",
        facts: [["Your screen", "Every move is shown on the bed in front of you."], ["Day 1", "An instructor sets your springs and footbar for you."], ["Steady", "The carriage only moves when you push it. You're always in control."]],
        quiz: NHS_GUESS };
      return { kicker: "Love it, {n}", title: "Now make it a habit, close to home.",
        facts: [["10+", "Reformer beds on Wyle Cop."], ["7am to 10pm", "Open every day."], ["800+", "Guided sessions on your own screen."]],
        quiz: NHS_GUESS };
    },
    hook_body(a) {
      const b = (a.body || []).filter(x => x !== "none");
      if (!b.length) return { kicker: "Smart, {n}", title: "Start before anything hurts.",
        facts: [["1 in 20", "Adults in England do enough strength exercise.", "253,423 adults studied"], ["12 weeks", "Where most Pilates studies see the change."]] };
      if (b.includes("back")) return { kicker: "We hear you, {n}", title: "Back pain is common. You don't have to live with it.",
        facts: [["14 points", "Average drop in back pain (out of 100) with Pilates.", "Cochrane review, 10 trials"], ["9 million", "Adults in England live with back pain. You're not alone.", "Versus Arthritis"], ["Andy Murray", "Used Pilates to come back from back surgery in 2013.", "The Reeformer Pilates Manual"]] };
      if (b.includes("neck")) return { kicker: "We hear you, {n}", title: "That tight neck is your phone and your desk.",
        facts: [["60lb", "Load on your neck when you look down at a phone.", "Hansraj, 2014"], ["11.8mm to 3mm", "How much straighter beginners held their head after Reformer.", "Sim et al, 2022"]] };
      return { kicker: "We hear you, {n}", title: "Stiff joints need gentle strength, not more rest.",
        facts: [["Low impact", "No jumping. The carriage supports your joints."], ["0.69", "Average gain in flexibility across 12 studies.", "Bajčetić et al, 2026"]] };
    },
    hook_pace(a) {
      if ((+a.pace || 3) >= 4) return { kicker: "Read this, {n}", title: "This hour is just for you.",
        facts: [["50 min", "Headphones on. Nobody needs anything from you."], ["1.29", "A large drop in anxiety in Pilates trials.", "Fleming and Herring, 2018"], ["☕", "Then a coffee in the lounge."]] };
      return { kicker: "Perfect, {n}", title: "A calm week is the best time to start.",
        facts: [["2 a week", "What the research used. It's what your plan uses."], ["12 weeks", "Long enough to feel it. Short enough to stick."]] };
    },
    hook_barrier(a) {
      const H = {
        intimidated: ["You won't feel out of place.", [["Coffee first", "You walk into a coffee bar, not a wall of mirrors."], ["Your screen", "Headphones on. Nobody is watching you."], ["Together", "Everyone starts when we open. You won't be the only beginner."]]],
        notfit: ["You don't need to be fit to start.", [["Light springs", "We start you easy and build up."], ["Same machine", "Beginners and pro athletes use the same bed."], ["LeBron James", "Was filmed on a Reformer preparing for his 23rd NBA season.", "July 2025"]]],
        time: ["We fit around your life.", [["7am to 10pm", "Open every day."], ["No waiting", "Digital sessions start when you step on the bed."], ["2 min walk", "From the car park. Free after 6pm."]]],
        cost: ["This is the cheapest it will ever be.", [["£15.61", "A session on Founding Year. £25 once we open."], ["14 days", "Full refund if you change your mind."], ["Locked", "Your founder price never goes up."]]],
        injury: ["Reformer is kind to your body.", [["Low impact", "No jumping. The carriage supports your joints."], ["Andy Murray", "Used Pilates to come back from back surgery.", "The Reeformer Pilates Manual"], ["Day 1", "Tell your instructor. They'll adapt every move."]]],
        gym: ["The gym not sticking wasn't your fault.", [["2 in 3", "People quit the gym by month six.", "UK survey, 2,000 adults"], ["No.1", "Pilates was the most rebooked workout in 2025.", "ClassPass"], ["Fun", "People come back because they enjoy it."]]],
        nearby: ["Now there is one.", [["Wyle Cop", "The first full Reformer studio in Shrewsbury town centre."], ["10+", "Reformer beds."], ["First pick", "Founders choose their sessions first."]]],
        full: ["Getting a spot is easier here.", [["10+", "Beds. A class is a class, not a queue."], ["Any time", "Digital sessions start on any free bed."], ["First pick", "Founders book before anyone else."]]],
        far: ["We're right in town.", [["Wyle Cop", "In the heart of Shrewsbury."], ["2 min walk", "From St Julian's Friars car park."], ["Free", "Parking after 6pm."]]],
        pricey: ["Founder prices are our lowest ever.", [["£15.61", "A session on Founding Year. £25 once we open."], ["38% off", "Every session, for founders only."], ["Locked", "Your price never goes up."]]],
        busy: ["We fit around your life.", [["7am to 10pm", "Open every day."], ["50 min", "In and out, with a car park 2 minutes away."], ["Any time", "Digital sessions start when you're ready."]]],
        bored: ["You won't get bored here.", [["800+", "Guided sessions on your own screen."], ["Mix it up", "Instructor classes, digital sessions and one to ones."], ["Recovery", "Red light, recovery boots and hyperbaric too."]]]
      }[a.barrier] || ["Got it.", []];
      return { kicker: "We've got you, {n}", title: H[0], facts: H[1] };
    }
  };

  /* -------------------------------------------------------------- PROFILES */
  C.profiles = {
    strength: { name: "The Strength Rebuilder", emoji: "💪",
      line: "Your legs remember being strong. Your plan reminds them.",
      why: "You want real, useful strength back: stairs without thinking, lifting without bracing, a body that feels capable again. Reformer is resistance training with springs, so every muscle works on the way out and on the way back.",
      science: ["strengthGuideline", "chairStand", "nhs"] },
    posture: { name: "The Posture Reset", emoji: "🧍",
      line: "Taller, looser, and finally free of that ache.",
      why: "You want to stand taller and stop carrying your day in your back and shoulders. Reformer was built by a man who could not stand up straight as a child, and posture is where the trials keep reporting change.",
      science: ["backPain", "headOffCentre", "neckLoad"] },
    shape: { name: "The Sculptor", emoji: "✨",
      line: "Strength first. Shape follows.",
      why: "You want to feel great in your body. Reformer works deep and long muscles together under spring tension, so you leave shaking, standing taller and feeling it in places the gym never reached.",
      science: ["core228", "flex", "classpass"] },
    calm: { name: "The Hour Back", emoji: "🌊",
      line: "Fifty minutes where nobody needs anything from you.",
      why: "You want calm, and an hour that is genuinely yours. Pilates breathing is built into every exercise, and the mental health results in the trials are some of the strongest in exercise science.",
      science: ["anxiety", "energy", "classpass"] },
    resilient: { name: "The Resilient Mover", emoji: "🦵",
      line: "Train hard on a machine that has your back.",
      why: "You want to keep moving, training and playing without the twinges. Reformer is low impact, the carriage supports your joints, and the springs let you load muscle without loading your spine.",
      science: ["backPain", "balance", "flex"] },
    comeback: { name: "The Comeback", emoji: "🌱",
      line: "Not back to who you were. Forward to stronger.",
      why: "Life has changed, and your body has noticed. Reformer meets you exactly where you are today, with springs that assist before they challenge, and builds you up session by session.",
      science: ["energy", "core228", "nhs"] }
  };
  // desk workers with posture goal get the sharper name
  C.profileName = (a) => (a.goal === "posture" && a.day === "desk") ? "The Desk Body Reset" : C.profiles[a.goal || "strength"].name;

  /* -------------------------------------------------------------- SCIENCE */
  C.science = {
    backPain: ["14 points", "Average drop in back pain on a 100 point scale, Pilates against minimal treatment. Ten trials, 510 adults.", "Yamato et al, Cochrane review"],
    headOffCentre: ["11.8mm to 3.0mm", "How far the head sat off centre in Reformer beginners, before and after a programme.", "Sim et al, 2022"],
    neckLoad: ["12lb to 60lb", "Load on your neck upright, and at a 60 degree phone tilt.", "Hansraj, Surgical Technology International, 2014"],
    core228: ["228%", "Rise in deep abdominal activation when one exercise moves to a lighter spring.", "Kim et al, Healthcare, 2024"],
    flex: ["0.69", "Pooled flexibility gain across twelve studies, a medium to large effect.", "Bajčetić et al, 2026"],
    anxiety: ["1.29", "Effect size for reduced anxiety in controlled Pilates trials. Anything over 0.8 counts as large.", "Fleming and Herring, 2018"],
    energy: ["1.49", "Effect size for more energy across pooled Pilates trials, with lower fatigue too.", "Fleming and Herring, 2018"],
    balance: ["0.84", "Pooled balance improvement across randomised trials in adults over 60. A large effect.", "Barker et al, 2015"],
    chairStand: ["0.68", "Effect size for lower body strength (the 30 second chair stand) after twelve weeks in women over 60.", "García Garro et al, 2020"],
    strengthGuideline: ["1 in 20", "Adults in England who meet the muscle strengthening guideline under a strict definition.", "Study of 253,423 adults"],
    nhs: ["2 days", "The NHS advises strengthening activities on at least two days a week, and names Pilates as an example.", "NHS physical activity guidelines"],
    classpass: ["No.1", "Pilates was the most booked workout worldwide on ClassPass for the third year running.", "ClassPass, 2025"],
    gym: ["£503m", "Spent on unused UK gym memberships in a single year. Only 4% say a New Year gym resolution stuck.", "PA Life survey, January 2025"]
  };

  /* -------------------------------------------------------------- MODULES */
  C.bodyModules = {
    back: { t: "Your lower back", b: "Around one in six adults in England lives with back pain, and most of it has no single cause. Just a spine that has lost the muscular support it was designed to have. That is the exact problem Pilates was built to solve, and the Cochrane evidence says it does." },
    neck: { t: "Your neck and shoulders", b: "Upright, your neck carries about 12lb. Looking down at a phone at 60 degrees, it carries about 60. A head held forward drags the shoulders with it, which is why a desk habit ends up as a shape, not just an ache. Reformer trains the muscles that pull you back up." },
    hips: { t: "Your hips", b: "Hours of sitting shorten the hip flexors and switch the glutes off. The footwork, bridging and leg circles on the Reformer open the front of the hip and wake up the muscles behind it, with the springs controlling every inch." },
    knees: { t: "Your knees", b: "Reformer lets you build the muscles around the knee lying down, with no impact and no body weight on the joint unless you choose it. The springs take the load you can't, and give it back as you get stronger." },
    none: { t: "Keeping it that way", b: "You're starting from a strong place, and that's the smartest time to start. Strength and balance are far easier to keep than to win back, and the published trials show the gains build fastest in the first twelve weeks." }
  };

  C.dayModules = {
    desk: "Hours at a desk or behind the wheel leave a signature: head forward, shoulders rounded, upper back stiff, hips tight. 74% of British adults in their mid 40s sit for more than eight hours a day. Reformer works the exact opposite pattern.",
    feet: "On your feet all day, your body is tired but not trained. Reformer lets you lie down and still build serious strength, with the springs supporting your joints instead of loading them.",
    rush: "Always rushing means your body never gets a proper reset. A session starts the moment you step on the bed, so 50 minutes is 50 minutes, and the lounge is there if you want ten more.",
    parent: "When everyone needs you, an hour away is the hardest thing to find and the thing that helps most. Early mornings and evenings until 10pm mean you can go when the house is covered.",
    flex: "Flexible days mean you can choose the quiet slots and build a proper routine. Twice a week, every week, is the pattern the published trials used."
  };

  C.barrierModules = {
    intimidated: { t: "Worried you'd feel out of place?", b: "We built reef around that. Coffee bar at the front, quiet studio further in, your own screen and headphones so nobody is watching you. Your first class is with an instructor who sets your springs and footbar for you. And because every founder starts when we open, everyone in the room is new together." },
    notfit: { t: "Think you need to get fit first?", b: "That rule is backwards. You don't get fit to start, you start to get fit. The springs set the effort: light springs to learn, heavier as you grow. Pilates builds flexibility. It does not require it." },
    time: { t: "Worried about finding the time?", b: "Open 7am to 10pm. A digital session begins the moment you step on the bed, not on the hour. St Julian's Friars car park is 122 metres away, about a two minute walk, and it's free after 6pm." },
    cost: { t: "Worried about the cost?", b: "This is the cheapest reef will ever be. Founder prices end for good on opening day, and every pack shows you the honest price per class against our prices from opening day. You also have a {refund} day refund window." },
    injury: { t: "Worried about an old injury?", b: "Reformer is low impact and the carriage supports your joints. Springs can assist a movement as well as resist it, so you can train around a niggle rather than through it. If you have a condition, speak to your GP before starting, and tell your instructor on day one." },
    gym: { t: "The gym never stuck?", b: "You're not the problem. Britain spends £503 million a year on gym memberships nobody uses, because most training is designed to be endured. Pilates was the most rebooked workout in the world in 2025. People go back because they like it." },
    nearby: { t: "Never had a proper studio nearby?", b: "Now you will. reef is the first full Reformer studio inside Shrewsbury town centre, with ten or more beds, on Wyle Cop. Founders get first choice before anyone else." },
    full: { t: "Classes always full?", b: "We have ten or more beds, so a class is a class, not a queue. Digital sessions start the moment you step on a free bed, and founders book before anyone else." },
    far: { t: "Studio too far away?", b: "reef is on Wyle Cop, right in the middle of Shrewsbury. St Julian's Friars car park is a two minute walk away, and it's free after 6pm." },
    pricey: { t: "Got too expensive?", b: "Founder prices are the lowest we will ever charge. On Founding Year a session is £15.61, against £25 once we open, and your price is locked." },
    busy: { t: "Life got busy?", b: "We're open 7am to 10pm, every day. Digital sessions start whenever you step on the bed, so you never wait for a class time." },
    bored: { t: "Got bored of the same class?", b: "You get instructor classes, more than 800 guided digital sessions on your own screen, and red light, recovery boots and hyperbaric for recovery." }
  };

  C.decadeModules = {
    "20s": { t: "Your 20s", b: "This is the decade you build the body you'll live in. Bone is still banking strength until your late 20s, and the habits you set now are the ones you keep. Plus, founder pricing is a price nobody gets after opening day." },
    "30s": { t: "Your 30s", b: "Time gets tight and the first niggles arrive. From around 35, bone loss starts to outpace repair, which makes this the decade to put strength in the bank. A bed and a screen ready from 7am to 10pm fits around everything else." },
    "40s": { t: "Your 40s", b: "The first creaks. Hormones start to shift, muscle starts to slip, and the back starts to complain. Twice a week on the Reformer is the simplest, lowest impact way to hold onto what you have and build more." },
    "50s": { t: "Your 50s", b: "The decade to train smart, not hard. Reformer loads muscle without loading the spine, and we'll be honest with you: Pilates holds bone, it doesn't build it, so we'll tell you exactly what it is brilliant for. Strength, posture and balance." },
    "60s": { t: "Your 60s", b: "Balance, posture and confidence on the stairs. In the one trial that counted them, falls dropped from 1.87 per person to 0.37. Balance is not a soft outcome. It is independence." },
    "70s": { t: "Your 70s and beyond", b: "Keep doing everything you love. Start with a lighter spring and a short range, and build. Begin with an instructor who sets everything up for you, and answers the getting on and off question in the first two minutes." }
  };

  C.expModules = {
    "0": "Total beginner? Perfect. Every move has an easier version and a harder one, your first class is with an instructor, and the screen on your bed shows you every move as you go.",
    "1-5": "You've had a taste. With a studio on Wyle Cop and founder pricing, this is the version that finally sticks.",
    "6-20": "You know the shake. Now you get ten or more beds, more than 800 guided sessions on your own screen and hours that fit your life.",
    "20+": "You're experienced, so you'll want heavier springs, harder progressions and the freedom to train on your own schedule. That is exactly what the screens and the 7am to 10pm hours are for."
  };

  C.menModule = { t: "Yes, Reformer is for men", b: "Joseph Pilates was a boxer, and he built the Reformer to rehabilitate men. Lifters, runners, golfers and riders come off their first class shaking, because the deep muscles that hold your spine and pelvis work the whole time. We want men on the beds from day one." };

  /* ---------------------------------------------------------------- FAQ */
  C.faq = [
    ["Do I need any experience?", "None at all. Every move has an easier version and a harder one, and your first class is with an instructor who sets your springs and footbar for you."],
    ["When do my classes start?", "Credits start on opening day, {open}. Founders get first choice of booking slots before anyone else."],
    ["What if I change my mind?", "You have a full {refund} day refund window on online purchases. Your credits also don't start ticking until we open."],
    ["What if the opening is delayed?", "Your credits start on opening day, whenever that is, so you never lose time. {longstop}"],
    ["Where do I park?", "St Julian's Friars car park is 122 metres away, about a two minute walk. 257 spaces, open 24 hours, and free after 6pm."],
    ["What are the hours?", "7am to 10pm. Instructor led classes run on the timetable, and digital sessions on your own screen start whenever you step on the bed."],
    ["What should I wear?", "Comfortable fitted clothes you can move in, and grip socks. Founders get looked after on day one."],
    ["I have a health condition, am pregnant or recovering from an injury.", "Please speak to your GP, consultant or midwife before you start, and tell your instructor before your first class. This page shares published research, not personal medical advice."],
    ["Can I share my classes?", "Every founder gets 3 Guest Passes. Each friend gets a free first class and founder pricing until opening day."]
  ];

  C.weeks = [
    ["Weeks 1 to 4", "Learn the machine", "Your instructor sets your springs. You learn the footwork, the breath and the control. Most people feel the deep core switch on in the first class, and sleep better that night."],
    ["Weeks 5 to 8", "Feel the change", "Moves that shook you start to feel steady. Posture, core control and flexibility are where the trials start reporting change, and you'll notice it on the stairs and at your desk."],
    ["Weeks 9 to 12", "Own it", "Twelve weeks is where most published Pilates trials finish, and where people report better sleep, lower anxiety and more energy. It stops being a plan and becomes a habit."]
  ];

  /* ------------------------------------------------------------- VSLs
     One talking head video per page. Placeholders show the hook + outline until you paste a video URL into config.js */
  C.vsls = {
    quiz:     { len: "45 sec", who: "Founder", title: "A quick hello from reef", hook: "How long have you been about to start Reformer?",
                beats: ["Hook: How long have you been about to start Reformer?", "Who we are: a family building reef on Wyle Cop", "What the quiz does: 2 minutes, your own plan", "Call to action: tap the button and start"] },
    result:   { len: "60 sec", who: "Founder", title: "Your plan, explained", hook: "This is exactly how your first twelve weeks will feel.",
                beats: ["Congratulate them on taking the first step", "Twice a week: what the research used", "Why the bigger packs cost less per session", "The Founders Guarantee: zero risk", "Pick your pack below"] },
    packs:    { len: "60 sec", who: "Founder", title: "Which founder pack is right for you?", hook: "The more sessions you choose, the less each one costs.",
                beats: ["The four packs in one sentence each", "Price per session, from £15.61", "Why founder prices end on opening day", "14 day full refund"] },
    founder5: { len: "45 sec", who: "Instructor", title: "Your first five sessions", hook: "Five sessions. That is all it takes to know.",
                beats: ["What happens in your first class", "Springs set for you, no experience needed", "Most people know by session three", "£19.80 a session, fully refundable for 14 days"] },
    plus:     { len: "45 sec", who: "Founder", title: "Why Founder Plus is our pick", hook: "This is where you'll get stronger. I'd love you to be one of our first.",
                beats: ["Hand on a Reformer bed inside the studio", "14 sessions: twice a week for seven weeks", "Red light and recovery boots included", "60 places, then never again"] },
    member:   { len: "3 to 4 min", who: "Founder", title: "The habit that changes everything", hook: "When did the stairs start feeling like a decision?",
                beats: ["The strength cliff: why it happens", "Thirty sessions takes you through the twelve week window", "Your founder rate, locked for a year", "The Founders Guarantee", "Book a call or claim your place"] },
    year:     { len: "4 to 5 min", who: "Founder", title: "Your strongest year", hook: "The one rule about getting fit we were all taught backwards.",
                beats: ["You don't get fit to start. You start to get fit.", "96 sessions: twice a week for a whole year", "£15.61 a session, £4.11 a day", "Your name on the Founders Wall", "25 places. Zero risk."] },
    thanks:   { len: "30 sec", who: "Founder", title: "Welcome to the founders", hook: "Thank you. You're one of the first.",
                beats: ["Genuine thank you", "What happens between now and opening day", "Send your Guest Passes to two friends"] }
  };

  C.moves = [
    ["1", "Footwork", "Lying on your back, you press the carriage away and control it home. It warms up your legs, glutes and core."],
    ["2", "The Hundred", "Head and shoulders lifted, arms pumping while you breathe. It switches your deep core on."],
    ["3", "Frog and leg circles", "Feet in the straps, and the spring carries your legs. Your hips open gently and safely."],
    ["4", "Short spine", "You roll your spine up and down one bone at a time. It feels like a massage from the inside."]
  ];
  C.decadeIllo = { "20s": "illo-20s", "30s": "illo-30s", "40s": "illo-40s", "50s": "illo-50s", "60s": "illo-60s", "70s": "illo-70s" };

  window.REEF_CONTENT = C;
})();
