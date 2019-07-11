/**
 * Created by mugongxu on 2019/7/11.
 * 歌手数据获取
 */
const axios = require('../util/ajax.js');
const config = require('../config/api.js');
const insert = require('../util/insert.js');
const insertSong = require('./insertSong.js');

const unique = require('../util/unique.js');

const insertMany = insert.insertMany;
const insertUnique = insert.insertUnique;

const PAGESIZE = 30;

let classListTotal = [];

function getSingeClass(db) {
  axios.get(config.singer.url, {
    params: {}
  }).then(response => {
    const data = response.data || {};
    classListTotal = data.list || [];
    insertMany(db, 'singerClass', classListTotal).then(res => {
      console.log('singerClass：数据插入成功！---------------------------------');
      // 歌手分类所属歌手
      recursionFunc(db);
    }).catch(err => {
      console.log('singerClass：数据插入失败！-------------------------------');
    });
  }).catch(e => {
    console.log('singerClass获取失败');
  });
}

let singerListTotal = [];
let recursionIndex = -1;

function recursionFunc(db) {
  let length = classListTotal.length;
  recursionIndex++;
  // 获取全部歌手
  if (recursionIndex < length) {
    const currClass = classListTotal[recursionIndex];
    getSingerListByClass(db, currClass.classid, 1, 0)
  } else {
    // 歌手入库
    console.log('singer开始入库！-------------------------------');
    insertMany(db, 'singer', singerListTotal).then(res => {
      console.log('singer：数据插入成功！---------------------------------');
      // 歌手分类所属歌手
      uniqueSinger(db);
    }).catch(err => {
      console.log('singer：数据插入失败！-------------------------------');
    });
  }
}

function getSingerListByClass(db, classid, page, total) {
  axios.get(config.singerList.url + classid, {
    params: {
      classid: classid,
      page: page,
      pagesize: PAGESIZE,
      json: true
    }
  }).then(response => {
    const data = response.data || {};
    const singers = data.singers || {};
    const list = singers.list || {};
    let singeList = (list.info || []).map(item => {
      return {
        ...item,
        classid
      };
    });
    // 页数信息
    console.log('singer信息获取中...');
    singerListTotal = [...singerListTotal, ...singeList];
    const pagesize = list.pagesize;
    total = list.total;
    if (pagesize * page < total) {
      // 下一页获取
      getSingerListByClass(db, classid, page + 1, total)
    } else {
      recursionFunc(db);
    }
  }).catch(e => {
    console.log('singer获取失败', e);
    if (PAGESIZE * page < total) {
      // 下一页获取
      getSingerListByClass(db, classid, page + 1, total)
    } else {
      recursionFunc(db);
    }
  });
}

// 歌手去重
let uniqueSingerListTotal = [];

function uniqueSinger(db) {

  uniqueSingerListTotal = unique(singerListTotal, 'singeeid');

  // 根据歌手获取歌曲
  recursionSingerFunc(db);
}

let recursionSingerIndex = -1;
let songListTotal = [];

function recursionSingerFunc(db) {
  let length = uniqueSingerListTotal.length;
  recursionSingerIndex++;
  // 获取全部歌手
  if (recursionSingerIndex < length) {
    const currSinger = uniqueSingerListTotal[recursionSingerIndex];
    getSongsBySinger(db, currSinger.singerid, 1, 0)
  } else {
    // 歌曲入库
    console.log('singer歌曲开始入库！-------------------------------');
    songListTotal.forEach((item, index) => {
      insertSong(db, item).then(res => {
        console.log('singer：歌曲导入成功');
      }).catch(err => {
        console.log('singer：歌曲导入失败');
      });
    });
  }
}

function getSongsBySinger(db, singerid, page, total) {
  axios.get(config.singerInfo.url + singerid, {
    params: {
      singerid: singerid,
      page: page,
      pagesize: PAGESIZE,
      json: true
    }
  }).then(response => {
    const data = response.data || {};
    const songs = data.songs || {};
    const songList = songs.list || [];
    // 歌曲
    console.log('singer歌曲获取中...');
    songListTotal = [...songListTotal, ...songList];
    total = songs.total;
    if (PAGESIZE * page < total) {
      // 下一页获取
      getSongsBySinger(db, rankid, page + 1, total)
    } else {
      recursionSingerFunc(db);
    }
  }).catch(e => {
    console.log('singer歌曲获取失败：', e);
    if (PAGESIZE * page < total) {
      // 下一页获取
      getSongsBySinger(db, rankid, page + 1, total)
    } else {
      recursionSingerFunc(db);
    }
  });
}

module.exports = getSingeClass;
