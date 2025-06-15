import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { AIModels } from "../provider/ai-models";
import { useModelProvider } from "../provider/model-provider";
import { CONCLUSIONS_AGENT_PROMPT_TEMPLATE } from "../provider/prompt-template-provider";

export const useConclusionsAgent = (modelName: AIModels, modelApiKey: string) => {
  const model = useModelProvider().getModel({ modelName: modelName, apiKey: modelApiKey });

  const getAgent = () => {
    return (
      model &&
      createReactAgent({
        llm: model,
        tools: [],
        stateModifier: CONCLUSIONS_AGENT_PROMPT_TEMPLATE,
      })
    );
  };

  return { getAgent };
};
