import { AlertTriangle } from 'lucide-react';

export function LegalDisclaimer() {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-5">
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-amber-800 mb-1">Yasal Uyarı</p>
          <p className="text-sm text-amber-700 leading-relaxed">
            Bu analiz yalnızca ön değerlendirme amaçlıdır. Kesin hukuki görüş yerine geçmez. 
            Resmi marka araştırması için Türk Patent ve Marka Kurumu (TÜRKPATENT) üzerinden 
            sorgulama yapmanız önerilir. MarkaRadar bir marka vekili, patent vekili veya 
            avukat yerine geçmez.
          </p>
        </div>
      </div>
    </div>
  );
}
