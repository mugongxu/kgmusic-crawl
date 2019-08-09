/**
 * Created by mugongxu on 2019/7/9.
 * 歌曲获取（详情）
 */
const axios = require('../util/ajax.js');
const config = require('../config/api.js');

function insertSong(db, song) {
  // 添加歌曲
  const colName = 'songs';
  const query = {
    hash: song.hash
  };
  return new Promise((resolve, reject) => {
    db.collection(colName).find(query).toArray((err, result) => {
      if (err) reject(err);
      if (!result || result.length === 0) {
        getSongInfo(song).then(obj => {
          db.collection(colName).insertOne(obj, (err, res) => {
            if (err) reject(err);
            resolve(res);
          });
        }).catch(err => {
          reject(err);
        });
      } else {
        resolve('pass');
      }
    });
  });
}

function insertManySong(db, songList) {
  let length = songList.length;
  let index = 0;
  console.log('开始添加歌曲---------------------------'+ length +'条');

  return new Promise((resolve, reject) => {
    let recursionFunc = function () {
      let currSong = songList[index];
      // 自增
      index++
      // 添加歌曲
      console.log('歌曲添加中...' + index);
      insertSong(db, currSong).then(res => {
        console.log('歌曲添加成功-_-');
        if (index < length) {
          if (res === 'pass') {
            recursionFunc();
          } else {
            setTimeout(() => {
              recursionFunc();
            }, 0);
          }
        } else {
          resolve();
        }
      }).catch(err => {
        console.log('歌曲添加失败?_?');
        if (index < length) {
          setTimeout(() => {
            recursionFunc();
          }, 0);
        } else {
          resolve();
        }
      })
    }
    recursionFunc();
  });
}

// 获取歌曲详情
function getSongInfo(song) {
  // 信息
  let getDetail = new Promise((resolve, reject) => {
    axios.get(config.songInfo.url, {
      params: {
        cmd: 'playInfo',
        hash: song.hash,
        from: 'mkugou',
        apiver: 2,
        mid: '151810f9aeec7de177a1396f627bf434',
        userid: 0,
        platid: 5,
        dfid: '1L6aZN0iGr791T3mLL0LA9Ln'
      }
    }).then(res => {
      const data = res.data || {};
      if (data.errcode) {
        console.log('信息失败$$$$$$$$$$$$$$$$$$$$$$$$$$$');
        setTimeout(() => {
          reject(data.errcode);
        }, 60000);
      } else {
        resolve(data);
      }
    }).catch(err => {
      console.log('信息失败');
      reject(err);
    });
  });
  // 歌词
  let getLyrics = new Promise((resolve, reject) => {
    axios.get(config.songLyrics.url, {
      params: {
        cmd: 100,
        hash: song.hash,
        keyword: song.filename,
        timelength: song.duration * 1000,
        d: 0.4672584729025302
      }
    }).then(res => {
      const data = res.data || '';
      resolve(data);
    }).catch(err => {
      console.log('歌词失败');
      reject(err);
    });
  });

  return Promise.all([getDetail, getLyrics]).then(res => {
    let newInfo = { ...(res[0] || {}), lyrics: res[1] };
    // 合并信息
    let target = Object.assign({}, song, newInfo);
    return Promise.resolve(target);
  }).catch(err => {
    return Promise.reject(err)
  });
}

exports.insertSong = insertSong;
exports.insertManySong = insertManySong;
