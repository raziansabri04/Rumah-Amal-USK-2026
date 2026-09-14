export type SidebarLanguage = 'id' | 'en' | 'ar';

export const sidebarDictionary: Record<SidebarLanguage, {
  zakat: string;
  infaq: string;
  riwayat: string;
  kalkulator: string;
}> = {
  id: {
    zakat: "Zakat",
    infaq: "Infaq",
    riwayat: "Cek Riwayat Zakat & Infaq",
    kalkulator: "Kalkulator Zakat",
  },
  en: {
    zakat: "Zakat",
    infaq: "Infaq",
    riwayat: "Check Zakat & Infaq History",
    kalkulator: "Zakat Calculator",
  },
  ar: {
    zakat: "الزكاة",
    infaq: "الإنفاق",
    riwayat: "التحقق من سجل الزكاة والإنفاق",
    kalkulator: "حاسبة الزكاة",
  },
};
