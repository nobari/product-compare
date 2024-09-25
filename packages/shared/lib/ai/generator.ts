import { ChatCompletionStream } from 'openai/lib/ChatCompletionStream';
import { ProductList, Result, settingStorage } from '../storages';
import { productToString } from '../tools/parser';
import OpenAI from 'openai';
import {
  ChatCompletion,
  ChatCompletionCreateParamsBase,
  ChatCompletionMessageParam,
} from 'openai/resources/chat/completions';

export class OpenAIChatGenerator {
  private static instance: OpenAIChatGenerator;
  private openai: OpenAI;
  private model: ChatCompletionCreateParamsBase['model'] = 'gpt-4o';
  private temperature: ChatCompletionCreateParamsBase['temperature'] = 1;

  private constructor(apiKey: string) {
    this.openai = new OpenAI({
      apiKey,
      dangerouslyAllowBrowser: true,
    });
  }
  setApiKey(apiKey: string) {
    this.openai = new OpenAI({
      apiKey,
      dangerouslyAllowBrowser: true,
    });
  }
  static validateApiKey = async (apiKey: string): Promise<boolean> => {
    try {
      const res = await new OpenAI({
        apiKey,
        dangerouslyAllowBrowser: true,
      }).chat.completions.create({
        model: 'chatgpt-4o-latest',
        messages: [{ role: 'user', content: 'Say Ok' }],
      });
      console.log(res);
      settingStorage.setOne('openAIKey', apiKey);
      OpenAIChatGenerator.instance = new OpenAIChatGenerator(apiKey);
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  };
  public static async getInstance(): Promise<OpenAIChatGenerator> {
    const setting = await settingStorage.get();
    let apiKey = setting.openAIKey;
    if (!apiKey) {
      let valid = false;
      while (!valid) {
        ({ valid, apiKey } = await OpenAIChatGenerator.validateAndSetApiKey());
      }
      if (!valid) {
        throw new Error('OpenAI key is not set');
      }
    }
    if (!OpenAIChatGenerator.instance) {
      OpenAIChatGenerator.instance = new OpenAIChatGenerator(apiKey!);
    }
    return OpenAIChatGenerator.instance;
  }

  public setModel(model: ChatCompletionCreateParamsBase['model']) {
    this.model = model;
  }

  public setTemperature(temperature: ChatCompletionCreateParamsBase['temperature']) {
    this.temperature = temperature;
  }

  private _getListOfProducts(products: ProductList, prompt: string) {
    const productList = products.map(product => `{${productToString(product)}}`).join(',\n');
    return `Here are ${products.length} Amazon products. ${prompt}:
    [
      ${productList}
    ]
    `;
  }
  public getPayloadForCompare(
    products: ProductList,
    prompt = 'Please compare them with tables based on their provided information in a holistic way',
  ) {
    const payloadMessages: ChatCompletionMessageParam[] = [
      {
        role: 'system',
        content:
          'You are professional Amazon product comparison assistant. When referring to a product only and only write their id instead of title.',
      },
      {
        role: 'user',
        content: this._getListOfProducts(products, prompt),
      },
    ];
    return payloadMessages;
  }
  public getPayloadForChat(products: ProductList, results: Result[]) {
    const payloadMessages = this.getPayloadForCompare(
      products,
      'Please use these products as reference for your response',
    );
    for (const result of results.filter(r => r.type != 'compare')) {
      payloadMessages.push({
        role: result.type === 'user' ? 'user' : 'assistant',
        content: result.data,
      });
    }
    return payloadMessages;
  }
  stream: ChatCompletionStream | undefined;

  public stopStream = () => {
    console.log('stream is: ', this.stream);
    if (this.stream) {
      this.stream.abort();
      return true;
    }
    return false;
  };
  public static validateAndSetApiKey = async (apiKey?: string): Promise<{ valid: boolean; apiKey: string }> => {
    if (!apiKey) {
      const res = window.prompt(
        'Please enter a valid API key. You can get it from https://platform.openai.com/api-keys',
      );
      if (!res) {
        if (
          !window.confirm(
            'Do you want to continue? The key is only and only stored in your browser and never transferred to anywhere except OpenAI. The code is open source and you can check it on GitHub.',
          )
        ) {
          throw new Error('OpenAI key is not set');
        }
        return await OpenAIChatGenerator.validateAndSetApiKey();
      }
      apiKey = res;
    }
    const valid = await OpenAIChatGenerator.validateApiKey(apiKey);
    return { valid, apiKey };
  };
  public async *generateChatCompletions(
    payloadMessages: ChatCompletionMessageParam[],
  ): AsyncGenerator<string, ChatCompletion | undefined> {
    let chatCompletion: ChatCompletion | undefined;
    try {
      this.stream = await this.openai.beta.chat.completions.stream({
        model: this.model,
        temperature: this.temperature,
        messages: payloadMessages,
        stream: true,
      });

      // let responseText = '';
      for await (const chunk of this.stream) {
        const text = chunk.choices[0]?.delta?.content || '';
        yield text;
        // responseText += text;
      }

      chatCompletion = await this.stream.finalChatCompletion();
      console.log(chatCompletion);
    } catch (e: any) {
      //if incorrect api key, just return empty string
      if (e.status === 401) {
        while (!(await OpenAIChatGenerator.validateAndSetApiKey()).valid) {
          //do nothing
        }
        // return this.generateChatCompletions(payloadMessages);
      }
      console.error(e);
    }
    return chatCompletion;
  }
}
