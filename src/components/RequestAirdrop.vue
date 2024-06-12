<script setup>
import store from '../vuex';
import { useWallet } from 'solana-wallets-vue'
import { Connection, clusterApiUrl, LAMPORTS_PER_SOL } from '@solana/web3.js';

const { publicKey, connected } = useWallet();

function setBalance (balance) {
    store.commit('setBalance', { balance });
}

async function requestAirdrop () {
    if (!publicKey) {
        console.error('[requestAirdrop] public key not found');
        return;
    }
    console.log(publicKey.value, '=====',LAMPORTS_PER_SOL);
    const connection = new Connection(clusterApiUrl('devnet'));
    const signature = await connection.requestAirdrop(publicKey.value, LAMPORTS_PER_SOL);

    await connection.confirmTransaction(signature, 'confirmed');

    const lamports = await connection.getBalance(publicKey.value, 'confirmed'); 
    const balance = lamports / LAMPORTS_PER_SOL;
    console.log(balance,123);
    setBalance(balance);

    console.log(`[requestAirdrop] success, balance is now ${balance} sol`);
}
async function getBalance() {
  if (!publicKey) {
    console.error('[getBalance] public key not found');
    return;
  }

  const connection = new Connection(clusterApiUrl('devnet'));
  console.log(publicKey.value,1234);
  const lamports = await connection.getBalance(publicKey.value, 'confirmed');
  console.log(lamports,'12345');
  const balance = lamports / LAMPORTS_PER_SOL;

  console.log(`[getBalance] Balance is ${balance} SOL`);

  setBalance(balance);
}
</script>

<template>
    <div>
        <button
            class="px-8 m-2 btn animate-pulse bg-gradient-to-r from-[#9945FF] to-[#14F195] hover:from-pink-500 hover:to-yellow-500 ..."
            @click="getBalance"
        >
            <span>
                Airdrop 1
            </span>
        </button>
    </div>
</template>
