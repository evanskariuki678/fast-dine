import { supabase, supabaseConfigured } from "./supabase.js";
import { retailProductEntries } from "./retailCatalog.js";
import { BASE } from "./utils.js";

export const image = (id, width = 900) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=85`;

export const categories = [
  { id: "food", title: "Food", icon: "🍔", tone: "palette-food", path: `${BASE}/categories/food_1`, subtitle: "Meals worth staying in for" },
  { id: "groceries", title: "Groceries", icon: "🥑", tone: "palette-groceries", path: `${BASE}/categories/groceries_4`, subtitle: "The everyday, delivered" },
  { id: "pharmacy", title: "Pharmacy & Beauty", icon: "🧴", tone: "palette-pharmacy", path: `${BASE}/categories/pharmacy-beauty_3`, subtitle: "A little care, right on time" },
  { id: "shops", title: "Shops", icon: "🎁", tone: "sky", path: `${BASE}/categories/shops_22`, subtitle: "Find a little something" },
  { id: "deals", title: "Fast Dine Deals", icon: "✨", tone: "butter", path: `${BASE}/stores/glovo-bargains-nbo`, subtitle: "Good finds at lovely prices" },
  { id: "alcohol", title: "Drinks", icon: "🍷", tone: "rose", path: `${BASE}/categories/alcohol_21655`, subtitle: "Raise a glass, delivered" }
];

export const stores = [
  { id: "galitos", slug: "galitos", name: "Galito's", category: "food", cuisine: "Chicken · Grill · Portuguese", rating: "4.8", count: "980+", time: "25–35 min", fee: 49, promo: "Grill favourites", badge: "Flame grilled", image: image("photo-1527477396000-e27163b481c2"), color: "#b63f27", description: "Flame-grilled chicken, bold sauces and sides made for sharing." },
  { id: "java", slug: "java-house", name: "Java House", category: "food", cuisine: "Coffee · Brunch · Burgers", rating: "4.8", count: "1.2k+", time: "20–30 min", fee: 49, promo: "Coffee & more", badge: "Popular", image: image("photo-1559305616-3f99cd43e353"), color: "#8c4e32", description: "Coffee, breakfast and comforting cafe favourites." },
  { id: "cjs-restaurant-nbo-ke", slug: "cjs-restaurant-nbo-ke", name: "CJ's Restaurant", category: "food", cuisine: "International · Burgers · Desserts", rating: "4.7", count: "1.1k+", time: "30–40 min", fee: 69, promo: "Something for everyone", badge: "Fan favourite", image: image("photo-1555939594-58d7cb561ad1"), color: "#a95535", description: "A broad menu of crowd-pleasing meals, treats and drinks." },
  { id: "artcaffe", slug: "artcaffe", name: "Artcaffé", category: "food", cuisine: "Cafe · Bakery · Brunch", rating: "4.7", count: "890+", time: "25–35 min", fee: 59, promo: "Cafe favourites", badge: "Freshly baked", image: image("photo-1509440159596-0249088772ff"), color: "#875c48", description: "Cafe classics, fresh bakes and all-day brunch favourites." },
  { id: "creamy-inn", slug: "creamy-inn", name: "Creamy Inn", category: "food", cuisine: "Ice cream · Desserts · Shakes", rating: "4.6", count: "620+", time: "20–30 min", fee: 49, promo: "Sweet treats", badge: "Made for treats", image: image("photo-1563805042-7684c019e1cb"), color: "#bd7391", description: "Ice cream, sundaes and cool treats for any kind of day." },
  { id: "avon-bitez-nbo", slug: "avon-bitez-nbo", name: "Avon Bitez", category: "food", cuisine: "Fast food · Burgers · Chicken", rating: "4.6", count: "430+", time: "25–35 min", fee: 49, promo: "Quick bites", badge: "Good value", image: image("photo-1568901346375-23c9450c58cd"), color: "#a24c24", description: "Burgers, crispy bites and easy-going meal combos." },
  { id: "carrefour", slug: "carrefour-supermarket-nbo-ke", name: "Carrefour Supermarket", category: "groceries", cuisine: "Supermarket · Pantry · Fresh produce · Dairy · Bakery · Household", rating: "4.8", count: "2k+", time: "25–40 min", fee: 99, promo: "Save on essentials", badge: "Wide selection", image: image("photo-1542838132-92c53300491e"), color: "#4d8d64", description: "Stock up for the week with fresh produce, everyday pantry staples, chilled favourites and home essentials." },
  { id: "naivas", slug: "naivas-nbo", name: "Naivas Foodmarket", category: "groceries", cuisine: "Supermarket · Pantry · Fresh produce · Dairy · Bakery · Household", rating: "4.7", count: "1.6k+", time: "30–45 min", fee: 89, promo: "Weekly offers", badge: "Nearby", image: image("photo-1543168256-418811576931"), color: "#4e8c52", description: "A handy neighbourhood shop for Kenyan kitchen staples, fresh ingredients and everyday household picks." },
  { id: "quickmart", slug: "quickmart-nbo", name: "Quickmart", category: "groceries", cuisine: "Supermarket · Pantry · Fresh produce · Dairy · Bakery · Household", rating: "4.7", count: "1.1k+", time: "25–40 min", fee: 89, promo: "Daily essentials", badge: "Good value", image: image("photo-1542838132-92c53300491e"), color: "#c33b35", description: "Top up the fridge and pantry with fresh foods, family favourites and useful household basics." },
  { id: "fruitsdoor-market", slug: "fruitsdoor-market-nbo", name: "Fruitsdoor Market", category: "groceries", cuisine: "Fruit · Vegetables · Fresh produce · Herbs · Farm market", rating: "4.8", count: "640+", time: "20–30 min", fee: 69, promo: "Fresh market picks", badge: "Picked fresh", image: image("photo-1540420773420-3366772f4999"), color: "#729346", description: "Bright seasonal fruit, crisp vegetables and fresh market ingredients for everyday meals." },
  { id: "cleanshelf", slug: "cleanshelf-nbo", name: "Cleanshelf", category: "groceries", cuisine: "Supermarket · Household · Cleaning · Pantry · Personal care", rating: "4.6", count: "510+", time: "25–40 min", fee: 79, promo: "Home essentials", badge: "Home & pantry", image: image("photo-1604719312566-8912e9c8a213"), color: "#528178", description: "Keep your home stocked with cleaning supplies, personal care and handy pantry essentials." },
  { id: "goodlife", slug: "goodlife-pharmacy-sarit", name: "Goodlife Pharmacy Sarit", category: "pharmacy", cuisine: "Pharmacy · Wellness · Personal care · First aid", rating: "4.9", count: "420+", time: "20–35 min", fee: 89, promo: "Care essentials", badge: "Trusted", image: image("photo-1607619056574-7b8d3ee536b2"), color: "#689b82", description: "Everyday wellness and personal care essentials, with pharmacy support when you need guidance." },
  { id: "nivea", slug: "nivea-nbo", name: "NIVEA", category: "pharmacy", cuisine: "Beauty · Skin care · Body care · Personal care", rating: "4.8", count: "390+", time: "20–35 min", fee: 69, promo: "Everyday skin care", badge: "Skin care", image: image("photo-1556229010-6c3f2c9ca5f8"), color: "#28609b", description: "A considered selection of daily face, body and sun-care essentials for the whole family." },
  { id: "pharma-plus", slug: "pharma-plus-nrbo", name: "Pharma Plus", category: "pharmacy", cuisine: "Pharmacy · Wellness · First aid · Personal care", rating: "4.7", count: "280+", time: "25–40 min", fee: 79, promo: "Wellness picks", badge: "Care nearby", image: image("photo-1576602976047-174e57a47881"), color: "#418a80", description: "A neighbourhood pharmacy selection of wellness, hygiene and first-aid essentials." },
  { id: "flower-shop", name: "Petal & Stem", category: "shops", cuisine: "Flowers · Gifts", rating: "4.9", count: "180+", time: "30–45 min", fee: 99, promo: "Make their day", badge: "Made with love", image: image("photo-1490750967868-88aa4486c946"), color: "#b36f82", description: "Thoughtful flowers and gifts for every little moment." },
  { id: "miniso", name: "Little Finds", category: "shops", cuisine: "Home · Gifts · Everyday", rating: "4.7", count: "300+", time: "25–40 min", fee: 89, promo: "Nice little things", badge: "Worth a look", image: image("photo-1602143407151-7111542de6e8"), color: "#7d93a5", description: "Useful, cheerful things for your home and day." },
  { id: "tamu-deals", name: "Fast Dine Deals Market", category: "deals", cuisine: "Deals · Pantry · Fresh", rating: "4.8", count: "1k+", time: "20–35 min", fee: 49, promo: "Up to 40% off", badge: "Today only", image: image("photo-1542838132-92c53300491e"), color: "#718e55", description: "A rotating edit of everyday favourites at better prices." },
  { id: "quick-liquor", name: "The Bottle Shop", category: "alcohol", cuisine: "Wine · Beer · Spirits", rating: "4.8", count: "360+", time: "20–35 min", fee: 99, promo: "Weekend picks", badge: "Curated", image: image("photo-1510812431401-41d2bd2722f3"), color: "#7e4553", description: "A thoughtful selection for your next get-together." },
  { id: "drinks-corner", name: "Drinks Corner", category: "alcohol", cuisine: "Beer · Cider · Mixers", rating: "4.6", count: "220+", time: "25–40 min", fee: 79, promo: "Bundle & save", badge: "Good value", image: image("photo-1536935338788846bb9981813"), color: "#9d683f", description: "Easy favourites and mixers for a relaxed evening." }
];

function createFoodMenu(prefix, entries, photos) {
  return entries.map(([name, description, price, tag], index) => ({
    id: `${prefix}${index + 1}`,
    name,
    description,
    price,
    image: image(photos[index % photos.length], 480),
    ...(tag ? { tag } : {})
  }));
}

const retailProducts = Object.fromEntries(
  Object.entries(retailProductEntries).map(([storeId, entries]) => [
    storeId,
    entries.map(([id, name, description, price, oldPrice, photoId, tag]) => ({
      id,
      name,
      description,
      price,
      ...(oldPrice ? { oldPrice } : {}),
      image: image(photoId, 480),
      ...(tag ? { tag } : {})
    }))
  ])
);

export const productsByStore = {
  galitos: createFoodMenu("g", [
    ["Quarter Chicken Meal", "Quarter chicken marinated with garlic, lemon and peri-peri spices, flame-grilled and served with your choice of side.", 790, "Grill favourite"],
    ["Chicken Wrap", "Sliced flame-grilled chicken, crisp lettuce, tomato and creamy house sauce wrapped in a warm tortilla.", 590, "Quick lunch"],
    ["Peri-Peri Chips", "Crisp-cut potatoes tossed in a punchy peri-peri spice blend and finished with a squeeze of lemon.", 320, "Sides"],
    ["Family Chicken Meal", "A sharing spread of flame-grilled chicken, golden chips, fresh salad and two house dips.", 2490, "For sharing"],
    ["Half Chicken Meal", "Half a chicken soaked in a citrus-garlic marinade, flame-grilled and paired with chips and slaw.", 1390, "Grill favourite"],
    ["Full Chicken", "Whole chicken marinated overnight with paprika, garlic and lemon, then slow flame-grilled until smoky and tender.", 2190, "For sharing"],
    ["Chicken Breast Meal", "Boneless chicken breast brushed with peri-peri glaze, grilled and served with rice and garden vegetables.", 890, "Grill favourite"],
    ["Chicken Wings", "Juicy wings flame-grilled with a sticky chilli-garlic glaze and served with a cooling dip.", 690, "Grill favourite"],
    ["Chicken Livers", "Tender chicken livers sautéed with peppers, onions and a mild peri-peri sauce, served with toasted bread.", 620, "Quick lunch"],
    ["Peri-Peri Chicken Burger", "Grilled chicken fillet with peri-peri mayo, lettuce and tomato in a toasted sesame bun.", 690, "Quick lunch"],
    ["Double Chicken Burger", "Two flame-grilled chicken patties layered with cheddar, crisp lettuce and smoky house sauce.", 890, "Quick lunch"],
    ["Chicken Pita", "Spiced grilled chicken, cucumber, tomato and garlic yoghurt tucked into warm pita bread.", 640, "Quick lunch"],
    ["Chicken Salad Bowl", "Warm peri-peri chicken over leafy greens, cucumber, tomato, avocado and a bright lemon dressing.", 720, "Lighter plates"],
    ["Chicken Rice Bowl", "Flame-grilled chicken over seasoned rice with corn, tomato salsa and a drizzle of chilli sauce.", 760, "Lighter plates"],
    ["Grilled Sausage", "A savoury beef sausage grilled until browned, served with chips and tangy tomato relish.", 520, "Grill favourite"],
    ["Beef Burger", "A char-grilled beef patty with cheddar, lettuce, tomato and peppery house sauce in a toasted bun.", 750, "Quick lunch"],
    ["Grilled Veg Wrap", "Charred peppers, courgette and onions with hummus, greens and lemon dressing in a soft wrap.", 520, "Lighter plates"],
    ["Chicken Quesadilla", "Grilled chicken, melted cheese and peppers folded in a toasted tortilla with salsa for dipping.", 690, "Quick lunch"],
    ["Spicy Chicken Strips", "Chicken strips coated in seasoned crumbs, oven-finished until crisp and served with peri-peri dip.", 650, "Grill favourite"],
    ["BBQ Chicken Quarter", "Quarter chicken brushed with a smoky tomato BBQ glaze and grilled with caramelised edges.", 820, "Grill favourite"],
    ["Garlic Chicken Meal", "Grilled chicken basted with roasted garlic butter, served with herbed rice and crunchy slaw.", 850, "Grill favourite"],
    ["Chicken & Corn", "Flame-grilled chicken served with buttery sweetcorn and a light sprinkle of smoked paprika.", 790, "Grill favourite"],
    ["Loaded Peri-Peri Chips", "Golden chips topped with grilled chicken pieces, melted cheese and a spicy peri-peri drizzle.", 590, "Sides"],
    ["Sweet Potato Fries", "Sweet potato batons baked until crisp and paired with a cool garlic-herb dip.", 390, "Sides"],
    ["Coleslaw", "Shredded cabbage and carrot folded through a creamy, lightly peppered dressing.", 220, "Sides"],
    ["Garden Side Salad", "Crisp lettuce, cucumber and tomato tossed with a fresh lemon and herb vinaigrette.", 290, "Lighter plates"],
    ["Grilled Corn Cob", "Sweet corn grilled over high heat, brushed with lightly spiced butter and served warm.", 250, "Sides"],
    ["Chicken & Rice Family Box", "A family-sized box of grilled chicken, seasoned rice, fresh salad and house chilli sauce.", 1890, "For sharing"],
    ["Spicy Chicken Wings Box", "A generous portion of flame-grilled wings coated in a bold peri-peri glaze with dipping sauce.", 1190, "For sharing"],
    ["Chocolate Brownie", "A soft-centred cocoa brownie baked with dark chocolate and served as a rich finish.", 350, "Sweet treats"]
  ], ["photo-1527477396000-e27163b481c2", "photo-1626700051175-6818013e1d4f", "photo-1573080496219-bb080dd4f877", "photo-1544025162-d76694265947"]),
  java: createFoodMenu("j", [
    ["Chicken & Avocado Sandwich", "Grilled chicken, ripe avocado, tomato and herb mayo layered between toasted country-bread slices.", 690, "Bestseller"],
    ["Java House Breakfast", "Two eggs cooked your way with beef sausage, buttered toast, grilled tomato and crisp hash browns.", 850, "Breakfast"],
    ["Cappuccino", "A balanced double espresso topped with silky steamed milk and a fine dusting of cocoa.", 330, "Coffee"],
    ["Blueberry Pancakes", "Fluffy buttermilk pancakes folded with blueberries and served with maple syrup and butter.", 640, "Breakfast"],
    ["Kenyan Breakfast Platter", "Two eggs, grilled sausage, sautéed mushrooms, tomato, toast and seasoned breakfast potatoes.", 990, "Breakfast"],
    ["French Toast", "Thick bread dipped in cinnamon-vanilla egg custard, griddled golden and served with fruit.", 590, "Breakfast"],
    ["Classic Eggs Benedict", "Poached eggs and beef bacon on toasted English muffins, finished with creamy hollandaise.", 890, "Breakfast"],
    ["Veggie Omelette", "A fluffy three-egg omelette filled with peppers, spinach, onion and melted cheddar.", 620, "Breakfast"],
    ["Chicken & Mushroom Crepe", "A tender savoury crepe filled with grilled chicken, sautéed mushrooms and a light cream sauce.", 740, "Breakfast"],
    ["Avocado Toast", "Smashed avocado with lemon, chilli flakes and cherry tomatoes on toasted sourdough.", 560, "Breakfast"],
    ["Beef Burger", "A grilled beef patty with cheddar, lettuce, tomato, pickles and Java house sauce in a toasted bun.", 1050, "Burgers"],
    ["Crispy Chicken Burger", "Crumbed chicken breast with crunchy slaw, pickles and a tangy mayo dressing.", 980, "Burgers"],
    ["BBQ Chicken Pizza", "Thin crust topped with smoky BBQ chicken, red onion, mozzarella and fresh coriander.", 1190, "Lunch"],
    ["Chicken Caesar Salad", "Grilled chicken, crisp romaine, parmesan shavings and crunchy croutons with Caesar dressing.", 890, "Lighter plates"],
    ["Grilled Chicken Panini", "Chicken, mozzarella, tomato and basil pesto pressed in ciabatta until crisp and melty.", 790, "Lunch"],
    ["Beef Lasagne", "Layers of pasta, slow-simmered beef tomato ragù and creamy béchamel baked under golden cheese.", 1090, "Lunch"],
    ["Chicken Alfredo", "Penne tossed with grilled chicken in a parmesan cream sauce, finished with cracked black pepper.", 1150, "Lunch"],
    ["Fish & Chips", "Golden crumbed white fish with chunky chips, lemon and a house-made tartar sauce.", 1190, "Lunch"],
    ["Spicy Chicken Wings", "Oven-roasted wings coated in a sticky chilli glaze and served with a cool ranch-style dip.", 780, "Lunch"],
    ["Beef Quesadilla", "Seasoned beef, peppers and melted cheese toasted in a tortilla with fresh tomato salsa.", 850, "Lunch"],
    ["Tomato Basil Soup", "Slow-cooked tomatoes blended with roasted garlic and basil, served with toasted bread.", 490, "Lighter plates"],
    ["Garden Veggie Wrap", "Grilled vegetables, hummus, spinach and feta rolled in a soft tortilla with lemon dressing.", 620, "Lighter plates"],
    ["Vanilla Latte", "Espresso blended with steamed milk and vanilla syrup for a smooth, gently sweet cup.", 390, "Coffee"],
    ["Iced Mocha", "Chilled espresso and chocolate mixed with milk and poured over ice.", 430, "Coffee"],
    ["Kenyan Tea", "Strong brewed black tea simmered with milk and a warming hint of cardamom.", 250, "Coffee"],
    ["Caramel Macchiato", "Espresso poured over steamed milk and finished with a delicate caramel swirl.", 420, "Coffee"],
    ["Chocolate Fudge Cake", "Moist cocoa sponge layered with chocolate ganache and a glossy fudge finish.", 490, "Sweet treats"],
    ["Classic Cheesecake", "Baked cream-cheese filling on a buttery biscuit base with berry compote.", 520, "Sweet treats"],
    ["Banana Bread", "Ripe bananas, cinnamon and toasted nuts baked into a soft, fragrant loaf slice.", 320, "Sweet treats"],
    ["Fresh Fruit Bowl", "Seasonal pineapple, melon, mango and banana cut fresh and served chilled.", 390, "Lighter plates"]
  ], ["photo-1553909489-cd47e0ef937f", "photo-1533089860892-a7c6f0a88666", "photo-1570968915860-54d5c301fa9f", "photo-1528207776546-365bb710ee93"]),
  "cjs-restaurant-nbo-ke": createFoodMenu("cj", [
    ["Classic Beef Burger", "Char-grilled beef patty with lettuce, tomato, cheddar and house sauce in a toasted sesame bun.", 1150, "Popular"],
    ["Chicken Alfredo Pasta", "Grilled chicken and fettuccine tossed in parmesan cream sauce with cracked black pepper.", 1390, "Mains"],
    ["Chicken Caesar Salad", "Grilled chicken, romaine lettuce, parmesan and crunchy croutons tossed in Caesar dressing.", 990, "Lighter plates"],
    ["Chocolate Cake Slice", "Dark cocoa sponge layered with chocolate cream and finished with a glossy ganache.", 520, "Dessert"],
    ["BBQ Bacon Burger", "Beef patty, smoky bacon, cheddar, onion rings and barbecue sauce stacked in a brioche bun.", 1390, "Burgers"],
    ["Mushroom Swiss Burger", "Grilled beef topped with buttery sautéed mushrooms, Swiss-style cheese and garlic aioli.", 1290, "Burgers"],
    ["Crispy Chicken Burger", "Buttermilk-marinated chicken in a crunchy coating with slaw, pickles and spicy mayo.", 1190, "Burgers"],
    ["Double Cheeseburger", "Two seared beef patties layered with cheddar, sliced pickles and tangy burger dressing.", 1490, "Burgers"],
    ["Chicken Tikka Pizza", "Spiced chicken, peppers, red onion and mozzarella over tomato sauce on a crisp baked base.", 1390, "Mains"],
    ["Margherita Pizza", "Tomato sauce, fresh mozzarella and basil baked until bubbling on a thin golden crust.", 1090, "Mains"],
    ["Beef Lasagne", "Slow-cooked beef ragù and pasta layered with béchamel, then baked with a golden cheese top.", 1290, "Mains"],
    ["Creamy Pesto Chicken Pasta", "Penne with grilled chicken, basil pesto, cream and parmesan, finished with fresh herbs.", 1390, "Mains"],
    ["Grilled Salmon Plate", "Pan-seared salmon with lemon butter, herbed potatoes and seasonal vegetables.", 1890, "Mains"],
    ["Fish & Chips", "Crisp battered white fish with chunky fries, lemon wedge and tartar sauce.", 1290, "Mains"],
    ["Chicken Parmigiana", "Crumbed chicken breast topped with tomato sugo and mozzarella, served with pasta.", 1390, "Mains"],
    ["Beef Steak & Fries", "Grilled beef steak with pepper sauce, rosemary fries and a side of dressed greens.", 1790, "Mains"],
    ["Chicken Fajitas", "Sizzling strips of spiced chicken with peppers, onions, warm tortillas and salsa.", 1290, "Mains"],
    ["Beef Tacos", "Soft tortillas filled with seasoned beef, shredded lettuce, tomato salsa and lime crema.", 990, "Mains"],
    ["Chicken Quesadilla", "Toasted tortilla packed with grilled chicken, peppers and melted cheese, served with salsa.", 1090, "Mains"],
    ["Greek Salad", "Tomato, cucumber, olives and feta tossed with oregano and a bright olive-oil dressing.", 850, "Lighter plates"],
    ["Grilled Chicken Salad", "Sliced grilled chicken over mixed leaves with avocado, cherry tomato and honey-mustard dressing.", 990, "Lighter plates"],
    ["Creamy Mushroom Soup", "Roasted mushrooms blended with thyme and cream, served with warm toasted bread.", 590, "Starters"],
    ["Chicken Wings", "Crisp oven-finished wings tossed in your choice of smoky BBQ or mild chilli glaze.", 790, "Starters"],
    ["Loaded Potato Skins", "Baked potato halves filled with cheddar, spring onion and sour cream.", 690, "Starters"],
    ["Garlic Bread", "Toasted baguette brushed with garlic-herb butter and a light sprinkle of parmesan.", 390, "Sides"],
    ["Brownie Sundae", "Warm chocolate brownie topped with vanilla ice cream and a ribbon of chocolate sauce.", 650, "Dessert"],
    ["New York Cheesecake", "Creamy baked cheesecake on a crumbly biscuit crust with berry sauce.", 590, "Dessert"],
    ["Carrot Cake", "Spiced carrot sponge with walnuts and a smooth cream-cheese frosting.", 520, "Dessert"],
    ["Lemon Meringue Pie", "Tangy lemon curd in a buttery pastry shell topped with toasted meringue.", 540, "Dessert"],
    ["Chocolate Milkshake", "Vanilla ice cream blended with cocoa and milk until thick, cold and creamy.", 490, "Drinks"]
  ], ["photo-1568901346375-23c9450c58cd", "photo-1473093295043-cdd812d0e601", "photo-1512621776951-a57141f2eefd", "photo-1578985545062-69928b1d9587"]),
  artcaffe: createFoodMenu("a", [
    ["All-Day Breakfast", "Two eggs, toasted sourdough, grilled tomato, sautéed mushrooms and golden breakfast potatoes.", 890, "All-day favourite"],
    ["Chicken & Avocado Sandwich", "Grilled chicken, ripe avocado, tomato and herb mayo layered on freshly toasted bread.", 790, "Lunch"],
    ["Butter Croissant", "Laminated pastry baked until deeply golden, with delicate flaky layers and a buttery centre.", 290, "Fresh bake"],
    ["Cappuccino", "Double-shot espresso softened with silky steamed milk and a fine cocoa finish.", 360, "Coffee"],
    ["Eggs Benedict", "Poached eggs and beef bacon on toasted muffins, covered in warm lemon hollandaise.", 920, "Breakfast"],
    ["Smoked Salmon Bagel", "Cream cheese, smoked salmon, cucumber and dill packed into a toasted seeded bagel.", 890, "Breakfast"],
    ["Mushroom Omelette", "Soft folded eggs filled with sautéed mushrooms, spinach and melted cheddar.", 690, "Breakfast"],
    ["Pancakes & Berries", "A stack of fluffy buttermilk pancakes served with berries, whipped cream and maple syrup.", 650, "Breakfast"],
    ["Avocado Sourdough Toast", "Smashed avocado and feta on grilled sourdough with lemon, chilli flakes and herbs.", 620, "Breakfast"],
    ["French Toast Brioche", "Brioche dipped in vanilla-cinnamon custard, griddled golden and topped with seasonal fruit.", 640, "Breakfast"],
    ["Chicken Pesto Panini", "Grilled chicken, basil pesto, mozzarella and tomato pressed inside crisp ciabatta.", 790, "Lunch"],
    ["Roast Beef Sandwich", "Thin-sliced roast beef, caramelised onion, rocket and mustard mayo on seeded bread.", 890, "Lunch"],
    ["Tuna Melt", "Tuna mixed with light mayo and herbs, topped with cheddar and toasted until bubbling.", 690, "Lunch"],
    ["Mediterranean Veg Wrap", "Roasted peppers, courgette, hummus, feta and leafy greens wrapped in a soft tortilla.", 620, "Lighter plates"],
    ["Chicken Caesar Salad", "Grilled chicken, crisp romaine, parmesan and garlic croutons with Caesar dressing.", 890, "Lighter plates"],
    ["Quinoa Garden Bowl", "Quinoa, avocado, cucumber, roast pumpkin and greens with a lemon-tahini dressing.", 820, "Lighter plates"],
    ["Tomato Basil Soup", "Roasted tomatoes simmered with onion and basil, blended smooth and served with bread.", 490, "Lighter plates"],
    ["Beef Lasagne", "Layers of pasta, slow-cooked beef ragù and béchamel baked under a golden cheese crust.", 1090, "Lunch"],
    ["Chicken Alfredo Pasta", "Penne with grilled chicken in a parmesan cream sauce finished with black pepper.", 1190, "Lunch"],
    ["Margherita Flatbread", "Thin baked flatbread topped with tomato, mozzarella, basil and a touch of olive oil.", 850, "Lunch"],
    ["Pain au Chocolat", "Buttery laminated pastry wrapped around dark chocolate and baked crisp.", 340, "Fresh bake"],
    ["Almond Croissant", "Flaky croissant filled with almond cream, topped with toasted almond flakes and sugar.", 390, "Fresh bake"],
    ["Cinnamon Roll", "Soft enriched dough rolled with cinnamon sugar and finished with a light vanilla glaze.", 360, "Fresh bake"],
    ["Blueberry Muffin", "Tender vanilla muffin folded with blueberries and baked with a crisp sugar top.", 320, "Fresh bake"],
    ["Carrot Cake Slice", "Moist spiced carrot cake with walnuts and a tangy cream-cheese frosting.", 480, "Sweet treats"],
    ["Chocolate Fudge Cake", "Rich cocoa sponge layered with chocolate ganache for a soft, fudgy finish.", 520, "Sweet treats"],
    ["Lemon Tart", "Buttery pastry shell filled with bright lemon curd and a delicate sugar dusting.", 430, "Sweet treats"],
    ["Flat White", "A double espresso balanced with velvety microfoamed milk for a smooth coffee.", 340, "Coffee"],
    ["Iced Caramel Latte", "Chilled espresso, milk and caramel syrup poured over ice for a smooth sweet finish.", 430, "Coffee"],
    ["Chai Latte", "Black tea simmered with warming spices and milk, then lightly sweetened.", 330, "Coffee"]
  ], ["photo-1533089860892-a7c6f0a88666", "photo-1553909489-cd47e0ef937f", "photo-1555507036-ab1f4038808a", "photo-1570968915860-54d5c301fa9f"]),
  "creamy-inn": createFoodMenu("ci", [
    ["Classic Sundae", "Vanilla ice cream layered with chocolate sauce, whipped cream and a bright cherry.", 390, "Sweet favourite"],
    ["Chocolate Milkshake", "Chocolate ice cream blended with chilled milk into a thick shake and topped with cream.", 450, "Milkshakes"],
    ["Waffle & Ice Cream", "Warm golden waffle topped with vanilla ice cream, chocolate drizzle and crushed nuts.", 590, "Waffles"],
    ["Ice Cream Tub", "A take-home tub of smooth, slow-churned ice cream in a classic flavour.", 690, "Take-home"],
    ["Strawberry Sundae", "Strawberry and vanilla scoops layered with berry sauce, cream and crunchy sprinkles.", 430, "Sweet favourite"],
    ["Banana Split", "A ripe banana with vanilla, chocolate and strawberry scoops, sauce and whipped cream.", 620, "Sweet favourite"],
    ["Oreo Cookie Sundae", "Vanilla ice cream with crushed chocolate sandwich cookies, fudge sauce and cream.", 490, "Sweet favourite"],
    ["Caramel Crunch Sundae", "Creamy vanilla scoops topped with salted caramel, toasted nut crunch and whipped cream.", 490, "Sweet favourite"],
    ["Mango Sorbet Cup", "A refreshing dairy-free style mango ice treat with a bright, fruity finish.", 350, "Fruit treats"],
    ["Strawberry Milkshake", "Strawberry ice cream and milk blended smooth, topped with a swirl of whipped cream.", 450, "Milkshakes"],
    ["Vanilla Milkshake", "Vanilla ice cream blended with chilled milk into a classic thick and creamy shake.", 420, "Milkshakes"],
    ["Oreo Milkshake", "Vanilla ice cream blended with chocolate cookies and milk, finished with cookie crumbs.", 490, "Milkshakes"],
    ["Mango Milkshake", "Ripe mango and vanilla ice cream blended with milk into a smooth tropical shake.", 470, "Milkshakes"],
    ["Chocolate Fudge Waffle", "Freshly cooked waffle topped with chocolate ice cream and warm fudge sauce.", 650, "Waffles"],
    ["Strawberry Waffle", "Golden waffle with strawberry scoops, berry sauce and sliced strawberries.", 640, "Waffles"],
    ["Banana Caramel Waffle", "Warm waffle finished with banana slices, caramel sauce and vanilla ice cream.", 650, "Waffles"],
    ["Brownie & Ice Cream", "Warm chocolate brownie paired with a scoop of vanilla and a drizzle of fudge.", 590, "Sweet favourite"],
    ["Chocolate Lava Cake", "A soft-baked chocolate cake with a gooey centre, served with a cool vanilla scoop.", 620, "Sweet favourite"],
    ["Cookie Dough Cup", "Vanilla ice cream folded with chocolate-chip cookie dough and chocolate pieces.", 520, "Sweet favourite"],
    ["Chocolate Chip Cookie", "A freshly baked soft-centred cookie packed with dark chocolate chips.", 250, "Bakery treats"],
    ["Chocolate Dipped Cone", "A crisp wafer cone filled with vanilla ice cream and dipped in a chocolate shell.", 290, "Cones"],
    ["Strawberry Cone", "A crunchy cone crowned with strawberry ice cream and a light berry swirl.", 280, "Cones"],
    ["Double Chocolate Cone", "Two scoops of chocolate ice cream in a crisp cone with chocolate flakes.", 350, "Cones"],
    ["Vanilla Ice Cream Cup", "Two generous scoops of classic vanilla ice cream served chilled in a cup.", 320, "Cones"],
    ["Mint Chocolate Chip Cup", "Cool mint ice cream folded with dark chocolate chips for a crisp, creamy bite.", 390, "Cones"],
    ["Peanut Butter Sundae", "Chocolate and vanilla scoops finished with peanut-butter sauce and roasted peanuts.", 520, "Sweet favourite"],
    ["Fruit Salad & Ice Cream", "Fresh seasonal fruit topped with vanilla ice cream and a little berry syrup.", 490, "Fruit treats"],
    ["Pineapple Sorbet Cup", "A cool pineapple sorbet with a juicy tropical flavour and refreshing finish.", 350, "Fruit treats"],
    ["Family Ice Cream Box", "A shareable selection of assorted ice cream scoops packed in a chilled take-home box.", 1190, "Take-home"],
    ["Chocolate Ice Cream Tub", "A take-home tub of rich cocoa ice cream with chocolate pieces throughout.", 720, "Take-home"]
  ], ["photo-1563805042-7684c019e1cb", "photo-1572490122747-3968b75cc699", "photo-1562376552-0d160a2f238d", "photo-1501446529957-6226bd447c46"]),
  "avon-bitez-nbo": createFoodMenu("ab", [
    ["Classic Beef Burger", "Seasoned beef patty seared on the grill with lettuce, tomato and house sauce in a toasted bun.", 590, "Bestseller"],
    ["Crispy Chicken Burger", "Chicken breast coated in crunchy seasoned crumbs with fresh greens and creamy sauce.", 650, "Burgers"],
    ["Chicken Bites", "Bite-sized chicken pieces seasoned, crumbed and fried crisp, served with a dipping sauce.", 480, "Chicken"],
    ["Chips", "Potato chips fried until golden with a crisp outside and fluffy centre, lightly seasoned.", 250, "Sides"],
    ["Double Beef Burger", "Two grilled beef patties stacked with cheddar, pickles and tangy burger dressing.", 850, "Burgers"],
    ["BBQ Chicken Burger", "Grilled chicken fillet glazed with smoky BBQ sauce, lettuce and red onion in a soft bun.", 690, "Burgers"],
    ["Spicy Chicken Burger", "Crispy chicken with chilli mayo, crunchy slaw and pickles in a toasted sesame bun.", 690, "Burgers"],
    ["Cheese Burger", "Juicy grilled beef topped with melted cheddar, sliced tomato and house burger sauce.", 680, "Burgers"],
    ["Bacon Beef Burger", "Grilled beef patty with crisp bacon, cheddar and smoky sauce in a toasted bun.", 790, "Burgers"],
    ["Veggie Burger", "A seasoned vegetable patty with lettuce, tomato and herbed mayo in a toasted bun.", 560, "Burgers"],
    ["Chicken Wrap", "Grilled chicken, lettuce, tomato and garlic mayo rolled into a warm tortilla.", 520, "Chicken"],
    ["Crispy Chicken Wrap", "Crunchy chicken strips, shredded cabbage and a creamy pepper sauce in a soft wrap.", 560, "Chicken"],
    ["Chicken Nuggets", "Golden crumbed chicken nuggets cooked crisp and served with a choice of dip.", 450, "Chicken"],
    ["Hot Wings", "Chicken wings seasoned with paprika and chilli, fried crisp and served with a cooling dip.", 620, "Chicken"],
    ["BBQ Wings", "Crisp chicken wings tossed in a sticky barbecue glaze with a lightly smoky finish.", 620, "Chicken"],
    ["Chicken Strips", "Tender chicken strips coated in seasoned crumbs and fried golden for dipping.", 520, "Chicken"],
    ["Beef Sausage & Chips", "A juicy beef sausage grilled until browned and served with a portion of golden chips.", 450, "Combos"],
    ["Chicken Burger Combo", "Crispy chicken burger paired with seasoned chips and a chilled soft drink.", 890, "Combos"],
    ["Beef Burger Combo", "Classic beef burger served with golden chips and your choice of soft drink.", 820, "Combos"],
    ["Chicken Bites Combo", "Crispy chicken bites with chips and a house dip for an easy, filling meal.", 690, "Combos"],
    ["Loaded Cheese Fries", "Hot chips topped with melted cheddar, spring onion and a creamy house drizzle.", 450, "Sides"],
    ["Peri-Peri Fries", "Golden fries tossed with peri-peri seasoning and served with garlic mayo.", 320, "Sides"],
    ["Masala Chips", "Crisp fries tossed with a tangy tomato, onion and warm-spice masala sauce.", 390, "Sides"],
    ["Onion Rings", "Sweet onion slices coated in a light seasoned batter and fried until crunchy.", 320, "Sides"],
    ["Coleslaw Cup", "Shredded cabbage and carrot folded through a creamy, lightly peppered dressing.", 220, "Sides"],
    ["Grilled Chicken Salad", "Sliced grilled chicken over lettuce, cucumber and tomato with a lemon dressing.", 590, "Lighter plates"],
    ["Beef Hot Dog", "Grilled beef sausage in a soft roll topped with onions and tangy tomato relish.", 420, "Combos"],
    ["Chicken Shawarma", "Spiced chicken with lettuce, tomato and garlic sauce rolled in warm flatbread.", 620, "Chicken"],
    ["Chocolate Brownie", "A rich cocoa brownie baked with a soft centre and a dusting of icing sugar.", 300, "Sweet treats"],
    ["Vanilla Milkshake", "Vanilla ice cream blended with chilled milk into a smooth, creamy shake.", 390, "Sweet treats"]
  ], ["photo-1568901346375-23c9450c58cd", "photo-1606755962773-d324e0a13086", "photo-1562967914-608f82629710", "photo-1573080496219-bb080dd4f877"]),
  "pizza-inn": [
    { id: "p1", name: "Chicken Tikka Pizza", description: "Tikka chicken, peppers, onions and mozzarella.", price: 1150, image: image("photo-1579751626657-72bc17010498", 480), tag: "Popular" },
    { id: "p2", name: "Classic Margherita", description: "Tomato, basil and plenty of mozzarella.", price: 890, image: image("photo-1574071318508-1cdbab80d002", 480) },
    { id: "p3", name: "BBQ Chicken Wings", description: "Sticky, smoky wings with a house BBQ glaze.", price: 580, image: image("photo-1527477396000-e27163b481c2", 480) },
    { id: "p4", name: "Garlic Bread", description: "Toasted, buttery and made for sharing.", price: 350, image: image("photo-1619531040576-f9416740661f", 480) }
  ],
  "mamas-kitchen": [
    { id: "m1", name: "Nyama Choma Plate", description: "Slow grilled beef, kachumbari and ugali.", price: 980, image: image("photo-1544025162-d76694265947", 480), tag: "Local favourite" },
    { id: "m2", name: "Pilau & Kachumbari", description: "Fragrant Swahili rice, tender beef and fresh salad.", price: 720, image: image("photo-1512058564366-18510be2db19", 480) },
    { id: "m3", name: "Chapati & Beef Stew", description: "Two soft chapatis and a hearty slow cooked stew.", price: 650, image: image("photo-1547592180-85f173990554", 480) }
  ],
  "burger-yard": [
    { id: "b1", name: "The Yard Smash", description: "Double smashed beef, cheddar, pickles and house sauce.", price: 790, image: image("photo-1568901346375-23c9450c58cd", 480), tag: "Bestseller" },
    { id: "b2", name: "Crispy Chicken Burger", description: "Crunchy chicken, slaw and a little spicy mayo.", price: 680, image: image("photo-1606755962773-d324e0a13086", 480) },
    { id: "b3", name: "Skin-on Fries", description: "Golden fries with our house seasoning.", price: 280, image: image("photo-1573080496219-bb080dd4f877", 480) }
  ],
  ...retailProducts,
  "flower-shop": [
    { id: "fl1", name: "Just Because Bouquet", description: "A bright seasonal bunch, wrapped with care.", price: 1850, image: image("photo-1490750967868-88aa4486c946", 480), tag: "Made with love" },
    { id: "fl2", name: "Sunshine Stems", description: "Cheerful golden blooms for a brighter day.", price: 1500, image: image("photo-1508610048659-a06b669e3321", 480) },
    { id: "fl3", name: "Little Thank You", description: "A sweet, simple bunch with a handwritten card.", price: 980, image: image("photo-1525310072745-f49212b5ac6d", 480) }
  ],
  miniso: [
    { id: "lf1", name: "Tumbler To-Go", description: "A colourful reusable bottle for busy days.", price: 690, image: image("photo-1602143407151-7111542de6e8", 480), tag: "Nice find" },
    { id: "lf2", name: "Soft Throw Blanket", description: "A cosy layer for slow evenings at home.", price: 1490, image: image("photo-1600369671236-e74521d4b6ad", 480) },
    { id: "lf3", name: "Mini Desk Plant", description: "A little green pick-me-up for your workspace.", price: 540, image: image("photo-1485955900006-10f4d324d411", 480) }
  ],
  "tamu-deals": [
    { id: "td1", name: "Pantry Starter Bundle", description: "A few clever staples to restock your shelves.", price: 990, oldPrice: 1380, image: image("photo-1542838132-92c53300491e", 480), tag: "Save 28%" },
    { id: "td2", name: "Fresh Fruit Family Pack", description: "A colourful box for the whole household.", price: 680, oldPrice: 860, image: image("photo-1610832958506-aa56368176cf", 480), tag: "Save 20%" },
    { id: "td3", name: "Snack Time Mix", description: "A generous mix of sweet and savoury treats.", price: 450, oldPrice: 590, image: image("photo-1621939514649-280e2aa2fda6", 480), tag: "Save 24%" }
  ],
  "quick-liquor": [
    { id: "q1", name: "Celebration Red", description: "A smooth, fruit-forward red wine for sharing.", price: 1650, image: image("photo-1510812431401-41d2bd2722f3", 480), tag: "Curated pick" },
    { id: "q2", name: "Craft Lager 6-pack", description: "Crisp and refreshing, best served chilled.", price: 1350, image: image("photo-1535958636474-b021ee887b13", 480) },
    { id: "q3", name: "Sparkling Rosé", description: "A bright, celebratory bottle with a delicate finish.", price: 2100, image: image("photo-1551538827-9c037cb4f32a", 480) }
  ],
  "drinks-corner": [
    { id: "dc1", name: "Weekend Mixer Bundle", description: "A friendly mix of drinks and mixers to share.", price: 1750, oldPrice: 1990, image: image("photo-1536935338788846bb9981813", 480), tag: "Bundle deal" },
    { id: "dc2", name: "Ginger Beer 4-pack", description: "Bright, spicy and extra refreshing.", price: 720, image: image("photo-1556679343-c7306c1976bc", 480) },
    { id: "dc3", name: "Apple Cider 4-pack", description: "Easygoing apple cider with a crisp finish.", price: 890, image: image("photo-1513558161293-cdaf765edfd7", 480) }
  ]
};

export const productInfo = (id, storeId) => (productsByStore[storeId] || []).find(product => product.id === id);

// Dynamic Supabase Catalog Loader
// Syncs stores, categories, and products directly from the Supabase database when configured.
export async function loadSupabaseCatalog(onUpdated) {
  if (!supabaseConfigured || !supabase) return;
  try {
    const [catRes, storeRes, prodRes] = await Promise.all([
      supabase.from("categories").select("id, name, slug, icon, is_active").eq("is_active", true),
      supabase.from("stores").select("*").eq("is_active", true),
      supabase.from("products").select("*").eq("is_available", true).limit(500)
    ]);

    let updated = false;

    if (!catRes.error && Array.isArray(catRes.data) && catRes.data.length > 0) {
      catRes.data.forEach(remoteCat => {
        const local = categories.find(c => c.id === remoteCat.id);
        if (local) {
          local.title = remoteCat.name;
          if (remoteCat.icon) local.icon = remoteCat.icon;
        } else {
          categories.push({
            id: remoteCat.id,
            title: remoteCat.name,
            icon: remoteCat.icon || "🛍️",
            tone: "palette-food",
            path: `${BASE}/categories/${remoteCat.slug}`,
            subtitle: "Delivered in Nairobi"
          });
        }
      });
      updated = true;
    }

    if (!storeRes.error && Array.isArray(storeRes.data) && storeRes.data.length > 0) {
      storeRes.data.forEach(remoteStore => {
        const localIndex = stores.findIndex(s => s.id === remoteStore.id);
        const mapped = {
          id: remoteStore.id,
          slug: remoteStore.slug,
          name: remoteStore.name,
          category: remoteStore.category_id,
          cuisine: remoteStore.cuisine || "Various",
          rating: String(remoteStore.rating || "4.8"),
          count: `${remoteStore.rating_count || 100}+`,
          time: `${remoteStore.delivery_min_minutes || 20}–${remoteStore.delivery_max_minutes || 35} min`,
          fee: remoteStore.delivery_fee_kes || 49,
          promo: remoteStore.promo_text || "",
          badge: remoteStore.badge || "Featured",
          image: remoteStore.image_url || image("photo-1555939594-58d7cb561ad1"),
          color: remoteStore.accent_color || "#159b81",
          description: remoteStore.description || ""
        };
        if (localIndex >= 0) stores[localIndex] = { ...stores[localIndex], ...mapped };
        else stores.push(mapped);
      });
      updated = true;
    }

    if (!prodRes.error && Array.isArray(prodRes.data) && prodRes.data.length > 0) {
      prodRes.data.forEach(remoteProd => {
        const storeId = remoteProd.store_id;
        if (!productsByStore[storeId]) productsByStore[storeId] = [];
        const existingIdx = productsByStore[storeId].findIndex(p => p.id === remoteProd.id);
        const item = {
          id: remoteProd.id,
          name: remoteProd.name,
          description: remoteProd.description,
          price: remoteProd.price_kes,
          ...(remoteProd.old_price_kes ? { oldPrice: remoteProd.old_price_kes } : {}),
          image: remoteProd.image_url || image("photo-1544025162-d76694265947", 480),
          ...(remoteProd.tag ? { tag: remoteProd.tag } : {})
        };
        if (existingIdx >= 0) productsByStore[storeId][existingIdx] = item;
        else productsByStore[storeId].push(item);
      });
      updated = true;
    }

    if (updated && typeof onUpdated === "function") {
      onUpdated();
    }
  } catch (error) {
    console.info("Catalog loaded from local seed; Supabase catalog sync note:", error?.message || error);
  }
}
