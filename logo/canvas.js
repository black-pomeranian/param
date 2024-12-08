// グローバル変数として各スライダーの値を保持
// 0~1の値。数値の加工をp5js内で行う
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

    //Stencil Bufferの更新
    updateStencilBuffer();
  
    // ライトを設定
    updateLight();

    //Sliderの値を取得
    //以下の値を加工してコンテンツに適用する
    let slider1Value = sliderValues.slider1; 
    let slider2Value = sliderValues.slider2;
    let slider3Value = sliderValues.slider3; 
  
    /* 下のレイヤー開始 */
    setUnderLayer();
    fill(0, 255, 0); // 緑色で塗りつぶし

    // 四角形を描画
    rect(-50, -200, 100, 400);
    rect(120, -200, 100, 100);

    

    /* 下のレイヤーここまで */ 

  
  
    /* 上のレイヤー開始 */
    setOverLayer();
    fill(0, 255, 0); // 緑色で塗りつぶし
    // 円を描画

    circle(50, -150, 200); 


    /* 上のレイヤーここまで */


    //マスク部分を描画
    drawMask(color(255, 255, 255));
}



//背景の上に描画するコンテンツに対して適用
function setUnderLayer(){
    // ステンシルテスト条件を常に通過に設定
    gl.stencilFunc(gl.ALWAYS, 1, ~0);
    // ステンシル操作：フラグメント描画時にステンシル値を1に置き換え
    gl.stencilOp(gl.KEEP, gl.REPLACE, gl.REPLACE);
}
  
//UnderLayerに重なるコンテンツに対して適用
function setOverLayer(){
    // ステンシルテスト条件を常に通過に設定
    gl.stencilFunc(gl.ALWAYS, 0, ~0);
    // ステンシル操作：フラグメント描画時にステンシル値をインクリメント
    gl.stencilOp(gl.KEEP, gl.INCR, gl.INCR);
}

//UnderLayerとOverLayerの重なる部分に対して適用
function setMask(){
    // ステンシル値が2のピクセルのみ通過させる条件を設定
    gl.stencilFunc(gl.EQUAL, 2, ~0);
    // ステンシル操作：ステンシルバッファを変更しない
    gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);
}

//Mask部分の描画に使用
function drawMask(col){
    setMask();
    // 重なり部分へに白を描画
    translate(0, 0, 0); // 座標を平行移動
    fill(col); // 白色で塗りつぶし
    plane(width, height); // キャンバス全体に平面を描画
}

//Stencil Bufferの更新用
function updateStencilBuffer(){
    // ステンシルバッファをクリア
    gl.clear(gl.STENCIL_BUFFER_BIT);
    // ステンシルバッファを0で初期化
    gl.clearStencil(0);
}

function updateLight(){
    directionalLight(255, 255, 255, 0, 0, -1); // 指向性ライト
    ambientLight(128); // 環境光
}

