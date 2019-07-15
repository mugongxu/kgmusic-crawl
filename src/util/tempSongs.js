/**
 * Created by mugongxu on 2019/7/14.
 * 更新歌曲脚本
 */
const insertManySong = require('../core/insertSong.js').insertManySong;

const connectDB = require('./connectDB.js');

// 连接数据库
connectDB((db, source) => {
  db.collection('tempSongs').find().skip(177545).toArray((err, result) => {
    if (err) throw err;
    result = result || [];
    // 添加歌曲
    insertManySong(db, result).then(res => {
      console.log('tempSongs：歌曲导入成功');
      source.close();
    }).catch(err => {
      console.log('tempSongs：歌曲导入失败');
      source.close();
    });
  });
});

