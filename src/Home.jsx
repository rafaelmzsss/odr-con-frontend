import "./Home.css";

import Header from "./components/Header";
import Hero from "./components/Hero";
import Highlights from "./components/Highlights";
import Solutions from "./components/Solutions";
import PriscilaBanner from "./components/PriscilaBanner";
import HowItWorks from "./components/HowItWorks";
import Purpose from "./components/Purpose";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <div className="odr" id="inicio">
      <Header />

      <main>
        <Hero />
        <Highlights />
        <Purpose />
        <HowItWorks />
        <Solutions />
        <PriscilaBanner />
      </main>

      <Footer />
    </div>
  );
}