/**
 * Editorial photography for the home page.
 * TEMPORARY: these are the concept images from the design mock-up, served from
 * Google's image CDN. Replace them with Ayyara's own photography (ideally files
 * in /public) before launch.
 */
const cdn = (id: string) => `https://lh3.googleusercontent.com/aida-public/${id}`;

export const imagery = {
  hero: {
    src: cdn('AB6AXuBjwpX18_JwYDy5QOX-FRDJvLmftD_sdLd8G564-n0Yj2CrD0gRC9Vpi1REDMIyiQkkbC1mJ1ic6Yf2HgpiRp79gM_UgFziMlD4irBy6Ee0Y1z3n9ZzBmp4M0XWhxaaJe4uCg8F43d3m8TYPgHPsDbtv2h4gAXv71uaTVOIJe8MsJww4pQa0rYJ3cHVxdg28XN1RImZX4PdaBJ11fyBK0sI5FntTj4mmOAKREinD5HVIuCfi316xZZWrA'),
    alt: 'Ayyara fine fragrances resting on lakeside stone with a volcanic mountain vista',
  },
  men: {
    src: cdn('AB6AXuBAbVAvaOtRd3w6utdeD2NcWwVeLfkk3ynJg-RplIC3wOdK_cdpDUXAkZVT0T-jk_JhWvYNSAe2ivmGXWw7OxXLRksHRWn8lJ4m26-OBSH8hoeWjMT5GAdEJ8zeNShxM8z-_Sfj9la4Gm_uLw6qcy4GhWQIh_ynfCDlPifBfKIH8e_Z3d5mVa9haLOKMfW1mHlcBcRuSb56s6LVNJGy63cTFFZUie_EICtilDK1aD2WeBalPEgfiLP25A'),
    alt: 'Men’s perfume still life on dark black satin',
  },
  women: {
    src: cdn('AB6AXuDQ8j5f29HYBIjm-Bv4TVQ2zrAdlWM49ktym2VBLzCXrGvLK9V1goaRXXI1pJZdLL8QvSGN_CbAxaziJlNR90R1tgldsay3VhAGjCcSZZbeyY_djnC8IivftlA5lwOyoBf-a6QUKU3lvOv811YWlUf9AkxzMvMUAGp1_KkSIBsReFLC5s1T7Klb75kOY718sPwZ858AbKkxZe2KIGqCMZnVZER5o3oTlGvanBzF9oho5VM9COXFws41Jw'),
    alt: 'Women’s perfume still life on draped silk with a pearl necklace',
  },
  story: {
    src: cdn('AB6AXuBNSF3osUcfDahVgVaf-pz2wHDo9MdFIbVxSM-E8mO1tCc8sEP-gHNbMrbapB4IDmqRuNmDFIv4YXWWrfaTbxCJNiEhFKx9kSPiGaqn0SXPJHaaMwEpg2fBBhSe_Pm445TvoAYEk9pMHboX_mGSmu_CKbWLxZyh0AtmL1iIaihH8OmL1Km4GF8wLvMUNhTsjzAbk0VmRs79ncyw9V0keDeU9fxwKDB-1MFr0WnIL7iZkNLu09uMy60S7g'),
    alt: 'Artisanal basket with an Ayyara perfume surrounded by fresh fruit',
  },
  bestSellers: {
    src: cdn('AB6AXuDMiSmPgRLpLvNps7zoDpPjH1Gxd3jZg3h5kppEfIPe29Ov3JK7a8UT4hCr9hRaW1F85fYbhv5yYqcXLEcNDnqBAqBR5616bijpa80etjjoTx1YeV5KV3x9mv6jecJGK1kXfCUUJvI2a1pwcEC6LZCqVTrrhwVPtFIyh656X4LXy4NTDeoGhKe-w8--WBc4wv1qEW4LrCAddpxSJ58eIdi7VVxeJr90ksG-uWLR56DhIEYRFeOP3WOalw'),
    alt: 'Classical bust sculpture styled with an Ayyara fragrance',
  },
} as const;
