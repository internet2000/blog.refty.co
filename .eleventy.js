const site =  require('./_data/site.js')
const Image = require("@11ty/eleventy-img");

// images
async function imageShortcode(src, alt, ...widths) {
  let metadata = await Image(__dirname + src, {
    widths,
    //widths: [600, 1000],
    formats: ["webp", "jpeg"],
    urlPath: '/uploads/',
    outputDir: __dirname + '/uploads/'
  });

  let imageAttributes = {
    alt,
    //sizes: `(min-width: ${widths[0]}px)`,
    sizes: [],
    loading: "lazy",
    decoding: "async",
  };

  // You bet we throw an error on missing alt in `imageAttributes` (alt="" works okay)
  return Image.generateHTML(metadata, imageAttributes);
}
// /images

module.exports = function(eleventyConfig) {
  // shortcodes
  eleventyConfig.addLiquidShortcode("image", imageShortcode)

  // collections
  eleventyConfig.addCollection('categories', function(collectionApi) {
    const tags = collectionApi.getAll()
      .flatMap(item => item.data.categories)
      .filter(tag => !!tag)
    // remove duplicates using Set
    return [...new Set(tags)]
  })
  // slideshow
  eleventyConfig.addPassthroughCopy({
    'node_modules/@splidejs/splide/dist/js': 'js',
    'node_modules/@splidejs/splide/dist/css': 'css',
  })
  const sitemap = require("@quasibit/eleventy-plugin-sitemap")
  eleventyConfig.addPlugin(sitemap, {
    sitemap: {
      hostname: 'https://blog.refty.co',
    },
  })
  const blogTools = require("eleventy-plugin-blog-tools")
  eleventyConfig.addPlugin(blogTools)

  // languages
  eleventyConfig.addFilter('lang', (collection, lang) => {
    return collection.filter(c => c.data.tags.includes(lang))
  })

  // copy folders
  eleventyConfig.addPassthroughCopy('assets')
  eleventyConfig.addPassthroughCopy('uploads')
  eleventyConfig.addPassthroughCopy('images')
  eleventyConfig.addPassthroughCopy('css/*.css')
  eleventyConfig.addPassthroughCopy('css/*.jpg') // favicon
  eleventyConfig.addPassthroughCopy('css/*.png') // favicon
  eleventyConfig.addPassthroughCopy('css/*.ico') // favicon
  eleventyConfig.addPassthroughCopy('js')
  eleventyConfig.addPassthroughCopy('CNAME')
  eleventyConfig.addPassthroughCopy('robots.txt')

  // other config
  return {
    dir: {
      layouts: '_layouts',
      includes: '_includes',
    },
  }
}
