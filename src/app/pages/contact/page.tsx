'use client'

import React, { FormEvent, useState } from 'react'
import * as Icon from '@phosphor-icons/react/dist/ssr'
import TopNavOne from '@/components/Header/TopNav/TopNavOne'
import MenuOne from '@/components/Header/Menu/MenuOne'
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb'
import Footer from '@/components/Footer/Footer'
import { BRAND } from '@/constants/brand'

type Status = 'idle' | 'sending' | 'success' | 'error'

const ContactUs = () => {
    const [status, setStatus] = useState<Status>('idle')
    const [feedback, setFeedback] = useState('')

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        if (status === 'sending') return

        setStatus('sending')
        setFeedback('')

        try {
            const form = event.currentTarget
            const data = new FormData(form)
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: String(data.get('name') || ''),
                    email: String(data.get('email') || ''),
                    phone: String(data.get('phone') || ''),
                    subject: String(data.get('subject') || ''),
                    message: String(data.get('message') || ''),
                    website: String(data.get('website') || ''),
                }),
            })
            const payload = await response.json().catch(() => null)
            if (!response.ok || !payload?.success) throw new Error(payload?.message || 'Your message could not be sent.')

            form.reset()
            setStatus('success')
            setFeedback(payload.message || 'Thanks! Your message has been received.')
        } catch (error) {
            setStatus('error')
            setFeedback(error instanceof Error ? error.message : 'Your message could not be sent. Please try again.')
        }
    }

    return (
        <>
            <TopNavOne props="style-one bg-black" slogan="New customers save 10% with the code GET10" />
            <div id="header" className="relative w-full">
                <MenuOne props="bg-transparent" />
                <Breadcrumb heading="Contact us" subHeading="Contact us" />
            </div>
            <main className="contact-us py-10 md:py-20">
                <div className="container">
                    <div className="grid gap-8 lg:grid-cols-[minmax(0,1.65fr)_minmax(300px,0.8fr)] lg:gap-12">
                        <section className="rounded-[28px] border border-line bg-white p-6 shadow-[0_16px_50px_rgba(31,31,31,0.06)] md:p-9">
                            <span className="text-button-uppercase text-primary">Talk to Mixenza</span>
                            <h1 className="heading3 mt-2">How can we help?</h1>
                            <p className="body1 mt-3 text-secondary">Send us your question and our support team will reply by email or phone.</p>

                            <form onSubmit={handleSubmit} className="mt-7">
                                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                    <label className="caption1 font-medium">
                                        Name *
                                        <input name="name" type="text" autoComplete="name" maxLength={120} required className="mt-2 w-full rounded-xl border border-line px-4 py-3 outline-none transition focus:border-black" placeholder="Your full name" />
                                    </label>
                                    <label className="caption1 font-medium">
                                        Email *
                                        <input name="email" type="email" autoComplete="email" maxLength={254} required className="mt-2 w-full rounded-xl border border-line px-4 py-3 outline-none transition focus:border-black" placeholder="you@example.com" />
                                    </label>
                                    <label className="caption1 font-medium">
                                        Phone
                                        <input name="phone" type="tel" autoComplete="tel" maxLength={40} className="mt-2 w-full rounded-xl border border-line px-4 py-3 outline-none transition focus:border-black" placeholder="+92 3XX XXXXXXX" />
                                    </label>
                                    <label className="caption1 font-medium">
                                        Subject
                                        <input name="subject" type="text" maxLength={160} className="mt-2 w-full rounded-xl border border-line px-4 py-3 outline-none transition focus:border-black" placeholder="Order, delivery or product" />
                                    </label>
                                    <label className="caption1 font-medium sm:col-span-2">
                                        Message *
                                        <textarea name="message" rows={5} minLength={10} maxLength={5000} required className="mt-2 min-h-[150px] w-full resize-y rounded-xl border border-line px-4 py-3 outline-none transition focus:border-black" placeholder="Tell us how we can help..." />
                                    </label>
                                    <input name="website" type="text" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
                                </div>

                                {feedback && (
                                    <div role={status === 'error' ? 'alert' : 'status'} className={`mt-4 flex items-start gap-2 rounded-xl px-4 py-3 caption1 ${status === 'error' ? 'bg-red/10 text-red' : 'bg-success/10 text-success'}`}>
                                        {status === 'error' ? <Icon.WarningCircle size={20} className="shrink-0" /> : <Icon.CheckCircle size={20} weight="fill" className="shrink-0" />}
                                        <span>{feedback}</span>
                                    </div>
                                )}

                                <button type="submit" disabled={status === 'sending'} className="button-main mt-6 flex min-w-[180px] items-center justify-center gap-2 bg-primary text-white hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60">
                                    {status === 'sending' ? <><Icon.CircleNotch size={20} className="animate-spin" /> Sending...</> : <>Send message <Icon.ArrowRight size={20} /></>}
                                </button>
                            </form>
                        </section>

                        <aside className="h-fit rounded-[28px] bg-brand p-7 text-white md:p-8">
                            <h2 className="heading4">Contact details</h2>
                            <p className="caption1 mt-3 leading-6 text-white/70">For product questions, order updates and after-sales support.</p>
                            <div className="mt-7 space-y-5">
                                <a href={`mailto:${BRAND.email}`} className="group flex items-center gap-4">
                                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/10 text-primary"><Icon.EnvelopeSimple size={21} /></span>
                                    <span><small className="block text-white/60">Email</small><strong className="font-medium group-hover:text-primary">{BRAND.email}</strong></span>
                                </a>
                                <a href="tel:+923013769247" className="group flex items-center gap-4">
                                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/10 text-primary"><Icon.Phone size={21} /></span>
                                    <span><small className="block text-white/60">Phone / WhatsApp</small><strong className="font-medium group-hover:text-primary">{BRAND.phone}</strong></span>
                                </a>
                                <div className="flex items-center gap-4">
                                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/10 text-primary"><Icon.MapPin size={21} /></span>
                                    <span><small className="block text-white/60">Service area</small><strong className="font-medium">Pakistan · Nationwide delivery</strong></span>
                                </div>
                            </div>
                            <div className="mt-8 border-t border-white/15 pt-6">
                                <h3 className="text-title">Support hours</h3>
                                <p className="caption1 mt-3 text-white/70">Monday – Saturday</p>
                                <p className="caption1 mt-1 text-white">10:00 AM – 7:00 PM PKT</p>
                            </div>
                        </aside>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    )
}

export default ContactUs
