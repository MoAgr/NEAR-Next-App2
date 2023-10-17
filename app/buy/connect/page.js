"use client";

import { useRouter } from 'next/navigation'
import { useState, useEffect, useRef } from "react";
import { setupWalletSelector } from "@near-wallet-selector/core";
import { setupModal } from "@near-wallet-selector/modal-ui";
import { setupMyNearWallet } from "@near-wallet-selector/my-near-wallet";
import { KeyPairEd25519 } from "near-api-js/lib/utils";
import "@near-wallet-selector/modal-ui/styles.css";

export default function Connect({ searchParams }) {
  const router=useRouter()
  const [selectorInstance, setSelectorInstance] = useState();
  const [wallet, setWallet] = useState("");
  const [accountId, setAccountId] = useState("");
  const [msg, setMsg] = useState("");
  const firstRender = useRef(true);
  const secondRender = useRef(false);

  useEffect(() => {
    const hash = searchParams.transactionHashes;
    if (searchParams.transactionHashes) {
      localStorage.setItem('txnHash',hash)
      localStorage.setItem('search',searchParams.search)
      console.log("SUCCESS");
      setMsg("Success with txn hash:" + hash);
      router.push('/buy/final')
    }
  }, []);

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
    setWallet(wallet);
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
        contractId: "near",
      });
    } else {
      selector = await setupWalletSelector({
        network: "testnet",
        modules: [setupMyNearWallet()],
      });

      modal = setupModal(selector, {
        contractId: "testnet",
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

  const confirmBuy = async () => {
    const keyPair = KeyPairEd25519.fromRandom();
    const publicKey = keyPair.publicKey.toString();
    localStorage.setItem("secretKey", keyPair.secretKey.toString());
    await wallet.signAndSendTransaction({
      actions: [
        {
          type: "FunctionCall",
          params: {
            methodName: "create_account",
            args: {
              new_account_id: searchParams.search,
              new_public_key: publicKey,
            },
            gas: "30000000000000",
            deposit: "10000000000000000000000",
          },
        },
      ],
    });
  };

  return (
    <main>
      {JSON.parse(localStorage.getItem("near_app_wallet_auth_key")) ? (
        <div>
          <button
            onClick={disconnect}
            className="border rounded px-3 py-2 text-purple"
          >
            {
              JSON.parse(localStorage.getItem("near_app_wallet_auth_key"))
                .accountId
            }{" "}
            (click to change)
          </button>
          <button
            onClick={confirmBuy}
            className="border rounded px-3 py-2 text-purple"
          >
            Confirm
          </button>
        </div>
      ) : (
        <button
          onClick={connectWallet}
          className="border rounded px-3 py-2 text-purple"
        >
          Connect Wallet
        </button>
      )}

      <h2 className="py-5 text-red">
        NOTE:<br />
        1. Press connect.<br />
        2. Login.<br />
        3. When redirected back to this page, press connect again to
        finalise connection.<br />
      </h2>
    </main>
  );
}
