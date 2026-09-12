'use client'

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
    return <main className="container py-20" role="alert">
        <h1 className="heading4">We could not load this page.</h1>
        <p className="mt-4">Please try again in a moment.</p>
        <button className="button-main mt-6" onClick={reset}>Try again</button>
    </main>
}
