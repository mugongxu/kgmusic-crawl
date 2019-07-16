/**
 * Created by mugongxu on 2019/7/14.
 * 更新歌单脚本
 */
const axios = require('../util/ajax.js');
const config = require('../config/api.js');
const insert = require('../util/insert.js');

const connectDB = require('./connectDB.js');

const insertMany = insert.insertMany;

const PAGESIZE = 30;

let plistListTotal = [];

let songListTotal = [];
let recursionIndex = -1;

// 连接数据库
connectDB((db, source) => {
  db.collection('sheet').find().toArray((err, result) => {
    if (err) throw err;
    plistListTotal = result || [];
    recursionFunc();
    source.close();
  });
});

function recursionFunc() {
  let length = plistListTotal.length;
  recursionIndex++;
  // 获取全部歌曲
  if (recursionIndex < length) {
    const currRank = plistListTotal[recursionIndex];
    getSheetInfo(currRank.specialid, 1, 0)
  } else {
    // 歌曲入库
    console.log('sheet歌曲开始入库！-------------------------------');
    // 连接数据库
    connectDB((db, source) => {
      insertMany(db, 'tempSongs', songListTotal).then(res => {
        console.log('tempSongs：数据插入成功！----------------------------');
        source.close();
      }).catch(err => {
        console.log('tempSongs插入失败：-------------------------', err);
        source.close();
      });
    });
  }
}

function getSheetInfo(specialid, page, total) {
  axios.get(config.pList.url + specialid, {
    params: {
      specialid: specialid,
      page: page,
      pagesize: PAGESIZE,
      json: true
    }
  }).then(response => {
    const data = response.data || {};
    const list = (data.list || {}).list || {};
    const songList = (list.info || []).map(item => {
      return {
        ...item,
        specialid
      };
    });
    // 歌曲
    console.log('sheet歌曲获取中...');
    songListTotal = [...songListTotal, ...songList];
    total = list.total;
    if (PAGESIZE * page < total) {
      // 下一页获取
      getSheetInfo(specialid, page + 1, total)
    } else {
      recursionFunc();
    }
  }).catch(e => {
    console.log('sheet歌曲获取失败:', e);
    if (PAGESIZE * page < total) {
      // 下一页获取
      getSheetInfo(specialid, page + 1, total);
    } else {
      recursionFunc();
    }
  });
}
