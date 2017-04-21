const pkg = require('./package')
const config = require('./server/db/dbconfig')
const express = require('express')
const session = require('express-session')
const favicon = require('serve-favicon')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

// const MongoStore = require('connect-mongo')(session);

const index = require('./server/router/index') // localhost:3000/
  // session机制的user
const user = require('./server/router/user')

const db = mongoose.connect(config.mongodb);
// 数据库连接
db.connection.on("error", function(error) {
  console.log("数据库连接失败：" + error);
});
db.connection.on("open", function() {
  console.log("------数据库连接成功！------");
});
// Use native promises
mongoose.Promise = global.Promise

const app = express()
const port = process.env.PORT || 3000


// url请求解析
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))

// favicon
app.use(favicon(__dirname + '/src/assets/logo.png'))

// 静态资源
app.use(express.static('dist'))

// session
app.use(session({
  secret: 'usersession',
  key: 'usersession',
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 10000 // 设置返回的cookie时效为30秒，测试用
  }

}))

// 设定路由
app.use('/', index)
app.use('/api', user)

app.listen(port, () => {
  console.log(`${pkg.name} listening on port ${port}`)
})