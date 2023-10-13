"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function SearchBar() {
  const { providers } = require("near-api-js");
  const [nameAvailable, setNameAvailable] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [finalSearchQuery, setFinalSearchQuery] = useState("");

  const providerTestnet = new providers.JsonRpcProvider(
    "https://archival-rpc.testnet.near.org"
  );
  const providerMainnet = new providers.JsonRpcProvider(
    "https://archival-rpc.mainnet.near.org"
  );

  const handleSearch = async (event) => {
    let succeeded = true;
    if (event.key === "Enter") {
      setFinalSearchQuery(searchQuery)
      let provider;
      if (searchQuery.endsWith(".near")) {
        provider = providerMainnet;
      } else if (searchQuery.endsWith(".testnet")) {
        provider = providerTestnet;
      } else {
        setNameAvailable(false);
        return;
      }
      let rawResult;
      try {
        rawResult = await provider.query({
          request_type: "view_account",
          account_id: searchQuery,
          finality: "final",
        });
      } catch (e) {
        if (e.type === "AccountDoesNotExist") {
          succeeded = false;
        }
      }
    }
    succeeded ? setNameAvailable(false) : setNameAvailable(true);
  };

  const handleChange = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <main>
      <input
        type="text"
        placeholder=".near or .testnet"
        value={searchQuery}
        onChange={handleChange}
        onKeyDown={handleSearch}
        className="w-full border rounded px-3 py-2 mb-4"
      />
      {nameAvailable ? (
        <div>
          <p className="text-green pb-4">
            Domain <span className="font-semibold">{searchQuery}</span>{" "}
            available.
          </p>
          <Link
            href={{
              pathname:"/buy",
              query:{
                search:finalSearchQuery
              }
            }}
            className="border rounded px-3 py-2 text-purple"
          >
            Buy Domain
          </Link>
        </div>
      ) : (
        <p className="text-lg text-red">No results to display.</p>
      )}
    </main>
  );
}
