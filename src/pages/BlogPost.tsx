import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, ArrowRight, Search } from 'lucide-react';
import { useSEO } from '@/hooks/useSEO';
import { postMeta } from '@/data/blogPosts';

export function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const [html, setHtml] = useState('');
  const [loading, setLoading] = useState(true);
  const meta = slug ? postMeta[slug] : null;

  useSEO({
    title: meta?.title ?? 'Blog',
    description: meta?.description ?? '',
    canonical: `https://patentradar.pro/#/blog/${slug}`,
    ogType: 'article',
  });

  useEffect(() => {
    if (!slug) return;
    fetch(`/blog/${slug}.html`)
      .then(r => r.text())
      .then(setHtml)
      .finally(() => setLoading(false));
  }, [slug]);

  // Breadcrumb Schema.org
  useEffect(() => {
    if (!meta || !slug) return;
    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Ana Sayfa',
          item: 'https://patentradar.pro/',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Blog',
          item: 'https://patentradar.pro/#/blog',
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: meta.title,
          item: `https://patentradar.pro/#/blog/${slug}`,
        },
      ],
    };
    const bScript = document.createElement('script');
    bScript.type = 'application/ld+json';
    bScript.text = JSON.stringify(breadcrumbSchema);
    bScript.id = 'blogpost-breadcrumb-schema';
    document.head.appendChild(bScript);
    return () => { document.getElementById('blogpost-breadcrumb-schema')?.remove(); };
  }, [meta, slug]);

  // Article Schema.org
  useEffect(() => {
    if (!meta || !slug) return;
    const articleSchema = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: meta.title,
      description: meta.description,
      image: 'https://patentradar.pro/hero-illustration.png',
      url: `https://patentradar.pro/#/blog/${slug}`,
      datePublished: meta.date + 'T08:00:00+03:00',
      dateModified: meta.date + 'T08:00:00+03:00',
      author: {
        '@type': 'Organization',
        name: 'MarkaRadar',
        url: 'https://patentradar.pro/',
      },
      publisher: {
        '@type': 'Organization',
        name: 'MarkaRadar',
        logo: {
          '@type': 'ImageObject',
          url: 'https://patentradar.pro/hero-illustration.png',
        },
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `https://patentradar.pro/#/blog/${slug}`,
      },
      articleSection: 'Marka Hukuku',
    };
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(articleSchema);
    script.id = 'blogpost-article-schema';
    document.head.appendChild(script);
    return () => { document.getElementById('blogpost-article-schema')?.remove(); };
  }, [meta, slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 pt-24 pb-16 flex items-center justify-center">
        <div className="animate-pulse text-slate-400">Yükleniyor...</div>
      </div>
    );
  }

  if (!html || !meta) {
    return (
      <div className="min-h-screen bg-slate-50 pt-24 pb-16 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Yazı Bulunamadı</h1>
          <Link to="/blog" className="text-blue-600 hover:underline">Bloga Dön</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Breadcrumb */}
          <nav aria-label="breadcrumb" className="mb-4">
            <ol className="flex items-center gap-2 text-sm text-slate-400">
              <li><Link to="/" className="hover:text-slate-600 transition-colors">Ana Sayfa</Link></li>
              <li>/</li>
              <li><Link to="/blog" className="hover:text-slate-600 transition-colors">Blog</Link></li>
              <li>/</li>
              <li className="text-slate-600 max-w-[200px] truncate" title={meta.title}>{meta.title}</li>
            </ol>
          </nav>

          <Link to="/blog" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800 mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Bloga Dön
          </Link>

          <article className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 sm:p-10">
            <div className="flex items-center gap-2 text-sm text-slate-400 mb-4">
              <Calendar className="w-4 h-4" />
              <time dateTime={meta.date}>{new Date(meta.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}</time>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6 leading-tight">{meta.title}</h1>

            <div
              className="prose prose-slate max-w-none prose-headings:text-slate-900 prose-p:text-slate-600 prose-a:text-blue-600 prose-strong:text-slate-800 prose-li:text-slate-600"
              dangerouslySetInnerHTML={{ __html: html }}
            />

            {/* CTA */}
            <div className="mt-12 p-6 bg-blue-50 rounded-xl border border-blue-100">
              <h3 className="text-lg font-bold text-slate-900 mb-2">Markanızı Hemen Analiz Edin</h3>
              <p className="text-slate-600 mb-4">Yapay zeka destekli marka çakışma analizi ile markanızın risk skorunu öğrenin. Benzer markaları tespit edin ve markanızı koruyun.</p>
              <Link
                to="/analyze"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition-all hover:shadow-lg"
              >
                <Search className="w-4 h-4" />
                Ücretsiz Analiz Başlat
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </article>
        </motion.div>
      </div>
    </div>
  );
}
