// Product images mapping by category
import breadImg from "@/assets/product-bread.jpg";
import cakeImg from "@/assets/product-cake.jpg";
import croissantImg from "@/assets/product-croissant.jpg";
import pastryImg from "@/assets/product-pastry.jpg";

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  description: string;
   quantity?: number;
}

const getImageByCategory = (category: string) => {
  switch (category) {
    case "Pastries": return croissantImg;
    case "Loaves": return breadImg;
    case "Donuts": return pastryImg;
    case "Cakes": return cakeImg;
    case "Savoury Pies": return pastryImg;
    case "Sweet Pies": return pastryImg;
    case "Cookies": return pastryImg;
    case "Drinks": return pastryImg;
    default: return breadImg;
  }
};

export const categories = [
  "All",
  "Pastries",
  "Loaves",
  "Donuts",
  "Cakes",
  "Savoury Pies",
  "Sweet Pies",
  "Cookies",
  "Drinks"
];

export const allProducts: Product[] = [
  // Pastries (1-20)
  { id: 1, name: "Chocolate Croissant", category: "Pastries", price: 3.20, image: croissantImg, description: "Flaky croissant filled with rich chocolate" },
  { id: 2, name: "Butter Croissant", category: "Pastries", price: 2.80, image: croissantImg, description: "Classic French butter croissant" },
  { id: 3, name: "Almond Croissant", category: "Pastries", price: 3.50, image: croissantImg, description: "Filled with almond cream and topped with slices" },
  { id: 4, name: "Pain au Chocolat", category: "Pastries", price: 3.20, image: croissantImg, description: "Chocolate-filled French pastry" },
  { id: 5, name: "Cinnamon Roll", category: "Pastries", price: 3.00, image: croissantImg, description: "Soft roll with cinnamon and cream cheese glaze" },
  { id: 6, name: "Cinnamon Twist", category: "Pastries", price: 2.50, image: croissantImg, description: "Twisted pastry with cinnamon sugar" },
  { id: 7, name: "Raisin Danish", category: "Pastries", price: 3.00, image: croissantImg, description: "Danish pastry with raisins and custard" },
  { id: 8, name: "Apple Danish", category: "Pastries", price: 3.20, image: croissantImg, description: "Flaky danish with apple filling" },
  { id: 9, name: "Blueberry Danish", category: "Pastries", price: 3.20, image: croissantImg, description: "Danish topped with fresh blueberries" },
  { id: 10, name: "Custard Danish", category: "Pastries", price: 3.00, image: croissantImg, description: "Classic danish with vanilla custard" },
  { id: 11, name: "Cheese Danish", category: "Pastries", price: 3.20, image: croissantImg, description: "Sweet cream cheese filled danish" },
  { id: 12, name: "Maple Pecan Twist", category: "Pastries", price: 3.50, image: croissantImg, description: "Twisted pastry with maple glaze and pecans" },
  { id: 13, name: "Nutella Croissant", category: "Pastries", price: 3.50, image: croissantImg, description: "Croissant filled with Nutella spread" },
  { id: 14, name: "Brioche Bun", category: "Pastries", price: 2.50, image: croissantImg, description: "Soft and buttery French brioche" },
  { id: 15, name: "Cream-filled Brioche", category: "Pastries", price: 3.00, image: croissantImg, description: "Brioche filled with vanilla cream" },
  { id: 16, name: "Chocolate Brioche", category: "Pastries", price: 3.20, image: croissantImg, description: "Rich chocolate brioche bun" },
  { id: 17, name: "Caramel Brioche", category: "Pastries", price: 3.20, image: croissantImg, description: "Brioche drizzled with caramel" },
  { id: 18, name: "Puff Pastry Twist", category: "Pastries", price: 2.50, image: croissantImg, description: "Light and flaky puff pastry" },
  { id: 19, name: "Mini Croissants", category: "Pastries", price: 4.50, image: croissantImg, description: "Pack of 6 mini butter croissants" },
  { id: 20, name: "Cinnamon Swirl", category: "Pastries", price: 2.80, image: croissantImg, description: "Soft swirl pastry with cinnamon" },

  // Loaves of Bread (21-40)
  { id: 21, name: "White Bread Loaf", category: "Loaves", price: 3.50, image: breadImg, description: "Classic soft white bread" },
  { id: 22, name: "Brown Bread Loaf", category: "Loaves", price: 3.80, image: breadImg, description: "Wholesome brown bread" },
  { id: 23, name: "Whole Wheat Loaf", category: "Loaves", price: 4.00, image: breadImg, description: "100% whole wheat bread" },
  { id: 24, name: "Multigrain Loaf", category: "Loaves", price: 4.50, image: breadImg, description: "Packed with various grains and seeds" },
  { id: 25, name: "Rye Bread Loaf", category: "Loaves", price: 4.20, image: breadImg, description: "Traditional dark rye bread" },
  { id: 26, name: "Sourdough Loaf", category: "Loaves", price: 5.00, image: breadImg, description: "Artisan sourdough with perfect crust" },
  { id: 27, name: "Brioche Loaf", category: "Loaves", price: 5.50, image: breadImg, description: "Rich and buttery brioche bread" },
  { id: 28, name: "Milk Bread Loaf", category: "Loaves", price: 4.00, image: breadImg, description: "Soft Japanese-style milk bread" },
  { id: 29, name: "Potato Bread Loaf", category: "Loaves", price: 4.20, image: breadImg, description: "Soft bread made with potato flour" },
  { id: 30, name: "Seeded Brown Loaf", category: "Loaves", price: 4.50, image: breadImg, description: "Brown bread with mixed seeds" },
  { id: 31, name: "Seeded White Loaf", category: "Loaves", price: 4.20, image: breadImg, description: "White bread topped with seeds" },
  { id: 32, name: "Baguette", category: "Loaves", price: 3.00, image: breadImg, description: "Crispy French baguette" },
  { id: 33, name: "Ciabatta Loaf", category: "Loaves", price: 4.00, image: breadImg, description: "Italian bread with open crumb" },
  { id: 34, name: "Focaccia Bread", category: "Loaves", price: 5.00, image: breadImg, description: "Italian flatbread with herbs and olive oil" },
  { id: 35, name: "Honey Oat Loaf", category: "Loaves", price: 4.50, image: breadImg, description: "Sweet bread with honey and oats" },
  { id: 36, name: "High Fibre Loaf", category: "Loaves", price: 4.50, image: breadImg, description: "Fiber-rich healthy bread" },
  { id: 37, name: "Low GI Health Loaf", category: "Loaves", price: 5.00, image: breadImg, description: "Low glycemic index bread" },
  { id: 38, name: "Banana Bread Loaf", category: "Loaves", price: 5.50, image: breadImg, description: "Moist banana bread with walnuts" },
  { id: 39, name: "Pumpkin Bread Loaf", category: "Loaves", price: 5.50, image: breadImg, description: "Spiced pumpkin bread" },
  { id: 40, name: "Cornbread Loaf", category: "Loaves", price: 4.00, image: breadImg, description: "Traditional Portuguese broa" },

  // Donuts (41-55)
  { id: 41, name: "Glazed Donut", category: "Donuts", price: 2.00, image: pastryImg, description: "Classic sugar glazed donut" },
  { id: 42, name: "Chocolate Donut", category: "Donuts", price: 2.50, image: pastryImg, description: "Rich chocolate glazed donut" },
  { id: 43, name: "Strawberry Donut", category: "Donuts", price: 2.50, image: pastryImg, description: "Pink strawberry glazed donut" },
  { id: 44, name: "Oreo Donut", category: "Donuts", price: 3.00, image: pastryImg, description: "Cookies and cream topped donut" },
  { id: 45, name: "Custard-filled Donut", category: "Donuts", price: 3.00, image: pastryImg, description: "Filled with vanilla custard" },
  { id: 46, name: "Jelly-filled Donut", category: "Donuts", price: 2.80, image: pastryImg, description: "Filled with strawberry jelly" },
  { id: 47, name: "Caramel Donut", category: "Donuts", price: 2.80, image: pastryImg, description: "Drizzled with salted caramel" },
  { id: 48, name: "Cinnamon Sugar Donut", category: "Donuts", price: 2.20, image: pastryImg, description: "Coated in cinnamon sugar" },
  { id: 49, name: "Blueberry Donut", category: "Donuts", price: 2.80, image: pastryImg, description: "Blueberry glazed donut" },
  { id: 50, name: "Red Velvet Donut", category: "Donuts", price: 3.00, image: pastryImg, description: "Red velvet with cream cheese glaze" },
  { id: 51, name: "Boston Cream Donut", category: "Donuts", price: 3.20, image: pastryImg, description: "Custard filled with chocolate top" },
  { id: 52, name: "Nutella Donut", category: "Donuts", price: 3.00, image: pastryImg, description: "Filled with Nutella spread" },
  { id: 53, name: "Powdered Donut", category: "Donuts", price: 2.00, image: pastryImg, description: "Classic powdered sugar donut" },
  { id: 54, name: "Maple Glazed Donut", category: "Donuts", price: 2.50, image: pastryImg, description: "Sweet maple glazed donut" },
  { id: 55, name: "Vanilla Cream Donut", category: "Donuts", price: 2.80, image: pastryImg, description: "Filled with vanilla cream" },

  // Cakes & Slices (56-75)
  { id: 56, name: "Chocolate Cake", category: "Cakes", price: 28.00, image: cakeImg, description: "Rich layers of chocolate ganache" },
  { id: 57, name: "Vanilla Cake", category: "Cakes", price: 26.00, image: cakeImg, description: "Classic vanilla sponge cake" },
  { id: 58, name: "Red Velvet Cake", category: "Cakes", price: 30.00, image: cakeImg, description: "Red velvet with cream cheese frosting" },
  { id: 59, name: "Cheesecake", category: "Cakes", price: 32.00, image: cakeImg, description: "New York style cheesecake" },
  { id: 60, name: "Blueberry Cheesecake", category: "Cakes", price: 35.00, image: cakeImg, description: "Cheesecake with blueberry topping" },
  { id: 61, name: "Strawberry Cheesecake", category: "Cakes", price: 35.00, image: cakeImg, description: "Cheesecake with fresh strawberries" },
  { id: 62, name: "Carrot Cake", category: "Cakes", price: 28.00, image: cakeImg, description: "Spiced carrot cake with cream cheese" },
  { id: 63, name: "Lemon Cake", category: "Cakes", price: 26.00, image: cakeImg, description: "Tangy lemon drizzle cake" },
  { id: 64, name: "Black Forest Cake", category: "Cakes", price: 32.00, image: cakeImg, description: "Chocolate, cream and cherries" },
  { id: 65, name: "Tiramisu Cake", category: "Cakes", price: 34.00, image: cakeImg, description: "Italian coffee flavored cake" },
  { id: 66, name: "Coffee Cake", category: "Cakes", price: 26.00, image: cakeImg, description: "Moist coffee flavored sponge" },
  { id: 67, name: "Marble Cake", category: "Cakes", price: 24.00, image: cakeImg, description: "Vanilla and chocolate swirl" },
  { id: 68, name: "Coconut Cake", category: "Cakes", price: 28.00, image: cakeImg, description: "Topped with shredded coconut" },
  { id: 69, name: "Banana Caramel Cake", category: "Cakes", price: 28.00, image: cakeImg, description: "Banana cake with caramel drizzle" },
  { id: 70, name: "Brownies", category: "Cakes", price: 3.50, image: cakeImg, description: "Fudgy chocolate brownie square" },
  { id: 71, name: "Blondies", category: "Cakes", price: 3.50, image: cakeImg, description: "Vanilla brownie with white chocolate" },
  { id: 72, name: "Caramel Slice", category: "Cakes", price: 4.00, image: cakeImg, description: "Shortbread, caramel and chocolate" },
  { id: 73, name: "Chocolate Mousse Cake", category: "Cakes", price: 32.00, image: cakeImg, description: "Light chocolate mousse layers" },
  { id: 74, name: "Lemon Poppy Seed Cake", category: "Cakes", price: 26.00, image: cakeImg, description: "Lemon cake with poppy seeds" },
  { id: 75, name: "Peppermint Crisp Tart Slice", category: "Cakes", price: 4.50, image: cakeImg, description: "Classic South African dessert" },

  // Savoury Pies (76-90)
  { id: 76, name: "Beef Pie", category: "Savoury Pies", price: 5.50, image: pastryImg, description: "Hearty beef filling in flaky pastry" },
  { id: 77, name: "Chicken Pie", category: "Savoury Pies", price: 5.50, image: pastryImg, description: "Creamy chicken and vegetable pie" },
  { id: 78, name: "Pepper Steak Pie", category: "Savoury Pies", price: 6.00, image: pastryImg, description: "Tender steak with pepper sauce" },
  { id: 79, name: "Curry Mince Pie", category: "Savoury Pies", price: 5.50, image: pastryImg, description: "Spiced curry mince filling" },
  { id: 80, name: "Sausage Roll", category: "Savoury Pies", price: 3.50, image: pastryImg, description: "Classic pork sausage roll" },
  { id: 81, name: "Chicken & Mushroom Pie", category: "Savoury Pies", price: 6.00, image: pastryImg, description: "Chicken with creamy mushroom sauce" },
  { id: 82, name: "Spinach & Feta Pie", category: "Savoury Pies", price: 5.00, image: pastryImg, description: "Vegetarian spinach and feta" },
  { id: 83, name: "Vegetable Pie", category: "Savoury Pies", price: 5.00, image: pastryImg, description: "Mixed vegetable medley" },
  { id: 84, name: "Steak & Kidney Pie", category: "Savoury Pies", price: 6.50, image: pastryImg, description: "Traditional British pie" },
  { id: 85, name: "Lamb Pie", category: "Savoury Pies", price: 6.50, image: pastryImg, description: "Slow-cooked lamb filling" },
  { id: 86, name: "Cheese & Onion Pie", category: "Savoury Pies", price: 4.50, image: pastryImg, description: "Melted cheese with caramelized onion" },
  { id: 87, name: "Cornish Pasty", category: "Savoury Pies", price: 5.50, image: pastryImg, description: "Traditional meat and potato pasty" },
  { id: 88, name: "Beef Sausage Pie", category: "Savoury Pies", price: 5.00, image: pastryImg, description: "Beef sausage in pastry" },
  { id: 89, name: "Mini Pies (Assorted)", category: "Savoury Pies", price: 12.00, image: pastryImg, description: "Selection of 6 mini pies" },
  { id: 90, name: "Chicken Turnovers", category: "Savoury Pies", price: 4.50, image: pastryImg, description: "Folded pastry with chicken filling" },

  // Sweet Pies & Tarts (91-105)
  { id: 91, name: "Apple Pie", category: "Sweet Pies", price: 22.00, image: pastryImg, description: "Classic apple pie with cinnamon" },
  { id: 92, name: "Cherry Pie", category: "Sweet Pies", price: 24.00, image: pastryImg, description: "Sweet cherry filled pie" },
  { id: 93, name: "Blueberry Pie", category: "Sweet Pies", price: 24.00, image: pastryImg, description: "Fresh blueberry pie" },
  { id: 94, name: "Pecan Pie", category: "Sweet Pies", price: 26.00, image: pastryImg, description: "Rich caramel pecan filling" },
  { id: 95, name: "Pumpkin Pie", category: "Sweet Pies", price: 22.00, image: pastryImg, description: "Spiced pumpkin pie" },
  { id: 96, name: "Lemon Meringue Tart", category: "Sweet Pies", price: 24.00, image: pastryImg, description: "Tangy lemon with fluffy meringue" },
  { id: 97, name: "Milk Tart", category: "Sweet Pies", price: 20.00, image: pastryImg, description: "Traditional South African melktert" },
  { id: 98, name: "Custard Tart", category: "Sweet Pies", price: 18.00, image: pastryImg, description: "Creamy custard in pastry shell" },
  { id: 99, name: "Chocolate Tart", category: "Sweet Pies", price: 24.00, image: pastryImg, description: "Rich chocolate ganache tart" },
  { id: 100, name: "Caramel Tart", category: "Sweet Pies", price: 22.00, image: pastryImg, description: "Salted caramel filling" },
  { id: 101, name: "Fresh Fruit Tart", category: "Sweet Pies", price: 26.00, image: pastryImg, description: "Seasonal fresh fruit on custard" },
  { id: 102, name: "Mixed Berry Tart", category: "Sweet Pies", price: 26.00, image: pastryImg, description: "Strawberries, raspberries and blueberries" },
  { id: 103, name: "Peach Tart", category: "Sweet Pies", price: 22.00, image: pastryImg, description: "Sweet peach filling" },
  { id: 104, name: "Mini Custard Cups", category: "Sweet Pies", price: 8.00, image: pastryImg, description: "Pack of 4 mini custard tarts" },
  { id: 105, name: "Mini Fruit Tarts", category: "Sweet Pies", price: 10.00, image: pastryImg, description: "Pack of 4 mini fruit tarts" },

  // Cookies & Biscuits (106-115)
  { id: 106, name: "Chocolate Chip Cookies", category: "Cookies", price: 2.50, image: pastryImg, description: "Classic chewy chocolate chip" },
  { id: 107, name: "Oatmeal Raisin Cookies", category: "Cookies", price: 2.50, image: pastryImg, description: "Hearty oats with plump raisins" },
  { id: 108, name: "Double Chocolate Cookies", category: "Cookies", price: 3.00, image: pastryImg, description: "Extra chocolatey cookies" },
  { id: 109, name: "Sugar Cookies", category: "Cookies", price: 2.00, image: pastryImg, description: "Classic buttery sugar cookies" },
  { id: 110, name: "Shortbread Cookies", category: "Cookies", price: 2.50, image: pastryImg, description: "Buttery Scottish shortbread" },
  { id: 111, name: "Peanut Butter Cookies", category: "Cookies", price: 2.50, image: pastryImg, description: "Rich peanut butter flavor" },
  { id: 112, name: "Coconut Biscuits", category: "Cookies", price: 2.00, image: pastryImg, description: "Toasted coconut cookies" },
  { id: 113, name: "Ginger Biscuits", category: "Cookies", price: 2.00, image: pastryImg, description: "Spiced ginger snap cookies" },
  { id: 114, name: "Almond Cookies", category: "Cookies", price: 3.00, image: pastryImg, description: "Delicate almond flavored cookies" },
  { id: 115, name: "White Choc Macadamia Cookies", category: "Cookies", price: 3.50, image: pastryImg, description: "White chocolate with macadamia nuts" },

  // Drinks (116-135)
  { id: 116, name: "Cappuccino", category: "Drinks", price: 3.50, image: pastryImg, description: "Espresso with steamed milk foam" },
  { id: 117, name: "Latte", category: "Drinks", price: 3.50, image: pastryImg, description: "Smooth espresso with steamed milk" },
  { id: 118, name: "Mocha", category: "Drinks", price: 4.00, image: pastryImg, description: "Espresso with chocolate and milk" },
  { id: 119, name: "Americano", category: "Drinks", price: 3.00, image: pastryImg, description: "Espresso with hot water" },
  { id: 120, name: "Espresso", category: "Drinks", price: 2.50, image: pastryImg, description: "Strong Italian espresso shot" },
  { id: 121, name: "Hot Chocolate", category: "Drinks", price: 3.50, image: pastryImg, description: "Rich Belgian hot chocolate" },
  { id: 122, name: "Chai Latte", category: "Drinks", price: 4.00, image: pastryImg, description: "Spiced chai with steamed milk" },
  { id: 123, name: "Rooibos Tea", category: "Drinks", price: 2.50, image: pastryImg, description: "South African red bush tea" },
  { id: 124, name: "English Breakfast Tea", category: "Drinks", price: 2.50, image: pastryImg, description: "Classic black tea blend" },
  { id: 125, name: "Green Tea", category: "Drinks", price: 2.50, image: pastryImg, description: "Refreshing green tea" },
  { id: 126, name: "Iced Coffee", category: "Drinks", price: 4.00, image: pastryImg, description: "Chilled coffee over ice" },
  { id: 127, name: "Iced Latte", category: "Drinks", price: 4.50, image: pastryImg, description: "Cold espresso with milk over ice" },
  { id: 128, name: "Iced Tea (Peach)", category: "Drinks", price: 3.50, image: pastryImg, description: "Refreshing peach iced tea" },
  { id: 129, name: "Iced Tea (Lemon)", category: "Drinks", price: 3.50, image: pastryImg, description: "Classic lemon iced tea" },
  { id: 130, name: "Fresh Orange Juice", category: "Drinks", price: 4.00, image: pastryImg, description: "Freshly squeezed oranges" },
  { id: 131, name: "Apple Juice", category: "Drinks", price: 3.50, image: pastryImg, description: "Fresh pressed apple juice" },
  { id: 132, name: "Mango Juice", category: "Drinks", price: 4.00, image: pastryImg, description: "Tropical mango juice" },
  { id: 133, name: "Sparkling Water", category: "Drinks", price: 2.00, image: pastryImg, description: "Refreshing sparkling water" },
  { id: 134, name: "Still Water", category: "Drinks", price: 1.50, image: pastryImg, description: "Pure still water" },
  { id: 135, name: "Soft Drinks", category: "Drinks", price: 2.50, image: pastryImg, description: "Coke, Sprite, or Fanta" },
];
