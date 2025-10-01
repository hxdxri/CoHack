# 🌱 HarvestLink

A full-stack web application connecting farmers directly with customers for fresh, local produce sales.

## 🌟 Overview

HarvestLink is a React + TypeScript + Tailwind CSS + Node.js/Express application that helps farmers sell directly to customers, eliminating middlemen and ensuring fair prices for both parties.

### ✨ Core Features

- **🔐 Authentication**: Email/password registration & login with separate roles (farmer/customer)
- **👨‍🌾 Farmer Dashboard**: Create, edit, delete product listings with farm profile management
- **🛒 Customer Dashboard**: Browse products, view farmer profiles, and product details
- **🛍️ Shopping Cart**: Add products to cart with quantity management and checkout flow
- **📦 Order Management**: Complete order lifecycle from placement to fulfillment
- **🔢 PIN System**: Secure pickup PINs for order verification
- **💬 Chat System**: Direct messaging between farmers and customers
- **⭐ Reviews**: Customer reviews and ratings for farmers
- **📊 Order History**: Comprehensive order tracking and past order management
- **📱 Responsive Design**: Mobile-first design with HarvestLink custom theme

### 🎨 Design System

**Color Palette:**
- Primary Green: `#1A7F5A`
- Leaf Accent: `#22C55E`
- Ink: `#1F2937`
- Graphite: `#374151`
- Mist: `#F7FAF7`
- Bone: `#FFFFFF`
- Wheat: `#E8D8B8`

**Typography:**
- Headings: Inter (600–700 weight)
- Body: Inter (400–500 weight), 16–18px, line-height 1.6–1.8

**Components:**
- Border radius: 12px (cards), 8px (controls)
- Shadows: Subtle single-layer
- Icons: Line style, 2px stroke

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd CoHack
   ```

2. **Install all dependencies**
   ```bash
   npm run install:all
   ```

3. **Seed the database with demo data**
   ```bash
   npm run seed
   ```

4. **Start the development servers**
   ```bash
   npm run dev
   ```

This will start:
- Backend server on `http://localhost:5000`
- Frontend development server on `http://localhost:3000`

### 🔑 Demo Credentials

**Farmer Account:**
- Email: `farmer@harvestlink.com`
- Password: `password123`

**Customer Account:**
- Email: `customer@harvestlink.com`
- Password: `password123`

## 📁 Project Structure

```
CoHack/
├── server/                 # Express backend
│   ├── data/              # JSON data storage
│   │   ├── farmer_profiles.json
│   │   ├── messages.json
│   │   ├── orders.json
│   │   ├── products.json
│   │   ├── reviews.json
│   │   └── users.json
│   ├── src/
│   │   ├── models/        # Data models (User, Product, Message, Review, Order)
│   │   ├── routes/        # API routes (auth, farmers, messages, orders, products, reviews)
│   │   ├── middleware/    # Auth middleware
│   │   ├── storage/       # localStorage simulation
│   │   ├── scripts/       # Seed script
│   │   └── types/         # TypeScript types
│   ├── package.json
│   └── tsconfig.json
├── client/                # React frontend
│   ├── public/            # Static assets
│   │   ├── farm-pattern.svg
│   │   ├── farm1.jpg, farm2.avif, farm3.jpg, farm4.jpg
│   │   ├── farmer.jpg
│   │   ├── favicon.svg
│   │   └── hero1.jpeg, hero2.jpeg
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   │   ├── layout/    # Layout components (Header, Footer, Layout, MobileMenu, ScrollNavbar)
│   │   │   ├── profile/   # Profile components (EditProfileModal, ProfileLayout)
│   │   │   └── ui/        # UI components (Button, Card, Input, Modal, etc.)
│   │   ├── pages/         # Page components
│   │   │   ├── auth/      # Authentication pages
│   │   │   ├── customer/  # Customer pages (Dashboard, Cart, Checkout, Farm, PastOrders, ProductListing, Profile)
│   │   │   ├── farmer/    # Farmer pages (Dashboard, OrderFulfillment, Products, Profile)
│   │   │   ├── About.tsx
│   │   │   ├── Landing.tsx
│   │   │   ├── Listing.tsx
│   │   │   └── Messages.tsx
│   │   ├── store/         # Zustand state management (auth, cart, messages)
│   │   ├── lib/           # API utilities
│   │   ├── types/         # TypeScript types
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── index.html
│   ├── tailwind.config.js # Tailwind configuration
│   ├── postcss.config.js
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   └── package.json
├── package.json           # Root package.json
└── README.md
```

## 🛠️ Technology Stack

### Backend
- **Node.js + Express**: RESTful API server
- **TypeScript**: Type safety and better development experience
- **localStorage Simulation**: File-based data persistence (for demo purposes)
- **JWT**: Authentication tokens
- **bcryptjs**: Password hashing

### Frontend
- **React 18**: UI framework with hooks
- **TypeScript**: Type safety
- **Tailwind CSS**: Utility-first CSS framework with custom theme
- **React Router**: Client-side routing
- **Zustand**: Lightweight state management
- **React Hook Form**: Form handling and validation
- **Axios**: HTTP client
- **Lucide React**: Icon library

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout

### Products
- `GET /api/products` - Get all active products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (farmers only)
- `PUT /api/products/:id` - Update product (farmers only)
- `DELETE /api/products/:id` - Delete product (farmers only)

### Farmers
- `GET /api/farmers` - Get all farmer profiles
- `GET /api/farmers/:id` - Get farmer profile by ID
- `GET /api/farmers/my/profile` - Get my farmer profile
- `PUT /api/farmers/my/profile` - Update my farmer profile

### Messages
- `GET /api/messages/conversations` - Get all conversations
- `GET /api/messages/conversation/:userId` - Get conversation with user
- `POST /api/messages/send` - Send message
- `GET /api/messages/unread/count` - Get unread message count

### Orders
- `GET /api/orders` - Get all orders (farmers only)
- `GET /api/orders/my` - Get my orders (customers) or my farm orders (farmers)
- `POST /api/orders` - Create new order (customers only)
- `PUT /api/orders/:id` - Update order status (farmers only)
- `GET /api/orders/:id` - Get order details
- `DELETE /api/orders/:id` - Cancel order

### Reviews
- `POST /api/reviews` - Create review (customers only)
- `GET /api/reviews/farmer/:farmerId` - Get farmer reviews
- `GET /api/reviews/my/reviews` - Get my reviews
- `PUT /api/reviews/:reviewId` - Update review
- `DELETE /api/reviews/:reviewId` - Delete review

## 🧩 Component Usage Examples

### Button Component

```tsx
import { Button } from '@/components/ui/Button';

// Primary button
<Button variant="primary" onClick={handleClick}>
  Save Changes
</Button>

// Loading state
<Button variant="primary" isLoading disabled>
  Saving...
</Button>

// Outline button with custom size
<Button variant="outline" size="lg">
  Learn More
</Button>
```

### Card Component

```tsx
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/Card';

// Basic card
<Card>
  <CardHeader>
    <h3>Product Details</h3>
  </CardHeader>
  <CardContent>
    <p>Product information...</p>
  </CardContent>
  <CardFooter>
    <Button>Add to Cart</Button>
  </CardFooter>
</Card>

// Card with hover effect
<Card hover>
  <ProductItem product={product} />
</Card>
```

### Input Component

```tsx
import { Input, Textarea, Select } from '@/components/ui/Input';

// Basic input with validation
<Input
  label="Email Address"
  type="email"
  placeholder="Enter your email"
  error={errors.email?.message}
  required
/>

// Textarea with helper text
<Textarea
  label="Product Description"
  placeholder="Describe your product..."
  rows={4}
  helperText="Be descriptive to attract customers"
  required
/>

// Select dropdown
<Select
  label="Product Category"
  options={[
    { value: 'vegetables', label: 'Vegetables' },
    { value: 'fruits', label: 'Fruits' },
  ]}
  required
/>
```

### Modal Component

```tsx
import { Modal, ConfirmModal } from '@/components/ui/Modal';

// Basic modal
<Modal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  title="Edit Product"
>
  <ProductForm onSubmit={handleSubmit} />
</Modal>

// Confirmation modal
<ConfirmModal
  isOpen={showDeleteModal}
  onClose={() => setShowDeleteModal(false)}
  onConfirm={handleDelete}
  title="Delete Product"
  message="Are you sure you want to delete this product?"
  variant="danger"
  confirmText="Delete"
/>
```

## 🎨 Customizing the Theme

The HarvestLink theme is configured in `client/tailwind.config.js` and `client/src/index.css`.

### Adding New Colors

```js
// tailwind.config.js
theme: {
  extend: {
    colors: {
      'custom-color': {
        50: '#f0f9ff',
        500: '#0ea5e9',
        900: '#0c4a6e',
      }
    }
  }
}
```

### Creating New Component Styles

```css
/* src/index.css */
@layer components {
  .btn-custom {
    @apply btn bg-custom-color-500 text-white hover:bg-custom-color-600;
  }
}
```

## 🔧 Development Scripts

```bash
# Install all dependencies (root, server, client)
npm run install:all

# Start both server and client in development mode
npm run dev

# Start only the server
npm run server:dev

# Start only the client
npm run client:dev

# Build the server
npm run server:build

# Build the client
npm run client:build

# Seed the database with demo data
npm run seed
```

## 🆕 Recent Updates

### Order Management System
- **Complete Order Lifecycle**: From cart to checkout to fulfillment
- **Order Status Tracking**: Real-time status updates (pending → confirmed → preparing → ready → delivered)
- **PIN System**: Secure pickup verification with PIN: 5678
- **Order History**: Comprehensive past orders with search, filtering, and sorting
- **Order Fulfillment**: Farmer dashboard for managing incoming orders

### Enhanced UI Components
- **Order Management Table**: Advanced table with sorting and filtering
- **Status Badges**: Visual status indicators for orders
- **PIN Entry Modal**: Secure PIN verification system
- **Enhanced Farm Timeline**: Improved farm activity tracking
- **Photo Galleries**: Horizontal and vertical photo displays
- **Google Maps Integration**: Farm location mapping

### Shopping Experience
- **Shopping Cart**: Full cart functionality with quantity management
- **Checkout Process**: Complete checkout flow with order confirmation
- **Product Listings**: Enhanced product browsing and filtering
- **Farm Profiles**: Detailed farmer and farm information pages

## 🚀 Extending Features

### Adding New API Endpoints

1. **Create the route handler** in `server/src/routes/`
2. **Add the route** to `server/src/index.ts`
3. **Update the API client** in `client/src/lib/api.ts`
4. **Add TypeScript types** in both `server/src/types/` and `client/src/types/`

### Adding New UI Components

1. **Create the component** in `client/src/components/ui/`
2. **Add TypeScript interfaces** for props
3. **Include usage examples** in JSDoc comments
4. **Export from index file** if creating a component library

### Adding New Pages

1. **Create the page component** in `client/src/pages/`
2. **Add the route** in `client/src/App.tsx`
3. **Add navigation links** in `client/src/components/layout/Header.tsx`
4. **Update mobile menu** in `client/src/components/layout/MobileMenu.tsx`

## 📝 Data Models

### User
```typescript
interface User {
  id: string;
  email: string;
  name: string;
  role: 'farmer' | 'customer';
  createdAt: string;
  updatedAt: string;
}
```

### Product
```typescript
interface Product {
  id: string;
  farmerId: string;
  name: string;
  category: 'vegetables' | 'fruits' | 'dairy' | 'grains' | 'meat' | 'other';
  price: number;
  quantity: number;
  unit: string;
  description: string;
  imageUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
```

### Message
```typescript
interface Message {
  id: string;
  fromUserId: string;
  toUserId: string;
  content: string;
  isRead: boolean;
  createdAt: string;
}
```

### Review
```typescript
interface Review {
  id: string;
  customerId: string;
  farmerId: string;
  rating: number;
  comment: string;
  createdAt: string;
}
```

### Order
```typescript
interface Order {
  id: string;
  farmerId: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'out_for_delivery' | 'delivered' | 'cancelled';
  orderDate: string;
  deliveryDate?: string;
  deliveryAddress?: string;
  deliveryPin?: string;
  notes?: string;
  rating?: number;
  review?: string;
  createdAt: string;
  updatedAt: string;
}

interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  category: string;
  quantity: number;
  unit: string;
  price: number;
  imageUrl?: string;
}
```

## 🔒 Security Considerations

- **JWT Tokens**: Stored in localStorage (consider httpOnly cookies for production)
- **Password Hashing**: Uses bcryptjs with salt rounds
- **Input Validation**: Client and server-side validation
- **CORS**: Configured for development (update for production)
- **Rate Limiting**: Not implemented (consider adding for production)

## 🚀 Production Deployment

### Environment Variables

Create `.env` files for production:

**Server (.env)**
```
NODE_ENV=production
PORT=5000
JWT_SECRET=your-super-secret-jwt-key
CLIENT_URL=https://your-frontend-domain.com
```

**Client (.env)**
```
VITE_API_URL=https://your-backend-domain.com/api
```

### Build Commands

```bash
# Build both server and client
npm run server:build
npm run client:build

# Start production server
cd server && npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Tailwind CSS** for the utility-first CSS framework
- **Lucide React** for the beautiful icon library
- **React Hook Form** for elegant form handling
- **Zustand** for simple state management

---

Built with ❤️ for connecting farmers and customers directly.
