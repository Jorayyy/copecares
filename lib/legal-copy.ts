import type { Locale } from "@/lib/locale";

const en = {
  skip: "Skip to content",
  nav: {
    back: "Back to home",
    privacy: "Privacy notice",
    terms: "Terms of use",
    accessibility: "Accessibility",
  },
  updated: "Last updated: 9 November 2026",
  contactTitle: "Contact",
  contactBody:
    "Questions about this page, your records, or accessibility can be sent to the clinic using the details below.",
  privacy: {
    eyebrow: "Privacy",
    title: "Privacy Notice",
    intro:
      "This notice explains how CopeCares Veterinary Clinic handles personal information in this website and clinic system. It is written to be read alongside the Data Privacy Act of 2012 (RA 10173) and its implementing rules.",
    sections: [
      {
        heading: "1. What this notice covers",
        body: [
          "This notice applies to the public website, the pet owner portal, and the clinic system used by staff. It covers information about pet owners, household contacts, and the animals brought to the clinic.",
        ],
      },
      {
        heading: "2. Information we collect",
        body: [
          "We collect the information you provide when you register, book an appointment, or visit the clinic, and the records staff create during care.",
        ],
        list: [
          "Account details: name, email address, phone number, and password.",
          "Pet details: species, breed, birth date, weight, and medical history.",
          "Visit records: appointments, diagnoses, treatments, vaccinations, and notes.",
          "Transaction records: services availed, amounts, payments, and receipts.",
          "Technical information needed to operate and secure the service.",
        ],
      },
      {
        heading: "3. Why we use the information",
        body: [
          "We use personal information to provide veterinary care, schedule appointments, maintain medical records, process payments, follow up on visits, and run the clinic safely.",
          "We may also use information to comply with legal obligations, respond to lawful requests from authorities, and improve the reliability of the service.",
        ],
      },
      {
        heading: "4. Who can see the information",
        body: [
          "Access is limited by role. Veterinarians and authorized clinic staff can see records needed for care and operations. Pet owners can see their own account and their pets' records.",
          "We do not sell personal information. We may share it with service providers that help operate the system under appropriate confidentiality terms, or with government authorities when required by law.",
        ],
      },
      {
        heading: "5. How long we keep information",
        body: [
          "Records are kept while the account is active and for the period required for clinic, financial, and legal purposes. Records deleted through the system may be retained in a recoverable state for review before final disposal.",
        ],
      },
      {
        heading: "6. How we protect information",
        body: [
          "We use role-based accounts, access controls, and secure connections to reduce the risk of unauthorized access. Staff are expected to handle records with confidentiality.",
          "No system is completely secure. If a personal data breach affects your information, the clinic will assess and handle it in line with applicable rules.",
        ],
      },
      {
        heading: "7. Your rights",
        body: [
          "Under RA 10173, you may have the right to be informed, to access your information, to correct errors, to object to certain processing, to erasure or blocking in qualifying cases, and to file a complaint with the National Privacy Commission.",
          "To exercise a right, contact the clinic and describe the record involved. The clinic may ask for proof of identity before acting on the request.",
        ],
      },
      {
        heading: "8. Questions and complaints",
        body: [
          "Start with the clinic. Privacy concerns are routed to the person responsible for data protection so they can be reviewed and answered. If the concern is not resolved, you may contact the National Privacy Commission.",
        ],
      },
    ],
  },
  terms: {
    eyebrow: "Terms",
    title: "Terms of Use",
    intro:
      "These terms govern the use of the CopeCares website and clinic system. By using the service, you agree to follow them.",
    sections: [
      {
        heading: "1. The service",
        body: [
          "The service supports clinic operations such as appointments, pet records, billing, and communication. It is not a substitute for an in-person examination or emergency care.",
        ],
      },
      {
        heading: "2. Accounts",
        body: [
          "You must provide accurate information and keep your credentials confidential. You are responsible for activity under your account.",
          "Clinic staff accounts are created and managed by the administrator. Access may be suspended when it is no longer needed or when these terms are violated.",
        ],
      },
      {
        heading: "3. Appointments and cancellations",
        body: [
          "Booking a slot does not guarantee a diagnosis or outcome. Arrive on time and bring relevant records. Cancel or reschedule when you can so the slot can be used by another patient.",
          "For emergencies, call the clinic or go to an available emergency facility instead of relying on an online booking.",
        ],
      },
      {
        heading: "4. Fees and payment",
        body: [
          "Prices shown on the website are the clinic's current published rates and may change. Procedures, medicines, and tests may be quoted separately. Payment is due as explained by the front desk.",
        ],
      },
      {
        heading: "5. Acceptable use",
        body: [
          "Do not attempt to access accounts or records you are not authorized to use, disrupt the service, upload malicious files, or use the service for unlawful purposes.",
        ],
      },
      {
        heading: "6. Medical information",
        body: [
          "Information on this website is general and does not replace a veterinarian's assessment. Always follow the instructions given during a consultation.",
        ],
      },
      {
        heading: "7. Availability and changes",
        body: [
          "The service may be unavailable during maintenance or due to events outside the clinic's control. Features and these terms may change; the updated version will be posted on this page.",
        ],
      },
      {
        heading: "8. Liability",
        body: [
          "To the extent permitted by law, the clinic is not liable for indirect losses arising from use of the website. Nothing here removes rights that cannot be waived under Philippine law.",
        ],
      },
      {
        heading: "9. Governing law",
        body: [
          "These terms are governed by the laws of the Republic of the Philippines.",
        ],
      },
    ],
  },
  accessibility: {
    eyebrow: "Accessibility",
    title: "Accessibility Statement",
    intro:
      "The clinic wants the website and clinic system to be usable by as many people as possible, including pet owners using assistive technology.",
    sections: [
      {
        heading: "1. Our target",
        body: [
          "We aim to follow the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA as a practical target for the public website and account screens.",
          "This is a continuing effort, not a claim of complete conformance. We review issues as they are reported.",
        ],
      },
      {
        heading: "2. What we have done",
        body: [
          "The public pages and forms are built with the following in mind:",
        ],
        list: [
          "Keyboard access to links, form fields, and controls.",
          "Labels and error messages for form inputs.",
          "Readable contrast and a light/dark appearance option.",
          "Responsive layouts for phones and larger screens.",
          "Plain language in English and Filipino.",
        ],
      },
      {
        heading: "3. Known limitations",
        body: [
          "Some content is provided by third parties and may not fully follow our accessibility practices, including the embedded Google Map and Facebook links.",
          "Photos uploaded by staff may not always have detailed descriptions. If an image is important to you, contact the clinic and staff can explain it.",
        ],
      },
      {
        heading: "4. Feedback",
        body: [
          "If something is hard to use, tell the clinic what page you were on and what happened. Reports are reviewed and used to fix the service. We will respond as soon as practicable.",
        ],
      },
      {
        heading: "5. Other ways to reach us",
        body: [
          "If the website prevents you from booking or reading information, call or visit the clinic during operating hours and staff will assist you directly.",
        ],
      },
    ],
  },
};

export type LegalCopy = typeof en;
export type LegalDocument = LegalCopy["privacy"];

const fil: LegalCopy = {
  skip: "Lumaktaw sa nilalaman",
  nav: {
    back: "Bumalik sa home",
    privacy: "Privacy notice",
    terms: "Terms of use",
    accessibility: "Accessibility",
  },
  updated: "Huling na-update: 9 Nobyembre 2026",
  contactTitle: "Kontak",
  contactBody:
    "Ang mga tanong tungkol sa pahinang ito, sa record ninyo, o sa accessibility ay maaaring ipadala sa klinika gamit ang mga detalye sa ibaba.",
  privacy: {
    eyebrow: "Privacy",
    title: "Privacy Notice",
    intro:
      "Ipinapaliwanag ng notice na ito kung paano pinoproseso ng CopeCares Veterinary Clinic ang personal na impormasyon sa website at sistema ng klinika. Isinulat ito kasama ng Data Privacy Act of 2012 (RA 10173) at ng implementing rules nito.",
    sections: [
      {
        heading: "1. Sakop ng notice",
        body: [
          "Saklaw ng notice na ito ang pampublikong website, pet owner portal, at sistema ng klinika na ginagamit ng staff. Kasama ang impormasyon tungkol sa may-ari ng alaga, kasamahan sa bahay, at mga alagang dinala sa klinika.",
        ],
      },
      {
        heading: "2. Impormasyong kinokolekta",
        body: [
          "Kinokolekta namin ang impormasyong ibinibigay ninyo kapag nagrehistro, nag-book, o bumisita sa klinika, at ang record na ginagawa ng staff habang nag-aalaga.",
        ],
        list: [
          "Detalye ng account: pangalan, email, numero ng telepono, at password.",
          "Detalye ng alaga: species, breed, kaarawan, timbang, at medical history.",
          "Record ng bisita: appointment, diagnosis, treatment, bakuna, at notes.",
          "Record ng transaksyon: serbisyong ginamit, halaga, bayad, at resibo.",
          "Teknikal na impormasyong kailangan para patakbuhin at protektahan ang serbisyo.",
        ],
      },
      {
        heading: "3. Bakit ginagamit ang impormasyon",
        body: [
          "Ginagamit namin ang personal na impormasyon para magbigay ng pangangalaga, mag-iskedyul ng appointment, magtago ng medical record, magproseso ng bayad, mag-follow up, at patakbuhin nang maayos ang klinika.",
          "Maaari rin itong gamitin para sumunod sa legal na obligasyon, tumugon sa lawful na request ng awtoridad, at pagbutihin ang serbisyo.",
        ],
      },
      {
        heading: "4. Sino ang makakakita",
        body: [
          "Limitado ang access ayon sa role. Ang mga beterinaryo at awtorisadong staff ay makakakita ng record na kailangan sa care at operasyon. Ang pet owner ay makakakita ng sariling account at record ng alaga nila.",
          "Hindi namin ibinibenta ang personal na impormasyon. Maaari naming ibahagi ito sa service provider na tumutulong sa sistema sa ilalim ng confidentiality terms, o sa awtoridad ng gobyerno kapag kailangan ng batas.",
        ],
      },
      {
        heading: "5. Gaano katagal itinatago",
        body: [
          "Itinatago ang record habang aktibo ang account at sa panahong kailangan para sa clinic, financial, at legal na layunin. Ang record na tinanggal sa sistema ay maaaring itago muna sa recoverable state para sa review bago tuluyang i-dispose.",
        ],
      },
      {
        heading: "6. Paano pinoprotektahan",
        body: [
          "Gumagamit kami ng role-based account, access control, at secure na koneksyon para bawasan ang risk ng hindi awtorisadong access. Inaasahan ang staff na tratuhin ang record nang may confidentiality.",
          "Walang sistemang ganap na secure. Kung may personal data breach na apektado ang impormasyon ninyo, susuriin at hahawakan ito ng klinika ayon sa applicable rules.",
        ],
      },
      {
        heading: "7. Mga karapatan ninyo",
        body: [
          "Sa ilalim ng RA 10173, maaaring may karapatan kayong maipaalam, ma-access ang impormasyon, maitama ang mali, tumutol sa ilang processing, ma-erase o ma-block sa mga kwalipikadong kaso, at maghain ng reklamo sa National Privacy Commission.",
          "Para gamitin ang karapatan, kontakin ang klinika at ilarawan ang record na tinutukoy. Maaaring humingi ng proof of identity bago kumilos sa request.",
        ],
      },
      {
        heading: "8. Tanong at reklamo",
        body: [
          "Magsimula sa klinika. Ang usapin sa privacy ay ipapasa sa taong responsable sa data protection para masuri at masagot. Kung hindi ito naresolba, maaari kayong lumapit sa National Privacy Commission.",
        ],
      },
    ],
  },
  terms: {
    eyebrow: "Terms",
    title: "Terms of Use",
    intro:
      "Sinasaklaw ng terms na ito ang paggamit ng CopeCares website at sistema ng klinika. Sa paggamit ng serbisyo, sumasang-ayon kayo sa mga ito.",
    sections: [
      {
        heading: "1. Ang serbisyo",
        body: [
          "Sinusuportahan ng serbisyo ang operasyon ng klinika tulad ng appointment, record ng alaga, billing, at komunikasyon. Hindi ito kapalit ng personal na eksaminasyon o emergency care.",
        ],
      },
      {
        heading: "2. Mga account",
        body: [
          "Kailangang tumpak ang impormasyon at kumpidensyal ang credential ninyo. Kayo ang responsable sa aktibidad sa account ninyo.",
          "Ang staff account ay ginagawa at pinamamahalaan ng administrator. Maaaring i-suspend ang access kapag hindi na kailangan o nilabag ang terms na ito.",
        ],
      },
      {
        heading: "3. Appointment at cancellation",
        body: [
          "Ang pag-book ng slot ay hindi garantiya ng diagnosis o resulta. Dumating sa tamang oras at dalhin ang relevant record. Mag-cancel o mag-reschedule kapag kaya para magamit ng ibang pasyente ang slot.",
          "Para sa emergency, tumawag sa klinika o pumunta sa available na emergency facility; huwag umasa sa online booking.",
        ],
      },
      {
        heading: "4. Bayad at pagbabayad",
        body: [
          "Ang presyo sa website ay kasalukuyang published rate ng klinika at maaaring magbago. Ang procedure, gamot, at test ay maaaring hiwalay na i-quote. Bayaran ito ayon sa paliwanag ng front desk.",
        ],
      },
      {
        heading: "5. Wastong paggamit",
        body: [
          "Huwag subukang pumasok sa account o record na hindi awtorisado, gambalain ang serbisyo, mag-upload ng malicious file, o gamitin ang serbisyo sa labag sa batas na layunin.",
        ],
      },
      {
        heading: "6. Impormasyong medikal",
        body: [
          "Ang impormasyon sa website ay pangkalahatan at hindi kapalit ng assessment ng beterinaryo. Sundin ang tagubilin na ibinigay sa konsultasyon.",
        ],
      },
      {
        heading: "7. Availability at pagbabago",
        body: [
          "Maaaring hindi available ang serbisyo habang may maintenance o dahil sa pangyayaring wala sa kontrol ng klinika. Maaaring magbago ang feature at terms; ipapaskil ang updated version sa pahinang ito.",
        ],
      },
      {
        heading: "8. Pananagutan",
        body: [
          "Sa abot ng pinapayagan ng batas, hindi mananagot ang klinika sa indirect loss mula sa paggamit ng website. Walang inaalis dito na karapatang hindi maaaring i-waive sa ilalim ng batas ng Pilipinas.",
        ],
      },
      {
        heading: "9. Batas na namamahala",
        body: [
          "Ang terms na ito ay pinamamahalaan ng batas ng Republika ng Pilipinas.",
        ],
      },
    ],
  },
  accessibility: {
    eyebrow: "Accessibility",
    title: "Accessibility Statement",
    intro:
      "Gusto ng klinika na magamit ang website at sistema ng klinika ng mas maraming tao hangga't maaari, kabilang ang pet owner na gumagamit ng assistive technology.",
    sections: [
      {
        heading: "1. Target namin",
        body: [
          "Layunin naming sundin ang Web Content Accessibility Guidelines (WCAG) 2.1 Level AA bilang praktikal na target para sa public website at account screens.",
          "Patuloy itong pagsisikap, hindi claim ng kumpletong conformance. Sinusuri namin ang isyu kapag may nag-uulat.",
        ],
      },
      {
        heading: "2. Mga nagawa na",
        body: [
          "Ang public pages at forms ay ginawa na isinasaalang-alang ang:",
        ],
        list: [
          "Keyboard access sa link, form field, at control.",
          "Label at error message para sa form input.",
          "Madaling basahing contrast at light/dark na opsyon.",
          "Responsive layout para sa telepono at mas malaking screen.",
          "Simpleng wika sa English at Filipino.",
        ],
      },
      {
        heading: "3. Kilalang limitasyon",
        body: [
          "Ang ilang content ay galing sa third party at maaaring hindi ganap na sumusunod sa accessibility practice namin, kabilang ang embedded Google Map at Facebook links.",
          "Ang larawan na ina-upload ng staff ay maaaring walang detalyadong description. Kung mahalaga sa inyo ang isang larawan, kontakin ang klinika at ipapaliwanag ito ng staff.",
        ],
      },
      {
        heading: "4. Feedback",
        body: [
          "Kung may mahirap gamitin, sabihin sa klinika kung anong page ang ginagamit ninyo at ano ang nangyari. Sinusuri ang ulat at ginagamit para ayusin ang serbisyo. Tutugon kami sa lalong madaling panahon.",
        ],
      },
      {
        heading: "5. Ibang paraan ng pag-contact",
        body: [
          "Kung hadlang ang website para makapag-book o makabasa ng impormasyon, tumawag o bumisita sa klinika sa oras ng operasyon at tutulungan kayo ng staff nang direkta.",
        ],
      },
    ],
  },
};

export const legalCopy: Record<Locale, LegalCopy> = { en, fil };
