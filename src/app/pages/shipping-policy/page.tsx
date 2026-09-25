import type { Metadata } from 'next'
import PolicyPage from '@/components/Other/PolicyPage'

export const metadata: Metadata = {
    title: 'Shipping Policy | Mixenza',
    description: 'Mixenza shipping, order processing, delivery and Cash on Delivery information for customers across Pakistan.',
}

const sections = [
    {
        title: 'Delivery coverage',
        paragraphs: [
            'Mixenza serves customers across Pakistan. Delivery availability can vary by product, seller, courier coverage and destination. Some remote or restricted locations may require a different courier, extra transit time or an alternative delivery arrangement.',
        ],
    },
    {
        title: 'Order processing',
        paragraphs: [
            'Orders are prepared after confirmation and, where relevant, payment verification. Processing time can vary by product availability, seller handling time, weekends, public holidays and verification requirements.',
        ],
    },
    {
        title: 'Estimated delivery',
        paragraphs: [
            'Any delivery estimate shown at checkout, on an order confirmation or by customer support is an estimate rather than a guaranteed arrival time. Courier network delays, weather, operational disruption, address issues or high-demand periods can affect delivery.',
        ],
    },
    {
        title: 'Cash on Delivery and prepaid orders',
        paragraphs: [
            'Available payment methods are shown during checkout or order confirmation. Cash on Delivery may not be available for every product, value, location or order. Mixenza may contact you to verify an order before dispatch.',
        ],
    },
    {
        title: 'Tracking and delivery updates',
        paragraphs: [
            'Where tracking is available, the tracking number or shipment status may be shared by SMS, email, WhatsApp, the courier or the order page. Tracking events are controlled by the courier and may not update instantly.',
        ],
    },
    {
        title: 'Correct delivery information',
        paragraphs: [
            'Customers are responsible for providing a complete delivery address and reachable phone number. If a courier cannot reach the customer or the address is incomplete, delivery may be delayed, returned to origin or require re-dispatch.',
        ],
    },
    {
        title: 'Receiving a parcel',
        paragraphs: [
            'Check the parcel and product as soon as reasonably possible after delivery. If there is visible damage, a missing item or an incorrect product, keep the packaging and contact Mixenza with your order details and supporting photos or video where available.',
        ],
    },
]

export default function ShippingPolicyPage() {
    return (
        <PolicyPage
            title="Shipping Policy"
            intro="This policy explains how Mixenza processes and delivers orders in Pakistan, including delivery estimates, tracking and customer responsibilities."
            sections={sections}
        />
    )
}
