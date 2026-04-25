import { useEffect } from 'react';

export function useSEO(title: string, description?: string) {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = title ? `${title} | MarkaRadar` : 'MarkaRadar';

    if (description) {
      const el = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
      if (el) el.content = description;
    }

    return () => {
      document.title = previousTitle;
    };
  }, [title, description]);
}
