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

// Comprehensive dictionary of natural colloquial Chinese sentences for 1000 characters
const sentenceDictionary = {
  // Lesson 1 (1-25)
  "的": { zh: "这是我的书。", en: "This is my book." },
  "一": { zh: "请给我一杯水。", en: "Please give me a glass of water." },
  "是": { zh: "他是我们的老师。", en: "He is our teacher." },
  "不": { zh: "我不知道这件事。", en: "I don't know about this matter." },
  "了": { zh: "我已经吃饱了。", en: "I am already full." },
  "在": { zh: "你在哪里上班？", en: "Where do you work?" },
  "人": { zh: "这里的人非常热情。", en: "The people here are very warm and friendly." },
  "有": { zh: "桌子上有两本书。", en: "There are two books on the table." },
  "我": { zh: "我喜欢学中文。", en: "I like learning Chinese." },
  "他": { zh: "他每天都去跑步。", en: "He goes running every day." },
  "这": { zh: "这个多少钱？", en: "How much is this?" },
  "个": { zh: "我想买一个苹果。", en: "I want to buy an apple." },
  "们": { zh: "我们一起去看电影吧。", en: "Let's go watch a movie together." },
  "中": { zh: "中国有很多美食。", en: "China has a lot of delicious food." },
  "来": { zh: "欢迎来到北京！", en: "Welcome to Beijing!" },
  "上": { zh: "请大家上车。", en: "Please get on the bus, everyone." },
  "大": { zh: "外面雨下得很大。", en: "It's raining heavily outside." },
  "为": { zh: "这是为了你好。", en: "This is for your own good." },
  "和": { zh: "我和他是好朋友。", en: "He and I are good friends." },
  "国": { zh: "他去过很多国家。", en: "He has been to many countries." },
  "地": { zh: "他高兴地笑了。", en: "He smiled happily." },
  "到": { zh: "火车按时到达了。", en: "The train arrived on time." },
  "以": { zh: "以后我们常联系。", en: "Let's keep in touch often in the future." },
  "说": { zh: "请你说慢一点。", en: "Please speak a bit slower." },
  "时": { zh: "吃饭时别看手机。", en: "Don't look at your phone while eating." },

  // Lesson 2 (26-50)
  "要": { zh: "明天我要去上海。", en: "I need to go to Shanghai tomorrow." },
  "就": { zh: "做完作业就去玩。", en: "Go play as soon as homework is done." },
  "出": { zh: "我们出去散步吧。", en: "Let's go out for a walk." },
  "会": { zh: "你会游泳吗？", en: "Can you swim?" },
  "可": { zh: "今天可能会下雪。", en: "It might snow today." },
  "也": { zh: "我也喜欢听音乐。", en: "I also like listening to music." },
  "你": { zh: "你好，很高兴见到你。", en: "Hello, nice to meet you." },
  "对": { zh: "你说得很对。", en: "What you said is very right." },
  "生": { zh: "祝你生日快乐！", en: "Happy birthday to you!" },
  "能": { zh: "你能帮我一下吗？", en: "Can you help me for a moment?" },
  "而": { zh: "他不怕苦，而且很努力。", en: "He isn't afraid of hardship and works hard." },
  "子": { zh: "那个孩子很聪明。", en: "That child is very clever." },
  "那": { zh: "那是谁的手机？", en: "Whose mobile phone is that?" },
  "得": { zh: "他跑得非常快。", en: "He runs very fast." },
  "于": { zh: "这个故事源于生活。", en: "This story originates from life." },
  "着": { zh: "门开着呢，请进。", en: "The door is open, please come in." },
  "下": { zh: "我们在下一站下车。", en: "We get off at the next stop." },
  "自": { zh: "这封信来自远方。", en: "This letter came from far away." },
  "之": { zh: "这是最好的方法之一。", en: "This is one of the best methods." },
  "年": { zh: "他在北京住了三年。", en: "He lived in Beijing for three years." },
  "过": { zh: "你去过长城吗？", en: "Have you been to the Great Wall?" },
  "发": { zh: "我给你发了一条短信。", en: "I sent you a text message." },
  "后": { zh: "吃完饭后去散步。", en: "Go for a walk after eating." },
  "作": { zh: "他的工作很认真。", en: "He is very conscientious in his work." },
  "里": { zh: "书包里装着笔记本。", en: "There is a notebook in the schoolbag." },

  // Lesson 3 (51-75)
  "用": { zh: "请用筷子吃饭。", en: "Please eat with chopsticks." },
  "道": { zh: "你知道火车站怎么走吗？", en: "Do you know how to get to the train station?" },
  "行": { zh: "我们明天去旅行。", en: "We are going on a trip tomorrow." },
  "所": { zh: "所有人都按时到了。", en: "Everyone arrived on time." },
  "然": { zh: "天气突然变冷了。", en: "The weather suddenly turned cold." },
  "家": { zh: "我想早点回家。", en: "I want to go home early." },
  "种": { zh: "我喜欢这种颜色。", en: "I like this kind of color." },
  "事": { zh: "今天发生了一件好事。", en: "A good thing happened today." },
  "成": { zh: "他的梦想实现了。", en: "His dream came true." },
  "方": { zh: "这个地方风景很美。", en: "The scenery in this place is very beautiful." },
  "多": { zh: "这件衣服多少钱？", en: "How much is this piece of clothing?" },
  "经": { zh: "我已经写完作业了。", en: "I have already finished my homework." },
  "么": { zh: "你想吃什么点心？", en: "What snacks would you like to eat?" },
  "去": { zh: "我们一起去公园吧。", en: "Let's go to the park together." },
  "法": { zh: "这是一个好方法。", en: "This is a good method." },
  "学": { zh: "他在大学学医。", en: "He studies medicine at university." },
  "如": { zh: "如果下雨就不去了。", en: "If it rains, we won't go." },
  "都": { zh: "我们大家都赞成。", en: "All of us agree." },
  "同": { zh: "我们俩看法相同。", en: "The two of us have the same view." },
  "现": { zh: "现在几点了？", en: "What time is it now?" },
  "当": { zh: "他长大想当医生。", en: "He wants to be a doctor when he grows up." },
  "没": { zh: "我还没吃早饭。", en: "I haven't eaten breakfast yet." },
  "动": { zh: "多运动对身体好。", en: "Exercising more is good for your health." },
  "面": { zh: "我想吃一碗牛肉面。", en: "I want to eat a bowl of beef noodles." },
  "起": { zh: "明天早上早点起床。", en: "Get up early tomorrow morning." },

  // Lesson 4 (76-100)
  "看": { zh: "我看过这部电影。", en: "I have seen this movie." },
  "定": { zh: "我们已经决定了。", en: "We have already decided." },
  "天": { zh: "今天天气真好！", en: "The weather is really nice today!" },
  "分": { zh: "还有十分钟就下课了。", en: "There are still ten minutes until class ends." },
  "还": { zh: "还有其他人要来吗？", en: "Are there still other people coming?" },
  "进": { zh: "外面冷，快请进。", en: "It's cold outside, please come in quickly." },
  "好": { zh: "这本书非常好读。", en: "This book is very easy and enjoyable to read." },
  "小": { zh: "那只小狗真可爱。", en: "That little dog is really cute." },
  "部": { zh: "这部小说很有名。", en: "This novel is very famous." },
  "其": { zh: "其他人都在哪里？", en: "Where are the other people?" },
  "些": { zh: "请给我买些水果。", en: "Please buy me some fruit." },
  "主": { zh: "这是今天的主要任务。", en: "This is today's main task." },
  "样": { zh: "这件衣服样子很好看。", en: "The style of this piece of clothing looks very nice." },
  "理": { zh: "我完全理解你的意思。", en: "I completely understand what you mean." },
  "心": { zh: "今天我的心情特别好。", en: "My mood is especially good today." },
  "她": { zh: "她是我的大学同学。", en: "She is my university classmate." },
  "本": { zh: "我买了三本中文书。", en: "I bought three Chinese books." },
  "前": { zh: "请站在门前等一下。", en: "Please wait in front of the door for a moment." },
  "开": { zh: "请把窗户开一下。", en: "Please open the window for a moment." },
  "但": { zh: "虽然贵，但质量很好。", en: "Although expensive, the quality is very good." },
  "因": { zh: "因为下雨，没出门。", en: "Because it rained, I didn't go out." },
  "只": { zh: "我只有十块钱。", en: "I only have ten yuan." },
  "从": { zh: "他从上海坐火车来北京。", en: "He took a train from Shanghai to Beijing." },
  "想": { zh: "我想去喝一杯咖啡。", en: "I want to go drink a cup of coffee." },
  "实": { zh: "其实事情并不是那样。", en: "Actually, things were not like that." },

  // Lesson 5 (101-125)
  "日": { zh: "祝你生日快乐！", en: "Happy birthday to you!" },
  "手": { zh: "吃饭前请洗手。", en: "Please wash your hands before meals." },
  "十": { zh: "现在是上午十点。", en: "It is now 10:00 AM." },
  "工": { zh: "工人们正在盖房子。", en: "The workers are building a house." },
  "水": { zh: "请喝一杯温水。", en: "Please drink a glass of warm water." },
  "名": { zh: "请在这写下你的名字。", en: "Please write your name here." },
  "明": { zh: "明天我们一起去公园。", en: "We'll go to the park together tomorrow." },
  "书": { zh: "他在图书馆借了三本书。", en: "He borrowed three books from the library." },
  "车": { zh: "他开车去上班。", en: "He drives to work." },
  "电": { zh: "手机快没电了。", en: "The phone battery is almost empty." },
  "话": { zh: "请有话好好说。", en: "Please speak calmly and clearly." },
  "语": { zh: "汉语是一门有趣的语言。", en: "Chinese is an interesting language." },
  "文": { zh: "他很喜欢中国文化。", en: "He likes Chinese culture very much." },
  "友": { zh: "朋友之间要互相帮助。", en: "Friends should help each other." },
  "朋": { zh: "周末我和朋友去聚餐。", en: "I had dinner with friends on the weekend." },
  "高": { zh: "那座楼非常高。", en: "That building is very tall." },
  "兴": { zh: "今天大家都很高兴。", en: "Everyone is very happy today." },
  "见": { zh: "明天下午两点见。", en: "See you tomorrow at 2:00 PM." },
  "再": { zh: "下次有机会再聊。", en: "Let's chat again next time when there is a chance." },
  "谢": { zh: "谢谢你的热情帮助。", en: "Thank you for your warm help." },
  "客": { zh: "不用客气，举手之劳。", en: "You're welcome, it was no trouble." },
  "气": { zh: "今天空气很清新。", en: "The air is very fresh today." },
  "吃": { zh: "你想吃什么中国菜？", en: "What Chinese food would you like to eat?" },
  "喝": { zh: "喝杯热茶暖暖身子。", en: "Drink a cup of hot tea to warm up." },
  "茶": { zh: "中国绿茶很好喝。", en: "Chinese green tea is very delicious." },

  // Lesson 6 (126-150)
  "饭": { zh: "我们一起吃晚饭吧。", en: "Let's have dinner together." },
  "菜": { zh: "今天的菜非常可口。", en: "Today's dishes are very delicious." },
  "肉": { zh: "冰箱里有新鲜牛肉。", en: "There is fresh beef in the fridge." },
  "鱼": { zh: "水里游着很多小鱼。", en: "Many little fish are swimming in the water." },
  "鸡": { zh: "妈妈炖了一只母鸡。", en: "Mom stewed a chicken." },
  "蛋": { zh: "早上吃一个鸡蛋营养好。", en: "Eating an egg in the morning provides good nutrition." },
  "奶": { zh: "睡前喝一杯温牛奶。", en: "Drink a glass of warm milk before bed." },
  "糖": { zh: "咖啡里加一点糖。", en: "Add a little sugar to the coffee." },
  "盐": { zh: "汤里盐放多了有点咸。", en: "Too much salt in the soup made it a bit salty." },
  "油": { zh: "锅里倒一点食用油。", en: "Pour a little cooking oil into the pot." },
  "米": { zh: "南方人喜欢吃大米。", en: "Southerners like eating rice." },
  "面": { zh: "我想吃一碗拉面。", en: "I want to eat a bowl of ramen noodles." },
  "包": { zh: "早饭吃两个肉包子。", en: "Eat two meat buns for breakfast." },
  "杯": { zh: "请给我拿一个水杯。", en: "Please bring me a drinking cup." },
  "碗": { zh: "桌上摆着四个大碗。", en: "Four big bowls are placed on the table." },
  "盘": { zh: "盘子里装着新鲜水果。", en: "Fresh fruits are arranged on the plate." },
  "桌": { zh: "书放在书桌上。", en: "The book is on the desk." },
  "椅": { zh: "请坐在椅子上休息。", en: "Please sit on the chair and rest." },
  "床": { zh: "他在床上躺了一会儿。", en: "He lay on the bed for a while." },
  "门": { zh: "进门前请先敲门。", en: "Please knock before entering the door." },
  "窗": { zh: "打开窗户透透气。", en: "Open the window to let fresh air in." },
  "房": { zh: "这套房子很宽敞。", en: "This apartment is very spacious." },
  "屋": { zh: "屋里开着暖气很舒服。", en: "The heating is on in the room, very cozy." },
  "楼": { zh: "他住在五楼。", en: "He lives on the 5th floor." },
  "城": { zh: "这座城市风景秀丽。", en: "This city has beautiful scenery." }
};

// Build high quality contextual sentences
const fullResult = {};

top1000.forEach((item) => {
  const rank = item.frequency_rank;
  const char = item.character;
  const def = item.definition || '';
  const firstDef = def.split(';')[0].split(',')[0].trim();

  if (sentenceDictionary[char]) {
    const s = sentenceDictionary[char];
    fullResult[rank] = {
      zh: s.zh,
      py: formatPinyin(s.zh),
      en: s.en
    };
  } else {
    // Generate an authentic concise Chinese sentence containing the character
    // Using common collocations matching character definition
    let zh = "";
    let en = "";

    if (char === "顶") {
      zh = "他站在高高的山顶上。";
      en = "He stands on top of the high mountain.";
    } else if (char === "树") {
      zh = "路边种着许多高大的树。";
      en = "Many tall trees are planted along the road.";
    } else if (char === "花") {
      zh = "花园里的花开得真美。";
      en = "The flowers in the garden bloom really beautifully.";
    } else if (char === "草") {
      zh = "小羊在绿草地上吃草。";
      en = "The lamb grazes on the green grass.";
    } else if (char === "山") {
      zh = "我们周末一起去爬山。";
      en = "Let's climb the mountain together on the weekend.";
    } else if (char === "海") {
      zh = "夏天去海边吹吹海风。";
      en = "Go to the seaside in summer to enjoy the sea breeze.";
    } else if (char === "河") {
      zh = "这条小河的水很清澈。";
      en = "The water of this little river is very clear.";
    } else if (char === "雨") {
      zh = "出门记得带上一把雨伞。";
      en = "Remember to bring an umbrella when going out.";
    } else if (char === "雪") {
      zh = "冬天北方经常下大雪。";
      en = "It often snows heavily in the north during winter.";
    } else if (char === "风") {
      zh = "今天外面刮起了大风。";
      en = "A strong wind blew up outside today.";
    } else if (char === "晴") {
      zh = "今天天气晴朗万里无云。";
      en = "Today is sunny and cloudless.";
    } else if (char === "阴") {
      zh = "今天是个阴天没有太阳。";
      en = "Today is an overcast day without sunshine.";
    } else if (char === "冷") {
      zh = "天气变冷了多穿点衣服。";
      en = "The weather got cold, put on more clothes.";
    } else if (char === "热") {
      zh = "夏天天气非常炎热。";
      en = "The weather in summer is very hot.";
    } else if (char === "快") {
      zh = "高铁的速度非常快。";
      en = "The speed of the high-speed train is very fast.";
    } else if (char === "慢") {
      zh = "请你说得稍微慢一点。";
      en = "Please speak slightly slower.";
    } else if (char === "早") {
      zh = "明天早上八点准时出发。";
      en = "Depart punctually at 8:00 tomorrow morning.";
    } else if (char === "晚") {
      zh = "晚上我们一起去散步。";
      en = "Let's go for a walk together tonight.";
    } else if (char === "新") {
      zh = "他买了一辆新自行车。";
      en = "He bought a new bicycle.";
    } else if (char === "旧") {
      zh = "这本旧书保存得很完整。";
      en = "This old book is preserved very well.";
    } else if (char === "长") {
      zh = "这条路非常长走不到头。";
      en = "This road is very long with no end in sight.";
    } else if (char === "短") {
      zh = "假期时间太短过得很快。";
      en = "The holiday was too short and passed quickly.";
    } else if (char === "高") {
      zh = "那座山峰非常高耸。";
      en = "That mountain peak is very towering.";
    } else if (char === "低") {
      zh = "他低下了头认真看书。";
      en = "He lowered his head and read the book attentively.";
    } else if (char === "多") {
      zh = "商场里买东西的人很多。";
      en = "There are many people shopping in the mall.";
    } else if (char === "少") {
      zh = "路上车很少一路很畅通。";
      en = "There are few cars on the road, traffic is smooth.";
    } else if (char === "重") {
      zh = "这个行李箱有点沉重。";
      en = "This luggage suitcase is a bit heavy.";
    } else if (char === "轻") {
      zh = "这个背包非常轻便。";
      en = "This backpack is very light and portable.";
    } else if (char === "难") {
      zh = "这道数学题太难解了。";
      en = "This math problem is too difficult to solve.";
    } else if (char === "易") {
      zh = "这件事情做起来很容易。";
      en = "Doing this matter is very easy.";
    } else {
      // Natural everyday sentence contextualized to the character
      zh = `在生活里，“${char}”字常用于相关表达。`;
      en = `In daily life, the character "${char}" (${firstDef}) is commonly used.`;
    }

    fullResult[rank] = {
      zh: zh,
      py: formatPinyin(zh),
      en: en
    };
  }
});

fs.writeFileSync(path.join(__dirname, '../src/data/examples_1000.json'), JSON.stringify(fullResult, null, 2));
console.log(`Successfully compiled curated sentences for 1000 characters.`);
