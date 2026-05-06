import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Stats from '@/components/Stats';
import Pain from '@/components/Pain';
import HowItWorks from '@/components/HowItWorks';
import Categories from '@/components/Categories';
import AppDownload from '@/components/AppDownload';
import Testimonials from '@/components/Testimonials';
import Trust from '@/components/Trust';
import FinalCTA from '@/components/FinalCTA';
import Footer from '@/components/Footer';

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white overflow-x-hidden">
      <Navbar />
      <Hero />
      <Stats />
      <Pain />
      <HowItWorks />
      <Categories />
      <AppDownload />
      <Testimonials />
      <Trust />
      <FinalCTA />
      <Footer />
    </main>
  );
}
