/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-news. Base: cards.
 * Source: https://www.northwell.edu/
 * Selector: .nwhlit-carousel--promo
 * Container block: each card row = [image, text]
 * Model fields per card: image (reference), text (richtext)
 * Source: nwhlit-carousel-slide > nwhlit-card elements with image + heading link + description
 */
export default function parse(element, { document }) {
  // Find all carousel slides containing cards
  const slides = element.querySelectorAll('nwhlit-carousel-slide');

  const cells = [];

  slides.forEach((slide) => {
    const card = slide.querySelector('nwhlit-card, .nwhlit--card');
    if (!card) return;

    const img = card.querySelector('nwhlit-image img, img');
    const headingLink = card.querySelector('.nwhlit-card__title-heading a, h3 a');
    const description = card.querySelector('.nwhlit-card__content, nwhlit-typography.nwhlit-card__content');

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

    // Column 2: text (heading + description)
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
    if (description) {
      const p = document.createElement('p');
      p.textContent = description.textContent.trim();
      textCell.appendChild(p);
    }

    cells.push([imageCell, textCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-news', cells });
  element.replaceWith(block);
}
