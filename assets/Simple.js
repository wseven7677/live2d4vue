/**
 *  Sample.js
 *
 *  You can modify and use this source freely
 *  only for the development of application related Live2D.
 *
 *  (c) Live2D Inc. All rights reserved.
 */

class Simple {
    constructor(model) {
        /*
         * Live2Dモデルのインスタンス(Live2D模型的实例)
         */
        this.live2DModel = null;

        /*
         * アニメーションを停止するためのID(停止动画的ID)
         */
        this.requestID = null;

        /*
         * モデルのロードが完了したら true(加载模型后)
         */
        this.loadLive2DCompleted = false;

        /*
         * モデルの初期化が完了したら true(完成模型的初始化)
         */
        this.initLive2DCompleted = false;

        /*
         * WebGL Image型オブジェクトの配列(WebGL图像类型对象的数组)
         */
        this.loadedImages = [];

        /*
         * Live2D モデル設定。(型号设定)
         */
        this.modelDef = model;
        // {
        //     "type":"Live2D Model Setting",
        //     "name":"Epsilon2.1",
        //     "model":"assets/Epsilon2.1/Epsilon2.1.moc",
        //     "textures":[
        //         "assets/Epsilon2.1/Epsilon2.1.2048/texture_00.png",
        //     ]
        // };
        //
        this.gl = null;
        this.canvas = null;
        this.glno = null;

    }
    /*
     * WebGLコンテキストを取得・初期化。
     * Live2Dの初期化、描画ループを開始。
     * (获取/初始化WebGL上下文。
     *初始化Live2D，开始绘制循环。)
     */
    initLoop(canvas /*HTML5 canvasオブジェクト*/ ,no) // (HTML5画布对象)
    {
        //------------ WebGLの初期化 ------------
        var that = this;
        // WebGLのコンテキストを取得する (获取WebGL的上下文)
        var para = {
            premultipliedAlpha: true,
            //        alpha : false
        };
        var gl = this.getWebGLContext(canvas, para);
        if (!gl) {
            this.myerror("Failed to create WebGL context.");
            return;
        }

        // OpenGLのコンテキストをセット(设置OpenGL上下文)
        this.gl = gl;
        this.canvas = canvas;
        that.glno = no;
        //------------ Live2Dの初期化 ------------

        // mocファイルからLive2Dモデルのインスタンスを生成
        // (从moc文件生成Live2D模型的实例
        this.loadBytes(that.modelDef.model, function(buf){
            // OpenGLのコンテキストをセット(MultiCanvasの場合はここでglをセットする)
            window.Live2D.setGL(gl, that.glno);
            that.live2DModel = window.Live2DModelWebGL.loadModel(buf, that.glno);
        });

        // テクスチャの読み込み(阅读纹理)
        var loadCount = 0;
        for (var i = 0; i < this.modelDef.textures.length; i++) {
            (function(tno) { // 即時関数で i の値を tno に固定する（onerror用)(使用立即函数将i的值固定为tno)
                that.loadedImages[tno] = new Image();
                that.loadedImages[tno].src = that.modelDef.textures[tno];
                that.loadedImages[tno].onload = function() {
                    if ((++loadCount) == that.modelDef.textures.length) {
                        that.loadLive2DCompleted = true; //全て読み終わった(我读完了一切。)
                    }
                }
                that.loadedImages[tno].onerror = function() {
                    that.myerror("Failed to load image : " + that.modelDef.textures[tno]);
                }
            })(i);
        }

    }

    drawMove(callback) {
        var that = this;
        //------------ 描画ループ ------(绘制循环)------

        (function tick() {
            that.draw(that.gl, callback); // 1回分描画

            var requestAnimationFrame =
                window.requestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.msRequestAnimationFrame;
            that.requestID = requestAnimationFrame(tick, that.canvas); // 一定時間後に自身を呼び出(一段时间后给自己打电话)す
        })();
    }

    draw(gl, callback) // WebGL上下文
    {
        // 描画エリアをクリア (清晰的绘图区域)
        gl.clearColor(0.0, 0.0, 0.0, 0.0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        // Live2D初期化
        if (!this.live2DModel || !this.loadLive2DCompleted)
            return; //ロードが完了していないので何もしないで返る(由于加载未完成，请不做任何操作)

        // ロード完了後に初回のみ初期化する(仅在加载后第一次初始化)
        if (!this.initLive2DCompleted) {
            this.initLive2DCompleted = true;

            // 画像からWebGLテクスチャを生成し、モデルに登録
            // (从图像创建WebGL纹理并将其注册到模型中)
            for (var i = 0; i < this.loadedImages.length; i++) {
                //Image型オブジェクトからテクスチャを生成
                //I(从Image类型对象生成纹理)
                var texName = this.createTexture(gl, this.loadedImages[i]);

                this.live2DModel.setTexture(i, texName); //モデルにテクスチャをセット(将纹理设置为模型)
            }

            // テクスチャの元画像の参照をクリア(清晰参考纹理的原始图像)
            this.loadedImages = null;

            // 表示位置を指定するための行列を定義する(定义矩阵以指定显示位置)
            var s = 2.0 / this.live2DModel.getCanvasWidth(); //canvasの横幅を-1..1区間に収める(保持画布的宽度在-1..1的范围内)
            var matrix4x4 = [
                s, 0, 0, 0,
                0, -s, 0, 0,
                0, 0, 1, 0, -1, 1, 0, 1
            ];
            this.live2DModel.setMatrix(matrix4x4);
        }

        if (callback) {
            // キャラクターのパラメータを適当に更新(适当更新角色的参数)
            callback(this.live2DModel);
        }

        // Live2Dモデルを更新して描画
        this.live2DModel.update(); // 現在のパラメータに合わせて頂点等を計算(根据当前参数计算顶点等)
        this.live2DModel.draw(); // 描画
    }


    /*
     * WebGLのコンテキストを取得する(获取WebGL的上下文)
     */
    getWebGLContext(canvas /*HTML5 canvasオブジェクト*/ ) {
        var NAMES = ["webgl", "experimental-webgl", "webkit-3d", "moz-webgl"];

        var param = {
            alpha: true,
            premultipliedAlpha: true
        };

        for (var i = 0; i < NAMES.length; i++) {
            try {
                var ctx = canvas.getContext(NAMES[i], param);
                if (ctx) return ctx;
            } catch (e) {}
        }
        return null;
    }


    /*
     * Image型オブジェクトからテクスチャを生成(从Image类型对象生成纹理)
     */
    createTexture(gl /*WebGLコンテキスト*/ , image /*WebGL Image*/ ) {
        var texture = gl.createTexture(); //テクスチャオブジェクトを作成する(创建纹理对象)
        if (!texture) {
            this.mylog("Failed to generate gl texture name.");
            return -1;
        }

        if (this.live2DModel.isPremultipliedAlpha() == false) {
            // 乗算済アルファテクスチャ以外の場合(在除了相乘的alpha纹理之外的情况下)
            gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 1);
        }
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); //imageを上下反転
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.bindTexture(gl.TEXTURE_2D, null);

        return texture;
    }


    /*
     * ファイルをバイト配列としてロードする(将文件加载为字节数组)
     */
    loadBytes(path, callback) {
        var request = new XMLHttpRequest();
        request.open("GET", path, true);
        request.responseType = "arraybuffer";
        request.onload = function() {
            switch (request.status) {
                case 200:
                    callback(request.response);
                    break;
                default:
                    this.myerror("Failed to load (" + request.status + ") : " + path);
                    break;
            }
        }

        request.send(null);
        return request;
    }

    cancelAnimation() {
        var that = this;
        that.loadLive2DCompleted = false;
        that.initLive2DCompleted = false;

        var cancelAnimationFrame =
                window.cancelAnimationFrame ||
                window.mozCancelAnimationFrame;
        cancelAnimationFrame(that.requestID);
    }


    /*
     * 画面ログを出力(输出屏幕日志)
     */
    mylog(msg /*string*/ ) {
        var myconsole = document.getElementById("myconsole");
        myconsole.innerHTML = myconsole.innerHTML + "<br>" + msg;
        console.log(msg);
    }

    /*
     * 画面エラーを出力(输出屏幕错误)
     */
    myerror(msg /*string*/ ) {
        console.error(msg);
        this.mylog("<span style='color:red'>" + msg + "</span>");
    }
}

export default Simple;
