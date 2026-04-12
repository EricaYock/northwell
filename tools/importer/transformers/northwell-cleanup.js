/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Northwell Health cleanup
 * Selectors from captured DOM of www.northwell.edu
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Remove cookie consent banner (found: div with cookie policy text + Accept button)
    WebImporter.DOMUtils.remove(element, [
      '[class*="cookie"]',
      '#onetrust-consent-sdk',
    ]);

    // Remove hidden SVG sprites (found: div.hidden > svg#constellation-svg)
    WebImporter.DOMUtils.remove(element, [
      'div.hidden',
    ]);

    // Remove skip-to-content link (found: a.visually-hidden.focusable)
    WebImporter.DOMUtils.remove(element, [
      'a.visually-hidden',
    ]);
  }

  if (hookName === TransformHook.afterTransform) {
    // Remove site header/navigation (found: header.site-header.root-site-header)
    WebImporter.DOMUtils.remove(element, [
      'header.site-header',
      'header.root-site-header',
      'header',
    ]);

    // Remove site footer (found: div with footer classes nwhlit-footer__nav, nwhlit-footer-social, etc.)
    WebImporter.DOMUtils.remove(element, [
      'footer',
      '.nwhlit-footer__nav',
      '.nwhlit-footer-social',
      '.nwhlit-footer-compliance',
      '.nwhlit-footer-aside',
    ]);

    // Remove mobile nav elements (found: div.mobile-tray, div.mobile-login-nav)
    WebImporter.DOMUtils.remove(element, [
      '.mobile-tray',
      '.mobile-login-nav',
      '.mega-menu',
      '.compressed-nav',
      '.site-links',
    ]);

    // Remove search nav (found: search-form__group-wrapper)
    WebImporter.DOMUtils.remove(element, [
      '.search-nav__wrapper',
      '.search-form__group-wrapper',
    ]);

    // Remove non-content elements
    WebImporter.DOMUtils.remove(element, [
      'iframe',
      'link',
      'noscript',
    ]);

    // Remove data attributes
    element.querySelectorAll('*').forEach((el) => {
      el.removeAttribute('data-track');
      el.removeAttribute('onclick');
      el.removeAttribute('data-drupal-messages-fallback');
    });
  }
}
