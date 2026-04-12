/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-healthcare. Base: hero.
 * Source: https://www.northwell.edu/
 * Selector: .nwh--xl-cta-hero
 * Model fields: image (reference, collapsed: imageAlt), text (richtext)
 * Structure: Row 1 = background image, Row 2 = text content (heading + description + CTA)
 */
export default function parse(element, { document }) {
  // Row 1: Background image (found: nwhlit-image[slot="background-image"] > img)
  const bgImage = element.querySelector('nwhlit-image[slot="background-image"] img, nwhlit-image img');

  // Row 2: Text content - heading, description, CTA
  const heading = element.querySelector('h2.hero-xl-cta__title, h2, h1');
  const description = element.querySelector('nwhlit-typography[variant="body-lg"] p, nwhlit-typography[slot="summary-text"] p');
  const ctaLink = element.querySelector('.temp-button-group a, nwhlit-button a');

  const cells = [];

  // Row 1: image (reference field - must use <picture><img> not <p><img>)
  const imageCell = document.createDocumentFragment();
  imageCell.appendChild(document.createComment(' field:image '));
  if (bgImage) {
    const pic = document.createElement('picture');
    const source = document.createElement('source');
    source.setAttribute('type', 'image/webp');
    source.setAttribute('srcset', bgImage.src);
    pic.appendChild(source);
    const img = document.createElement('img');
    img.setAttribute('src', bgImage.src);
    img.setAttribute('alt', bgImage.alt || '');
    img.setAttribute('loading', 'eager');
    pic.appendChild(img);
    imageCell.appendChild(pic);
  }
  cells.push([imageCell]);

  // Row 2: text (richtext - heading + description + CTA)
  const textCell = document.createDocumentFragment();
  textCell.appendChild(document.createComment(' field:text '));
  if (heading) {
    const h2 = document.createElement('h2');
    h2.textContent = heading.textContent.trim();
    textCell.appendChild(h2);
  }
  if (description) {
    const p = document.createElement('p');
    p.textContent = description.textContent.trim();
    textCell.appendChild(p);
  }
  if (ctaLink) {
    const p = document.createElement('p');
    const a = document.createElement('a');
    a.href = ctaLink.href;
    a.textContent = ctaLink.textContent.trim();
    p.appendChild(a);
    textCell.appendChild(p);
  }
  cells.push([textCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-healthcare', cells });
  element.replaceWith(block);
}
