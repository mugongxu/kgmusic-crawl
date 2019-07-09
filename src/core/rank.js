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

function getRankList(db) {
  axios.get(config.rank.url, {
    params: {}
  }).then(response => {
    const data = response.data || {};
    const rank = data.rank || {};
    const rankList = [...(data.list || [])];
    // 排行榜信息
    insertMany(db, 'rank', bannerList).then(res => {
      console.log('rank：数据插入成功！');
    }).catch(err => {
      console.log(err);
    });
    // 歌曲
    
  }).catch(e => {
    console.log(e);
  });
};

module.exports = getRankList;
