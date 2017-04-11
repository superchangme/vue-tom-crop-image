<template>
  <div >
  <input class="upload-file" ref='inputFile' v-show='false' type="file" id="file" accept="image/*" capture="camera"/>
  
    <img id="previewResult" v-show='false'/>
    <img id="needCropImg" v-show='false' :src='dataImgSrc' />
    <div class="tom-app" id="uploadPage">
        <div class="upload-loading">
            <span class="centerXY"><i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i></span>
        </div>
        <div class="bar"><a class="back pull-left" id="closeCrop"><i class="fa fa-reply"></i></a><a id="getFile" class="pull-right">使用</a></div>
        <div class="main">
            <canvas class="upload-mask">

            </canvas>
            <div class="preview-box">
                <img id="preview"/>
            </div>
            <canvas class="photo-canvas">

            </canvas>
            <a  id="rotateBtn">
                <i class="fa fa-rotate-right  fa-3x"></i>
                <div>旋转照片</div>
            </a>
        </div>
    </div>
  </div>
</template>

<script>
import _$ from 'jquery'
import T from './index.js'
import 'font-awesome/css/font-awesome.css'
export default {
  props:{
    dataShow:{
        type:Boolean
    },
    dataWidth:{
        type:Number,
        default:300
    },
    dataHeight:{
        type:Number,
        default:300
    },
    dataImgSrc:{
        type:String,
        default:null
    },
    dataFromUrl:{
        type:Boolean,
        default:false
    }
  },
  data () {
    return {
      uploadPage:null
    }
  },
  watch:{
    dataShow:function(nval){
        if(nval){
            if(this.dataFromUrl){
                 this.showCropModal();
            }else{
                 this.$refs.inputFile.click();
            }
            this.resetUserOpts();
            document.addEventListener("touchmove",this.stopScroll,false)
        }else{
            document.removeEventListener("touchmove",this.stopScroll,false)
        }
    }
  },
  methods:{
    stopScroll:function(e){
         e.preventDefault();
    },
    resetUserOpts:function(){

    },
    showCropModal:function(){
        
    }
  },
  destroyed(){
    document.removeEventListener("touchmove",this.stopScroll,false)
  },
  mounted(){
    let self = this;
    let root = _$(this.$el);
    let $=(function($){
       return function(selector){
           return root.find(selector)
       }
    })(_$);
    let jQuery=_$;
    
     //初始化图片大小300*300
        var opts={cropWidth:this.dataWidth,cropHeight:this.dataHeight},
            $file=$("#file"),
            previewStyle={x:0,y:0,scale:1,rotate:0,ratio:1},
            transform= T.prefixStyle("transform"),
            $previewResult=$("#previewResult"),
            $previewBox=$(".preview-box"),
            $rotateBtn=$("#rotateBtn"),
            $getFile=$("#getFile"),
            $preview=$("#preview"),
            $uploadPage=$("#uploadPage"),
            $mask=$(".upload-mask"),
            $loading=$(".upload-loading"),
            maskCtx=$mask[0].getContext("2d"),
            $needCropImg=$("#needCropImg");
        var bindFile=this.dataFromUrl?$needCropImg[0]:$file
        //这是插件调用主体
        var myCrop=T.cropImage({
            bindFile:bindFile,//绑定Input file
//            bindFile:$needCropImg[0],//绑定一个图片
            enableRatio:true,//是否启用高清,高清得到的图片会比较大
            canvas:$(".photo-canvas")[0],  //放一个canvas对象
            cropWidth:opts.cropWidth,       //剪切大小
            cropHeight:opts.cropHeight,
            bindPreview:$preview,      //绑定一个预览的img标签
            useHammer:true,            //是否使用hammer手势，否的话将不支持缩放
            oninit:function(){

            },
            onChange:function(){
                $loading.show();
                resetUserOpts();
            },
            onLoad:function(data){
                //用户每次选择图片后执行回调
                previewStyle.ratio=data.ratio;
                $preview.attr("src",data.originSrc).css({width:data.width,height:data.height}).css(transform,'scale('+1/previewStyle.ratio+')');
                myCrop.setCropStyle(previewStyle)
                $loading.hide();
            }
        });
        function resetUserOpts(){
            $(".photo-canvas").hammer('reset');
            previewStyle={scale:1,x:0,y:0,rotate:0};
            $previewResult.attr("src",'').hide();
            $preview.attr("src",'')
        }
        this.resetUserOpts=resetUserOpts;
        this.uploadPage=$uploadPage;

        // $('#fileChooseButton').on('click',function(){
        //     setTimeout(function(){
        //         resetUserOpts();
        //     })
        // })
        $(".photo-canvas").hammer({
            gestureCb:function(o){
                //每次缩放拖拽的回调
                jQuery.extend(previewStyle,o);
//                console.log("用户修改图片",previewStyle)
                $preview.css(transform,"translate3d("+ previewStyle.x+'px,'+ previewStyle.y+"px,0) rotate("+previewStyle.rotate+"deg) scale("+(previewStyle.scale/previewStyle.ratio)+")")
            }
        })
        //选择图片
        $rotateBtn.on("click",function(){
            previewStyle.rotate+=90;
            if(previewStyle.rotate>=360){
                previewStyle.rotate-=360;
            }
            $(".photo-canvas").hammer('setRotate',previewStyle.rotate)
            myCrop.setCropStyle(previewStyle)
            $preview.css(transform,"translate3d("+ previewStyle.x+'px,'+ previewStyle.y+"px,0) rotate("+previewStyle.rotate+"deg) scale("+(previewStyle.scale/previewStyle.ratio)+")")
        })
        //获取图片并关闭弹窗返回到表单界面
        $getFile.on("click",function(){
            var cropInfo;
            $uploadPage.hide();
            self.$emit('on-hide')
            myCrop.setCropStyle(previewStyle)
            //自定义getCropFile({type:"png",background:"red",lowDpi:true})
            cropInfo=myCrop.getCropFile({});
            // $previewResult.attr("src",cropInfo.src).show();

            self.$emit('on-success',{dfd:cropInfo.dfd,base64:cropInfo.src})
            //可选传base64或者file对象
            //cropInfo.src cropInfo.dfd

            //you can upload img base64  :cheers:)
            console.info('拿到Base64了,传给后台吧？')//src.substr(22)
       /*     $.ajax({
                url:'http://127.0.0.1/testAdjustImg/upload.php',
                type:"post",
                dataType:"json",
                data:{base64:cropInfo.src.substr(22),uploadType:'base64'},//后端无需在过滤头
                success:function(data){
                    if(data.result==1){
                        console.log(data.imgPath)
                    }
                }
            })*/
            //you can upload new img file :cheers:)
            

        })
        //上传文件按钮&&关闭弹窗按钮
        jQuery(document).delegate("#file","click",function(){
            $uploadPage.show();
        }).delegate("#closeCrop","click",function(){
            $uploadPage.hide();
            self.$emit('on-hide')
            resetUserOpts();
            myCrop.setCropStyle(previewStyle)
        })
        $file.one("click",showCropModal)
        $previewResult.on('click',showCropModal)

        function showCropModal(){
            setTimeout(function(){
                $uploadPage.show();
                $mask.prop({width:$mask.width(),height:$mask.height()})
                maskCtx.fillStyle="rgba(0,0,0,0.7)";
                maskCtx.fillRect(0,0,$mask.width(),$mask.height());
                maskCtx.strokeStyle='white';
                maskCtx.lineWidth='2'
                maskCtx.clearRect(($mask.width()-opts.cropWidth)/2,($mask.height()-opts.cropHeight)/2,opts.cropWidth,opts.cropHeight)
                maskCtx.strokeRect(($mask.width()-opts.cropWidth)/2-1,($mask.height()-opts.cropHeight)/2-1,opts.cropWidth+2,opts.cropHeight+2);//Add a subpath with four points
            })
        }
        this.showCropModal=showCropModal;
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
