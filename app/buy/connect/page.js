"use client";

import { useState, useEffect, useRef } from "react";
import { setupWalletSelector } from "@near-wallet-selector/core";
import { setupModal } from "@near-wallet-selector/modal-ui";
import { setupMyNearWallet } from "@near-wallet-selector/my-near-wallet";
import "@near-wallet-selector/modal-ui/styles.css";

export default function Connect({ searchParams }) {
  const [selectorInstance, setSelectorInstance] = useState();
  const [account, setAccount] = useState();
  const [accountId, setAccountId] = useState("");
  const firstRender = useRef(true);
  const secondRender = useRef(false);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      secondRender.current = true;
      return;
    } else if (secondRender.current) {
      secondRender.current = false;
      return;
    } else if (!selectorInstance.isSignedIn()) {
      return;
    }
    setupWallet();
  }, [selectorInstance]);

  const setupWallet = async () => {
    const wallet = await selectorInstance.wallet();
    const accounts = await wallet.getAccounts();
    console.log("0:", accounts[0]);
    setAccountId(accounts[0].accountId);
  };

  const connectWallet = async () => {
    let selector, modal;

    if (searchParams.search.endsWith(".near")) {
      selector = await setupWalletSelector({
        network: "mainnet",
        modules: [setupMyNearWallet()],
      });

      modal = setupModal(selector, {
        contractId: "",
      });
    } else {
      selector = await setupWalletSelector({
        network: "testnet",
        modules: [setupMyNearWallet()],
      });

      modal = setupModal(selector, {
        contractId: "test.testnet",
      });
    }
    modal.show();
    setSelectorInstance(selector);
  };

  const disconnect = async () => {
    const wallet = await selectorInstance.wallet("my-near-wallet");
    await wallet.signOut();
    setAccountId("");
  };

  return (
    <main>
      {accountId ? (
        <button
          onClick={disconnect}
          className="border rounded px-3 py-2 text-purple"
        >
          {accountId} (click to change)
        </button>
      ) : (
        <button
          onClick={connectWallet}
          className="border rounded px-3 py-2 text-purple"
        >
          Connect Wallet
        </button>
      )}
      <h2 className="py-5 text-red">
        NOTE: Press connect. Login. When redirected back press connect again to
        finalise connection.
      </h2>
    </main>
  );
}
