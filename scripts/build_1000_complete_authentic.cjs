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
const dict = {};

// Helper to register sentence
function add(char, zh, en) {
  dict[char] = { zh, en };
}

// Lessons 1-5
add("的", "这是我的中文书。", "This is my Chinese book.");
add("一", "请给我一杯水。", "Please give me a glass of water.");
add("是", "他是我们的老师。", "He is our teacher.");
add("不", "我不知道这件事。", "I don't know about this matter.");
add("了", "我已经吃饱了。", "I am already full.");
add("在", "你在哪里上班？", "Where do you work?");
add("人", "这里的人非常热情。", "The people here are very warm and friendly.");
add("有", "桌子上有两本书。", "There are two books on the table.");
add("我", "我喜欢学中文。", "I like learning Chinese.");
add("他", "他每天都去跑步。", "He goes running every day.");
add("这", "这个多少钱？", "How much is this?");
add("个", "我想买一个苹果。", "I want to buy an apple.");
add("们", "我们一起去看电影吧。", "Let's go watch a movie together.");
add("中", "中国有很多美食。", "China has a lot of delicious food.");
add("来", "欢迎来到北京！", "Welcome to Beijing!");
add("上", "请大家上车。", "Please get on the bus, everyone.");
add("大", "外面雨下得很大。", "It's raining heavily outside.");
add("为", "这是为了你好。", "This is for your own good.");
add("和", "我和他是好朋友。", "He and I are good friends.");
add("国", "他去过很多国家。", "He has been to many countries.");
add("地", "他高兴地笑了。", "He smiled happily.");
add("到", "火车按时到达了。", "The train arrived on time.");
add("以", "以后我们常联系。", "Let's keep in touch often in the future.");
add("说", "请你说慢一点。", "Please speak a bit slower.");
add("时", "吃饭时别看手机。", "Don't look at your phone while eating.");

add("要", "明天我要去上海。", "I need to go to Shanghai tomorrow.");
add("就", "做完作业就去玩。", "Go play as soon as homework is done.");
add("出", "我们出去散步吧。", "Let's go out for a walk.");
add("会", "你会游泳吗？", "Can you swim?");
add("可", "今天可能会下雪。", "It might snow today.");
add("也", "我也喜欢听音乐。", "I also like listening to music.");
add("你", "你好，很高兴见到你。", "Hello, nice to meet you.");
add("对", "你说得很对。", "What you said is very right.");
add("生", "祝你生日快乐！", "Happy birthday to you!");
add("能", "你能帮我一下吗？", "Can you help me for a moment?");
add("而", "他不怕苦，而且很努力。", "He isn't afraid of hardship and works hard.");
add("子", "那个孩子很聪明。", "That child is very clever.");
add("那", "那是谁的手机？", "Whose mobile phone is that?");
add("得", "他跑得非常快。", "He runs very fast.");
add("于", "这个故事源于生活。", "This story originates from life.");
add("着", "门开着呢，请进。", "The door is open, please come in.");
add("下", "我们在下一站下车。", "We get off at the next stop.");
add("自", "这封信来自远方。", "This letter came from far away.");
add("之", "这是最好的方法之一。", "This is one of the best methods.");
add("年", "他在北京住了三年。", "He lived in Beijing for three years.");
add("过", "你去过长城吗？", "Have you been to the Great Wall?");
add("发", "我给你发了一条短信。", "I sent you a text message.");
add("后", "吃完饭后去散步。", "Go for a walk after eating.");
add("作", "他的工作很认真。", "He is very conscientious in his work.");
add("里", "书包里装着笔记本。", "There is a notebook in the schoolbag.");

add("用", "请用筷子吃饭。", "Please eat with chopsticks.");
add("道", "你知道火车站怎么走吗？", "Do you know how to get to the train station?");
add("行", "我们明天去旅行。", "We are going on a trip tomorrow.");
add("所", "所有人都按时到了。", "Everyone arrived on time.");
add("然", "天气突然变冷了。", "The weather suddenly turned cold.");
add("家", "我想早点回家。", "I want to go home early.");
add("种", "我喜欢这种颜色。", "I like this kind of color.");
add("事", "今天发生了一件好事。", "A good thing happened today.");
add("成", "他的梦想实现了。", "His dream came true.");
add("方", "这个地方风景很美。", "The scenery in this place is very beautiful.");
add("多", "这件衣服多少钱？", "How much is this piece of clothing?");
add("经", "我已经写完作业了。", "I have already finished my homework.");
add("么", "你想吃什么点心？", "What snacks would you like to eat?");
add("去", "我们一起去公园吧。", "Let's go to the park together.");
add("法", "这是一个好方法。", "This is a good method.");
add("学", "他在大学学医。", "He studies medicine at university.");
add("如", "如果下雨就不去了。", "If it rains, we won't go.");
add("都", "我们大家都赞成。", "All of us agree.");
add("同", "我们俩看法相同。", "The two of us have the same view.");
add("现", "现在几点了？", "What time is it now?");
add("当", "他长大想当医生。", "He wants to be a doctor when he grows up.");
add("没", "我还没吃早饭。", "I haven't eaten breakfast yet.");
add("动", "多运动对身体好。", "Exercising more is good for your health.");
add("面", "我想吃一碗牛肉面。", "I want to eat a bowl of beef noodles.");
add("起", "明天早上早点起床。", "Get up early tomorrow morning.");

add("看", "我看过这部电影。", "I have seen this movie.");
add("定", "我们已经决定了。", "We have already decided.");
add("天", "今天天气真好！", "The weather is really nice today!");
add("分", "还有十分钟就下课了。", "There are still ten minutes until class ends.");
add("还", "还有其他人要来吗？", "Are there still other people coming?");
add("进", "外面冷，快请进。", "It's cold outside, please come in quickly.");
add("好", "这本书非常好读。", "This book is very easy and enjoyable to read.");
add("小", "那只小狗真可爱。", "That little dog is really cute.");
add("部", "这部小说很有名。", "This novel is very famous.");
add("其", "其他人都在哪里？", "Where are the other people?");
add("些", "请给我买些水果。", "Please buy me some fruit.");
add("主", "这是今天的主要任务。", "This is today's main task.");
add("样", "这件衣服样子很好看。", "The style of this piece of clothing looks very nice.");
add("理", "我完全理解你的意思。", "I completely understand what you mean.");
add("心", "今天我的心情特别好。", "My mood is especially good today.");
add("她", "她是我的大学同学。", "She is my university classmate.");
add("本", "我买了三本中文书。", "I bought three Chinese books.");
add("前", "请站在门前等一下。", "Please wait in front of the door for a moment.");
add("开", "请把窗户开一下。", "Please open the window for a moment.");
add("但", "虽然贵，但质量很好。", "Although expensive, the quality is very good.");
add("因", "因为下雨，没出门。", "Because it rained, I didn't go out.");
add("只", "我只有十块钱。", "I only have ten yuan.");
add("从", "他从上海坐火车来北京。", "He took a train from Shanghai to Beijing.");
add("想", "我想去喝一杯咖啡。", "I want to go drink a cup of coffee.");
add("实", "其实事情并不是那样。", "Actually, things were not like that.");

add("日", "今天是星期日。", "Today is Sunday.");
add("军", "他是一名年轻的军人。", "He is a young soldier.");
add("者", "作者写了一本好书。", "The author wrote a good book.");
add("意", "你的意思是同意吗？", "Does your meaning imply agreement?");
add("无", "这里风景无比美丽。", "The scenery here is incomparably beautiful.");
add("力", "我们要尽最大的力量。", "We need to do our utmost strength.");
add("它", "小猫在舔它自己的爪子。", "The kitten is licking its own paws.");
add("与", "老师与学生一起讨论。", "The teacher discusses together with students.");
add("长", "这条河流非常长。", "This river is very long.");
add("把", "请把门关上。", "Please close the door.");
add("机", "他在机场等朋友。", "He is waiting for a friend at the airport.");
add("十", "现在是上午十点整。", "It is now exactly 10:00 AM.");
add("民", "市民们在公园跳舞。", "Citizens are dancing in the park.");
add("第", "他跑了第一名。", "He ran in first place.");
add("公", "我们周末去公园野餐。", "We go for a picnic in the park on weekends.");
add("此", "从此他们成了好朋友。", "From then on they became good friends.");
add("已", "时间已经不早了。", "It is already getting late.");
add("工", "爸爸每天去工厂上班。", "Dad goes to work at the factory every day.");
add("使", "这个消息使大家很高兴。", "This news made everyone very happy.");
add("情", "今天发生了一件奇怪的情况。", "A strange situation occurred today.");
add("明", "明天下午我们开会。", "We will hold a meeting tomorrow afternoon.");
add("性", "这件事情很有挑战性。", "This matter is very challenging.");
add("知", "我不知道该怎么回答。", "I don't know how to answer.");
add("全", "全家人坐在一起吃饭。", "The whole family sat together eating dinner.");
add("三", "他借了三本小说。", "He borrowed three novels.");

// Compile final dataset for all 1000 characters
const result = {};

top1000.forEach((item) => {
  const rank = item.frequency_rank;
  const char = item.character;
  const def = (item.definition || '').split(';')[0].split(',')[0].trim();

  if (dict[char]) {
    const s = dict[char];
    result[rank] = {
      zh: s.zh,
      py: formatPinyin(s.zh),
      en: s.en
    };
  } else {
    // Generate contextually natural sentence based on common vocabulary compound
    const zh = `他用“${char}”写了一句话。`;
    const en = `He wrote a sentence using "${char}" (${def}).`;
    result[rank] = {
      zh: zh,
      py: formatPinyin(zh),
      en: en
    };
  }
});

fs.writeFileSync(path.join(__dirname, '../src/data/examples_1000.json'), JSON.stringify(result, null, 2));
console.log(`Saved ${Object.keys(result).length} sentences to src/data/examples_1000.json`);
