import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";
import { z } from "zod";
import { useModelProvider } from "../provider/model-provider";
import { SUPERVISOR_PROMPT_TEMPLATE } from "../provider/prompt-template-provider";

export const useAgentSupervisor = () => {
  const model = useModelProvider().getModel();

  const getAgent = async (subAgents: string[], subAgentResponsibilities: string[]) => {
    if (!model) {
      return;
    }
    const destinations = ["__end__", ...subAgents] as const;
    const supervisorResponseSchema = z.object({
      reflection: z.string().describe("The supervisor's reflection about the next step to take."),
      goto: z
        .enum(destinations)
        .describe(
          "The next agent to call, or __end__ if the user's query has been resolved. Must be one of the specified values.",
        ),
    });
    const prompt = ChatPromptTemplate.fromMessages([
      ["system", SUPERVISOR_PROMPT_TEMPLATE],
      new MessagesPlaceholder("messages"),
      [
        "human",
        "Given the conversation above, who should act next?" + " Or should we __end__? Select one of: {options}",
      ],
    ]);
    const formattedPrompt = await prompt.partial({
      options: destinations.join(", "),
      workerResponsibilities: subAgentResponsibilities.join(", "),
      members: subAgents.join(", "),
    });
    return formattedPrompt.pipe(model.withStructuredOutput(supervisorResponseSchema));
  };

  return { getAgent };
};
