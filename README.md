# live2d4vue

a vue plugin importing live2d character into your project

-   声明：
    >    本插件由本人基于官方开源提供的webGL SDK - live2d.min.js以及样例代码Simple.js改写而成。开源提供给广大vue生态开发者使用。

-   用途：
    >    在vue工程中可以以组件的形式引入live2d模型（需要开发者自己找模型文件），并自定义控制模型中包含的所有动作。

## install

- 在工程中安装：
```
npm install --save live2d4vue
```
- 在main.js中引入：       
```
import live2d4vue from 'live2d4vue'
```
- 在main.js中使用该插件：
```
Vue.use(live2d4vue)
```


## usage

1. 在你的vue文件中这样添加一个live2d模型：
```
    <Live2d :modelData="mdata"
            :on-move="handleMove" />
```

> modelData属性为引入的模型文件路径，必须是在服务器上放置的文件。

> on-move属性为控制模型活动的重要入口函数，其返回一个live2dModel对象实例，用于实际控制模型活动。

2. 如果要添加多个模型在同一个.vue文件中，务必添加index属性，值必须为数字：
```
    <Live2d :modelData="mdata"
            :on-move="handleMove"
            :index="0" />

    <Live2d :modelData="mdata"
            :on-move="handleMove"
            :index="1" />
```

## api

#### `:modelData`对象内容示例：
```
    mdata: {
        name: "Epsilon2.1", // 模型名称
        model: "/api/assets/Epsilon2.1/Epsilon2.1.moc", // 模型文件地址
        textures: [
             "/api/assets/Epsilon2.1/Epsilon2.1.2048/texture_00.png", // 材质素材地址
        ]
    }
```

#### `:on-move`：
> 返回一个模型对象的实例 live2dModel

#### live2dModel的使用：
```
    live2dModel.setParamFloat('PARAM_ANGLE_X',value);
```
#### live2dModel.setParamFloat(param1, param2)的使用：

- 第一个参数: 为要控制的模型部件，名称与制作模型时命名的名称一致
   > `扩展`： 所以，如果你会制作live2d模型，你就可以自己命名这些名字，导出模型文件以后在这边调用就好了。

- 第二个参数: 是对应第一个参数所代表的部件的 值 。
   > 这个值一般是0～1，-1～1，-30～30等等，可以自己试一下。其实就是头摆动的幅度啊，眨眼啊等等。

#### 附：模型中常用的live2dModel.setParamFloat第一个参数名称：
```
    PARAM_ANGLE_X
    PARAM_ANGLE_Y
    PARAM_ANGLE_Z
    PARAM_EYE_L_OPEN
    PARAM_EYE_L_SMILE
    PARAM_EYE_R_OPEN
    PARAM_EYE_R_SMILE
    PARAM_EYE_BALL_X
    PARAM_EYE_BALL_Y
    PARAM_BROW_L_Y
    PARAM_BROW_R_Y
    PARAM_BROW_L_X
    PARAM_BROW_R_X
    PARAM_BROW_L_ANGLE
    PARAM_BROW_R_ANGLE
    PARAM_MOUTH_FORM
    PARAM_MOUTH_OPEN
    PARAM_CHEEK
    PARAM_BREATH
    PARAM_HAIR_FRONT
    PARAM_HAIR_SIDE
    PARAM_HAIR_BACK
```

#### `:width`, `:height`：
> 画布的宽高。默认300 * 300

#### `:index`：
> 多个live2d共存时必填属性，值为数字。默认值为0.

---
用爱发电不易，请多帮宣传，感谢～宣传时请携带网址https://github.com/wseven7677/live2d4vue
---
