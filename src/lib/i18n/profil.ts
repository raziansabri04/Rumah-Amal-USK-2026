export type ProfilLanguage = 'id' | 'en' | 'ar';

export const profilDictionary = {
  id: {
    breadcrumbHome: 'Beranda',
    breadcrumbProfil: 'Profil',
    menuItems: [
      { href: '/profil', label: 'Profil Singkat' },
      { href: '/profil/visi-misi', label: 'Visi dan Misi' },
      { href: '/profil/landasan-utama', label: 'Landasan Utama' },
      { href: '/profil/fokus-program', label: 'Fokus Program' },
      { href: '/profil/struktur-organisasi', label: 'Struktur Organisasi Rumah Amal USK' },
    ],
    profilSingkat: {
      title: 'RUMAH AMAL MASJID JAMIK USK',
      p1: 'Kami menyediakan sistem dan layanan yang memudahkan para muzakki atau donatur dalam menunaikan zakat, infaq, shadaqah, maupun wakaf dengan sebaik-baiknya. Menjadikan masjid sebagai pusat pemberdayaan ekonomi umat, Mendayagunakan dana zakat, infaq shadaqah maupun wakaf melalui program-program yang terasa manfaatnya, Mengangkat martabat mustahik, dan membahagiakan muzakki dan donatur.',
      p2: 'Rumah Amal Masjid Jamik USK berdiri sebagai wujud kepedulian civitas akademika Universitas Syiah Kuala Banda Aceh terhadap pengelolaan zakat yang profesional, transparan, dan akuntabel di lingkungan kampus dan masyarakat sekitar.',
      p3: 'Melalui berbagai program unggulan di bidang pendidikan, ekonomi, kesehatan, dan dakwah, Rumah Amal senantiasa berkomitmen untuk menjadi penghubung kebaikan antara muzakki dan mustahik secara berkelanjutan.',
    },
    visiMisi: {
      visiTitle: 'VISI',
      visiText: 'Menjadi Lembaga Amil Zakat dan pemberdayaan ekonomi umat yang inovatif, responsif, profesional dan terkemuka untuk kemaslahatan bersama yang berbasis masjid.',
      misiTitle: 'MISI',
      misi1: 'Menyediakan sistem dan layanan yang memudahkan para muzakki atau donatur dalam menunaikan zakat, infaq, shadaqah, maupun wakaf dengan sebaik-baiknya.',
      misi2: 'Mendayagunakan dana zakat, infaq, shadaqah maupun wakaf melalui program-program yang terasa manfaatnya.',
      misi3: 'Menjadikan masjid sebagai pusat pemberdayaan ekonomi umat.',
      misi4: 'Mengangkat martabat mustahik dan membahagiakan muzakki serta donatur.',
    },
    landasanUtama: {
      title: 'LANDASAN UTAMA',
      items: [
        {
          title: 'Prinsip Syariah',
          desc: 'Seluruh penghimpunan dan penyaluran dana sesuai dengan kaidah syariat Islam dan fatwa MUI.',
        },
        {
          title: 'Amanah & Transparan',
          desc: 'Laporan keuangan diaudit secara berkala dan dipublikasikan secara terbuka kepada donatur.',
        },
        {
          title: 'Kemaslahatan Umat',
          desc: 'Fokus pada dampak jangka panjang penyelesaian kemiskinan dan dukungan pendidikan mahasiswa.',
        },
        {
          title: 'Inovasi Berkelanjutan',
          desc: 'Pengembangan sistem digital pembayaran zakat dan pendataan berbasis IT.',
        },
      ],
    },
    fokusProgram: {
      title: 'FOKUS PROGRAM',
      items: [
        'Peningkatan fundraising internal & eksternal',
        'Peningkatan kemandirian ekonomi masjid & jama’ah',
        'Penyaluran dana zakat, infaq, shadaqah & wakaf',
        'Pemberdayaan ekonomi masyarakat muslim',
        'Peningkatan kualitas pendidikan umat',
        'Pemberdayaan sosial & syi’ar dakwah',
      ],
    },
    strukturOrganisasi: {
      title: 'STRUKTUR ORGANISASI RUMAH AMAL USK',
    },
  },
  en: {
    breadcrumbHome: 'Home',
    breadcrumbProfil: 'Profile',
    menuItems: [
      { href: '/profil', label: 'Brief Profile' },
      { href: '/profil/visi-misi', label: 'Vision & Mission' },
      { href: '/profil/landasan-utama', label: 'Core Principles' },
      { href: '/profil/fokus-program', label: 'Program Focus' },
      { href: '/profil/struktur-organisasi', label: 'Organizational Structure' },
    ],
    profilSingkat: {
      title: 'RUMAH AMAL MASJID JAMIK USK',
      p1: 'We provide systems and services that facilitate muzakki and donors in fulfilling zakat, infaq, shadaqah, and waqf in the best possible manner. Transforming the mosque into a center of economic empowerment for the community, utilizing zakat, infaq, shadaqah, and waqf funds through impactful programs, uplifting the dignity of mustahik, and bringing joy to donors.',
      p2: 'Rumah Amal Masjid Jamik USK was established as a manifestation of concern from the academic community of Universitas Syiah Kuala Banda Aceh toward professional, transparent, and accountable zakat management within the campus environment and surrounding society.',
      p3: 'Through various flagship programs in education, economics, health, and dawah, Rumah Amal continuously commits to being a sustainable bridge of goodness between donors (muzakki) and beneficiaries (mustahik).',
    },
    visiMisi: {
      visiTitle: 'VISION',
      visiText: 'To become an innovative, responsive, professional, and leading Amil Zakat institution and community economic empowerment body for shared welfare based in the mosque.',
      misiTitle: 'MISSION',
      misi1: 'To provide systems and services that facilitate muzakki or donors in fulfilling zakat, infaq, shadaqah, and waqf in the best manner.',
      misi2: 'To optimize zakat, infaq, shadaqah, and waqf funds through programs with tangible benefits.',
      misi3: 'To establish the mosque as a center for community economic empowerment.',
      misi4: 'To elevate the dignity of mustahik and bring satisfaction to muzakki and donors.',
    },
    landasanUtama: {
      title: 'CORE PRINCIPLES',
      items: [
        {
          title: 'Sharia Compliance',
          desc: 'All fundraising and distribution adhere strictly to Islamic Sharia principles and MUI fatwas.',
        },
        {
          title: 'Trustworthy & Transparent',
          desc: 'Financial reports are regularly audited and publicly disclosed to all donors.',
        },
        {
          title: 'Public Welfare',
          desc: 'Focusing on long-term poverty alleviation and student educational support.',
        },
        {
          title: 'Continuous Innovation',
          desc: 'Developing digital zakat payment systems and IT-based data management.',
        },
      ],
    },
    fokusProgram: {
      title: 'PROGRAM FOCUS',
      items: [
        'Enhancement of internal & external fundraising',
        'Fostering economic independence of mosque & congregation',
        'Effective distribution of zakat, infaq, shadaqah & waqf funds',
        'Economic empowerment of the Muslim community',
        'Improving the quality of community education',
        'Social empowerment & Islamic dawah propagation',
      ],
    },
    strukturOrganisasi: {
      title: 'ORGANIZATIONAL STRUCTURE OF RUMAH AMAL USK',
    },
  },
  ar: {
    breadcrumbHome: 'الرئيسية',
    breadcrumbProfil: 'الملف التعريفي',
    menuItems: [
      { href: '/profil', label: 'نبذة عن المؤسسة' },
      { href: '/profil/visi-misi', label: 'الرؤية والرسالة' },
      { href: '/profil/landasan-utama', label: 'المرتكزات الأساسية' },
      { href: '/profil/fokus-program', label: 'محاور البرامج' },
      { href: '/profil/struktur-organisasi', label: 'الهيكل التنظيمي' },
    ],
    profilSingkat: {
      title: 'Rumah Amal – Masjid Jamik USK',
      p1: 'نحن نوفر أنظمة وخدمات تسهل على المزكين والمتبرعين أداء الزكاة والإنفاق والصدقة والوقف بأفضل طريقة. جعل المسجد مركزاً للتمكين الاقتصادي للأمة، واستغلال أموال الزكاة والإنفاق والصدقة والوقف من خلال برامج ملموسة الأثر، لرفع كرامة المستحقين وإسعاد المزكين والمتبرعين.',
      p2: 'تأسست Rumah Amal بمسجد Masjid Jamik جامعة سياه كوالا (USK) تجسيداً لاهتمام الأسرة الأكاديمية بجامعة سياه كوالا بباندا أتشيه نحو إدارة احترافية وشفافة وموثوقة للزكاة في الحرم الجامعي والمجتمع المحيط.',
      p3: 'من خلال برامج رائدة متنوعة في مجالات التعليم والاقتصاد والصحة والدعوة، تلتزم المؤسسة باستمرار بأن تكون جسراً مستداماً للخير بين المزكين والمستحقين.',
    },
    visiMisi: {
      visiTitle: 'الرؤية',
      visiText: 'أن نكون مؤسسة أموال زكاة وتمكين اقتصادي مبتكرة واستجابية واحترافية ورائدة لتحقيق المصلحة المشتركة المرتكزة على المسجد.',
      misiTitle: 'الرسالة',
      misi1: 'توفير أنظمة وخدمات تسهل على المزكين والمتبرعين أداء الزكاة والإنفاق والصدقة والوقف بأفضل شكل.',
      misi2: 'الاستفادة الأمثل من أموال الزكاة والإنفاق والصدقة والوقف عبر برامج ذات نفع ملموس.',
      misi3: 'جعل المسجد مركزاً للتمكين الاقتصادي للمجتمع.',
      misi4: 'رفع كرامة المستحقين وإدخال السرور على قلوب المزكين والمتبرعين.',
    },
    landasanUtama: {
      title: 'المرتكزات الأساسية',
      items: [
        {
          title: 'الالتزام بالشريعة',
          desc: 'جميع عمليات جمع الأموال وتوزيعها تتوافق تماماً مع أحكام الشريعة الإسلامية وفتاوى مجلس العلماء.',
        },
        {
          title: 'الأمانة والشفافية',
          desc: 'تتم مراجعة التقارير المالية بشكل دوري ونشرها بشفافية لجميع المتبرعين.',
        },
        {
          title: 'مصلحة الأمة',
          desc: 'التركيز على الأثر طويل الأجل لمعالجة الفقر ودعم تعليم الطلاب.',
        },
        {
          title: 'الابتكار المستمر',
          desc: 'تطوير أنظمة دفع الزكاة الرقمية وإدارة البيانات القائمة على تكنولوجيا المعلومات.',
        },
      ],
    },
    fokusProgram: {
      title: 'محاور البرامج',
      items: [
        'تعزيز جمع التبرعات الداخلي والخارجي',
        'تعزيز الاستقلالية الاقتصادية للمسجد والمصلين',
        'التوزيع الفعال لأموال الزكاة والإنفاق والصدقة والوقف',
        'التمكين الاقتصادي للمجتمع المسلم',
        'رفع جودة التعليم الأمتي',
        'التمكين الاجتماعي ونشر الدعوة الإسلامية',
      ],
    },
    strukturOrganisasi: {
      title: 'الهيكل التنظيمي لمؤسسة RUMAH AMAL USK',
    },
  },
};
