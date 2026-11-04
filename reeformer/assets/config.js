/* =====================================================================
   reef founder funnel: THE ONLY FILE YOU NEED TO EDIT
   Everything marked TODO is a placeholder until you paste the real value.
   ===================================================================== */
window.REEF_CONFIG = {

  /* ---------- TEST MODE ----------
     true  = every checkout button runs a simulated checkout (no payment, no Momence) and leads are logged, not sent.
              A light blue bar on every page links to the Funnel Lab (lab.html) to test every route.
     false = live: leads go to Momence and checkout buttons go to your Momence links. */
  testMode: true,

  /* ---------- Momence: leads ----------
     Momence > Marketing > Leads > Collect Leads using API.
     Copy your host id, the token and the lead source id for "Quiz funnel". */
  momence: {
    hostId: "",          // TODO e.g. "123456"
    token: "",           // TODO the lead collection token
    sourceId: "",        // TODO lead source id for the quiz
    sendQuizAnswers: true, // sends profile, pack and answers as extra lead fields
    // Optional backup: a Make/Zapier webhook that also receives every lead with full answers
    backupWebhook: ""    // TODO optional
  },

  /* ---------- Momence: checkout links for each pack ----------
     Momence > Offerings > (pack/membership) > copy purchase link, e.g. https://momence.com/m/123456
     In Momence Settings > General Setup > Checkout purchase tracking, set the redirect URL to
     https://reefwellnessstudio.com/founders/thank-you.html  (so buyers land on the upsell + Guest Pass page). */
  checkout: {
    founder5:  "",   // TODO
    plus:      "",   // TODO
    member:    "",   // TODO (launch gate: only once monthly rate + terms confirmed)
    year:      ""    // TODO
  },

  /* ---------- Post purchase wellness add ons (thank you page) ----------
     Prices from opening day are from your offer docs. The founder add on price is YOUR call. */
  addons: {
    trio: {
      name: "Founder Recovery Trio",
      includes: ["1 hyperbaric session", "1 red light session", "1 recovery boots session"],
      value: 190,                 // £75 + £65 + £50 at prices from opening day
      price: 149,                 // TODO PLACEHOLDER: confirm or change before going live
      checkout: ""                // TODO Momence link
    },
    redlight5: {
      name: "Red Light Five",
      includes: ["5 red light sessions"],
      value: 325,
      price: 249,                 // TODO PLACEHOLDER
      checkout: ""
    }
  },

  /* ---------- Live places left (DMCC Act: these must be TRUE numbers) ----------
     Update daily from Momence sales. Set a value to null to hide that counter. */
  places: {
    founder5: { total: 80, left: null },
    plus:     { total: 60, left: null },
    member:   { total: 40, left: null },
    year:     { total: 25, left: null }
  },

  /* ---------- Dates ---------- */
  openingDateText: "mid to late January 2027", // TODO swap for the exact date once confirmed, e.g. "Saturday 23 January"
  openingDateISO: null,                   // TODO e.g. "2026-12-12T07:00:00Z" turns on an honest countdown to the real close
  memberMonthlyRate: null,                // TODO founder monthly rate (number) for Founding Member
  memberStandardRate: null,               // TODO standard monthly rate (number)
  refundDays: 14,

  /* ---------- Founders Guarantee ----------
     Shown on every pack page, in the bag and at checkout. Every line MUST match your real terms.
     Want it even stronger? e.g. "Love your first class or get your money back", only add it if you will honour it. */
  guarantee: {
    name: "The Founders Guarantee",
    lines: [
      "You have your usual 14 days to change your mind, for any reason at all.",
      "Your classes do not start until the doors open, so a delay never costs you one.",
      "If opening is ever put back, your classes simply wait for you.",
      "Founder prices end on opening day and are never offered again."
    ]
  },
  longStopDateText: "",                   // TODO e.g. "31 January 2027"

  /* ---------- People and contact ---------- */
  founderName: "",                        // TODO Mum's first name (signs the page)
  callBookingUrl: "",                     // TODO Calendly or Momence appointment link for a 10 minute call with Ricky
  whatsappNumber: "",                     // TODO e.g. "447700900123"
  phoneDisplay: "",                       // TODO e.g. "07700 900123"
  email: "hello@reefwellnessstudio.com",

  /* ---------- Videos (paste YouTube/Vimeo embed URL or an .mp4 URL) ---------- */
  showVideoPlaceholders: false,           // true shows "video coming soon" slots where no video is set
  videos: {
    quiz:     "",   // 45 sec welcome on the quiz start screen
    result:   "",   // 60 sec "your plan, explained" on the result screen
    packs:    "",   // 60 sec on the shop page
    thanks:   "",   // 30 sec welcome after purchase
    founder5: "",   // TODO
    plus:     "",   // TODO 45 second founder video
    member:   "",   // TODO about 4.5 minute VSL
    year:     ""    // TODO
  },

  /* ---------- Tracking ---------- */
  metaPixelId: "",                        // TODO
  ga4Id: ""                               // optional
};
