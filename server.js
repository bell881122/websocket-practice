const express = require('express')
const SocketServer = require('ws').Server
const PORT = 8888

//創建 express 物件，綁定監聽  port , 設定開啟後在 console 中提示
const app = express()

app.get('/', function (req, res) {
    res.sendFile(__dirname + '\\index.html');
});

const server = app.listen(PORT, () => {
    console.log(`Listening on ${PORT}`)
})

//將 express 交給 SocketServer 開啟 WebSocket 的服務
const wss = new SocketServer({ server })
//當有 client 連線成功時
wss.on('connection', ws => {
    console.log('Client connected')
    // 當收到client消息時
    ws.on('message', data => {
        // 收回來是 Buffer 格式、需轉成字串
        data = data.toString()

        // // 發送消息給當前 client 
        // ws.send(data)

        // 發送給所有client： 
        let clients = wss.clients  //取得所有連接中的 client
        clients.forEach(client => {
            client.send(data)  // 發送至每個 client
        })
    })
    // 當連線關閉
    ws.on('close', () => {
        console.log('Close connected')
    })
})