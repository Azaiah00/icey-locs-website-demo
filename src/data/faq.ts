/**
 * FAQ — every answer is built ONLY from verified facts (FACTS.md / services.ts / policy).
 * Items with `confirm: true` render in demo mode with a "to confirm" badge and are excluded
 * from FAQPage JSON-LD until the owner confirms them.
 */
export interface Faq {
  q: string;
  a: string;
  confirm?: boolean;
}

export const faqs: Faq[] = [
  {
    q: "Do I need a deposit to book?",
    a: "Yes. All appointments require a non-refundable deposit to secure your booking, and it is applied toward your service total. Deposits run from $5 for barber services to $100 for full-head instant locs, wicks or extensions — you'll see the exact amount before you confirm.",
  },
  {
    q: "What is your cancellation policy?",
    a: "We require at least 24 hours notice to cancel or reschedule. Cancellations made less than 24 hours in advance lose the deposit.",
  },
  {
    q: "Where are you located?",
    a: "Inside Hollywood Park Shops at 1237 District Dr, Suite 113, Inglewood, CA 90301 — steps from SoFi Stadium. The Icey Locs Barber Spa is next door in Suite 112.",
  },
  {
    q: "What are your hours?",
    a: "We're open every day, 9:00 AM to 7:00 PM.",
  },
  {
    q: "Do you take kids?",
    a: "Absolutely — young crowns are a big part of our chair. The Mini Loc Spa is made for little ones 5 and under (gentle, kid-friendly products), Kids Braids cover up to age 7, and the Barber Spa cuts teens (13 & up) and little kids (12 & under).",
  },
  {
    q: "Can my locs be repaired?",
    a: "Loc repair is our specialty. Book a 20-minute Loc Repair Consultation and we'll assess weak, thinning, broken or damaged locs and map out a repair plan using precision crochet techniques. Repair pricing depends on loc condition, length and the work needed.",
  },
  {
    q: "Can I get a haircut with my loc or braid service?",
    a: "Yes. Choose \"Haircut Request\" when you book a loc or braid service and our licensed barber will finish your look. For a standalone cut, line up or taper, book the Icey Locs Barber Spa in Suite 112.",
  },
  {
    q: "Can I pay over time?",
    a: "Yes — Buy Now, Pay Later is available for bookings from $50 to $4,000. Get approved before your appointment.",
  },
  {
    q: "What's the difference between a retwist, interlock and crochet maintenance?",
    a: "A retwist palm-rolls or twists new growth into your existing locs for a smooth, polished look. Interlocking pulls the loc through its own root with a tool for a tighter, longer-lasting hold. Crochet maintenance uses a fine crochet hook to tuck loose hairs and strengthen the loc — it's the method we use for repairs. Not sure which you need? Book a Loc Repair Consultation.",
  },
  {
    q: "Where do I park?",
    a: "NEEDS CLIENT CONFIRMATION — parking details for Hollywood Park Shops (garage/validation, game-day notes).",
    confirm: true,
  },
];
