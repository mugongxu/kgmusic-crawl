/**
 * Created by mugongxu on 2019/7/8.
 * 首页轮播图数据获取
 */
const axios = require('../util/ajax.js');
const config = require('../config/api.js');
const insert = require('../util/insert.js');
const insertSong = require('./insertSong.js');

const insertMany = insert.insertMany;
const insertUnique = insert.insertUnique;

function getBannerList(db) {
  axios.get(config.banner.url, {
    params: {}
  }).then(response => {
    const data = response.data || {};
    const bannerList = [...(data.banner || [])];
    const recommend = [...(data.data || [])];
    // 轮播信息
    insertMany(db, 'banner', bannerList).then(res => {
      console.log('banner：数据插入成功！');
    }).catch(err => {
      console.log(err);
    });
    // 最新歌曲
    const uptodate = recommend.map(item => {
      return {
        hash: item.hash,
        filename: item.filename
      };
    });
    insertMany(db, 'uptodate', uptodate).then(res => {
      console.log('uptodate：数据插入成功！');
    }).catch(err => {
      console.log(err);
    });
    // 歌曲
    recommend.forEach((item, index) => {
      insertSong(db, item).then(res => {
        console.log('歌曲导入成功');
      }).catch(err => {
        console.log('歌曲导入失败');
      });
    });
    insertSong(db, recommend[0]);
  }).catch(e => {
    console.log(e);
  });
};

module.exports = getBannerList;
