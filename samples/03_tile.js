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
let pg;


function preload(){

}

function setup(){
	createCanvas(800, 800);
	pg = createGraphics(800, 800);
	frameRate(24);
}

function draw(){
    let tilesX = sliderValues.slider1 * 20; 
    let tilesY = sliderValues.slider2 * 20; 
    let val =  mapValue(sliderValues.slider3, 0, 1, -50, 50);; 

	background(220);

	pg.background(0);
	pg.fill(255);
	pg.textSize(800);
	pg.textAlign(CENTER, CENTER);
	pg.text('p', width / 2, height / 3);

	//let tilesX = 10;
	//let tilesY = 10;
	let tileW = width/tilesX;
	let tileH = height/tilesY;

	for(let y=0; y<tilesY; y++){
		for(let x=0; x<tilesX; x++){

			// source
			let sx = x * tileW + random(-50, 50);
			let sy = y * tileH;
			let sw = tileW;
			let sh = tileH;

			// destination
			let dx = x * tileW;
			let dy = y * tileH;
			let dw = tileW;
			let dh = tileH;

			copy(pg, sx, sy, sw, sh, dx, dy, dw, dh);
		}
	}

	
}

function mapValue(value, inMin, inMax, outMin, outMax) {
    return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}