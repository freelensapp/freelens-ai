import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { useModelProvider } from "../provider/model-provider";
import { CONCLUSIONS_AGENT_PROMPT_TEMPLATE } from "../provider/prompt-template-provider";

export const useConclusionsAgent = () => {
  const model = useModelProvider().getModel();

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
