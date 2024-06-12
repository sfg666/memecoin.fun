<template>
  <div class="Details">
    <webbar />
    <div>
      <span @click="goback" style="cursor: pointer">[go back]</span>
    </div>
    <div>
      <div class="info" v-if="windowWidth >= 800 || cut_m">
        <div class="introduce">
          <div>
            <img v-if="ProjectDetails.image" :src="ProjectDetails.image" alt="" />
            <div>
              <div>
                <div>MOBYDICK</div>
              </div>
              <div @click="toUserDetails(UserInfo.address)">
                <img v-if="UserInfo.image" :src="UserInfo.image" alt="">
                {{ UserInfo.name }}
              </div>
              <p>{{ ProjectDetails.name }}</p>
              <div>
                <span v-if="ProjectDetails.twitter != ''">
                  <a :href="ProjectDetails.twitter" target="_blank">Twitter</a>
                </span>
                <span v-if="ProjectDetails.telegram != ''">
                  <a :href="ProjectDetails.telegram" target="_blank"
                    >telegram</a
                  >
                </span>
                <span v-if="ProjectDetails.website != ''">
                  <a :href="ProjectDetails.website" target="_blank">Website</a>
                </span>
              </div>
            </div>
          </div>
          <p class="address">{{ ProjectDetails.MintPda }}</p>
          <p class="time">{{ ProjectDetails.updateTime }}</p>
          <p class="describe">
            {{ ProjectDetails.descr }}
          </p>
          <div class="distribution">
            <h5>Pre-sale token allocation:</h5>
            <p>
              50% (i.e. 500 million tokens) will be used for pre-sale. You can choose one of the following fundraising amounts during pre-sale: 20
SOL, 50 SOL or 100 SOL. The initial price of the token is determined by the fundraising amount selected.
Liquidity pool allocation: 49.125% of the tokens will enter the Raydium liquidity pool (LP) in the future.
When entering the LP, a handling fee of 1.75% (platform income) will be deducted, that is: 50% - 50% * 1.75% =
49.125% of the tokens will enter Raydium.
            </p>
          </div>
          <div class="distribution">
            <h5>Liquidity pool allocation:</h5>
            <p>
              49.125% of the tokens will enter the Raydium liquidity pool (LP) in the future.
When entering the LP, a handling fee of 1.75% (platform income) will be deducted, that is: 50% - 50% * 1.75% =
49.125% of the tokens will enter Raydium.
            </p>
          </div>
        </div>
        <div class="cut">
          <span @click="cut = false" :class="{ dis: !cut }">Thread</span>
          <span @click="cut = true" :class="{ dis: cut }">Trades</span>
        </div>
        <div class="Thread" v-if="!cut">
          <div v-for="item in Get_Comments" @click="author = item.parent" :key="item" class="item" :class="{'dis':author == item.id}">
            <div>
              <img v-if="item.userDetail" :src="item.userDetail.image" alt="" />
              <div>#{{item.id}}</div>
              <p>{{TimeConversion(item.createTime)}}</p>
              <span style="cursor: pointer;" @click="reply(item.id)">[reply]</span>
            </div>
            <div>
              <img v-if="item.image" :src="item.image" alt="" />
              <p>
                {{item.content}}
              </p>
            </div>
          </div>
          <div class="reply" @click="Postreply = true">[Post a reply]</div>
        </div>
        <div class="Trades" v-else>
          <div>
            <span>Account</span>
            <!-- <span class="money">SOL</span> -->
            <span>Token name </span>
            <span>date</span>
            <span>Transaction</span>
          </div>
          <div class="list" v-for="(item,index) in recordList" :key="index">
            <div>
              <img :src="item.userDetail.image" alt="" />
              <p>{{keepFirstSixCharacters(item.buyerAddress)}}</p>
            </div>
            <!-- <span class="money">0.001</span> -->
            <span>{{item.amount/100000/1000}}K</span>
            <span>{{formatTimeAgo(item.createTime)}}</span>
            <span style="cursor: pointer;" @click="tosolscan(item.buyerAddress)">{{ keepFirstSixCharacters(item.buyerAddress) }}</span>
          </div>
        </div>
      </div>
      <div class="buy" v-if="windowWidth >= 800 || !cut_m">
        <div class="budget" v-if="!over && ProjectDetails.remind > 0">
          <h3 style="color: #fff">Presale Ends In</h3>
          <div>
            <el-countdown
              value-style="color: #fff"
              format="HH:mm:ss"
              :value="sj(ProjectDetails.expireTime)"
            />
          </div>
          <div>
            <el-progress
              :text-inside="true"
              :stroke-width="24"
              :percentage="proportion(ProjectDetails.remind)"
              status="success"
            />
          </div>
          <div>
            <span>{{ Solquantity() }}sol</span>
            <span
              >{{
                ProjectDetails.price == 0
                  ? 20
                  : ProjectDetails.price == 1
                  ? 50
                  : 100
              }}sol</span
            >
          </div>
          <div>
            <span>Amount</span>
            <span>{{ solBalance }} SOL</span>
          </div>
          <div>
            <input type="text" @input="Calculatesol" v-model="Amount" />
            <span style="cursor: pointer;" @click="max2">MAX</span>
          </div>
          <div>
           {{money}}  {{ ProjectDetails.name  }}
          </div>
          <div>
            <div>
              <span @click="AmountDisplay(0.1)">0.1sol</span>
            <span @click="AmountDisplay(0.2)">0.2sol</span>
            <span @click="AmountDisplay(1)">1sol</span>
            <span @click="AmountDisplay(2)">2sol</span>
            </div>
            <div>{{ ataBalance }} {{ ProjectDetails.name }}</div>
          </div>
          <div
            class="an"
            @click="CreateCoin"
            v-if="Address"
            v-loading="loading"
          >
            Buy
          </div>
          <div class="wallet_an" v-else>
            <wallet-multi-button dark></wallet-multi-button>
          </div>
          <div class="an" @click="refund" v-if="0">refund</div>
        </div>
        <div class="refund" v-if="over && ProjectDetails.remind > 0">
          <p class="p1">Presale Ends In {{over}}</p>
          <p class="p2">This pool is not filled yet</p>
          <div>
            <div>
              <span>Amount</span>
              <span>{{ ataBalance }} {{ ProjectDetails.name }}</span>
            </div>
            <div>
              <el-input
                v-model="refundAmount"
                @input="cf"
                placeholder="Please input"
              />
              <!-- <input type="text" @input ="cf"  v-model="refundAmount "/> -->
              <span @click="MAX"> MAX </span>
            </div>
          </div>
          <div>
            <div>
              <span>Amount</span>
              <span>{{ solBalance }} sol</span>
            </div>
            <div>
              <el-input
                v-model="refundSolAmount"
                disabled
                placeholder="Please input"
              />
              <!-- <input type="text"   v-model="refundSolAmount" /> -->
            </div>
          </div>
          <div class="an" v-if="Address" @click="refund" v-loading="loading2">Refund</div>
          <div class="wallet_an" v-else>
            <wallet-multi-button dark></wallet-multi-button>
          </div>
        </div>
        <div class="complete" v-if="ProjectDetails.poolId != '' && ProjectDetails.poolId != 'undentif'">
          <div>
            <el-progress
              :text-inside="true"
              :stroke-width="24"
              :percentage="proportion(ProjectDetails.remind)"
              status="success"
            />
          </div>
          <div>
            <span>{{ ProjectDetails.price == 0
                  ? 20
                  : ProjectDetails.price == 1
                  ? 50
                  : 100 }}sol</span>
            <span
              >{{
                ProjectDetails.price == 0
                  ? 20
                  : ProjectDetails.price == 1
                  ? 50
                  : 100
              }}sol</span>
          </div>
          <div>This pool has been filled</div>
          <p>Pool created. Trade <a target="_blank" :href="url">$GNCAT</a> on Raydium NOW!</p>
        </div>
        <div class="RankingList" v-if="purchase_List != ''">
          <h2>Holder distribution</h2>
          <div v-for="(item,index) in purchase_List" :key="index"  @click="tosolscan(item.account.data.parsed.info.owner)">
            <p v-if="calculatePercentage(item.account.data.parsed.info.tokenAmount.uiAmount) >0">{{ keepFirstSixCharacters(item.account.data.parsed.info.owner) }}</p>
            <span v-if="calculatePercentage(item.account.data.parsed.info.tokenAmount.uiAmount) > 0">{{item.account.data.parsed.info.tokenAmount.uiAmount}}</span>
            <span v-if="calculatePercentage(item.account.data.parsed.info.tokenAmount.uiAmount) > 0">{{ calculatePercentage(item.account.data.parsed.info.tokenAmount.uiAmount) }}%</span>
          </div>
        </div>
      </div>
    </div>
    <div class="navigation" v-if="windowWidth < 800">
      <span @click="cut_m = true">[info]</span>
      <span @click="cut_m = false">[buy]</span>
    </div>
    <el-dialog v-model="Postreply" center width="800">
      <div class="Postreply">
        <div>
          <span>add a comment</span>
          <textarea v-model="comment" name="" id="" cols="30" rows="10"></textarea>
        </div>
        <div>
          <span>image(optional)</span>
          <el-upload
            ref="upload"
            class="upload-demo"
            action="https://memecoin.fun/tu/pic/private/v1/file-service/upload/s3"
            :limit="1"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <template #trigger>
              <el-button type="primary">select file</el-button>
            </template>
            <template #tip>
              <div class="el-upload__tip text-red">
                limit 1 file, new file will cover the old file
              </div>
            </template>
          </el-upload>
        </div>
        <div class="btns">
          <div @click="create(null)">post reply</div>
          <div @click="Postreply = false">[cance]</div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import webbar from "@/components/WebBar.vue";
import { ElMessage, ElNotification } from "element-plus";
import { Plus } from "@element-plus/icons-vue";
import { ref, getCurrentInstance, onMounted, watch, onUnmounted } from "vue";
import * as anchor from "@project-serum/anchor";
import { useWallet } from "solana-wallets-vue";
import { toPublicKey, Metaplex, sol } from "@metaplex-foundation/js";
import ido from "@/util/contracts/ioc.json";
import { get, post } from "../util/axios";
import { AnchorProvider, BN, web3 } from "@project-serum/anchor";
import { WalletMultiButton } from "solana-wallets-vue";
import * as CryptoJS from 'crypto-js';
import BigNumber from 'bignumber.js';
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
import {
  TOKEN_PROGRAM_ID
} from "@solana/spl-token";
let Amount = ref("");
let CurrencyAmount = ref("");
let { proxy } = getCurrentInstance();
let diz = ref(proxy.$route.query.address);
let cut = ref(false);
let cut_m = ref(false);
let windowWidth = ref(window.innerWidth);
let wallets = useWallet();
let url = ref(`https://raydium.io/swap/?inputMint=So11111111111111111111111111111111111111112&outputMint=${diz.value}`)
let Address = ref(
  wallets.publicKey.value == null ? null : wallets.publicKey.value.toString()
);
let Postreply = ref(false);
let loading = ref(false);
let connection = ref(null);
let provider = ref(null);
let author = ref(0)
let money = ref(0)
let contracts = {
  ldc: null,
  ata: null,
};
const sj = (dateString) => {
  const timestamp = Date.parse(dateString);
  if (timestamp <= 0) return 0;
  if (timestamp > 0) return timestamp;
};
const programId = ref("AGAqYVPTrydtAdzLQBt8c1Rp61dHNipmsiCPHyYgMzV");
const tokenProgram2022 = ref("TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb");
let ProjectDetails = ref({});
let over = ref(false);
let Leftoverquantity = ref(0);
let UserInfo = ref({})
const info = () => {
  get(`/api/memecoin/search/${diz.value}`, "")
    .then((res) => {
      ProjectDetails.value = res.returnData.data;
      UserInfo.value = res.returnData.creator
      mintPda.value = toPublicKey(ProjectDetails.value.MintPda);
      memecoinConfig.value = toPublicKey(
        ProjectDetails.value.memecoinConfigPda
      );
      over.value = sjc(ProjectDetails.value.expireTime);
      if (Address.value == null) return;
      init();
      const [memecoinConfigToken] = PublicKey.findProgramAddressSync(
        [
          new Buffer("MEME_COIN"),
          mintPda.value.toBuffer(),
          memecoinConfig.value.toBuffer(),
        ],
        toPublicKey(programId.value)
      );
      connection.value
        .getTokenAccountBalance(memecoinConfigToken)
        .then((balance) => {
          Leftoverquantity.value = Number(balance.value.uiAmount) - 500000000;
        })
        .catch((error) => {
          console.error(error);
        });
    })
    .catch((e) => {
      console.error(e);
    });
};
const value1 = ref(Date.now() + 1000 * 60 * 60 * 24 * 2);
const mintPda = ref(""); //发的代币的地址
const memecoinConfig = ref(""); //发币的时候创建的config地址

let Token_price = ref(0);
let timer = ref(null);
onMounted(() => {
  info();
  GetComments()
  userinfo()
  TransactionRecords()
  timer.value = setInterval(function () {
    info();
    TransactionRecords()
  }, 10000);
  // if (Address.value == null) return;
  // provider.value = new anchor.AnchorProvider(connection, wallets, {
  //   commitment: "processed",
  // });
  // contracts.ldc = new anchor.Program(
  //   ido,
  //   "AGAqYVPTrydtAdzLQBt8c1Rp61dHNipmsiCPHyYgMzV",
  //   provider.value
  // );
  // connection.value = new Connection(clusterApiUrl("devnet"));
});
onUnmounted(() => {
  clearInterval(timer.value);
});
watch(
  () => wallets.publicKey.value,
  (newValue, oldValue) => {
    if (newValue != null) {
      Address.value = newValue.toString();
      info();
      init();
      GetComments()
      userinfo()
      TransactionRecords()
    }
  }
);

const init = () => {
  provider.value = new anchor.AnchorProvider(connection, wallets, {
    commitment: "processed",
  });
  contracts.ldc = new anchor.Program(
    ido,
    "AGAqYVPTrydtAdzLQBt8c1Rp61dHNipmsiCPHyYgMzV",
    provider.value
  );
  connection.value = new Connection(clusterApiUrl("devnet"));
  getBalance();
  getata();
  Token_price.value = ref(Tokenprice(ProjectDetails.value.price));
  purchaseList()
};
//获取ata地址
let ataBalance = ref(0);
const getata = () => {
  try {
    const [buyerTokenAddress] = PublicKey.findProgramAddressSync(
      [
        new Buffer("MEME_COIN"),
        mintPda.value.toBuffer(),
        wallets.publicKey.value.toBuffer(),
      ],
      toPublicKey(programId.value)
    ); //用户用于接受代币的地址
    connection.value
      .getTokenAccountBalance(buyerTokenAddress)
      .then((balance) => {
        ataBalance.value = balance.value.uiAmount;
      })
      .catch((error) => {
        console.error(123,error);
      });
  } catch (error) {
    // ElMessage.error("Network error, please check the network");
  }
};

//查sol余额
let solBalance = ref(0);
const getBalance = async () => {
  const lamports = await connection.value.getBalance(
    wallets.publicKey.value,
    "confirmed"
  );
  solBalance.value = lamports / LAMPORTS_PER_SOL;
};
const goback = () => {
  proxy.$router.push({
    name: "Home",
  });
};
//购买
const CreateCoin = async () => {
  if (
    Amount.value == "" ||
    Amount.value < 0.001 ||
    Amount.value > solBalance.value
  )
    return ElNotification({
      title: "invalid amount",
      message: "please enter a valid amount to trade.",
      position: "bottom-right",
      duration: 8000,
    });
    let ye = ProjectDetails.value.price == 0
                  ? 20
                  : ProjectDetails.value.price == 1
                  ? 50
                  : 100
    if(Amount.value > (ye - Solquantity()))  return ElNotification({
      title: "invalid amount",
      message: "please enter a valid amount to trade.",
      position: "bottom-right",
      duration: 8000,
    });
  if (loading.value) return;
  loading.value = true;
  const timestamp = Date.now();
  const hashs = Address.value + timestamp;
  const [memecoinConfigToken] = PublicKey.findProgramAddressSync(
    [
      new Buffer("MEME_COIN"),
      mintPda.value.toBuffer(),
      memecoinConfig.value.toBuffer(),
    ],
    toPublicKey(programId.value)
  ); //合约控制的该代币的地址
  const [buyerTokenAddress] = PublicKey.findProgramAddressSync(
    [
      new Buffer("MEME_COIN"),
      mintPda.value.toBuffer(),
      wallets.publicKey.value.toBuffer(),
    ],
    toPublicKey(programId.value)
  ); //用户用于接受代币的地址
  try {
    const hash = await contracts.ldc.methods
      .buyMemecoin(
        hashs,
        new BN(
          Number(Amount.value / Tokenprice(ProjectDetails.value.price)) * 1e6
        )
      )
      .accounts({
        memecoinConfig: memecoinConfig.value,
        memecoinConfigToken: memecoinConfigToken,
        buyerToken: buyerTokenAddress,
        token2022Program: toPublicKey(tokenProgram2022.value),
        buyer: wallets.publicKey.value,
        mint: mintPda.value,
      })
      .rpc();
    ElNotification({
      title: "Successful",
      message: "Transaction successful.",
      position: "bottom-right",
      duration: 8000,
    });
    loading.value = false;
    Amount.value = "";
    money.value = ''
  } catch (error) {
    ElNotification({
      title: "error",
      message: "Network error, please check the network.",
      position: "bottom-right",
      duration: 8000,
    });
    loading.value = false;
  }
};
//退款
let refundAmount = ref("");
let refundSolAmount = ref("");
let loading2 = ref(false)
const refund = async () => {
  if (
    refundAmount.value == "" ||
    refundAmount.value < 1 ||
    refundAmount.value > ataBalance.value
  )
    return ElNotification({
      title: "invalid amount",
      message: "please enter a valid amount to trade.",
      position: "bottom-right",
      duration: 8000,
    });
    if(loading2.value) return
    loading2.value = true
  const [memecoinConfigToken] = PublicKey.findProgramAddressSync(
    [
      new Buffer("MEME_COIN"),
      mintPda.value.toBuffer(),
      memecoinConfig.value.toBuffer(),
    ],
    toPublicKey(programId.value)
  );
  const [buyerTokenAddress] = PublicKey.findProgramAddressSync(
    [
      new Buffer("MEME_COIN"),
      mintPda.value.toBuffer(),
      wallets.publicKey.value.toBuffer(),
    ],
    toPublicKey(programId.value)
  );
  try {
    const hash = await contracts.ldc.methods
      .claimLamports(new BN(Number(refundAmount.value) * 1e6))
      .accounts({
        memecoinConfig: memecoinConfig.value,
        memecoinConfigToken: memecoinConfigToken,
        claimerToken: buyerTokenAddress,
        mint: mintPda.value,
        token2022Program: toPublicKey(tokenProgram2022.value),
      })
      .rpc();
    loading2.value = false
    ElNotification({
      title: "successful",
      message: "Refund successful.",
      position: "bottom-right",
      duration: 8000,
    });
    refundAmount.value = "";
    refundSolAmount.value = "";
  } catch (error) {
    loading2.value = false
    ElNotification({
      title: "error",
      message: "Network error, please check the network.",
      position: "bottom-right",
      duration: 8000,
    });
  }
};
//获取代币列表
// const getHolderAddresses = async ()=>{
//   try {
//     console.log('里面有什么方法',connection.value.getProgramAccounts);
//   const accounts = await connection.value.getProgramAccounts(toPublicKey(mintPda.value), {
//       commitment: 'confirmed', // 根据需要选择commitment级别
//     });
//     console.log(accounts);
//     const holderAddresses = accounts.map(account => {
//       // 解析每个账户数据，确定它是否是一个代币账户
//       // 这里需要根据SPL代币的标准格式来解析
//       // 例如，对于SPL-Token，你可以检查账户的前缀是否符合要求
//       // 并提取出关联的代币账户地址
//       // ...
//       return account.pubkey;
//     });
//     console.log('代币地址',holderAddresses);
//     return holderAddresses;
//   }catch (error) {
//     console.error('获取持币地址失败:', error);
//     return [];
//   }
// }

//技术代币价格
const Tokenprice = (TotalAmount) => {
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
  let price =  new BigNumber(sol).dividedBy(new BigNumber('500000000'));
  return Number(price.toString());
};
const AmountDisplay = (e) => {
  Amount.value = e;
  let ye = ProjectDetails.value.price == 0
                  ? 20
                  : ProjectDetails.value.price == 1
                  ? 50
                  : 100
  let ac = new BigNumber(e).dividedBy((new BigNumber(ye).dividedBy(new BigNumber(500000000)))) 
  console.log(ac.toNumber());
  money.value = ac.toNumber()
};
const Calculatesol = (e) => {
  console.log('--------',e);
  console.log(Amount.value);
  if(Amount.value == '') return  money.value = 0
  let ye = ProjectDetails.value.price == 0
                  ? 20
                  : ProjectDetails.value.price == 1
                  ? 50
                  : 100
  let ac = new BigNumber(Amount.value).dividedBy((new BigNumber(ye).dividedBy(new BigNumber(500000000)))) 
  console.log(ac.toNumber());
  money.value = ac.toNumber()
};
const proportion = (RemainingQuantity) => {
  if (Leftoverquantity.value) {
    let sl = 500000000 - Number(Leftoverquantity.value);
    if (sl == 0) return 0;
    return (Number(sl) / 500000000) * 100;
  } else {
    let sl = 500000000000000 - Number(RemainingQuantity);
    if (sl == 0) return 0;
    return (Number(sl) / 500000000000000) * 100;
  }
};
const Solquantity = () => {
  if (Leftoverquantity.value == 0) {
    return (
      Tokenprice(ProjectDetails.value.price) *
      ((new BigNumber('500000000000000').minus(new BigNumber(ProjectDetails.value.remind))) / 1000000)
    );
  } else {
    return (
      Tokenprice(ProjectDetails.value.price) *
      (new BigNumber('500000000').minus(new BigNumber(Leftoverquantity.value)))
    );
  }
};
const sjc = (dateString) => {
  const timestamp = Date.parse(dateString);
  const currentTimestamp = Date.now();
  if (currentTimestamp > timestamp) return true;
  if (currentTimestamp < timestamp) return false;
};
const cf = (e) => {
  refundSolAmount.value = e * Tokenprice(ProjectDetails.value.price);
};
const MAX = () => {
  refundAmount.value = ataBalance.value;
  refundSolAmount.value =
    ataBalance.value * Tokenprice(ProjectDetails.value.price);
};
const formatNumberToFourDecimalPlaces = (number) => {
  return number.toFixed(4);
};
const toUserDetails = (address) => {
  proxy.$router.push({
    name: "UserDetails",
    query: {
      address: address,
    },
  });
};
let purchase_List  = ref([])
const purchaseList = async()=>{
  const accounts = await connection.value.getParsedProgramAccounts(
      new PublicKey(TOKEN_PROGRAM_ID),
      {
        commitment: 'confirmed',
        filters: [
          {
            memcmp: {
              offset: 0,
              bytes: diz.value,
            },
          },
          {
            dataSize: 165, // Token账户的数据大小
          },
        ],
      
      }
    );
    purchase_List.value = accounts
    console.log('数据',purchase_List.value);
    //    accounts.forEach(account => {
    //        const balance = JSON.stringify(account.account.data.parsed.info);
    //        console.log('好东西',balance)
    // });
}
const keepFirstSixCharacters = (str)=>{
  if (str.length <= 6) {
    return str;
  } else {
    return str.substring(0, 6);
  }
}
const calculatePercentage = (quantity)=>{
  return keepThreeDecimals((Number(quantity)/1000000000)*100)
}
function keepThreeDecimals(number) {
  return Number(number.toFixed(3));
}
const max2 = ()=>{
  let ye = ProjectDetails.value.price == 0
                  ? 20
                  : ProjectDetails.value.price == 1
                  ? 50
                  : 100
  let cs =  Solquantity()
  let surplus = Number(ye) - Number(cs)
  if(surplus > solBalance.value){
    Amount.value = solBalance.value - 0.01
  }else{
    Amount.value = surplus
  }
}
const imageUrl = ref("");
const handleAvatarSuccess = (e) => {
  imageUrl.value = e.Location;
};

const beforeAvatarUpload = (rawFile) => {
  const isType =
    rawFile.type === "image/png" ||
    rawFile.type === "image/jpg" ||
    rawFile.type === "image/jpeg" ||
    rawFile.type === "image/gif";
  // 判断上传图片大小
  const isLt2M = rawFile.size / 1024 / 1024 < 0.2;
  if (!isType) {
    ElNotification({
      title: "error",
      message: "The image format can only be jpg, png, gif, jpeg!",
      position: "bottom-right",
      duration: 8000,
    });
    return false;
  }
  if (!isLt2M) {
    ElNotification({
      title: "error",
      message: "Image size cannot exceed 200kb!",
      position: "bottom-right",
      duration: 8000,
    });
    return false;
  }
  return isType && isLt2M;
};
let comment = ref('')
let upload = ref(null)
const create = (parent)=>{ 
  if(comment.value == '') return
  let data = {}
  if(Address.value == null){
    data = {
    user:encrypt(localStorage.getItem('Address')),
    parent:id.value,
    content:comment.value,
    mint:diz.value,
    image:imageUrl.value
  }
  }else{
    data = {
    user:encrypt(Address.value),
    parent:id.value,
    content:comment.value,
    mint:diz.value,
    image:imageUrl.value
  }
  }
  post(
    `/api/reply/create`,
    data
  )
    .then((res) => {
      GetComments()
      imageUrl.value = ''
      comment.value = ''
      upload.value.clearFiles()
      Postreply.value = false
    })
    .catch((e) => {
      console.error(e);
    });
}
const encrypt = (word)=>{
      return CryptoJS.AES.encrypt(word, 'your-secret-key').toString()
}
let Get_Comments = ref([])
const GetComments = ()=>{
  get(
    `/api/reply/${diz.value}`,
    ''
  )
    .then((res) => {
      Get_Comments.value = res.returnData
    })
    .catch((e) => {
      console.error(e);
    });
}
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
const TimeConversion = (timestamp )=>{
  const date = new Date(timestamp);
  const localTime = date.toLocaleString(); 
  return localTime
}
let id = ref(null)
const reply = (ids)=>{
  Postreply.value = true
  id.value = ids
  comment.value = `#${ids}`
}
const tosolscan = (e)=>{
  let url = `https://solscan.io/account/${e}`
  window.open(url);
}
let recordList = ref([])
const TransactionRecords = ()=>{
  get(
    `/api/person/logs/${diz.value}/1/1/30`,
    ''
  )
    .then((res) => {
      recordList.value = res.returnData
      console.log('交易记录',res.returnData);
    })
    .catch((e) => {
      console.error(e);
    });
}
const formatTimeAgo = (timestamp)=>{
  const now = new Date();
  const time = new Date(timestamp);
  const diff = Math.round((now - time) / 1000); // 计算时间差，单位为秒

  if (diff < 60) {
    return diff + "s ago"; // 不足1分钟
  } else if (diff < 3600) {
    const minutes = Math.floor(diff / 60);
    return minutes + "m ago"; // 不足1小时
  } else if (diff < 86400) {
    const hours = Math.floor(diff / 3600);
    return hours + "h ago"; // 不足1天
  } else {
    const days = Math.floor(diff / 86400);
    return days + "d ago"; // 大于等于1天
  }
}
</script>

<style lang="less" scoped>
.Details {
  height: auto;
  background-color: #000;
  padding-bottom: 0.625rem;
  @media (max-width: 800px) {
    padding-bottom: 60px;
  }
  > div:nth-child(2) {
    font-weight: 700;
    font-size: 0.3rem;
    text-align: center;
    color: #ef08ef;
    margin-top: 1.25rem;
    margin-bottom: 0.75rem;
    @media (max-width: 800px) {
      font-size: 16px;
    }
  }
  > div:nth-child(3) {
    width: 90%;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    .info {
      width: 60%;
      @media (max-width: 800px) {
        width: 100%;
      }
      .introduce {
        background-color: #232222;
        padding: 0.5rem;
        box-sizing: border-box;
        border: 0.0375rem solid #969696;
        border-radius: 0.05rem;
        > div:nth-child(1) {
          display: flex;
          img {
            width: 1.5rem;
            height: 1.5rem;
            @media (max-width: 800px) {
              width: 100px;
              height: 100px;
            }
          }
          > div {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            margin-left: 0.5rem;
            > div:nth-child(1) {
              width: 120px;
              padding-right: 4px;
              border-radius: 0.225rem;
              background: linear-gradient(to right top, #9845fefc, #28e2b7);
              @media (max-width: 800px) {
                width: 100px;
                border-radius: 16px;
              }
              > div {
                padding: 0.0625rem 0.125rem;
                background-color: #fff;
                font-size: 0.175rem;
                font-weight: 600;
                border-radius: 0.225rem;
                box-sizing: border-box;
                text-align: center;
                @media (max-width: 800px) {
                  width: 100px;
                  font-size: 12px;
                  border-radius: 16px;
                  height: 25px;
                  line-height: 25px;
                }
              }
            }
            >div:nth-child(2){
              display: flex;
              align-items:center;
              color: #fff;
              padding-top: .1875rem;
              font-size: .3rem;
              @media (max-width: 800px) {
                padding: 5px 0;
              }
             
              cursor: pointer;
              img{
                border-radius: 50%;
                @media (max-width: 800px) {
                  width: 20px;
                  height: 20px;
                  margin-right: 6px;
                }
                width: .375rem;
                height: .375rem;
                margin-right: .125rem;
              }
              @media (max-width: 800px) {
                font-size: 12px;
                }
                
            }
            p {
              font-size: 0.4rem;
              font-weight: 700;
              color: #fff;
            }
            > div:nth-child(4) {
              display: flex;
              align-items: center;
              span {
                font-size: 0.175rem;
                color: #fff;
                margin-right: 0.5rem;
                @media (max-width: 800px) {
                  font-size: 12px;
                }
              }
              
            }
            @media (max-width: 800px) {
              > div:nth-child(1) {
                // width: 70%;
                // height: 30px;
                line-height: 30px;
                font-size: 12px;
                font-weight: 700;
              }
              > p {
                font-size: 14px;
              }
              > div:nth-child(3) {
                > span {
                  font-size: 12px;
                }
              }
            }
          }
        }
        .address {
          font-size: 0.2rem;
          color: #fff;
          font-weight: 500;
          margin-top: 0.375rem;
          @media (max-width: 800px) {
            font-size: 10px;
          }
        }
        .time {
          font-size: 0.2rem;
          color: #6b6b6b;
          font-weight: 500;
          margin-top: 0.125rem;
          @media (max-width: 800px) {
            font-size: 12px;
          }
        }
        .describe {
          font-size: 0.2rem;
          color: #fff;
          font-weight: 400;
          margin: 0.1875rem 0;
          @media (max-width: 800px) {
            font-size: 12px;
            margin-bottom: 10px;
          }
        }
        .distribution {
          margin-bottom: 0.1875rem;
          h5 {
            font-size: 0.2rem;
            color: #fff;
            font-weight: 400;
            @media (max-width: 800px) {
              font-size: 12px;
            }
          }
          p {
            font-size: 0.2rem;
            color: #fff;
            font-weight: 400;
            @media (max-width: 800px) {
              font-size: 12px;
            }
          }
        }
      }
      .cut {
        display: flex;
        align-items: center;
        margin: 0.5rem 0 0.25rem 0;
        @media (max-width: 800px) {
          margin-bottom: 15px;
          margin-top: 30px;
        }
        span {
          margin-right: 0.125rem;
          font-size: 0.175rem;
          color: #fff;
          font-weight: 600;
          display: inline;
          margin-right: 0.75rem;
          padding: 0.0625rem 0.25rem;
          border-radius: 0.2rem;
          cursor: pointer;
          @media (max-width: 800px) {
            font-size: 12px;
            padding: 5px 20px;
          }
        }
        .dis {
          background-color: #232222;
        }
      }
      .Thread {
        .dis{
          border: 1px solid #ef08ef;
        }
        .item {
          background-color: #232222;
          padding: 0.125rem;
          box-sizing: border-box;
          margin-bottom: 0.125rem;
          @media (max-width: 800px) {
            padding: 10px;
            margin-bottom: 10px;
          }
          > div:nth-child(1) {
            display: flex;
            align-items: center;
            margin-bottom: 0.125rem;
            img {
              width: 0.3rem;
              height: 0.3rem;
              margin-right: 0.075rem;
              @media (max-width: 800px) {
                width: 25px;
                height: 25px;
              }
            }
            > div {
              font-size: 0.15rem;
              color: #fff;
              padding: 0.025rem 0.125rem;
              border-radius: 0.025rem;
              background-color: #ef08ef;
              margin-right: 0.075rem;
              @media (max-width: 800px) {
                font-size: 12px;
                margin-left: 5px;
              }
            }
            p {
              font-size: 0.15rem;
              color: #6b6b6b;
              margin-right: 0.075rem;
              @media (max-width: 800px) {
                font-size: 12px;
                margin-left: 5px;
              }
            }
            span {
              font-size: 0.15rem;
              color: #fff;
              margin-right: 0.075rem;
              @media (max-width: 800px) {
                font-size: 12px;
                margin-left: 5px;
              }
            }
          }
          > div:nth-child(2) {
            display: flex;
            @media (max-width: 800px) {
              margin-top: 10px;
            }
            > img {
              width: 1.25rem;
              height: 1.25rem;
              @media (max-width: 800px) {
                width: 50px;
                height: 50px;
                margin-right: 6px;
              }
            }
            p {
              font-size: 0.175rem;
              color: #fff;
              margin-left: 0.1875rem;
              @media (max-width: 800px) {
                font-size: 12px;
              }
            }
          }
        }
        .reply {
          font-size: 16px;
          font-weight: 700;
          color: #fff;
          text-align: center;
          margin-top: 20px;
        }
      }
      .Trades {
        > div:nth-child(1) {
          background-color: #232222;
          padding: 0.125rem;
          box-sizing: border-box;
          margin-bottom: 0.125rem;
          span {
            width: 20%;
            display: inline-block;
            color: #fff;
            font-size: 0.175rem;
            @media (max-width: 800px) {
              font-size: 12px;
            }
          }
          > span:nth-child(1) {
            width: 25%;
          }
          .money {
            width: 15%;
          }
        }
        .list {
          display: flex;
          align-items: center;
          background-color: #232222;
          padding: 0.125rem;
          box-sizing: border-box;
          margin-bottom: 0.125rem;
          @media (max-width: 800px) {
            padding: 10px 5px;
          }
          > div {
            width: 25%;
            display: flex;
            img {
              width: 0.3rem;
              height: 0.3rem;
              @media (max-width: 800px) {
                width: 20px;
                height: 20px;
              }
            }
            p {
              font-size: 0.15rem;
              color: #fff;
              background-color: #ef08ef;
              padding: 0.025rem 0.125rem;
              margin-left: 0.125rem;
              @media (max-width: 800px) {
                width: auto;
                font-size: 10px;
                word-break: break-all;
                border-radius: 2px;
              }
            }
          }
          .money {
            width: 15%;
          }
          span {
            width: 20%;
            display: inline-block;
            color: #fff;
            font-size: 0.175rem;
            @media (max-width: 800px) {
              font-size: 10px;
            }
          }
        }
      }
    }
    .buy {
      width: 36%;
      @media (max-width: 800px) {
        width: 100%;
      }
      :deep(.el-progress-bar__inner) {
        background: linear-gradient(
          to right top,
          #9845fefc,
          #28e2b7
        ) !important;
      }
      .el-progress.is-success .el-progress-bar__inner {
        background: linear-gradient(
          to right top,
          #9845fefc,
          #28e2b7
        ) !important;
      }
      :deep(.el-progress-bar__innerText) {
        display: none;
      }
      :deep(.el-progress-bar__outer) {
        background-color: #434242;
      }
      .budget {
        background-color: #232222;
        padding: 0.5rem;
        box-sizing: border-box;
        border: 0.0375rem solid #969696;
        border-radius: 0.05rem;
        @media (max-width: 800px) {
          padding: 20px;
        }
        h3 {
          font-size: 0.25rem;
          color: #fff;
          text-align: center;
          margin-bottom: 0.3125rem;
          @media (max-width: 800px) {
            font-size: 18px;
          }
        }
        > div:nth-child(2) {
          text-align: center;
          font-size: 0.375rem;
          color: #fff;
          margin-bottom: 0.25rem;
        }
        > div:nth-child(3) {
          margin-bottom: 0.125rem;
        }
        > div:nth-child(4) {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.1875rem;
          span {
            color: #ef08ef;
            font-size: 0.2rem;
            font-weight: 500;
            @media (max-width: 800px) {
              font-size: 16px;
              margin-top: 6px;
            }
          }
          @media (max-width: 800px) {
            margin-bottom: 16px;
          }
        }
        > div:nth-child(5) {
          margin-bottom: 0.1rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          span {
            color: #0fe8e7;
            font-size: 0.2rem;
            font-weight: 500;
            @media (max-width: 800px) {
              font-size: 16px;
            }
          }
        }
        > div:nth-child(6) {
          margin-bottom: 0.125rem;
          position: relative;
          @media (max-width: 800px) {
            height: 35px;
            display: flex;
            align-items: center;
          }
          input {
            width: 100%;
            height: 0.5rem;
            border: 0.0125rem solid #969696;
            background-color: #232222;
            color: #fff;
            padding-left: 0.075rem;

            @media (max-width: 800px) {
              height: 35px;
              font-size: 12px;
            }
          }
          span {
            font-size: 0.2rem;
            color: #0fe8e7;
            font-weight: 500;
            position: absolute;
            right: 0.125rem;
            top: 0.1rem;
            @media (max-width: 800px) {
              font-size: 12px;
              right: 6px;
              top: 8px;
            }
          }
          @media (max-width: 800px) {
            margin-bottom: 6px;
          }
        }
        >div:nth-child(7){
          color: #ef08ef;
          font-size: 0.2rem;
          font-weight: 500;
          margin-bottom: .125rem;
        }
        > div:nth-child(8) {
          margin-bottom: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          @media (max-width: 800px) {
            display: flex;
            align-items: center;
          }
          >div:nth-child(1){
            display: flex;
            align-items: center;
          }
          span {
            display: inline-block;
            padding: 0.025rem 0.125rem;
            font-size: 0.175rem;
            border: 0.0125rem solid #969696;
            color: #fff;
            margin-right: 0.125rem;
            cursor: pointer;
            @media (max-width: 800px) {
              font-size: 12px;
              padding: 2px 10px;
              margin-right: 6px;
            }
          }
          >div:nth-child(2){
            font-size: 0.2rem;
            color: #0fe8e7;
          }
        }
        .an {
          width: 40%;
          margin: 0 auto;
          text-align: center;
          font-size: 0.2rem;
          color: #fff;
          padding: 0.125rem 0.375rem;
          border-radius: 0.125rem;
          background: linear-gradient(to right top, #9845fefc, #28e2b7);
          cursor: pointer;
          @media (max-width: 800px) {
            height: 30px;
            font-size: 14px;
          }
        }
        .wallet_an {
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
      .complete {
        background-color: #232222;
        padding: 0.5rem;
        box-sizing: border-box;
        border: 0.0375rem solid #969696;
        border-radius: 0.05rem;
        > div:nth-child(2) {
          display: flex;
          justify-content: space-between;
          margin-top: 0.25rem;
          span {
            color: #ef08ef;
            font-size: 0.2rem;
            font-weight: 500;
            @media (max-width: 800px) {
              font-size: 16px;
              margin-top: 6px;
            }
          }
        }
        > div:nth-child(3) {
          font-size: 0.2rem;
          font-weight: 500;
          color: #fff;
          text-align: center;
          padding: 0.25rem 0;
          @media (max-width: 800px) {
            font-size: 14px;
            margin-top: 6px;
          }
        }
        > p {
          font-size: 0.2rem;
          font-weight: 500;
          color: #fff;
          text-align: center;
          @media (max-width: 800px) {
            font-size: 14px;
            margin-top: 6px;
          }
          a {
            color: #ef08ef;
          }
        }
      }
      .refund {
        background-color: #232222;
        padding: 0.5rem;
        box-sizing: border-box;
        border: 0.0375rem solid #969696;
        border-radius: 0.05rem;
        .p1 {
          font-size: 0.25rem;
          color: #fff;
          text-align: center;
          margin-bottom: 0.25rem;
          @media (max-width: 800px) {
            font-size: 16px;
          }
        }
        .p2 {
          font-size: 0.25rem;
          color: #fff;
          text-align: center;
          margin-bottom: 0.5rem;
          @media (max-width: 800px) {
            font-size: 16px;
          }
        }
        > div:nth-child(3) {
          > div:nth-child(1) {
            display: flex;
            justify-content: space-between;
            font-size: 0.2rem;
            font-weight: 500;
            color: #0fe8e7;
            @media (max-width: 800px) {
              font-size: 12px;
            }
          }
          > div:nth-child(2) {
            margin-top: 0.125rem;
            position: relative;
            @media (max-width: 800px) {
              font-size: 12px;
              height: 30px;
            }
            input {
              width: 100%;
              height: 0.5rem;
              border: 1px solid #969696;
              background-color: #232222;
              @media (max-width: 800px) {
                font-size: 12px;
                height: 30px;
              }
            }
            span {
              position: absolute;
              right: 0.125rem;
              top: 0.05rem;
              font-size: 0.2rem;
              color: #0fe8e7;
              cursor: pointer;
              @media (max-width: 800px) {
                right: 10px;
                top: 8px;
                font-size: 14px;
              }
            }
          }
        }
        > div:nth-child(4) {
          margin-top: 0.5rem;
          > div:nth-child(1) {
            display: flex;
            justify-content: space-between;
            font-size: 0.2rem;
            font-weight: 500;
            color: #ef08ef;
            @media (max-width: 800px) {
              font-size: 12px;
            }
          }
          > div:nth-child(2) {
            margin-top: 0.125rem;
            @media (max-width: 800px) {
              font-size: 12px;
              height: 30px;
            }
            input {
              width: 100%;
              height: 0.5rem;
              border: 1px solid #969696;
              background-color: #232222;
              @media (max-width: 800px) {
                font-size: 12px;
                height: 30px;
              }
            }
          }
        }
        .an {
          width: 40%;
          margin: 0 auto;
          text-align: center;
          font-size: 0.2rem;
          color: #fff;
          padding: 0.125rem 0.375rem;
          border-radius: 0.125rem;
          background: linear-gradient(to right top, #9845fefc, #28e2b7);
          margin-top: 0.375rem;
          cursor: pointer;
          @media (max-width: 800px) {
            height: 30px;
            font-size: 14px;
            margin-top: 15px;
          }
        }
        .wallet_an {
          margin-top: 0.375rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
      .RankingList {
        margin-top: 0.75rem;
        h2 {
          font-size: 0.25rem;
          font-weight: 500;
          color: #fff;
          margin-bottom: 0.25rem;
          @media (max-width: 800px) {
            font-size: 14px;
          }
        }
        > div {
          display: flex;
          justify-content: space-between;
          font-size: 0.2rem;
          color: #fff;
          margin-bottom: 0.125rem;
          cursor: pointer;
          @media (max-width: 800px) {
            font-size: 12px;
          }
        }
      }
    }
  }
  .navigation {
    width: 100%;
    height: 50px;
    background-color: #5c5f66;
    position: fixed;
    left: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: space-around;
    span {
      font-size: 16px;
      font-weight: 700;
    }
  }
  :deep(.swv-button-trigger) {
    // background-color:#505050;
    height: 40px;
  }
}
input {
  color: #fff;
  outline: none;
  font-size: 12px;
}
:deep(.el-input__wrapper) {
  background-color: #232222;
  color: #fff;
}
:deep(.el-input) {
  outline: none;
  color: #fff;
  .el-input__wrapper:hover {
    box-shadow: none;
    color: #fff;
  }
  .el-input__inner {
    color: #fff;
  }
}
:deep(.el-input__wrapper) {
  box-shadow: none;
  border: 1px solid #969696;
  outline: none;
}
:deep(.el-loading-mask) {
  background: #ffffff59;
  .path {
    stroke: #ef08ef;
  }
}
:deep(.el-dialog) {
  background-color: #1b1d28;
  border-radius: 10px;
  border: 1px solid #ccc;
  padding: 30px;
  width: 6.25rem;
  @media (max-width: 800px) {
    width: 90%;
  }
  .el-dialog__title {
    color: #fff;
  }
  p:nth-child(1) {
    font-size: 16px;
    margin-bottom: 15px;
    color: #ffffffc4;
  }
  .btns {
    margin-top: 20px;
    > div:nth-child(1) {
      width: 100%;
      height: 35px;
      background: linear-gradient(to right top, #9845fe, #4aaace, #1bf79f);
      border-radius: 4px;
      text-align: center;
      line-height: 35px;
      color: #fff;
      cursor: pointer;
    }
    > div:nth-child(2) {
      text-align: center;
      margin-top: 15px;
      cursor: pointer;
      color: #fff;
    }
    > div:nth-child(2):hover {
      transform: scale(1.2);
    }
  }

  // .btns:hover{
  //   transform: scale(1.2);
  // }
  .Postreply {
    > div:nth-child(1) {
      display: flex;
      flex-direction: column;
    }
    > div {
      > span {
        margin-bottom: 5px;
        display: inline-block;
        color: #5fa4f9;
      }
    }
    textarea {
      background-color: #2a2a3b;
      height: 100px;
      margin-bottom: 15px;
      color: #fff;
    }
  }
}
:deep(.el-button) {
  background-color: #2a2a3b !important;
  border: none !important;
}
// .el-upload-list__item
:deep(.el-progress) {
  top: 0px !important;
}
:deep(.el-input__wrapper) {
  background-color: #232222 !important;
}
</style>