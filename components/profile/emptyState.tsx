import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
  href: string;
  action: string;
}

const EmptyState = ({ title, description, href, action }: EmptyStateProps) => (
  <div className="rounded-2xl border border-dashed border-border bg-muted/50 p-6 text-center">
    <Sparkles className="mx-auto size-8 text-premium" />
    <h3 className="mt-3 text-base font-extrabold text-foreground">{title}</h3>
    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
      {description}
    </p>
    <Link
      href={href}
      className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground transition hover:bg-primary/90"
    >
      {action}
      <ArrowLeft className="size-4" />
    </Link>
  </div>
);

export default EmptyState;
