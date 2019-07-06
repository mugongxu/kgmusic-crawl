const axios = require('./src/ajax.js');

// axios.get('http://m.kugou.com/?json=true', {
//   params: {}
// }).then(response => {
//   console.log(response.data);
// }).catch(e => {
//   console.log(e);
// });

const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://47.244.148.34:27017';

MongoClient.connect(url, { useNewUrlParser: true }, (err, db) => {
  if (err) throw err;
  console.log('数据库链接成功！');
  axios.get('http://m.kugou.com/?json=true', {
    params: {}
  }).then(response => {
    console.log(response.data);
  }).catch(e => {
    console.log(e);
  });
  let dbKgmusic = db.db('kgmusic');
  dbKgmusic.collection('banner').find().toArray((err, result) => {
    if (err) throw err;
    console.log(result);
  });
  db.close();
});
