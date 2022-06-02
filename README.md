# URL Shortener

1. 使用者可在輸入框輸入網址按下
2. 使用者複製短網址

# 軟體及模組版本
- nvm: ^1.1.9
- Node.js: ^16.15.0
- express: ^4.18.1
- express-handlebars: ^6.0.6
- express-validator: ^6.14.1
- Nodemon: ^2.0.16
- Font-awesome: ^6.1.1
- body-parser: ^1.20.0
- method-override: ^3.0.0
- mongoose: ^6.3.4

# 安裝與下載
安裝nvm

下載至本地指定資料夾
```
git clone https://github.com/cincinfish/restaurantList
```
開啟終端機(Terminal)，進入專案資料
```
cd ../restaurantList
```
安裝所有相關套件，express、express-handlebars、express-validator、body-parser、nodemon
```
npm install
```
環境變數
```
set MONGODB_URI = mongodb+srv://使用者密碼@cluster0.3tylo.mongodb.net/restaurant?retryWrites=true&w=majority
```
輸入指令執行
```
npm run dev
```
終端繫內出現下列訊息表示成功
```
Express is listening on localhost:3000
```
打開瀏覽器輸入下列網址即可查看專案
```
http://localhost:3000
```