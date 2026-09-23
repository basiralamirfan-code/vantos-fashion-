import { useEffect, useState } from 'react'
import { adminApi } from './adminStore'
import { siteConfig } from './siteConfig'
import { isSupabaseConfigured, supabase } from './supabaseClient'
import WhatsAppButton from './WhatsAppButton'

const formatPrice = (value) => `₹${Number(value).toLocaleString('en-IN')}`
const statuses = ['Pending', 'Ready', 'Shipped', 'Delivered']
const statusStyles = {
  Pending: 'border-stone-700 bg-stone-900 text-stone-300',
  Ready: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
  Shipped: 'border-amber-500/30 bg-amber-500/10 text-amber-200',
  Delivered: 'border-sky-500/30 bg-sky-500/10 text-sky-200',
}
const emptyProduct = { name: '', category: '', price: '', sizes: 'S, M, L, XL', stock: '', image_url: '' }

function getStatusCounts(orders) {
  return orders.reduce((summary, order) => {
    const currentStatus = order.order_status || 'Pending'
    summary[currentStatus] = (summary[currentStatus] || 0) + 1
    return summary
  }, {
    Pending: 0,
    Ready: 0,
    Shipped: 0,
    Delivered: 0,
  })
}

function getDailySales(orders) {
  const last7Days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date()
    date.setDate(date.getDate() - (6 - index))
    const key = date.toISOString().slice(0, 10)
    return { key, label: date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }), total: 0 }
  })

  orders.forEach((order) => {
    if (!order.timestamp) return
    const date = new Date(order.timestamp)
    const key = date.toISOString().slice(0, 10)
    const block = last7Days.find((day) => day.key === key)
    if (block) {
      block.total += Number(order.total || 0)
    }
  })

  return last7Days
}

function getTopProducts(orders) {
  const totals = {}

  orders.forEach((order) => {
    if (!Array.isArray(order.items)) return
    order.items.forEach((item) => {
      if (!item?.name) return
      totals[item.name] = (totals[item.name] || 0) + (Number(item.price || 0) * Number(item.quantity || 0))
    })
  })

  return Object.entries(totals)
    .map(([name, revenue]) => ({ name, revenue }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 4)
}

function AdminIcon({ name }) {
  const paths = {
    grid: 'M4 4h6v6H4V4Zm10 0h6v6h-6V4ZM4 14h6v6H4v-6Zm10 0h6v6h-6v-6Z',
    box: 'm4 7 8-4 8 4-8 4-8-4Zm0 0v10l8 4 8-4V7m-8 4v10',
    orders: 'M5 5h14v14H5V5Zm3 4h8M8 13h5',
    plus: 'M12 5v14M5 12h14',
  }
  return <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.7"><path strokeLinecap="round" strokeLinejoin="round" d={paths[name]} /></svg>
}

function AdminDashboard({ onBackHome }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => !isSupabaseConfigured && sessionStorage.getItem('vantos-admin-session') === 'active')
  const [isCheckingAuth, setIsCheckingAuth] = useState(isSupabaseConfigured)
  const [passcode, setPasscode] = useState('')
  const [showPasscode, setShowPasscode] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [authError, setAuthError] = useState('')
  const [activeView, setActiveView] = useState('overview')
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [productModal, setProductModal] = useState(null)
  const [productForm, setProductForm] = useState(emptyProduct)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [toast, setToast] = useState('')

  useEffect(() => {
    if (!isSupabaseConfigured) return undefined

    let mounted = true
    supabase.auth.getSession().then(({ data }) => {
      const email = data.session?.user?.email?.toLowerCase()
      if (mounted) {
        setIsAuthenticated(email === siteConfig.adminEmail.toLowerCase())
        setIsCheckingAuth(false)
      }
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      const email = session?.user?.email?.toLowerCase()
      setIsAuthenticated(email === siteConfig.adminEmail.toLowerCase())
      setIsCheckingAuth(false)
    })

    return () => {
      mounted = false
      listener.subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (!isAuthenticated) return
    Promise.all([adminApi.listProducts(), adminApi.listOrders()]).then(([loadedProducts, loadedOrders]) => {
      setProducts(loadedProducts)
      setOrders(loadedOrders)
    })
  }, [isAuthenticated])

  useEffect(() => {
    if (!toast) return undefined
    const timer = setTimeout(() => setToast(''), 2600)
    return () => clearTimeout(timer)
  }, [toast])

  const showToast = (message) => setToast(message)

  const authenticate = (event) => {
    event.preventDefault()
    if (passcode !== siteConfig.adminPasscode) {
      setAuthError('Incorrect admin passcode.')
      return
    }
    sessionStorage.setItem('vantos-admin-session', 'active')
    setIsAuthenticated(true)
    setAuthError('')
  }

  const sendVerificationLink = async (event) => {
    event.preventDefault()
    setAuthError('')
    const { error } = await supabase.auth.signInWithOtp({
      email: siteConfig.adminEmail,
      options: { emailRedirectTo: `${window.location.origin}${import.meta.env.BASE_URL}?admin=1` },
    })
    if (error) {
      setAuthError(error.message)
      return
    }
    setEmailSent(true)
  }

  const openProductModal = (product = null) => {
    setProductModal(product ? 'edit' : 'add')
    setProductForm(product ? { ...product, sizes: product.sizes.join(', ') } : emptyProduct)
  }

  const handleProductSubmit = async (event) => {
    event.preventDefault()
    const product = {
      name: productForm.name.trim(),
      category: productForm.category.trim(),
      price: Number(productForm.price),
      sizes: productForm.sizes.split(',').map((size) => size.trim()).filter(Boolean),
      stock: Number(productForm.stock),
      image_url: productForm.image_url.trim(),
    }
    const savedProduct = productModal === 'edit'
      ? await adminApi.updateProduct(productForm.id, product)
      : await adminApi.createProduct(product)
    setProducts((currentProducts) => productModal === 'edit' ? currentProducts.map((item) => item.id === savedProduct.id ? savedProduct : item) : [...currentProducts, savedProduct])
    setProductModal(null)
    showToast(productModal === 'edit' ? 'Product updated successfully' : 'Product added successfully')
  }

  const deleteProduct = async (id) => {
    await adminApi.deleteProduct(id)
    setProducts((currentProducts) => currentProducts.filter((product) => product.id !== id))
    showToast('Product deleted successfully')
  }

  const updateStatus = async (orderId, status) => {
    const updatedOrder = await adminApi.updateOrderStatus(orderId, status)
    setOrders((currentOrders) => currentOrders.map((order) => order.id === updatedOrder.id ? updatedOrder : order))
    setSelectedOrder((currentOrder) => currentOrder?.id === updatedOrder.id ? updatedOrder : currentOrder)
    showToast('Order status updated')
  }

  const updatePaymentStatus = async (orderId, paymentStatus) => {
    const updatedOrder = await adminApi.updatePaymentStatus(orderId, paymentStatus)
    setOrders((currentOrders) => currentOrders.map((order) => order.id === updatedOrder.id ? updatedOrder : order))
    setSelectedOrder((currentOrder) => currentOrder?.id === updatedOrder.id ? updatedOrder : currentOrder)
    showToast(paymentStatus === 'Paid' ? 'Payment approved' : 'Payment rejected')
  }

  if (isCheckingAuth) {
    return <div className="flex min-h-screen items-center justify-center bg-[#0B0B0E] px-4 text-sm text-stone-400">Checking admin access...</div>
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0B0B0E] px-4 text-stone-100">
        <form onSubmit={authenticate} className="w-full max-w-sm rounded-[2rem] border border-stone-800 bg-stone-900/70 p-8 shadow-2xl">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-stone-100 text-sm font-black text-stone-950">V</div>
          <p className="mt-8 text-xs font-semibold uppercase tracking-[0.28em] text-amber-200">VANTOS / Admin</p>
          <h1 className="mt-3 text-3xl font-bold text-white">Private workspace</h1>
          <p className="mt-3 text-sm leading-6 text-stone-400">{isSupabaseConfigured ? 'Verify your admin Gmail to continue.' : 'Enter your admin passcode to manage products and orders.'}</p>
          {isSupabaseConfigured ? <>
            {emailSent ? <p className="mt-7 rounded-xl border border-emerald-400/30 bg-emerald-400/10 p-4 text-sm text-emerald-200">Verification link sent to {siteConfig.adminEmail}. Check your inbox.</p> : <form onSubmit={sendVerificationLink} className="mt-7"><button type="submit" className="w-full rounded-full bg-amber-300 px-5 py-3 text-sm font-bold text-stone-950 transition hover:bg-amber-200">Send Gmail verification</button></form>}
          </> : <>
          <label className="mt-7 block text-xs font-semibold uppercase tracking-[0.16em] text-stone-400" htmlFor="admin-passcode">Admin passcode</label>
          <div className="relative mt-2"><input id="admin-passcode" type={showPasscode ? 'text' : 'password'} value={passcode} onChange={(event) => setPasscode(event.target.value)} className="w-full rounded-xl border border-stone-700 bg-stone-950 px-4 py-3 pr-20 text-white outline-none focus:border-amber-300" /><button type="button" onClick={() => setShowPasscode((visible) => !visible)} className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-stone-400 transition hover:text-amber-200" aria-label={showPasscode ? 'Hide admin passcode' : 'Show admin passcode'}>{showPasscode ? 'Hide' : 'Show'}</button></div>
          {authError && <p role="alert" className="mt-3 text-sm text-red-300">{authError}</p>}
          <button type="submit" className="mt-6 w-full rounded-full bg-amber-300 px-5 py-3 text-sm font-bold text-stone-950 transition hover:bg-amber-200">Enter dashboard</button>
          </>}
          {authError && isSupabaseConfigured && <p role="alert" className="mt-3 text-sm text-red-300">{authError}</p>}
          <button type="button" onClick={onBackHome} className="mt-4 w-full text-sm text-stone-500 transition hover:text-white">Back to storefront</button>
          <WhatsAppButton />
        </form>
      </div>
    )
  }

  const revenue = orders.reduce((total, order) => total + Number(order.total || 0), 0)
  const lowStock = products.filter((product) => product.stock < 10).length
  const statusCounts = getStatusCounts(orders)
  const recentSales = getDailySales(orders)
  const topProducts = getTopProducts(orders)
  const maxRevenue = Math.max(...recentSales.map((day) => day.total), 1)

  return (
    <div className="min-h-screen bg-[#0B0B0E] text-stone-100">
      <header className="border-b border-stone-800 bg-[#0B0B0E]">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between px-4 py-4 sm:px-6">
          <button type="button" onClick={onBackHome} className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-stone-100 text-sm font-black text-stone-950">V</span><span className="text-sm font-semibold tracking-[0.28em] text-stone-200">VANTOS <span className="text-stone-500">/ ADMIN</span></span></button>
          <button type="button" onClick={async () => { sessionStorage.removeItem('vantos-admin-session'); if (isSupabaseConfigured) await supabase.auth.signOut(); setIsAuthenticated(false) }} className="rounded-full border border-stone-700 px-4 py-2 text-xs text-stone-300 transition hover:border-amber-300 hover:text-amber-200">Sign out</button>
        </div>
      </header>
      <div className="mx-auto flex max-w-[1500px] flex-col md:flex-row">
        <aside className="border-b border-stone-800 p-4 md:min-h-[calc(100vh-74px)] md:w-64 md:border-b-0 md:border-r md:p-6">
          <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.25em] text-stone-600">Workspace</p>
          <nav className="flex gap-2 overflow-x-auto md:block">
            {[['overview', 'Overview', 'grid'], ['products', 'Products Management', 'box'], ['orders', 'Customer Orders', 'orders']].map(([view, label, icon]) => <button type="button" key={view} onClick={() => setActiveView(view)} className={`flex min-w-fit items-center gap-3 rounded-xl px-3 py-3 text-sm transition md:mb-2 md:w-full ${activeView === view ? 'bg-amber-300 text-stone-950' : 'text-stone-400 hover:bg-stone-900 hover:text-white'}`}><AdminIcon name={icon} />{label}</button>)}
          </nav>
        </aside>
        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-10">
          {activeView === 'overview' && <>
            <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-[0.28em] text-amber-200">Overview</p><h1 className="mt-3 text-3xl font-bold text-white">Good to see you.</h1></div><p className="text-sm text-stone-500">Live local store data</p></div>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-2xl border border-stone-800 bg-stone-900/60 p-5"><p className="text-xs uppercase tracking-[0.18em] text-stone-500">Total revenue</p><p className="mt-4 text-3xl font-bold text-amber-300">{formatPrice(revenue)}</p></div>
              <div className="rounded-2xl border border-stone-800 bg-stone-900/60 p-5"><p className="text-xs uppercase tracking-[0.18em] text-stone-500">Total orders</p><p className="mt-4 text-3xl font-bold text-white">{orders.length}</p></div>
              <div className="rounded-2xl border border-stone-800 bg-stone-900/60 p-5"><p className="text-xs uppercase tracking-[0.18em] text-stone-500">Ready for dispatch</p><p className="mt-4 text-3xl font-bold text-emerald-300">{statusCounts.Ready}</p></div>
              <div className="rounded-2xl border border-stone-800 bg-stone-900/60 p-5"><p className="text-xs uppercase tracking-[0.18em] text-stone-500">Active products</p><p className="mt-4 text-3xl font-bold text-white">{products.length}</p><p className="mt-2 text-xs text-stone-500">{lowStock} low stock</p></div>
            </div>

            <div className="mt-8 grid gap-6 xl:grid-cols-[1.5fr_0.9fr]">
              <div className="rounded-2xl border border-stone-800 bg-stone-900/60 p-5">
                <div className="flex items-center justify-between gap-4">
                  <h2 className="font-semibold text-white">Last 7 days</h2>
                  <span className="text-xs uppercase tracking-[0.18em] text-stone-500">Sales</span>
                </div>
                <div className="mt-6 flex h-40 items-end gap-3">
                  {recentSales.map((day) => (
                    <div key={day.key} className="flex flex-1 flex-col items-center gap-2">
                      <span className="text-[10px] text-stone-500">{formatPrice(day.total)}</span>
                      <div className="flex w-full items-end justify-center rounded-t-xl bg-gradient-to-t from-amber-300 via-amber-200 to-amber-100/80 transition-all" style={{ height: `${Math.max((day.total / maxRevenue) * 100, 10)}%` }} />
                      <span className="text-[10px] text-stone-500">{day.label.split(' ')[0]}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-stone-800 bg-stone-900/60 p-5">
                <h2 className="font-semibold text-white">Fulfillment status</h2>
                <div className="mt-5 space-y-3">
                  {Object.entries(statusCounts).map(([status, count]) => (
                    <div key={status} className="flex items-center justify-between gap-3 rounded-xl border border-stone-800 bg-stone-950/40 px-3 py-2">
                      <span className="text-sm text-stone-300">{status}</span>
                      <span className={`rounded-full border px-2 py-1 text-xs ${statusStyles[status] || statusStyles.Pending}`}>{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 rounded-2xl border border-stone-800 bg-stone-900/60 p-5"><div className="flex items-center justify-between"><h2 className="font-semibold text-white">Recent orders</h2><button type="button" onClick={() => setActiveView('orders')} className="text-xs text-amber-200">View all</button></div>{orders.length === 0 ? <p className="mt-8 text-sm text-stone-500">Orders placed through checkout will appear here.</p> : <div className="mt-5 space-y-3">{orders.slice(0, 4).map((order) => <div key={order.id} className="flex flex-wrap items-center justify-between gap-3 border-t border-stone-800 pt-3 text-sm"><span className="font-semibold text-white">{order.id}</span><span className="text-stone-400">{order.name}</span><span className="text-amber-300">{formatPrice(order.total)}</span><span className={`rounded-full border px-2 py-1 text-xs ${statusStyles[order.order_status] || statusStyles.Pending}`}>{order.order_status}</span></div>)}</div>}</div>

            <div className="mt-8 rounded-2xl border border-stone-800 bg-stone-900/60 p-5">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-white">Top selling items</h2>
                <span className="text-xs uppercase tracking-[0.18em] text-stone-500">by revenue</span>
              </div>
              <div className="mt-5 space-y-3">
                {topProducts.length === 0 ? <p className="text-sm text-stone-500">No sales data yet.</p> : topProducts.map((product, index) => (
                  <div key={product.name} className="flex items-center justify-between gap-3 border-t border-stone-800 pt-3 text-sm first:border-t-0 first:pt-0">
                    <div>
                      <p className="font-semibold text-white">#{index + 1} {product.name}</p>
                    </div>
                    <span className="text-amber-300">{formatPrice(product.revenue)}</span>
                  </div>
                ))}
              </div>
            </div>
          </>}

          {activeView === 'products' && <section><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-[0.28em] text-amber-200">Catalog</p><h1 className="mt-3 text-3xl font-bold text-white">Products management</h1></div><button type="button" onClick={() => openProductModal()} className="inline-flex items-center gap-2 rounded-full bg-amber-300 px-4 py-2.5 text-sm font-semibold text-stone-950 transition hover:bg-amber-200"><AdminIcon name="plus" /> Add New Product</button></div><div className="mt-8 overflow-x-auto rounded-2xl border border-stone-800"><table className="w-full min-w-[720px] text-left text-sm"><thead className="bg-stone-900 text-xs uppercase tracking-[0.14em] text-stone-500"><tr><th className="px-5 py-4">Product</th><th className="px-5 py-4">Category</th><th className="px-5 py-4">Price</th><th className="px-5 py-4">Stock</th><th className="px-5 py-4">Actions</th></tr></thead><tbody className="divide-y divide-stone-800">{products.map((product) => <tr key={product.id} className="bg-stone-950/40"><td className="px-5 py-4"><div className="flex items-center gap-3"><img loading="lazy" src={product.image_url} alt={`${product.name} thumbnail`} className="h-12 w-10 rounded-lg object-cover" /><span className="font-semibold text-white">{product.name}</span></div></td><td className="px-5 py-4 text-stone-400">{product.category}</td><td className="px-5 py-4 text-amber-300">{formatPrice(product.price)}</td><td className={`px-5 py-4 ${product.stock < 10 ? 'text-amber-200' : 'text-stone-300'}`}>{product.stock}</td><td className="px-5 py-4"><div className="flex gap-3"><button type="button" onClick={() => openProductModal(product)} className="text-xs text-stone-300 hover:text-amber-200">Edit</button><button type="button" onClick={() => deleteProduct(product.id)} className="text-xs text-red-300 hover:text-red-200">Delete</button></div></td></tr>)}</tbody></table></div></section>}

              {activeView === 'orders' && <section><div><p className="text-xs font-semibold uppercase tracking-[0.28em] text-amber-200">Fulfillment</p><h1 className="mt-3 text-3xl font-bold text-white">Customer orders</h1></div><div className="mt-8 overflow-x-auto rounded-2xl border border-stone-800"><table className="w-full min-w-[800px] text-left text-sm"><thead className="bg-stone-900 text-xs uppercase tracking-[0.14em] text-stone-500"><tr><th className="px-5 py-4">Order</th><th className="px-5 py-4">Customer</th><th className="px-5 py-4">Total</th><th className="px-5 py-4">Payment</th><th className="px-5 py-4">Status</th><th className="px-5 py-4">Details</th></tr></thead><tbody className="divide-y divide-stone-800">{orders.length === 0 ? <tr><td colSpan="6" className="px-5 py-12 text-center text-stone-500">No orders yet.</td></tr> : orders.map((order) => <tr key={order.id} className="bg-stone-950/40"><td className="px-5 py-4 font-semibold text-white">{order.id}</td><td className="px-5 py-4 text-stone-300">{order.name}<span className="block text-xs text-stone-600">{order.email}</span></td><td className="px-5 py-4 text-amber-300">{formatPrice(order.total)}</td><td className="px-5 py-4 text-stone-400"><span>{order.payment_status}</span>{order.payment_status === 'Payment under verification' && <div className="mt-2 flex gap-2"><button type="button" onClick={() => updatePaymentStatus(order.id, 'Paid')} className="rounded-lg border border-emerald-400/40 px-2 py-1 text-xs text-emerald-300 hover:bg-emerald-400/10">Approve</button><button type="button" onClick={() => updatePaymentStatus(order.id, 'Rejected')} className="rounded-lg border border-red-400/40 px-2 py-1 text-xs text-red-300 hover:bg-red-400/10">Reject</button></div>}</td><td className="px-5 py-4"><select value={order.order_status} onChange={(event) => updateStatus(order.id, event.target.value)} className="rounded-lg border border-stone-700 bg-stone-900 px-2 py-2 text-xs text-white outline-none focus:border-amber-300">{statuses.map((status) => <option key={status}>{status}</option>)}</select></td><td className="px-5 py-4"><button type="button" onClick={() => setSelectedOrder(order)} className="text-xs text-amber-200 hover:text-white">View details</button></td></tr>)}</tbody></table></div></section>}
        </main>
      </div>

      {productModal && <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/80 p-4 backdrop-blur-sm" onClick={() => setProductModal(null)}><form onSubmit={handleProductSubmit} onClick={(event) => event.stopPropagation()} className="w-full max-w-lg rounded-2xl border border-stone-700 bg-[#0B0B0E] p-6 shadow-2xl"><div className="flex items-center justify-between"><h2 className="text-xl font-bold text-white">{productModal === 'edit' ? 'Edit product' : 'Add new product'}</h2><button type="button" onClick={() => setProductModal(null)} className="text-stone-500 hover:text-white">×</button></div><div className="mt-6 grid gap-4 sm:grid-cols-2">{[['name', 'Title'], ['category', 'Category'], ['price', 'Price (INR)'], ['stock', 'Stock count'], ['sizes', 'Sizes (comma separated)'], ['image_url', 'Image link']].map(([name, label]) => <label key={name} className={name === 'image_url' || name === 'sizes' ? 'sm:col-span-2' : ''}><span className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-stone-500">{label}</span><input required={name !== 'image_url'} type={name === 'price' || name === 'stock' ? 'number' : 'text'} value={productForm[name]} onChange={(event) => setProductForm({ ...productForm, [name]: event.target.value })} className="w-full rounded-xl border border-stone-700 bg-stone-950 px-3 py-2.5 text-sm text-white outline-none focus:border-amber-300" /></label>)}</div><div className="mt-6 flex justify-end gap-3"><button type="button" onClick={() => setProductModal(null)} className="rounded-full border border-stone-700 px-4 py-2.5 text-sm text-stone-300">Cancel</button><button type="submit" className="rounded-full bg-amber-300 px-5 py-2.5 text-sm font-semibold text-stone-950">Save product</button></div></form></div>}

      {selectedOrder && <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/80 p-4" onClick={() => setSelectedOrder(null)}><div role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()} className="w-full max-w-lg rounded-2xl border border-stone-700 bg-[#0B0B0E] p-6"><div className="flex items-center justify-between"><h2 className="text-xl font-bold text-white">{selectedOrder.id}</h2><button type="button" onClick={() => setSelectedOrder(null)} className="text-stone-500 hover:text-white">×</button></div><p className="mt-5 text-sm text-stone-300">{selectedOrder.name} · {selectedOrder.phone}</p><p className="mt-2 text-sm leading-6 text-stone-400">{selectedOrder.address}</p><div className="mt-5 grid gap-2 border-t border-stone-800 pt-5 text-sm"><p className="text-stone-400">Payment: <span className="text-stone-200">{selectedOrder.payment_method === 'upi' ? 'UPI' : selectedOrder.payment_method || 'Unknown'}</span></p><p className="text-stone-400">UTR: <span className="font-semibold text-amber-200">{selectedOrder.utr || 'Not provided'}</span></p>{selectedOrder.payment_screenshot && <div><p className="mb-2 text-stone-400">Payment screenshot:</p><img src={selectedOrder.payment_screenshot} alt="Customer payment screenshot" className="max-h-64 w-full rounded-xl border border-stone-700 object-contain" /></div>}</div><div className="mt-5 border-t border-stone-800 pt-5">{(selectedOrder.items || []).map((item) => <div key={item.key} className="flex justify-between py-2 text-sm"><span className="text-stone-300">{item.name} · {item.size} × {item.quantity}</span><span className="text-amber-300">{formatPrice(item.price * item.quantity)}</span></div>)}</div></div></div>}
      {toast && <div role="status" className="fixed bottom-5 right-5 z-[70] rounded-xl border border-emerald-300/30 bg-stone-900 px-4 py-3 text-sm text-emerald-200 shadow-xl">{toast}</div>}
      <WhatsAppButton />
    </div>
  )
}

export default AdminDashboard
