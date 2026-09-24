import { useEffect } from "react";
import { DEFAULT_META, SITE_URL } from "./site";

// Sets title, description and canonical for the page, and puts the homepage
// defaults back on unmount — a direct load of /about starts with About's
// pre-rendered tags, so "restore what was there" would leak them onto /.
export default function usePageMeta(path, meta) {
  const title = meta?.title;
  const description = meta?.description;

  useEffect(() => {
    if (!title) return;
    const desc = document.querySelector('meta[name="description"]');
    const canonical = document.querySelector('link[rel="canonical"]');

    document.title = title;
    if (description) desc.content = description;
    canonical.href = SITE_URL + path;

    return () => {
      document.title = DEFAULT_META.title;
      desc.content = DEFAULT_META.description;
      canonical.href = SITE_URL + "/";
    };
  }, [path, title, description]);
}
