import React from 'react'
import NewsletterForm from '@/components/Newsletter/NewsletterForm'

const Newsletter = () => {
    return (
        <>
            <div className={`newsletter-block bg-green py-7`}>
                <div className="container flex max-lg:flex-col items-center lg:justify-between justify-center gap-8 gap-y-4">
                    <div className="text-content">
                        <div className="heading3 max-lg:text-center">Sign up and get 10% off</div>
                        <div className='mt-2 max-lg:text-center'>Sign up for early sale access, new in, promotions and more</div>
                    </div>
                    <div className="input-block xl:w-5/12 md:w-1/2 sm:w-3/5 w-full">
                        <NewsletterForm source="homepage" variant="bar" />
                    </div>
                </div>
            </div>
        </>
    )
}

export default Newsletter
