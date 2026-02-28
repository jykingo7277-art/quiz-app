export type Question = {
  id: string;
  topicId: string; // e.g. "4.1" or "3"
  bigId: string;   // "1".."9"
  stem: string;
  A?: string; B?: string; C?: string; D?: string;
  answer?: string; // "A"|"B"|"C"|"D"
};

export type TopicNode = { id: string; label: string; children?: TopicNode[] };
export const TOPIC_TREE: TopicNode[] = [
  {
    "id": "1",
    "label": "1. 时态与语态 (Tense & Voice)"
  },
  {
    "id": "2",
    "label": "2. 非谓语动词 (Non-finite Verbs)"
  },
  {
    "id": "3",
    "label": "3. 虚拟语气与情态动词(Subjunctive & Modals)"
  },
  {
    "id": "4",
    "label": "4. 各类从句(Various types of clauses)",
    "children": [
      {
        "id": "4.1",
        "label": "4.1 定语从句(Relative clauses)"
      },
      {
        "id": "4.2",
        "label": "4.2 名词性从句(Noun clauses)"
      },
      {
        "id": "4.3",
        "label": "4.3 状语从句(Adverbial clause)"
      }
    ]
  },
  {
    "id": "5",
    "label": "5. 特殊句式与词汇辨析(Special sentence structures and vocabulary analysis)",
    "children": [
      {
        "id": "5.1",
        "label": "5.1 倒装句(Inverted sentence)"
      },
      {
        "id": "5.2",
        "label": "5.2 强调句(Emphasis sentence)"
      },
      {
        "id": "5.3",
        "label": "5.3 反意疑问句(Tag questions)"
      },
      {
        "id": "5.4",
        "label": "5.4 词汇辨析(Vocabulary analysis)"
      }
    ]
  },
  {
    "id": "6",
    "label": "6. 对话补全（Dialogue Completion）"
  },
  {
    "id": "7",
    "label": "7. 综合词汇（Vocabulary）"
  },
  {
    "id": "8",
    "label": "8. 阅读理解（Reading Comprehension）",
    "children": [
      {
        "id": "8.1",
        "label": "8.1 第1段（Passage One）"
      },
      {
        "id": "8.2",
        "label": "8.2 第2段（Passage Two）"
      },
      {
        "id": "8.3",
        "label": "8.3 第3段（Passage Three）"
      },
      {
        "id": "8.4",
        "label": "8.4 第4段（Passage Four）"
      }
    ]
  },
  {
    "id": "9",
    "label": "9. 完形填空（Cloze Test）",
    "children": [
      {
        "id": "9.1",
        "label": "9.1 第1段 （Cloze Test One）"
      },
      {
        "id": "9.2",
        "label": "9.2 第2段（Cloze Test Two）"
      }
    ]
  }
];

export const SKILLS_BY_TOPIC: Record<string, string> = {
  "1": "主将从现：as soon as, when, if, unless 引导的时间、条件状语从句中，从句用一般现在时。\n關鍵時間狀語： last week 用過去時；since + 过去时间 → 主句用现在完成时。\nby the time + 过去时间 → 主句用过去完成时。\n判断主语是动作执行者还是承受者（被动语态）（如：混合物是被加熱 is heated）。",
  "2": "主动用 -ing，被动用 -ed。\n先发生用完成式 having done / having been done。\nsuggest / avoid / enjoy / regret + doing\ndecide / hope / want + to do\nnot 必须放在非谓语前面（如：not to do, not doing）。",
  "3": "It is high time… 后用一般过去时。\nwish / would rather 后动词时态向后推一個時態。\nsuggest / insist / order / demand 后 that 从句用 (should) + 动词原形。\nmust have done 表示对过去的推测。（肯定做過）\nneedn't have done 表示本不必做却做了。（本不必做但做了）\nwithout / but for / otherwise 属于含蓄虚拟。（本該做但沒做）",
  "4.1": "",
  "4.2": "名词性从句：\n賓語從句： 注意語序一律用陳述語序（主語+謂語）。\n同位語從句： 通常跟在 fact, news, idea, promise 等名詞後，解釋具體內容，引導詞 that 不充當成分且不省略。\nwhether 有 or not 时不能用 if\nthat 在同位语从句中不充当成分",
  "4.3": "状语从句：\nunless = if not (除非),\neven if 表让步(即使),\nso that 表目的(為了/以至於)。",
  "5.1": "倒装句：\nNever,Seldom, Hardly, No sooner, Not until, Little 等放句首 → 助动词提前（如 did I, have I）。",
  "5.3": "反意疑问句：\n前肯后否，前否后肯。注意 has to 對應 doesn't；must 表示推測時，對應後面的實際動詞。",
  "5.4": "词汇辨析：\n注意词性与固定搭配。",
  "6": "先判断“功能”再选答案。所有对话本质只有几种：邀请、请求、道歉、称赞、祝福、建议。先看说话目的，再找符合语气的固定表达。英语口语高度公式化，优先选自然表达，如 Would you mind → Of course not；道歉 → That’s all right；称赞 → Thank you；告别 → Nice talking with you, too。排除语法不完整或语气不自然的选项。情景必须匹配，回答必须对题，不要选逻辑不相干的话。",
  "7": "先判断词性，再判断搭配，最后看语义。大多数题考固定结构，如 make a mistake、have an effect on、take measures。注意形容词与副词区别，ed 表人的感受，ing 表事物特征。注意可数不可数名词区别，如 amount 与 number。多数题正确答案是最常见搭配。",
  "8": "主旨题看首段和尾段，答案必须概括全文而不是某个细节。细节题必须回原文定位关键词，不凭记忆作答。推理题不选文章未提及内容，也不选含有 always、never 等绝对词的选项。干扰项常见形式是偷换概念、夸大范围或偏离中心。",
  "9": "先通读全文理解逻辑，再逐空分析。优先考虑固定搭配和语境逻辑。看到常见搭配直接判断，如 succeed in、respond to、depend on。词义辨析必须结合上下文，不要单看单词。注意动词形式和介词搭配。遇到难题先跳过，保证整体连贯后再回填。"
};

export const PASSAGE_BY_TOPIC: Record<string, string> = {
  "8.1": "The Value of Hobbies\nMany people live busy lives filled with work, study, and family responsibilities. As a result, they often feel tired or stressed. One effective way to reduce stress is to develop a hobby. A hobby allows people to relax and focus on something enjoyable outside their daily duties.\nFor example, listening to music can calm the mind and improve mood. Gardening offers physical activity and a sense of achievement. Reading expands knowledge while helping people escape into different worlds. Even simple hobbies like walking or cooking can bring satisfaction.\nStudies show that people with hobbies tend to be happier and more productive. Taking short breaks to enjoy personal interests can actually improve work efficiency. Therefore, hobbies are not a waste of time but an important part of a balanced life.",
  "8.2": "Fast Food and Health\nFast food restaurants are popular because they provide quick and convenient meals. Many people choose fast food when they are busy or do not have time to cook. It is usually affordable and widely available.\nHowever, fast food often contains high levels of fat, salt, and sugar. Eating too much of it may lead to health problems such as obesity, heart disease, and diabetes. Some studies suggest that frequent consumption of fried food increases long-term health risks.\nThis does not mean people must completely avoid fast food. It can be acceptable occasionally, especially when time is limited. The key is moderation and balance. Choosing healthier options and maintaining regular exercise can reduce negative effects.",
  "8.3": "Technology and Modern Life\nSome people believe that technology has made life easier. They point out that we can now communicate instantly, shop online, and access information in seconds. Others argue that technology has also created new problems. For example, many people spend too much time on their phones and computers, which can reduce face-to-face communication and harm relationships.\nIn addition, technology can sometimes increase stress. Messages and notifications arrive constantly, making it difficult to relax. People may feel pressure to reply quickly, even during their personal time. However, technology is not entirely to blame. How we use it matters more than the technology itself.\nSetting limits, turning off unnecessary notifications, and taking breaks from screens can help people enjoy the benefits without suffering the disadvantages.",
  "8.4": "The Value and Challenges of Travel\nTravel can be a valuable experience. It allows people to see new places, learn about different cultures, and meet people with different backgrounds. Many travelers find that visiting a foreign country helps them become more open-minded. They begin to understand that there are many ways to live and solve problems.\nHowever, travel is not always easy. It can be expensive, and unexpected situations may occur. Flights may be delayed, luggage may be lost, and language barriers can cause confusion. These problems can make travelers feel frustrated or anxious.\nGood preparation can reduce these difficulties. Planning a budget, learning basic local expressions, and checking important documents in advance can make travel smoother and more enjoyable. With proper preparation, travel can be both educational and rewarding.",
  "9.1": "Many students believe that studying means reading the textbook again and again. However, research shows that active learning works better. After reading a chapter, students should try to 144 （） the main ideas without looking at the book. This process helps the brain 145 （）information more effectively.\nAnother useful method is self-testing. When students test themselves, they can quickly discover what they do not understand and focus on weak points. Taking short breaks is also important. Studying too long without rest makes learning less 146（）. When students explain ideas to others, they understand them more 147 （）. Students who stay up late often feel tired the next day, and their memory becomes 148 （）. Therefore, students should use active strategies rather than simply 149 （） time.\nClear goals help students stay 150 （） and organized. Without goals, learning becomes 151（）. In short, active learning methods are far more 152 （） than passive reading.",
  "9.2": "Mr. Brown worked in a small company. One day, his boss asked him to prepare an important report that could 153（）his promotion.\nHe worked late into the night. The next morning, he found that the file had 154（） Instead of blaming himself, he began rewriting it without 155（）. Finally, he completed the report just before the meeting started. His boss was impressed by his ability to solve problems 156（）.\nLater, Mr. Brown realized that unexpected problems are common. What really matters is how we 157（） to them. From that experience, he learned that keeping backups is extremely 159（）. Staying calm allows us to think more 158（）. In the end, success depends not only on ability but also on attitude and 160（）."
};

export const QUESTIONS: Question[] = [
  {
    "id": "1",
    "topicId": "1",
    "bigId": "1",
    "stem": "They will go home for winter vacation as soon as they ______ their exams.",
    "A": "have finished",
    "B": "finish",
    "C": "finished",
    "D": "was finishing",
    "answer": "B"
  },
  {
    "id": "2",
    "topicId": "1",
    "bigId": "1",
    "stem": "When the mixture ______, it will give off a powerful force.",
    "A": "will heat",
    "B": "will be heated",
    "C": "is heated",
    "D": "has heated",
    "answer": "C"
  },
  {
    "id": "3",
    "topicId": "1",
    "bigId": "1",
    "stem": "When you ______ this over with her, you should not see her any more.",
    "A": "talk",
    "B": "talked",
    "C": "will talk",
    "D": "talking",
    "answer": "A"
  },
  {
    "id": "4",
    "topicId": "1",
    "bigId": "1",
    "stem": "You ______ two classes just last week.",
    "A": "missed",
    "B": "would miss",
    "C": "had missed",
    "D": "have missed",
    "answer": "A"
  },
  {
    "id": "5",
    "topicId": "1",
    "bigId": "1",
    "stem": "I fell and hurt myself while I ______ tennis.",
    "A": "was playing",
    "B": "am playing",
    "C": "play",
    "D": "played",
    "answer": "A"
  },
  {
    "id": "6",
    "topicId": "1",
    "bigId": "1",
    "stem": "Up to now, the program ______ thousands of people.",
    "A": "helps",
    "B": "helped",
    "C": "has helped",
    "D": "had helped",
    "answer": "C"
  },
  {
    "id": "7",
    "topicId": "1",
    "bigId": "1",
    "stem": "By the time he was twelve, he ______ himself how to play the piano.",
    "A": "taught",
    "B": "has taught",
    "C": "had taught",
    "D": "would teach",
    "answer": "C"
  },
  {
    "id": "8",
    "topicId": "1",
    "bigId": "1",
    "stem": "The children ______ since they came back from school.",
    "A": "are playing",
    "B": "played",
    "C": "have been playing",
    "D": "play",
    "answer": "C"
  },
  {
    "id": "9",
    "topicId": "2",
    "bigId": "2",
    "stem": "______ anything about the accident, he went to work as well.",
    "A": "Not know",
    "B": "Know not",
    "C": "Knowing not",
    "D": "Not knowing",
    "answer": "D"
  },
  {
    "id": "10",
    "topicId": "2",
    "bigId": "2",
    "stem": "______ the programme, they have to stay there for another two weeks.",
    "A": "Not completing",
    "B": "Not completed",
    "C": "Not having completed",
    "D": "Having not completed",
    "answer": "C"
  },
  {
    "id": "11",
    "topicId": "2",
    "bigId": "2",
    "stem": "______ a reply, he decided to write again.",
    "A": "Not receiving",
    "B": "Receiving not",
    "C": "Not having received",
    "D": "Having not received",
    "answer": "C"
  },
  {
    "id": "12",
    "topicId": "2",
    "bigId": "2",
    "stem": "Tony was very unhappy for ______ to the party.",
    "A": "having not been invited",
    "B": "not having invited",
    "C": "having not invited",
    "D": "not having been invited",
    "answer": "D"
  },
  {
    "id": "13",
    "topicId": "2",
    "bigId": "2",
    "stem": "Victor apologized for ______ to inform me of the change in the plan.",
    "A": "his being not able",
    "B": "him not to be able",
    "C": "his not being able",
    "D": "him to be not able",
    "answer": "C"
  },
  {
    "id": "14",
    "topicId": "2",
    "bigId": "2",
    "stem": "The patient was warned ______ oily food after the operation.",
    "A": "to eat not",
    "B": "eating not",
    "C": "not to eat",
    "D": "not eating",
    "answer": "C"
  },
  {
    "id": "15",
    "topicId": "2",
    "bigId": "2",
    "stem": "I don't regret ______ her what I thought.",
    "A": "tell",
    "B": "to tell",
    "C": "telling",
    "D": "told",
    "answer": "C"
  },
  {
    "id": "16",
    "topicId": "2",
    "bigId": "2",
    "stem": "It is difficult to get used to ______ in a different culture.",
    "A": "live",
    "B": "living",
    "C": "be living",
    "D": "having lived",
    "answer": "B"
  },
  {
    "id": "17",
    "topicId": "3",
    "bigId": "3",
    "stem": "Don’t you think it is time you ______ smoking?",
    "A": "give up",
    "B": "gave up",
    "C": "would give up",
    "D": "should give up",
    "answer": "B"
  },
  {
    "id": "18",
    "topicId": "3",
    "bigId": "3",
    "stem": "I would rather you ______ those important documents with you.",
    "A": "not take",
    "B": "didn’t take",
    "C": "won’t take",
    "D": "don’t take",
    "answer": "B"
  },
  {
    "id": "19",
    "topicId": "3",
    "bigId": "3",
    "stem": "The doctor suggested that he ______ a rest.",
    "A": "had",
    "B": "have",
    "C": "has",
    "D": "would have",
    "answer": "B"
  },
  {
    "id": "20",
    "topicId": "3",
    "bigId": "3",
    "stem": "It’s urgent that a meeting ______ before the final decision is made.",
    "A": "will be arranged",
    "B": "must be arranged",
    "C": "be arranged",
    "D": "would be arranged",
    "answer": "C"
  },
  {
    "id": "21",
    "topicId": "3",
    "bigId": "3",
    "stem": "He ______ his umbrella, for it is raining and he is getting wet.",
    "A": "must have forgotten",
    "B": "must forget",
    "C": "should have forgotten",
    "D": "ought to forget",
    "answer": "A"
  },
  {
    "id": "22",
    "topicId": "3",
    "bigId": "3",
    "stem": "You ______ him the news; he knew it already.",
    "A": "needn't tell",
    "B": "needn't have told",
    "C": "mustn't tell",
    "D": "shouldn't tell",
    "answer": "B"
  },
  {
    "id": "23",
    "topicId": "3",
    "bigId": "3",
    "stem": "Without your help, we ______ so much.",
    "A": "didn’t achieve",
    "B": "would not have achieved",
    "C": "will not achieve",
    "D": "don’t achieve",
    "answer": "B"
  },
  {
    "id": "24",
    "topicId": "3",
    "bigId": "3",
    "stem": "Without electricity human life ______ quite different today.",
    "A": "is",
    "B": "will be",
    "C": "would have been",
    "D": "would be",
    "answer": "D"
  },
  {
    "id": "25",
    "topicId": "3",
    "bigId": "3",
    "stem": "But for the rain, we ______ a nice holiday.",
    "A": "should have",
    "B": "would have had",
    "C": "would have",
    "D": "will have had",
    "answer": "B"
  },
  {
    "id": "26",
    "topicId": "3",
    "bigId": "3",
    "stem": "He was very busy yesterday; otherwise he ______ to the meeting.",
    "A": "would have come",
    "B": "would come",
    "C": "could come",
    "D": "had come",
    "answer": "A"
  },
  {
    "id": "27",
    "topicId": "3",
    "bigId": "3",
    "stem": "We didn’t know his telephone number; otherwise we ______ him.",
    "A": "had telephoned",
    "B": "must have telephoned",
    "C": "would telephone",
    "D": "would have telephoned",
    "answer": "D"
  },
  {
    "id": "28",
    "topicId": "3",
    "bigId": "3",
    "stem": "If you ______ that late movie last night, you wouldn’t be so sleepy.",
    "A": "hadn’t watched",
    "B": "haven’t watched",
    "C": "wouldn’t have watched",
    "D": "didn’t watch",
    "answer": "A"
  },
  {
    "id": "29",
    "topicId": "3",
    "bigId": "3",
    "stem": "______ the advice of his friends, he would not have suffered such a heavy loss.",
    "A": "If he took",
    "B": "If he should take",
    "C": "Were he to take",
    "D": "Had he taken",
    "answer": "D"
  },
  {
    "id": "30",
    "topicId": "3",
    "bigId": "3",
    "stem": "I would have told him the answer had it been possible, but I ______ so busy then.",
    "A": "am",
    "B": "were",
    "C": "was",
    "D": "would be",
    "answer": "C"
  },
  {
    "id": "31",
    "topicId": "4.1",
    "bigId": "4",
    "stem": "The scientist ______ name is known all over the world will come to our school.",
    "A": "who",
    "B": "whom",
    "C": "whose",
    "D": "that",
    "answer": "C"
  },
  {
    "id": "32",
    "topicId": "4.1",
    "bigId": "4",
    "stem": "This is the very book ______ I have been looking for.",
    "A": "that",
    "B": "which",
    "C": "what",
    "D": "who",
    "answer": "A"
  },
  {
    "id": "33",
    "topicId": "4.1",
    "bigId": "4",
    "stem": "I’ll never forget the days ______ we spent together in the countryside.",
    "A": "which",
    "B": "when",
    "C": "what",
    "D": "who",
    "answer": "A"
  },
  {
    "id": "34",
    "topicId": "4.1",
    "bigId": "4",
    "stem": "The factory ______ we visited last week is a large one.",
    "A": "where",
    "B": "which",
    "C": "what",
    "D": "in which",
    "answer": "B"
  },
  {
    "id": "35",
    "topicId": "4.1",
    "bigId": "4",
    "stem": "This is the village ______ I used to live ten years ago.",
    "A": "which",
    "B": "where",
    "C": "that",
    "D": "when",
    "answer": "B"
  },
  {
    "id": "36",
    "topicId": "4.1",
    "bigId": "4",
    "stem": "Is this the museum ______ you visited the other day?",
    "A": "that",
    "B": "where",
    "C": "in which",
    "D": "what",
    "answer": "A"
  },
  {
    "id": "37",
    "topicId": "4.1",
    "bigId": "4",
    "stem": "The United States is composed of fifty states, two of ______ are separated from the others.",
    "A": "them",
    "B": "that",
    "C": "which",
    "D": "those",
    "answer": "C"
  },
  {
    "id": "38",
    "topicId": "4.2",
    "bigId": "4",
    "stem": "I don't know ______ he will come or not.",
    "A": "whether",
    "B": "if",
    "C": "that",
    "D": "when",
    "answer": "A"
  },
  {
    "id": "39",
    "topicId": "4.2",
    "bigId": "4",
    "stem": "The news ______ our team won the match is true.",
    "A": "which",
    "B": "that",
    "C": "what",
    "D": "whether",
    "answer": "B"
  },
  {
    "id": "40",
    "topicId": "4.2",
    "bigId": "4",
    "stem": "______ we need is more time.",
    "A": "What",
    "B": "That",
    "C": "Which",
    "D": "Who",
    "answer": "A"
  },
  {
    "id": "41",
    "topicId": "4.2",
    "bigId": "4",
    "stem": "Could you tell me ______?",
    "A": "where is the post office",
    "B": "where the post office is",
    "C": "is where the post office",
    "D": "the post office is where",
    "answer": "B"
  },
  {
    "id": "42",
    "topicId": "4.2",
    "bigId": "4",
    "stem": "It is known to all ______ the earth moves around the sun.",
    "A": "that",
    "B": "what",
    "C": "if",
    "D": "whether",
    "answer": "A"
  },
  {
    "id": "43",
    "topicId": "4.2",
    "bigId": "4",
    "stem": "______ he said at the meeting surprised us all.",
    "A": "That",
    "B": "What",
    "C": "Which",
    "D": "Who",
    "answer": "B"
  },
  {
    "id": "44",
    "topicId": "4.3",
    "bigId": "4",
    "stem": "I won’t go to the party ______ I am invited.",
    "A": "even if",
    "B": "unless",
    "C": "as if",
    "D": "because",
    "answer": "B"
  },
  {
    "id": "45",
    "topicId": "4.3",
    "bigId": "4",
    "stem": "Speak louder ______ everyone can hear you.",
    "A": "so that",
    "B": "in order",
    "C": "as if",
    "D": "since",
    "answer": "A"
  },
  {
    "id": "46",
    "topicId": "4.3",
    "bigId": "4",
    "stem": "______ you go, I will follow you.",
    "A": "Wherever",
    "B": "Whatever",
    "C": "However",
    "D": "Whichever",
    "answer": "A"
  },
  {
    "id": "47",
    "topicId": "4.3",
    "bigId": "4",
    "stem": "It was ______ a cold day that no one wanted to go out.",
    "A": "so",
    "B": "such",
    "C": "very",
    "D": "too",
    "answer": "B"
  },
  {
    "id": "48",
    "topicId": "4.3",
    "bigId": "4",
    "stem": "Young ______ he is, he knows what is the right thing to do.",
    "A": "that",
    "B": "as",
    "C": "although",
    "D": "however",
    "answer": "B"
  },
  {
    "id": "49",
    "topicId": "4.3",
    "bigId": "4",
    "stem": "______ you disagree with her, her idea is still worth considering.",
    "A": "Even if",
    "B": "If only",
    "C": "Instead of",
    "D": "Despite",
    "answer": "A"
  },
  {
    "id": "50",
    "topicId": "5.1",
    "bigId": "5",
    "stem": "Never ______ such a beautiful place before.",
    "A": "I have seen",
    "B": "have I seen",
    "C": "I saw",
    "D": "did I see",
    "answer": "B"
  },
  {
    "id": "51",
    "topicId": "5.1",
    "bigId": "5",
    "stem": "Not until the teacher came ______ to do the exercise.",
    "A": "the students started",
    "B": "did the students start",
    "C": "started the students",
    "D": "the students start",
    "answer": "B"
  },
  {
    "id": "52",
    "topicId": "5.1",
    "bigId": "5",
    "stem": "Hardly ______ his speech when the audience started cheering.",
    "A": "had he finished",
    "B": "he had finished",
    "C": "did he finish",
    "D": "he finished",
    "answer": "A"
  },
  {
    "id": "53",
    "topicId": "5.1",
    "bigId": "5",
    "stem": "Only in this way ______ solve the problem.",
    "A": "can we",
    "B": "we can",
    "C": "did we",
    "D": "we did",
    "answer": "A"
  },
  {
    "id": "54",
    "topicId": "5.1",
    "bigId": "5",
    "stem": "Little ______ the importance of wearing seat belts while driving.",
    "A": "they realize",
    "B": "they do realize",
    "C": "realize they",
    "D": "do they realize",
    "answer": "D"
  },
  {
    "id": "55",
    "topicId": "5.1",
    "bigId": "5",
    "stem": "It was ______ she said that made me angry.",
    "A": "what",
    "B": "that",
    "C": "which",
    "D": "who",
    "answer": "A"
  },
  {
    "id": "56",
    "topicId": "5.1",
    "bigId": "5",
    "stem": "It was in the street ______ I met my old friend.",
    "A": "that",
    "B": "which",
    "C": "where",
    "D": "when",
    "answer": "A"
  },
  {
    "id": "57",
    "topicId": "5.1",
    "bigId": "5",
    "stem": "It was not until she arrived in class ______ realized she had forgotten her book.",
    "A": "and she",
    "B": "when",
    "C": "she",
    "D": "that she",
    "answer": "D"
  },
  {
    "id": "58",
    "topicId": "5.3",
    "bigId": "5",
    "stem": "He has to stay at home, ______?",
    "A": "hasn't he",
    "B": "doesn't he",
    "C": "didn't he",
    "D": "isn't he",
    "answer": "B"
  },
  {
    "id": "59",
    "topicId": "5.3",
    "bigId": "5",
    "stem": "You must have finished your work, ______?",
    "A": "haven't you",
    "B": "mustn't you",
    "C": "didn't you",
    "D": "don't you",
    "answer": "A"
  },
  {
    "id": "60",
    "topicId": "5.3",
    "bigId": "5",
    "stem": "There won’t be any concert this Saturday evening, ______?",
    "A": "will there not",
    "B": "will there",
    "C": "is there",
    "D": "will it be",
    "answer": "B"
  },
  {
    "id": "61",
    "topicId": "5.3",
    "bigId": "5",
    "stem": "She scarcely cares for anything, ______?",
    "A": "doesn’t she",
    "B": "does she",
    "C": "is she",
    "D": "isn’t she",
    "answer": "B"
  },
  {
    "id": "62",
    "topicId": "5.3",
    "bigId": "5",
    "stem": "Don’t forget to write to me, ______?",
    "A": "do you",
    "B": "won’t you",
    "C": "are you",
    "D": "will you",
    "answer": "D"
  },
  {
    "id": "63",
    "topicId": "5.4",
    "bigId": "5",
    "stem": "I want to make an ______ with the dentist.",
    "A": "appointment",
    "B": "agreement",
    "C": "offer",
    "D": "arrangement",
    "answer": "A"
  },
  {
    "id": "64",
    "topicId": "5.4",
    "bigId": "5",
    "stem": "The news was very ______.",
    "A": "disappointed",
    "B": "disappointing",
    "C": "disappoint",
    "D": "disappointment",
    "answer": "B"
  },
  {
    "id": "65",
    "topicId": "5.4",
    "bigId": "5",
    "stem": "The situation is ______; we should do something.",
    "A": "serious",
    "B": "seriously",
    "C": "series",
    "D": "serial",
    "answer": "A"
  },
  {
    "id": "66",
    "topicId": "5.4",
    "bigId": "5",
    "stem": "One car went too fast and ______ missed hitting another car.",
    "A": "completely",
    "B": "greatly",
    "C": "narrowly",
    "D": "little",
    "answer": "C"
  },
  {
    "id": "67",
    "topicId": "5.4",
    "bigId": "5",
    "stem": "He was ______ an honest man that everybody trusted him.",
    "A": "so",
    "B": "as",
    "C": "such",
    "D": "very",
    "answer": "C"
  },
  {
    "id": "68",
    "topicId": "5.4",
    "bigId": "5",
    "stem": "He was ______ fat that he couldn’t get through the door.",
    "A": "so",
    "B": "how",
    "C": "such",
    "D": "much",
    "answer": "A"
  },
  {
    "id": "69",
    "topicId": "6",
    "bigId": "6",
    "stem": "Jack: Can I help with your luggage?\nLinda: ______",
    "A": "No, you'd better not. Thank you anyway.",
    "B": "No, not necessary. Thank you anyway.",
    "C": "No, thanks. I can manage it.",
    "D": "No, please. I can do.",
    "answer": "C"
  },
  {
    "id": "70",
    "topicId": "6",
    "bigId": "6",
    "stem": "Customer: ______\nReceptionist: Certainly, do you have a reservation?\nCustomer: Yes, the name is Collins.",
    "A": "I'd like to rest here, please.",
    "B": "I'd like to check in, please.",
    "C": "I'd like to rent a room, please.",
    "D": "I'd like to stay in, please.",
    "answer": "B"
  },
  {
    "id": "71",
    "topicId": "6",
    "bigId": "6",
    "stem": "David: We've got some tickets for an opera tonight. Would you like to join us?\nMike: ______",
    "A": "Yes, I’d love to.",
    "B": "No, I don’t.",
    "C": "It’s too much.",
    "D": "It depends.",
    "answer": "A"
  },
  {
    "id": "72",
    "topicId": "6",
    "bigId": "6",
    "stem": "A man: Excuse me, but could you tell me the way to the Park?\nA woman: ______ You may ask the policeman over there for help.",
    "A": "Yes, you go ahead, and I’ll follow you.",
    "B": "Sorry, but I'm a stranger here myself.",
    "C": "Well, walk fast, and you'll soon get there.",
    "D": "OK, it's not far from here.",
    "answer": "B"
  },
  {
    "id": "73",
    "topicId": "6",
    "bigId": "6",
    "stem": "Maria: Are you satisfied with what she has done?\nNancy: Not in the least. It couldn't be ______.",
    "A": "so bad",
    "B": "much better",
    "C": "so well",
    "D": "any worse",
    "answer": "D"
  },
  {
    "id": "74",
    "topicId": "6",
    "bigId": "6",
    "stem": "John: The meeting has begun and I doubt if he will come.\nLarry: ______ He'll speak at the meeting.",
    "A": "He's likely to come.",
    "B": "He is going to come.",
    "C": "He will come.",
    "D": "He is sure to come.",
    "answer": "D"
  },
  {
    "id": "75",
    "topicId": "6",
    "bigId": "6",
    "stem": "Anne: My husband and I are going abroad tomorrow.\nEmily: ______",
    "A": "Have a good journey.",
    "B": "Cheers.",
    "C": "Good luck.",
    "D": "Long time no see.",
    "answer": "A"
  },
  {
    "id": "76",
    "topicId": "6",
    "bigId": "6",
    "stem": "Joan: Do you mind opening the window?\nNancy: ______",
    "A": "Sorry, I don't mind.",
    "B": "Sure, go ahead.",
    "C": "No, please don't.",
    "D": "No, but I'm feeling a bit cold.",
    "answer": "D"
  },
  {
    "id": "77",
    "topicId": "6",
    "bigId": "6",
    "stem": "Sally: You look great in this red dress!\nJennifer: ______",
    "A": "No, it's not. Yours looks better.",
    "B": "No, I don't like it very much.",
    "C": "I quite agree with you.",
    "D": "Thank you. It's my favorite.",
    "answer": "D"
  },
  {
    "id": "78",
    "topicId": "6",
    "bigId": "6",
    "stem": "Louise: Would you like to go to a party this Saturday?\nJackie: ______ What kind of party?",
    "A": "Feels great.",
    "B": "Sounds good.",
    "C": "Looks nice.",
    "D": "Seems OK.",
    "answer": "B"
  },
  {
    "id": "79",
    "topicId": "6",
    "bigId": "6",
    "stem": "A: You look worried. What’s wrong?\nB: ______",
    "A": "Nothing, I’m fine.",
    "B": "I can’t decide which course to choose.",
    "C": "I like it very much.",
    "D": "That’s a good idea.",
    "answer": "B"
  },
  {
    "id": "80",
    "topicId": "6",
    "bigId": "6",
    "stem": "A: Would you mind if I opened the window?\nB: ______",
    "A": "Of course not. Go ahead.",
    "B": "Yes, please.",
    "C": "I’m afraid you can’t.",
    "D": "It doesn’t matter, I won’t.",
    "answer": "A"
  },
  {
    "id": "81",
    "topicId": "6",
    "bigId": "6",
    "stem": "A: I’m sorry I’m late. The traffic was terrible.\nB: ______",
    "A": "That’s all right.",
    "B": "You’re welcome.",
    "C": "It’s my pleasure.",
    "D": "Never mind, I don’t care.",
    "answer": "A"
  },
  {
    "id": "82",
    "topicId": "6",
    "bigId": "6",
    "stem": "A: Could you take a photo of me?\nB: ______",
    "A": "With pleasure.",
    "B": "You’d better not.",
    "C": "I’m sorry to hear that.",
    "D": "It’s none of my business.",
    "answer": "A"
  },
  {
    "id": "83",
    "topicId": "6",
    "bigId": "6",
    "stem": "A: I’ve got to go now. Nice talking with you.\nB: ______",
    "A": "Nice to meet you, too.",
    "B": "Nice talking with you, too.",
    "C": "See you yesterday.",
    "D": "You must be kidding.",
    "answer": "B"
  },
  {
    "id": "84",
    "topicId": "7",
    "bigId": "7",
    "stem": "The company plans to ______ a new product next month.",
    "A": "launch",
    "B": "explode",
    "C": "invent",
    "D": "remove",
    "answer": "A"
  },
  {
    "id": "85",
    "topicId": "7",
    "bigId": "7",
    "stem": "She made a great ______ in her speech by forgetting the key point.",
    "A": "progress",
    "B": "mistake",
    "C": "decision",
    "D": "improvement",
    "answer": "B"
  },
  {
    "id": "86",
    "topicId": "7",
    "bigId": "7",
    "stem": "We were deeply ______ by his kindness.",
    "A": "impress",
    "B": "impressive",
    "C": "impressed",
    "D": "impression",
    "answer": "C"
  },
  {
    "id": "87",
    "topicId": "7",
    "bigId": "7",
    "stem": "The manager asked the employees to arrive ______ on time.",
    "A": "exactly",
    "B": "exact",
    "C": "exactness",
    "D": "exacted",
    "answer": "A"
  },
  {
    "id": "88",
    "topicId": "7",
    "bigId": "7",
    "stem": "He has a strong sense of ______ and always keeps his promises.",
    "A": "responsibility",
    "B": "responsible",
    "C": "respond",
    "D": "response",
    "answer": "A"
  },
  {
    "id": "89",
    "topicId": "7",
    "bigId": "7",
    "stem": "The weather is so hot that we can hardly ______ it.",
    "A": "bear",
    "B": "carry",
    "C": "suffer",
    "D": "manage",
    "answer": "A"
  },
  {
    "id": "90",
    "topicId": "7",
    "bigId": "7",
    "stem": "She is very ______ about her appearance and dresses carefully.",
    "A": "conscious",
    "B": "conscience",
    "C": "consciously",
    "D": "unconscious",
    "answer": "A"
  },
  {
    "id": "91",
    "topicId": "7",
    "bigId": "7",
    "stem": "The teacher explained the problem clearly to avoid any ______.",
    "A": "confusion",
    "B": "confuse",
    "C": "confused",
    "D": "confusing",
    "answer": "A"
  },
  {
    "id": "92",
    "topicId": "7",
    "bigId": "7",
    "stem": "He finally ______ that he had made a serious mistake.",
    "A": "admitted",
    "B": "allowed",
    "C": "avoided",
    "D": "denied",
    "answer": "A"
  },
  {
    "id": "93",
    "topicId": "7",
    "bigId": "7",
    "stem": "The meeting was ______ because the manager was ill.",
    "A": "put off",
    "B": "put up",
    "C": "put out",
    "D": "put down",
    "answer": "A"
  },
  {
    "id": "94",
    "topicId": "7",
    "bigId": "7",
    "stem": "She succeeded ______ passing the exam after working hard.",
    "A": "in",
    "B": "at",
    "C": "for",
    "D": "with",
    "answer": "A"
  },
  {
    "id": "95",
    "topicId": "7",
    "bigId": "7",
    "stem": "It is important to maintain a positive ______ toward life.",
    "A": "attitude",
    "B": "altitude",
    "C": "attention",
    "D": "attempt",
    "answer": "A"
  },
  {
    "id": "96",
    "topicId": "7",
    "bigId": "7",
    "stem": "The government has taken measures to protect the natural ______.",
    "A": "environment",
    "B": "equipment",
    "C": "evidence",
    "D": "entrance",
    "answer": "A"
  },
  {
    "id": "97",
    "topicId": "7",
    "bigId": "7",
    "stem": "His explanation sounded reasonable, but I still felt ______.",
    "A": "doubtful",
    "B": "doubt",
    "C": "doubtfully",
    "D": "doubting",
    "answer": "A"
  },
  {
    "id": "98",
    "topicId": "7",
    "bigId": "7",
    "stem": "He was late because of heavy traffic, but he gave no ______.",
    "A": "excuse",
    "B": "cause",
    "C": "reason",
    "D": "apology",
    "answer": "A"
  },
  {
    "id": "99",
    "topicId": "7",
    "bigId": "7",
    "stem": "The research results are based on scientific ______.",
    "A": "evidence",
    "B": "event",
    "C": "accident",
    "D": "effect",
    "answer": "A"
  },
  {
    "id": "100",
    "topicId": "7",
    "bigId": "7",
    "stem": "She has the ability to work both ______ and efficiently.",
    "A": "independently",
    "B": "independent",
    "C": "independence",
    "D": "depend",
    "answer": "A"
  },
  {
    "id": "101",
    "topicId": "7",
    "bigId": "7",
    "stem": "The book provides useful ______ for beginners.",
    "A": "guide",
    "B": "guidance",
    "C": "guiding",
    "D": "guided",
    "answer": "B"
  },
  {
    "id": "102",
    "topicId": "7",
    "bigId": "7",
    "stem": "The factory produces a large ______ of goods every year.",
    "A": "amount",
    "B": "number",
    "C": "quantity",
    "D": "deal",
    "answer": "C"
  },
  {
    "id": "103",
    "topicId": "7",
    "bigId": "7",
    "stem": "The doctor advised him to take the medicine ______.",
    "A": "regularly",
    "B": "regular",
    "C": "regulation",
    "D": "regulate",
    "answer": "A"
  },
  {
    "id": "104",
    "topicId": "7",
    "bigId": "7",
    "stem": "He refused to ______ his opinion even when everyone disagreed.",
    "A": "change",
    "B": "charge",
    "C": "choose",
    "D": "check",
    "answer": "A"
  },
  {
    "id": "105",
    "topicId": "7",
    "bigId": "7",
    "stem": "The decision will have a major ______ on our future plans.",
    "A": "effect",
    "B": "effort",
    "C": "event",
    "D": "affect",
    "answer": "A"
  },
  {
    "id": "106",
    "topicId": "7",
    "bigId": "7",
    "stem": "She was ______ to find that her wallet was missing.",
    "A": "shocked",
    "B": "shock",
    "C": "shocking",
    "D": "shocks",
    "answer": "A"
  },
  {
    "id": "107",
    "topicId": "7",
    "bigId": "7",
    "stem": "We should ______ the problem carefully before making a choice.",
    "A": "consider",
    "B": "control",
    "C": "contain",
    "D": "connect",
    "answer": "A"
  },
  {
    "id": "108",
    "topicId": "7",
    "bigId": "7",
    "stem": "The speaker’s explanation was so clear that it left no ______.",
    "A": "doubt",
    "B": "idea",
    "C": "mind",
    "D": "hope",
    "answer": "A"
  },
  {
    "id": "109",
    "topicId": "7",
    "bigId": "7",
    "stem": "The new rule is ______ to all students, not just freshmen.",
    "A": "applied",
    "B": "available",
    "C": "acceptable",
    "D": "applicable",
    "answer": "D"
  },
  {
    "id": "110",
    "topicId": "7",
    "bigId": "7",
    "stem": "The team worked hard and finally ______ their goal.",
    "A": "achieved",
    "B": "received",
    "C": "believed",
    "D": "relieved",
    "answer": "A"
  },
  {
    "id": "111",
    "topicId": "7",
    "bigId": "7",
    "stem": "The city has taken steps to reduce air ______.",
    "A": "pollution",
    "B": "population",
    "C": "position",
    "D": "possession",
    "answer": "A"
  },
  {
    "id": "112",
    "topicId": "7",
    "bigId": "7",
    "stem": "He gave a ______ answer, so nobody understood him.",
    "A": "vague",
    "B": "sharp",
    "C": "plain",
    "D": "equal",
    "answer": "A"
  },
  {
    "id": "113",
    "topicId": "7",
    "bigId": "7",
    "stem": "Please keep me ______ of any changes.",
    "A": "informed",
    "B": "formed",
    "C": "performed",
    "D": "confirmed",
    "answer": "A"
  },
  {
    "id": "114",
    "topicId": "7",
    "bigId": "7",
    "stem": "Her success was not luck; it was the result of long-term ______.",
    "A": "effort",
    "B": "error",
    "C": "essay",
    "D": "escape",
    "answer": "A"
  },
  {
    "id": "115",
    "topicId": "7",
    "bigId": "7",
    "stem": "The teacher asked us to ______ our homework on time.",
    "A": "submit",
    "B": "support",
    "C": "suspect",
    "D": "supply",
    "answer": "A"
  },
  {
    "id": "116",
    "topicId": "7",
    "bigId": "7",
    "stem": "The hotel provides free breakfast as an ______ service.",
    "A": "additional",
    "B": "traditional",
    "C": "personal",
    "D": "careful",
    "answer": "A"
  },
  {
    "id": "117",
    "topicId": "7",
    "bigId": "7",
    "stem": "He is ______ for the project and must report the progress weekly.",
    "A": "responsible",
    "B": "response",
    "C": "respond",
    "D": "responsibility",
    "answer": "A"
  },
  {
    "id": "118",
    "topicId": "7",
    "bigId": "7",
    "stem": "We must find a ______ solution that can work for everyone.",
    "A": "practical",
    "B": "plastic",
    "C": "passive",
    "D": "polite",
    "answer": "A"
  },
  {
    "id": "119",
    "topicId": "7",
    "bigId": "7",
    "stem": "The machine stopped working because of a small ______.",
    "A": "fault",
    "B": "fall",
    "C": "fear",
    "D": "feel",
    "answer": "A"
  },
  {
    "id": "120",
    "topicId": "7",
    "bigId": "7",
    "stem": "She spoke softly in order not to ______ the baby.",
    "A": "disturb",
    "B": "destroy",
    "C": "discover",
    "D": "decide",
    "answer": "A"
  },
  {
    "id": "121",
    "topicId": "7",
    "bigId": "7",
    "stem": "The meeting was ______ due to the storm.",
    "A": "canceled",
    "B": "caused",
    "C": "caught",
    "D": "carried",
    "answer": "A"
  },
  {
    "id": "122",
    "topicId": "7",
    "bigId": "7",
    "stem": "He ______ his success to hard work and good habits.",
    "A": "attributed",
    "B": "attended",
    "C": "attempted",
    "D": "attached",
    "answer": "A"
  },
  {
    "id": "123",
    "topicId": "7",
    "bigId": "7",
    "stem": "The job requires good communication ______.",
    "A": "skills",
    "B": "scales",
    "C": "scores",
    "D": "schools",
    "answer": "A"
  },
  {
    "id": "124",
    "topicId": "8.1",
    "bigId": "8",
    "stem": "What is one major benefit of having a hobby?",
    "A": "It increases income.",
    "B": "It reduces stress.",
    "C": "It replaces work.",
    "D": "It saves money.",
    "answer": "B"
  },
  {
    "id": "125",
    "topicId": "8.1",
    "bigId": "8",
    "stem": "According to the passage, gardening helps people by ______.",
    "A": "teaching them music",
    "B": "increasing their salary",
    "C": "providing exercise and achievement",
    "D": "helping them avoid responsibilities",
    "answer": "C"
  },
  {
    "id": "126",
    "topicId": "8.1",
    "bigId": "8",
    "stem": "The writer mentions reading because it ______.",
    "A": "improves memory only",
    "B": "makes people rich",
    "C": "allows people to relax and learn",
    "D": "replaces physical exercise",
    "answer": "C"
  },
  {
    "id": "127",
    "topicId": "8.1",
    "bigId": "8",
    "stem": "People with hobbies are usually ______.",
    "A": "more stressed",
    "B": "less productive",
    "C": "happier and more productive",
    "D": "too busy to work",
    "answer": "C"
  },
  {
    "id": "128",
    "topicId": "8.1",
    "bigId": "8",
    "stem": "The main idea of the passage is that hobbies ______.",
    "A": "should replace work",
    "B": "are unnecessary",
    "C": "help balance life",
    "D": "are only for children",
    "answer": "C"
  },
  {
    "id": "129",
    "topicId": "8.2",
    "bigId": "8",
    "stem": "Why do many people choose fast food?",
    "A": "It is expensive.",
    "B": "It is healthy.",
    "C": "It is convenient and quick.",
    "D": "It is rare.",
    "answer": "C"
  },
  {
    "id": "130",
    "topicId": "8.2",
    "bigId": "8",
    "stem": "Fast food may cause health problems because it is often ______.",
    "A": "freshly cooked",
    "B": "low in sugar",
    "C": "high in fat and salt",
    "D": "full of vitamins",
    "answer": "C"
  },
  {
    "id": "131",
    "topicId": "8.2",
    "bigId": "8",
    "stem": "According to the passage, eating too much fried food may ______.",
    "A": "improve health",
    "B": "increase health risks",
    "C": "reduce weight",
    "D": "prevent disease",
    "answer": "B"
  },
  {
    "id": "132",
    "topicId": "8.2",
    "bigId": "8",
    "stem": "The writer suggests that fast food should be ______.",
    "A": "eaten every day",
    "B": "completely avoided",
    "C": "eaten in moderation",
    "D": "replaced by snacks",
    "answer": "C"
  },
  {
    "id": "133",
    "topicId": "8.2",
    "bigId": "8",
    "stem": "The main idea of the passage is that fast food ______.",
    "A": "is always harmful",
    "B": "should never be eaten",
    "C": "can be acceptable if controlled",
    "D": "is better than home cooking",
    "answer": "C"
  },
  {
    "id": "134",
    "topicId": "8.3",
    "bigId": "8",
    "stem": "The passage mainly discusses ______.",
    "A": "why people dislike online shopping",
    "B": "the advantages and disadvantages of technology",
    "C": "how to build better phones",
    "D": "why relationships are always difficult",
    "answer": "B"
  },
  {
    "id": "135",
    "topicId": "8.3",
    "bigId": "8",
    "stem": "One problem mentioned is that technology may ______.",
    "A": "stop people from learning",
    "B": "reduce face-to-face communication",
    "C": "make shopping impossible",
    "D": "increase the cost of living",
    "answer": "B"
  },
  {
    "id": "136",
    "topicId": "8.3",
    "bigId": "8",
    "stem": "According to the passage, notifications can ______.",
    "A": "help people sleep better",
    "B": "make people relax more",
    "C": "increase stress",
    "D": "reduce work efficiency to zero",
    "answer": "C"
  },
  {
    "id": "137",
    "topicId": "8.3",
    "bigId": "8",
    "stem": "The writer suggests that the key issue is ______.",
    "A": "technology itself is always harmful",
    "B": "technology should be banned",
    "C": "how people use technology",
    "D": "people should reply faster",
    "answer": "C"
  },
  {
    "id": "138",
    "topicId": "8.3",
    "bigId": "8",
    "stem": "A good way to reduce the disadvantages is to ______.",
    "A": "buy a more expensive phone",
    "B": "never use the internet",
    "C": "set limits and take breaks",
    "D": "reply to every message immediately",
    "answer": "C"
  },
  {
    "id": "139",
    "topicId": "8.4",
    "bigId": "8",
    "stem": "One benefit of travel mentioned in the passage is that it can make people ______.",
    "A": "more open-minded",
    "B": "more impatient",
    "C": "less interested in culture",
    "D": "afraid of meeting others",
    "answer": "A"
  },
  {
    "id": "140",
    "topicId": "8.4",
    "bigId": "8",
    "stem": "According to the passage, travelers may learn that ______.",
    "A": "there is only one correct way to live",
    "B": "there are many ways to solve problems",
    "C": "culture is unimportant",
    "D": "language is unnecessary",
    "answer": "B"
  },
  {
    "id": "141",
    "topicId": "8.4",
    "bigId": "8",
    "stem": "Which of the following is NOT mentioned as a travel difficulty?",
    "A": "Flight delays",
    "B": "Lost luggage",
    "C": "Language barriers",
    "D": "Bad weather every day",
    "answer": "D"
  },
  {
    "id": "142",
    "topicId": "8.4",
    "bigId": "8",
    "stem": "The writer thinks good preparation can ______.",
    "A": "make travel completely free",
    "B": "reduce travel problems",
    "C": "stop flights from being delayed",
    "D": "guarantee perfect weather",
    "answer": "B"
  },
  {
    "id": "143",
    "topicId": "8.4",
    "bigId": "8",
    "stem": "The best title for the passage is ______.",
    "A": "Travel Is Always Dangerous",
    "B": "The Only Reason to Travel",
    "C": "The Value and Challenges of Travel",
    "D": "How to Become Rich by Traveling",
    "answer": "C"
  },
  {
    "id": "144",
    "topicId": "9.1",
    "bigId": "9",
    "stem": "（144）完形填空填空",
    "A": "repeat",
    "B": "memorize",
    "C": "recall",
    "D": "copy",
    "answer": "C"
  },
  {
    "id": "145",
    "topicId": "9.1",
    "bigId": "9",
    "stem": "（145）完形填空填空",
    "A": "store",
    "B": "waste",
    "C": "hide",
    "D": "reduce",
    "answer": "A"
  },
  {
    "id": "146",
    "topicId": "9.1",
    "bigId": "9",
    "stem": "（146）完形填空填空",
    "A": "useful",
    "B": "noisy",
    "C": "expensive",
    "D": "slow",
    "answer": "A"
  },
  {
    "id": "147",
    "topicId": "9.1",
    "bigId": "9",
    "stem": "（147）完形填空填空",
    "A": "deeply",
    "B": "hardly",
    "C": "quietly",
    "D": "simply",
    "answer": "A"
  },
  {
    "id": "148",
    "topicId": "9.1",
    "bigId": "9",
    "stem": "（148）完形填空填空",
    "A": "stronger",
    "B": "worse",
    "C": "clearer",
    "D": "faster",
    "answer": "B"
  },
  {
    "id": "149",
    "topicId": "9.1",
    "bigId": "9",
    "stem": "（149）完形填空填空",
    "A": "spending",
    "B": "spend",
    "C": "spent",
    "D": "to spend",
    "answer": "A"
  },
  {
    "id": "150",
    "topicId": "9.1",
    "bigId": "9",
    "stem": "（150）完形填空填空",
    "A": "focused",
    "B": "bored",
    "C": "silent",
    "D": "careless",
    "answer": "A"
  },
  {
    "id": "151",
    "topicId": "9.1",
    "bigId": "9",
    "stem": "（151）完形填空填空",
    "A": "confused",
    "B": "exciting",
    "C": "pleasant",
    "D": "careful",
    "answer": "A"
  },
  {
    "id": "152",
    "topicId": "9.1",
    "bigId": "9",
    "stem": "（152）完形填空填空",
    "A": "effective",
    "B": "expensive",
    "C": "difficult",
    "D": "dangerous",
    "answer": ""
  },
  {
    "id": "153",
    "topicId": "9.2",
    "bigId": "9",
    "stem": "（153）完形填空填空",
    "A": "affect",
    "B": "destroy",
    "C": "forget",
    "D": "delay",
    "answer": ""
  },
  {
    "id": "154",
    "topicId": "9.2",
    "bigId": "9",
    "stem": "（154）完形填空填空",
    "A": "improved",
    "B": "disappeared",
    "C": "increased",
    "D": "continued",
    "answer": "B"
  },
  {
    "id": "155",
    "topicId": "9.2",
    "bigId": "9",
    "stem": "（155）完形填空填空",
    "A": "stopping",
    "B": "to stop",
    "C": "stopped",
    "D": "stop",
    "answer": "A"
  },
  {
    "id": "156",
    "topicId": "9.2",
    "bigId": "9",
    "stem": "（156）完形填空填空",
    "A": "quickly",
    "B": "slowly",
    "C": "carelessly",
    "D": "rarely",
    "answer": "A"
  },
  {
    "id": "157",
    "topicId": "9.2",
    "bigId": "9",
    "stem": "（157）完形填空填空",
    "A": "respond",
    "B": "refuse",
    "C": "remove",
    "D": "reduce",
    "answer": "A"
  },
  {
    "id": "158",
    "topicId": "9.2",
    "bigId": "9",
    "stem": "（158）完形填空填空",
    "A": "useless",
    "B": "important",
    "C": "boring",
    "D": "difficult",
    "answer": "B"
  },
  {
    "id": "159",
    "topicId": "9.2",
    "bigId": "9",
    "stem": "（159）完形填空填空",
    "A": "clearly",
    "B": "loudly",
    "C": "angrily",
    "D": "suddenly",
    "answer": "A"
  },
  {
    "id": "160",
    "topicId": "9.2",
    "bigId": "9",
    "stem": "（160）完形填空填空",
    "A": "effort",
    "B": "fear",
    "C": "luck",
    "D": "doubt",
    "answer": ""
  }
];
