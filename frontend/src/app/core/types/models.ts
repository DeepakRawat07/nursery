export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
  createdAt: string;
  updatedAt: string;
}

export interface AuthSession {
  token: string;
  user: User;
}

export interface RegistrationOtpChallenge {
  email: string;
  expiresInMinutes: number;
  deliveryMethod?: 'email' | 'development';
  devOtp?: string;
}

export interface Plant {
  id: number;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  category: string;
  price: number;
  stock: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PlantFilters {
  q?: string;
  category?: string;
  minPrice?: number | null;
  maxPrice?: number | null;
  inStock?: boolean;
  sort?: string;
  page?: number;
  limit?: number;
}

export interface CartItem {
  id: number;
  plantId: number;
  name: string;
  category: string;
  imageUrl: string;
  price: number;
  quantity: number;
  stock: number;
  subtotal: number;
}

export interface Cart {
  id: number;
  items: CartItem[];
  itemCount: number;
  totalPrice: number;
}

export interface CheckoutPayload {
  shippingName: string;
  shippingEmail: string;
  shippingPhone: string;
  shippingAddressLine1: string;
  shippingAddressLine2?: string | null;
  shippingCity: string;
  shippingState: string;
  shippingPostalCode: string;
}

export interface OrderItem {
  id: number;
  orderId: number;
  plantId: number;
  plantName: string;
  imageUrl: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface Order {
  id: number;
  userId: number;
  totalPrice: number;
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  shippingName: string;
  shippingEmail: string;
  shippingPhone: string;
  shippingAddressLine1: string;
  shippingAddressLine2?: string | null;
  shippingCity: string;
  shippingState: string;
  shippingPostalCode: string;
  createdAt: string;
  updatedAt: string;
  userName?: string;
  userEmail?: string;
  items: OrderItem[];
}

export interface Wishlist {
  id: number;
  items: Plant[];
  itemCount: number;
}

export interface Analytics {
  totals: {
    revenue: number;
    orderCount: number;
    pendingOrders: number;
    userCount: number;
    plantCount: number;
  };
  topPlants: Array<{
    plantId: number;
    name: string;
    unitsSold: number;
    revenue: number;
  }>;
  recentOrders: Order[];
}
