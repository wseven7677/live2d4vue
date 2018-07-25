<template>
<div class="live-2d">
    <canvas :id="canvasId"
            :width="width"
            :height="height"></canvas>
</div>
</template>

<script>
import './assets/live2d.min.js';
import Simple from './assets/Simple.js';
import uuidv4 from 'uuid/v4';

export default {
    name: 'Live2d',
    props: {
        width: {
            default: 300
        },
        height: {
            default: 300
        },
        onMove: {}, // 控制模型运动
        modelData: { // 模型导入的接口
            type: Object
        },
        index: {
            type: Number,
            default: 0
        }
    },
    data() {
        return {
            sp: null, // Simple对象实例
            cvs: null, // 画布
            canvasId: uuidv4()
        };
    },
    computed: {},
    methods: {
        move() {
            this.sp.drawMove(model => {
                this.onMove(model);
            });
        },
        liveLoad(simple, canvas) {
            var that = this;
            // Live2Dの初期化
            window.Live2D.init();

            // コンテキストを失ったとき(当我失去上下文)
            canvas.addEventListener("webglcontextlost", function(e) {
                simple.myerror("context lost");
                that.loadLive2DCompleted = false;
                that.initLive2DCompleted = false;

                var cancelAnimationFrame =
                    window.cancelAnimationFrame ||
                    window.mozCancelAnimationFrame;
                cancelAnimationFrame(that.requestID); //アニメーションを停止(停止动画)

                e.preventDefault();
            }, false);

            // コンテキストが復元されたとき(当上下文恢复时)
            canvas.addEventListener("webglcontextrestored", function() {
                simple.myerror("webglcontext restored");
                simple.initLoop(canvas);
            }, false);

            // Init and start Loop
            simple.initLoop(canvas, this.index);
        }
    },
    mounted() {
        // 获得canvas
        this.cvs = document.getElementById(this.canvasId);
        // 配置live2d对象
        this.sp = new Simple(Object.assign({
            type: "Live2D Model Setting"
        }, this.modelData));
        // 将两者初始化
        this.liveLoad(this.sp, this.cvs);

        // this.moveSample();
        this.move();
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">

</style>
