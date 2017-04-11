<template>
  <div class="hello">
    <h1>{{ msg }}</h1>

    <tom-crop 
    :data-show='showCrop' 
    :data-width='400'
    :data-height='200'
    @on-success='getCropSuccess' 
    @on-hide='showCrop=false'
    ></tom-crop> 

    <tom-crop 
    :data-img-src='userImgSrc'
    :data-show='showCrop2' 
    :data-width='400'
    :data-height='200'
    :data-from-url='true'
    @on-success='getCropSuccess2' 
    @on-hide='showCrop2=false'
    ></tom-crop> 

     <button id='fileChooseButton' @click='showCrop=true' class="button blue rarrow file-input-mask">上传图片</button> 

     <h2 v-if='imgSrc'>上传预览</h2>
     <img :src='imgSrc' />


     <button id='fileChooseButton' @click='setUserImg' class="button blue rarrow file-input-mask">裁剪图片</button> 
      <h2 v-if='imgSrc2'>上传预览2</h2>
     <img :src='imgSrc2' />
  </div>
</template>

<script>

export default {
  name: 'hello',
  data () {
    return {
      msg: 'Welcome to Tom Crop',
      showCrop:false,
      showCrop2:false,
      imgSrc:null,
      imgSrc2:null,
      userImgSrc:null
    }
  },
  components:{
    tomCrop:require('../libs/tom_crop/index.vue')
  },
  methods:{
    setUserImg(){
      this.showCrop2=true;
      this.userImgSrc='static/assets/9-1.jpg'
    },
    getCropSuccess2(detail){
      this.imgSrc2=detail.base64;
    },
    getCropSuccess(detail){
      this.imgSrc=detail.base64;
      //可以选择传对象到后端
      detail.dfd.done(function(blob){
                if(blob){
                    var formData=new FormData;
                    blob.name='imgFile'
                    formData.append("imgFile",blob)
                    formData.append("uploadType",'imgFile');
                    $.ajax({
                        url:'http://127.0.0.1/testAdjustImg/upload.php',
                        type:"post",
                        data:formData,
                        processData:false,
                        contentType: false,
                        dataType:"json",
                        success:function(data){
                            console.log(data)
                            if(data.result==1){
                                console.log(data.imgPath)
                            }
                        }
                    })
                }
            })
    }
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
  text-align: center;
  color: white;
}
button,img{
  margin: 0 auto!important;
  display: block;
  margin-top:40px!important;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
