# tom-crop-image

> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

![image](http://wx1.sinaimg.cn/large/681e3d67ly1fejw2t97mfj211d0hu7b6.jpg)

# tom-crop-image use hammerjs
## on desktop,user  should press both shift key and left mouse to rotate

``` javascript
<tom-crop
:data-show='showCrop'
:data-width='400'
:data-height='200'
@on-success='getCropSuccess'
@on-hide='showCrop=false'
></tom-crop>
```
