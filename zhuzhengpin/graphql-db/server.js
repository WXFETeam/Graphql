// 引入模块
import Koa from 'koa'
import KoaStatic from 'koa-static'
import Router from 'koa-router'
import bodyParser from 'koa-bodyparser'

import {database} from './mongodb' // 引入mongodb
import {saveInfo, fetchInfo} from './controllers/info' // 引入info controller
import {saveStudent, fetchStudent, fetchStudentDetail} from './controllers/student' // 引入 student controller

// const Koa = require('koa');
// const KoaStatic = require('koa-static');
// const Router = require('koa-router');
// const bodyParser = require('koa-bodyparser');

// const {database} = require('./mongodb');
// const {saveInfo, fetchInfo} = require('./controllers/info');
// const {saveStudent, fetchStudent, fetchStudentDetail} = require('./controllers/student');

database() // 链接数据库并且初始化数据模型

const app = new Koa()
const router = new Router();

app.use(bodyParser());
app.use(KoaStatic(__dirname + '/public'));

router.get('/test', (ctx, next) => {
  ctx.body="test page"
});

// 设置每一个路由对应的相对的控制器
router.post('/saveinfo', saveInfo)
router.get('/info', fetchInfo)

router.post('/savestudent', saveStudent)
router.get('/student', fetchStudent)
router.get('/studentDetail', fetchStudentDetail)

app
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(4000);

console.log('graphQL server listen port: ' + 4000)