// 需要请求的API
const api = {
  // 首页轮播图
  banner: {
    url: 'http://m.kugou.com/?json=true',
    method: 'GET'
  },
  // 音乐歌单
  pIndex: {
    url: 'http://m.kugou.com/plist/index&json=true',
    method: 'GET'
  },
  // 歌单下音乐列表
  pList: {
    url: 'http://m.kugou.com/plist/list/{specialid}',
    method: 'GET'
  },
  // 音乐排行榜
  rank: {
    url: 'http://m.kugou.com/rank/list&json=true',
    method: 'GET'
  },
  // 排行榜歌曲列表
  rankInfo: {
    url: 'http://m.kugou.com/rank/info',
    method: 'GET'
  },
  // 歌手分类
  singer: {
    url: 'http://m.kugou.com/singer/class&json=true',
    method: 'GET'
  },
  // 歌手列表
  singerList: {
    url: 'http://m.kugou.com/singer/list/{classid}',
    method: 'GET'
  },
  // 歌手信息
  singerInfo: {
    url: 'http://m.kugou.com/singer/info/{singerid}',
    method: 'GET'
  },
  // 歌曲详情
  songInfo: {
    url: 'http://m.kugou.com/api/v1/song/get_song_info',
    method: 'GET'
  },
  // 歌曲详情 - 带歌词
  songDetail: {
    url: 'http://www.kugou.com/yy/index.php',
    method: 'GET'
  },
  // 热门搜索列表
  hotSearch: {
    url: 'http://mobilecdn.kugou.com/api/v3/search/hot',
    method: 'GET'
  },
  // 音乐搜索
  songSearch: {
    url: 'http://mobilecdn.kugou.com/api/v3/search/song',
    method: 'GET'
  },
  // 单独获取歌词
  songLyrics: {
    url: 'http://m.kugou.com/app/i/krc.php',
    method: 'GET'
  }
};

module.exports = api;
