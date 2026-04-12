/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroHealthcareParser from './parsers/hero-healthcare.js';
import cardsActionsParser from './parsers/cards-actions.js';
import cardsSpecialtiesParser from './parsers/cards-specialties.js';
import cardsNewsParser from './parsers/cards-news.js';
import columnsStatsParser from './parsers/columns-stats.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/northwell-cleanup.js';
import sectionsTransformer from './transformers/northwell-sections.js';

// PARSER REGISTRY
const parsers = {
  'hero-healthcare': heroHealthcareParser,
  'cards-actions': cardsActionsParser,
  'cards-specialties': cardsSpecialtiesParser,
  'cards-news': cardsNewsParser,
  'columns-stats': columnsStatsParser,
};

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  name: 'homepage',
  description: 'Main homepage with hero, featured services, news, and promotional content',
  urls: [
    'https://www.northwell.edu/',
  ],
  blocks: [
    {
      name: 'hero-healthcare',
      instances: ['.nwh--xl-cta-hero'],
    },
    {
      name: 'cards-actions',
      instances: ['.nwhlit--icon-promo'],
    },
    {
      name: 'cards-specialties',
      instances: ['section .nwhlit--card-grid'],
    },
    {
      name: 'columns-stats',
      instances: ['.nwh--xl-stat-ticker'],
    },
    {
      name: 'cards-news',
      instances: ['.nwhlit-carousel--promo'],
    },
  ],
  sections: [
    {
      id: 'section-1',
      name: 'Hero Section',
      selector: '.nwh--xl-cta-hero',
      style: null,
      blocks: ['hero-healthcare'],
      defaultContent: [],
    },
    {
      id: 'section-2',
      name: 'Quick Actions Section',
      selector: '.nwhlit--card-grid:first-of-type',
      style: null,
      blocks: ['cards-actions'],
      defaultContent: [],
    },
    {
      id: 'section-3',
      name: 'MyNorthwell Promo Banner',
      selector: '.nwhlit--cta-hero',
      style: 'dark',
      blocks: [],
      defaultContent: ['.nwhlit--cta-hero'],
    },
    {
      id: 'section-4',
      name: 'Areas of Care Section',
      selector: 'section .nwhlit--card-grid',
      style: null,
      blocks: ['cards-specialties'],
      defaultContent: ['h3'],
    },
    {
      id: 'section-5',
      name: 'Awards and Stats Section',
      selector: '.nwh--xl-stat-ticker',
      style: 'dark',
      blocks: ['columns-stats'],
      defaultContent: [],
    },
    {
      id: 'section-6',
      name: 'Breakthroughs and News Section',
      selector: '.nwhlit-carousel--promo',
      style: null,
      blocks: ['cards-news'],
      defaultContent: ['h3', 'p'],
    },
    {
      id: 'section-7',
      name: 'Gun Violence Prevention CTA',
      selector: '.nwhlit--cta-hero:last-of-type',
      style: 'accent',
      blocks: [],
      defaultContent: ['.nwhlit--cta-hero:last-of-type'],
    },
  ],
};

// TRANSFORMER REGISTRY
const transformers = [
  cleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [sectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const { document, url, html, params } = payload;

    const main = document.body;

    // 1. Execute beforeTransform transformers (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
    pageBlocks.forEach((block) => {
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. Execute afterTransform transformers (final cleanup + section breaks/metadata)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '') || '/index'
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
