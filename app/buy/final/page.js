'use client'

import Link from "next/link";
export default function Final({searchParams}) {
    // const walletProvider=searchParams.search.endsWith(".near")?'/redirectWalletMainnet':'/redirectWalletTestnet';
  return (
    <main>
      <h2 className="text-green px-3 py-2">Transaction successful with hash: {localStorage.getItem('txnHash')}</h2>
      <h2 className="text-purple px-3 py-2">SECRET KEY : {localStorage.getItem('secretKey')} (copy & store)</h2>
      <Link
            href={{
              pathname:'/redirectWalletTestnet',
            }}
            className="border rounded px-3 py-2 my-10 text-purple"
          >
            Go to Account
          </Link>
    </main>
  );
}
