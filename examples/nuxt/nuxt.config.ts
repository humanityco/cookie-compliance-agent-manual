export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: false },
  css: ["~/assets/main.css"],
  app: {
    head: {
      title: "Cookie Compliance",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
      ],
      script: [
        {
          innerHTML:
            'var huOptions = { "appID": "YOUR_APP_ID", "currentLanguage": "en", "blocking": true, "globalCookie": false };',
          type: "text/javascript",
          tagPosition: "head",
          tagPriority: -20,
        },
        {
          src: "https://cdn.hu-manity.co/v2/hu-banner.min.js",
          type: "text/javascript",
          tagPosition: "head",
          tagPriority: -19,
        },
        {
          src: "https://www.googletagmanager.com/gtag/js?id=G-XXXX",
          type: "text/javascript",
          tagPosition: "head",
          tagPriority: -18,
        },
      ],
    },
  },
});
