'use client'

import { FormEvent, useState } from 'react'
import * as Icon from '@phosphor-icons/react/dist/ssr'

type NewsletterFormProps = {
    source: 'homepage' | 'footer'
    variant?: 'bar' | 'compact'
}

type Status = 'idle' | 'sending' | 'success' | 'error'

export default function NewsletterForm({ source, variant = 'compact' }: NewsletterFormProps) {
    const [email, setEmail] = useState('')
    const [status, setStatus] = useState<Status>('idle')
    const [message, setMessage] = useState('')

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        if (status === 'sending') return

        setStatus('sending')
        setMessage('')

        try {
            const form = new FormData(event.currentTarget)
            const response = await fetch('/api/newsletter', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: String(form.get('email') || ''),
                    website: String(form.get('website') || ''),
                    source,
                }),
            })
            const payload = await response.json().catch(() => null)
            if (!response.ok || !payload?.success) throw new Error(payload?.message || 'Could not subscribe. Please try again.')

            setEmail('')
            setStatus('success')
            setMessage(payload.message || 'Thanks for subscribing!')
        } catch (error) {
            setStatus('error')
            setMessage(error instanceof Error ? error.message : 'Could not subscribe. Please try again.')
        }
    }

    const isBar = variant === 'bar'

    return (
        <div className="w-full">
            <form onSubmit={handleSubmit} className={`relative w-full ${isBar ? 'h-[60px]' : 'h-[54px]'}`}>
                <label htmlFor={`newsletter-email-${source}`} className="sr-only">Email address</label>
                <input
                    id={`newsletter-email-${source}`}
                    name="email"
                    type="email"
                    value={email}
                    onChange={(event) => {
                        setEmail(event.target.value)
                        if (status !== 'idle' && status !== 'sending') {
                            setStatus('idle')
                            setMessage('')
                        }
                    }}
                    placeholder="Enter your e-mail"
                    autoComplete="email"
                    required
                    className={`caption1 h-full w-full rounded-2xl border border-line bg-white pl-4 outline-none transition focus:border-black ${isBar ? 'pr-44 sm:pl-5' : 'pr-16'}`}
                />
                <input name="website" type="text" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
                <button
                    type="submit"
                    disabled={status === 'sending'}
                    aria-label="Subscribe to newsletter"
                    className={isBar
                        ? 'absolute bottom-1 right-1 top-1 min-w-[150px] rounded-xl bg-black px-6 text-sm font-semibold uppercase text-white transition hover:bg-primary disabled:cursor-not-allowed disabled:opacity-60'
                        : 'absolute bottom-1 right-1 top-1 flex w-[46px] items-center justify-center rounded-xl bg-primary text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60'
                    }
                >
                    {status === 'sending' ? (
                        <Icon.CircleNotch size={21} className="animate-spin" />
                    ) : isBar ? (
                        'Subscribe'
                    ) : (
                        <Icon.ArrowRight size={22} />
                    )}
                </button>
            </form>
            {message && (
                <p role={status === 'error' ? 'alert' : 'status'} className={`caption1 mt-2 ${status === 'error' ? 'text-red' : 'text-success'}`}>
                    {message}
                </p>
            )}
        </div>
    )
}
