/**
 * Created by mugongxu on 2019/7/8.
 * 项目执行入口
 */
const mongodbConfig = require('./src/config/mongodb.js');
// mongodb链接模块
const MongoClient = require('mongodb').MongoClient;
// banner
const getBannerList = require('./src/core/banner.js');

MongoClient.connect(mongodbConfig.url, { useNewUrlParser: true }, (err, db) => {
  if (err) throw err;
  console.log('数据库链接成功！');
  console.log('-----------------------------------------------');
  let dbKgmusic = db.db('kgmusic');
  // 数据获取
  getBannerList(dbKgmusic);
});
