// 去重
module.exports = function (target, key) {
  let result = [];
  let hash = {};

  if (!key) {
    return traget;
  }

  target.forEach(item => {
    if (!hash[item[key]]) {
      result.push(item);
      hash[item[key]] = true;
    }
  });

  return result;
};
