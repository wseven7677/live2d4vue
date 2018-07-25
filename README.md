# live2d4vue

a vue plugin importing live2d character into your project

-   声明：
    >    本插件由本人基于官方开源提供的webGL SDK - live2d.min.js以及样例代码Simple.js改写而成。开源提供给广大vue生态开发者使用。
-   用途：
    >    在vue工程中可以以组件的形式引入live2d模型（需要开发者自己找模型文件），并自定义控制模型中包含的所有动作。

## install
```
       npm install --save live2d4vue
       import live2d4vue from 'live2d4vue'
       Vue.use(live2d4vue)
```
## usage
```
    <Live2d :modelData="mdata"
            :on-move="handleMove"
            :index="0" />

    <Live2d :modelData="mdata"
            :on-move="handleMove"
            :index="1" />

    mdata: {
        name: "Epsilon2.1",
        model: "/api/assets/Epsilon2.1/Epsilon2.1.moc",
        textures: [
             "/api/assets/Epsilon2.1/Epsilon2.1.2048/texture_00.png",
        ]
    }

    handleMove(liveModel){
        liveModel.setParamFloat('PARAM_ANGLE_X',value);
    }
```
