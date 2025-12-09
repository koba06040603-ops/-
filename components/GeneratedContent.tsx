
import React, { useState, useEffect } from 'react';
import { LearningSystemData, Course, LearningCard, CoursePreview } from '../types';
import { 
  Map, LayoutGrid, BrainCircuit, Calendar, ClipboardCheck,
  Printer, ArrowLeft, Home, School, BookOpen, Lightbulb, CheckCircle, Star, Zap, Target, Clock, FileCheck, Award, Scissors, Sparkles, GraduationCap, ClipboardList, Edit, Image as ImageIcon, Download, Loader2
} from 'lucide-react';
import { generateImage } from '../geminiService';

interface GeneratedContentProps {
  data: LearningSystemData;
  onReset: () => void;
}

export const GeneratedContent: React.FC<GeneratedContentProps> = ({ data: initialData, onReset }) => {
  const [activeTab, setActiveTab] = useState<'guide' | 'teacher' | 'cards' | 'hints' | 'test' | 'plan' | 'env' | 'image' | 'print'>('guide');
  const [data, setData] = useState<LearningSystemData>(initialData);
  const [isEditing, setIsEditing] = useState(false);

  // Image Generation State
  const [imagePrompt, setImagePrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);

  useEffect(() => {
    setData(initialData);
    // Set default prompt based on unit data
    if (initialData.meta?.unit) {
        setImagePrompt(`${initialData.meta.grade} ${initialData.meta.subject}の「${initialData.meta.unit}」の授業で使える、わかりやすいイラスト`);
    }
  }, [initialData]);

  const handleGenerateImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imagePrompt) return;
    
    setIsGeneratingImage(true);
    setImageError(null);
    setGeneratedImage(null);

    try {
        const base64Image = await generateImage(imagePrompt);
        setGeneratedImage(base64Image);
    } catch (err) {
        console.error(err);
        setImageError("画像の生成に失敗しました。もう一度お試しください。");
    } finally {
        setIsGeneratingImage(false);
    }
  };

  // Robust check for essential data
  if (!data || !data.courses) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="p-8 bg-white rounded-xl shadow-lg text-center border-2 border-red-100 max-w-md">
          <p className="text-red-500 font-bold mb-4 text-xl">データの読み込みに問題が発生しました</p>
          <p className="text-gray-500 mb-6 text-sm">
            AIによる生成が不完全だった可能性があります。<br/>
            もう一度作成ボタンを押してください。
          </p>
          <button onClick={onReset} className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors">
            やり直す
          </button>
        </div>
      </div>
    );
  }

  // Helper component for editable text
  const EditableText = ({ 
    value, 
    onChange, 
    className, 
    multiline = false 
  }: { 
    value: string | number | undefined; 
    onChange: (val: string) => void; 
    className?: string;
    multiline?: boolean;
  }) => {
    if (!isEditing) {
      return <span className={className}>{value}</span>;
    }

    if (multiline) {
      return (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full p-2 border border-indigo-300 rounded bg-indigo-50/50 focus:ring-2 focus:ring-indigo-500 outline-none ${className}`}
          rows={3}
        />
      );
    }
    return (
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full p-1 border border-indigo-300 rounded bg-indigo-50/50 focus:ring-2 focus:ring-indigo-500 outline-none ${className}`}
      />
    );
  };

  const updateCard = (courseKey: 'basic' | 'standard' | 'advanced', cardIndex: number, field: keyof LearningCard, value: string) => {
    const newData = { ...data };
    if (newData.courses && newData.courses[courseKey] && newData.courses[courseKey]!.cards[cardIndex]) {
        (newData.courses[courseKey]!.cards[cardIndex] as any)[field] = value;
        setData(newData);
    }
  };

  const renderCard = (card: LearningCard, courseColor: string, courseName: string, courseKey: 'basic' | 'standard' | 'advanced', index: number) => (
    <div key={card.id} className={`bg-white border-2 ${courseColor} rounded-xl p-6 shadow-sm mb-8 print:break-after-page print:border-2 print:shadow-none print:mb-0 print:h-screen print:flex print:flex-col`}>
      {/* Header */}
      <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-3">
        <div className="flex items-center gap-3 w-full">
          <span className={`text-sm font-bold px-3 py-1 rounded text-white whitespace-nowrap ${courseColor.replace('border-', 'bg-')}`}>
            {courseName} No.{card.id}
          </span>
          <span className="text-sm text-gray-500 font-mono flex items-center gap-1 w-full">
            <BookOpen className="w-4 h-4 flex-shrink-0" /> 教科書 
            <EditableText 
                value={card.textbookPage} 
                onChange={(val) => updateCard(courseKey, index, 'textbookPage', val)} 
                className="font-bold"
            />
          </span>
        </div>
        <div className="text-gray-400 text-xs print:text-gray-900 whitespace-nowrap ml-2">
           ID: {card.id}
        </div>
      </div>
      
      <div className="mb-4">
          <EditableText 
            value={card.title} 
            onChange={(val) => updateCard(courseKey, index, 'title', val)} 
            className="font-bold text-2xl text-gray-800 block"
          />
      </div>
      
      {/* Goal */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6 text-base border-l-4 border-gray-400">
        <span className="font-bold text-gray-700 mr-2">【めあて】</span>
        <EditableText 
            value={card.goal} 
            onChange={(val) => updateCard(courseKey, index, 'goal', val)} 
        />
      </div>

      <div className="flex-1 space-y-6">
        {/* Key Terms */}
        <div className="bg-blue-50 border-l-4 border-blue-400 p-5 rounded-r-lg shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="w-6 h-6 text-blue-600" />
            <h4 className="font-bold text-blue-800 text-lg">大事な言葉・ポイント</h4>
          </div>
          <EditableText 
            value={card.keyTerm} 
            onChange={(val) => updateCard(courseKey, index, 'keyTerm', val)} 
            className="text-gray-800 text-base whitespace-pre-wrap leading-relaxed block"
            multiline
          />
        </div>

        {/* Example */}
        <div className="bg-orange-50 border-l-4 border-orange-400 p-5 rounded-r-lg shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-6 h-6 text-orange-600" />
            <h4 className="font-bold text-orange-800 text-lg">例題（やり方・考え方）</h4>
          </div>
          <div className="bg-white p-4 rounded border border-orange-100">
             <EditableText 
                value={card.example} 
                onChange={(val) => updateCard(courseKey, index, 'example', val)} 
                className="text-gray-800 text-base whitespace-pre-wrap leading-relaxed font-mono block"
                multiline
             />
          </div>
        </div>

        {/* Question */}
        <div className="pt-4 border-t-2 border-gray-100">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle className="w-6 h-6 text-indigo-600" />
            <h4 className="font-bold text-indigo-800 text-lg">もんだい</h4>
          </div>
          <div className="p-4 bg-white border border-gray-200 rounded-lg min-h-[150px]">
             <EditableText 
                value={card.question} 
                onChange={(val) => updateCard(courseKey, index, 'question', val)} 
                className="text-gray-800 font-medium whitespace-pre-wrap text-base leading-relaxed block"
                multiline
             />
          </div>
        </div>
      </div>

      {/* Hints & Answers */}
      <div className="border-t border-dashed border-gray-300 pt-4 mt-6 print:mt-auto">
        <div className="flex gap-4 print:hidden">
          <details className="group mb-2">
            <summary className="cursor-pointer text-sm font-bold text-amber-500 select-none flex items-center gap-2 hover:text-amber-600 p-1 rounded hover:bg-amber-50 w-fit">
              <span>💡 ヒントを見る</span>
            </summary>
            <div className="mt-2 text-sm text-gray-600 bg-amber-50 p-3 rounded-lg">
               <EditableText 
                value={card.hint} 
                onChange={(val) => updateCard(courseKey, index, 'hint', val)} 
                multiline
               />
            </div>
          </details>
          <details className="group">
            <summary className="cursor-pointer text-sm font-bold text-emerald-500 select-none flex items-center gap-2 hover:text-emerald-600 p-1 rounded hover:bg-emerald-50 w-fit">
              <span>✅ 答えを見る</span>
            </summary>
            <div className="mt-2 text-sm text-gray-800 font-bold bg-emerald-50 p-3 rounded-lg">
               <EditableText 
                value={card.answer} 
                onChange={(val) => updateCard(courseKey, index, 'answer', val)} 
                multiline
               />
            </div>
          </details>
        </div>

        <div className="hidden print:block text-xs text-gray-400 mt-4">
          <div className="flex justify-between items-end border-t pt-2">
             <div>
               <span className="font-bold mr-2">ヒント:</span> {card.hint}
             </div>
             <div className="rotate-180 transform origin-right">
               <span className="font-bold mr-2">答え:</span> {card.answer}
             </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderHintCard = (card: LearningCard, courseName: string, colorClass: string) => (
    <div key={`hint-${card.id}`} className="bg-white p-6 border-2 border-dashed border-gray-300 rounded-xl break-inside-avoid relative h-full flex flex-col hover:border-amber-300 transition-colors">
      <div className="absolute top-0 right-0 p-2">
        <Scissors className="w-4 h-4 text-gray-400" />
      </div>
      <div className={`text-xs font-bold text-white px-2 py-1 rounded w-fit mb-2 ${colorClass}`}>
        {courseName} No.{card.id}
      </div>
      <h4 className="font-bold text-gray-800 mb-4 text-sm">{card.title}</h4>
      <div className="flex-1 bg-amber-50 p-3 rounded-lg border border-amber-100 flex flex-col items-center justify-center text-center">
        <Lightbulb className="w-8 h-8 text-amber-500 mb-2" />
        <p className="text-sm text-gray-700 font-medium whitespace-pre-wrap">{card.hint}</p>
      </div>
      <div className="mt-2 text-xs text-gray-400 text-center">
        困ったときはこのカードを見よう
      </div>
    </div>
  );

  const renderCourseSection = (course: Course | undefined, color: string, courseKey: 'basic' | 'standard' | 'advanced') => {
    if (!course || !course.cards) return null;
    return (
      <div className="mb-16">
        <div className={`flex flex-col md:flex-row md:items-center gap-3 mb-6 pb-4 border-b-4 ${color} print:break-before-page`}>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{course.name}コース</h2>
            <p className="text-sm text-gray-500 mt-1">Difficulty: {course.difficulty}</p>
          </div>
          <div className="flex-1 md:ml-4">
            <span className="inline-block bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm">
              <EditableText 
                  value={course.description} 
                  onChange={(val) => {
                      const newData = { ...data };
                      if (newData.courses && newData.courses[courseKey]) {
                          newData.courses[courseKey]!.description = val;
                          setData(newData);
                      }
                  }} 
              />
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-8 print:block">
          {course.cards.map((card, index) => renderCard(card, color, course.name, courseKey, index))}
        </div>
      </div>
    );
  };

  const renderCoursePreview = (name: string, preview: CoursePreview | undefined, bgColor: string, borderColor: string, icon: React.ReactNode) => {
    if (!preview) return null;
    return (
      <div className={`bg-white rounded-xl shadow-md overflow-hidden border-t-8 ${borderColor} flex flex-col h-full`}>
        <div className={`${bgColor} p-4 flex items-center gap-3`}>
          <div className="bg-white p-2 rounded-full shadow-sm">
            {icon}
          </div>
          <div>
            <h3 className="font-bold text-xl text-gray-800">{name}</h3>
            <p className="text-sm font-bold opacity-80">{preview.catchphrase}</p>
          </div>
        </div>
        <div className="p-6 flex-1 flex flex-col">
          <div className="mb-4 bg-gray-50 p-4 rounded-lg border border-dashed border-gray-300">
            <p className="text-xs font-bold text-gray-400 mb-2 uppercase">生活・社会とのつながり（例題）</p>
            <p className="font-medium text-gray-800 whitespace-pre-wrap">{preview.exampleProblem}</p>
          </div>
          <div className="mt-auto">
            <div className="flex items-start gap-2">
              <div className="bg-indigo-100 p-1 rounded-full mt-0.5">
                  <Sparkles className="w-3 h-3 text-indigo-600" />
              </div>
              <p className="text-sm text-gray-600 leading-snug">
                <span className="font-bold text-indigo-600">発展学習へのステップ：</span>
                {preview.connection}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row font-sans">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-white border-r border-gray-200 no-print flex-shrink-0 sticky top-0 md:h-screen overflow-y-auto z-20">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-indigo-800 flex items-center gap-2">
            <School className="w-6 h-6" />
            {data.meta?.unit || '学習ユニット'}
          </h1>
          <p className="text-xs text-gray-500 mt-1">{data.meta?.grade} {data.meta?.subject}</p>
        </div>
        <nav className="p-4 space-y-2">
           <button 
             onClick={() => setIsEditing(!isEditing)}
             className={`w-full flex items-center justify-center gap-2 px-4 py-2 mb-4 border rounded-lg text-sm font-bold transition-all ${isEditing ? 'bg-indigo-600 text-white border-indigo-600 shadow-md ring-2 ring-indigo-200' : 'bg-white text-indigo-600 border-indigo-200 hover:bg-indigo-50'}`}
           >
             <Edit className="w-4 h-4" /> {isEditing ? '編集を終了する' : '内容を編集する'}
           </button>

          <button 
            onClick={() => setActiveTab('guide')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'guide' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <Home className="w-5 h-5" /> 学習のてびき
          </button>
          
          <div className="pt-2 pb-2">
            <div className="border-t border-gray-100 my-1"></div>
            <button 
              onClick={() => setActiveTab('teacher')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'teacher' ? 'bg-gray-800 text-white shadow-md' : 'text-gray-500 hover:bg-gray-100'}`}
            >
              <GraduationCap className="w-5 h-5" /> 先生用ガイド
            </button>
            <div className="border-t border-gray-100 my-1"></div>
          </div>

          <button 
            onClick={() => setActiveTab('cards')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'cards' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <LayoutGrid className="w-5 h-5" /> 学習カード
          </button>
          <button 
            onClick={() => setActiveTab('hints')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'hints' ? 'bg-amber-50 text-amber-700' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <Lightbulb className="w-5 h-5" /> ヒントカード
          </button>
          <button 
            onClick={() => setActiveTab('test')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'test' ? 'bg-rose-50 text-rose-700' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <ClipboardCheck className="w-5 h-5" /> チェックテスト
          </button>
          <button 
            onClick={() => setActiveTab('plan')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'plan' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <Calendar className="w-5 h-5" /> 計画表
          </button>
          <button 
            onClick={() => setActiveTab('env')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'env' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <Map className="w-5 h-5" /> 環境デザイン
          </button>
          <button 
            onClick={() => setActiveTab('image')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'image' ? 'bg-fuchsia-50 text-fuchsia-700' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <ImageIcon className="w-5 h-5" /> 教材用画像
          </button>
          <button 
            onClick={() => setActiveTab('print')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'print' ? 'bg-gray-100 text-gray-800' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <Printer className="w-5 h-5" /> 印刷モード
          </button>
        </nav>
        <div className="p-4 mt-auto border-t border-gray-200">
          <button 
            onClick={onReset}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> 最初に戻る
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8 overflow-y-auto print:p-0 print:overflow-visible h-screen">
        
        {/* Guide Tab */}
        <div className={activeTab === 'guide' || activeTab === 'print' ? 'block' : 'hidden'}>
           <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-sm p-8 mb-8 print:shadow-none print:p-0 print:mb-0">
             <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2 border-b pb-4">
               <Home className="w-8 h-8 text-indigo-600" /> 学習のてびき
             </h2>

             {/* Goal and Hours Header */}
             <div className="flex flex-col md:flex-row gap-6 mb-8">
               <div className="flex-1 bg-yellow-50 border-2 border-yellow-200 rounded-xl p-5">
                 <div className="flex items-center gap-2 mb-2 text-yellow-700 font-bold">
                   <Target className="w-5 h-5" />
                   <span>単元のめあて</span>
                 </div>
                 <p className="text-lg text-gray-800 font-bold">
                    <EditableText 
                      value={data.guide?.unitGoal} 
                      onChange={(val) => {
                          const newData = { ...data };
                          if (newData.guide) {
                              newData.guide.unitGoal = val;
                              setData(newData);
                          }
                      }} 
                    />
                 </p>
               </div>
               <div className="w-full md:w-48 bg-gray-50 border-2 border-gray-200 rounded-xl p-5 flex flex-col justify-center items-center">
                 <div className="flex items-center gap-2 mb-1 text-gray-500 font-bold">
                   <Clock className="w-5 h-5" />
                   <span>学習時間</span>
                 </div>
                 <p className="text-2xl text-gray-800 font-bold">
                    <EditableText 
                      value={data.guide?.totalHours} 
                      onChange={(val) => {
                          const newData = { ...data };
                          if (newData.guide) {
                              newData.guide.totalHours = val;
                              setData(newData);
                          }
                      }} 
                    />
                 </p>
               </div>
             </div>
             
             {/* Introduction */}
             <div className="bg-indigo-50 p-6 rounded-xl mb-10 border border-indigo-100">
                <div className="flex gap-4">
                  <div className="bg-indigo-100 p-3 rounded-full h-fit">
                    <Lightbulb className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-indigo-900 mb-2">はじめに</h3>
                    <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                       <EditableText 
                          value={data.guide?.introduction} 
                          onChange={(val) => {
                              const newData = { ...data };
                              if (newData.guide) {
                                  newData.guide.introduction = val;
                                  setData(newData);
                              }
                          }} 
                          multiline
                        />
                    </div>
                  </div>
                </div>
             </div>
             
             {/* Course Previews */}
             <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
               生活や社会とつながる！ 3つのコース
             </h3>
             {data.guide?.coursePreviews ? (
               <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                  {renderCoursePreview(
                    (data.courses?.basic?.name || "基礎") + "コース", 
                    data.guide.coursePreviews.basic, 
                    "bg-cyan-50", 
                    "border-cyan-400",
                    <Star className="w-6 h-6 text-cyan-600" />
                  )}
                  {renderCoursePreview(
                    (data.courses?.standard?.name || "標準") + "コース", 
                    data.guide.coursePreviews.standard, 
                    "bg-emerald-50", 
                    "border-emerald-400",
                    <CheckCircle className="w-6 h-6 text-emerald-600" />
                  )}
                  {renderCoursePreview(
                    (data.courses?.advanced?.name || "発展") + "コース", 
                    data.guide.coursePreviews.advanced, 
                    "bg-orange-50", 
                    "border-orange-400",
                    <Zap className="w-6 h-6 text-orange-600" />
                  )}
               </div>
             ) : (
                <div className="text-center p-4 bg-gray-50 rounded-lg text-gray-500">コース紹介が生成されませんでした。</div>
             )}
             <div className="text-center text-gray-500 text-sm mt-4">
               ※ どのコースも生活や社会の中で使える力が身につきます。
             </div>
           </div>
        </div>

        {/* Teacher's Guide Tab */}
        <div className={activeTab === 'teacher' ? 'block' : 'hidden'}>
          <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-md p-8 mb-8 border-l-8 border-gray-700">
             <div className="flex items-center gap-3 mb-8 border-b border-gray-200 pb-4">
               <GraduationCap className="w-8 h-8 text-gray-800" />
               <div>
                 <h2 className="text-2xl font-bold text-gray-900">先生用ガイド</h2>
                 <p className="text-sm text-gray-500">Teacher's Guide - 評価規準と特記事項</p>
               </div>
             </div>

             {/* Evaluation Criteria */}
             {data.teacherGuide?.evaluationCriteria ? (
               <div className="mb-10 rounded-xl overflow-hidden border border-gray-300">
                 <div className="bg-gray-100 p-4 border-b border-gray-200 flex items-center gap-2">
                   <Award className="w-5 h-5 text-gray-700" />
                   <h3 className="font-bold text-gray-800 text-lg">評価の観点</h3>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-300">
                    <div className="p-6 bg-white">
                      <div className="flex items-center gap-2 mb-3">
                         <span className="w-2 h-8 bg-blue-500 rounded-full"></span>
                         <h4 className="font-bold text-base text-gray-800">知識・技能</h4>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed">{data.teacherGuide.evaluationCriteria.knowledge || '-'}</p>
                    </div>
                    <div className="p-6 bg-white">
                      <div className="flex items-center gap-2 mb-3">
                         <span className="w-2 h-8 bg-green-500 rounded-full"></span>
                         <h4 className="font-bold text-base text-gray-800">思考・判断・表現</h4>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed">{data.teacherGuide.evaluationCriteria.thinking || '-'}</p>
                    </div>
                    <div className="p-6 bg-white">
                      <div className="flex items-center gap-2 mb-3">
                         <span className="w-2 h-8 bg-red-500 rounded-full"></span>
                         <h4 className="font-bold text-base text-gray-800">主体的に学習に取り組む態度</h4>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed">{data.teacherGuide.evaluationCriteria.attitude || '-'}</p>
                    </div>
                 </div>
               </div>
             ) : (
                <div className="p-6 text-center text-gray-500 border border-dashed rounded-lg mb-8">評価規準データがありません。</div>
             )}

             {/* Special Notes / Instructional Advice */}
             <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <div className="flex items-center gap-2 mb-4">
                  <ClipboardList className="w-6 h-6 text-gray-700" />
                  <h3 className="font-bold text-xl text-gray-800">単元の特記事項・指導のポイント</h3>
                </div>
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                   <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                     <EditableText 
                        value={data.teacherGuide?.specialNotes} 
                        onChange={(val) => {
                            const newData = { ...data };
                            if (newData.teacherGuide) {
                                newData.teacherGuide.specialNotes = val;
                                setData(newData);
                            }
                        }}
                        multiline
                      />
                   </p>
                </div>
                <p className="text-sm text-gray-500 mt-4 text-right">
                  ※ 自由進度学習における本単元の留意点です。
                </p>
             </div>
          </div>
        </div>

        {/* Cards Tab */}
        <div className={activeTab === 'cards' || activeTab === 'print' ? 'block' : 'hidden'}>
          <div className="max-w-5xl mx-auto mt-8 print:mt-0 print:max-w-none print:w-full">
            {renderCourseSection(data.courses?.basic, 'border-cyan-400', 'basic')}
            {renderCourseSection(data.courses?.standard, 'border-emerald-400', 'standard')}
            {renderCourseSection(data.courses?.advanced, 'border-orange-400', 'advanced')}
          </div>
        </div>

        {/* Hint Cards Tab */}
        <div className={activeTab === 'hints' || activeTab === 'print' ? 'block' : 'hidden'}>
          <div className="max-w-7xl mx-auto mt-8 print:mt-0 print:max-w-none print:w-full print:break-before-page">
            <div className="no-print mb-6 bg-amber-50 p-4 rounded-lg border border-amber-200">
               <h3 className="font-bold text-amber-800 flex items-center gap-2 mb-2">
                 <Lightbulb className="w-5 h-5" /> ヒントカードステーション
               </h3>
               <p className="text-sm text-gray-700">
                 ここにあるカードを印刷して切り取り、教室の「ヒントコーナー」に置いておきましょう。
                 子どもたちが困ったときに、自分で取りに行けるようにします。
               </p>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2 print:mt-6">
              <Lightbulb className="w-6 h-6 text-amber-500" /> ヒントカード一覧
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8 print:grid-cols-2 print:gap-4">
              {data.courses?.basic?.cards?.map(card => renderHintCard(card, '基礎', 'bg-cyan-500'))}
              {data.courses?.standard?.cards?.map(card => renderHintCard(card, '標準', 'bg-emerald-500'))}
              {data.courses?.advanced?.cards?.map(card => renderHintCard(card, '発展', 'bg-orange-500'))}
            </div>
          </div>
        </div>

        {/* Check Test Tab */}
        <div className={activeTab === 'test' || activeTab === 'print' ? 'block' : 'hidden'}>
          {data.checkTest ? (
            <div className="max-w-5xl mx-auto mt-8 print:mt-0 print:max-w-none print:w-full page-break">
              <div className="bg-white border-4 border-double border-gray-800 p-8 min-h-[1000px] relative">
                {/* Test Header */}
                <div className="text-center mb-8 border-b-2 border-gray-800 pb-4">
                  <h2 className="text-3xl font-black text-gray-900 mb-2 font-serif">
                     <EditableText 
                        value={data.checkTest.title} 
                        onChange={(val) => {
                            const newData = { ...data };
                            if (newData.checkTest) {
                                newData.checkTest.title = val;
                                setData(newData);
                            }
                        }}
                      />
                  </h2>
                  <p className="text-md text-gray-600">※ チャレンジ問題に進む前に、このテストを先生に見せましょう。</p>
                </div>

                {/* Name and Score */}
                <div className="flex justify-between items-end mb-12">
                   <div className="flex-1 mr-8">
                     <div className="border-b border-gray-800 mb-1 flex items-end">
                       <span className="text-sm font-bold mr-4 mb-1">組 番 名前</span>
                       <div className="flex-1 h-8"></div>
                     </div>
                   </div>
                   <div className="border-2 border-red-500 rounded p-4 w-32 h-24 flex flex-col items-center justify-center text-red-500 transform rotate-[-2deg]">
                     <span className="text-sm font-bold">てんすう</span>
                     <span className="text-3xl font-bold"> / 100</span>
                   </div>
                </div>

                {/* Questions */}
                <div className="space-y-12">
                  {data.checkTest.questions.map((q, idx) => (
                    <div key={idx}>
                       <div className="flex gap-2 mb-4">
                         <span className="bg-gray-800 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                           {idx + 1}
                         </span>
                         <div className="flex-1">
                           <div className="font-bold text-lg text-gray-900 mb-2">
                              <EditableText 
                                value={q.question} 
                                onChange={(val) => {
                                    const newData = { ...data };
                                    if (newData.checkTest && newData.checkTest.questions[idx]) {
                                        newData.checkTest.questions[idx].question = val;
                                        setData(newData);
                                    }
                                }}
                                multiline
                              />
                              <span className="ml-2 text-sm font-normal text-gray-500">（{q.points}点）</span>
                           </div>
                           {/* Writing Space */}
                           <div className="h-24 w-full border-b border-gray-300 border-dashed relative">
                             <span className="absolute bottom-1 right-2 text-gray-300 text-xs">答え</span>
                           </div>
                         </div>
                       </div>
                    </div>
                  ))}
                </div>

                {/* Bottom Instructions */}
                <div className="absolute bottom-8 left-0 right-0 text-center text-gray-500 text-sm">
                   <p>★ 終わったら見直しをして、先生に提出しましょう。</p>
                </div>
              </div>

              {/* Answer Key */}
              <div className="mt-8 bg-gray-100 p-6 border-t-2 border-dashed border-gray-400 print:break-before-page">
                <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
                  <FileCheck className="w-5 h-5" /> 先生用 模範解答（Check Test Key）
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  {data.checkTest.questions.map((q, idx) => (
                    <div key={idx} className="bg-white p-3 rounded border border-gray-200 flex justify-between">
                      <span className="font-bold text-gray-600">問{idx + 1}</span>
                      <span className="font-bold text-red-600">
                          <EditableText 
                            value={q.answer} 
                            onChange={(val) => {
                                const newData = { ...data };
                                if (newData.checkTest && newData.checkTest.questions[idx]) {
                                    newData.checkTest.questions[idx].answer = val;
                                    setData(newData);
                                }
                            }}
                          />
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">チェックテストのデータが生成されませんでした。</div>
          )}
        </div>

        {/* Choice Problems Tab */}
        <div className={activeTab === 'cards' || activeTab === 'print' ? 'block' : 'hidden'}>
           {data.choiceProblems && data.choiceProblems.length > 0 && (
            <div className="max-w-5xl mx-auto mt-12 page-break print:max-w-none">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2 print:mt-6">
                <BrainCircuit className="w-6 h-6 text-purple-600" /> チャレンジ問題（選択課題）
              </h2>
              <div className="bg-purple-50 p-4 rounded-lg mb-6 text-sm text-purple-800 border border-purple-200">
                 計画表の「自分ですすめる時間」に、<b>チェックテストに合格してから</b>挑戦してみよう！
                 <br/>
                 <span className="font-bold text-xs mt-1 block text-purple-600">★ 自分で問題を作ったり、何かを制作したりするミッションが含まれています。</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {data.choiceProblems.map((prob, idx) => (
                  <div key={idx} className="bg-white p-6 rounded-xl shadow-md border-2 border-purple-200 hover:border-purple-400 transition-colors flex flex-col relative overflow-hidden group">
                    <div className="absolute top-0 right-0 bg-purple-100 text-purple-700 px-3 py-1 rounded-bl-lg font-bold text-xs">
                      Mission {idx + 1}
                    </div>
                    <div className="flex items-center gap-2 mb-3 mt-2">
                      {prob.type === 'creation' && <Sparkles className="w-5 h-5 text-purple-500" />}
                      {prob.type === 'research' && <Map className="w-5 h-5 text-blue-500" />}
                      {prob.type === 'practice' && <Target className="w-5 h-5 text-green-500" />}
                      <h3 className="font-bold text-lg text-purple-900 leading-tight">
                         <EditableText 
                            value={prob.title} 
                            onChange={(val) => {
                                const newData = { ...data };
                                if (newData.choiceProblems && newData.choiceProblems[idx]) {
                                    newData.choiceProblems[idx].title = val;
                                    setData(newData);
                                }
                            }}
                          />
                      </h3>
                    </div>
                    <div className="text-gray-600 flex-1 text-sm leading-relaxed">
                         <EditableText 
                            value={prob.description} 
                            onChange={(val) => {
                                const newData = { ...data };
                                if (newData.choiceProblems && newData.choiceProblems[idx]) {
                                    newData.choiceProblems[idx].description = val;
                                    setData(newData);
                                }
                            }}
                            multiline
                          />
                    </div>
                    <div className="mt-4 pt-3 border-t border-dashed border-gray-200 flex justify-between items-center">
                       <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{prob.type} Type</span>
                       <div className="h-6 w-6 rounded-full border-2 border-gray-300 group-hover:border-purple-500"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
           )}
        </div>

        {/* Plan Tab */}
        <div className={activeTab === 'plan' || activeTab === 'print' ? 'block' : 'hidden'}>
          {data.plan ? (
            <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-sm p-8 mb-8 print:shadow-none print:p-0 page-break mt-8 print:mt-0">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Calendar className="w-6 h-6 text-indigo-600" /> 学習計画表
              </h2>
              <div className="overflow-hidden border border-gray-300 rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="py-3 px-2 text-center text-sm font-bold text-gray-700 w-12 border-r border-gray-300">時</th>
                      <th className="py-3 px-2 text-center text-sm font-bold text-gray-700 w-24 border-r border-gray-300 bg-blue-50/50">予定</th>
                      <th className="py-3 px-2 text-center text-sm font-bold text-gray-700 w-24 border-r border-gray-300">実施</th>
                      <th className="py-3 px-4 text-left text-sm font-bold text-gray-700 w-[30%] border-r border-gray-300">学習内容（コース・課題・チャレンジ）</th>
                      <th className="py-3 px-4 text-left text-sm font-bold text-gray-700 w-[15%] border-r border-gray-300">教科書・資料</th>
                      <th className="py-3 px-4 text-left text-sm font-bold text-gray-700">ふりかえり・感想</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {data.plan.map((item, index) => {
                      const isFixed = index === 0 || index === (data.plan?.length || 0) - 1;
                      return (
                        <tr key={item.hour} className={isFixed ? "bg-indigo-50/30" : ""}>
                          <td className="py-4 px-2 text-sm font-bold text-gray-900 text-center bg-gray-50 border-r border-gray-300 align-middle">
                            {item.hour}
                          </td>
                          <td className="py-4 px-2 border-r border-gray-300 align-top bg-blue-50/20">
                             {/* Scheduled Date writing space */}
                             <div className="h-full min-h-[40px]"></div>
                          </td>
                          <td className="py-4 px-2 border-r border-gray-300 align-top">
                             {/* Actual Date writing space */}
                             <div className="h-full min-h-[40px]"></div>
                          </td>
                          <td className="py-4 px-4 text-sm text-gray-800 border-r border-gray-300 align-top">
                            {isFixed ? (
                              <div>
                                <div className="font-bold mb-1">
                                    <EditableText 
                                        value={item.content} 
                                        onChange={(val) => {
                                            const newData = { ...data };
                                            if (newData.plan && newData.plan[index]) {
                                                newData.plan[index].content = val;
                                                setData(newData);
                                            }
                                        }}
                                        multiline
                                    />
                                </div>
                                <div className="text-xs text-gray-500">
                                    めあて: 
                                    <EditableText 
                                        value={item.goal} 
                                        onChange={(val) => {
                                            const newData = { ...data };
                                            if (newData.plan && newData.plan[index]) {
                                                newData.plan[index].goal = val;
                                                setData(newData);
                                            }
                                        }}
                                    />
                                </div>
                              </div>
                            ) : (
                              <div className="min-h-[120px] border-2 border-dashed border-gray-200 rounded p-3 text-gray-400 text-xs">
                                <span className="block mb-2 font-bold text-gray-300">学習予定を書き込もう</span>
                                <span className="block mb-1">□ 基礎コース カード{index}</span>
                                <span className="block mb-1">□ チェックテスト</span>
                              </div>
                            )}
                          </td>
                          <td className="py-4 px-4 text-sm text-gray-800 border-r border-gray-300 align-top">
                             {/* Resources writing space */}
                             <div className="h-full"></div>
                          </td>
                          <td className="py-4 px-4 text-sm text-gray-800 align-top">
                             {/* Reflection writing space - Large */}
                             <div className="h-full min-h-[120px] flex flex-col justify-end pb-1 border-b border-dashed border-gray-200">
                               <div className="text-[10px] text-gray-400 mb-auto pl-1 pt-1">3〜4文で詳しく書こう</div>
                             </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 text-sm text-gray-500 text-right">
                ※ チャレンジ問題（選択課題）は、最後の時間より前に取り組みましょう。
              </div>
            </div>
          ) : (
             <div className="p-8 text-center text-gray-500">計画表が生成されませんでした。</div>
          )}
        </div>

        {/* Environment Tab */}
        <div className={activeTab === 'env' || activeTab === 'print' ? 'block' : 'hidden'}>
          {data.environment ? (
            <div className="max-w-7xl mx-auto page-break mt-8 print:mt-0">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Map className="w-6 h-6 text-emerald-600" /> この単元の環境デザイン
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.environment.map((zone, idx) => (
                  <div key={idx} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 break-inside-avoid hover:shadow-md transition-shadow">
                    <div className="text-5xl mb-4 text-center p-4 bg-gray-50 rounded-full w-24 h-24 flex items-center justify-center mx-auto">{zone.icon}</div>
                    <h3 className="font-bold text-lg text-gray-800 mb-2 text-center">{zone.name}</h3>
                    <p className="text-sm text-gray-600 mb-4 text-center">{zone.description}</p>
                    <div className="bg-emerald-50 p-4 rounded-lg">
                      <p className="text-xs font-bold text-emerald-600 mb-2 uppercase tracking-wide">準備するもの</p>
                      <ul className="text-sm text-gray-700 space-y-2">
                        {zone.items.map((item, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-emerald-400 mt-1">•</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
             <div className="p-8 text-center text-gray-500">環境デザインが生成されませんでした。</div>
          )}
        </div>

        {/* Image Generation Tab (Standard Model) */}
        <div className={activeTab === 'image' || activeTab === 'print' ? 'block' : 'hidden'}>
           <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-sm p-8 mb-8 print:hidden">
             <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2 border-b pb-4">
               <ImageIcon className="w-6 h-6 text-fuchsia-600" /> 教材用画像メーカー
             </h2>
             
             <div className="flex flex-col md:flex-row gap-8">
               <div className="flex-1 space-y-6">
                  <div className="bg-fuchsia-50 p-4 rounded-lg text-sm text-fuchsia-800 border border-fuchsia-200">
                     授業やプリントで使えるイラスト・挿絵をAIで作成します。<br/>
                     例：「実験の様子」「歴史的な場面」「算数の図形問題」など
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-600">プロンプト（どんな画像を作りたいか）</label>
                    <textarea 
                       value={imagePrompt}
                       onChange={(e) => setImagePrompt(e.target.value)}
                       className="w-full p-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-fuchsia-400 focus:border-transparent outline-none min-h-[120px]"
                       placeholder="例：実験室でビーカーを見つめる小学生、明るい雰囲気、アニメ調"
                    />
                  </div>

                  <button 
                    onClick={handleGenerateImage}
                    disabled={isGeneratingImage || !imagePrompt}
                    className="w-full py-4 bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isGeneratingImage ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        画像を生成中...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        画像を生成する
                      </>
                    )}
                  </button>
                  
                  {imageError && (
                    <div className="text-red-500 text-sm font-bold bg-red-50 p-3 rounded border border-red-200">
                      {imageError}
                    </div>
                  )}
               </div>

               <div className="flex-1 bg-gray-100 rounded-xl flex items-center justify-center min-h-[400px] border-2 border-dashed border-gray-300 relative overflow-hidden group">
                  {generatedImage ? (
                    <>
                      <img src={generatedImage} alt="Generated" className="w-full h-full object-contain" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                         <a 
                           href={generatedImage} 
                           download="teaching-material.png"
                           className="bg-white text-gray-900 px-6 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-gray-200 transition-colors"
                         >
                           <Download className="w-5 h-5" />
                           保存する
                         </a>
                      </div>
                    </>
                  ) : (
                    <div className="text-center text-gray-400">
                      <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p>ここに生成された画像が表示されます</p>
                    </div>
                  )}
               </div>
             </div>
           </div>
        </div>
        
        {/* Print Helper */}
        {activeTab === 'print' && (
           <div className="fixed bottom-8 right-8 no-print z-50">
             <button 
               onClick={() => window.print()}
               className="bg-gray-900 text-white px-8 py-4 rounded-full shadow-2xl font-bold flex items-center gap-3 hover:bg-black transition-all hover:scale-105"
             >
               <Printer className="w-6 h-6" /> 印刷する
             </button>
           </div>
        )}

      </main>
    </div>
  );
};
