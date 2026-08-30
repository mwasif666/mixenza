'use client'

import React, { useState } from 'react'
import * as Icon from '@phosphor-icons/react/dist/ssr'

/**
 * Email capture for the coming-soon holding page.
 *
 * There is no subscriber endpoint yet, so the address is only acknowledged in
 * the UI — wire the POST up here when the list is ready.
 */
const NotifyForm = () => {
    const [email, setEmail] = useState('')
    const [submitted, setSubmitted] = useState(false)

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!email.trim()) return
        setSubmitted(true)
    }

    if (submitted) {
        return (
            <div className='w-full mt-8 flex items-center justify-center gap-2 text-white'>
                <Icon.CheckCircle weight='fill' className='text-primary text-2xl' />
                <span className='body1'>Thanks — we&apos;ll let you know the moment we open.</span>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit} className='w-full sm:max-w-[480px] mt-8'>
            <div className='relative w-full h-[52px]'>
                <label htmlFor='notify-email' className='sr-only'>Email address</label>
                <input
                    id='notify-email'
                    type='email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder='Enter your e-mail'
                    required
                    className='caption1 w-full h-full pl-4 pr-14 rounded-xl bg-white border border-line'
                />
                <button
                    type='submit'
                    aria-label='Notify me'
                    className='bg-primary hover:bg-primary-dark duration-300 absolute top-1 bottom-1 right-1 aspect-square rounded-xl flex items-center justify-center'
                >
                    <Icon.ArrowRight className='text-white heading5' />
                </button>
            </div>
        </form>
    )
}

export default NotifyForm
