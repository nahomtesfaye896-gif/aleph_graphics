import { useEffect, useState } from "react";
import { fetchSiteSettingsFromSupabase, persistSettingsLocal } from "./utils/siteSettings";
import { LanguageProvider } from "./i18n/LanguageContext";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { About } from "./components/About";
import { Courses } from "./components/Courses";
import { Projects } from "./components/Projects";
import { WhyChooseUs } from "./components/WhyChooseUs";
import { Testimonials } from "./components/Testimonials";
import { Contact } from "./components/Contact";
import { CTA, Footer } from "./components/Footer";
import { FloatingButtons } from "./components/FloatingButtons";
import { AdminPanel } from "./components/Admin/AdminPanel";
import { Send } from "lucide-react";

function TelegramJobsCTA() {
  return (
    <section className="relative bg-white py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <a 
          href="https://t.me/fit_abi2" 
          target="_blank" 
          rel="noopener noreferrer"
          className="group relative flex w-full flex-col items-center justify-between overflow-hidden rounded-[2rem] bg-gradient-to-r from-sky-500 to-blue-600 px-8 py-10 shadow-2xl shadow-blue-500/25 sm:flex-row sm:px-12 hover:-translate-y-1 transition-all duration-300"
        >
          <div className="absolute -left-12 -top-12 h-48 w-48 rounded-full bg-white/10 blur-3xl group-hover:bg-white/20 transition-all duration-500" />
          <div className="absolute -bottom-12 -right-12 h-48 w-48 rounded-full bg-white/10 blur-3xl group-hover:bg-white/20 transition-all duration-500" />
          
          <div className="relative flex items-center gap-6 text-center sm:text-left text-white">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/30 backdrop-blur-sm group-hover:scale-110 transition-transform duration-500">
              <Send className="h-8 w-8 text-white -ml-1" />
            </div>
            <div>
              <h3 className="text-2xl font-black tracking-tight sm:text-3xl">For Jobs Join Our Channel</h3>
              <p className="mt-1 text-sm font-medium text-white/80">Get the latest freelance and full-time design opportunities in Ethiopia.</p>
            </div>
          </div>
          
          <div className="relative mt-8 sm:mt-0 shrink-0">
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-blue-600 shadow-xl transition-all group-hover:scale-105">
              Join Telegram Channel
            </span>
          </div>
        </a>
      </div>
    </section>
  );
}

export default function App() {
  const [isAdminView, setIsAdminView] = useState(() => {
    return window.location.hash === "#admin" || window.location.pathname.startsWith("/admin");
  });
  const [settingsLoaded, setSettingsLoaded] = useState(false);

  useEffect(() => {
    fetchSiteSettingsFromSupabase().then((data) => {
      if (data) persistSettingsLocal(data);
      setSettingsLoaded(true);
    });
  }, []);

  useEffect(() => {
    const checkRoute = () => {
      const isAdmin = window.location.hash === "#admin" || window.location.pathname.startsWith("/admin");
      setIsAdminView(isAdmin);
    };

    window.addEventListener("hashchange", checkRoute);
    window.addEventListener("popstate", checkRoute);
    return () => {
      window.removeEventListener("hashchange", checkRoute);
      window.removeEventListener("popstate", checkRoute);
    };
  }, []);

  const handleBackToSite = () => {
    window.location.hash = "#home";
    setIsAdminView(false);
  };

  if (!settingsLoaded) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Loading...</div>;

  return (
    <LanguageProvider>
      {isAdminView ? (
        <AdminPanel onBackToSite={handleBackToSite} />
      ) : (
        <div className="min-h-screen bg-white font-sans text-ink-800">
          <Navbar />
          <main>
            <Hero />
            <About />
            <Courses />
            <Projects />
            <WhyChooseUs />
            <Testimonials />
            <Contact />
            <TelegramJobsCTA />
            <CTA />
          </main>
          <Footer />
          <FloatingButtons />
        </div>
      )}
    </LanguageProvider>
  );
}
