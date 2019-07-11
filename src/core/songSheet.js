/**
 * Created by mugongxu on 2019/7/10.
 * 歌单数据获取
 */
const axios = require('../util/ajax.js');
const config = require('../config/api.js');
const insert = require('../util/insert.js');
const insertSong = require('./insertSong.js');

const insertMany = insert.insertMany;
const insertUnique = insert.insertUnique;

const PAGESIZE = 30;

let plistListTotal = [];

let totalSize = 0;

function getSheetList(db, page) {
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
      getSheetList(db, page + 1)
    } else {
      // 排行榜信息
      insertManySong(db);
    }
  }).catch(e => {
    console.log('sheet数据获取失败');
    if (PAGESIZE * page < totalSize) {
      // 下一页获取
      getSheetList(db, page + 1)
    } else {
      // 排行榜信息
      insertManySong(db);
    }
  });
};

function insertManySong(db) {
  // 排行榜信息
  insertMany(db, 'sheet', plistListTotal).then(res => {
    console.log('sheet：数据插入成功！---------------------------------');
    // 排行榜所属歌曲
    recursionFunc(db);
  }).catch(err => {
    console.log('sheet：数据插入失败！-------------------------------');
  });
}

let songListTotal = [];
let recursionIndex = -1;

function recursionFunc(db) {
  let length = plistListTotal.length;
  recursionIndex++;
  // 获取全部歌曲
  if (recursionIndex < length) {
    const currRank = plistListTotal[recursionIndex];
    getSheetInfo(db, currRank.specialid, 1, 0)
  } else {
    // 歌曲入库
    console.log('sheet歌曲开始入库！-------------------------------');
    songListTotal.forEach((item, index) => {
      insertSong(db, item).then(res => {
        // insertUnique(db, 'sheetIndex', {
        //   hash: item.hash,
        //   specialid: specialid
        // }, {
        //   hash: item.hash,
        //   specialid: specialid
        // });
        console.log('sheet：歌曲导入成功');
      }).catch(err => {
        console.log('sheet：歌曲导入失败');
      });
    });
  }
}

function getSheetInfo(db, specialid, page, total) {
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
    const songList = list.info || [];
    // 歌曲
    console.log('sheet歌曲获取中...');
    songListTotal = [...songListTotal, ...songList];
    total = list.total;
    if (PAGESIZE * page < total) {
      // 下一页获取
      getSheetInfo(db, specialid, page + 1, total)
    } else {
      recursionFunc(db);
    }
  }).catch(e => {
    console.log('sheet歌曲获取失败:', e);
    if (PAGESIZE * page < total) {
      // 下一页获取
      getSheetInfo(db, specialid, page + 1, total);
    } else {
      recursionFunc(db);
    }
  });
}

module.exports = getSheetList;
