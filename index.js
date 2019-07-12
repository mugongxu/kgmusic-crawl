/**
 * Created by mugongxu on 2019/7/8.
 * 项目执行入口
 */
// banner
const getBannerList = require('./src/core/banner.js');
// rank
const getRankList = require('./src/core/rank.js');
// sheet
const getSheetList = require('./src/core/songSheet.js');
// singe
const getSingeClass = require('./src/core/singer.js');
// hotSearch
const getHotSearchList = require('./src/core/hotSearch.js');

console.log('-----------------------------------------------');

// 数据获取
getBannerList();
getRankList();
getSheetList();
getSingeClass();
getHotSearchList();
