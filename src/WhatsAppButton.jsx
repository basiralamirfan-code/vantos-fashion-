import { siteConfig } from './siteConfig'

function WhatsAppButton() {
  const phoneNumber = siteConfig.whatsappNumber
  const message = encodeURIComponent('Hi VANTOS Team, I would like to know more about your products and order details.')

  return (
    <a
      href={`https://wa.me/${phoneNumber}?text=${message}`}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with VANTOS support on WhatsApp"
      className="fixed bottom-5 right-5 z-30 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_10px_30px_rgba(37,211,102,0.28)] transition duration-300 hover:scale-105 hover:bg-[#20bd5b] focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2 focus:ring-offset-[#0B0B0E] sm:bottom-6 sm:right-6"
    >
      <svg aria-hidden="true" className="h-7 w-7" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.5 3.5A11.9 11.9 0 0 0 12.03 0C5.45 0 .1 5.35.1 11.93c0 2.1.55 4.15 1.6 5.96L.01 24l6.26-1.64a11.9 11.9 0 0 0 5.76 1.47h.01c6.58 0 11.93-5.35 11.93-11.93 0-3.19-1.24-6.18-3.47-8.4ZM12.04 21.8h-.01a9.88 9.88 0 0 1-5.03-1.38l-.36-.21-3.72.98.99-3.63-.23-.37a9.88 9.88 0 0 1-1.52-5.27C2.16 6.47 6.59 2.05 12.04 2.05c2.64 0 5.12 1.03 6.99 2.9a9.82 9.82 0 0 1 2.89 6.98c0 5.45-4.43 9.87-9.88 9.87Zm5.42-7.4c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.64-2.05-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.49s1.07 2.89 1.22 3.09c.15.2 2.1 3.2 5.09 4.49.71.31 1.27.49 1.7.63.72.23 1.38.2 1.9.12.58-.09 1.76-.72 2.01-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35Z" />
      </svg>
    </a>
  )
}

export default WhatsAppButton
