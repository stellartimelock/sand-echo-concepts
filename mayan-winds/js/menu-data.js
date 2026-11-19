/* Mayan Winds menu — the only place prices live.
   Read from the in-store sandwich board (Hot & Cold Drinks), Nov 2026.
   Orange pills on the board are 12 oz; teal pills are 16 oz.
   Zoomed check of the board photo, where a casual read was easy to miss:
     Espresso Americano 16 oz is 4.75
     Black coffee (French press) 16 oz is 5.25
     Caramel V. Machiato is 6.50 / 7.75
     Mexican Latte 16 oz is 6.75
     Mexican Mocha Latte 16 oz is 7.75
     Mocha 16 oz is 6.75
   Change a number here and the menu, cart, and home page all follow.
   Shop goods have no price on purpose — nothing was invented.
   Optional later: set squareUrl on an item to a Square payment link. */
window.MW_MENU = {
  sourceNote: "Prices come from the in-store sandwich board. A few 16 oz figures are small on the board — correct them in this file if the shop updates a price. Square may show its own prices at checkout.",
  shotNote: "Coffee drinks include a double espresso shot, except those marked *.",
  featured: ["americano", "mexican-latte", "dirty-chai", "cold-brew"],
  categories: [
    {
      id: "cafe",
      name: "Café & Lattes",
      items: [
        { id: "americano", name: "Espresso Americano", shot: "double", sizes: [
          { id: "12", label: "12 oz", price: 3.50 },
          { id: "16", label: "16 oz", price: 4.75 }
        ]},
        { id: "french-press", name: "Black Coffee (French Press)", shot: "none", sizes: [
          { id: "12", label: "12 oz", price: 4.00 },
          { id: "16", label: "16 oz", price: 5.25 }
        ]},
        { id: "drip", name: "Regular Drip Coffee", shot: "none", note: "Refill is listed as its own choice.", sizes: [
          { id: "cup", label: "Cup", price: 3.00 },
          { id: "refill", label: "Refill", price: 1.00 }
        ]},
        { id: "latte", name: "Latte", shot: "double", sizes: [
          { id: "12", label: "12 oz", price: 4.00 },
          { id: "16", label: "16 oz", price: 5.25 }
        ]},
        { id: "caramel", name: "Caramel V. Machiato", shot: "double", sizes: [
          { id: "12", label: "12 oz", price: 6.50 },
          { id: "16", label: "16 oz", price: 7.75 }
        ]},
        { id: "vanilla", name: "Sweet Vanilla Latte", shot: "double", sizes: [
          { id: "12", label: "12 oz", price: 5.00 },
          { id: "16", label: "16 oz", price: 6.25 }
        ]},
        { id: "mexican-latte", name: "Mexican Latte", shot: "double", sizes: [
          { id: "12", label: "12 oz", price: 5.50 },
          { id: "16", label: "16 oz", price: 6.75 }
        ]},
        { id: "mexican-mocha", name: "Mexican Mocha Latte", shot: "double", sizes: [
          { id: "12", label: "12 oz", price: 6.50 },
          { id: "16", label: "16 oz", price: 7.75 }
        ]},
        { id: "capuchino", name: "Capuchino", shot: "double", note: "One size on the board.", sizes: [
          { id: "cup", label: "Cup", price: 4.50 }
        ]},
        { id: "mocha", name: "Mocha", shot: "double", sizes: [
          { id: "12", label: "12 oz", price: 5.50 },
          { id: "16", label: "16 oz", price: 6.75 }
        ]},
        { id: "dirty-chai", name: "Dirty Chai Latte", shot: "double", sizes: [
          { id: "12", label: "12 oz", price: 5.00 },
          { id: "16", label: "16 oz", price: 6.25 }
        ]},
        { id: "affogato", name: "Affogato", shot: "double", sizes: [
          { id: "cup", label: "Cup", price: 6.00 }
        ]},
        { id: "cold-brew", name: "Cold Brew Coffee", shot: "none", sizes: [
          { id: "cup", label: "Cup", price: 4.50 }
        ]}
      ]
    },
    {
      id: "espresso",
      name: "Espressos",
      items: [
        { id: "double", name: "Espresso Double Shot", shot: "double", sizes: [
          { id: "4", label: "4 oz", price: 4.00 }
        ]},
        { id: "simple", name: "Espresso Simple Shot", shot: "none", sizes: [
          { id: "4", label: "4 oz", price: 3.50 }
        ]},
        { id: "machiatto", name: "Machiatto (Cortado)", shot: "double", sizes: [
          { id: "4", label: "4 oz", price: 4.50 }
        ]},
        { id: "flat-white", name: "Flat White", shot: "double", sizes: [
          { id: "8", label: "8 oz", price: 4.50 }
        ]}
      ]
    },
    {
      id: "tea",
      name: "Tea & Hot Chocolate",
      items: [
        {
          id: "herbal",
          name: "Organic Herbal Tea",
          note: "Choose a tea. The price is the same for each.",
          options: {
            label: "Tea",
            choices: ["Green", "Black", "Peppermint", "Chamomile", "Cinnamon", "Lemon & Ginger", "Green & Elderberry", "Green & Lemon"]
          },
          sizes: [{ id: "cup", label: "Cup", price: 4.00 }]
        },
        { id: "old-barrel", name: "Special Old Barrel Tea", sizes: [
          { id: "cup", label: "Cup", price: 4.50 }
        ]},
        { id: "masala", name: "Masala Chai Latte", sizes: [
          { id: "cup", label: "Cup", price: 4.00 }
        ]},
        { id: "spiced", name: "Spiced Chai / Latte", note: "The board prices chai and latte, not ounces.", sizes: [
          { id: "chai", label: "Chai", price: 4.00 },
          { id: "latte", label: "Latte", price: 5.00 }
        ]},
        { id: "matcha", name: "Matcha Tea", sizes: [
          { id: "cup", label: "Cup", price: 4.00 }
        ]},
        { id: "cocoa", name: "Hot Chocolate", sizes: [
          { id: "cup", label: "Cup", price: 4.00 }
        ]}
      ]
    }
  ],
  shop: [
    { id: "bagged-coffee", name: "Bagged coffee", detail: "Whole bean and ground, from the shelf by the booths." },
    { id: "honey", name: "Honey", detail: "Miel — jars of honey, as on the front window." },
    { id: "cacao", name: "Cacao", detail: "Kakaw, sold in the shop." },
    { id: "mugs", name: "Mugs", detail: "Cups and mugs at the counter." },
    { id: "pastries", name: "Pastries", detail: "Whatever is in the case today. Ask at the bar." }
  ]
};
