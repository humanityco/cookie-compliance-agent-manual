export default function (eleventyConfig) {
  eleventyConfig.setServerOptions({
    port: 8099,
    liveReload: false,
    domDiff: false,
  });

  return {
    dir: {
      input: "src",
      includes: "_includes",
      output: "dist",
    },
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: false,
  };
}
