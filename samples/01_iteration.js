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

function setup() {
    createCanvas(windowWidth, windowHeight);
    frameRate(60);
}

function draw() {
    background("#05395E");
    
    // スライダーの値を使用して図形を描画
    // Slider1: 四角形の幅
    // Slider2: 円の大きさ
    // Slider3: 線の太さ
    
    let rectWidth = 100 + (sliderValues.slider1 * 200); 
    let circleSize = 200 + (sliderValues.slider2 * 400); 
    let lineWidth = sliderValues.slider3 * 10; 
    
    fill(32, 182, 104);
    let rectNum = rectWidth / 20;
    strokeWeight(lineWidth);
    for(let i=rectWidth; 0<i; i-= rectNum){
        rect(width/3, height/3, i, height*2/4);
    }

    let circleNum = circleSize / 20;

    for(let i=circleSize; 0<i; i-= circleNum){
        circle(width/2, height/3, i);

    }
    //rect(width/3, height/3, rectWidth, height*2/4);
    //circle(width/2, height/3, circleSize);
}

