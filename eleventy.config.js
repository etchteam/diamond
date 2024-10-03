import browserslist from 'browserslist';
import { transform, browserslistToTargets } from 'lightningcss';
import webc from '@11ty/eleventy-plugin-webc';
import syntaxHighlight from '@11ty/eleventy-plugin-syntaxhighlight';
import renderSvg from './lib/renderSvg.js';

async function transformCSS(content) {
  if (this.type !== 'css') {
    return content;
  }

  const targets = browserslistToTargets(browserslist('> 0.25% and not dead'));
  const { code } = transform({
    code: Buffer.from(content),
    minify: true,
    sourceMap: false,
    targets,
  });

  return code;
}

export default function(eleventyConfig) {
  // copy the assets folder to the output directory
  eleventyConfig.addPassthroughCopy('src/assets');
  // Reloading on css changes
  eleventyConfig.addWatchTarget('src/styles/*.css');
  // make the renderSvg function available globally in templates
  eleventyConfig.addJavaScriptFunction('renderSvg', renderSvg);
  // load all components added to the src/components directory
  eleventyConfig.addPlugin(webc, {
    components: 'src/components/**/*.webc',
    bundlePluginOptions: {
      transforms: [transformCSS],
    },
  });
  // add syntax highlighting to code blocks
	eleventyConfig.addPlugin(syntaxHighlight);

  return {
    dir: {
      layouts: 'layouts',
      includes: 'components',
      data: 'data',
      input: 'src',
      output: 'dist'
    }
  }
};