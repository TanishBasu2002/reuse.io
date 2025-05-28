import React from "react";
import Navbar from "@repo/ui/web/sections/navbar";
import Hero from "@repo/ui/web/sections/hero";
import LogoTicker from "@repo/ui/web/sections/logoticker";
import Introduction from "@repo/ui/web/sections/introduction";
import Features from "@repo/ui/web/sections/features";
import Integrations from "@repo/ui/web/sections/integrations";
import Faqs from "@repo/ui/web/sections/faqs";
import CallToAction from "@repo/ui/web/sections/calltoaction";
import Footer from "@repo/ui/web/sections/footer";
const Page = () => {
  return (
    <>
      <Navbar />
      <Hero />
      <LogoTicker />
      <Introduction />
      <Features />
      <Integrations />
      <Faqs />
      <CallToAction />
      <Footer />
    </>
  );
};

export default Page;
