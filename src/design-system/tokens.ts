/*
 * Token data for the /styleguide page, generated with src/styles/tokens.css and
 * src/styles/typography.css from the same Figma values. Change all three together.
 */

export type TypeStyle = {
  className: string;
  figmaName: string;
  group: string;
  family: "heading" | "body";
  figmaFont: string;
  figmaStyle: string;
  weight: number;
  italic: boolean;
  size: number;
  lineHeight: string;
  letterSpacing: number;
  uppercase: boolean;
  underline: boolean;
  features: string | null;
};

export const colorGroups = [
  {
    label: "Base",
    colors: [
      {
        name: "base/white",
        token: "--color-base-white",
        utility: "base-white",
        hex: "#fcfcfa",
        onColorsPage: true
      },
      {
        name: "base/black",
        token: "--color-base-black",
        utility: "base-black",
        hex: "#141829",
        onColorsPage: true
      }
    ]
  },
  {
    label: "Primary",
    colors: [
      {
        name: "primary/leather",
        token: "--color-primary-leather",
        utility: "primary-leather",
        hex: "#432f2b",
        onColorsPage: true
      },
      {
        name: "primary/blue",
        token: "--color-primary-blue",
        utility: "primary-blue",
        hex: "#242a40",
        onColorsPage: true
      },
      {
        name: "primary/hazel",
        token: "--color-primary-hazel",
        utility: "primary-hazel",
        hex: "#746345",
        onColorsPage: true
      },
      {
        name: "primary/navy",
        token: "--color-primary-navy",
        utility: "primary-navy",
        hex: "#141829",
        onColorsPage: false
      }
    ]
  },
  {
    label: "Secondary",
    colors: [
      {
        name: "secondary/skin",
        token: "--color-secondary-skin",
        utility: "secondary-skin",
        hex: "#fdfbf7",
        onColorsPage: true
      },
      {
        name: "secondary/ivory",
        token: "--color-secondary-ivory",
        utility: "secondary-ivory",
        hex: "#f3f1e7",
        onColorsPage: true
      },
      {
        name: "secondary/peach",
        token: "--color-secondary-peach",
        utility: "secondary-peach",
        hex: "#f2e6d4",
        onColorsPage: true
      },
      {
        name: "secondary/gold",
        token: "--color-secondary-gold",
        utility: "secondary-gold",
        hex: "#baa88e",
        onColorsPage: true
      },
      {
        name: "secondary/pure-white",
        token: "--color-secondary-pure-white",
        utility: "secondary-pure-white",
        hex: "#ffffff",
        onColorsPage: false
      }
    ]
  },
  {
    label: "State",
    colors: [
      {
        name: "state/success",
        token: "--color-state-success",
        utility: "state-success",
        hex: "#537864",
        onColorsPage: true
      },
      {
        name: "state/success-light",
        token: "--color-state-success-light",
        utility: "state-success-light",
        hex: "#53786414",
        onColorsPage: false
      },
      {
        name: "state/warning",
        token: "--color-state-warning",
        utility: "state-warning",
        hex: "#725d38",
        onColorsPage: true
      },
      {
        name: "state/warning-light",
        token: "--color-state-warning-light",
        utility: "state-warning-light",
        hex: "#725d3814",
        onColorsPage: false
      },
      {
        name: "state/error",
        token: "--color-state-error",
        utility: "state-error",
        hex: "#8d3b2b",
        onColorsPage: true
      },
      {
        name: "state/error-light",
        token: "--color-state-error-light",
        utility: "state-error-light",
        hex: "#8d3b2b14",
        onColorsPage: false
      }
    ]
  },
  {
    label: "White alpha",
    colors: [
      {
        name: "white-alpha/white-alpha-0",
        token: "--color-white-alpha-0",
        utility: "white-alpha-0",
        hex: "#fcfcfa00",
        onColorsPage: true
      },
      {
        name: "white-alpha/white-alpha-2",
        token: "--color-white-alpha-2",
        utility: "white-alpha-2",
        hex: "#fcfcfa05",
        onColorsPage: true
      },
      {
        name: "white-alpha/white-alpha-5",
        token: "--color-white-alpha-5",
        utility: "white-alpha-5",
        hex: "#fcfcfa0d",
        onColorsPage: true
      },
      {
        name: "white-alpha/white-alpha-10",
        token: "--color-white-alpha-10",
        utility: "white-alpha-10",
        hex: "#fcfcfa1a",
        onColorsPage: true
      },
      {
        name: "white-alpha/white-alpha-15",
        token: "--color-white-alpha-15",
        utility: "white-alpha-15",
        hex: "#fcfcfa26",
        onColorsPage: true
      },
      {
        name: "white-alpha/white-alpha-20",
        token: "--color-white-alpha-20",
        utility: "white-alpha-20",
        hex: "#fcfcfa33",
        onColorsPage: true
      },
      {
        name: "white-alpha/white-alpha-25",
        token: "--color-white-alpha-25",
        utility: "white-alpha-25",
        hex: "#fcfcfa40",
        onColorsPage: true
      },
      {
        name: "white-alpha/white-alpha-30",
        token: "--color-white-alpha-30",
        utility: "white-alpha-30",
        hex: "#fcfcfa4d",
        onColorsPage: true
      },
      {
        name: "white-alpha/white-alpha-40",
        token: "--color-white-alpha-40",
        utility: "white-alpha-40",
        hex: "#fcfcfa66",
        onColorsPage: true
      },
      {
        name: "white-alpha/white-alpha-50",
        token: "--color-white-alpha-50",
        utility: "white-alpha-50",
        hex: "#fcfcfa80",
        onColorsPage: true
      },
      {
        name: "white-alpha/white-alpha-60",
        token: "--color-white-alpha-60",
        utility: "white-alpha-60",
        hex: "#fcfcfa99",
        onColorsPage: true
      },
      {
        name: "white-alpha/white-alpha-70",
        token: "--color-white-alpha-70",
        utility: "white-alpha-70",
        hex: "#fcfcfab2",
        onColorsPage: true
      },
      {
        name: "white-alpha/white-alpha-80",
        token: "--color-white-alpha-80",
        utility: "white-alpha-80",
        hex: "#fcfcfacc",
        onColorsPage: true
      },
      {
        name: "white-alpha/white-alpha-90",
        token: "--color-white-alpha-90",
        utility: "white-alpha-90",
        hex: "#fcfcfae5",
        onColorsPage: true
      },
      {
        name: "white-alpha/white-alpha-95",
        token: "--color-white-alpha-95",
        utility: "white-alpha-95",
        hex: "#fcfcfaf2",
        onColorsPage: true
      }
    ]
  },
  {
    label: "Black alpha",
    colors: [
      {
        name: "black-alpha/black-alpha-0",
        token: "--color-black-alpha-0",
        utility: "black-alpha-0",
        hex: "#1b141300",
        onColorsPage: true
      },
      {
        name: "black-alpha/black-alpha-2",
        token: "--color-black-alpha-2",
        utility: "black-alpha-2",
        hex: "#1b141305",
        onColorsPage: true
      },
      {
        name: "black-alpha/black-alpha-5",
        token: "--color-black-alpha-5",
        utility: "black-alpha-5",
        hex: "#1b14130d",
        onColorsPage: true
      },
      {
        name: "black-alpha/black-alpha-10",
        token: "--color-black-alpha-10",
        utility: "black-alpha-10",
        hex: "#1b14131a",
        onColorsPage: true
      },
      {
        name: "black-alpha/black-alpha-15",
        token: "--color-black-alpha-15",
        utility: "black-alpha-15",
        hex: "#1b141326",
        onColorsPage: true
      },
      {
        name: "black-alpha/black-alpha-20",
        token: "--color-black-alpha-20",
        utility: "black-alpha-20",
        hex: "#1b141333",
        onColorsPage: true
      },
      {
        name: "black-alpha/black-alpha-25",
        token: "--color-black-alpha-25",
        utility: "black-alpha-25",
        hex: "#1b141340",
        onColorsPage: true
      },
      {
        name: "black-alpha/black-alpha-30",
        token: "--color-black-alpha-30",
        utility: "black-alpha-30",
        hex: "#1b14134d",
        onColorsPage: true
      },
      {
        name: "black-alpha/black-alpha-40",
        token: "--color-black-alpha-40",
        utility: "black-alpha-40",
        hex: "#1b141366",
        onColorsPage: true
      },
      {
        name: "black-alpha/black-alpha-50",
        token: "--color-black-alpha-50",
        utility: "black-alpha-50",
        hex: "#1b141380",
        onColorsPage: true
      },
      {
        name: "black-alpha/black-alpha-60",
        token: "--color-black-alpha-60",
        utility: "black-alpha-60",
        hex: "#1b141399",
        onColorsPage: true
      },
      {
        name: "black-alpha/black-alpha-70",
        token: "--color-black-alpha-70",
        utility: "black-alpha-70",
        hex: "#1b1413b2",
        onColorsPage: true
      },
      {
        name: "black-alpha/black-alpha-80",
        token: "--color-black-alpha-80",
        utility: "black-alpha-80",
        hex: "#1b1413cc",
        onColorsPage: true
      },
      {
        name: "black-alpha/black-alpha-90",
        token: "--color-black-alpha-90",
        utility: "black-alpha-90",
        hex: "#1b1413e5",
        onColorsPage: true
      },
      {
        name: "black-alpha/black-alpha-95",
        token: "--color-black-alpha-95",
        utility: "black-alpha-95",
        hex: "#1b1413f2",
        onColorsPage: true
      }
    ]
  },
  {
    label: "Input labels (hard-coded in the Figma Input component)",
    colors: [
      { name: "input/label", token: "--color-input-label", utility: "input-label", hex: "#6b7280", onColorsPage: false, note: "Not a Figma variable" },
      { name: "input/label-disabled", token: "--color-input-label-disabled", utility: "input-label-disabled", hex: "#9ca3b0", onColorsPage: false, note: "Not a Figma variable" },
    ],
  },
];

export const typeStyles: TypeStyle[] = [
  {
    className: "type-heading-3xl",
    figmaName: "heading/default/heading-3xl",
    group: "heading-default",
    family: "heading",
    figmaFont: "BD Megalona",
    figmaStyle: "Thin",
    weight: 100,
    italic: false,
    size: 72,
    lineHeight: "72px",
    letterSpacing: -4,
    uppercase: false,
    underline: false,
    features: "\"calt\" 0"
  },
  {
    className: "type-heading-2xl",
    figmaName: "heading/default/heading-2xl",
    group: "heading-default",
    family: "heading",
    figmaFont: "BD Megalona",
    figmaStyle: "Thin",
    weight: 100,
    italic: false,
    size: 56,
    lineHeight: "56px",
    letterSpacing: -4,
    uppercase: false,
    underline: false,
    features: "\"calt\" 0"
  },
  {
    className: "type-heading-xl",
    figmaName: "heading/default/heading-xl",
    group: "heading-default",
    family: "heading",
    figmaFont: "BD Megalona",
    figmaStyle: "Thin",
    weight: 100,
    italic: false,
    size: 48,
    lineHeight: "48px",
    letterSpacing: -4,
    uppercase: false,
    underline: false,
    features: "\"calt\" 0"
  },
  {
    className: "type-heading-lg",
    figmaName: "heading/default/heading-lg",
    group: "heading-default",
    family: "heading",
    figmaFont: "BD Megalona",
    figmaStyle: "Extra Light",
    weight: 200,
    italic: false,
    size: 36,
    lineHeight: "40px",
    letterSpacing: -3,
    uppercase: false,
    underline: false,
    features: "\"calt\" 0"
  },
  {
    className: "type-heading-md",
    figmaName: "heading/default/heading-md",
    group: "heading-default",
    family: "heading",
    figmaFont: "BD Megalona",
    figmaStyle: "Extra Light",
    weight: 200,
    italic: false,
    size: 28,
    lineHeight: "32px",
    letterSpacing: -3,
    uppercase: false,
    underline: false,
    features: "\"calt\" 0"
  },
  {
    className: "type-heading-sm",
    figmaName: "heading/default/heading-sm",
    group: "heading-default",
    family: "heading",
    figmaFont: "BD Megalona",
    figmaStyle: "Extra Light",
    weight: 200,
    italic: false,
    size: 22,
    lineHeight: "26px",
    letterSpacing: -1,
    uppercase: false,
    underline: false,
    features: "\"calt\" 0"
  },
  {
    className: "type-heading-xs",
    figmaName: "heading/default/heading-xs",
    group: "heading-default",
    family: "heading",
    figmaFont: "BD Megalona",
    figmaStyle: "Ultra Light",
    weight: 250,
    italic: false,
    size: 18,
    lineHeight: "22px",
    letterSpacing: 0,
    uppercase: false,
    underline: false,
    features: "\"calt\" 0"
  },
  {
    className: "type-heading-2xs",
    figmaName: "heading/default/heading-2xs",
    group: "heading-default",
    family: "heading",
    figmaFont: "BD Megalona",
    figmaStyle: "Ultra Light",
    weight: 250,
    italic: false,
    size: 14,
    lineHeight: "18px",
    letterSpacing: 0,
    uppercase: false,
    underline: false,
    features: null
  },
  {
    className: "type-heading-caps-3xl",
    figmaName: "heading/caps/heading-3xl",
    group: "heading-caps",
    family: "heading",
    figmaFont: "BD Megalona",
    figmaStyle: "Thin",
    weight: 100,
    italic: false,
    size: 72,
    lineHeight: "72px",
    letterSpacing: -3,
    uppercase: true,
    underline: false,
    features: "\"calt\" 0"
  },
  {
    className: "type-heading-caps-2xl",
    figmaName: "heading/caps/heading-2xl",
    group: "heading-caps",
    family: "heading",
    figmaFont: "BD Megalona",
    figmaStyle: "Thin",
    weight: 100,
    italic: false,
    size: 56,
    lineHeight: "56px",
    letterSpacing: -3,
    uppercase: true,
    underline: false,
    features: "\"calt\" 0, \"lnum\" 1, \"tnum\" 1"
  },
  {
    className: "type-heading-caps-xl",
    figmaName: "heading/caps/heading-xl",
    group: "heading-caps",
    family: "heading",
    figmaFont: "BD Megalona",
    figmaStyle: "Thin",
    weight: 100,
    italic: false,
    size: 48,
    lineHeight: "48px",
    letterSpacing: -3,
    uppercase: true,
    underline: false,
    features: "\"calt\" 0"
  },
  {
    className: "type-heading-caps-lg",
    figmaName: "heading/caps/heading-lg",
    group: "heading-caps",
    family: "heading",
    figmaFont: "BD Megalona",
    figmaStyle: "Extra Light",
    weight: 200,
    italic: false,
    size: 36,
    lineHeight: "40px",
    letterSpacing: -2,
    uppercase: true,
    underline: false,
    features: "\"calt\" 0"
  },
  {
    className: "type-heading-caps-md",
    figmaName: "heading/caps/heading-md",
    group: "heading-caps",
    family: "heading",
    figmaFont: "BD Megalona",
    figmaStyle: "Extra Light",
    weight: 200,
    italic: false,
    size: 28,
    lineHeight: "32px",
    letterSpacing: -2,
    uppercase: true,
    underline: false,
    features: "\"calt\" 0"
  },
  {
    className: "type-heading-caps-sm",
    figmaName: "heading/caps/heading-sm",
    group: "heading-caps",
    family: "heading",
    figmaFont: "BD Megalona",
    figmaStyle: "Light",
    weight: 300,
    italic: false,
    size: 22,
    lineHeight: "26px",
    letterSpacing: -1,
    uppercase: true,
    underline: false,
    features: "\"calt\" 0"
  },
  {
    className: "type-heading-caps-xs",
    figmaName: "heading/caps/heading-xs",
    group: "heading-caps",
    family: "heading",
    figmaFont: "BD Megalona",
    figmaStyle: "Light",
    weight: 300,
    italic: false,
    size: 18,
    lineHeight: "22px",
    letterSpacing: 0,
    uppercase: true,
    underline: false,
    features: "\"calt\" 0"
  },
  {
    className: "type-heading-caps-2xs",
    figmaName: "heading/caps/heading-2xs",
    group: "heading-caps",
    family: "heading",
    figmaFont: "BD Megalona",
    figmaStyle: "Light",
    weight: 300,
    italic: false,
    size: 14,
    lineHeight: "18px",
    letterSpacing: 0,
    uppercase: true,
    underline: false,
    features: "\"calt\" 0"
  },
  {
    className: "type-heading-italic-3xl",
    figmaName: "heading/italic/heading-3xl",
    group: "heading-italic",
    family: "heading",
    figmaFont: "BD Megalona Italic",
    figmaStyle: "Thin Italic",
    weight: 100,
    italic: true,
    size: 72,
    lineHeight: "72px",
    letterSpacing: -4,
    uppercase: false,
    underline: false,
    features: "\"calt\" 0"
  },
  {
    className: "type-heading-italic-2xl",
    figmaName: "heading/italic/heading-2xl",
    group: "heading-italic",
    family: "heading",
    figmaFont: "BD Megalona Italic",
    figmaStyle: "Thin Italic",
    weight: 100,
    italic: true,
    size: 56,
    lineHeight: "56px",
    letterSpacing: -4,
    uppercase: false,
    underline: false,
    features: "\"calt\" 0"
  },
  {
    className: "type-heading-italic-xl",
    figmaName: "heading/italic/heading-xl",
    group: "heading-italic",
    family: "heading",
    figmaFont: "BD Megalona Italic",
    figmaStyle: "Thin Italic",
    weight: 100,
    italic: true,
    size: 48,
    lineHeight: "48px",
    letterSpacing: -4,
    uppercase: false,
    underline: false,
    features: "\"calt\" 0"
  },
  {
    className: "type-heading-italic-lg",
    figmaName: "heading/italic/heading-lg",
    group: "heading-italic",
    family: "heading",
    figmaFont: "BD Megalona Italic",
    figmaStyle: "Extra Light Italic",
    weight: 200,
    italic: true,
    size: 36,
    lineHeight: "40px",
    letterSpacing: -4,
    uppercase: false,
    underline: false,
    features: "\"calt\" 0"
  },
  {
    className: "type-heading-italic-md",
    figmaName: "heading/italic/heading-md",
    group: "heading-italic",
    family: "heading",
    figmaFont: "BD Megalona Italic",
    figmaStyle: "Extra Light Italic",
    weight: 200,
    italic: true,
    size: 28,
    lineHeight: "32px",
    letterSpacing: -3,
    uppercase: false,
    underline: false,
    features: "\"calt\" 0"
  },
  {
    className: "type-heading-italic-sm",
    figmaName: "heading/italic/heading-sm",
    group: "heading-italic",
    family: "heading",
    figmaFont: "BD Megalona Italic",
    figmaStyle: "Light Italic",
    weight: 300,
    italic: true,
    size: 22,
    lineHeight: "26px",
    letterSpacing: -2,
    uppercase: false,
    underline: false,
    features: "\"calt\" 0"
  },
  {
    className: "type-heading-italic-xs",
    figmaName: "heading/italic/heading-xs",
    group: "heading-italic",
    family: "heading",
    figmaFont: "BD Megalona Italic",
    figmaStyle: "Light Italic",
    weight: 300,
    italic: true,
    size: 18,
    lineHeight: "22px",
    letterSpacing: 0,
    uppercase: false,
    underline: false,
    features: "\"calt\" 0"
  },
  {
    className: "type-heading-italic-2xs",
    figmaName: "heading/italic/heading-2xs",
    group: "heading-italic",
    family: "heading",
    figmaFont: "BD Megalona Italic",
    figmaStyle: "Light Italic",
    weight: 300,
    italic: true,
    size: 14,
    lineHeight: "18px",
    letterSpacing: 0,
    uppercase: false,
    underline: false,
    features: "\"calt\" 0"
  },
  {
    className: "type-price-lg",
    figmaName: "misc/price-lg",
    group: "misc",
    family: "heading",
    figmaFont: "BD Megalona",
    figmaStyle: "Thin",
    weight: 100,
    italic: false,
    size: 56,
    lineHeight: "100%",
    letterSpacing: -7,
    uppercase: true,
    underline: false,
    features: null
  },
  {
    className: "type-price-md",
    figmaName: "misc/price-md",
    group: "misc",
    family: "heading",
    figmaFont: "BD Megalona",
    figmaStyle: "Extra Light",
    weight: 200,
    italic: false,
    size: 36,
    lineHeight: "100%",
    letterSpacing: -5,
    uppercase: true,
    underline: false,
    features: null
  },
  {
    className: "type-price-sm",
    figmaName: "misc/price-sm",
    group: "misc",
    family: "heading",
    figmaFont: "BD Megalona",
    figmaStyle: "Light",
    weight: 300,
    italic: false,
    size: 24,
    lineHeight: "100%",
    letterSpacing: -5,
    uppercase: true,
    underline: false,
    features: null
  },
  {
    className: "type-ui-xl-regular",
    figmaName: "ui/ui-xl/ui-xl-regular",
    group: "ui",
    family: "body",
    figmaFont: "IvyEpic",
    figmaStyle: "Regular",
    weight: 400,
    italic: false,
    size: 24,
    lineHeight: "28px",
    letterSpacing: -2,
    uppercase: false,
    underline: false,
    features: null
  },
  {
    className: "type-ui-xl-medium",
    figmaName: "ui/ui-xl/ui-xl-medium",
    group: "ui",
    family: "body",
    figmaFont: "IvyEpic",
    figmaStyle: "Medium",
    weight: 500,
    italic: false,
    size: 24,
    lineHeight: "28px",
    letterSpacing: -2,
    uppercase: false,
    underline: false,
    features: null
  },
  {
    className: "type-ui-lg-regular",
    figmaName: "ui/ui-lg/ui-lg-regular",
    group: "ui",
    family: "body",
    figmaFont: "IvyEpic",
    figmaStyle: "Regular",
    weight: 400,
    italic: false,
    size: 18,
    lineHeight: "24px",
    letterSpacing: -2,
    uppercase: false,
    underline: false,
    features: null
  },
  {
    className: "type-ui-lg-medium",
    figmaName: "ui/ui-lg/ui-lg-medium",
    group: "ui",
    family: "body",
    figmaFont: "IvyEpic",
    figmaStyle: "Medium",
    weight: 500,
    italic: false,
    size: 18,
    lineHeight: "24px",
    letterSpacing: -2,
    uppercase: false,
    underline: false,
    features: null
  },
  {
    className: "type-ui-md-regular",
    figmaName: "ui/ui-md/ui-md-regular",
    group: "ui",
    family: "body",
    figmaFont: "IvyEpic",
    figmaStyle: "Regular",
    weight: 400,
    italic: false,
    size: 16,
    lineHeight: "20px",
    letterSpacing: -1,
    uppercase: false,
    underline: false,
    features: null
  },
  {
    className: "type-ui-md-medium",
    figmaName: "ui/ui-md/ui-md-medium",
    group: "ui",
    family: "body",
    figmaFont: "IvyEpic",
    figmaStyle: "Medium",
    weight: 500,
    italic: false,
    size: 16,
    lineHeight: "20px",
    letterSpacing: -1,
    uppercase: false,
    underline: false,
    features: null
  },
  {
    className: "type-ui-sm-regular",
    figmaName: "ui/ui-sm/ui-sm-regular",
    group: "ui",
    family: "body",
    figmaFont: "IvyEpic",
    figmaStyle: "Regular",
    weight: 400,
    italic: false,
    size: 14,
    lineHeight: "18px",
    letterSpacing: -1,
    uppercase: false,
    underline: false,
    features: null
  },
  {
    className: "type-ui-sm-medium",
    figmaName: "ui/ui-sm/ui-sm-medium",
    group: "ui",
    family: "body",
    figmaFont: "IvyEpic",
    figmaStyle: "Medium",
    weight: 500,
    italic: false,
    size: 14,
    lineHeight: "18px",
    letterSpacing: -1,
    uppercase: false,
    underline: false,
    features: null
  },
  {
    className: "type-ui-sm-link",
    figmaName: "ui/ui-sm/ui-sm-link",
    group: "ui",
    family: "body",
    figmaFont: "IvyEpic",
    figmaStyle: "Regular",
    weight: 400,
    italic: false,
    size: 14,
    lineHeight: "18px",
    letterSpacing: -1,
    uppercase: false,
    underline: true,
    features: null
  },
  {
    className: "type-ui-xs-regular",
    figmaName: "ui/ui-xs/regular",
    group: "ui",
    family: "body",
    figmaFont: "IvyEpic",
    figmaStyle: "Regular",
    weight: 400,
    italic: false,
    size: 12,
    lineHeight: "16px",
    letterSpacing: 0,
    uppercase: false,
    underline: false,
    features: null
  },
  {
    className: "type-ui-xs-medium",
    figmaName: "ui/ui-xs/medium",
    group: "ui",
    family: "body",
    figmaFont: "IvyEpic",
    figmaStyle: "Medium",
    weight: 500,
    italic: false,
    size: 12,
    lineHeight: "16px",
    letterSpacing: 0,
    uppercase: false,
    underline: false,
    features: null
  },
  {
    className: "type-ui-xs-link",
    figmaName: "ui/ui-xs/link",
    group: "ui",
    family: "body",
    figmaFont: "IvyEpic",
    figmaStyle: "Medium",
    weight: 500,
    italic: false,
    size: 12,
    lineHeight: "16px",
    letterSpacing: 0,
    uppercase: false,
    underline: true,
    features: null
  },
  {
    className: "type-ui-2xs-regular",
    figmaName: "ui/ui-2xs/ui-2xs-regular",
    group: "ui",
    family: "body",
    figmaFont: "IvyEpic",
    figmaStyle: "Regular",
    weight: 400,
    italic: false,
    size: 10,
    lineHeight: "14px",
    letterSpacing: 0,
    uppercase: false,
    underline: false,
    features: null
  },
  {
    className: "type-ui-2xs-medium",
    figmaName: "ui/ui-2xs/ui-2xs-medium",
    group: "ui",
    family: "body",
    figmaFont: "IvyEpic",
    figmaStyle: "Medium",
    weight: 500,
    italic: false,
    size: 10,
    lineHeight: "14px",
    letterSpacing: 0,
    uppercase: false,
    underline: false,
    features: null
  },
  {
    className: "type-ui-3xs-regular",
    figmaName: "ui/ui-3xs/ui-3xs-regular",
    group: "ui",
    family: "body",
    figmaFont: "IvyEpic",
    figmaStyle: "Regular",
    weight: 400,
    italic: false,
    size: 8,
    lineHeight: "12px",
    letterSpacing: 0,
    uppercase: false,
    underline: false,
    features: null
  },
  {
    className: "type-ui-3xs-medium",
    figmaName: "ui/ui-3xs/ui-3xs-medium",
    group: "ui",
    family: "body",
    figmaFont: "IvyEpic",
    figmaStyle: "Medium",
    weight: 500,
    italic: false,
    size: 8,
    lineHeight: "12px",
    letterSpacing: 0,
    uppercase: false,
    underline: false,
    features: null
  },
  {
    className: "type-body-2xl-regular",
    figmaName: "body/body-2xl/body-2xl-regular",
    group: "body",
    family: "body",
    figmaFont: "IvyEpic",
    figmaStyle: "Regular",
    weight: 400,
    italic: false,
    size: 32,
    lineHeight: "150%",
    letterSpacing: -2,
    uppercase: false,
    underline: false,
    features: null
  },
  {
    className: "type-body-2xl-medium",
    figmaName: "body/body-2xl/body-2xl-medium",
    group: "body",
    family: "body",
    figmaFont: "IvyEpic",
    figmaStyle: "Medium",
    weight: 500,
    italic: false,
    size: 32,
    lineHeight: "150%",
    letterSpacing: -2,
    uppercase: false,
    underline: false,
    features: null
  },
  {
    className: "type-body-xl-regular",
    figmaName: "body/body-xl/body-xl-regular",
    group: "body",
    family: "body",
    figmaFont: "IvyEpic",
    figmaStyle: "Regular",
    weight: 400,
    italic: false,
    size: 24,
    lineHeight: "150%",
    letterSpacing: -2,
    uppercase: false,
    underline: false,
    features: null
  },
  {
    className: "type-body-xl-medium",
    figmaName: "body/body-xl/body-xl-medium",
    group: "body",
    family: "body",
    figmaFont: "IvyEpic",
    figmaStyle: "Medium",
    weight: 500,
    italic: false,
    size: 24,
    lineHeight: "150%",
    letterSpacing: -2,
    uppercase: false,
    underline: false,
    features: null
  },
  {
    className: "type-body-lg-regular",
    figmaName: "body/body-lg/body-lg-regular",
    group: "body",
    family: "body",
    figmaFont: "IvyEpic",
    figmaStyle: "Regular",
    weight: 400,
    italic: false,
    size: 18,
    lineHeight: "150%",
    letterSpacing: -2,
    uppercase: false,
    underline: false,
    features: null
  },
  {
    className: "type-body-lg-medium",
    figmaName: "body/body-lg/body-lg-medium",
    group: "body",
    family: "body",
    figmaFont: "IvyEpic",
    figmaStyle: "Medium",
    weight: 500,
    italic: false,
    size: 18,
    lineHeight: "150%",
    letterSpacing: -2,
    uppercase: false,
    underline: false,
    features: null
  },
  {
    className: "type-body-md-regular",
    figmaName: "body/body-md/body-md-regular",
    group: "body",
    family: "body",
    figmaFont: "IvyEpic",
    figmaStyle: "Regular",
    weight: 400,
    italic: false,
    size: 16,
    lineHeight: "150%",
    letterSpacing: -1,
    uppercase: false,
    underline: false,
    features: null
  },
  {
    className: "type-body-md-medium",
    figmaName: "body/body-md/body-md-medium",
    group: "body",
    family: "body",
    figmaFont: "IvyEpic",
    figmaStyle: "Medium",
    weight: 500,
    italic: false,
    size: 16,
    lineHeight: "150%",
    letterSpacing: -1,
    uppercase: false,
    underline: false,
    features: null
  },
  {
    className: "type-body-sm-regular",
    figmaName: "body/body-sm/body-sm-regular",
    group: "body",
    family: "body",
    figmaFont: "IvyEpic",
    figmaStyle: "Regular",
    weight: 400,
    italic: false,
    size: 14,
    lineHeight: "150%",
    letterSpacing: -1,
    uppercase: false,
    underline: false,
    features: null
  },
  {
    className: "type-body-sm-medium",
    figmaName: "body/body-sm/body-sm-medium",
    group: "body",
    family: "body",
    figmaFont: "IvyEpic",
    figmaStyle: "Medium",
    weight: 500,
    italic: false,
    size: 14,
    lineHeight: "150%",
    letterSpacing: -1,
    uppercase: false,
    underline: false,
    features: null
  },
  {
    className: "type-body-xs-regular",
    figmaName: "body/body-xs/body-xs-regular",
    group: "body",
    family: "body",
    figmaFont: "IvyEpic",
    figmaStyle: "Regular",
    weight: 400,
    italic: false,
    size: 12,
    lineHeight: "150%",
    letterSpacing: 0,
    uppercase: false,
    underline: false,
    features: null
  },
  {
    className: "type-body-xs-medium",
    figmaName: "body/body-xs/body-xs-medium",
    group: "body",
    family: "body",
    figmaFont: "IvyEpic",
    figmaStyle: "Medium",
    weight: 500,
    italic: false,
    size: 12,
    lineHeight: "150%",
    letterSpacing: 0,
    uppercase: false,
    underline: false,
    features: null
  },
  {
    className: "type-body-2xs-regular",
    figmaName: "body/body-2xs/body-2xs-regular",
    group: "body",
    family: "body",
    figmaFont: "IvyEpic",
    figmaStyle: "Regular",
    weight: 400,
    italic: false,
    size: 10,
    lineHeight: "150%",
    letterSpacing: 0,
    uppercase: false,
    underline: false,
    features: null
  },
  {
    className: "type-body-2xs-medium",
    figmaName: "body/body-2xs/body-2xs-medium",
    group: "body",
    family: "body",
    figmaFont: "IvyEpic",
    figmaStyle: "Medium",
    weight: 500,
    italic: false,
    size: 10,
    lineHeight: "150%",
    letterSpacing: 0,
    uppercase: false,
    underline: false,
    features: null
  },
  {
    className: "type-p-2xl-regular",
    figmaName: "p/p-2xl/p-2xl-regular",
    group: "p",
    family: "body",
    figmaFont: "IvyEpic",
    figmaStyle: "Regular",
    weight: 400,
    italic: false,
    size: 32,
    lineHeight: "165%",
    letterSpacing: -2,
    uppercase: false,
    underline: false,
    features: null
  },
  {
    className: "type-p-2xl-medium",
    figmaName: "p/p-2xl/p-2xl-medium",
    group: "p",
    family: "body",
    figmaFont: "IvyEpic",
    figmaStyle: "Medium",
    weight: 500,
    italic: false,
    size: 32,
    lineHeight: "165%",
    letterSpacing: -2,
    uppercase: false,
    underline: false,
    features: null
  },
  {
    className: "type-p-xl-regular",
    figmaName: "p/p-xl/p-xl-regular",
    group: "p",
    family: "body",
    figmaFont: "IvyEpic",
    figmaStyle: "Regular",
    weight: 400,
    italic: false,
    size: 24,
    lineHeight: "165%",
    letterSpacing: -2,
    uppercase: false,
    underline: false,
    features: null
  },
  {
    className: "type-p-xl-medium",
    figmaName: "p/p-xl/p-xl-medium",
    group: "p",
    family: "body",
    figmaFont: "IvyEpic",
    figmaStyle: "Medium",
    weight: 500,
    italic: false,
    size: 24,
    lineHeight: "165%",
    letterSpacing: -2,
    uppercase: false,
    underline: false,
    features: null
  },
  {
    className: "type-p-lg-regular",
    figmaName: "p/p-lg/p-lg-regular",
    group: "p",
    family: "body",
    figmaFont: "IvyEpic",
    figmaStyle: "Regular",
    weight: 400,
    italic: false,
    size: 18,
    lineHeight: "165%",
    letterSpacing: -2,
    uppercase: false,
    underline: false,
    features: null
  },
  {
    className: "type-p-lg-medium",
    figmaName: "p/p-lg/p-lg-medium",
    group: "p",
    family: "body",
    figmaFont: "IvyEpic",
    figmaStyle: "Medium",
    weight: 500,
    italic: false,
    size: 18,
    lineHeight: "165%",
    letterSpacing: -2,
    uppercase: false,
    underline: false,
    features: null
  },
  {
    className: "type-p-md-regular",
    figmaName: "p/p-md/p-md-regular",
    group: "p",
    family: "body",
    figmaFont: "IvyEpic",
    figmaStyle: "Regular",
    weight: 400,
    italic: false,
    size: 16,
    lineHeight: "165%",
    letterSpacing: -1,
    uppercase: false,
    underline: false,
    features: null
  },
  {
    className: "type-p-md-medium",
    figmaName: "p/p-md/p-md-medium",
    group: "p",
    family: "body",
    figmaFont: "IvyEpic",
    figmaStyle: "Medium",
    weight: 500,
    italic: false,
    size: 16,
    lineHeight: "165%",
    letterSpacing: -1,
    uppercase: false,
    underline: false,
    features: null
  },
  {
    className: "type-p-sm-regular",
    figmaName: "p/p-sm/p-sm-regular",
    group: "p",
    family: "body",
    figmaFont: "IvyEpic",
    figmaStyle: "Regular",
    weight: 400,
    italic: false,
    size: 14,
    lineHeight: "165%",
    letterSpacing: -1,
    uppercase: false,
    underline: false,
    features: null
  },
  {
    className: "type-p-sm-medium",
    figmaName: "p/p-sm/p-sm-medium",
    group: "p",
    family: "body",
    figmaFont: "IvyEpic",
    figmaStyle: "Medium",
    weight: 500,
    italic: false,
    size: 14,
    lineHeight: "165%",
    letterSpacing: -1,
    uppercase: false,
    underline: false,
    features: null
  },
  {
    className: "type-p-xs-regular",
    figmaName: "p/p-xs/p-xs-regular",
    group: "p",
    family: "body",
    figmaFont: "IvyEpic",
    figmaStyle: "Regular",
    weight: 400,
    italic: false,
    size: 12,
    lineHeight: "165%",
    letterSpacing: -1,
    uppercase: false,
    underline: false,
    features: null
  },
  {
    className: "type-p-xs-medium",
    figmaName: "p/p-xs/p-xs-medium",
    group: "p",
    family: "body",
    figmaFont: "IvyEpic",
    figmaStyle: "Medium",
    weight: 500,
    italic: false,
    size: 12,
    lineHeight: "165%",
    letterSpacing: -1,
    uppercase: false,
    underline: false,
    features: null
  },
  {
    className: "type-p-2xs-regular",
    figmaName: "p/p-2xs/p-2xs-regular",
    group: "p",
    family: "body",
    figmaFont: "IvyEpic",
    figmaStyle: "Regular",
    weight: 400,
    italic: false,
    size: 10,
    lineHeight: "165%",
    letterSpacing: -1,
    uppercase: false,
    underline: false,
    features: null
  },
  {
    className: "type-p-2xs-medium",
    figmaName: "p/p-2xs/p-2xs-medium",
    group: "p",
    family: "body",
    figmaFont: "IvyEpic",
    figmaStyle: "Medium",
    weight: 500,
    italic: false,
    size: 10,
    lineHeight: "165%",
    letterSpacing: -1,
    uppercase: false,
    underline: false,
    features: null
  },
  {
    className: "type-overline-md-regular",
    figmaName: "overline/overline-md/regular",
    group: "overline",
    family: "body",
    figmaFont: "IvyEpic",
    figmaStyle: "Regular",
    weight: 400,
    italic: false,
    size: 14,
    lineHeight: "20px",
    letterSpacing: 10,
    uppercase: true,
    underline: false,
    features: null
  },
  {
    className: "type-overline-md-medium",
    figmaName: "overline/overline-md/medium",
    group: "overline",
    family: "body",
    figmaFont: "IvyEpic",
    figmaStyle: "Medium",
    weight: 500,
    italic: false,
    size: 14,
    lineHeight: "20px",
    letterSpacing: 10,
    uppercase: true,
    underline: false,
    features: null
  },
  {
    className: "type-overline-sm-regular",
    figmaName: "overline/overline-sm/regular",
    group: "overline",
    family: "body",
    figmaFont: "IvyEpic",
    figmaStyle: "Regular",
    weight: 400,
    italic: false,
    size: 12,
    lineHeight: "16px",
    letterSpacing: 10,
    uppercase: true,
    underline: false,
    features: null
  },
  {
    className: "type-overline-sm-medium",
    figmaName: "overline/overline-sm/medium",
    group: "overline",
    family: "body",
    figmaFont: "IvyEpic",
    figmaStyle: "Medium",
    weight: 500,
    italic: false,
    size: 12,
    lineHeight: "16px",
    letterSpacing: 10,
    uppercase: true,
    underline: false,
    features: null
  },
  {
    className: "type-overline-xs-regular",
    figmaName: "overline/overline-xs/regular",
    group: "overline",
    family: "body",
    figmaFont: "IvyEpic",
    figmaStyle: "Regular",
    weight: 400,
    italic: false,
    size: 10,
    lineHeight: "14px",
    letterSpacing: 10,
    uppercase: true,
    underline: false,
    features: null
  },
  {
    className: "type-overline-xs-medium",
    figmaName: "overline/overline-xs/medium",
    group: "overline",
    family: "body",
    figmaFont: "IvyEpic",
    figmaStyle: "Medium",
    weight: 500,
    italic: false,
    size: 10,
    lineHeight: "14px",
    letterSpacing: 10,
    uppercase: true,
    underline: false,
    features: null
  },
  {
    className: "type-overline-xs-link",
    figmaName: "overline/overline-xs/link",
    group: "overline",
    family: "body",
    figmaFont: "IvyEpic",
    figmaStyle: "Medium",
    weight: 500,
    italic: false,
    size: 10,
    lineHeight: "14px",
    letterSpacing: 10,
    uppercase: true,
    underline: true,
    features: null
  },
  {
    className: "type-overline-2xs-medium",
    figmaName: "overline/overline-2xs/medium",
    group: "overline",
    family: "body",
    figmaFont: "IvyEpic",
    figmaStyle: "Medium",
    weight: 500,
    italic: false,
    size: 8,
    lineHeight: "12px",
    letterSpacing: 10,
    uppercase: true,
    underline: false,
    features: null
  }
];

export const semanticTypeStyles = [
  {
    className: "type-h1",
    label: "H1",
    desktop: "heading/default/heading-3xl",
    tablet: "heading/default/heading-2xl",
    mobile: "heading/default/heading-xl"
  },
  {
    className: "type-h2",
    label: "H2",
    desktop: "heading/default/heading-2xl",
    tablet: "heading/default/heading-xl",
    mobile: "heading/default/heading-lg"
  },
  {
    className: "type-h3",
    label: "H3",
    desktop: "heading/default/heading-xl",
    tablet: "heading/default/heading-lg",
    mobile: "heading/default/heading-md"
  },
  {
    className: "type-h4",
    label: "H4",
    desktop: "heading/default/heading-lg",
    tablet: "heading/default/heading-md",
    mobile: "heading/default/heading-sm"
  },
  {
    className: "type-h5",
    label: "H5",
    desktop: "heading/default/heading-md",
    tablet: "heading/default/heading-sm",
    mobile: "heading/default/heading-xs"
  },
  {
    className: "type-h6",
    label: "H6",
    desktop: "heading/default/heading-sm",
    tablet: "heading/default/heading-xs",
    mobile: "heading/default/heading-2xs"
  },
  {
    className: "type-body",
    label: "Body",
    desktop: "body/body-md/body-md-regular",
    tablet: "body/body-md/body-md-regular",
    mobile: "body/body-sm/body-sm-regular"
  },
  {
    className: "type-paragraph",
    label: "Paragraph",
    desktop: "p/p-md/p-md-regular",
    tablet: "p/p-md/p-md-regular",
    mobile: "p/p-sm/p-sm-regular"
  },
  {
    className: "type-list-unordered",
    label: "Unordered list",
    desktop: "p/p-md/p-md-regular",
    tablet: "p/p-md/p-md-regular",
    mobile: "p/p-sm/p-sm-regular"
  },
  {
    className: "type-list-ordered",
    label: "Ordered list",
    desktop: "p/p-md/p-md-regular",
    tablet: "p/p-md/p-md-regular",
    mobile: "p/p-sm/p-sm-regular"
  },
  {
    className: "type-blockquote",
    label: "Blockquote",
    desktop: "heading/italic/heading-lg",
    tablet: "heading/italic/heading-md",
    mobile: "heading/italic/heading-sm"
  },
  {
    className: "type-legal-h1",
    label: "Legal H1",
    desktop: "heading/default/heading-2xl",
    tablet: "heading/default/heading-2xl",
    mobile: "heading/default/heading-lg"
  },
  {
    className: "type-legal-h2",
    label: "Legal H2",
    desktop: "heading/default/heading-lg",
    tablet: "heading/default/heading-lg",
    mobile: "heading/default/heading-md"
  },
  {
    className: "type-legal-h3",
    label: "Legal H3",
    desktop: "heading/default/heading-md",
    tablet: "heading/default/heading-md",
    mobile: "heading/default/heading-sm"
  },
  {
    className: "type-legal-h4",
    label: "Legal H4",
    desktop: "heading/default/heading-sm",
    tablet: "heading/default/heading-sm",
    mobile: "heading/default/heading-xs"
  }
];

export const spacingTokens = [
  {
    name: "Spacing/space-1",
    token: "--spacing-space-1",
    utility: "space-1",
    px: 4
  },
  {
    name: "Spacing/space-2",
    token: "--spacing-space-2",
    utility: "space-2",
    px: 8
  },
  {
    name: "Spacing/space-3",
    token: "--spacing-space-3",
    utility: "space-3",
    px: 12
  },
  {
    name: "Spacing/space-4",
    token: "--spacing-space-4",
    utility: "space-4",
    px: 16
  },
  {
    name: "Spacing/space-5",
    token: "--spacing-space-5",
    utility: "space-5",
    px: 20
  },
  {
    name: "Spacing/space-6",
    token: "--spacing-space-6",
    utility: "space-6",
    px: 24
  },
  {
    name: "Spacing/space-7",
    token: "--spacing-space-7",
    utility: "space-7",
    px: 28
  },
  {
    name: "Spacing/space-8",
    token: "--spacing-space-8",
    utility: "space-8",
    px: 32
  },
  {
    name: "Spacing/space-9",
    token: "--spacing-space-9",
    utility: "space-9",
    px: 36
  },
  {
    name: "Spacing/space-10",
    token: "--spacing-space-10",
    utility: "space-10",
    px: 40
  },
  {
    name: "Spacing/space-11",
    token: "--spacing-space-11",
    utility: "space-11",
    px: 48
  },
  {
    name: "Spacing/space-12",
    token: "--spacing-space-12",
    utility: "space-12",
    px: 56
  },
  {
    name: "Spacing/space-13",
    token: "--spacing-space-13",
    utility: "space-13",
    px: 64
  },
  {
    name: "Spacing/space-14",
    token: "--spacing-space-14",
    utility: "space-14",
    px: 72
  },
  {
    name: "Spacing/space-15",
    token: "--spacing-space-15",
    utility: "space-15",
    px: 80
  },
  {
    name: "Spacing/space-16",
    token: "--spacing-space-16",
    utility: "space-16",
    px: 88
  },
  {
    name: "Spacing/space-17",
    token: "--spacing-space-17",
    utility: "space-17",
    px: 96
  },
  {
    name: "Spacing/space-18",
    token: "--spacing-space-18",
    utility: "space-18",
    px: 120
  },
  {
    name: "Spacing/space-19",
    token: "--spacing-space-19",
    utility: "space-19",
    px: 160
  },
  {
    name: "Spacing/space-20",
    token: "--spacing-space-20",
    utility: "space-20",
    px: 200
  }
];

export const shadowTokens = [
  {
    name: "shadow/shadow-base",
    token: "--shadow-base",
    utility: "shadow-base",
    value: "0 1px 2px -1px var(--color-black-alpha-5), 0 1px 3px 0 var(--color-white-alpha-2)"
  },
  {
    name: "shadow/shadow-inset",
    token: "--shadow-inset",
    utility: "shadow-inset",
    value: "inset 0 8px 8px -2px var(--color-black-alpha-2), inset 0 2px 4px -1px var(--color-black-alpha-5)"
  },
  {
    name: "shadow/shadow-sm",
    token: "--shadow-sm",
    utility: "shadow-sm",
    value: "0 1px 2px 0 var(--color-black-alpha-5)"
  },
  {
    name: "shadow/shadow-md",
    token: "--shadow-md",
    utility: "shadow-md",
    value: "0 2px 4px -2px var(--color-black-alpha-5), 0 4px 6px -1px var(--color-black-alpha-5)"
  },
  {
    name: "shadow/shadow-lg",
    token: "--shadow-lg",
    utility: "shadow-lg",
    value: "0 4px 6px -4px var(--color-black-alpha-5), 0 10px 15px -3px var(--color-black-alpha-5)"
  },
  {
    name: "shadow/shadow-xl",
    token: "--shadow-xl",
    utility: "shadow-xl",
    value: "0 8px 10px -6px var(--color-black-alpha-5), 0 20px 25px -5px var(--color-black-alpha-5)"
  },
  {
    name: "shadow/shadow-2xl",
    token: "--shadow-2xl",
    utility: "shadow-2xl",
    value: "0 25px 50px -12px var(--color-black-alpha-5)"
  },
  {
    name: "stone-shadow",
    token: "--shadow-stone",
    utility: "shadow-stone",
    value: "-3px 4px 6px 0 rgb(0 0 0 / 0.14)"
  }
];

export const textShadowTokens = [
  {
    name: "text-shadow/text-shaodw-sm",
    token: "--text-shadow-sm",
    utility: "text-shadow-sm",
    value: "0 0 16px var(--color-black-alpha-50)"
  },
  {
    name: "text-shadow/text-shadow-lg",
    token: "--text-shadow-lg",
    utility: "text-shadow-lg",
    value: "0 0 24px var(--color-black-alpha-50)"
  }
];

export const blurTokens = [
  {
    name: "blur/blur-sm",
    token: "--blur-sm",
    utility: "backdrop-blur-sm",
    figmaRadius: 5,
    cssPx: 2.5
  },
  {
    name: "blur/blur-md",
    token: "--blur-md",
    utility: "backdrop-blur-md",
    figmaRadius: 30,
    cssPx: 15
  }
];

export const radiusTokens = [
  {
    token: "--radius-2",
    utility: "rounded-2",
    px: 2
  },
  {
    token: "--radius-4",
    utility: "rounded-4",
    px: 4
  },
  {
    token: "--radius-8",
    utility: "rounded-8",
    px: 8
  }
];
