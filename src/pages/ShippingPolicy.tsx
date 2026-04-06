import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

const ShippingPolicy = () => {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 bg-gradient-to-b from-primary/5 to-transparent">
        <div className="max-w-4xl mx-auto text-center">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-primary text-xs tracking-[0.3em] uppercase mb-4"
          >
            Logistics & Delivery
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-4xl md:text-6xl text-foreground mb-6"
          >
            Shipping Policy
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="w-24 h-px bg-primary/30 mx-auto"
          />
        </div>
      </section>

      {/* Content Section */}
      <section className="pb-24 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-card/30 backdrop-blur-sm border border-border/50 rounded-3xl p-8 md:p-12 shadow-2xl">
            <div className="prose prose-invert prose-sm md:prose-base max-w-none space-y-12">
              
              <div>
                <h2 className="font-display text-2xl text-foreground mb-4 flex items-center gap-3">
                  <span className="text-primary/40 text-sm">01</span> Shipping Destinations
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  NOR currently ships to all serviceable pin codes across India only. We do not offer international shipping at this time. If an order is placed with a non-Indian or unserviceable delivery address, the order will not be processed and the customer will be notified promptly.
                </p>
              </div>

              <div>
                <h2 className="font-display text-2xl text-foreground mb-4 flex items-center gap-3">
                  <span className="text-primary/40 text-sm">02</span> Courier Partners
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  NOR fulfils orders through the following courier partners based on delivery location and service availability:
                  <br />
                  NOR selects the most appropriate courier for each order based on location, availability, and service quality. Customers cannot request or specify a preferred courier partner.
                </p>
              </div>

              <div>
                <h2 className="font-display text-2xl text-foreground mb-4 flex items-center gap-3">
                  <span className="text-primary/40 text-sm">03</span> Order Processing Time
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  All orders are processed within 1–2 business days from the date of successful payment confirmation. Business days are Monday to Saturday, excluding Indian public holidays. Orders placed on Sundays or public holidays will be processed on the next available business day.
                  <br /><br />
                  <span className="text-primary italic">Note: Order confirmation does not mean your order has been dispatched. Processing time of 1–2 business days applies before handover to the courier partner.</span>
                </p>
              </div>

              <div>
                <h2 className="font-display text-2xl text-foreground mb-4 flex items-center gap-3">
                  <span className="text-primary/40 text-sm">04</span> Delivery Timeline
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Once dispatched, standard delivery across India takes approximately 4–7 business days. Total time from order to delivery is typically 5–9 business days. Delays may occur due to remote locations, festive seasons, weather, incorrect addresses, unavailable recipients, or courier operational disruptions. NOR is not liable for delays caused by courier partners or circumstances beyond NOR's control.
                </p>
              </div>

              <div>
                <h2 className="font-display text-2xl text-foreground mb-4 flex items-center gap-3">
                  <span className="text-primary/40 text-sm">05</span> Shipping Charges
                </h2>
                <ul className="list-disc pl-5 text-muted-foreground space-y-2">
                  <li>Orders above ₹999: <span className="text-foreground font-medium">Free shipping</span> — no delivery charge applied at checkout.</li>
                  <li>Orders below ₹999: Standard shipping fee calculated at checkout based on delivery location.</li>
                </ul>
                <p className="text-muted-foreground mt-4 italic">
                  NOR reserves the right to revise shipping charges at any time. The charge shown at checkout is the amount applicable to that specific order.
                </p>
              </div>

              <div>
                <h2 className="font-display text-2xl text-foreground mb-4 flex items-center gap-3">
                  <span className="text-primary/40 text-sm">06</span> Promotional Shipping Offers
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Any free shipping promotions or reduced shipping offers are valid only for the specified period and conditions stated at the time of the promotion. NOR reserves the right to withdraw or modify any shipping promotion at any time without prior notice. Promotional shipping offers cannot be applied retroactively to orders already placed.
                </p>
              </div>

              <div>
                <h2 className="font-display text-2xl text-foreground mb-4 flex items-center gap-3">
                  <span className="text-primary/40 text-sm">07</span> Payment — Prepaid Only
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  NOR accepts prepaid orders only. Cash on Delivery (COD) is not available. Accepted payment methods are UPI, debit cards, credit cards, and net banking — processed through a secure, encrypted third-party payment gateway. NOR does not store, access, or retain any payment card or banking credentials.
                </p>
              </div>

              <div>
                <h2 className="font-display text-2xl text-foreground mb-4 flex items-center gap-3">
                  <span className="text-primary/40 text-sm">08</span> No Order Cancellations
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Orders cannot be cancelled once placed and payment is confirmed. NOR operates a strict no-cancellation policy. Please review your order carefully before completing checkout. The only exception is if NOR is unable to fulfil the order due to a stock issue or system error, in which case a full refund will be issued to the original payment method within 5–7 business days.
                </p>
              </div>

              <div>
                <h2 className="font-display text-2xl text-foreground mb-4 flex items-center gap-3">
                  <span className="text-primary/40 text-sm">09</span> Order Tracking
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Once dispatched, you will receive a shipment notification via SMS or email with a tracking number and a direct link to track your order in real time. If you have not received tracking information within 3 business days of order confirmation, contact us at <a href="mailto:norperfume.help@gmail.com" className="text-primary underline">norperfume.help@gmail.com</a>.
                </p>
              </div>

              <div>
                <h2 className="font-display text-2xl text-foreground mb-4 flex items-center gap-3">
                  <span className="text-primary/40 text-sm">10</span> Incorrect Delivery Address
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  It is the customer's sole responsibility to provide a complete, accurate, and accessible delivery address at checkout. NOR is not responsible for delayed, failed, or misdelivered orders resulting from an incorrect, incomplete, or inaccessible address provided by the customer. Address changes can only be accommodated before dispatch. Once in transit, the delivery address cannot be changed.
                </p>
              </div>

              <div>
                <h2 className="font-display text-2xl text-foreground mb-4 flex items-center gap-3">
                  <span className="text-primary/40 text-sm">11</span> NOR Address Error
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  In the event that NOR dispatches an order to an address different from the one confirmed in the customer's order — where the error is solely on NOR's side and verifiable against the original confirmed order details — NOR will take full responsibility and arrange for a replacement product to be dispatched to the correct address at no additional cost to the customer. Customers must report such errors within 48 hours of delivery.
                </p>
              </div>

              <div>
                <h2 className="font-display text-2xl text-foreground mb-4 flex items-center gap-3">
                  <span className="text-primary/40 text-sm">12</span> Failed Delivery Attempts
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  If the courier cannot deliver due to the recipient being unavailable or the address being inaccessible, the package may be held at the courier facility or returned to origin. NOR is not responsible for re-delivery costs. Please ensure someone is available at the delivery address during business hours.
                </p>
              </div>

              <div>
                <h2 className="font-display text-2xl text-foreground mb-4 flex items-center gap-3">
                  <span className="text-primary/40 text-sm">13</span> Lost or Undelivered Orders
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  If tracking shows an exception, contact <a href="mailto:norperfume.help@gmail.com" className="text-primary underline">norperfume.help@gmail.com</a>. NOR will raise a formal investigation with the courier. If the order is confirmed lost by the courier, NOR will arrange a replacement at no cost. No monetary refunds are issued for lost orders.
                </p>
              </div>

              <div>
                <h2 className="font-display text-2xl text-foreground mb-4 flex items-center gap-3">
                  <span className="text-primary/40 text-sm">14</span> Damaged in Transit
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  If your product arrives damaged due to courier mishandling, refer to our Refund Policy for full instructions. A valid, continuous unboxing video recorded before the package is opened is required to process any damage claim.
                </p>
              </div>

              <div className="pt-8 border-t border-border/50">
                <p className="text-foreground font-medium mb-2 font-display uppercase tracking-widest text-lg">Shipping Enquiries</p>
                <a href="mailto:norperfume.help@gmail.com" className="text-primary hover:underline text-lg">norperfume.help@gmail.com</a>
              </div>
              
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default ShippingPolicy;
