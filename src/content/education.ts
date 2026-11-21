/*
 * The Education Center (Figma desktop 3565:101629, mobile 3587:129570; controls 6963:54748 / 6963:55696, mobile
 * 7074:91849) and its resources (Resource Detail 3565:101773, mobile 3587:129748), shaped like Sanity documents.
 * Figma shows placeholder titles ("Resource Title") and Latin filler; the resources below replace them with real,
 * general jewelry education. One resource per address the site already links to (the Education menu, Home, the ring
 * builder and the Diamonds landing page). "The 4Cs of Diamonds" follows the Resource Detail frame section for section;
 * the others use the same template at shorter length.
 */
import type { ImageRef } from "@/components/ui/Picture";
import type { IconName } from "@/components/ui/Icon";
import { em, span } from "@/components/ui/RichText";
import type { ArticleBlock } from "./article";
import type { BestSellers } from "./landing/types";

export type TopicId = "diamonds" | "engagement-rings" | "wedding-bands" | "gemstones" | "fine-jewelry";

export type EducationTopic = { id: TopicId; label: string; icon: IconName; subtopics: Array<{ id: string; label: string }> };

/** The topic tiles (Figma "Popular Topics": All Topics, then these), each with its subtopic badges. */
export const educationTopics: EducationTopic[] = [
  {
    id: "diamonds",
    label: "Diamonds",
    icon: "gemstone",
    subtopics: [
      { id: "the-4cs", label: "The 4Cs" },
      { id: "shapes", label: "Diamond Shapes" },
      { id: "lab-grown-and-natural", label: "Lab-Grown & Natural" },
    ],
  },
  {
    id: "engagement-rings",
    label: "Engagement Rings",
    icon: "setting",
    subtopics: [
      { id: "settings", label: "Settings" },
      { id: "sizing", label: "Sizing" },
      { id: "metals", label: "Metals" },
    ],
  },
  { id: "wedding-bands", label: "Wedding Bands", icon: "band", subtopics: [{ id: "buying-guides", label: "Buying Guides" }, { id: "care", label: "Care" }] },
  { id: "gemstones", label: "Gemstones", icon: "emerald", subtopics: [{ id: "buying-guides", label: "Buying Guides" }, { id: "gemstone-types", label: "Gemstone Types" }] },
  { id: "fine-jewelry", label: "Fine Jewelry", icon: "pearl-necklace", subtopics: [{ id: "buying-guides", label: "Buying Guides" }, { id: "care", label: "Care" }] },
];

export type EducationResource = {
  _id: string;
  _type: "resource";
  title: string;
  slug: string;
  topic: TopicId;
  subtopic: string;
  /** ISO date, for "Sort by: Latest". */
  date: string;
  /** The card's text. */
  excerpt: string;
  /** The hero's line under the title. */
  subtitle: string;
  /** The card photo (Figma repeats three photos across the grid; so do these). */
  image: ImageRef;
  /** The heading over the topic list ("The 4C's"). */
  navLabel: string;
  body: ArticleBlock[];
  /** The "Next Resource" card at the end. */
  next: string;
};

const FACE: ImageRef = { desktop: "story-face-post", alt: "A woman with her hand over one eye, wearing a pear-shaped diamond ring and a band" };
const ARMS: ImageRef = { desktop: "story-arms-post", alt: "Crossed arms, one hand wearing a pear-shaped diamond ring" };
const HAND: ImageRef = { desktop: "story-hand-post", alt: "A hand wearing several stacked gold rings" };

const h2 = (key: string, text: string, nav: string): ArticleBlock => ({ _type: "heading", _key: key, level: 2, text, nav });
const h3 = (key: string, text: string): ArticleBlock => ({ _type: "heading", _key: key, level: 3, text });
const p = (key: string, text: string): ArticleBlock => ({ _type: "paragraph", _key: key, text });

const CLARITY = [
  { value: "I1", label: "I1", description: "Included: inclusions are obvious under 10x magnification and may affect transparency and brilliance." },
  { value: "SI2", label: "SI2", description: "Slightly included: inclusions are noticeable under 10x magnification and may be visible to the eye." },
  { value: "SI1", label: "SI1", description: "Slightly included: inclusions are noticeable under 10x magnification; many stones look clean to the eye." },
  { value: "VS2", label: "VS2", description: "Very slightly included: minor inclusions are seen with some effort under 10x magnification." },
  { value: "VS1", label: "VS1", description: "Very slightly included: minor inclusions are hard to see under 10x magnification." },
  { value: "VVS2", label: "VVS2", description: "Very, very slightly included: inclusions are very difficult to see under 10x magnification." },
  { value: "VVS1", label: "VVS1", description: "Very, very slightly included: inclusions are extremely difficult to see under 10x magnification." },
  { value: "IF", label: "IF", description: "Internally flawless: no inclusions under 10x magnification, only minor surface blemishes." },
  { value: "FL", label: "FL", description: "Flawless: no inclusions or blemishes under 10x magnification." },
];

/** Approximate face-up diameters of a well-cut round brilliant; other shapes and cuts spread differently. */
const CARAT = [
  ["0.25", "0.25", "About 4.1 mm across."],
  ["0.33", "0.33", "About 4.4 mm across."],
  ["0.5", "0.50", "About 5.2 mm across."],
  ["0.75", "0.75", "About 5.8 mm across."],
  ["1", "1.00", "About 6.5 mm across."],
  ["1.5", "1.50", "About 7.4 mm across."],
  ["2", "2.00", "About 8.2 mm across."],
  ["3", "3.00", "About 9.4 mm across."],
  ["4", "4.00", "About 10.2 mm across."],
  ["5", "5.00", "About 11.0 mm across."],
].map(([value, carat, size]) => ({ value, label: value, description: `${carat} ct: ${size} Approximate, for a well-cut round diamond.` }));

export const educationResources: EducationResource[] = [
  {
    _id: "resource-the-4cs",
    _type: "resource",
    title: "The 4Cs of Diamonds",
    slug: "the-4cs-of-diamonds",
    topic: "diamonds",
    subtopic: "the-4cs",
    date: "2026-11-10",
    excerpt: "Cut, color, clarity and carat weight: what each grade means, which ones you will notice, and how to balance them.",
    subtitle: "Cut, color, clarity and carat weight, and how to balance them for the diamond you want.",
    image: HAND,
    navLabel: "The 4C’s",
    next: "diamond-shapes",
    body: [
      h2("cut", "Diamond Cut", "Cut"),
      p(
        "cut-1",
        "Cut describes how well a diamond’s facets are proportioned, aligned and polished, and so how it handles light. It is the only one of the 4Cs shaped entirely by the cutter. For round brilliant diamonds, the Gemological Institute of America (GIA) grades cut from Excellent to Poor, looking at proportions, symmetry and polish together. Two diamonds with the same color, clarity and weight can look very different because of cut alone.",
      ),
      h3("ideal-cut", "Ideal Cut Diamonds"),
      p(
        "ideal-cut-1",
        "A well-cut diamond returns light that enters through the top back out through the top, so the stone looks bright from edge to edge. If the pavilion is too deep, light escapes through the sides and the center can look dark; if it is too shallow, light leaks out through the bottom and the stone can look glassy. Some laboratories and retailers call the best-performing proportions “ideal”. On a GIA report, the top cut grade for a round diamond is Excellent.",
      ),
      { _type: "figure", _key: "cut-figure", image: { desktop: "edu-hand-43", alt: "A hand wearing several stacked gold rings set with diamonds" }, caption: "Cut decides how brightly a diamond returns light, whatever its size." },
      h3("brilliance", "Understanding Brilliance, Dispersion & Scintillation"),
      p(
        "brilliance-1",
        "Three effects make up a diamond’s sparkle. Brilliance is the white light reflected back to your eye. Dispersion, often called fire, is that light split into flashes of color. Scintillation is the pattern of light and dark flashes you see when the diamond, the light or you move. A well-cut stone balances all three. Look at a diamond in more than one kind of light, not only under bright spotlights, to see how it really performs.",
      ),
      h2("color", "Diamond Color", "Color"),
      p(
        "color-1",
        "Diamond color grading measures how close a white diamond is to having no color at all. GIA grades it on a scale from D, colorless, to Z, light yellow or brown, by comparing each diamond face down against master stones under controlled light. The differences between neighboring grades are subtle, and many are hard to see once the diamond is face up and set in a ring.",
      ),
      h3("colorless", "Colorless Diamonds"),
      p(
        "colorless-1",
        "D, E and F are the colorless grades. D is the highest; E and F show only traces of color that a trained grader can detect side by side with master stones. Colorless diamonds pair naturally with white gold and platinum, which do nothing to warm the stone.",
      ),
      {
        _type: "gallery",
        _key: "color-gallery",
        items: [
          { _key: "colorless", image: { desktop: "edu-color-1", alt: "A colorless round diamond" }, caption: "Colorless: D to F" },
          { _key: "near-colorless", image: { desktop: "edu-color-2", alt: "A near colorless round diamond with a hint of warmth" }, caption: "Near colorless: G to J" },
          { _key: "faint", image: { desktop: "edu-color-3", alt: "A round diamond with a faint yellow tint" }, caption: "Faint color: K to M" },
        ],
      },
      h3("near-colorless", "Near Colorless Diamonds"),
      p(
        "near-colorless-1",
        "G, H, I and J are near colorless. Face up and set, most of these diamonds look white to the eye, with any warmth showing mainly when you compare them with higher grades. In yellow or rose gold, which reflect warm tones into the stone, a near colorless diamond can look just as white as a colorless one once it is set.",
      ),
      h2("clarity", "Diamond Clarity", "Clarity"),
      p(
        "clarity-1",
        "Clarity describes inclusions inside a diamond and blemishes on its surface, small marks that most diamonds form as they grow. GIA grades clarity under 10x magnification, from Flawless to Included, by the size, number, position and visibility of these characteristics.",
      ),
      h3("which-clarity", "Which Clarity Grade to Choose?"),
      p(
        "which-clarity-1",
        "For most people the aim is an eye-clean diamond: one whose inclusions you can’t see without magnification at a normal viewing distance. Many VS2 and SI1 diamonds are eye-clean, but each stone is different, so look at the diamond itself rather than the grade alone. Step-cut shapes such as emerald and Asscher, with their open, mirror-like facets, show inclusions more readily than brilliant cuts, so a higher clarity grade can be worth it there.",
      ),
      {
        _type: "gradeScale",
        _key: "clarity-scale",
        label: "Choose a Clarity Grade",
        image: { desktop: "edu-face-43", alt: "A woman with her hand over one eye, wearing a pear-shaped diamond ring" },
        loupe: { desktop: "edu-loupe", alt: "" },
        initial: "VS2",
        options: CLARITY,
      },
      h2("carat", "Carat Weight", "Carat Weight"),
      p(
        "carat-1",
        "Carat is a unit of weight, not size: one carat weighs 0.2 grams, and each carat divides into 100 points, so a 75-point diamond weighs 0.75 carats. Because weight is spread differently by each shape and cut, two diamonds of the same weight can look different in size.",
      ),
      h3("size-and-carat", "Diamond Size and Carat Weight"),
      p(
        "size-and-carat-1",
        "What you see on the hand is the diamond’s face-up spread, its diameter or length and width. A well-cut stone puts its weight where it shows, while a deeply cut one can hide weight below the girdle. Elongated shapes such as oval, marquise and pear tend to look larger than a round diamond of the same weight. Choose a few weights below to see the approximate diameter of a well-cut round diamond.",
      ),
      {
        _type: "gradeScale",
        _key: "carat-scale",
        label: "Choose a Carat Weight",
        image: { desktop: "edu-arms-43", alt: "Crossed arms, one hand wearing a pear-shaped diamond ring" },
        initial: "1",
        options: CARAT,
      },
      { _type: "heading", _key: "advice", level: 2, text: "Our Advice" },
      p(
        "advice-1",
        "Start with cut, since it does the most for a diamond’s sparkle. Then choose the lowest color and clarity grades that still look white and clean to your eye in the setting you love: near colorless and eye-clean grades often give the best balance. Finally, choose the weight. Diamonds just under a whole or half carat look almost the same as those right at it, so a 0.90 carat stone can be a sensible alternative to a full carat. Always ask for a grading report from an independent laboratory, and compare diamonds side by side when you can.",
      ),
      { _type: "qualities", _key: "qualities", heading: "Your Diamond’s Qualities" },
    ],
  },
  {
    _id: "resource-diamond-cut",
    _type: "resource",
    title: "How Cut Shapes a Diamond’s Sparkle",
    slug: "diamond-cut",
    topic: "diamonds",
    subtopic: "the-4cs",
    date: "2026-11-03",
    excerpt: "Why proportions, symmetry and polish matter more to sparkle than any other grade, and what to look for on a report.",
    subtitle: "Proportions, symmetry and polish, and why cut matters more to sparkle than any other grade.",
    image: FACE,
    navLabel: "Diamond Cut",
    next: "diamond-color",
    body: [
      h2("cut-matters", "Why Cut Matters Most", "Why cut matters"),
      p(
        "cut-matters-1",
        "A diamond’s cut controls how light travels through it. When the angles are right, light bounces from facet to facet and returns through the top as brightness, fire and sparkle. When they are off, light leaks out of the sides or bottom and the stone looks dull, whatever its color or clarity.",
      ),
      h3("cut-grades", "Reading the Cut Grade"),
      p(
        "cut-grades-1",
        "GIA grades the cut of round brilliant diamonds from Excellent through Very Good, Good and Fair to Poor. The grade weighs the diamond’s proportions, such as table size, crown angle and pavilion depth, together with its symmetry and polish. Fancy shapes such as ovals and pears don’t receive a GIA cut grade, so judge them by eye and by their symmetry and polish grades.",
      ),
      { _type: "figure", _key: "cut-figure", image: { desktop: "edu-face-43", alt: "A woman with her hand over one eye, wearing a pear-shaped diamond ring" }, caption: "Fancy shapes are judged by eye: look for even brightness from end to end." },
      h2("cut-vs-shape", "Cut Is Not Shape", "Cut and shape"),
      p(
        "cut-vs-shape-1",
        "Shape describes a diamond’s outline: round, oval, emerald and so on. Cut describes how well that shape has been faceted. Every shape can be cut well or poorly, so choose the shape you love first, then look for the best cut within it.",
      ),
      h3("cut-tip", "A Simple Check"),
      p(
        "cut-tip-1",
        "Look at the diamond face up under ordinary light. A well-cut stone looks evenly bright, with crisp contrast between light and dark areas. Large dark patches in the center, or a window you can see through, suggest light is escaping.",
      ),
      h3("symmetry", "Symmetry and Polish"),
      p("symmetry-1", "Symmetry describes how precisely the facets are shaped, aligned and meet, and polish how smooth their surfaces are. Both are graded on the report, from Excellent to Poor. Small differences rarely show to the eye, but poor symmetry can send light out at the wrong angles and dull a stone’s sparkle. For a round diamond, the cut grade already takes symmetry and polish into account. For fancy shapes, which have no cut grade, Excellent or Very Good symmetry and polish are a good sign."),
    ],
  },
  {
    _id: "resource-diamond-color",
    _type: "resource",
    title: "Diamond Color, From D to Z",
    slug: "diamond-color",
    topic: "diamonds",
    subtopic: "the-4cs",
    date: "2026-10-27",
    excerpt: "How the color scale works, where differences become visible, and how your metal changes what you see.",
    subtitle: "How the color scale works, and how your metal changes what you see.",
    image: ARMS,
    navLabel: "Diamond Color",
    next: "diamond-clarity",
    body: [
      h2("color-scale", "The Color Scale", "The color scale"),
      p(
        "color-scale-1",
        "White diamonds are graded on a scale that runs from D, which is colorless, to Z, which has a light yellow or brown tint. Graders compare each diamond face down against master stones under controlled lighting, because color is easiest to judge from the side.",
      ),
      {
        _type: "gallery",
        _key: "color-gallery",
        items: [
          { _key: "colorless", image: { desktop: "edu-color-1", alt: "A colorless round diamond" }, caption: "Colorless: D to F" },
          { _key: "near-colorless", image: { desktop: "edu-color-2", alt: "A near colorless round diamond with a hint of warmth" }, caption: "Near colorless: G to J" },
          { _key: "faint", image: { desktop: "edu-color-3", alt: "A round diamond with a faint yellow tint" }, caption: "Faint color: K to M" },
        ],
      },
      h2("color-in-setting", "Color in a Setting", "Color in a setting"),
      p(
        "color-in-setting-1",
        "Once a diamond is face up and set, small color differences are much harder to see. White gold and platinum show a diamond’s own color most honestly, so colorless and high near-colorless grades suit them. Yellow and rose gold reflect warm tones into the stone, so a slight warmth in the diamond is less noticeable in them.",
      ),
      h3("fluorescence", "A Note on Fluorescence"),
      p(
        "fluorescence-1",
        "Some diamonds glow, usually blue, under ultraviolet light. Fluorescence is usually listed on grading reports. In most diamonds it has no visible effect in daylight; in a few, strong fluorescence can make the stone look slightly hazy, so it is worth seeing a strongly fluorescent diamond before you choose it.",
      ),
      h2("choosing-color", "Choosing a Color Grade", "Choosing a grade"),
      p("choosing-color-1", "Decide on the metal first, then the grade. In white gold or platinum, a G or H diamond usually looks white face up. In yellow or rose gold, an I or J diamond often looks white against the metal. Larger diamonds and step cuts such as emerald and Asscher show color more readily than small or brilliant-cut stones, so a grade higher can be worth it for them. Above all, compare diamonds side by side in the setting you have in mind, rather than relying on the letter alone."),
    ],
  },
  {
    _id: "resource-diamond-clarity",
    _type: "resource",
    title: "Diamond Clarity, Explained",
    slug: "diamond-clarity",
    topic: "diamonds",
    subtopic: "the-4cs",
    date: "2026-10-20",
    excerpt: "Inclusions, blemishes and the clarity scale, and what “eye-clean” means.",
    subtitle: "Inclusions, blemishes and the clarity scale, and what “eye-clean” means.",
    image: HAND,
    navLabel: "Diamond Clarity",
    next: "carat-weight",
    body: [
      h2("what-clarity", "What Clarity Measures", "What clarity measures"),
      p(
        "what-clarity-1",
        "Most diamonds contain tiny features formed as they grew: crystals, feathers, clouds and needles inside the stone, called inclusions, and small marks on the surface, called blemishes. Clarity grades describe how visible they are under 10x magnification.",
      ),
      h3("clarity-scale", "The Clarity Scale"),
      p(
        "clarity-scale-1",
        "GIA uses eleven grades in six groups: Flawless (FL), Internally Flawless (IF), Very Very Slightly Included (VVS1, VVS2), Very Slightly Included (VS1, VS2), Slightly Included (SI1, SI2) and Included (I1, I2, I3). The position of an inclusion matters too: one near the center of the table is easier to see than one near the edge.",
      ),
      h2("eye-clean", "Eye-Clean Diamonds", "Eye-clean"),
      p(
        "eye-clean-1",
        "An eye-clean diamond shows no inclusions to the unaided eye at a normal viewing distance. Many VS and some SI diamonds are eye-clean, so you rarely need the highest grades for a stone that looks clean on the hand. Step cuts like emerald and Asscher are the exception: their open facets show more, so aim higher with those shapes.",
      ),
      h3("inclusion-types", "Common Inclusions"),
      p("inclusion-types-1", "Crystals are tiny minerals trapped inside the diamond as it grew; some are colorless, others dark. Feathers are small breaks within the stone that can look white or reflective. Clouds are groups of tiny pinpoints that, when dense, can make a diamond look slightly hazy. Needles are thin, long crystals. Most are harmless, but a large feather that reaches the surface, especially near a prong or the girdle, is worth asking a jeweler about, because it can make that area more vulnerable to a hard knock."),
      h2("plot", "Reading the Plot", "Reading the plot"),
      p("plot-1", "Full grading reports usually include a plot: a map of the diamond’s main inclusions, drawn with symbols explained in a key. It helps you match the report to the stone and see where the characteristics that set its grade lie."),
    ],
  },
  {
    _id: "resource-carat-weight",
    _type: "resource",
    title: "Carat Weight and Diamond Size",
    slug: "carat-weight",
    topic: "diamonds",
    subtopic: "the-4cs",
    date: "2026-10-13",
    excerpt: "Carat is weight, not size. How weight translates to what you see, and why shape and cut change it.",
    subtitle: "Carat is weight, not size: how it translates to what you see on the hand.",
    image: FACE,
    navLabel: "Carat Weight",
    next: "diamond-shapes",
    body: [
      h2("carat-weight", "Weight, Not Size", "Weight, not size"),
      p(
        "carat-weight-1",
        "A carat is a unit of weight equal to 0.2 grams, divided into 100 points. A half-carat diamond is a 50-point diamond. Weight is the most precise of the 4Cs, measured to the hundredth of a carat, but it doesn’t tell you directly how large a diamond will look.",
      ),
      h2("carat-size", "How Big It Looks", "How big it looks"),
      p(
        "carat-size-1",
        "Face-up size depends on how the weight is distributed. A well-cut round diamond keeps its weight where it can be seen, while a deep stone hides weight below the girdle. Elongated shapes such as oval, marquise and pear spread their weight over a longer outline, so they tend to look larger than a round diamond of the same weight.",
      ),
      h3("carat-finger", "On the Hand"),
      p(
        "carat-finger-1",
        "The same diamond looks larger on a slender finger than on a wider one, and a thin band or a halo can make the center stone look bigger still. Try a few weights on your own hand before you decide.",
      ),
      h2("popular-weights", "Weights Around Whole Numbers", "Popular weights"),
      p("popular-weights-1", "Diamonds are often cut to reach popular weights, such as the half and whole carat, and a stone just below one of these looks almost the same on the hand. If you want the look of a full carat, a well-cut diamond just under it gives nearly the same face-up size; it is the cut, more than the last few points, that decides how large and bright it looks."),
      h3("setting-size", "Settings That Change the Look"),
      p("setting-size-1", "A slim band, a halo of small diamonds or a white metal setting can all make a center stone look larger, while a wide band or heavy prongs make it look smaller by comparison."),
    ],
  },
  {
    _id: "resource-diamond-shapes",
    _type: "resource",
    title: "Diamond Shapes",
    slug: "diamond-shapes",
    topic: "diamonds",
    subtopic: "shapes",
    date: "2026-10-06",
    excerpt: "From round brilliant to emerald cut: how each shape plays with light, and what to look for in it.",
    subtitle: "How each shape plays with light, and what to look for in it.",
    image: ARMS,
    navLabel: "Diamond Shapes",
    next: "lab-grown-vs-natural-diamonds",
    body: [
      h2("brilliant", "Brilliant Shapes", "Brilliant shapes"),
      p(
        "brilliant-1",
        "Brilliant cuts use many triangular and kite-shaped facets to make the most of sparkle. The round brilliant is the classic, and the shape whose cut is graded most precisely. Oval, cushion, princess, radiant, pear, marquise and heart are brilliant-style cuts too, each with its own outline.",
      ),
      h3("ratio", "Length-to-Width Ratio"),
      p(
        "ratio-1",
        "Elongated shapes are described by their length-to-width ratio. A higher ratio makes an oval or pear look longer and slimmer; a lower one makes it rounder. There is no right ratio, only the outline you prefer. In elongated brilliants, look out for a bow-tie: a dark band across the center that some stones show more than others.",
      ),
      h2("step", "Step Cuts", "Step cuts"),
      p(
        "step-1",
        "Emerald and Asscher cuts have long, parallel facets arranged like steps. Rather than many small flashes, they show broad flashes of light and a calm, hall-of-mirrors look. Their open facets reveal more of a diamond’s clarity and color, so a higher clarity and color grade is often worth it for a step cut.",
      ),
      h2("choosing-shape", "Choosing a Shape", "Choosing a shape"),
      p("choosing-shape-1", "Start with the shape you are drawn to, then think about how it suits your hand and the setting. Elongated shapes, such as oval, pear and marquise, can make fingers look longer and tend to look larger for their weight. Round and cushion shapes are classic and versatile. Shapes with points, such as pear, marquise, princess and heart, are best protected by a prong or a V-shaped tip over each point, since a point can chip with a hard knock. If you will wear a band beside your ring, try the two together, as some outlines sit more neatly beside a band than others."),
    ],
  },
  {
    _id: "resource-lab-grown-vs-natural",
    _type: "resource",
    title: "Lab-Grown and Natural Diamonds Compared",
    slug: "lab-grown-vs-natural-diamonds",
    topic: "diamonds",
    subtopic: "lab-grown-and-natural",
    date: "2026-09-29",
    excerpt: "Both are real diamonds. How they differ in origin, how they are graded, and how to choose between them.",
    subtitle: "Both are real diamonds: how they differ in origin, and how they are graded.",
    image: HAND,
    navLabel: "Lab-Grown & Natural",
    next: "ring-size-guide",
    body: [
      h2("same", "What They Share", "What they share"),
      p(
        "same-1",
        "Lab-grown diamonds are diamonds. They have the same chemical composition, crystal structure, hardness and optical properties as diamonds formed in the earth, and they look the same to the eye. Telling them apart takes specialized laboratory instruments.",
      ),
      h2("different", "How They Differ", "How they differ"),
      p(
        "different-1",
        "The difference is origin. Natural diamonds formed deep in the earth over a very long time; lab-grown diamonds are grown in a laboratory by high pressure, high temperature (HPHT) or chemical vapor deposition (CVD) processes that recreate those conditions. Grading reports for both state the origin, and some laboratories describe a lab-grown diamond’s quality on a different scale from a natural one’s, so check which scale a report uses.",
      ),
      { _type: "figure", _key: "lab-figure", image: { desktop: "edu-arms-43", alt: "Crossed arms, one hand wearing a pear-shaped diamond ring" }, caption: "Lab-grown or natural, cut, color, clarity and carat weight decide how a diamond looks." },
      h3("choose", "Choosing Between Them"),
      p(
        "choose-1",
        "Decide what matters most to you: a stone that formed naturally, or the size and quality you want. Compare both at a similar size and quality, and choose the one you love.",
      ),
      h3("telling-apart", "How Origin Is Confirmed"),
      p("telling-apart-1", "You can’t tell a lab-grown diamond from a natural one by looking. Grading laboratories identify the origin with specialized instruments and state it on the report, and many diamonds carry a small laser inscription on the girdle with the report number. Ask for the report, check that its number matches the inscription, and keep it with your other records."),
      h2("care", "Caring for Both", "Care"),
      p("care-1", "Lab-grown and natural diamonds are equally hard and are cleaned and cared for the same way: warm water, a drop of mild soap and a soft brush, with a jeweler’s check of the setting from time to time."),
    ],
  },
  {
    _id: "resource-ring-size",
    _type: "resource",
    title: "Finding the Right Ring Size at Home",
    slug: "ring-size-guide",
    topic: "engagement-rings",
    subtopic: "sizing",
    date: "2026-09-22",
    excerpt: "Simple ways to measure a ring size at home, and the details that make a ring fit comfortably all day.",
    subtitle: "Simple ways to measure at home, and the details that make a ring fit well.",
    image: FACE,
    navLabel: "Ring Size Guide",
    next: "engagement-ring-settings",
    body: [
      h2("measure", "Measure at Home", "Measure at home"),
      p(
        "measure-1",
        "The most reliable way is to measure a ring that already fits the same finger: measure its inside diameter in millimeters and compare it with a ring size chart. Without a ring, wrap a strip of paper around the base of the finger, mark where it overlaps, and measure the length against a chart. Thread and string stretch, so paper gives a truer reading.",
      ),
      h3("when", "When to Measure"),
      p(
        "when-1",
        "Fingers are slightly larger at the end of the day and in warm weather, and smaller when cold. Measure at a comfortable room temperature, ideally a couple of times on different days.",
      ),
      h2("fit", "A Comfortable Fit", "A comfortable fit"),
      p(
        "fit-1",
        "A ring should slide over the knuckle with a little resistance and sit snugly without pinching. If your knuckle is much wider than the base of your finger, choose the size that passes the knuckle. Wide bands fit more snugly than narrow ones, so you may want a quarter or half size larger for a wide band.",
      ),
      h3("surprise", "Sizing a Surprise Ring"),
      p("surprise-1", "If the ring is a surprise, borrow a ring the wearer already wears on that finger, and measure it or trace its inside edge on paper. If that isn’t possible, a slightly larger size is the safer choice, since most rings are easier to make smaller than larger."),
      h2("resizing", "Resizing Later", "Resizing"),
      p("resizing-1", "Fingers change over time and with the seasons. Most plain and solitaire rings can be resized by a jeweler. Rings set with stones all the way around, tension settings and some patterned or engraved bands are difficult or impossible to resize, so it is worth getting the size right for those from the start."),
    ],
  },
  {
    _id: "resource-settings",
    _type: "resource",
    title: "Engagement Ring Settings",
    slug: "engagement-ring-settings",
    topic: "engagement-rings",
    subtopic: "settings",
    date: "2026-09-15",
    excerpt: "Solitaire, halo, pavé, bezel or side stones: how each setting frames the center stone and wears day to day.",
    subtitle: "How each setting frames the center stone, and how it wears day to day.",
    image: ARMS,
    navLabel: "Ring Settings",
    next: "choosing-a-metal",
    body: [
      h2("holding", "How Stones Are Held", "How stones are held"),
      p(
        "holding-1",
        "Prongs are small metal claws that grip the stone, letting in the most light; four prongs show more of the diamond, six hold it more securely. A bezel surrounds the stone with a thin rim of metal, which protects its edge and suits an active life.",
      ),
      h2("styles", "Setting Styles", "Setting styles"),
      p(
        "styles-1",
        "A solitaire sets one stone on a plain band and puts all the attention on it. A halo circles the center stone with smaller diamonds, adding sparkle and making it look larger. Pavé lines the band with small diamonds. Side-stone and three-stone settings flank the center stone with accent stones.",
      ),
      h3("everyday", "Living With Your Setting"),
      p(
        "everyday-1",
        "High settings show off the stone but can catch on clothing; lower settings and bezels sit closer to the hand. Pavé and halo settings have many small stones, so have them checked by a jeweler from time to time. Think about how you use your hands before you decide.",
      ),
      h3("with-a-band", "Planning for a Wedding Band"),
      p("with-a-band-1", "If you plan to wear a wedding band beside your engagement ring, check how the two will sit together. A low setting or a halo that overhangs the shank may need a curved or notched band to sit flush. Try the two rings together before you choose."),
      h3("prong-styles", "Prong Styles"),
      p("prong-styles-1", "Prongs can be rounded, pointed like claws, or flat. Rounded prongs are smooth and comfortable; claw prongs are tapered and look delicate; V-shaped prongs protect the points of pear, marquise and princess shapes; double prongs add security and a slightly different look."),
    ],
  },
  {
    _id: "resource-metal",
    _type: "resource",
    title: "Choosing a Metal for Everyday Wear",
    slug: "choosing-a-metal",
    topic: "engagement-rings",
    subtopic: "metals",
    date: "2026-09-08",
    excerpt: "Yellow, white and rose gold, and platinum: how each looks, wears and is cared for over the years.",
    subtitle: "Yellow, white and rose gold, and platinum: how each looks and wears.",
    image: HAND,
    navLabel: "Choosing a Metal",
    next: "wedding-band-guide",
    body: [
      h2("gold", "Gold", "Gold"),
      p(
        "gold-1",
        "Pure gold is too soft for everyday jewelry, so it is alloyed with other metals. The karat says how much gold the alloy holds, and 18K holds more than 14K. 14K is a little harder and more resistant to scratches, while 18K has a richer color. Yellow gold keeps its color naturally, rose gold takes its warm tone from copper, and white gold is usually plated with rhodium for a bright white finish that can be renewed over time.",
      ),
      h2("platinum", "Platinum", "Platinum"),
      p(
        "platinum-1",
        "Platinum is naturally white, dense and durable. Rather than wearing away, it tends to develop a soft satin patina with wear, which can be polished back to a shine. It feels heavier on the hand than gold.",
      ),
      h3("matching", "Matching Your Metals"),
      p(
        "matching-1",
        "Choose the metal for your engagement ring and wedding band together, and think about the jewelry you already wear every day. Mixing metals is a style choice too: a yellow gold band beside a platinum ring can look deliberate and modern.",
      ),
      h3("sensitive-skin", "Sensitive Skin"),
      p("sensitive-skin-1", "Some people react to nickel, which is used in some white gold alloys. If you have sensitive skin, ask for a nickel-free alloy, or ask about platinum, which is often recommended for sensitive skin. The rhodium plating on white gold also keeps the alloy from touching the skin until it wears thin."),
      h2("metal-care", "Caring for Each Metal", "Care"),
      p("metal-care-1", "Gold of every color can be polished by a jeweler to remove fine scratches. White gold may need replating with rhodium from time to time to keep its bright white finish. Platinum’s patina can be polished away or kept, as you prefer."),
    ],
  },
  {
    _id: "resource-wedding-bands",
    _type: "resource",
    title: "Wedding Band Guide",
    slug: "wedding-band-guide",
    topic: "wedding-bands",
    subtopic: "buying-guides",
    date: "2026-09-01",
    excerpt: "Widths, profiles and finishes, and how to choose a band that sits well beside your engagement ring.",
    subtitle: "Widths, profiles and finishes, and choosing a band to sit beside your ring.",
    image: FACE,
    navLabel: "Wedding Band Guide",
    next: "ring-care",
    body: [
      h2("style", "Width and Profile", "Width and profile"),
      p(
        "style-1",
        "Wedding bands range from slim, delicate widths to bold, wide ones. A flat profile has straight edges; a domed or court profile is rounded on top, and a comfort-fit band is also rounded inside so it slides on easily and feels softer on the finger. A comfort-fit band can feel a little looser than a standard one of the same size, so try on the profile you plan to wear.",
      ),
      h2("pairing", "Pairing With Your Engagement Ring", "Pairing"),
      p(
        "pairing-1",
        "If your engagement ring has a low setting, a straight band can sit flush beside it. A halo or a setting that sits low over the band may need a curved or notched band to sit close. Try the two rings together, and choose the same metal for a matched look or a contrast for a modern stack.",
      ),
      h3("finish", "Finishes"),
      p(
        "finish-1",
        "Polished bands shine; brushed and hammered finishes soften the look and hide fine scratches. Most finishes can be renewed by a jeweler.",
      ),
      h2("band-metal", "Choosing the Metal", "Metal"),
      p("band-metal-1", "Matching your band’s metal to your engagement ring keeps the pair looking like a set. Rings worn side by side rub where they touch, whatever the metal, so have both checked from time to time."),
      h3("diamond-bands", "Plain or Diamond Bands"),
      p("diamond-bands-1", "A plain band is simple to wear and care for, and easy to resize, and it suits almost any engagement ring. A pavé or channel-set band adds sparkle, but bands set with diamonds all the way around are hard to resize, so a band with diamonds across the top only can be a practical choice."),
    ],
  },
  {
    _id: "resource-ring-care",
    _type: "resource",
    title: "Caring for Your Rings",
    slug: "ring-care",
    topic: "wedding-bands",
    subtopic: "care",
    date: "2026-08-25",
    excerpt: "Simple habits that keep rings bright and secure, from cleaning at home to knowing when to see a jeweler.",
    subtitle: "Simple habits that keep rings bright and secure.",
    image: ARMS,
    navLabel: "Ring Care",
    next: "jewelry-care",
    body: [
      h2("clean", "Cleaning at Home", "Cleaning"),
      p(
        "clean-1",
        "Soak rings for a few minutes in warm water with a little mild dish soap, then brush gently with a soft toothbrush, paying attention to the back of the stone where lotion and dust collect. Rinse in a bowl rather than over an open drain, and dry with a lint-free cloth.",
      ),
      h2("protect", "Everyday Protection", "Protection"),
      p(
        "protect-1",
        "Take rings off for heavy work, the gym, gardening and cleaning with household chemicals, and before swimming, since chlorine can harm gold alloys over time. Put them on after lotions and perfume. Store each ring separately so harder stones don’t scratch softer metals.",
      ),
      h3("check", "Regular Check-Ups"),
      p(
        "check-1",
        "Prongs wear and can bend with daily use. Have a jeweler check settings periodically, and sooner if a stone ever feels loose or a prong catches on fabric.",
      ),
      h2("storing", "Storing Rings", "Storing"),
      p("storing-1", "When you take rings off, put them somewhere safe and consistent, such as a ring dish away from sinks and drains, or a lined box with separate slots. Diamonds can scratch other diamonds and softer gemstones, so keep rings from touching one another in a drawer or bag."),
      h3("how-often", "How Often to Clean"),
      p("how-often-1", "A quick clean every week or two keeps a diamond bright, since lotion and everyday oils collect behind the stone and dull its sparkle. A professional clean and check once or twice a year is a good habit for rings worn every day. Ultrasonic cleaners suit many diamond rings, but not every gemstone or setting, so ask a jeweler before using one. Steam cleaners are best left to a jeweler."),
    ],
  },
  {
    _id: "resource-gemstone-guide",
    _type: "resource",
    title: "Gemstone Guide",
    slug: "gemstone-guide",
    topic: "gemstones",
    subtopic: "buying-guides",
    date: "2026-08-18",
    excerpt: "Color, clarity, hardness and treatments: what to look for when choosing a colored gemstone.",
    subtitle: "Color, clarity, hardness and treatments, and what to look for in each.",
    image: HAND,
    navLabel: "Gemstone Guide",
    next: "sapphires",
    body: [
      h2("color", "Color Comes First", "Color"),
      p(
        "color-1",
        "With colored gemstones, color matters most. Gemologists describe it by hue, the color itself; tone, how light or dark it is; and saturation, how intense it is. Evenly distributed, vivid color is generally most prized, but the best color is the one you love.",
      ),
      h2("hardness", "Hardness and Everyday Wear", "Hardness"),
      p(
        "hardness-1",
        "The Mohs scale ranks resistance to scratching from 1 to 10. Diamond is 10, sapphire and ruby are 9, and emerald is 7.5 to 8. For a ring worn every day, harder stones resist scratches better; softer stones suit pendants and earrings, or rings worn with care.",
      ),
      h3("treatments", "Treatments"),
      p(
        "treatments-1",
        "Many gemstones are treated to improve their color or clarity. Heating sapphires and oiling emeralds are common and widely accepted; any treatment should be disclosed, and it can affect how a stone should be cleaned.",
      ),
      h3("gem-clarity", "Clarity in Colored Gemstones"),
      p("gem-clarity-1", "Colored gemstones are judged by eye rather than on a fixed clarity scale. Some, such as aquamarine and topaz, are usually very clean; others, such as emerald, almost always show inclusions, and these are accepted as part of the stone. Look for a gemstone without inclusions that reach its surface or make it look cloudy."),
      h2("gem-cut", "Cut and Shape", "Cut"),
      p("gem-cut-1", "Colored gemstones are often cut to keep as much weight and color as possible, so their proportions vary more than a diamond’s. A well-cut stone shows even color, without a dull, see-through patch in the center, called a window. Ovals and cushions are popular shapes for colored gemstones. Choose the shape you like, then judge the color and life of the stone itself."),
    ],
  },
  {
    _id: "resource-sapphires",
    _type: "resource",
    title: "Sapphires",
    slug: "sapphires",
    topic: "gemstones",
    subtopic: "gemstone-types",
    date: "2026-08-11",
    excerpt: "Blue and far beyond: the colors, durability and care of sapphires for everyday rings.",
    subtitle: "Blue and far beyond: color, durability and care.",
    image: FACE,
    navLabel: "Sapphires",
    next: "emeralds",
    body: [
      h2("corundum", "A Family of Colors", "Colors"),
      p(
        "corundum-1",
        "Sapphire is the mineral corundum. Blue is its best-known color, but sapphires also come in pink, yellow, orange, purple, green and white; red corundum is called ruby. Sapphires in colors other than blue are often called fancy sapphires.",
      ),
      h2("wear", "Made for Everyday Wear", "Everyday wear"),
      p(
        "wear-1",
        "At 9 on the Mohs scale, sapphire is one of the hardest gemstones, which makes it a durable choice for engagement rings. Many sapphires are heated to improve their color and clarity, a common and stable treatment.",
      ),
      h3("care", "Care"),
      p("care-1", "Clean sapphires with warm, soapy water and a soft brush. They are durable, but a hard knock can still chip any gemstone, so take rings off for heavy work."),
      h2("choosing-sapphire", "Choosing a Sapphire", "Choosing"),
      p("choosing-sapphire-1", "Color comes first: look for a sapphire whose color is even and stays rich in both daylight and indoor light. Some sapphires show different shades from different angles, and a good cut places the best color face up. Clarity is judged by eye, and fine, silky inclusions are common; they can even soften the color pleasantly. Ask whether the stone has been treated, and how, since that can affect its care."),
      h3("setting-sapphire", "Setting a Sapphire"),
      p("setting-sapphire-1", "Because sapphire is so hard, it can be set in the same styles as a diamond: a solitaire, a halo of diamonds around it, or three stones in a row. White gold and platinum suit blue sapphires, while yellow and rose gold flatter pink and yellow ones. A sapphire’s color can look different in each metal, so try a few before you decide."),
    ],
  },
  {
    _id: "resource-emeralds",
    _type: "resource",
    title: "Emeralds",
    slug: "emeralds",
    topic: "gemstones",
    subtopic: "gemstone-types",
    date: "2026-08-04",
    excerpt: "The green variety of beryl: why inclusions are expected, how emeralds are treated, and how to care for them.",
    subtitle: "Why inclusions are expected, and how to care for an emerald.",
    image: ARMS,
    navLabel: "Emeralds",
    next: "moissanite",
    body: [
      h2("beryl", "The Green Beryl", "Green beryl"),
      p(
        "beryl-1",
        "Emerald is the green variety of the mineral beryl, colored by traces of chromium and vanadium. Its color is valued above all: a rich, even green with good transparency.",
      ),
      h2("inclusions", "Inclusions Are Part of the Stone", "Inclusions"),
      p(
        "inclusions-1",
        "Almost all emeralds contain inclusions, sometimes called a jardin, French for garden. They are expected, and judged more gently than in diamonds. Many emeralds are treated with oil or resin to make fine fissures less visible, a common and widely accepted practice.",
      ),
      h3("care", "Care"),
      p(
        "care-1",
        "Emerald is 7.5 to 8 on the Mohs scale, but inclusions can make it more vulnerable to knocks. Clean it with lukewarm water and a soft cloth, and avoid ultrasonic and steam cleaners, which can damage the stone or its treatment.",
      ),
      h2("choosing-emerald", "Choosing an Emerald", "Choosing"),
      p("choosing-emerald-1", "Color matters most: the most sought-after emeralds are a vivid, slightly bluish green that is neither too light nor too dark. Look at the stone in daylight and indoor light, and favor even color over perfect clarity. The emerald cut, a rectangle with cut corners, suits this stone well: the cut corners help protect it, and the long step facets show its color."),
      h3("setting-emerald", "Setting an Emerald"),
      p("setting-emerald-1", "For a ring worn every day, a bezel or prongs that protect the corners guard the stone against knocks. Emeralds also suit earrings and pendants, where they are less exposed. Take emerald rings off for housework and exercise, and ask a jeweler before any cleaning beyond a soft cloth. A jeweler can also refresh an emerald’s oil treatment if its fissures become more visible over time."),
    ],
  },
  {
    _id: "resource-moissanite",
    _type: "resource",
    title: "Moissanite",
    slug: "moissanite",
    topic: "gemstones",
    subtopic: "gemstone-types",
    date: "2026-07-28",
    excerpt: "A brilliant lab-created gemstone: how moissanite compares with diamond in look, hardness and fire.",
    subtitle: "A brilliant lab-created gemstone, and how it compares with diamond.",
    image: HAND,
    navLabel: "Moissanite",
    next: "pearl-guide",
    body: [
      h2("what", "What Moissanite Is", "What it is"),
      p(
        "what-1",
        "Moissanite is silicon carbide, a mineral that is extremely rare in nature. The moissanite used in jewelry is created in a laboratory. It is a gemstone in its own right, not a diamond and not an imitation of one.",
      ),
      h2("compare", "Compared With Diamond", "Compared with diamond"),
      p(
        "compare-1",
        "Moissanite is about 9.25 on the Mohs scale, very hard and well suited to everyday wear. It has more dispersion than diamond, so it shows more colorful flashes of fire, especially in sunlight. Some people love that rainbow sparkle; others prefer the white brilliance of a diamond.",
      ),
      h3("care", "Care"),
      p("care-1", "Clean moissanite as you would a diamond: warm, soapy water and a soft brush, then rinse and dry. It is hard enough for a ring worn every day, but have the setting checked from time to time, as you would for any ring."),
      h3("moissanite-quality", "Color and Clarity"),
      p("moissanite-quality-1", "Most moissanite for jewelry is made colorless or near colorless and is usually very clean, with few visible inclusions. Descriptions of its color vary from seller to seller, so compare stones in daylight before you choose."),
      h2("moissanite-size", "Size and Weight", "Size"),
      p("moissanite-size-1", "Moissanite is lighter than diamond, so a moissanite the same size as a diamond weighs less. It is usually described by its size in millimeters rather than by carat weight; compare stones by their diameter."),
      h3("telling-apart", "Telling Them Apart"),
      p("telling-apart-1", "Moissanite is doubly refractive: looking into it at an angle, you may see the facet edges doubled. Simple diamond testers that measure heat can mistake it for diamond, so jewelers use testers that also measure electrical conductivity. The seller’s paperwork should say clearly that the stone is moissanite."),
    ],
  },
  {
    _id: "resource-pearl-guide",
    _type: "resource",
    title: "Pearl Guide",
    slug: "pearl-guide",
    topic: "fine-jewelry",
    subtopic: "buying-guides",
    date: "2026-07-21",
    excerpt: "Luster, surface, shape and size: how pearls are judged, the main types, and how to care for them.",
    subtitle: "How pearls are judged, the main types, and how to care for them.",
    image: FACE,
    navLabel: "Pearl Guide",
    next: "jewelry-care",
    body: [
      h2("value", "What to Look For", "What to look for"),
      p(
        "value-1",
        "Luster, the sharp glow reflected from a pearl’s surface, is the first thing to look at. Look too at the surface, for spots and blemishes; the shape, from perfectly round to baroque; the size; and, in a strand, how well the pearls match.",
      ),
      h2("types", "The Main Types", "Types"),
      p(
        "types-1",
        "Akoya pearls are known for their bright luster and round shapes. Freshwater pearls come in many shapes and soft colors. South Sea pearls are larger, in white and golden tones, and Tahitian pearls are naturally dark, from gray to peacock green.",
      ),
      h3("care", "Care"),
      p(
        "care-1",
        "Pearls are soft, so put them on last, after perfume and makeup, and take them off first. Wipe them with a soft cloth after wearing, store them flat and apart from harder jewelry, and have strands restrung when the silk loosens.",
      ),
      h3("cultured", "Natural and Cultured Pearls"),
      p("cultured-1", "Most pearls sold today are cultured: a pearl farmer places a small bead or piece of tissue inside a mollusk, which coats it in layers of nacre. Natural pearls, formed without help, are very rare. Both are real pearls. Imitation pearls are made of glass or plastic with a pearly coating, and feel smooth rather than slightly gritty when rubbed gently against a tooth."),
      h2("wearing-pearls", "Wearing Pearls", "Wearing"),
      p("wearing-pearls-1", "Pearls look their best when worn often. A single strand that sits just below the collarbone is a versatile choice, and pearl studs are easy to wear every day. Store pearls in a soft pouch rather than an airtight bag, which can dry them out, and keep them away from harder jewelry that could scratch them."),
    ],
  },
  {
    _id: "resource-jewelry-care",
    _type: "resource",
    title: "Jewelry Care",
    slug: "jewelry-care",
    topic: "fine-jewelry",
    subtopic: "care",
    date: "2026-07-14",
    excerpt: "Cleaning, storing and traveling with fine jewelry, so every piece keeps its shine for years.",
    subtitle: "Cleaning, storing and traveling with fine jewelry.",
    image: ARMS,
    navLabel: "Jewelry Care",
    next: "the-4cs-of-diamonds",
    body: [
      h2("clean", "Gentle Cleaning", "Cleaning"),
      p(
        "clean-1",
        "Most gold and diamond jewelry can be cleaned in warm water with a drop of mild soap and a soft brush. Softer and treated gemstones, pearls and emeralds among them, need only a damp cloth. Avoid harsh chemicals, and check before using an ultrasonic cleaner.",
      ),
      h2("store", "Storing Your Pieces", "Storing"),
      p(
        "store-1",
        "Keep pieces in separate pouches or lined compartments so they don’t scratch or tangle. Fasten chains before you put them away, and store pearls flat.",
      ),
      h3("travel", "Traveling"),
      p("travel-1", "Pack jewelry in a small padded case in your carry-on, with chains fastened and rings in their own slots, and keep the pieces you wear every day to a few favorites."),
      h2("avoid", "What to Avoid", "What to avoid"),
      p("avoid-1", "Chlorine, bleach and many household cleaners can discolor or weaken gold alloys and damage softer gemstones, so take jewelry off before swimming or cleaning. Perfume, hairspray and lotion leave a film that dulls stones: put them on before your jewelry, not after."),
      h3("checks", "Regular Checks"),
      p("checks-1", "Every few months, look closely at prongs, clasps and earring backs. A prong that catches on fabric, a clasp that no longer closes firmly or a stone that moves when you tap the piece gently are all signs that a jeweler should take a look."),
      h3("plated", "Plated and Vermeil Pieces"),
      p("plated-1", "Gold-plated jewelry has a thin layer of gold over another metal; vermeil is gold over sterling silver. Wipe it with a soft, dry cloth rather than washing it, and keep it away from water and creams, so the layer lasts longer. When the gold wears thin, a jeweler can often replate the piece."),
    ],
  },
];

export const resourceHref = (resource: Pick<EducationResource, "slug">) => `/education/${resource.slug}/`;
export const resourceBySlug = (slug: string) => educationResources.find((resource) => resource.slug === slug) ?? null;
export const topicById = (id: string) => educationTopics.find((topic) => topic.id === id) ?? null;

/** The Education Center page. */
export const educationCenterPage = {
  _type: "educationCenterPage" as const,
  seo: { title: "Education Center", description: "Guides to help you choose with confidence, from diamond grading to ring sizing." },
  /** Desktop only: the mobile frame has no hero photo. */
  hero: { image: { desktop: "edu-hero-d", alt: "Two hands held together, wearing gold rings" } as ImageRef },
  title: "Education Center",
  // One line under the title, as drawn (548px of body-lg).
  body: "Guides to diamonds, rings and caring for fine jewelry.",
  topicsLabel: "Popular Topics",
  allTopics: "All Topics",
  pageSize: 12,
  featured: {
    heading: "Featured Education",
    body: "Start with the essentials: diamonds, ring sizes and the metals to wear them in.",
    lead: "the-4cs-of-diamonds",
    leadImage: { desktop: "story-arms-wide", alt: "Crossed arms, one hand wearing a pear-shaped diamond ring" } as ImageRef,
    /** The four small cards, with Figma's square photos in order. */
    items: [
      { slug: "diamond-shapes", image: { desktop: "story-face-sq", alt: "" } as ImageRef },
      { slug: "lab-grown-vs-natural-diamonds", image: { desktop: "story-hand-sq", alt: "" } as ImageRef },
      { slug: "ring-size-guide", image: { desktop: "edu-thumb-sq", alt: "" } as ImageRef },
      { slug: "choosing-a-metal", image: { desktop: "story-arms-sq", alt: "" } as ImageRef },
    ],
  },
  /** Resource Detail: the back button, the topic list's mobile label, "Next Resource" and "Read Now". */
  detail: {
    back: "All Resources",
    next: "Next Resource",
    readNow: "Read Now",
    hero: { desktop: "edu-hero-d", mobile: "edu-hero-m", alt: "" } as ImageRef,
    nextImage: { desktop: "edu-thumb-sq", alt: "" } as ImageRef,
  },
};

/**
 * "Diamond Engagement Rings / Shop our Best Sellers" under every resource and post (3565:101773, 3565:102017): the
 * builder's engagement ring settings, read from Shopify at build time.
 */
export const contentBestSellers: BestSellers = {
  _type: "bestSellers",
  _key: "best-sellers",
  overline: "Diamond Engagement Rings",
  heading: [span("Shop "), em("our"), span(" Best Sellers")],
  rows: [
    {
      _key: "engagement-rings",
      handles: [
        "classic-solitaire-engagement-ring-setting",
        "round-halo-engagement-ring-setting",
        "pave-engagement-ring-setting",
        "vine-engagement-ring-setting",
        "marquise-side-stone-engagement-ring-setting",
        "petite-solitaire-engagement-ring-setting",
      ],
    },
  ],
};
