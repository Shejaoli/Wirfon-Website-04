import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { DEFAULT_SITE, type SiteContent } from "@/lib/site";
import { fetchContent } from "@/lib/api";

interface Ctx {
  site: SiteContent;
  loaded: boolean;
  reload: () => Promise<void>;
}

const SiteCtx = createContext<Ctx>({
  site: DEFAULT_SITE,
  loaded: false,
  reload: async () => {},
});

export function SiteProvider({ children }: { children: ReactNode }) {
  const [site, setSite] = useState<SiteContent>(DEFAULT_SITE);
  const [loaded, setLoaded] = useState(false);

  async function reload() {
    const data = await fetchContent();
    if (data) setSite(data);
    setLoaded(true);
  }

  useEffect(() => {
    void reload();
  }, []);

  return <SiteCtx.Provider value={{ site, loaded, reload }}>{children}</SiteCtx.Provider>;
}

export function useSite(): SiteContent {
  return useContext(SiteCtx).site;
}

export function useSiteCtx(): Ctx {
  return useContext(SiteCtx);
}
