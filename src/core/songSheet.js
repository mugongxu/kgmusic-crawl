/**
 * Created by mugongxu on 2019/7/10.
 * 歌单数据获取
 */
const axios = require('../util/ajax.js');
const config = require('../config/api.js');
const insert = require('../util/insert.js');
const insertManySong = require('./insertSong.js').insertManySong;

const connectDB = require('../util/connectDB.js');

const insertMany = insert.insertMany;
const insertUnique = insert.insertUnique;

const PAGESIZE = 30;

let plistListTotal = [];

let totalSize = 0;

function getSheetList(page) {
  page = page || 1;
  axios.get(config.pIndex.url, {
    params: {
      page: page,
      pagesize: PAGESIZE
    }
  }).then(response => {
    const data = response.data || {};
    const plist = (data.plist || {}).list || {};
    const plistList = [...(plist.info || [])];
    // 保存数据
    plistListTotal = [...plistListTotal, ...plistList];
    totalSize = plist.total;
    console.log('sheet数据获取中...')
    if (PAGESIZE * page < totalSize) {
      // 下一页获取
      getSheetList(page + 1)
    } else {
      // 歌单歌曲
      insertSongList();
    }
  }).catch(e => {
    console.log('sheet数据获取失败');
    if (PAGESIZE * page < totalSize) {
      // 下一页获取
      getSheetList(page + 1)
    } else {
      // 歌单歌曲
      insertSongList();
    }
  });
};

function insertSongList() {
  // 连接数据库
  connectDB((db, source) => {
    // 排行榜信息
    insertMany(db, 'sheet', plistListTotal).then(res => {
      console.log('sheet：数据插入成功！---------------------------------');
      source.close();
      // 排行榜所属歌曲
      recursionFunc();
    }).catch(err => {
      console.log('sheet：数据插入失败！-------------------------------');
      source.close();
    });
  });
}

let songListTotal = [];
let recursionIndex = -1;

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
    let sheetIndex = songListTotal.map(item => {
      return {
        hash: item.hash,
        specialid: item.specialid,
        filename: item.filename
      };
    });
    // 连接数据库
    // connectDB((db, source) => {
    //   insertMany(db, 'tempSongs', songListTotal).then(res => {
    //     console.log('tempSongs：数据插入成功！----------------------------');
    //     source.close();
    //   }).catch(err => {
    //     console.log('tempSongs插入失败：-------------------------', err);
    //     source.close();
    //   });
    // });
    // 连接数据库
    connectDB((db, source) => {
      // 排行榜索引
      insertMany(db, 'sheetIndex', sheetIndex).then(res => {
        console.log('sheetIndex：数据插入成功！----------------------------');
        source.close();
      }).catch(err => {
        console.log('sheetIndex插入失败：-------------------------', err);
        source.close();
      });
    });
    // 连接数据库
    // connectDB((db, source) => {
    //   insertManySong(db, songListTotal).then(res => {
    //     console.log('sheet：歌曲导入成功');
    //     source.close();
    //   }).catch(err => {
    //     console.log('sheet：歌曲导入失败');
    //     source.close();
    //   });
    // });
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

module.exports = getSheetList;
