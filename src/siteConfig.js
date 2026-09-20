export const siteConfig = {
  brandName: 'VANTOS FASHION',
  supportEmail: 'vantosfashion@gmail.com',
  supportHours: '24/7 customer service',
  whatsappNumber: import.meta.env.VITE_WHATSAPP_NUMBER || '919332623606',
  adminPasscode: import.meta.env.VITE_ADMIN_PASSCODE || 'VANTOS2026',
  defaultCurrency: 'INR',
  payment: {
    razorpayKeyId: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_replace_me',
    cashfreeAppId: import.meta.env.VITE_CASHFREE_APP_ID || 'replace_with_sandbox_app_id',
  },
}
