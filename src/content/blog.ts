/*
 * Blog posts, shaped like Sanity "post" documents: the Blog List (Figma desktop 3565:101703, mobile 3587:129657), each
 * post's page (Post Detail 3565:102017, mobile 3587:130026), Home's blog row and the Education mega menu.
 * Figma shows placeholder posts ("Post Title", Latin excerpts); these replace them with real, general jewelry advice.
 * "How to Layer Necklaces" follows the Post Detail frame's full structure; the others use the same template, shorter.
 * Dates are mock and recent; read times are worked out from each post's text.
 */
import type { ImageRef } from "@/components/ui/Picture";
import { readTime, type ArticleBlock } from "./article";

export type BlogPost = {
  _id: string;
  _type: "post";
  /** "story": a customer story (topic "Stories"), at /stories/<slug>/ with the Stories frame's header (6287:176402). */
  kind?: "story";
  title: string;
  slug: string;
  topic: string;
  /** ISO date */
  date: string;
  readTime: string;
  excerpt: string;
  /** 64px thumbnail in the mega menu */
  thumbnail: { src: string; alt: string };
  /** 4:3 card image (Home, the Blog List, "You Should also Read") */
  image: ImageRef;
  /** The post page's photo under the title (1034 x 581; mobile 4:3). */
  hero: ImageRef;
  /** The Blog List's featured post photo (584 x 438, 4:3), when this post is the newest. */
  featuredImage: ImageRef;
  body: ArticleBlock[];
};

const h2 = (key: string, text: string): ArticleBlock => ({ _type: "heading", _key: key, level: 2, text });
const h3 = (key: string, text: string): ArticleBlock => ({ _type: "heading", _key: key, level: 3, text });
const h4 = (key: string, text: string): ArticleBlock => ({ _type: "heading", _key: key, level: 4, text });
const p = (key: string, text: string): ArticleBlock => ({ _type: "paragraph", _key: key, text });

const FACE_POST: ImageRef = { desktop: "story-face-post", alt: "A woman resting her hand on her cheek, wearing a pear-shaped diamond ring" };
const ARMS_POST: ImageRef = { desktop: "story-arms-post", alt: "Crossed arms, one hand wearing a pear-shaped diamond ring" };
const HAND_POST: ImageRef = { desktop: "story-hand-post", alt: "A hand wearing several stacked gold rings" };

type PostInput = Omit<BlogPost, "_type" | "readTime" | "featuredImage"> & { featuredImage?: ImageRef };
const post = (input: PostInput): BlogPost => ({
  ...input,
  _type: "post",
  readTime: readTime(input.body).replace("min read", "Min Read"),
  featuredImage: input.featuredImage ?? { ...input.hero, desktop: input.hero.mobile ?? input.hero.desktop, mobile: undefined },
});


type StoryInput = {
  _id: string;
  title: string;
  slug: string;
  date: string;
  excerpt: string;
  photo: "face" | "arms" | "hand";
  products: string[];
  love: [string, string];
  choosingHeading: string;
  choosing: string;
  rows: Array<[string, string, string]>;
  thoughts: string;
};

const PHOTOS = {
  face: { card: "story-face-post", wide: "edu-face-wide", four3: "edu-face-43", thumb: "/images/education/blog-thumb-1.jpg", alt: "A woman with her hand over one eye, wearing a pear-shaped diamond ring" },
  arms: { card: "story-arms-post", wide: "edu-arms-wide", four3: "edu-arms-43", thumb: "/images/education/blog-thumb-2.jpg", alt: "Crossed arms, one hand wearing a pear-shaped diamond ring" },
  hand: { card: "story-hand-post", wide: "edu-hand-wide", four3: "edu-hand-43", thumb: "/images/education/blog-thumb-3.jpg", alt: "A hand wearing several stacked gold rings" },
} as const;

/** A customer story on the Stories frame's template: the story, a photo with Featured Products, the ring at a glance, a photo with Customize this ring, Our Thoughts. */
const story = (input: StoryInput): BlogPost => {
  const own = PHOTOS[input.photo];
  const [first, second] = (["face", "arms", "hand"] as const).filter((key) => key !== input.photo).map((key) => PHOTOS[key]);
  return post({
    _id: input._id,
    kind: "story",
    title: input.title,
    slug: input.slug,
    topic: "Stories",
    date: input.date,
    excerpt: input.excerpt,
    thumbnail: { src: own.thumb, alt: "" },
    image: { desktop: own.card, alt: own.alt },
    hero: { desktop: own.wide, mobile: own.four3, alt: own.alt },
    body: [
      h2("love", "The Love Story"),
      p("love-1", input.love[0]),
      p("love-2", input.love[1]),
      h3("choosing", input.choosingHeading),
      p("choosing-1", input.choosing),
      { _type: "figure", _key: "products", image: { desktop: first.four3, alt: first.alt }, products: { label: "Featured Products", handles: input.products } },
      h2("ring", "The Ring"),
      p("ring-1", "Their pieces, at a glance."),
      { _type: "table", _key: "ring-table", caption: `${input.title}: their pieces`, columns: ["Piece", "Style", "Metal"], rows: input.rows },
      { _type: "figure", _key: "customize", image: { desktop: second.four3, alt: second.alt }, action: { label: "Customize this ring", icon: "sparkle", href: "/design-your-own/" } },
      h2("thoughts", "Our Thoughts"),
      p("thoughts-1", input.thoughts),
    ],
  });
};

export const blogPosts: BlogPost[] = [
  post({
    _id: "post-layering-necklaces",
    title: "How to Layer Necklaces",
    slug: "how-to-layer-necklaces",
    topic: "Style",
    date: "2026-11-12",
    excerpt: "Start with one piece you love, then build around it: lengths, weights and textures for a layered look that stays put.",
    thumbnail: { src: "/images/education/blog-thumb-3.jpg", alt: "" },
    image: HAND_POST,
    hero: { desktop: "edu-hand-wide", mobile: "edu-hand-43", alt: "A hand wearing several stacked gold rings" },
    // Figma's Blog List features the crossed-arms photo (2764ebba).
    featuredImage: { desktop: "edu-arms-43", alt: "Crossed arms, one hand wearing a pear-shaped diamond ring" },
    body: [
      h2("start", "Start With One Piece You Love"),
      p(
        "start-1",
        "The easiest layered looks are built around a single favorite: a pendant you wear every day, a fine chain with a little sparkle, or a bolder link. Decide which piece is the star, then choose the others to frame it rather than compete with it.",
      ),
      p("start-2", "Two or three necklaces are plenty to begin with. Lay them out on a flat surface before you put them on, so you can see how the lengths and textures work together."),
      h3("base", "Choose a Base Layer"),
      p(
        "base-1",
        "A simple chain close to the neck makes a good base. Fine cable and paperclip chains are versatile because they sit flat and suit almost any neckline. From there, each layer should hang a little lower than the one above, with enough space between them that each can be seen on its own. Keep the finest chain highest and the heaviest lowest, so the weight sits naturally and the layers don’t pull on one another.",
      ),
      {
        _type: "figure",
        _key: "layers",
        image: { desktop: "edu-necklace-d", mobile: "edu-necklace-m", alt: "A woman wearing layered gold necklaces, one set with a green stone" },
        shape: "tall",
        products: { label: "Featured Products", handles: ["paperclip-chain-necklace-2-5mm", "four-prong-solitaire-lab-grown-pendant"] },
      },
      h3("contrast", "Add Contrast in Length and Texture"),
      p(
        "contrast-1",
        "Pair a delicate chain with a bolder one, or a plain chain with a pendant, so the eye moves from one to the next. Mixing textures, such as a smooth chain beside a link chain, adds interest without adding more pieces.",
      ),
      h2("stacking", "Stacking Rings With Intention"),
      p(
        "stacking-1",
        "The same thinking works on your hands. An engagement ring or a favorite statement ring is the anchor; slim bands on either side frame it. Stacks look best when the rings share something, whether a metal, a shape or a level of sparkle.",
      ),
      h4("metals", "Mixing Metals"),
      p(
        "metals-1",
        "Yellow, white and rose gold can be worn together. Repeat each metal at least twice, on the neck or the hands, so the mix looks deliberate, and use a piece that combines metals to tie the look together.",
      ),
      { _type: "list", _key: "stack", label: "A simple three-ring stack:", items: ["A plain band below your center ring, to protect it and give it a base.", "Your center ring, the piece the stack is built around.", "A slim pavé or textured band above it, to add sparkle without crowding."] },
      h3("lengths", "Necklace Lengths at a Glance"),
      p(
        "lengths-1",
        "Necklace lengths have traditional names. Knowing them makes it easier to plan layers that fall at different points, so each necklace has its own space.",
      ),
      {
        _type: "table",
        _key: "lengths-table",
        caption: "Necklace lengths",
        columns: ["Length", "Typical length", "Where it sits", "Layers well with"],
        rows: [
          ["Choker", "14 to 16 in", "At the base of the neck", "Princess"],
          ["Princess", "17 to 19 in", "Just below the collarbone", "Choker or matinee"],
          ["Matinee", "20 to 24 in", "At the top of the chest", "Princess"],
          ["Opera", "28 to 36 in", "Over the chest", "Shorter chains"],
        ],
      },
      { _type: "figure", _key: "ring", image: { desktop: "edu-arms-43", alt: "Crossed arms, one hand wearing a pear-shaped diamond ring" }, action: { label: "Customize this ring", icon: "sparkle", href: "/design-your-own/" } },
      h3("comfort", "Keep It Comfortable"),
      p(
        "comfort-1",
        "Layers tangle less when the chains differ in weight and length. A necklace spacer or a single multi-strand piece can keep them apart. Take layered necklaces off one at a time and store them separately, with the clasps fastened.",
      ),
      h2("thoughts", "Our Thoughts"),
      p(
        "thoughts-1",
        "There are no strict rules to layering. Start with one piece you love, give every layer its own space, and repeat a metal or a shape so the whole look holds together. Then wear what feels like you.",
      ),
    ],
  }),
  post({
    _id: "post-choosing-a-setting",
    title: "How to Choose the Right Engagement Ring Setting",
    slug: "how-to-choose-the-right-engagement-ring-setting",
    topic: "Engagement",
    date: "2026-10-28",
    excerpt: "Solitaire, halo or bezel: how each setting frames the stone, and what suits everyday wear.",
    thumbnail: { src: "/images/education/blog-thumb-1.jpg", alt: "" },
    image: { desktop: "story-face-post", alt: "A woman resting her hand on her cheek, wearing a pear-shaped diamond ring" },
    hero: { desktop: "edu-face-wide", mobile: "edu-face-43", alt: "A woman with her hand over one eye, wearing a pear-shaped diamond ring" },
    body: [
      h2("start", "Start With How You Live"),
      p(
        "start-1",
        "A setting holds the center stone and shapes the whole look of the ring. Before you choose a style, think about how you use your hands: a ring worn through work, sport and travel needs a different setting from one worn mostly for special occasions.",
      ),
      h3("prongs", "Prongs or Bezel"),
      p(
        "prongs-1",
        "Prongs grip the stone with small metal claws and let in the most light. A bezel wraps the stone in a thin rim of metal, which protects its edge and sits smoothly against clothing.",
      ),
      h2("styles", "Styles That Add Sparkle"),
      p(
        "styles-1",
        "A halo circles the center stone with smaller diamonds, adding brightness and making it look larger. Pavé lines the band with small diamonds. Side-stone and three-stone settings flank the center stone with accents for a fuller look.",
      ),
      h2("thoughts", "Our Thoughts"),
      p("thoughts-1", "Choose the setting that suits your life first and your style second. A simple solitaire is timeless; a halo or pavé band adds sparkle. Try a few on before you decide."),
    ],
  }),
  post({
    _id: "post-lab-vs-natural",
    title: "Lab-Grown or Natural: What Sets Them Apart",
    slug: "lab-grown-or-natural-what-sets-them-apart",
    topic: "Diamonds",
    date: "2026-09-16",
    excerpt: "Both are real diamonds. Here is how they differ in origin, price and how they are graded.",
    thumbnail: { src: "/images/education/blog-thumb-2.jpg", alt: "" },
    image: { desktop: "story-arms-post", alt: "Crossed arms, one hand wearing a pear-shaped diamond ring" },
    hero: { desktop: "edu-arms-wide", mobile: "edu-arms-43", alt: "Crossed arms, one hand wearing a pear-shaped diamond ring" },
    body: [
      h2("same", "The Same Diamond, Two Origins"),
      p(
        "same-1",
        "Lab-grown and natural diamonds share the same chemical composition, crystal structure, hardness and sparkle. To the eye they are the same; telling them apart takes specialized laboratory equipment.",
      ),
      h3("origin", "How They Form"),
      p(
        "origin-1",
        "Natural diamonds formed deep in the earth over a very long time. Lab-grown diamonds are created in a laboratory, by high pressure and high temperature or by chemical vapor deposition, processes that recreate the conditions in which diamonds form.",
      ),
      h2("price", "Grading and Price"),
      p(
        "price-1",
        "Grading reports for both state the origin, and some laboratories describe a lab-grown diamond’s quality on a different scale, so check which scale a report uses. Prices differ too, so compare a lab-grown and a natural diamond of similar size and quality to see what each offers within your budget.",
      ),
      h2("thoughts", "Our Thoughts"),
      p("thoughts-1", "There is no wrong choice. Decide whether natural origin or size and grade matters more to you, and choose the diamond you love."),
    ],
  }),
  post({
    _id: "post-wedding-band-match",
    title: "Choosing a Wedding Band to Match Your Engagement Ring",
    slug: "choosing-a-wedding-band-to-match-your-engagement-ring",
    topic: "Weddings",
    date: "2026-08-26",
    excerpt: "Flush, curved or contrasting: how to find a band that sits well beside your engagement ring.",
    thumbnail: { src: "/images/education/blog-thumb-1.jpg", alt: "" },
    image: FACE_POST,
    hero: { desktop: "edu-face-wide", mobile: "edu-face-43", alt: "A woman with her hand over one eye, wearing a pear-shaped diamond ring and a band" },
    body: [
      h2("fit", "Start With the Fit"),
      p(
        "fit-1",
        "Bring your engagement ring when you try bands. If its setting sits above the band, a straight band can sit flush beside it. If the center stone or a halo sits low, a curved or notched band follows its shape and closes the gap.",
      ),
      h3("width", "Width and Balance"),
      p("width-1", "A band about as wide as your engagement ring’s shank looks balanced. A slimmer band lets the engagement ring lead; a wider one makes a bolder pair."),
      h2("style", "Matching or Contrasting"),
      p(
        "style-1",
        "Choose the same metal and finish for a matched set, or contrast them, yellow gold beside platinum or a brushed band beside a polished ring, for a modern look. Diamond bands add sparkle; plain bands let the center stone stand out.",
      ),
      h2("thoughts", "Our Thoughts"),
      p("thoughts-1", "Wear the two rings together for a few minutes before you decide. The right band feels comfortable and looks like it belongs."),
    ],
  }),
  post({
    _id: "post-stacking-rings",
    title: "Stacking Rings: Mixing Metals and Shapes",
    slug: "stacking-rings-mixing-metals-and-shapes",
    topic: "Style",
    date: "2026-08-05",
    excerpt: "Simple rules for pairing bands with your engagement ring, from contrast metals to matching curves.",
    thumbnail: { src: "/images/education/blog-thumb-3.jpg", alt: "" },
    image: HAND_POST,
    hero: { desktop: "edu-hand-wide", mobile: "edu-hand-43", alt: "A hand wearing several stacked gold rings" },
    body: [
      h2("anchor", "Pick an Anchor"),
      p(
        "anchor-1",
        "Every stack needs a center: an engagement ring, a statement ring or a favorite band. Build outward from it with slimmer rings so it keeps its place.",
      ),
      h3("shapes", "Echo the Shapes"),
      p("shapes-1", "Round stones sit easily with round-edged bands; emerald and princess cuts suit straight lines. Curved bands follow pear, marquise and oval stones closely."),
      h2("metals", "Mixing Metals"),
      p(
        "metals-1",
        "Yellow, white and rose gold work together when each appears more than once. A two-tone ring or a band in a second metal ties the mix together.",
      ),
      h2("thoughts", "Our Thoughts"),
      p("thoughts-1", "Start with three rings, add one at a time, and stop when the stack still feels comfortable to wear."),
    ],
  }),
  post({
    _id: "post-jewelry-bright",
    title: "A Simple Routine for Keeping Jewelry Bright",
    slug: "a-simple-routine-for-keeping-jewelry-bright",
    topic: "Care",
    date: "2026-07-14",
    excerpt: "A few minutes a week keeps diamonds and gold shining: what to use, what to avoid and when to see a jeweler.",
    thumbnail: { src: "/images/education/blog-thumb-2.jpg", alt: "" },
    image: ARMS_POST,
    hero: { desktop: "edu-arms-wide", mobile: "edu-arms-43", alt: "Crossed arms, one hand wearing a pear-shaped diamond ring" },
    body: [
      h2("weekly", "A Weekly Clean"),
      p(
        "weekly-1",
        "Soak gold and diamond pieces in warm water with a drop of mild soap, brush gently with a soft toothbrush, rinse and pat dry. Lotion and everyday dust dull a diamond quickly, so a little cleaning makes a visible difference.",
      ),
      h3("avoid", "What to Avoid"),
      p("avoid-1", "Keep jewelry away from bleach, chlorine and abrasive cleaners. Softer and treated gemstones, pearls and emeralds among them, need only a damp cloth."),
      h2("jeweler", "When to See a Jeweler"),
      p(
        "jeweler-1",
        "Have rings checked from time to time for worn prongs or loose stones, especially pieces you wear every day. A jeweler can also polish away fine scratches and renew a white gold finish.",
      ),
      h2("thoughts", "Our Thoughts"),
      p("thoughts-1", "Put jewelry on last and take it off first, store pieces apart, and clean them little and often."),
    ],
  }),
  post({
    _id: "post-sapphires",
    title: "Sapphires Beyond Blue",
    slug: "sapphires-beyond-blue",
    topic: "Gemstones",
    date: "2026-06-23",
    excerpt: "Pink, yellow, green and more: the many colors of sapphire, and why it suits a ring worn every day.",
    thumbnail: { src: "/images/education/blog-thumb-3.jpg", alt: "" },
    image: FACE_POST,
    hero: { desktop: "edu-face-wide", mobile: "edu-face-43", alt: "A woman with her hand over one eye, wearing a pear-shaped diamond ring" },
    body: [
      h2("colors", "A Rainbow of Colors"),
      p(
        "colors-1",
        "Sapphire is the mineral corundum, and while blue is its best-known color, it also comes in pink, yellow, orange, purple, green and colorless white. Red corundum has its own name: ruby.",
      ),
      h3("choosing", "Choosing a Color"),
      p("choosing-1", "Look for even color that stays rich in different light. Many sapphires are heated to improve their color, a common and stable treatment that should be disclosed."),
      h2("wear", "Made for Every Day"),
      p("wear-1", "At 9 on the Mohs scale, sapphire is one of the hardest gemstones, which makes it a lasting choice for an engagement ring or a band you never take off."),
      h2("thoughts", "Our Thoughts"),
      p("thoughts-1", "If you love color, a sapphire is a durable way to wear it every day."),
    ],
  }),
  // Customer stories (Figma "Post Detail / Stories" 6287:176402): Home's six invented couples and their blurbs, with the
  // "Stories" topic. They live at /stories/<slug>/ (the addresses Home already links to). The frame's couple, their
  // photo and their story are not used; each story opens with its Home card photo and says nothing about the business.
  story({
    _id: "story-amara-james",
    title: "Amara & James",
    slug: "amara-and-james",
    date: "2026-10-30",
    excerpt: "A pear-cut diamond on a slim band, chosen together.",
    photo: "face",
    products: ["petite-solitaire-engagement-ring-setting", "classic-2mm-band"],
    love: [
      "Amara and James decided early on that they would choose the ring together. They spent a few weekends trying shapes on, and kept coming back to the pear.",
      "Its outline looked longer and slimmer on Amara’s hand, and it suited the simple jewelry she wears every day.",
    ],
    choosingHeading: "Choosing the Ring",
    choosing: "They set the pear on a slim band, so the stone leads and nothing competes with it. A prong over the point protects it from knocks, which mattered for a ring worn every day.",
    rows: [["Engagement ring", "Pear-cut diamond on a slim band", "Yellow gold"]],
    thoughts: "A pear-cut diamond on a slim band is a quiet, lasting choice. If you choose a pear, look for even brightness from the point to the rounded end, and a prong that guards the point.",
  }),
  story({
    _id: "story-sofia-daniel",
    title: "Sofia & Daniel",
    slug: "sofia-and-daniel",
    date: "2026-10-09",
    excerpt: "A cushion-cut diamond with a hidden halo.",
    photo: "arms",
    products: ["round-halo-engagement-ring-setting", "classic-2mm-band"],
    love: [
      "Sofia wanted a ring with a soft, rounded outline, and Daniel wanted a little sparkle that only she would notice. A cushion cut with a hidden halo gave them both.",
      "The cushion’s rounded corners and broad facets have a gentle, old-fashioned glow that Sofia loved from the start.",
    ],
    choosingHeading: "A Halo Only She Sees",
    choosing: "A hidden halo sets a row of small diamonds under the center stone, where it shows from the side rather than from above. Face up, the cushion stands alone; from the side, the halo catches the light.",
    rows: [["Engagement ring", "Cushion-cut diamond with a hidden halo", "White gold"]],
    thoughts: "A hidden halo adds sparkle without changing the look of the center stone from above. It suits anyone who wants a classic solitaire with a detail of their own.",
  }),
  story({
    _id: "story-nia-marcus",
    title: "Nia & Marcus",
    slug: "nia-and-marcus",
    date: "2026-09-25",
    excerpt: "Stacked bands in yellow gold, one for every year.",
    photo: "hand",
    products: ["classic-2mm-band", "twig-diamond-stackable-band"],
    love: [
      "Nia and Marcus started with a plain yellow gold wedding band. On each anniversary since, they have added another band to the stack.",
      "Each one is a little different, a plain band one year and a band with small diamonds the next, so the stack tells their story as it grows.",
    ],
    choosingHeading: "Building the Stack",
    choosing: "Keeping every band in yellow gold holds the stack together, while the changes in width and texture make each year easy to pick out.",
    rows: [
      ["Wedding band", "Plain band", "Yellow gold"],
      ["Anniversary bands", "Plain and diamond bands, added one at a time", "Yellow gold"],
    ],
    thoughts: "A stack that grows over the years works best when the bands share one metal. Slim bands leave room to add more, and a mix of plain and diamond bands keeps it interesting.",
  }),
  story({
    _id: "story-lena-omar",
    title: "Lena & Omar",
    slug: "lena-and-omar",
    date: "2026-09-02",
    excerpt: "A surprise proposal with a ring designed in secret.",
    photo: "face",
    products: ["vine-engagement-ring-setting", "classic-solitaire-engagement-ring-setting"],
    love: [
      "Omar wanted the proposal to be a complete surprise, so he designed Lena’s ring without her knowing, starting from the jewelry she already wore and loved.",
      "He borrowed a ring she wore on the same finger to get the size right, and returned it before she noticed it was gone.",
    ],
    choosingHeading: "Designing in Secret",
    choosing: "He chose a setting first, then the center stone, keeping the style close to Lena’s everyday pieces so the ring would feel like hers from the first day.",
    rows: [["Engagement ring", "A setting and center stone chosen separately", "White gold"]],
    thoughts: "If you design a ring as a surprise, start from the jewelry they already wear: it tells you their metal, their style and, with a borrowed ring, their size.",
  }),
  story({
    _id: "story-grace-tom",
    title: "Grace & Tom",
    slug: "grace-and-tom",
    date: "2026-08-19",
    excerpt: "Matching wedding bands in white gold.",
    photo: "arms",
    products: ["classic-2mm-band", "classic-4mm-band"],
    love: [
      "Grace and Tom wanted wedding bands that looked like a pair, even though their hands and tastes are different.",
      "They chose the same white gold and the same polished finish, in two widths: a slimmer band for Grace and a wider one for Tom.",
    ],
    choosingHeading: "A Matching Pair",
    choosing: "Matching the metal and finish made the two bands read as a set, while choosing each width separately let each band suit the hand that wears it.",
    rows: [
      ["Wedding band", "Slim, polished", "White gold"],
      ["Wedding band", "Wide, polished", "White gold"],
    ],
    thoughts: "Matching bands don’t have to be identical. The same metal and finish make a pair; the width can follow each hand.",
  }),
  story({
    _id: "story-priya-sam",
    title: "Priya & Sam",
    slug: "priya-and-sam",
    date: "2026-07-28",
    excerpt: "An emerald and diamond stack for their anniversary.",
    photo: "hand",
    products: ["twig-diamond-stackable-band", "flush-set-natural-diamond-band"],
    love: [
      "For their anniversary, Priya and Sam added color to Priya’s rings: an emerald band to sit between her diamond bands.",
      "Green has always been Priya’s favorite color, and the emerald brings it into the rings she wears every day.",
    ],
    choosingHeading: "Adding Color to the Stack",
    choosing: "The emerald sits between two diamond bands, which frame its color and protect it from knocks, since emerald is softer than diamond.",
    rows: [
      ["Anniversary band", "Emerald band", "Yellow gold"],
      ["Diamond bands", "One on either side of the emerald", "Yellow gold"],
    ],
    thoughts: "A colored stone between diamond bands is a simple way to wear color every day. With softer stones such as emerald, bands on either side help protect it.",
  }),
];

export const postHref = (post: Pick<BlogPost, "slug" | "kind">) => (post.kind === "story" ? `/stories/${post.slug}/` : `/blog/${post.slug}/`);
/** A topic's id in the Blog List's URL (?topic=style). */
export const postTopicId = (topic: string) => topic.toLowerCase().replace(/[^a-z0-9]+/g, "-");
export const postBySlug = (slug: string) => blogPosts.find((item) => item.slug === slug) ?? null;

/** The three posts Home's blog row and the Education mega menu name (unchanged since they were added). */
export const homePostIds = ["post-choosing-a-setting", "post-lab-vs-natural", "post-stacking-rings"];
export const homePosts = homePostIds.map((id) => blogPosts.find((item) => item._id === id)!);

/** The Blog List page. */
export const blogPage = {
  _type: "blogPage" as const,
  seo: { title: "Blog", description: "Style notes, buying advice and care tips for the jewelry you wear every day." },
  title: "Sky Jewelry Blog",
  body: "Style notes, buying advice and care tips for the jewelry you wear every day.",
  pageSize: 12,
  readMore: "Read More",
  /** The Stories frame's header: "All Stories" (to the Blog with the Stories topic) and the eyebrow "Meet the Couple". */
  storyBack: "All Stories",
  storyEyebrow: "Meet the Couple",
  allTopics: "All Topics",
  back: "All Posts",
  alsoRead: "You Should also Read",
  viewAll: "view all posts",
};
