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

// ボタンのための変数
let saveButton;

let canvas, gl;

function setup() {
    document.documentElement.style.overflow = 'hidden';

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
    
    // デフォルトの色を設定（緑）
    currentObjectColor = [0, 255, 0];
    
    // ループを停止し、必要なときだけredraw()で描画
    // これにより保存時の色変更が効果的に機能します
    // noLoop();
    
    // redrawモードに設定（必要な時のみ描画）
    // frameRate(30);

    //シリアルポートの接続
    // create instance of p5.SerialPort
    serial = new p5.SerialPort();

    // print version of p5.serialport library
    console.log('p5.serialport.js ' + serial.version);

    serial.list();
    serial.on('list', updatePort);
    serial.on('data', getData);
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function keyPressed() {
    if (key === 's' || key === 'S') {
        saveCanvasImage();
        return false;
    }
}

// 保存ボタンを作成する関数
function createSaveButton() {
    saveButton = createButton('画像を保存');
    saveButton.position(windowWidth - 120, windowHeight - 60);
    saveButton.size(100, 40);
    saveButton.style('background-color', '#4CAF50');
    saveButton.style('color', 'white');
    saveButton.style('border', 'none');
    saveButton.style('border-radius', '4px');
    saveButton.style('font-size', '14px');
    saveButton.style('cursor', 'pointer');
    saveButton.mouseOver(() => saveButton.style('background-color', '#45a049'));
    saveButton.mouseOut(() => saveButton.style('background-color', '#4CAF50'));
    saveButton.mousePressed(saveCanvasImage);
}

// 保存用に色を変更して描画し直す関数
function saveCanvasImage() {
    // 通常の描画ループを一時停止
    noLoop();
    
    // 保存前の色を記憶
    const originalColorValues = [...currentObjectColor]; // 配列をコピー
    
    try {
        // 色を黒に変更
        currentObjectColor = [0, 0, 0]; // 黒色
        
        // 黒色で1フレーム描画
        redraw();
        
        // 画像を保存
        const now = new Date();
        const timestamp = `${now.getFullYear()}${(now.getMonth()+1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}_${now.getHours().toString().padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}${now.getSeconds().toString().padStart(2, '0')}`;
        const filename = `stencil_art_${timestamp}`;
        
        saveCanvas(canvas, filename, 'png');
        
        // 保存の通知
        // console.log(`画像を保存しました: ${filename}.png (黒色バージョン)`);
        // console.log('印刷サイズ: 5×7インチ (画像編集ソフトで印刷時に設定してください)');
        
        // 画面に一時的な通知を表示
        // showSaveNotification();
    } finally {
        // 元の色に戻す（try-finallyで確実に元に戻す）
        currentObjectColor = originalColorValues;
        
        // 元の色で再描画
        redraw();
        
        // 通常の描画ループを再開
        loop();
    }
}

// オブジェクトの色を管理するグローバル変数
let currentObjectColor = [0, 255, 0]; // デフォルトは緑色

// 保存通知を画面に表示する関数
function showSaveNotification() {
    // DOM要素を作成
    let notification = document.createElement('div');
    notification.textContent = '画像を保存しました（黒色版）';
    notification.style.position = 'fixed';
    notification.style.bottom = '120px';
    notification.style.right = '20px';
    notification.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    notification.style.color = 'white';
    notification.style.padding = '10px 20px';
    notification.style.borderRadius = '5px';
    notification.style.zIndex = '1000';
    notification.style.fontFamily = 'sans-serif';
    notification.style.fontSize = '14px';
    
    // ボディに追加
    document.body.appendChild(notification);
    
    // 3秒後に削除
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.5s';
        setTimeout(() => document.body.removeChild(notification), 500);
    }, 3000);
}

// 円を描画するヘルパー関数（saveCanvasImage用）
function drawSmoothCircle(g, x, y, radius, detail) {
    g.beginShape();
    for (let i = 0; i < TWO_PI; i += TWO_PI / detail) {
        let vx = x + cos(i) * radius;
        let vy = y + sin(i) * radius;
        g.vertex(vx, vy);
    }
    g.endShape(CLOSE);
}

// 角丸四角形を描画するヘルパー関数（saveCanvasImage用）
function drawRoundedRect(g, x, y, w, h, r) {
    g.beginShape();
    // 左上角
    g.vertex(x + r, y);
    g.quadraticVertex(x, y, x, y + r);
    // 左下角
    g.vertex(x, y + h - r);
    g.quadraticVertex(x, y + h, x + r, y + h);
    // 右下角
    g.vertex(x + w - r, y + h);
    g.quadraticVertex(x + w, y + h, x + w, y + h - r);
    // 右上角
    g.vertex(x + w, y + r);
    g.quadraticVertex(x + w, y, x + w - r, y);
    g.endShape(CLOSE);
}

// ウィンドウサイズが変更されたときに呼ばれる関数
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    // ボタンの位置を再調整
    saveButton.position(windowWidth - 120, windowHeight - 60);
}

function draw() {
    // 背景色を設定
    background(255);

    //Stencil Bufferの更新
    updateStencilBuffer();

    // ライトを設定
    updateLight();

    //Sliderの値を取得
    //以下の値を加工してコンテンツに適用する
    let slider1Value = sliderValues.slider1 * 300 - 90;
    let slider2Value = 30 + sliderValues.slider2 * 300;
    let slider3Value = sliderValues.slider3 * 330;

    /* 下のレイヤー開始 */
    setUnderLayer();
    // currentObjectColorを使用して色を設定
    fill(currentObjectColor[0], currentObjectColor[1], currentObjectColor[2]);

    // 四角形を描画
    roundedRect(-slider1Value, -200, slider2Value, 400, 20);



    /* 下のレイヤーここまで */



    /* 上のレイヤー開始 */
    setOverLayer();
    // currentObjectColorを使用して色を設定
    fill(currentObjectColor[0], currentObjectColor[1], currentObjectColor[2]);


    // 円を描画
    smoothCircle(slider1Value, -150, slider3Value, slider3Value);


    /* 上のレイヤーここまで */


    //マスク部分を描画
    drawMask(color(255, 255, 255));

    // 必要な場合のみログ出力
    // console.log("Received:", result);
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