/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-specialties. Base: cards.
 * Source: https://www.northwell.edu/
 * Selector: section .nwhlit--card-grid (second instance = areas of care)
 * Container block: each card row = [image, text]
 * Model fields per card: image (reference), text (richtext)
 * Source: nwhlit-card elements within second card-grid with image + heading link
 */
export default function parse(element, { document }) {
  // Find all card items within the grid
  const cards = element.querySelectorAll('nwhlit-card, .nwhlit--card');

  const cells = [];

  cards.forEach((card) => {
    const img = card.querySelector('nwhlit-image img, img');
    const headingLink = card.querySelector('h3 a, .nwhlit-card__title-heading a');

    // Column 1: image
    const imageCell = document.createDocumentFragment();
    imageCell.appendChild(document.createComment(' field:image '));
    if (img) {
      const pic = document.createElement('picture');
      const newImg = document.createElement('img');
      newImg.src = img.src;
      newImg.alt = img.alt || '';
      pic.appendChild(newImg);
      imageCell.appendChild(pic);
    }

    // Column 2: text (heading link)
    const textCell = document.createDocumentFragment();
    textCell.appendChild(document.createComment(' field:text '));
    if (headingLink) {
      const h3 = document.createElement('h3');
      const a = document.createElement('a');
      a.href = headingLink.href;
      a.textContent = headingLink.textContent.trim();
      h3.appendChild(a);
      textCell.appendChild(h3);
    }

    cells.push([imageCell, textCell]);
  });

  // If no cards found via nwhlit-card, try direct heading links (e.g. Pediatrics, Transplant with no card wrapper)
  if (cells.length === 0) {
    const headings = element.querySelectorAll('h3');
    headings.forEach((h) => {
      const link = h.querySelector('a');
      if (link) {
        const imageCell = document.createDocumentFragment();
        imageCell.appendChild(document.createComment(' field:image '));

        const textCell = document.createDocumentFragment();
        textCell.appendChild(document.createComment(' field:text '));
        const h3 = document.createElement('h3');
        const a = document.createElement('a');
        a.href = link.href;
        a.textContent = link.textContent.trim();
        h3.appendChild(a);
        textCell.appendChild(h3);

        cells.push([imageCell, textCell]);
      }
    });
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-specialties', cells });
  element.replaceWith(block);
}
