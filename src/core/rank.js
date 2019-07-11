/**
 * Created by mugongxu on 2019/7/9.
 * 排行榜数据获取
 */
const axios = require('../util/ajax.js');
const config = require('../config/api.js');
const insert = require('../util/insert.js');
const insertSong = require('./insertSong.js');

const insertMany = insert.insertMany;
const insertUnique = insert.insertUnique;

const PAGESIZE = 30;

let rankListTotal = [];

function getRankList(db) {
  axios.get(config.rank.url, {
    params: {}
  }).then(response => {
    const data = response.data || {};
    const rank = data.rank || {};
    rankListTotal = [...(rank.list || [])];
    // 排行榜信息
    insertMany(db, 'rank', rankListTotal).then(res => {
      console.log('rank：数据插入成功！----------------------------');
      // 排行榜所属歌曲
      recursionFunc(db);
    }).catch(err => {
      console.log('rank插入失败：-------------------------', err);
    });
  }).catch(e => {
    console.log('rank获取失败：', e);
  });
};

let songListTotal = [];
let recursionIndex = -1;

function recursionFunc(db) {
  let length = rankListTotal.length;
  recursionIndex++;
  // 获取全部歌曲
  if (recursionIndex < length) {
    const currRank = rankListTotal[recursionIndex];
    getRankInfo(db, currRank.rankid, 1, 0)
  } else {
    // 歌曲入库
    console.log('rank歌曲开始入库！-------------------------------');
    songListTotal.forEach((item, index) => {
      insertSong(db, item).then(res => {
        // insertUnique(db, 'rankIndex', {
        //   hash: item.hash,
        //   rankid: rankid
        // }, {
        //   hash: item.hash,
        //   rankid: rankid
        // });
        console.log('rank：歌曲导入成功');
      }).catch(err => {
        console.log('rank：歌曲导入失败');
      });
    });
  }
}

function getRankInfo(db, rankid, page, total) {
  axios.get(config.rankInfo.url, {
    params: {
      rankid: rankid,
      page: page,
      pagesize: PAGESIZE,
      json: true
    }
  }).then(response => {
    const data = response.data || {};
    const songs = data.songs || {};
    const songList = songs.list || [];
    // 歌曲
    console.log('rank歌曲获取中...');
    songListTotal = [...songListTotal, ...songList];
    total = songs.total;
    if (PAGESIZE * page < total) {
      // 下一页获取
      getRankInfo(db, rankid, page + 1, total)
    } else {
      recursionFunc(db);
    }
  }).catch(e => {
    console.log('rank歌曲获取失败：', e);
    if (PAGESIZE * page < total) {
      // 下一页获取
      getRankInfo(db, rankid, page + 1, total)
    } else {
      recursionFunc(db);
    }
  });
}

module.exports = getRankList;
