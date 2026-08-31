'use client'

import React, { useState } from 'react'
import * as Icon from '@phosphor-icons/react/dist/ssr'
import { apiPath } from '@/config/site'

type Status = 'idle' | 'sending' | 'sent' | 'error'

/**
 * Coming-soon contact form: email + message.
 *
 * Posts to the backend's POST /api/contact, which stores the message (visible
 * in the admin panel) and emails it to ADMIN_EMAIL — currently the
 * info@wasifmajeed.com inbox the SMTP account belongs to.
 */
const NotifyForm = () => {
    const [email, setEmail] = useState('')
    const [message, setMessage] = useState('')
    const [status, setStatus] = useState<Status>('idle')
    const [error, setError] = useState('')

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (status === 'sending') return

        const trimmedEmail = email.trim()
        const trimmedMessage = message.trim()
        if (!trimmedEmail || !trimmedMessage) return

        setStatus('sending')
        setError('')

        try {
            const response = await fetch(apiPath('/contact'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    // The contact model requires a name; nothing on this page
                    // asks for one, so fall back to the address's local part.
                    name: trimmedEmail.split('@')[0] || 'Website visitor',
                    email: trimmedEmail,
                    subject: 'Coming soon page enquiry',
                    message: trimmedMessage,
                }),
            })

            const data = await response.json().catch(() => null)
            if (!response.ok) {
                throw new Error(data?.message || 'Something went wrong. Please try again.')
            }

            setStatus('sent')
            setEmail('')
            setMessage('')
        } catch (err) {
            setStatus('error')
            setError(
                err instanceof Error && err.message
                    ? err.message
                    : 'Could not send your message. Please try again.',
            )
        }
    }

    if (status === 'sent') {
        return (
            <div
                role='status'
                className='w-full sm:max-w-[520px] mt-8 flex items-center justify-center gap-2 text-white'
            >
                <Icon.CheckCircle weight='fill' className='text-primary text-2xl flex-shrink-0' />
                <span className='body1'>Thanks — your message is on its way. We&apos;ll be in touch.</span>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit} className='w-full sm:max-w-[520px] mt-8 flex flex-col gap-3'>
            <label htmlFor='contact-email' className='sr-only'>Email address</label>
            <input
                id='contact-email'
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder='Enter your e-mail'
                autoComplete='email'
                required
                className='caption1 w-full h-[52px] px-4 rounded-xl bg-white border border-line'
            />

            <label htmlFor='contact-message' className='sr-only'>Message</label>
            <textarea
                id='contact-message'
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder='Your message'
                rows={4}
                maxLength={5000}
                required
                className='caption1 w-full px-4 py-3 rounded-xl bg-white border border-line resize-y min-h-[120px]'
            />

            {status === 'error' && (
                <div role='alert' className='caption1 text-primary text-left'>{error}</div>
            )}

            <button
                type='submit'
                disabled={status === 'sending'}
                className='button-main bg-primary hover:bg-primary-dark text-white rounded-xl h-[52px] flex items-center justify-center gap-2 duration-300 disabled:opacity-60 disabled:cursor-not-allowed'
            >
                {status === 'sending' ? 'Sending...' : 'Send message'}
                {status !== 'sending' && <Icon.ArrowRight className='text-white text-xl' />}
            </button>
        </form>
    )
}

export default NotifyForm
