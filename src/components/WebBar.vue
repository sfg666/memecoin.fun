<template>
    <div>
      <div class="head">
        <div v-for="(item,index) in Latest_Data.logs" :key="index" :class="{'vibrate-1':store.state.animations == false}">
          <div>
            <span style="cursor: pointer;" @click="toUserDetails(item.mint)">{{keepFirstSixCharacters(item.mint)}}</span>
            <span>created</span>
            <span style="cursor: pointer;" @click="toblackMan(item.mint)">blackMan</span>
            <img style="width: 15px; height: 15px;" :src="item.image" alt="" />
          </div>
        </div>
        <div v-for="(item,index) in Latest_Data.creates" :key="index" >
          <div>
            <span style="cursor: pointer;" @click="toUserDetails(item.MintPda)">{{keepFirstSixCharacters(item.MintPda)}}</span>
            <span>created</span>
            <span style="cursor: pointer;" @click="toblackMan(item.MintPda)">blackMan</span>
            <img style="width: 15px; height: 15px;" :src="item.image" alt="" />
          </div>
        </div>
      </div>

      <div class="navigation">
        <span class="dis" @click="goback">memecoin.fun</span>
        <div>
          <span @click="dialogTableVisible = true">How to play</span>
          <span>Chicken Bible</span>
        </div>
        <!-- <span>Connect wallet</span> -->
        <div style="position: relative;">
          <wallet-multi-button dark></wallet-multi-button>
          <span
          v-if="viewProfile"
          @click="goprofile"
            style="
              padding: 0 24px;
              font-size: 14px;
              cursor: pointer;
              color: rgb(255 255 255 / 48%);
              position:absolute;
              left: 0;
              bottom: -20px;
              display: inline-block;
            "
            >[view profile]</span
          >
        </div>
      </div>
      <div class="m">
        <div>
            <div>
            <span @click="dialogTableVisible = true">How to play</span>
          <span>Chicken Bible</span>
        </div>
        <p @click="goback">memecoin.fun</p>
        <div style="position: relative;">
          <wallet-multi-button dark></wallet-multi-button>
          <span
          v-if="viewProfile"
          @click="goprofile"
            style="
              font-size: 12px;
              cursor: pointer;
              color: rgb(255 255 255 / 48%);
              position:absolute;
              left: 0;
              bottom: -20px;
              display: inline-block;
            "
            
            >[view profile]</span
          >
        </div>
        </div>
      </div>
      <el-dialog v-model="dialogTableVisible" title="How it works" center width="800">
          <p>Memecoin ensures token safety to prevent rug pulls. Each coin on memecoin.fun goes through a fair presale and launch with no team allocation.</p>

          <p>step 1: Pick a coin you like</p>
          <p>step 2: Buy the coin from the list</p>
          <p>step 3: Sell anytime to lock in profits or losses (refund)</p>
          <p>step 4: Once the presale quota is reached, all tokens will be automatically created on Raydium, and LP tokens will be burned</p>
          <div class="btns" @click="dialogTableVisible = false">
            [I'm ready to pump]
          </div>
      </el-dialog>
    </div>
</template>

<script setup>
import * as anchor from "@project-serum/anchor";
import { useWallet } from "solana-wallets-vue";
import { get, post } from "../util/axios";
import { ref, getCurrentInstance, onMounted, onUnmounted, watch } from "vue";
import {
  Connection,
  clusterApiUrl,
  LAMPORTS_PER_SOL,
  Program,
  PublicKey,
  Transaction,
  wallet,
  Lamports,
} from "@solana/web3.js";
import { WalletMultiButton } from "solana-wallets-vue";
import store from '../vuex'
  let { proxy } = getCurrentInstance();
  let wallets = useWallet();
  
let viewProfile = ref(false)
let Address = ref(wallets.publicKey.value == null ? null : wallets.publicKey.value.toString());
if(Address.value != null){
  viewProfile.value = true
}
watch(
  () => wallets.publicKey.value,
  (newValue, oldValue) => {
    if (newValue != null) {
      Address.value = newValue.toString();
      if(Address.value != null){
        viewProfile.value = true
      }
    }
  }
)

  let dialogTableVisible = ref(false)
const goback = ()=>{
    proxy.$router.push({
      name: "Home",
    });
}
const goprofile = ()=>{
  proxy.$router.push({
      name: "Profiles",
    });
}
let timer = ref(null)
onMounted(()=>{
  LatestData()
  timer.value = setInterval(function () {
    LatestData()
  }, 8000);
})
onUnmounted(() => {
  clearInterval(timer.value);
});
let Latest_Data = ref([])
const LatestData = ()=>{
  get(`/api/memecoin/first`, "")
    .then((res) => {
      Latest_Data.value = res.returnData
    })
    .catch((e) => {
      console.error(e);
    });
}
const keepFirstSixCharacters = (str)=>{
  if (str.length <= 6) {
    return str;
  } else {
    return str.substring(0, 6);
  }
}
const toblackMan = (address)=>{
  proxy.$router.push({
    name: "Details",
    query: {
      address: address,
    },
  });
}
const toUserDetails = (address) => {
  proxy.$router.push({
    name: "UserDetails",
    query: {
      address: address,
    },
  });
};
</script>

<style lang="less" scoped>
.head {
    width: 100%;
    display: flex;
    align-items: center;
    overflow: auto;

    > div {
      display: inline-block;
      padding: 0.0625rem 0.125rem;
      background-color: aqua;
      flex-shrink: 0;
      color: #000;
      font-weight:500;
      margin-right: 20px;
      border-radius: .075rem;
      > div {
        display: flex;
        align-items: center;
        margin-right: 20px;
        span {
          font-size:.15rem;
          margin-right: 0.125rem;
        }
      }
      @media (max-width: 800px) {
        >div{
          span{
            font-size: 12px;
          }
        }
      }
    }
    > div:nth-child(2) {
      background: #b1fa2a;
    }
    > div:nth-child(3) {
      background: #3318ff;
    }
    > div:nth-child(4) {
      background: #fd18ee;
    }
    > div:nth-child(5) {
      background: #fa812a;
    }
    > div:nth-child(6) {
      background: #21fef3;
    }
  }
  .navigation {
    width: 90%;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 0.5rem;
    @media (max-width: 800px) {
        display: none;
    }
    span {
      font-size: 0.275rem;
      font-weight: 700;
      color: #fff;
      cursor: pointer;
    }
    .dis {
      color: #ef08ef;
      
    }
    > div {
      > span {
        padding: 0 1rem;
      }
    }
  }
  .m{
    display: none;
    @media (max-width: 800px) {
        display: block;
    }
    >div{
        width: 90%;
        margin:0 auto;
        display: flex;
        align-items:center;
        justify-content: space-between;
        >div:nth-child(1){
            font-size: 12px;
            color: #fff;
            display: flex;
            flex-direction: column;
            margin-top: 6px;
        }
        p{
          font-size: 14px;
          color: #EF08EF;
        }
        >div:nth-child(3){
            font-size: 12px;
            :deep(.swv-button){
                font-size: 12px;
                height: auto;
                line-height: 14px;
                padding: 0 ;
            }
            :deep(.swv-button-icon){
              display: none;
            }
        }
    }
  }
  
  ::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
}
:deep(.swv-button-trigger) {
  background-color: #00000000;
}
:deep(.swv-button:not([disabled]):hover) {
  background-color: #00000000;
}
:deep(.el-dialog){
  background-color:#1b1d28;
  border-radius: 10px;
  border: 1px solid #ccc;
  padding: 30px;
  width: 6.25rem;
  @media (max-width: 800px) {
        width: 90%;
      }
  .el-dialog__title{
    color: #fff;
  }
  p:nth-child(1){
  font-size: 16px;
  margin-bottom:15px;
  color: #ffffffc4;
  }
  p{
    font-size: 14px;
    text-align: center;
    margin-bottom: 10px;
    color: #ffffff6b;
  }
  .btns{
    text-align:center;
    margin-top: 20px;
    font-size: 16px;
    cursor: pointer;
  }
  .btns:hover{
    transform: scale(1.2);
  }
}
.vibrate-1 {
	-webkit-animation: vibrate-1 0.3s linear infinite both;
	animation: vibrate-1 0.3s linear infinite both;
}
// @-webkit-keyframes vibrate-1 {
//   0% {
//     -webkit-transform: translate(0);
//             transform: translate(0);
//   }
//   20% {
//     -webkit-transform: translate(-2px, 0px);
//             transform: translate(-2px, 0px);
//   }
//   40% {
//     -webkit-transform: translate(-2px, 0px);
//             transform: translate(-2px, 0px);
//   }
//   60% {
//     -webkit-transform: translate(2px, 0px);
//             transform: translate(2px, 0px);
//   }
//   80% {
//     -webkit-transform: translate(2px, 0px);
//             transform: translate(2px, 0px);
//   }
//   100% {
//     -webkit-transform: translate(0);
//             transform: translate(0);
//   }
// }
@keyframes vibrate-1 {
  0% {
    -webkit-transform: translate(0);
            transform: translate(0);
  }
  20% {
    -webkit-transform: translate(-6px, 0.5px);
            transform: translate(-6px, 0.5px);
  }
  40% {
    -webkit-transform: translate(-6px, -0.5px);
            transform: translate(-6px, -0.5px);
  }
  60% {
    -webkit-transform: translate(6px, 0.5px);
            transform: translate(6px, 0.5px);
  }
  80% {
    -webkit-transform: translate(6px, -0.5px);
            transform: translate(6px, -0.5px);
  }
  100% {
    -webkit-transform: translate(0);
            transform: translate(0);
  }
}
</style>