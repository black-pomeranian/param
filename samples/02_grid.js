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
    createCanvas(1000, 1000);
    frameRate(24);
}

function draw() {
    background("#05395E");
    
    // スライダーの値を使用して図形を描画
    // Slider1: 四角形の幅
    // Slider2: 円の大きさ
    // Slider3: 図形の透明度
    
    let rectWidth = 100 + (sliderValues.slider1 * 200); // 幅を100-300の範囲で調整
    let circleSize = 200 + (sliderValues.slider2 * 400); // 円のサイズを200-600の範囲で調整
    let lineWidth = sliderValues.slider3 * 10; // 透明度を0-255の範囲で調整
    fill(32, 182, 104);

    for (var x = 0; x < width; x += width / 5) {
		for (var y = 0; y < height; y += height / 5) {

            
            if(x==width * 1/5){
                rect(x,y,width/5, height/5);
            }

            if(x==width * 2/5 ){
                if(y==height * 0/5){
                    rect(x,y,width/5, height/5);

                }
                if(y==height * 2/5){
                    rect(x,y,width/5, height/5);
                }
            }

            if(x==width * 3/5 ){
                if(y==height * 0/5){
                    rect(x,y,width/5, height/5);

                }

                if(y==height * 1/5){
                    rect(x,y,width/5, height/5);
                }

                if(y==height * 2/5){
                    rect(x,y,width/5, height/5);
                }
            }
		}
	}
}

function drawRect(x, y){
    strokeWeight(1);
    rect(x,y,width/5, height/5);
}

