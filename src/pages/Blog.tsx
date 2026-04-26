import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, ArrowRight, BookOpen } from 'lucide-react';
import { useSEO } from '@/hooks/useSEO';
import { useEffect } from 'react';
import { blogPosts } from '@/data/blogPosts';

export function Blog() {
  useSEO({
    title: 'Blog',
    description: 'Marka tescili, çakışma analizi ve hukuki süreçler hakkında kapsamlı rehberler ve güncel bilgiler.',
    canonical: 'https://patentradar.pro/blog',
  });

  // BlogPosting list Schema.org
  useEffect(() => {
    const listSchema = {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      itemListElement: blogPosts.map((post, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `https://patentradar.pro/blog/${post.slug}`,
        name: post.title,
      })),
    };
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(listSchema);
    script.id = 'blog-list-schema';
    document.head.appendChild(script);
    return () => { document.getElementById('blog-list-schema')?.remove(); };
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl mb-4">
            <BookOpen className="w-6 h-6 text-blue-600" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">Marka Radar Blog</h1>
          <p className="text-slate-600">Marka tescili, çakışma analizi ve marka hukuku hakkında kapsamlı rehberler</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogPosts.map((post, i) => (
            <motion.div
              key={post.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              <Link
                to={`/blog/${post.slug}`}
                className="block bg-white rounded-xl shadow-sm border border-slate-100 p-6 h-full hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex items-center gap-2 text-xs text-slate-400 mb-3">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(post.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                </div>
                <h2 className="text-lg font-bold text-slate-900 mb-2 leading-snug">{post.title}</h2>
                <p className="text-sm text-slate-600 leading-relaxed mb-4">{post.excerpt}</p>
                <span className="inline-flex items-center gap-1 text-sm font-medium text-blue-600">
                  Devamını Oku <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
