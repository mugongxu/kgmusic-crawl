/**
 * Created by mugongxu on 2019/7/8.
 * 首页轮播图数据获取
 */
const axios = require('../util/ajax.js');
const config = require('../config/api.js');
const insert = require('../util/insert.js');
const insertManySong = require('./insertSong.js').insertManySong;

const connectDB = require('../util/connectDB.js');

const insertMany = insert.insertMany;

function getBannerList() {
  axios.get(config.banner.url, {
    params: {}
  }).then(response => {
    const data = response.data || {};
    const bannerList = [...(data.banner || [])];
    const recommend = [...(data.data || [])];
    // 最新歌曲
    const uptodate = recommend.map(item => {
      return {
        hash: item.hash,
        filename: item.filename
      };
    });
    // 连接数据库
    connectDB((db, source) => {
      // 轮播信息
      insertMany(db, 'banner', bannerList).then(res => {
        console.log('banner：数据插入成功！---------------------------');
        source.close();
      }).catch(err => {
        console.log(err);
        source.close();
      });
    });
    // 连接数据库
    connectDB((db, source) => {
      insertMany(db, 'uptodate', uptodate).then(res => {
        console.log('uptodate：数据插入成功！-----------------------------');
        source.close();
      }).catch(err => {
        console.log(err);
        source.close();
      });
    });
    // 连接数据库
    connectDB((db, source) => {
      // 歌曲
      insertManySong(db, recommend).then(res => {
        console.log('banner：歌曲导入成功');
        source.close();
      }).catch(err => {
        console.log('banner：歌曲导入失败');
        source.close();
      });
    });
  }).catch(e => {
    console.log(e);
  });
};

module.exports = getBannerList;
