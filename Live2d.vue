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
        onMove: {}
    },
    data() {
        return {
            sp: null,
            cvs: null,
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
        moveSample() {
            this.sp.drawMove(l2dm => {
                var t = window.UtSystem.getUserTimeMSec() * 0.001 * 2 * Math.PI; //1秒ごとに2π(1周期)増える
                var cycle = 3.0; //パラメータが一周する時間(秒)(参数进行回合的时间（以秒为单位）)
                // PARAM_ANGLE_Xのパラメータが[cycle]秒ごとに-30から30まで変化する
                // (PARAM_ANGLE_X的参数每[周期]秒从-30变为30)
                l2dm.setParamFloat("PARAM_ANGLE_X", 30 * Math.sin(t / cycle));
                l2dm.setParamFloat("PARAM_EYE_R_OPEN", 1 * Math.sin(t / cycle));
                l2dm.setParamFloat("PARAM_EYE_L_OPEN", 1 * Math.sin(t / cycle));

            });
        },
        liveLoad(simple, canvas) {
            // Live2Dの初期化
            window.Live2D.init();

            // コンテキストを失ったとき(当我失去上下文)
            canvas.addEventListener("webglcontextlost", function(e) {
                simple.myerror("context lost");
                this.loadLive2DCompleted = false;
                this.initLive2DCompleted = false;

                var cancelAnimationFrame =
                    window.cancelAnimationFrame ||
                    window.mozCancelAnimationFrame;
                cancelAnimationFrame(this.requestID); //アニメーションを停止(停止动画)

                e.preventDefault();
            }, false);

            // コンテキストが復元されたとき(当上下文恢复时)
            canvas.addEventListener("webglcontextrestored", function() {
                simple.myerror("webglcontext restored");
                simple.initLoop(canvas);
            }, false);

            // Init and start Loop
            simple.initLoop(canvas);
        }
    },
    mounted() {
        // 获得canvas
        this.cvs = document.getElementById(this.canvasId);
        // 配置live2d对象
        this.sp = new Simple({
            type: "Live2D Model Setting",
            name: "Epsilon2.1",
            model: "/api/assets/Epsilon2.1/Epsilon2.1.moc",
            textures: [
                "/api/assets/Epsilon2.1/Epsilon2.1.2048/texture_00.png",
            ]
        });
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
