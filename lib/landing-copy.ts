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
    hours: "Open Monday to Friday",
    phone: "Call",
    address: "Tacloban City",
  },
  hero: {
    eyebrow: "City Veterinary Office · Tacloban City",
    title: "Free veterinary care for every pet in Tacloban.",
    body: (clinicName: string) =>
      `${clinicName} provides anti-rabies vaccination, deworming, consultation, spay and neuter, pet registration, and animal control services for dogs and cats. Register online to keep your pet's records and appointments in one place.`,
    primary: "Register as pet owner",
    secondary: "Call the office",
    secondaryFallback: "Message us",
    trust: [
      "Monday to Friday, 8:00 AM – 5:00 PM",
      "Most basic services are free",
      "Walk-ins accepted during office hours",
    ],
    photoCaption: "Photos from the office and field activities appear here.",
    photoHint: "Staff can upload photos in Settings → Gallery.",
  },
  services: {
    eyebrow: "Services",
    title: "Veterinary services for Tacloban pets",
    intro:
      "Most basic services are free. Some procedures may have minimal fees, and limited slots are offered first come, first served. Ask the front desk before a procedure.",
    cta: "Register your pet",
    duration: "min",
    fallback: "Veterinary service.",
    empty: "Services are being updated. Please call the office for the current list.",
  },
  about: {
    eyebrow: "About the office",
    title: "Serving pets and families across Tacloban.",
    body: (clinicName: string) =>
      `${clinicName} (CVO) delivers accessible veterinary care for Tacloban City residents: anti-rabies vaccination, deworming, consultations, spay and neuter, pet registration, impounding, and community outreach.`,
    body2:
      "The office works with barangays, schools, and pet owners to prevent rabies and promote responsible pet ownership under the Animal Code of Tacloban City (City Ordinance No. 2006-09-264) and R.A. 9482, the Anti-Rabies Act of 2007.",
    bullets: [
      "One medical record for each pet",
      "Anti-rabies and deworming services",
      "Spay and neuter, including CNVR for strays",
      "Pet and dog registration",
    ],
    cards: [
      {
        title: "Barangay vaccination drives",
        body: "Vaccinators visit barangays for free anti-rabies shots, deworming, and registration.",
      },
      {
        title: "Spay and neuter",
        body: "Regular sterilization at the office and CNVR operations for stray dogs.",
      },
      {
        title: "Animal control",
        body: "Impounding of stray dogs and enforcement of the Animal Code.",
      },
      {
        title: "Rabies awareness",
        body: "IEC campaigns in schools and communities, especially every March.",
      },
    ],
  },
  visit: {
    eyebrow: "Planning a visit",
    title: "How to register and visit",
    intro:
      "New pet owners can register online in a few minutes, then add their pets and request a visit. Walk-ins are also accepted during office hours.",
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
    note: "Prefer to talk to someone? Call the office during office hours, or message the official Facebook page for schedules and announcements.",
  },
  team: {
    eyebrow: "Our team",
    title: "People your pet will meet",
    intro: "The CVO's veterinarians and staff handle consultations, vaccination drives, sterilization procedures, and front-desk concerns.",
    staffTitle: "Office staff",
    staffBody: "Front desk, vaccinators, assistants, and animal control support.",
    role: "Veterinarian",
    empty: "Team details are being updated.",
  },
  gallery: {
    eyebrow: "Gallery",
    title: "Inside the office and the field",
    intro: "Recent photos from the CVO, barangay drives, and the pets we look after.",
    empty: "Photos will appear here once staff upload them.",
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
    title: "Care that reaches every barangay.",
    body: "The CVO brings vaccination, deworming, registration, and sterilization services to barangays across Tacloban, not only to pet owners who can visit the office.",
    bullets: [
      "Free anti-rabies vaccination drives",
      "Barangay pet registration and deworming",
      "Spay, neuter, and CNVR for strays",
      "Rabies awareness in schools and communities",
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
          "Walk-ins are accepted during office hours, Monday to Friday. Registering online helps the office prepare and keeps your pet's records in one place.",
      },
      {
        question: "What pets do you treat?",
        answer:
          "Dogs and cats are the main patients. The CVO also handles stray dogs and other companion animals when a veterinarian is available.",
      },
      {
        question: "How much do services cost?",
        answer:
          "Most basic services, including anti-rabies vaccination and deworming, are free. Some procedures may have minimal fees. Ask the front desk before a procedure.",
      },
      {
        question: "Can I cancel or reschedule?",
        answer:
          "Yes. Sign in to your pet owner account and open the appointment to cancel it. Call the office if you need a different time.",
      },
      {
        question: "What should I bring on the first visit?",
        answer:
          "Bring previous medical records, vaccination history, and a list of current medicines. Use a leash or carrier for your pet's safety.",
      },
      {
        question: "How are my records stored?",
        answer:
          "Pet and owner details are stored in the CVO system and used for care and follow-up. Read the privacy notice for the full explanation.",
      },
    ],
  },
  contact: {
    eyebrow: "Visit the office",
    title: "Location and hours",
    body: "Walk in during office hours or register ahead. If you are unsure whether your pet needs urgent care, call first.",
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
      "Veterinary care, pet registration, and records for households in Tacloban City.",
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
    hours: "Bukas Lunes hanggang Biyernes",
    phone: "Tumawag",
    address: "Lungsod ng Tacloban",
  },
  hero: {
    eyebrow: "City Veterinary Office · Lungsod ng Tacloban",
    title: "Libreng pangangalaga para sa bawat alaga sa Tacloban.",
    body: (clinicName: string) =>
      `Nagbibigay ang ${clinicName} ng anti-rabies vaccination, deworming, konsultasyon, spay at neuter, pet registration, at animal control para sa mga aso at pusa. Magrehistro online para maitala ang record at appointment ng alaga ninyo.`,
    primary: "Magrehistro bilang pet owner",
    secondary: "Tumawag sa opisina",
    secondaryFallback: "Mag-message",
    trust: [
      "Lunes hanggang Biyernes, 8:00 AM – 5:00 PM",
      "Libre ang karamihan sa basic services",
      "Tumatanggap ng walk-in sa oras ng opisina",
    ],
    photoCaption: "Dito lalabas ang mga larawan ng opisina at field activities.",
    photoHint: "Puwedeng mag-upload ang staff sa Settings → Gallery.",
  },
  services: {
    eyebrow: "Mga serbisyo",
    title: "Mga serbisyong beterinaryo para sa mga alaga sa Tacloban",
    intro:
      "Libre ang karamihan sa basic services. May kaunting bayad ang ilang procedure, at first come, first served ang limitadong slots. Magtanong sa front desk bago ang procedure.",
    cta: "Irehistro ang alaga",
    duration: "min",
    fallback: "Serbisyong beterinaryo.",
    empty:
      "Ina-update pa ang listahan ng serbisyo. Tumawag sa opisina para sa kasalukuyang listahan.",
  },
  about: {
    eyebrow: "Tungkol sa opisina",
    title: "Naglilingkod sa mga alaga at pamilya sa buong Tacloban.",
    body: (clinicName: string) =>
      `Ang ${clinicName} (CVO) ay nagbibigay ng accessible na pangangalaga para sa mga residente ng Tacloban: anti-rabies vaccination, deworming, konsultasyon, spay at neuter, pet registration, impounding, at community outreach.`,
    body2:
      "Nakikipagtulungan ang opisina sa mga barangay, paaralan, at pet owners para maiwasan ang rabies at maisulong ang responsible pet ownership sa ilalim ng Animal Code of Tacloban City (City Ordinance No. 2006-09-264) at R.A. 9482, ang Anti-Rabies Act of 2007.",
    bullets: [
      "Isang medical record para sa bawat alaga",
      "Anti-rabies at deworming services",
      "Spay at neuter, kasama ang CNVR para sa mga stray",
      "Pet at dog registration",
    ],
    cards: [
      {
        title: "Barangay vaccination drives",
        body: "Bumibisita ang mga vaccinator sa barangay para sa libreng anti-rabies, deworming, at registration.",
      },
      {
        title: "Spay at neuter",
        body: "Regular na sterilization sa opisina at CNVR operations para sa mga stray dog.",
      },
      {
        title: "Animal control",
        body: "Impounding ng mga stray dog at pagpapatupad ng Animal Code.",
      },
      {
        title: "Rabies awareness",
        body: "IEC campaigns sa mga paaralan at komunidad, lalo na tuwing Marso.",
      },
    ],
  },
  visit: {
    eyebrow: "Pagpaplano ng bisita",
    title: "Paano magrehistro at bumisita",
    intro:
      "Ang bagong pet owner ay puwedeng magrehistro online sa ilang minuto, magdagdag ng alaga, at mag-request ng bisita. Tumatanggap din ng walk-in sa oras ng opisina.",
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
    note: "Mas gusto ninyong kausapin ang staff? Tumawag sa opisina sa oras ng trabaho, o mag-message sa official Facebook page para sa schedule at anunsyo.",
  },
  team: {
    eyebrow: "Ang team",
    title: "Mga taong makikilala ng alaga ninyo",
    intro:
      "Ang mga beterinaryo at staff ng CVO ang humahawak ng konsultasyon, vaccination drives, sterilization, at mga tanong sa front desk.",
    staffTitle: "Staff ng opisina",
    staffBody: "Front desk, vaccinators, assistants, at animal control support.",
    role: "Beterinaryo",
    empty: "Ina-update pa ang detalye ng team.",
  },
  gallery: {
    eyebrow: "Gallery",
    title: "Sa loob ng opisina at sa field",
    intro: "Mga kamakailang larawan ng CVO, barangay drives, at ng mga alagang inaalagaan namin.",
    empty: "Lalabas dito ang mga larawan kapag nag-upload ang staff.",
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
    title: "Umaabot ang serbisyo sa bawat barangay.",
    body: "Dinadala ng CVO ang vaccination, deworming, registration, at sterilization sa mga barangay sa Tacloban, hindi lamang sa mga makakapunta sa opisina.",
    bullets: [
      "Libreng anti-rabies vaccination drives",
      "Barangay pet registration at deworming",
      "Spay, neuter, at CNVR para sa mga stray",
      "Rabies awareness sa paaralan at komunidad",
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
          "Tumatanggap ng walk-in sa oras ng opisina, Lunes hanggang Biyernes. Nakakatulong ang online registration para makapaghanda ang opisina at maitala ang record ng alaga.",
      },
      {
        question: "Anong mga alaga ang ginagamot ninyo?",
        answer:
          "Aso at pusa ang pangunahing pasyente. Hinahawakan din ng CVO ang mga stray dog at iba pang alagang hayop kapag may available na beterinaryo.",
      },
      {
        question: "Magkano ang mga serbisyo?",
        answer:
          "Libre ang karamihan sa basic services, kasama ang anti-rabies vaccination at deworming. May kaunting bayad ang ilang procedure. Magtanong sa front desk bago ang procedure.",
      },
      {
        question: "Puwede bang mag-cancel o magpalit ng oras?",
        answer:
          "Oo. Mag-sign in sa pet owner account at buksan ang appointment para i-cancel. Tumawag sa opisina kung kailangan ng ibang oras.",
      },
      {
        question: "Ano ang dadalhin sa unang bisita?",
        answer:
          "Dalhin ang dating medical record, vaccination history, at listahan ng gamot. Gumamit ng leash o carrier para sa kaligtasan ng alaga.",
      },
      {
        question: "Paano itinatago ang record?",
        answer:
          "Nasa system ng CVO ang detalye ng alaga at may-ari at ginagamit para sa care at follow-up. Basahin ang privacy notice para sa buong paliwanag.",
      },
    ],
  },
  contact: {
    eyebrow: "Bisitahin ang opisina",
    title: "Lokasyon at oras",
    body: "Puwedeng mag-walk in sa oras ng opisina o magrehistro muna. Kung hindi sigurado kung emergency ang kalagayan ng alaga, tumawag muna.",
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
      "Pangangalaga, pet registration, at record ng alaga para sa mga sambahayan sa Lungsod ng Tacloban.",
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
