import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, Lock, Loader2, AlertCircle, CheckCircle, ExternalLink } from 'lucide-react';
import { paytrService } from '@/services/paytrService';
import { authService } from '@/services/authService';
import { paymentService } from '@/services/paymentService';

interface PaytrModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'analysis' | 'defense';
  description: string;
  onPaid: () => void;
}

export function PaytrModal({ isOpen, onClose, type, description, onPaid }: PaytrModalProps) {
  const amount = paymentService.getPrice(type);
  const [step, setStep] = useState<'form' | 'loading' | 'iframe' | 'success' | 'error'>('form');
  const [error, setError] = useState('');
  const [iframeUrl, setIframeUrl] = useState('');
  const [orderId, setOrderId] = useState('');

  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('Türkiye');

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user) {
      setUserName(user.name || '');
      setEmail(user.email || '');
    }
    if (isOpen) {
      setStep('form');
      setError('');
      setIframeUrl('');
      setOrderId(paytrService.generateOrderId());
    }
  }, [isOpen]);

  const handlePay = useCallback(async () => {
    if (!userName || !email) {
      setError('Ad soyad ve e-posta zorunludur.');
      return;
    }
    setStep('loading');
    setError('');

    try {
      const userIp = await paytrService.getClientIp();
      const okUrl = `${window.location.origin}/#/odeme/basarili`;
      const failUrl = `${window.location.origin}/#/odeme/basarisiz`;

      const result = await paytrService.getToken({
        email,
        payment_amount: amount,
        merchant_oid: orderId,
        user_name: userName,
        user_address: address,
        user_phone: phone || '05555555555',
        user_ip: userIp,
        merchant_ok_url: okUrl,
        merchant_fail_url: failUrl,
      });

      if (result.status === 'success' && result.iframe_url) {
        setIframeUrl(result.iframe_url);
        setStep('iframe');
        // Record the payment intent locally
        paymentService.recordPayment(type, description);
      } else {
        throw new Error(result.error || 'PayTR token alınamadı');
      }
    } catch (err: any) {
      setError(err.message || 'Ödeme başlatılırken bir hata oluştu.');
      setStep('error');
    }
  }, [userName, email, phone, address, amount, orderId, type, description]);

  const handleIframeComplete = () => {
    setStep('success');
    setTimeout(() => {
      onPaid();
      onClose();
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-blue-500" />
                <h3 className="text-base font-bold text-slate-900">PayTR Güvenli Ödeme</h3>
              </div>
              <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {step === 'form' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div className="text-center mb-6">
                    <div className="text-4xl font-extrabold text-slate-900 mb-1">{amount} <span className="text-lg font-medium text-slate-500">TL</span></div>
                    <p className="text-sm text-slate-500">{description}</p>
                    <p className="text-xs text-slate-400 mt-1">Sipariş No: {orderId}</p>
                  </div>

                  {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
                    </div>
                  )}

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Ad Soyad</label>
                      <input
                        type="text"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        placeholder="Ahmet Yılmaz"
                        required
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">E-posta</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="ornek@email.com"
                        required
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Telefon</label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="0555 555 55 55"
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Adres</label>
                      <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="İstanbul, Türkiye"
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handlePay}
                    className="w-full mt-6 py-3.5 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition-all hover:shadow-lg flex items-center justify-center gap-2"
                  >
                    <CreditCard className="w-4 h-4" />
                    PayTR ile {amount} TL Öde
                  </button>

                  <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-400">
                    <Lock className="w-3 h-3" />
                    <span>256-bit SSL şifreleme ile güvenli ödeme</span>
                  </div>
                </motion.div>
              )}

              {step === 'loading' && (
                <div className="py-12 text-center">
                  <Loader2 className="w-10 h-10 text-blue-500 animate-spin mx-auto mb-4" />
                  <p className="text-sm text-slate-600 font-medium">PayTR güvenli ödeme sayfası hazırlanıyor...</p>
                  <p className="text-xs text-slate-400 mt-1">Lütfen bekleyin</p>
                </div>
              )}

              {step === 'iframe' && iframeUrl && (
                <div className="space-y-3">
                  <div className="relative rounded-xl overflow-hidden border border-slate-200" style={{ height: '480px' }}>
                    <iframe
                      src={iframeUrl}
                      className="w-full h-full border-0"
                      title="PayTR Güvenli Ödeme"
                      sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleIframeComplete}
                      className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Ödemeyi Tamamladım
                    </button>
                    <a
                      href={iframeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2.5 border border-slate-200 text-slate-600 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-1.5"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Yeni Sekme
                    </a>
                  </div>
                </div>
              )}

              {step === 'success' && (
                <div className="py-10 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4"
                  >
                    <CheckCircle className="w-8 h-8 text-emerald-600" />
                  </motion.div>
                  <h4 className="text-lg font-bold text-slate-900 mb-1">Ödeme Başarılı!</h4>
                  <p className="text-sm text-slate-500">İşleminiz tamamlandı. Yönlendiriliyorsunuz...</p>
                </div>
              )}

              {step === 'error' && (
                <div className="py-8 text-center">
                  <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
                  <h4 className="text-lg font-bold text-slate-900 mb-1">Ödeme Başlatılamadı</h4>
                  <p className="text-sm text-red-600 mb-4">{error}</p>
                  <button
                    onClick={() => setStep('form')}
                    className="px-6 py-2.5 bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold rounded-lg transition-colors"
                  >
                    Tekrar Dene
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
