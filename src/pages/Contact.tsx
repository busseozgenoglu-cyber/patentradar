import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, CheckCircle, Clock, MessageSquare } from 'lucide-react';
import { useSEO } from '@/hooks/useSEO';

export function Contact() {
  useSEO('İletişim', 'MarkaRadar ile iletişime geçin. Soru, öneri ve işbirliği talepleriniz için bize ulaşın.');
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setSubmitted(true);
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-2xl mx-auto mb-14">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">İletişim</h1>
          <p className="text-slate-600 leading-relaxed">
            Sorularınız, önerileriniz veya işbirliği talepleriniz için bize ulaşabilirsiniz. En kısa sürede size dönüş yapacağız.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Contact Info */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-4">İletişim Bilgileri</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">E-posta</p>
                    <a href="mailto:info@markaradar.com" className="text-sm text-slate-600 hover:text-blue-600 transition-colors">info@markaradar.com</a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">Telefon</p>
                    <p className="text-sm text-slate-600">+90 212 555 00 00</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">Adres</p>
                    <p className="text-sm text-slate-600">İstanbul, Türkiye</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Çalışma Saatleri</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <div className="flex-1 flex justify-between text-sm">
                    <span className="text-slate-600">Pazartesi - Cuma</span>
                    <span className="font-medium text-slate-800">09:00 - 18:00</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <div className="flex-1 flex justify-between text-sm">
                    <span className="text-slate-600">Cumartesi</span>
                    <span className="font-medium text-slate-800">10:00 - 14:00</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <div className="flex-1 flex justify-between text-sm">
                    <span className="text-slate-600">Pazar</span>
                    <span className="font-medium text-slate-500">Kapalı</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-xl border border-blue-100 p-6">
              <div className="flex items-start gap-3">
                <MessageSquare className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-blue-900 mb-1">Hızlı Destek</p>
                  <p className="text-sm text-blue-800 leading-relaxed">
                    Sık sorulan sorular ve hızlı yanıtlar için <a href="#/yardim-merkezi" className="underline font-medium">Yardım Merkezi</a>'ni ziyaret edebilirsiniz.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 sm:p-8">
              {submitted ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-emerald-500" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 mb-2">Mesajınız Gönderildi</h2>
                  <p className="text-sm text-slate-600">En kısa sürede size dönüş yapacağız. Teşekkür ederiz!</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Ad Soyad</label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        placeholder="Ahmet Yılmaz"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">E-posta</label>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={e => setForm({ ...form, email: e.target.value })}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        placeholder="ornek@email.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Konu</label>
                    <select
                      required
                      value={form.subject}
                      onChange={e => setForm({ ...form, subject: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white"
                    >
                      <option value="">Konu seçiniz</option>
                      <option value="general">Genel Soru</option>
                      <option value="support">Teknik Destek</option>
                      <option value="payment">Ödeme ve Fatura</option>
                      <option value="business">İşbirliği ve Kurumsal</option>
                      <option value="feedback">Öneri ve Geri Bildirim</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Mesajınız</label>
                    <textarea
                      required
                      rows={5}
                      value={form.message}
                      onChange={e => setForm({ ...form, message: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                      placeholder="Mesajınızı buraya yazın..."
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition-all hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Mesaj Gönder
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
