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

  // tools/importer/import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
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
      const source = document.createElement("source");
      source.setAttribute("type", "image/webp");
      source.setAttribute("srcset", bgImage.src);
      pic.appendChild(source);
      const img = document.createElement("img");
      img.setAttribute("src", bgImage.src);
      img.setAttribute("alt", bgImage.alt || "");
      img.setAttribute("loading", "eager");
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

  // tools/importer/parsers/cards-actions.js
  function parse2(element, { document }) {
    const heading = element.querySelector("h4 a, h4, nwhlit-link h4 a");
    const description = element.querySelector('nwhlit-typography[slot="description"] p, nwhlit-typography[variant="body-lg"] p, nwhlit-typography[slot="description"]');
    const cells = [];
    const imageCell = document.createDocumentFragment();
    imageCell.appendChild(document.createComment(" field:image "));
    const textCell = document.createDocumentFragment();
    textCell.appendChild(document.createComment(" field:text "));
    if (heading) {
      const h4 = document.createElement("h4");
      if (heading.tagName === "A") {
        const a = document.createElement("a");
        a.href = heading.href;
        a.textContent = heading.textContent.trim();
        h4.appendChild(a);
      } else {
        const link = heading.querySelector("a");
        if (link) {
          const a = document.createElement("a");
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
      const p = document.createElement("p");
      p.textContent = description.textContent.trim();
      textCell.appendChild(p);
    }
    cells.push([imageCell, textCell]);
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-actions", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-specialties.js
  function parse3(element, { document }) {
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
  function parse4(element, { document }) {
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

  // tools/importer/parsers/columns-stats.js
  function parse5(element, { document }) {
    const heading = element.querySelector(':scope > nwhlit-typography[variant="display-lg"], :scope > nwhlit-typography:first-of-type');
    const description = element.querySelector(':scope > nwhlit-typography[variant="body-lg"], :scope > nwhlit-typography:nth-of-type(2)');
    const ctaLink = element.querySelector("nwhlit-button a, a");
    const col1 = document.createDocumentFragment();
    if (heading) {
      const h2 = document.createElement("h2");
      h2.textContent = heading.textContent.trim();
      col1.appendChild(h2);
    }
    if (description) {
      const p = document.createElement("p");
      p.textContent = description.textContent.trim();
      col1.appendChild(p);
    }
    if (ctaLink) {
      const p = document.createElement("p");
      const a = document.createElement("a");
      a.href = ctaLink.href;
      a.textContent = ctaLink.textContent.trim();
      p.appendChild(a);
      col1.appendChild(p);
    }
    const statItems = element.querySelectorAll("nwhlit-xl-stat, .nwh--xl-stat");
    const col2 = document.createDocumentFragment();
    const ul = document.createElement("ul");
    statItems.forEach((stat) => {
      const li = document.createElement("li");
      const statValue = stat.getAttribute("stat") || "";
      const statSuffix = stat.getAttribute("stat-suffix") || "";
      const label = stat.querySelector("span");
      const labelText = label ? label.textContent.trim() : "";
      li.textContent = `${statValue}${statSuffix} ${labelText}`;
      ul.appendChild(li);
    });
    if (ul.children.length > 0) {
      col2.appendChild(ul);
    }
    const cells = [[col1, col2]];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-stats", cells });
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

  // tools/importer/transformers/northwell-sections.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName === TransformHook2.afterTransform) {
      const { template } = payload;
      if (!template || !template.sections || template.sections.length < 2) return;
      const { document } = element.ownerDocument ? { document: element.ownerDocument } : { document: element.getRootNode() };
      const sections = [...template.sections].reverse();
      sections.forEach((section) => {
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
        if (section.style) {
          const sectionMetadata = WebImporter.Blocks.createBlock(document, {
            name: "Section Metadata",
            cells: {
              style: section.style
            }
          });
          sectionEl.after(sectionMetadata);
        }
        if (section.id !== template.sections[0].id) {
          const hr = document.createElement("hr");
          sectionEl.before(hr);
        }
      });
    }
  }

  // tools/importer/import-homepage.js
  var parsers = {
    "hero-healthcare": parse,
    "cards-actions": parse2,
    "cards-specialties": parse3,
    "cards-news": parse4,
    "columns-stats": parse5
  };
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "Main homepage with hero, featured services, news, and promotional content",
    urls: [
      "https://www.northwell.edu/"
    ],
    blocks: [
      {
        name: "hero-healthcare",
        instances: [".nwh--xl-cta-hero"]
      },
      {
        name: "cards-actions",
        instances: [".nwhlit--icon-promo"]
      },
      {
        name: "cards-specialties",
        instances: ["section .nwhlit--card-grid"]
      },
      {
        name: "columns-stats",
        instances: [".nwh--xl-stat-ticker"]
      },
      {
        name: "cards-news",
        instances: [".nwhlit-carousel--promo"]
      }
    ],
    sections: [
      {
        id: "section-1",
        name: "Hero Section",
        selector: ".nwh--xl-cta-hero",
        style: null,
        blocks: ["hero-healthcare"],
        defaultContent: []
      },
      {
        id: "section-2",
        name: "Quick Actions Section",
        selector: ".nwhlit--card-grid:first-of-type",
        style: null,
        blocks: ["cards-actions"],
        defaultContent: []
      },
      {
        id: "section-3",
        name: "MyNorthwell Promo Banner",
        selector: ".nwhlit--cta-hero",
        style: "dark",
        blocks: [],
        defaultContent: [".nwhlit--cta-hero"]
      },
      {
        id: "section-4",
        name: "Areas of Care Section",
        selector: "section .nwhlit--card-grid",
        style: null,
        blocks: ["cards-specialties"],
        defaultContent: ["h3"]
      },
      {
        id: "section-5",
        name: "Awards and Stats Section",
        selector: ".nwh--xl-stat-ticker",
        style: "dark",
        blocks: ["columns-stats"],
        defaultContent: []
      },
      {
        id: "section-6",
        name: "Breakthroughs and News Section",
        selector: ".nwhlit-carousel--promo",
        style: null,
        blocks: ["cards-news"],
        defaultContent: ["h3", "p"]
      },
      {
        id: "section-7",
        name: "Gun Violence Prevention CTA",
        selector: ".nwhlit--cta-hero:last-of-type",
        style: "accent",
        blocks: [],
        defaultContent: [".nwhlit--cta-hero:last-of-type"]
      }
    ]
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  function findBlocksOnPage(document, template) {
    const pageBlocks = [];
    template.blocks.forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        const elements = document.querySelectorAll(selector);
        if (elements.length === 0) {
          console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
        }
        elements.forEach((element) => {
          pageBlocks.push({
            name: blockDef.name,
            selector,
            element,
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_homepage_default = {
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
            console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
          }
        } else {
          console.warn(`No parser found for block: ${block.name}`);
        }
      });
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "") || "/index"
      );
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_homepage_exports);
})();
