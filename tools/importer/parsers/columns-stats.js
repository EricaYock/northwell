/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-stats. Base: columns.
 * Source: https://www.northwell.edu/
 * Selector: .nwh--xl-stat-ticker
 * Columns block - NO field hints needed per xwalk hinting rules
 * Structure: 2 columns - Col 1: heading + description + CTA, Col 2: stats list
 * Source: nwhlit-xl-stat-ticker with typography headings, description, button, and nwhlit-xl-stat items
 */
export default function parse(element, { document }) {
  // Column 1: heading + description + CTA link
  const heading = element.querySelector(':scope > nwhlit-typography[variant="display-lg"], :scope > nwhlit-typography:first-of-type');
  const description = element.querySelector(':scope > nwhlit-typography[variant="body-lg"], :scope > nwhlit-typography:nth-of-type(2)');
  const ctaLink = element.querySelector('nwhlit-button a, a');

  const col1 = document.createDocumentFragment();
  if (heading) {
    const h2 = document.createElement('h2');
    h2.textContent = heading.textContent.trim();
    col1.appendChild(h2);
  }
  if (description) {
    const p = document.createElement('p');
    p.textContent = description.textContent.trim();
    col1.appendChild(p);
  }
  if (ctaLink) {
    const p = document.createElement('p');
    const a = document.createElement('a');
    a.href = ctaLink.href;
    a.textContent = ctaLink.textContent.trim();
    p.appendChild(a);
    col1.appendChild(p);
  }

  // Column 2: stat items
  const statItems = element.querySelectorAll('nwhlit-xl-stat, .nwh--xl-stat');
  const col2 = document.createDocumentFragment();
  const ul = document.createElement('ul');

  statItems.forEach((stat) => {
    const li = document.createElement('li');
    const statValue = stat.getAttribute('stat') || '';
    const statSuffix = stat.getAttribute('stat-suffix') || '';
    const label = stat.querySelector('span');
    const labelText = label ? label.textContent.trim() : '';
    li.textContent = `${statValue}${statSuffix} ${labelText}`;
    ul.appendChild(li);
  });

  if (ul.children.length > 0) {
    col2.appendChild(ul);
  }

  const cells = [[col1, col2]];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-stats', cells });
  element.replaceWith(block);
}
