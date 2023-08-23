import { NextResponse } from "next/server";
import { Configuration, OpenAIApi } from "openai";
import pgml from "pgml-test";

let collection_name = process.env.COLLECTION || "";
let pipeline_name = process.env.PIPELINE || "";
let model_params = process.env.MODEL_PARAMS || "";
let base_prompt = process.env.BASE_PROMPT || "";
let openai_api_key = process.env.OPENAI_API_KEY || "";
let system_prompt = process.env.SYSTEM_PROMPT || "";

const build_prompt = (question: string, context: string): string => {
  return base_prompt
    .replace("{context}", context)
    .replace("{question}", question);
};

export async function POST(req: Request) {
  if (req.method !== "POST") {
    return NextResponse.json(
      { message: "Only POST requests allowed" },
      { status: 405 },
    );
  }
  let data = await req.json();
  let question = data.question;

  let collection = pgml.newCollection(collection_name);
  let pipeline = pgml.newPipeline(pipeline_name);
  let context = await collection
    .query()
    .vector_recall(question, pipeline, JSON.parse(model_params))
    .limit(5)
    .fetch_all();
  let complete_context = context.map((c) => c[1]).join("\n");
  let prompt = build_prompt(question, complete_context);

  const configuration = new Configuration({
    apiKey: openai_api_key,
  });
  const openai = new OpenAIApi(configuration);
  
  try {
    const chat_completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: system_prompt },
        { role: "user", content: prompt },
      ],
      max_tokens: 512, 
      top_p: 0.9,
      temperature: 1.0,
    });
    return NextResponse.json({ id: Math.random(), response: chat_completion.data.choices[0].message?.content });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ id: Math.random(), response: "Error, check logs" });
  }
}
