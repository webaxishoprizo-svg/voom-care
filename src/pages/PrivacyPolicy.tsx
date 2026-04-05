import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const sections = [
  { title: "Information We Collect", content: "We collect information you provide directly, such as your name, email address, shipping address, and payment details when you place an order. We also collect browsing data through cookies to improve your experience." },
  { title: "How We Use Your Information", content: "Your information is used to process orders, provide customer support, send order updates, and improve our products and services. We never sell your personal data to third parties." },
  { title: "Data Security", content: "We implement industry-standard security measures including SSL encryption and secure payment processing to protect your personal information." },
  { title: "Cookies", content: "Our website uses cookies to enhance your browsing experience, analyze site traffic, and personalize content. You can manage cookie preferences through your browser settings." },
  { title: "Your Rights", content: "You have the right to access, correct, or delete your personal data at any time. Contact us at support@nor.in to exercise these rights." },
  { title: "Updates to This Policy", content: "We may update this privacy policy from time to time. Any changes will be posted on this page with an updated effective date." },
];

const PrivacyPolicy = () => (
  <main className="min-h-screen bg-background">
    <Navbar />
    <section className="pt-28 pb-16 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-display text-4xl text-foreground mb-8 text-center">Privacy Policy</h1>
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

export default PrivacyPolicy;
