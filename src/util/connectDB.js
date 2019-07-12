/**
 * Created by mugongxu on 2019/7/12.
 * 创建数据库连接
 */
const mongodbConfig = require('../config/mongodb.js');
// mongodb链接模块
const MongoClient = require('mongodb').MongoClient;

function connectDB(callback) {
  MongoClient.connect(mongodbConfig.url, { useNewUrlParser: true }, (err, db) => {
    if (err) throw err;
    console.log('数据库链接成功！');
    console.log('-----------------------------------------------');
    let dbKgmusic = db.db('kgmusic');
    // 数据获取
    callback(dbKgmusic, db);
  });
}

module.exports = connectDB;
