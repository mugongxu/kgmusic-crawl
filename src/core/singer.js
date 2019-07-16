/**
 * Created by mugongxu on 2019/7/11.
 * 歌手数据获取
 */
const axios = require('../util/ajax.js');
const config = require('../config/api.js');
const insert = require('../util/insert.js');
const insertManySong = require('./insertSong.js').insertManySong;

const connectDB = require('../util/connectDB.js');

const unique = require('../util/unique.js');

const insertMany = insert.insertMany;
const insertUnique = insert.insertUnique;

const PAGESIZE = 30;

let classListTotal = [];

function getSingeClass() {
  axios.get(config.singer.url, {
    params: {}
  }).then(response => {
    const data = response.data || {};
    classListTotal = data.list || [];
    // 连接数据库
    connectDB((db, source) => {
      insertMany(db, 'singerClass', classListTotal).then(res => {
        console.log('singerClass：数据插入成功！---------------------------------');
        source.close();
        // 歌手分类所属歌手
        recursionFunc();
      }).catch(err => {
        console.log('singerClass：数据插入失败！-------------------------------');
        source.close();
      });
    });
  }).catch(e => {
    console.log('singerClass获取失败');
  });
}

let singerListTotal = [];
let recursionIndex = -1;

function recursionFunc() {
  let length = classListTotal.length;
  recursionIndex++;
  // 获取全部歌手
  if (recursionIndex < length) {
    const currClass = classListTotal[recursionIndex];
    getSingerListByClass(currClass.classid, 1, 0)
  } else {
    // 歌手入库
    console.log('singer开始入库！-------------------------------');
    let singerIndex = singerListTotal.map(item => {
      return {
        classid: item.classid,
        singerid: item.singerid
      };
    });
    // 连接数据库
    connectDB((db, source) => {
      // 歌手类别索引
      insertMany(db, 'singerIndex', singerIndex).then(res => {
        console.log('singerIndex：数据插入成功！----------------------------');
        source.close();
      }).catch(err => {
        console.log('singerIndex插入失败：-------------------------', err);
        source.close();
      });
    });
    // 连接数据库
    connectDB((db, source) => {
      insertMany(db, 'singer', unique(singerListTotal, 'singerid')).then(res => {
        console.log('singer：数据插入成功！---------------------------------');
        source.close();
        // 歌手分类所属歌手
        // uniqueSinger();
      }).catch(err => {
        console.log('singer：数据插入失败！-------------------------------');
        source.close();
      });
    });
  }
}

function getSingerListByClass(classid, page, total) {
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
    const pagesize = singers.pagesize;
    total = list.total;
    if (pagesize * page < total) {
      // 下一页获取
      getSingerListByClass(classid, page + 1, total)
    } else {
      recursionFunc();
    }
  }).catch(e => {
    console.log('singer获取失败', e);
    if (PAGESIZE * page < total) {
      // 下一页获取
      getSingerListByClass(classid, page + 1, total)
    } else {
      recursionFunc();
    }
  });
}

// 歌手去重
let uniqueSingerListTotal = [];

function uniqueSinger() {

  uniqueSingerListTotal = unique(singerListTotal, 'singerid');

  // 根据歌手获取歌曲
  recursionSingerFunc();
}

let recursionSingerIndex = -1;
let songListTotal = [];

function recursionSingerFunc() {
  let length = uniqueSingerListTotal.length;
  recursionSingerIndex++;
  // 获取全部歌手
  if (recursionSingerIndex < length) {
    const currSinger = uniqueSingerListTotal[recursionSingerIndex];
    getSongsBySinger(currSinger.singerid, 1, 0)
  } else {
    // 连接数据库
    connectDB((db, source) => {
      // 歌曲入库
      console.log('singer歌曲开始入库！-------------------------------');
      insertManySong(db, songListTotal).then(res => {
        console.log('singer：歌曲导入成功');
        source.close();
      }).catch(err => {
        console.log('singer：歌曲导入失败');
        source.close();
      });
    });
  }
}

function getSongsBySinger(singerid, page, total) {
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
      getSongsBySinger(singerid, page + 1, total)
    } else {
      recursionSingerFunc();
    }
  }).catch(e => {
    console.log('singer歌曲获取失败：', e);
    if (PAGESIZE * page < total) {
      // 下一页获取
      getSongsBySinger(singerid, page + 1, total)
    } else {
      recursionSingerFunc();
    }
  });
}

module.exports = getSingeClass;
