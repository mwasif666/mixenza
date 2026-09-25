import type { Metadata } from 'next'
import PolicyPage from '@/components/Other/PolicyPage'

export const metadata: Metadata = {
    title: 'Terms & Conditions | Mixenza',
    description: 'Terms and conditions for browsing and shopping on Mixenza in Pakistan.',
}

const sections = [
    {
        title: 'Using Mixenza',
        paragraphs: [
            'By using mixenza.com or placing an order, you agree to use the website lawfully and to provide accurate information needed to process your order. If you do not agree with these Terms, please do not place an order through the site.',
        ],
    },
    {
        title: 'Products, sellers and availability',
        paragraphs: [
            'Mixenza may offer products supplied directly or through marketplace sellers. Product images, colours, packaging and specifications are presented as accurately as reasonably possible, but minor differences can occur. Availability can change before an order is confirmed.',
        ],
    },
    {
        title: 'Prices, promotions and errors',
        paragraphs: [
            'Prices are shown in the currency displayed on the website. Promotions may have separate conditions and can end or change. If a material pricing, stock or listing error is discovered before fulfilment, Mixenza may contact you to confirm a correction, offer an alternative or cancel the affected item and arrange any applicable refund.',
        ],
    },
    {
        title: 'Orders and acceptance',
        paragraphs: [
            'Submitting an order is a request to purchase. An order may require phone, payment or stock verification before it is accepted and dispatched. Mixenza may decline or cancel an order where verification fails, stock is unavailable, delivery is not possible, suspected misuse is identified or a material listing error has occurred.',
        ],
    },
    {
        title: 'Payments',
        paragraphs: [
            'Available payment methods are shown during checkout or order confirmation. Customers must be authorised to use the selected payment method. Payment providers may apply their own terms, verification steps and processing times.',
        ],
    },
    {
        title: 'Shipping, returns and refunds',
        paragraphs: [
            'Shipping is handled under the Shipping Policy. Returns, exchanges, cancellations and refunds are handled under the Returns & Refunds Policy, together with any product-specific conditions shown at the time of purchase.',
        ],
    },
    {
        title: 'Intellectual property',
        paragraphs: [
            'The Mixenza name, branding, website design, original text, graphics and other site content are protected by applicable intellectual-property rights. Content may not be copied, republished or commercially reused without permission except where law allows it.',
        ],
    },
    {
        title: 'Prohibited activity',
        bullets: [
            'Attempting to interfere with website security, availability or other customers.',
            'Using false identity, payment, delivery or contact information.',
            'Automated scraping, abusive traffic or unauthorised access to systems or data.',
            'Using the website for unlawful, fraudulent or harmful activity.',
        ],
    },
    {
        title: 'Service availability and liability',
        paragraphs: [
            'We work to keep Mixenza accurate and available, but temporary outages, third-party courier issues, seller delays or technical errors can occur. Nothing in these Terms is intended to exclude rights or responsibilities that cannot legally be excluded.',
        ],
    },
    {
        title: 'Changes and applicable law',
        paragraphs: [
            'These Terms may be updated as the website, marketplace or services change. The latest version posted here applies from its stated update date. These Terms are subject to applicable laws of Pakistan and any mandatory consumer protections that apply to a transaction.',
        ],
    },
]

export default function TermsConditionsPage() {
    return (
        <PolicyPage
            title="Terms & Conditions"
            intro="These Terms set out the general rules for using Mixenza and placing orders through mixenza.com."
            sections={sections}
        />
    )
}
