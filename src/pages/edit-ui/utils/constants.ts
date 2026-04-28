import { Options } from "qr-code-styling";

export const COLORS = [
  "#000000",
  "#1D4ED8",
  "#15803D",
  "#B91C1C",
  "#7E22CE",
  "#EA580C",
  "#0369A1",
  "#ffffff",
];

export const STYLES = {
  DOT: "dot",
  ROUNDED: "rounded",
  CLASSY: "classy",
  CLASSY_ROUNDED: "classy-rounded",
  SQUARE: "square",
  EXTRA_ROUNDED: "extra-rounded",
};

export const SECTION = {
  STYLE: "style",
  LAYOUT: "layout",
  BACKGROUND: "background",
};

export const STYLE_SECTION = {
  DOTS: "dots",
  CORNERS_SQUARE: "cornersSquare",
  CORNERS_DOT: "cornersDot",
  BG: "bg",
  IMAGE: "image",
};

export const DOT_TYPES = [
  STYLES.ROUNDED,
  STYLES.DOT,
  STYLES.CLASSY,
  STYLES.CLASSY_ROUNDED,
  STYLES.SQUARE,
  STYLES.EXTRA_ROUNDED,
];
export const CORNER_SQUARE_TYPES = [STYLES.SQUARE, STYLES.EXTRA_ROUNDED, STYLES.DOT];
export const CORNER_DOT_TYPES = [STYLES.SQUARE, STYLES.DOT];

export const SHEET_HEIGHT = window.innerHeight * 0.5;
export const COLLAPSED_Y = SHEET_HEIGHT - 60;

export const DEFAULT_OPTIONS: Partial<Options> = {
  width: 512,
  height: 512,
  margin: 10,
  dotsOptions: { color: "#000000", type: "rounded" },
  backgroundOptions: { color: "#ffffff" },
  cornersSquareOptions: { color: "#000000", type: "extra-rounded" },
  cornersDotOptions: { color: "#000000", type: "dot" },
  imageOptions: { crossOrigin: "anonymous", margin: 10 },
};

export const COLOR = {
  WHITE: {
    name: "White",
    color: "#ffffff",
  },
  GRAY: {
    name: "Gray",
    color: "#f3f4f6",
  },
  BLUE: {
    name: "Blue",
    color: "#eff6ff",
  },
  YELLOW: {
    name: "Yellow",
    color: "#fefce8",
  },
  PINK: {
    name: "Pink",
    color: "#fdf2f8",
  },
};

export const BACKGROUND_COLORS = [COLOR.WHITE, COLOR.GRAY, COLOR.BLUE, COLOR.YELLOW, COLOR.PINK];
