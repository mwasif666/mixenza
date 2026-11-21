import NewsletterForm from '@/components/Newsletter/NewsletterForm'
import * as Icon from '@phosphor-icons/react/dist/ssr'

export default function Newsletter() {
  return (
    <section className="container mx-newsletter-container" aria-labelledby="mx-newsletter-heading">
      <div className="mx-newsletter-box">
        <div className="mx-newsletter-head">
          <Icon.EnvelopeSimple size={35} weight="light" aria-hidden="true" />
          <div><h2 id="mx-newsletter-heading">Stay in the Mixenza Loop</h2><p>New arrivals, useful discoveries and exclusive updates, straight to your inbox.</p></div>
        </div>
        <div className="mx-newsletter-form"><NewsletterForm source="homepage" variant="bar" /></div>
      </div>
    </section>
  )
}
