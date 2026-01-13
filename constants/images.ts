export const BUSINESS_IMAGES = {
    bgms: "/assets/row1.jpg",
    ivd: "/assets/row2.jpg",
    tooling: "/assets/row3.jpg",
} as const;

export type BusinessAreaId = keyof typeof BUSINESS_IMAGES;
