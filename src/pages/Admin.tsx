// src/pages/Admin.tsx - Updated to use ProductsContext
import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useProducts } from "@/contexts/ProductsContext";
import { categories } from "@/data/products";
import {
  Package,
  MessageSquare,
  Star,
  Clock,
  CheckCircle,
  XCircle,
  Send,
  Trash2,
  ChefHat,
  AlertCircle,
  Plus,
  Edit,
  Save,
  X,
  ShoppingBag,
  Upload,
  Image as ImageIcon,
  Search
} from "lucide-react";
 import { uploadImage } from "@/utils/uploadImage";

// Mock orders data
const mockOrders = [
  {
    id: "PB-001",
    customer: "Maria Santos",
    email: "maria@email.com",
    items: ["2x Pastel de Nata", "1x Artisan Sourdough"],
    total: "R7.50",
    status: "pending",
    date: "2024-01-15 09:30",
    specialInstructions: "Please make the custard tarts extra crispy and remove any cinnamon from the sourdough",
  },
  {
    id: "PB-002",
    customer: "João Silva",
    email: "joao@email.com",
    items: ["1x Chocolate Ganache Cake", "4x Butter Croissant"],
    total: "R39.20",
    status: "baking",
    date: "2024-01-15 10:15",
    specialInstructions: "Birthday cake - need by 3pm. Add extra chocolate and no nuts please!",
  },
];

const mockMessages = [
  {
    id: 1,
    orderId: "PB-001",
    customer: "Maria Santos",
    messages: [
      { from: "customer", text: "Hi, can I pick up at 2pm instead of 1pm?", time: "10:30" },
      { from: "admin", text: "Of course! We'll have your order ready at 2pm.", time: "10:35" },
    ],
  },
  {
    id: 2,
    orderId: "PB-002",
    customer: "João Silva",
    messages: [
      { from: "customer", text: "Can you add 'Happy Birthday Ana' on the cake?", time: "10:20" },
    ],
  },
];

const mockTestimonials = [
  {
    id: 1,
    name: "Carlos Mendes",
    rating: 5,
    text: "Best pastel de nata in the city! The crust is perfectly crispy and the custard is divine.",
    date: "2024-01-14",
    status: "approved",
  },
  {
    id: 2,
    name: "Sofia Almeida",
    rating: 4,
    text: "Love their sourdough bread. Fresh and delicious every time I visit.",
    date: "2024-01-13",
    status: "pending",
  },
];

const statusColors = {
  pending: "bg-amber-100 text-amber-800 border-amber-200",
  baking: "bg-orange-100 text-orange-800 border-orange-200",
  ready: "bg-green-100 text-green-800 border-green-200",
  delivered: "bg-blue-100 text-blue-800 border-blue-200",
};

const statusIcons = {
  pending: <Clock className="h-3 w-3" />,
  baking: <ChefHat className="h-3 w-3" />,
  ready: <CheckCircle className="h-3 w-3" />,
  delivered: <Package className="h-3 w-3" />,
};

export default function Admin() {
  const { toast } = useToast();
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const [orders, setOrders] = useState(mockOrders);
  const [messages] = useState(mockMessages);
  const [testimonials, setTestimonials] = useState(mockTestimonials);
  const [selectedChat, setSelectedChat] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = searchQuery.trim()
    ? products.filter(p =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : products;

  const [newProductForm, setNewProductForm] = useState({
    name: "",
    category: "Pastries",
    price: "",
    image: "",
    description: "",
    ingredients: "",
    weight: "",
    allergens: "",
  });

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(orders.map(order =>
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
    toast({
      title: "Order Updated",
      description: `Order ${orderId} status changed to ${newStatus}`,
    });
  };

  const handleTestimonialAction = (id, action) => {
    if (action === "approve") {
      setTestimonials(testimonials.map(t =>
        t.id === id ? { ...t, status: "approved" } : t
      ));
      toast({ title: "Testimonial Approved", description: "The review is now visible on the website." });
    } else {
      setTestimonials(testimonials.filter(t => t.id !== id));
      toast({ title: "Testimonial Removed", description: "The review has been deleted." });
    }
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedChat) return;
    toast({
      title: "Message Sent",
      description: "Your message has been sent to the customer.",
    });
    setNewMessage("");
  };

const handleImageUpload = async (e, isEdit = false) => {
  const file = e.target.files?.[0];
  if (!file) return;

  // Preview (optional)
  const previewUrl = URL.createObjectURL(file);
  setImagePreview(previewUrl);

  try {
    // Upload to Cloudinary
    const imageUrl = await uploadImage(file);

    if (isEdit && editingProduct) {
      setEditingProduct(prev => ({
        ...prev,
        image: imageUrl
      }));
    } else {
      setNewProductForm(prev => ({
        ...prev,
        image: imageUrl
      }));
    }

  } catch (err) {
    console.error("Upload error:", err);
    alert("Image upload failed. Please try again.");
  }
};

  const handleAddProduct = () => {
    if (!newProductForm.name || !newProductForm.price) {
      toast({
        title: "Error",
        description: "Please fill in product name and price",
        variant: "destructive",
      });
      return;
    }

    const productData = {
      name: newProductForm.name,
      category: newProductForm.category,
      price: parseFloat(newProductForm.price),
      image: newProductForm.image || "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400",
      description: newProductForm.description,
      ingredients: newProductForm.ingredients.split(",").map(i => i.trim()).filter(Boolean),
      weight: newProductForm.weight,
      allergens: newProductForm.allergens.split(",").map(a => a.trim()).filter(Boolean),
      nutritionalInfo: {
        calories: 0,
        protein: "0g",
        carbs: "0g",
        fat: "0g",
      },
    };

    addProduct(productData);
    setShowAddProduct(false);
    setNewProductForm({
      name: "",
      category: "Pastries",
      price: "",
      image: "",
      description: "",
      ingredients: "",
      weight: "",
      allergens: "",
    });
    setImagePreview(null);
    toast({
      title: "Product Added",
      description: `${productData.name} has been added to the menu and will appear immediately`,
    });
  };

  const handleEditProduct = (product) => {
    setEditingProduct({
      ...product,
      ingredients: product.ingredients.join(", "),
      allergens: product.allergens.join(", "),
    });
    setImagePreview(product.image);
  };

  const handleSaveEdit = () => {
    if (!editingProduct.name || !editingProduct.price) {
      toast({
        title: "Error",
        description: "Please fill in product name and price",
        variant: "destructive",
      });
      return;
    }

    const updatedData = {
      name: editingProduct.name,
      category: editingProduct.category,
      price: parseFloat(editingProduct.price),
      image: editingProduct.image,
      description: editingProduct.description,
      ingredients: editingProduct.ingredients.split(",").map(i => i.trim()).filter(Boolean),
      weight: editingProduct.weight,
      allergens: editingProduct.allergens.split(",").map(a => a.trim()).filter(Boolean),
    };

    updateProduct(editingProduct.id, updatedData);
    setEditingProduct(null);
    setImagePreview(null);
    toast({
      title: "Product Updated",
      description: `${updatedData.name} has been updated on the menu`,
    });
  };

  const handleDeleteProduct = (id) => {
    const product = products.find(p => p.id === id);
    if (confirm(`Are you sure you want to delete "${product.name}"? This will remove it from the menu.`)) {
      deleteProduct(id);
      toast({
        title: "Product Deleted",
        description: `${product.name} has been removed from the menu`,
      });
    }
  };

  const stats = {
    totalOrders: orders.length,
    pendingOrders: orders.filter(o => o.status === "pending").length,
    readyOrders: orders.filter(o => o.status === "ready").length,
    pendingReviews: testimonials.filter(t => t.status === "pending").length,
    totalProducts: products.length,
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 md:pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-2">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground">
              Manage orders, products, communications, and testimonials
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <Card>
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 md:p-3 rounded-xl bg-primary/10">
                    <Package className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-xl md:text-2xl font-bold text-foreground">{stats.totalOrders}</p>
                    <p className="text-xs md:text-sm text-muted-foreground">Orders</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 md:p-3 rounded-xl bg-amber-500/10">
                    <Clock className="h-5 w-5 md:h-6 md:w-6 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-xl md:text-2xl font-bold text-foreground">{stats.pendingOrders}</p>
                    <p className="text-xs md:text-sm text-muted-foreground">Pending</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 md:p-3 rounded-xl bg-green-500/10">
                    <CheckCircle className="h-5 w-5 md:h-6 md:w-6 text-green-500" />
                  </div>
                  <div>
                    <p className="text-xl md:text-2xl font-bold text-foreground">{stats.readyOrders}</p>
                    <p className="text-xs md:text-sm text-muted-foreground">Ready</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 md:p-3 rounded-xl bg-blue-500/10">
                    <Star className="h-5 w-5 md:h-6 md:w-6 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-xl md:text-2xl font-bold text-foreground">{stats.pendingReviews}</p>
                    <p className="text-xs md:text-sm text-muted-foreground">Reviews</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 md:p-3 rounded-xl bg-purple-500/10">
                    <ShoppingBag className="h-5 w-5 md:h-6 md:w-6 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-xl md:text-2xl font-bold text-foreground">{stats.totalProducts}</p>
                    <p className="text-xs md:text-sm text-muted-foreground">Products</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="orders" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
              <TabsTrigger value="orders" className="gap-2">
                <Package className="h-4 w-4 hidden sm:block" />
                Orders
              </TabsTrigger>
              <TabsTrigger value="products" className="gap-2">
                <ShoppingBag className="h-4 w-4 hidden sm:block" />
                Products
              </TabsTrigger>
              <TabsTrigger value="messages" className="gap-2">
                <MessageSquare className="h-4 w-4 hidden sm:block" />
                Messages
              </TabsTrigger>
              <TabsTrigger value="testimonials" className="gap-2">
                <Star className="h-4 w-4 hidden sm:block" />
                Reviews
              </TabsTrigger>
            </TabsList>

            {/* Orders Tab */}
            <TabsContent value="orders" className="space-y-4">
              {orders.map((order) => (
                <Card key={order.id}>
                  <CardContent className="p-4 md:p-6">
                    <div className="flex flex-col lg:flex-row justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className="font-mono font-bold text-primary">{order.id}</span>
                          <Badge className={`${statusColors[order.status]} flex items-center gap-1`}>
                            {statusIcons[order.status]}
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </Badge>
                        </div>
                        <p className="font-medium text-foreground">{order.customer}</p>
                        <p className="text-sm text-muted-foreground truncate">{order.email}</p>
                        <p className="text-sm text-muted-foreground mt-1">{order.date}</p>
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground mb-1">Items:</p>
                        <ul className="text-sm text-muted-foreground mb-3">
                          {order.items.map((item, i) => (
                            <li key={i}>• {item}</li>
                          ))}
                        </ul>

                        {order.specialInstructions && (
                          <div className="mt-3 p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-900">
                            <div className="flex items-start gap-2">
                              <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold text-amber-900 dark:text-amber-100 mb-1">
                                  Special Instructions:
                                </p>
                                <p className="text-sm text-amber-800 dark:text-amber-200 break-words">
                                  {order.specialInstructions}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end gap-3">
                        <p className="text-xl font-bold text-primary">{order.total}</p>
                        <Select
                          value={order.status}
                          onValueChange={(value) => updateOrderStatus(order.id, value)}
                        >
                          <SelectTrigger className="w-full sm:w-36">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="baking">Baking</SelectItem>
                            <SelectItem value="ready">Ready</SelectItem>
                            <SelectItem value="delivered">Delivered</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            {/* Products Tab */}
            <TabsContent value="products" className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Product Management</h2>
                  <p className="text-sm text-muted-foreground">Add, edit, or remove products from your menu</p>
                </div>
                <Button onClick={() => setShowAddProduct(true)} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Product
                </Button>
              </div>

              {/* ADD THIS SEARCH BAR HERE */}
              <div className="max-w-2xl mx-auto mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
                  <Input
                    type="text"
                    placeholder="Search products by name, description, or category..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-10"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors"
                    >
                      <X className="h-4 w-4 text-muted-foreground" />
                    </button>
                  )}
                </div>
                {searchQuery && (
                  <p className="text-sm text-muted-foreground mt-2 text-center">
                    Found {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} matching "{searchQuery}"
                  </p>
                )}
              </div>

              {/* Add Product Form */}
              {showAddProduct && (
                <Card className="mb-6 border-2 border-primary">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>Add New Product</CardTitle>
                      <Button variant="ghost" size="icon" onClick={() => {
                        setShowAddProduct(false);
                        setImagePreview(null);
                        setNewProductForm({
                          name: "",
                          category: "Pastries",
                          price: "",
                          image: "",
                          description: "",
                          ingredients: "",
                          weight: "",
                          allergens: "",
                        });
                      }}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium mb-2 block">Product Name *</label>
                          <Input
                            value={newProductForm.name}
                            onChange={(e) => setNewProductForm({ ...newProductForm, name: e.target.value })}
                            placeholder="e.g. Chocolate Croissant"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-2 block">Category *</label>
                          <Select value={newProductForm.category} onValueChange={(v) => setNewProductForm({ ...newProductForm, category: v })}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map(cat => (
                                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-2 block">Price (R) *</label>
                          <Input
                            type="number"
                            step="0.01"
                            value={newProductForm.price}
                            onChange={(e) => setNewProductForm({ ...newProductForm, price: e.target.value })}
                            placeholder="0.00"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-2 block">Weight</label>
                          <Input
                            value={newProductForm.weight}
                            onChange={(e) => setNewProductForm({ ...newProductForm, weight: e.target.value })}
                            placeholder="e.g. 85g"
                          />
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium mb-2 block">Product Image</label>
                          <div className="border-2 border-dashed rounded-lg p-4 text-center">
                            {imagePreview ? (
                              <div className="space-y-2">
                                <img src={imagePreview} alt="Preview" className="w-full h-40 object-cover rounded" />
                                <Button variant="outline" size="sm" onClick={() => document.getElementById('add-image-upload').click()}>
                                  Change Image
                                </Button>
                              </div>
                            ) : (
                              <div className="space-y-2">
                                <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground" />
                                <Button variant="outline" onClick={() => document.getElementById('add-image-upload').click()}>
                                  <Upload className="h-4 w-4 mr-2" />
                                  Upload Image
                                </Button>
                              </div>
                            )}
                            <input
                              id="add-image-upload"
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleImageUpload(e, false)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Description</label>
                      <Textarea
                        value={newProductForm.description}
                        onChange={(e) => setNewProductForm({ ...newProductForm, description: e.target.value })}
                        placeholder="Brief description of the product"
                        rows={3}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Ingredients (comma-separated)</label>
                      <Input
                        value={newProductForm.ingredients}
                        onChange={(e) => setNewProductForm({ ...newProductForm, ingredients: e.target.value })}
                        placeholder="e.g. Wheat flour, Butter, Chocolate"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Allergens (comma-separated)</label>
                      <Input
                        value={newProductForm.allergens}
                        onChange={(e) => setNewProductForm({ ...newProductForm, allergens: e.target.value })}
                        placeholder="e.g. Gluten, Dairy, Eggs"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleAddProduct} className="flex-1">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Product
                      </Button>
                      <Button variant="outline" onClick={() => {
                        setShowAddProduct(false);
                        setImagePreview(null);
                      }}>
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Products List */}
              <div className="grid gap-4">
                {filteredProducts.map((product) => (
                  <Card key={product.id}>
                    <CardContent className="p-4">
                      {editingProduct?.id === product.id ? (
                        // Edit Mode
                        <div className="space-y-4">
                          <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-4">
                              <div>
                                <label className="text-sm font-medium mb-2 block">Product Name *</label>
                                <Input
                                  value={editingProduct.name}
                                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                                />
                              </div>
                              <div>
                                <label className="text-sm font-medium mb-2 block">Category</label>
                                <Select value={editingProduct.category} onValueChange={(v) => setEditingProduct({ ...editingProduct, category: v })}>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {categories.map(cat => (
                                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <label className="text-sm font-medium mb-2 block">Price (R)</label>
                                <Input
                                  type="number"
                                  step="0.01"
                                  value={editingProduct.price}
                                  onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                                />
                              </div>
                              <div>
                                <label className="text-sm font-medium mb-2 block">Weight</label>
                                <Input
                                  value={editingProduct.weight}
                                  onChange={(e) => setEditingProduct({ ...editingProduct, weight: e.target.value })}
                                />
                              </div>
                            </div>
                            <div>
                              <label className="text-sm font-medium mb-2 block">Product Image</label>
                              <div className="border-2 border-dashed rounded-lg p-4">
                                <img src={imagePreview || editingProduct.image} alt={editingProduct.name} className="w-full h-40 object-cover rounded mb-2" />
                                <Button variant="outline" size="sm" className="w-full" onClick={() => document.getElementById(`edit-image-${product.id}`).click()}>
                                  <Upload className="h-4 w-4 mr-2" />
                                  Change Image
                                </Button>
                                <input
                                  id={`edit-image-${product.id}`}
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => handleImageUpload(e, true)}
                                />
                              </div>
                            </div>
                          </div>
                          <div>
                            <label className="text-sm font-medium mb-2 block">Description</label>
                            <Textarea
                              value={editingProduct.description}
                              onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                              rows={2}
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium mb-2 block">Ingredients (comma-separated)</label>
                            <Input
                              value={editingProduct.ingredients}
                              onChange={(e) => setEditingProduct({ ...editingProduct, ingredients: e.target.value })}
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium mb-2 block">Allergens (comma-separated)</label>
                            <Input
                              value={editingProduct.allergens}
                              onChange={(e) => setEditingProduct({ ...editingProduct, allergens: e.target.value })}
                            />
                          </div>
                          <div className="flex gap-2">
                            <Button onClick={handleSaveEdit} className="flex-1">
                              <Save className="h-4 w-4 mr-2" />
                              Save Changes
                            </Button>
                            <Button variant="outline" onClick={() => {
                              setEditingProduct(null);
                              setImagePreview(null);
                            }}>
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        // View Mode
                        <div className="flex gap-4">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-4 mb-2">
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-lg text-foreground">{product.name}</h3>
                                <Badge variant="outline" className="mt-1">{product.category}</Badge>
                              </div>
                              <p className="text-xl font-bold text-primary whitespace-nowrap">R{product.price.toFixed(2)}</p>
                            </div>
                            {product.description && (
                              <p className="text-sm text-muted-foreground mb-2">{product.description}</p>
                            )}
                            {product.weight && (
                              <p className="text-xs text-muted-foreground">Weight: {product.weight}</p>
                            )}
                            {product.ingredients && product.ingredients.length > 0 && (
                              <p className="text-xs text-muted-foreground mt-1">
                                Ingredients: {product.ingredients.join(", ")}
                              </p>
                            )}
                            {product.allergens && product.allergens.length > 0 && (
                              <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                                Allergens: {product.allergens.join(", ")}
                              </p>
                            )}
                          </div>
                          <div className="flex flex-col gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditProduct(product)}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteProduct(product.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Messages Tab */}
            <TabsContent value="messages" className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                {/* Chat List */}
                <Card className="md:col-span-1">
                  <CardHeader>
                    <CardTitle>Conversations</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="divide-y">
                      {messages.map((chat) => (
                        <button
                          key={chat.id}
                          onClick={() => setSelectedChat(chat)}
                          className={`w-full p-4 text-left hover:bg-accent transition-colors ${selectedChat?.id === chat.id ? "bg-accent" : ""
                            }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-medium text-foreground">{chat.customer}</p>
                            {chat.messages.some(m => m.from === "customer" && m !== chat.messages[chat.messages.length - 1]) && (
                              <Badge variant="destructive" className="h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                                1
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">Order {chat.orderId}</p>
                          <p className="text-xs text-muted-foreground truncate mt-1">
                            {chat.messages[chat.messages.length - 1].text}
                          </p>
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Chat Window */}
                <Card className="md:col-span-2">
                  {selectedChat ? (
                    <>
                      <CardHeader className="border-b">
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle>{selectedChat.customer}</CardTitle>
                            <p className="text-sm text-muted-foreground">Order {selectedChat.orderId}</p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4">
                        <div className="space-y-4 mb-4 max-h-96 overflow-y-auto">
                          {selectedChat.messages.map((msg, idx) => (
                            <div
                              key={idx}
                              className={`flex ${msg.from === "admin" ? "justify-end" : "justify-start"}`}
                            >
                              <div
                                className={`max-w-[80%] rounded-lg p-3 ${msg.from === "admin"
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-muted"
                                  }`}
                              >
                                <p className="text-sm">{msg.text}</p>
                                <p className="text-xs opacity-70 mt-1">{msg.time}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <Input
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type your message..."
                            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                          />
                          <Button onClick={sendMessage}>
                            <Send className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </>
                  ) : (
                    <CardContent className="flex items-center justify-center h-full min-h-[400px]">
                      <div className="text-center text-muted-foreground">
                        <MessageSquare className="h-16 w-16 mx-auto mb-4 opacity-20" />
                        <p>Select a conversation to start messaging</p>
                      </div>
                    </CardContent>
                  )}
                </Card>
              </div>
            </TabsContent>

            {/* Testimonials Tab */}
            <TabsContent value="testimonials" className="space-y-4">
              {testimonials.map((testimonial) => (
                <Card key={testimonial.id}>
                  <CardContent className="p-4 md:p-6">
                    <div className="flex flex-col sm:flex-row justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <p className="font-medium text-foreground">{testimonial.name}</p>
                          <Badge
                            className={
                              testimonial.status === "approved"
                                ? "bg-green-100 text-green-800 border-green-200"
                                : "bg-amber-100 text-amber-800 border-amber-200"
                            }
                          >
                            {testimonial.status === "approved" ? "Approved" : "Pending"}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1 mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${i < testimonial.rating
                                ? "fill-amber-400 text-amber-400"
                                : "text-gray-300"
                                }`}
                            />
                          ))}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{testimonial.text}</p>
                        <p className="text-xs text-muted-foreground">{testimonial.date}</p>
                      </div>
                      <div className="flex sm:flex-col gap-2">
                        {testimonial.status === "pending" && (
                          <Button
                            onClick={() => handleTestimonialAction(testimonial.id, "approve")}
                            className="flex-1 sm:flex-initial gap-2"
                          >
                            <CheckCircle className="h-4 w-4" />
                            Approve
                          </Button>
                        )}
                        <Button
                          variant="destructive"
                          onClick={() => handleTestimonialAction(testimonial.id, "delete")}
                          className="flex-1 sm:flex-initial gap-2"
                        >
                          <XCircle className="h-4 w-4" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
}