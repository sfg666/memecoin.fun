

<template>
  <div>
      <wallet-multi-button dark></wallet-multi-button>
    </div>
</template>
<script setup>
import { WalletMultiButton } from 'solana-wallets-vue'
import {getCurrentInstance,onMounted,ref} from 'vue'
import store from '../vuex'
let { proxy } = getCurrentInstance();
let showMenu = false
let serial = ref('')
onMounted(() => {
  serial.value = localStorage.getItem('serial') || 1;
});
function flipAutoConnect (balance) {
 
}
const tz = (typ)=>{
  console.log(typ);
  store.state.typ = typ
  localStorage.setItem('serial', typ);
  console.log(store.state.typ);
  store.commit('setAutoConnect')
  serial.value = localStorage.getItem('serial') || 1;
  if(typ == 2){
    
    const currentURL =window.location.hash;
    if(currentURL == '#/raids' || currentURL == '#/Ranking'){
      proxy.$router.push({
      name: "Home",
      query: { typ: 'Raids' }
    });
    }else{
      proxy.$emit('child-event');
    }
  }
  if(typ == 3){
    const currentURL =window.location.hash;
    if(currentURL == '#/Ranking' || currentURL == '#/raids'){
      proxy.$router.push({
      name: "Home",
      query: { typ: 'Ranking' }
    });
    }else{
      proxy.$emit('child-event2');
    }
  }
}
</script>
<style lang="less" scoped>
:deep(.swv-button-trigger){
  background-color: #000 !important;
}
.dis{
  color: #000 !important;
}
.navbar1{
  width: 84%;
  padding: .1875rem .25rem;
  box-sizing: border-box;
  margin: 0 auto;
  position:absolute;
  left: 8%;
  top: .16rem;
  margin-top: .375rem;
  z-index: 6;
  border-radius: .25rem;
  border: 3px solid #000;
  background: #FFF;
  box-shadow: .075rem .075rem 0px #FF7E00;
  display: flex;
  align-items:center;
  justify-content:space-between;
 >div:nth-child(1){
  display: flex;
  align-items:center;
  >div:nth-child(1){
    display: flex;
    align-items:center;
    img{
      width: .75rem;
      height: .75rem;
      flex-shrink: 0;
      border-radius: 50%;
    }
    span{
      color: #000;
      font-family: "Abril Fatface";
      font-size: .475rem;
      font-style: normal;
      font-weight: 400;
      margin-left: .25rem;
      @media (max-width: 800px) {
        display: none;
      }
    }
  }
  >div:nth-child(2){
    display: flex;
    align-items:center;
    margin-left:1.25rem;
    display: block;
    @media (max-width: 800px) {
        width: 140px;
        overflow:auto;
        margin-left: 15px;
        display: none;
        span{
          font-size: 12px !important;
        }
        a{
          font-size: 12px !important;
        }
      }
    a{
      color: rgba(0, 0, 0, 0.40);
      font-size: .25rem;
      padding: .225rem;
    }    
    span{
      color: rgba(0, 0, 0, 0.40);
      font-size: .25rem;
      padding: .225rem;
      cursor: pointer;
    }   
  }
  >div:nth-child(3){
    display: flex;
    align-items:center;
    margin-left:1.25rem;
    display: none;
    @media (max-width: 800px) {
        width: 160px;
        // overflow:auto;
        // line-height: 36px;
        margin-left: 15px; 
        display:flex;
        span{
          font-size: 12px !important;
        }
        a{
          font-size: 12px !important;
        }
      }
    a{
      color: rgba(0, 0, 0, 0.40);
      font-size: .25rem;
      padding: .225rem;
    }    
    span{
      color: rgba(0, 0, 0, 0.40);
      font-size: .25rem;
      padding: .225rem;
      cursor: pointer;
    }   
  }
 }
}
@media (max-width: 800px) {
  :deep(.swv-button){
  width: 100px !important;
  height: 30px !important;
  font-size: 10px !important;
  line-height: 12px !important;
  padding: 0 5px;
  justify-content: center;
}
}
</style>