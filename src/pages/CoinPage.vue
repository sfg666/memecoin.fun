<template>
  <div class="coin">
    <webbar />
    <div class="goback" @click="goback">[go back]</div>
    <div class="sc">
      <div style="overflow: hidden;">
        <el-upload
          class="avatar-uploader"
          action="https://memecoin.fun/tu/pic/private/v1/file-service/upload/s3"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="imageUrl" :src="imageUrl" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </div>
      <div>
        <div>
          <span>Name</span>
          <input type="text" maxlength="8" v-model="name" />
        </div>
        <div>
          <span>Ticker</span>
          <input type="text" maxlength="6" v-model="Ticker" />
        </div>
      </div>
    </div>
    <div class="Description">
      <span>Description</span>
      <textarea
        name=""
        id=""
        cols="30"
        rows="10"
        v-model="Description"
      ></textarea>
    </div>
    <div class="money">
      <span>Fundraising</span>
      <div>
        <div @click="Selectamount(0)">
          20sol
          <img v-if="amount == 0" src="../assets/xz.png" alt="" />
        </div>
        <div @click="Selectamount(1)">
          50sol
          <img v-if="amount == 1" src="../assets/xz.png" alt="" />
        </div>
        <div @click="Selectamount(2)">
          100sol
          <img v-if="amount == 2" src="../assets/xz.png" alt="" />
        </div>
      </div>
    </div>
    <p @click="xs">Show more options ↓</p>
    <div class="Contactinfo" v-if="display">
      <div>
        <span>Twitter</span>
        <input type="text" v-model="Twitter" placeholder="(optional)" />
      </div>
      <div>
        <span>telegram</span>
        <input type="text" v-model="telegram" placeholder="(optional)" />
      </div>
      <div>
        <span>Website</span>
        <input type="text" v-model="Website" placeholder="(optional)" />
      </div>
    </div>
    <div class="btns" @click="establish" v-loading="loading">Create coin</div>
    <div class="HandlingFees">Cost to deploy: ~0.03 SOL</div>
  </div>
</template>

<script setup>
import webbar from "@/components/WebBar.vue";
import { ElMessage, ElNotification } from "element-plus";
import { Plus } from "@element-plus/icons-vue";
import { ref, getCurrentInstance, onMounted, watch } from "vue";
import * as anchor from "@project-serum/anchor";
import { useWallet } from "solana-wallets-vue";
import { toPublicKey, Metaplex } from "@metaplex-foundation/js";
import ido from "@/util/contracts/ioc.json";
import { get, post } from "../util/axios";
import { AnchorProvider, BN, web3 } from "@project-serum/anchor";
import {
  getOrCreateAssociatedTokenAccount,
  getAssociatedTokenAddress,
  createAssociatedTokenAccount,
  createAssociatedTokenAccountInstruction,
} from "@solana/spl-token";
import {
  Connection,
  clusterApiUrl,
  LAMPORTS_PER_SOL,
  Program,
  PublicKey,
  Transaction,
  wallet,
} from "@solana/web3.js";
let { proxy } = getCurrentInstance();
let wallets = useWallet();
let Address = ref(
  wallets.publicKey.value == null ? null : wallets.publicKey.value.toString()
);
let connection = ref(null);
let provider = ref(null);
let Twitter = ref("");
let telegram = ref("");
let Website = ref("");
let loading = ref(false);
let contracts = {
  ldc: null,
  ata: null,
};
let name = ref("");
let Ticker = ref("");
let Description = ref("");
let addressTime = ref("");
const programId = "AGAqYVPTrydtAdzLQBt8c1Rp61dHNipmsiCPHyYgMzV";
const mpl_token_address = "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s";
const tokenProgram2022 = "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb";
onMounted(() => {
  if (Address.value == null) return;
  init();
});
watch(
  () => wallets.publicKey.value,
  (newValue, oldValue) => {
    if (newValue != null) {
      Address.value = newValue.toString();
      init();
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
};
const imageUrl = ref("");
const handleAvatarSuccess = (e) => {
  imageUrl.value = e.Location;
};

const beforeAvatarUpload = (rawFile) => {
  const timestamp = Date.now();
  addressTime.value = { hash: Address.value + timestamp };
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
let display = ref(false);
const xs = () => {
  display.value = !display.value;
};
const goback = () => {
  proxy.$router.push({
    name: "Home",
  });
};
let amount = ref(0);
const Selectamount = (e) => {
  amount.value = e;
};
const establish = async () => {
  if (Address.value == null)
    return ElMessage.warning("Please understand the wallet operation first");
  if (imageUrl.value == "")
    return ElMessage.warning("Please upload the image first");
  if (name.value == "") return ElMessage.warning("no name");
  if (Ticker.value == "") return ElMessage.warning("no Ticker");
  if (Description.value == "") return ElMessage.warning("no Description");
  if (loading.value) return;
  loading.value = true;
  const [memeCounterPda] = PublicKey.findProgramAddressSync(
    [new Buffer("COUNTER"), wallets.publicKey.value.toBuffer()],
    toPublicKey(programId)
  );
  let counter = null;
  let len = 0;
  try {
    counter = await contracts.ldc.account.creatorMemecoinCounter.fetch(
      memeCounterPda
    );
    len = counter.count;
  } catch (error) {
    len = 0;
  }
  const buffer = Buffer.alloc(4); // Allocate a 4-byte buffer
  buffer.writeUInt32LE(len, 0);
  const [memeCoinConfigPda] = PublicKey.findProgramAddressSync(
    [wallets.publicKey.value.toBuffer(), buffer],
    toPublicKey(programId)
  );
  const [mintPda] = PublicKey.findProgramAddressSync(
    [new Buffer("mint"), memeCoinConfigPda.toBuffer()],
    toPublicKey(programId)
  );
  const [metaDataPda] = PublicKey.findProgramAddressSync(
    [
      new Buffer("metadata"),
      toPublicKey(mpl_token_address).toBuffer(),
      mintPda.toBuffer(),
    ],
    toPublicKey(mpl_token_address)
  );
  const [desPda] = PublicKey.findProgramAddressSync(
    [new Buffer("MEME_COIN"), mintPda.toBuffer(), memeCoinConfigPda.toBuffer()],
    toPublicKey(programId)
  );
  const [configPda] = PublicKey.findProgramAddressSync(
    [new Buffer("CONFIG")],
    toPublicKey(programId)
  );
  try {
    let hash = await contracts.ldc.methods
      .createMemecoinConfig(
        name.value,
        Ticker.value,
        imageUrl.value,
        Description.value,
        Website.value,
        telegram.value,
        Twitter.value,
        Number(amount.value)
      )
      .accounts({
        memecoinConfig: memeCoinConfigPda,
        creator: wallets.publicKey.value,
        globalConfig: configPda,
        createMemecoinFeeReceiver: toPublicKey(
          "9d8Uy7Zpcs7zhE1sd6zS3azQDbLT1XCphXSiCdueq48C"
        ),
        mint: mintPda,
        destination: desPda,
        creatorMemecoinCounter: memeCounterPda,
        token2022Program: toPublicKey(tokenProgram2022),
        metadata: metaDataPda,
        tokenMetadataProgram: toPublicKey(mpl_token_address),
      })
      .rpc();
    ElNotification({
      title: "Successful",
      message: "Successfully published.",
      position: "bottom-right",
      duration: 8000,
    });
    name.value = "";
    Ticker.value = "";
    Website.value = "";
    telegram.value = "";
    Twitter.value = "";
    Description.value = "";
    imageUrl.value = "";
    loading.value = false;
  } catch (error) {
    ElNotification({
      title: "error",
      message: error,
      position: "bottom-right",
      duration: 8000,
    });
    loading.value = false;
  }
};
</script>

<style lang="less" scoped>
.coin {
  height: auto;
  background-color: #000;
  // margin: 0 auto;
  padding-bottom: 100px;
  @media (max-width: 800px) {
    width: 100%;
  }
  .goback {
    width: 660px;
    margin: 0 auto;
    font-size: 24px;
    color: #ef08ef;
    margin-top: 80px;
    cursor: pointer;
    @media (max-width: 800px) {
      width: 90%;
      margin: 0 auto;
      font-size: 16px;
      margin-top: 30px;
      margin-bottom: 20px;
    }
  }
  .sc {
    width: 60%;
    margin: 0 auto;
    margin-top: 50px;
    display: flex;
    justify-content: center;
    @media (max-width: 800px) {
      width: 90%;
      margin: 0 auto;
      flex-direction: column;
    }
    > div:nth-child(1) {
      width: 220px;
      height: 220px;
      background-color: #232222;
      border: 2px solid #969696;
      display: flex;
      justify-content: center;
      align-items: center;
      .el-icon {
        width: 100%;
        height: 100%;
      }
      .el-icon svg {
        font-size: 50px;
      }
      @media (max-width: 800px) {
        width: 100px;
        height: 100px;
        margin-bottom: 20px;
      }
    }
    > div:nth-child(2) {
      margin-left: 30px;
      @media (max-width: 800px) {
        margin-left: 0px;
      }
      > div {
        display: flex;
        flex-direction: column;
        margin-bottom: 20px;
        span {
          font-size: 20px;
          font-weight: 500;
          color: #fff;
          margin-bottom: 10px;
          @media (max-width: 800px) {
            font-size: 16px;
          }
        }
        input {
          width: 420px;
          height: 60px;
          background-color: #232222;
          border: 2px solid #969696;
          font-size: 20px;
          color: #fff;
        }
        @media (max-width: 800px) {
          width: 100%;
          input {
            width: 100%;
            height: 35px;
            font-size: 12px;
          }
        }
      }
    }
  }
  .Description {
    width: 60%;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;

    span {
      font-size: 20px;
      color: #fff;
      font-weight: 500;
      margin-bottom: 10px;
      display: block;
      width: 660px;
      @media (max-width: 800px) {
        font-size: 16px;
      }
    }
    > textarea {
      width: 660px;
      height: 80px;
      background-color: #232222;
      border: 2px solid #969696;
      font-size: 20px;
      color: #fff;
    }
    @media (max-width: 800px) {
      width: 90%;
      margin: 0 auto;
      margin-bottom: 30px;
      span {
        width: 100%;
      }
      > textarea {
        width: 100%;
        font-size: 12px;
      }
    }
  }
  .money {
    width: 660px;
    margin: 60px auto;
    @media (max-width: 800px) {
      width: 90%;
      margin: 0 auto;
    }
    span {
      font-size: 20px;
      color: #fff;
      font-weight: 500;
      margin-bottom: 10px;
      display: block;
      @media (max-width: 800px) {
        font-size: 16px;
      }
    }
    > div {
      display: flex;
      justify-content: space-between;
      > div {
        width: 130px;
        height: 60px;
        font-size: 24px;
        color: #fff;
        line-height: 60px;
        text-align: center;
        cursor: pointer;
        position: relative;
        img {
          width: 32px;
          height: 32px;
          position: absolute;
          right: -16px;
          top: -16px;
        }
        @media (max-width: 800px) {
          width: 80px;
          height: 30px;
          font-size: 12px;
          line-height: 30px;
          > img {
            width: 15px;
            height: 15px;
            right: -6px;
            top: -6px;
          }
        }
      }
      > div:nth-child(1) {
        background: #ef08ef;
      }
      > div:nth-child(2) {
        background: #e8500f;
      }
      > div:nth-child(3) {
        background: linear-gradient(to right top, #9845fe, #4aaace, #1bf79f);
      }
    }
  }
  > p {
    font-size: 20px;
    color: #fff;
    text-align: center;
    margin: 30px;
    cursor: pointer;
    @media (max-width: 800px) {
      font-size: 16px;
    }
  }
  .Contactinfo {
    width: 60%;
    margin: 0 auto;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    > div {
      display: flex;
      flex-direction: column;
      margin-bottom: 30px;
      span {
        font-size: 20px;
        color: #fff;
        margin-bottom: 5px;
      }
      input {
        width: 660px;
        height: 45px;
        background-color: #232222;
        border: 2px solid #969696;
        font-size: 20px;
        color: #fff;
        padding-left: 4px;
      }
    }
    @media (max-width: 800px) {
      width: 90%;
      margin: 0 auto;
      > div {
        width: 100%;
        input {
          width: 100%;
          height: 35px;
          font-size: 12px;
        }
      }
    }
  }
  .btns {
    width: 500px;
    height: 40px;
    background: linear-gradient(to right top, #9845fe, #4aaace, #1bf79f);
    border-radius: 10px;
    margin: 0 auto;
    line-height: 40px;
    text-align: center;
    font-size: 24px;
    color: #fff;
    margin-bottom: 40px;
    margin-top: 70px;
    cursor: pointer;
    @media (max-width: 800px) {
      width: 90%;
      margin: 0 auto;
      margin-bottom: 10px;
      font-size: 18px;
    }
  }
  .HandlingFees {
    font-size: 18px;
    color: #fff;
    text-align: center;
    @media (max-width: 800px) {
      font-size: 14px;
    }
  }
}
:deep(.el-loading-mask) {
  background: #ffffff59;
  .path {
    stroke: #ef08ef;
  }
}
</style>>