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


let font;
let points = []

function preload(){
	font = loadFont('./fonts/NOTOSANSJP-EXTRALIGHT.TTF');

}

function setup(){
	createCanvas(800, 800);
	

}

function draw(){

    let width = sliderValues.slider1 * 100; 
    let height = sliderValues.slider2 * 100; 
    let sampleFactor = sliderValues.slider3 * 0.5; 

    points = font.textToPoints ("p", 200,450,600,
		{
			sampleFactor: sampleFactor,
			simplifyThreshold: 0
		}
	);

	background('#DE7257');

	for (let i=0; i<points.length; i++){

        fill('#474140')
		ellipse(points[i].x ,
		points[i].y,
		width,
		height);
	}
}