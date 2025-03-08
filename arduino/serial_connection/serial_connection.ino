const int potentionMeter1 = A0;
const int potentionMeter2 = A1;
const int potentionMeter3 = A2;

void setup() {
  Serial.begin(9600); // シリアル通信の初期化
  Serial.println("Hello Arduino!"); // 初回メッセージ
}

void loop() {
  int value1 = analogRead(potentionMeter1);
  int value2 = analogRead(potentionMeter2);
  int value3 = analogRead(potentionMeter3);

  Serial.print(value1);
  Serial.print(",");
  Serial.print(value2);
  Serial.print(",");
  Serial.println(value3); // 改行してデータを送信

  delay(10); // 負荷を軽減するための短い遅延
}
