'use client'

import Link from "next/link";
export default function Final({searchParams}) {
  return (
    <main>
      <h2 className="text-green">Transaction successful with hash: {searchParams.txnHash}</h2>
      <h2 className="text-purple">SECRET KEY FOR ACCESS OF ACCOUNT: {localStorage.getItem('secretKey')}</h2>
      <Link
            href={{
              pathname:'/redirectWallet',
            }}
            className="border rounded px-3 py-2 text-purple"
          >
            Go to Account
          </Link>
    </main>
  );
}
