/**
 * Real client reviews — VERBATIM from Icey Locs' GlossGenius review feed (all 34 are 5 stars,
 * pulled 2026-10-23). Reviews with an empty message are kept for the count but never shown as quotes.
 * Emoji in reviews are stripped at render time (no-emoji rule) — the words are untouched.
 *
 * DO NOT emit these as Review / aggregateRating JSON-LD (Google treats business-collected
 * reviews on its own site as self-serving). Display only.
 * Before launch: get the owner's OK to feature reviewer first names (see ASSETS-OWED.md).
 */
import type { StaffId } from "./services";

export interface ClientReview {
  id: number;
  date: string;
  name: string;
  stylist: StaffId;
  rating: 5;
  text: string;
  featured?: boolean;
  tags?: ("first-visit" | "kids" | "repair" | "detox" | "speed" | "vibe" | "long-locs" | "braids" | "barber")[];
}

export const reviews: ClientReview[] = [
  { id: 0, date: "2026-09-13", name: "Cassandra for Johnnie", stylist: "lele", rating: 5, text: "Very nice and professional great job with my grandson hair he has dreds", tags: ["kids"] },
  { id: 1, date: "2026-08-25", name: "ry", stylist: "lele", rating: 5, text: "" },
  { id: 2, date: "2026-08-12", name: "Terrence H", stylist: "shane", rating: 5, text: "Great service provided and easy to schedule", tags: ["barber"] },
  { id: 3, date: "2026-08-12", name: "Ryan Graham", stylist: "lele", rating: 5, text: "Lele did a great job! I trust her with doing my hair again. I was very impressed with her work, and I would definitely recommend her to other people. I would rate a 5" },
  { id: 4, date: "2026-08-10", name: "Charles", stylist: "lele", rating: 5, text: "" },
  { id: 5, date: "2026-08-09", name: "Shavonna/Matthew", stylist: "icey", rating: 5, text: "Icey was very friendly and fast also had very good customer service and will be book her again", tags: ["speed"] },
  { id: 6, date: "2026-08-06", name: "Rodney", stylist: "lele", rating: 5, text: "Process wasn’t as long as I thought it was and literally iced my hair so I can see why it’s called Icey locs will most definitely keep coming back", featured: true, tags: ["speed"] },
  { id: 7, date: "2026-08-06", name: "Kimberly", stylist: "lele", rating: 5, text: "I really like your work and u know have a new customer" },
  { id: 8, date: "2026-07-30", name: "Trev", stylist: "icey", rating: 5, text: "Everything was excellent" },
  {
    id: 9,
    date: "2026-07-28",
    name: "Livv",
    stylist: "icey",
    rating: 5,
    text: "I finally went and got my locs retwisted at Icy Locs in Inglewood, and babyyy… she did her thing. 🔥  From the moment I walked in, the experience was everything. The private setup, the warm welcome, and the relaxing atmosphere made it feel like more than just a hair appointment. It was a whole experience.  I’ve gotten so many compliments on my retwist. People have literally been wanting to touch my hair… and we all know you don’t just touch a Black woman’s hair. 😂  If you’re looking for someone who takes pride in their work and creates a peaceful environment while doing it, definitely check her out. She understood the assignment. 🔥🔥🔥",
    featured: true,
    tags: ["vibe", "first-visit"],
  },
  { id: 10, date: "2026-07-26", name: "Maro", stylist: "icey", rating: 5, text: "Best in the city without a doubt !!", featured: true },
  { id: 11, date: "2026-07-20", name: "Cedre", stylist: "lele", rating: 5, text: "Great service" },
  { id: 12, date: "2026-07-10", name: "Simeon B", stylist: "icey", rating: 5, text: "" },
  { id: 13, date: "2026-07-10", name: "Juju", stylist: "icey", rating: 5, text: "Always a pleasure getting my locs retwist and freshly done. Service is quick and out the door.", tags: ["speed"] },
  { id: 14, date: "2026-07-02", name: "Elaw", stylist: "icey", rating: 5, text: "First time,   Good energy, clean space, gifted hands! Il be back 10/10", featured: true, tags: ["first-visit", "vibe"] },
  { id: 15, date: "2026-07-02", name: "Mar", stylist: "icey", rating: 5, text: "Icey is simply amazing! If you need a Loc Repair/Retwist, done in a tranquil environment with a pleasant vibe, and very reasonable prices — look no further.  I’m already looking forward to my next appointment.", featured: true, tags: ["repair", "vibe"] },
  { id: 16, date: "2026-07-01", name: "Kristina", stylist: "lele", rating: 5, text: "Lele did an amazing job on my very first loc detox! I had no idea how much of a difference it would make. My locs feel so much lighter, and my scalp feels incredibly clean and refreshed. She was professional, knowledgeable, and made the entire experience enjoyable. I highly recommend her and will definitely be back!", featured: true, tags: ["detox", "first-visit"] },
  { id: 17, date: "2026-07-01", name: "L", stylist: "icey", rating: 5, text: "10 out of 10 would recommend" },
  { id: 18, date: "2026-06-12", name: "Latoya", stylist: "lele", rating: 5, text: "My first time visiting the shop. Lele was very professional. My son had a loc retwist with wash and detox. My son hair was neat and he could not stop smiling. We will definitely visit again. Highly recommended!!!", featured: true, tags: ["kids", "detox", "first-visit"] },
  {
    id: 19,
    date: "2026-06-10",
    name: "Angela D. Sanders",
    stylist: "icey",
    rating: 5,
    text: "I had an excellent experience with Loc Master Icey Locs. From the moment I arrived, she was professional, welcoming, and attentive to my hair care needs. Her knowledge of loc maintenance and healthy hair practices is truly impressive. I have been growing my locs since 2000 and my hair length is 40 inches plus and Icey is the only loctician that can knock my entire hair care out in no time at all, she has been one of the fastest loctician that has dealt with my hair by far.  Icey made sure I was comfortable throughout my appointment. My locs always look neat, healthy, and beautifully styled when she finishes every time. I especially appreciated her attention to detail and the care she put into her work.  If you're looking for a skilled, reliable, and talented loctician who genuinely cares about her clients, I highly recommend Loctician Icey. Her expertise, patience and excellent customer service make every visit a great experience. I look forward to my next appointment.",
    featured: true,
    tags: ["long-locs", "speed"],
  },
  { id: 20, date: "2026-06-07", name: "Teflon", stylist: "icey", rating: 5, text: "top tier services a must double back good vibes . i wanna turn my first time to forever no kap", tags: ["first-visit", "vibe"] },
  {
    id: 21,
    date: "2026-06-07",
    name: "Malissa",
    stylist: "icey",
    rating: 5,
    text: "⭐⭐⭐⭐⭐  “My first appointment with Icey was amazing! She was professional, welcoming, and made me feel comfortable right away. She listened to what I wanted and exceeded my expectations. My hair came out beautiful, and the attention to detail was top-notch. I left feeling confident, refreshed, and receiving compliments everywhere I go! If you’re looking for a stylist who is talented, caring, and truly knows her craft, I highly recommend Icey. I will definitely be back!”  💕 Thank you, Icey, for making my first visit such a great experience! ✨💕",
    tags: ["first-visit"],
  },
  { id: 22, date: "2026-05-01", name: "JC", stylist: "icey", rating: 5, text: "Icey is the real deal, amazing job, very good at what she does. Took no time to get my locs washed, retaliated and styled. Happy to have found Icey, will be back.", tags: ["speed"] },
  { id: 23, date: "2026-04-13", name: "Chelle", stylist: "icey", rating: 5, text: "Icey did an amazing job on my locs. She took her time and it came out beautifully. I will be booking with her again." },
  { id: 24, date: "2026-04-07", name: "Dcaff", stylist: "icey", rating: 5, text: "Good vibes from the time I arrived until the time I left. Chill atmosphere , service was A1. Will forsure be back. Appreciate Icey for getting me right 💪🏽", tags: ["vibe"] },
  { id: 25, date: "2026-04-03", name: "Lisha", stylist: "icey", rating: 5, text: "Chyleee when I say I'm loccd in, that's on period, I won't be going nowhere else... 3rd visit and I love this style just as much as the last, I think the Bob is my favorite though  Icey working with gifted hands for sure and I love the accuracy of her work!", featured: true },
  { id: 26, date: "2026-03-23", name: "Kerry", stylist: "icey", rating: 5, text: "Came out very clean! Solid work" },
  { id: 27, date: "2026-03-21", name: "Ajay", stylist: "icey", rating: 5, text: "Service top tier highly recommended" },
  { id: 28, date: "2026-03-21", name: "Powerhouse", stylist: "icey", rating: 5, text: "Icey as a mfka. And don’t waste no time, in and out like a heist.", tags: ["speed"] },
  { id: 29, date: "2026-03-06", name: "Marilyn Neely", stylist: "icey", rating: 5, text: "She always on point sick and all Icey going to get the job done !!! Thank You And See You Soon!!!" },
  { id: 30, date: "2026-02-25", name: "Pixie", stylist: "icey", rating: 5, text: "" },
  { id: 31, date: "2026-02-14", name: "Kimberly", stylist: "icey", rating: 5, text: "My son was a first time client with you and he loves his hair, and the shop. We will definitely be back. Thank you so much.", tags: ["kids", "first-visit"] },
  { id: 32, date: "2026-01-28", name: "Lisha", stylist: "icey", rating: 5, text: "Always quick and precise 🤏🏾 I will be back🤏🏾", tags: ["speed"] },
  { id: 33, date: "2026-01-18", name: "Kenzo", stylist: "icey", rating: 5, text: "I found Icey on Instagram and was able to make an appointment with less than 24 hours notice. She was very accommodating, professional and did top tier work on my son’s dreads.  Thank you so much!", featured: true, tags: ["kids"] },
];

/** Strip emoji / pictographs for display (keeps the client's words verbatim). */
export const stripEmoji = (s: string) =>
  s
    .replace(/[\p{Extended_Pictographic}\u{1F3FB}-\u{1F3FF}\u{FE0F}\u{200D}]/gu, "")
    .replace(/\s{2,}/g, " ")
    .trim();

/** Never show the one profanity-adjacent review on the public site; keep it in the count. */
export const HIDE_FROM_SITE: number[] = [28];

export const publicReviews = reviews.filter((r) => r.text && !HIDE_FROM_SITE.includes(r.id));
export const featuredReviews = publicReviews.filter((r) => r.featured);
