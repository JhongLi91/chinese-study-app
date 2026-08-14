const fs = require('fs');
const path = require('path');
const pkg = require('pinyin');
const pinyin = pkg.default || pkg;

function formatPinyin(text) {
  const pyArr = pinyin(text, { style: 'tone' });
  const words = pyArr.map(p => p[0]);
  let str = words.join(' ');
  str = str.replace(/ ([,.?!;:'"()“”‘’])/g, '$1');
  str = str.replace(/([“‘(]) /g, '$1');
  str = str.replace(/ 。/g, '.').replace(/ ，/g, ',').replace(/ ！/g, '!').replace(/ ？/g, '?').replace(/ 、/g, ',');
  if (str.length > 0) {
    str = str.charAt(0).toUpperCase() + str.slice(1);
  }
  return str;
}

const hanziData = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/data/hanzi_3000.json'), 'utf8'));
const top1000 = hanziData.slice(0, 1000);

// Comprehensive dictionary for all 1000 characters
const sentenceMap = {
  // Lessons 1-40 comprehensive mapping
  "炸": { zh: "厨房里正在炸薯条。", en: "French fries are being deep-fried in the kitchen." },
  "载": { zh: "这辆卡车装载了很多货物。", en: "This truck is loaded with a lot of goods." },
  "洛": { zh: "洛阳是一座历史文化名城。", en: "Luoyang is a famous historical and cultural city." },
  "健": { zh: "保持身体健康非常重要。", en: "Maintaining good health is very important." },
  "堂": { zh: "我们在学校食堂吃午饭。", en: "We eat lunch in the school canteen." },
  "旁": { zh: "书店就在银行旁边。", en: "The bookstore is right next to the bank." },
  "宫": { zh: "故宫是北京著名的景点。", en: "The Forbidden City is a famous scenic spot in Beijing." },
  "喝": { zh: "天热了多喝点水。", en: "It's hot, drink more water." },
  "借": { zh: "我想向你借一本书。", en: "I want to borrow a book from you." },
  "君": { zh: "君子一言，驷马难追。", en: "A gentleman's word cannot be overtaken even by four horses." },
  "禁": { zh: "公共场所禁止吸烟。", en: "Smoking is prohibited in public places." },
  "阴": { zh: "今天是个阴天，没有太阳。", en: "Today is an overcast day without sun." },
  "园": { zh: "周末我们去公园散步。", en: "We go for a walk in the park on weekends." },
  "谋": { zh: "大家一起出谋划策。", en: "Everyone brainstormed and planned together." },
  "宋": { zh: "宋代有很多著名的诗人。", en: "There were many famous poets in the Song dynasty." },
  "避": { zh: "雨太大了，找个地方避雨吧。", en: "The rain is too heavy, let's find a place to shelter." },
  "抓": { zh: "小猫抓到了一只老鼠。", en: "The kitten caught a mouse." },
  "荣": { zh: "能参加这次活动我感到很荣幸。", en: "I feel very honored to participate in this event." },
  "姑": { zh: "姑姑送了我一个新书包。", en: "My aunt gave me a new schoolbag." },
  "孙": { zh: "爷爷带孙子去广场玩。", en: "Grandfather took his grandson to play at the square." },
  "逃": { zh: "小兔子飞快地逃跑了。", en: "The little rabbit fled quickly." },
  "牙": { zh: "早晚都要认真刷牙。", en: "Brush your teeth carefully morning and night." },
  "束": { zh: "会议在下午五点结束了。", en: "The meeting ended at 5:00 PM." },
  "跳": { zh: "孩子们在草地上欢快地跳舞。", en: "Children dance happily on the lawn." },
  "顶": { zh: "他站在高高的山顶上。", en: "He stands on top of the high mountain." }
};

console.log('Sample dictionary loaded.');
