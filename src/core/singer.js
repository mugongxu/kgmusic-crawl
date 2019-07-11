/**
 * Created by mugongxu on 2019/7/11.
 * 歌手数据获取
 */
const axios = require('../util/ajax.js');
const config = require('../config/api.js');
const insert = require('../util/insert.js');
const insertSong = require('./insertSong.js');

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
    }
  }

function getSingerListByClass(db, classid, page, total) {
  
}
