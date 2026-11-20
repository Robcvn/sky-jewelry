/*
 * Account pages (Figma "Account - Profile" 3565:97935 / 3587:124348, "Account - Orders" 3565:97997 / 3587:124427,
 * "Account - Order Details" 3565:98015, 1280px 4430:61649, mobile 3587:124461) and "Modal / Add Address"
 * (3565:97033, filled 3565:97059, errors 4430:48685; mobile 3587:123484, 3587:123457, errors 4430:61388).
 *
 * Mock data, shaped like Sanity documents: one signed-in customer and three orders. Nothing here comes from or goes
 * to Shopify. Figma draws no sign-in, so the account always shows this customer (Deviations).
 */
import type { MetalId } from "./metals";

export type AccountAddress = {
  _key: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  /** Two-letter state code, shown on the cards ("NY"); the dropdown shows the state's name. */
  state: string;
  zip: string;
  country: string;
  phone?: string;
};

export type Customer = {
  _id: string;
  _type: "customer";
  firstName: string;
  lastName: string;
  email: string;
  addresses: AccountAddress[];
  /** The address with the "Default" badge. */
  defaultAddress: string;
};

/** One piece in an order. Name, photo and link come from the catalogue by handle; the price is what was paid. */
export type OrderLine = {
  _key: string;
  handle: string;
  metal: MetalId;
  /** Carat weight of the variant ordered, or null for pieces without one. */
  carat: number | null;
  quantity: number;
  price: number;
};

/** Figma draws one status, Delivered, with all four steps reached. */
export type OrderStatus = "delivered";

export type Order = {
  _id: string;
  _type: "order";
  /** Order number, also the URL segment: /account/orders/<number>/. */
  number: string;
  placed: string;
  delivered: string;
  status: OrderStatus;
  lines: OrderLine[];
  shipping: number;
  discount: number;
  taxes: number;
  shipmentMethod: string;
  /** Only the masked value Figma draws. No card details exist anywhere. */
  payment: string;
  shippingAddress: string;
  billingAddress: string;
};

/** Figma's sample customer. The email is example.com, not Figma's real-looking Gmail address (Corrected design oversights). */
export const customer: Customer = {
  _id: "customer-mock",
  _type: "customer",
  firstName: "Omar",
  lastName: "Little",
  email: "omar.little@example.com",
  addresses: [
    { _key: "main-st", address1: "1234 Main St", address2: "#321", city: "New York", state: "NY", zip: "11361", country: "United States" },
    { _key: "superior-st", address1: "321 W Superior St", city: "New York", state: "NY", zip: "11361", country: "United States" },
  ],
  defaultAddress: "main-st",
};

const order = (o: Omit<Order, "_type" | "_id" | "status" | "shipmentMethod" | "payment" | "shippingAddress" | "billingAddress">): Order => ({
  _id: `order-${o.number}`,
  _type: "order",
  status: "delivered",
  shipmentMethod: "FedEx 2-Day",
  payment: "••••4132",
  shippingAddress: "main-st",
  billingAddress: "main-st",
  ...o,
});

/** Newest first. The first uses Figma's sample number and dates. Three, two and two pieces, as the mobile frame draws. */
export const orders: Order[] = [
  order({
    number: "90179830",
    placed: "2025-05-12",
    delivered: "2025-05-17",
    lines: [
      { _key: "a", handle: "round-halo-lab-grown-ring", metal: "14k-rose-gold", carat: 1, quantity: 1, price: 1390 },
      { _key: "b", handle: "four-prong-solitaire-lab-grown-stud-earrings", metal: "14k-yellow-gold", carat: 1, quantity: 1, price: 1250 },
      { _key: "c", handle: "beaded-bezel-lab-grown-tennis-bracelet", metal: "14k-yellow-gold", carat: 1.5, quantity: 1, price: 2450 },
    ],
    shipping: 20,
    discount: 100,
    taxes: 451.74,
  }),
  order({
    number: "90154212",
    placed: "2025-03-02",
    delivered: "2025-03-08",
    lines: [
      { _key: "a", handle: "oval-solitaire-lab-grown-ring", metal: "14k-yellow-gold", carat: 1.5, quantity: 1, price: 1690 },
      { _key: "b", handle: "classic-2mm-band", metal: "14k-yellow-gold", carat: null, quantity: 1, price: 590 },
    ],
    shipping: 20,
    discount: 0,
    taxes: 202.35,
  }),
  order({
    number: "90127745",
    placed: "2024-12-04",
    delivered: "2024-12-10",
    lines: [
      { _key: "a", handle: "four-prong-solitaire-lab-grown-pendant", metal: "14k-yellow-gold", carat: 0.8, quantity: 1, price: 1040 },
      { _key: "b", handle: "twig-diamond-stackable-band", metal: "14k-yellow-gold", carat: 0.1, quantity: 1, price: 690 },
    ],
    shipping: 20,
    discount: 0,
    taxes: 153.54,
  }),
];

export const orderSubtotal = (o: Order) => o.lines.reduce((sum, line) => sum + line.price * line.quantity, 0);
export const orderTotal = (o: Order) => Math.round((orderSubtotal(o) + o.shipping - o.discount + o.taxes) * 100) / 100;
export const orderHref = (o: Pick<Order, "number">) => `/account/orders/${o.number}/`;

export type AccountNavId = "profile" | "orders" | "logout";

export const accountContent = {
  greeting: (firstName: string) => `Welcome, ${firstName}`,
  /** The side menu (desktop) and the line tabs (mobile). Log Out has no drawn destination: shown, inert (Held for review). */
  nav: [
    { _key: "profile", label: "Profile", href: "/account/" },
    { _key: "orders", label: "Orders", href: "/account/orders/" },
    { _key: "logout", label: "Log Out", href: null },
  ] as Array<{ _key: AccountNavId; label: string; href: string | null }>,
  navLabel: "Account",
  profile: {
    title: "Profile",
    details: "Account Details",
    edit: "Edit",
    name: "Name",
    email: "Email Address",
    addressBook: "Address Book",
    addAddress: "Add an Address",
    defaultBadge: "Default",
    editAddress: "Edit",
    removeAddress: "Remove",
    /** Figma's body is Latin filler; replaced with a neutral line that makes no claims beyond the drawn heading and button. */
    repairs: { heading: "Sky Repairs", body: "Choose whether your account takes part in Sky Repairs.", cta: "Opt Out" },
  },
  orders: {
    title: "Orders",
    heading: "Previous Orders",
    orderNumber: (number: string) => `Order # ${number}`,
    placed: (date: string) => `Placed ${date}`,
    status: { delivered: "Delivered" } as Record<OrderStatus, string>,
    steps: ["Preparation", "Shipping", "Out for Delivery", "Delivered"],
    viewDetails: "View Details",
    total: "Total",
  },
  detail: {
    back: { label: "Back to Orders", href: "/account/orders/" },
    pieces: "Pieces in this order",
    downloadCertificate: "Download Certificate",
    orderPrice: "Order Price",
    subtotal: "Subtotal",
    shipping: "Shipping",
    discount: "Discount",
    taxes: "Taxes",
    total: "Total",
    shipmentMethod: "Shipment Method",
    payment: "Method of Payment",
    shippingAddress: "Shipping Address",
    billingAddress: "Billing Address",
    /** Figma's bodies are Latin filler; the replacements only restate the drawn titles. */
    repairs: {
      heading: "Sky Repair Requests",
      body: "Request a service for a piece from this order.",
      cta: "Request",
      blocks: [
        { _key: "lifetime", icon: "repair", title: "Lifetime Warranty", body: "Request a repair under your lifetime warranty." },
        { _key: "shine", icon: "shine", title: "Annual Shine", body: "Request your annual shine." },
        { _key: "diamond", icon: "warranty", title: "Diamond Warranty", body: "Request service under your diamond warranty." },
      ] as const,
    },
  },
  attributes: { metal: "Metal", carat: "Carat", size: "Size", caratValue: (carat: string) => `${carat} Total Carat Weight` },
};

/** Figma "Modal / Add Address". Validation is what the Errors frames draw: City required, a valid phone number. */
export const addressModal = {
  heading: "Add Address",
  fields: {
    company: "Company",
    address1: "Address 1 *",
    address2: "Address 2",
    city: "City *",
    state: "State *",
    zip: "Zip / Postal Code *",
    country: "Country *",
    phone: "Phone Number *",
  },
  setDefault: "Set as default address",
  save: "Save",
  cancel: "Cancel",
  errors: {
    /** Figma draws "City is required"; the other starred fields reuse its wording (inferred, Deviations). */
    required: (field: string) => `${field} is required`,
    cityRequired: "City is required",
    /** The desktop Errors frame says "Please provide a valid email address." under the phone field; mobile has the phone wording (Corrected design oversights). */
    phoneInvalid: "Please provide a valid phone number.",
  },
  countries: [{ value: "United States", label: "United States" }],
  states: [
    ["AL", "Alabama"], ["AK", "Alaska"], ["AZ", "Arizona"], ["AR", "Arkansas"], ["CA", "California"], ["CO", "Colorado"],
    ["CT", "Connecticut"], ["DE", "Delaware"], ["DC", "District of Columbia"], ["FL", "Florida"], ["GA", "Georgia"],
    ["HI", "Hawaii"], ["ID", "Idaho"], ["IL", "Illinois"], ["IN", "Indiana"], ["IA", "Iowa"], ["KS", "Kansas"],
    ["KY", "Kentucky"], ["LA", "Louisiana"], ["ME", "Maine"], ["MD", "Maryland"], ["MA", "Massachusetts"],
    ["MI", "Michigan"], ["MN", "Minnesota"], ["MS", "Mississippi"], ["MO", "Missouri"], ["MT", "Montana"],
    ["NE", "Nebraska"], ["NV", "Nevada"], ["NH", "New Hampshire"], ["NJ", "New Jersey"], ["NM", "New Mexico"],
    ["NY", "New York"], ["NC", "North Carolina"], ["ND", "North Dakota"], ["OH", "Ohio"], ["OK", "Oklahoma"],
    ["OR", "Oregon"], ["PA", "Pennsylvania"], ["RI", "Rhode Island"], ["SC", "South Carolina"], ["SD", "South Dakota"],
    ["TN", "Tennessee"], ["TX", "Texas"], ["UT", "Utah"], ["VT", "Vermont"], ["VA", "Virginia"], ["WA", "Washington"],
    ["WV", "West Virginia"], ["WI", "Wisconsin"], ["WY", "Wyoming"],
  ].map(([value, label]) => ({ value, label })),
};

/**
 * "May 12, 2025", as every Figma frame draws it: the month's three-letter name, the day without a leading zero, a
 * comma, and the year ("Mar 2, 2025", "Dec 4, 2024"). Read as a calendar date, not shifted by time zone.
 */
export const formatOrderDate = (iso: string) =>
  new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }).format(new Date(`${iso}T00:00:00Z`));

/** Ten digits (or eleven starting with 1), ignoring spaces, dashes, dots and brackets. Figma's "312-643-12" fails. */
export const validPhone = (value: string) => {
  const digits = value.replace(/[\s().+-]/g, "");
  return /^\d+$/.test(digits) && (digits.length === 10 || (digits.length === 11 && digits.startsWith("1")));
};
