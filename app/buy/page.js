import Link from "next/link";
export default function Buy({searchParams}) {
  return (
    <main>
      <Link
            href={{
              pathname:"/buy/connect",
              query:{
                search:searchParams.search
              }
            }}
            className="border rounded px-3 py-2 text-purple"
          >
            Buy
          </Link>
    </main>
  );
}
