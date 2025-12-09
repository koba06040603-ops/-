
export enum Difficulty {
  BASIC = '基礎',
  STANDARD = '標準',
  ADVANCED = '発展'
}

export interface LearningCard {
  id: string;
  title: string;
  goal: string;
  keyTerm: string;
  example: string;
  question: string;
  textbookPage: string;
  hint: string;
  answer: string;
}

export interface Course {
  name: string;
  difficulty: Difficulty;
  description: string;
  cards: LearningCard[];
}

export interface CoursePreview {
  catchphrase: string;
  exampleProblem: string;
  connection: string;
}

export interface ChoiceProblem {
  title: string;
  type: 'creation' | 'research' | 'practice';
  description: string;
}

export interface ScheduleItem {
  hour: number;
  content: string;
  goal: string;
  textbookRef?: string;
}

export interface Zone {
  name: string;
  icon: string;
  description: string;
  items: string[];
}

export interface TestQuestion {
  question: string;
  answer: string;
  points: number;
}

export interface CheckTest {
  title: string;
  instruction: string;
  questions: TestQuestion[];
}

export interface EvaluationCriteria {
  knowledge: string;
  thinking: string;
  attitude: string;
}

export interface TeacherGuide {
  evaluationCriteria: EvaluationCriteria;
  specialNotes: string;
}

export interface LearningSystemData {
  meta: {
    grade: string;
    subject: string;
    unit: string;
  };
  guide?: {
    unitGoal?: string;
    totalHours?: string;
    introduction?: string;
    coursePreviews?: {
      basic?: CoursePreview;
      standard?: CoursePreview;
      advanced?: CoursePreview;
    };
  };
  teacherGuide?: TeacherGuide;
  courses?: {
    basic?: Course;
    standard?: Course;
    advanced?: Course;
  };
  checkTest?: CheckTest;
  choiceProblems?: ChoiceProblem[];
  plan?: ScheduleItem[];
  environment?: Zone[];
}
