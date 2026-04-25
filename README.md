# MarkaRadar

AI destekli marka çakışma ve risk analizi platformu. Markanızı başvuru öncesi analiz edin, benzer markaları bulun, çakışma riskini değerlendirin ve markanızı koruma yolları önerin.

## Özellikler

- **AI Çakışma Analizi** — Yapay zeka markanızı binlerce kayıtlı marka ile karşılaştırır
- **Gerçek Zamanlı Araştırma** — Web'de aktif markaları ve işletmeleri bulur (Claude/OpenAI)
- **Risk Skoru (0-100)** — Anlaşılır bir puanlama sistemi
- **PDF Rapor** — Profesyonel tasarımlı detaylı rapor indirme
- **Özgünleşme Önerileri** — Riski azaltmak için stratejik öneriler
- **İtiraz Savunma Dosyası** — Markanıza gelen itirazlara karşı hukuki savunma dosyası hazırlama
- **PayTR Ödeme Entegrasyonu** — Her sorgu için güvenli ödeme (299 TL)

## Teknolojiler

- React 19 + TypeScript
- Vite 7
- Tailwind CSS 3.4 + shadcn/ui
- Framer Motion
- html2canvas + jsPDF
- PayTR iframe entegrasyonu

## Kurulum

### 1. Frontend

```bash
npm install
npm run dev
```

### 2. Backend (PayTR için zorunlu)

```bash
cd backend
npm install
npm start   # localhost:3001
```

### 3. Çevre Değişkenleri

`.env` dosyası oluşturun:

```env
# AI API Keys (en az biri gereklidir)
VITE_OPENAI_API_KEY=sk-...
VITE_CLAUDE_API_KEY=sk-ant-...

# PayTR Configuration
PAYTR_MERCHANT_ID=your_merchant_id
PAYTR_MERCHANT_KEY=your_merchant_key
PAYTR_MERCHANT_SALT=your_merchant_salt
PAYTR_TEST_MODE=1

# Backend
VITE_API_URL=http://localhost:3001
BACKEND_PORT=3001
```

> Claude API key önceliklidir, hata durumunda OpenAI'ye fallback yapılır. API key olmadan da mock analiz çalışır.

## Build

```bash
npm run build
```

## PayTR Test Modu

1. `PAYTR_TEST_MODE=1` olarak ayarlayın
2. Test kart bilgileri için PayTR dokümantasyonuna bakın
3. Canlıya geçişte `PAYTR_TEST_MODE=0` yapın ve gerçek bilgileri girin

## Proje Yapısı

```
├── backend/              # Express.js PayTR API
│   ├── server.js         # Token oluşturma + callback
│   └── package.json
├── src/
│   ├── pages/            # Sayfa bileşenleri
│   ├── components/       # UI bileşenleri
│   ├── services/         # API & business logic
│   ├── data/             # Mock veriler
│   └── types/            # TypeScript tanımları
├── .env.example
├── index.html
└── package.json
```

## Yasal Uyarı

Bu sistem resmi marka araştırması veya hukuki danışmanlık sunmaz. Sonuçlar yalnızca ön değerlendirme amaçlıdır. Resmi işlem öncesinde Türk Patent ve Marka Kurumu (TÜRKPATENT) üzerinden sorgulama yapmanız ve bir hukuk uzmanına danışmanız önerilir.
