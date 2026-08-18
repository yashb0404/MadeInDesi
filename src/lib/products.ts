/**
 * The catalogue.
 *
 * Edit this file when photography, pricing or nutrition panels change.
 * Images live in `public/products/`.
 *
 * A note on claims: product NAMES are the client's own. The copy below is
 * deliberately ingredient-led — it says what is in the ball, not what the ball
 * will do to you. Per-serving nutrient values belong in `nutrition`, and should
 * come from a lab report before launch (FSSAI requires backing for any nutrient
 * or function claim). Leave `nutrition` empty rather than guessing.
 */

export type Category = "bites" | "chips" | "pickles";

/** The axis customers actually shop on: who is it for, what is it for. */
export type Need =
  | "everyday"
  | "kids-elders"
  | "hair-skin"
  | "bones-blood"
  | "snacking"
  | "with-meals";

export type NutritionRow = { label: string; value: string };

export type Product = {
  slug: string;
  name: string;
  /** The parenthetical the client uses on their own listings. Kept verbatim. */
  qualifier?: string;
  category: Category;
  needs: Need[];
  /** One clause for the shelf card. */
  blurb: string;
  /** Two or three sentences for the product page. */
  story: string;
  /** INR. PLACEHOLDER — replace with the client's real pricing. */
  price: number;
  /** PLACEHOLDER — confirm pack sizes with the client. */
  weightGrams: number;
  pieces?: number;
  image: string;
  /** Optional close-up, shown beside the pack shot on the product page. */
  detailImage?: string;
  ingredients: string[];
  /** Empty until lab values exist. The UI hides the panel when this is empty. */
  nutrition: NutritionRow[];
  shelfLifeDays: number;
  noAddedSugar: boolean;
  bestseller?: boolean;
  /**
   * No photograph shipped for this one yet, so the card falls back to the
   * designed placeholder. Anything flagged here sorts to the BACK of every
   * listing, so the grid always opens on real photography. Delete the flag the
   * moment the image file lands.
   */
  photoPending?: boolean;
};

export const CATEGORIES: { id: Category; label: string }[] = [
  { id: "bites", label: "Bites & balls" },
  { id: "pickles", label: "Pickles" },
  { id: "chips", label: "Chips" },
];

export const NEEDS: { id: Need; label: string }[] = [
  { id: "everyday", label: "Everyday" },
  { id: "kids-elders", label: "Kids & elders" },
  { id: "hair-skin", label: "Hair & skin" },
  { id: "bones-blood", label: "Bones & blood" },
  { id: "snacking", label: "Snacking" },
  { id: "with-meals", label: "With meals" },
];

/*
  PICKLES — the four below are the only entries on this file with real numbers.

  Prices come from the client's own invoice dated 16 Jan 2025, where the rate is
  quoted PER KILO and the line total is the rate against the pack size:

    Cashew Gongura        ₹850/kg × 750g = ₹637
    Allam (Ginger)        ₹787/kg × 750g = ₹590
    Amla                  ₹787/kg × 500g = ₹393
    Jeedipappu Kothimeera ₹850/kg × 500g = ₹425

  `price` below is the pack price, so it matches the invoice line total.

  STILL TO CONFIRM on these four: ingredient lists (written from what the name
  guarantees plus a standard Andhra pickle base — do not print these on a label
  without checking), shelf life, and whether any are free of added sugar. Those
  are set conservatively rather than optimistically.
*/
export const PRODUCTS: Product[] = [
  {
    slug: "cashew-gongura-pickle",
    name: "Cashew Gongura Pickle",
    qualifier: "the one people reorder",
    category: "pickles",
    needs: ["with-meals", "everyday"],
    blurb: "Sorrel leaf and whole cashew, cut sharp and sour.",
    story:
      "Gongura is the sour leaf Andhra cooking is built on, and this is the richer version of it — the pickle cut with whole cashew so there is something to bite through. Made in small lots with fresh oil each batch.",
    price: 637,
    weightGrams: 750,
    image: "/products/cashew-gongura-pickle.jpg",
    ingredients: ["Gongura (sorrel leaf)", "Cashew", "Red chilli", "Salt", "Mustard", "Oil"],
    nutrition: [],
    shelfLifeDays: 180,
    noAddedSugar: false,
    bestseller: true,
    photoPending: true,
  },
  {
    slug: "allam-ginger-pickle",
    name: "Allam Pickle",
    qualifier: "ginger, for when nothing tastes right",
    category: "pickles",
    needs: ["with-meals"],
    blurb: "Fresh ginger ground down with tamarind and chilli.",
    story:
      "Allam pachadi, the pickle you reach for when you want the meal to wake up. Fresh ginger, tamarind for the sour, and enough chilli to make it a pickle rather than a chutney.",
    price: 590,
    weightGrams: 750,
    image: "/products/allam-ginger-pickle.jpg",
    ingredients: ["Ginger", "Tamarind", "Red chilli", "Salt", "Mustard", "Oil"],
    nutrition: [],
    shelfLifeDays: 180,
    noAddedSugar: false,
    photoPending: true,
  },
  {
    slug: "amla-pickle",
    name: "Amla Pickle",
    qualifier: "usirikaya, spicy and sour",
    category: "pickles",
    needs: ["with-meals", "everyday"],
    blurb: "Whole amla in rich oil — spicy, and properly sour.",
    story:
      "Usirikaya avakaya. The amla goes in whole so it keeps its bite, and the oil carries the spice through it over the first few weeks. It gets better the longer it sits.",
    price: 393,
    weightGrams: 500,
    image: "/products/amla-pickle.jpg",
    ingredients: ["Amla (Indian gooseberry)", "Red chilli", "Salt", "Mustard", "Fenugreek", "Oil"],
    nutrition: [],
    shelfLifeDays: 180,
    noAddedSugar: false,
    bestseller: true,
    photoPending: true,
  },
  {
    slug: "jeedipappu-kothimeera-pickle",
    name: "Jeedipappu Kothimeera Pickle",
    qualifier: "cashew & coriander",
    category: "pickles",
    needs: ["with-meals"],
    blurb: "Coriander ground fresh, cashew folded through whole.",
    story:
      "Kothimeera pickle made the way it is at home — coriander ground the same day so it stays green rather than going dark, with whole cashew through it.",
    price: 425,
    weightGrams: 500,
    image: "/products/jeedipappu-kothimeera-pickle.jpg",
    ingredients: ["Coriander", "Cashew", "Green chilli", "Salt", "Tamarind", "Oil"],
    nutrition: [],
    shelfLifeDays: 180,
    noAddedSugar: false,
    photoPending: true,
  },
  {
    slug: "nutrition-balls",
    name: "Nutrition Balls",
    qualifier: "everyday wellness shots",
    category: "bites",
    needs: ["everyday", "snacking"],
    blurb: "Dates, cashew, pistachio and pumpkin seed, rolled by hand.",
    story:
      "The everyday one. Dates and figs blended down to bind, then folded through with whole cashew, pistachio, almond and pumpkin seed — folded, not ground, so you still bite into the nut. No jaggery, no sugar syrup; the dates do the work.",
    price: 549,
    weightGrams: 300,
    pieces: 12,
    image: "/products/nutrition-balls.jpg",
    ingredients: [
      "Dates",
      "Figs",
      "Cashew",
      "Pistachio",
      "Almond",
      "Pumpkin seed",
      "Sesame",
      "Ghee",
    ],
    nutrition: [],
    shelfLifeDays: 21,
    noAddedSugar: true,
    bestseller: true,
  },
  {
    slug: "biotin-bites",
    name: "Biotin Bites",
    qualifier: "for your hair & skin",
    category: "bites",
    needs: ["hair-skin", "everyday"],
    blurb: "Black sesame and sunflower seed, dark and dense, a cashew pressed on top.",
    story:
      "Built on black sesame, sunflower and flax — the seeds that carry biotin — with walnut and almond ground in for body. It comes out almost black, which is the sesame, and it is the least sweet thing we make. One cashew pressed into each so you can tell them apart in the box.",
    price: 649,
    weightGrams: 300,
    pieces: 12,
    image: "/products/biotin-bites.jpg",
    ingredients: [
      "Black sesame",
      "Sunflower seed",
      "Flax seed",
      "Walnut",
      "Almond",
      "Dates",
      "Cashew",
    ],
    nutrition: [],
    shelfLifeDays: 21,
    noAddedSugar: true,
    bestseller: true,
  },
  {
    slug: "mixed-berry-nuts",
    name: "Mixed Berry & Nuts Balls",
    qualifier: "for kids & elders",
    category: "bites",
    needs: ["kids-elders", "snacking"],
    blurb: "Softer set, whole cranberries and apricot. Chews easy.",
    story:
      "Made deliberately softer than the rest, because it is for the two people at either end of the table. Whole dried cranberry, apricot and blueberry sit on the surface; the nuts inside are chopped coarse rather than left whole, so there is nothing hard to work through.",
    price: 649,
    weightGrams: 300,
    pieces: 12,
    image: "/products/mixed-berry-nuts.jpg",
    detailImage: "/products/mixed-berry-nuts-detail.jpg",
    ingredients: [
      "Dates",
      "Dried cranberry",
      "Dried apricot",
      "Dried blueberry",
      "Cashew",
      "Almond",
      "Chia",
      "Ghee",
    ],
    nutrition: [],
    shelfLifeDays: 21,
    noAddedSugar: true,
    bestseller: true,
  },
  {
    slug: "calcium-iron-balls",
    name: "Calcium & Iron Balls",
    qualifier: "loaded with nuts and seeds",
    category: "bites",
    needs: ["bones-blood", "everyday"],
    blurb: "Three rolls in one box — sesame, ragi, and coconut-dusted date.",
    story:
      "A box of three. The pale one is white sesame and groundnut; the dark one is ragi and dates with pistachio and almond through it; the coconut-rolled one is date and cocoa. Sesame and ragi for calcium, dates and ragi for iron — the traditional pairing, made small enough to eat one a day.",
    price: 599,
    weightGrams: 300,
    pieces: 12,
    image: "/products/calcium-iron-balls.jpg",
    ingredients: [
      "White sesame",
      "Ragi",
      "Dates",
      "Groundnut",
      "Almond",
      "Pistachio",
      "Desiccated coconut",
      "Ghee",
    ],
    nutrition: [],
    shelfLifeDays: 21,
    noAddedSugar: true,
  },
  {
    slug: "banana-chips",
    name: "Jaggery Banana Chips",
    category: "chips",
    needs: ["snacking", "kids-elders"],
    blurb: "Coconut-oil fried, then turned through melted jaggery until it sets.",
    story:
      "Nendran plantain sliced thick, fried in coconut oil, then returned to the pan with melted jaggery and dry ginger until every slice takes a coat and dries hard. That coat is what turns it the colour it is. Sweet first, then the ginger.",
    price: 349,
    weightGrams: 250,
    image: "/products/banana-chips.jpg",
    ingredients: ["Nendran plantain", "Coconut oil", "Palm jaggery", "Dry ginger", "Cardamom"],
    nutrition: [],
    shelfLifeDays: 30,
    noAddedSugar: false,
  },
];

export function getProduct(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

/**
 * Sorts photographed products ahead of the ones still waiting on a shot.
 * Stable, so the hand-written order of `PRODUCTS` survives within each group.
 */
export function photographedFirst(a: Product, b: Product): number {
  return Number(a.photoPending ?? false) - Number(b.photoPending ?? false);
}

export function bestsellers(): Product[] {
  return PRODUCTS.filter((p) => p.bestseller).sort(photographedFirst);
}

export function related(slug: string, limit = 3): Product[] {
  const current = getProduct(slug);
  if (!current) return PRODUCTS.slice(0, limit);
  return PRODUCTS.filter((p) => p.slug !== slug)
    .sort(
      (a, b) =>
        Number(b.needs.some((n) => current.needs.includes(n))) -
        Number(a.needs.some((n) => current.needs.includes(n))),
    )
    .slice(0, limit);
}
