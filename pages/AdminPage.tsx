import React, { useState, useEffect, useCallback, useRef } from 'react';
import { API_BASE_URL } from '../constants';
import Meta from '../components/seo/Meta';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../context/ProductContext';
import Button from '../components/ui/Button';

// FIXED: Proper jsPDF and autoTable import
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Extend jsPDF types to include autoTable and internal methods
declare module 'jspdf' {
  interface jsPDF {
    lastAutoTable?: {
      finalY: number;
    };
  }
  
  // FIXED: Extend internal to include getNumberOfPages
  interface jsPDFInternal {
    getNumberOfPages(): number;
    getCurrentPageInfo(): {
      pageNumber: number;
      pageContext: any;
    };
  }
}

interface Product {
  _id: string;
  id: string;
  name: string;
  description: string;
  price: number;
  price_ngn: number;
  category: string;
  images: string[];
  colors: string[];
  inStock: boolean;
  featured: boolean;
  tags: string[];
  stock: number;
  createdAt: string;
}

interface Order {
  _id: string;
  orderNumber: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    address: {
      street: string;
      city: string;
      state: string;
      country: string;
      postalCode: string;
    };
  };
  items: Array<{
    product?: string;
    productName: string;
    price: number;
    quantity: number;
    color: string;
    images: string[];
  }>;
  subtotal: number;
  shippingFee: number;
  total: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  shippingMethod: string;
  trackingNumber?: string;
  createdAt: string;
}

interface OrderStats {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  totalRevenue: number;
  salesHistory: number;
}

interface SalesData {
  month: string;
  revenue: number;
  orders: number;
}

interface MonthlyRevenue {
  _id: {
    year: number;
    month: number;
  };
  totalRevenue: number;
  orderCount: number;
}

interface OrderItem {
  productId?: string;
  productName: string;
  price: string;
  quantity: number;
  color: string;
}


const AdminPage: React.FC = () => {
  const { user, login, logout, isAuthenticated } = useAuth();
  const { products: contextProducts, fetchProducts, updateProductStock } = useProducts();
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderStats, setOrderStats] = useState<OrderStats | null>(null);
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showProductForm, setShowProductForm] = useState(false);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showRevenueExport, setShowRevenueExport] = useState(false);

  // Revenue export state
  const [exportDateRange, setExportDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });

  const isFetchingRef = useRef(false);

  // Login form state
  const [loginData, setLoginData] = useState({
    username: '',
    password: ''
  });

  // Product form state
  const [productData, setProductData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    colors: '',
    tags: '',
    stock: '',
    inStock: true,
    featured: false,
    images: [] as File[],
    imagePreviews: [] as string[],
    existingImages: [] as string[]
  });

  // Enhanced Manual order form state with product selection
  const [orderFormData, setOrderFormData] = useState({
    customer: {
      name: '',
      email: '',
      phone: '',
      address: {
        street: '',
        city: '',
        state: '',
        country: 'Nigeria',
        postalCode: ''
      }
    },
    items: [{
      productId: '',
      productName: '',
      price: '',
      quantity: 1,
      color: ''
    }] as OrderItem[],
    shippingFee: '',
    shippingMethod: 'standard',
    notes: ''
  });

  // Order status update state
  const [statusUpdate, setStatusUpdate] = useState({
    status: '',
    trackingNumber: ''
  });

  // API request helper with timeout
  const apiRequest = useCallback(async (url: string, options: RequestInit = {}) => {
    const token = localStorage.getItem('token');
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    try {
      const response = await fetch(`${API_BASE_URL}${url}`, {
        ...options,
        signal: controller.signal,
        headers: {
          'Authorization': `Bearer ${token}`,
          ...options.headers,
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error: any) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new Error('Request timed out. Please try again.');
      }
      throw error;
    }
  }, []);

  // Handle login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        login(data.admin);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Login failed');
      }
    } catch (err: any) {
      setError(err.message || 'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch products
  const fetchProductsData = useCallback(async () => {
    if (isFetchingRef.current) return;
    
    isFetchingRef.current = true;
    try {
      const data = await apiRequest('/products');
      if (Array.isArray(data)) {
        setProducts(data);
      } else if (data.products && Array.isArray(data.products)) {
        setProducts(data.products);
      } else {
        setProducts([]);
      }
    } catch (err: any) {
      console.error('Error fetching products:', err.message);
      setProducts([]);
    } finally {
      isFetchingRef.current = false;
    }
  }, [apiRequest]);

  // Fetch orders
  const fetchOrdersData = useCallback(async () => {
    if (isFetchingRef.current) return;
    
    isFetchingRef.current = true;
    try {
      const data = await apiRequest('/orders');
      if (Array.isArray(data)) {
        setOrders(data);
      } else if (data.orders && Array.isArray(data.orders)) {
        setOrders(data.orders);
      } else {
        setOrders([]);
      }
    } catch (err: any) {
      console.error('Error fetching orders:', err.message);
      setOrders([]);
    } finally {
      isFetchingRef.current = false;
    }
  }, [apiRequest]);

  // Fetch order statistics
  const fetchOrderStatsData = useCallback(async () => {
    try {
      const data = await apiRequest('/orders-stats');
      setOrderStats(data);
    } catch (err: any) {
      console.error('Error fetching order stats:', err.message);
    }
  }, [apiRequest]);

  // Fetch real monthly revenue data
  const fetchMonthlyRevenueData = useCallback(async () => {
    try {
      const data = await apiRequest('/orders/monthly-revenue');
      
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const last6Months = [];
      const today = new Date();
      
      for (let i = 5; i >= 0; i--) {
        const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
        last6Months.push({
          year: date.getFullYear(),
          month: date.getMonth() + 1
        });
      }
      
      const chartData: SalesData[] = last6Months.map(({ year, month }) => {
        const monthData = data.find((d: MonthlyRevenue) => 
          d._id.year === year && d._id.month === month
        );
        
        return {
          month: monthNames[month - 1],
          revenue: monthData ? monthData.totalRevenue : 0,
          orders: monthData ? monthData.orderCount : 0
        };
      });
      
      setSalesData(chartData);
    } catch (err: any) {
      console.error('Error fetching monthly revenue:', err.message);
    }
  }, [apiRequest]);

  // Load data when authenticated and tab changes
  useEffect(() => {
    if (!isAuthenticated) return;

    const loadData = async () => {
      if (activeTab === 'products' || activeTab === 'dashboard') {
        await fetchProductsData();
        fetchProducts();
      }
      if (activeTab === 'orders' || activeTab === 'dashboard' || activeTab === 'analytics') {
        await fetchOrdersData();
        await fetchOrderStatsData();
        await fetchMonthlyRevenueData();
      }
    };

    loadData();
  }, [isAuthenticated, activeTab, fetchProductsData, fetchOrdersData, fetchOrderStatsData, fetchMonthlyRevenueData, fetchProducts]);




  // Update products when context products change
  useEffect(() => {
    if (contextProducts && contextProducts.length > 0) {
      setProducts(contextProducts as any);
    }
  }, [contextProducts]);

  // Client-side validation
  const validateProductForm = () => {
    if (!productData.name.trim()) {
      setError('Product name is required');
      return false;
    }
    if (!productData.price || parseFloat(productData.price) <= 0) {
      setError('Valid price is required');
      return false;
    }
    if (!productData.stock || parseInt(productData.stock) < 0) {
      setError('Valid stock quantity is required');
      return false;
    }
    if (!productData.category.trim()) {
      setError('Category is required');
      return false;
    }
    if (!productData.description.trim()) {
      setError('Description is required');
      return false;
    }
    return true;
  };

  useEffect(() => {
  if (!isAuthenticated || (activeTab !== 'dashboard' && activeTab !== 'analytics')) {
    return;
  }

  console.log('ðŸ”„ Auto-refresh enabled for', activeTab);

  const refreshInterval = setInterval(async () => {
    try {
      await Promise.all([
        fetchOrdersData(),
        fetchOrderStatsData(),
        fetchMonthlyRevenueData()
      ]);
    } catch (error) {
      console.error('âŒ Error refreshing dashboard data:', error);
    }
  }, 30000); // 30 seconds

  return () => clearInterval(refreshInterval);
}, [isAuthenticated, activeTab, fetchOrdersData, fetchOrderStatsData, fetchMonthlyRevenueData]);


  // Handle product form submission
  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateProductForm()) {
      return;
    }

    setLoading(true);
    setError('');
    setUploadProgress(0);

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      
      formData.append('name', productData.name);
      formData.append('description', productData.description);
      formData.append('price', productData.price);
      formData.append('price_ngn', productData.price);
      formData.append('category', productData.category);
      formData.append('colors', productData.colors);
      formData.append('tags', productData.tags);
      formData.append('stock', productData.stock);
      formData.append('inStock', productData.inStock.toString());
      formData.append('featured', productData.featured.toString());
      
      if (editingProduct && productData.existingImages.length > 0) {
        formData.append('existingImages', JSON.stringify(productData.existingImages));
      }
      
      productData.images.forEach(image => {
        formData.append('images', image);
      });

      const url = editingProduct 
        ? `/products/${editingProduct._id || editingProduct.id}`
        : '/products';
      
      const method = editingProduct ? 'PUT' : 'POST';

      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      await apiRequest(url, {
        method,
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      await Promise.all([
        fetchProductsData(),
        fetchProducts()
      ]);

      setShowProductForm(false);
      setEditingProduct(null);
      resetProductForm();
      
      setTimeout(() => setUploadProgress(0), 1000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  // Handle product selection in manual order
  const handleProductSelect = (index: number, productId: string) => {
    const selectedProduct = products.find(p => (p._id || p.id) === productId);
    
    if (selectedProduct) {
      setOrderFormData(prev => ({
        ...prev,
        items: prev.items.map((item, i) => 
          i === index ? {
            ...item,
            productId: productId,
            productName: selectedProduct.name,
            price: (selectedProduct.price_ngn || selectedProduct.price).toString(),
            color: selectedProduct.colors?.[0] || ''
          } : item
        )
      }));
    } else {
      setOrderFormData(prev => ({
        ...prev,
        items: prev.items.map((item, i) => 
          i === index ? {
            ...item,
            productId: '',
            productName: '',
            price: '',
            color: ''
          } : item
        )
      }));
    }
  };

  // Enhanced manual order creation with stock deduction
  const handleManualOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      for (const item of orderFormData.items) {
        if (item.productId) {
          const product = products.find(p => (p._id || p.id) === item.productId);
          if (product && product.stock < item.quantity) {
            throw new Error(`Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}`);
          }
        }
      }

      const items = orderFormData.items.map(item => ({
        product: item.productId || undefined,
        productName: item.productName,
        price: parseFloat(item.price),
        quantity: item.quantity,
        color: item.color,
        images: []
      }));

      const orderData = {
        customer: orderFormData.customer,
        items,
        shippingFee: parseFloat(orderFormData.shippingFee) || 0,
        shippingMethod: orderFormData.shippingMethod,
        notes: orderFormData.notes
      };

      await apiRequest('/orders/manual', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      await Promise.all([
  fetchOrdersData(),
  fetchOrderStatsData(),
  fetchMonthlyRevenueData(),
  fetchProductsData(),
  fetchProducts()
]);

setShowOrderForm(false);
resetOrderForm();
alert('Order created successfully!');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetProductForm = () => {
    setProductData({
      name: '',
      description: '',
      price: '',
      category: '',
      colors: '',
      tags: '',
      stock: '',
      inStock: true,
      featured: false,
      images: [],
      imagePreviews: [],
      existingImages: []
    });
  };

  const resetOrderForm = () => {
    setOrderFormData({
      customer: {
        name: '',
        email: '',
        phone: '',
        address: {
          street: '',
          city: '',
          state: '',
          country: 'Nigeria',
          postalCode: ''
        }
      },
      items: [{
        productId: '',
        productName: '',
        price: '',
        quantity: 1,
        color: ''
      }],
      shippingFee: '',
      shippingMethod: 'standard',
      notes: ''
    });
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductData({
      name: product.name,
      description: product.description,
      price: product.price_ngn?.toString() || product.price.toString(),
      category: product.category,
      colors: (product.colors || []).join(', '),
      tags: (product.tags || []).join(', '),
      stock: product.stock?.toString() || '0',
      inStock: product.inStock || (product.stock > 0),
      featured: product.featured || false,
      images: [],
      imagePreviews: [],
      existingImages: product.images || []
    });
    setShowProductForm(true);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      await apiRequest(`/products/${productId}`, { method: 'DELETE' });
      await Promise.all([fetchProductsData(), fetchProducts()]);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleUpdateOrderStatus = async (orderId: string) => {
    if (!statusUpdate.status) {
      setError('Please select a status');
      return;
    }

    try {
      await apiRequest(`/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(statusUpdate),
      });

      await Promise.all([
  fetchOrdersData(),
  fetchOrderStatsData(),
  fetchMonthlyRevenueData()
]);
setSelectedOrder(null);
setStatusUpdate({ status: '', trackingNumber: '' });
alert('Order status updated successfully!');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const addOrderItem = () => {
    setOrderFormData(prev => ({
      ...prev,
      items: [...prev.items, { productId: '', productName: '', price: '', quantity: 1, color: '' }]
    }));
  };

  const removeOrderItem = (index: number) => {
    if (orderFormData.items.length > 1) {
      setOrderFormData(prev => ({
        ...prev,
        items: prev.items.filter((_, i) => i !== index)
      }));
    }
  };

  const updateOrderItem = (index: number, field: string, value: string | number) => {
    setOrderFormData(prev => ({
      ...prev,
      items: prev.items.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const fileArray: File[] = [];
    const previewUrls: string[] = [];

    for (let i = 0; i < Math.min(files.length, 8 - productData.existingImages.length - productData.images.length); i++) {
      const file = files[i];
      if (file && file.type.startsWith('image/')) {
        fileArray.push(file);
        previewUrls.push(URL.createObjectURL(file));
      }
    }

    setProductData(prev => ({
      ...prev,
      images: [...prev.images, ...fileArray],
      imagePreviews: [...prev.imagePreviews, ...previewUrls]
    }));
  };

  useEffect(() => {
    const previews = productData.imagePreviews;
    
    return () => {
      previews.forEach(url => {
        if (url && typeof url === 'string' && url.startsWith('blob:')) {
          try {
            URL.revokeObjectURL(url);
          } catch (error) {
            console.warn('Failed to revoke object URL:', error);
          }
        }
      });
    };
  }, [productData.imagePreviews]);

  const removeNewImage = (index: number) => {
    const urlToRevoke = productData.imagePreviews[index];
    
    if (urlToRevoke && typeof urlToRevoke === 'string' && urlToRevoke.startsWith('blob:')) {
      URL.revokeObjectURL(urlToRevoke);
    }
    
    setProductData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
      imagePreviews: prev.imagePreviews.filter((_, i) => i !== index)
    }));
  };

  const removeExistingImage = (index: number) => {
    setProductData(prev => ({
      ...prev,
      existingImages: prev.existingImages.filter((_, i) => i !== index)
    }));
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    target.src = '/images/placeholder-product.jpg';
    target.onerror = null;
  };

  // FIXED: Export Revenue PDF with proper TypeScript types
  const handleExportRevenuePDF = async () => {
    try {
      setLoading(true);
      
      const response = await apiRequest(
        `/orders/revenue-export?startDate=${exportDateRange.startDate}&endDate=${exportDateRange.endDate}`
      );

      const doc = new jsPDF();
      
      const logoImg = new Image();
      logoImg.src = '/header-logo.png';
      
      logoImg.onload = () => {
        try {
          doc.addImage(logoImg, 'PNG', 15, 10, 60, 15);
          
          doc.setFontSize(10);
          doc.setTextColor(0, 11, 74);
          doc.text('Rightyway Aso-Oke Fabrics LTD.', 80, 15);
          doc.text('Lagos, Nigeria', 80, 20);
          doc.text('+234 813 927 5024', 80, 25);
          doc.text('support@rightywayasooke.com', 80, 30);
          
          doc.setFontSize(18);
          doc.setTextColor(0, 11, 74);
          doc.text('Revenue Report', 15, 45);
          
          doc.setFontSize(12);
          doc.setTextColor(0, 0, 0);
          doc.text(`Period: ${new Date(exportDateRange.startDate).toLocaleDateString()} - ${new Date(exportDateRange.endDate).toLocaleDateString()}`, 15, 55);
          doc.text(`Generated: ${new Date().toLocaleString()}`, 15, 62);
          
          doc.setFontSize(14);
          doc.setTextColor(0, 11, 74);
          doc.text('Summary', 15, 75);
          
          doc.setFontSize(11);
          doc.setTextColor(0, 0, 0);
          doc.text(`Total Orders: ${response.summary.totalOrders}`, 15, 85);
          doc.text(`Total Revenue: ₦${response.summary.totalRevenue.toLocaleString()}`, 15, 92);
          doc.text(`Average Order Value: ₦${response.summary.averageOrderValue.toLocaleString()}`, 15, 99);
          
          const tableData = response.orders.map((order: any) => [
            order.orderNumber,
            new Date(order.createdAt).toLocaleDateString(),
            order.customer.name,
            order.status,
            `₦${order.total.toLocaleString()}`
          ]);
          
          // FIXED: Use autoTable function with doc parameter
          autoTable(doc, {
            startY: 110,
            head: [['Order #', 'Date', 'Customer', 'Status', 'Amount']],
            body: tableData,
            theme: 'grid',
            headStyles: { fillColor: [0, 11, 74] },
            styles: { fontSize: 9 }
          });
          
          // FIXED: Use getNumberOfPages() with type assertion
          const pageCount = (doc.internal as any).getNumberOfPages();
          for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setTextColor(128);
            doc.text(
              `Page ${i} of ${pageCount}`,
              doc.internal.pageSize.getWidth() / 2,
              doc.internal.pageSize.getHeight() - 10,
              { align: 'center' }
            );
          }
          
          doc.save(`Revenue_Report_${exportDateRange.startDate}_to_${exportDateRange.endDate}.pdf`);
          setShowRevenueExport(false);
        } catch (error) {
          console.error('Error generating PDF:', error);
          setError('Failed to generate PDF. Please try again.');
        }
      };
      
      logoImg.onerror = () => {
        generatePDFWithoutLogo(doc, response);
      };
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const generatePDFWithoutLogo = (doc: jsPDF, response: any) => {
    try {
      doc.setFontSize(18);
      doc.setTextColor(0, 11, 74);
      doc.text('Rightyway Aso-Oke Fabrics LTD.', 15, 20);
      doc.setFontSize(12);
      doc.text('Revenue Report', 15, 30);
      
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.text(`Period: ${new Date(exportDateRange.startDate).toLocaleDateString()} - ${new Date(exportDateRange.endDate).toLocaleDateString()}`, 15, 40);
      doc.text(`Generated: ${new Date().toLocaleString()}`, 15, 47);
      
      doc.setFontSize(12);
      doc.setTextColor(0, 11, 74);
      doc.text('Summary', 15, 60);
      
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.text(`Total Orders: ${response.summary.totalOrders}`, 15, 70);
      doc.text(`Total Revenue: ₦${response.summary.totalRevenue.toLocaleString()}`, 15, 77);
      doc.text(`Average Order Value: ₦${response.summary.averageOrderValue.toLocaleString()}`, 15, 84);
      
      const tableData = response.orders.map((order: any) => [
        order.orderNumber,
        new Date(order.createdAt).toLocaleDateString(),
        order.customer.name,
        order.status,
        `₦${order.total.toLocaleString()}`
      ]);
      
      // FIXED: Use autoTable function with doc parameter
      autoTable(doc, {
        startY: 95,
        head: [['Order #', 'Date', 'Customer', 'Status', 'Amount']],
        body: tableData,
        theme: 'grid',
        headStyles: { fillColor: [0, 11, 74] },
        styles: { fontSize: 8 }
      });
      
     // FIXED: Use getNumberOfPages() with type assertion
const pageCount = (doc.internal as any).getNumberOfPages();
for (let i = 1; i <= pageCount; i++) {
  doc.setPage(i);
  doc.setFontSize(8);
  doc.setTextColor(128);
  doc.text(
    `Page ${i} of ${pageCount}`,
    doc.internal.pageSize.getWidth() / 2,
    doc.internal.pageSize.getHeight() - 10,
    { align: 'center' }
  );
}
      
      doc.save(`Revenue_Report_${exportDateRange.startDate}_to_${exportDateRange.endDate}.pdf`);
      setShowRevenueExport(false);
    } catch (error) {
      console.error('Error generating PDF without logo:', error);
      setError('Failed to generate PDF. Please try again.');
    }
  };

  const groupOrdersByDate = (orders: Order[]) => {
    const grouped: { [key: string]: Order[] } = {};
    
    orders.forEach(order => {
      const date = new Date(order.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(order);
    });
    
    return grouped;
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      processing: 'bg-purple-100 text-purple-800',
      shipped: 'bg-indigo-100 text-indigo-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPaymentStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      pending: 'bg-yellow-100 text-yellow-800',
      paid: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      refunded: 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (!isAuthenticated) {
    return (
      <>
        <Meta title="Admin Login - Rightyway Aso-Oke" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
            <h1 className="text-3xl font-serif font-bold text-brand-maroon text-center mb-6">
              Admin Login
            </h1>
            
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  value={loginData.username}
                  onChange={(e) => setLoginData(prev => ({ ...prev, username: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-maroon"
                  required
                />
              </div>

              <div className="mb-6">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={loginData.password}
                  onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-maroon"
                  required
                />
              </div>

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? 'Logging in...' : 'Log In'}
              </Button>
            </form>
          </div>
        </div>
      </>
    );
  }

  const groupedOrders = groupOrdersByDate(orders);

  return (
    <>
      <Meta title="Admin Panel - Rightyway Aso-Oke" />
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div>
                <h1 className="text-2xl font-serif font-bold text-brand-maroon">
                  Admin Panel
                </h1>
                <p className="text-sm text-gray-600">Welcome, {user?.username}!</p>
              </div>
              <Button onClick={logout} variant="secondary">
                Log Out
              </Button>
            </div>
          </div>
        </header>

        {/* Navigation */}
        <nav className="bg-white shadow-sm">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex space-x-8">
              {['dashboard', 'products', 'orders', 'analytics'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                    activeTab === tab
                      ? 'border-brand-maroon text-brand-maroon'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
              <button 
                onClick={() => setError('')}
                className="float-right font-bold"
              >
                Ã—
              </button>
            </div>
          )}

          {activeTab === 'dashboard' && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Products</h3>
                  <p className="text-3xl font-bold text-brand-maroon">{products.length}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Orders</h3>
                  <p className="text-3xl font-bold text-brand-maroon">
                    {orderStats?.totalOrders || 0}
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Pending Orders</h3>
                  <p className="text-3xl font-bold text-brand-maroon">
                    {orderStats?.pendingOrders || 0}
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Revenue</h3>
                  <p className="text-3xl font-bold text-brand-maroon">
                    ₦{(orderStats?.totalRevenue || 0).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Recent Orders */}
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="px-6 py-4 border-b">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-900">Recent Orders</h2>
                    <Button onClick={() => setShowOrderForm(true)}>
                      Create Manual Order
                    </Button>
                  </div>
                </div>
                <div className="p-6">
                  {orders.slice(0, 5).map((order) => (
                    <div key={order._id} className="flex items-center justify-between py-3 border-b last:border-b-0">
                      <div>
                        <p className="font-medium text-gray-900">#{order.orderNumber}</p>
                        <p className="text-sm text-gray-600">{order.customer.name}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">₦{order.total.toLocaleString()}</p>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                  {orders.length === 0 && (
                    <p className="text-center text-gray-500 py-4">No orders yet</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'products' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Product Management</h2>
                <Button onClick={() => {
                  setEditingProduct(null);
                  resetProductForm();
                  setShowProductForm(true);
                }}>
                  Add New Product
                </Button>
              </div>

              {/* Product List */}
              <div className="bg-white shadow-sm rounded-lg overflow-hidden overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-2/5">
                        Product
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Stock
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {products.map((product) => (
                      <tr key={product._id || product.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            {product.images && product.images.length > 0 ? (
                              <img
                                src={product.images[0]}
                                alt={product.name}
                                className="h-12 w-12 rounded object-cover mr-3 flex-shrink-0"
                                onError={handleImageError}
                              />
                            ) : (
                              <div className="h-12 w-12 rounded bg-gray-200 mr-3 flex items-center justify-center flex-shrink-0">
                                <span className="text-gray-400 text-xs">No img</span>
                              </div>
                            )}
                            <div className="min-w-0 flex-1">
                              <div className="text-sm font-medium text-gray-900 truncate">
                                {product.name}
                              </div>
                              <div className="text-sm text-gray-500 truncate max-w-xs" title={product.description}>
                                {product.description.length > 60 
                                  ? `${product.description.substring(0, 60)}...` 
                                  : product.description}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {product.category}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ₦{(product.price_ngn || product.price).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {product.stock || 0}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            (product.stock || 0) > 0 
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {(product.stock || 0) > 0 ? 'In Stock' : 'Out of Stock'}
                          </span>
                          {product.featured && (
                            <span className="inline-flex ml-2 px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded-full">
                              Featured
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleEditProduct(product)}
                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product._id || product.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {Array.isArray(products) && products.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No products found. Create your first product!</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Order Management</h2>
                <Button onClick={() => setShowOrderForm(true)}>
                  Create Manual Order
                </Button>
              </div>

              {/* Orders List - Grouped by Date */}
              <div className="space-y-6">
                {Object.keys(groupedOrders).length === 0 ? (
                  <div className="bg-white shadow-sm rounded-lg p-8 text-center">
                    <p className="text-gray-500">No orders found</p>
                  </div>
                ) : (
                  Object.entries(groupedOrders).map(([date, dateOrders]) => (
                    <div key={date} className="bg-white shadow-sm rounded-lg overflow-hidden">
                      {/* Date Header */}
                      <div className="bg-brand-maroon text-white px-6 py-3">
                        <h3 className="text-lg font-semibold">{date}</h3>
                        <p className="text-sm opacity-90">{dateOrders.length} order(s)</p>
                      </div>
                      
                      {/* Orders Table */}
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Order Details
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Customer
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Amount
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Payment
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {dateOrders.map((order) => (
                              <tr key={order._id}>
                                <td className="px-6 py-4">
                                  <div>
                                    <div className="text-sm font-medium text-gray-900">
                                      #{order.orderNumber}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                      {new Date(order.createdAt).toLocaleTimeString()}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                      {order.items.length} item(s)
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  <div>
                                    <div className="text-sm font-medium text-gray-900">
                                      {order.customer.name}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                      {order.customer.email}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                      {order.customer.phone}
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  ₦{order.total.toLocaleString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                                    {order.status}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPaymentStatusColor(order.paymentStatus)}`}>
                                    {order.paymentStatus}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                  <button
                                    onClick={() => setSelectedOrder(order)}
                                    className="text-indigo-600 hover:text-indigo-900"
                                  >
                                    Update Status
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
                <Button onClick={() => setShowRevenueExport(true)}>
                  Export Revenue PDF
                </Button>
              </div>

              {/* Analytics Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Revenue</h3>
                  <p className="text-3xl font-bold text-brand-maroon">
                    ₦{(orderStats?.totalRevenue || 0).toLocaleString()}
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Completed Orders</h3>
                  <p className="text-3xl font-bold text-brand-maroon">
                    {orderStats?.completedOrders || 0}
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Sales History</h3>
                  <p className="text-3xl font-bold text-brand-maroon">
                    {orderStats?.salesHistory || 0}
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Conversion Rate</h3>
                  <p className="text-3xl font-bold text-brand-maroon">
                    {orders.length > 0 ? Math.round((orderStats?.completedOrders || 0) / orders.length * 100) : 0}%
                  </p>
                </div>
              </div>

              {/* Real-time Sales Chart */}
              <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Monthly Revenue (Last 6 Months)</h3>
                <div className="h-64 flex items-end space-x-2">
                  {salesData.map((data, index) => {
                    const maxRevenue = Math.max(...salesData.map(d => d.revenue));
                    const height = maxRevenue > 0 ? (data.revenue / maxRevenue) * 200 : 0;
                    
                    return (
                      <div key={index} className="flex-1 flex flex-col items-center group relative">
                        <div 
                          className="w-full bg-brand-maroon rounded-t transition-all duration-500 hover:bg-brand-gold cursor-pointer"
                          style={{ height: `${height}px`, minHeight: data.revenue > 0 ? '10px' : '0' }}
                          title={`₦${data.revenue.toLocaleString()}`}
                        >
                          {/* Tooltip */}
                          <div className="invisible group-hover:visible absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded whitespace-nowrap z-10">
                            <div className="font-semibold">{data.month}</div>
                            <div>Revenue: ₦{data.revenue.toLocaleString()}</div>
                            <div>Orders: {data.orders}</div>
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                          </div>
                        </div>
                        <div className="text-xs text-gray-600 mt-2 font-medium">{data.month}</div>
                        <div className="text-xs text-gray-500">
                          {data.revenue > 0 ? `₦${(data.revenue / 1000).toFixed(0)}K` : '₦0'}
                        </div>
                        <div className="text-xs text-gray-400">{data.orders} orders</div>
                      </div>
                    );
                  })}
                </div>
                {salesData.every(d => d.revenue === 0) && (
                  <p className="text-center text-gray-500 mt-4">No sales data available for the selected period</p>
                )}
              </div>

              {/* Top Products */}
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Top Products</h3>
                <div className="space-y-3">
                  {Array.isArray(products) && products.slice(0, 5).map((product, index) => (
                    <div key={product._id || product.id} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="text-lg font-bold text-brand-maroon mr-3">{index + 1}</span>
                        {product.images && product.images.length > 0 ? (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="h-10 w-10 rounded object-cover mr-3"
                            onError={handleImageError}
                          />
                        ) : (
                          <div className="h-10 w-10 rounded bg-gray-200 mr-3 flex items-center justify-center">
                            <span className="text-gray-400 text-xs">No img</span>
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-gray-900">{product.name}</p>
                          <p className="text-sm text-gray-500">{product.category}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">₦{(product.price_ngn || product.price).toLocaleString()}</p>
                        <p className="text-sm text-gray-500">Stock: {product.stock || 0}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Product Form Modal */}
          {showProductForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
              <div className="bg-white rounded-lg max-w-4xl w-full my-8">
                <div className="p-6 max-h-[85vh] overflow-y-auto">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    {editingProduct ? 'Edit Product' : 'Add New Product'}
                  </h2>

                  <form onSubmit={handleProductSubmit}>
                    {uploadProgress > 0 && (
                      <div className="mb-4">
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                          <span>Uploading...</span>
                          <span>{uploadProgress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-brand-maroon h-2 rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Product Name *
                        </label>
                        <input
                          type="text"
                          value={productData.name}
                          onChange={(e) => setProductData(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-maroon"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Price (₦) *
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={productData.price}
                          onChange={(e) => setProductData(prev => ({ ...prev, price: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-maroon"
                          required
                        />
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description *
                      </label>
                      <textarea
                        value={productData.description}
                        onChange={(e) => setProductData(prev => ({ ...prev, description: e.target.value }))}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-maroon"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Category *
                        </label>
                        <input
                          type="text"
                          value={productData.category}
                          onChange={(e) => setProductData(prev => ({ ...prev, category: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-maroon"
                          placeholder="e.g., Clothing, Accessories"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Stock Quantity *
                        </label>
                        <input
                          type="number"
                          value={productData.stock}
                          onChange={(e) => setProductData(prev => ({ ...prev, stock: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-maroon"
                          required
                          min="0"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Colors (comma separated)
                        </label>
                        <input
                          type="text"
                          value={productData.colors}
                          onChange={(e) => setProductData(prev => ({ ...prev, colors: e.target.value }))}
                          placeholder="e.g., Red, Blue, Green"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-maroon"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tags (comma separated)
                        </label>
                        <input
                          type="text"
                          value={productData.tags}
                          onChange={(e) => setProductData(prev => ({ ...prev, tags: e.target.value }))}
                          placeholder="e.g., new, popular, limited"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-maroon"
                        />
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Product Images
                      </label>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-maroon"
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        You can select multiple images (max {8 - productData.existingImages.length - productData.images.length} more)
                      </p>
                      
                      {(productData.existingImages.length > 0 || productData.imagePreviews.length > 0) && (
                        <div className="mt-4">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Images:</h4>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {productData.existingImages.map((image, index) => (
                              <div key={`existing-${index}`} className="relative group">
                                <img
                                  src={image}
                                  alt={`Existing ${index + 1}`}
                                  className="h-32 w-full object-cover rounded border"
                                  onError={handleImageError}
                                />
                                <span className="absolute top-1 left-1 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                                  Existing
                                </span>
                                <button
                                  type="button"
                                  onClick={() => removeExistingImage(index)}
                                  className="absolute top-1 right-1 bg-red-600 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center hover:bg-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                                  title="Remove image"
                                >
                                  Ã—
                                </button>
                              </div>
                            ))}
                            
                            {productData.imagePreviews.map((preview, index) => (
                              <div key={`new-${index}`} className="relative group">
                                <img
                                  src={preview}
                                  alt={`New ${index + 1}`}
                                  className="h-32 w-full object-cover rounded border border-green-300"
                                />
                                <span className="absolute top-1 left-1 bg-green-600 text-white text-xs px-2 py-1 rounded">
                                  New
                                </span>
                                <button
                                  type="button"
                                  onClick={() => removeNewImage(index)}
                                  className="absolute top-1 right-1 bg-red-600 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center hover:bg-red-700"
                                  title="Remove new image"
                                >
                                  Ã—
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-4 mb-6">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={productData.inStock}
                          onChange={(e) => setProductData(prev => ({ ...prev, inStock: e.target.checked }))}
                          className="rounded border-gray-300 text-brand-maroon focus:ring-brand-maroon"
                        />
                        <span className="ml-2 text-sm text-gray-700">In Stock</span>
                      </label>

                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={productData.featured}
                          onChange={(e) => setProductData(prev => ({ ...prev, featured: e.target.checked }))}
                          className="rounded border-gray-300 text-brand-maroon focus:ring-brand-maroon"
                        />
                        <span className="ml-2 text-sm text-gray-700">Featured Product</span>
                      </label>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4 border-t">
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => {
                          setShowProductForm(false);
                          setEditingProduct(null);
                          resetProductForm();
                        }}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" disabled={loading}>
                        {loading ? 'Saving...' : editingProduct ? 'Update Product' : 'Add Product'}
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* Manual Order Form Modal */}
          {showOrderForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
              <div className="bg-white rounded-lg max-w-4xl w-full my-8">
                <div className="p-6 max-h-[85vh] overflow-y-auto">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Create Manual Order
                  </h2>

                  <form onSubmit={handleManualOrder}>
                    {/* Customer Details */}
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Details</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Customer Name *
                          </label>
                          <input
                            type="text"
                            value={orderFormData.customer.name}
                            onChange={(e) => setOrderFormData(prev => ({
                              ...prev,
                              customer: { ...prev.customer, name: e.target.value }
                            }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-maroon"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email *
                          </label>
                          <input
                            type="email"
                            value={orderFormData.customer.email}
                            onChange={(e) => setOrderFormData(prev => ({
                              ...prev,
                              customer: { ...prev.customer, email: e.target.value }
                            }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-maroon"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Phone
                          </label>
                          <input
                            type="tel"
                            value={orderFormData.customer.phone}
                            onChange={(e) => setOrderFormData(prev => ({
                              ...prev,
                              customer: { ...prev.customer, phone: e.target.value }
                            }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-maroon"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Street Address *
                          </label>
                          <input
                            type="text"
                            value={orderFormData.customer.address.street}
                            onChange={(e) => setOrderFormData(prev => ({
                              ...prev,
                              customer: { 
                                ...prev.customer, 
                                address: { ...prev.customer.address, street: e.target.value }
                              }
                            }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-maroon"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            City *
                          </label>
                          <input
                            type="text"
                            value={orderFormData.customer.address.city}
                            onChange={(e) => setOrderFormData(prev => ({
                              ...prev,
                              customer: { 
                                ...prev.customer, 
                                address: { ...prev.customer.address, city: e.target.value }
                              }
                            }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-maroon"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            State *
                          </label>
                          <input
                            type="text"
                            value={orderFormData.customer.address.state}
                            onChange={(e) => setOrderFormData(prev => ({
                              ...prev,
                              customer: { 
                                ...prev.customer, 
                                address: { ...prev.customer.address, state: e.target.value }
                              }
                            }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-maroon"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Postal Code *
                          </label>
                          <input
                            type="text"
                            value={orderFormData.customer.address.postalCode}
                            onChange={(e) => setOrderFormData(prev => ({
                              ...prev,
                              customer: { 
                                ...prev.customer, 
                                address: { ...prev.customer.address, postalCode: e.target.value }
                              }
                            }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-maroon"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* Order Items with Product Selection */}
                    <div className="mb-6">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Order Items</h3>
                        <Button type="button" onClick={addOrderItem} variant="secondary">
                          Add Item
                        </Button>
                      </div>
                      {orderFormData.items.map((item, index) => (
                        <div key={index} className="p-4 border rounded-lg mb-4 bg-gray-50">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            {/* Product Selector */}
                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Select Product (or skip for manual entry)
                              </label>
                              <select
                                value={item.productId || ''}
                                onChange={(e) => handleProductSelect(index, e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-maroon"
                              >
                                <option value="">-- Manual Entry (Custom Product) --</option>
                                {products.filter(p => p.stock > 0).map((product) => (
                                  <option key={product._id || product.id} value={product._id || product.id}>
                                    {product.name} - ₦{(product.price_ngn || product.price).toLocaleString()} (Stock: {product.stock})
                                  </option>
                                ))}
                              </select>
                            </div>
                            
                            {/* Product Name */}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Product Name *
                              </label>
                              <input
                                type="text"
                                value={item.productName}
                                onChange={(e) => updateOrderItem(index, 'productName', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-maroon"
                                required
                                readOnly={!!item.productId}
                              />
                            </div>
                            
                            {/* Price */}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Price (₦) *
                              </label>
                              <input
                                type="number"
                                step="0.01"
                                value={item.price}
                                onChange={(e) => updateOrderItem(index, 'price', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-maroon"
                                required
                                readOnly={!!item.productId}
                              />
                            </div>
                            
                            {/* Quantity */}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Quantity *
                              </label>
                              <input
                                type="number"
                                value={item.quantity}
                                onChange={(e) => updateOrderItem(index, 'quantity', parseInt(e.target.value))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-maroon"
                                required
                                min="1"
                                max={item.productId ? products.find(p => (p._id || p.id) === item.productId)?.stock : undefined}
                              />
                              {item.productId && (
                                <p className="text-xs text-gray-500 mt-1">
                                  Available: {products.find(p => (p._id || p.id) === item.productId)?.stock || 0}
                                </p>
                              )}
                            </div>
                            
                            {/* Color */}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Color
                              </label>
                              {item.productId ? (
                                <select
                                  value={item.color}
                                  onChange={(e) => updateOrderItem(index, 'color', e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-maroon"
                                >
                                  <option value="">Select Color</option>
                                  {products.find(p => (p._id || p.id) === item.productId)?.colors?.map((color, i) => (
                                    <option key={i} value={color}>{color}</option>
                                  ))}
                                </select>
                              ) : (
                                <input
                                  type="text"
                                  value={item.color}
                                  onChange={(e) => updateOrderItem(index, 'color', e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-maroon"
                                  placeholder="Enter color"
                                />
                              )}
                            </div>
                          </div>
                          
                          <div className="flex justify-end">
                            <Button
                              type="button"
                              onClick={() => removeOrderItem(index)}
                              variant="secondary"
                              disabled={orderFormData.items.length === 1}
                            >
                              Remove Item
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Shipping and Notes */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Shipping Fee (₦)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={orderFormData.shippingFee}
                          onChange={(e) => setOrderFormData(prev => ({ ...prev, shippingFee: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-maroon"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Shipping Method
                        </label>
                        <select
                          value={orderFormData.shippingMethod}
                          onChange={(e) => setOrderFormData(prev => ({ ...prev, shippingMethod: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-maroon"
                        >
                          <option value="standard">Standard</option>
                          <option value="express">Express</option>
                          <option value="overnight">Overnight</option>
                        </select>
                      </div>
                    </div>

                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Order Notes
                      </label>
                      <textarea
                        value={orderFormData.notes}
                        onChange={(e) => setOrderFormData(prev => ({ ...prev, notes: e.target.value }))}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-maroon"
                        placeholder="Any special instructions or notes..."
                      />
                    </div>

                    <div className="flex justify-end space-x-3 pt-4 border-t">
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => {
                          setShowOrderForm(false);
                          resetOrderForm();
                        }}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" disabled={loading}>
                        {loading ? 'Creating...' : 'Create Order'}
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* Revenue Export Modal */}
          {showRevenueExport && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg max-w-md w-full">
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Export Revenue Report
                  </h2>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={exportDateRange.startDate}
                      onChange={(e) => setExportDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-maroon"
                    />
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={exportDateRange.endDate}
                      onChange={(e) => setExportDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                      max={new Date().toISOString().split('T')[0]}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-maroon"
                    />
                  </div>

                  <div className="flex justify-end space-x-3">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => setShowRevenueExport(false)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleExportRevenuePDF}
                      disabled={loading}
                    >
                      {loading ? 'Generating...' : 'Export PDF'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Order Status Update Modal */}
          {selectedOrder && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg max-w-md w-full">
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Update Order Status
                  </h2>
                  
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">Order: #{selectedOrder.orderNumber}</p>
                    <p className="text-sm text-gray-600">Customer: {selectedOrder.customer.name}</p>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status *
                    </label>
                    <select
                      value={statusUpdate.status}
                      onChange={(e) => setStatusUpdate(prev => ({ ...prev, status: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-maroon"
                    >
                      <option value="">Select Status</option>
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tracking Number (optional)
                    </label>
                    <input
                      type="text"
                      value={statusUpdate.trackingNumber}
                      onChange={(e) => setStatusUpdate(prev => ({ ...prev, trackingNumber: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-maroon"
                      placeholder="Enter tracking number"
                    />
                  </div>

                  <div className="flex justify-end space-x-3">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => {
                        setSelectedOrder(null);
                        setStatusUpdate({ status: '', trackingNumber: '' });
                      }}
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={() => handleUpdateOrderStatus(selectedOrder._id)}
                      disabled={!statusUpdate.status}
                    >
                      Update Status
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default AdminPage;
