import SiteLoadingScreen from "@/components/loading/SiteLoadingScreen";

/** Server-component suspense fallback: visible only when navigation actually suspends. */
export default function Loading() {
  return <SiteLoadingScreen className="min-h-[45vh]" />;
}
