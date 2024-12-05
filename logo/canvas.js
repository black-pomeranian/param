// グローバル変数として各スライダーの値を保持
let sliderValues = {
    slider1: 0.5,
    slider2: 0.5,
    slider3: 0.5
};

// DOMが読み込まれた後にスライダーのイベントリスナーを設定
document.addEventListener('DOMContentLoaded', () => {
    // スライダーの値が変更されたときのイベントリスナー
    document.querySelectorAll('input[type="range"]').forEach(slider => {
        slider.addEventListener('input', function() {
            const value = parseFloat(this.value);
            sliderValues[this.id] = value;
            document.getElementById(`value${this.id.slice(-1)}`).textContent = value.toFixed(2);
        });
    });
});

let canvas, gl;

function setup() {
    // ステンシルバッファを有効にする
    setAttributes("stencil", true);
    // キャンバスをWEBGLモードで作成
    canvas = createCanvas(windowWidth, windowHeight, WEBGL);
    // WebGLコンテキストを取得
    gl = canvas.GL;
    // ステンシルビットの数をログに出力
    console.log(gl.getParameter(gl.STENCIL_BITS));

    // ステンシルテストを有効化
    gl.enable(gl.STENCIL_TEST);
    // 描画時にストロークを無効化
    noStroke();
  }
  
  function draw() {
    // 背景色を設定
    background(64);
    // ステンシルバッファをクリア
    gl.clear(gl.STENCIL_BUFFER_BIT);
    // ステンシルバッファを0で初期化
    gl.clearStencil(0);
  
    // ライトを設定
    directionalLight(255, 255, 255, 0, 0, -1); // 指向性ライト
    ambientLight(128); // 環境光
  
    // ステンシルテスト条件を常に通過に設定
    gl.stencilFunc(gl.ALWAYS, 1, ~0);
    // ステンシル操作：フラグメント描画時にステンシル値を1に置き換え
    gl.stencilOp(gl.KEEP, gl.REPLACE, gl.REPLACE);
  
    // 四角形を描画
    translate(-25, -25, 0); // 座標を平行移動
    fill(0, 255, 0); // 緑色で塗りつぶし
    plane(100, 400); // 四角形を描画
  
    // ステンシルテスト条件を常に通過に設定
    gl.stencilFunc(gl.ALWAYS, 0, ~0);
    // ステンシル操作：フラグメント描画時にステンシル値をインクリメント
    gl.stencilOp(gl.KEEP, gl.INCR, gl.INCR);
  
    // 円を描画
    translate(50, 50, 0); // 座標を平行移動
    fill(0, 255, 0); // 緑色で塗りつぶし
    ellipse(0, -200, 200, 200); // 円を描画
  
    // ステンシル値が2のピクセルのみ通過させる条件を設定
    gl.stencilFunc(gl.EQUAL, 2, ~0);
    // ステンシル操作：ステンシルバッファを変更しない
    gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);
  
    // 重なり部分へに白を描画
    translate(-25, -25, 0); // 座標を平行移動
    fill(255, 255, 255); // 白色で塗りつぶし
    plane(width, height); // キャンバス全体に平面を描画
  }

