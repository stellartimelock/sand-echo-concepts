/* Cart for the concept. Stored in this browser only. No payment data. */
(function () {
  var KEY = "mayan-winds-cart-v1";
  var lines = [];
  var listeners = [];
  var opener = null;
  var toastTimer = 0;

  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      var parsed = raw ? JSON.parse(raw) : [];
      lines = Array.isArray(parsed) ? parsed : [];
    } catch (err) {
      lines = [];
    }
  }

  function persist() {
    try {
      localStorage.setItem(KEY, JSON.stringify(lines));
    } catch (err) {
      /* Private mode can block storage; the list still works for this page view. */
    }
  }

  function cents(n) {
    return Math.round(Number(n) * 100);
  }

  function money(n) {
    return "$" + (Math.round(Number(n) * 100) / 100).toFixed(2);
  }

  function count() {
    return lines.reduce(function (n, line) { return n + line.qty; }, 0);
  }

  function subtotal() {
    return lines.reduce(function (sum, line) {
      return sum + cents(line.price) * line.qty;
    }, 0) / 100;
  }

  function emit() {
    render();
    listeners.forEach(function (fn) { fn(); });
    document.dispatchEvent(new CustomEvent("mw-cart"));
  }

  function save() {
    persist();
    emit();
  }

  function add(item) {
    var qty = Math.max(1, Math.min(20, item.qty || 1));
    var key = [item.id, item.sizeId || "", item.option || ""].join("|");
    var found = lines.filter(function (line) { return line.key === key; })[0];
    if (found) {
      found.qty = Math.min(20, found.qty + qty);
    } else {
      lines.push({
        key: key,
        id: item.id,
        name: item.name,
        sizeId: item.sizeId || "",
        sizeLabel: item.sizeLabel || "",
        option: item.option || "",
        price: item.price,
        qty: qty
      });
    }
    save();
    toast("Added " + item.name);
  }

  function setQty(key, qty) {
    var line = lines.filter(function (item) { return item.key === key; })[0];
    if (!line) return;
    if (qty < 1) {
      lines = lines.filter(function (item) { return item.key !== key; });
    } else {
      line.qty = Math.min(20, qty);
    }
    save();
  }

  function remove(key) {
    lines = lines.filter(function (item) { return item.key !== key; });
    save();
  }

  function clear() {
    lines = [];
    save();
  }

  function lineLabel(line) {
    var extra = [];
    if (line.sizeLabel) extra.push(line.sizeLabel);
    if (line.option) extra.push(line.option);
    return extra.join(" · ");
  }

  function render() {
    document.querySelectorAll("[data-cart-count]").forEach(function (el) {
      var n = count();
      el.textContent = String(n);
      el.hidden = n === 0;
    });
    var totalEl = document.querySelector("[data-cart-total]");
    if (totalEl) totalEl.textContent = money(subtotal());
    var box = document.querySelector("[data-cart-lines]");
    if (!box) return;
    if (!lines.length) {
      box.innerHTML = '<p class="empty">Your list is empty. <a href="menu.html">Browse the menu</a>.</p>';
      return;
    }
    box.innerHTML = lines.map(function (line) {
      var detail = lineLabel(line);
      return '<article class="line" data-key="' + esc(line.key) + '">' +
        '<div class="line-name"><strong>' + esc(line.name) + '</strong>' +
        (detail ? '<span>' + esc(detail) + '</span>' : '') +
        '</div>' +
        '<div class="line-controls">' +
        '<div class="qty" role="group" aria-label="Quantity for ' + esc(line.name) + '">' +
        '<button type="button" data-line-action="dec" aria-label="Decrease quantity">−</button>' +
        '<span>' + line.qty + '</span>' +
        '<button type="button" data-line-action="inc" aria-label="Increase quantity">+</button>' +
        '</div>' +
        '<span class="line-price">' + money(line.price * line.qty) + '</span>' +
        '<button type="button" class="text-btn" data-line-action="remove">Remove</button>' +
        '</div></article>';
    }).join("");
  }

  function esc(value) {
    return String(value).replace(/[&<>"']/g, function (ch) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch];
    });
  }

  function drawer() {
    return document.getElementById("cart-drawer");
  }

  function open(from) {
    var el = drawer();
    if (!el) return;
    opener = from || document.activeElement;
    var note = document.querySelector("[data-toast]");
    if (note) note.classList.remove("show");
    el.classList.add("open");
    el.inert = false;
    el.setAttribute("aria-hidden", "false");
    document.querySelector("[data-backdrop]").classList.add("open");
    document.body.classList.add("lock");
    var closeBtn = el.querySelector("[data-close-cart]");
    if (closeBtn) closeBtn.focus();
  }

  function close() {
    var el = drawer();
    if (!el || !el.classList.contains("open")) return;
    el.classList.remove("open");
    el.inert = true;
    el.setAttribute("aria-hidden", "true");
    document.querySelector("[data-backdrop]").classList.remove("open");
    document.body.classList.remove("lock");
    if (opener && typeof opener.focus === "function") opener.focus();
  }

  function isOpen() {
    var el = drawer();
    return !!(el && el.classList.contains("open"));
  }

  function toast(message) {
    var el = document.querySelector("[data-toast]");
    if (!el) return;
    el.querySelector("[data-toast-text]").textContent = message;
    el.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.classList.remove("show"); }, 3200);
  }

  document.addEventListener("click", function (event) {
    var openBtn = event.target.closest("[data-open-cart]");
    if (openBtn) {
      event.preventDefault();
      open(openBtn);
      return;
    }
    if (event.target.closest("[data-close-cart]") || event.target.closest("[data-backdrop]")) {
      close();
      return;
    }
    var actionBtn = event.target.closest("[data-line-action]");
    if (!actionBtn) return;
    var row = actionBtn.closest("[data-key]");
    if (!row) return;
    var key = row.getAttribute("data-key");
    var line = lines.filter(function (item) { return item.key === key; })[0];
    if (!line) return;
    var action = actionBtn.getAttribute("data-line-action");
    if (action === "inc") setQty(key, line.qty + 1);
    else if (action === "dec") setQty(key, line.qty - 1);
    else if (action === "remove") remove(key);
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") close();
    if (event.key !== "Tab" || !isOpen()) return;
    var el = drawer();
    var nodes = Array.prototype.slice.call(el.querySelectorAll("a, button, input, select, textarea"))
      .filter(function (node) { return !node.disabled && node.offsetParent !== null; });
    if (!nodes.length) return;
    var first = nodes[0];
    var last = nodes[nodes.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  load();
  render();

  window.MayanCart = {
    add: add,
    setQty: setQty,
    remove: remove,
    clear: clear,
    open: open,
    close: close,
    lines: function () { return lines.map(function (line) { return Object.assign({}, line); }); },
    count: count,
    subtotal: subtotal,
    money: money,
    onChange: function (fn) { listeners.push(fn); }
  };
})();
