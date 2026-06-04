import { Outlet, Link, useLocation } from "react-router";
import { Menu, X, Globe, Instagram, Facebook, Youtube, Linkedin } from "lucide-react";
import { useState } from "react";
import logoImage from "../../imports/LOGO_PPI-AIU-smaller_size.png";
import { useLanguage } from "../contexts/LanguageContext";

export function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { language, setLanguage, t } = useLanguage();

  const navItems = [
    { name: t.nav.home, path: "/" },
    { name: t.nav.about, path: "/about" },
    { name: t.nav.members, path: "/members" },
    { name: t.nav.activities, path: "/blog" },
    { name: t.nav.documents, path: "/foundation" },
  ];

  const toggleLanguage = () => {
    setLanguage(language === "id" ? "en" : "id");
  };

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="bg-primary text-primary-foreground shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-3">
              <img
                src={logoImage}
                alt="PPI AIU Logo"
                className="h-12 w-auto"
              />
              <span className="font-bold text-xl hidden sm:inline">PPI AIU</span>
            </Link>

            <div className="flex items-center space-x-4">
              <nav className="hidden md:flex space-x-8">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`hover:text-white/80 transition-colors ${
                      isActive(item.path) ? "border-b-2 border-white" : ""
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>

              <button
                onClick={toggleLanguage}
                className="hidden md:flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                title={language === "id" ? "Switch to English" : "Ganti ke Bahasa Indonesia"}
              >
                <Globe size={18} />
                <span className="text-sm font-semibold">{language.toUpperCase()}</span>
              </button>

              <button
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {mobileMenuOpen && (
            <nav className="md:hidden py-4 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`block py-2 hover:bg-white/10 px-2 rounded ${
                    isActive(item.path) ? "bg-white/20" : ""
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <button
                onClick={toggleLanguage}
                className="flex items-center space-x-2 w-full py-2 px-2 rounded hover:bg-white/10 transition-colors"
              >
                <Globe size={18} />
                <span className="text-sm font-semibold">
                  {language === "id" ? "English" : "Bahasa Indonesia"}
                </span>
              </button>
            </nav>
          )}
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="bg-foreground text-background py-8">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <img
                src={logoImage}
                alt="PPI AIU Logo"
                className="h-16 w-auto mb-3"
              />
              <p className="text-sm opacity-90">
                Persatuan Pelajar Indonesia di AIU
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-2">Lokasi</h3>
              <p className="text-sm opacity-90">
                Albukhary International University
                <br />
                Alor Setar, Kedah, Malaysia
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-2">Kontak</h3>
              <p className="text-sm opacity-90">Email: adm.ppi.aiu@gmail.com</p>
            </div>
            <div>
              <h3 className="font-bold mb-2">Sosial Media</h3>
              <div className="flex items-center space-x-4">
                <a
                  href="https://www.instagram.com/ppi_aiu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-70 transition-opacity"
                  title="Instagram"
                >
                  <Instagram size={24} />
                </a>
                <a
                  href="https://www.facebook.com/share/1PYNAZqYMW/?mibextid=wwXIfr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-70 transition-opacity"
                  title="Facebook"
                >
                  <Facebook size={24} />
                </a>
                <a
                  href="https://www.youtube.com/@persatuanpelajarindonesiaa9530"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-70 transition-opacity"
                  title="YouTube"
                >
                  <Youtube size={24} />
                </a>
                <a
                  href="https://www.linkedin.com/company/ppi-aiu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-70 transition-opacity"
                  title="LinkedIn"
                >
                  <Linkedin size={24} />
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-4 border-t border-white/20 text-center text-sm opacity-75">
            <p>© {new Date().getFullYear()} PPI AIU. All rights reserved.</p>
            <p className="mt-2">
              Developed by{" "}
              <Link
                to="/developers"
                className="underline hover:opacity-70 transition-opacity"
              >
                PPI AIU Tech Team
              </Link>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
