import type { Metadata } from 'next'
import PolicyPage from '@/components/Other/PolicyPage'

export const metadata: Metadata = {
    title: 'Privacy Policy | Mixenza',
    description: 'Learn how Mixenza collects, uses and protects customer information when you shop on mixenza.com.',
}

const sections = [
    {
        title: 'Information we collect',
        paragraphs: [
            'We may collect information you provide when you place an order, create or use an account, contact support, subscribe to updates or otherwise interact with Mixenza.',
        ],
        bullets: [
            'Contact and order details such as your name, phone number, email, delivery address and order history.',
            'Messages, product enquiries, reviews, support requests and other information you choose to provide.',
            'Technical and usage information such as device, browser, IP address, pages visited and basic site analytics.',
            'Payment-related information needed to complete a transaction. Full card or wallet credentials may be handled directly by the relevant payment provider rather than stored by Mixenza.',
        ],
    },
    {
        title: 'How we use information',
        bullets: [
            'To process, confirm, deliver and support orders.',
            'To communicate about order status, returns, refunds, customer service and account activity.',
            'To keep the website secure, prevent misuse and investigate suspicious activity.',
            'To improve products, website performance and the customer experience.',
            'To send promotional messages where you have opted in or where otherwise permitted, with an option to unsubscribe.',
        ],
    },
    {
        title: 'When information may be shared',
        paragraphs: [
            'We may share only the information reasonably needed with sellers, delivery partners, payment providers, hosting and technology providers, customer-support vendors and other service providers that help operate the store. We may also disclose information where required to comply with law, protect rights or respond to a valid legal request.',
            'Mixenza does not treat customer personal information as a standalone product for sale.',
        ],
    },
    {
        title: 'Cookies and similar technologies',
        paragraphs: [
            'Mixenza may use cookies or similar technologies to keep the site working, remember preferences, understand traffic and support analytics or marketing. Browser settings can be used to restrict cookies, although some website functions may then work differently.',
        ],
    },
    {
        title: 'Data retention and security',
        paragraphs: [
            'Information is kept only for as long as reasonably needed for orders, customer service, security, accounting, dispute handling and other legitimate operational purposes. We use reasonable technical and organisational safeguards, but no internet service can guarantee absolute security.',
        ],
    },
    {
        title: 'Your choices',
        paragraphs: [
            'You can contact us to ask about your personal information, request correction of inaccurate details, update marketing preferences or ask questions about this policy. Some information may need to be retained where it is required for order records, security or legal obligations.',
        ],
    },
    {
        title: 'Policy updates',
        paragraphs: [
            'We may update this Privacy Policy when our services, providers or practices change. The latest version will be posted on this page with the updated date.',
        ],
    },
]

export default function PrivacyPolicyPage() {
    return (
        <PolicyPage
            title="Privacy Policy"
            intro="This policy explains the main ways Mixenza handles information when you browse, shop or contact us through mixenza.com."
            sections={sections}
        />
    )
}
