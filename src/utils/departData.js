const departData = () => {
  // 获取指定范围内的随机数
  function randomAccess(min, max) {
    return Math.floor(Math.random() * (min - max) + max);
  }

  // 解码
  function decodeUnicode(str) {
    //Unicode显示方式是\u4e00
    str = '\\u'+str;
    str = str.replace(/\\/g, '%');
    //转换中文
    str = unescape(str);
    //将其他受影响的转换回原来
    str = str.replace(/%/g, '\\');
    return str;
  }

  /*
  *@param Number NameLength 要获取的名字长度
  */
  function getRandomName(NameLength) {
    let name = '';
    for(let i = 0;i<NameLength;i++){
      let unicodeNum  = '';
      unicodeNum = randomAccess(0x4e00,0x9fa5).toString(16);
      name += decodeUnicode(unicodeNum);
    }
    return name;
  }
  let data = [];
  for (let i = 0; i < 5000; i++) {
    data.push({
      id: i,
      departName: getRandomName(Math.floor((Math.random() + 0.1) * 20)),
      userNum : 2000 + Math.floor(Math.random()*200)
    });
  }
  return data;
};
export default departData;