//後にシリアル通信リストの0番目で上書きされるが念のため
//Windows用
let serialPortName = 'COM3';
//Mac用
// let serialPortName = '/dev/cu.usbmodem11201';

let result = '';


// グローバル変数として各スライダーの値を保持
// 0~1の値。数値の加工をp5js内で行う
let sliderValues = {
    slider1: 0.5,
    slider2: 0.5,
    slider3: 0.5
};

/*
// DOMが読み込まれた後にスライダーのイベントリスナーを設定
document.addEventListener('DOMContentLoaded', () => {
    // スライダーの値が変更されたときのイベントリスナー
    document.querySelectorAll('input[type="range"]').forEach(slider => {
        slider.addEventListener('input', function () {
            const value = parseFloat(this.value);
            sliderValues[this.id] = value;
            document.getElementById(`value${this.id.slice(-1)}`).textContent = value.toFixed(2);
        });
    });
});
*/

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

    //シリアルポートの接続
    // create instance of p5.SerialPort
    serial = new p5.SerialPort();

    // print version of p5.serialport library
    console.log('p5.serialport.js ' + serial.version);

    serial.list();
    serial.on('list', updatePort);
    serial.on('data', getData);
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
    let slider1Value = sliderValues.slider1 * 100;
    let slider2Value = sliderValues.slider2 * 200;
    let slider3Value = sliderValues.slider3 * 200;

    /* 下のレイヤー開始 */
    setUnderLayer();
    fill(0, 255, 0); // 緑色で塗りつぶし

    // 四角形を描画
    roundedRect(-slider1Value, -200, slider2Value, 400, 20);



    /* 下のレイヤーここまで */



    /* 上のレイヤー開始 */
    setOverLayer();
    fill(0, 255, 0); // 緑色で塗りつぶし


    // 円を描画
    smoothCircle(slider1Value, -150, slider3Value, slider3Value);


    /* 上のレイヤーここまで */


    //マスク部分を描画
    drawMask(color(255, 255, 255));

    console.log("Received:", result);
}



//背景の上に描画するコンテンツに対して適用
function setUnderLayer() {
    // ステンシルテスト条件を常に通過に設定
    gl.stencilFunc(gl.ALWAYS, 1, ~0);
    // ステンシル操作：フラグメント描画時にステンシル値を1に置き換え
    gl.stencilOp(gl.KEEP, gl.REPLACE, gl.REPLACE);
}

//UnderLayerに重なるコンテンツに対して適用
function setOverLayer() {
    // ステンシルテスト条件を常に通過に設定
    gl.stencilFunc(gl.ALWAYS, 0, ~0);
    // ステンシル操作：フラグメント描画時にステンシル値をインクリメント
    gl.stencilOp(gl.KEEP, gl.INCR, gl.INCR);
}

//UnderLayerとOverLayerの重なる部分に対して適用
function setMask() {
    // ステンシル値が2のピクセルのみ通過させる条件を設定
    gl.stencilFunc(gl.EQUAL, 2, ~0);
    // ステンシル操作：ステンシルバッファを変更しない
    gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);
}

//Mask部分の描画に使用
function drawMask(col) {
    setMask();
    // 重なり部分へに白を描画
    translate(0, 0, 0); // 座標を平行移動
    fill(col); // 白色で塗りつぶし
    plane(width, height); // キャンバス全体に平面を描画
}

//Stencil Bufferの更新用
function updateStencilBuffer() {
    // ステンシルバッファをクリア
    gl.clear(gl.STENCIL_BUFFER_BIT);
    // ステンシルバッファを0で初期化
    gl.clearStencil(0);
}

function updateLight() {
    directionalLight(255, 255, 255, 0, 0, -1); // 指向性ライト
    ambientLight(128); // 環境光
}

function smoothCircle(x, y, radius, detail) {
    beginShape();
    for (let i = 0; i < TWO_PI; i += TWO_PI / detail) {
        let vx = x + cos(i) * radius;
        let vy = y + sin(i) * radius;
        vertex(vx, vy);
    }
    endShape(CLOSE);
}

function roundedRect(x, y, w, h, r) {
    beginShape();
    // 左上角
    vertex(x + r, y);
    quadraticVertex(x, y, x, y + r);
    // 左下角
    vertex(x, y + h - r);
    quadraticVertex(x, y + h, x + r, y + h);
    // 右下角
    vertex(x + w - r, y + h);
    quadraticVertex(x + w, y + h, x + w, y + h - r);
    // 右上角
    vertex(x + w, y + r);
    quadraticVertex(x + w, y, x + w - r, y);
    endShape(CLOSE);
}

// callback function to update serial port name
function updatePort(portList) {
    if (portList.length > 0) {
        serialPortName = portList[0]; // 一番最初のポートを選択
        console.log("Using port:", serialPortName);
        serial.openPort(serialPortName);
    } else {
        console.log("No serial ports found.");
    }
}


function getData() {
    let data = serial.readLine().trim(); // 受信データを取得し、前後の空白を削除
    if (!data) return; // データが空なら何もしない

    let values = data.split(','); // データをカンマ区切りで分割（複数の値が送られる場合）
    
    if (values.length >= 3) { // 3つ以上の値があることを確認
        sliderValues.slider1 = constrain(parseInt(values[0]) / 1023, 0, 1);
        sliderValues.slider2 = constrain(parseInt(values[1]) / 1023, 0, 1);
        sliderValues.slider3 = constrain(parseInt(values[2]) / 1023, 0, 1);
        
        console.log("Updated sliderValues:", sliderValues);
    }
}

