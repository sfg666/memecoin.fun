<script setup>
import { useRoute } from 'vue-router';
import store from './vuex';
import 'solana-wallets-vue/styles.css'
import AppBar from './components/AppBar';
import FooterBar from './components/FooterBar';
import BasicPage from './pages/BasicPage'
import {
  LedgerWalletAdapter,
  PhantomWalletAdapter,
  SlopeWalletAdapter,
  TorusWalletAdapter,
  SolflareWalletAdapter
} from '@solana/wallet-adapter-wallets';
import { initWallet } from 'solana-wallets-vue';
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {onBeforeUnmount ,onMounted} from "vue"
const route = useRoute()

const wallets = [
  new PhantomWalletAdapter(),
  new SlopeWalletAdapter(),
  new TorusWalletAdapter(),
  new LedgerWalletAdapter(),
  new SolflareWalletAdapter({ network: WalletAdapterNetwork.Devnet }),
];
const walletOptions = {
  wallets: [
  new PhantomWalletAdapter(),
  new SlopeWalletAdapter(),
  new TorusWalletAdapter(),
  new LedgerWalletAdapter(),
  new SolflareWalletAdapter({ network: WalletAdapterNetwork.Devnet }),
  ],
  autoConnect: true,
};
initWallet(walletOptions);
onMounted(() => {
      // 监听beforeunload事件
      window.addEventListener('beforeunload', handleBeforeUnload);
    });

    onBeforeUnmount(() => {
      // 移除beforeunload事件监听
      window.removeEventListener('beforeunload', handleBeforeUnload);
    });

    // 处理beforeunload事件的回调函数
    function handleBeforeUnload(event) {
      // 执行清理本地缓存的操作
      // localStorage.removeItem('walletName');

      // 可以选择向事件对象添加提示信息
      // event.preventDefault();
      event.returnValue = '';
    }
</script>

<template>
  <div class="box">


        <!-- Main -->
        <main class="flex flex-col h-screen">
          <header>
              <title>Solana Scaffold Lite</title>
          </header>
          <!-- AppBar -->
          
          <router-view class=" h-5/6 block"></router-view>
          <!-- <footer-bar></footer-bar> -->
        </main>
    </div>
</template>
<style scoped>
  .box{
    background-color: #000;
  }
  :deep(.el-scrollbar){
      background-color: #000 !important;
    }
    .el-scrollbar{
      background-color: #000;
    }
    
</style>