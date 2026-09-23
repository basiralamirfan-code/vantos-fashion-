import { useEffect, useState } from 'react'
import AdminDashboard from './AdminDashboard'
import { saveOrders } from './adminStore'
import { siteConfig } from './siteConfig'
import WhatsAppButton from './WhatsAppButton'

const navItems = [
  { label: 'New In', href: '#featured' },
  { label: 'Categories', href: '#styles' },
  { label: 'Collections', href: '#featured' },
  { label: 'Journal', href: '#instagram' },
  { label: 'Contact', href: '#contact' },
]

const collectionFilters = ['All', 'Tailoring', 'Dresses', 'Outerwear', 'Essentials']

// Replace any item here to update product name, image, or price.
const productCatalog = [
  {
    id: 1,
    name: 'The Atelier Blazer',
    category: 'Tailoring',
    price: 12800,
    fabric: '300 GSM premium wool-blend suiting',
    sizes: ['S', 'M', 'L', 'XL'],
    image:
      'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=900&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=1200&q=85',
    ],
  },
  {
    id: 2,
    name: 'Silk Drift Dress',
    category: 'Dresses',
    price: 9900,
    fabric: 'Lightweight silk satin with a soft finish',
    sizes: ['S', 'M', 'L', 'XL'],
    image:
      'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=900&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=85',
    ],
  },
  {
    id: 3,
    name: 'Monarch Coat',
    category: 'Outerwear',
    price: 16400,
    fabric: 'Double-faced brushed cotton and wool blend',
    sizes: ['S', 'M', 'L', 'XL'],
    image:
      'https://images.unsplash.com/photo-1548624313-0396c75ce8b1?auto=format&fit=crop&w=900&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1548624313-0396c75ce8b1?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?auto=format&fit=crop&w=1200&q=85',
    ],
  },
  {
    id: 4,
    name: 'Noir Essentials',
    category: 'Essentials',
    price: 7200,
    fabric: '240 GSM organic cotton jersey',
    sizes: ['S', 'M', 'L', 'XL'],
    image:
      'https://images.unsplash.com/photo-1506629905607-d9c297d37b05?auto=format&fit=crop&w=900&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1506629905607-d9c297d37b05?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1543076447-215ad9ba6923?auto=format&fit=crop&w=1200&q=85',
    ],
  },
]

const formatPrice = (value) => `₹${value.toLocaleString('en-IN')}`
const upiPaymentId = 's9015528332@slc'

const buildUpiLink = (amount, orderId) => {
  const safeAmount = Number(amount || 0).toFixed(2)
  const txnNote = encodeURIComponent(`VANTOS Order ${orderId || 'Checkout'}`)
  return `upi://pay?pa=${encodeURIComponent(upiPaymentId)}&pn=${encodeURIComponent('VANTOS FASHION')}&am=${safeAmount}&cu=INR&tn=${txnNote}`
}

const editorialShots = [
  {
    title: 'Quiet Luxury',
    subtitle: 'Soft tailoring in motion',
    image:
      'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'After Dark',
    subtitle: 'Monochrome essentials',
    image:
      'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'City Layers',
    subtitle: 'Built for every hour',
    image:
      'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=900&q=80',
  },
]

const styleCategories = [
  {
    title: 'Luxury',
    image:
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Streetwear',
    image:
      'https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Old Money',
    image:
      'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Casual',
    image:
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Trending',
    image:
      'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80',
  },
]

const instagramTiles = [
  {
    alt: 'Editorial fashion styling',
    image:
      'https://images.unsplash.com/photo-1531988042231-d39a9cc12a9a?auto=format&fit=crop&w=700&q=80',
  },
  {
    alt: 'Neutral layered outfit',
    image:
      'https://images.unsplash.com/photo-1496217590455-aa63a8350eea?auto=format&fit=crop&w=700&q=80',
  },
  {
    alt: 'Modern street style',
    image:
      'https://images.unsplash.com/photo-1543076447-215ad9ba6923?auto=format&fit=crop&w=700&q=80',
  },
  {
    alt: 'Minimal wardrobe detail',
    image:
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=700&q=80',
  },
]

function SectionLabel({ children }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-400">{children}</p>
  )
}

function BagIcon({ className = 'h-4 w-4' }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.7">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 8h12l1 12H5L6 8Zm3 0a3 3 0 0 1 6 0" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.7">
      <path strokeLinecap="round" strokeLinejoin="round" d="m6 6 12 12M18 6 6 18" />
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.7">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 7h14M10 11v5m4-5v5M9 7l1-2h4l1 2m-9 0 1 13h10l1-13" />
    </svg>
  )
}

function LockIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.7">
      <rect width="12" height="10" x="6" y="10" rx="2" />
      <path strokeLinecap="round" d="M9 10V7a3 3 0 0 1 6 0v3" />
    </svg>
  )
}

function CheckoutSummary({ cartItems, subtotal, automaticDiscount, promoDiscount, shippingFee, grandTotal, promoCode, setPromoCode, applyPromo }) {
  const [isSummaryOpen, setIsSummaryOpen] = useState(false)

  return (
    <section className="order-1 rounded-2xl border border-stone-800 bg-stone-900/60 lg:order-2 lg:sticky lg:top-6 lg:h-fit">
      <button type="button" onClick={() => setIsSummaryOpen((open) => !open)} className="flex w-full items-center justify-between p-5 text-left lg:cursor-default" aria-expanded={isSummaryOpen}>
        <span className="text-sm font-semibold uppercase tracking-[0.16em] text-stone-200">Order Summary</span>
        <span className="text-xs text-amber-200 lg:hidden">{isSummaryOpen ? 'Hide' : 'Show'}</span>
      </button>
      <div className={`${isSummaryOpen ? 'block' : 'hidden'} border-t border-stone-800 p-5 lg:block`}>
        <div className="space-y-4">
          {cartItems.map((item) => (
            <div key={item.key} className="flex gap-3">
              <img loading="lazy" src={item.image} alt={item.name} className="h-20 w-16 rounded-lg object-cover" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-white">{item.name}</p>
                <p className="mt-1 text-xs text-stone-500">Size {item.size} · Qty {item.quantity}</p>
                <p className="mt-2 text-sm text-amber-300">{formatPrice(item.price * item.quantity)}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 border-t border-stone-800 pt-5">
          <label htmlFor="promo-code" className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-400">Promo code</label>
          <div className="mt-2 flex gap-2">
            <input id="promo-code" value={promoCode} onChange={(event) => setPromoCode(event.target.value)} placeholder="Enter code" className="min-w-0 flex-1 rounded-full border border-stone-700 bg-stone-950 px-4 py-2.5 text-sm text-white outline-none placeholder:text-stone-600 focus:border-amber-300" />
            <button type="button" onClick={applyPromo} className="rounded-full border border-stone-600 px-4 py-2.5 text-xs font-semibold text-stone-200 transition hover:border-amber-300 hover:text-amber-200">Apply</button>
          </div>
          {promoDiscount > 0 && <p className="mt-2 text-xs text-emerald-300">VANTOS10 applied: {formatPrice(promoDiscount)} saved.</p>}
        </div>
        <div className="mt-6 space-y-3 border-t border-stone-800 pt-5 text-sm">
          <div className="flex justify-between text-stone-400"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
          {automaticDiscount > 0 && <div className="flex justify-between text-emerald-300"><span>₹6,000 offer (10%)</span><span>-{formatPrice(automaticDiscount)}</span></div>}
          {promoDiscount > 0 && <div className="flex justify-between text-emerald-300"><span>Promo discount</span><span>-{formatPrice(promoDiscount)}</span></div>}
          <div className="flex justify-between text-stone-400"><span>Shipping</span><span>{shippingFee === 0 ? 'FREE' : formatPrice(shippingFee)}</span></div>
          <div className="flex justify-between border-t border-stone-800 pt-4 text-base font-semibold text-white"><span>Grand Total</span><span className="text-amber-300">{formatPrice(grandTotal)}</span></div>
        </div>
      </div>
    </section>
  )
}

function CheckoutPage({ cartItems, onBack, onOrderComplete }) {
  const [paymentMethod, setPaymentMethod] = useState('upi')
  const [promoCode, setPromoCode] = useState('')
  const [promoDiscount, setPromoDiscount] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const [formError, setFormError] = useState('')
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false)
  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  const automaticDiscount = subtotal >= 6000 ? Math.round(subtotal * 0.1) : 0
  const shippingFee = subtotal >= 2000 ? 0 : 149
  const grandTotal = subtotal - automaticDiscount - promoDiscount + shippingFee
  const upiLink = buildUpiLink(grandTotal)

  const applyPromo = () => {
    setPromoDiscount(promoCode.trim().toUpperCase() === 'VANTOS10' ? Math.round(subtotal * 0.1) : 0)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setFormError('')
    const form = new FormData(event.currentTarget)
    const phone = String(form.get('phone')).replace(/\D/g, '')
    const pincode = String(form.get('pincode')).trim()
    const utr = String(form.get('utr') || '').trim()
    const orderPayload = {
      name: form.get('fullName'),
      email: form.get('email'),
      phone,
      address: `${form.get('street')}${form.get('apartment') ? `, ${form.get('apartment')}` : ''}${form.get('landmark') ? `, ${form.get('landmark')}` : ''}, ${form.get('city')}, ${form.get('state')} - ${pincode}`,
      total: grandTotal,
      payment_method: paymentMethod,
      utr,
    }

    if (!/^[6-9]\d{9}$/.test(phone)) {
      setFormError('Enter a valid 10-digit Indian mobile number beginning with 6, 7, 8, or 9.')
      return
    }
    if (!/^\d{6}$/.test(pincode)) {
      setFormError('Enter a valid 6-digit pincode.')
      return
    }
    if (paymentMethod === 'upi' && !isPaymentDialogOpen) {
      setIsPaymentDialogOpen(true)
      return
    }
    if (paymentMethod === 'upi' && !/^[A-Za-z0-9-]{6,30}$/.test(utr)) {
      setFormError('Enter the UTR or transaction ID from your UPI payment.')
      return
    }

    setIsProcessing(true)
    await new Promise((resolve) => setTimeout(resolve, 700))
    onOrderComplete(orderPayload)
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#0B0B0E] px-4 py-8 text-stone-100">
        <div className="mx-auto max-w-2xl text-center"><p className="text-sm font-semibold tracking-[0.3em] text-stone-100">VANTOS</p><h1 className="mt-16 text-3xl font-bold text-white">Your bag is empty</h1><p className="mt-3 text-stone-400">Add something to your bag before checking out.</p><button type="button" onClick={onBack} className="mt-8 rounded-full bg-amber-300 px-6 py-3 text-sm font-semibold text-stone-950">Back to shopping</button></div>
        <WhatsAppButton />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0B0B0E] text-stone-100">
      <header className="border-b border-stone-800 bg-[#0B0B0E]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
          <button type="button" onClick={onBack} className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-stone-100 text-sm font-black text-stone-950">V</span><span className="text-sm font-semibold tracking-[0.28em] text-stone-200">VANTOS</span></button>
          <span className="inline-flex items-center gap-2 rounded-full border border-stone-700 px-3 py-2 text-xs text-stone-400"><LockIcon /> Secure checkout</span>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-12">
        <div className="mb-8 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.16em] text-stone-500"><span className="text-amber-300">01 Shipping &amp; contact</span><span className="h-px w-8 bg-stone-700" /><span>02 Payment</span></div>
        <div className="grid gap-8 lg:grid-cols-[1fr_22rem]">
          <form onSubmit={handleSubmit} className="order-2 space-y-8 lg:order-1">
            <section>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-stone-400">Step 1</p><h1 className="mt-3 text-3xl font-bold text-white">Shipping &amp; contact information</h1>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <label className="sm:col-span-2"><span className="field-label">Full name</span><input name="fullName" required autoComplete="name" className="field-input" /></label>
                <label><span className="field-label">Email address</span><input name="email" type="email" required autoComplete="email" className="field-input" /></label>
                <label><span className="field-label">Phone number</span><input name="phone" type="tel" required inputMode="numeric" placeholder="10-digit mobile number" className="field-input" /></label>
                <label className="sm:col-span-2"><span className="field-label">Street address</span><input name="street" required autoComplete="street-address" className="field-input" /></label>
                <label><span className="field-label">Apartment / Suite <span className="text-stone-600">(optional)</span></span><input name="apartment" className="field-input" /></label>
                <label><span className="field-label">Landmark <span className="text-stone-600">(optional)</span></span><input name="landmark" className="field-input" /></label>
                <label><span className="field-label">City</span><input name="city" required autoComplete="address-level2" className="field-input" /></label>
                <label><span className="field-label">State</span><input name="state" required autoComplete="address-level1" className="field-input" /></label>
                <label><span className="field-label">Pincode</span><input name="pincode" required inputMode="numeric" maxLength="6" className="field-input" /></label>
              </div>
              <label className="mt-5 flex items-center gap-3 text-sm text-stone-400"><input type="checkbox" name="saveAddress" className="h-4 w-4 accent-amber-300" /> Save address for future orders</label>
            </section>
            <section className="border-t border-stone-800 pt-8">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-stone-400">Step 2</p><h2 className="mt-3 text-2xl font-bold text-white">Payment method</h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">{[['upi', 'UPI / QR Code', 'GPay · PhonePe · Paytm'], ['card', 'Cards & Netbanking', 'Sandbox ready']].map(([value, title, detail]) => <button type="button" key={value} onClick={() => setPaymentMethod(value)} className={`rounded-xl border p-4 text-left transition ${paymentMethod === value ? 'border-amber-300 bg-amber-300/10' : 'border-stone-800 bg-stone-900/50 hover:border-stone-600'}`}><span className="block text-sm font-semibold text-white">{title}</span><span className="mt-1 block text-xs text-stone-500">{detail}</span></button>)}</div>
              <div className="mt-4 rounded-xl border border-stone-800 bg-stone-900/40 p-4 text-sm text-stone-400">
                {paymentMethod === 'upi' && (
                  <div className="flex flex-col items-center gap-4 sm:flex-row">
                    <a href={upiLink} aria-label="Open UPI payment link" className="shrink-0 rounded-lg bg-white p-2">
                      <img src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(upiLink)}`} alt="UPI payment QR code" className="h-44 w-44" />
                    </a>
                    <div>
                      <p>Scan to pay with GPay, PhonePe, or Paytm.</p>
                      <p className="mt-2">UPI ID: <span className="font-semibold text-amber-200">{upiPaymentId}</span></p>
                      <p className="mt-1">Amount: <span className="font-semibold text-white">₹{Number(grandTotal).toLocaleString('en-IN')}</span></p>
                    </div>
                  </div>
                )}
                {paymentMethod === 'upi' && !isPaymentDialogOpen && <label className="mt-5 block"><span className="field-label">UTR / transaction ID</span><input name="utr" placeholder="Enter UTR after payment" autoComplete="off" className="field-input" /></label>}
                {paymentMethod === 'card' && 'Sandbox flow: Razorpay or Cashfree can be connected here with a server-generated order.'}
              </div>
            </section>
            {formError && <p role="alert" className="rounded-xl border border-red-400/30 bg-red-400/10 p-4 text-sm text-red-200">{formError}</p>}
            <button disabled={isProcessing} type="submit" className="w-full rounded-full bg-amber-300 px-6 py-4 text-sm font-bold tracking-[0.16em] text-stone-950 transition hover:bg-amber-200 disabled:cursor-wait disabled:opacity-60">{isProcessing ? 'PROCESSING SANDBOX PAYMENT...' : paymentMethod === 'upi' && !isPaymentDialogOpen ? 'OPEN QR & PAY' : 'PAY & PLACE ORDER'}</button>
            {isPaymentDialogOpen && paymentMethod === 'upi' && <div role="dialog" aria-modal="true" aria-labelledby="payment-dialog-title" className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/80 p-4 backdrop-blur-sm"><div className="w-full max-w-md rounded-2xl border border-stone-700 bg-[#0B0B0E] p-6 shadow-2xl"><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-200">Payment verification</p><h2 id="payment-dialog-title" className="mt-2 text-2xl font-bold text-white">Scan to pay ₹{Number(grandTotal).toLocaleString('en-IN')}</h2></div><button type="button" onClick={() => setIsPaymentDialogOpen(false)} className="text-2xl text-stone-500 hover:text-white" aria-label="Close payment dialog">×</button></div><div className="mt-6 flex justify-center rounded-xl bg-white p-3"><img src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(upiLink)}`} alt="UPI payment QR code" className="h-56 w-56" /></div><p className="mt-4 text-center text-sm text-stone-400">Pay using GPay, PhonePe, or Paytm, then enter your UTR below.</p><label className="mt-4 block"><span className="field-label">UTR / transaction ID</span><input name="utr" required placeholder="Enter UTR after payment" autoComplete="off" className="field-input" /></label><button disabled={isProcessing} type="submit" className="mt-6 w-full rounded-full bg-amber-300 px-6 py-4 text-sm font-bold tracking-[0.12em] text-stone-950 disabled:opacity-60">{isProcessing ? 'PROCESSING...' : 'I HAVE PAID, PLACE ORDER'}</button></div></div>}
          </form>
          <CheckoutSummary cartItems={cartItems} subtotal={subtotal} automaticDiscount={automaticDiscount} promoDiscount={promoDiscount} shippingFee={shippingFee} grandTotal={grandTotal} promoCode={promoCode} setPromoCode={setPromoCode} applyPromo={applyPromo} />
        </div>
      </main>
      <WhatsAppButton />
    </div>
  )
}

function OrderConfirmation({ order, onBackHome, onOrderUpdate }) {
  const [resubmission, setResubmission] = useState({ utr: '', screenshot: '' })
  const [resubmissionError, setResubmissionError] = useState('')
  const [isResubmitting, setIsResubmitting] = useState(false)

  const handleResubmission = (event) => {
    event.preventDefault()
    setResubmissionError('')
    if (!/^[A-Za-z0-9-]{6,30}$/.test(resubmission.utr.trim())) {
      setResubmissionError('Enter a valid UTR or transaction ID.')
      return
    }
    if (!resubmission.screenshot) {
      setResubmissionError('Upload your payment screenshot.')
      return
    }
    setIsResubmitting(true)
    const updatedOrder = { ...order, utr: resubmission.utr.trim(), payment_screenshot: resubmission.screenshot, payment_status: 'Payment under verification' }
    const orders = JSON.parse(localStorage.getItem('vantos-orders') || '[]').map((savedOrder) => savedOrder.id === order.id ? updatedOrder : savedOrder)
    saveOrders(orders)
    onOrderUpdate(updatedOrder)
    setIsResubmitting(false)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0B0B0E] px-4 py-10 text-stone-100">
      <div className="w-full max-w-xl rounded-[2rem] border border-stone-800 bg-stone-900/60 p-7 text-center sm:p-12">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-300 text-2xl text-stone-950">✓</div>
        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.3em] text-amber-200">Thank you for choosing VANTOS</p>
        <h1 className="mt-3 text-3xl font-bold text-white">Your order was submitted.</h1>
        <p className="mt-3 text-stone-400">Order ID <span className="font-semibold text-white">{order.id}</span></p>
        <p className="mt-3 text-sm text-stone-400">{order.payment_status === 'Paid' ? 'Payment approved.' : order.payment_status === 'Rejected' ? 'Payment was rejected. Please submit a new UTR and payment screenshot.' : 'Payment is under verification. We will review your UTR shortly.'}</p>
        {order.payment_status === 'Rejected' && <form onSubmit={handleResubmission} className="mt-6 rounded-2xl border border-red-400/30 bg-red-400/10 p-5 text-left"><h2 className="text-sm font-semibold text-red-200">Resubmit payment details</h2><label className="mt-4 block"><span className="field-label">New UTR / transaction ID</span><input value={resubmission.utr} onChange={(event) => setResubmission({ ...resubmission, utr: event.target.value })} className="field-input" placeholder="Enter UTR" /></label><label className="mt-4 block"><span className="field-label">Payment screenshot</span><input type="file" accept="image/*" onChange={(event) => { const file = event.target.files?.[0]; if (!file) return; const reader = new FileReader(); reader.onload = () => setResubmission({ ...resubmission, screenshot: String(reader.result) }); reader.readAsDataURL(file) }} className="mt-2 block w-full text-sm text-stone-300 file:mr-3 file:rounded-full file:border-0 file:bg-amber-300 file:px-4 file:py-2 file:font-semibold file:text-stone-950" /></label>{resubmissionError && <p role="alert" className="mt-3 text-sm text-red-200">{resubmissionError}</p>}<button type="submit" disabled={isResubmitting} className="mt-5 w-full rounded-full bg-amber-300 px-5 py-3 text-sm font-bold text-stone-950 disabled:opacity-60">{isResubmitting ? 'SUBMITTING...' : 'RESUBMIT FOR REVIEW'}</button></form>}
        <div className="mt-8 space-y-3 rounded-2xl border border-stone-800 bg-stone-950/60 p-5 text-left text-sm"><p className="text-stone-400">Delivering to <span className="block mt-1 text-white">{order.name}</span><span className="block text-stone-300">{order.address}</span></p><p className="border-t border-stone-800 pt-3 text-stone-400">Estimated arrival <span className="float-right text-white">5-7 business days</span></p><p className="border-t border-stone-800 pt-3 text-stone-400">Order total <span className="float-right font-semibold text-amber-300">{formatPrice(order.total)}</span></p></div>
        <button type="button" onClick={onBackHome} className="mt-8 rounded-full bg-amber-300 px-6 py-3 text-sm font-semibold text-stone-950 transition hover:bg-amber-200">Back to Home</button>
      </div>
      <WhatsAppButton />
    </div>
  )
}

function App() {
  const hasAdminAccess = () => {
    const [hashPath, queryString = ''] = window.location.hash.slice(1).split('?')
    const accessKey = new URLSearchParams(queryString).get('key')
    if (accessKey === siteConfig.adminAccessKey) {
      localStorage.setItem('vantos-admin-device', 'trusted')
      return true
    }
    return localStorage.getItem('vantos-admin-device') === 'trusted' && hashPath === 'admin'
  }
  const isAdminRoute = () => hasAdminAccess()
  const [page, setPage] = useState(() => isAdminRoute() ? 'admin' : window.location.hash === '#checkout' ? 'checkout' : 'home')
  const [order, setOrder] = useState(null)
  const [cartItems, setCartItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('vantos-cart')) || []
    } catch {
      return []
    }
  })
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState('All')
  const [quickViewProduct, setQuickViewProduct] = useState(null)
  const [quickViewSize, setQuickViewSize] = useState('M')
  const [quickViewQuantity, setQuickViewQuantity] = useState(1)
  const [quickViewImage, setQuickViewImage] = useState('')
  const [selectedProductSizes, setSelectedProductSizes] = useState({})

  useEffect(() => {
    localStorage.setItem('vantos-cart', JSON.stringify(cartItems))
  }, [cartItems])

  useEffect(() => {
    const handleHashChange = () => setPage(isAdminRoute() ? 'admin' : window.location.hash === '#checkout' ? 'checkout' : 'home')
    window.addEventListener('hashchange', handleHashChange)
    window.addEventListener('popstate', handleHashChange)
    return () => {
      window.removeEventListener('hashchange', handleHashChange)
      window.removeEventListener('popstate', handleHashChange)
    }
  }, [])

  useEffect(() => {
    if (page !== 'confirmation' || !order?.id) return undefined
    const syncOrder = () => {
      const savedOrder = JSON.parse(localStorage.getItem('vantos-orders') || '[]').find((item) => item.id === order.id)
      if (savedOrder) setOrder(savedOrder)
    }
    window.addEventListener('storage', syncOrder)
    return () => window.removeEventListener('storage', syncOrder)
  }, [page, order?.id])

  const navigateTo = (nextPage) => {
    const route = nextPage === 'checkout' ? '#checkout' : nextPage === 'admin' ? `${import.meta.env.BASE_URL}#admin?key=${encodeURIComponent(siteConfig.adminAccessKey)}` : '#'
    window.history.pushState({}, '', route)
    setPage(nextPage)
  }

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0)
  const cartSubtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  const shippingThreshold = 2000
  const shippingRemaining = Math.max(shippingThreshold - cartSubtotal, 0)
  const visibleProducts = activeCategory === 'All' ? productCatalog : productCatalog.filter((product) => product.category === activeCategory)

  const addToCart = (product, size = 'M', quantity = 1) => {
    setCartItems((currentItems) => {
      const itemKey = `${product.id}-${size}`
      const existingItem = currentItems.find((item) => item.key === itemKey)

      if (existingItem) {
        return currentItems.map((item) => item.key === itemKey ? { ...item, quantity: item.quantity + quantity } : item)
      }

      return [...currentItems, {
        key: itemKey,
        id: product.id,
        name: product.name,
        image: product.image,
        price: product.price,
        size,
        quantity,
      }]
    })
    setIsCartOpen(true)
  }

  const updateQuantity = (key, change) => {
    setCartItems((currentItems) => currentItems.flatMap((item) => {
      if (item.key !== key) return [item]
      const nextQuantity = item.quantity + change
      return nextQuantity > 0 ? [{ ...item, quantity: nextQuantity }] : []
    }))
  }

  const openQuickView = (product) => {
    setQuickViewProduct(product)
    setQuickViewSize('M')
    setQuickViewQuantity(1)
    setQuickViewImage(product.gallery[0])
  }

  const handleOrderComplete = (orderDetails) => {
    const completedOrder = { ...orderDetails, id: `#VANTOS-${Math.floor(1000 + Math.random() * 9000)}`, payment_status: orderDetails.payment_method === 'upi' ? 'Payment under verification' : 'Sandbox paid' }
    saveOrders([{
      ...completedOrder,
      items: cartItems,
      payment_status: completedOrder.payment_status,
      order_status: 'Pending',
      timestamp: new Date().toISOString(),
    }, ...JSON.parse(localStorage.getItem('vantos-orders') || '[]')])
    setCartItems([])
    setOrder(completedOrder)
    navigateTo('confirmation')
  }

  if (page === 'checkout') {
    return <CheckoutPage cartItems={cartItems} onBack={() => navigateTo('home')} onOrderComplete={handleOrderComplete} />
  }

  if (page === 'confirmation' && order) {
    return <OrderConfirmation order={order} onBackHome={() => navigateTo('home')} onOrderUpdate={setOrder} />
  }

  if (page === 'admin') {
    return <AdminDashboard onBackHome={() => navigateTo('home')} />
  }

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100">
      <div className="border-b border-stone-800 bg-stone-900/80 text-center text-[11px] font-medium uppercase tracking-[0.22em] text-stone-300">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-3 px-4 py-2 sm:px-6 lg:px-8">
          <span>Free shipping over ₹2,000</span>
          <span className="hidden text-stone-500 sm:inline">•</span>
          <span>24/7 support</span>
        </div>
      </div>

      <header className="sticky top-0 z-20 border-b border-stone-800/80 bg-stone-950/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-stone-100 text-sm font-black text-stone-950">
              V
            </div>
            <div>
              <p className="text-sm font-semibold tracking-[0.28em] text-stone-200">VANTOS</p>
            </div>
          </div>

          <nav className="hidden items-center gap-8 text-sm text-stone-300 md:flex">
            {navItems.map((item) => (
              <a key={item.label} href={item.href} className="transition hover:text-white">
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              aria-label={`Open shopping bag with ${cartCount} items`}
              className="relative inline-flex items-center gap-2 rounded-full border border-stone-700 px-2.5 py-2 text-sm font-medium text-stone-200 transition hover:border-stone-500 hover:text-white sm:px-4"
            >
              <BagIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Bag</span>
              {cartCount > 0 && <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-300 px-1 text-[10px] font-bold text-stone-950">{cartCount}</span>}
            </button>
            <a href="#featured" className="rounded-full bg-stone-100 px-4 py-2 text-sm font-semibold text-stone-950 transition hover:bg-white">
              Shop now
            </a>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 pb-20 pt-8 sm:px-6 lg:px-8 lg:pt-12">
        <section className="grid items-center gap-10 py-8 md:py-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
          <div className="max-w-xl">
            <SectionLabel>Modern essentials</SectionLabel>
            <h1 className="mt-5 text-5xl font-black leading-[0.94] tracking-[-0.06em] text-stone-50 md:text-6xl lg:text-7xl">
              Define your next look.
            </h1>
            <p className="mt-5 max-w-lg text-base text-stone-300 md:text-lg">
              Thoughtful silhouettes, rich textures and confident staples for a wardrobe that moves with you.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a href="#featured" className="rounded-full bg-stone-100 px-6 py-3 text-sm font-semibold text-stone-950 transition hover:bg-white">
                Shop now
              </a>
              <a href="#styles" className="rounded-full border border-stone-700 bg-stone-900 px-6 py-3 text-sm font-semibold text-stone-100 transition hover:border-stone-500 hover:bg-stone-800">
                Explore collection
              </a>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-5 text-sm text-stone-300">
              {['Ethically Sourced', 'Premium Fabrics', 'Express Shipping'].map((highlight) => (
                <div key={highlight} className="border-l border-amber-300/60 pl-3">
                  <p className="max-w-[9rem] text-sm font-semibold text-stone-50">{highlight}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-10 top-10 h-32 w-32 rounded-full bg-amber-200/20 blur-3xl" />
            <div className="absolute -right-8 bottom-8 h-40 w-40 rounded-full bg-rose-400/15 blur-3xl" />

            <div className="relative overflow-hidden rounded-[2rem] border border-stone-800 bg-stone-900 shadow-[0_30px_80px_rgba(0,0,0,0.55)]">
              <img
                loading="eager"
                src="https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=80"
                alt="Fashion model wearing premium clothing"
                className="h-[560px] w-full object-cover object-center transition duration-500 ease-out hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent" />

              <div className="absolute inset-x-5 bottom-5 rounded-[1.5rem] border border-white/10 bg-stone-950/60 p-4 backdrop-blur-sm">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.25em] text-stone-400">The new capsule</p>
                    <p className="mt-2 text-2xl font-bold text-white">Noir Edit</p>
                  </div>
                  <a href="#featured" className="rounded-full bg-amber-300 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-stone-900">
                    Shop now
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="editorial" className="py-16 md:py-20">
          <div className="mb-10 flex items-end justify-between gap-4">
            <div>
              <SectionLabel>Fashion gallery</SectionLabel>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-white md:text-4xl">
                Crafted for every moment.
              </h2>
            </div>
            <a href="#instagram" className="hidden rounded-full border border-stone-700 px-4 py-2 text-sm font-medium text-stone-200 transition hover:border-stone-500 hover:text-white md:inline-flex">
              View more
            </a>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {editorialShots.map((shot) => (
              <article key={shot.title} className="group relative overflow-hidden rounded-[2rem] border border-stone-800 bg-stone-900">
                <img
                  loading="lazy"
                  src={shot.image}
                  alt={shot.title}
                  className="h-[420px] w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <p className="text-xs uppercase tracking-[0.25em] text-stone-300">{shot.subtitle}</p>
                  <h3 className="mt-2 text-2xl font-semibold text-white">{shot.title}</h3>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="featured" className="py-16 md:py-20">
          <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <SectionLabel>Featured collection</SectionLabel>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-white md:text-4xl">
                Signature pieces, refined for everyday luxury.
              </h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {collectionFilters.map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setActiveCategory(filter)}
                  className={`rounded-full border px-3.5 py-2 text-xs font-semibold uppercase tracking-[0.14em] transition ${activeCategory === filter ? 'border-amber-300 bg-amber-300 text-stone-950' : 'border-stone-700 bg-stone-900 text-stone-300 hover:border-stone-500 hover:text-white'}`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {visibleProducts.map((product) => (
              <article
                key={product.name}
                className="group overflow-hidden rounded-[1.75rem] border border-stone-800 bg-stone-900 transition duration-300 hover:-translate-y-1 hover:border-stone-600"
              >
                <div className="overflow-hidden">
                  <button type="button" onClick={() => openQuickView(product)} className="block w-full cursor-zoom-in text-left">
                  <img
                    loading="lazy"
                    src={product.image}
                    alt={product.name}
                    className="h-80 w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  </button>
                </div>

                <div className="p-5">
                  <div className="flex items-center justify-between gap-4">
                    <button type="button" onClick={() => openQuickView(product)} className="text-left text-lg font-semibold text-white transition hover:text-amber-200">{product.name}</button>
                    <span className="text-base font-semibold text-amber-300">{formatPrice(product.price)}</span>
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-3">
                    <div className="flex gap-1.5" aria-label={`Available sizes: ${product.sizes.join(', ')}`}>
                      {product.sizes.map((size) => (
                        <button type="button" key={size} aria-label={`Select size ${size} for ${product.name}`} aria-pressed={(selectedProductSizes[product.name] || 'M') === size} onClick={() => setSelectedProductSizes((currentSizes) => ({ ...currentSizes, [product.name]: size }))} className={`flex h-7 w-7 items-center justify-center rounded-full border text-[10px] font-semibold transition ${(selectedProductSizes[product.name] || 'M') === size ? 'border-amber-300 bg-amber-300 text-stone-950' : 'border-stone-700 text-stone-400 hover:border-amber-300/60 hover:text-stone-200'}`}>
                          {size}
                        </button>
                      ))}
                    </div>
                    <span className="text-xs uppercase tracking-[0.14em] text-stone-500">Sizes</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => addToCart(product, selectedProductSizes[product.name] || 'M')}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-stone-100 px-4 py-2.5 text-sm font-semibold text-stone-900 transition hover:bg-amber-300"
                  >
                    <BagIcon />
                    Add to Cart
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="styles" className="py-16 md:py-20">
          <div className="mb-10 flex items-end justify-between gap-4">
            <div>
              <SectionLabel>Shop by style</SectionLabel>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-white md:text-4xl">
                Find the feeling that fits you.
              </h2>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {styleCategories.map((category) => (
              <a
                key={category.title}
                href="#featured"
                className="group relative min-h-[280px] overflow-hidden rounded-[1.75rem] border border-stone-800 bg-stone-900"
              >
                <img
                  loading="lazy"
                  src={category.image}
                  alt={`${category.title} fashion style`}
                  className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/25 to-transparent" />
                <div className="absolute inset-x-4 bottom-4">
                  <h3 className="text-2xl font-semibold text-white">{category.title}</h3>
                  <span className="mt-3 inline-flex rounded-full border border-white/30 bg-stone-950/40 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-stone-100 transition group-hover:border-amber-300 group-hover:text-amber-200">
                    Explore style
                  </span>
                </div>
              </a>
            ))}
          </div>
        </section>

        <section id="trust" className="py-16 md:py-20">
          <div className="rounded-[2rem] border border-stone-800 bg-gradient-to-r from-stone-900 via-stone-900 to-stone-800 p-8 md:p-12">
            <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div>
                <SectionLabel>What we stand for</SectionLabel>
                <h2 className="mt-4 max-w-lg text-3xl font-bold tracking-tight text-white md:text-5xl">
                  Thoughtful fashion, made to be lived in.
                </h2>
                <p className="mt-5 max-w-xl text-base leading-7 text-stone-300">
                  VANTOS brings together considered design, honest materials, and versatile silhouettes. We focus on pieces that earn their place in your wardrobe, with a slower and more intentional approach to style.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-stone-700 bg-stone-950/70 p-4">
                  <p className="text-lg font-semibold text-white">Considered</p>
                  <p className="mt-2 text-sm leading-6 text-stone-300">Designed with purpose, not excess.</p>
                </div>
                <div className="rounded-2xl border border-stone-700 bg-stone-950/70 p-4">
                  <p className="text-lg font-semibold text-white">Versatile</p>
                  <p className="mt-2 text-sm leading-6 text-stone-300">Pieces that move across your life.</p>
                </div>
                <div className="rounded-2xl border border-stone-700 bg-stone-950/70 p-4">
                  <p className="text-lg font-semibold text-white">Transparent</p>
                  <p className="mt-2 text-sm leading-6 text-stone-300">Clear details before you decide.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="instagram" className="py-16 md:py-20">
          <div className="mb-10 flex items-end justify-between gap-4">
            <div>
              <SectionLabel>Instagram / @vantosfashion</SectionLabel>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-white md:text-4xl">
                The VANTOS point of view.
              </h2>
            </div>
            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noreferrer"
              className="hidden rounded-full border border-stone-700 px-4 py-2 text-sm font-medium text-stone-200 transition hover:border-amber-300 hover:text-amber-200 sm:inline-flex"
            >
              Visit Instagram
            </a>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {instagramTiles.map((tile) => (
              <a
                key={tile.alt}
                href="https://www.instagram.com/"
                target="_blank"
                rel="noreferrer"
                className="group overflow-hidden rounded-2xl border border-stone-800 bg-stone-900"
              >
                <img
                  loading="lazy"
                  src={tile.image}
                  alt={tile.alt}
                  className="aspect-square h-full w-full object-cover transition duration-500 group-hover:scale-105 group-hover:opacity-80"
                />
              </a>
            ))}
          </div>

          <a
            href="https://www.instagram.com/"
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex rounded-full border border-stone-700 px-4 py-2 text-sm font-medium text-stone-200 transition hover:border-amber-300 hover:text-amber-200 sm:hidden"
          >
            Visit Instagram
          </a>
        </section>
      </main>

      <div className={`fixed inset-0 z-40 bg-stone-950/70 backdrop-blur-[2px] transition-opacity duration-300 ${isCartOpen ? 'opacity-100' : 'pointer-events-none opacity-0'}`} onClick={() => setIsCartOpen(false)} aria-hidden={!isCartOpen} />
      <aside
        aria-label="Shopping bag"
        aria-hidden={!isCartOpen}
        className={`fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-stone-800 bg-[#0B0B0E] shadow-[-20px_0_60px_rgba(0,0,0,0.4)] transition-transform duration-300 ease-out sm:w-[min(100%,28rem)] ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex items-center justify-between border-b border-stone-800 px-5 py-5">
          <div>
            <p className="text-lg font-semibold text-white">Your Shopping Bag</p>
            <p className="mt-1 text-xs text-stone-400">{cartCount} {cartCount === 1 ? 'item' : 'items'}</p>
          </div>
          <button type="button" onClick={() => setIsCartOpen(false)} aria-label="Close shopping bag" className="rounded-full border border-stone-700 p-2 text-stone-300 transition hover:border-amber-300 hover:text-amber-200">
            <CloseIcon />
          </button>
        </div>

        {cartItems.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <BagIcon className="h-10 w-10 text-stone-600" />
            <h2 className="mt-5 text-xl font-semibold text-white">Your bag is empty</h2>
            <p className="mt-2 text-sm leading-6 text-stone-400">Add a considered piece and it will appear here.</p>
            <button type="button" onClick={() => setIsCartOpen(false)} className="mt-6 rounded-full bg-stone-100 px-5 py-3 text-sm font-semibold text-stone-950 transition hover:bg-amber-300">
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5">
              {cartItems.map((item) => (
                <div key={item.key} className="flex gap-4 border-b border-stone-800 pb-5">
                  <img loading="lazy" src={item.image} alt={item.name} className="h-28 w-20 rounded-xl object-cover" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold text-white">{item.name}</p>
                        <span className="mt-2 inline-flex rounded-full border border-stone-700 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-stone-400">Size {item.size}</span>
                      </div>
                      <button type="button" onClick={() => setCartItems((items) => items.filter((cartItem) => cartItem.key !== item.key))} aria-label={`Remove ${item.name}`} className="text-stone-500 transition hover:text-red-300">
                        <TrashIcon />
                      </button>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center rounded-full border border-stone-700">
                        <button type="button" onClick={() => updateQuantity(item.key, -1)} aria-label={`Decrease ${item.name} quantity`} className="px-3 py-1.5 text-stone-300 transition hover:text-white">-</button>
                        <span className="min-w-6 text-center text-xs text-white">{item.quantity}</span>
                        <button type="button" onClick={() => updateQuantity(item.key, 1)} aria-label={`Increase ${item.name} quantity`} className="px-3 py-1.5 text-stone-300 transition hover:text-white">+</button>
                      </div>
                      <span className="text-sm font-semibold text-amber-300">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-stone-800 px-5 py-5">
              <p className="mb-5 text-xs text-emerald-300">{shippingRemaining > 0 ? `Add ${formatPrice(shippingRemaining)} more for FREE shipping.` : 'FREE shipping unlocked.'}</p>
              <div className="flex items-center justify-between text-base font-semibold text-white"><span>Subtotal</span><span>{formatPrice(cartSubtotal)}</span></div>
              <p className="mt-2 text-xs text-stone-500">Shipping and taxes calculated at checkout.</p>
              <button type="button" onClick={() => { setIsCartOpen(false); navigateTo('checkout') }} className="mt-5 w-full rounded-full bg-amber-300 px-5 py-3.5 text-xs font-bold tracking-[0.18em] text-stone-950 transition hover:bg-amber-200">PROCEED TO CHECKOUT</button>
            </div>
          </>
        )}
      </aside>

      {quickViewProduct && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-stone-950/80 p-4 backdrop-blur-sm" onClick={() => setQuickViewProduct(null)}>
          <div role="dialog" aria-modal="true" aria-label={`${quickViewProduct.name} quick view`} className="relative max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-[2rem] border border-stone-700 bg-[#0B0B0E] shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <button type="button" onClick={() => setQuickViewProduct(null)} aria-label="Close product quick view" className="absolute right-4 top-4 z-10 rounded-full border border-stone-600 bg-stone-950/70 p-2 text-stone-300 transition hover:border-amber-300 hover:text-amber-200"><CloseIcon /></button>
            <div className="grid md:grid-cols-2">
              <div className="border-b border-stone-800 p-4 md:border-b-0 md:border-r md:p-6">
                <img loading="lazy" src={quickViewImage} alt={quickViewProduct.name} className="aspect-[4/5] w-full rounded-2xl object-cover" />
                <div className="mt-3 grid grid-cols-2 gap-3">
                  {quickViewProduct.gallery.map((image) => (
                    <button type="button" key={image} onClick={() => setQuickViewImage(image)} className={`overflow-hidden rounded-xl border-2 ${quickViewImage === image ? 'border-amber-300' : 'border-transparent'}`}><img loading="lazy" src={image} alt="" className="aspect-square w-full object-cover" /></button>
                  ))}
                </div>
              </div>
              <div className="flex flex-col p-6 md:p-10">
                <span className="w-fit rounded-full border border-amber-300/40 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-200">{quickViewProduct.category}</span>
                <h2 className="mt-5 text-3xl font-bold text-white">{quickViewProduct.name}</h2>
                <p className="mt-3 text-2xl font-semibold text-amber-300">{formatPrice(quickViewProduct.price)}</p>
                <p className="mt-6 border-t border-stone-800 pt-6 text-sm leading-6 text-stone-400">{quickViewProduct.fabric}</p>
                <div className="mt-7">
                  <div className="flex items-center justify-between"><span className="text-sm font-semibold text-white">Select size</span><span className="text-xs text-stone-500">Size guide</span></div>
                  <div className="mt-3 grid grid-cols-4 gap-2">{quickViewProduct.sizes.map((size) => <button type="button" key={size} onClick={() => setQuickViewSize(size)} className={`rounded-full border py-2.5 text-sm font-semibold transition ${quickViewSize === size ? 'border-amber-300 bg-amber-300 text-stone-950' : 'border-stone-700 text-stone-300 hover:border-stone-400'}`}>{size}</button>)}</div>
                </div>
                <div className="mt-7 flex items-center justify-between"><span className="text-sm font-semibold text-white">Quantity</span><div className="flex items-center rounded-full border border-stone-700"><button type="button" onClick={() => setQuickViewQuantity((quantity) => Math.max(1, quantity - 1))} className="px-4 py-2 text-stone-300">-</button><span className="min-w-8 text-center text-sm text-white">{quickViewQuantity}</span><button type="button" onClick={() => setQuickViewQuantity((quantity) => quantity + 1)} className="px-4 py-2 text-stone-300">+</button></div></div>
                <button type="button" onClick={() => { addToCart(quickViewProduct, quickViewSize, quickViewQuantity); setQuickViewProduct(null) }} className="mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-amber-300 px-5 py-4 text-xs font-bold tracking-[0.18em] text-stone-950 transition hover:bg-amber-200"><BagIcon /> ADD TO CART</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <footer id="contact" className="border-t border-white/[0.08] bg-[#070709] text-stone-100">
        <div className="mx-auto max-w-7xl px-6 pb-10 pt-20 lg:px-8">
          <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr_1.5fr] lg:gap-10">
            <div>
              <h2 className="text-2xl font-extrabold tracking-[0.12em] text-stone-100">VANTOS<span className="text-amber-300">.</span></h2>
              <p className="mt-4 max-w-xs text-sm leading-6 text-[#9E9EA8]">Redefining luxury, streetwear, and modern fashion aesthetics with high-GSM fabrics and minimalist design.</p>
              <div className="mt-6 flex gap-3">
                <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="VANTOS on Instagram" className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-[#141419] text-white transition hover:border-amber-300 hover:text-amber-300">
                  <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.7"><rect width="16" height="16" x="4" y="4" rx="4" /><circle cx="12" cy="12" r="3.5" /><circle cx="17.5" cy="6.5" r=".7" fill="currentColor" stroke="none" /></svg>
                </a>
                <a href="https://x.com" target="_blank" rel="noreferrer" aria-label="VANTOS on X" className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-[#141419] text-white transition hover:border-amber-300 hover:text-amber-300">
                  <svg aria-hidden="true" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="m5 4 5.5 7.2L5.2 20H7l4.3-7.2L16.8 20H20l-6-7.8L19.4 4h-1.8l-4.2 6.8L10 4H5Z" /></svg>
                </a>
                <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="VANTOS on Facebook" className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-[#141419] text-white transition hover:border-amber-300 hover:text-amber-300">
                  <svg aria-hidden="true" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M13.5 21v-8h2.7l.4-3h-3.1V8.1c0-.9.3-1.5 1.6-1.5h1.7V4a22 22 0 0 0-2.4-.1c-2.4 0-4 1.5-4 4.1V10H8v3h2.4v8h3.1Z" /></svg>
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold uppercase tracking-[0.12em] text-white">Shop</h3>
              <nav className="mt-5 space-y-3 text-sm text-[#9E9EA8]" aria-label="Shop links">
                <a href="#featured" className="block transition hover:text-amber-300">New Arrivals</a>
                <a href="#styles" className="block transition hover:text-amber-300">Luxury Line</a>
                <a href="#styles" className="block transition hover:text-amber-300">Streetwear Drop</a>
                <a href="#styles" className="block transition hover:text-amber-300">Old Money Style</a>
                <a href="#featured" className="block transition hover:text-amber-300">Casual Essentials</a>
              </nav>
            </div>

            <div>
              <h3 className="text-sm font-bold uppercase tracking-[0.12em] text-white">About</h3>
              <nav className="mt-5 space-y-3 text-sm text-[#9E9EA8]" aria-label="About links">
                <a href="#trust" className="block transition hover:text-amber-300">Our Story</a>
                <a href="#trust" className="block transition hover:text-amber-300">Brand Values</a>
                <a href="#trust" className="block transition hover:text-amber-300">Fabric &amp; Quality</a>
                <a href="#instagram" className="block transition hover:text-amber-300">VANTOS Journal</a>
              </nav>
            </div>

            <div>
              <h3 className="text-sm font-bold uppercase tracking-[0.12em] text-white">Support</h3>
              <nav className="mt-5 space-y-3 text-sm text-[#9E9EA8]" aria-label="Support links">
                <a href={`mailto:${siteConfig.supportEmail}`} className="block transition hover:text-amber-300">Contact Us</a>
                <a href={`mailto:${siteConfig.supportEmail}`} className="mt-3 block break-all transition hover:text-amber-300">{siteConfig.supportEmail}</a>
                <span className="mt-3 block text-xs text-stone-500">{siteConfig.supportHours}</span>
                <a href="#policies" className="block transition hover:text-amber-300">Shipping Policy</a>
                <a href="#policies" className="block transition hover:text-amber-300">Returns &amp; Exchanges</a>
                <a href="#policies" className="block transition hover:text-amber-300">Privacy Policy</a>
                <a href="#policies" className="block transition hover:text-amber-300">Terms &amp; Conditions</a>
              </nav>
            </div>

            <div>
              <h3 className="text-sm font-bold uppercase tracking-[0.12em] text-white">VIP Access</h3>
              <p className="mt-5 text-[13px] leading-6 text-[#9E9EA8]">Subscribe to get early access to drops &amp; 10% off your first order.</p>
              <form className="mt-4 flex gap-2" onSubmit={(event) => event.preventDefault()}>
                <label className="sr-only" htmlFor="vip-email">Email address</label>
                <input id="vip-email" type="email" required placeholder="Enter your email" className="min-w-0 flex-1 rounded-md border border-white/10 bg-[#141419] px-3.5 py-2.5 text-[13px] text-white outline-none placeholder:text-[#6f6f78] focus:border-amber-300" />
                <button type="submit" className="rounded-md bg-amber-300 px-4 py-2.5 text-[13px] font-bold text-stone-950 transition hover:bg-amber-200">Join</button>
              </form>
            </div>
          </div>

          <div id="policies" className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-white/[0.08] pt-8 text-[13px] text-[#9E9EA8]">
            <p>© 2026 VANTOS FASHION. All rights reserved.</p>
            <p className="tracking-[0.08em]">PAN-INDIA EXPRESS SHIPPING <span className="mx-2 text-amber-300">•</span> SECURE PAYMENTS</p>
          </div>
        </div>
      </footer>
      <WhatsAppButton />
    </div>
  )
}

export default App
