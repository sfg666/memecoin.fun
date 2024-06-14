<template>
  <div class="Home">
    <!-- <app-bar
        class="block"
        @child-event="parentMethod"
        @child-event2="parentMethod2"
      ></app-bar> -->
    <!-- import webbar from "@/components/WebBar.vue"; -->
    <webbar />
    <div class="coin" @click="toCoin">[start a new coin]</div>
    <div class="subject" v-for="item in Latest_info"
        :key="item" >
      <div @click="toDetails(item.MintPda)">
        <img :src="item.image" alt="" />
      </div>
      <div
        @click="toDetails(item.MintPda)"
      >
        <div>
          <div>
            <div>
              <div>MOBYDICK</div>
            </div>
            <div>
              {{
                proportion(
                  formatNumberWith6DecimalPlaces(
                    CalculateSellingPrice(item.remind, item.price)
                  ),
                  item.price == 0 ? 20 : item.price == 1 ? 50 : 100
                )
              }}%
            </div>
          </div>
          <div>{{ item.name }}</div>
          <div>
            <p>To raise funds</p>
            <div>
              <span>{{
                formatNumberWith6DecimalPlaces(
                  CalculateSellingPrice(item.remind, item.price)
                )
              }}</span
              ><span>
                /{{ item.price == 0 ? 20 : item.price == 1 ? 50 : 100 }}</span
              >
              sol
            </div>
          </div>
          <div>
            <div>
              <p>Number of people</p>
              <span>{{ item.investor }}</span>
            </div>
            <div>
              <p>Countdown</p>
              <span>
                <el-countdown
                  value-style="color: #fff"
                  format="HH:mm:ss"
                  :value="sj(item.expireTime)"
                />
              </span>
            </div>
          </div>
          <div>
            <p>
              {{ item.descr }}
            </p>
          </div>
          <div>
            <p>{{ truncateString(item.MintPda) }}</p>
            <span></span>
          </div>
        </div>
      </div>
    </div>
    <div class="search">
      <input type="text" v-model="searchaddress" />
      <div class="btns" @click="search">search</div>
    </div>
    <div class="screen">
      <!-- <input type="text" placeholder="search for token" /> -->
      <div>
        <el-select
          v-model="sort"
          placeholder="sort: bump order"
          size="large"
          style="width: 3rem"
          @change="change"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <div>
        <el-select
          v-model="order"
          placeholder="order: desc"
          size="large"
          style="width: 3rem"
          @change="change2"
        >
          <el-option
            v-for="item in options2"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <div class="dxk">
        <el-checkbox @click="animations" v-model="checked1" label="Show animations" size="large" />
      </div>
      <div class="dxk">
        <el-checkbox v-model="checked2" label="Include nsfw" size="large" />
      </div>
    </div>
    <div class="list" v-if="projectList != null">
      <div
        @click="toDetails(item.MintPda)"
        v-for="item in projectList"
        :key="item"
      >
        <img :src="item.image" alt="" />
        <div>
          <div>
            <div>
              <div>MOBYDICK</div>
            </div>
            <div>
              {{
                proportion(
                  formatNumberWith6DecimalPlaces(
                    CalculateSellingPrice(item.remind, item.price)
                  ),
                  item.price == 0 ? 20 : item.price == 1 ? 50 : 100
                )
              }}%
            </div>
          </div>
          <div>{{ item.name }}</div>
          <div>
            <p>To raise funds</p>
            <div>
              <span>{{
                formatNumberWith6DecimalPlaces(
                  CalculateSellingPrice(item.remind, item.price)
                )
              }}</span
              ><span>
                /{{ item.price == 0 ? 20 : item.price == 1 ? 50 : 100 }}</span
              >
              sol
            </div>
          </div>
          <div>
            <div>
              <p>Number of people</p>
              <span>{{ item.investor }}</span>
            </div>
            <div>
              <p>Countdown</p>
              <span>
                <el-countdown
                  value-style="color: #fff"
                  format="HH:mm:ss"
                  :value="sj(item.expireTime)"
                />
              </span>
            </div>
          </div>
          <div>
            <p>
              {{ item.descr }}
            </p>
          </div>
          <div>
            <p>{{ truncateString(item.MintPda) }}</p>
            <span v-if="!sjc(item.expireTime) && item.remind == 0">complete</span>
            <span v-if="!sjc(item.expireTime) && item.remind > 0">afoot</span>
            <span v-if="sjc(item.expireTime)">expire</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import webbar from "@/components/WebBar.vue";
import { get, post } from "../util/axios";
import { ref, getCurrentInstance, onMounted, onUnmounted, watch } from "vue";
import { useWallet } from "solana-wallets-vue";
import * as CryptoJS from 'crypto-js';
import store from '../vuex'
let wallets = useWallet();
let Address = ref(
  wallets.publicKey.value == null ? null : wallets.publicKey.value.toString()
);
if(Address.value != null){
  localStorage.setItem('Address', Address.value);
}

let { proxy } = getCurrentInstance();
watch(
  () => wallets.publicKey.value,
  (newValue, oldValue) => {
    if (newValue != null) {
      Address.value = newValue.toString();
      localStorage.setItem('Address', Address.value);
      userinfo()
    }
  }
);
const sort = ref("createTime");
const order = ref("DESC");
const checked1 = ref(true);
const checked2 = ref(false);
const options = [
  {
    value: "cap",
    label: "cap",
  },
  {
    value: "reply",
    label: "reply",
  },
  {
    value: "createTime",
    label: "createTime",
  },
  {
    value: "expireTime",
    label: "expireTime",
  },
  {
    value: "remind",
    label: "remind",
  },
];
const options2 = [
  {
    value: "ASC",
    label: "order: asc",
  },
  {
    value: "DESC",
    label: "order: desc",
  },
];
let timer = ref(null);
let timer2 = ref(null)
onMounted(() => {
  info();
  Latestinfo()
  userinfo()
  timer.value = setInterval(function () {
    info();
  }, 8000);
  timer2.value = setInterval(function () {
    Latestinfo();
  }, 10000);
});
onUnmounted(() => {
  clearInterval(timer.value);
  clearInterval(timer2.value);
});

const sj = (dateString) => {
  const timestamp = Date.parse(dateString);
  if (timestamp <= 0) return 0;
  if (timestamp > 0) return timestamp;
};
let projectList = ref("");
const info = () => {
  get(
    `/api/memecoin/1/30/${sort.value}/${order.value}`,
    ""
  )
    .then((res) => {
      projectList.value = res.returnData;
    })
    .catch((e) => {
      console.error(e);
    });
};
let Latest_info = ref([])
const Latestinfo = () => {
  get(
    `/api/memecoin/1/1/remind/ASC`,
    ""
  )
    .then((res) => {
      Latest_info.value = res.returnData;
    })
    .catch((e) => {
      console.error(e);
    });
};
let searchaddress = ref("");
const search = () => {
  if (searchaddress.value == "") return;
  get(`/api/memecoin/search/${searchaddress.value}`, "")
    .then((res) => {
      if (res.returnData == null) return (projectList.value = null);
      projectList.value = [res.returnData.data];
      searchaddress.value  = ''
    })
    .catch((e) => {
      console.error(e);
    });
};
const userinfo = () => {
  let data = {}
  if(Address.value != null){
    data = {
      address:encrypt(Address.value)
    }
  }else{
    data = {
      address:encrypt(localStorage.getItem('Address'))
    }
  }
  if(data == {}) return
  post(
    `/api/user/get`,
    data
  )
    .then((res) => {
      // user_info.value = res
      localStorage.setItem('userinfo', '1');
    })
    .catch((e) => {
      console.error(e);
    });
};
watch(
  () => searchaddress.value,
  (newValue, oldValue) => {
    clearInterval(timer.value);
    if (newValue == "" || newValue == null) {
      timer.value = setInterval(function () {
        info();
      }, 8000);
    }
   
  }
);
const toCoin = () => {
  proxy.$router.push({
    name: "Coin",
  });
};
const toDetails = (address) => {
  proxy.$router.push({
    name: "Details",
    query: {
      address: address,
    },
  });
};
const change = (e) => {
  info();
};
const change2 = (e) => {
  info();
};
const truncateString = (str) => {
  if (str.length <= 10) {
    return str;
  } else {
    return str.slice(0, 5) + "..." + str.slice(-5);
  }
};
//计算出售的代币价值多少u
const CalculateSellingPrice = (remainingQuantity, TotalAmount) => {
  let sol = 20;
  if (TotalAmount == 0) {
    sol = 20;
  }
  if (TotalAmount == 1) {
    sol = 50;
  }
  if (TotalAmount == 2) {
    sol = 100;
  }
  let price = Number(sol) / 500000000;
  let PurchaseQuantity = 500000000 - Number(remainingQuantity / 1000000);
  return Number(price) * Number(PurchaseQuantity);
};
const formatNumberWith6DecimalPlaces = (number) => {
  return Number(number.toFixed(6));
};
const proportion = (SalesVolume, total) => {
  return (Number(SalesVolume / total) * 100).toFixed(2);
};
const encrypt = (word)=>{
    return CryptoJS.AES.encrypt(word, 'your-secret-key').toString()
}
const animations = (e)=>{
  store.state.animations = checked1.value
}
const sjc = (dateString) => {
  const timestamp = Date.parse(dateString);
  const currentTimestamp = Date.now();
  if (currentTimestamp > timestamp) return true;
  if (currentTimestamp < timestamp) return false;
};
</script>

<style lang="less" scoped>
.Home {
  height: auto;
  background-color: #000;
  padding-bottom: 1.25rem;
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
      color: #fff;
      > div {
        display: flex;
        align-items: center;
        span {
          font-size: 0.175rem;
          margin-right: 0.125rem;
        }
      }
    }
    > div:nth-child(1) {
      display: inline-block;
      padding: 0.0625rem 0.125rem;
      background: #ef08ef;
      > div {
        display: flex;
        align-items: center;
        span {
          font-size: 0.175rem;
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
    span {
      font-size: 0.275rem;
      font-weight: 700;
      color: #fff;
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
  .coin {
    font-size: 0.275rem;
    font-weight: 700;
    color: #ef08ef;
    text-align: center;
    margin-top: 1rem;
    margin-bottom: 0.625rem;
    cursor: pointer;
    @media (max-width: 800px) {
      font-size: 12px;
    }
  }
  .subject {
    display: flex;
    justify-content: center;
    // align-items: center;
    cursor: pointer;
    @media (max-width: 800px) {
      width: 90%;
      margin: 0 auto;
      flex-direction: column;
    }
    > div:nth-child(1) {
      background-color: #282524;
      display: flex;
      justify-content: center;
      align-items:center;
      img {
        width: 4rem;
        height: 4rem;
      }
      @media (max-width: 800px) {
        // width: 50%;
        // img{
        //   width: 100%;
        // }
        margin-bottom: 10px;
      }
    }
    // > div:nth-child(2) {
    //   width: 4rem;
    //   height: 4rem;
    //   padding: 0.25rem;
    //   box-sizing: border-box;
    //   background-color: #282524;
    //   > div:nth-child(1) {
    //     display: flex;
    //     justify-content: space-between;
    //     > div:nth-child(1) {
    //       padding-right: 4px;
    //       border-radius: 0.225rem;
    //       background: linear-gradient(to right top, #9845fefc, #28e2b7);
    //       > div {
    //         padding: 0.0625rem 0.125rem;
    //         background-color: #fff;
    //         font-size: 0.175rem;
    //         font-weight: 600;
    //         border-radius: 0.225rem;
    //       }
    //     }
    //     > div:nth-child(2) {
    //       font-size: 0.15rem;
    //       font-weight: 600;
    //       // border: 0.0125rem solid #9945ff;
    //       padding: 0.0625rem 0.325rem;
    //       border-radius: 0.225rem;
    //       color: #0fe8e7;
    //       background: linear-gradient(to right top, #9845fe79, #28e2b78b);
    //     }
    //   }
    //   > div:nth-child(2) {
    //     font-size: 0.25rem;
    //     color: #fff;
    //     font-weight: 700;
    //     padding: 0.125rem 0;
    //   }
    //   > div:nth-child(3) {
    //     margin-bottom: 0.1875rem;
    //     p {
    //       font-size: 0.175rem;
    //       font-weight: 500;
    //       color: #747271;
    //       margin-bottom: 0.025rem;
    //     }
    //     > div {
    //       font-size: 0.275rem;
    //       font-weight: 700;
    //       color: #fff;
    //       > span:nth-child(1) {
    //         color: #ef08ef;
    //       }
    //       > span:nth-child(2) {
    //         color: #0fe8e7;
    //       }
    //     }
    //   }
    //   > div:nth-child(4) {
    //     display: flex;
    //     margin-bottom: 0.125rem;
    //     > div:nth-child(1) {
    //       margin-right: 0.625rem;
    //     }
    //     div {
    //       display: flex;
    //       flex-direction: column;
    //       p {
    //         font-size: 0.175rem;
    //         font-weight: 500;
    //         color: #747271;
    //         margin-bottom: 0.05rem;
    //       }
    //       span {
    //         font-size: 0.2rem;
    //         color: #89e80f;
    //       }
    //     }
    //   }
    //   .introduce {
    //     p {
    //       font-size: 0.175rem;
    //       font-weight: 700;
    //       color: #fff;
    //       overflow: hidden;
    //       text-overflow: ellipsis;
    //       display: -webkit-box;
    //       -webkit-box-orient: vertical;
    //       -webkit-line-clamp: 1;
    //       @media (max-width: 800px) {
    //         font-size: 14px;
    //       }
    //     }
    //     border-bottom: 0.0125rem solid #595959;
    //     padding-bottom: 0.1875rem;
    //     /* 添加以下样式以限制元素高度 */
    //     @media (max-width: 800px) {
    //       padding-bottom: 15px;
    //     }
    //   }
    //   > div:nth-child(6) {
    //     display: flex;
    //     justify-content: space-between;
    //     font-size: 0.175rem;
    //     color: #ffffff8c;
    //     padding-top: 0.1875rem;
    //   }
    // }
    > div:nth-child(2){
    // height: 300px;
    
    @media (max-width: 800px) {
      width: 100%;
      }
    cursor: pointer;
    > div:nth-child(1) {
      padding: 0.25rem;
      box-sizing: border-box;
      background-color: #282524;
      @media (max-width: 800px) {
        padding: 20px 10px;
      }
      > div:nth-child(1) {
        display: flex;
        justify-content: space-between;
        > div:nth-child(1) {
          padding-right: 4px;
          border-radius: 0.225rem;
          background: linear-gradient(to right top, #9845fefc, #28e2b7);
          > div {
            padding: 0.0625rem 0.125rem;
            background-color: #fff;
            font-size: 0.175rem;
            font-weight: 600;
            border-radius: 0.225rem;
          }
        }
        > div:nth-child(2) {
          font-size: 0.15rem;
          font-weight: 600;
          // border: 0.0125rem solid #9945ff;
          background: linear-gradient(to right top, #9845fe79, #28e2b78b);
          padding: 0.0625rem 0.325rem;
          border-radius: 0.125rem;
          color: #0fe8e7;
        }
        @media (max-width: 800px) {
          > div:nth-child(1) {
            border-radius: 16px;
            > div {
              font-size: 12px;
              padding: 5px 10px;
              border-radius: 16px;
            }
          }
          > div:nth-child(2) {
            font-size: 12px;
            padding: 5px 10px;
            border-radius: 16px;
          }
        }
      }
      > div:nth-child(2) {
        font-size: 0.25rem;
        color: #fff;
        font-weight: 700;
        padding: 0.125rem 0;
        @media (max-width: 800px) {
          font-size: 14px;
          margin: 6px 0;
        }
      }
      > div:nth-child(3) {
        margin-bottom: 0.1875rem;
        p {
          font-size: 0.175rem;
          font-weight: 500;
          color: #747271;
          margin-bottom: 0.025rem;
        }
        > div {
          font-size: 0.275rem;
          font-weight: 700;
          color: #fff;
          > span:nth-child(1) {
            color: #ef08ef;
          }
          > span:nth-child(2) {
            color: #0fe8e7;
          }
        }
        @media (max-width: 800px) {
          p {
            font-size: 12px;
          }
          > div {
            font-size: 14px;
          }
        }
      }
      > div:nth-child(4) {
        display: flex;
        margin-bottom: 0.125rem;
        > div:nth-child(1) {
          margin-right: 0.625rem;
        }
        div {
          display: flex;
          flex-direction: column;
          margin-bottom: 0.1rem;
          p {
            font-size: 0.175rem;
            font-weight: 500;
            color: #747271;
            margin-bottom: 0.05rem;
          }
          span {
            font-size: 0.2rem;
            color: #89e80f;
          }
        }
        @media (max-width: 800px) {
          margin: 10px 0;
          div {
            height: auto;
            display: flex;
            flex-direction: column;
            p {
              font-size: 12px;
            }
            span {
              font-size: 12px;
            }
          }
        }
      }
      > div:nth-child(5) {
        border-bottom: 0.0125rem solid #595959;
        padding-bottom: 0.1875rem;
        p {
          font-size: 0.175rem;
          font-weight: 700;
          color: #fff;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 3;
          @media (max-width: 800px) {
            font-size: 14px;
          }
        }
        @media (max-width: 800px) {
          padding-bottom: 15px;
        }
      }
      > div:nth-child(6) {
        display: flex;
        justify-content: space-between;
        font-size: 0.175rem;
        color: #ffffff8c;
        padding-top: 0.1875rem;
        @media (max-width: 800px) {
          font-size: 12px;
        }
      }
    }
  }
   
  }
  .search {
    width: 8rem;
    display: flex;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    margin-top: 0.5rem;
    input {
      width: 5.7625rem;
      height: 0.5375rem;
      background-color: #ef08ef78;
      border: none;
      box-shadow: none;
      outline: none;
      padding-left: 0.125rem;
      color: #fff;
      font-size: 0.2rem;
    }
    .btns {
      width: 1.625rem;
      height: 0.5375rem;
      background-color: #ef08ef;
      font-size: 0.175rem;
      font-weight: 600;
      color: #fff;
      line-height: 0.5375rem;
      text-align: center;
      cursor: pointer;
    }
    @media (max-width: 800px) {
      width: 90%;
      margin: 0 auto;
      margin-top: 15px;
      input {
        width: 70%;
        height: 35px;
      }
      .btns {
        width: 25%;
        height: 35px;
        font-size: 12px;
        line-height: 35px;
      }
    }
  }
  .screen {
    display: flex;
    width: 90%;
    margin: 0 auto;
    margin-top: 1rem;
    @media (max-width: 800px) {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
    }
    input {
      width: 30%;
      background-color: #000000;
      border: 0.025rem solid #4a4643;
      padding-left: 0.075rem;
      margin-right: 0.25rem;
      font-size: 0.2rem;
      height: 40px;
      color: #fff;
      @media (max-width: 800px) {
        width: 100%;
        margin-bottom: 10px;
        font-size: 12px;
      }
    }
    @media (max-width: 800px) {
      > div:nth-child(1) {
        width: 48%;
        margin-bottom: 10px;
      }
      > div:nth-child(2) {
        width: 48%;
      }
    }

    :deep(.el-select) {
      background-color: #000;
      border: none;
      border-radius: 0;
      margin-right: 0.25rem;
      @media (max-width: 800px) {
        width: 100% !important;
      }
      .el-select__wrapper {
        background-color: #000;
        border: 0.025rem solid #4a4643;
        box-shadow: none;
        border-radius: 0;
      }
    }

    .dxk {
      border: 0.025rem solid #4a4643;
      padding: 0 0.25rem;
      margin-right: 0.25rem;
      height: 40px;
      display: flex;
      justify-content: center;
      align-items: center;
      @media (max-width: 800px) {
        width: 48%;
        margin: 0;
      }
    }
  }
}
.list {
  width: 90%;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.6rem;
  margin-top: 0.75rem;
  @media (max-width: 800px) {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
  > div {
    // height: 300px;
    cursor: pointer;
    
    img {
      width: 100%;
      height:5rem;
      @media (max-width: 800px) {
        height:auto;
      }
      border: 1px solid #282524;
    }
    > div:nth-child(2) {
      padding: 0.25rem;
      box-sizing: border-box;
      background-color: #282524;
      @media (max-width: 800px) {
        padding: 20px 10px;
      }
      > div:nth-child(1) {
        display: flex;
        justify-content: space-between;
        > div:nth-child(1) {
          padding-right: 4px;
          border-radius: 0.225rem;
          background: linear-gradient(to right top, #9845fefc, #28e2b7);
          > div {
            padding: 0.0625rem 0.125rem;
            background-color: #fff;
            font-size: 0.175rem;
            font-weight: 600;
            border-radius: 0.225rem;
          }
        }
        > div:nth-child(2) {
          font-size: 0.15rem;
          font-weight: 600;
          // border: 0.0125rem solid #9945ff;
          background: linear-gradient(to right top, #9845fe79, #28e2b78b);
          padding: 0.0625rem 0.325rem;
          border-radius: 0.125rem;
          color: #0fe8e7;
        }
        @media (max-width: 800px) {
          > div:nth-child(1) {
            border-radius: 16px;
            > div {
              font-size: 12px;
              padding: 5px 10px;
              border-radius: 16px;
            }
          }
          > div:nth-child(2) {
            font-size: 12px;
            padding: 5px 10px;
            border-radius: 16px;
          }
        }
      }
      > div:nth-child(2) {
        font-size: 0.25rem;
        color: #fff;
        font-weight: 700;
        padding: 0.125rem 0;
        @media (max-width: 800px) {
          font-size: 14px;
          margin: 6px 0;
        }
      }
      > div:nth-child(3) {
        margin-bottom: 0.1875rem;
        p {
          font-size: 0.175rem;
          font-weight: 500;
          color: #747271;
          margin-bottom: 0.025rem;
        }
        > div {
          font-size: 0.275rem;
          font-weight: 700;
          color: #fff;
          > span:nth-child(1) {
            color: #ef08ef;
          }
          > span:nth-child(2) {
            color: #0fe8e7;
          }
        }
        @media (max-width: 800px) {
          p {
            font-size: 12px;
          }
          > div {
            font-size: 14px;
          }
        }
      }
      > div:nth-child(4) {
        display: flex;
        margin-bottom: 0.125rem;
        > div:nth-child(1) {
          margin-right: 0.625rem;
        }
        div {
          display: flex;
          flex-direction: column;
          margin-bottom: 0.1rem;
          p {
            font-size: 0.175rem;
            font-weight: 500;
            color: #747271;
            margin-bottom: 0.05rem;
          }
          span {
            font-size: 0.2rem;
            color: #89e80f;
          }
        }
        @media (max-width: 800px) {
          margin: 10px 0;
          div {
            height: auto;
            display: flex;
            flex-direction: column;
            p {
              font-size: 12px;
            }
            span {
              font-size: 12px;
            }
          }
        }
      }
      > div:nth-child(5) {
        border-bottom: 0.0125rem solid #595959;
        padding-bottom: 0.1875rem;
        p {
          font-size: 0.175rem;
          font-weight: 700;
          // height:.7875rem;
          color: #fff;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 3;
          @media (max-width: 800px) {
            font-size: 14px;
          }
        }
        @media (max-width: 800px) {
          padding-bottom: 15px;
        }
      }
      > div:nth-child(6) {
        display: flex;
        justify-content: space-between;
        font-size: 0.175rem;
        color: #ffffff8c;
        padding-top: 0.1875rem;
        @media (max-width: 800px) {
          font-size: 12px;
        }
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
:deep(.el-checkbox__input.is-checked + .el-checkbox__label) {
  color: #ef08ef !important;
}
:deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
  background-color: #ef08ef !important;
  border-color: #ef08ef !important;
}
:deep(.el-statistic__content) {
  font-size: 12px !important;
  .el-statistic__number {
    color: #89e80f !important;
  }
}
</style>