
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { LearningSystemData, Difficulty } from "./types";

const cardSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    id: { type: Type.STRING },
    title: { type: Type.STRING },
    goal: { type: Type.STRING },
    keyTerm: { type: Type.STRING, description: "Clear definition of key concept." },
    example: { type: Type.STRING, description: "Step-by-step example or thinking tool." },
    question: { type: Type.STRING, description: "Practice problem(s). Max 2 sentences." },
    textbookPage: { type: Type.STRING },
    hint: { type: Type.STRING },
    answer: { type: Type.STRING }
  },
  required: ["id", "title", "goal", "keyTerm", "example", "question", "textbookPage", "hint", "answer"]
};

const courseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING },
    difficulty: { type: Type.STRING, enum: [Difficulty.BASIC, Difficulty.STANDARD, Difficulty.ADVANCED] },
    description: { type: Type.STRING },
    cards: { type: Type.ARRAY, items: cardSchema }
  },
  required: ["name", "difficulty", "description", "cards"]
};

const coursePreviewSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    catchphrase: { type: Type.STRING },
    exampleProblem: { type: Type.STRING },
    connection: { type: Type.STRING }
  },
  required: ["catchphrase", "exampleProblem", "connection"]
};

const checkTestSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING },
    instruction: { type: Type.STRING },
    questions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          question: { type: Type.STRING },
          answer: { type: Type.STRING },
          points: { type: Type.INTEGER }
        }
      }
    }
  },
  required: ["title", "instruction", "questions"]
};

const evaluationCriteriaSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    knowledge: { type: Type.STRING },
    thinking: { type: Type.STRING },
    attitude: { type: Type.STRING }
  },
  required: ["knowledge", "thinking", "attitude"]
};

const teacherGuideSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    evaluationCriteria: evaluationCriteriaSchema,
    specialNotes: { type: Type.STRING, description: "Special advice/notes for teachers handling this unit in a free-pace format." }
  },
  required: ["evaluationCriteria", "specialNotes"]
};

const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    meta: {
      type: Type.OBJECT,
      properties: {
        grade: { type: Type.STRING },
        subject: { type: Type.STRING },
        unit: { type: Type.STRING }
      }
    },
    guide: {
      type: Type.OBJECT,
      properties: {
        unitGoal: { type: Type.STRING },
        totalHours: { type: Type.STRING },
        introduction: { type: Type.STRING },
        coursePreviews: {
          type: Type.OBJECT,
          properties: {
            basic: coursePreviewSchema,
            standard: coursePreviewSchema,
            advanced: coursePreviewSchema
          },
          required: ["basic", "standard", "advanced"]
        }
      },
      required: ["unitGoal", "totalHours", "introduction", "coursePreviews"]
    },
    teacherGuide: teacherGuideSchema,
    courses: {
      type: Type.OBJECT,
      properties: {
        basic: courseSchema,
        standard: courseSchema,
        advanced: courseSchema
      },
      required: ["basic", "standard", "advanced"]
    },
    checkTest: checkTestSchema,
    choiceProblems: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          type: { type: Type.STRING, enum: ["creation", "research", "practice"] },
          description: { type: Type.STRING }
        }
      }
    },
    plan: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          hour: { type: Type.INTEGER },
          content: { type: Type.STRING },
          goal: { type: Type.STRING }
        }
      }
    },
    environment: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          icon: { type: Type.STRING },
          description: { type: Type.STRING },
          items: { type: Type.ARRAY, items: { type: Type.STRING } }
        }
      }
    }
  },
  required: ["meta", "guide", "teacherGuide", "courses"]
};

export const generateLearningSystem = async (
  grade: string, 
  subject: string, 
  unit: string,
  totalHours: number = 8,
  customRequest: string = ""
): Promise<LearningSystemData> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    Create a complete "Free-Pace Learning" package (Japanese).
    Target: ${grade} ${subject} "${unit}".
    
    IMPORTANT CONSTRAINTS:
    1. **Total Hours**: The schedule (Plan) MUST cover exactly ${totalHours} hours.
       - Hour 1: Orientation/Goal Setting.
       - Hour 2 to ${totalHours - 1}: Self-Paced Learning.
       - Hour ${totalHours}: Reflection/Summary.
    2. **Custom Request from Teacher**: ${customRequest || "None (Standard content)"}.
       - If specified, incorporate this theme (e.g., soccer, local history) into examples, questions, and the introduction.
    
    OUTPUT JSON ONLY. Concise strings.
    
    Structure:
    1. **Student Guide**: Unit Goal, Total Hours (set to ${totalHours}h), Intro, 3 Course Previews.
    2. **Teacher Guide**: Evaluation Criteria & Special Notes.
    3. **Courses** (3 tracks, 6 cards each):
       - Basic: Essentials.
       - Standard: Textbook level.
       - Advanced: Application.
    4. **Check Test**: 3-5 mandatory essential questions.
    5. **Choice Problems**: 7 items.
    6. **Plan**: Generate exactly ${totalHours} items corresponding to the class hours.
    7. **Environment**: 3 zones.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as LearningSystemData;
  } catch (error) {
    console.error("GenAI Error:", error);
    throw error;
  }
};

export const generateImage = async (prompt: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [{ text: prompt }],
    },
    config: {
      imageConfig: {
        aspectRatio: "1:1",
      }
    },
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  throw new Error("画像が生成されませんでした。");
};
