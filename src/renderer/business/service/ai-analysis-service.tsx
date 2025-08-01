import { ChatPromptTemplate } from "@langchain/core/prompts";
import useLog from "../../../common/utils/logger/logger-service";
import { AppContextType } from "../../context/application-context";
import { useModelProvider } from "../provider/model-provider";
import { ANALYSIS_PROMPT_TEMPLATE } from "../provider/prompt-template-provider";

export interface AiAnalysisService {
  analyze: (message: string) => AsyncGenerator<string, void, unknown>;
}

export const useAiAnalysisService = (applicationStatusStore: AppContextType): AiAnalysisService => {
  const { log } = useLog("useAiAnalysisService");

  const analyze = async function* (message: string) {
    log.debug("Starting AI analysis for message: ", message);

    if (!message) {
      throw new Error("No message provided for analysis.");
    }

    if (!applicationStatusStore.apiKey) {
      throw new Error("API key is required. Use the settings to register it.");
    }

    const model = useModelProvider().getModel();
    if (!model) {
      return;
    }
    const chain = ChatPromptTemplate.fromTemplate(ANALYSIS_PROMPT_TEMPLATE).pipe(model);
    const streamResponse = await chain.stream({ context: message });

    for await (const chunk of streamResponse) {
      if (chunk?.content) {
        yield String(chunk.content);
      }
    }
  };

  return { analyze };
};
