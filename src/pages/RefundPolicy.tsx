import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const sections = [
  { title: "Return Eligibility", content: "Products may be returned within 7 days of delivery if they are unused, unopened, and in their original packaging. Opened or used products are not eligible for returns." },
  { title: "How to Initiate a Return", content: "To initiate a return, contact us at support@nor.in with your order ID and reason for return. Our team will guide you through the process." },
  { title: "Refund Process", content: "Once we receive and inspect your return, refunds will be processed within 5-7 business days to your original payment method." },
  { title: "Damaged or Defective Products", content: "If you receive a damaged or defective product, please contact us within 48 hours of delivery with photos. We will arrange a replacement or full refund at no additional cost." },
  { title: "Non-Refundable Items", content: "Gift cards, sale items, and products marked as final sale are non-refundable." },
  { title: "Shipping Costs", content: "Original shipping costs are non-refundable. Return shipping costs are the responsibility of the customer unless the return is due to our error." },
];

const RefundPolicy = () => (
  <main className="min-h-screen bg-background">
    <Navbar />
    <section className="pt-28 pb-16 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-display text-4xl text-foreground mb-8 text-center">Refund Policy</h1>
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

export default RefundPolicy;
