import browserslist from 'browserslist';
import { transform, browserslistToTargets } from 'lightningcss';
import markdownIt from 'markdown-it';
import { eleventyImagePlugin } from '@11ty/eleventy-img';
import webc from '@11ty/eleventy-plugin-webc';
import syntaxHighlight from '@11ty/eleventy-plugin-syntaxhighlight';
import renderSvg from './lib/renderSvg.js';
import findCollectionItem from './lib/findCollectionItem.js';

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
  // make functions available globally in templates
  eleventyConfig.addJavaScriptFunction('renderSvg', renderSvg);
  eleventyConfig.addJavaScriptFunction('findCollectionItem', findCollectionItem);
  // support eleventy-image https://www.11ty.dev/docs/plugins/image
  eleventyConfig.addPlugin(eleventyImagePlugin, {
    formats: ['webp'],
    widths: [800, 1600],
    urkPath: '/assets/images/',
    defaultAttributes: {
      sizes: '100vw',
      loading: 'lazy',
    },
  });
  // load all components added to the src/components directory
  eleventyConfig.addPlugin(webc, {
    components: [
      'src/components/**/*.webc',
      'npm:@11ty/eleventy-img/*.webc',
    ],
    bundlePluginOptions: {
      transforms: [transformCSS],
    },
  });
  // Support markdown templates in webc using <template webc:type="11ty" 11ty:type="md">
	eleventyConfig.setLibrary('md', markdownIt({
		html: true,
		breaks: true,
		linkify: true,
	}));
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