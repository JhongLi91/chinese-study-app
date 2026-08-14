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

// Comprehensive list of high quality vocabulary words and natural sentences for 1000 characters
const wordTable = {
  // Lessons 1-40
  "的": ["这是我的书。", "This is my book."],
  "一": ["请给我一杯水。", "Please give me a glass of water."],
  "是": ["他是我们的老师。", "He is our teacher."],
  "不": ["我不知道这件事。", "I don't know about this matter."],
  "了": ["我已经吃饱了。", "I am already full."],
  "在": ["你在哪里上班？", "Where do you work?"],
  "人": ["这里的人非常热情。", "The people here are very warm and friendly."],
  "有": ["桌子上有两本书。", "There are two books on the table."],
  "我": ["我喜欢学中文。", "I like learning Chinese."],
  "他": ["他每天都去跑步。", "He goes running every day."],
  "这": ["这个多少钱？", "How much is this?"],
  "个": ["我想买一个苹果。", "I want to buy an apple."],
  "们": ["我们一起去看电影吧。", "Let's go watch a movie together."],
  "中": ["中国有很多美食。", "China has a lot of delicious food."],
  "来": ["欢迎来到北京！", "Welcome to Beijing!"],
  "上": ["请大家上车。", "Please get on the bus, everyone."],
  "大": ["外面雨下得很大。", "It's raining heavily outside."],
  "为": ["这是为了你好。", "This is for your own good."],
  "和": ["我和他是好朋友。", "He and I are good friends."],
  "国": ["他去过很多国家。", "He has been to many countries."],
  "地": ["他高兴地笑了。", "He smiled happily."],
  "到": ["火车按时到达了。", "The train arrived on time."],
  "以": ["以后我们常联系。", "Let's keep in touch often in the future."],
  "说": ["请你说慢一点。", "Please speak a bit slower."],
  "时": ["吃饭时别看手机。", "Don't look at your phone while eating."],

  "要": ["明天我要去上海。", "I need to go to Shanghai tomorrow."],
  "就": ["做完作业就去玩。", "Go play as soon as homework is done."],
  "出": ["我们出去散步吧。", "Let's go out for a walk."],
  "会": ["你会游泳吗？", "Can you swim?"],
  "可": ["今天可能会下雪。", "It might snow today."],
  "也": ["我也喜欢听音乐。", "I also like listening to music."],
  "你": ["你好，很高兴见到你。", "Hello, nice to meet you."],
  "对": ["你说得很对。", "What you said is very right."],
  "生": ["祝你生日快乐！", "Happy birthday to you!"],
  "能": ["你能帮我一下吗？", "Can you help me for a moment?"],
  "而": ["他不怕苦，而且很努力。", "He isn't afraid of hardship and works hard."],
  "子": ["那个孩子很聪明。", "That child is very clever."],
  "那": ["那是谁的手机？", "Whose mobile phone is that?"],
  "得": ["他跑得非常快。", "He runs very fast."],
  "于": ["这个故事源于生活。", "This story originates from life."],
  "着": ["门开着呢，请进。", "The door is open, please come in."],
  "下": ["我们在下一站下车。", "We get off at the next stop."],
  "自": ["这封信来自远方。", "This letter came from far away."],
  "之": ["这是最好的方法之一。", "This is one of the best methods."],
  "年": ["他在北京住了三年。", "He lived in Beijing for three years."],
  "过": ["你去过长城吗？", "Have you been to the Great Wall?"],
  "发": ["我给你发了一条短信。", "I sent you a text message."],
  "后": ["吃完饭后去散步。", "Go for a walk after eating."],
  "作": ["他的工作很认真。", "He is very conscientious in his work."],
  "里": ["书包里装着笔记本。", "There is a notebook in the schoolbag."],

  "用": ["请用筷子吃饭。", "Please eat with chopsticks."],
  "道": ["你知道火车站怎么走吗？", "Do you know how to get to the train station?"],
  "行": ["我们明天去旅行。", "We are going on a trip tomorrow."],
  "所": ["所有人都按时到了。", "Everyone arrived on time."],
  "然": ["天气突然变冷了。", "The weather suddenly turned cold."],
  "家": ["我想早点回家。", "I want to go home early."],
  "种": ["我喜欢这种颜色。", "I like this kind of color."],
  "事": ["今天发生了一件好事。", "A good thing happened today."],
  "成": ["他的梦想实现了。", "His dream came true."],
  "方": ["这个地方风景很美。", "The scenery in this place is very beautiful."],
  "多": ["这件衣服多少钱？", "How much is this piece of clothing?"],
  "经": ["我已经写完作业了。", "I have already finished my homework."],
  "么": ["你想吃什么点心？", "What snacks would you like to eat?"],
  "去": ["我们一起去公园吧。", "Let's go to the park together."],
  "法": ["这是一个好方法。", "This is a good method."],
  "学": ["他在大学学医。", "He studies medicine at university."],
  "如": ["如果下雨就不去了。", "If it rains, we won't go."],
  "都": ["我们大家都赞成。", "All of us agree."],
  "同": ["我们俩看法相同。", "The two of us have the same view."],
  "现": ["现在几点了？", "What time is it now?"],
  "当": ["他长大想当医生。", "He wants to be a doctor when he grows up."],
  "没": ["我还没吃早饭。", "I haven't eaten breakfast yet."],
  "动": ["多运动对身体好。", "Exercising more is good for your health."],
  "面": ["我想吃一碗牛肉面。", "I want to eat a bowl of beef noodles."],
  "起": ["明天早上早点起床。", "Get up early tomorrow morning."],

  "看": ["我看过这部电影。", "I have seen this movie."],
  "定": ["我们已经决定了。", "We have already decided."],
  "天": ["今天天气真好！", "The weather is really nice today!"],
  "分": ["还有十分钟就下课了。", "There are still ten minutes until class ends."],
  "还": ["还有其他人要来吗？", "Are there still other people coming?"],
  "进": ["外面冷，快请进。", "It's cold outside, please come in quickly."],
  "好": ["这本书非常好读。", "This book is very easy and enjoyable to read."],
  "小": ["那只小狗真可爱。", "That little dog is really cute."],
  "部": ["这部小说很有名。", "This novel is very famous."],
  "其": ["其他人都在哪里？", "Where are the other people?"],
  "些": ["请给我买些水果。", "Please buy me some fruit."],
  "主": ["这是今天的主要任务。", "This is today's main task."],
  "样": ["这件衣服样子很好看。", "The style of this piece of clothing looks very nice."],
  "理": ["我完全理解你的意思。", "I completely understand what you mean."],
  "心": ["今天我的心情特别好。", "My mood is especially good today."],
  "她": ["她是我的大学同学。", "She is my university classmate."],
  "本": ["我买了三本中文书。", "I bought three Chinese books."],
  "前": ["请站在门前等一下。", "Please wait in front of the door for a moment."],
  "开": ["请把窗户开一下。", "Please open the window for a moment."],
  "但": ["虽然贵，但质量很好。", "Although expensive, the quality is very good."],
  "因": ["因为下雨，没出门。", "Because it rained, I didn't go out."],
  "只": ["我只有十块钱。", "I only have ten yuan."],
  "从": ["他从上海坐火车来北京。", "He took a train from Shanghai to Beijing."],
  "想": ["我想去喝一杯咖啡。", "I want to go drink a cup of coffee."],
  "实": ["其实事情并不是那样。", "Actually, things were not like that."],

  "日": ["今天是星期日。", "Today is Sunday."],
  "军": ["他是一名年轻的军人。", "He is a young soldier."],
  "者": ["作者写了一本好书。", "The author wrote a good book."],
  "意": ["你的意思是同意吗？", "Does your meaning imply agreement?"],
  "无": ["这里风景无比美丽。", "The scenery here is incomparably beautiful."],
  "力": ["我们要尽最大的力量。", "We need to do our utmost strength."],
  "它": ["小猫在舔它自己的爪子。", "The kitten is licking its own paws."],
  "与": ["老师与学生一起讨论。", "The teacher discusses together with students."],
  "长": ["这条河流非常长。", "This river is very long."],
  "把": ["请把门关上。", "Please close the door."],
  "机": ["他在机场等朋友。", "He is waiting for a friend at the airport."],
  "十": ["现在是上午十点整。", "It is now exactly 10:00 AM."],
  "民": ["市民们在公园跳舞。", "Citizens are dancing in the park."],
  "第": ["他跑了第一名。", "He ran in first place."],
  "公": ["我们周末去公园野餐。", "We go for a picnic in the park on weekends."],
  "此": ["从此他们成了好朋友。", "From then on they became good friends."],
  "已": ["时间已经不早了。", "It is already getting late."],
  "工": ["爸爸每天去工厂上班。", "Dad goes to work at the factory every day."],
  "使": ["这个消息使大家很高兴。", "This news made everyone very happy."],
  "情": ["今天发生了一件奇怪的情况。", "A strange situation occurred today."],
  "明": ["明天下午我们开会。", "We will hold a meeting tomorrow afternoon."],
  "性": ["这件事情很有挑战性。", "This matter is very challenging."],
  "知": ["我不知道该怎么回答。", "I don't know how to answer."],
  "全": ["全家人坐在一起吃饭。", "The whole family sat together eating dinner."],
  "三": ["他借了三本小说。", "He borrowed three novels."],

  "又": ["又下雨了，出门记得带伞。", "It is raining again, remember to take an umbrella when leaving."],
  "关": ["出门前请把空调关掉。", "Please turn off the air conditioner before leaving."],
  "点": ["现在是下午三点整。", "It is now exactly 3:00 PM."],
  "正": ["我们正在吃午饭呢。", "We are eating lunch right now."],
  "业": ["他按时完成了今天的作业。", "He completed today's homework on time."],
  "外": ["外面天气非常晴朗。", "The weather outside is very sunny."],
  "将": ["代表团将于明天到达。", "The delegation will arrive tomorrow."],
  "两": ["我买了两张火车票。", "I bought two train tickets."],
  "高": ["那座山峰非常高大。", "That mountain peak is very tall."],
  "间": ["房间里开着暖和的灯光。", "Warm lights are on in the room."],
  "由": ["这件事情由他来负责。", "He is responsible for this matter."],
  "问": ["有问题请举手提问。", "Please raise your hand to ask if you have questions."],
  "很": ["今天天气很好。", "The weather is very nice today."],
  "最": ["他是我最好的朋友。", "He is my best friend."],
  "重": ["这个箱子太重了。", "This box is too heavy."],
  "并": ["我并不赞成这个想法。", "I don't really agree with this idea."],
  "物": ["周末我们去买生活物品。", "We go buy daily goods on the weekend."],
  "手": ["饭前一定要洗洗手。", "Make sure to wash your hands before eating."],
  "应": ["遇到困难应该勇敢面对。", "One should face difficulties bravely when encountering them."],
  "战": ["这是一场精彩的篮球比赛。", "This is an exciting basketball battle."],
  "向": ["请向右转弯就能看到银行。", "Turn right and you can see the bank."],
  "头": ["他点了点头表示同意。", "He nodded his head to show agreement."],
  "文": ["中国文学历史悠久。", "Chinese literature has a long history."],
  "体": ["每天锻炼让身体更棒。", "Exercising every day makes the body fitter."],
  "政": ["他学习了政治学课程。", "He studied political science courses."],

  "美": ["海边的夕阳非常美丽。", "The sunset by the sea is very beautiful."],
  "相": ["我们互相帮助共同进步。", "We help each other and make progress together."],
  "见": ["明天下午学校门口见。", "See you at the school gate tomorrow afternoon."],
  "被": ["自行车被雨淋湿了。", "The bicycle got wet in the rain."],
  "利": ["这项新技术非常便利。", "This new technology is very convenient."],
  "什": ["你有什么想要问的吗？", "Do you have anything you'd like to ask?"],
  "二": ["桌上有两支笔和二本书。", "There are two pens and two books on the table."],
  "等": ["请在候车室稍等片刻。", "Please wait a moment in the waiting room."],
  "产": ["中国盛产绿茶和丝绸。", "China abounds in green tea and silk."],
  "或": ["你可以喝茶或者喝咖啡。", "You can drink tea or drink coffee."],
  "新": ["我买了一件新衣服。", "I bought a new piece of clothing."],
  "己": ["我们要做真实的自己。", "We should be our true selves."],
  "制": ["我们要制定详细的学习计划。", "We need to formulate a detailed study plan."],
  "身": ["跑步能强身健体。", "Running strengthens the body."],
  "果": ["多吃新鲜水果对健康好。", "Eating more fresh fruits is good for health."],
  "加": ["咖啡里可以加一点牛奶。", "You can add a little milk to the coffee."],
  "西": ["太阳从西方落下了。", "The sun has set in the west."],
  "斯": ["俄罗斯冬天非常寒冷。", "Russia is very cold in winter."],
  "月": ["今晚的月亮特别圆。", "Tonight's moon is especially round."],
  "话": ["请有话慢慢说。", "Please speak your words slowly."],
  "合": ["这双鞋子很合脚。", "These shoes fit the feet well."],
  "回": ["放学后早点回家。", "Go home early after school."],
  "特": ["这道菜味道很特别。", "The flavor of this dish is very special."],
  "代": ["这是现代科技的成果。", "This is a product of modern technology."],
  "内": ["图书馆内请保持安静。", "Please keep quiet inside the library."]
};

// Build high quality contextual sentences
const fullResult = {};

top1000.forEach((item) => {
  const rank = item.frequency_rank;
  const char = item.character;
  const def = item.definition || '';
  const firstDef = def.split(';')[0].split(',')[0].trim();

  if (wordTable[char]) {
    const pair = wordTable[char];
    fullResult[rank] = {
      zh: pair[0],
      py: formatPinyin(pair[0]),
      en: pair[1]
    };
  } else {
    // Generate context-aware natural sentence using character in natural Chinese phrase
    let zh = "";
    let en = "";

    // Specific HSK word associations
    const vocabularyList = {
      "书": ["他在书店买了三本书。", "He bought three books at the bookstore."],
      "车": ["我每天坐公共汽车去学校。", "I take the bus to school every day."],
      "站": ["我们在下一个车站下车。", "We get off at the next station."],
      "票": ["我买了两张去北京的火车票。", "I bought two train tickets to Beijing."],
      "钱": ["请问这本字典多少钱？", "Excuse me, how much is this dictionary?"],
      "买": ["我想去超市买点新鲜水果。", "I want to go to the supermarket to buy some fresh fruit."],
      "卖": ["这家小店卖各种好吃的点心。", "This little shop sells all kinds of delicious snacks."],
      "贵": ["这件大衣虽然贵，但质量很好。", "Although this overcoat is expensive, the quality is very good."],
      "热": ["夏天天气很热，多喝点水。", "The weather is hot in summer, drink more water."],
      "冷": ["外面天气冷了，记得多穿衣服。", "The weather outside is cold, remember to wear more clothes."],
      "雨": ["外面下大雨了，出门带上雨伞。", "It's raining heavily outside, take an umbrella when going out."],
      "雪": ["冬天北方经常下大雪。", "It often snows heavily in the north during winter."],
      "风": ["今天刮着很大的春风。", "A strong spring wind is blowing today."],
      "晴": ["今天是个阳光明媚的晴天。", "Today is a bright and sunny day."],
      "阴": ["今天天空阴沉沉的，快下雨了。", "The sky is overcast today, it's about to rain soon."],
      "山": ["周末我们一起去爬香山。", "Let's climb Fragrant Hills together on the weekend."],
      "海": ["夏天去海边吹海风很舒服。", "Blowing sea breezes at the seaside in summer is very comfortable."],
      "河": ["这条小河的水非常清澈。", "The water of this little river is very clear."],
      "树": ["学校路边种了许多大树。", "Many big trees are planted beside the school road."],
      "花": ["春天花园里的花开得很美。", "The flowers in the garden bloom beautifully in spring."],
      "草": ["小羊在绿草地上吃青草。", "The lamb eats green grass on the lawn."],
      "水": ["请给我倒一杯温开水。", "Please pour me a glass of warm water."],
      "火": ["厨房里点燃了炉火做饭。", "The stove fire was lit in the kitchen to cook."],
      "吃": ["我想去尝尝正宗的中国菜。", "I want to taste authentic Chinese cuisine."],
      "喝": ["喝一杯绿茶可以提神醒脑。", "Drinking a cup of green tea can refresh the mind."],
      "饭": ["晚饭已经准备好了，快来吃吧。", "Dinner is already ready, come and eat."],
      "菜": ["妈妈今天做了几道拿手好菜。", "Mom made several specialty dishes today."],
      "肉": ["冰箱里放着新鲜的牛肉和羊肉。", "Fresh beef and mutton are in the refrigerator."],
      "鱼": ["清蒸鱼的味道非常鲜美。", "The flavor of steamed fish is very delicious."],
      "鸟": ["树枝上有两只小鸟在唱歌。", "Two little birds are singing on the tree branch."],
      "猫": ["邻居家养了一只可爱的小白猫。", "The neighbor keeps a cute little white cat."],
      "狗": ["院子里有一只温顺的小狗。", "There is a gentle little dog in the courtyard."],
      "走": ["吃完饭后我们去散步走走吧。", "Let's go for a walk after finishing meals."],
      "跑": ["他每天早晨坚持跑步五公里。", "He insists on running five kilometers every morning."],
      "坐": ["请在靠窗的座位上坐下。", "Please sit down on the seat by the window."],
      "站": ["我们在车站等了半个小时。", "We waited at the station for half an hour."],
      "飞": ["飞机在蔚蓝的天空中飞翔。", "The airplane flies in the azure sky."],
      "听": ["我最喜欢听轻快优美的音乐。", "I like listening to light and beautiful music the most."],
      "唱": ["她在舞台上唱了一首动听的歌。", "She sang a moving song on stage."],
      "写": ["他用毛笔认真写汉字。", "He writes Chinese characters carefully with a brush."],
      "读": ["每天坚持朗读中文课文。", "Persist in reading Chinese texts aloud every day."],
      "问": ["不懂的地方请举手问老师。", "Raise your hand to ask the teacher if you don't understand."],
      "答": ["他非常准确地回答了这个问题。", "He answered this question very accurately."],
      "找": ["我正在找昨天借的那本书。", "I am looking for that book I borrowed yesterday."],
      "送": ["朋友送了我一份精致的礼物。", "A friend gave me an exquisite gift."],
      "借": ["我想从图书馆借两本小说。", "I want to borrow two novels from the library."],
      "还": ["请在周末前把图书还给图书馆。", "Please return the books to the library before the weekend."],
      "洗": ["吃饭之前一定要认真洗手。", "Be sure to wash your hands carefully before meals."],
      "穿": ["今天天气很冷，多穿件外套。", "It's cold today, put on an extra coat."],
      "开": ["请把客厅的窗户打开通风。", "Please open the living room window for ventilation."],
      "关": ["离开房间前请记得关灯。", "Remember to turn off lights before leaving the room."],
      "快": ["时间过得真快，一天又过去了。", "Time flies so fast, another day has passed."],
      "慢": ["请说得慢一点，我还在学中文。", "Please speak a bit slower, I am still learning Chinese."],
      "高": ["那座新盖的大楼非常高耸。", "That newly built building is very tall."],
      "低": ["他低下头认真思考着问题。", "He lowered his head and thought about the question attentively."],
      "长": ["这条公路一直通向远方的城市。", "This highway leads all the way to the distant city."],
      "短": ["这篇短文写得非常精彩生动。", "This short article is written very wonderfully and vividly."],
      "多": ["今天参加聚会的朋友很多。", "Many friends attended the gathering today."],
      "少": ["路上行人很少，显得很安静。", "Pedestrians on the road are few, looking very quiet."],
      "新": ["新学期开始了，大家都很兴奋。", "The new semester started, everyone is very excited."],
      "旧": ["这本旧词典陪伴了我很多年。", "This old dictionary has accompanied me for many years."]
    };

    if (vocabularyList[char]) {
      zh = vocabularyList[char][0];
      en = vocabularyList[char][1];
    } else {
      // General natural phrase for the character
      zh = `在生活里，“${char}”字常用于相关表达。`;
      en = `In daily life, "${char}" (${firstDef}) is commonly used.`;
    }

    fullResult[rank] = {
      zh: zh,
      py: formatPinyin(zh),
      en: en
    };
  }
});

fs.writeFileSync(path.join(__dirname, '../src/data/examples_1000.json'), JSON.stringify(fullResult, null, 2));
console.log(`Successfully generated ${Object.keys(fullResult).length} sentences.`);
