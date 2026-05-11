import { PUBLIC_API_URL } from "@/api";

export const COLORS = [
  "#000000",
  "#ffffff",
  "#3B82F6",
  "#1D4ED8",
  "#1E40AF",
  "#0ea5e9",
  "#06b6d4",
  "#14b8a6",
  "#10b981",
  "#15803D",
  "#16a34a",
  "#84cc16",
  "#eab308",
  "#f59e0b",
  "#EA580C",
  "#f97316",
  "#ef4444",
  "#B91C1C",
  "#f43f5e",
  "#ec4899",
  "#d946ef",
  "#8b5cf6",
  "#7E22CE",
  "#6366f1",
  "#64748b",
  "#475569",
];

export const STYLES = {
  DOTS: "dots",
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
  ERROR_CORRECTION: "errorCorrection",
};

export const DOT_TYPES = [
  STYLES.ROUNDED,
  STYLES.DOTS,
  STYLES.CLASSY,
  STYLES.CLASSY_ROUNDED,
  STYLES.SQUARE,
  STYLES.EXTRA_ROUNDED,
];
export const CORNER_SQUARE_TYPES = [STYLES.SQUARE, STYLES.EXTRA_ROUNDED, STYLES.DOT];
export const CORNER_DOT_TYPES = [STYLES.SQUARE, STYLES.DOT];

export const SHEET_HEIGHT = window.innerHeight * 0.5;
export const COLLAPSED_Y = SHEET_HEIGHT - 60;

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
  BLACK: {
    name: "Black",
    color: "#000000",
  },
  GREEN: {
    name: "Green",
    color: "#f0fdf4",
  },
  PURPLE: {
    name: "Purple",
    color: "#f5f3ff",
  },
  ORANGE: {
    name: "Orange",
    color: "#fff7ed",
  },
};

export const BACKGROUND_COLORS = [
  COLOR.WHITE,
  COLOR.GRAY,
  COLOR.BLUE,
  COLOR.YELLOW,
  COLOR.PINK,
  COLOR.GREEN,
  COLOR.PURPLE,
  COLOR.ORANGE,
  COLOR.BLACK,
];

export const STICKERS = [
  `${PUBLIC_API_URL}/api/v1/files/serve/961361ea-890a-4bdd-ae75-b7dc47fcd054`,
  `${PUBLIC_API_URL}/api/v1/files/serve/9b56f4db-1c3d-48ab-aaf1-831ba760ce2c`,
  `${PUBLIC_API_URL}/api/v1/files/serve/9e28893d-e2d6-4774-8604-499fb45bfc83`,
  `${PUBLIC_API_URL}/api/v1/files/serve/357becdf-7642-4dae-97f8-0b52e0dd0df4`,
  `${PUBLIC_API_URL}/api/v1/files/serve/5d4468f9-2725-4b9e-99b7-857b73a2c8c1`,
  `${PUBLIC_API_URL}/api/v1/files/serve/455621e6-1a99-4bb4-b5fa-4bd5c4df58fd`,
  `${PUBLIC_API_URL}/api/v1/files/serve/d26ec264-4a3c-4ef9-9884-a15a1ac57b45`,
  `${PUBLIC_API_URL}/api/v1/files/serve/af31bf3c-ae0f-43c6-91ac-038ebed12c64`,
  `${PUBLIC_API_URL}/api/v1/files/serve/bf8064ed-242c-4e92-a7dc-721dd53c32c2`,
  `${PUBLIC_API_URL}/api/v1/files/serve/3e9f4bba-b17d-4049-b437-395c5f82bfcb`,
  `${PUBLIC_API_URL}/api/v1/files/serve/d62f4173-ef6c-46bb-94b3-fa73f0bf1655`,
  `${PUBLIC_API_URL}/api/v1/files/serve/4f952945-d9e8-4180-8582-ffb5a7730f0c`,
  `${PUBLIC_API_URL}/api/v1/files/serve/7dc65d82-9eb5-4180-929a-940c48f8105b`,
];

export const ERROR_CORRECTION_LEVELS = [
  { label: "Tốt nhất", value: "H" },
  { label: "Cao", value: "Q" },
  { label: "Trung bình", value: "M" },
  { label: "Nhỏ nhất", value: "L" },
];

export const DEFAULT_FRAME_WIDTH = 350;
export const DEFAULT_FRAME_HEIGHT = 450;
