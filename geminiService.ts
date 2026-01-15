
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { GradingResult, TaskType } from "./types";

const GRADING_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    overallSummary: { type: Type.STRING, description: "对学生写作表现的整体中文总结。" },
    totalScaleScore: { type: Type.NUMBER, description: "最终的剑桥英语量表分数 (82-140+)。" },
    overallCefrLevel: { type: Type.STRING, description: "整体 CEFR 等级 (Below A1, A1, A2, B1)。" },
    tasks: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          taskName: { type: Type.STRING, description: "例如 'Part 6' 或 'Part 7'。" },
          scores: {
            type: Type.OBJECT,
            properties: {
              content: { type: Type.NUMBER },
              organisation: { type: Type.NUMBER },
              language: { type: Type.NUMBER },
              totalRaw: { type: Type.NUMBER },
              scaleScore: { type: Type.NUMBER },
              cefrLevel: { type: Type.STRING }
            }
          },
          feedback: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                dimension: { type: Type.STRING, description: "Content (C), Organisation (O), 或 Language (L)。" },
                score: { type: Type.NUMBER },
                comments: { type: Type.STRING, description: "详细批改意见，必须使用中文。请使用 ✅ 表示优点，❌ 表示缺点或错误，并以分点列表形式呈现。" }
              }
            }
          },
          corrections: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                original: { type: Type.STRING, description: "学生写的原句。" },
                corrected: { type: Type.STRING, description: "修改后的正确句子。" },
                explanation: { type: Type.STRING, description: "为什么要这样修改的中文解释。" }
              }
            }
          },
          improvementSuggestions: {
            type: Type.ARRAY,
            items: { type: Type.STRING, description: "中文撰写的针对性提升建议。" }
          }
        }
      }
    }
  },
  required: ["overallSummary", "totalScaleScore", "overallCefrLevel", "tasks"]
};

export const gradeWriting = async (
  taskType: TaskType,
  taskImages: { prompt: string; answer: string }[]
): Promise<GradingResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  const model = "gemini-3-pro-preview";
  
  const systemInstruction = `
    你是一名资深的剑桥KET（A2 Key）写作考官。请对用户的作文进行批改和评分。
    
    1. 评分维度：
       - Content (C)：内容覆盖、相关性。
       - Organisation (O)：逻辑、连接词、结构。
       - Language (L)：词汇、语法准确度。
       
    2. 严格遵循官方评分标准：
       - 每个维度 0-5 分（整数）。
       - 换算规则（必须精准）：
         单篇满分 15：13->140(B1), 9->120(A2), 6->100(A1), 4->82(Min).
         两篇满分 30：26->140(B1), 18->120(A2), 12->100(A1), 8->82(Min).
       
    3. 反馈要求：
       - 必须全部使用【中文】。
       - 在 comments 中，使用 ✅ 和 ❌ 作为前缀来区分优点和需要改进的点。
       - 排版要清晰，分条目陈述。
       - 语气应专业、严谨且具有建设性。
  `;

  const parts: any[] = [{ text: `Task Type: ${taskType}. Analyze the provided images of prompts and student answers.` }];

  taskImages.forEach((img, index) => {
    parts.push({ text: `Task ${index + 1} Prompt:` });
    parts.push({
      inlineData: {
        mimeType: "image/jpeg",
        data: img.prompt.split(',')[1]
      }
    });
    parts.push({ text: `Task ${index + 1} Answer:` });
    parts.push({
      inlineData: {
        mimeType: "image/jpeg",
        data: img.answer.split(',')[1]
      }
    });
  });

  const response = await ai.models.generateContent({
    model,
    contents: [{ role: 'user', parts }],
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: GRADING_SCHEMA,
    }
  });

  if (!response.candidates || response.candidates.length === 0) {
    throw new Error("AI 无法生成响应，请检查图片清晰度或重试。");
  }

  const text = response.text;
  if (!text) {
    throw new Error("AI 返回了空响应。");
  }

  try {
    return JSON.parse(text);
  } catch (e) {
    console.error("Failed to parse AI response:", text);
    throw new Error("AI 返回的数据格式有误。");
  }
};
