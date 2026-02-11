// src/components/sections/UserListings.js

export const userListings = [
  {
    id: 1,
    user: "Shivani (CSE)",
    title: "Raspberry Pi 4 Model B",
    price: "₹8,000",
    numericPrice: 8000,
    tag: "Electronics",
    category: "electronics",
    branch: "cs",
    year: 4,
    condition: "Like New",
    type: "sale",
    status: "active", // active, sold, pending
    isTrending: true,
    isVerified: true,
    timeAgo: "2m ago",
    postedDate: "2026-02-08",
    views: 145,
    saves: 32,
    messages: 8,
    location: "Near ATC",
    image: "https://res.cloudinary.com/djjufrcal/image/upload/v1770735231/image_14_xzgh7c.png",
    images: [
      "https://res.cloudinary.com/djjufrcal/image/upload/v1770735231/image_14_xzgh7c.png",
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1629654297299-c8506221ca97?auto=format&fit=crop&w=1200&q=80"
    ],
    accent: "#FF5733",
    gradientStart: "rgba(255, 87, 51, 0.3)",
    description: "4GB RAM model, barely used, includes power adapter and case. Purchased for a semester project that is now complete.",
    highlights: ["4 GB RAM", "WiFi + BT 5.0", "Case Included", "GPIO Tested"],
    specs: [
      { label: "Model", value: "Pi 4B" },
      { label: "RAM", value: "4GB" },
      { label: "Storage", value: "32GB SD" },
      { label: "USB", value: "3.0 x2" }
    ],
    sellerRating: 4.8,
    stats: [
      { label: "Views", value: "145" },
      { label: "Saves", value: "32" }
    ]
  },
  {
    id: 2,
    user: "Shivani (CSE)",
    title: "Arduino Mega 2560",
    price: "₹1,500",
    numericPrice: 1500,
    tag: "Electronics",
    category: "electronics",
    branch: "cs",
    year: 4,
    condition: "Good",
    type: "sale",
    status: "active",
    isTrending: false,
    isVerified: true,
    timeAgo: "3d ago",
    postedDate: "2026-02-07",
    views: 89,
    saves: 15,
    messages: 5,
    location: "Hostel Block C",
    image: "https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=800&q=80"
    ],
    accent: "#00D9FF",
    gradientStart: "rgba(0, 217, 255, 0.3)",
    description: "Arduino Mega 2560 with USB cable and sensor kit. Perfect for embedded system projects.",
    highlights: ["54 GPIO Pins", "USB Cable", "16 Analog Inputs", "Used Once"],
    specs: [
      { label: "Board", value: "Mega 2560" },
      { label: "Pins", value: "54 Digital" },
      { label: "Memory", value: "256KB Flash" }
    ],
    sellerRating: 4.8,
    stats: [
      { label: "Views", value: "89" },
      { label: "Saves", value: "15" }
    ]
  },
  {
    id: 3,
    user: "Shivani (CSE)",
    title: "Data Structures Textbook",
    price: "₹350",
    numericPrice: 350,
    tag: "Books",
    category: "books",
    branch: "cs",
    year: 4,
    condition: "Good",
    type: "sale",
    status: "sold",
    isTrending: false,
    isVerified: true,
    timeAgo: "1w ago",
    postedDate: "2026-02-03",
    views: 234,
    saves: 45,
    messages: 12,
    location: "Library Area",
    image: "https://cdn-ilblhlh.nitrocdn.com/GPZeMEUHDphHkVuSHXUfUfAmIVwnktTp/assets/images/optimized/rev-ecdaa54/notes.newtondesk.com/wp-content/uploads/2024/02/Data-structures-DSA-study-notes-pdf-samp3.jpg",
    images: [
      "https://cdn-ilblhlh.nitrocdn.com/GPZeMEUHDphHkVuSHXUfUfAmIVwnktTp/assets/images/optimized/rev-ecdaa54/notes.newtondesk.com/wp-content/uploads/2024/02/Data-structures-DSA-study-notes-pdf-samp3.jpg"
    ],
    accent: "#7B2CBF",
    gradientStart: "rgba(123, 44, 191, 0.3)",
    description: "Data Structures and Algorithms in C by Tanenbaum. Well maintained with minimal highlighting.",
    highlights: ["No Torn Pages", "Light Highlighting", "All Topics Covered", "3rd Edition"],
    specs: [
      { label: "Author", value: "Tanenbaum" },
      { label: "Edition", value: "3rd" },
      { label: "Pages", value: "650" }
    ],
    sellerRating: 4.8,
    stats: [
      { label: "Views", value: "234" },
      { label: "Saves", value: "45" }
    ]
  },
  {
    id: 4,
    user: "Shivani (CSE)",
    title: "Scientific Calculator Casio FX-991EX",
    price: "₹900",
    numericPrice: 900,
    tag: "Tools",
    category: "stationery",
    branch: "cs",
    year: 4,
    condition: "Like New",
    type: "sale",
    status: "pending",
    isTrending: false,
    isVerified: true,
    timeAgo: "5h ago",
    postedDate: "2026-02-10",
    views: 67,
    saves: 12,
    messages: 3,
    location: "Main Gate",
    image: "https://sppbook.com.my/image/sppbook/image/cache/data/all_product_images/product-3540/wO1NXWnS1626487064-1280x960.jpeg",
    images: [
      "https://sppbook.com.my/image/sppbook/image/cache/data/all_product_images/product-3540/wO1NXWnS1626487064-1280x960.jpeg"
    ],
    accent: "#FFE600",
    gradientStart: "rgba(255, 230, 0, 0.3)",
    description: "Casio FX-991EX with box and manual. Barely used, all functions working perfectly.",
    highlights: ["552 Functions", "4-Line Display", "Original Box", "Like New"],
    specs: [
      { label: "Model", value: "FX-991EX" },
      { label: "Display", value: "4 Lines" },
      { label: "Functions", value: "552" }
    ],
    sellerRating: 4.8,
    stats: [
      { label: "Views", value: "67" },
      { label: "Saves", value: "12" }
    ]
  }
];

// Mock chat conversations for dashboard
export const userChats = [
  {
    id: 1,
    productId: 1,
    productTitle: "Raspberry Pi 4 Model B",
    productImage: "https://res.cloudinary.com/djjufrcal/image/upload/v1770735231/image_14_xzgh7c.png",
    buyerName: "Rahul (IT)",
    buyerInitial: "R",
    lastMessage: "Is this still available? Can we meet tomorrow?",
    timestamp: "2m ago",
    unread: 2,
    isActive: true
  },
  {
    id: 2,
    productId: 1,
    productTitle: "Raspberry Pi 4 Model B",
    productImage: "https://res.cloudinary.com/djjufrcal/image/upload/v1770735231/image_14_xzgh7c.png",
    buyerName: "Priya (ECE)",
    buyerInitial: "P",
    lastMessage: "Can you negotiate on the price?",
    timestamp: "1h ago",
    unread: 0,
    isActive: true
  },
  {
    id: 3,
    productId: 2,
    productTitle: "Arduino Mega 2560",
    productImage: "https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&w=800&q=80",
    buyerName: "Amit (Mech)",
    buyerInitial: "A",
    lastMessage: "Does it include sensors?",
    timestamp: "3h ago",
    unread: 1,
    isActive: true
  },
  {
    id: 4,
    productId: 4,
    productTitle: "Scientific Calculator Casio FX-991EX",
    productImage: "https://sppbook.com.my/image/sppbook/image/cache/data/all_product_images/product-3540/wO1NXWnS1626487064-1280x960.jpeg",
    buyerName: "Neha (Civil)",
    buyerInitial: "N",
    lastMessage: "I'll take it! When can we meet?",
    timestamp: "5h ago",
    unread: 0,
    isActive: true
  },
  {
    id: 5,
    productId: 3,
    productTitle: "Data Structures Textbook",
    productImage: "https://cdn-ilblhlh.nitrocdn.com/GPZeMEUHDphHkVuSHXUfUfAmIVwnktTp/assets/images/optimized/rev-ecdaa54/notes.newtondesk.com/wp-content/uploads/2024/02/Data-structures-DSA-study-notes-pdf-samp3.jpg",
    buyerName: "Ankit (CS)",
    buyerInitial: "A",
    lastMessage: "Thanks! Book received.",
    timestamp: "1d ago",
    unread: 0,
    isActive: false
  }
];
