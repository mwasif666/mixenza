import { redirect } from "next/navigation";

// Mixenza's administration lives on a separate domain and GitHub application.
// Keep this compatibility route so older upload links cannot expose an
// independent admin login on the public shopping storefront.
export default function LegacySupplierUploader() {
  redirect("https://admin.mixenza.com/admin/meem-media-upload");
}
