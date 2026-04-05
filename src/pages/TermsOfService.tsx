import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const sections = [
  { title: "Acceptance of Terms", content: "By accessing and using the NOR website, you agree to be bound by these Terms of Service. If you do not agree, please do not use our services." },
  { title: "Products & Orders", content: "All products are subject to availability. We reserve the right to limit quantities and refuse orders at our discretion. Prices are listed in Indian Rupees (₹) and are subject to change without notice." },
  { title: "Shipping & Delivery", content: "We offer all-India delivery. Free shipping is available on orders above ₹999. Delivery timelines vary by location and are estimated at the time of purchase." },
  { title: "Intellectual Property", content: "All content on this website, including text, images, logos, and designs, is the property of NOR and is protected by applicable intellectual property laws." },
  { title: "Limitation of Liability", content: "NOR shall not be liable for any indirect, incidental, or consequential damages arising from the use of our products or website." },
  { title: "Governing Law", content: "These terms are governed by the laws of India. Any disputes will be subject to the jurisdiction of courts in Mumbai, Maharashtra." },
];

const TermsOfService = () => (
  <main className="min-h-screen bg-background">
    <Navbar />
    <section className="pt-28 pb-16 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-display text-4xl text-foreground mb-8 text-center">Terms of Service</h1>
        <div className="space-y-8">
          {sections.map((s) => (
            <div key={s.title}>
              <h2 className="font-display text-xl text-foreground mb-3">{s.title}</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">{s.content}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
    <Footer />
  </main>
);

export default TermsOfService;
