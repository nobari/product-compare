import { OpenAIChatGenerator } from '../ai/generator';
import { productListStorage, resultsStorage } from '../storages';

import { useState, useRef } from 'react';

export const useGenerator = () => {
  const generator = useRef<OpenAIChatGenerator>();
  const [isGenerating, setIsGenerating] = useState(false);
  const generate = async (type: 'compare' | 'assistant' = 'compare') => {
    setIsGenerating(true);
    try {
      generator.current = await OpenAIChatGenerator.getInstance();
      const productList = await productListStorage.get();
      const results = await resultsStorage.get();
      const payload =
        type == 'assistant'
          ? generator.current.getPayloadForChat(productList, results)
          : generator.current.getPayloadForCompare(productList);
      await resultsStorage.append(type);
      let finalText = '';
      for await (const text of generator.current.generateChatCompletions(payload)) {
        finalText += text;
        await resultsStorage.updateLast(finalText);
      }
      setIsGenerating(false);
    } catch (error) {
      setIsGenerating(false);
    }
  };
  const stop = () => {
    generator.current?.stopStream();
  };
  return { generate, isGenerating, stop };
};
