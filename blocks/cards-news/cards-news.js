import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-news-card-image';
      else div.className = 'cards-news-card-body';
    });
    ul.append(li);
  });
  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });

  block.textContent = '';

  // carousel wrapper
  const track = document.createElement('div');
  track.className = 'cards-news-track';
  track.append(ul);

  // nav arrows
  const prevBtn = document.createElement('button');
  prevBtn.className = 'cards-news-prev';
  prevBtn.setAttribute('aria-label', 'Previous');
  prevBtn.innerHTML = '&#8249;';

  const nextBtn = document.createElement('button');
  nextBtn.className = 'cards-news-next';
  nextBtn.setAttribute('aria-label', 'Next');
  nextBtn.innerHTML = '&#8250;';

  block.append(prevBtn, track, nextBtn);

  // carousel logic
  let currentIndex = 0;
  const items = ul.querySelectorAll(':scope > li');
  const totalItems = items.length;

  function getVisibleCount() {
    if (window.innerWidth >= 900) return 3;
    if (window.innerWidth >= 600) return 2;
    return 1;
  }

  function updateCarousel() {
    const visibleCount = getVisibleCount();
    const maxIndex = Math.max(0, totalItems - visibleCount);
    if (currentIndex > maxIndex) currentIndex = maxIndex;
    if (currentIndex < 0) currentIndex = 0;

    const percentage = -(currentIndex * (100 / visibleCount));
    ul.style.transform = `translateX(${percentage}%)`;

    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex >= maxIndex;
  }

  prevBtn.addEventListener('click', () => {
    currentIndex -= 1;
    updateCarousel();
  });

  nextBtn.addEventListener('click', () => {
    currentIndex += 1;
    updateCarousel();
  });

  window.addEventListener('resize', () => updateCarousel());
  updateCarousel();
}
