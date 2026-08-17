import { Link } from "react-router";
import { Home } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { SEO } from "../components/SEO";

export function NotFound() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-secondary flex items-center justify-center px-4">
      <SEO title={t.notFound.title} description={t.notFound.subtitle} />
      <div className="text-center">
        <h1 className="text-9xl font-bold text-primary">404</h1>
        <h2 className="text-3xl font-bold mt-4 mb-2">{t.notFound.title}</h2>
        <p className="text-muted-foreground mb-8">
          {t.notFound.subtitle}
        </p>
        <Link
          to="/"
          className="inline-flex items-center space-x-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Home size={20} />
          <span>{t.notFound.backHome}</span>
        </Link>
      </div>
    </div>
  );
}
