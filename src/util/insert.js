/**
 * Created by mugongxu on 2019/7/8.
 * 添加数据
 */
// 添加多条数据（删除原来的）
exports.insertMany = function (db, colName, data, inherit) {
  data = data || [];
  return new Promise((resolve, reject) => {
    if (!inherit) {
      db.collection(colName).deleteMany({}, (err, delOK) => {
        if (err) reject(err);
        if (delOK) {
          db.createCollection(colName, (err, res) => {
            if (err) reject(err);
            db.collection(colName).insertMany(data, (err, res) => {
              if (err) reject(err);
              resolve(res);
            })
          });
        }
      });
    } else {
      db.collection(colName).insertMany(data, (err, res) => {
        if (err) reject(err);
        resolve(res);
      })
    }
  });
}
// 添加单条唯一数据
exports.insertUnique = function(db, colName, query, obj) {
  return new Promise((resolve, reject) => {
    db.collection(colName).find(query).toArray((err, result) => {
      if (err) reject(err);
      if (!result || result.length === 0) {
        db.collection(colName).insertOne(obj, (err, res) => {
          if (err) reject(err);
          resolve(res);
        });
      } else {
        resolve();
      }
    });
  });
}
