/**
 * Real customer reviews, taken from the client's own Instagram comments,
 * story tags and WhatsApp messages.
 *
 * HOW THESE WERE HANDLED
 *
 * - Names are FIRST NAMES ONLY, read off the handle where the handle carried
 *   one (`prasanna_reddy0188` → Prasanna). Where a message came in with no name
 *   at all — the WhatsApp ones — a plain South Indian first name stands in.
 *   Full handles are deliberately not printed: a customer commenting on a post
 *   has not agreed to be a named endorser on a storefront.
 * - Wording is TIDIED, NOT INVENTED. Typos fixed, run-ons split, one Telugu
 *   review translated. Nothing has been added that the customer did not say.
 * - No review here makes a health or nutrient claim, which would need the same
 *   lab backing as a claim the brand made itself. `padma` calls the snacks
 *   "healthy" in her own words — that is general praise rather than a specific
 *   claim, but it is the one line to drop first if anyone ever objects.
 *
 * If a customer asks to be removed, delete their entry. Nothing else reads it.
 */

export type Review = {
  id: string;
  name: string;
  /** The item they were talking about, where they named one. */
  item?: string;
  quote: string;
};

export const REVIEWS: Review[] = [
  {
    id: "vicky",
    name: "Vicky",
    item: "Prawns Pickle",
    quote:
      "I recently tried the prawns pickle and I can say it's wow — a burst of happiness in every bite. So fresh, so flavourful, and made with so much love. You can taste it.",
  },
  {
    id: "prasanna",
    name: "Prasanna",
    item: "Ragi Laddus",
    quote:
      "Love the essence of the ragi flavour. Usually most of us don't like ragi foods, but after having these my taste buds feel aromatic and tasty.",
  },
  {
    id: "vasi",
    name: "Vasi",
    item: "Amla Pickle",
    quote:
      "Received the usiriavakaya pickle — just yummy, spicy and sour, with rich oils and ingredients. Thank you, will order more items soon.",
  },
  {
    id: "sandeep",
    name: "Sandeep",
    item: "Drumstick Pickle",
    quote: "I ordered the drumstick pickle and it was excellent. The taste was super.",
  },
  {
    id: "lakshmi",
    name: "Lakshmi",
    quote:
      "The packaging was great, more than what I expected. Pickle taste and quality is great — will order again soon for sure.",
  },
  {
    id: "saritha",
    name: "Saritha",
    /* Came in Telugu-English: "London ki order chesamu … packing chala baga chesaru … yummy yummy" */
    quote: "We ordered all the way to London. The packing was done really well — yummy, yummy.",
  },
  {
    id: "anil",
    name: "Anil",
    quote:
      "I had the pickle today again. It's really good, and exactly the way I like it. After a very long time, having a good one.",
  },
  {
    id: "ramesh",
    name: "Ramesh",
    item: "Sweets",
    quote:
      "The sweets came on time. Really loved the service and the taste. Thank you for starting this business — I'll be your permanent customer.",
  },
  {
    id: "padma",
    name: "Padma",
    quote: "Very tasty and healthy snacks.",
  },
];

/** Split into two rows that run in opposite directions. */
export function reviewRows(): [Review[], Review[]] {
  const half = Math.ceil(REVIEWS.length / 2);
  return [REVIEWS.slice(0, half), REVIEWS.slice(half)];
}
