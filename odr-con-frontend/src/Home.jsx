import "./Home.css";

import Header from "./components/Header";
import Hero from "./components/Hero";
import Highlights from "./components/Highlights";
import Solutions from "./components/Solutions";
import SophiaBanner from "./components/SophiaBanner";
import HowItWorks from "./components/HowItWorks";
import Purpose from "./components/Purpose";
import FinalCta from "./components/FinalCta";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <div className="odr" id="inicio">
      <Header />

      <main>
        <Hero />
        <Highlights />
        <Solutions />
        <SophiaBanner />
        <HowItWorks />
        <Purpose />
        <FinalCta />
      </main>

      <Footer />
    </div>
  );
}