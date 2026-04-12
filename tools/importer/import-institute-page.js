/* eslint-disable */
/* global WebImporter */

import heroHealthcareParser from './parsers/hero-healthcare.js';
import cardsSpecialtiesParser from './parsers/cards-specialties.js';
import cardsNewsParser from './parsers/cards-news.js';

import cleanupTransformer from './transformers/northwell-cleanup.js';

const parsers = {
  'hero-healthcare': heroHealthcareParser,
  'cards-specialties': cardsSpecialtiesParser,
  'cards-news': cardsNewsParser,
};

const PAGE_TEMPLATE = {
  name: 'institute-page',
  description: 'Service institute landing page',
  blocks: [
    { name: 'hero-healthcare', instances: ['.nwhlit--cta-hero'] },
    { name: 'cards-specialties', instances: ['.nwhlit--card-grid'] },
    { name: 'cards-news', instances: ['.nwhlit-carousel--promo'] },
  ],
  sections: [],
};

const transformers = [cleanupTransformer];

function executeTransformers(hookName, element, payload) {
  const enhancedPayload = { ...payload, template: PAGE_TEMPLATE };
  transformers.forEach((fn) => {
    try { fn.call(null, hookName, element, enhancedPayload); } catch (e) { console.error(e); }
  });
}

function findBlocksOnPage(document, template) {
  const pageBlocks = [];
  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      elements.forEach((element) => {
        pageBlocks.push({ name: blockDef.name, selector, element });
      });
    });
  });
  console.log('Found ' + pageBlocks.length + ' block instances on page');
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const { document, url, html, params } = payload;
    const main = document.body;
    executeTransformers('beforeTransform', main, payload);
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
    pageBlocks.forEach((block) => {
      const parser = parsers[block.name];
      if (parser) {
        try { parser(block.element, { document, url, params }); } catch (e) { console.error(e); }
      }
    });
    executeTransformers('afterTransform', main, payload);
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '') || '/orthopaedic-institute'
    );
    return [{ element: main, path, report: { title: document.title, template: PAGE_TEMPLATE.name, blocks: pageBlocks.map((b) => b.name) } }];
  },
};
