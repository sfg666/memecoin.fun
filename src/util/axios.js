import axios from "axios";
import Cookie from "js-cookie";
//这里用的少随便封装了一下
const get = (path,params) => {
    axios.defaults.headers['Authorization'] = Cookie.get('authorization')
   params = params || {};
   return new Promise((resolve,reject)=>{
       axios.get(path,{params:params}).then(res =>{
           if(res.status === 200) resolve(res.data)
           else resolve(false)
       }).catch(e => {
           reject(e)
       })
   })
}
const post = (path,params) => {
    axios.defaults.headers['Authorization'] = Cookie.get('authorization')
   params = params || {};
   return new Promise((resolve,reject)=>{
       axios.post(path,params).then(res =>{
           if(res.status === 200) resolve(res.data)
           else resolve(false)
       }).catch(e => {
           reject(e)
       })
   })
}


export  {get,post}