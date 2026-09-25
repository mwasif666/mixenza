import type { Metadata } from 'next'
import PolicyPage from '@/components/Other/PolicyPage'

export const metadata: Metadata = {
    title: 'Returns & Refunds Policy | Mixenza',
    description: 'Read the Mixenza return, exchange, cancellation and refund process for orders in Pakistan.',
}

const sections = [
    {
        title: 'Starting a return or refund request',
        paragraphs: [
            'Contact Mixenza as soon as possible after delivery if an item is damaged, defective, incorrect, incomplete or otherwise needs to be returned. Please include your order number, the reason for the request and clear photos or video where they help show the issue.',
            'Return eligibility can depend on the product type, condition, seller terms and any return information shown on the product or order page.',
        ],
    },
    {
        title: 'Condition of returned items',
        bullets: [
            'Keep the product, original packaging, labels, manuals, accessories, gifts and invoice or order proof together until the request is resolved.',
            'Items should normally be unused and in resalable condition unless the return is because of a defect, damage or an incorrect item.',
            'Do not send a parcel back without return instructions or approval from Mixenza or the relevant seller.',
        ],
    },
    {
        title: 'Items that may not be eligible',
        paragraphs: [
            'For hygiene, safety or product-integrity reasons, some categories may be non-returnable after opening or use. Personal-care items, customised goods, perishable items, digital products and items clearly marked final sale may have additional restrictions unless they arrive defective, damaged or incorrect.',
        ],
    },
    {
        title: 'Damaged, defective or wrong items',
        paragraphs: [
            'If a parcel arrives damaged, defective, incomplete or different from what was ordered, contact us promptly and keep the packaging. After review, the available resolution may include replacement, exchange, repair, return or refund depending on the product and circumstances.',
        ],
    },
    {
        title: 'Refunds',
        paragraphs: [
            'Approved refunds are processed after the return or supporting evidence has been reviewed. The time for funds to appear can vary by payment method, bank or wallet provider.',
            'For Cash on Delivery orders, an approved refund may require bank-account or supported mobile-wallet details so the refund can be transferred safely.',
        ],
    },
    {
        title: 'Delivery charges and return shipping',
        paragraphs: [
            'Original delivery charges and return-shipping costs may not be refundable where the return is based on a change of mind. Where Mixenza or the seller confirms that an item was incorrect, damaged or defective on arrival, the applicable return-shipping arrangement will be communicated with the customer.',
        ],
    },
    {
        title: 'Order cancellation',
        paragraphs: [
            'Contact us quickly if you want to cancel an order. If the order has not entered dispatch processing, cancellation may be possible. Once it has been dispatched, the return process may apply instead.',
        ],
    },
]

export default function ReturnsRefundsPage() {
    return (
        <PolicyPage
            title="Returns & Refunds"
            intro="We want return and refund requests to be clear and traceable. The points below explain the standard Mixenza process; product-specific conditions shown at purchase may also apply."
            sections={sections}
        />
    )
}
