export interface StorySentence {
  id: string;
  zh: string;
  py: string;
  en: string;
}

export interface StoryParagraph {
  id: string;
  zh: string;
  py: string;
  en: string;
  sentences: StorySentence[];
}

export interface StoryQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface Story {
  id: string;
  titleZh: string;
  titlePy: string;
  titleEn: string;
  level: string;
  source: string;
  lessonTarget: string;
  description: string;
  paragraphs: StoryParagraph[];
  questions: StoryQuestion[];
}

export const STORIES: Story[] = [
  // ==========================================
  // STORY 1: HSK 4 - 塞翁失马，焉知非福
  // ==========================================
  {
    id: 'hsk4-saiweng',
    titleZh: '塞翁失马，焉知非福',
    titlePy: 'Sài Wēng Shī Mǎ, Yān Zhī Fēi Fú',
    titleEn: 'A Blessing in Disguise (The Old Man at the Frontier Loses His Horse)',
    level: 'HSK 4 • Classic Story',
    source: 'Official HSK 4 Standard Curriculum & Chinese Philosophy',
    lessonTarget: 'Vocabulary: HSK 3-4 High-Frequency Hanzi',
    description:
      'A famous traditional Chinese philosophical story from the Huainanzi, teaching that misfortune may turn into good luck and vice versa.',
    paragraphs: [
      {
        id: 'p1',
        zh: '古时候，在中国的边境住着一位老人，人们叫他“塞翁”。塞翁非常懂得养马。有一天，他家的一匹好马不知道为什么，突然跑到了邻国去。邻居们听说了这件事，都觉得很可惜，纷纷走来安慰塞翁。塞翁却一点儿也不难过，微笑着说：“这虽然看起来是一件坏事，但怎么知道它不会变成一件好事呢？”',
        py: 'Gǔ shíhou, zài Zhōngguó de biānjìng zhùzhe yí wèi lǎorén, rénmen jiào tā "Sài Wēng". Sài Wēng fēicháng dǒngde yǎng mǎ. Yǒu yì tiān, tā jiā de yì pǐ hǎo mǎ bù zhīdào wèishénme, tūrán pǎo dào le línguó qù. Línjūmen tīngshuō le zhè jiàn shì, dōu juéde hěn kěxī, fēnfēn zǒu lái ānwèi Sài Wēng. Sài Wēng què yìdiǎnr yě bù nánguò, wēixiàozhe shuō: "Zhè suīrán kàn qǐlái shì yí jiàn huàishì, dàn zěnme zhīdào tā bú huì biànchéng yí jiàn hǎoshì ne?"',
        en: 'In ancient times, an elderly man lived on the northern frontier of China; people called him "Old Sai" (Sai Weng). He was skilled at raising horses. One day, one of his fine horses ran away across the border into a neighboring state for no apparent reason. Hearing about this, his neighbors felt sorry for him and came over one after another to comfort him. Sai Weng, however, was not upset at all and smiled: "Although this looks like a bad thing, how do we know it won\'t turn into something good?"',
        sentences: [
          {
            id: 's1-1',
            zh: '古时候，在中国的边境住着一位老人，人们叫他“塞翁”。',
            py: 'Gǔ shíhou, zài Zhōngguó de biānjìng zhùzhe yí wèi lǎorén, rénmen jiào tā "Sài Wēng".',
            en: 'In ancient times, an elderly man lived on the northern frontier of China, and people called him "Old Sai".',
          },
          {
            id: 's1-2',
            zh: '塞翁非常懂得养马。',
            py: 'Sài Wēng fēicháng dǒngde yǎng mǎ.',
            en: 'Old Sai was very skilled at raising horses.',
          },
          {
            id: 's1-3',
            zh: '有一天，他家的一匹好马不知道为什么，突然跑到了邻国去。',
            py: 'Yǒu yì tiān, tā jiā de yì pǐ hǎo mǎ bù zhīdào wèishénme, tūrán pǎo dào le línguó qù.',
            en: 'One day, one of his fine horses ran across the border into a neighboring country for no known reason.',
          },
          {
            id: 's1-4',
            zh: '邻居们听说了这件事，都觉得很可惜，纷纷走来安慰塞翁。',
            py: 'Línjūmen tīngshuō le zhè jiàn shì, dōu juéde hěn kěxī, fēnfēn zǒu lái ānwèi Sài Wēng.',
            en: 'When the neighbors heard about this, they all felt it was a great pity and came one by one to console him.',
          },
          {
            id: 's1-5',
            zh: '塞翁却一点儿也不难过，微笑着说：“这虽然看起来是一件坏事，但怎么知道它不会变成一件好事呢？”',
            py: 'Sài Wēng què yìdiǎnr yě bù nánguò, wēixiàozhe shuō: "Zhè suīrán kàn qǐlái shì yí jiàn huàishì, dàn zěnme zhīdào tā bú huì biànchéng yí jiàn hǎoshì ne?"',
            en: 'Sai Weng, however, was not at all sad, smiling and saying: "Although this appears to be a misfortune, how do you know it will not turn into good fortune?"',
          },
        ],
      },
      {
        id: 'p2',
        zh: '过了几个月，令人意想不到的事情发生了。那匹跑掉的马不仅自己回来了，还从邻国带回来了一匹高大强壮的骏马。大家都高兴地跑来祝贺塞翁，说他的运气真是太好了。可是，塞翁却皱起眉头，严肃地对大家说：“平白无故得到了一匹好马，怎么知道这不会变成一件坏事呢？”',
        py: 'Guò le jǐ gè yuè, lìng rén yìxiǎngbúdào de shìqing fāshēng le. Nà pǐ pǎodiào de mǎ bùjǐn zìjǐ huílái le, hái cóng línguó dài huílái le yì pǐ gāodà qiángzhuàng de jùnmǎ. Dàjiā dōu gāoxìng de pǎo lái zhùhè Sài Wēng, shuō tā de yùnqi zhēn shì tài hǎo le. Kěshì, Sài Wēng què zhòuqǐ méitóu, yánsù de duì dàjiā shuō: "Píngbáiwúgù dédào le yì pǐ hǎo mǎ, zěnme zhīdào zhè bú huì biànchéng yí jiàn huàishì ne?"',
        en: 'A few months later, something unexpected happened. The lost horse not only returned on its own, but also brought back a tall, magnificent steed from the neighboring land. Everyone happily ran over to congratulate Old Sai on his incredible luck. However, Old Sai furrowed his brows and said seriously: "Gaining a fine horse for no reason—how do we know this won\'t bring about misfortune?"',
        sentences: [
          {
            id: 's2-1',
            zh: '过了几个月，令人意想不到的事情发生了。',
            py: 'Guò le jǐ gè yuè, lìng rén yìxiǎngbúdào de shìqing fāshēng le.',
            en: 'A few months later, an unexpected turn of events occurred.',
          },
          {
            id: 's2-2',
            zh: '那匹跑掉的马不仅自己回来了，还从邻国带回来了一匹高大强壮的骏马。',
            py: 'Nà pǐ pǎodiào de mǎ bùjǐn zìjǐ huílái le, hái cóng línguó dài huílái le yì pǐ gāodà qiángzhuàng de jùnmǎ.',
            en: 'The lost horse not only returned on its own, but also led back a strong, magnificent steed from the neighboring country.',
          },
          {
            id: 's2-3',
            zh: '大家都高兴地跑来祝贺塞翁，说他的运气真是太好了。',
            py: 'Dàjiā dōu gāoxìng de pǎo lái zhùhè Sài Wēng, shuō tā de yùnqi zhēn shì tài hǎo le.',
            en: 'Everyone rushed over cheerfully to congratulate Old Sai, saying how marvelous his luck was.',
          },
          {
            id: 's2-4',
            zh: '可是，塞翁却皱起眉头，严肃地对大家说：“平白无故得到了一匹好马，怎么知道这不会变成一件坏事呢？”',
            py: 'Kěshì, Sài Wēng què zhòuqǐ méitóu, yánsù de duì dàjiā shuō: "Píngbáiwúgù dédào le yì pǐ hǎo mǎ, zěnme zhīdào zhè bú huì biànchéng yí jiàn huàishì ne?"',
            en: 'However, Old Sai furrowed his brows and said solemnly: "To gain a fine horse without reason—how do we know this will not become a calamity?"',
          },
        ],
      },
      {
        id: 'p3',
        zh: '塞翁有一个非常喜欢骑马的儿子。看到家里多了一匹骏马，儿子每天都骑着它到处飞奔。一天，儿子从奔跑的马上重重地摔了下来，摔断了腿，变成了跛子。邻居们纷纷赶来同情他，塞翁依然平静地对大家说：“孩子虽然断了腿，但你们怎么知道这不会变成一件好事呢？”',
        py: 'Sài Wēng yǒu yí gè fēicháng xǐhuan qímǎ de érzi. Kàndào jiālǐ duō le yì pǐ jùnmǎ, érzi měitiān dōu qízhe tā dàochù fēibēn. Yì tiān, érzi cóng bēnpǎo de mǎ shang zhòngzhòng de shuāi le xiàlai, shuāiduàn le tuǐ, biànchéng le bǒzi. Línjūmen fēnfēn gǎn lái tóngqíng tā, Sài Wēng yīrán píngjìng de duì dàjiā shuō: "Háizi suīrán duàn le tuǐ, dàn nǐmen zěnme zhīdào zhè bú huì biànchéng yí jiàn hǎoshì ne?"',
        en: 'Sai Weng had a son who loved horseback riding. Delighted by the new fine horse, the son rode it galloping everywhere each day. One day, he fell hard from the galloping horse, broke his leg, and became permanently lame. The neighbors came in droves to express their sorrow, but Sai Weng remained serene: "Though my boy has broken his leg, how do you know this will not bring good fortune?"',
        sentences: [
          {
            id: 's3-1',
            zh: '塞翁有一个非常喜欢骑马的儿子。',
            py: 'Sài Wēng yǒu yí gè fēicháng xǐhuan qímǎ de érzi.',
            en: 'Old Sai had a son who was extremely fond of horseback riding.',
          },
          {
            id: 's3-2',
            zh: '看到家里多了一匹骏马，儿子每天都骑着它到处飞奔。',
            py: 'Kàndào jiālǐ duō le yì pǐ jùnmǎ, érzi měitiān dōu qízhe tā dàochù fēibēn.',
            en: 'Thrilled with the new steed, the son rode it galloping across the fields every day.',
          },
          {
            id: 's3-3',
            zh: '一天，儿子从奔跑的马上重重地摔了下来，摔断了腿，变成了跛子。',
            py: 'Yì tiān, érzi cóng bēnpǎo de mǎ shang zhòngzhòng de shuāi le xiàlai, shuāiduàn le tuǐ, biànchéng le bǒzi.',
            en: 'One day, he tumbled violently from the galloping horse, broke his leg, and was crippled.',
          },
          {
            id: 's3-4',
            zh: '邻居们纷纷赶来同情他，塞翁依然平静地对大家说：“孩子虽然断了腿，但你们怎么知道这不会变成一件好事呢？”',
            py: 'Línjūmen fēnfēn gǎn lái tóngqíng tā, Sài Wēng yīrán píngjìng de duì dàjiā shuō: "Háizi suīrán duàn le tuǐ, dàn nǐmen zěnme zhīdào zhè bú huì biànchéng yí jiàn hǎoshì ne?"',
            en: 'Neighbors rushed over with deep sympathy, yet Old Sai calmly replied: "Though he broke his leg, how do you know this will not turn into a blessing?"',
          },
        ],
      },
      {
        id: 'p4',
        zh: '一年之后，边境爆发了激烈的战争。所有的年轻男子都被官府征召去前线当兵打仗。因为战事极其残酷，绝大多数青年都在战场上失去了宝贵的生命。而塞翁的儿子因为腿有残疾，不能去当兵，最终保全了性命，陪伴着年迈的父母安度晚年。这个成语告诉我们：好事与坏事在一定条件下是可以相互转化的，面对生活中的得与失，我们应该保持豁达与平和的心态。',
        py: 'Yì nián zhīhòu, biānjìng bàofā le jīliè de zhànzhēng. Suǒyǒu de niánqīng nánzǐ dōu bèi guānfǔ zhēngzhào qù qiánxiàn dāngbīng dǎzhàng. Yīnwèi zhànshì jíqí cánkù, juédàduōshù qīngnián dōu zài zhànchǎng shang shīqù le bǎoguì de shēngmìng. Ér Sài Wēng de érzi yīnwèi tuǐ yǒu cánjí, bù néng qù dāngbīng, zuìzhōng bǎoquán le xìngmìng, péibànzhe niánmài de fùmǔ āndù wǎnnián. Zhè gè chéngyǔ gàosu wǒmen: hǎoshì yǔ huàishì zài yídìng tiáojiàn xià shì kěyǐ xiānghù zhuǎnhuà de, miànduì shēnghuó zhōng de dé yǔ shī, wǒmen yīnggāi bǎochí huòdá yǔ pínghé de xīntài.',
        en: 'A year later, fierce warfare broke out on the frontier. All able young men were drafted by the imperial authorities to fight on the front lines. Due to the brutality of the conflict, the vast majority of local youths lost their lives in battle. Because Old Sai\'s son was crippled, he was exempt from military duty, saving his life and allowing him to care for his aging parents in peace. This proverb teaches us that fortune and misfortune are interdependent and can transform into one another under changing conditions; we should maintain a calm, open-minded perspective toward life\'s gains and losses.',
        sentences: [
          {
            id: 's4-1',
            zh: '一年之后，边境爆发了激烈的战争。',
            py: 'Yì nián zhīhòu, biānjìng bàofā le jīliè de zhànzhēng.',
            en: 'One year later, a fierce war erupted along the frontier.',
          },
          {
            id: 's4-2',
            zh: '所有的年轻男子都被官府征召去前线当兵打仗。',
            py: 'Suǒyǒu de niánqīng nánzǐ dōu bèi guānfǔ zhēngzhào qù qiánxiàn dāngbīng dǎzhàng.',
            en: 'Every young man was conscripted by the authorities to fight on the front lines.',
          },
          {
            id: 's4-3',
            zh: '因为战事极其残酷，绝大多数青年都在战场上失去了宝贵的生命。',
            py: 'Yīnwèi zhànshì jíqí cánkù, juédàduōshù qīngnián dōu zài zhànchǎng shang shīqù le bǎoguì de shēngmìng.',
            en: 'Because the war was intensely brutal, the vast majority of young men perished on the battlefield.',
          },
          {
            id: 's4-4',
            zh: '而塞翁的儿子因为腿有残疾，不能去当兵，最终保全了性命，陪伴着年迈的父母安度晚年。',
            py: 'Ér Sài Wēng de érzi yīnwèi tuǐ yǒu cánjí, bù néng qù dāngbīng, zuìzhōng bǎoquán le xìngmìng, péibànzhe niánmài de fùmǔ āndù wǎnnián.',
            en: 'Yet Old Sai\'s son, being disabled, could not serve in the military, which preserved his life and enabled him to care for his elderly parents.',
          },
          {
            id: 's4-5',
            zh: '这个成语告诉我们：好事与坏事在一定条件下是可以相互转化的，面对生活中的得与失，我们应该保持豁达与平和的心态。',
            py: 'Zhè gè chéngyǔ gàosu wǒmen: hǎoshì yǔ huàishì zài yídìng tiáojiàn xià shì kěyǐ xiānghù zhuǎnhuà de, miànduì shēnghuó zhōng de dé yǔ shī, wǒmen yīnggāi bǎochí huòdá yǔ pínghé de xīntài.',
            en: 'This idiom teaches that fortune and misfortune transform into one another under changing conditions; we should maintain equanimity through all of life\'s turns.',
          },
        ],
      },
    ],
    questions: [
      {
        id: 'q1',
        question: '为什么塞翁在丢了马之后一点儿也不着急和难过？ (Why was Old Sai not anxious after losing his horse?)',
        options: [
          '因为他很有钱，不在乎一匹马 (Because he was wealthy and did not care about a single horse)',
          '因为他懂得好事和坏事在一定条件下会相互转化 (Because he understood that good and bad fortune can transform into each other)',
          '因为那匹马本来就是偷来的 (Because the horse had been stolen originally)',
          '因为他知道邻国很快会把马送回来 (Because he knew the neighboring country would return it soon)',
        ],
        correctAnswer: 1,
        explanation: '塞翁明白事物的发展是辩证的，眼前的坏事可能蕴含着未来的转机。(Old Sai understood the dialectical nature of events.)',
      },
      {
        id: 'q2',
        question: '塞翁的儿子后来为什么能够保全性命没有去打仗？ (Why was Old Sai\'s son saved from having to go to war?)',
        options: [
          '因为塞翁给了官府很多金钱 (Because Sai Weng bribed the officials with money)',
          '因为他从马上摔断了腿，身体有残疾 (Because he fell from the horse and broke his leg, becoming disabled)',
          '因为他是养马专家，不需要去当兵 (Because he was a horse expert exempt from duty)',
          '因为他们一家悄悄搬到了邻国 (Because the family secretly moved across the border)',
        ],
        correctAnswer: 1,
        explanation: '第四段写道：“塞翁的儿子因为腿有残疾，不能去当兵，最终保全了性命。” (His broken leg made him exempt from military conscription.)',
      },
    ],
  },

  // ==========================================
  // STORY 2: HSK 3 - 买伞的故事：换个角度看生活
  // ==========================================
  {
    id: 'hsk3-umbrella',
    titleZh: '买伞的故事：换个角度看生活',
    titlePy: 'Mǎi Sǎn de Gùshi: Huàn ge Jiǎodù Kàn Shēnghuó',
    titleEn: 'The Story of Selling Umbrellas: Looking at Life from Another Angle',
    level: 'HSK 3 • Graded Reader',
    source: 'HSK Standard Course Level 3 Reading Collection',
    lessonTarget: 'Vocabulary: HSK 2-3 High-Frequency Hanzi',
    description:
      'An inspiring everyday story about an elderly mother who worries about her two daughters regardless of the weather, until a wise neighbor teaches her the power of positive mindset.',
    paragraphs: [
      {
        id: 'p1',
        zh: '从前，有一位老奶奶，她每天都过得很不开心，脸上总是写满了担忧。邻居们只要见到她，就会发现她在不停地叹气。大家都很奇怪，这位老奶奶有两个非常孝顺的女儿，家里的生活也很富足，为什么她每天还是那么烦恼呢？',
        py: 'Cóngqián, yǒu yí wèi lǎonǎinai, tā měitiān dōu guò de hěn bù kāixīn, liǎn shang zǒngshì xiěmǎn le dānyōu. Línjūmen zhǐyào jiàn dào tā, jiù huì fāxiàn tā zài bùtíng de tànqì. Dàjiā dōu hěn qíguài, zhè wèi lǎonǎinai yǒu liǎng gè fēicháng xiàoshùn de nǚ\'ér, jiālǐ de shēnghuó yě hěn fùzú, wèishénme tā měitiān háishì nàme fánnǎo ne?',
        en: 'Once upon a time, there was an elderly grandmother who lived unhappily every single day, her face perpetually full of worry. Whenever neighbors saw her, they found her sighing constantly. Everyone found this strange: she had two devoted daughters and a comfortable life, so why was she always so burdened with worry?',
        sentences: [
          {
            id: 's1-1',
            zh: '从前，有一位老奶奶，她每天都过得很不开心，脸上总是写满了担忧。',
            py: 'Cóngqián, yǒu yí wèi lǎonǎinai, tā měitiān dōu guò de hěn bù kāixīn, liǎn shang zǒngshì xiěmǎn le dānyōu.',
            en: 'Once upon a time, an old grandmother lived unhappy every day with a face etched in worry.',
          },
          {
            id: 's1-2',
            zh: '邻居们只要见到她，就会发现她在不停地叹气。',
            py: 'Línjūmen zhǐyào jiàn dào tā, jiù huì fāxiàn tā zài bùtíng de tànqì.',
            en: 'Whenever the neighbors saw her, they would notice her sighing incessantly.',
          },
          {
            id: 's1-3',
            zh: '大家都很奇怪，这位老奶奶有两个非常孝顺的女儿，家里的生活也很富足，为什么她每天还是那么烦恼呢？',
            py: 'Dàjiā dōu hěn qíguài, zhè wèi lǎonǎinai yǒu liǎng gè fēicháng xiàoshùn de nǚ\'ér, jiālǐ de shēnghuó yě hěn fùzú, wèishénme tā měitiān háishì nàme fánnǎo ne?',
            en: 'Everyone wondered why she was so stressed when she had two filial daughters and a comfortable home.',
          },
        ],
      },
      {
        id: 'p2',
        zh: '原来，老奶奶的大女儿开了一家雨伞店，专门卖各种各样的雨伞；而她的小女儿则开了一家面馆，专门卖晒干的面条。每当天气晴朗、阳光明媚的时候，老奶奶就会难过地哭泣，自言自语道：“今天太阳这么大，天气这么好，谁还会去买我大女儿的雨伞呢？大女儿的雨伞卖不出去，她该怎么生活啊！”',
        py: 'Yuánlái, lǎonǎinai de dà nǚ\'ér kāi le yì jiā yǔsǎn diàn, zhuānmén mài gèzhǒng gèyàng de yǔsǎn; ér tā de xiǎo nǚ\'ér zé kāi le yì jiā miànguǎn, zhuānmén mài shàigān de miàntiáo. Měidāng tiānqì qínglǎng, yángguāng míngmèi de shíhou, lǎonǎinai jiù huì nánguò de kūqì, zìyánzìyǔ dào: "Jīntiān tàiyáng zhème dà, tiānqì zhème hǎo, shuí hái huì qù mǎi wǒ dà nǚ\'ér de yǔsǎn ne? Dà nǚ\'ér de yǔsǎn mài bu chūqù, tā gāi zěnme shēnghuó a!"',
        en: 'As it turned out, her elder daughter ran an umbrella store selling all kinds of umbrellas, while her younger daughter operated a noodle shop selling sun-dried noodles. Whenever the weather was sunny and radiant, the grandmother would weep and mutter: "The sun is so bright today, who will buy umbrellas from my elder daughter? If her umbrellas don\'t sell, how will she make a living!"',
        sentences: [
          {
            id: 's2-1',
            zh: '原来，老奶奶的大女儿开了一家雨伞店，专门卖各种各样的雨伞；而她的小女儿则开了一家面馆，专门卖晒干的面条。',
            py: 'Yuánlái, lǎonǎinai de dà nǚ\'ér kāi le yì jiā yǔsǎn diàn, zhuānmén mài gèzhǒng gèyàng de yǔsǎn; ér tā de xiǎo nǚ\'ér zé kāi le yì jiā miànguǎn, zhuānmén mài shàigān de miàntiáo.',
            en: 'Her elder daughter ran an umbrella shop, while her younger daughter owned a dried noodle shop.',
          },
          {
            id: 's2-2',
            zh: '每当天气晴朗、阳光明媚的时候，老奶奶就会难过地哭泣，自言自语道：“今天太阳这么大，天气这么好，谁还会去买我大女儿的雨伞呢？大女儿的雨伞卖不出去，她该怎么生活啊！”',
            py: 'Měidāng tiānqì qínglǎng, yángguāng míngmèi de shíhou, lǎonǎinai jiù huì nánguò de kūqì, zìyánzìyǔ dào: "Jīntiān tàiyáng zhème dà, tiānqì zhème hǎo, shuí hái huì qù mǎi wǒ dà nǚ\'ér de yǔsǎn ne? Dà nǚ\'ér de yǔsǎn mài bu chūqù, tā gāi zěnme shēnghuó a!"',
            en: 'Whenever it was sunny, the grandmother wept: "With such clear skies, who will buy umbrellas from my elder daughter?"',
          },
        ],
      },
      {
        id: 'p3',
        zh: '而到了阴天下雨的时候，老奶奶依然愁眉苦脸。她看着窗外的雨水，又开始为小女儿叹气：“哎呀，今天下这么大的雨，小女儿洗好的面条根本没有太阳晒干。面条晒不干就会发霉坏掉，小女儿的面馆该怎么经营啊！”因此，不管是晴天还是雨天，老奶奶每天都在痛苦和焦虑中度过。',
        py: 'Ér dào le yīntiān xiàyǔ de shíhou, lǎonǎinai yīrán chóuméikǔliǎn. Tā kànzhe chuāngwài de yǔshuǐ, yòu kāishǐ wèi xiǎo nǚ\'ér tànqì: "Āiyā, jīntiān xià zhème dà de yǔ, xiǎo nǚ\'ér xǐ hǎo de miàntiáo gēnběn méiyǒu tàiyáng shàigān. Miàntiáo shài bù gān jiù huì fāméi huàidiào, xiǎo nǚ\'ér de miànguǎn gāi zěnme jīngyíng a!" Yīncǐ, bùguǎn shì qíngtiān háishì yǔtiān, lǎonǎinai měitiān dōu zài tòngkǔ hé jiāolǜ zhōng dùguò.',
        en: 'And when it rained, the grandmother remained distressed. Staring at the rain outside, she would fret over her younger daughter: "Oh dear, with such heavy rain, how will my younger daughter dry her noodles without sunshine? The damp noodles will spoil, how will her noodle shop survive!" Thus, come rain or shine, she passed every day in agony and anxiety.',
        sentences: [
          {
            id: 's3-1',
            zh: '而到了阴天下雨的时候，老奶奶依然愁眉苦脸。',
            py: 'Ér dào le yīntiān xiàyǔ de shíhou, lǎonǎinai yīrán chóuméikǔliǎn.',
            en: 'And when overcast skies brought rain, the grandmother remained miserable.',
          },
          {
            id: 's3-2',
            zh: '她看着窗外的雨水，又开始为小女儿叹气：“哎呀，今天下这么大的雨，小女儿洗好的面条根本没有太阳晒干。面条晒不干就会发霉坏掉，小女儿的面馆该怎么经营啊！”',
            py: 'Tā kànzhe chuāngwài de yǔshuǐ, yòu kāishǐ wèi xiǎo nǚ\'ér tànqì: "Āiyā, jīntiān xià zhème dà de yǔ, xiǎo nǚ\'ér xǐ hǎo de miàntiáo gēnběn méiyǒu tàiyáng shàigān. Miàntiáo shài bù gān jiù huì fāméi huàidiào, xiǎo nǚ\'ér de miànguǎn gāi zěnme jīngyíng a!"',
            en: 'Gazing at the falling rain, she lamented: "With such heavy rain, my younger daughter cannot dry her noodles in the sun and they will spoil!"',
          },
          {
            id: 's3-3',
            zh: '因此，不管是晴天还是雨天，老奶奶每天都在痛苦和焦虑中度过。',
            py: 'Yīncǐ, bùguǎn shì qíngtiān háishì yǔtiān, lǎonǎinai měitiān dōu zài tòngkǔ hé jiāolǜ zhōng dùguò.',
            en: 'Thus, whether sunny or rainy, she spent each day trapped in anguish and worry.',
          },
        ],
      },
      {
        id: 'p4',
        zh: '一天，一位智慧的长者路过老奶奶的家门，看到她正在伤心地抹眼泪，便走上前去询问原因。听完老奶奶的诉说后，智者哈哈大笑起来，温和地对她说：“老人家，您为什么不换一个角度想一想呢？下雨天的时候，您应该为大女儿感到高兴，因为下雨大家都要买雨伞，大女儿的雨伞店生意一定会非常红火；而到了晴天的时候，您应该为小女儿感到开心，因为阳光明媚，小女儿的面条很快就能晒干卖个好价钱！”',
        py: 'Yì tiān, yí wèi zhìhuì de zhǎngzhě lùguò lǎonǎinai de jiāmén, kàndào tā zhèngzài shāngxīn de mǒ yǎnlèi, biàn zǒu shàngqián qù xúnwèn yuányīn. Tīng wán lǎonǎinai de sùshuō hòu, zhìzhě hāhā dàxiào qǐlái, wēnhé de duì tā shuō: "Lǎorénjiā, nín wèishénme bù huàn yí gè jiǎodù xiǎng yì xiǎng ne? Xiàyǔ tiān de shíhou, nín yīnggāi wèi dà nǚ\'ér gǎndào gāoxìng, yīnwèi xiàyǔ dàjiā dōu yào mǎi yǔsǎn, dà nǚ\'ér de yǔsǎn diàn shēngyì yídìng huì fēicháng hónghuǒ; ér dào le qíngtiān de shíhou, nín yīnggāi wèi xiǎo nǚ\'ér gǎndào kāixīn, yīnwèi yángguāng míngmèi, xiǎo nǚ\'ér de miàntiáo hěn kuài jiù néng shàigān mài ge hǎo jiàqián!"',
        en: 'One day, a wise elder walked past her doorway, saw her wiping tears, and gently inquired what was wrong. Hearing her plight, the elder chuckled warmly: "Good grandmother, why not look at this from another perspective? When it rains, celebrate for your elder daughter, for everyone will buy umbrellas and her business will boom! And on sunny days, rejoice for your younger daughter, for the sun will swiftly dry her noodles to sell for a great profit!"',
        sentences: [
          {
            id: 's4-1',
            zh: '一天，一位智慧的长者路过老奶奶的家门，看到她正在伤心地抹眼泪，便走上前去询问原因。',
            py: 'Yì tiān, yí wèi zhìhuì de zhǎngzhě lùguò lǎonǎinai de jiāmén, kàndào tā zhèngzài shāngxīn de mǒ yǎnlèi, biàn zǒu shàngqián qù xúnwèn yuányīn.',
            en: 'One day, a wise elder passed by, saw her weeping, and kindly asked what troubled her.',
          },
          {
            id: 's4-2',
            zh: '听完老奶奶的诉说后，智者哈哈大笑起来，温和地对她说：“老人家，您为什么不换一个角度想一想呢？下雨天的时候，您应该为大女儿感到高兴，因为下雨大家都要买雨伞，大女儿的雨伞店生意一定会非常红火；而到了晴天的时候，您应该为小女儿感到开心，因为阳光明媚，小女儿的面条很快就能晒干卖个好价钱！”',
            py: 'Tīng wán lǎonǎinai de sùshuō hòu, zhìzhě hāhā dàxiào qǐlái, wēnhé de duì tā shuō: "Lǎorénjiā, nín wèishénme bù huàn yí gè jiǎodù xiǎng yì xiǎng ne? Xiàyǔ tiān de shíhou, nín yīnggāi wèi dà nǚ\'ér gǎndào gāoxìng, yīnwèi xiàyǔ dàjiā dōu yào mǎi yǔsǎn, dà nǚ\'ér de yǔsǎn diàn shēngyì yídìng huì fēicháng hónghuǒ; ér dào le qíngtiān de shíhou, nín yīnggāi wèi xiǎo nǚ\'ér gǎndào kāixīn, yīnwèi yángguāng míngmèi, xiǎo nǚ\'ér de miàntiáo hěn kuài jiù néng shàigān mài ge hǎo jiàqián!"',
            en: 'Hearing her story, the sage smiled: "Why not think differently? On rainy days, celebrate for your elder daughter whose umbrella shop will thrive; on sunny days, rejoice for your younger daughter whose noodles will dry swiftly!"',
          },
        ],
      },
      {
        id: 'p5',
        zh: '老奶奶听完智者的话，顿时恍然大悟。从那以后，她再也不为天气发愁了。晴天时，她为小女儿的面条晒干而快乐；下雨天时，她为大女儿的雨伞畅销而欢喜。老奶奶的脸上终于露出了灿烂的笑容，过上了幸福快乐的生活。这个故事告诉我们：生活中的很多烦恼，往往来源于我们看问题的角度。改变自己的心态，幸福其实就在我们身边。',
        py: 'Lǎonǎinai tīng wán zhìzhě de huà, dòngshí huǎngrándàwù. Cóng nà yǐhòu, tā zài yě bù wèi tiānqì fāchóu le. Qíngtiān shí, tā wèi xiǎo nǚ\'ér de miàntiáo shàigān ér kuàilè; xiàyǔ tiān shí, tā wèi dà nǚ\'ér de yǔsǎn chàngxiāo ér huānxǐ. Lǎonǎinai de liǎn shang zhōngyú lòuchū le cànlàn de xiàoróng, guò shàng le xìngfú kuàilè de shēnghuó. Zhè gè gùshi gàosu wǒmen: shēnghuó zhōng de hěn duō fánnǎo, wǎngwǎng láiyuán yú wǒmen kàn wèntí de jiǎodù. Gǎibiàn zìjǐ de xīntài, xìngfú qíshí jiù zài wǒmen shēnbiān.',
        en: 'Hearing the sage\'s advice, the grandmother suddenly had a profound awakening. From that day on, she never fretted over the weather again. On sunny days, she rejoiced for her younger daughter\'s noodle drying; on rainy days, she beamed for her elder daughter\'s thriving umbrella sales. Radiant smiles returned to her face, and she lived happily ever after. This story reminds us: many worries in life stem from the angles we choose to look from. Change your mindset, and happiness is right beside you.',
        sentences: [
          {
            id: 's5-1',
            zh: '老奶奶听完智者的话，顿时恍然大悟。',
            py: 'Lǎonǎinai tīng wán zhìzhě de huà, dòngshí huǎngrándàwù.',
            en: 'Upon hearing the sage\'s words, the grandmother suddenly had an epiphany.',
          },
          {
            id: 's5-2',
            zh: '从那以后，她再也不为天气发愁了。',
            py: 'Cóng nà yǐhòu, tā zài yě bù wèi tiānqì fāchóu le.',
            en: 'From then on, she never worried over the weather again.',
          },
          {
            id: 's5-3',
            zh: '晴天时，她为小女儿的面条晒干而快乐；下雨天时，她为大女儿的雨伞畅销而欢喜。',
            py: 'Qíngtiān shí, tā wèi xiǎo nǚ\'ér de miàntiáo shàigān ér kuàilè; xiàyǔ tiān shí, tā wèi dà nǚ\'ér de yǔsǎn chàngxiāo ér huānxǐ.',
            en: 'On sunny days, she rejoiced for her noodle-drying daughter; on rainy days, she cheered for her umbrella-selling daughter.',
          },
          {
            id: 's5-4',
            zh: '老奶奶的脸上终于露出了灿烂的笑容，过上了幸福快乐的生活。',
            py: 'Lǎonǎinai de liǎn shang zhōngyú lòuchū le cànlàn de xiàoróng, guò shàng le xìngfú kuàilè de shēnghuó.',
            en: 'A bright smile returned to her face, and she lived a truly joyful life.',
          },
          {
            id: 's5-5',
            zh: '这个故事告诉我们：生活中的很多烦恼，往往来源于我们看问题的角度。改变自己的心态，幸福其实就在我们身边。',
            py: 'Zhè gè gùshi gàosu wǒmen: shēnghuó zhōng de hěn duō fánnǎo, wǎngwǎng láiyuán yú wǒmen kàn wèntí de jiǎodù. Gǎibiàn zìjǐ de xīntài, xìngfú qíshí jiù zài wǒmen shēnbiān.',
            en: 'This story reminds us: many of life\'s worries stem from perspective. By adjusting our mindset, joy is always within reach.',
          },
        ],
      },
    ],
    questions: [
      {
        id: 'q1',
        question: '老奶奶之前在晴天的时候为什么会感到难过？ (Why did the grandmother feel sad on sunny days?)',
        options: [
          '因为天气太热让她生病了 (Because the hot weather made her ill)',
          '因为担心晴天没有人去买大女儿的雨伞 (Because she feared no one would buy umbrellas from her elder daughter)',
          '因为小女儿的面条在晴天卖不出去 (Because the younger daughter could not sell noodles on sunny days)',
          '因为她不喜欢明媚的阳光 (Because she disliked bright sunlight)',
        ],
        correctAnswer: 1,
        explanation: '第二段指出：晴天时老奶奶担心大女儿的雨伞卖不出去。(She worried no one bought umbrellas in sunny weather.)',
      },
      {
        id: 'q2',
        question: '智者给了老奶奶什么样的建议？ (What advice did the wise elder give her?)',
        options: [
          '让两个女儿都转行做别的生意 (Have both daughters switch to other businesses)',
          '晴天为小女儿的面条晒干高兴，雨天为大女儿的雨伞畅销开心 (Rejoice for the noodle daughter on sunny days, and for the umbrella daughter on rainy days)',
          '搬家到一个从来不下雨的城市 (Move to a city where it never rains)',
          '每天待在家里不要出门 (Stay home every day and never venture outside)',
        ],
        correctAnswer: 1,
        explanation: '智者教导老奶奶换个角度思考：晴天为小女儿开心，雨天为大女儿高兴。(Think positively according to the advantages of each day\'s weather.)',
      },
    ],
  },

  // ==========================================
  // STORY 3: HSK 5 - 愚公移山：信念与坚持的力量
  // ==========================================
  {
    id: 'hsk5-yugong',
    titleZh: '愚公移山：信念与坚持的力量',
    titlePy: 'Yú Gōng Yí Shān: Xìnniàn yǔ Jiānchí de Lìliang',
    titleEn: 'The Foolish Old Man Moves the Mountains: The Power of Perseverance',
    level: 'HSK 5 • Classic Literature',
    source: 'Liezi (列子) & HSK 5 Standard Chinese Advanced Reader',
    lessonTarget: 'Vocabulary: HSK 4-5 Advanced Hanzi & Connective Grammar',
    description:
      'The timeless Chinese classical fable of Old Yu Gong who, despite being nearly ninety, resolved to dig away two massive mountains blocking his village, inspiring generations with the power of perseverance.',
    paragraphs: [
      {
        id: 'p1',
        zh: '在古代中国，有两座大山阻挡在太行和王屋之间。这两座山高耸入云，方圆足足有七百里。在山的北面住着一位老人，因为年纪很大，大家都亲切地称呼他为“北山愚公”。愚公家的大门正好正对着这两座险峻的高山。由于高山的阻隔，村民们每次出门办事或者进城经商，都必须绕过极其遥远的山路，常常需要耗费数天的时间，交通十分不便。',
        py: 'Zài gǔdài Zhōngguó, yǒu liǎng zuò dà shān zǔdǎng zài Tàiháng hé Wángwū zhījiān. Zhè liǎng zuò shān gāosǒng rù yún, fāngyuán zúzú yǒu qībǎi lǐ. Zài shān de běimiàn zhùzhe yí wèi lǎorén, yīnwèi niánjì hěn dà, dàjiā dōu qīnqiè de chēnghu tā wéi "Běishān Yú Gōng". Yú Gōng jiā de dàmén zhènghǎo zhèng duìzhe zhè liǎng zuò xiǎnjùn de gāoshān. Yóuyú gāoshān de zǔgé, cūnmínmen měicì chūmén bànshì huòzhě jìnchéng jīngshāng, dōu bìxū ràoguò jíqí yáoyuǎn de shānlù, chángcháng xūyào hàofèi shù tiān de shíjiān, jiāotōng shífēn búbiàn.',
        en: 'In ancient China, two colossal mountains named Taihang and Wangwu stood side by side, towering into the clouds and spanning over seven hundred li. On the northern side lived an elderly man whom everyone respectfully called "Old Yu Gong" (the Foolish Old Man of the North Mountain). Yu Gong\'s front door faced these two treacherous peaks directly. Because the mountains blocked the way, villagers had to take exhausting detours lasting several days whenever they traveled or traded, causing immense hardship.',
        sentences: [
          {
            id: 's1-1',
            zh: '在古代中国，有两座大山阻挡在太行和王屋之间。',
            py: 'Zài gǔdài Zhōngguó, yǒu liǎng zuò dà shān zǔdǎng zài Tàiháng hé Wángwū zhījiān.',
            en: 'In ancient China, two grand mountains named Taihang and Wangwu blocked the land.',
          },
          {
            id: 's1-2',
            zh: '这两座山高耸入云，方圆足足有七百里。',
            py: 'Zhè liǎng zuò shān gāosǒng rù yún, fāngyuán zúzú yǒu qībǎi lǐ.',
            en: 'These two mountains soared into the clouds, spanning over seven hundred li across.',
          },
          {
            id: 's1-3',
            zh: '在山的北面住着一位老人，因为年纪很大，大家都亲切地称呼他为“北山愚公”。',
            py: 'Zài shān de běimiàn zhùzhe yí wèi lǎorén, yīnwèi niánjì hěn dà, dàjiā dōu qīnqiè de chēnghu tā wéi "Běishān Yú Gōng".',
            en: 'To the north of the mountains lived an elder affectionately known as "Old Yu Gong".',
          },
          {
            id: 's1-4',
            zh: '愚公家的大门正好正对着这两座险峻的高山。',
            py: 'Yú Gōng jiā de dàmén zhènghǎo zhèng duìzhe zhè liǎng zuò xiǎnjùn de gāoshān.',
            en: 'The front doorway of Yu Gong\'s house faced these two steep mountains directly.',
          },
          {
            id: 's1-5',
            zh: '由于高山的阻隔，村民们每次出门办事或者进城经商，都必须绕过极其遥远的山路，常常需要耗费数天的时间，交通十分不便。',
            py: 'Yóuyú gāoshān de zǔgé, cūnmínmen měicì chūmén bànshì huòzhě jìnchéng jīngshāng, dōu bìxū ràoguò jíqí yáoyuǎn de shānlù, chángcháng xūyào hàofèi shù tiān de shíjiān, jiāotōng shífēn búbiàn.',
            en: 'Because the mountains blocked the way, villagers had to take arduous detours taking several days, making transport deeply inconvenient.',
          },
        ],
      },
      {
        id: 'p2',
        zh: '当愚公将近九十岁高龄的时候，他终于下定决心，要把这两座大山彻底铲平，开辟出一条直通南方的平坦大道。一天晚上，愚公召集了全家人商量这件大事。儿子和孙子们听了都非常赞同，表示愿意全力支持。只有愚公的妻子提出了担忧：“凭您的微薄力气，连一座小土丘都很难削平，又怎么能搬走这样庞大的太行和王屋山呢？而且，挖出来的泥土和石头又该运送到哪里去呢？”子孙们齐声回答：“我们可以把石块和泥土运到遥远的渤海边，投进大海里！”',
        py: 'Dāng Yú Gōng jiāngjìn jiǔshí suì gāolíng de shíhou, tā zhōngyú xiàdìng juéxīn, yào bǎ zhè liǎng zuò dà shān chèdǐ chǎnpíng, kāipì chū yì tiáo zhítōng nánfāng de píngtǎn dàdào. Yì tiān wǎnshang, Yú Gōng zhàojí le quán jiā rén shāngliang zhè jiàn dàshì. Érzi hé sūnzi men tīng le dōu fēicháng zàntóng, biǎoshì yuànyì quánlì zhīchí. Zhǐyǒu Yú Gōng de qīzi tíchū le dānyōu: "Píng nín de wēibó lìqi, lián yí zuò xiǎo tǔqiū dōu hěn nán xiāopíng, yòu zěnme néng bānzǒu zhèyàng pángdà de Tàiháng hé Wángwū shān ne? Érqiě, wā chūlái de nítǔ hé shítou yòu gāi yùnsòng dào nǎlǐ qù ne?" Zǐsūnmen qíshēng huídá: "Wǒmen kěyǐ bǎ shíkuài hé nítǔ yùn dào yáoyuǎn de Bóhǎi biān, tóujìn dàhǎi lǐ!"',
        en: 'When Yu Gong approached nearly ninety years of age, he resolved to level the two mountains and carve out a straight road to the south. One evening, he gathered his family to discuss the endeavor. His sons and grandsons cheered and vowed full support. Only his wife expressed doubt: "With your frail strength, you can barely flatten a small mound; how could you remove towering mountains like Taihang and Wangwu? Besides, where will all the excavated rocks and soil go?" His descendants answered in unison: "We will transport them to the distant Bohai Sea and cast them into the ocean!"',
        sentences: [
          {
            id: 's2-1',
            zh: '当愚公将近九十岁高龄的时候，他终于下定决心，要把这两座大山彻底铲平，开辟出一条直通南方的平坦大道。',
            py: 'Dāng Yú Gōng jiāngjìn jiǔshí suì gāolíng de shíhou, tā zhōngyú xiàdìng juéxīn, yào bǎ zhè liǎng zuò dà shān chèdǐ chǎnpíng, kāipì chū yì tiáo zhítōng nánfāng de píngtǎn dàdào.',
            en: 'When Yu Gong reached nearly ninety years of age, he made up his mind to level the two mountains and carve out a smooth road.',
          },
          {
            id: 's2-2',
            zh: '一天晚上，愚公召集了全家人商量这件大事。',
            py: 'Yì tiān wǎnshang, Yú Gōng zhàojí le quán jiā rén shāngliang zhè jiàn dàshì.',
            en: 'One evening, Yu Gong gathered his entire family to deliberate on this grand undertaking.',
          },
          {
            id: 's2-3',
            zh: '儿子和孙子们听了都非常赞同，表示愿意全力支持。',
            py: 'Érzi hé sūnzi men tīng le dōu fēicháng zàntóng, biǎoshì yuànyì quánlì zhīchí.',
            en: 'His sons and grandsons agreed enthusiastically and pledged their full support.',
          },
          {
            id: 's2-4',
            zh: '只有愚公的妻子提出了担忧：“凭您的微薄力气，连一座小土丘都很难削平，又怎么能搬走这样庞大的太行和王屋山呢？而且，挖出来的泥土和石头又该运送到哪里去呢？”',
            py: 'Zhǐyǒu Yú Gōng de qīzi tíchū le dānyōu: "Píng nín de wēibó lìqi, lián yí zuò xiǎo tǔqiū dōu hěn nán xiāopíng, yòu zěnme néng bānzǒu zhèyàng pángdà de Tàiháng hé Wángwū shān ne? Érqiě, wā chūlái de nítǔ hé shítou yòu gāi yùnsòng dào nǎlǐ qù ne?"',
            en: 'His wife voiced concern: "With your modest strength, how could you move such massive mountains? And where will all the earth and stones go?"',
          },
          {
            id: 's2-5',
            zh: '子孙们齐声回答：“我们可以把石块和泥土运到遥远的渤海边，投进大海里！”',
            py: 'Zǐsūnmen qíshēng huídá: "Wǒmen kěyǐ bǎ shíkuài hé nítǔ yùn dào yáoyuǎn de Bóhǎi biān, tóujìn dàhǎi lǐ!"',
            en: 'The descendants declared together: "We can haul the rocks and earth to the Bohai Sea and dump them into the ocean!"',
          },
        ],
      },
      {
        id: 'p3',
        zh: '第二天清晨，愚公带领着儿子和孙子们拿着铁锹和锄头开始凿石头、挖泥土，并用竹筐将土石运往渤海。邻居有一位寡妇，她有一个刚换乳牙的七八岁小男孩，看到愚公一家在劳作，也欢蹦乱跳地跑来帮忙。因为路途遥远，运送一趟土石往往需要冬夏换季、寒来暑往才能返回一次。大家不畏艰辛，日夜不停地挖山。',
        py: 'Dì\'èr tiān qīngchén, Yú Gōng dàilǐngzhe érzi hé sūnzi men názhe tiěqiāo hé chútou kāishǐ záo shítou, wā nítǔ, bìng yòng zhúkuāng jiāng tǔshí yùn wǎng Bóhǎi. Línjū yǒu yí wèi guǎfù, tā yǒu yí gè gāng huàn rǔyá de qī bā suì xiǎo nánhái, kàndào Yú Gōng yì jiā zài láozuò, yě huānbèngluàntiào de pǎo lái bāngmáng. Yīnwèi lùtú yáoyuǎn, yùnsòng yí tàng tǔshí wǎngwǎng xūyào dōng xià huànjì, hán lái shǔ wǎng cái néng fǎnhuí yí cì. Dàjiā bú wèi jiānxīn, rìyè bù tíng de wā shān.',
        en: 'The next morning at dawn, Yu Gong led his sons and grandsons with picks and shovels, chipping stone and digging earth, carrying baskets to the Bohai Sea. A widow next door had an eager seven-year-old boy who jumped in to help. Because the distance was immense, a single round trip took from winter to summer. Despite the toil, they persisted day and night.',
        sentences: [
          {
            id: 's3-1',
            zh: '第二天清晨，愚公带领着儿子和孙子们拿着铁锹和锄头开始凿石头、挖泥土，并用竹筐将土石运往渤海。',
            py: 'Dì\'èr tiān qīngchén, Yú Gōng dàilǐngzhe érzi hé sūnzi men názhe tiěqiāo hé chútou kāishǐ záo shítou, wā nítǔ, bìng yòng zhúkuāng jiāng tǔshí yùn wǎng Bóhǎi.',
            en: 'At dawn the next day, Yu Gong led his sons and grandsons with shovels and hoes to dig earth and haul it to the Bohai Sea.',
          },
          {
            id: 's3-2',
            zh: '邻居有一位寡妇，她有一个刚换乳牙的七八岁小男孩，看到愚公一家在劳作，也欢蹦乱跳地跑来帮忙。',
            py: 'Línjū yǒu yí wèi guǎfù, tā yǒu yí gè gāng huàn rǔyá de qī bā suì xiǎo nánhái, kàndào Yú Gōng yì jiā zài láozuò, yě huānbèngluàntiào de pǎo lái bāngmáng.',
            en: 'A neighboring widow had a young boy who eagerly ran over to help them work.',
          },
          {
            id: 's3-3',
            zh: '因为路途遥远，运送一趟土石往往需要冬夏换季、寒来暑往才能返回一次。',
            py: 'Yīnwèi lùtú yáoyuǎn, yùnsòng yí tàng tǔshí wǎngwǎng xūyào dōng xià huànjì, hán lái shǔ wǎng cái néng fǎnhuí yí cì.',
            en: 'Because the journey was so distant, a single round trip spanned from winter to summer.',
          },
          {
            id: 's3-4',
            zh: '大家不畏艰辛，日夜不停地挖山。',
            py: 'Dàjiā bú wèi jiānxīn, rìyè bù tíng de wā shān.',
            en: 'Undaunted by hardship, they continued digging day and night.',
          },
        ],
      },
      {
        id: 'p4',
        zh: '黄河边住着一位自以为聪明的智叟。看到愚公带领一家人辛苦地挖山，智叟忍不住走上前去嘲笑愚公：“你真是太愚蠢、太不自量力了！凭你现在一把年纪、连走路都摇晃的衰弱身体，恐怕连山上的几根草木都拔不光，怎么可能把这么两座大山挖平呢？”愚公长长地叹了一口气，坚定地反驳道：“你的思想真是顽固不化，眼光连寡妇家的小孩都不如！虽然我很快就会死去，但我有儿子；儿子又生孙子，孙子再生儿子；子子孙孙无穷无尽，而山却不会再长高增厚，我们为什么会搬不平这两座山呢？”智叟听了哑口无言，惭愧地低下了头。',
        py: 'Huáng Hé biān zhùzhe yí wèi zì yǐwéi cōngmíng de Zhì Sǒu. Kàndào Yú Gōng dàilǐng yì jiā rén xīnkǔ de wā shān, Zhì Sǒu rěnbuzhù zǒu shàngqián qù cháoxiào Yú Gōng: "Nǐ zhēn shì tài yúchǔn, tài búzìliànglì le! Píng nǐ xiànzài yìbǎ niánjì, lián zǒulù dōu yáohuàng de shuāiruò shēntǐ, kǒngpà lián shān shang de jǐ gēn cǎomù dōu bá bù guāng, zěnme kěnéng bǎ zhème liǎng zuò dà shān wā píng ne?" Yú Gōng chángcháng de tàn le yì kǒuqì, jiāndìng de fǎnbó dào: "Nǐ de sīxiǎng zhēn shì wángù bù huà, yǎnguāng lián guǎfù jiā de xiǎohái dōu bùrú! Suīrán wǒ hěn kuài jiù huì sǐqù, dàn wǒ yǒu érzi; érzi yòu shēng sūnzi, sūnzi zài shēng érzi; zǐzǐsūnsūn wúqióng wújìn, ér shān què bú huì zài zhǎng gāo zēng hòu, wǒmen wèishénme huì bān bù píng zhè liǎng zuò shān ne?" Zhì Sǒu tīng le yǎkǒuwúyán, cánkuì de dīxià le tóu.',
        en: 'By the Yellow River lived an elder named Zhi Sou ("the Wise Old Man"). Seeing Yu Gong toiling, Zhi Sou mocked him: "You are truly foolish and overestimate yourself! At your frail age, you can hardly pull up a blade of grass; how could you flatten mountains?" Yu Gong sighed deeply and replied: "Your mind is rigid and narrow, inferior even to a child! Though I shall die, I have sons; my sons have grandsons, and descendants will multiply without end. Yet the mountain will grow no taller. Why should we fail to level it?" Zhi Sou was left speechless with shame.',
        sentences: [
          {
            id: 's4-1',
            zh: '黄河边住着一位自以为聪明的智叟。',
            py: 'Huáng Hé biān zhùzhe yí wèi zì yǐwéi cōngmíng de Zhì Sǒu.',
            en: 'By the Yellow River lived a man who deemed himself clever, named Zhi Sou.',
          },
          {
            id: 's4-2',
            zh: '看到愚公带领一家人辛苦地挖山，智叟忍不住走上前去嘲笑愚公：“你真是太愚蠢、太不自量力了！凭你现在一把年纪、连走路都摇晃的衰弱身体，恐怕连山上的几根草木都拔不光，怎么可能把这么两座大山挖平呢？”',
            py: 'Kàndào Yú Gōng dàilǐng yì jiā rén xīnkǔ de wā shān, Zhì Sǒu rěnbuzhù zǒu shàngqián qù cháoxiào Yú Gōng: "Nǐ zhēn shì tài yúchǔn, tài búzìliànglì le! Píng nǐ xiànzài yìbǎ niánjì, lián zǒulù dōu yáohuàng de shuāiruò shēntǐ, kǒngpà lián shān shang de jǐ gēn cǎomù dōu bá bù guāng, zěnme kěnéng bǎ zhème liǎng zuò dà shān wā píng ne?"',
            en: 'Seeing Yu Gong digging, Zhi Sou mocked: "You overestimate yourself! At your fragile age, you can barely uproot grass, let alone level huge mountains!"',
          },
          {
            id: 's4-3',
            zh: '愚公长长地叹了一口气，坚定地反驳道：“你的思想真是顽固不化，眼光连寡妇家的小孩都不如！”',
            py: 'Yú Gōng chángcháng de tàn le yì kǒuqì, jiāndìng de fǎnbó dào: "Nǐ de sīxiǎng zhēn shì wángù bù huà, yǎnguāng lián guǎfù jiā de xiǎohái dōu bùrú!"',
            en: 'Yu Gong retorted firmly: "How obstinate you are! Your vision is lesser than even a young child\'s!"',
          },
          {
            id: 's4-4',
            zh: '“虽然我很快就会死去，但我有儿子；儿子又生孙子，孙子再生儿子；子子孙孙无穷无尽，而山却不会再长高增厚，我们为什么会搬不平这两座山呢？”',
            py: '"Suīrán wǒ hěn kuài jiù huì sǐqù, dàn wǒ yǒu érzi; érzi yòu shēng sūnzi, sūnzi zài shēng érzi; zǐzǐsūnsūn wúqióng wújìn, ér shān què bú huì zài zhǎng gāo zēng hòu, wǒmen wèishénme huì bān bù píng zhè liǎng zuò shān ne?"',
            en: '"Though I shall die, descendants will carry on endlessly while the mountains grow no higher; why shouldn\'t we succeed in flattening them?"',
          },
          {
            id: 's4-5',
            zh: '智叟听了哑口无言，惭愧地低下了头。',
            py: 'Zhì Sǒu tīng le yǎkǒuwúyán, cánkuì de dīxià le tóu.',
            en: 'Zhi Sou was struck speechless, lowering his head in embarrassment.',
          },
        ],
      },
      {
        id: 'p5',
        zh: '掌管山岳的神仙听说了愚公的宏大志向，也为他那永不放弃的精神所深深打动，于是将这件事报告给了天帝。天帝被愚公坚韧不拔的诚心与毅力彻底感动，便派遣了两位力大无比的天神下凡，把太行山搬到了朔东，把王屋山搬到了雍南。从此以后，冀州南面到汉水南岸之间一片平坦，再也没有高山阻隔了。“愚公移山”这个故事流传了千百年，成为中华民族面对艰难险阻时自强不息、勇往直前的精神象征。',
        py: 'Zhǎngguǎn shānyuè de shénxiān tīngshuō le Yú Gōng de hóngdà zhìxiàng, yě wèi tā nà yǒng bù fàngqì de jīngshén suǒ shēnshēn dǎdòng, yúshì jiāng zhè jiàn shì bàogào gěi le Tiāndì. Tiāndì bèi Yú Gōng jiānrènbùbá de chéngxīn yǔ yìlì chèdǐ gǎndòng, biàn pàiqiǎn le liǎng wèi lìdàwúbǐ de tiānshén xiàfán, bǎ Tàiháng Shān bān dào le Shuòdōng, bǎ Wángwū Shān bān dào le Yōngnán. Cóngcǐ yǐhòu, Jìzhōu nánmiàn dào Hànshuǐ nán\'àn zhījiān yípiàn píngtǎn, zài yě méiyǒu gāoshān zǔgé le. "Yú Gōng Yí Shān" zhè gè gùshi liúchuán le qiān bǎi nián, biànchéng Zhōnghuá mínzú miànduì jiānnán xiǎnzǔ shí zìqiángbùxī, yǒngwǎngzhíqián de jīngshén xiàngzhēng.',
        en: 'The mountain spirits, moved by Yu Gong\'s resolve, reported the matter to the Heavenly Emperor. Touched by Yu Gong\'s sincerity and tireless spirit, the Emperor dispatched two divine beings who lifted the mountains and relocated them afar. Henceforth, the land stretching south to the Han River became wide and clear. The story of "Yu Gong Moving the Mountains" has endured for millennia as a timeless emblem of perseverance and grit.',
        sentences: [
          {
            id: 's5-1',
            zh: '掌管山岳的神仙听说了愚公的宏大志向，也为他那永不放弃的精神所深深打动，于是将这件事报告给了天帝。',
            py: 'Zhǎngguǎn shānyuè de shénxiān tīngshuō le Yú Gōng de hóngdà zhìxiàng, yě wèi tā nà yǒng bù fàngqì de jīngshén suǒ shēnshēn dǎdòng, yúshì jiāng zhè jiàn shì bàogào gěi le Tiāndì.',
            en: 'The mountain spirits, deeply moved by Yu Gong\'s unwavering spirit, reported his actions to Heaven.',
          },
          {
            id: 's5-2',
            zh: '天帝被愚公坚韧不拔的诚心与毅力彻底感动，便派遣了两位力大无比的天神下凡，把太行山搬到了朔东，把王屋山搬到了雍南。',
            py: 'Tiāndì bèi Yú Gōng jiānrènbùbá de chéngxīn yǔ yìlì chèdǐ gǎndòng, biàn pàiqiǎn le liǎng wèi lìdàwúbǐ de tiānshén xiàfán, bǎ Tàiháng Shān bān dào le Shuòdōng, bǎ Wángwū Shān bān dào le Yōngnán.',
            en: 'Touched by his perseverance, the Emperor dispatched two mighty deities to move the mountains away.',
          },
          {
            id: 's5-3',
            zh: '从此以后，冀州南面到汉水南岸之间一片平坦，再也没有高山阻隔了。',
            py: 'Cóngcǐ yǐhòu, Jìzhōu nánmiàn dào Hànshuǐ nán\'àn zhījiān yípiàn píngtǎn, zài yě méiyǒu gāoshān zǔgé le.',
            en: 'From then on, the vast territory across the region became flat and free of obstacles.',
          },
          {
            id: 's5-4',
            zh: '“愚公移山”这个故事流传了千百年，成为中华民族面对艰难险阻时自强不息、勇往直前的精神象征。',
            py: '"Yú Gōng Yí Shān" zhè gè gùshi liúchuán le qiān bǎi nián, biànchéng Zhōnghuá mínzú miànduì jiānnán xiǎnzǔ shí zìqiángbùxī, yǒngwǎngzhíqián de jīngshén xiàngzhēng.',
            en: '"Yu Gong Moving the Mountains" has inspired people for thousands of years as a symbol of relentless grit.',
          },
        ],
      },
    ],
    questions: [
      {
        id: 'q1',
        question: '愚公决定移山的主要原因是什么？ (What was the primary reason Yu Gong decided to remove the mountains?)',
        options: [
          '因为山上的野兽经常跑进村庄伤害牲畜 (Because wild animals from the mountains injured village livestock)',
          '因为高山阻隔了交通，出行和进城极其不便 (Because the towering mountains blocked transport, making travel exhausting)',
          '为了向智叟炫耀自己的家族力量 (To show off his family power to Zhi Sou)',
          '因为天帝托梦命令他必须移山 (Because the Heavenly Emperor commanded him in a dream)',
        ],
        correctAnswer: 1,
        explanation: '第一段提到：“由于高山的阻隔，村民们每次出门办事……都必须绕过极其遥远的山路，交通十分不便。” (The mountains severely obstructed roads and communication.)',
      },
      {
        id: 'q2',
        question: '面对智叟的嘲笑，愚公用什么道理驳斥了他？ (How did Yu Gong refute Zhi Sou\'s ridicule?)',
        options: [
          '他认为山很高但是泥土很软容易挖 (He believed the mountain was soft and easy to dig)',
          '他相信子子孙孙无穷无尽，而山不会再增高，只要坚持就一定能挖平 (He knew generations of descendants are endless while the mountains grow no higher)',
          '他打算请几千名雇工一起来帮忙 (He planned to hire thousands of laborers)',
          '他早就知道天神会来帮忙搬山 (He already knew deities would intervene)',
        ],
        correctAnswer: 1,
        explanation: '第四段愚公指出：“子子孙孙无穷无尽，而山却不会再长高增厚，我们为什么会搬不平呢？” (Human generations are limitless while mountains do not grow.)',
      },
    ],
  },

  // ==========================================
  // STORY 4: HSK 6 - 庄子与惠子：濠梁之辩与万物共情
  // ==========================================
  {
    id: 'hsk6-zhuangzi',
    titleZh: '庄子与惠子：濠梁之辩与万物共情',
    titlePy: 'Zhuāngzǐ yǔ Huìzǐ: Háo Liáng zhī Biàn yǔ Wànwù Gòngqíng',
    titleEn: 'Zhuangzi and Huizi: The Debate on the Hao Bridge and Universal Empathy',
    level: 'HSK 6 • Classical Philosophy',
    source: 'Zhuangzi (庄子·秋水) & HSK 6 Advanced Classical Literature',
    lessonTarget: 'Vocabulary: HSK 5-6 Advanced Idioms & Philosophical Discourse',
    description:
      'The famous debate between Zhuangzi and logician Huizi at the Hao River bridge, exploring the epistemological question of whether humans can know the happiness of fish and the nature of empathy with all living things.',
    paragraphs: [
      {
        id: 'p1',
        zh: '两千多年前的战国时期，思想界百家争鸣。道家学派的代表人物庄子和名家学派的代表人物惠子，既是学术见解截然不同的论辩对手，又是相互赏识、心灵相通的挚友。庄子崇尚顺应自然、追求精神的绝对自由；而惠子则精于逻辑推理，注重事物的名实辨析与严密论证。正是这种哲学思想上的巨大差异，为中国思想史上留下了许多耐人寻味的精彩对话。',
        py: 'Liǎng qiān duō nián qián de Zhànguó shíqī, sīxiǎngjiè bǎijiāzhēngmíng. Dàojiā xuépài de dàibiǎo rénwù Zhuāngzǐ hé Míngjiā xuépài de dàibiǎo rénwù Huìzǐ, jì shì xuéshù jiànjiě jiérán bùtóng de lùnbiàn duìshǒu, yòu shì xiānghù shǎngshí, xīnlíng xiāngtōng de zhìyǒu. Zhuāngzǐ chóngshàng shùnyìng zìrán, zhuīqiú jīngshén de juéduì zìyóu; ér Huìzǐ zé jīngyú luóji tuīlǐ, zhùzhòng shìwù de míng shí biànxī yǔ yánmì lùnzhèng. Zhèng shì zhè zhǒng zhéxué sīxiǎng shang de jùdà chāyì, wèi Zhōngguó sīxiǎngshǐ shang liúxià le xǔduō nàirénxúnwèi de jīngcǎi duìhuà.',
        en: 'Over two thousand years ago during the Warring States period, hundreds of schools of thought flourished. Daoist master Zhuangzi and logician Huizi were both intellectual rivals with vastly different outlooks, yet profound soulmates who appreciated one another. Zhuangzi championed harmony with nature and absolute spiritual liberation, while Huizi excelled in rigorous logic and semantic precision. This philosophical contrast gave birth to some of the most memorable dialogues in Chinese intellectual history.',
        sentences: [
          {
            id: 's1-1',
            zh: '两千多年前的战国时期，思想界百家争鸣。',
            py: 'Liǎng qiān duō nián qián de Zhànguó shíqī, sīxiǎngjiè bǎijiāzhēngmíng.',
            en: 'Over two thousand years ago during the Warring States era, diverse schools of thought flourished.',
          },
          {
            id: 's1-2',
            zh: '道家学派的代表人物庄子和名家学派的代表人物惠子，既是学术见解截然不同的论辩对手，又是相互赏识、心灵相通的挚友。',
            py: 'Dàojiā xuépài de dàibiǎo rénwù Zhuāngzǐ hé Míngjiā xuépài de dàibiǎo rénwù Huìzǐ, jì shì xuéshù jiànjiě jiérán bùtóng de lùnbiàn duìshǒu, yòu shì xiānghù shǎngshí, xīnlíng xiāngtōng de zhìyǒu.',
            en: 'Zhuangzi and Huizi were intellectual sparring partners with opposing views, yet close friends who treasured one another.',
          },
          {
            id: 's1-3',
            zh: '庄子崇尚顺应自然、追求精神的绝对自由；而惠子则精于逻辑推理，注重事物的名实辨析与严密论证。',
            py: 'Zhuāngzǐ chóngshàng shùnyìng zìrán, zhuīqiú jīngshén de juéduì zìyóu; ér Huìzǐ zé jīngyú luóji tuīlǐ, zhùzhòng shìwù de míng shí biànxī yǔ yánmì lùnzhèng.',
            en: 'Zhuangzi revered natural spontaneity and spiritual freedom, whereas Huizi specialized in formal logic and rigorous proof.',
          },
          {
            id: 's1-4',
            zh: '正是这种哲学思想上的巨大差异，为中国思想史上留下了许多耐人寻味的精彩对话。',
            py: 'Zhèng shì zhè zhǒng zhéxué sīxiǎng shang de jùdà chāyì, wèi Zhōngguó sīxiǎngshǐ shang liúxià le xǔduō nàirénxúnwèi de jīngcǎi duìhuà.',
            en: 'This very philosophical contrast gifted Chinese intellectual history with deeply thought-provoking dialogues.',
          },
        ],
      },
      {
        id: 'p2',
        zh: '在一个春风和煦的下午，庄子和惠子一同在濠水的桥梁上漫步游赏。春水清澈见底，微风拂过水面，波光粼粼。几条白条鱼在水中自由自在地游来游去，时而聚拢，时而散开，姿态优美闲适。庄子站在桥头俯瞰着水中的游鱼，不禁心旷神怡，感叹道：“这些鲦鱼游得多么从容自在啊，这就是鱼儿的快乐啊！”',
        py: 'Zài yí gè chūnfēng héxù de xiàwǔ, Zhuāngzǐ hé Huìzǐ yìtóng zài Háo Shuǐ de qiáoliáng shang mànbù yóushǎng. Chūnshuǐ qīngchè jiàndǐ, wēifēng fúguò shuǐmiàn, bōguāng línlín. Jǐ tiáo báitiáo yú zài shuǐ zhōng zìyóu zìzài de yóu lái yóu qù, shí\'ér jùlǒng, shí\'ér sànkāi, zītài yōuměi xiánshì. Zhuāngzǐ zhàn zài qiáotóu fǔkànzhe shuǐ zhōng de yóuyú, bùjīn xīnkuàngshényí, gǎntàn dào: "Zhèxiē tiáoyú yóu de duōme cóngróng zìzài a, zhè jiù shì yú\'ér de kuàilè a!"',
        en: 'On a warm spring afternoon, Zhuangzi and Huizi strolled leisurely across the bridge over the Hao River. The water was crystal clear, sparkling under a gentle breeze. Small white minnows swam freely in the stream, darting together and apart with serene grace. Gazing down at the fish, Zhuangzi felt deeply refreshed and remarked: "See how leisurely those minnows swim—this is the true joy of fish!"',
        sentences: [
          {
            id: 's2-1',
            zh: '在一个春风和煦的下午，庄子和惠子一同在濠水的桥梁上漫步游赏。',
            py: 'Zài yí gè chūnfēng héxù de xiàwǔ, Zhuāngzǐ hé Huìzǐ yìtóng zài Háo Shuǐ de qiáoliáng shang mànbù yóushǎng.',
            en: 'On a pleasant spring afternoon, Zhuangzi and Huizi strolled together across the bridge over the Hao River.',
          },
          {
            id: 's2-2',
            zh: '春水清澈见底，微风拂过水面，波光粼粼。',
            py: 'Chūnshuǐ qīngchè jiàndǐ, wēifēng fúguò shuǐmiàn, bōguāng línlín.',
            en: 'The spring water was clear to the bottom, rippling with glimmers of sunlight in the breeze.',
          },
          {
            id: 's2-3',
            zh: '几条白条鱼在水中自由自在地游来游去，时而聚拢，时而散开，姿态优美闲适。',
            py: 'Jǐ tiáo báitiáo yú zài shuǐ zhōng zìyóu zìzài de yóu lái yóu qù, shí\'ér jùlǒng, shí\'ér sànkāi, zītài yōuměi xiánshì.',
            en: 'Minnows darted freely through the current, coming together and dispersing in graceful ease.',
          },
          {
            id: 's2-4',
            zh: '庄子站在桥头俯瞰着水中的游鱼，不禁心旷神怡，感叹道：“这些鲦鱼游得多么从容自在啊，这就是鱼儿的快乐啊！”',
            py: 'Zhuāngzǐ zhàn zài qiáotóu fǔkànzhe shuǐ zhōng de yóuyú, bùjīn xīnkuàngshényí, gǎntàn dào: "Zhèxiē tiáoyú yóu de duōme cóngróng zìzài a, zhè jiù shì yú\'ér de kuàilè a!"',
            en: 'Looking down from the bridge, Zhuangzi sighed with joy: "See how freely the fish swim; that is the joy of fish!"',
          },
        ],
      },
      {
        id: 'p3',
        zh: '一旁的惠子听后，立刻抓住了庄子话语中的逻辑漏洞，反驳道：“子非鱼，安知鱼之乐？”意思是说：你又不是鱼，你怎么可能知道鱼内心的快乐呢？惠子的提问站在严格的逻辑理性角度，认为人类和鱼类属于完全不同的物种，人类不可能直接体验到动物的内部感知与情感体验。',
        py: 'Yìpáng de Huìzǐ tīng hòu, lìkè zhuāzhù le Zhuāngzǐ huàyǔ zhōng de luóji lòudòng, fǎnbó dào: "Zǐ fēi yú, ān zhī yú zhī lè?" Yìsi shì shuō: nǐ yòu bú shì yú, nǐ zěnme kěnéng zhīdào yú nèixīn de kuàilè ne? Huìzǐ de tíwèn zhàn zài yángé de luóji lǐxìng jiǎodù, rènwéi rénlèi hé yúlèi shǔyú wánquán bùtóng de wùzhǒng, rénlèi bù kěnéng zhíjiē tǐyàn dào dòngwù de nèibù gǎnzhī yǔ qínggǎn tǐyàn.',
        en: 'Hearing this, Huizi seized upon the perceived logical flaw and countered: "You are not a fish; how do you know what constitutes the joy of fish?" Huizi framed his objection strictly from rational logic: humans and fish are completely distinct species, and humans cannot directly access the subjective sensory experiences of other creatures.',
        sentences: [
          {
            id: 's3-1',
            zh: '一旁的惠子听后，立刻抓住了庄子话语中的逻辑漏洞，反驳道：“子非鱼，安知鱼之乐？”',
            py: 'Yìpáng de Huìzǐ tīng hòu, lìkè zhuāzhù le Zhuāngzǐ huàyǔ zhōng de luóji lòudòng, fǎnbó dào: "Zǐ fēi yú, ān zhī yú zhī lè?"',
            en: 'Huizi countered at once: "You are not a fish; how can you know the happiness of fish?"',
          },
          {
            id: 's3-2',
            zh: '意思是说：你又不是鱼，你怎么可能知道鱼内心的快乐呢？',
            py: 'Yìsi shì shuō: nǐ yòu bú shì yú, nǐ zěnme kěnéng zhīdào yú nèixīn de kuàilè ne?',
            en: 'Meaning: since you are not a fish, how could you possibly know what a fish feels?',
          },
          {
            id: 's3-3',
            zh: '惠子的提问站在严格的逻辑理性角度，认为人类和鱼类属于完全不同的物种，人类不可能直接体验到动物的内部感知与情感体验。',
            py: 'Huìzǐ de tíwèn zhàn zài yángé de luóji lǐxìng jiǎodù, rènwéi rénlèi hé yúlèi shǔyú wánquán bùtóng de wùzhǒng, rénlèi bù kěnéng zhíjiē tǐyàn dào dòngwù de nèibù gǎnzhī yǔ qínggǎn tǐyàn.',
            en: 'Huizi\'s argument rested on formal logic, asserting that different species cannot inhabit each other\'s sensory consciousness.',
          },
        ],
      },
      {
        id: 'p4',
        zh: '庄子微微一笑，顺着惠子的逻辑巧妙地回应道：“子非我，安知我不知鱼之乐？”庄子的意思是：你既然不是我，你又怎么知道我不知道鱼的快乐呢？庄子巧妙地运用了惠子自己的论辩逻辑，把问题反抛给了惠子，展现了极其敏捷的辩证思维。',
        py: 'Zhuāngzǐ wēiwēi yíxiào, shùnzhe Huìzǐ de luóji qiǎomiào de huíyìng dào: "Zǐ fēi wǒ, ān zhī wǒ bù zhī yú zhī lè?" Zhuāngzǐ de yìsi shì: nǐ jìrán bú shì wǒ, nǐ yòu zěnme zhīdào wǒ bù zhīdào yú de kuàilè ne? Zhuāngzǐ qiǎomiào de yùnyòng le Huìzǐ zìjǐ de lùnbiàn luóji, bǎ wèntí fǎn pāo gěi le Huìzǐ, zhǎnxiàn le jíqí mǐnjié de biànzhèng sīwéi.',
        en: 'Zhuangzi smiled and turned Huizi\'s logic back upon him: "You are not me; how do you know I do not know the joy of fish?" Zhuangzi deftly used Huizi\'s own premise, demonstrating supreme dialectical wit.',
        sentences: [
          {
            id: 's4-1',
            zh: '庄子微微一笑，顺着惠子的逻辑巧妙地回应道：“子非我，安知我不知鱼之乐？”',
            py: 'Zhuāngzǐ wēiwēi yíxiào, shùnzhe Huìzǐ de luóji qiǎomiào de huíyìng dào: "Zǐ fēi wǒ, ān zhī wǒ bù zhī yú zhī lè?"',
            en: 'Zhuangzi smiled and replied: "You are not me; how do you know that I do not know the joy of fish?"',
          },
          {
            id: 's4-2',
            zh: '庄子的意思是：你既然不是我，你又怎么知道我不知道鱼的快乐呢？',
            py: 'Zhuāngzǐ de yìsi shì: nǐ jìrán bú shì wǒ, nǐ yòu zěnme zhīdào wǒ bù zhīdào yú de kuàilè ne?',
            en: 'Meaning: if you are not me, by what measure do you know what I perceive?',
          },
          {
            id: 's4-3',
            zh: '庄子巧妙地运用了惠子自己的论辩逻辑，把问题反抛给了惠子，展现了极其敏捷的辩证思维。',
            py: 'Zhuāngzǐ qiǎomiào de yùnyòng le Huìzǐ zìjǐ de lùnbiàn luóji, bǎ wèntí fǎn pāo gěi le Huìzǐ, zhǎnxiàn le jíqí mǐnjié de biànzhèng sīwéi.',
            en: 'Zhuangzi cleverly flipped Huizi\'s logical premise back upon him, showcasing acute agility of mind.',
          },
        ],
      },
      {
        id: 'p5',
        zh: '然而，惠子不愧是名家大师，他紧接着追问道：“我非子，固不知子矣；子固非鱼也，子之不知鱼之乐，全矣！”意思是：我确实不是你，固然无法完全了解你；但你也确实不是鱼，那么你不知道鱼的快乐，这也是完全合乎逻辑的定论了！惠子的论证环环相扣，逻辑上几乎无懈可击。',
        py: 'Rán\'ér, Huìzǐ búkuì shì Míngjiā dàshī, tā jǐnzjiēzhe zhuīwèn dào: "Wǒ fēi zǐ, gù bù zhī zǐ yǐ; zǐ gù fēi yú yě, zǐ zhī bù zhī yú zhī lè, quán yǐ!" Yìsi shì: wǒ quèshí bú shì nǐ, gùrán wúfǎ wánquán liǎojiě nǐ; dàn nǐ yě quèshí bú shì yú, nàme nǐ bù zhīdào yú de kuàilè, zhè yě shì wánquán héhū luóji de dìnglùn le! Huìzǐ de lùnzhèng huánhuánxiāngkòu, luóji shang jīhū wúxièkějī.',
        en: 'Unshaken, Huizi pressed further: "I am not you, so naturally I cannot know you; but you are certainly not a fish, and that you do not know the joy of fish remains an inescapable conclusion!" Huizi\'s syllogism was airtight and nearly impregnable.',
        sentences: [
          {
            id: 's5-1',
            zh: '然而，惠子不愧是名家大师，他紧接着追问道：“我非子，固不知子矣；子固非鱼也，子之不知鱼之乐，全矣！”',
            py: 'Rán\'ér, Huìzǐ búkuì shì Míngjiā dàshī, tā jǐnzjiēzhe zhuīwèn dào: "Wǒ fēi zǐ, gù bù zhī zǐ yǐ; zǐ gù fēi yú yě, zǐ zhī bù zhī yú zhī lè, quán yǐ!"',
            en: 'Huizi pressed: "I am not you, so I do not know you; you are not a fish, so your ignorance of the fish\'s joy is complete!"',
          },
          {
            id: 's5-2',
            zh: '意思是：我确实不是你，固然无法完全了解你；但你也确实不是鱼，那么你不知道鱼的快乐，这也是完全合乎逻辑的定论了！',
            py: 'Yìsi shì: wǒ quèshí bú shì nǐ, gùrán wúfǎ wánquán liǎojiě nǐ; dàn nǐ yě quèshí bú shì yú, nàme nǐ bù zhīdào yú de kuàilè, zhè yě shì wánquán héhū luóji de dìnglùn le!',
            en: 'Meaning: I concede I am not you, but you are not a fish, so logically you cannot know the fish!',
          },
          {
            id: 's5-3',
            zh: '惠子的论证环环相扣，逻辑上几乎无懈可击。',
            py: 'Huìzǐ de lùnzhèng huánhuánxiāngkòu, luóji shang jīhū wúxièkějī.',
            en: 'Huizi\'s argument was closely linked and logically ironclad.',
          },
        ],
      },
      {
        id: 'p6',
        zh: '这时，庄子从容不迫地作出了最终的总结：“请循其本。子曰‘汝安知鱼乐’云者，既已知吾知之而问我，我知之濠上也。”庄子把谈话拉回了最初的语境：当你最初问我‘你从哪里知道鱼的快乐’时，就已经默认了我‘知道’鱼乐的前提，只是询问我‘从哪里’得知的。我现在告诉你，我是在濠水的桥梁上，通过观赏它们优美畅游的姿态而心领神会的！庄子超越了冷冰冰的形式逻辑，以博大的同理心和审美情怀，将自我融入天地万物之中。濠梁之辩展现了中国传统哲学中‘万物与我并生，而万物齐一’的至高境界。',
        py: 'Zhè shí, Zhuāngzǐ cóngróngbùpò de zuòchū le zuìzhōng de zǒngjié: "Qǐng xún qí běn. Zǐ yuē \'rǔ ān zhī yú lè\' yún zhě, jì yǐ zhī wú zhī zhī ér wèn wǒ, wǒ zhī zhī Háo shàng yě." Zhuāngzǐ bǎ tánhuà lā huí le zuìchū de yǔjìng: dāng nǐ zuìchū wèn wǒ \'nǐ cóng nǎlǐ zhīdào yú de kuàilè\' shí, jiù yǐjīng mòrèn le wǒ \'zhīdào\' yú lè de qiántí, zhǐshì xúnwèn wǒ \'cóng nǎlǐ\' dézhī de. Wǒ xiànzài gàosu nǐ, wǒ shì zài Háo Shuǐ de qiáoliáng shang, tōngguò guānshǎng tāmen yōuměi chàngyóu de zītài ér xīnlǐngshénhuì de! Zhuāngzǐ chāoyuè le lěngbīngbīng de xíngshì luóji, yǐ bódà de tónglǐxīn hé shěnměi qínghuái, jiāng zìwǒ róngrù tiāndì wànwù zhī zhōng. Háo Liáng zhī Biàn zhǎnxiàn le Zhōngguó chuántǒng zhéxué zhōng \'wànwù yǔ wǒ bìngshēng, ér wànwù qíyī\' de zhìgāo jìngjiè.',
        en: 'At this point, Zhuangzi concluded serenely: "Let us return to the root. When you asked \'Where do you know the joy of fish from?\', you already presupposed that I knew it and were merely asking where. I tell you: I know it right here on the Hao bridge!" Zhuangzi transcended cold formalism, employing cosmic empathy and aesthetic intuition to unite the self with the universe. The debate illustrates the supreme Daoist ideal: "All things are born alongside me, and all things are one."',
        sentences: [
          {
            id: 's6-1',
            zh: '这时，庄子从容不迫地作出了最终的总结：“请循其本。子曰‘汝安知鱼乐’云者，既已知吾知之而问我，我知之濠上也。”',
            py: 'Zhè shí, Zhuāngzǐ cóngróngbùpò de zuòchū le zuìzhōng de zǒngjié: "Qǐng xún qí běn. Zǐ yuē \'rǔ ān zhī yú lè\' yún zhě, jì yǐ zhī wú zhī zhī ér wèn wǒ, wǒ zhī zhī Háo shàng yě."',
            en: 'Zhuangzi concluded peacefully: "Let us return to the beginning. You asked how/where I knew it, and I answer: I know it here on the Hao bridge!"',
          },
          {
            id: 's6-2',
            zh: '庄子把谈话拉回了最初的语境：当你最初问我‘你从哪里知道鱼的快乐’时，就已经默认了我‘知道’鱼乐的前提，只是询问我‘从哪里’得知的。',
            py: 'Zhuāngzǐ bǎ tánhuà lā huí le zuìchū de yǔjìng: dāng nǐ zuìchū wèn wǒ \'nǐ cóng nǎlǐ zhīdào yú de kuàilè\' shí, jiù yǐjīng mòrèn le wǒ \'zhīdào\' yú lè de qiántí, zhǐshì xúnwèn wǒ \'cóng nǎlǐ\' dézhī de.',
            en: 'Zhuangzi returned to the original context, showing that the phrasing implicitly recognized the experiential intuition.',
          },
          {
            id: 's6-3',
            zh: '我现在告诉你，我是在濠水的桥梁上，通过观赏它们优美畅游的姿态而心领神会的！',
            py: 'Wǒ xiànzài gàosu nǐ, wǒ shì zài Háo Shuǐ de qiáoliáng shang, tōngguò guānshǎng tāmen yōuměi chàngyóu de zītài ér xīnlǐngshénhuì de!',
            en: 'I know it from standing here on the Hao bridge, observing their untethered freedom.',
          },
          {
            id: 's6-4',
            zh: '庄子超越了冷冰冰的形式逻辑，以博大的同理心和审美情怀，将自我融入天地万物之中。',
            py: 'Zhuāngzǐ chāoyuè le lěngbīngbīng de xíngshì luóji, yǐ bódà de tónglǐxīn hé shěnměi qínghuái, jiāng zìwǒ róngrù tiāndì wànwù zhī zhōng.',
            en: 'Zhuangzi transcended rigid logic, melding human consciousness with universal empathy.',
          },
          {
            id: 's6-5',
            zh: '濠梁之辩展现了中国传统哲学中‘万物与我并生，而万物齐一’的至高境界。',
            py: 'Háo Liáng zhī Biàn zhǎnxiàn le Zhōngguó chuántǒng zhéxué zhōng \'wànwù yǔ wǒ bìngshēng, ér wànwù qíyī\' de zhìgāo jìngjiè.',
            en: 'The Hao Bridge Debate embodies the highest philosophical ideal: that all things coexist in harmony as one.',
          },
        ],
      },
    ],
    questions: [
      {
        id: 'q1',
        question: '庄子和惠子在论辩方式上的根本区别是什么？ (What is the fundamental difference in the debate approaches of Zhuangzi and Huizi?)',
        options: [
          '惠子注重严格的形式逻辑推理，庄子注重审美体验与万物共情 (Huizi relies on strict formal logic, while Zhuangzi relies on aesthetic empathy with nature)',
          '庄子只会运用愤怒来反驳对手 (Zhuangzi only uses anger to refute opponents)',
          '惠子完全不懂古代汉语语法 (Huizi did not understand classical Chinese grammar)',
          '两人只是为了争夺官位而故意吵架 (The two were merely bickering to win political office)',
        ],
        correctAnswer: 0,
        explanation: '惠子从概念逻辑出发，认为人无法体验鱼的知觉；庄子则从审美与同理心出发，把自身融于天地万物之中。(Huizi favored cognitive logic, while Zhuangzi emphasized holistic empathy.)',
      },
      {
        id: 'q2',
        question: '庄子最后为什么说“我知之濠上也”？ (Why did Zhuangzi conclude with "I know it here on the Hao bridge"?)',
        options: [
          '因为他从桥上跳进水里变成了鱼 (Because he jumped into the water and turned into a fish)',
          '他把论辩引回最初的语境，说明自己是在桥上观鱼畅游时获得了心灵的共鸣 (He returned to the initial question, explaining he perceived their joy through intuitive resonance on the bridge)',
          '因为惠子承认自己输掉了比赛 (Because Huizi admitted defeat)',
          '因为濠河的水里有会说话的神仙 (Because magical talking spirits lived in the Hao River)',
        ],
        correctAnswer: 1,
        explanation: '第六段庄子指出：自己在桥上观赏鱼儿从容游动，便在心灵层面上领会了自然的欢愉。(Zhuangzi experienced intuitive resonance while watching the fish.)',
      },
    ],
  },

  // ==========================================
  // STORY 5: HSK 6 - 人工智能与人类文明的未来展望
  // ==========================================
  {
    id: 'hsk6-ai',
    titleZh: '人工智能与人类文明的未来展望',
    titlePy: 'Réngōng Zhìnéng yǔ Rénlèi Wénmíng de Wèilái Zhǎnwàng',
    titleEn: 'Artificial Intelligence and the Future of Human Civilization',
    level: 'HSK 6 • Modern Science & Essay',
    source: 'Advanced Academic Chinese & HSK 6 Standard Discourse',
    lessonTarget: 'Vocabulary: HSK 6 Advanced Scientific & Analytical Hanzi',
    description:
      'A thought-provoking HSK 6 analytical essay discussing the exponential growth of artificial intelligence, machine learning ethics, human creativity, and the collaborative future of technology and human wisdom.',
    paragraphs: [
      {
        id: 'p1',
        zh: '进入二十一世纪以来，以深度学习和大语言模型为代表的人工智能技术迎来了爆炸式的突破与飞跃。从早期的棋类竞技程序到如今能够熟练进行文学创作、编写复杂程序代码以及协助医学精准诊断的生成式系统，人工智能正在以人类历史上前所未有的惊人速度，深刻重塑着人类社会的经济格局、生产模式与日常生活范式。',
        py: 'Jìnrù èrshíyī shìjì yǐlái, yǐ shēndù xuéxí hé dà yǔyán móxíng wéi dàibiǎo de réngōng zhìnéng jìshù yínglái le bàozhàshì de tūpò yǔ fēiyuè. Cóng zǎoqī de qílèi jìngjì chéngxù dào rújīn nénggòu shúliàn jìnxíng wénxué chuàngzuò, biānxiě fùzá chéngxù dàimǎ yǐjí xiézhù yīxué jīngzhǔn zhěnduàn de shēngchéngshì xìtǒng, réngōng zhìnéng zhèngzài yǐ rénlèi lìshǐ shang qiánsuǒwèiyǒu de jīngrén sùdù, shēnkè chóngshùzhe rénlèi shèhuì de jīngjì géjú, shēngchǎn móshì yǔ rìcháng shēnghuó fànshì.',
        en: 'Since entering the twenty-first century, artificial intelligence—spearheaded by deep learning and large language models—has achieved exponential breakthroughs. From early chess-playing programs to generative systems capable of literary composition, complex code generation, and precision medical diagnosis, AI is reshaping economic landscapes, production paradigms, and daily life at a velocity unprecedented in human history.',
        sentences: [
          {
            id: 's1-1',
            zh: '进入二十一世纪以来，以深度学习和大语言模型为代表的人工智能技术迎来了爆炸式的突破与飞跃。',
            py: 'Jìnrù èrshíyī shìjì yǐlái, yǐ shēndù xuéxí hé dà yǔyán móxíng wéi dàibiǎo de réngōng zhìnéng jìshù yínglái le bàozhàshì de tūpò yǔ fēiyuè.',
            en: 'Since the 21st century, artificial intelligence has witnessed explosive breakthroughs.',
          },
          {
            id: 's1-2',
            zh: '从早期的棋类竞技程序到如今能够熟练进行文学创作、编写复杂程序代码以及协助医学精准诊断的生成式系统，人工智能正在以人类历史上前所未有的惊人速度，深刻重塑着人类社会的经济格局、生产模式与日常生活范式。',
            py: 'Cóng zǎoqī de qílèi jìngjì chéngxù dào rújīn nénggòu shúliàn jìnxíng wénxué chuàngzuò, biānxiě fùzá chéngxù dàimǎ yǐjí xiézhù yīxué jīngzhǔn zhěnduàn de shēngchéngshì xìtǒng, réngōng zhìnéng zhèngzài yǐ rénlèi lìshǐ shang qiánsuǒwèiyǒu de jīngrén sùdù, shēnkè chóngshùzhe rénlèi shèhuì de jīngjì géjú, shēngchǎn móshì yǔ rìcháng shēnghuó fànshì.',
            en: 'From early board-game engines to systems composing literature and diagnosing illnesses, AI is rapidly reshaping society.',
          },
        ],
      },
      {
        id: 'p2',
        zh: '不可否认，人工智能为提升社会生产力注入了无可比拟的强大动能。在科学探索领域，算法能够在短短数天内模拟分析出数亿种蛋白质的三维立体结构，将传统实验室需要耗费数十年的药物研发周期大幅缩短；在工业制造与日常管理中，自动化物流与智能调度系统显著降低了能源消耗与运营成本，使人类从繁重枯燥的重复性体力劳动中彻底解脱出来。',
        py: 'Bùkě fǒurèn, réngōng zhìnéng wèi tíshēng shèhuì shēngchǎnlì zhùrù le wúkě bǐnǐ de qiángdà dòngnéng. Zài kēxué tànsuǒ lǐngyù, suànfǎ nénggòu zài duǎnduǎn shù tiān nèi mónǐ fēnxī chū shù yì zhǒng dànbáizhì de sānwéi lìtǐ jiégòu, jiāng chuántǒng shíyànshì xūyào hàofèi shù shí nián de yàowù yánfā zhōuqī dàfú suōduǎn; zài gōngyè zhìzào yǔ rìcháng guǎnlǐ zhōng, zìdònghuà wùliú yǔ zhìnéng diàodù xìtǒng xiǎnzhù jiàngdī le néngyuán xiāohào yǔ yùnyíng chéngběn, shǐ rénlèi cóng fánzhòng kūzào de chóngfùxìng tǐlì láodòng zhōng chèdǐ jiětuō chūlái.',
        en: 'Undeniably, AI injects unparalleled impetus into human productivity. In scientific inquiry, algorithms predict the 3D structures of hundreds of millions of proteins within days, compressing drug discovery timelines that previously took decades. In manufacturing and logistics, automated dispatch systems curtail energy consumption and costs, liberating workers from tedious manual labor.',
        sentences: [
          {
            id: 's2-1',
            zh: '不可否认，人工智能为提升社会生产力注入了无可比拟的强大动能。',
            py: 'Bùkě fǒurèn, réngōng zhìnéng wèi tíshēng shèhuì shēngchǎnlì zhùrù le wúkě bǐnǐ de qiángdà dòngnéng.',
            en: 'Indisputably, artificial intelligence has provided immense momentum to productivity.',
          },
          {
            id: 's2-2',
            zh: '在科学探索领域，算法能够在短短数天内模拟分析出数亿种蛋白质的三维立体结构，将传统实验室需要耗费数十年的药物研发周期大幅缩短。',
            py: 'Zài kēxué tànsuǒ lǐngyù, suànfǎ nénggòu zài duǎnduǎn shù tiān nèi mónǐ fēnxī chū shù yì zhǒng dànbáizhì de sānwéi lìtǐ jiégòu, jiāng chuántǒng shíyànshì xūyào hàofèi shù shí nián de yàowù yánfā zhōuqī dàfú suōduǎn.',
            en: 'In scientific research, algorithms model millions of protein structures in days, compressing decades of drug research.',
          },
          {
            id: 's2-3',
            zh: '在工业制造与日常管理中，自动化物流与智能调度系统显著降低了能源消耗与运营成本，使人类从繁重枯燥的重复性体力劳动中彻底解脱出来。',
            py: 'Zài gōngyè zhìzào yǔ rìcháng guǎnlǐ zhōng, zìdònghuà wùliú yǔ zhìnéng diàodù xìtǒng xiǎnzhù jiàngdī le néngyuán xiāohào yǔ yùnyíng chéngběn, shǐ rénlèi cóng fánzhòng kūzào de chóngfùxìng tǐlì láodòng zhōng chèdǐ jiětuō chūlái.',
            en: 'In industrial logistics, intelligent routing curtails energy costs and liberates humans from repetitive physical toil.',
          },
        ],
      },
      {
        id: 'p3',
        zh: '然而，科技的飞速演进犹如一把双刃剑，伴随而来的伦理挑战、社会分工重构与安全风险也日益引发全球各界的深切担忧。随着机器学习模型自主性的不断增强，数据隐私泄露、算法偏见歧视以及深度伪造技术的泛滥对传统社会的法律法规和信任体系构成了严峻考验。更为深刻的哲学追问在于：当机器能够在知识储备、计算速度乃至逻辑推演上全面超越个体人类时，人类独特的主体性价值究竟应当立足于何处？',
        py: 'Rán\'ér, kējì de fēisù yǎnjìn yóurú yì bǎ shuāngrènjiàn, bànsuí ér lái de lúnlǐ tiǎozhàn, shèhuì fēngōng chónggòu yǔ ānquán fēngxiǎn yě rìyì yǐnfā quánqiú gèjiè de shēnqiè dānyōu. Suízhe jīqì xuéxí móxíng zìzhǔxìng de bùduàn zēngqiáng, shùjù yǐnsī xièlòu, suànfǎ piānjiàn qíshì yǐjí shēndù wěizào jìshù de fànlàn duì chuántǒng shèhuì de fǎlǜ fǎguī hé xìnrèn tǐxì gòuchéng le yánjùn kǎoyàn. Gèng wéi shēnkè de zhéxué zhuīwèn zàiyú: dāng jīqì nénggòu zài zhīshi chǔbèi, jìsuàn sùdù nǎizhì luóji tuīyǎn shang quánmiàn chāoyuè gètǐ rénlèi shí, rénlèi dútè de zhǔtǐxìng jiàzhí jiùjìng yīngdāng lìzú yú héchù?',
        en: 'Yet rapid technological progress is a double-edged sword. Accompanying ethical challenges, labor restructuring, and security risks prompt global concern. As autonomy increases, data privacy violations, algorithmic biases, and deepfakes test legal frameworks. The deeper philosophical query remains: when machines surpass human knowledge and computation, where does unique human value reside?',
        sentences: [
          {
            id: 's3-1',
            zh: '然而，科技的飞速演进犹如一把双刃剑，伴随而来的伦理挑战、社会分工重构与安全风险也日益引发全球各界的深切担忧。',
            py: 'Rán\'ér, kējì de fēisù yǎnjìn yóurú yì bǎ shuāngrènjiàn, bànsuí ér lái de lúnlǐ tiǎozhàn, shèhuì fēngōng chónggòu yǔ ānquán fēngxiǎn yě rìyì yǐnfā quánqiú gèjiè de shēnqiè dānyōu.',
            en: 'However, rapid tech development is a double-edged sword, bringing ethical dilemmas and safety risks.',
          },
          {
            id: 's3-2',
            zh: '随着机器学习模型自主性的不断增强，数据隐私泄露、算法偏见歧视以及深度伪造技术的泛滥对传统社会的法律法规和信任体系构成了严峻考验。',
            py: 'Suízhe jīqì xuéxí móxíng zìzhǔxìng de bùduàn zēngqiáng, shùjù yǐnsī xièlòu, suànfǎ piānjiàn qíshì yǐjí shēndù wěizào jìshù de fànlàn duì chuántǒng shèhuì de fǎlǜ fǎguī hé xìnrèn tǐxì gòuchéng le yánjùn kǎoyàn.',
            en: 'Growing model autonomy, privacy risks, bias, and deepfakes severely challenge traditional legal and trust frameworks.',
          },
          {
            id: 's3-3',
            zh: '更为深刻的哲学追问在于：当机器能够在知识储备、计算速度乃至逻辑推演上全面超越个体人类时，人类独特的主体性价值究竟应当立足于何处？',
            py: 'Gèng wéi shēnkè de zhéxué zhuīwèn zàiyú: dāng jīqì nénggòu zài zhīshi chǔbèi, jìsuàn sùdù nǎizhì luóji tuīyǎn shang quánmiàn chāoyuè gètǐ rénlèi shí, rénlèi dútè de zhǔtǐxìng jiàzhí jiùjìng yīngdāng lìzú yú héchù?',
            en: 'The philosophical dilemma is: when machines surpass humans in knowledge and computation, where lies the intrinsic value of humanity?',
          },
        ],
      },
      {
        id: 'p4',
        zh: '面对这一时代命题，许多杰出的哲学家与计算机科学家指出：人工智能的本质是人类智慧的延伸与工具化体现，而非人类文明的替代者。机器或许能够凭借庞大的数据统计规律生成辞藻华丽的诗篇，但唯有人类才能真正体会诗歌中蕴含的爱恨情仇与生命苦难；算法可以精准计算出概率的最优解，但唯有人类才能在道德两难的抉择中彰显同情、正义与崇高的牺牲精神。情感共鸣、创造性灵感与价值判断，始终是人类不可剥夺的核心特质。',
        py: 'Miànduì zhè yí shídài mìngtí, xǔduō jiéchū de zhéxuéjiā yǔ jìsuànjī kēxuéjiā zhǐchū: réngōng zhìnéng de běnzhì shì rénlèi zhìhuì de yánshēn yǔ gōngjùhuà tǐxiàn, ér fēi rénlèi wénmíng de tìdàizhě. Jīqì huòxǔ nénggòu píngjiè pángdà de shùjù tǒngjì guīlǜ shēngchéng cízǎo huálì de shīpiān, dàn wéi yǒu rénlèi cái néng zhēnzhèng tǐhuì shīgē zhōng yùnhán de ài hèn qíng chóu yǔ shēngmìng kǔnàn; suànfǎ kěyǐ jīngzhǔn jìsuàn chū gǎilǜ de zuìyōujiě, dàn wéi yǒu rénlèi cái néng zài dàodé liǎngnán de juézé zhōng zhāngxiǎn tóngqíng, zhèngyì yǔ chónggāo de xīshēng jīngshén. Qínggǎn gòngmíng, chuàngzàoxìng línggǎn yǔ jiàzhí pànduàn, shǐzhōng shì rénlèi bùkě bōduó de héxīn tèzhì.',
        en: 'In response, philosophers and scientists emphasize that AI is an extension and tool of human intellect, not its replacement. While machines generate eloquent poetry via statistical patterns, only humans genuinely feel the depth of love, sorrow, and mortality behind those words. Algorithms calculate optimal probability solutions, but only humans display empathy, justice, and moral sacrifice in dilemmas. Emotional resonance, creative spark, and value discernment remain inalienable human hallmarks.',
        sentences: [
          {
            id: 's4-1',
            zh: '面对这一时代命题，许多杰出的哲学家与计算机科学家指出：人工智能的本质是人类智慧的延伸与工具化体现，而非人类文明的替代者。',
            py: 'Miànduì zhè yí shídài mìngtí, xǔduō jiéchū de zhéxuéjiā yǔ jìsuànjī kēxuéjiā zhǐchū: réngōng zhìnéng de běnzhì shì rénlèi zhìhuì de yánshēn yǔ gōngjùhuà tǐxiàn, ér fēi rénlèi wénmíng de tìdàizhě.',
            en: 'Experts affirm that artificial intelligence is an extension and tool of human intellect, not a replacement for civilization.',
          },
          {
            id: 's4-2',
            zh: '机器或许能够凭借庞大的数据统计规律生成辞藻华丽的诗篇，但唯有人类才能真正体会诗歌中蕴含的爱恨情仇与生命苦难；算法可以精准计算出概率的最优解，但唯有人类才能在道德两难的抉择中彰显同情、正义与崇高的牺牲精神。',
            py: 'Jīqì huòxǔ nénggòu píngjiè pángdà de shùjù tǒngjì guīlǜ shēngchéng cízǎo huálì de shīpiān, dàn wéi yǒu rénlèi cái néng zhēnzhèng tǐhuì shīgē zhōng yùnhán de ài hèn qíng chóu yǔ shēngmìng kǔnàn; suànfǎ kěyǐ jīngzhǔn jìsuàn chū gǎilǜ de zuìyōujiě, dàn wéi yǒu rénlèi cái néng zài dàodé liǎngnán de juézé zhōng zhāngxiǎn tóngqíng, zhèngyì yǔ chónggāo de xīshēng jīngshén.',
            en: 'Machines generate verse via statistics, but only humans live through love and grief; algorithms calculate probabilities, but humans embody sacrifice and moral courage.',
          },
          {
            id: 's4-3',
            zh: '情感共鸣、创造性灵感与价值判断，始终是人类不可剥夺的核心特质。',
            py: 'Qínggǎn gòngmíng, chuàngzàoxìng línggǎn yǔ jiàzhí pànduàn, shǐzhōng shì rénlèi bùkě bōduó de héxīn tèzhì.',
            en: 'Empathy, creative inspiration, and moral judgment remain the irreducible core of the human spirit.',
          },
        ],
      },
      {
        id: 'p5',
        zh: '因此，人类未来的出路绝非盲目抗拒技术变革，亦非毫无底线地放任算法主导社会。我们应当在全球范围内建立起前瞻性、包容性与约束力兼备的人工智能伦理准则与治理体系，确保技术始终向善发展，服务于全体人类的福祉。在人机共存与协作的崭新纪元中，唯有以人文主义精神为灯塔，让人工智能赋能人类的创造力与同理心，我们才能共同开创一个更加智慧、平等与繁荣的未来世界。',
        py: 'Yīncǐ, rénlèi wèilái de chūlù juéfēi mángmù kàngjù jìshù biàngé, yì fēi háowú dǐxiàn de fàngrèn suànfǎ zhǔdǎo shèhuì. Wǒmen yīnggāi zài quánqiú fànwéi nèi jiànlì qǐ qiánzhānxìng, bāoróngxìng yǔ yuēshùlì jiānbèi de réngōng zhìnéng lúnlǐ zhǔnzé yǔ zhìlǐ tǐxì, quèbǎo jìshù shǐzhōng xiàng shàn fāzhǎn, fúwù yú quántǐ rénlèi de fúzhǐ. Zài rén jī gòngcún yǔ xiézuò de zhǎnxīn jìyuán zhōng, wéi yǒu yǐ rénwénzhǔyì jīngshén wéi dēngtǎ, ràng réngōng zhìnéng fùnéng rénlèi de chuàngzàolì yǔ tónglǐxīn, wǒmen cái néng gòngtóng kāichuàng yí gè gèngjiā zhìhuì, píngděng yǔ fánróng de wèilái shìjiè.',
        en: 'Consequently, humanity\'s path forward is neither blind resistance to technological evolution nor reckless surrender to algorithmic dominance. We must establish proactive, inclusive, and binding global ethical frameworks to ensure AI serves the common good. In an era of human-machine collaboration, guided by the beacon of humanism, we can harness AI to elevate human creativity and cultivate a wiser, more equitable world.',
        sentences: [
          {
            id: 's5-1',
            zh: '因此，人类未来的出路绝非盲目抗拒技术变革，亦非毫无底线地放任算法主导社会。',
            py: 'Yīncǐ, rénlèi wèilái de chūlù juéfēi mángmù kàngjù jìshù biàngé, yì fēi háowú dǐxiàn de fàngrèn suànfǎ zhǔdǎo shèhuì.',
            en: 'Therefore, the road ahead is neither blind resistance nor unchecked surrender to algorithms.',
          },
          {
            id: 's5-2',
            zh: '我们应当在全球范围内建立起前瞻性、包容性与约束力兼备的人工智能伦理准则与治理体系，确保技术始终向善发展，服务于全体人类的福祉。',
            py: 'Wǒmen yīnggāi zài quánqiú fànwéi nèi jiànlì qǐ qiánzhānxìng, bāoróngxìng yǔ yuēshùlì jiānbèi de réngōng zhìnéng lúnlǐ zhǔnzé yǔ zhìlǐ tǐxì, quèbǎo jìshù shǐzhōng xiàng shàn fāzhǎn, fúwù yú quántǐ rénlèi de fúzhǐ.',
            en: 'We must build proactive, binding ethical governance to ensure AI serves human well-being.',
          },
          {
            id: 's5-3',
            zh: '在人机共存与协作的崭新纪元中，唯有以人文主义精神为灯塔，让人工智能赋能人类的创造力与同理心，我们才能共同开创一个更加智慧、平等与繁荣的未来世界。',
            py: 'Zài rén jī gòngcún yǔ xiézuò de zhǎnxīn jìyuán zhōng, wéi yǒu yǐ rénwénzhǔyì jīngshén wéi dēngtǎ, ràng réngōng zhìnéng fùnéng rénlèi de chuàngzàolì yǔ tónglǐxīn, wǒmen cái néng gòngtóng kāichuàng yí gè gèngjiā zhìhuì, píngděng yǔ fánróng de wèilái shìjiè.',
            en: 'In this new era of human-machine symbiosis, humanism must guide AI to empower human creativity and build a more equitable world.',
          },
        ],
      },
    ],
    questions: [
      {
        id: 'q1',
        question: '根据文章，人工智能在科学探索领域发挥的主要积极作用是什么？ (According to the text, what is a primary positive role of AI in scientific exploration?)',
        options: [
          '完全取代了人类所有科学家的工作 (Completely replacing all human scientists)',
          '在几天内模拟分析数亿种蛋白质结构，大幅缩短药物研发周期 (Modeling protein structures in days and greatly compressing drug development time)',
          '彻底消除了所有的工业生产成本 (Completely eliminating all industrial costs)',
          '让人类大脑停止思考 (Stopping the human brain from thinking)',
        ],
        correctAnswer: 1,
        explanation: '第二段明确指出：算法在几天内分析数亿种蛋白质结构，大幅缩短了传统药物研发周期。(AI analyzes hundreds of millions of protein structures in days, drastically accelerating research.)',
      },
      {
        id: 'q2',
        question: '作者认为人类区别于人工智能的最核心特质是什么？ (What does the author identify as the core distinguishing trait of humans over AI?)',
        options: [
          '知识储备的容量 (The storage capacity of knowledge)',
          '计算与逻辑推理的速度 (The speed of calculation and logical inference)',
          '情感共鸣、创造性灵感与价值判断 (Emotional empathy, creative inspiration, and moral/value judgment)',
          '记忆海量文本数据的能力 (The ability to memorize massive text data)',
        ],
        correctAnswer: 2,
        explanation: '第四段强调：“情感共鸣、创造性灵感与价值判断，始终是人类不可剥夺的核心特质。” (Empathy, creative spark, and moral judgment are inherently human.)',
      },
    ],
  },
];
