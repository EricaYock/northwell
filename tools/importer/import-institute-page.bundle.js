var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-institute-page.js
  var import_institute_page_exports = {};
  __export(import_institute_page_exports, {
    default: () => import_institute_page_default
  });

  // tools/importer/parsers/hero-healthcare.js
  function parse(element, { document }) {
    const bgImage = element.querySelector('nwhlit-image[slot="background-image"] img, nwhlit-image img');
    const heading = element.querySelector("h2.hero-xl-cta__title, h2, h1");
    const description = element.querySelector('nwhlit-typography[variant="body-lg"] p, nwhlit-typography[slot="summary-text"] p');
    const ctaLink = element.querySelector(".temp-button-group a, nwhlit-button a");
    const cells = [];
    const imageCell = document.createDocumentFragment();
    imageCell.appendChild(document.createComment(" field:image "));
    if (bgImage) {
      const pic = document.createElement("picture");
      const img = document.createElement("img");
      img.src = bgImage.src;
      img.alt = bgImage.alt || "";
      pic.appendChild(img);
      imageCell.appendChild(pic);
    }
    cells.push([imageCell]);
    const textCell = document.createDocumentFragment();
    textCell.appendChild(document.createComment(" field:text "));
    if (heading) {
      const h2 = document.createElement("h2");
      h2.textContent = heading.textContent.trim();
      textCell.appendChild(h2);
    }
    if (description) {
      const p = document.createElement("p");
      p.textContent = description.textContent.trim();
      textCell.appendChild(p);
    }
    if (ctaLink) {
      const p = document.createElement("p");
      const a = document.createElement("a");
      a.href = ctaLink.href;
      a.textContent = ctaLink.textContent.trim();
      p.appendChild(a);
      textCell.appendChild(p);
    }
    cells.push([textCell]);
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-healthcare", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-specialties.js
  function parse2(element, { document }) {
    const cards = element.querySelectorAll("nwhlit-card, .nwhlit--card");
    const cells = [];
    cards.forEach((card) => {
      const img = card.querySelector("nwhlit-image img, img");
      const headingLink = card.querySelector("h3 a, .nwhlit-card__title-heading a");
      const imageCell = document.createDocumentFragment();
      imageCell.appendChild(document.createComment(" field:image "));
      if (img) {
        const pic = document.createElement("picture");
        const newImg = document.createElement("img");
        newImg.src = img.src;
        newImg.alt = img.alt || "";
        pic.appendChild(newImg);
        imageCell.appendChild(pic);
      }
      const textCell = document.createDocumentFragment();
      textCell.appendChild(document.createComment(" field:text "));
      if (headingLink) {
        const h3 = document.createElement("h3");
        const a = document.createElement("a");
        a.href = headingLink.href;
        a.textContent = headingLink.textContent.trim();
        h3.appendChild(a);
        textCell.appendChild(h3);
      }
      cells.push([imageCell, textCell]);
    });
    if (cells.length === 0) {
      const headings = element.querySelectorAll("h3");
      headings.forEach((h) => {
        const link = h.querySelector("a");
        if (link) {
          const imageCell = document.createDocumentFragment();
          imageCell.appendChild(document.createComment(" field:image "));
          const textCell = document.createDocumentFragment();
          textCell.appendChild(document.createComment(" field:text "));
          const h3 = document.createElement("h3");
          const a = document.createElement("a");
          a.href = link.href;
          a.textContent = link.textContent.trim();
          h3.appendChild(a);
          textCell.appendChild(h3);
          cells.push([imageCell, textCell]);
        }
      });
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-specialties", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-news.js
  function parse3(element, { document }) {
    const slides = element.querySelectorAll("nwhlit-carousel-slide");
    const cells = [];
    slides.forEach((slide) => {
      const card = slide.querySelector("nwhlit-card, .nwhlit--card");
      if (!card) return;
      const img = card.querySelector("nwhlit-image img, img");
      const headingLink = card.querySelector(".nwhlit-card__title-heading a, h3 a");
      const description = card.querySelector(".nwhlit-card__content, nwhlit-typography.nwhlit-card__content");
      const imageCell = document.createDocumentFragment();
      imageCell.appendChild(document.createComment(" field:image "));
      if (img) {
        const pic = document.createElement("picture");
        const newImg = document.createElement("img");
        newImg.src = img.src;
        newImg.alt = img.alt || "";
        pic.appendChild(newImg);
        imageCell.appendChild(pic);
      }
      const textCell = document.createDocumentFragment();
      textCell.appendChild(document.createComment(" field:text "));
      if (headingLink) {
        const h3 = document.createElement("h3");
        const a = document.createElement("a");
        a.href = headingLink.href;
        a.textContent = headingLink.textContent.trim();
        h3.appendChild(a);
        textCell.appendChild(h3);
      }
      if (description) {
        const p = document.createElement("p");
        p.textContent = description.textContent.trim();
        textCell.appendChild(p);
      }
      cells.push([imageCell, textCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-news", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/northwell-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        '[class*="cookie"]',
        "#onetrust-consent-sdk"
      ]);
      WebImporter.DOMUtils.remove(element, [
        "div.hidden"
      ]);
      WebImporter.DOMUtils.remove(element, [
        "a.visually-hidden"
      ]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        "header.site-header",
        "header.root-site-header",
        "header"
      ]);
      WebImporter.DOMUtils.remove(element, [
        "footer",
        ".nwhlit-footer__nav",
        ".nwhlit-footer-social",
        ".nwhlit-footer-compliance",
        ".nwhlit-footer-aside"
      ]);
      WebImporter.DOMUtils.remove(element, [
        ".mobile-tray",
        ".mobile-login-nav",
        ".mega-menu",
        ".compressed-nav",
        ".site-links"
      ]);
      WebImporter.DOMUtils.remove(element, [
        ".search-nav__wrapper",
        ".search-form__group-wrapper"
      ]);
      WebImporter.DOMUtils.remove(element, [
        "iframe",
        "link",
        "noscript"
      ]);
      element.querySelectorAll("*").forEach((el) => {
        el.removeAttribute("data-track");
        el.removeAttribute("onclick");
        el.removeAttribute("data-drupal-messages-fallback");
      });
    }
  }

  // tools/importer/import-institute-page.js
  var parsers = {
    "hero-healthcare": parse,
    "cards-specialties": parse2,
    "cards-news": parse3
  };
  var PAGE_TEMPLATE = {
    name: "institute-page",
    description: "Service institute landing page",
    blocks: [
      { name: "hero-healthcare", instances: [".nwhlit--cta-hero"] },
      { name: "cards-specialties", instances: [".nwhlit--card-grid"] },
      { name: "cards-news", instances: [".nwhlit-carousel--promo"] }
    ],
    sections: []
  };
  var transformers = [transform];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), { template: PAGE_TEMPLATE });
    transformers.forEach((fn) => {
      try {
        fn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(e);
      }
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
    console.log("Found " + pageBlocks.length + " block instances on page");
    return pageBlocks;
  }
  var import_institute_page_default = {
    transform: (payload) => {
      const { document, url, html, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        const parser = parsers[block.name];
        if (parser) {
          try {
            parser(block.element, { document, url, params });
          } catch (e) {
            console.error(e);
          }
        }
      });
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "") || "/orthopaedic-institute"
      );
      return [{ element: main, path, report: { title: document.title, template: PAGE_TEMPLATE.name, blocks: pageBlocks.map((b) => b.name) } }];
    }
  };
  return __toCommonJS(import_institute_page_exports);
})();
