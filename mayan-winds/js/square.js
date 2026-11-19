/* Square handoff for this concept.
   No secret keys live here. The page never collects a card number.
   Today, checkout opens the shop's existing Square Online store.
   The cart stays in this browser so the guest can read it while they order there.

   Integration path — leave this commented until a backend exists:

   1. Load the Web Payments SDK on the order page (not before the IDs below are set):
        Production: https://web.squarecdn.com/v1/square.js
        Sandbox:    https://sandbox.web.squarecdn.com/v1/square.js

   2. In the browser, with applicationId and locationId filled in:
        const payments = Square.payments(
          SQUARE_CONFIG.applicationId,
          SQUARE_CONFIG.locationId
        );
        const card = await payments.card();
        await card.attach("#square-card");
        const result = await card.tokenize();
        // result.token is a nonce. The card number stays with Square.

   3. POST { sourceId: result.token, currency: "USD", lines: cart }
      to SQUARE_CONFIG.ordersEndpoint.
      That server — not this file — holds the Square access token and calls:
        CreateOrder   POST /v2/orders     (location_id + line items)
        CreatePayment POST /v2/payments   (source_id = nonce, order_id)
      Never put a Square access token, secret, or personal access token in this repo.

   4. Or skip the in-site cart: set squareUrl on an item in menu-data.js
      to a Square payment link or an online-store item URL.
      The menu shows "This item on Square" when squareUrl is set.
*/
window.SQUARE_CONFIG = {
  environment: "production",
  applicationId: "",
  locationId: "",
  ordersEndpoint: "",
  onlineStoreUrl: "https://mayan-winds-flagstaff.square.site",
  currency: "USD",
  countryCode: "US"
};

window.MayanSquare = {
  config: window.SQUARE_CONFIG,

  storeUrl: function () {
    return window.SQUARE_CONFIG.onlineStoreUrl;
  },

  /* True only when a later pass has filled the public IDs and a server URL.
     This concept still does not render a card field when that happens. */
  webPaymentsReady: function () {
    var c = window.SQUARE_CONFIG;
    return Boolean(c.applicationId && c.locationId && c.ordersEndpoint);
  },

  summary: function (lines) {
    var rows = lines.map(function (line) {
      var bits = [line.qty + " × " + line.name];
      if (line.sizeLabel) bits.push("(" + line.sizeLabel + ")");
      if (line.option) bits.push("— " + line.option);
      bits.push("— " + window.MayanCart.money(line.price * line.qty));
      return bits.join(" ");
    });
    var total = lines.reduce(function (sum, line) {
      return sum + Math.round(line.price * 100) * line.qty;
    }, 0) / 100;
    return [
      "Mayan Winds Coffee Emporium",
      "List from the in-store board (not sent to Square automatically)",
      "",
      rows.join("\n") || "(empty)",
      "",
      "Subtotal " + window.MayanCart.money(total),
      "Tax is added on Square."
    ].join("\n");
  }
};
