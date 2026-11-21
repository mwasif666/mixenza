'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import { apiPath } from '@/config/site'

type PendingImage = { sku: string; index: string; blob: Blob }
type ProductStatus = { sku: string; imagePublicIds: string[]; uploaded: number }
type UploadState = { total: number; completed: number; skipped: number; failed: number }

async function readZip(file: File): Promise<PendingImage[]> {
    if (file.size > 40 * 1024 * 1024) throw new Error('Select the optimized images ZIP (under 40 MB), not the original WhatsApp media ZIP.')
    const bytes = await file.arrayBuffer()
    const view = new DataView(bytes)
    const length = bytes.byteLength
    let eocd = -1
    for (let i = length - 22; i >= Math.max(0, length - 65557); i--) {
        if (view.getUint32(i, true) === 0x06054b50) { eocd = i; break }
    }
    if (eocd === -1) throw new Error('This is not a valid ZIP file.')
    const entryCount = view.getUint16(eocd + 10, true)
    const cdStart = view.getUint32(eocd + 16, true)
    if (entryCount > 500 || cdStart >= length) throw new Error('ZIP contains too many files or is invalid.')

    const decoder = new TextDecoder()
    const selected: PendingImage[] = []
    let cursor = cdStart
    let totalUncompressed = 0
    for (let n = 0; n < entryCount; n++) {
        if (cursor + 46 > length || view.getUint32(cursor, true) !== 0x02014b50) {
            throw new Error('ZIP directory is corrupted.')
        }
        const method = view.getUint16(cursor + 10, true)
        const compressedSize = view.getUint32(cursor + 20, true)
        const originalSize = view.getUint32(cursor + 24, true)
        const nameLength = view.getUint16(cursor + 28, true)
        const extraLength = view.getUint16(cursor + 30, true)
        const commentLength = view.getUint16(cursor + 32, true)
        const offset = view.getUint32(cursor + 42, true)
        const fileName = decoder.decode(new Uint8Array(bytes, cursor + 46, nameLength))
        cursor += 46 + nameLength + extraLength + commentLength

        const match = fileName.match(/^public\/images\/meem\/(MEEM-20261121-\d{3})\/(\d{2})\.webp$/)
        if (!match) continue
        if (originalSize > 1024 * 1024) throw new Error('A product image exceeds the safe size limit.')
        totalUncompressed += originalSize
        if (totalUncompressed > 35 * 1024 * 1024) throw new Error('ZIP expanded size is too large.')
        if (offset + 30 > length || view.getUint32(offset, true) !== 0x04034b50) {
            throw new Error('Invalid image entry in ZIP.')
        }
        const localNameLength = view.getUint16(offset + 26, true)
        const localExtraLength = view.getUint16(offset + 28, true)
        const dataStart = offset + 30 + localNameLength + localExtraLength
        if (dataStart + compressedSize > length) throw new Error('Image data is truncated.')
        const compressed = new Uint8Array(bytes.slice(dataStart, dataStart + compressedSize))
        let imageBytes: ArrayBuffer
        if (method === 0) {
            imageBytes = compressed.buffer as ArrayBuffer
        } else if (method === 8) {
            if (typeof DecompressionStream === 'undefined') {
                throw new Error('Your browser cannot extract ZIP files. Use a recent Chrome or Edge browser.')
            }
            const uncompressed = new Blob([compressed.buffer as ArrayBuffer])
                .stream()
                .pipeThrough(new DecompressionStream('deflate-raw'))
            imageBytes = await new Response(uncompressed).arrayBuffer()
        } else {
            throw new Error('Unsupported ZIP compression method.')
        }
        if (imageBytes.byteLength !== originalSize) throw new Error('A product image did not extract correctly.')
        selected.push({ sku: match[1], index: match[2], blob: new Blob([imageBytes], { type: 'image/webp' }) })
    }
    if (!selected.length) throw new Error('No Mixenza product photos found. Select mixenza_meem_product_images_optimized.zip.')
    return selected
}

async function callAdmin(endpoint: string, token: string, options: RequestInit = {}) {
    const response = await fetch(apiPath(endpoint), {
        ...options,
        credentials: 'include',
        headers: {
            Accept: 'application/json',
            Authorization: 'Bearer ' + token,
            ...(options.body ? { 'Content-Type': 'application/json' } : {}),
        },
    })
    const data = await response.json().catch(() => ({}))
    if (!response.ok || data.success === false) {
        throw new Error(data.message || 'API request failed (' + response.status + ')')
    }
    return data
}

export default function MeemMediaUploadPage() {
    const token = useRef('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [authenticated, setAuthenticated] = useState(false)
    const [products, setProducts] = useState<ProductStatus[]>([])
    const [file, setFile] = useState<File | null>(null)
    const [busy, setBusy] = useState(false)
    const [message, setMessage] = useState('')
    const [errors, setErrors] = useState<string[]>([])
    const [progress, setProgress] = useState<UploadState>({ total: 0, completed: 0, skipped: 0, failed: 0 })

    const login = async () => {
        setBusy(true)
        setMessage('')
        try {
            const response = await fetch(apiPath('/auth/login'), {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            })
            const auth = await response.json()
            if (!response.ok || !auth.token) throw new Error(auth.message || 'Login failed')
            if (!['admin', 'superAdmin'].includes(auth.data?.role)) {
                throw new Error('This tool requires a Mixenza administrator account.')
            }
            const status = await callAdmin('/uploads/meem/status', auth.token)
            token.current = auth.token
            setProducts(status.products || [])
            setPassword('')
            setAuthenticated(true)
            setMessage('Connected to Cloudinary ' + status.cloudName + '. Select the optimized images ZIP below.')
        } catch (error) {
            setMessage(error instanceof Error ? error.message : 'Could not sign in.')
        } finally { setBusy(false) }
    }

    const upload = async () => {
        if (!file || !token.current) return
        setBusy(true)
        setErrors([])
        setMessage('Reading product images from ZIP...')
        try {
            const images = await readZip(file)
            const accepted = new Map(products.map(p => [p.sku, new Set(p.imagePublicIds || [])]))
            const grouped = new Map<string, PendingImage[]>()
            let skipped = 0
            for (const img of images) {
                const ids = accepted.get(img.sku)
                if (!ids || ids.has('mixenza/meem/' + img.sku + '/' + img.index)) {
                    skipped++
                    continue
                }
                const list = grouped.get(img.sku) || []
                list.push(img)
                grouped.set(img.sku, list)
            }
            const remaining: PendingImage[][] = Array.from(grouped.values())
            let completed = 0
            let failed = 0
            let cancelled = false
            const failures: string[] = []
            const total = images.length
            setProgress({ total, completed, skipped, failed })
            setMessage('Uploading to Cloudinary and saving Mixenza product galleries...')

            let nextGroup = 0
            const worker = async () => {
                while (nextGroup < remaining.length && !cancelled) {
                    const group = remaining[nextGroup++]
                    group.sort((a: PendingImage, b: PendingImage) => a.index.localeCompare(b.index))
                    for (const img of group) {
                        if (cancelled) return
                        try {
                            const signed = await callAdmin('/uploads/meem/sign', token.current, {
                                method: 'POST',
                                body: JSON.stringify({ sku: img.sku, index: img.index }),
                            })
                            const form = new FormData()
                            form.append('file', img.blob, img.index + '.webp')
                            form.append('api_key', String(signed.apiKey))
                            form.append('timestamp', String(signed.timestamp))
                            form.append('signature', String(signed.signature))
                            form.append('folder', String(signed.folder))
                            form.append('public_id', String(signed.publicId))
                            form.append('overwrite', String(signed.overwrite))
                            const result = await fetch('https://api.cloudinary.com/v1_1/' + signed.cloudName + '/image/upload', {
                                method: 'POST',
                                body: form,
                            })
                            const uploaded = await result.json()
                            if (!result.ok || !uploaded.secure_url) {
                                throw new Error(uploaded.error?.message || 'Cloudinary upload failed')
                            }
                            await callAdmin('/uploads/meem/attach', token.current, {
                                method: 'POST',
                                body: JSON.stringify({
                                    sku: img.sku,
                                    index: img.index,
                                    url: uploaded.secure_url,
                                    publicId: uploaded.public_id,
                                }),
                            })
                            completed++
                        } catch (error) {
                            failed++
                            if (failures.length < 8) failures.push(img.sku + '/' + img.index + ': ' + (error instanceof Error ? error.message : 'Failed'))
                            if (failed >= 8 && completed === 0) cancelled = true
                        }
                        setProgress({ total, completed, skipped, failed })
                    }
                }
            }
            await Promise.all(Array.from({ length: Math.min(4, remaining.length) }, () => worker()))
            setErrors(failures)
            setMessage(completed
                ? 'Uploaded ' + completed + ' images. Reload Shop to see newly attached photos. Re-running this uploader skips completed files.'
                : (skipped === total ? 'Every available product image is already uploaded or held for duplicate review.' : 'No new images uploaded. Check the errors below.'))
        } catch (error) {
            setMessage(error instanceof Error ? error.message : 'Could not process the ZIP.')
        } finally {
            setBusy(false)
            if (token.current) {
                try {
                    const state = await callAdmin('/uploads/meem/status', token.current)
                    setProducts(state.products || [])
                } catch { /* session can be refreshed by signing in again */ }
            }
        }
    }

    return (
        <main className="container max-w-3xl py-12 md:py-20">
            <Link href="/shop" className="text-sm text-secondary hover:underline">← Back to shop</Link>
            <h1 className="mt-5 text-3xl font-semibold">Meem Traders media importer</h1>
            <p className="mt-3 leading-7 text-secondary">
                Admin-only tool for uploading the optimized WhatsApp product photos directly to Mixenza&apos;s existing Cloudinary account.
                API secrets never leave the backend. Products are matched by SKU; no duplicate products are created.
            </p>
            {!authenticated ? (
                <form className="mt-8 space-y-4 rounded-xl border border-line p-6" onSubmit={event => { event.preventDefault(); void login() }}>
                    <h2 className="text-lg font-semibold">Administrator login</h2>
                    <label className="block text-sm">Admin email
                        <input required type="email" value={email} onChange={e => setEmail(e.target.value)}
                            className="mt-2 w-full rounded-lg border border-line p-3" autoComplete="username" />
                    </label>
                    <label className="block text-sm">Password
                        <input required type="password" value={password} onChange={e => setPassword(e.target.value)}
                            className="mt-2 w-full rounded-lg border border-line p-3" autoComplete="current-password" />
                    </label>
                    <button disabled={busy} className="button-main disabled:opacity-50" type="submit">{busy ? 'Connecting...' : 'Connect as admin'}</button>
                </form>
            ) : (
                <section className="mt-8 space-y-4 rounded-xl border border-line p-6">
                    <p className="font-semibold text-green">Admin authentication confirmed</p>
                    <p className="text-sm text-secondary">{products.length} existing supplier product records eligible for image uploads. Products on duplicate-review hold will be skipped.</p>
                    <label className="block text-sm font-medium">Optimized images ZIP
                        <input type="file" accept=".zip,application/zip" disabled={busy}
                            className="mt-2 block w-full rounded-lg border border-line p-3 text-sm"
                            onChange={e => setFile(e.target.files?.[0] || null)} />
                    </label>
                    <button type="button" disabled={!file || busy} onClick={() => void upload()}
                        className="button-main disabled:opacity-40">{busy ? 'Uploading...' : 'Upload images to Cloudinary'}</button>
                    {progress.total > 0 && (
                        <div className="text-sm">
                            <p>{progress.completed} uploaded · {progress.skipped} skipped · {progress.failed} failed · {progress.total} ZIP images</p>
                            <progress max={progress.total} value={progress.completed + progress.skipped + progress.failed}
                                className="mt-2 h-3 w-full" />
                        </div>
                    )}
                    <p className="text-xs text-secondary">Keep this tab open until the upload finishes. If interrupted, log in again and reselect the same ZIP; already attached images are skipped.</p>
                </section>
            )}
            {message && <p role="status" className="mt-6 rounded-lg bg-surface p-4 text-sm">{message}</p>}
            {errors.length > 0 && <div className="mt-4 rounded-lg border border-red p-4">
                <p className="font-semibold">Upload warnings</p>
                <ul className="mt-2 space-y-1 text-sm">{errors.map(item => <li key={item}>{item}</li>)}</ul>
            </div>}
        </main>
    )
}
