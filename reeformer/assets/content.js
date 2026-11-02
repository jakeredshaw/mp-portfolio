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
  C.steps = [
    { id: "name", type: "text", q: "Hello! Before we start, what's your first name?", help: "We'll use it to build your personal plan.", placeholder: "Your first name", cta: "Start my plan" },
    { id: "goal", type: "single", q: "{n}, what would you most like Reformer Pilates to help you with?", help: "Pick the one that matters most to you right now.",
      opts: [
        ["strength", "I want to feel strong and capable again.", "💪"],
        ["posture", "I want to stand taller and stop my back aching.", "🧍"],
        ["shape", "I want to tone up and feel good in my body.", "✨"],
        ["calm", "I want to switch off, feel calmer and sleep better.", "🌊"],
        ["resilient", "I want to move freely without the niggles and twinges.", "🦵"],
        ["comeback", "I want to feel like myself again after a big life change.", "🌱"]
      ] },
    { id: "exp", type: "single", q: "Have you ever done Pilates or Reformer Pilates before?", help: "Be honest. Total beginners are very welcome here.",
      opts: [["0", "No, never. I would be a complete beginner."], ["1-5", "Yes, a few times (1 to 5 classes)."], ["6-20", "Yes, quite a bit (6 to 20 classes)."], ["20+", "Yes, lots (more than 20 classes)."]] },
    { id: "hook_exp", type: "hook" },
    { id: "body", type: "multi", q: "Where in your body do you feel stiff, achy or tight?", help: "Tick everything that applies to you.",
      opts: [["back", "My lower back aches."], ["neck", "My neck and shoulders feel tight."], ["hips", "My hips feel stiff."], ["knees", "My knees are not what they were."], ["none", "Nowhere yet, and I want to keep it that way."]] },
    { id: "hook_body", type: "hook" },
    { id: "day", type: "single", q: "What does a normal day look like for you?",
      opts: [["desk", "I sit at a desk or drive for most of the day."], ["feet", "I am on my feet all day."], ["rush", "It's a mix, and I am always rushing."], ["parent", "I am busy looking after my family."], ["flex", "I am retired, or my days are flexible."]] },
    { id: "pace", type: "scale", q: "How busy and stressful is your week right now?", help: "1 means calm and easy. 5 means flat out.", lo: "Calm", hi: "Flat out" },
    { id: "hook_pace", type: "hook" },
    { id: "metime", type: "single", q: "When did you last have a whole hour just for yourself?",
      opts: [["week", "Some time this week."], ["month", "Some time this month."], ["cant", "Honestly, I can't remember."]] },
    { id: "barrier", type: "single", q: "What has stopped you from starting before now?", help: "There's no wrong answer. This helps us take the worry away.",
      opts: [["intimidated", "I was nervous I would feel out of place."], ["notfit", "I didn't feel fit or flexible enough."], ["time", "I couldn't find the time."], ["cost", "I was worried about the cost."], ["injury", "I have an old injury and I didn't want to make it worse."], ["gym", "I've tried the gym before and it never stuck."], ["nearby", "Nothing. There just wasn't a proper studio nearby."]] },
    { id: "hook_barrier", type: "hook" },
    { id: "age", type: "single", q: "Which age group are you in?", help: "Your body needs different things in every decade, so your plan will too.",
      opts: [["20s", "20s"], ["30s", "30s"], ["40s", "40s"], ["50s", "50s"], ["60s", "60s"], ["70s", "70s or older"]] },
    { id: "sex", type: "single", q: "Are you a woman or a man?", help: "Reformer is brilliant for both. This just helps us tailor your plan.",
      opts: [["f", "I am a woman."], ["m", "I am a man."], ["x", "I would rather not say."]] },
    { id: "freq", type: "single", q: "How many times a week could you realistically come to the studio?", help: "We are open from 7am to 10pm, every day, so early birds and night owls both count.",
      opts: [["1", "Once a week."], ["2", "Twice a week."], ["3", "Three times a week or more."], ["unsure", "I'm not sure yet."]] },
    { id: "ready", type: "single", q: "Last question! How ready are you to make this the winter you finally start?",
      opts: [["now", "I'm ready. I want to start."], ["keen", "I'm very keen. I just need the right plan."], ["curious", "I'm curious and still finding out."]] },
    { id: "capture", type: "capture" }
  ];

  // Short versions of each answer, used when we play answers back on the result and pack pages
  C.short = {
    goal: { strength: "Feel strong again", posture: "Stand taller, ease my back", shape: "Tone up and feel great", calm: "Switch off and find calm", resilient: "Move without the twinges", comeback: "Feel like me again" },
    exp: { "0": "None at all", "1-5": "1 to 5", "6-20": "6 to 20", "20+": "More than 20" },
    body: { back: "Lower back", neck: "Neck and shoulders", hips: "Hips", knees: "Knees", none: "Nowhere yet" },
    day: { desk: "Sitting at a desk or driving", feet: "On my feet all day", rush: "Always rushing", parent: "Busy with the family", flex: "Flexible days" },
    metime: { week: "This week", month: "This month", cant: "Can't remember" },
    barrier: { intimidated: "Feeling out of place", notfit: "Not fit enough", time: "Finding the time", cost: "The cost", injury: "An old injury", gym: "The gym never stuck", nearby: "No studio nearby" },
    age: { "20s": "20s", "30s": "30s", "40s": "40s", "50s": "50s", "60s": "60s", "70s": "70s or older" },
    sex: { f: "Woman", m: "Man", x: "Prefer not to say" },
    freq: { "1": "Once a week", "2": "Twice a week", "3": "Three times or more", unsure: "Not sure yet" },
    ready: { now: "Ready to start", keen: "Very keen", curious: "Curious" }
  };

  // Encouragement screens. Plain English, pin point the pain, flip the objection.
  C.hooks = {
    hook_exp(a) {
      if (a.exp === "0") return { kicker: "Great news, {n}", title: "You don't need any experience. Most of our founders are complete beginners too.",
        body: "Your first class is with an instructor who sets everything up for you. The springs on the machine help you before they challenge you, and every move has an easier version. Nobody in that room knew what they were doing on their first day.",
        stat: ["Pilates builds flexibility.", "You don't need it to start."] };
      if (a.exp === "1-5") return { kicker: "Lovely, {n}", title: "You've already had a taste. This time, it will actually stick.",
        body: "Most people stop after a few classes because the studio was too far away, always fully booked, or too expensive. reef fixes all three. It's right on Wyle Cop, it's open from 7am to 10pm, and founders pay the lowest price we will ever charge." };
      return { kicker: "Love that, {n}", title: "You already know how good it feels. Now picture it ten minutes from home.",
        body: "We have ten or more Reformer beds, your own screen with more than 800 guided sessions, and opening hours from 7am to 10pm. You can go as heavy and as hard as you like." };
    },
    hook_body(a) {
      const b = (a.body || []).filter(x => x !== "none");
      if (!b.length) return { kicker: "Smart move, {n}", title: "Starting before anything hurts is the best time to start.",
        body: "Strength and balance are much easier to keep than to win back. The published studies show the biggest changes happen in the first twelve weeks, so you'll feel the difference fast." };
      const words = { back: "your lower back", neck: "your neck and shoulders", hips: "your hips", knees: "your knees" };
      const list = b.map(x => words[x]); const where = list.length > 1 ? list.slice(0, -1).join(", ") + " and " + list[list.length - 1] : list[0];
      if (b.includes("back")) return { kicker: "We hear you, {n}", title: "That ache in " + where + " is really common. And it is not something you just have to live with.",
        body: "Most back pain isn't caused by one big injury. It usually happens when the muscles that support your spine get weak from sitting and rushing. Reformer Pilates strengthens exactly those muscles, gently and safely.",
        stat: ["14 points", "Average drop in back pain (out of 100) across ten trials of Pilates.", "Cochrane review, Yamato et al"] };
      return { kicker: "We hear you, {n}", title: "Stiffness in " + where + " usually means those muscles have stopped being used properly.",
        body: "The good news is that muscles wake up quickly when you ask them to. Reformer works them through their full range with springs that support you, with no impact and no jumping.",
        stat: ["0.69", "Average flexibility gain across twelve studies. That is a medium to large effect.", "Bajčetić et al, 2026"] };
    },
    hook_pace(a) {
      const p = +a.pace || 3;
      if (p >= 4) return { kicker: "Please read this, {n}", title: "You give everyone else your time. This hour is just for you.",
        body: "You put your headphones on, choose your session and the springs are set. For 50 minutes, nobody needs anything from you. Then you can have a coffee in the lounge before you go back to running everything.",
        stat: ["1.29", "A large drop in anxiety in controlled trials of Pilates.", "Fleming and Herring, 2018"] };
      return { kicker: "Perfect timing, {n}", title: "A calmer week is the best time to build a habit that lasts.",
        body: "Habits you start on a good week survive the hard weeks. Twice a week is what the research used, so that is what we will build your plan around." };
    },
    hook_barrier(a) {
      const m = {
        intimidated: ["You won't feel out of place. We built the whole studio around that feeling.", "The first thing you see is a coffee bar, not a wall of mirrors. You have your own screen and headphones, so nobody is watching you. Your instructor sets your springs for you. And because every founder starts in December, everyone in the room is new together."],
        notfit: ["You don't need to get fit before you start. You start, and that is how you get fit.", "The springs set how hard each move is. We start you light and build up slowly. Beginners and athletes use exactly the same machine, just on different settings."],
        time: ["We're open from 7am to 10pm. That's earlier and later than almost anywhere else.", "A digital session starts the moment you step on the bed, not on the hour. It takes 50 minutes. The car park is a two minute walk away, and it's free after 6pm."],
        cost: ["Founder pricing is the cheapest reef will ever be. When we open, these prices disappear.", "On the bigger packs, a session costs less than £16, compared with £25 when we open. You also get a full 14 day refund if you change your mind, so there's no risk at all."],
        injury: ["Reformer is one of the gentlest ways to get strong. It's low impact and kind to your joints.", "The springs can support you as well as challenge you, so you can work around a niggle instead of through it. Please check with your GP first if you have a medical condition, and tell your instructor on day one."],
        gym: ["The gym not sticking wasn't your fault. Most gyms are built to be endured.", "That's why 2 in 3 people quit the gym by month six. Pilates is different. In 2025 it was the most rebooked workout in the world, because people actually look forward to going back."],
        nearby: ["Then you're right on time. That's exactly why we're building reef.", "reef is the first full Reformer studio inside Shrewsbury town centre, with ten or more beds, on Wyle Cop from December. Founders get first choice before anyone else."]
      }[a.barrier] || ["Got it.", "Your plan will take that into account."];
      return { kicker: "Let's take that worry away, {n}", title: m[0], body: m[1] };
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
    intimidated: { t: "Worried you'd feel out of place?", b: "We built reef around that. Coffee bar at the front, quiet studio further in, your own screen and headphones so nobody is watching you. Your first class is with an instructor who sets your springs and footbar for you. And because every founder starts in December, everyone in the room is new together." },
    notfit: { t: "Think you need to get fit first?", b: "That rule is backwards. You don't get fit to start, you start to get fit. The springs set the effort: light springs to learn, heavier as you grow. Pilates builds flexibility. It does not require it." },
    time: { t: "Worried about finding the time?", b: "Open 7am to 10pm. A digital session begins the moment you step on the bed, not on the hour. St Julian's Friars car park is 122 metres away, about a two minute walk, and it's free after 6pm." },
    cost: { t: "Worried about the cost?", b: "This is the cheapest reef will ever be. Founder prices end for good on opening day, and every pack shows you the honest price per class against our prices from opening day. You also have a {refund} day refund window." },
    injury: { t: "Worried about an old injury?", b: "Reformer is low impact and the carriage supports your joints. Springs can assist a movement as well as resist it, so you can train around a niggle rather than through it. If you have a condition, speak to your GP before starting, and tell your instructor on day one." },
    gym: { t: "The gym never stuck?", b: "You're not the problem. Britain spends £503 million a year on gym memberships nobody uses, because most training is designed to be endured. Pilates was the most rebooked workout in the world in 2025. People go back because they like it." },
    nearby: { t: "Never had a proper studio nearby?", b: "Now you will. reef is the first full Reformer studio inside Shrewsbury town centre, with ten or more beds, on Wyle Cop. Founders get first choice before anyone else." }
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

  window.REEF_CONTENT = C;
})();
