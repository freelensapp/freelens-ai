import { Main } from "@freelensapp/extensions";
import { useEffect, useRef } from "react";
import useChatService from "../../../common/service/chat-service";
import { MessageObject } from "../../business/objects/message-object";
import { MessageType } from "../../business/objects/message-type";
import { useApplicationStatusStore } from "../../context/application-context";

export interface ActionToApprove {
  action: string;
  name?: string;
  namespace?: string;
  data?: Main.K8sApi.KubeObject;
}

export const useChatHook = () => {
  const chatService = useChatService();
  const applicationStatusStore = useApplicationStatusStore();
  const containerRef = useRef<HTMLDivElement | null>(null);

  // On load scroll to bottom
  useEffect(() => {
    _scrollToBottom();
  }, []);

  // Scroll to bottom when a message is sent in the chat
  useEffect(() => {
    _scrollToBottom();
  }, [applicationStatusStore.chatMessages]);

  // Perform EXPLAIN when an explain message is sent
  useEffect(() => {
    if (applicationStatusStore.chatMessages !== null) {
      const explainMessage = applicationStatusStore.explainEvent;
      if (explainMessage && MessageType.EXPLAIN === explainMessage.type) {
        chatService.sendMessageToAgent(explainMessage);
        applicationStatusStore.setExplainEvent({} as MessageObject);
      }
    }
  }, [applicationStatusStore.chatMessages, applicationStatusStore.explainEvent]);

  const sendMessage = (message: MessageObject) => {
    chatService.sendMessageToAgent(message);
  };

  const _scrollToBottom = (withDelay: boolean = true) => {
    const el = containerRef.current;
    if (el) {
      const delay = withDelay ? 10 : 0;
      setTimeout(() => {
        el.scrollTop = el.scrollHeight;
      }, delay);
    }
  };

  return { containerRef, sendMessage };
};
