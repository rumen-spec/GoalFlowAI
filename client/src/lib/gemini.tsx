import { GoogleGenAI } from "@google/genai";
import { Goal, GeneratedPlan } from "../lib/types"

const genAI = new GoogleGenAI({ apiKey: "AIzaSyB00zyRYAiksRyyI4eNtkg69gLY89D3efI" });

const hoursMap = new Map();
hoursMap.set('low', 2);
hoursMap.set('medium', 5);
hoursMap.set('high', 7);

export async function generatePlanTimeline(goal: Goal) {
    try {
      const now = new Date();

      
      const prompt = `
        Create a detailed learning plan for the goal: "${goal.title}". 
        The user can commit about ${hoursMap.get(goal.commitmentLevel)} hours per week (commitment level: ${goal.commitmentLevel}).
        
        Provide the plan with:
        1. A title and brief description of the overall plan
        2. An appropriate timeframe in weeks based on the goal complexity and commitment level
        3. Start date (today: ${now.toISOString().split('T')[0]}) and estimated end date
        4. A list of tasks with their details
        
        Format your response as a JSON object with this structure:
        {
          "goal": {
            "title": "string",
            "commitmentLevel": ${goal.commitmentLevel},
            "outputFormat": "TIMELINE"
          },
          "tasks": [
            {
              "title": "string" ,
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

      const response = await genAI.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt,
      });

      const jsonString = response.text?.replace(/^```json\s*/, "").replace(/\s*```$/, "");
      if (jsonString) {
        const parsedData: GeneratedPlan = JSON.parse(jsonString);

        // Optional: Convert `dueDate`, `startDate`, and `endDate` to Date objects
        parsedData.tasks.forEach(task => task.dueDate = new Date(task.dueDate).toISOString());
        parsedData.startDate = new Date(parsedData.startDate).toISOString();
        parsedData.endDate = new Date(parsedData.endDate).toISOString();
      

        console.log(parsedData);
        return parsedData;
      }

    } catch (error) {
      console.error("Error generating plan:", error);
    //   throw new Error("Failed to generate plan. Please try again later.");
    }
}


