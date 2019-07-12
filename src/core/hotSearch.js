/**
 * Created by mugongxu on 2019/7/12.
 * 热搜数据获取
 */
const axios = require('../util/ajax.js');
const config = require('../config/api.js');
const insert = require('../util/insert.js');

const connectDB = require('../util/connectDB.js');

const insertMany = insert.insertMany;

function getHotSearchList() {
  axios.get(config.hotSearch.url, {
    params: {}
  }).then(response => {
    const data = response.data || {};
    const hotData = { ...(data.data || {}) };
    const hotSearchInfo = [...(hotData.info || [])];
    // 连接数据库
    connectDB((db, source) => {
      // 热搜信息
      insertMany(db, 'hotSearch', hotSearchInfo).then(res => {
        console.log('hotSearch：数据插入成功！---------------------------');
        source.close();
      }).catch(err => {
        console.log('hotSearch：数据插入失败！---------------------------');
        source.close();
      });
    });
  }).catch(e => {
    console.log(e);
  });
};

module.exports = getHotSearchList;
