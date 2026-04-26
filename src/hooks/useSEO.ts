import { useEffect } from 'react';

interface SEOOptions {
  title: string;
  description?: string;
  canonical?: string;
  ogType?: string;
  ogImage?: string;
  noIndex?: boolean;
}

function applySEO(opts: SEOOptions) {
  const { title, description, canonical, ogType = 'website', ogImage = '/hero-illustration.png', noIndex = false } = opts;
  const fullTitle = title ? `${title} | MarkaRadar` : 'MarkaRadar';
  document.title = fullTitle;

  if (description) {
    let descEl = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!descEl) {
      descEl = document.createElement('meta');
      descEl.name = 'description';
      document.head.appendChild(descEl);
    }
    descEl.content = description;
  }

  if (canonical) {
    let canEl = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canEl) {
      canEl = document.createElement('link');
      canEl.rel = 'canonical';
      document.head.appendChild(canEl);
    }
    canEl.href = canonical;
  }

  const ogTags: Record<string, string> = {
    'og:title': fullTitle,
    'og:description': description || 'MarkaRadar - AI destekli marka çakışma ve risk analizi platformu.',
    'og:type': ogType,
    'og:url': canonical || 'https://patentradar.pro/',
    'og:image': ogImage,
    'og:image:width': '1200',
    'og:image:height': '630',
    'og:site_name': 'MarkaRadar',
    'og:locale': 'tr_TR',
  };

  Object.entries(ogTags).forEach(([property, content]) => {
    let el = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement | null;
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute('property', property);
      document.head.appendChild(el);
    }
    el.content = content;
  });

  const twTags: Record<string, string> = {
    'twitter:card': 'summary_large_image',
    'twitter:title': fullTitle,
    'twitter:description': description || 'MarkaRadar - AI destekli marka çakışma ve risk analizi platformu.',
    'twitter:image': ogImage,
  };

  Object.entries(twTags).forEach(([name, content]) => {
    let el = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
    if (!el) {
      el = document.createElement('meta');
      el.name = name;
      document.head.appendChild(el);
    }
    el.content = content;
  });

  if (noIndex) {
    let robotsEl = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null;
    if (!robotsEl) {
      robotsEl = document.createElement('meta');
      robotsEl.name = 'robots';
      document.head.appendChild(robotsEl);
    }
    robotsEl.content = 'noindex, nofollow';
  }
}

// Overload 1: eski API (string, string?)
export function useSEO(title: string, description?: string): void;

// Overload 2: yeni API (options obje)
export function useSEO(options: SEOOptions): void;

export function useSEO(arg1: string | SEOOptions, arg2?: string) {
  useEffect(() => {
    const previousTitle = document.title;

    if (typeof arg1 === 'string') {
      applySEO({ title: arg1, description: arg2 });
    } else {
      applySEO(arg1);
    }

    return () => {
      document.title = previousTitle;
    };
  }, [arg1, arg2]);
}
