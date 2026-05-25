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

export const TEMPLATE_IMAGES = [
  `${PUBLIC_API_URL}/api/v1/files/serve/8f45fd08-af0e-428d-9a1c-3f6fd79ead48`, // trung-thu.webp
  `${PUBLIC_API_URL}/api/v1/files/serve/9adbb99e-9827-4a07-ac7f-afe9e9577c29`, // summer-time.webp
  `${PUBLIC_API_URL}/api/v1/files/serve/409a5759-a2f9-4d02-918d-84159eb26c70`, // quoc-khanh.webp
  `${PUBLIC_API_URL}/api/v1/files/serve/221f338d-14db-4823-852f-902aee6cd260`, // ngay-van-hoa.webp
  `${PUBLIC_API_URL}/api/v1/files/serve/ddcd3819-8151-4349-9bdf-422d5696530f`, // halloween.webp
  `${PUBLIC_API_URL}/api/v1/files/serve/feee7306-8d5a-4dc9-8a11-35031121680f`, // giang-sinh.webp
];

export const ZAPY_STICKERS = [
  `${PUBLIC_API_URL}/api/v1/files/serve/10909dd9-6d2f-4134-8f24-602aa84e190e`,
  `${PUBLIC_API_URL}/api/v1/files/serve/df92e9b9-ef3c-4fd8-8851-048d2aaab6c7`,
  `${PUBLIC_API_URL}/api/v1/files/serve/e0abefdb-8f82-46ee-9721-e1c824665a2c`,
  `${PUBLIC_API_URL}/api/v1/files/serve/f7f98f5f-1d1d-4959-8057-48db1c283883`,
  `${PUBLIC_API_URL}/api/v1/files/serve/338b3efe-c6cb-4324-84e3-9c5614c947e3`,
  `${PUBLIC_API_URL}/api/v1/files/serve/ae968d43-7219-4cae-aa06-8f7a39ed23b7`,
  `${PUBLIC_API_URL}/api/v1/files/serve/b1ad63e3-2bb0-4f0f-a40d-f52afcf11287`,
  `${PUBLIC_API_URL}/api/v1/files/serve/6a8bdbd1-4112-4a50-8a3e-3b9731007837`,
  `${PUBLIC_API_URL}/api/v1/files/serve/b80e75cd-d5bd-423f-b388-ef438e49d8cf`,
  `${PUBLIC_API_URL}/api/v1/files/serve/42e2edf7-bf8b-45b3-8aa4-2e7e675a297`,
  `${PUBLIC_API_URL}/api/v1/files/serve/0ad63eeb-4db6-4a8c-982b-f6985ca072a3`,
  `${PUBLIC_API_URL}/api/v1/files/serve/974e0371-3229-4eab-9a83-c3792f2f84e1`,
  `${PUBLIC_API_URL}/api/v1/files/serve/0fd5e752-66a7-4a75-afe3-70414afe1d88`,
];

export const BU_MAT_NGAO = [
  `${PUBLIC_API_URL}/api/v1/files/serve/18bc546a-0278-4d07-9b05-4abb62aa76c2`,
  `${PUBLIC_API_URL}/api/v1/files/serve/b07d13a0-c620-4ad0-b0a0-51eaa54c601c`,
  `${PUBLIC_API_URL}/api/v1/files/serve/942b6f64-8ebe-450f-812b-8dcd31b4131e`,
  `${PUBLIC_API_URL}/api/v1/files/serve/b42ce205-b8e4-4fdc-a44d-512423120bcb`,
  `${PUBLIC_API_URL}/api/v1/files/serve/ae5e6b6a-85eb-4d4d-a8c1-e8130ddf060`,
  `${PUBLIC_API_URL}/api/v1/files/serve/c4825162-a1c2-4e21-854a-89fbcda7c49b`,
  `${PUBLIC_API_URL}/api/v1/files/serve/b8431ef0-1bb7-4a24-bcbb-6799908b4a11`,
  `${PUBLIC_API_URL}/api/v1/files/serve/565c1fe2-4e42-4442-b1f3-0acfd134a5d6`,
  `${PUBLIC_API_URL}/api/v1/files/serve/442e9ed5-c449-44ee-a845-fad55b72efdc`,
  `${PUBLIC_API_URL}/api/v1/files/serve/070ae42c-c2f7-435e-a40f-84ba3ea43fe6`,
  `${PUBLIC_API_URL}/api/v1/files/serve/ecced96f-cf44-4d89-b55a-a1447cd48bf9`,
  `${PUBLIC_API_URL}/api/v1/files/serve/d807bbe5-26d5-4598-a90e-bf8803d4c20e`,
  `${PUBLIC_API_URL}/api/v1/files/serve/93d44c70-0fec-483c-b6c4-c850aaffecf3`,
  `${PUBLIC_API_URL}/api/v1/files/serve/2d8eee31-4aa1-4d94-9246-f1d48053a1b4`,
  `${PUBLIC_API_URL}/api/v1/files/serve/99f77cca-e1a2-4393-9325-15444a0d2a77`,
  `${PUBLIC_API_URL}/api/v1/files/serve/2f220f54-a138-43b7-b664-e666fbb5ec0d`,
  `${PUBLIC_API_URL}/api/v1/files/serve/6d303f92-0afb-4a3d-92c9-131205a4a70b`,
  `${PUBLIC_API_URL}/api/v1/files/serve/c0384d7a-c065-4741-8245-3a2c4a590ffd`,
  `${PUBLIC_API_URL}/api/v1/files/serve/bba4e1eb-604b-4ad3-bcaf-7651805e0364`,
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
