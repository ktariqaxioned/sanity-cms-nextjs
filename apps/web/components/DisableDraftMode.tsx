"use client";

import Link from "next/link";

export function DisableDraftMode() {
  return (
    <Link
      href="/api/exit-draft"
      className="fixed bottom-4 right-4 z-50 rounded bg-black px-4 py-2 text-white"
    >
      Exit preview
    </Link>
  );
}
