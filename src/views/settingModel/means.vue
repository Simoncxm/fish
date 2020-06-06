<template>
  <div class="person-means">
    <el-form ref="personForm" label-width="80px" class="personForm" :model="personForm" :rules="personRules">
      <el-form-item label="头像">
        <div class="avatar" @click="setShowCrop">
          <img :src="imageUrl">
        </div>
      </el-form-item>
      <el-form-item label="性别">
        <el-radio v-model="personForm.gender" label="1">男</el-radio>
        <el-radio v-model="personForm.gender" label="2">女</el-radio>
        <el-radio v-model="personForm.gender" label="3">保密</el-radio>
      </el-form-item>
      <el-form-item label="昵称" prop="nickname">
        <el-input v-model="personForm.nickname" placeholder="名称">
        </el-input>
      </el-form-item>
      <el-form-item label="个性签名" prop="signature">
        <el-input v-model="personForm.signature" placeholder="签名（不超过100位字符）" type="textarea" aotusize resize="none">
        </el-input>
      </el-form-item>
    </el-form>
    <el-button type="primary" @click="saveInfo">保存</el-button>
    <el-dialog
      :visible.sync="showCrop"
      width="700px"
      :before-close="handleClose">
      <cropper :url="cropUrl" @avatar="getAvatar"></cropper>
    </el-dialog>
  </div>
</template>
<script>
  import api from '@/api';
  import cropper from '@/views/components/cropper/cropper';
  // import {pca, pcaa} from 'area-data'; // 省市区数据
  export default {
    name: 'means',
    data() {
      let validateNick = (rule, value, callback) => {
        if (value === '') {
          callback();
        } else {
          if (value.length > 12) {
            callback(new Error('请输入不超过12位字符'));
            return;
          }
          callback();
        }
      };
      let validateSignature = (rule, value, callback) => {
        if (value === '') {
          callback();
        } else {
          if (value.length > 100) {
            callback(new Error('请输入不超过100位字符'));
            return;
          }
          callback();
        }
      };
      return {
        imageUrl: process.env.IMG_URL + this.$store.state.user.avatar, // 显示图片路径
        personForm: {
          nickname: '',
          signature: '',
          gender: '',
        },
        showCrop: false, // 裁剪框开关
        cropUrl: '', // 裁剪图片地址
        personRules: {
          nickname: [
            {validator: validateNick, trigger: 'blur'}
          ],
          signature: [
            {validator: validateSignature, trigger: 'blur'}
          ]
        },
      }
    },
    computed: {
      provinces() {
        let arr = this.MapData(pca['86']);
        this.personForm.province = arr[0];
        return arr;
      }
    },
    components: {
      cropper
    },
    methods: {
      MapData(data) {
        return Object.keys(data).map(k => {
          return {
            name: data[k],
            value: k
          }
        });
      },
      getAvatar(url) { // 裁剪后的图像路径
        this.imageUrl = process.env.IMG_URL + url;
        this.showCrop = false;
        api.updateUserInfo({type:'头像',content: url}).then(r => {
          if (r.code === 0) {
            this.$message({
              message: '保存头像成功',
              type: 'success'
            });
            this.$store.commit('setUser', {photo: url});
          } else {
            this.$message({
              message: '保存头像失败',
              type: 'warning'
            })
          }
        });
      },
      handleClose(done) {  // 关闭裁剪框清空地址
        this.cropUrl = '';
        done();
      },
      setShowCrop() { // 点击上传图像
        this.showCrop = true;
        this.cropUrl = this.imageUrl;
      },
      saveInfo() { // 保存修改
        this.$refs['personForm'].validate((valid) => {
          if (valid) {
            let sygnal=1;
            api.updateUserInfo({type:'nickname',content:this.personForm.nickname}).then(r => {
              if (r.code !== 0) {
                sygnal=0;
              }
            });
            api.updateUserInfo({type:'签名',content:this.personForm.signature}).then(r => {
              if (r.code !== 0) {
                sygnal=0;
              }
            });
            let gendernum=0;
            if(this.personForm.gender==='男'){
              gendernum=1;
            }
            else if(this.personForm.gender==='女'){
              gendernum=2;
            }
            else{
              gendernum=0;
            }
            api.updateUserGender({gender:gendernum}).then(r => {
              if (r.code !== 0) {
                sygnal=0;
              }
            });
            if (sygnal=== 1) {
              this.$message({
                message: '保存成功',
                type: 'success'
              });
              this.$store.commit('setUser', {
                nickname: this.personForm.nickname,
                signature: this.personForm.signature,
              });
            } else {
              this.$message({
                message: '保存失败',
                type: 'warning'
              })
            }
          } else {
            return false;
          }
        });
      },
      getUserInfo() {  // 获取个人设置用户信息
        api.getUserInfo().then(r => {
          if (r.code === 0) {
            this.personForm = Object.assign(this.personForm, r.data);
          }
        });
      }
    },
    mounted() {
      this.getUserInfo();
    }
  }
</script>
<style lang="scss" scoped>
  .person-means {
    padding: 20px 30px;
    box-sizing: border-box;

    .el-input {
      width: 300px;
    }

    .avatar {
      width: 120px;
      height: 120px;
      border: 1px solid #ddd;
      border-radius: 50%;
      overflow: hidden;

      img {
        width: 100%;
      }
    }
  }
</style>
