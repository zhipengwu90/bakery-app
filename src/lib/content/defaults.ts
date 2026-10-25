import type { HoursData, MenuData, SiteSettings } from "./types";

// Fallback content. Used until the first save from the /manager dashboard
// creates the matching `site_content` row, or if Supabase is unreachable.

export const DEFAULT_SETTINGS: SiteSettings = {
  announcement: { enabled: false, text: "", link: "" },
  hero: {
    eyebrow: "Est. 2018 · Parksville, BC",
    title: "Fresh baked, *every morning.*",
    subtitle:
      "Join us for breakfast or lunch — outstanding coffee, bread baked in-house for every sandwich, and pastries straight from the oven.",
  },
  dayParts: [
    {
      label: "Until 11:30",
      title: "Breakfast",
      text: "Skillets, breakfast sandwiches and two-egg plates to start the day right.",
      href: "/menu#breakfast",
    },
    {
      label: "All day",
      title: "Lunch",
      text: "Homemade soup and sandwiches on bread we bake ourselves, with meats roasted in-house.",
      href: "/menu#sandwiches",
    },
    {
      label: "Anytime",
      title: "Coffee & treats",
      text: "Lattes, London fogs and a case full of muffins, scones, cinnamon and poppy seed buns.",
      href: "/menu#coffee-tea",
    },
  ],
  photos: {},
  contact: {
    phone: "250-905-1123",
    email: "",
    addressLine1: "Shelly Square, 402, 554 Island Hwy E",
    addressLine2: "Parksville, BC V9P 1V6",
    facebook: "https://www.facebook.com/brazenPoppy/",
    instagram: "https://www.instagram.com/brazenpoppy/",
  },
  about: {
    title: "Mornings, lunch & take-aways",
    intro:
      "Our bakers start early each day so the soups, sandwiches and baked goods are as fresh as possible by the time you walk in.",
    paragraphs: [
      "At the Brazen Poppy Bakery Café in Parksville, the warm smell of baking will make your mouth water before you're through the door. We kick-start your morning with skillet breakfasts, breakfast sandwiches, warm muffins, scones, cinnamon buns, poppy seed buns and more — plus a fresh cup of coffee, a cappuccino, latte, tea or hot chocolate.",
      "Lunch carries on the fresh theme: homemade soups, and sandwiches on bread baked on site with meats roasted in-house by our butcher/baker. We also offer tacos and burgers — a lunch that's sure to put a smile on your face.",
      "Anytime is coffee or tea time with one of our treats. Most of our soups are gluten-free, and our sandwiches can be made gluten-free too.",
    ],
    captions: [
      "Handcrafted pastries, baked in our own kitchen with ingredients from local suppliers.",
      "Old-fashioned techniques, made to make your taste-buds happy.",
    ],
  },
  legalName: "The Islander Bakery Corp.",
};

export const DEFAULT_HOURS: HoursData = {
  days: [
    { day: "Monday", open: true, from: "08:00", to: "16:00" },
    { day: "Tuesday", open: true, from: "08:00", to: "16:00" },
    { day: "Wednesday", open: true, from: "08:00", to: "16:00" },
    { day: "Thursday", open: true, from: "08:00", to: "16:00" },
    { day: "Friday", open: true, from: "08:00", to: "16:00" },
    { day: "Saturday", open: true, from: "09:00", to: "16:00" },
    { day: "Sunday", open: true, from: "11:00", to: "16:00", note: "Afternoon tea only" },
  ],
  specialNote: "",
};

const item = (id: string, name: string, prices: (number | null)[], description = "") => ({
  id,
  name,
  description,
  prices,
});

export const DEFAULT_MENU: MenuData = {
  sections: [
    {
      id: "breakfast",
      title: "Breakfast",
      subtitle: "Served until 11:30 AM",
      sizes: [],
      notes: [],
      items: [
        item("skillet", "Skillet", [16.75], "Ham, bacon or sausage with hashbrowns, two eggs, cheese, tomato, green onions"),
        item("two-eggs", "Two Eggs Breakfast", [12], "Two eggs, bacon, ham or sausage, hashbrown or 1 pc toast"),
      ],
    },
    {
      id: "sandwiches",
      title: "Sandwiches & Burgers",
      subtitle: "On bread baked fresh in our kitchen",
      sizes: [],
      notes: [
        "Bread options: multi-grain, whole wheat, white, rye, sourdough or gluten-free · croissant +$3.00",
      ],
      items: [
        item("monte-cristo", "Monte Cristo", [14], "Ham & chicken, MJ cheese, egg-dipped toast, icing sugar, cranberry jam"),
        item("reuben", "Reuben", [14], "Rye bread, corned beef, Swiss cheese, sauerkraut"),
        item("breakfast-sandwich", "Breakfast Sandwich", [11], "Ham, bacon or sausage with egg, cheese, lettuce, tomato on a bun"),
        item("custom-sandwich", "Build Your Own", [12], "Your choice of bread, protein, toppings and sauces"),
        item("cheeseburger", "Cheeseburger", [14], "Beef, onion, cheese, lettuce, tomato, pickles, bun"),
        item("blt", "BLT", [11], "Bacon, lettuce and tomato"),
      ],
    },
    {
      id: "all-day",
      title: "All-Day Favourites",
      sizes: [],
      notes: [],
      items: [
        item("avocado-toast", "Avocado Toast", [11], "Topped with mixed seeds"),
        item("french-toast", "French Toast", [9], "Or cinnamon bun French toast +$2.00"),
        item("grilled-cheese", "Grilled Cheese", [9]),
        item("soft-taco", "Soft Taco", [9.5], "Chicken or beef · shrimp +$2.00"),
        item("chili", "Chili", [14.5], "Ground beef"),
        item("bagel-toast", "Bagel or Toast + Jam", [3.5]),
      ],
    },
    {
      id: "salads",
      title: "Salads",
      sizes: ["Small", "Large"],
      notes: [],
      items: [
        item("garden", "Garden Salad", [8.5, 15]),
        item("caesar", "Caesar Salad", [9, 16]),
        item("greek", "Greek Salad", [9, 16]),
        item("cobb", "Chef's Cobb Salad", [10.5, 18]),
      ],
    },
    {
      id: "soup",
      title: "Soup",
      subtitle: "Made from scratch daily — most are gluten-free",
      sizes: ["Small", "Large"],
      notes: [],
      items: [item("soup-of-the-day", "Soup of the Day", [6.5, 8.5])],
    },
    {
      id: "coffee-tea",
      title: "Coffee & Tea",
      sizes: ["12 oz", "16 oz"],
      notes: [
        "Milk options: oat, soy, almond, skim",
        "Flavour shots: vanilla, caramel, hazelnut, sugar-free vanilla, tiramisu, lavender, mango, raspberry, mint, pumpkin spice",
        "Add creamy cheese foam +$1.50 · all drinks can be served iced",
      ],
      items: [
        item("drip", "Drip Coffee", [3.35, 3.85]),
        item("canadiano", "Canadiano", [4.25, 5]),
        item("latte", "Latte", [5.35, 6]),
        item("cappuccino", "Cappuccino", [5.35, 6]),
        item("chai", "Chai Latte", [5.5, 6]),
        item("london-fog", "London Fog", [5.5, 6]),
        item("hot-chocolate", "Hot Chocolate", [4.5, 5]),
        item("mocha", "Mocha", [5.75, 6.25]),
        item("matcha", "Matcha Latte", [5.85, 6.5]),
        item("espresso", "Espresso", [3.75, null]),
        item("tea", "Tea", [3, null]),
        item("steamer", "Steamer", [3.5, 4]),
        item("flat-white", "Flat White (8 oz)", [5.25, 5.75]),
      ],
    },
    {
      id: "feature-drinks",
      title: "Feature Drinks",
      sizes: [],
      notes: [],
      items: [
        item("italian-soda", "Italian Soda", [3.5]),
        item("psl", "Pumpkin Spice Latte", [6.95]),
        item("espresso-sunrise", "Espresso Sunrise", [5.75]),
        item("matcha-strawberry", "Matcha Strawberry", [7.5]),
        item("tiramisu-latte", "Tiramisu Latte", [6.75]),
        item("lavender-latte", "Lavender Tea Latte", [6.5]),
      ],
    },
  ],
};

export const DEFAULTS = {
  menu: DEFAULT_MENU,
  hours: DEFAULT_HOURS,
  settings: DEFAULT_SETTINGS,
};
