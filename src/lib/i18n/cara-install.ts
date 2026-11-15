export type InstallGuideLanguage = "id" | "en" | "ar";
export type InstallGuideTab = "android" | "ios" | "desktop";

export interface InstallGuideStep {
  title: string;
  desc: string;
}

export interface InstallGuidePlatform {
  label: string;
  steps: InstallGuideStep[];
  note?: string;
}

export interface InstallGuideDictionary {
  /** Teks kecil di samping tombol Install (footer) dan di dalam modal */
  footerLink: string;
  modalLink: string;
  ctaButton: string;

  pageTitle: string;
  pageSubtitle: string;
  whatTitle: string;
  whatBody: string;
  benefits: string[];
  chooseDevice: string;
  tabs: Record<InstallGuideTab, string>;
  platforms: Record<InstallGuideTab, InstallGuidePlatform>;
  inAppWarning: string;
  installedNote: string;
  faqTitle: string;
  faq: { q: string; a: string }[];
  ctaTitle: string;
  ctaDesc: string;
  backHome: string;
}

export const installGuideDictionary: Record<
  InstallGuideLanguage,
  InstallGuideDictionary
> = {
  id: {
    footerLink: "Cara install",
    modalLink: "Masih bingung? Lihat panduan lengkap",
    ctaButton: "Install Aplikasi",

    pageTitle: "Cara Install Aplikasi Rumah Amal",
    pageSubtitle:
      "Pasang Rumah Amal di perangkat Anda agar bisa dibuka seperti aplikasi biasa, cukup sekali ketuk dari layar utama.",
    whatTitle: "Apa itu install aplikasi?",
    whatBody:
      "Rumah Amal bisa dipasang langsung dari browser, tanpa Play Store atau App Store. Setelah dipasang, ikon Rumah Amal akan muncul di layar utama HP (tampilan awal tempat ikon-ikon aplikasi berada) atau di komputer Anda.",
    benefits: [
      "Buka cepat dari ikon, tanpa mengetik alamat website",
      "Gratis dan ringan, tidak memakan banyak ruang penyimpanan",
      "Bisa menerima notifikasi pengumuman terbaru",
      "Halaman yang pernah dibuka tetap bisa diakses saat sinyal lemah",
    ],
    chooseDevice: "Pilih perangkat Anda",
    tabs: { android: "Android", ios: "iPhone / iPad", desktop: "Komputer" },
    platforms: {
      android: {
        label: "Android (Chrome)",
        steps: [
          {
            title: "Buka lewat Chrome",
            desc: "Buka situs ini di Chrome. Jika tombol Install Aplikasi terlihat di bagian bawah halaman, ketuk saja dan jendela install akan langsung muncul.",
          },
          {
            title: "Ketuk ikon titik tiga (⋮)",
            desc: "Ikon ini ada di pojok kanan atas Chrome.",
          },
          {
            title: "Pilih “Instal aplikasi” atau “Tambahkan ke layar utama”",
            desc: "Nama menunya bisa berbeda tergantung versi Chrome dan bahasa HP (Install app / Add to Home screen).",
          },
          {
            title: "Ketuk “Instal”, lalu cek layar utama",
            desc: "Ikon Rumah Amal akan muncul di layar utama atau di daftar aplikasi HP Anda.",
          },
        ],
      },
      ios: {
        label: "iPhone / iPad (Safari)",
        steps: [
          {
            title: "Buka lewat Safari",
            desc: "Di iPhone dan iPad, install hanya bisa dilakukan lewat Safari, bukan Chrome atau browser lain.",
          },
          {
            title: "Ketuk tombol Bagikan",
            desc: "Ikonnya berbentuk kotak dengan panah ke atas, ada di bagian bawah layar (di iPad ada di bagian atas).",
          },
          {
            title: "Pilih “Tambah ke Layar Utama”",
            desc: "Gulir menu ke bawah sampai menemukan pilihan ini (Add to Home Screen).",
          },
          {
            title: "Ketuk “Tambah”",
            desc: "Tombol ada di pojok kanan atas. Ikon Rumah Amal akan muncul di layar utama.",
          },
        ],
        note: "Notifikasi di iPhone hanya bisa diterima di iOS 16.4 atau lebih baru, dan setelah aplikasi ditambahkan ke layar utama.",
      },
      desktop: {
        label: "Komputer (Chrome / Edge)",
        steps: [
          {
            title: "Buka lewat Chrome atau Edge",
            desc: "Kedua browser ini mendukung install aplikasi di komputer.",
          },
          {
            title: "Cari ikon install di kolom alamat",
            desc: "Di ujung kanan kolom alamat, cari ikon berbentuk layar dengan panah ke bawah, lalu klik. Jika tidak ada, buka menu ⋮ dan cari “Instal Rumah Amal” (di Chrome kadang ada di dalam “Simpan dan bagikan”).",
          },
          {
            title: "Klik “Instal”",
            desc: "Rumah Amal akan terbuka di jendelanya sendiri dan ikonnya muncul di komputer Anda.",
          },
        ],
        note: "Firefox dan Safari di komputer belum mendukung install aplikasi. Silakan gunakan Chrome atau Edge.",
      },
    },
    inAppWarning:
      "Anda sedang membuka halaman ini dari dalam aplikasi lain (misalnya Instagram atau Facebook), sehingga install biasanya tidak bisa dilakukan dari sini. Buka tautan ini di Chrome (Android) atau Safari (iPhone), lalu ikuti langkah di bawah.",
    installedNote:
      "Rumah Amal sudah terpasang di perangkat ini. Buka lewat ikon di layar utama atau di daftar aplikasi.",
    faqTitle: "Pertanyaan yang sering muncul",
    faq: [
      {
        q: "Tombol Install atau menu Instal tidak muncul?",
        a: "Biasanya karena aplikasi sudah terpasang, atau Anda memakai browser yang tidak mendukung (misalnya Firefox), atau membuka situs dari dalam aplikasi lain seperti Instagram. Coba buka lewat Chrome atau Safari.",
      },
      {
        q: "Bagaimana cara mengaktifkan notifikasi?",
        a: "Gunakan tombol Notifikasi di bagian bawah halaman (footer). Jika notifikasi diblokir, buka pengaturan situs di browser Anda lalu izinkan notifikasi.",
      },
      {
        q: "Bagaimana cara menghapus aplikasinya?",
        a: "Android: tekan lama ikon, lalu pilih Copot pemasangan. iPhone: tekan lama ikon, lalu pilih Hapus App. Komputer: buka aplikasinya, klik menu ⋮ di jendela aplikasi, lalu pilih Copot pemasangan Rumah Amal.",
      },
      {
        q: "Apakah install ini berbayar atau berisiko?",
        a: "Tidak. Install ini gratis dan hanya menambahkan pintasan ke website Rumah Amal di perangkat Anda, tanpa memakan banyak ruang penyimpanan.",
      },
    ],
    ctaTitle: "Siap memasang?",
    ctaDesc:
      "Gunakan tombol di bawah. Jika jendela install tidak muncul, ikuti langkah di atas sesuai perangkat Anda.",
    backHome: "Kembali ke Beranda",
  },

  en: {
    footerLink: "How to install",
    modalLink: "Still confused? See the full guide",
    ctaButton: "Install App",

    pageTitle: "How to Install the Rumah Amal App",
    pageSubtitle:
      "Add Rumah Amal to your device so it opens like a regular app, with a single tap from your home screen.",
    whatTitle: "What does installing mean?",
    whatBody:
      "Rumah Amal can be installed straight from your browser, with no Play Store or App Store needed. Once installed, the Rumah Amal icon appears on your phone's home screen (the first screen where your app icons live) or on your computer.",
    benefits: [
      "Open it quickly from an icon, without typing the website address",
      "Free and lightweight, it barely uses any storage",
      "Receive the latest announcement notifications",
      "Pages you have opened before stay available when your signal is weak",
    ],
    chooseDevice: "Choose your device",
    tabs: { android: "Android", ios: "iPhone / iPad", desktop: "Computer" },
    platforms: {
      android: {
        label: "Android (Chrome)",
        steps: [
          {
            title: "Open in Chrome",
            desc: "Open this site in Chrome. If the Install App button is visible at the bottom of the page, just tap it and the install window will appear.",
          },
          {
            title: "Tap the three-dot icon (⋮)",
            desc: "It is in the top-right corner of Chrome.",
          },
          {
            title: "Choose “Install app” or “Add to Home screen”",
            desc: "The menu name may differ depending on your Chrome version and phone language.",
          },
          {
            title: "Tap “Install”, then check your home screen",
            desc: "The Rumah Amal icon will appear on your home screen or in your app list.",
          },
        ],
      },
      ios: {
        label: "iPhone / iPad (Safari)",
        steps: [
          {
            title: "Open in Safari",
            desc: "On iPhone and iPad, installing only works through Safari, not Chrome or other browsers.",
          },
          {
            title: "Tap the Share button",
            desc: "It looks like a square with an arrow pointing up, at the bottom of the screen (at the top on iPad).",
          },
          {
            title: "Choose “Add to Home Screen”",
            desc: "Scroll down the menu until you find this option.",
          },
          {
            title: "Tap “Add”",
            desc: "The button is in the top-right corner. The Rumah Amal icon will appear on your home screen.",
          },
        ],
        note: "Notifications on iPhone only work on iOS 16.4 or newer, and only after the app is added to the home screen.",
      },
      desktop: {
        label: "Computer (Chrome / Edge)",
        steps: [
          {
            title: "Open in Chrome or Edge",
            desc: "Both browsers support installing apps on a computer.",
          },
          {
            title: "Look for the install icon in the address bar",
            desc: "At the right end of the address bar, find the icon shaped like a screen with a down arrow and click it. If it is not there, open the ⋮ menu and look for “Install Rumah Amal” (in Chrome it is sometimes under “Save and share”).",
          },
          {
            title: "Click “Install”",
            desc: "Rumah Amal opens in its own window and its icon appears on your computer.",
          },
        ],
        note: "Firefox and Safari on computers do not support installing apps. Please use Chrome or Edge.",
      },
    },
    inAppWarning:
      "You are viewing this page inside another app (such as Instagram or Facebook), so installing usually will not work from here. Open this link in Chrome (Android) or Safari (iPhone), then follow the steps below.",
    installedNote:
      "Rumah Amal is already installed on this device. Open it from the icon on your home screen or app list.",
    faqTitle: "Frequently asked questions",
    faq: [
      {
        q: "The Install button or menu option is missing?",
        a: "Usually the app is already installed, you are using a browser that does not support it (such as Firefox), or you opened the site inside another app like Instagram. Try opening it in Chrome or Safari.",
      },
      {
        q: "How do I turn on notifications?",
        a: "Use the Notifications toggle at the bottom of the page (footer). If notifications are blocked, open your browser's site settings and allow them.",
      },
      {
        q: "How do I remove the app?",
        a: "Android: long-press the icon, then choose Uninstall. iPhone: long-press the icon, then choose Remove App. Computer: open the app, click the ⋮ menu in its window, then choose Uninstall Rumah Amal.",
      },
      {
        q: "Does installing cost anything or carry any risk?",
        a: "No. It is free and only adds a shortcut to the Rumah Amal website on your device, without using much storage.",
      },
    ],
    ctaTitle: "Ready to install?",
    ctaDesc:
      "Use the button below. If the install window does not appear, follow the steps above for your device.",
    backHome: "Back to Home",
  },

  ar: {
    footerLink: "طريقة التثبيت",
    modalLink: "هل ما زلت محتاراً؟ اطلع على الدليل الكامل",
    ctaButton: "تثبيت التطبيق",

    pageTitle: "كيفية تثبيت تطبيق Rumah Amal",
    pageSubtitle:
      "ثبّت Rumah Amal على جهازك لتفتحه كأي تطبيق عادي بنقرة واحدة من الشاشة الرئيسية.",
    whatTitle: "ما معنى تثبيت التطبيق؟",
    whatBody:
      "يمكن تثبيت Rumah Amal مباشرة من المتصفح دون الحاجة إلى متجر Play أو App Store. بعد التثبيت ستظهر أيقونة Rumah Amal على الشاشة الرئيسية للهاتف (الشاشة التي تظهر فيها أيقونات التطبيقات) أو على الحاسوب.",
    benefits: [
      "فتح سريع من الأيقونة دون كتابة عنوان الموقع",
      "مجاني وخفيف ولا يستهلك مساحة تخزين كبيرة",
      "استقبال إشعارات آخر الإعلانات",
      "الصفحات التي زرتها سابقاً تبقى متاحة عند ضعف الإشارة",
    ],
    chooseDevice: "اختر جهازك",
    tabs: { android: "أندرويد", ios: "آيفون / آيباد", desktop: "الحاسوب" },
    platforms: {
      android: {
        label: "أندرويد (Chrome)",
        steps: [
          {
            title: "افتح الموقع في Chrome",
            desc: "افتح هذا الموقع في متصفح Chrome. وإن ظهر زر «Install Aplikasi» أسفل الصفحة فاضغط عليه لتظهر نافذة التثبيت مباشرة.",
          },
          {
            title: "اضغط على أيقونة النقاط الثلاث (⋮)",
            desc: "تجدها في الزاوية العلوية اليمنى من Chrome.",
          },
          {
            title: "اختر «تثبيت التطبيق» أو «إضافة إلى الشاشة الرئيسية»",
            desc: "قد يختلف اسم القائمة حسب إصدار Chrome ولغة الهاتف.",
          },
          {
            title: "اضغط «تثبيت» ثم تحقق من الشاشة الرئيسية",
            desc: "ستظهر أيقونة Rumah Amal على الشاشة الرئيسية أو في قائمة تطبيقات هاتفك.",
          },
        ],
      },
      ios: {
        label: "آيفون / آيباد (Safari)",
        steps: [
          {
            title: "افتح الموقع في Safari",
            desc: "على آيفون وآيباد لا يمكن التثبيت إلا عبر Safari، وليس Chrome أو متصفح آخر.",
          },
          {
            title: "اضغط زر المشاركة",
            desc: "أيقونته مربع بسهم لأعلى، أسفل الشاشة (وفي آيباد تكون أعلى الشاشة).",
          },
          {
            title: "اختر «إضافة إلى الشاشة الرئيسية»",
            desc: "مرّر القائمة لأسفل حتى تجد هذا الخيار.",
          },
          {
            title: "اضغط «إضافة»",
            desc: "تجدها في الزاوية العلوية اليمنى. ستظهر أيقونة Rumah Amal على الشاشة الرئيسية.",
          },
        ],
        note: "لا تصل الإشعارات على آيفون إلا في iOS 16.4 أو أحدث، وبعد إضافة التطبيق إلى الشاشة الرئيسية.",
      },
      desktop: {
        label: "الحاسوب (Chrome / Edge)",
        steps: [
          {
            title: "افتح الموقع في Chrome أو Edge",
            desc: "هذان المتصفحان يدعمان تثبيت التطبيقات على الحاسوب.",
          },
          {
            title: "ابحث عن أيقونة التثبيت في شريط العنوان",
            desc: "في أقصى طرف شريط العنوان ابحث عن أيقونة شاشة بسهم لأسفل ثم اضغط عليها. وإن لم تجدها فافتح القائمة ⋮ وابحث عن «تثبيت Rumah Amal» (وفي Chrome قد تكون داخل «حفظ ومشاركة»).",
          },
          {
            title: "اضغط «تثبيت»",
            desc: "سيفتح Rumah Amal في نافذة مستقلة وتظهر أيقونته على حاسوبك.",
          },
        ],
        note: "متصفحا Firefox وSafari على الحاسوب لا يدعمان تثبيت التطبيقات. يرجى استخدام Chrome أو Edge.",
      },
    },
    inAppWarning:
      "أنت تفتح هذه الصفحة من داخل تطبيق آخر (مثل Instagram أو Facebook)، وغالباً لا يمكن التثبيت من هنا. افتح الرابط في Chrome (أندرويد) أو Safari (آيفون) ثم اتبع الخطوات أدناه.",
    installedNote:
      "تطبيق Rumah Amal مثبّت بالفعل على هذا الجهاز. افتحه من الأيقونة على الشاشة الرئيسية أو من قائمة التطبيقات.",
    faqTitle: "الأسئلة الشائعة",
    faq: [
      {
        q: "لا يظهر زر التثبيت أو خيار التثبيت في القائمة؟",
        a: "غالباً لأن التطبيق مثبّت بالفعل، أو لأنك تستخدم متصفحاً لا يدعم ذلك (مثل Firefox)، أو تفتح الموقع من داخل تطبيق آخر مثل Instagram. جرّب فتحه عبر Chrome أو Safari.",
      },
      {
        q: "كيف أفعّل الإشعارات؟",
        a: "استخدم مفتاح «الإشعارات» أسفل الصفحة. وإن كانت الإشعارات محظورة فافتح إعدادات الموقع في المتصفح واسمح بها.",
      },
      {
        q: "كيف أحذف التطبيق؟",
        a: "أندرويد: اضغط مطولاً على الأيقونة ثم اختر إلغاء التثبيت. آيفون: اضغط مطولاً على الأيقونة ثم اختر حذف التطبيق. الحاسوب: افتح التطبيق واضغط القائمة ⋮ في نافذته ثم اختر إلغاء تثبيت Rumah Amal.",
      },
      {
        q: "هل التثبيت مدفوع أو فيه مخاطر؟",
        a: "لا، فهو مجاني ولا يضيف سوى اختصار إلى موقع Rumah Amal على جهازك دون استهلاك مساحة كبيرة.",
      },
    ],
    ctaTitle: "جاهز للتثبيت؟",
    ctaDesc:
      "استخدم الزر أدناه. وإن لم تظهر نافذة التثبيت فاتبع الخطوات أعلاه حسب جهازك.",
    backHome: "العودة إلى الرئيسية",
  },
};