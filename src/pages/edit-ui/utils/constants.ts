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
  SIZE: "size",
};

export const FRAME_RATIOS = [
  { label: "1:1", width: 400, height: 400 },
  { label: "3:4", width: 337.5, height: 450 },
  { label: "4:3", width: 450, height: 337.5 },
  { label: "9:16", width: 253, height: 450 },
  { label: "16:9", width: 450, height: 253 },
  { label: "2:3", width: 300, height: 450 },
  { label: "3:2", width: 450, height: 300 },
  { label: "4:5", width: 360, height: 450 },
  { label: "5:4", width: 450, height: 360 },
  { label: "5:7", width: 321, height: 450 },
  { label: "7:5", width: 450, height: 321 },
  { label: "3:5", width: 270, height: 450 },
  { label: "5:3", width: 450, height: 270 },
];

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

export const ZAPY_STICKERS = [
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

export const BU_MAT_NGAO = [
  `${PUBLIC_API_URL}/api/v1/files/serve/99d08c8a-489f-4fc7-82e7-b482cf9e11be`,
  `${PUBLIC_API_URL}/api/v1/files/serve/10805214-d5fa-4f17-beaa-4b9a7756177e`,
  `${PUBLIC_API_URL}/api/v1/files/serve/8a829015-4fb4-40d9-85c0-f4e440fe9c84`,
  `${PUBLIC_API_URL}/api/v1/files/serve/afe722c5-2e2a-46da-848d-243a12b48df9`,
  `${PUBLIC_API_URL}/api/v1/files/serve/2af5b132-9082-4d2b-a0a5-0aa004dbc257`,
  `${PUBLIC_API_URL}/api/v1/files/serve/2e51103b-400f-465b-b769-e1c3ec2ef363`,
  `${PUBLIC_API_URL}/api/v1/files/serve/f06a79a7-c072-401e-9ed4-f6a36af4d799`,
  `${PUBLIC_API_URL}/api/v1/files/serve/229794b6-c345-469f-b4f2-31b218272b46`,
  `${PUBLIC_API_URL}/api/v1/files/serve/a83f676d-019b-4f59-90fc-805e07cae70b`,
  `${PUBLIC_API_URL}/api/v1/files/serve/f5053a00-abbc-44f7-9c7f-89770be5f877`,
  `${PUBLIC_API_URL}/api/v1/files/serve/e5b217cd-d2a7-4db0-ae0a-fd0f8086eba1`,
  `${PUBLIC_API_URL}/api/v1/files/serve/d13c9e07-50d4-4881-920c-56fd575700f0`,
  `${PUBLIC_API_URL}/api/v1/files/serve/e7720ccc-f9d8-4aa9-ac6d-fae8bc24612b`,
  `${PUBLIC_API_URL}/api/v1/files/serve/b308e74d-3c4b-4bb7-b44a-bd1a51d409e8`,
  `${PUBLIC_API_URL}/api/v1/files/serve/be8a8b8e-dd95-44d5-b2be-64592b2148ab`,
  `${PUBLIC_API_URL}/api/v1/files/serve/199e229a-b377-419e-843d-826151fa181a`,
  `${PUBLIC_API_URL}/api/v1/files/serve/82340215-0c43-4eb8-9803-aea88e3f2a71`,
  `${PUBLIC_API_URL}/api/v1/files/serve/7c1e78d9-7439-4754-8de9-5b69e2e3c385`,
  `${PUBLIC_API_URL}/api/v1/files/serve/334c7218-fef8-4547-b788-2a4512d56d80`,
];

export const STICKERS = [
  {
    name: "Zapy Vô tri",
    stickers: ZAPY_STICKERS,
  },
  {
    name: "Bư Mặt Ngào",
    stickers: BU_MAT_NGAO,
  },
];

export const ERROR_CORRECTION_LEVELS = [
  { label: "Tốt nhất", value: "H" },
  { label: "Cao", value: "Q" },
  { label: "Trung bình", value: "M" },
  { label: "Nhỏ nhất", value: "L" },
];

export const DEFAULT_FRAME_WIDTH = 350;
export const DEFAULT_FRAME_HEIGHT = 450;

export const TEMPLATE_IMAGES = [
  `${PUBLIC_API_URL}/api/v1/files/serve/25ebb1d6-294c-4638-aca2-b962418a23a4`,
  `${PUBLIC_API_URL}/api/v1/files/serve/5106c07b-d9a0-4842-a416-53010aa1c8a9`,
  `${PUBLIC_API_URL}/api/v1/files/serve/5cae09ec-0582-41a4-96ce-16d9b454840f`,
  `${PUBLIC_API_URL}/api/v1/files/serve/98fa18b2-ac8d-4e93-aa99-b4435bbcdc90`,
  `${PUBLIC_API_URL}/api/v1/files/serve/b4d35912-79d4-4d3d-ac2f-dfbdaad3b072`,
  `${PUBLIC_API_URL}/api/v1/files/serve/cfa24d40-b52a-45e9-90c1-103a44965719`,
];
