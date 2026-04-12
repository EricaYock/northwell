/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-actions. Base: cards.
 * Source: https://www.northwell.edu/
 * Selector: .nwhlit--icon-promo
 * Container block: each card row = [image, text]
 * Model fields per card: image (reference), text (richtext)
 * Source: nwhlit-icon-promo elements with h4 heading link + description
 */
export default function parse(element, { document }) {
  // Each icon-promo is one card (no image, just text)
  const heading = element.querySelector('h4 a, h4, nwhlit-link h4 a');
  const description = element.querySelector('nwhlit-typography[slot="description"] p, nwhlit-typography[variant="body-lg"] p, nwhlit-typography[slot="description"]');

  const cells = [];

  // Column 1: image (empty for action cards)
  const imageCell = document.createDocumentFragment();
  imageCell.appendChild(document.createComment(' field:image '));

  // Column 2: text (heading + description)
  const textCell = document.createDocumentFragment();
  textCell.appendChild(document.createComment(' field:text '));
  if (heading) {
    const h4 = document.createElement('h4');
    if (heading.tagName === 'A') {
      const a = document.createElement('a');
      a.href = heading.href;
      a.textContent = heading.textContent.trim();
      h4.appendChild(a);
    } else {
      const link = heading.querySelector('a');
      if (link) {
        const a = document.createElement('a');
        a.href = link.href;
        a.textContent = link.textContent.trim();
        h4.appendChild(a);
      } else {
        h4.textContent = heading.textContent.trim();
      }
    }
    textCell.appendChild(h4);
  }
  if (description) {
    const p = document.createElement('p');
    p.textContent = description.textContent.trim();
    textCell.appendChild(p);
  }

  cells.push([imageCell, textCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-actions', cells });
  element.replaceWith(block);
}
