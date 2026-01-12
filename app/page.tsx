"use client";

import Navbar from "@/components/Navbar";
import ImageSequence from "@/components/ImageSequence";
import EquipmentCards from "@/components/EquipmentCards";
import Footer from "@/components/Footer";
import { TextReveal } from "@/components/Section";
import { useLanguage } from "@/context/LanguageContext";

export default function Home() {
  const { t } = useLanguage();

  return (
    <main>
      <Navbar />

      {/* 
        Container for the Scroll Sequence. 
        Height determines how long the sequence plays.
        Since we clamp at 0.4 progress in the component, we want enough height to scroll through content comfortably.
      */}
      <div className="relative w-full h-[350vh]">
        <ImageSequence />

        {/* Scrollable Content Overlay */}
        <div className="relative z-10 w-full text-white">
          {/* SECTION 1: HERO (Roughly 0-20%) */}
          <section className="h-screen flex items-center px-6 md:px-12">
            <div className="w-full max-w-7xl mx-auto">
              <TextReveal delay={0.2}>
                <div className="relative text-left p-12 rounded-3xl max-w-2xl -ml-12">
                  {/* Cinematic Dark Glow Behind Text */}
                  <div className="absolute inset-0 bg-radial-[circle_at_center,_var(--tw-gradient-stops)] from-black/60 via-black/20 to-transparent blur-3xl -z-10" />

                  <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-4 text-white drop-shadow-lg">
                    {t.hero.title}
                  </h1>
                  <p className="text-2xl md:text-3xl text-white/90 font-medium mb-2 tracking-tight drop-shadow-md">
                    {t.hero.subtitle}
                  </p>
                  <p className="text-lg text-white/70 tracking-wide uppercase drop-shadow-sm">
                    {t.hero.tagline}
                  </p>
                </div>
              </TextReveal>
            </div>
          </section>

          {/* ENGINEERING / ACCURACY */}
          <section className="h-screen flex items-center px-6 md:px-12">
            <div className="w-full max-w-7xl mx-auto">
              <TextReveal>
                <div className="max-w-xl p-8 rounded-2xl bg-black/30 backdrop-blur-sm border border-white/5 -ml-8">
                  <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-400">
                    {t.accuracy.title}
                  </h2>
                  <p className="text-lg text-white/70 mb-4 leading-relaxed">
                    {t.accuracy.desc1}
                  </p>
                  <p className="text-lg text-white/70 leading-relaxed">
                    {t.accuracy.desc2}
                  </p>
                </div>
              </TextReveal>
            </div>
          </section>

          {/* Additional Text / Transition to Cards */}
          <section className="h-[50vh] flex items-end justify-center pb-24">
            <TextReveal>
              <div className="text-center">
                <p className="text-2xl md:text-4xl font-bold text-white/90">
                  {t.empower.title}
                </p>
                <p className="text-2xl md:text-2xl font-bold text-white/70">{t.empower.subtitle}</p>
              </div>
            </TextReveal>
          </section>
        </div>
      </div>

      {/* NEW SECTION: EQUIPMENT CARDS */}
      {/* This sits AFTER the sticky canvas container, creating a natural flow where the page 'scrolls away' from the 3D model */}
      <EquipmentCards />

      {/* CTA / CONTACT */}
      <section className="relative z-10 py-32 bg-[#050505] flex items-center justify-center">
        <TextReveal>
          <div className="text-center">
            <h2 className="text-5xl md:text-7xl font-bold mb-4 tracking-tight text-white">
              {t.cta.title}
            </h2>
            <p className="text-2xl md:text-3xl text-white/60 mb-12">
              {t.cta.subtitle}
            </p>

            <a
              href="/support?tab=contact"
              className="inline-block px-12 py-5 text-lg font-semibold text-white bg-blue-600 rounded-full hover:bg-blue-500 transition-all duration-300 shadow-[0_0_30px_rgba(0,80,255,0.4)] hover:shadow-[0_0_50px_rgba(0,214,255,0.6)] hover:scale-105 active:scale-95"
            >
              {t.cta.button}
            </a>
          </div>
        </TextReveal>
      </section>

      <Footer />
    </main>
  );
}
