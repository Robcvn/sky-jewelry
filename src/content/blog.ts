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
];

export const postHref = (post: Pick<BlogPost, "slug">) => `/blog/${post.slug}/`;
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
  allTopics: "All Topics",
  back: "All Posts",
  alsoRead: "You Should also Read",
  viewAll: "view all posts",
};
