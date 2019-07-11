// 去重
module.exports = function (target, key) {
  let result = [];
  let hash = {};

  target.forEach(item => {
    if (!hash[item[key]]) {
      reasult.push(item);
      hash[item[key]] = true;
    }
  });

  return result;
};
