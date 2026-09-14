import { useEffect, useState } from "react";
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

export default function App() {
  const [isAdminView, setIsAdminView] = useState(() => {
    return window.location.hash === "#admin" || window.location.pathname.startsWith("/admin");
  });

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
            <CTA />
          </main>
          <Footer />
          <FloatingButtons />
        </div>
      )}
    </LanguageProvider>
  );
}
