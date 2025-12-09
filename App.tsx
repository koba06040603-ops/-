
import React, { useState } from 'react';
import { InputForm } from './components/InputForm';
import { GeneratedContent } from './components/GeneratedContent';
import { generateLearningSystem } from './geminiService';
import { LearningSystemData } from './types';

const App: React.FC = () => {
  const [data, setData] = useState<LearningSystemData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (grade: string, subject: string, unit: string, totalHours: number, customRequest: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await generateLearningSystem(grade, subject, unit, totalHours, customRequest);
      setData(result);
    } catch (err) {
      setError("データの生成に失敗しました。しばらく待ってからもう一度お試しください。");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setData(null);
    setError(null);
  };

  if (data) {
    return <GeneratedContent data={data} onReset={handleReset} />;
  }

  return (
    <>
      <InputForm onSubmit={handleGenerate} isLoading={isLoading} />
      {error && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative z-50 shadow-lg" role="alert">
          <strong className="font-bold">エラー: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}
    </>
  );
};

export default App;
