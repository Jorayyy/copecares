import type { Locale } from "@/lib/locale";

const en = {
  skip: "Skip to content",
  clinicLabel: "Veterinary Clinic",
  nav: [
    { label: "Services", href: "#services" },
    { label: "About", href: "#about" },
    { label: "Team", href: "#team" },
    { label: "Gallery", href: "#gallery" },
    { label: "FAQ", href: "#faq" },
    { label: "Contact", href: "#contact" },
  ],
  topbar: {
    hours: "Open daily",
    phone: "Call",
    address: "Tacloban City",
  },
  hero: {
    eyebrow: "Veterinary clinic · Tacloban City",
    title: "Straightforward care for the pets you live with.",
    body: (clinicName: string) =>
      `${clinicName} sees dogs, cats, and other companion animals in Tacloban. Book a visit online, or call the clinic if your pet needs to be seen sooner.`,
    primary: "Book an appointment",
    secondary: "Call the clinic",
    secondaryFallback: "Message us",
    trust: [
      "Open daily",
      "One record per pet",
      "Walk-ins accepted when the schedule allows",
    ],
    photoCaption: "Photos from the clinic appear here.",
    photoHint: "Staff can upload clinic photos in Settings → Gallery.",
  },
  services: {
    eyebrow: "Services",
    title: "What the clinic offers",
    intro:
      "These are the clinic's current services and fees. Ask the front desk for an estimate before a procedure.",
    cta: "Book a service",
    duration: "min",
    fallback: "Clinic service.",
    empty: "Services are being updated. Please call the clinic for the current list.",
  },
  about: {
    eyebrow: "About the clinic",
    title: "A neighborhood clinic, run like one.",
    body: (clinicName: string) =>
      `${clinicName} is a local practice built around everyday pet care: check-ups, vaccinations, follow-ups, and the times when you need a clear answer quickly.`,
    body2:
      "Records stay with the pet, so each visit starts with context. Fees are explained before treatment, and staff will tell you when a case needs a referral.",
    bullets: [
      "One medical record for each pet",
      "Clear pricing before treatment",
      "Appointments you can view and cancel online",
      "Walk-ins handled around scheduled visits",
    ],
    cards: [
      {
        title: "Low-stress handling",
        body: "Quiet rooms and gentle handling for anxious pets.",
      },
      {
        title: "Practical advice",
        body: "Home care instructions you can actually follow.",
      },
      {
        title: "Local and reachable",
        body: "A clinic in Tacloban, not a call center abroad.",
      },
      {
        title: "Privacy-minded records",
        body: "Pet and owner details are kept for clinic use only.",
      },
    ],
  },
  visit: {
    eyebrow: "Planning a visit",
    title: "How booking works",
    intro:
      "New pet owners can register in a few minutes. Returning owners can sign in and book from their dashboard.",
    steps: [
      {
        title: "Create your account",
        body: "Register with your name, email, and contact number.",
      },
      {
        title: "Add your pet",
        body: "Tell us the species, breed, and any known medical history.",
      },
      {
        title: "Choose a service and time",
        body: "Pick an available slot. You can view or cancel it later.",
      },
    ],
    note: "Prefer to talk to someone? Call the clinic during operating hours and the front desk will help.",
  },
  team: {
    eyebrow: "Our team",
    title: "People your pet will meet",
    intro: "The clinic's veterinarians and staff handle consultations, procedures, and front-desk concerns.",
    staffTitle: "Clinic staff",
    staffBody: "Front desk, assistants, and pet care support.",
    role: "Veterinarian",
    empty: "Team details are being updated.",
  },
  gallery: {
    eyebrow: "Gallery",
    title: "Inside the clinic",
    intro: "Recent photos from the clinic and the pets we look after.",
    empty: "Clinic photos will appear here once staff upload them.",
    uploadNote: "Staff can add photos in Settings → Gallery.",
  },
  reviews: {
    eyebrow: "Feedback",
    title: "Reviews live on Facebook",
    body: "We do not republish reviews here. Read the clinic's latest feedback, announcements, and pet care posts on its Facebook page.",
    cta: "Open Facebook page",
    messenger: "Message on Messenger",
  },
  readiness: {
    eyebrow: "Public service",
    title: "Built to be handed over",
    body: "CopeCares is maintained with public-sector use in mind. The same records, roles, and safeguards used by the clinic are documented so an LGU can review them before acquisition.",
    bullets: [
      "Role-based staff accounts",
      "Soft-deleted records kept for retention review",
      "Published privacy notice, terms, and accessibility contact",
    ],
    cta: "Read the privacy notice",
  },
  faq: {
    eyebrow: "FAQ",
    title: "Common questions",
    items: [
      {
        question: "Do I need an appointment?",
        answer:
          "Appointments help the clinic prepare, but walk-ins are accepted when the schedule allows. Booking online is the fastest way to reserve a slot.",
      },
      {
        question: "What pets do you treat?",
        answer:
          "Dogs and cats are the main patients. The clinic also sees other companion animals when a veterinarian is available. Call first for exotic pets.",
      },
      {
        question: "How much is a check-up?",
        answer:
          "Consultation fees are listed under Services. Procedures, medicines, and laboratory tests are quoted separately before they are done.",
      },
      {
        question: "Can I cancel or reschedule?",
        answer:
          "Yes. Sign in to your pet owner account and open the appointment to cancel it. Call the clinic if you need a different time.",
      },
      {
        question: "What should I bring on the first visit?",
        answer:
          "Bring previous medical records, vaccination history, and a list of current medicines. Use a leash or carrier for your pet's safety.",
      },
      {
        question: "How are my records stored?",
        answer:
          "Pet and owner details are stored in the clinic's system and used for care, billing, and follow-up. Read the privacy notice for the full explanation.",
      },
    ],
  },
  contact: {
    eyebrow: "Visit the clinic",
    title: "Location and hours",
    body: "Walk in during operating hours or book ahead. If you are unsure whether your pet needs urgent care, call first.",
    address: "Address",
    hours: "Hours",
    phone: "Phone",
    email: "Email",
    directions: "Get directions",
    fallbackPhone: "Call the clinic for the current number.",
    mapTitle: "Map of the clinic",
  },
  footer: {
    tagline:
      "Veterinary care, appointments, and pet records for households in Tacloban.",
    quickLinks: "Quick links",
    contact: "Contact",
    legal: "Policies",
    privacy: "Privacy notice",
    terms: "Terms of use",
    accessibility: "Accessibility",
    staff: "Staff sign in",
    owner: "Pet owner registration",
    rights: "All rights reserved.",
    privacyContact: "Data privacy concerns",
    feedback: "Accessibility feedback",
  },
};

type LandingCopy = typeof en;

const fil: LandingCopy = {
  skip: "Lumaktaw sa nilalaman",
  clinicLabel: "Betterinaryong Klinika",
  nav: [
    { label: "Mga serbisyo", href: "#services" },
    { label: "Tungkol", href: "#about" },
    { label: "Team", href: "#team" },
    { label: "Gallery", href: "#gallery" },
    { label: "FAQ", href: "#faq" },
    { label: "Kontak", href: "#contact" },
  ],
  topbar: {
    hours: "Bukas araw-araw",
    phone: "Tumawag",
    address: "Lungsod ng Tacloban",
  },
  hero: {
    eyebrow: "Betterinaryong klinika · Lungsod ng Tacloban",
    title: "Simpleng pangangalaga para sa mga alaga ninyo.",
    body: (clinicName: string) =>
      `Tumitingin ang ${clinicName} ng aso, pusa, at iba pang alagang hayop sa Tacloban. Mag-book online, o tumawag sa klinika kung kailangan ninyong makita agad ang alaga ninyo.`,
    primary: "Mag-book ng appointment",
    secondary: "Tumawag sa klinika",
    secondaryFallback: "Mag-message",
    trust: [
      "Bukas araw-araw",
      "Isang record bawat alaga",
      "Tumatanggap ng walk-in kapag may oras",
    ],
    photoCaption: "Dito lalabas ang mga larawan ng klinika.",
    photoHint: "Puwedeng mag-upload ang staff sa Settings → Gallery.",
  },
  services: {
    eyebrow: "Mga serbisyo",
    title: "Ano ang inaalok ng klinika",
    intro:
      "Ito ang kasalukuyang serbisyo at bayad ng klinika. Magtanong sa front desk para sa estimate bago ang anumang procedure.",
    cta: "Mag-book ng serbisyo",
    duration: "min",
    fallback: "Serbisyo ng klinika.",
    empty:
      "Ina-update pa ang listahan ng serbisyo. Tumawag sa klinika para sa kasalukuyang listahan.",
  },
  about: {
    eyebrow: "Tungkol sa klinika",
    title: "Klinika sa kapitbahayan, pinapatakbo nang maayos.",
    body: (clinicName: string) =>
      `Ang ${clinicName} ay lokal na klinika para sa araw-araw na pangangalaga: check-up, bakuna, follow-up, at mga pagkakataong kailangan ninyo ng malinaw na sagot agad.`,
    body2:
      "Nananatili ang record sa bawat alaga, kaya may konteksto ang bawat bisita. Ipinaliliwanag ang bayad bago ang treatment, at sasabihin ng staff kung kailangan ng referral.",
    bullets: [
      "Isang medical record para sa bawat alaga",
      "Malinaw na presyo bago ang treatment",
      "Mga appointment na puwedeng tingnan at i-cancel online",
      "Walk-in na tinatanggap kapag may bakanteng oras",
    ],
    cards: [
      {
        title: "Mahinahong paghawak",
        body: "Tahimik na silid at maingat na paghawak para sa mga alagang kinakabahan.",
      },
      {
        title: "Praktikal na payo",
        body: "Mga tagubilin sa pag-aalaga sa bahay na kayang sundin.",
      },
      {
        title: "Lokal at malapit",
        body: "Klinika sa Tacloban, hindi call center sa ibang bansa.",
      },
      {
        title: "Record na pribado",
        body: "Ang detalye ng alaga at may-ari ay para sa klinika lamang.",
      },
    ],
  },
  visit: {
    eyebrow: "Pagpaplano ng bisita",
    title: "Paano mag-book",
    intro:
      "Ang bagong pet owner ay puwedeng magrehistro sa ilang minuto. Ang may account na ay puwedeng mag-sign in at mag-book mula sa dashboard.",
    steps: [
      {
        title: "Gumawa ng account",
        body: "Magrehistro gamit ang pangalan, email, at contact number.",
      },
      {
        title: "Idagdag ang alaga",
        body: "Sabihin ang species, breed, at anumang medical history.",
      },
      {
        title: "Pumili ng serbisyo at oras",
        body: "Pumili ng available na slot. Puwede itong tingnan o i-cancel mamaya.",
      },
    ],
    note: "Mas gusto ninyong kausapin ang staff? Tumawag sa klinika sa oras ng operasyon at tutulungan kayo ng front desk.",
  },
  team: {
    eyebrow: "Ang team",
    title: "Mga taong makikilala ng alaga ninyo",
    intro:
      "Ang mga beterinaryo at staff ng klinika ang humahawak ng konsultasyon, procedure, at mga tanong sa front desk.",
    staffTitle: "Staff ng klinika",
    staffBody: "Front desk, assistants, at pet care support.",
    role: "Beterinaryo",
    empty: "Ina-update pa ang detalye ng team.",
  },
  gallery: {
    eyebrow: "Gallery",
    title: "Sa loob ng klinika",
    intro: "Mga kamakailang larawan ng klinika at ng mga alagang inaalagaan namin.",
    empty: "Lalabas dito ang mga larawan ng klinika kapag nag-upload ang staff.",
    uploadNote: "Puwedeng magdagdag ng larawan ang staff sa Settings → Gallery.",
  },
  reviews: {
    eyebrow: "Feedback",
    title: "Nasaa Facebook ang mga review",
    body: "Hindi namin kinokopya ang mga review dito. Tingnan ang pinakabagong feedback, anunsyo, at payo sa Facebook page ng klinika.",
    cta: "Buksan ang Facebook page",
    messenger: "Mag-message sa Messenger",
  },
  readiness: {
    eyebrow: "Pampublikong serbisyo",
    title: "Ginawa para maipasa",
    body: "Pinapanatili ang CopeCares na angkop para sa pampublikong sektor. Ang parehong record, role, at safeguard ng klinika ay dokumentado para masuri ng LGU bago ang acquisition.",
    bullets: [
      "Role-based na account ng staff",
      "Soft-deleted na record para sa retention review",
      "Nakalathalang privacy notice, terms, at accessibility contact",
    ],
    cta: "Basahin ang privacy notice",
  },
  faq: {
    eyebrow: "FAQ",
    title: "Mga karaniwang tanong",
    items: [
      {
        question: "Kailangan ba ng appointment?",
        answer:
          "Nakakatulong ang appointment para makapaghanda ang klinika, pero tumatanggap ng walk-in kapag may oras. Ang online booking ang pinakamabilis na paraan para makareserba.",
      },
      {
        question: "Anong mga alaga ang ginagamot ninyo?",
        answer:
          "Aso at pusa ang pangunahing pasyente. Tumatanggap din ng ibang alagang hayop kapag may available na beterinaryo. Tumawag muna para sa exotic pets.",
      },
      {
        question: "Magkano ang check-up?",
        answer:
          "Nakalista ang bayad sa konsultasyon sa ilalim ng Mga Serbisyo. Hiwalay na binibigyan ng quote ang procedure, gamot, at laboratory test bago gawin.",
      },
      {
        question: "Puwede bang mag-cancel o magpalit ng oras?",
        answer:
          "Oo. Mag-sign in sa pet owner account at buksan ang appointment para i-cancel. Tumawag sa klinika kung kailangan ng ibang oras.",
      },
      {
        question: "Ano ang dadalhin sa unang bisita?",
        answer:
          "Dalhin ang dating medical record, vaccination history, at listahan ng gamot. Gumamit ng leash o carrier para sa kaligtasan ng alaga.",
      },
      {
        question: "Paano itinatago ang record?",
        answer:
          "Nasa system ng klinika ang detalye ng alaga at may-ari at ginagamit para sa care, billing, at follow-up. Basahin ang privacy notice para sa buong paliwanag.",
      },
    ],
  },
  contact: {
    eyebrow: "Bisitahin ang klinika",
    title: "Lokasyon at oras",
    body: "Puwedeng mag-walk in sa oras ng operasyon o mag-book muna. Kung hindi sigurado kung emergency ang kalagayan ng alaga, tumawag muna.",
    address: "Address",
    hours: "Oras",
    phone: "Telepono",
    email: "Email",
    directions: "Kunin ang direksyon",
    fallbackPhone: "Tumawag sa klinika para sa kasalukuyang numero.",
    mapTitle: "Mapa ng klinika",
  },
  footer: {
    tagline:
      "Pangangalaga, appointment, at record ng alaga para sa mga sambahayan sa Tacloban.",
    quickLinks: "Mabilis na link",
    contact: "Kontak",
    legal: "Mga patakaran",
    privacy: "Privacy notice",
    terms: "Terms of use",
    accessibility: "Accessibility",
    staff: "Staff sign in",
    owner: "Rehistro ng pet owner",
    rights: "Nakalaan ang lahat ng karapatan.",
    privacyContact: "Usapin sa data privacy",
    feedback: "Feedback sa accessibility",
  },
};

export const landingCopy: Record<Locale, LandingCopy> = { en, fil };
