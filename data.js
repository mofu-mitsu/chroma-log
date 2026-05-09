const questionsData = [
    { id: "q_energy", type: "slider", text: "意識は普段どこに向かっている？", left: "内なる思考", right: "外界の刺激", affects: "R" },
    { id: "q_logic", type: "slider", text: "判断するときの基準は？", left: "感情・信念", right: "論理・効率", affects: "B" },
    { id: "q_chaos", type: "slider", text: "頭の中の状態は？", left: "体系的", right: "カオス", affects: "G" },
    { id: "q_depth", type: "slider", text: "物事を見つめる深さは？", left: "現実的・ありのまま", right: "抽象的・裏を探る", affects: "L" },
    
    {
        id: "q_morning", type: "radio", text: "<i class='fa-solid fa-sun'></i> 朝起きた瞬間まず何する？",
        options: [
            { label: "スマホの通知確認", val: "te" },
            { label: "二度寝・ぼーっとする", val: "ni" },
            { label: "水を飲む・顔を洗う", val: "si" },
            { label: "夢の内容を反芻・妄想", val: "ne" },
            { label: "それ以外 (独自のルーティン)", val: "other" } // 追加！
        ]
    },
    {
        id: "q_contradiction", type: "radio", text: "<i class='fa-solid fa-people-arrows'></i> 本当は人と関わりたい？",
        options: [
            { label: "はい", val: "yes", noise: 0 },
            { label: "ひとりが楽", val: "no", noise: 0 },
            { label: "関わりたいけど疲れる", val: "conflict", noise: 40 },
            { label: "気分による", val: "mood", noise: 20 }
        ]
    }
];

const motifs = [
    { id: "m1", label: "時計", word: "秩序", r: 10, g: 10, b: -20 },
    { id: "m2", label: "ガラス", word: "透明感", r: -20, g: 20, b: 30 },
    { id: "m3", label: "廃墟", word: "退廃", r: -30, g: -30, b: -10 },
    { id: "m4", label: "星", word: "宇宙", r: 20, g: -20, b: 40 },
    { id: "m5", label: "機械", word: "構造", r: -10, g: -10, b: -10 },
    { id: "m6", label: "雨", word: "憂鬱", r: -30, g: -10, b: 30 },
    { id: "m7", label: "花", word: "生命", r: 40, g: -10, b: -20 }
];

// 🐛 LSI-Ni 芋虫のセリフ集
const wormLines = [
    "非効率なタップだな。",
    "私のTiとSeで世界を斬るが、Niの深淵も覗くのだ。",
    "システムにバグはないか？",
    "感情(Fe)で動くのはやめたまえ。",
    "……先が見えている。",
    "その行動の目的は何だ？",
    "僕がここにいる意味を推測しろ。",
    "触りすぎだ。30回で僕は壊れるぞ。",
    "無意味な操作だ。",
    "ふん……。"
];