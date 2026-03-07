import { Link, useLocation } from "react-router";
import { Shield, MapPin, AlertCircle, BarChart3, Globe } from "lucide-react";
import { useState } from "react";
import { motion } from "motion/react";

export function Header() {
  const location = useLocation();
  const [language, setLanguage] = useState("fr");

  const navItems = [
    { path: "/", label: "Carte", icon: MapPin },
    { path: "/planifier", label: "Planifier", icon: Shield },
    { path: "/signaler", label: "Signaler", icon: AlertCircle },
    { path: "/statistiques", label: "Statistiques", icon: BarChart3 },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-orange-200/70 via-orange-100/70 to-amber-100/70 backdrop-blur-sm shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-gradient-to-br from-[var(--safecity-blue)] to-[var(--safecity-blue-light)] p-2 rounded-xl shadow-md group-hover:shadow-lg transition-shadow">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-[var(--safecity-blue)]">
                SafeCity
              </h1>
              <p className="text-xs text-[var(--safecity-gray-dark)]">
                Abidjan
              </p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    isActive
                      ? "bg-[var(--safecity-blue)] text-white shadow-md"
                      : "text-[var(--safecity-gray-dark)] hover:bg-[var(--safecity-gray)] hover:text-[var(--safecity-blue)]"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Language Selector */}
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-[var(--safecity-gray-dark)]" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-transparent border border-[var(--safecity-gray-dark)]/30 rounded-lg px-3 py-1.5 text-sm text-[var(--safecity-gray-dark)] focus:outline-none focus:ring-2 focus:ring-[var(--safecity-blue)]/50"
            >
              <option value="fr">Français</option>
              <option value="en">English</option>
            </select>
          </div>
        </div>

        {/* Mobile Navigation */}
        <nav className="md:hidden flex items-center justify-around pb-3 border-t border-[var(--safecity-gray)] mt-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all ${
                  isActive
                    ? "text-[var(--safecity-blue)]"
                    : "text-[var(--safecity-gray-dark)]"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </motion.header>
  );
}