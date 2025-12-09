import React, { useState, useEffect } from 'react';
import { BookOpen, GraduationCap, Layers, Sparkles, Edit3, Zap, CheckCircle, Music, Palette, Activity, Globe, Heart, Utensils, Languages, Star, Clock, MessageSquarePlus } from 'lucide-react';

interface InputFormProps {
  onSubmit: (grade: string, subject: string, unit: string, totalHours: number, customRequest: string) => void;
  isLoading: boolean;
}

interface UnitData {
  name: string;
  hours: number;
}

// Comprehensive Syllabus Data with Standard Hours (Approximate Tokyo Shoseki based)
const SYLLABUS_DATA: Record<string, Record<string, UnitData[]>> = {
  "小学1年生": {
    "国語": [{ name: "うたに あわせて", hours: 4 }, { name: "はなの みち", hours: 8 }, { name: "あいうえおの うた", hours: 5 }, { name: "おむすび ころりん", hours: 9 }, { name: "おおきな かぶ", hours: 10 }, { name: "うみへの ながい たび", hours: 8 }, { name: "くじらぐも", hours: 9 }, { name: "じどう車くらべ", hours: 10 }, { name: "たぬきの 糸車", hours: 9 }, { name: "スイミー", hours: 12 }],
    "算数": [{ name: "なかよし あつまれ", hours: 3 }, { name: "かずと すうじ", hours: 7 }, { name: "いくつと いくつ", hours: 9 }, { name: "たしざん", hours: 11 }, { name: "ひきざん", hours: 11 }, { name: "かたちあそび", hours: 4 }, { name: "10より おおきい かず", hours: 9 }, { name: "とけい", hours: 3 }, { name: "おおきな かず", hours: 8 }, { name: "ひろさくらべ", hours: 4 }],
    "生活": [{ name: "がっこうたんけん", hours: 10 }, { name: "あさがお さいた", hours: 12 }, { name: "なつが やってきた", hours: 8 }, { name: "いきもの なかよし", hours: 8 }, { name: "あきと なかよし", hours: 8 }, { name: "ふゆと なかよし", hours: 6 }, { name: "かぞく ニコニコ", hours: 8 }],
    "音楽": [{ name: "うたにあわせて", hours: 6 }, { name: "リズムあそび", hours: 4 }, { name: "はくをかんじて", hours: 4 }, { name: "みんなでうたおう", hours: 8 }, { name: "鍵盤ハーモニカ", hours: 10 }],
    "図工": [{ name: "すきなもの なあに", hours: 4 }, { name: "ちょきちょき かざり", hours: 4 }, { name: "すなやつちと なかよし", hours: 4 }, { name: "かみざらコロコロ", hours: 6 }, { name: "はこで つくったよ", hours: 6 }],
    "体育": [{ name: "かけっこ・リレー", hours: 6 }, { name: "ボールあそび", hours: 6 }, { name: "マットあそび", hours: 6 }, { name: "てつぼうあそび", hours: 5 }, { name: "みずあそび", hours: 8 }]
  },
  "小学2年生": {
    "国語": [{ name: "ふきのとう", hours: 7 }, { name: "たんぽぽの ちえ", hours: 8 }, { name: "スイミー", hours: 12 }, { name: "お手紙", hours: 10 }, { name: "馬のおもちゃの作り方", hours: 8 }, { name: "スーホの白い馬", hours: 12 }, { name: "アレクサンダとぜんまいねずみ", hours: 10 }, { name: "ニャーゴ", hours: 8 }],
    "算数": [{ name: "ひょうとグラフ", hours: 5 }, { name: "たし算のひっ算", hours: 12 }, { name: "引き算のひっ算", hours: 12 }, { name: "長さ", hours: 7 }, { name: "1000までの数", hours: 9 }, { name: "水のかさ", hours: 7 }, { name: "三角形と四角形", hours: 10 }, { name: "かけ算(1)", hours: 14 }, { name: "かけ算(2)", hours: 14 }, { name: "長いものの長さ", hours: 5 }, { name: "10000までの数", hours: 8 }, { name: "箱の形", hours: 6 }, { name: "分数", hours: 4 }],
    "生活": [{ name: "はるを みつけよう", hours: 8 }, { name: "やさいを そだてよう", hours: 15 }, { name: "まちたんけん", hours: 12 }, { name: "いきもの なかよし", hours: 8 }, { name: "うごく おもちゃ", hours: 10 }, { name: "あしたへ ジャンプ", hours: 8 }],
    "音楽": [{ name: "春がきた", hours: 4 }, { name: "かえるのがっしょう", hours: 4 }, { name: "虫のこえ", hours: 4 }, { name: "こぐまの二月", hours: 4 }, { name: "日本のうた", hours: 6 }],
    "図工": [{ name: "えのぐじま", hours: 4 }, { name: "ひかりの プレゼント", hours: 4 }, { name: "わっかで へんしん", hours: 4 }, { name: "まどから こんにちは", hours: 6 }, { name: "ともだちハウス", hours: 6 }],
    "体育": [{ name: "おにごっこ", hours: 5 }, { name: "ボール運び", hours: 5 }, { name: "とびばこあそび", hours: 6 }, { name: "水あそび", hours: 8 }, { name: "表現リズム", hours: 4 }]
  },
  "小学3年生": {
    "国語": [{ name: "きつつきの商売", hours: 8 }, { name: "国語辞典の使い方", hours: 4 }, { name: "まいごのかぎ", hours: 9 }, { name: "ちいちゃんのかげおくり", hours: 10 }, { name: "すがたをかえる大豆", hours: 9 }, { name: "三年とうげ", hours: 8 }, { name: "モチモチの木", hours: 10 }, { name: "おにたのぼうし", hours: 8 }],
    "算数": [{ name: "かけ算のきまり", hours: 5 }, { name: "時こくと時間", hours: 5 }, { name: "わり算", hours: 10 }, { name: "たし算とひき算の筆算", hours: 9 }, { name: "長さ", hours: 7 }, { name: "あまりのあるわり算", hours: 7 }, { name: "大きな数", hours: 8 }, { name: "かけ算の筆算", hours: 12 }, { name: "円と球", hours: 8 }, { name: "小数", hours: 8 }, { name: "重さ", hours: 7 }, { name: "分数", hours: 6 }, { name: "三角形", hours: 7 }, { name: "ぼうグラフ", hours: 5 }],
    "理科": [{ name: "自然の観察", hours: 4 }, { name: "植物の育ち方", hours: 8 }, { name: "チョウを育てよう", hours: 6 }, { name: "風やゴムの働き", hours: 7 }, { name: "光と音の性質", hours: 9 }, { name: "太陽の光", hours: 5 }, { name: "電気の通り道", hours: 9 }, { name: "磁石の性質", hours: 9 }, { name: "ものの重さ", hours: 5 }],
    "社会": [{ name: "わたしたちのまち", hours: 12 }, { name: "学校のまわり", hours: 8 }, { name: "店ではたらく人", hours: 12 }, { name: "農家の仕事", hours: 10 }, { name: "工場ではたらく人", hours: 10 }, { name: "火事や事故からくらしを守る", hours: 10 }, { name: "市のうつりかわり", hours: 6 }],
    "音楽": [{ name: "春の小川", hours: 3 }, { name: "茶つみ", hours: 3 }, { name: "ふじ山", hours: 3 }, { name: "パフ", hours: 4 }, { name: "リコーダー", hours: 10 }],
    "図工": [{ name: "絵の具＋水＋ふで＝いいかんじ", hours: 4 }, { name: "切って かき出して くっつけて", hours: 6 }, { name: "くぎうちトントン", hours: 6 }, { name: "ゴムゴムパワー", hours: 4 }],
    "体育": [{ name: "かけっこ・リレー", hours: 6 }, { name: "キックベース", hours: 8 }, { name: "マット運動", hours: 6 }, { name: "水泳", hours: 8 }, { name: "ポートボール", hours: 8 }]
  },
  "小学4年生": {
    "国語": [{ name: "白いぼうし", hours: 9 }, { name: "こわれた千の楽器", hours: 6 }, { name: "一つの花", hours: 9 }, { name: "ごんぎつね", hours: 12 }, { name: "ウナギのなぞを追って", hours: 8 }, { name: "プラタナスの木", hours: 9 }, { name: "初雪のふる日", hours: 6 }, { name: "木竜うるし", hours: 8 }],
    "算数": [{ name: "大きな数", hours: 9 }, { name: "折れ線グラフ", hours: 7 }, { name: "わり算の筆算(1)", hours: 11 }, { name: "角の大きさ", hours: 8 }, { name: "わり算の筆算(2)", hours: 13 }, { name: "がい数", hours: 8 }, { name: "計算のきまり", hours: 6 }, { name: "面積", hours: 10 }, { name: "小数", hours: 10 }, { name: "変わり方", hours: 6 }, { name: "分数", hours: 8 }, { name: "直方体と立方体", hours: 8 }],
    "理科": [{ name: "季節と生物", hours: 8 }, { name: "天気と気温", hours: 7 }, { name: "雨水の行方と地面の様子", hours: 7 }, { name: "電流の働き", hours: 9 }, { name: "人の体のつくりと運動", hours: 7 }, { name: "月と星", hours: 5 }, { name: "ものの温度と体積", hours: 8 }, { name: "もののあたたまり方", hours: 7 }, { name: "水のすがた", hours: 7 }],
    "社会": [{ name: "水はどこから", hours: 10 }, { name: "ごみのしょりと利用", hours: 10 }, { name: "自然災害からくらしを守る", hours: 8 }, { name: "県の様子", hours: 8 }, { name: "県内の特色ある地域", hours: 8 }, { name: "豊かな伝統文化", hours: 8 }],
    "音楽": [{ name: "さくら さくら", hours: 3 }, { name: "もみじ", hours: 3 }, { name: "ソーラン節", hours: 4 }, { name: "茶色の小びん", hours: 4 }, { name: "日本の民謡", hours: 4 }],
    "図工": [{ name: "絵の具でゆめもよう", hours: 4 }, { name: "コロコロガーレ", hours: 8 }, { name: "光のさしこむ絵", hours: 6 }, { name: "ほって すって 見つけて", hours: 8 }],
    "体育": [{ name: "小型ハードル走", hours: 6 }, { name: "ポートボール", hours: 8 }, { name: "とびばこ運動", hours: 6 }, { name: "表現運動", hours: 5 }, { name: "水泳", hours: 8 }]
  },
  "小学5年生": {
    "国語": [{ name: "なまえつけてよ", hours: 8 }, { name: "見立てる", hours: 6 }, { name: "カレーライス", hours: 9 }, { name: "たずねびと", hours: 9 }, { name: "注文の多い料理店", hours: 10 }, { name: "固有種が教えてくれること", hours: 8 }, { name: "大造じいさんとガン", hours: 12 }, { name: "わらぐつの中の神様", hours: 8 }],
    "算数": [{ name: "整数と小数", hours: 6 }, { name: "体積", hours: 9 }, { name: "比例", hours: 4 }, { name: "小数のかけ算", hours: 9 }, { name: "小数のわり算", hours: 11 }, { name: "合同な図形", hours: 8 }, { name: "整数の性質", hours: 9 }, { name: "分数と小数・整数", hours: 3 }, { name: "分数のたし算とひき算", hours: 10 }, { name: "平均", hours: 7 }, { name: "単位量あたりの大きさ", hours: 8 }, { name: "速さ", hours: 8 }, { name: "角柱と円柱", hours: 8 }],
    "理科": [{ name: "天気の変化", hours: 9 }, { name: "植物の発芽と成長", hours: 9 }, { name: "魚の育ち方", hours: 6 }, { name: "花から実へ", hours: 7 }, { name: "台風と防災", hours: 5 }, { name: "流れる水と土地の変化", hours: 9 }, { name: "電流と電磁石", hours: 10 }, { name: "人の誕生", hours: 4 }, { name: "とけたものの行方", hours: 8 }],
    "社会": [{ name: "世界の中の国土", hours: 6 }, { name: "低い土地のくらし", hours: 5 }, { name: "高い土地のくらし", hours: 5 }, { name: "あたたかい土地のくらし", hours: 5 }, { name: "寒い土地のくらし", hours: 5 }, { name: "米づくりのさかんな地域", hours: 10 }, { name: "水産業のさかんな地域", hours: 8 }, { name: "自動車をつくる工業", hours: 10 }, { name: "情報産業とわたしたち", hours: 8 }, { name: "森林とわたしたち", hours: 5 }],
    "音楽": [{ name: "こいのぼり", hours: 2 }, { name: "冬げしき", hours: 2 }, { name: "ルパン三世のテーマ", hours: 4 }, { name: "威風堂々", hours: 4 }, { name: "合唱の響き", hours: 6 }],
    "図工": [{ name: "心に残った あの時 あの場所", hours: 6 }, { name: "糸のこスイスイ", hours: 6 }, { name: "コロガルくんの旅", hours: 6 }, { name: "ミラクル！ミラーステージ", hours: 6 }],
    "体育": [{ name: "ハードル走", hours: 6 }, { name: "サッカー", hours: 8 }, { name: "バスケットボール", hours: 8 }, { name: "水泳", hours: 8 }, { name: "走り幅跳び", hours: 6 }],
    "家庭": [{ name: "私の生活、大発見！", hours: 4 }, { name: "クッキング　はじめの一歩", hours: 8 }, { name: "ソーイング　はじめの一歩", hours: 10 }, { name: "整理整とんで快適に", hours: 4 }, { name: "食べて　元気！", hours: 8 }, { name: "ミシンにトライ！", hours: 12 }, { name: "買い物名人", hours: 4 }, { name: "わが家のホッとタイム", hours: 4 }],
    "外国語": [{ name: "Unit 1 Hello, friends.", hours: 8 }, { name: "Unit 2 When is your birthday?", hours: 8 }, { name: "Unit 3 What do you want to study?", hours: 8 }, { name: "Unit 4 What time do you get up?", hours: 8 }, { name: "Unit 5 Where is the post office?", hours: 8 }, { name: "Unit 6 What would you like?", hours: 8 }, { name: "Unit 7 Where are you from?", hours: 8 }, { name: "Unit 8 Who is your hero?", hours: 8 }]
  },
  "小学6年生": {
    "国語": [{ name: "帰り道", hours: 8 }, { name: "時計の時間と心の時間", hours: 6 }, { name: "風切るつばさ", hours: 9 }, { name: "やまなし", hours: 10 }, { name: "『鳥獣戯画』を読む", hours: 8 }, { name: "メディアと人間社会", hours: 8 }, { name: "海の命", hours: 10 }, { name: "今、私は、ぼくは", hours: 6 }],
    "算数": [{ name: "対称な図形", hours: 8 }, { name: "文字と式", hours: 7 }, { name: "分数のかけ算", hours: 8 }, { name: "分数のわり算", hours: 8 }, { name: "比", hours: 9 }, { name: "拡大図と縮図", hours: 9 }, { name: "円の面積", hours: 7 }, { name: "比例と反比例", hours: 9 }, { name: "データの活用", hours: 6 }, { name: "場合の数", hours: 5 }],
    "理科": [{ name: "ものが燃えるしくみ", hours: 8 }, { name: "人の体のつくりと働き", hours: 8 }, { name: "植物の養分と水の通り道", hours: 6 }, { name: "生物どうしの関わり", hours: 4 }, { name: "月と太陽", hours: 6 }, { name: "大地のつくりと変化", hours: 10 }, { name: "てこのはたらき", hours: 9 }, { name: "電気と私たちのくらし", hours: 9 }],
    "社会": [{ name: "政治のしくみ", hours: 10 }, { name: "日本国憲法", hours: 6 }, { name: "縄文のむらから古墳のくにへ", hours: 8 }, { name: "貴族のくらし", hours: 6 }, { name: "武士の世の中", hours: 8 }, { name: "今に伝わる室町文化", hours: 4 }, { name: "天下統一", hours: 6 }, { name: "江戸幕府と政治の安定", hours: 6 }, { name: "明治の国づくり", hours: 8 }, { name: "アジア・太平洋戦争", hours: 8 }, { name: "新しい日本", hours: 6 }, { name: "世界の人々とともに", hours: 4 }],
    "音楽": [{ name: "おぼろ月夜", hours: 2 }, { name: "ふるさと", hours: 2 }, { name: "木星", hours: 3 }, { name: "ロック・マイ・ソウル", hours: 3 }, { name: "日本の音楽", hours: 4 }],
    "図工": [{ name: "墨と水から広がる世界", hours: 4 }, { name: "くるくるクランク", hours: 6 }, { name: "12年後のわたし", hours: 6 }, { name: "未来のわたし", hours: 6 }],
    "体育": [{ name: "ハードル走", hours: 6 }, { name: "ソフトバレーボール", hours: 8 }, { name: "走り高跳び", hours: 6 }, { name: "フォークダンス", hours: 2 }, { name: "水泳", hours: 8 }],
    "家庭": [{ name: "見つめ直そう　家庭生活", hours: 4 }, { name: "朝食から健康な１日を", hours: 8 }, { name: "クリーン大作戦", hours: 4 }, { name: "夏をすずしく　さわやかに", hours: 4 }, { name: "思いを形にして　生活を豊かに", hours: 10 }, { name: "まかせてね　今日の食事", hours: 10 }, { name: "冬を明るく　暖かく", hours: 4 }, { name: "共に生きる地域での生活", hours: 4 }],
    "外国語": [{ name: "Unit 1 This is me.", hours: 8 }, { name: "Unit 2 Welcome to Japan.", hours: 8 }, { name: "Unit 3 He is famous. She is active.", hours: 8 }, { name: "Unit 4 Summer Vacations in the World.", hours: 8 }, { name: "Unit 5 We live on the Earth.", hours: 8 }, { name: "Unit 6 What do you want to watch?", hours: 8 }, { name: "Unit 7 My Best Memory.", hours: 8 }, { name: "Unit 8 Junior High School Life.", hours: 8 }]
  },
  "中学1年生": {
    "国語": [{ name: "野原はうたう", hours: 3 }, { name: "花曇りの向こう", hours: 6 }, { name: "オオカミを見る目", hours: 8 }, { name: "大人になれなかった弟たちに……", hours: 7 }, { name: "竹取物語", hours: 8 }, { name: "星の花が降るころに", hours: 6 }, { name: "少年の日の思い出", hours: 9 }],
    "数学": [{ name: "正の数・負の数", hours: 16 }, { name: "文字と式", hours: 15 }, { name: "方程式", hours: 16 }, { name: "比例と反比例", hours: 16 }, { name: "平面図形", hours: 12 }, { name: "空間図形", hours: 12 }, { name: "データの分析", hours: 8 }],
    "理科": [{ name: "植物の生活と種類", hours: 14 }, { name: "物質の姿", hours: 14 }, { name: "身の回りの現象（光・音・力）", hours: 20 }, { name: "大地の変化", hours: 14 }],
    "社会": [{ name: "世界の姿", hours: 8 }, { name: "日本の姿", hours: 8 }, { name: "世界の諸地域", hours: 20 }, { name: "古代までの日本", hours: 15 }, { name: "中世の日本", hours: 15 }],
    "音楽": [{ name: "校歌", hours: 2 }, { name: "赤とんぼ", hours: 2 }, { name: "魔王", hours: 4 }, { name: "琴", hours: 6 }, { name: "アルトリコーダー", hours: 8 }],
    "美術": [{ name: "色の世界", hours: 6 }, { name: "平面構成", hours: 8 }, { name: "文字のデザイン", hours: 6 }, { name: "粘土で作る", hours: 8 }],
    "体育": [{ name: "体つくり運動", hours: 6 }, { name: "器械運動", hours: 10 }, { name: "陸上競技", hours: 10 }, { name: "水泳", hours: 10 }, { name: "球技", hours: 12 }, { name: "武道", hours: 10 }],
    "技術家庭": [
      { name: "【技術】材料と加工の技術（木材）", hours: 20 }, { name: "【技術】材料と加工の技術（金属）", hours: 15 }, { name: "【技術】生物育成の技術（栽培）", hours: 15 },
      { name: "【家庭】食生活と自立", hours: 8 }, { name: "【家庭】栄養のバランスと食事", hours: 10 }, { name: "【家庭】調理の基礎", hours: 15 }, { name: "【家庭】衣生活と自立", hours: 8 }, { name: "【家庭】日常着の手入れ", hours: 6 }
    ],
    "英語": [{ name: "Unit 1 New School Friend", hours: 8 }, { name: "Unit 2 Classmate", hours: 8 }, { name: "Unit 3 Club Activities", hours: 9 }, { name: "Unit 4 Friends in New Zealand", hours: 9 }, { name: "Unit 5 A Great Braider", hours: 10 }, { name: "Unit 6 A Speech", hours: 10 }, { name: "Unit 7 Foreign Artists", hours: 9 }, { name: "Unit 8 A Surprise Party", hours: 9 }, { name: "Unit 9 Think Globally, Act Locally", hours: 10 }, { name: "Unit 10 A Holiday in London", hours: 8 }]
  },
  "中学2年生": {
    "国語": [{ name: "アイスプラネット", hours: 6 }, { name: "盆土産", hours: 6 }, { name: "枕草子", hours: 8 }, { name: "平家物語", hours: 9 }, { name: "走れメロス", hours: 10 }, { name: "君は「最後の晩餐」を知っているか", hours: 6 }],
    "数学": [{ name: "式の計算", hours: 14 }, { name: "連立方程式", hours: 14 }, { name: "一次関数", hours: 16 }, { name: "図形の性質", hours: 16 }, { name: "三角形と四角形", hours: 14 }, { name: "確率", hours: 10 }, { name: "データの比較", hours: 8 }],
    "理科": [{ name: "化学変化と原子・分子", hours: 18 }, { name: "動物の生活と生物の進化", hours: 16 }, { name: "電気の世界", hours: 20 }, { name: "気象とその変化", hours: 16 }],
    "社会": [{ name: "日本の諸地域", hours: 20 }, { name: "身近な地域の調査", hours: 6 }, { name: "近世の日本", hours: 15 }, { name: "開国と近代日本の歩み", hours: 15 }, { name: "二度の世界大戦", hours: 15 }],
    "音楽": [{ name: "夏の思い出", hours: 2 }, { name: "荒城の月", hours: 2 }, { name: "アイーダ", hours: 4 }, { name: "交響曲第5番", hours: 4 }, { name: "ギター", hours: 8 }],
    "美術": [{ name: "光と影", hours: 6 }, { name: "遠近法", hours: 6 }, { name: "ポスターデザイン", hours: 8 }, { name: "木彫", hours: 10 }],
    "体育": [{ name: "体つくり運動", hours: 6 }, { name: "器械運動", hours: 10 }, { name: "陸上競技", hours: 10 }, { name: "水泳", hours: 10 }, { name: "球技", hours: 12 }, { name: "武道", hours: 10 }],
    "技術家庭": [
      { name: "【技術】エネルギー変換の技術（電気）", hours: 15 }, { name: "【技術】エネルギー変換の技術（動力）", hours: 10 }, { name: "【技術】情報の技術（ネットワーク）", hours: 10 },
      { name: "【家庭】衣服の製作", hours: 20 }, { name: "【家庭】住生活と自立", hours: 8 }, { name: "【家庭】住空間の活用", hours: 8 }, { name: "【家庭】消費生活・環境", hours: 8 }
    ],
    "英語": [{ name: "Unit 1 A Trip to Singapore", hours: 8 }, { name: "Unit 2 Food Travels", hours: 9 }, { name: "Unit 3 Career Day", hours: 9 }, { name: "Unit 4 Homestay in the United States", hours: 10 }, { name: "Unit 5 Universal Design", hours: 10 }, { name: "Unit 6 Research Your Topic", hours: 12 }, { name: "Unit 7 The Movie Carp", hours: 10 }]
  },
  "中学3年生": {
    "国語": [{ name: "握手", hours: 6 }, { name: "故郷", hours: 10 }, { name: "おくのほそ道", hours: 9 }, { name: "君待つと", hours: 3 }, { name: "和語・漢語・外来語", hours: 4 }, { name: "初恋", hours: 3 }],
    "数学": [{ name: "多項式", hours: 14 }, { name: "平方根", hours: 12 }, { name: "二次方程式", hours: 12 }, { name: "関数y=ax²", hours: 14 }, { name: "相似な図形", hours: 14 }, { name: "円", hours: 8 }, { name: "三平方の定理", hours: 12 }, { name: "標本調査", hours: 6 }],
    "理科": [{ name: "化学変化とイオン", hours: 16 }, { name: "生命の連続性", hours: 14 }, { name: "運動とエネルギー", hours: 14 }, { name: "地球と宇宙", hours: 16 }, { name: "自然と人間", hours: 8 }],
    "社会": [{ name: "現代社会と私たち", hours: 10 }, { name: "個人の尊重と日本国憲法", hours: 12 }, { name: "民主政治", hours: 14 }, { name: "市場経済", hours: 14 }, { name: "国際社会", hours: 10 }],
    "音楽": [{ name: "花", hours: 2 }, { name: "帰れソレントへ", hours: 2 }, { name: "ブルタバ", hours: 4 }, { name: "第九", hours: 4 }, { name: "創作", hours: 6 }],
    "美術": [{ name: "自画像", hours: 6 }, { name: "水墨画", hours: 6 }, { name: "環境デザイン", hours: 8 }, { name: "アニメーション", hours: 8 }],
    "体育": [{ name: "体つくり運動", hours: 6 }, { name: "器械運動", hours: 10 }, { name: "陸上競技", hours: 10 }, { name: "水泳", hours: 10 }, { name: "球技", hours: 12 }, { name: "武道", hours: 10 }],
    "技術家庭": [
      { name: "【技術】生物育成の技術（応用）", hours: 10 }, { name: "【技術】情報の技術（双方向性）", hours: 12 }, { name: "【技術】未来の技術と社会", hours: 6 },
      { name: "【家庭】幼児の生活と家族", hours: 10 }, { name: "【家庭】幼児との触れ合い", hours: 8 }, { name: "【家庭】自立した生活と社会", hours: 6 }, { name: "【家庭】持続可能な衣食住", hours: 6 }
    ],
    "英語": [{ name: "Unit 1 Sports for Everyone", hours: 8 }, { name: "Unit 2 Haiku", hours: 8 }, { name: "Unit 3 Animals on the Red List", hours: 9 }, { name: "Unit 4 Be Prepared", hours: 10 }, { name: "Unit 5 A Legacy for Peace", hours: 10 }, { name: "Unit 6 Beyond Borders", hours: 10 }, { name: "Let's Read: A Mother's Lullaby", hours: 4 }]
  }
};

export const InputForm: React.FC<InputFormProps> = ({ onSubmit, isLoading }) => {
  const [grade, setGrade] = useState('小学4年生');
  const [subject, setSubject] = useState('算数');
  const [unit, setUnit] = useState('大きな数');
  const [totalHours, setTotalHours] = useState(8);
  const [customRequest, setCustomRequest] = useState('');
  const [isManualUnit, setIsManualUnit] = useState(false);
  const [availableUnits, setAvailableUnits] = useState<UnitData[]>([]);

  // Progress State
  const [progress, setProgress] = useState(0);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    let interval: any;
    if (isLoading) {
      setSeconds(0);
      setProgress(0);
      interval = setInterval(() => {
        setSeconds(s => s + 1);
        setProgress(p => {
            if (p >= 98) return 98;
            return p + 1.6; 
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  // Update available units and default hours when grade or subject changes
  useEffect(() => {
    let dataSubject = subject;
    
    // Normalization logic for syllabus lookup
    // Elementary <-> Junior High Subject Mapping
    if (grade.includes("中学") && subject === "算数") dataSubject = "数学";
    if (grade.includes("小学") && subject === "数学") dataSubject = "算数";
    if (grade.includes("中学") && subject === "図工") dataSubject = "美術";
    if (grade.includes("小学") && subject === "美術") dataSubject = "図工";
    
    // Home Economics Mapping
    if (grade.includes("中学") && (subject === "家庭" || subject === "技術家庭")) dataSubject = "技術家庭";
    if (grade.includes("小学") && (subject === "技術家庭" || subject === "家庭")) dataSubject = "家庭";

    // Foreign Language Mapping
    if (grade.includes("中学") && (subject === "外国語" || subject === "英語")) dataSubject = "英語";
    if (grade.includes("小学") && (subject === "英語" || subject === "外国語")) dataSubject = "外国語";

    // Lower Elementary Life Studies Logic
    if ((grade === "小学1年生" || grade === "小学2年生") && (subject === "理科" || subject === "社会")) {
       dataSubject = "生活";
    }

    // Attempt to load units
    if (SYLLABUS_DATA[grade] && SYLLABUS_DATA[grade][dataSubject]) {
      setAvailableUnits(SYLLABUS_DATA[grade][dataSubject]);
      setIsManualUnit(false);
      if (SYLLABUS_DATA[grade][dataSubject].length > 0) {
        const firstUnit = SYLLABUS_DATA[grade][dataSubject][0];
        setUnit(firstUnit.name);
        setTotalHours(firstUnit.hours);
      } else {
        setUnit('');
        setIsManualUnit(true);
      }
    } else {
      setAvailableUnits([]);
      setIsManualUnit(true);
      setUnit('');
    }
  }, [grade, subject]);

  // Handle Unit Change to update Hours
  const handleUnitChange = (unitName: string) => {
    setUnit(unitName);
    const found = availableUnits.find(u => u.name === unitName);
    if (found) {
      setTotalHours(found.hours);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!grade || !subject || !unit) return;
    onSubmit(grade, subject, unit, totalHours, customRequest);
  };

  const getLoadingText = () => {
    if (progress < 20) return "学習の全体像を構想中...";
    if (progress < 40) return "基礎・標準・発展コースを設計中...";
    if (progress < 60) return "例題とヒントを作成中...";
    if (progress < 80) return "チェックテストと選択課題を準備中...";
    return "学習計画表と教室環境をデザイン中...";
  };

  const remainingSeconds = Math.max(0, 60 - seconds);
  const isLowerElementary = grade === "小学1年生" || grade === "小学2年生";
  const isJuniorHigh = grade.includes("中学");

  // Helper to render subject buttons with smart highlighting
  const SubjectButton = ({ name, icon: Icon, colorClass, shadowClass }: any) => {
    const aliases: Record<string, string[]> = {
      "算数": ["数学"], "数学": ["算数"],
      "図工": ["美術"], "美術": ["図工"],
      "家庭": ["技術家庭"], "技術家庭": ["家庭"],
      "外国語": ["英語"], "英語": ["外国語"],
      "生活": ["理科", "社会"]
    };
    
    const isSelected = subject === name || (aliases[name] && aliases[name].includes(subject));

    return (
      <button
        type="button"
        disabled={isLoading}
        onClick={() => setSubject(name)}
        className={`relative overflow-hidden p-3 rounded-2xl text-sm font-bold transition-all duration-300 flex flex-col items-center justify-center gap-2 h-24 border group ${
          isSelected 
            ? `${colorClass} text-white border-transparent ${shadowClass} scale-105 z-10 shadow-lg ring-2 ring-offset-2 ring-offset-slate-50` 
            : 'bg-white/80 backdrop-blur-sm text-slate-500 border-white/60 hover:border-indigo-200 hover:bg-white hover:text-indigo-600 shadow-sm hover:shadow-md hover:-translate-y-0.5'
        }`}
      >
        <div className={`p-2 rounded-full transition-colors ${isSelected ? 'bg-white/20' : 'bg-slate-100 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-500'}`}>
          <Icon className="w-5 h-5" />
        </div>
        <span className="tracking-wide text-xs md:text-sm">{name}</span>
      </button>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 text-slate-800 font-sans overflow-hidden selection:bg-indigo-500/30">
      
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-gradient-to-br from-blue-100 via-indigo-100 to-transparent rounded-full blur-[100px] opacity-70"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-gradient-to-tl from-purple-100 via-pink-100 to-transparent rounded-full blur-[100px] opacity-70"></div>
        <div className="absolute top-[40%] left-[50%] transform -translate-x-1/2 w-[40%] h-[40%] bg-amber-50/50 rounded-full blur-[80px]"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light"></div>
      </div>

      <div className="relative z-10 w-full max-w-5xl px-4 py-8 md:py-12">
        
        {/* Header Section */}
        <div className="text-center mb-12 relative">
          <div className="inline-flex items-center justify-center px-4 py-1.5 bg-white/80 backdrop-blur-md rounded-full border border-white/50 shadow-sm mb-6 animate-fade-in-down">
             <Sparkles className="w-3 h-3 text-indigo-500 mr-2" />
             <span className="text-[10px] md:text-xs font-bold tracking-widest text-slate-500 uppercase">AI Curriculum Designer</span>
          </div>
          
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tighter mb-4 drop-shadow-sm">
             <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 block">
              自由進度学習システム
            </span>
          </h1>
          <p className="text-sm md:text-lg text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">
             小学校・中学校の全学年全教科対応。<br className="hidden md:block"/>
             東京書籍などの主要単元リストから選ぶだけで、準備が完了します。
          </p>
        </div>

        {/* Main Form Card */}
        <div className="bg-white/40 backdrop-blur-xl p-6 md:p-10 rounded-[2rem] shadow-2xl shadow-indigo-100/50 border border-white/80 relative overflow-hidden">
           
          <form onSubmit={handleSubmit} className="space-y-10 relative z-10">
            
            {/* Grade Selection */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 ml-1">
                <GraduationCap className="w-4 h-4 text-indigo-400" /> Grade Level
              </label>
              <div className="relative group">
                <select 
                  value={grade} 
                  onChange={(e) => {
                    setGrade(e.target.value);
                  }}
                  disabled={isLoading}
                  className="w-full p-4 pl-6 rounded-xl border-0 bg-white/80 ring-1 ring-slate-200 text-slate-700 focus:ring-2 focus:ring-indigo-400 transition-all outline-none appearance-none cursor-pointer font-bold text-lg tracking-tight shadow-sm hover:bg-white"
                >
                  <option value="小学1年生">小学1年生</option>
                  <option value="小学2年生">小学2年生</option>
                  <option value="小学3年生">小学3年生</option>
                  <option value="小学4年生">小学4年生</option>
                  <option value="小学5年生">小学5年生</option>
                  <option value="小学6年生">小学6年生</option>
                  <option value="中学1年生">中学1年生</option>
                  <option value="中学2年生">中学2年生</option>
                  <option value="中学3年生">中学3年生</option>
                </select>
                <div className="absolute right-6 top-1/2 transform -translate-y-1/2 pointer-events-none text-indigo-500 bg-indigo-50 p-1.5 rounded-full">
                   <Layers className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Subject Selection */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 ml-1">
                <BookOpen className="w-4 h-4 text-indigo-400" /> Subject
              </label>
              
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                <SubjectButton name="国語" icon={BookOpen} colorClass="bg-rose-500" shadowClass="shadow-rose-200" />
                <SubjectButton name={isJuniorHigh ? '数学' : '算数'} icon={Layers} colorClass="bg-blue-500" shadowClass="shadow-blue-200" />
                
                {isLowerElementary ? (
                   <SubjectButton name="生活" icon={Heart} colorClass="bg-green-500" shadowClass="shadow-green-200" />
                ) : (
                  <>
                    <SubjectButton name="理科" icon={Zap} colorClass="bg-emerald-500" shadowClass="shadow-emerald-200" />
                    <SubjectButton name="社会" icon={Globe} colorClass="bg-orange-500" shadowClass="shadow-orange-200" />
                  </>
                )}

                <SubjectButton name="音楽" icon={Music} colorClass="bg-pink-500" shadowClass="shadow-pink-200" />
                <SubjectButton name={isJuniorHigh ? "美術" : "図工"} icon={Palette} colorClass="bg-yellow-500" shadowClass="shadow-yellow-200" />
                <SubjectButton name="体育" icon={Activity} colorClass="bg-sky-500" shadowClass="shadow-sky-200" />
                <SubjectButton name={isJuniorHigh ? "技術家庭" : "家庭"} icon={Utensils} colorClass="bg-amber-500" shadowClass="shadow-amber-200" />
                <SubjectButton name={isJuniorHigh ? "英語" : "外国語"} icon={Languages} colorClass="bg-purple-500" shadowClass="shadow-purple-200" />
                
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={() => { setSubject(''); setIsManualUnit(true); }}
                  className={`p-3 rounded-2xl text-xs md:text-sm font-bold transition-all flex flex-col items-center justify-center gap-2 h-24 border ${
                    !['国語', '算数', '数学', '理科', '社会', '生活', '音楽', '図工', '美術', '体育', '家庭', '技術家庭', '外国語', '英語'].includes(subject) 
                      ? 'bg-slate-700 text-white border-transparent shadow-lg scale-105 ring-2 ring-offset-2 ring-offset-white' 
                      : 'bg-white/50 text-slate-400 border-white/60 hover:bg-white hover:text-slate-600'
                  }`}
                >
                  <Edit3 className="w-5 h-5" />
                  <span>その他</span>
                </button>
              </div>

              {!['国語', '算数', '数学', '理科', '社会', '生活', '音楽', '図工', '美術', '体育', '家庭', '技術家庭', '外国語', '英語'].includes(subject) && (
                 <div className="animate-fade-in-up mt-2">
                   <input
                   type="text"
                   value={subject}
                   disabled={isLoading}
                   onChange={(e) => setSubject(e.target.value)}
                   placeholder="教科名を入力"
                   className="w-full p-4 pl-6 rounded-xl border-0 bg-white ring-1 ring-slate-200 text-slate-800 focus:ring-2 focus:ring-indigo-400 outline-none shadow-sm"
                 />
                 </div>
              )}
            </div>

            {/* Unit Selection & Hours */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-3 md:col-span-2">
                <div className="flex justify-between items-end mb-1 min-h-[28px]">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 ml-1">
                    <Star className="w-4 h-4 text-indigo-400" /> Learning Unit
                  </label>
                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={() => setIsManualUnit(!isManualUnit)}
                    className="text-[10px] text-indigo-500 hover:text-indigo-700 flex items-center gap-1 transition-colors bg-indigo-50 px-3 py-1.5 rounded-full border border-indigo-100 hover:bg-indigo-100 font-bold"
                  >
                    <Edit3 className="w-3 h-3" />
                    {isManualUnit ? 'リストから選択' : '手動で入力'}
                  </button>
                </div>

                {!isManualUnit && availableUnits.length > 0 ? (
                  <div className="relative group">
                    <select
                      value={unit}
                      disabled={isLoading}
                      onChange={(e) => handleUnitChange(e.target.value)}
                      className="w-full p-4 pl-6 rounded-xl border-0 bg-white/80 ring-1 ring-slate-200 text-slate-700 focus:ring-2 focus:ring-indigo-400 transition-all outline-none appearance-none hover:bg-white cursor-pointer font-bold text-lg tracking-tight shadow-sm"
                    >
                      {availableUnits.map((u) => (
                        <option key={u.name} value={u.name}>{u.name}</option>
                      ))}
                    </select>
                    <div className="absolute right-6 top-1/2 transform -translate-y-1/2 pointer-events-none text-indigo-500 bg-indigo-50 p-1.5 rounded-full">
                       <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>
                ) : (
                  <input
                    type="text"
                    value={unit}
                    disabled={isLoading}
                    onChange={(e) => setUnit(e.target.value)}
                    placeholder="単元名を入力"
                    className="w-full p-4 pl-6 rounded-xl border-0 bg-white ring-1 ring-slate-200 text-slate-700 focus:ring-2 focus:ring-indigo-400 transition-all outline-none font-bold text-lg tracking-tight shadow-sm"
                  />
                )}
              </div>

              {/* Total Hours Input */}
              <div className="space-y-3">
                <div className="flex justify-between items-end mb-1 min-h-[28px]">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 ml-1">
                    <Clock className="w-4 h-4 text-indigo-400" /> Total Hours
                  </label>
                </div>
                <div className="relative">
                   <input
                    type="number"
                    min="1"
                    max="50"
                    value={totalHours}
                    disabled={isLoading}
                    onChange={(e) => setTotalHours(parseInt(e.target.value) || 0)}
                    className="w-full p-4 pl-6 rounded-xl border-0 bg-white ring-1 ring-slate-200 text-slate-700 focus:ring-2 focus:ring-indigo-400 transition-all outline-none font-bold text-lg tracking-tight shadow-sm"
                  />
                  <div className="absolute right-6 top-1/2 transform -translate-y-1/2 pointer-events-none text-slate-400 text-sm font-bold">
                     時間
                  </div>
                </div>
              </div>
            </div>

            {/* Custom Request (New Feature) */}
            <div className="space-y-3">
               <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 ml-1">
                 <MessageSquarePlus className="w-4 h-4 text-indigo-400" /> Custom Request (Optional)
               </label>
               <textarea
                 value={customRequest}
                 disabled={isLoading}
                 onChange={(e) => setCustomRequest(e.target.value)}
                 placeholder="例: サッカーが好きな子が多いので、サッカーに関連する問題を作ってください。地域の特産品（りんご）を例に出してください。"
                 className="w-full p-4 pl-6 rounded-xl border-0 bg-white ring-1 ring-slate-200 text-slate-700 focus:ring-2 focus:ring-indigo-400 transition-all outline-none text-sm tracking-tight shadow-sm h-24 resize-none placeholder-slate-300"
               />
            </div>

            {/* Submit Button & Progress */}
            {isLoading ? (
              <div className="w-full py-6 px-8 bg-white/90 backdrop-blur-sm rounded-2xl border border-indigo-100 relative overflow-hidden shadow-lg">
                 <div className="flex justify-between text-sm font-bold text-indigo-600 mb-4 relative z-10">
                   <span className="flex items-center gap-2">
                     <Sparkles className="w-4 h-4 animate-spin" />
                     {getLoadingText()}
                   </span>
                   <span className="font-mono">Approx {remainingSeconds}s</span>
                 </div>
                 <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden relative z-10">
                    <div 
                      className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 h-full rounded-full transition-all duration-1000 ease-linear shadow-[0_0_15px_rgba(167,139,250,0.5)]" 
                      style={{ width: `${Math.min(98, progress)}%` }}
                    ></div>
                 </div>
              </div>
            ) : (
              <button
                type="submit"
                className="w-full py-5 rounded-2xl font-bold text-lg md:text-xl text-white shadow-xl shadow-indigo-300/40 transition-all transform hover:scale-[1.01] active:scale-[0.99] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-400 hover:via-purple-400 hover:to-pink-400 border border-white/20 relative overflow-hidden group"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <Sparkles className="w-5 h-5 animate-pulse" />
                  教材パッケージを生成
                </span>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
              </button>
            )}
          </form>
        </div>
        
        {/* Footer */}
        <div className="text-center mt-8 text-slate-400 text-[10px] md:text-xs font-medium">
          Powered by Gemini 2.5 Flash • Designed for Modern Education
        </div>
      </div>
    </div>
  );
};