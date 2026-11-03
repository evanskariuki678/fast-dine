import { supabase, supabaseConfigured } from "./supabase.js";

const BASE = "/en/ke/nairobi";
const image = (id, width = 900) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=85`;

const categories = [
  { id: "food", title: "Food", icon: "🍔", tone: "peach", path: `${BASE}/categories/food_1`, subtitle: "Meals worth staying in for" },
  { id: "groceries", title: "Groceries", icon: "🥑", tone: "mint", path: `${BASE}/categories/groceries_4`, subtitle: "The everyday, delivered" },
  { id: "pharmacy", title: "Pharmacy & Beauty", icon: "🧴", tone: "lilac", path: `${BASE}/categories/pharmacy-beauty_3`, subtitle: "A little care, right on time" },
  { id: "shops", title: "Shops", icon: "🎁", tone: "sky", path: `${BASE}/categories/shops_22`, subtitle: "Find a little something" },
  { id: "deals", title: "Fast Dine Deals", icon: "✨", tone: "butter", path: `${BASE}/stores/glovo-bargains-nbo`, subtitle: "Good finds at lovely prices" },
  { id: "alcohol", title: "Drinks", icon: "🍷", tone: "rose", path: `${BASE}/categories/alcohol_21655`, subtitle: "Raise a glass, delivered" }
];

const stores = [
  { id: "galitos", slug: "galitos", name: "Galito's", category: "food", cuisine: "Chicken · Grill · Portuguese", rating: "4.8", count: "980+", time: "25–35 min", fee: 49, promo: "Grill favourites", badge: "Flame grilled", image: image("photo-1527477396000-e27163b481c2"), color: "#b63f27", description: "Flame-grilled chicken, bold sauces and sides made for sharing." },
  { id: "java", slug: "java-house", name: "Java House", category: "food", cuisine: "Coffee · Brunch · Burgers", rating: "4.8", count: "1.2k+", time: "20–30 min", fee: 49, promo: "Coffee & more", badge: "Popular", image: image("photo-1559305616-3f99cd43e353"), color: "#8c4e32", description: "Coffee, breakfast and comforting cafe favourites." },
  { id: "cjs-restaurant-nbo-ke", slug: "cjs-restaurant-nbo-ke", name: "CJ's Restaurant", category: "food", cuisine: "International · Burgers · Desserts", rating: "4.7", count: "1.1k+", time: "30–40 min", fee: 69, promo: "Something for everyone", badge: "Fan favourite", image: image("photo-1555939594-58d7cb561ad1"), color: "#a95535", description: "A broad menu of crowd-pleasing meals, treats and drinks." },
  { id: "artcaffe", slug: "artcaffe", name: "Artcaffé", category: "food", cuisine: "Cafe · Bakery · Brunch", rating: "4.7", count: "890+", time: "25–35 min", fee: 59, promo: "Cafe favourites", badge: "Freshly baked", image: image("photo-1509440159596-0249088772ff"), color: "#875c48", description: "Cafe classics, fresh bakes and all-day brunch favourites." },
  { id: "creamy-inn", slug: "creamy-inn", name: "Creamy Inn", category: "food", cuisine: "Ice cream · Desserts · Shakes", rating: "4.6", count: "620+", time: "20–30 min", fee: 49, promo: "Sweet treats", badge: "Made for treats", image: image("photo-1563805042-7684c019e1cb"), color: "#bd7391", description: "Ice cream, sundaes and cool treats for any kind of day." },
  { id: "avon-bitez-nbo", slug: "avon-bitez-nbo", name: "Avon Bitez", category: "food", cuisine: "Fast food · Burgers · Chicken", rating: "4.6", count: "430+", time: "25–35 min", fee: 49, promo: "Quick bites", badge: "Good value", image: image("photo-1568901346375-23c9450c58cd"), color: "#a24c24", description: "Burgers, crispy bites and easy-going meal combos." },
  { id: "carrefour", name: "Carrefour Market", category: "groceries", cuisine: "Groceries · Fresh produce", rating: "4.8", count: "2k+", time: "25–40 min", fee: 99, promo: "Save on essentials", badge: "Wide selection", image: image("photo-1542838132-92c53300491e"), color: "#4d8d64", description: "Fresh picks and pantry staples for your week." },
  { id: "naivas", name: "Naivas Foodmarket", category: "groceries", cuisine: "Groceries · Household", rating: "4.7", count: "1.6k+", time: "30–45 min", fee: 89, promo: "Weekly offers", badge: "Nearby", image: image("photo-1543168256-418811576931"), color: "#4e8c52", description: "Everything on your list, in one easy order." },
  { id: "fresh-basket", name: "Fresh Basket", category: "groceries", cuisine: "Fruit · Veg · Bakery", rating: "4.9", count: "320+", time: "20–30 min", fee: 69, promo: "Fresh today", badge: "Farm fresh", image: image("photo-1540420773420-3366772f4999"), color: "#8a9a45", description: "Seasonal produce picked with care." },
  { id: "goodlife", name: "Goodlife Pharmacy", category: "pharmacy", cuisine: "Pharmacy · Wellness", rating: "4.9", count: "420+", time: "20–35 min", fee: 89, promo: "Care essentials", badge: "Trusted", image: image("photo-1607619056574-7b8d3ee536b2"), color: "#689b82", description: "Everyday wellness and personal care essentials." },
  { id: "glam", name: "Glow & Go Beauty", category: "pharmacy", cuisine: "Skincare · Beauty", rating: "4.8", count: "210+", time: "25–40 min", fee: 79, promo: "Beauty edit", badge: "Trending", image: image("photo-1596462502278-27bfdc403348"), color: "#ba849d", description: "Find your next favourite in skincare and beauty." },
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

const productsByStore = {
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
  carrefour: [
    { id: "c1", name: "Seasonal Fruit Box", description: "A fresh mix of the week's best fruit.", price: 780, image: image("photo-1610832958506-aa56368176cf", 480), tag: "Fresh pick" },
    { id: "c2", name: "Farm Fresh Eggs (Tray)", description: "Thirty free-range eggs from local farms.", price: 790, image: image("photo-1506976785307-8732e854ad03", 480) },
    { id: "c3", name: "Avocado (3 pieces)", description: "Creamy, ripe avocados selected for this week.", price: 180, image: image("photo-1523049673857-eb18f1d7b578", 480) },
    { id: "c4", name: "Fresh Milk 1L", description: "Locally sourced whole milk.", price: 110, image: image("photo-1550583724-b2692b85b150", 480) }
  ],
  naivas: [
    { id: "n1", name: "Weekly Essentials Bag", description: "A handy bundle of your everyday staples.", price: 1290, image: image("photo-1542838132-92c53300491e", 480), tag: "Great value" },
    { id: "n2", name: "Fresh Tomatoes 1kg", description: "Ripe, juicy tomatoes for all your favourite meals.", price: 160, image: image("photo-1546094096-0df4bcaaa337", 480) },
    { id: "n3", name: "Brown Bread", description: "Freshly baked wholemeal loaf.", price: 85, image: image("photo-1509440159596-0249088772ff", 480) }
  ],
  "fresh-basket": [
    { id: "f1", name: "Greens & Goodness Box", description: "Spinach, kale, herbs and crisp seasonal greens.", price: 540, image: image("photo-1540420773420-3366772f4999", 480), tag: "Farm fresh" },
    { id: "f2", name: "Mangoes (3 pieces)", description: "Sweet, fragrant mangoes, ready to enjoy.", price: 240, image: image("photo-1553279768-865429fa0078", 480) },
    { id: "f3", name: "Carrots 1kg", description: "Sweet and crunchy, freshly harvested.", price: 130, image: image("photo-1445282768818-728615cc910a", 480) }
  ],
  goodlife: [
    { id: "g1", name: "Everyday Wellness Kit", description: "A handy edit of daily care essentials.", price: 950, image: image("photo-1607619056574-7b8d3ee536b2", 480), tag: "Staff pick" },
    { id: "g2", name: "Hydrating Hand Cream", description: "A rich, quick absorbing daily moisturiser.", price: 420, image: image("photo-1608248543803-ba4f8c70ae0b", 480) },
    { id: "g3", name: "Vitamin C Gummies", description: "A bright citrus flavoured daily supplement.", price: 780, image: image("photo-1571781926291-c477ebfd024b", 480) }
  ],
  glam: [
    { id: "gl1", name: "Daily Glow Set", description: "A gentle cleanser and daily moisturiser duo.", price: 1450, image: image("photo-1596462502278-27bfdc403348", 480), tag: "Beauty edit" },
    { id: "gl2", name: "Everyday SPF 50", description: "Lightweight broad spectrum face sunscreen.", price: 1150, image: image("photo-1556229010-6c3f2c9ca5f8", 480) },
    { id: "gl3", name: "Lip Care Duo", description: "Nourishing balms for soft, happy lips.", price: 560, image: image("photo-1586495777744-4413f21062fa", 480) }
  ],
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

const settings = [
  { id: "profile", title: "Personal details", icon: "♙", path: "/en/profile" },
  { id: "past-orders", title: "Past orders", icon: "◷", path: "/en/profile/past-orders" },
  { id: "account", title: "Account", icon: "⚙", path: "/en/profile/account" },
  { id: "phone-number", title: "Phone number", icon: "⌕", path: "/en/profile/account/phone-number" },
  { id: "change-password", title: "Change password", icon: "▣", path: "/en/profile/account/change-password" },
  { id: "payment-methods", title: "Payment methods", icon: "▤", path: "/en/profile/account/payment-methods" },
  { id: "promo-codes", title: "Promo codes", icon: "✦", path: "/en/profile/account/promo-codes" },
  { id: "gift-cards", title: "Gift cards", icon: "▧", path: "/en/profile/account/gift-cards" },
  { id: "invoice-information", title: "Invoice information", icon: "▥", path: "/en/profile/account/invoice-information" },
  { id: "privacy-settings", title: "Privacy settings", icon: "◈", path: "/en/profile/account/privacy-settings" },
  { id: "language", title: "Language", icon: "文", path: "/en/profile/language" }
];

const read = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } };
const readSession = (key, fallback) => { try { return JSON.parse(sessionStorage.getItem(key)) ?? fallback; } catch { return fallback; } };
function normalizePaymentMethods(value, profile) {
  const defaults = { "M-Pesa": { type: "mpesa", label: "M-Pesa", phone: profile.phone || "" }, "Visa": { type: "card", brand: "Visa", last4: "" }, "Cash on delivery": { type: "cash", label: "Cash on delivery" } };
  const methods = (Array.isArray(value) ? value : []).map((method, index) => {
    const source = typeof method === "string" ? { id: `legacy-${index}`, ...defaults[method] } : method;
    if (!source || !["mpesa", "card", "cash"].includes(source.type)) return null;
    return source.type === "card"
      ? { id: String(source.id || `card-${index}`), type: "card", brand: ["Visa", "Mastercard", "American Express"].includes(source.brand) ? source.brand : "Visa", last4: String(source.last4 || "").replace(/\D/g, "").slice(-4), isDefault: Boolean(source.isDefault) }
      : source.type === "mpesa"
        ? { id: String(source.id || `mpesa-${index}`), type: "mpesa", label: "M-Pesa", phone: String(source.phone || ""), isDefault: Boolean(source.isDefault) }
        : { id: String(source.id || `cash-${index}`), type: "cash", label: "Cash on delivery", isDefault: Boolean(source.isDefault) };
  }).filter(Boolean);
  if (!methods.length) methods.push({ id: "mpesa-default", type: "mpesa", label: "M-Pesa", phone: profile.phone || "", isDefault: true });
  const defaultIndex = Math.max(0, methods.findIndex(method => method.isDefault));
  return methods.map((method, index) => ({ ...method, isDefault: index === defaultIndex }));
}
const storedAuthFlow = readSession("fastdine-auth-flow", {});
const hasPendingAuthFlow = storedAuthFlow.pending === true && storedAuthFlow.method !== "phone";
const initialRouteParams = new URLSearchParams(window.location.search);
const storedProfile = read("tamu-profile", { name: "", email: "", phone: "", address: "Kilimani, Nairobi", apartment: "", note: "" });
const state = {
  cart: read("tamu-cart", []),
  orders: read("tamu-orders", []),
  profile: storedProfile,
  payments: normalizePaymentMethods(read("tamu-payments", []), storedProfile),
  checkoutPaymentId: read("tamu-checkout-payment", ""),
  promoCode: read("tamu-promo-code", ""),
  privacy: read("tamu-privacy", { offers: true, analytics: false }),
  signedIn: supabaseConfigured ? false : read("fastdine-signed-in", false),
  authBootstrapped: !supabaseConfigured,
  supabaseBootstrapped: !supabaseConfigured,
  authMode: initialRouteParams.get("mode") || (hasPendingAuthFlow ? storedAuthFlow.mode : "login"),
  authMethod: "email",
  authIdentity: hasPendingAuthFlow ? storedAuthFlow.identity || "" : "",
  authDraft: hasPendingAuthFlow ? storedAuthFlow.draft || {} : {},
  authError: "",
  authResendAvailable: false,
  recoveryEmailSent: false,
  passwordRecoveryReady: false,
  search: "",
  categoryFilter: "all",
  cartOpen: false,
  storeOpen: null,
  modal: null,
  supportTopic: null
};

const money = amount => `KSh ${Number(amount).toLocaleString("en-KE")}`;
const paymentIcon = method => method.type === "mpesa" ? "M" : method.type === "card" ? method.brand === "American Express" ? "AMEX" : method.brand === "Mastercard" ? "MC" : "VISA" : "💵";
const paymentName = method => method.type === "card" ? `${method.brand}${method.last4 ? ` ···· ${method.last4}` : ""}` : method.type === "mpesa" ? "M-Pesa" : "Cash on delivery";
const paymentDescription = method => method.type === "card" ? method.last4 ? "Saved demo card · secure card storage is not connected" : "Demo card option · no card details saved" : method.type === "mpesa" ? method.phone ? `Mobile money · ending ${method.phone.replace(/\D/g, "").slice(-3)}` : "Mobile money · add a number when setting it up" : "Pay in KSh when your order arrives, where available";
const selectedPayment = () => state.payments.find(method => method.id === state.checkoutPaymentId) || state.payments.find(method => method.isDefault) || state.payments[0] || null;
const promoDiscount = () => state.promoCode === "FAST10" ? Math.round(subtotal() * 0.1) : 0;
const currentPath = () => window.location.pathname;
const save = () => {
  localStorage.setItem("tamu-cart", JSON.stringify(state.cart));
  localStorage.setItem("tamu-orders", JSON.stringify(state.orders));
  localStorage.setItem("tamu-profile", JSON.stringify(state.profile));
  localStorage.setItem("tamu-payments", JSON.stringify(state.payments));
  localStorage.setItem("tamu-checkout-payment", JSON.stringify(state.checkoutPaymentId));
  localStorage.setItem("tamu-promo-code", JSON.stringify(state.promoCode));
  localStorage.setItem("tamu-privacy", JSON.stringify(state.privacy));
  localStorage.setItem("fastdine-signed-in", JSON.stringify(state.signedIn));
};
const saveAuthFlow = () => sessionStorage.setItem("fastdine-auth-flow", JSON.stringify({ pending: true, mode: state.authMode, method: "email", identity: state.authIdentity, draft: state.authDraft }));
const clearAuthFlow = () => sessionStorage.removeItem("fastdine-auth-flow");

function readableAuthError(error) {
  const message = String(error?.message || "");
  const lower = message.toLowerCase();
  const code = String(error?.code || "").toLowerCase();
  if (code === "email_not_confirmed" || /email not confirmed|email_not_confirmed/.test(lower)) return "Your email isn't confirmed yet. Request a new verification code below.";
  if (code === "invalid_credentials" || /invalid login credentials|invalid credentials/.test(lower)) return "We couldn't sign you in with that email and password. Check both details, or create an account if you haven't signed up yet.";
  if (code === "user_already_exists" || /user already registered|user already exists/.test(lower)) return "If you already have an account with this email, log in instead. Unconfirmed accounts can request a new verification code.";
  if (/email address not authorized|email.*not authorized/.test(lower)) return "Supabase's default email sender only delivers to authorized team addresses. Set up custom SMTP to email customers.";
  if (/over_email_send_rate_limit|email rate limit/.test(lower)) return "The default Supabase email sender has reached its limit. Set up custom SMTP for customer sign-in.";
  if (/rate limit|too many requests/.test(lower)) return "Too many code requests. Wait a little, then try again.";
  if (/invalid.*(otp|token)|expired/.test(lower)) return "That code is incorrect or expired. Request a fresh one and try again.";
  return message || "We couldn't complete sign-in. Check your details and try again.";
}

async function resendSignupConfirmation() {
  const email = state.authIdentity.trim().toLowerCase();
  if (!supabase) {
    state.authError = "Supabase is not configured. Check the VITE_SUPABASE settings and restart the dev server.";
    render();
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    state.authError = "Enter a valid email address before requesting a new verification code.";
    render();
    return;
  }

  try {
    const { error } = await supabase.auth.resend({ type: "signup", email });
    if (error) throw error;
    state.authMode = "signup";
    state.authMethod = "email";
    state.authIdentity = email;
    state.authError = "";
    state.authResendAvailable = false;
    saveAuthFlow();
    navigate(authPageUrl("verify", "signup", "email"));
    toast("If this account still needs verification, a new code is on its way.");
  } catch (error) {
    state.authError = readableAuthError(error);
    state.authResendAvailable = true;
    render();
  }
}

async function writeCustomerProfile(user) {
  const profileClient = supabase;
  if (!user?.id) return;
  let existing = null;
  let readError = null;
  if (profileClient) {
    const result = await profileClient
      .from("profiles")
      .select("full_name, phone")
      .eq("id", user.id)
      .maybeSingle();
    existing = result.data;
    readError = result.error;
    if (readError) console.warn("Could not read the Fast Dine profile:", readError.message);
  }

  const fullName = user.user_metadata?.full_name || existing?.full_name || "";
  const email = user.email || "";
  const phone = user.phone || "";
  const profile = { id: user.id, full_name: fullName };
  if (phone) profile.phone = phone;
  if (profileClient && !existing && !readError) {
    const { error } = await profileClient.from("profiles").upsert(profile, { onConflict: "id" });
    if (error) console.warn("Could not create the Fast Dine profile:", error.message);
  }

  state.profile = {
    ...state.profile,
    name: fullName,
    email,
    phone: phone || existing?.phone || ""
  };
  state.signedIn = true;
  save();
}

async function handleAuthSession(event, session) {
  state.supabaseBootstrapped = true;
  state.authBootstrapped = true;
  const isPasswordResetReturn = currentPath() === "/en/login/recovery"
    && new URLSearchParams(window.location.search).get("mode") === "reset"
    && Boolean(session?.user);
  if (event === "PASSWORD_RECOVERY" || isPasswordResetReturn) {
    state.passwordRecoveryReady = true;
    state.recoveryEmailSent = false;
    state.authError = "";
  }
  if (!session?.user) {
    state.signedIn = false;
    save();
    if (currentPath() === "/en/auth/callback") {
      state.authError = "That sign-in link expired. Request a new code or link.";
      clearAuthFlow();
      history.replaceState({}, "", authPageUrl("login"));
    }
    render();
    return;
  }

  await writeCustomerProfile(session.user);
  if (["INITIAL_SESSION", "SIGNED_IN"].includes(event) && currentPath() === "/en/auth/callback") {
    const destination = loginReturnPath();
    clearAuthFlow();
    navigate(destination);
    toast("You're signed in to The Fast Dine.");
  } else {
    render();
  }
}

function initializeSupabaseAuth() {
  if (!supabase) return;
  supabase.auth.onAuthStateChange((event, session) => {
    window.setTimeout(() => { void handleAuthSession(event, session); }, 0);
  });
}

async function signOutCustomer() {
  try {
    if (supabase) {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    }
  } catch (error) { toast(readableAuthError(error)); return; }
  state.profile.name = "";
  state.profile.email = "";
  state.profile.phone = "";
  state.signedIn = false;
  save();
  render();
  toast("You've signed out on this device");
}

const cartQty = () => state.cart.reduce((sum, item) => sum + item.qty, 0);
const subtotal = () => state.cart.reduce((sum, item) => sum + item.price * item.qty, 0);
const selectedStore = () => state.storeOpen ? stores.find(store => store.id === state.storeOpen) : null;
const productInfo = id => Object.values(productsByStore).flat().find(product => product.id === id);

function navigate(path) {
  state.modal = null;
  state.storeOpen = null;
  state.cartOpen = false;
  if (currentPath() !== path) history.pushState({}, "", path);
  window.scrollTo({ top: 0, behavior: "smooth" });
  render();
}

function toast(message) {
  const root = document.querySelector("#toast-root");
  root.innerHTML = `<div class="toast">${message}</div>`;
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => root.innerHTML = "", 2600);
}

function header() {
  const address = state.profile.address || "Kilimani, Nairobi";
  const loginPageOpen = currentPath().startsWith("/en/login");
  const accountTarget = state.signedIn ? "/en/profile" : "/en/login?returnPath=%2Fen%2Fke%2Fnairobi";
  return `<header class="topbar">
    <a href="${BASE}" class="brand" data-route="${BASE}" aria-label="The Fast Dine home"><img class="brand-logo" src="/assets/the-fast-dine-logo.png" alt="The Fast Dine"></a>
    <button class="address-pill" data-action="address"><span class="pin-icon">⌖</span><span class="address-copy"><small>Deliver to</small><strong>${escapeHtml(address)}</strong></span><span class="chevron">⌄</span></button>
    <div class="header-search"><span>⌕</span><input id="global-search" placeholder="Dishes, shops, groceries..." value="${escapeAttr(state.search)}" autocomplete="off"/><kbd>⌘ K</kbd></div>
    <div class="header-actions">
      <button class="icon-button search-mobile" data-action="search" aria-label="Search">⌕</button>
      <button class="login-button" data-route="${loginPageOpen ? loginReturnPath() : accountTarget}"><span class="user-icon">♙</span><span>${loginPageOpen ? "Back" : state.signedIn ? escapeHtml(state.profile.name ? state.profile.name.split(" ")[0] : "My account") : "Log in"}</span></button>
      <button class="cart-button" data-action="cart"><span class="cart-icon">▱</span><span class="cart-label">Basket</span>${cartQty() ? `<b class="cart-count">${cartQty()}</b>` : ""}</button>
    </div>
  </header>`;
}

function escapeHtml(value = "") { return String(value).replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]); }
function escapeAttr(value = "") { return escapeHtml(value); }

function categoryTiles(compact = false) {
  return `<div class="category-grid ${compact ? "category-grid-compact" : ""}">${categories.map((cat, i) => `<button class="category-tile ${cat.tone}" data-category="${cat.id}" style="--delay:${i * 45}ms"><span class="category-emoji">${cat.icon}</span><span class="category-label">${cat.title}</span><span class="category-sub">${compact ? "Explore" : cat.subtitle}</span><span class="tile-arrow">↗</span></button>`).join("")}</div>`;
}

function storeCard(store) {
  return `<article class="store-card" data-store="${store.id}" tabindex="0" role="button" aria-label="Open ${escapeAttr(store.name)}">
    <div class="store-photo-wrap"><img class="store-photo" src="${store.image}" alt="" loading="lazy"><span class="store-badge">${store.badge}</span><span class="favorite-heart" data-favorite="${store.id}" aria-label="Save ${store.name}">♡</span>${store.promo ? `<span class="promo-tag">${store.promo}</span>` : ""}</div>
    <div class="store-info"><div class="store-title-row"><strong>${store.name}</strong><span class="rating">★ ${store.rating}</span></div><p>${store.cuisine}</p><div class="store-meta"><span>◷ ${store.time}</span><i></i><span>${store.fee ? `${money(store.fee)} delivery` : "Free delivery"}</span></div></div>
  </article>`;
}

function section(title, description, list, extra = "") {
  return `<section class="content-section"><div class="section-heading"><div><p class="eyebrow">${extra || "MADE FOR YOUR DAY"}</p><h2>${title}</h2>${description ? `<p class="section-description">${description}</p>` : ""}</div><button class="text-link" data-action="see-all">See all <span>→</span></button></div><div class="store-grid">${list.map(storeCard).join("")}</div></section>`;
}

function homePage() {
  const filtered = stores.filter(store => {
    const matches = !state.search || `${store.name} ${store.cuisine} ${store.category}`.toLowerCase().includes(state.search.toLowerCase());
    const category = state.categoryFilter === "all" || store.category === state.categoryFilter;
    return matches && category;
  });
  const showSearch = state.search || state.categoryFilter !== "all";
  return `<main class="home-page">
    <section class="hero-section">
      <div class="hero-copy"><div class="hero-kicker"><span>✳</span> YOUR NEIGHBOURHOOD, ON THE WAY</div><h1>Good things,<br><em>coming your way.</em></h1><p>Food, groceries and little everyday joys, delivered across Nairobi.</p>
        <div class="hero-address"><span class="pin-icon">⌖</span><input id="hero-address" placeholder="Where should we deliver?" value="${escapeAttr(state.profile.address)}"><button data-action="set-address">Find my spot <span>→</span></button></div>
        <div class="hero-note"><span class="tiny-check">✓</span> Fast local delivery <span class="note-dot">·</span> Made for Nairobi</div>
      </div>
      <div class="hero-art"><div class="hero-shape"></div><img src="${image("photo-1565299624946-b28f40a0ae38", 1100)}" alt="Freshly baked pizza with colourful toppings"/><div class="floating-note floating-note-one"><span>✦</span><div><strong>Little joys,</strong><small>right to your door</small></div></div><div class="floating-note floating-note-two"><span>⏱</span><div><strong>30 min</strong><small>your meal's on its way</small></div></div><div class="hero-sticker">made<br>for you<span>♥</span></div></div>
      <span class="hero-sparkle sparkle-one">✳</span><span class="hero-sparkle sparkle-two">✦</span>
    </section>
    <section class="category-section"><div class="section-heading"><div><p class="eyebrow">A LITTLE BIT OF EVERYTHING</p><h2>What are you in the mood for?</h2></div><span class="small-caption">All around Nairobi <span>⌖</span></span></div>${categoryTiles()}</section>
    <section class="deal-banner"><div class="deal-copy"><span class="deal-label">A LITTLE SOMETHING EXTRA</span><h2>Good finds.<br>Even better prices.</h2><p>Fresh picks and everyday favourites on special today.</p><button class="button-dark" data-category="deals">Explore Fast Dine Deals <span>→</span></button></div><div class="deal-image"><img src="${image("photo-1542838132-92c53300491e", 1000)}" alt="Fresh market produce"><div class="deal-burst"><b>UP TO</b><strong>40%</strong><b>OFF</b></div></div></section>
    ${showSearch ? section(state.search ? `Results for “${escapeHtml(state.search)}”` : `${categoryTitle(state.categoryFilter)} near you`, "A few lovely places to start.", filtered) : section("A few local favourites", "Loved by your neighbours, ready when you are.", stores.filter(store => store.category === "food").slice(0, 4), "AROUND THE CORNER")}
    ${!showSearch ? `<section class="feature-strip"><div class="feature-icon">🥬</div><div><p class="eyebrow">FRESH FROM THE MARKET</p><h3>Your weekly shop, sorted.</h3><p>Fresh produce, pantry essentials and a few treats for the week ahead.</p></div><button data-category="groceries">Shop groceries <span>→</span></button><div class="feature-art"><img src="${image("photo-1540420773420-3366772f4999", 660)}" alt="Colourful fresh vegetables"></div></section>${section("Something for every day", "Good food and good finds, from places around the corner.", stores.filter(store => ["groceries", "pharmacy", "shops", "alcohol"].includes(store.category)).slice(0, 4), "NEARBY & READY")}` : ""}
    <section class="promise-row"><div><span>⌖</span><strong>Made for your neighbourhood</strong><p>Nearby places you know and love.</p></div><div><span>✿</span><strong>A little more thoughtful</strong><p>Local picks, delivered with care.</p></div><div><span>◷</span><strong>On your time</strong><p>Easy ordering, right when you need it.</p></div></section>
    ${footer()}
  </main>`;
}

function englishLandingPage() {
  const featuredStores = stores.filter(store => store.category === "food").slice(0, 4);
  return `<main class="english-home">
    <section class="english-hero">
      <div class="english-hero-copy"><p class="hero-kicker"><span>✳</span> THE FAST DINE · NAIROBI</p><h1>Food delivery<br><em>and more.</em></h1><p>Groceries, local shops, pharmacy essentials and your next favourite meal — all brought to your door.</p><form class="english-address" data-form="english-address"><span class="pin-icon">⌖</span><input name="address" placeholder="Enter your Nairobi delivery address" aria-label="Delivery address" required><button>Find places <span>→</span></button></form><button class="english-location-link" data-route="${BASE}">Explore Nairobi <span>↗</span></button></div>
      <div class="english-hero-art"><div class="english-art-orbit"></div><img src="${image("photo-1547592180-85f173990554", 1100)}" alt="A freshly prepared meal with vegetables"><div class="english-art-note"><span>✦</span><div><b>Good food, nearby</b><small>Picked for Nairobi</small></div></div><div class="english-art-sticker">GOOD<br>THINGS<br>✳</div></div>
    </section>
    <section class="english-categories"><div class="section-heading"><div><p class="eyebrow">A LITTLE BIT OF EVERYTHING</p><h2>What can we bring you?</h2></div><button class="text-link" data-route="${BASE}">See all <span>→</span></button></div>${categoryTiles()}</section>
    <section class="english-featured"><div class="section-heading"><div><p class="eyebrow">AROUND THE CORNER</p><h2>Popular in Nairobi</h2><p class="section-description">Local favourites and familiar names, ready when you are.</p></div><button class="text-link" data-route="${BASE}/categories/food_1">Browse food <span>→</span></button></div><div class="store-grid">${featuredStores.map(storeCard).join("")}</div></section>
    <section class="english-perks"><article><span>⌖</span><p class="eyebrow">NEAR YOU</p><h3>Find places around your neighbourhood</h3><p>Start with Kilimani or set a delivery address to explore what’s nearby.</p><button data-route="${BASE}">Explore Nairobi <b>→</b></button></article><article><span>◷</span><p class="eyebrow">ON YOUR TIME</p><h3>Food and everyday essentials</h3><p>Browse restaurants, groceries, pharmacy and shops in one place.</p><button data-category="groceries">Browse categories <b>→</b></button></article><article><span>♡</span><p class="eyebrow">MADE FOR YOU</p><h3>A little more convenience</h3><p>Save your details, keep track of orders and make each visit easier.</p><button data-route="/en/profile">Your account <b>→</b></button></article></section>
    <section class="english-kenya"><div><p class="eyebrow">CURRENTLY SERVING</p><h2>Kenya <span>🇰🇪</span></h2><p>Good things are on the way in Nairobi.</p></div><button class="button-dark" data-route="${BASE}">Go to Nairobi <span>→</span></button></section>
    ${footer()}
  </main>`;
}

function categoryTitle(id) { return categories.find(item => item.id === id)?.title || "Stores"; }
function categoryPage(category) {
  const list = stores.filter(store => store.category === category.id);
  const chips = category.id === "food" ? ["Popular", "Chicken", "Burgers", "Cafe & coffee", "Bakery", "Desserts", "All restaurants"] : category.id === "groceries" ? ["Supermarket", "Fruit & veg", "Bakery", "Dairy", "Drinks", "Household"] : category.id === "pharmacy" ? ["Pharmacy", "Beauty", "Baby care", "Wellness"] : category.id === "shops" ? ["Flowers", "Beauty", "Home", "Gifts", "Electronics"] : category.id === "alcohol" ? ["Wine", "Beer", "Spirits", "Mixers", "Snacks"] : ["Top deals", "Pantry", "Fresh picks", "Bundles"];
  const found = list.filter(store => !state.search || `${store.name} ${store.cuisine}`.toLowerCase().includes(state.search.toLowerCase()));
  const heroImage = category.id === "food" ? image("photo-1547592180-85f173990554", 800) : category.id === "groceries" ? image("photo-1542838132-92c53300491e", 800) : category.id === "pharmacy" ? image("photo-1596462502278-27bfdc403348", 800) : category.id === "alcohol" ? image("photo-1510812431401-41d2bd2722f3", 800) : image("photo-1490750967868-88aa4486c946", 800);
  const eyebrow = category.id === "food" ? "RESTAURANTS AROUND NAIROBI" : "DELIVERED AROUND NAIROBI";
  const heading = category.id === "food" ? "Restaurants near you" : "All stores";
  const description = category.id === "food" ? "Explore local favourites, cafes and comfort food" : category.subtitle;
  return `<main class="listing-page"><div class="breadcrumbs"><button data-route="${BASE}">Nairobi</button><span>›</span><b>${category.title}</b></div><section class="listing-hero ${category.tone}"><div><span class="listing-icon">${category.icon}</span><p class="eyebrow">${eyebrow}</p><h1>${category.title}</h1><p>${description}.</p></div><div class="listing-art"><img src="${heroImage}" alt=""></div></section><div class="listing-content"><div class="chip-row">${chips.map((chip, index) => `<button class="filter-chip ${index === 0 ? "selected" : ""}" data-filter-chip="${escapeAttr(chip)}">${chip}</button>`).join("")}<button class="filter-button" data-action="sort">☷ <span>Sort & filter</span></button></div><div class="listing-header"><div><p class="eyebrow">PICKED FOR YOU</p><h2>${heading} <span class="result-count">${found.length}</span></h2></div><label class="sort-label">Sort by <select id="sort-select"><option>Recommended</option><option>Top rated</option><option>Fastest delivery</option></select></label></div><div class="store-grid store-grid-large" id="listing-stores">${found.map(storeCard).join("")}</div>${!found.length ? `<div class="empty-state"><span>🔎</span><h3>No places found</h3><p>Try a different search or choose another category.</p><button class="button-dark" data-action="clear-search">Clear search</button></div>` : ""}</div>${footer()}</main>`;
}

function dealProductCards(products, storeId = "tamu-deals") {
  return products.map(product => `<article class="deal-product-card"><div class="deal-product-image"><img src="${product.image}" alt="${escapeAttr(product.name)}"><span>${product.tag || "Fast Dine pick"}</span></div><div class="deal-product-info"><h3>${product.name}</h3><p>${product.description}</p><div><strong>${money(product.price)}</strong>${product.oldPrice ? `<del>${money(product.oldPrice)}</del>` : ""}<button data-add="${product.id}" data-store="${storeId}" aria-label="Add ${escapeAttr(product.name)}">＋</button></div></div></article>`).join("");
}

function storeDetailPage(store) {
  const products = productsByStore[store.id] || [];
  const isFood = store.category === "food";
  const tabs = isFood ? ["Popular", ...new Set(products.map(product => product.tag).filter(Boolean))] : ["Today's offers", "Fresh picks", "Pantry", "Snacks & treats"];
  const sectionName = isFood ? "Menu" : "Today's offers";
  const breadcrumbCategory = isFood ? "Food" : "Groceries";
  const breadcrumbPath = `${BASE}/categories/${isFood ? "food_1" : "groceries_4"}`;
  const eyebrow = isFood ? "MADE FRESH, READY FOR YOU" : "A LITTLE MORE FOR LESS";
  const detailEyebrow = isFood ? "GOOD FOOD, PICKED FOR YOU" : "GOOD FINDS, PICKED FOR YOU";
  const searchPlaceholder = isFood ? `Search ${store.name}` : "Search Fast Dine Deals Market";
  return `<main class="listing-page store-detail-page ${isFood ? "food-menu-page" : ""}"><div class="breadcrumbs"><button data-route="${BASE}">Nairobi</button><span>›</span><button data-route="${breadcrumbPath}">${breadcrumbCategory}</button><span>›</span><b>${store.name}</b></div><section class="store-page-hero"><img src="${store.image}" alt=""><div class="store-page-copy"><span class="store-badge">${store.badge}</span><p class="eyebrow">${eyebrow}</p><h1>${store.name}</h1><p>${store.description}</p><div class="store-modal-meta"><span>★ ${store.rating} (${store.count})</span><span>◷ ${store.time}</span><span>${money(store.fee)} delivery</span></div></div></section><div class="store-detail-tags">${tabs.map((tab, i) => `<button class="filter-chip ${i === 0 ? "selected" : ""}" data-filter-chip="${escapeAttr(tab)}">${tab}</button>`).join("")}<label class="store-detail-search">⌕ <input id="store-search" aria-label="Search ${escapeAttr(store.name)} menu" placeholder="${escapeAttr(searchPlaceholder)}"></label></div><div class="store-detail-layout"><section><div class="listing-header"><div><p class="eyebrow">${detailEyebrow}</p><h2>${sectionName} <span class="result-count">${products.length}</span></h2></div><span class="store-open-label"><i></i> Open now</span></div><div class="deal-product-grid" id="deal-products">${dealProductCards(products, store.id)}</div></section><aside class="store-side-card"><span class="side-card-icon">${isFood ? "🍽️" : "🧺"}</span><p class="eyebrow">YOUR BASKET</p><h3>${cartQty() ? `${cartQty()} lovely pick${cartQty() > 1 ? "s" : ""}` : "Room for something good"}</h3><p>${cartQty() ? `${money(subtotal())} subtotal · ${money(store.fee)} delivery` : `Choose something from the menu to get started.`}</p><button class="button-dark full-width" data-action="cart">${cartQty() ? "View basket" : isFood ? "Browse menu" : "Browse offers"} <span>→</span></button></aside></div>${footer()}</main>`;
}

function footer() {
  return `<footer class="site-footer"><div class="footer-top"><div class="footer-brand"><a class="brand" href="${BASE}" data-route="${BASE}" aria-label="The Fast Dine home"><img class="brand-logo footer-logo" src="/assets/the-fast-dine-logo.png" alt="The Fast Dine"></a><p>Good things, coming your way.<br>Made with a little Nairobi love.</p></div><div><h4>Explore</h4><a href="${BASE}/categories/food_1" data-route="${BASE}/categories/food_1">Food</a><a href="${BASE}/categories/groceries_4" data-route="${BASE}/categories/groceries_4">Groceries</a><a href="${BASE}/categories/shops_22" data-route="${BASE}/categories/shops_22">Shops</a></div><div><h4>Your account</h4><a href="/en/profile" data-route="/en/profile">Profile</a><a href="/en/profile/past-orders" data-route="/en/profile/past-orders">Past orders</a><a href="/en/profile/account/payment-methods" data-route="/en/profile/account/payment-methods">Payment methods</a></div><div><h4>Say hello</h4><a href="mailto:hello@fastdine.example">Help & support</a><a href="/en/profile/account/privacy-settings" data-route="/en/profile/account/privacy-settings">Privacy</a><span class="social-links">◎　◉　✦</span></div></div><div class="footer-bottom"><span>© 2026 The Fast Dine · Nairobi, Kenya</span><span>Made for the good days and the busy ones.</span><a href="/en" data-route="/en">English · KSh</a></div></footer>`;
}

function mobileDock() {
  const path = currentPath();
  const active = path === BASE || path === "/" || path === "/en" ? "explore" : path.includes("/categories/food_") ? "food" : path.includes("/categories/groceries_") ? "groceries" : path.includes("past-orders") ? "orders" : path.startsWith("/en/profile") || path.startsWith("/en/login") ? "account" : "";
  const accountPath = state.signedIn ? "/en/profile" : "/en/login?returnPath=%2Fen%2Fke%2Fnairobi";
  const links = [
    { id: "explore", label: "Explore", icon: "⌂", path: BASE },
    { id: "food", label: "Food", icon: "✳", path: `${BASE}/categories/food_1` },
    { id: "groceries", label: "Groceries", icon: "♧", path: `${BASE}/categories/groceries_4` },
    { id: "orders", label: "Orders", icon: "◷", path: "/en/profile/past-orders" },
    { id: "account", label: "Account", icon: "♙", path: accountPath }
  ];
  return `<nav class="mobile-dock" aria-label="Main navigation">${links.map(link => `<a href="${link.path}" data-route="${link.path}" class="${active === link.id ? "active" : ""}" ${active === link.id ? 'aria-current="page"' : ""}><span>${link.icon}</span><small>${link.label}</small></a>`).join("")}</nav>`;
}

function loginReturnPath() {
  const requested = new URLSearchParams(window.location.search).get("returnPath");
  return requested && requested.startsWith("/") && !requested.startsWith("//") ? requested : BASE;
}

function authPageUrl(page, mode = state.authMode, method = state.authMethod) {
  const params = new URLSearchParams({ returnPath: loginReturnPath() });
  if (page === "verify") { params.set("mode", mode); params.set("method", method); }
  const path = page === "login" ? "/en/login" : `/en/login/${page}`;
  return `${path}?${params.toString()}`;
}

function loginPage() {
  const returnPath = loginReturnPath();
  const path = currentPath();
  const page = path === "/en/login/signup" ? "signup" : path === "/en/login/verify" ? "verify" : path === "/en/login/recovery" ? "recovery" : "login";
  const params = new URLSearchParams(window.location.search);
  if (page === "signup") state.authMode = "signup";
  if (page === "login") state.authMode = "login";
  if (page === "verify") state.authMode = params.get("mode") || state.authMode;
  state.authMethod = "email";
  const maskedIdentity = state.authIdentity.includes("@")
    ? `${state.authIdentity[0]}•••${state.authIdentity.slice(state.authIdentity.indexOf("@"))}`
    : "";
  let authBody;
  if (state.signedIn) {
    authBody = `<div class="auth-success-mark">✓</div><p class="eyebrow">THE FAST DINE ACCOUNT</p><h1>You're already in.</h1><p class="auth-intro">Your account is ready. Head back to Nairobi and find something lovely.</p><button class="button-dark full-width" data-route="${returnPath}">Continue to Nairobi <span>→</span></button><button class="auth-secondary" data-route="/en/profile">Manage account</button>`;
  } else if (page === "verify" && state.authMode !== "signup") {
    authBody = `<p class="eyebrow">PASSWORD SIGN-IN</p><h1>Use your password to log in.</h1><p class="auth-intro">Email verification codes are only used to confirm new accounts. Log in with your email and password instead.</p><button class="button-dark full-width" data-route="${authPageUrl("login")}">Back to log in <span>→</span></button>`;
  } else if (page === "verify" && !state.authIdentity) {
    authBody = `<p class="eyebrow">VERIFICATION</p><h1>Start with your details.</h1><p class="auth-intro">For privacy, your contact details aren't in this link. Return to the first step and request a new sign-in code.</p><button class="button-dark full-width" data-route="${authPageUrl("login")}">Back to log in <span>→</span></button>`;
  } else if (page === "verify") {
    authBody = `<button class="auth-back-step" data-auth-step="${state.authMode === "signup" ? "signup" : "login"}">← Change details</button><p class="eyebrow">STEP 2 OF 2 · VERIFY EMAIL</p><h1>Check your inbox.</h1><p class="auth-intro">Enter the 6-digit code sent to <strong>${escapeHtml(maskedIdentity)}</strong> to ${state.authMode === "signup" ? "finish creating your account" : "continue to your account"}.</p><form class="auth-form" data-form="verify"><label>Email verification code<input id="auth-code" name="code" type="text" inputmode="numeric" autocomplete="one-time-code" maxlength="6" pattern="[0-9]{6}" placeholder="6-digit code" required autofocus></label>${state.authError ? `<p class="auth-error">${escapeHtml(state.authError)}</p>` : ""}<button class="button-dark full-width">Verify and continue <span>→</span></button></form><div class="settings-note">Supabase checks your code and creates your signed-in session. Never share the code with anyone.</div><button class="auth-secondary" data-action="auth-resend">Didn't receive a code? Send again</button>`;
  } else if (page === "recovery") {
    const resetLinkRequested = params.get("mode") === "reset";
    const canSetNewPassword = resetLinkRequested && state.passwordRecoveryReady;
    const recoveryBody = canSetNewPassword
      ? `<p class="auth-intro">Choose a new password for your account.</p><form data-form="password-reset" class="auth-form"><label>New password<input name="password" type="password" autocomplete="new-password" minlength="8" required></label><label>Confirm new password<input name="confirm" type="password" autocomplete="new-password" minlength="8" required></label>${state.authError ? `<p class="auth-error">${escapeHtml(state.authError)}</p>` : ""}<button class="button-dark full-width">Save new password <span>→</span></button></form>`
      : state.recoveryEmailSent
        ? `<p class="auth-intro">If an account exists for that email, a password reset link is on its way. Check your inbox and spam folder.</p><button class="auth-secondary" data-action="recovery-resend">Send another reset link</button>`
        : `<p class="auth-intro">${resetLinkRequested ? "This reset link may have expired or already been used. Enter your email to request a fresh one." : "Enter the email address on your account and we'll send you a secure password reset link."}</p><form data-form="recovery" class="auth-form"><label>Email address<input name="email" type="email" autocomplete="email" placeholder="you@example.com" value="${escapeAttr(state.authIdentity || state.profile.email)}" required></label>${state.authError ? `<p class="auth-error">${escapeHtml(state.authError)}</p>` : ""}<button class="button-dark full-width">Send reset link <span>→</span></button></form>`;
    authBody = `<button class="auth-back-step" data-auth-step="login">← Back to log in</button><p class="eyebrow">ACCOUNT RECOVERY</p><h1>${canSetNewPassword ? "Choose a new password." : state.recoveryEmailSent ? "Check your inbox." : "Can't get in?"}</h1>${recoveryBody}<button class="auth-secondary" data-auth-step="login">Return to log in</button>`;
  } else if (page === "signup") {
    authBody = `<div class="auth-mode-tabs"><button data-auth-mode="login">Log in</button><button class="active" data-auth-mode="signup">Create account</button></div><p class="eyebrow">STEP 1 OF 2 · YOUR DETAILS</p><h1>Let's get you started.</h1><p class="auth-intro">Create your account with an email and password. We'll email you a six-digit code to verify your address.</p>${state.authError ? `<p class="auth-error">${escapeHtml(state.authError)}</p>` : ""}<form data-form="signup" class="auth-form"><label>Full name<input name="name" autocomplete="name" placeholder="Your name" value="${escapeAttr(state.authDraft.name || "")}" required></label><label>Email address<input name="email" type="email" autocomplete="email" placeholder="you@example.com" value="${escapeAttr(state.authDraft.email || "")}" required></label><label>Password<input name="password" type="password" autocomplete="new-password" minlength="8" required></label><label>Confirm password<input name="confirm" type="password" autocomplete="new-password" minlength="8" required></label><label class="auth-consent"><input type="checkbox" name="demoTerms" required><span>I agree to the Terms and Privacy Policy. <button type="button" data-action="auth-terms">Read the note</button></span></label><button class="button-dark full-width">Create account <span>→</span></button></form><p class="auth-terms">Have an account? <button data-auth-mode="login">Log in</button></p>`;
  } else {
    authBody = `<div class="auth-mode-tabs"><button class="active" data-auth-mode="login">Log in</button><button data-auth-mode="signup">Create account</button></div><p class="eyebrow">SIGN IN</p><h1>Good to see you.</h1><p class="auth-intro">Log in with the email address and password for your account.</p>${state.authError ? `<p class="auth-error">${escapeHtml(state.authError)}</p>` : ""}<form data-form="login" class="auth-form"><label>Email address<input name="identity" type="email" autocomplete="email" placeholder="you@example.com" value="${escapeAttr(state.authIdentity || state.profile.email)}" required></label><label>Password<input name="password" type="password" autocomplete="current-password" minlength="8" required></label><button class="button-dark full-width">Log in <span>→</span></button></form>${state.authResendAvailable ? `<button class="auth-secondary auth-resend-link" data-action="auth-resend">Resend email verification code</button>` : ""}<div class="auth-problems"><span>Having trouble?</span><button data-auth-step="recovery">Forgot your password?</button></div><p class="auth-terms">By continuing, you agree to the <button type="button" data-action="auth-terms">Terms and Privacy Policy</button>.</p><div class="auth-preview-note"><span>✓</span><p>Supabase verifies your email and manages your account session. Your password is never stored in this app.</p></div>`;
  }
  return `<main class="auth-page"><div class="auth-breadcrumb"><button data-route="${returnPath}">← Back to Nairobi</button><span>THE FAST DINE ACCOUNT</span></div><div class="auth-layout"><section class="auth-card"><img class="auth-logo" src="/assets/the-fast-dine-logo.png" alt="The Fast Dine">${authBody}</section><aside class="auth-art"><img src="${image("photo-1547592180-85f173990554", 1000)}" alt="A freshly prepared meal"><div class="auth-art-caption"><span>GOOD FOOD, GOOD COMPANY</span><h2>Your next favourite<br>is just around the corner.</h2><p>Nairobi's local spots, ready when you are.</p></div><span class="auth-art-sticker">fresh<br>& local ✳</span></aside></div>${footer()}</main>`;
}

function profilePage(path) {
  const current = settings.find(item => item.path === path) || settings[0];
  const body = profileContent(current);
  return `<main class="profile-page"><div class="breadcrumbs"><button data-route="${BASE}">Home</button><span>›</span><b>My account</b>${current.id !== "profile" ? `<span>›</span><b>${current.title}</b>` : ""}</div><div class="profile-layout"><aside class="profile-sidebar"><div class="profile-intro"><span class="profile-avatar">${(state.profile.name || "T").trim().charAt(0).toUpperCase()}</span><div><small>GOOD TO SEE YOU</small><h2>${escapeHtml(state.profile.name || "Your account")}</h2><span>${escapeHtml(state.profile.email || "Your details, all in one place")}</span></div></div><nav class="profile-nav">${settings.map(item => `<button class="profile-nav-item ${current.id === item.id ? "active" : ""}" data-route="${item.path}"><span>${item.icon}</span>${item.title}<b>›</b></button>`).join("")}<button class="profile-nav-item signout-link" data-action="logout"><span>↪</span>Sign out</button></nav></aside><section class="profile-content"><p class="eyebrow">YOUR FAST DINE ACCOUNT</p><h1>${current.title}</h1>${body}</section></div>${footer()}</main>`;
}

function profileContent(item) {
  if (item.id === "past-orders") {
    return state.orders.length ? `<p class="profile-lead">Every order has a little story. Here's yours.</p><div class="orders-list">${state.orders.map(order => `<article class="order-card"><div class="order-card-icon">${order.items?.[0]?.emoji || "🛍️"}</div><div class="order-card-main"><div class="order-card-heading"><div><strong>${escapeHtml(order.store || "Fast Dine order")}</strong><p>${new Date(order.createdAt).toLocaleDateString("en-KE", { weekday: "short", month: "short", day: "numeric", year: "numeric" })} · ${order.items.reduce((n, item) => n + item.qty, 0)} items</p></div><span class="order-status">${order.status || "Delivered"}</span></div><div class="order-card-bottom"><b>${money(order.total)}</b><button class="subtle-button" data-reorder="${order.id}">Order again ↗</button></div></div></article>`).join("")}</div>` : `<div class="empty-state profile-empty"><span>🧾</span><h3>Your next favourite is out there.</h3><p>When you place an order, you'll find it right here.</p><button class="button-dark" data-route="${BASE}">Explore Nairobi <span>→</span></button></div>`;
  }
  if (item.id === "profile") return `<p class="profile-lead">Keep your details up to date for a smoother delivery.</p><form class="settings-form" data-form="profile"><label>Full name<input name="name" placeholder="e.g. Amina Wanjiku" value="${escapeAttr(state.profile.name)}" required></label><label>Email address<input name="email" type="email" placeholder="you@example.com" value="${escapeAttr(state.profile.email)}"></label><label>Phone number<div class="input-with-prefix"><span>🇰🇪 +254</span><input name="phone" placeholder="7XX XXX XXX" value="${escapeAttr(state.profile.phone)}"></div></label><div class="form-footer"><span>Your details are saved on this device.</span><button class="button-dark">Save changes <span>→</span></button></div></form>`;
  if (item.id === "account") return `<p class="profile-lead">A few simple ways to keep your account just how you like it.</p><div class="account-links">${settings.filter(entry => !["profile", "past-orders", "account"].includes(entry.id)).map(entry => `<button data-route="${entry.path}"><span class="account-link-icon">${entry.icon}</span><span><b>${entry.title}</b><small>Manage your ${entry.title.toLowerCase()}</small></span><strong>›</strong></button>`).join("")}</div>`;
  if (item.id === "phone-number") return `<p class="profile-lead">A current number helps your courier reach you when they're nearby.</p><form class="settings-form narrow-form" data-form="phone"><label>Phone number<div class="input-with-prefix"><span>🇰🇪 +254</span><input name="phone" placeholder="7XX XXX XXX" value="${escapeAttr(state.profile.phone)}" required></div></label><div class="form-footer"><span>We'll keep it private.</span><button class="button-dark">Update number <span>→</span></button></div></form>`;
  if (item.id === "change-password") return `<p class="profile-lead">Set or update a password for signing in with your phone or email.</p><form class="settings-form narrow-form" data-form="password"><label>New password<input type="password" name="password" autocomplete="new-password" placeholder="At least 8 characters" minlength="8" required></label><label>Confirm new password<input type="password" name="confirm" autocomplete="new-password" placeholder="Type it again" minlength="8" required></label><div class="form-footer"><span>Your password is stored securely by Supabase Auth.</span><button class="button-dark">Update password <span>→</span></button></div></form><div class="settings-note">After setting a password, choose “Use a password instead” on the sign-in page. One-time codes remain available too.</div>`;
  if (item.id === "payment-methods") return `<p class="profile-lead">Manage the ways you can pay. Choose a preferred method and select from your saved methods at checkout.</p><div class="payment-method-list">${state.payments.length ? state.payments.map(method => `<article class="saved-payment"><span class="payment-mark ${method.type === "mpesa" ? "mpesa" : method.type === "card" ? "card-mark" : "cash-mark"}">${paymentIcon(method)}</span><div class="saved-payment-copy"><b>${escapeHtml(paymentName(method))}${method.isDefault ? `<span class="default-payment-tag">Preferred</span>` : ""}</b><small>${escapeHtml(paymentDescription(method))}</small></div><div class="saved-payment-actions">${!method.isDefault ? `<button data-default-payment="${escapeAttr(method.id)}">Make preferred</button>` : ""}<button class="remove-payment" data-remove-payment="${escapeAttr(method.id)}">Remove</button></div></article>`).join("") : `<div class="empty-payment"><span>▤</span><b>No payment methods saved yet</b><small>Add a method to make checkout easier.</small></div>`}</div><button class="button-dark add-payment-method" data-action="add-payment-method">＋ Add a payment method</button><div class="settings-note payment-safety-note"><b>Preview only</b><span>Payments aren’t processed here. Never enter a full card number, CVV, M-Pesa PIN or one-time code. Real payment setup requires a secure payment provider.</span></div><div class="settings-note">Payment options can depend on your area and store. Cash is shown in local currency where available.</div>`;
  if (item.id === "promo-codes") return `<p class="profile-lead">Add an offer to your account before checkout. Valid offers appear automatically in your order summary.</p><form class="settings-form narrow-form promo-code-form" data-form="promo-code"><label>Promo code<input name="code" placeholder="Enter a code" autocomplete="off" required></label><div class="form-footer"><span>Preview code: FAST10</span><button class="button-dark">Apply code <span>→</span></button></div></form>${state.promoCode ? `<div class="applied-promo"><span>✦</span><div><b>${escapeHtml(state.promoCode)} applied</b><small>10% off eligible item subtotal in this preview.</small></div><button data-action="remove-promo">Remove</button></div>` : ""}<div class="settings-note">This preview accepts FAST10 only. Promo availability and terms would be confirmed by the live service.</div>`;
  if (item.id === "gift-cards") return `<p class="profile-lead">A little treat for someone you love (or for your future self).</p><div class="gift-card-preview"><div><span>FAST DINE GIFT CARD</span><strong>Good things<br>are better shared.</strong><b>THE FAST DINE</b></div><div class="gift-card-side"><span>GIFT CARDS</span><h3>Send a little joy.</h3><p>Choose an amount, add a note, and make someone's day.</p><button class="button-dark" data-action="gift-card">Explore gift cards <span>→</span></button></div></div><div class="settings-note">Gift cards are a demo feature in this preview.</div>`;
  if (item.id === "invoice-information") return `<p class="profile-lead">Add your billing details for invoices on future orders.</p><form class="settings-form" data-form="invoice"><label>Business or full name<input name="invoiceName" placeholder="Name on your invoice" value="${escapeAttr(read("tamu-invoice", {}).name || "")}"></label><label>PIN / Tax number<input name="pin" placeholder="Optional tax PIN" value="${escapeAttr(read("tamu-invoice", {}).pin || "")}"></label><label>Billing address<textarea name="invoiceAddress" placeholder="Street, area, city">${escapeHtml(read("tamu-invoice", {}).address || "")}</textarea></label><div class="form-footer"><span>Only used for your invoices.</span><button class="button-dark">Save invoice details <span>→</span></button></div></form>`;
  if (item.id === "privacy-settings") return `<p class="profile-lead">You're in control of what we send and how your data is used.</p><div class="privacy-options"><label><span><b>Offers & good finds</b><small>Occasional updates about new spots and offers.</small></span><input type="checkbox" data-privacy="offers" ${state.privacy.offers ? "checked" : ""}><i></i></label><label><span><b>Help us make The Fast Dine better</b><small>Share anonymous usage data to improve your experience.</small></span><input type="checkbox" data-privacy="analytics" ${state.privacy.analytics ? "checked" : ""}><i></i></label></div><div class="settings-note">Your choices are saved on this device.</div>`;
  if (item.id === "language") return `<p class="profile-lead">Choose the language you'd like to use around The Fast Dine.</p><div class="language-options">${[["English", "English", "🇬🇧"], ["Kiswahili", "Kiswahili", "🇰🇪"]].map(([id, title, flag]) => `<button class="language-option ${read("tamu-language", "English") === id ? "selected" : ""}" data-language="${id}"><span>${flag}</span><b>${title}</b>${read("tamu-language", "English") === id ? `<strong>✓</strong>` : `<small>›</small>`}</button>`).join("")}</div>`;
}

function checkoutPage() {
  const fee = state.cart.length ? (stores.find(store => store.id === state.cart[0].store)?.fee ?? 79) : 0;
  const serviceFee = state.cart.length ? 25 : 0;
  const discount = promoDiscount();
  const total = subtotal() + fee + serviceFee - discount;
  const activePayment = selectedPayment();
  const methods = state.payments.map(method => {
    const details = method.type === "mpesa"
      ? method.phone ? `Payment request sent to the number ending ${method.phone.replace(/\D/g, "").slice(-3)} after order confirmation.` : "Add a mobile number to receive an M-Pesa payment prompt."
      : method.type === "card"
        ? method.last4 ? `${method.brand} ending ${method.last4}. Card details are not stored in this preview.` : `${method.brand} option. Add and process cards only through a secure payment provider.`
        : "Pay the delivery person in cash when your order arrives.";
    const markClass = method.type === "mpesa" ? "mpesa" : method.type === "cash" ? "cash-mark" : "card-mark";
    return `<label class="checkout-payment ${activePayment?.id === method.id ? "selected" : ""}"><input type="radio" name="checkout-payment" value="${escapeAttr(method.id)}" ${activePayment?.id === method.id ? "checked" : ""}><span class="payment-mark ${markClass}">${paymentIcon(method)}</span><span class="checkout-payment-copy"><b>${escapeHtml(paymentName(method))}${method.isDefault ? `<em>Preferred</em>` : ""}</b><small>${escapeHtml(details)}</small></span><span class="checkout-payment-check" aria-hidden="true">✓</span></label>`;
  }).join("");
  const store = stores.find(item => item.id === state.cart[0]?.store);
  const itemCountLabel = `${cartQty()} ${cartQty() === 1 ? "item" : "items"}`;
  return `<main class="checkout-page"><div class="breadcrumbs"><button data-route="${BASE}">Home</button><span>›</span><b>Checkout</b></div><div class="checkout-title"><div><p class="eyebrow">REVIEW YOUR ORDER</p><h1>Checkout</h1><p>Confirm your delivery and payment details before placing your order.</p></div><span class="checkout-step"><i>1</i> Your details <b>—</b> <i class="current">2</i> Review & pay</span></div><div class="checkout-layout"><section class="checkout-main"><div class="checkout-card delivery-checkout-card"><div class="card-heading"><div><span class="step-icon">⌖</span><div><h2>Delivery address</h2><p>Where should we bring your order?</p></div></div><button data-action="address">Change</button></div><div class="delivery-address"><span class="delivery-address-label">DELIVERING TO</span><b>${escapeHtml(state.profile.address || "Add a delivery address")}</b>${state.profile.apartment ? `<span>${escapeHtml(state.profile.apartment)}</span>` : ""}${state.profile.phone ? `<span class="delivery-contact">Contact: ${escapeHtml(state.profile.phone)}</span>` : ""}<small><i>●</i> Estimated delivery · 25–40 min</small></div><button class="add-instructions" data-action="instructions">${state.profile.note ? "✎ Edit delivery instructions" : "＋ Add delivery instructions"}</button>${state.profile.note ? `<p class="delivery-note">${escapeHtml(state.profile.note)}</p>` : ""}</div><div class="checkout-card payment-checkout-card"><div class="card-heading"><div><span class="step-icon">▤</span><div><h2>Payment method</h2><p>Choose how you’d like to pay for this order.</p></div></div><button data-route="/en/profile/account/payment-methods">Manage</button></div><div class="checkout-payments">${methods || `<div class="no-payment"><p>No payment methods added yet.</p><button data-action="add-payment-method">Add a payment method <span>→</span></button></div>`}</div>${state.payments.length ? `<button class="checkout-add-payment" data-action="add-payment-method">＋ Add another payment method</button>` : ""}<p class="checkout-payment-note"><span>🔒</span> Payment details stay protected. This storefront preview does not process payments or store full card details, security codes or M-Pesa PINs.</p></div><div class="checkout-card basket-checkout-card"><div class="card-heading"><div><span class="step-icon">🛍️</span><div><h2>Your items <small>${itemCountLabel}</small></h2><p>${store ? `From ${escapeHtml(store.name)} · ${store.time} delivery` : "Review items and quantities in your order."}</p></div></div><button data-route="${BASE}">Add items</button></div>${state.cart.length ? `<div class="checkout-items">${state.cart.map(item => { const product = productInfo(item.id); return `<div class="checkout-item"><img src="${product?.image || ""}" alt="${escapeAttr(item.name)}" loading="lazy"><div><b>${escapeHtml(item.name)}</b><small>${money(item.price)} each</small><div class="quantity-control"><button data-qty="${escapeAttr(item.id)}" data-delta="-1" aria-label="Remove one ${escapeAttr(item.name)}">−</button><span>${item.qty}</span><button data-qty="${escapeAttr(item.id)}" data-delta="1" aria-label="Add one ${escapeAttr(item.name)}">＋</button></div></div><strong>${money(item.qty * item.price)}</strong></div>`; }).join("")}</div>` : `<div class="empty-basket-inline"><span>🧺</span><p>Your basket is empty. Add a local favourite before checkout.</p><button data-route="${BASE}">Explore restaurants <span>→</span></button></div>`}</div></section><aside class="checkout-summary"><div class="summary-sticky"><p class="eyebrow">ORDER TOTAL</p><h2>Price details</h2><div class="summary-line"><span>Items <small>${itemCountLabel}</small></span><b>${money(subtotal())}</b></div><div class="summary-line"><span>Delivery fee <small>${store?.name ? `From ${escapeHtml(store.name)}` : "Local delivery"}</small></span><b>${money(fee)}</b></div><div class="summary-line"><span>Service fee <small>Order handling</small></span><b>${money(serviceFee)}</b></div>${discount ? `<div class="summary-line promo-discount"><span>${escapeHtml(state.promoCode)} discount</span><b>−${money(discount)}</b></div>` : ""}<button class="promo-button" data-route="/en/profile/account/promo-codes">${state.promoCode ? `${escapeHtml(state.promoCode)} applied · Manage promo` : "＋ Add a promo code"}</button><div class="summary-total"><span>Total to pay <small>All listed charges included</small></span><strong>${money(total)}</strong></div><button class="button-dark place-order" data-action="place-order" ${!state.cart.length || !activePayment ? "disabled" : ""}>Place order <span>→</span></button><p class="checkout-terms">Your order will be sent to ${escapeHtml(state.profile.address || "your delivery address")}.</p></div><div class="checkout-help"><span>♡</span><div><b>Need a hand?</b><small>Questions about your order? <a href="mailto:hello@fastdine.example">Contact support</a></small></div></div></aside></div>${footer()}</main>`;
}

function renderOverlay() {
  const root = document.querySelector("#overlay-root");
  if (state.storeOpen) {
    const store = selectedStore();
    if (!store) { state.storeOpen = null; root.innerHTML = ""; return; }
    const products = productsByStore[store.id] || [];
    root.innerHTML = `<div class="overlay-backdrop" data-close="store"><section class="store-modal" role="dialog" aria-modal="true" aria-label="${store.name}"><button class="modal-close" data-close="store" aria-label="Close">×</button><div class="store-modal-hero"><img src="${store.image}" alt=""><div class="store-modal-title"><span class="store-badge">${store.badge}</span><h2>${store.name}</h2><p>${store.description}</p><div class="store-modal-meta"><span>★ ${store.rating} (${store.count})</span><span>◷ ${store.time}</span><span>${money(store.fee)} delivery</span></div></div></div><div class="store-modal-tabs"><span class="active">Menu</span><span>Info</span><span>Reviews</span><span class="store-modal-search">⌕ Search this menu</span></div><div class="product-list">${products.map(product => `<article class="product-card"><div class="product-copy">${product.tag ? `<span class="product-tag">${product.tag}</span>` : ""}<h3>${product.name}</h3><p>${product.description}</p><strong>${money(product.price)} ${product.oldPrice ? `<del>${money(product.oldPrice)}</del>` : ""}</strong></div><div class="product-image"><img src="${product.image}" alt="${product.name}" loading="lazy"><button data-add="${product.id}" data-store="${store.id}" aria-label="Add ${product.name}">＋</button></div></article>`).join("")}</div><div class="store-modal-footer"><span>${cartQty() ? `${cartQty()} items · ${money(subtotal())}` : "Your basket is waiting"}</span><button class="button-dark" data-action="cart">View basket <span>→</span></button></div></section></div>`;
    return;
  }
  if (state.cartOpen) { root.innerHTML = cartDrawer(); return; }
  if (state.modal) { root.innerHTML = modalContent(); return; }
  root.innerHTML = "";
}

function cartDrawer() {
  const fee = state.cart.length ? (stores.find(store => store.id === state.cart[0].store)?.fee ?? 79) : 0;
  return `<div class="overlay-backdrop drawer-backdrop" data-close="cart"><aside class="cart-drawer" role="dialog" aria-modal="true"><div class="drawer-heading"><div><p class="eyebrow">YOUR PICKS</p><h2>Your basket <span>${cartQty()}</span></h2></div><button class="modal-close" data-close="cart">×</button></div>${state.cart.length ? `<div class="drawer-store"><span>🏡</span><div><b>${escapeHtml(stores.find(store => store.id === state.cart[0].store)?.name || "Your local store")}</b><small>About 25–40 min · ${money(fee)} delivery</small></div></div><div class="drawer-items">${state.cart.map(item => { const product = productInfo(item.id); return `<div class="drawer-item"><img src="${product?.image || ""}" alt=""><div class="drawer-item-info"><b>${escapeHtml(item.name)}</b><small>${money(item.price)}</small><div class="quantity-control"><button data-qty="${item.id}" data-delta="-1">−</button><span>${item.qty}</span><button data-qty="${item.id}" data-delta="1">＋</button></div></div><strong>${money(item.price * item.qty)}</strong></div>`; }).join("")}</div><div class="drawer-bottom"><div class="summary-line"><span>Subtotal</span><b>${money(subtotal())}</b></div><div class="summary-line"><span>Delivery</span><b>${money(fee)}</b></div><button class="button-dark full-width" data-route="${BASE}/order-summary">Go to checkout <span>→</span></button><button class="keep-shopping" data-close="cart">Keep browsing</button></div>` : `<div class="empty-basket"><span class="basket-doodle">🧺</span><h3>Your basket's got room for something good.</h3><p>Explore nearby favourites and add a little something.</p><button class="button-dark" data-close="cart">Explore places <span>→</span></button></div>`}</aside></div>`;
}

function modalContent() {
  if (state.modal === "address") return `<div class="overlay-backdrop" data-close="modal"><section class="simple-modal" role="dialog" aria-modal="true"><button class="modal-close" data-close="modal">×</button><span class="modal-illustration">⌖</span><p class="eyebrow">A GOOD PLACE TO START</p><h2>Where should we bring it?</h2><p>We’ll show you the lovely local places around you.</p><form data-form="address"><label>Delivery address<input name="address" placeholder="Street, neighbourhood, Nairobi" value="${escapeAttr(state.profile.address)}" required autofocus></label><label>Apartment or building <span class="optional">OPTIONAL</span><input name="apartment" placeholder="e.g. Green Park Apartments" value="${escapeAttr(state.profile.apartment)}"></label><button class="button-dark full-width">Save delivery address <span>→</span></button></form><button class="use-location" data-action="location">⌖ Use my current location</button></section></div>`;
  if (state.modal === "payment-method-picker") return `<div class="overlay-backdrop" data-close="modal"><section class="simple-modal payment-modal" role="dialog" aria-modal="true" aria-labelledby="payment-picker-title"><button class="modal-close" data-close="modal" aria-label="Close">×</button><span class="modal-illustration">▤</span><p class="eyebrow">PAYMENT METHODS</p><h2 id="payment-picker-title">Add a way to pay</h2><p>Choose a method to add to your Fast Dine account.</p><div class="payment-picker-options"><button data-payment-add="mpesa"><span class="payment-mark mpesa">M</span><span><b>M-Pesa</b><small>Kenya mobile money preview</small></span><strong>›</strong></button><button data-payment-add="card"><span class="payment-mark card-mark">VISA</span><span><b>Credit or debit card</b><small>Visa, Mastercard or American Express</small></span><strong>›</strong></button><button data-payment-add="cash"><span class="payment-mark cash-mark">💵</span><span><b>Cash on delivery</b><small>Pay in KSh when available</small></span><strong>＋</strong></button></div><p class="payment-safety-note">Payment types depend on the area and store. This preview doesn't connect to a payment service.</p></section></div>`;
  if (state.modal === "add-payment-card") return `<div class="overlay-backdrop" data-close="modal"><section class="simple-modal payment-modal" role="dialog" aria-modal="true" aria-labelledby="add-card-title"><button class="modal-close" data-close="modal" aria-label="Close">×</button><span class="modal-illustration">▤</span><p class="eyebrow">DEMO CARD</p><h2 id="add-card-title">Add a card option</h2><p>This preview saves only the card network and last four digits.</p><form data-form="payment-card"><label>Card network<select name="brand"><option>Visa</option><option>Mastercard</option><option>American Express</option></select></label><label>Last 4 digits<input name="last4" inputmode="numeric" autocomplete="off" maxlength="4" pattern="[0-9]{4}" placeholder="1234" required></label><button class="button-dark full-width">Save demo card <span>→</span></button></form><p class="payment-safety-note"><b>Don't enter real card details.</b> Full card number, expiry, CVV and bank codes aren't collected here. Secure card entry needs a payment provider.</p></section></div>`;
  if (state.modal === "add-payment-mpesa") return `<div class="overlay-backdrop" data-close="modal"><section class="simple-modal payment-modal" role="dialog" aria-modal="true" aria-labelledby="add-mpesa-title"><button class="modal-close" data-close="modal" aria-label="Close">×</button><span class="modal-illustration">M</span><p class="eyebrow">MOBILE MONEY PREVIEW</p><h2 id="add-mpesa-title">Add M-Pesa</h2><p>Save the number you would use for checkout.</p><form data-form="payment-mpesa"><label>Kenyan mobile number<input name="phone" type="tel" inputmode="tel" autocomplete="tel" placeholder="0712 345 678 or +254 712 345 678" value="${escapeAttr(state.profile.phone)}" required></label><button class="button-dark full-width">Save M-Pesa method <span>→</span></button></form><p class="payment-safety-note">No wallet request is sent. Never enter your M-Pesa PIN or a one-time code in this preview.</p></section></div>`;
  if (state.modal === "auth-terms") return `<div class="overlay-backdrop" data-close="modal"><section class="simple-modal" role="dialog" aria-modal="true"><button class="modal-close" data-close="modal" aria-label="Close">×</button><span class="modal-illustration">ⓘ</span><p class="eyebrow">ACCOUNT SECURITY</p><h2>Sign-in & privacy</h2><p>Supabase Auth verifies your sign-in and keeps your session. Never share a one-time code or password with anyone.</p><p>Your profile is protected in the Fast Dine database. Basket, order history, addresses and payment previews remain local to this browser until those features are connected.</p><button class="button-dark full-width" data-close="modal">Got it</button></section></div>`;
  if (state.modal === "login") return `<div class="overlay-backdrop" data-close="modal"><section class="simple-modal login-modal" role="dialog" aria-modal="true"><button class="modal-close" data-close="modal">×</button><span class="modal-illustration">✳</span><p class="eyebrow">WELCOME TO THE FAST DINE</p><h2>Good to see you.</h2><p>Sign in or create an account to keep your favourites close.</p><form data-form="login"><label>Phone number<div class="input-with-prefix"><span>🇰🇪 +254</span><input name="phone" placeholder="7XX XXX XXX" value="${escapeAttr(state.profile.phone)}" required></div></label><button class="button-dark full-width">Continue <span>→</span></button></form><small class="fine-print">By continuing, you agree to our Terms and Privacy Policy.</small></section></div>`;
  if (state.modal === "instructions") return `<div class="overlay-backdrop" data-close="modal"><section class="simple-modal" role="dialog" aria-modal="true"><button class="modal-close" data-close="modal">×</button><span class="modal-illustration">✎</span><p class="eyebrow">A HELPFUL LITTLE NOTE</p><h2>Delivery instructions</h2><p>Let your courier know anything that makes finding you easier.</p><form data-form="instructions"><label>Note for your courier<textarea name="note" placeholder="Gate code, landmark, or where to leave the order">${escapeHtml(state.profile.note)}</textarea></label><button class="button-dark full-width">Save instructions <span>→</span></button></form></section></div>`;
  if (state.modal === "search") return `<div class="overlay-backdrop" data-close="modal"><section class="simple-modal"><button class="modal-close" data-close="modal">×</button><p class="eyebrow">FIND YOUR NEXT FAVOURITE</p><h2>What sounds good?</h2><div class="modal-search"><span>⌕</span><input id="modal-search" placeholder="Dishes, shops, groceries..." value="${escapeAttr(state.search)}" autofocus></div><div class="search-suggestions">${["Burgers", "Groceries", "Coffee", "Flowers"].map(term => `<button data-search-term="${term}">${term} ↗</button>`).join("")}</div></section></div>`;
  if (state.modal === "sort") return `<div class="overlay-backdrop" data-close="modal"><section class="simple-modal"><button class="modal-close" data-close="modal">×</button><p class="eyebrow">MAKE IT YOURS</p><h2>Sort & filter</h2><div class="filter-modal-content"><b>Sort by</b>${["Recommended", "Top rated", "Fastest delivery"].map((term, i) => `<label><input type="radio" name="sort" value="${term}" ${i === 0 ? "checked" : ""}>${term}</label>`).join("")}<b>Delivery fee</b><label><input type="checkbox">Free delivery</label><button class="button-dark full-width" data-action="apply-filter">Show places <span>→</span></button></div></section></div>`;
  if (state.modal === "placed") return `<div class="overlay-backdrop"><section class="simple-modal success-modal"><span class="success-check">✓</span><p class="eyebrow">PREVIEW ORDER</p><h2>Your demo order is saved.</h2><p>No payment was processed and no courier was contacted. You can review this sample order in your account.</p><div class="success-order"><span>Payment method</span><b>${escapeHtml(state.orders[0]?.paymentMethod || "Selected at checkout")}</b></div><button class="button-dark full-width" data-action="view-orders">View my orders <span>→</span></button><button class="keep-shopping" data-route="${BASE}">Back to The Fast Dine</button></section></div>`;
  if (state.modal === "support") return `<div class="support-backdrop" data-close="modal"><aside class="support-panel" role="dialog" aria-modal="true"><div class="support-head"><div><span class="support-head-icon">✳</span><h2>Support Centre</h2></div><button data-close="modal" aria-label="Close support">⌄</button></div><div class="support-body"><h3>${state.supportTopic ? supportTopicTitle() : "What can we help with?"}</h3>${state.supportTopic === "orders" ? `<div class="support-info-card">${state.orders.length ? `<p>Your recent orders are listed in your account.</p><button data-route="/en/profile/past-orders">View past orders <span>↗</span></button>` : `<span class="support-illustration">🛍️</span><b>Your recent orders will show up here.</b>`}</div><button class="support-choice" data-route="/en/profile/past-orders"><span class="support-emoji">📍</span><b>My orders</b><span class="support-arrow">›</span></button>` : state.supportTopic === "requests" ? `<div class="support-info-card"><span class="support-illustration">✉️</span><b>No open requests yet.</b><p>If you need us, choose a topic and send us a note.</p></div><button class="support-choice" data-support-topic="other"><span class="support-emoji">💬</span><b>Start a support request</b><span class="support-arrow">›</span></button>` : state.supportTopic === "other" ? `<button class="support-back-link" data-support-topic="">← All support topics</button><p class="support-section-label">Choose a topic</p>${["Something went wrong with an order", "Payment or refund", "Account and personal details", "Delivery question"].map((topic, i) => `<button class="support-choice support-topic-choice" data-support-topic="${escapeAttr(topic)}"><span class="support-emoji">${["📦", "💳", "👤", "🚲"][i]}</span><b>${topic}</b><span class="support-arrow">›</span></button>`).join("")}` : state.supportTopic ? `<button class="support-back-link" data-support-topic="other">← Choose another topic</button><div class="support-info-card"><span class="support-illustration">💬</span><b>We're here to help.</b><p>Tell us a little more and our Nairobi support team will get back to you.</p><button data-action="contact-support">Contact support <span>→</span></button></div>` : `<div class="support-info-card"><span class="support-illustration">🛍️</span><b>${state.orders.length ? `Your last order: ${escapeHtml(state.orders[0].store)}` : "You'll see your most recent orders here."}</b>${state.orders.length ? `<p>${new Date(state.orders[0].createdAt).toLocaleDateString("en-KE", { month: "short", day: "numeric" })} · ${money(state.orders[0].total)}</p>` : ""}</div><button class="support-choice" data-support-topic="orders"><span class="support-emoji">📍</span><b>My orders</b><span class="support-arrow">›</span></button><button class="support-choice" data-support-topic="other"><span class="support-emoji">💬</span><b>Something else</b><span class="support-arrow">›</span></button><p class="support-section-label">Follow up</p><button class="support-choice" data-support-topic="requests"><span class="support-emoji">✉️</span><b>My requests</b><span class="support-arrow">›</span></button>`}</div></aside></div>`;
  return "";
}

function supportTopicTitle() {
  if (state.supportTopic === "orders") return "A hand with your orders?";
  if (state.supportTopic === "requests") return "My requests";
  if (state.supportTopic === "other") return "Something else";
  return state.supportTopic;
}

function render() {
  const path = currentPath();
  const app = document.querySelector("#app");
  const category = categories.find(item => item.path === path);
  const routedStore = stores.find(store => store.slug && path === `${BASE}/stores/${store.slug}`);
  if (supabaseConfigured && path.startsWith("/en/profile")) {
    if (!state.authBootstrapped) {
      app.innerHTML = `<main class="auth-page"><section class="auth-card"><img class="auth-logo" src="/assets/the-fast-dine-logo.png" alt="The Fast Dine"><p class="eyebrow">THE FAST DINE ACCOUNT</p><h1>Checking your session…</h1><p class="auth-intro">One moment while we securely load your account.</p></section></main>`;
      return;
    }
    if (!state.signedIn) {
      const destination = `${path}${window.location.search}`;
      history.replaceState({}, "", `/en/login?returnPath=${encodeURIComponent(destination)}`);
      return render();
    }
  }
  if (path === "/en/auth/callback") app.innerHTML = `<main class="auth-page"><section class="auth-card"><img class="auth-logo" src="/assets/the-fast-dine-logo.png" alt="The Fast Dine"><p class="eyebrow">SECURE SIGN-IN</p><h1>Finishing sign-in…</h1><p class="auth-intro">We're checking your Supabase verification link.</p></section></main>`;
  else if (path === "/en") app.innerHTML = `${header()}${englishLandingPage()}<button class="help-fab" data-action="help"><span>☏</span> Help</button>${mobileDock()}`;
  else if (path.startsWith("/en/login")) app.innerHTML = `${header()}${loginPage()}<button class="help-fab" data-action="help"><span>☏</span> Help</button>${mobileDock()}`;
  else if (path.endsWith("/order-summary")) app.innerHTML = `${header()}${checkoutPage()}<button class="help-fab" data-action="help"><span>☏</span> Help</button>${mobileDock()}`;
  else if (path.startsWith("/en/profile")) app.innerHTML = `${header()}${profilePage(path)}<button class="help-fab" data-action="help"><span>☏</span> Help</button>${mobileDock()}`;
  else if (routedStore) app.innerHTML = `${header()}${storeDetailPage(routedStore)}<button class="help-fab" data-action="help"><span>☏</span> Help</button>${mobileDock()}`;
  else if (category && category.id !== "deals") app.innerHTML = `${header()}${categoryPage(category)}<button class="help-fab" data-action="help"><span>☏</span> Help</button>${mobileDock()}`;
  else if (path.includes("/stores/glovo-bargains-nbo")) app.innerHTML = `${header()}${storeDetailPage(stores.find(item => item.id === "tamu-deals"))}<button class="help-fab" data-action="help"><span>☏</span> Help</button>${mobileDock()}`;
  else if (category?.id === "deals") app.innerHTML = `${header()}${categoryPage(category)}<button class="help-fab" data-action="help"><span>☏</span> Help</button>${mobileDock()}`;
  else app.innerHTML = `${header()}${homePage()}<button class="help-fab" data-action="help"><span>☏</span> Help</button>${mobileDock()}`;
  renderOverlay();
  document.title = routedStore ? `${routedStore.name} menu — The Fast Dine` : category ? `${category.title} delivery in Nairobi — The Fast Dine` : path === "/en" ? "Food delivery and more — The Fast Dine" : path.startsWith("/en/login") || path === "/en/auth/callback" ? "Account access — The Fast Dine" : path.startsWith("/en/profile") ? "Your account — The Fast Dine" : path.endsWith("/order-summary") ? "Your order — The Fast Dine" : "The Fast Dine — Good things, on the way";
}

function addProduct(productId, storeId) {
  const product = productInfo(productId);
  if (!product) return;
  if (state.cart.length && state.cart[0].store !== storeId) {
    toast("Your basket is from another store. Finish that order first.");
    return;
  }
  const item = state.cart.find(entry => entry.id === productId);
  if (item) item.qty += 1;
  else state.cart.push({ id: product.id, name: product.name, price: product.price, qty: 1, store: storeId });
  save();
  render();
  toast(`${product.name} added to your basket`);
}

function updateQty(id, delta) {
  const item = state.cart.find(entry => entry.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) state.cart = state.cart.filter(entry => entry.id !== id);
  save(); render();
}

function submitOrder() {
  if (!state.cart.length) { toast("Add a little something to your basket first."); return; }
  if (!state.profile.address) { state.modal = "address"; renderOverlay(); return; }
  const payment = selectedPayment();
  if (!payment) { navigate("/en/profile/account/payment-methods"); toast("Add a payment method before checkout."); return; }
  const store = stores.find(item => item.id === state.cart[0].store);
  const fee = store?.fee ?? 79;
  const order = { id: `FD-${Date.now().toString().slice(-6)}`, createdAt: new Date().toISOString(), store: store?.name || "The Fast Dine", items: state.cart.map(item => ({ ...item })), total: subtotal() + fee + 25 - promoDiscount(), status: "Demo order", address: state.profile.address, paymentMethod: paymentName(payment), promoCode: state.promoCode || "" };
  state.orders.unshift(order); state.cart = []; save(); state.modal = "placed"; render();
}

function addPaymentMethod(method) {
  const duplicate = state.payments.some(existing => existing.type === method.type && (method.type === "cash" || method.type === "mpesa" && existing.phone.replace(/\D/g, "") === method.phone.replace(/\D/g, "") || method.type === "card" && existing.brand === method.brand && existing.last4 === method.last4));
  if (duplicate) { state.modal = null; render(); toast("That payment method is already saved."); return; }
  const next = { ...method, isDefault: !state.payments.length };
  state.payments.push(next);
  if (next.isDefault) state.checkoutPaymentId = next.id;
  state.modal = null;
  save(); render();
  toast(`${paymentName(next)} added to this preview.`);
}

function setDefaultPayment(id) {
  if (!state.payments.some(method => method.id === id)) return;
  state.payments = state.payments.map(method => ({ ...method, isDefault: method.id === id }));
  save(); render(); toast("Preferred payment method updated.");
}

function removePaymentMethod(id) {
  const removed = state.payments.find(method => method.id === id);
  if (!removed) return;
  state.payments = state.payments.filter(method => method.id !== id);
  if (removed.isDefault && state.payments.length) state.payments[0].isDefault = true;
  if (state.checkoutPaymentId === id) state.checkoutPaymentId = state.payments.find(method => method.isDefault)?.id || state.payments[0]?.id || "";
  save(); render(); toast("Payment method removed from this preview.");
}

document.addEventListener("click", event => {
  const route = event.target.closest("[data-route]");
  if (route) { event.preventDefault(); navigate(route.dataset.route); return; }
  const category = event.target.closest("[data-category]");
  if (category) { const target = categories.find(item => item.id === category.dataset.category); if (target) navigate(target.path); return; }
  const addPayment = event.target.closest("[data-payment-add]");
  if (addPayment) {
    const type = addPayment.dataset.paymentAdd;
    if (type === "mpesa") { state.modal = "add-payment-mpesa"; renderOverlay(); }
    else if (type === "card") { state.modal = "add-payment-card"; renderOverlay(); }
    else if (type === "cash") addPaymentMethod({ id: "cash-delivery", type: "cash", label: "Cash on delivery" });
    return;
  }
  const setDefault = event.target.closest("[data-default-payment]");
  if (setDefault) { setDefaultPayment(setDefault.dataset.defaultPayment); return; }
  const removePayment = event.target.closest("[data-remove-payment]");
  if (removePayment) { removePaymentMethod(removePayment.dataset.removePayment); return; }
  const store = event.target.closest(".store-card");
  if (store && !event.target.closest("[data-favorite]")) {
    const selectedStore = stores.find(item => item.id === store.dataset.store);
    if (selectedStore?.slug) navigate(`${BASE}/stores/${selectedStore.slug}`);
    else if (store.dataset.store === "tamu-deals") navigate(`${BASE}/stores/glovo-bargains-nbo`);
    else { state.storeOpen = store.dataset.store; renderOverlay(); }
    return;
  }
  const add = event.target.closest("[data-add]");
  if (add) { addProduct(add.dataset.add, add.dataset.store); return; }
  const qty = event.target.closest("[data-qty]");
  if (qty) { updateQty(qty.dataset.qty, Number(qty.dataset.delta)); return; }
  const close = event.target.closest("[data-close]");
  if (close && (close === event.target || close.tagName === "BUTTON")) { if (close.dataset.close === "cart") state.cartOpen = false; else if (close.dataset.close === "store") state.storeOpen = null; else state.modal = null; renderOverlay(); return; }
  const supportTopic = event.target.closest("[data-support-topic]");
  if (supportTopic) { state.supportTopic = supportTopic.dataset.supportTopic || null; renderOverlay(); return; }
  const authMode = event.target.closest("[data-auth-mode]");
  if (authMode) { state.authMode = authMode.dataset.authMode; state.authError = ""; state.authResendAvailable = false; saveAuthFlow(); navigate(authPageUrl(state.authMode === "signup" ? "signup" : "login")); return; }
  const authStep = event.target.closest("[data-auth-step]");
  if (authStep) { const nextPage = authStep.dataset.authStep; if (nextPage === "login" || nextPage === "signup") state.authMode = nextPage; state.authError = ""; saveAuthFlow(); navigate(authPageUrl(nextPage)); return; }
  const action = event.target.closest("[data-action]")?.dataset.action;
  if (action === "cart") { state.cartOpen = !state.cartOpen; state.storeOpen = null; state.modal = null; renderOverlay(); }
  else if (action === "address") { state.modal = "address"; renderOverlay(); }
  else if (action === "login") { navigate("/en/login?returnPath=%2Fen%2Fke%2Fnairobi"); }
  else if (action === "search") { state.modal = "search"; renderOverlay(); setTimeout(() => document.querySelector("#modal-search")?.focus(), 20); }
  else if (action === "help") { state.supportTopic = null; state.modal = "support"; renderOverlay(); }
  else if (action === "auth-resend") { void resendSignupConfirmation(); }
  else if (action === "recovery-resend") { state.recoveryEmailSent = false; state.authError = ""; render(); }
  else if (action === "auth-terms") { state.modal = "auth-terms"; renderOverlay(); }
  else if (action === "contact-support") { state.modal = null; renderOverlay(); toast("Email us at hello@fastdine.example and we'll be in touch."); }
  else if (action === "set-address") { const value = document.querySelector("#hero-address")?.value.trim(); if (value) { state.profile.address = value; save(); render(); toast("Delivery spot saved"); } else { state.modal = "address"; renderOverlay(); } }
  else if (action === "location") { state.profile.address = "Kilimani, Nairobi"; save(); state.modal = null; render(); toast("Showing places around Kilimani"); }
  else if (action === "instructions") { state.modal = "instructions"; renderOverlay(); }
  else if (action === "promo") navigate("/en/profile/account/promo-codes");
  else if (action === "add-payment-method") { state.modal = "payment-method-picker"; renderOverlay(); }
  else if (action === "remove-promo") { state.promoCode = ""; save(); render(); toast("Promo removed from this preview order."); }
  else if (action === "sort") { state.modal = "sort"; renderOverlay(); }
  else if (action === "place-order") submitOrder();
  else if (action === "view-orders") navigate("/en/profile/past-orders");
  else if (action === "logout") { void signOutCustomer(); }
  else if (action === "gift-card") toast("Gift cards are coming soon.");
  else if (action === "clear-search") { state.search = ""; state.categoryFilter = "all"; render(); }
  else if (action === "apply-filter") { const value = document.querySelector("input[name=sort]:checked")?.value; state.modal = null; render(); if (value === "Top rated") document.querySelectorAll(".store-grid").forEach(grid => [...grid.children].sort((a,b) => Number(b.querySelector(".rating")?.textContent?.match(/[\d.]+/)?.[0] || 0) - Number(a.querySelector(".rating")?.textContent?.match(/[\d.]+/)?.[0] || 0)).forEach(node => grid.append(node))); }
  else if (action === "see-all") { state.categoryFilter = "all"; const section = document.querySelector(".store-grid"); section?.scrollIntoView({ behavior: "smooth", block: "center" }); }
  const filter = event.target.closest("[data-filter-chip]");
  if (filter) {
    document.querySelectorAll(".filter-chip").forEach(chip => chip.classList.remove("selected"));
    filter.classList.add("selected");
    const needle = filter.dataset.filterChip.toLowerCase();
    const currentStore = stores.find(store => store.slug && currentPath() === `${BASE}/stores/${store.slug}`);
    if (currentStore || currentPath().includes("/stores/glovo-bargains-nbo")) {
      const isDealsPage = currentPath().includes("/stores/glovo-bargains-nbo");
      const activeStore = currentStore || stores.find(store => store.id === "tamu-deals");
      const allProducts = productsByStore[activeStore.id] || [];
      const filtered = needle === "popular" || needle === "all restaurants" || needle.startsWith("today")
        ? allProducts
        : allProducts.filter(product => `${product.name} ${product.description} ${product.tag || ""}`.toLowerCase().includes(needle.split(" ")[0]));
      const grid = document.querySelector("#deal-products");
      if (grid) grid.innerHTML = filtered.length ? dealProductCards(filtered, activeStore.id) : `<div class="filter-empty">No exact matches in this collection yet.</div>`;
      const heading = document.querySelector(".store-detail-layout .listing-header h2");
      if (heading) heading.innerHTML = `${escapeHtml(isDealsPage ? "Today's offers" : filter.dataset.filterChip === "Popular" ? "Menu" : filter.dataset.filterChip)} <span class="result-count">${filtered.length}</span>`;
    } else {
      const category = categories.find(item => item.path === currentPath());
      const currentStores = stores.filter(item => item.category === category?.id);
      const terms = needle.split(/\s+/).filter(term => term !== "&");
      const filtered = needle === "popular" || needle === "all restaurants" ? currentStores : currentStores.filter(item => terms.some(term => `${item.name} ${item.cuisine}`.toLowerCase().includes(term)));
      const grid = document.querySelector("#listing-stores");
      if (grid) grid.innerHTML = filtered.length ? filtered.map(storeCard).join("") : `<div class="filter-empty">No exact matches yet. Try another collection.</div>`;
      const count = document.querySelector(".listing-header .result-count");
      if (count) count.textContent = String(filtered.length);
    }
  }
  const language = event.target.closest("[data-language]");
  if (language) { localStorage.setItem("tamu-language", language.dataset.language); render(); toast(`${language.dataset.language} selected`); }
  const searchTerm = event.target.closest("[data-search-term]");
  if (searchTerm) { state.search = searchTerm.dataset.searchTerm; state.modal = null; navigate(BASE); }
  const reorder = event.target.closest("[data-reorder]");
  if (reorder) { const order = state.orders.find(item => item.id === reorder.dataset.reorder); if (order) { state.cart = order.items.map(item => ({ ...item })); save(); state.cartOpen = true; render(); } }
  const favorite = event.target.closest("[data-favorite]");
  if (favorite) { favorite.classList.toggle("is-favorite"); favorite.textContent = favorite.classList.contains("is-favorite") ? "♥" : "♡"; toast(favorite.classList.contains("is-favorite") ? "Saved to your favourites" : "Removed from favourites"); }
});

document.addEventListener("input", event => {
  if (event.target.matches("#store-search")) {
    const query = event.target.value.toLowerCase().trim();
    const currentStore = stores.find(store => store.slug && currentPath() === `${BASE}/stores/${store.slug}`);
    const storeId = currentStore?.id || "tamu-deals";
    const filtered = (productsByStore[storeId] || []).filter(product => `${product.name} ${product.description} ${product.tag || ""}`.toLowerCase().includes(query));
    const grid = document.querySelector("#deal-products");
    if (grid) grid.innerHTML = filtered.length ? dealProductCards(filtered, storeId) : `<div class="filter-empty">No finds match that search yet.</div>`;
    const heading = document.querySelector(".store-detail-layout .listing-header h2 .result-count");
    if (heading) heading.textContent = filtered.length;
    return;
  }
  if (event.target.matches("#global-search, #modal-search")) {
    state.search = event.target.value;
    if (event.target.id === "modal-search") { document.querySelectorAll("[data-search-term]").forEach(el => el.hidden = !el.textContent.toLowerCase().includes(state.search.toLowerCase())); return; }
    const path = currentPath();
    if (path === BASE || path === "/") render();
    else if (categories.some(item => item.path === path)) render();
    setTimeout(() => { const input = document.querySelector("#global-search"); if (input) { input.focus(); input.setSelectionRange(state.search.length, state.search.length); } }, 0);
  }
});

document.addEventListener("change", event => {
  if (event.target.matches('input[name="checkout-payment"]')) {
    state.checkoutPaymentId = event.target.value;
    save();
    document.querySelectorAll(".checkout-payment").forEach(option => option.classList.toggle("selected", option.contains(event.target)));
  }
  if (event.target.matches("[data-privacy]")) { state.privacy[event.target.dataset.privacy] = event.target.checked; save(); toast("Privacy preference saved"); }
  if (event.target.id === "sort-select") {
    const grid = document.querySelector("#listing-stores");
    if (!grid) return;
    const items = [...grid.children];
    if (event.target.value === "Top rated") items.sort((a, b) => Number(b.querySelector(".rating")?.textContent.match(/[\d.]+/)?.[0] || 0) - Number(a.querySelector(".rating")?.textContent.match(/[\d.]+/)?.[0] || 0));
    if (event.target.value === "Fastest delivery") items.sort((a, b) => Number(a.textContent.match(/\d+/)?.[0] || 0) - Number(b.textContent.match(/\d+/)?.[0] || 0));
    items.forEach(item => grid.append(item));
  }
});

document.addEventListener("submit", async event => {
  const form = event.target;
  const kind = form.dataset.form;
  if (!kind) return;
  event.preventDefault();
  const data = new FormData(form);
  if (kind === "profile") {
    state.profile.name = data.get("name").trim(); state.profile.email = data.get("email").trim(); state.profile.phone = data.get("phone").trim();
    save(); render(); toast("Your details are saved");
  } else if (kind === "phone") { state.profile.phone = data.get("phone").trim(); save(); render(); toast("Phone number updated"); }
  else if (kind === "password") {
    if (data.get("password") !== data.get("confirm")) { toast("Those new passwords don't match yet."); return; }
    if (!supabase) { toast("Supabase is not configured. Check the VITE_SUPABASE settings."); return; }
    const { error } = await supabase.auth.updateUser({ password: data.get("password") });
    if (error) { toast(readableAuthError(error)); return; }
    form.reset();
    toast("Your password has been updated.");
  }
  else if (kind === "recovery") {
    state.authIdentity = data.get("email").trim().toLowerCase();
    state.authError = "";
    if (!supabase) {
      state.authError = "Supabase is not configured. Check the VITE_SUPABASE settings and restart the dev server.";
      render();
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.authIdentity)) {
      state.authError = "Enter a valid email address.";
      render();
      return;
    }
    try {
      const redirectTo = new URL(authPageUrl("recovery"), window.location.origin);
      redirectTo.searchParams.set("mode", "reset");
      const { error } = await supabase.auth.resetPasswordForEmail(state.authIdentity, { redirectTo: redirectTo.toString() });
      if (error) throw error;
      state.recoveryEmailSent = true;
      render();
    } catch (error) {
      state.authError = readableAuthError(error);
      render();
    }
  }
  else if (kind === "password-reset") {
    const password = data.get("password");
    if (password !== data.get("confirm")) {
      state.authError = "Those new passwords don't match yet.";
      render();
      return;
    }
    if (!supabase) {
      state.authError = "Supabase is not configured. Check the VITE_SUPABASE settings and restart the dev server.";
      render();
      return;
    }
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      state.passwordRecoveryReady = false;
      state.recoveryEmailSent = false;
      state.authError = "";
      navigate(loginReturnPath());
      toast("Your password has been reset. You're signed in.");
    } catch (error) {
      state.authError = readableAuthError(error);
      render();
    }
  }
  else if (kind === "address") { state.profile.address = data.get("address").trim(); state.profile.apartment = data.get("apartment").trim(); state.modal = null; save(); render(); toast("Delivery address saved"); }
  else if (kind === "instructions") { state.profile.note = data.get("note").trim(); state.modal = null; save(); render(); toast("Delivery note saved"); }
  else if (kind === "login") {
    state.authIdentity = data.get("identity").trim().toLowerCase();
    state.authMethod = "email";
    state.authMode = "login";
    state.authError = "";
    state.authResendAvailable = false;
    try {
      if (!supabase) throw new Error("Supabase is not configured. Check the VITE_SUPABASE settings and restart the dev server.");
      const identity = state.authIdentity.trim().toLowerCase();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identity)) throw new Error("Enter a valid email address.");
      const credentials = { email: identity, password: data.get("password") };
      const { data: authData, error } = await supabase.auth.signInWithPassword(credentials);
      if (error) throw error;
      if (!authData.user) throw new Error("Supabase did not return a signed-in customer.");
      const returnPath = loginReturnPath();
      await writeCustomerProfile(authData.user);
      clearAuthFlow();
      navigate(returnPath);
      toast("You're signed in to The Fast Dine.");
    } catch (error) {
      state.authError = readableAuthError(error);
      state.authResendAvailable = error?.code === "email_not_confirmed" || /email not confirmed|email_not_confirmed/i.test(String(error?.message || ""));
      clearAuthFlow();
      render();
    }
  }
  else if (kind === "signup") {
    state.authDraft = { name: data.get("name").trim(), email: data.get("email").trim().toLowerCase() };
    state.authMethod = "email";
    state.authIdentity = state.authDraft.email;
    state.authMode = "signup";
    state.authError = "";
    state.authResendAvailable = false;
    try {
      if (!supabase) throw new Error("Supabase is not configured. Check the VITE_SUPABASE settings and restart the dev server.");
      if (data.get("password") !== data.get("confirm")) throw new Error("Those passwords don't match.");
      const password = data.get("password");
      if (typeof password !== "string" || password.length < 8) throw new Error("Use a password with at least 8 characters.");
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.authIdentity)) throw new Error("Enter a valid email address.");
      const { data: authData, error } = await supabase.auth.signUp({
        email: state.authIdentity,
        password,
        options: {
          data: { full_name: state.authDraft.name }
        }
      });
      if (error) throw error;
      if (authData.user?.identities?.length === 0) {
        state.authMode = "login";
        state.authError = "If you already have an account with this email, log in instead. If it still needs verification, you can request a new code there.";
        navigate(authPageUrl("login"));
        return;
      }
      if (authData.session && authData.user) {
        const returnPath = loginReturnPath();
        await writeCustomerProfile(authData.user);
        clearAuthFlow();
        navigate(returnPath);
        toast("Your account is ready.");
      } else {
        saveAuthFlow();
        navigate(authPageUrl("verify"));
        toast("Check your email for a six-digit verification code.");
      }
    } catch (error) {
      state.authError = readableAuthError(error);
      state.authResendAvailable = false;
      clearAuthFlow();
      render();
    }
  }
  else if (kind === "verify") {
    if (state.authMode !== "signup") {
      state.authError = "Email verification codes are only for confirming new accounts. Log in with your email and password.";
      render();
      return;
    }
    if (!supabase) { state.authError = "Supabase is not configured. Check the VITE_SUPABASE settings and restart the dev server."; render(); return; }
    const token = data.get("code").trim();
    if (!/^\d{6}$/.test(token)) { state.authError = "Enter the six-digit code from your email."; render(); return; }
    const identity = state.authIdentity;
    const returnPath = loginReturnPath();
    state.authError = "";
    try {
      const credentials = { email: identity, token, type: "signup" };
      const { data: authData, error } = await supabase.auth.verifyOtp(credentials);
      if (error) throw error;
      if (!authData.user) throw new Error("Supabase did not return a signed-in customer.");
      await writeCustomerProfile(authData.user);
      clearAuthFlow();
      state.authError = "";
      navigate(returnPath);
      toast("You're signed in to The Fast Dine.");
    } catch (error) {
      state.authError = readableAuthError(error);
      state.authResendAvailable = false;
      render();
    }
  }
  else if (kind === "english-address") {
    state.profile.address = data.get("address").trim();
    save();
    navigate(BASE);
  }
  else if (kind === "payment-card") {
    addPaymentMethod({ id: `card-${Date.now()}`, type: "card", brand: data.get("brand"), last4: data.get("last4").trim() });
  }
  else if (kind === "payment-mpesa") {
    const rawPhone = data.get("phone").trim();
    const digits = rawPhone.replace(/\D/g, "");
    const localDigits = digits.startsWith("254") ? digits.slice(3) : digits.startsWith("0") ? digits.slice(1) : digits;
    if (!/^[17]\d{8}$/.test(localDigits)) { toast("Enter a valid Kenyan mobile number."); return; }
    const phone = `+254${localDigits}`;
    addPaymentMethod({ id: `mpesa-${Date.now()}`, type: "mpesa", label: "M-Pesa", phone });
  }
  else if (kind === "promo-code") {
    const code = data.get("code").trim().toUpperCase();
    if (code !== "FAST10") { toast("That code isn't available in this preview."); return; }
    state.promoCode = code; save(); render(); toast("FAST10 applied to your preview checkout.");
  }
  else if (kind === "invoice") { localStorage.setItem("tamu-invoice", JSON.stringify({ name: data.get("invoiceName"), pin: data.get("pin"), address: data.get("invoiceAddress") })); render(); toast("Invoice information saved"); }
});

window.addEventListener("popstate", () => { state.modal = null; state.storeOpen = null; state.cartOpen = false; render(); });
document.addEventListener("keydown", event => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") { event.preventDefault(); state.modal = "search"; renderOverlay(); setTimeout(() => document.querySelector("#modal-search")?.focus(), 20); }
  if ((event.key === "Enter" || event.key === " ") && event.target.closest(".store-card")) {
    event.preventDefault();
    const storeId = event.target.closest(".store-card").dataset.store;
    const store = stores.find(item => item.id === storeId);
    if (store?.slug) navigate(`${BASE}/stores/${store.slug}`);
    else { state.storeOpen = storeId; renderOverlay(); }
  }
  if (event.key === "Escape") { state.modal = null; state.storeOpen = null; state.cartOpen = false; renderOverlay(); }
});

if (currentPath() === "/") history.replaceState({}, "", BASE);
initializeSupabaseAuth();
render();
