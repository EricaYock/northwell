/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Northwell Health section breaks and section-metadata.
 * Runs in afterTransform only. Uses payload.template.sections from page-templates.json.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.afterTransform) {
    const { template } = payload;
    if (!template || !template.sections || template.sections.length < 2) return;

    const { document } = element.ownerDocument ? { document: element.ownerDocument } : { document: element.getRootNode() };

    // Process sections in reverse order to avoid position shifts
    const sections = [...template.sections].reverse();

    sections.forEach((section) => {
      // Try to find the section element using its selector
      let sectionSelector = section.selector;
      let sectionEl = null;

      if (Array.isArray(sectionSelector)) {
        for (const sel of sectionSelector) {
          sectionEl = element.querySelector(sel);
          if (sectionEl) break;
        }
      } else {
        sectionEl = element.querySelector(sectionSelector);
      }

      if (!sectionEl) return;

      // Add section-metadata block if section has a style
      if (section.style) {
        const sectionMetadata = WebImporter.Blocks.createBlock(document, {
          name: 'Section Metadata',
          cells: {
            style: section.style,
          },
        });
        sectionEl.after(sectionMetadata);
      }

      // Add section break (hr) before section element if not the first section
      // and if there is content before it
      if (section.id !== template.sections[0].id) {
        const hr = document.createElement('hr');
        sectionEl.before(hr);
      }
    });
  }
}
