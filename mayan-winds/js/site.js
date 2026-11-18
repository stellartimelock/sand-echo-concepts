/* Page behavior: menu rendering, nav, and the Square handoff step. */
(function () {
  var menu = window.MW_MENU;
  var squareUrl = window.MayanSquare.storeUrl();

  function esc(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (ch) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch];
    });
  }

  function findItem(id) {
    var found = null;
    menu.categories.forEach(function (category) {
      category.items.forEach(function (item) {
        if (item.id === id) found = item;
      });
    });
    return found;
  }

  function shotText(item) {
    if (item.shot === "double") return "Double espresso shot";
    if (item.shot === "none") return "* No double shot";
    return "";
  }

  function renderItem(item) {
    var displayName = item.name + (item.shot === "none" ? "*" : "");
    var sizes = item.sizes || [];
    var sizeHtml;
    if (sizes.length > 1) {
      sizeHtml = '<div class="picks" role="radiogroup" aria-label="Choice for ' + esc(item.name) + '">' +
        sizes.map(function (size, index) {
          var tone = index === 0 ? "warm" : "cool";
          return '<label class="pill ' + tone + '">' +
            '<input type="radio" name="size-' + esc(item.id) + '" value="' + esc(size.id) + '"' + (index === 0 ? " checked" : "") + ">" +
            '<span>' + esc(size.label) + '</span><strong>' + window.MayanCart.money(size.price) + '</strong></label>';
        }).join("") +
        "</div>";
    } else {
      var only = sizes[0];
      sizeHtml = '<p class="solo"><span>' + esc(only.label) + '</span> <strong>' + window.MayanCart.money(only.price) + '</strong></p>';
    }
    var optionHtml = "";
    if (item.options && item.options.choices) {
      optionHtml = '<label class="opt">' + esc(item.options.label) +
        '<select data-option>' +
        item.options.choices.map(function (choice) {
          return '<option>' + esc(choice) + '</option>';
        }).join("") +
        '</select></label>';
    }
    var note = [shotText(item), item.note || ""].filter(Boolean).join(" · ");
    var squareLink = item.squareUrl
      ? '<a class="text-link" href="' + esc(item.squareUrl) + '" target="_blank" rel="noopener">This item on Square</a>'
      : "";
    return '<article class="item" data-id="' + esc(item.id) + '">' +
      '<div class="item-copy"><h3>' + esc(displayName) + '</h3>' +
      (note ? '<p class="meta">' + esc(note) + '</p>' : '') +
      squareLink +
      '</div>' +
      '<div class="item-buy">' + optionHtml + sizeHtml +
      '<div class="buy-row">' +
      '<div class="qty" role="group" aria-label="Quantity for ' + esc(item.name) + '">' +
      '<button type="button" data-step="-1" aria-label="Decrease quantity">−</button>' +
      '<span data-qty>1</span>' +
      '<button type="button" data-step="1" aria-label="Increase quantity">+</button>' +
      '</div>' +
      '<button type="button" class="btn add" data-add>Add to cart</button>' +
      '</div></div></article>';
  }

  function fillNotes() {
    var text = menu.shotNote + " " + menu.sourceNote;
    document.querySelectorAll("[data-menu-note]").forEach(function (note) {
      note.textContent = text;
    });
  }

  function renderMenu() {
    fillNotes();
    var root = document.getElementById("menu-root");
    if (!root) return;
    root.innerHTML = menu.categories.map(function (category) {
      return '<section class="cat" id="' + esc(category.id) + '">' +
        '<div class="cat-banner"><h2>' + esc(category.name) + '</h2></div>' +
        '<div class="menu-list">' + category.items.map(renderItem).join("") + '</div>' +
        '</section>';
    }).join("");
    if (location.hash) {
      var target = document.getElementById(location.hash.slice(1));
      if (target) target.scrollIntoView();
    }
  }

  function renderFeatured() {
    var root = document.querySelector("[data-featured]");
    if (!root) return;
    root.innerHTML = menu.featured.map(function (id) {
      var item = findItem(id);
      return item ? renderItem(item) : "";
    }).join("");
  }

  function renderShop() {
    var blocks = document.querySelectorAll("[data-shop]");
    if (!blocks.length) return;
    var html = menu.shop.map(function (item) {
      var href = item.squareUrl || squareUrl;
      return '<article class="shop-card">' +
        '<h3>' + esc(item.name) + '</h3>' +
        '<p>' + esc(item.detail) + '</p>' +
        '<p class="ask">Ask in store</p>' +
        '<a class="btn btn-line" href="' + esc(href) + '" target="_blank" rel="noopener">Order on Square</a>' +
        '</article>';
    }).join("");
    blocks.forEach(function (block) { block.innerHTML = html; });
  }

  function renderOrder() {
    var root = document.getElementById("order-root");
    if (!root) return;
    var active = document.activeElement;
    var key = active && active.closest && active.closest("[data-key]")
      ? active.closest("[data-key]").getAttribute("data-key")
      : "";
    var action = active && active.getAttribute ? active.getAttribute("data-line-action") : "";
    var lines = window.MayanCart.lines();
    if (!lines.length) {
      root.innerHTML = '<div class="order-card">' +
        '<p>Your list is empty.</p>' +
        '<div class="cta"><a class="btn" href="menu.html">Browse the menu</a>' +
        '<a class="btn btn-square" href="' + esc(squareUrl) + '" target="_blank" rel="noopener">Order on Square</a></div>' +
        '</div>';
      return;
    }
    var rows = lines.map(function (line) {
      var detail = [line.sizeLabel, line.option].filter(Boolean).join(" · ");
      return '<article class="line" data-key="' + esc(line.key) + '">' +
        '<div class="line-name"><strong>' + esc(line.name) + '</strong>' +
        (detail ? '<span>' + esc(detail) + '</span>' : '') +
        '<span class="each">' + window.MayanCart.money(line.price) + ' each</span></div>' +
        '<div class="line-controls">' +
        '<div class="qty" role="group" aria-label="Quantity for ' + esc(line.name) + '">' +
        '<button type="button" data-line-action="dec" aria-label="Decrease quantity">−</button>' +
        '<span>' + line.qty + '</span>' +
        '<button type="button" data-line-action="inc" aria-label="Increase quantity">+</button>' +
        '</div>' +
        '<span class="line-price">' + window.MayanCart.money(line.price * line.qty) + '</span>' +
        '<button type="button" class="text-btn" data-line-action="remove">Remove</button>' +
        '</div></article>';
    }).join("");
    var ready = window.MayanSquare.webPaymentsReady();
    root.innerHTML = '<div class="order-card">' +
      '<div class="menu-list">' + rows + '</div>' +
      '<p class="subtotal"><span>Subtotal</span> <strong>' + window.MayanCart.money(window.MayanCart.subtotal()) + '</strong></p>' +
      '<p class="fine">These are the sandwich-board prices. This page does not add tax and does not take a card. Square has its own menu, so this list is not sent there yet — keep it open and build the same order on their store.</p>' +
      (ready ? '<p class="fine">Square application and location IDs are set in square.js. Card entry still stays out of this concept until a server calls the Orders API.</p>' : '') +
      '<div class="cta">' +
      '<a class="btn btn-square" href="' + esc(squareUrl) + '" target="_blank" rel="noopener">Continue on Square</a>' +
      '<button type="button" class="btn btn-line" data-copy-order>Copy this list</button>' +
      '</div>' +
      '<p class="copied" data-copied hidden>Copied. Paste it into a note if you want it beside the Square page.</p>' +
      '</div>';
    if (key && action && window.CSS && CSS.escape) {
      var next = root.querySelector('[data-key="' + CSS.escape(key) + '"] [data-line-action="' + CSS.escape(action) + '"]');
      if (next) next.focus();
    }
  }

  document.addEventListener("click", function (event) {
    var step = event.target.closest("[data-step]");
    if (step && step.closest(".item")) {
      var qty = step.parentNode.querySelector("[data-qty]");
      var next = Math.max(1, Math.min(20, Number(qty.textContent) + Number(step.getAttribute("data-step"))));
      qty.textContent = String(next);
      return;
    }
    var add = event.target.closest("[data-add]");
    if (add) {
      var card = add.closest(".item");
      var item = findItem(card.getAttribute("data-id"));
      if (!item) return;
      var selected = card.querySelector("input[type=radio]:checked");
      var size = item.sizes[0];
      if (selected) {
        size = item.sizes.filter(function (option) { return option.id === selected.value; })[0] || size;
      }
      var optionEl = card.querySelector("[data-option]");
      window.MayanCart.add({
        id: item.id,
        name: item.name + (item.shot === "none" ? "*" : ""),
        sizeId: size.id,
        sizeLabel: size.label,
        option: optionEl ? optionEl.value : "",
        price: size.price,
        qty: Number(card.querySelector("[data-qty]").textContent) || 1
      });
      card.querySelector("[data-qty]").textContent = "1";
      return;
    }
    var copy = event.target.closest("[data-copy-order]");
    if (copy) {
      var text = window.MayanSquare.summary(window.MayanCart.lines());
      var done = function () {
        var note = document.querySelector("[data-copied]");
        if (note) note.hidden = false;
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, function () { fallbackCopy(text); done(); });
      } else {
        fallbackCopy(text);
        done();
      }
    }
  });

  function fallbackCopy(text) {
    var area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.left = "-999px";
    document.body.appendChild(area);
    area.select();
    try { document.execCommand("copy"); } catch (err) { /* The list is still on the page. */ }
    document.body.removeChild(area);
  }

  var nav = document.getElementById("nav-panel");
  var navBtn = document.querySelector(".menu-btn");
  function closeNav() {
    if (!nav || !navBtn) return;
    nav.classList.remove("open");
    navBtn.setAttribute("aria-expanded", "false");
    navBtn.setAttribute("aria-label", "Open menu");
  }
  if (navBtn && nav) {
    navBtn.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      navBtn.setAttribute("aria-expanded", open ? "true" : "false");
      navBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      if (open) window.MayanCart.close();
    });
    nav.addEventListener("click", function (event) {
      if (event.target.closest("a")) closeNav();
    });
  }
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") closeNav();
  });
  document.addEventListener("click", function (event) {
    if (event.target.closest("[data-open-cart]")) closeNav();
  });

  renderMenu();
  renderFeatured();
  renderShop();
  if (document.getElementById("order-root")) {
    window.MayanCart.onChange(renderOrder);
    renderOrder();
  }
})();
