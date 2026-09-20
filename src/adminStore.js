const productStorageKey = 'vantos-admin-products'
const orderStorageKey = 'vantos-orders'

export const seedAdminProducts = [
  {
    id: 1,
    name: 'The Atelier Blazer',
    category: 'Tailoring',
    price: 12800,
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 18,
    image_url: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 2,
    name: 'Silk Drift Dress',
    category: 'Dresses',
    price: 9900,
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 12,
    image_url: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 3,
    name: 'Monarch Coat',
    category: 'Outerwear',
    price: 16400,
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 7,
    image_url: 'https://images.unsplash.com/photo-1548624313-0396c75ce8b1?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 4,
    name: 'Noir Essentials',
    category: 'Essentials',
    price: 7200,
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 24,
    image_url: 'https://images.unsplash.com/photo-1506629905607-d9c297d37b05?auto=format&fit=crop&w=900&q=80',
  },
]

function readStorage(key, fallback) {
  try {
    const storedValue = localStorage.getItem(key)
    return storedValue ? JSON.parse(storedValue) : fallback
  } catch {
    return fallback
  }
}

function writeStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
  return value
}

export function getProducts() {
  const products = readStorage(productStorageKey, null)
  if (products) return products
  return writeStorage(productStorageKey, seedAdminProducts)
}

export function saveProducts(products) {
  return writeStorage(productStorageKey, products)
}

export function getOrders() {
  return readStorage(orderStorageKey, [])
}

export function saveOrders(orders) {
  return writeStorage(orderStorageKey, orders)
}

export const adminApi = {
  listProducts: async () => getProducts(),
  createProduct: async (product) => {
    const products = getProducts()
    const createdProduct = { ...product, id: Date.now() }
    saveProducts([...products, createdProduct])
    return createdProduct
  },
  updateProduct: async (id, changes) => {
    const products = getProducts().map((product) => product.id === id ? { ...product, ...changes } : product)
    saveProducts(products)
    return products.find((product) => product.id === id)
  },
  deleteProduct: async (id) => saveProducts(getProducts().filter((product) => product.id !== id)),
  listOrders: async () => getOrders(),
  updateOrderStatus: async (id, status) => {
    const orders = getOrders().map((order) => order.id === id ? { ...order, order_status: status } : order)
    saveOrders(orders)
    return orders.find((order) => order.id === id)
  },
}
