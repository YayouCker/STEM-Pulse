import { GoogleGenAI } from "@google/genai";
import { NewsResponse, StemCategory, GroundingSource, Article } from "../types";

const API_KEY = process.env.API_KEY || '';

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const fetchStemNews = async (
  category: StemCategory | string, 
  customQuery?: string,
  userInterests: string[] = []
): Promise<NewsResponse> => {
  const modelId = 'gemini-2.5-flash';

  let prompt = '';
  
  const baseInstruction = `
    You are a STEM News Aggregator. 
    Your goal is to find the latest (last 7 days), most significant news.
    
    CRITICAL FORMATTING INSTRUCTIONS:
    - You MUST separate each distinct article with a horizontal rule: "---"
    - For each article, use the following format STRICTLY:
    
    ### [CATEGORY_NAME] Article Title Here
    **Summary**: Write a 2-3 sentence high-quality summary here, highlighting key findings or developments.
    **Source**: [Domain Name](URL)
    **Tags**: Tag1, Tag2, Tag3
    **Time**: X min read
    
    (Then provide a 1-2 paragraph technical digest of the news. Be informative and specific).
    
    ---
    
    (Next Article...)
    
    Categories MUST be one of: Mathematics, Physics, Chemistry, Biology, Computer Science, Data Science, Engineering, Astronomy.
    Tags should be relevant sub-topics.
    Time should be an estimate reading time for your generated digest.
  `;

  if (customQuery) {
    prompt = `${baseInstruction}
    
    Search for news regarding: "${customQuery}".
    Find 3-5 top stories.
    `;
  } else if (category === StemCategory.MY_FEED) {
    const interestsString = userInterests.length > 0 ? userInterests.join(', ') : 'General STEM Science and Technology';
    prompt = `${baseInstruction}
    
    Focus specifically on the user's interests: ${interestsString}.
    Prioritize articles that match these sub-topics.
    Find 5-7 high-impact stories.
    `;
  } else {
    prompt = `${baseInstruction}
    
    Focus on the field of: **${category}**.
    Find 4-6 distinct, high-impact stories.
    `;
  }

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction: "You are a specialized science communicator. Always categorize articles accurately. Always provide a brief 2-3 sentence summary at the top of each item.",
      },
    });

    const text = response.text || "No content generated.";
    
    // Parse Sources
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources: GroundingSource[] = chunks
      .map((chunk: any) => {
        if (chunk.web) {
          return {
            title: chunk.web.title,
            uri: chunk.web.uri,
            source: 'Web'
          };
        }
        return null;
      })
      .filter((s: any): s is GroundingSource => s !== null);

    const uniqueSources = Array.from(new Map(sources.map(item => [item.uri, item])).values());

    // Parse Articles
    const articles: Article[] = text.split('---')
      .map(chunk => chunk.trim())
      .filter(chunk => chunk.length > 50)
      .map((chunk, index) => {
        const titleMatch = chunk.match(/### \[(.*?)\] (.*)/);
        const summaryMatch = chunk.match(/\*\*Summary\*\*: (.*)/);
        const sourceMatch = chunk.match(/\*\*Source\*\*: \[(.*?)\]\((.*)\)/); // Try to capture explicit source link
        const tagsMatch = chunk.match(/\*\*Tags\*\*: (.*)/);
        const timeMatch = chunk.match(/\*\*Time\*\*: (.*)/);
        
        // Clean Body
        let body = chunk
          .replace(/### \[(.*?)\] (.*)/, '')
          .replace(/\*\*Summary\*\*: (.*)/, '')
          .replace(/\*\*Source\*\*: (.*)/, '')
          .replace(/\*\*Tags\*\*: (.*)/, '')
          .replace(/\*\*Time\*\*: (.*)/, '')
          .trim();

        const category = titleMatch ? titleMatch[1] : 'General';
        let title = titleMatch ? titleMatch[2] : 'Scientific Update';
        
        // Fix: If title starts with the category name (e.g. "Chemistry Century-Old..."), 
        // ensure there is a colon separator to fix formatting issues.
        if (title.toLowerCase().startsWith(category.toLowerCase())) {
          const remainder = title.substring(category.length);
          // If the next character is not a common separator (colon, hyphen), insert a colon
          if (remainder.trim().length > 0 && !/^[.:\-]/.test(remainder.trim())) {
             title = `${category}: ${remainder.trim()}`;
          }
        }

        return {
          id: `${Date.now()}-${index}-${Math.random().toString(36).substr(2, 9)}`,
          title,
          category,
          summary: summaryMatch ? summaryMatch[1] : '',
          sourceName: sourceMatch ? sourceMatch[1] : undefined,
          sourceUrl: sourceMatch ? sourceMatch[2] : undefined,
          tags: tagsMatch ? tagsMatch[1].split(',').map(t => t.trim()) : [],
          readTime: timeMatch ? timeMatch[1] : '2 min read',
          body,
          timestamp: new Date().toISOString()
        };
      });

    return {
      articles,
      sources: uniqueSources,
      timestamp: new Date(),
      category: customQuery ? `Search: ${customQuery}` : category,
    };

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to fetch news. Please check your connection or API key.");
  }
};