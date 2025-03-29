import { GoogleGenAI } from "@google/genai";
import { CommitmentLevel } from "../lib/types"

const genAI = new GoogleGenAI({ apiKey: "AIzaSyB00zyRYAiksRyyI4eNtkg69gLY89D3efI" });

export async function generatePlanTimeline(goal: string, hoursPerWeek: number, commitmentLevel: CommitmentLevel) {
    try {
      const now = new Date();
      
      const prompt = `
        Create a detailed learning plan for the goal: "${goal}". 
        The user can commit about ${hoursPerWeek} hours per week (commitment level: ${commitmentLevel}).
        
        Provide the plan with:
        1. A title and brief description of the overall plan
        2. An appropriate timeframe in weeks based on the goal complexity and commitment level
        3. Start date (today: ${now.toISOString().split('T')[0]}) and estimated end date
        4. A list of tasks with their details
        
        Format your response as a JSON object with this structure:
        {
          "goal": {
            "title": "string",
            "commitmentLevel": ${commitmentLevel},
            "outputFormat": "TIMELINE"
          },
          "tasks": [
            {
              "title": "string",
              "description": "string",
              "week": number,
              "completed": false,
              "dueDate": "YYYY-MM-DD"
            }
          ],
          "startDate": "YYYY-MM-DD",
          "endDate": "YYYY-MM-DD",
          "weeks": number
        }
  
        Important: Provide ONLY the JSON response, with no other text or explanation before or after it.
      `;
  
      // Try using the default model or gemini-pro
      console.log("Initializing Gemini model with API key:", process.env.GEMINI_API_KEY ? "API key exists" : "No API key found");
      
      const response = await genAI.models.generateContent({
        model: "gemini-2.0-flash",
        contents: "Explain how AI works",
      });
      const text = response.text();
      
      // Extract JSON from the response
      let jsonStr = text;
      if (text.includes('```json')) {
        // If the model wrapped the JSON in a code block, extract it
        const match = text.match(/```json\s*([\s\S]*?)\s*```/);
        if (match && match[1]) {
          jsonStr = match[1];
        }
      }
      
      try {
        const timeline = JSON.parse(jsonStr);
        return timeline;
      } catch (jsonError) {
        console.error("Error parsing JSON response:", jsonError);
        throw new Error("Failed to parse AI response. The model did not return valid JSON.");
      }
    } catch (error) {
      console.error("Error generating plan:", error);
      throw new Error("Failed to generate plan. Please try again later.");
    }
}

export async function gemini() {
  const response = await genAI.models.generateContent({
    model: "gemini-2.0-flash",
    contents: "Explain how AI works",
  });
  console.log(response.text);
}
