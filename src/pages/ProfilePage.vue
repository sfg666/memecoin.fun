<template>
  <div class="Home">
    <!-- <app-bar
          class="block"
          @child-event="parentMethod"
          @child-event2="parentMethod2"
        ></app-bar> -->
    <webbar />
    <div class="subject">
      <div>
        <img v-if="user_info.image" :src="user_info.image" alt="" />
      </div>
      <div>
        <div v-if="user_info.name == ''">@{{keepFirstSixCharacters(user_info.address || Address2)}}</div>
        <div v-else>{{user_info.name }}</div>
        <P>{{Follow_Me.length}} followers</P>
        <P>{{ user_info.bio }}</P>
        <div @click="InfoModification = true">Edit profile</div>
        <div>
          <!-- <p>Likes received: 0</p>
          <p>Mentions received: 0</p> -->
        </div>
        <div class="address">{{ Address ||  Address2}}</div>
        <a :href="`https://solscan.io/account/${Address}`" target="_blank">View on solscan ↗</a>
      </div>
    </div>
    <div class="screen">
      <span @click="cut(1)" :class="{'dis':cutdetails==1}">Coins held</span>
      <span @click="cut(2)" :class="{'dis':cutdetails==2}">Replies</span>
      <span @click="cut(3)" :class="{'dis':cutdetails==3}">Notifications</span>
      <span @click="cut(4)" :class="{'dis':cutdetails==4}">Coins created</span>
      <span @click="cut(5)" :class="{'dis':cutdetails==5}">followers</span>
      <span @click="cut(6)" :class="{'dis':cutdetails==6}">following</span>
    </div>
    <div class="list" v-if="cutdetails == 1">
      <div
        @click="toDetails(item.MintPda)"
        v-for="item in buylist"
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
            <p>{{ truncateString(item.MintPda) }}{{ over }}</p>
            <span v-if="!sjc(item.expireTime) && item.remind == 0">complete</span>
            <span v-if="!sjc(item.expireTime) && item.remind > 0">afoot</span>
            <span v-if="sjc(item.expireTime)">expire</span>
          </div>
        </div>
      </div>
    </div>
    <div class="list" v-if="cutdetails == 4">
      <div
        @click="toDetails(item.MintPda)"
        v-for="(item,index) in establishlist"
        :key="index"
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
            <p>{{ truncateString(item.MintPda) }}{{ over }}</p>
            <span v-if="!sjc(item.expireTime) && item.remind == 0">complete</span>
            <span v-if="!sjc(item.expireTime) && item.remind > 0">afoot</span>
            <span v-if="sjc(item.expireTime)">expire</span>
          </div>
        </div>
      </div>
    </div>
    <div class="following" v-if="cutdetails==6">
      <div v-for="(item,index) in People_Follow" :key="index" @click="toUserDetails(item.userDetail.address)">
        <img :src="item.userDetail.image" alt="">
        <span>{{ item.userDetail.name }}</span>
      </div>
    </div>
    <div class="following" v-if="cutdetails==5" >
      <div v-for="(item,index) in Follow_Me" :key="index" @click="toUserDetails(item.userDetail.address)">
        <img :src="item.userDetail.image" alt="">
        <span>{{ item.userDetail.name }}</span>
      </div>
    </div>
    <el-dialog
      v-model="InfoModification"
      title="Edit profile"
      center
      width="800"
    >
      <p>Profile photo</p>
      <div class="upload" style=" border-radius: 50%;">
        <el-upload
        class="avatar-uploader"
        action="https://memecoin.fun/tu/pic/private/v1/file-service/upload/s3"
        :show-file-list="false"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload"
      >
        <img  v-if="imageUrl" :src="imageUrl" class="tu1" />
        <!-- <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon> -->
        <img v-else :src="user_info.image" class="tu1" alt="" />
      </el-upload>
      <img class="xg" src="../assets/xg.png" alt="">
      </div>
      <div class="Username">
        <span>Username</span>
        <input type="text" v-model="Username"/>
      </div>
      <div class="Bio">
        <span>Bio</span>
        <input type="text" v-model="bio"/>
      </div>
      <div class="btns">
        <span>[close]</span>
        <span @click="modifyinfo">[Save]</span>
      </div>
    </el-dialog>
  </div>
</template>
  
<script setup>
import webbar from "@/components/WebBar.vue";
import { ref, getCurrentInstance, watch,onMounted } from "vue";
import { ElMessage, ElNotification } from "element-plus";
import { useWallet } from "solana-wallets-vue";
import { get, post } from "../util/axios";
import * as CryptoJS from 'crypto-js';
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
import { toPublicKey, Metaplex, sol } from "@metaplex-foundation/js";
let wallets = useWallet();
let Address = ref(
  wallets.publicKey.value == null ? null : wallets.publicKey.value.toString()
);
let Address2 = localStorage.getItem('Address')
if(Address.value != null){
  localStorage.setItem('Address', Address.value);
}

let { proxy } = getCurrentInstance();
let InfoModification = ref(false);
watch(
  () => wallets.publicKey.value,
  (newValue, oldValue) => {
    if (newValue != null) {
      Address.value = newValue.toString();
      buyinfo()
      establishinfo()
      userinfo()
      PeopleFollow()
      FollowMe()
      localStorage.setItem('Address', Address.value);
    }
  }
);
onMounted(()=>{
  buyinfo()
  establishinfo()
  userinfo()
  PeopleFollow()
  FollowMe()
})
const toCoin = () => {
  proxy.$router.push({
    name: "Coin",
  });
};
let imageUrl = ref('')
const handleAvatarSuccess = (e) => {
  imageUrl.value = e.Location
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
let buylist  = ref([])
let over = ref(false);
const buyinfo = () => {
  get(
    `/api/person/1/30/${Address.value}`,
    ""
  )
    .then((res) => {
      buylist.value = res.returnData
    })
    .catch((e) => {
      console.error(e);
    });
};
let establishlist = ref([])
const establishinfo = () => {
  get(
    `/api/person/created/1/30/${Address.value}`,
    ""
  )
    .then((res) => {
      establishlist.value = res.returnData
    })
    .catch((e) => {
      console.error(e);
    });
};
let user_info = ref({})
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
  post(
    `/api/user/get`,
    data
  )
    .then((res) => {
      user_info.value = res
    })
    .catch((e) => {
      console.error(e);
    });
};
let bio = ref('')
let Username = ref('')
const modifyinfo = ()=>{
  let data = {}
  if(Address.value != null){
    data = {
      address:encrypt(Address.value),
      image:imageUrl.value == ''?user_info.value.image:imageUrl.value,
      bio:bio.value==''?user_info.value.bio:bio.value,
      name:Username.value== ''?user_info.value.name:Username.value
    }
  }else{
    data = {
      address:encrypt(localStorage.getItem('Address')),
      image:imageUrl.value == ''?user_info.value.image:imageUrl.value,
      bio:bio.value==""?user_info.value.bio:bio.value,
      name:Username.value== ""?user_info.value.name:Username.value
    }
  }
  post(
    `/api/user`,
    data
  )
    .then((res) => {
      InfoModification.value = false
      bio.value = ''
      imageUrl.value = ''
      
      userinfo()
      // user_info.value = res
      return ElNotification({
      title: "success",
      message: "Successfully modified info.",
      position: "bottom-right",
      duration: 8000,
    });
    })
    .catch((e) => {
      console.error(e);
    });
}
const toDetails = (address) => {
  proxy.$router.push({
    name: "Details",
    query: {
      address: address,
    },
  });
};
const proportion = (SalesVolume, total) => {
  return Number(SalesVolume / total).toFixed(2) * 100;
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
const truncateString = (str) => {
  if (str.length <= 10) {
    return str;
  } else {
    return str.slice(0, 5) + "..." + str.slice(-5);
  }
};
const sj = (dateString) => {
  const timestamp = Date.parse(dateString);
  if (timestamp <= 0) return 0;
  if (timestamp > 0) return timestamp;
};
const sjc = (dateString) => {
  const timestamp = Date.parse(dateString);
  const currentTimestamp = Date.now();
  if (currentTimestamp > timestamp) return true;
  if (currentTimestamp < timestamp) return false;
};
let cutdetails = ref(1)
const cut = (e)=>{
  cutdetails.value = e
}
const keepFirstSixCharacters = (str)=>{
  if (str.length <= 6) {
    return str;
  } else {
    return str.substring(0, 6);
  }
}
const encrypt = (word)=>{
    return CryptoJS.AES.encrypt(word, 'your-secret-key').toString()
  }
const decrypts = (word)=>{
  return  CryptoJS.AES.decrypt(word, 'your-secret-key').toString(CryptoJS.enc.Utf8)
  }
  const programId = ref("AGAqYVPTrydtAdzLQBt8c1Rp61dHNipmsiCPHyYgMzV");
  let ataBalance = ref(0)
  const getata =  (mintPda) => {
    const connection = new Connection(clusterApiUrl("devnet"));
    let aa = toPublicKey(mintPda)
    let ataBalance = 0
  try {
    const [buyerTokenAddress] = PublicKey.findProgramAddressSync(
      [
        new Buffer("MEME_COIN"),
        aa.toBuffer(),
        wallets.publicKey.value.toBuffer(),
      ],
      toPublicKey(programId.value)
    ); //用户用于接受代币的地址
    
    connection
      .getTokenAccountBalance(buyerTokenAddress)
      .then((balance) => {
        ataBalance = balance.value.uiAmount;
        // return balance.value.uiAmount
       
      })
      .catch((error) => {
        console.error(error);
      });
      return ataBalance
  } catch (error) {
    ElMessage.error("Network error, please check the network");
  }
  // console.log('余额',ataBalance);
  
};
let People_Follow = ref([])
const PeopleFollow = ()=>{
  if(Address.value != null)  Address.value = localStorage.getItem('Address')
    get(
      `/api/fellow/get/${Address.value}/1`,
      ''
    )
      .then((res) => {
        People_Follow.value = res.returnData
      })
      .catch((e) => {
        console.error(e);
      });
  }
  let Follow_Me = ref([])
  const FollowMe = ()=>{
    if(Address.value != null)  Address.value = localStorage.getItem('Address')
    get(
      `/api/fellow/get/${Address.value}/0`,
      ''
    )
      .then((res) => {
        Follow_Me.value = res.returnData
      })
      .catch((e) => {
        console.error(e);
      });
  }
  const toUserDetails = (address) => {
  proxy.$router.push({
    name: "UserDetails",
    query: {
      address: address,
      id:'1'
    },
  });
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
  .subject {
    display: flex;
    justify-content: center;
    // align-items: center;
    margin-top: 1.25rem;
    @media (max-width: 800px) {
      width: 90%;
      margin: 0 auto;
      margin-top: 40px;
      // align-items: flex-start;
      flex-direction: column;
    }
    > div:nth-child(1) {
      img {
        width: 2.5rem;
        height: 2.5rem;
      }
      @media (max-width: 800px) {
        // width: 50%;
        // img{
        //   width: 100%;
        // }
        margin-bottom: 10px;
      }
    }
    > div:nth-child(2) {
      display: flex;
      flex-direction: column;
      margin-left: 0.375rem;
      @media (max-width: 800px) {
        margin-left: 0px;
      }
      > div:nth-child(1) {
        font-size: 0.25rem;
        font-weight: 500;
        color: #fff;
        margin-bottom: 0.125rem;
        @media (max-width: 800px) {
          font-size: 12px;
          margin-bottom: 5px;
        }
      }
      > p:nth-child(2) {
        font-size: 0.225rem;
        font-weight: 500;
        color: #fff;
        margin-bottom: 0.125rem;
        @media (max-width: 800px) {
          font-size: 12px;
          margin-bottom: 5px;
        }
      }
      > p:nth-child(3) {
        font-size: .175rem;
        font-weight: 500;
        color: #fff;
        margin-bottom: 0.125rem;
        @media (max-width: 800px) {
          font-size: 12px;
          margin-bottom: 5px;
        }
      }
      > div:nth-child(4) {
        border: 0.0125rem solid #969696;
        width: 1.5rem;
        padding: 0.0625rem 0;
        text-align: center;
        font-size: 0.2rem;
        font-weight: 500;
        color: #6b6b6b;
        margin-bottom: 0.125rem;
        cursor: pointer;
        @media (max-width: 800px) {
          width: 100px;
          font-size: 12px;
          margin-bottom: 5px;
        }
      }
      > div:nth-child(5) {
        display: flex;
        align-items: center;
        font-size: 0.2rem;
        font-weight: 500;
        margin-bottom: 0.125rem;
        @media (max-width: 800px) {
          font-size: 12px;
          margin-bottom: 5px;
        }
        > p:nth-child(1) {
          color: #ef08ef;
          margin-right: 0.1875rem;
          @media (max-width: 800px) {
            margin-right: 16px;
          }
        }
        > p:nth-child(2) {
          color: #0fe8e7;
        }
      }
      .address {
        border: 1px solid #969696;
        padding: 0.0625rem 0.2rem;
        display: inline-block;
        font-size: 0.2rem;
        font-weight: 500;
        color: #6b6b6b;
        margin-bottom: 0.125rem;
        @media (max-width: 800px) {
          font-size: 12px;
          margin-bottom: 5px;
          text-align: center;
        }
      }
      a {
        font-size: 0.15rem;
        font-weight: 500;
        color: #fff;
        @media (max-width: 800px) {
          font-size: 12px;
          margin-bottom: 5px;
        }
      }
    }
  }
  .screen {
    display: flex;
    width: 90%;
    margin: 0 auto;
    margin-top: 1rem;
    @media (max-width: 800px) {
    justify-content: space-between;
    }
    .dis{
      color: #0fe8e7;
    }
    span {
      font-size: 16px;
      color: #fff;
      display: inline-block;
      padding: 0 20px;
      cursor: pointer;
    }
    @media (max-width: 800px) {
      flex-wrap: wrap;
      span {
        padding-left: 0;
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
      height: 5rem;
      @media (max-width: 800px) {
        height: auto;
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
          >div{
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
          >div:nth-child(1){
            border-radius: 16px;
            >div{
              font-size: 12px;
              padding: 5px 10px;
              border-radius: 16px;
            }
          }
          >div:nth-child(2){
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
          p{
            font-size: 12px
          }
          >div{
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
          margin-bottom: .1rem;
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
          div{
            height:auto;
            display: flex;
            flex-direction: column;
            p{
              font-size: 12px
            }
            span{
              font-size: 12px;
            }
          }
        }
      }
      > div:nth-child(5) {
        
       border-bottom: 0.0125rem solid #595959;
       padding-bottom: 0.1875rem;
        p{
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
.following{
  width: 90%;
  margin: 0 auto;
  margin-top: 0.75rem;
  display: flex;
  align-items:center;
  justify-content: center;
  flex-direction: column;
  >div{
    display: flex;
    align-items:center; 
    justify-content: space-between;
    border-bottom: 1px solid #cccccc21;
    padding-bottom: .125rem;
    width: 3.75rem;
    text-align:center;
    margin-bottom:.125rem;
    border-radius: .25rem;
    cursor: pointer;
    img{
      width: 40px !important;
      height: 40px !important;
      border-radius: 50%;
    }
    span{
      font-size: .2rem;
      color: #fff;
      margin-left: .25rem;
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
:deep(.el-dialog) {
  background-color: #1b1d28;
  border-radius: 10px;
  border: 1px solid #ccc;
  padding: 30px;
  width: 6.25rem;
  p{
    font-size: 16px;
    color: #fff;
    margin-bottom: 10px;
  }
  .upload{
    width: 100px;
    position: relative;
    .xg{
      width: 25px;
      height: 25px;
      position: absolute;
      right: 0;
      bottom: 0;
    }
  }
  @media (max-width: 800px) {
    width: 90%;
  }
  .el-dialog__title {
    color: #fff;
  }
  .avatar-uploader {
    width: 100px;
    height: 100px;
    border: 1px solid #ccc;
    border-radius: 50%;
  }
  .el-upload {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    .tu1 {
      border-radius: 50%;
    }
  }
  .Username{
    display: flex;
    flex-direction: column;
    margin-bottom: 20px;
    margin-top: 20px;
    span{
      font-size: 16px;
      color: #fff;
      margin-bottom: 10px;
    }
    input{
      width: 100%;
      height: 40px;
      background-color: #1b1d28;
      border: 1px solid #fff;
      color: #fff;
      font-size: 14px;
      padding-left: 10px;
    }
  }
  .Bio{
    display: flex;
    flex-direction: column;
    span{
      font-size: 16px;
      color: #fff;
      margin-bottom: 10px;
    }
    input{
      width: 100%;
      height: 40px;
      background-color: #1b1d28;
      border: 1px solid #fff;
      color: #fff;
      font-size: 14px;
      padding-left: 10px;
    }
  }
  .btns{
    display: flex;
    justify-content: space-evenly;
    margin-top: 30px;
    span{
      font-size: 18px;
      color: #ffffffa9;
      cursor: pointer;
    }
    span:hover{
      transform: scale(1.1);
    }
  }
}
:deep(.el-statistic__content) {
  font-size: 12px !important;
  .el-statistic__number {
    color: #89e80f !important;
  }
}
</style>