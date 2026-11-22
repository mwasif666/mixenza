'use client'

import { useEffect, useState, type FormEvent } from 'react'
import { createPortal } from 'react-dom'
import { ArrowRight, CheckCircle, X } from '@phosphor-icons/react/dist/ssr'
import { getBulkMinimum } from '@/lib/bulkOrder'

type Props = {
  open: boolean
  onClose: () => void
  productName: string
  productSku?: string
}

export default function BulkInquiryModal({ open, onClose, productName, productSku }: Props) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [feedback, setFeedback] = useState('')
  const minimum = getBulkMinimum(productName) || 1

  useEffect(() => {
    if (!open) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleEscape)
    }
  }, [open, onClose])

  useEffect(() => {
    if (open) {
      setStatus('idle')
      setFeedback('')
    }
  }, [open, productName])

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (status === 'sending') return
    const form = event.currentTarget
    const data = new FormData(form)
    const quantity = Math.max(minimum, Number(data.get('quantity')) || minimum)
    setStatus('sending')
    setFeedback('')
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: String(data.get('name') || ''),
          email: String(data.get('email') || ''),
          phone: String(data.get('phone') || ''),
          subject: ('Bulk order enquiry: ' + productName).slice(0, 160),
          message: [
            'Bulk order enquiry',
            'Product: ' + productName,
            'SKU: ' + (productSku || 'Not listed'),
            'Requested quantity: ' + quantity,
            'Customer message: ' + (String(data.get('message') || '').trim() || 'Please confirm the bulk price, stock and delivery timeline.'),
          ].join('\n'),
          website: '',
        }),
      })
      const payload = await response.json().catch(() => null)
      if (!response.ok || !payload?.success) throw new Error(payload?.message || 'Unable to send your enquiry. Please try again.')
      form.reset()
      setStatus('success')
      setFeedback('Your bulk enquiry has been sent. We will contact you to confirm pricing and stock.')
    } catch (error) {
      setStatus('error')
      setFeedback(error instanceof Error ? error.message : 'Unable to send the enquiry.')
    }
  }

  if (!open) return null

  return createPortal(
    <div className="mx-bulk-overlay" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) onClose() }}>
      <section className="mx-bulk-dialog" role="dialog" aria-modal="true" aria-labelledby="mx-bulk-dialog-title">
        <button type="button" className="mx-bulk-close" onClick={onClose} aria-label="Close bulk order form"><X size={20} /></button>
        <span className="mx-bulk-eyebrow">MIXENZA WHOLESALE</span>
        <h2 id="mx-bulk-dialog-title">Request a bulk quote</h2>
        <p className="mx-bulk-description">Share your required quantity and contact details. We will confirm the total price and availability before any order is placed.</p>
        <div className="mx-bulk-product-name">{productName}</div>
        {status === 'success' ? (
          <div className="mx-bulk-success" role="status">
            <CheckCircle size={28} weight="fill" />
            <p>{feedback}</p>
            <button type="button" onClick={onClose} className="mx-bulk-submit">Done</button>
          </div>
        ) : (
          <form onSubmit={submit} className="mx-bulk-form">
            <div className="mx-bulk-fields">
              <label>Full name *<input name="name" autoComplete="name" maxLength={120} required placeholder="Your name" /></label>
              <label>Email address *<input name="email" type="email" autoComplete="email" maxLength={254} required placeholder="you@example.com" /></label>
              <label>Phone / WhatsApp *<input name="phone" type="tel" autoComplete="tel" maxLength={40} required placeholder="+92 3XX XXXXXXX" /></label>
              <label>Quantity (pieces) *<input name="quantity" type="number" min={minimum} step="1" defaultValue={minimum} required /></label>
              <label className="mx-bulk-full">Message<textarea name="message" maxLength={2000} rows={3} placeholder="Variant, delivery city or other requirements" /></label>
            </div>
            {minimum > 1 && <p className="mx-bulk-minimum">Minimum order: {minimum} pieces</p>}
            {status === 'error' && <p className="mx-bulk-error" role="alert">{feedback}</p>}
            <button type="submit" className="mx-bulk-submit" disabled={status === 'sending'}>
              {status === 'sending' ? 'Sending enquiry...' : 'Send bulk enquiry'} <ArrowRight size={17} />
            </button>
          </form>
        )}
      </section>
    </div>,
    document.body,
  )
}
