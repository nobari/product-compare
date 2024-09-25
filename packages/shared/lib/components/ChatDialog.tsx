import React, { useEffect, useRef, useState } from 'react';
import { useProductList, useStorageSuspense } from '../hooks';
import ChatBox from './ChatBox';
import { Result, resultsStorage } from '../storages';
import CompareAction from './CompareAction';
import { useGenerator } from '../hooks/useGenerator';
import { faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const ChatDialog: React.FC<{ HeaderComponent?: React.FC; toOpen?: boolean }> = ({ HeaderComponent, toOpen }) => {
  const results: Result[] = useStorageSuspense(resultsStorage);
  const { productList, ProductListAccordion, isOpen, setIsOpen } = useProductList();
  const [inputValue, setInputValue] = useState('');
  const { generate, isGenerating, stop } = useGenerator();

  useEffect(() => {
    setIsOpen(!!(toOpen && results.length));
  }, [toOpen, results]);

  const handleSend = async () => {
    const data = inputValue.trim();
    if (data) {
      setInputValue('');
      await resultsStorage.set([...results, { type: 'user', data }]);
      await generate('assistant');
    } else {
      window.alert('Please enter a message');
    }
  };
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    const container = document.querySelector('.tw-overflow-y-scroll');
    if (container) {
      const isBottom = container.scrollHeight - container.scrollTop === container.clientHeight;
      setShowScrollToBottom(!isBottom);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const container = document.querySelector('.tw-overflow-y-scroll');
    container?.addEventListener('scroll', handleScroll);
    return () => container?.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      scrollToBottom();
    }, 100);
  }, [results]);

  const handleRemove = (index: number) => {
    const newResults = [...results];
    newResults.splice(index, 1);
    resultsStorage.set(newResults);
  };

  return (
    <div className="tw-fixed tw-inset-0 tw-flex tw-flex-col tw-bg-gray-50 tw-p-3">
      {HeaderComponent && <HeaderComponent />}
      <div className="tw-flex-grow tw-overflow-y-scroll tw-rounded tw-mb-3 tw-border tw-border-gray-300 tw-flex-col tw-justify-between">
        <div className="tw-sticky tw-top-2 tw-z-10">
          <ProductListAccordion />
          <CompareAction
            isGenerating={isGenerating}
            generate={generate}
            stop={stop}
            className="tw-m-auto tw-w-[140px] tw-justify-center"
          />
        </div>
        {results.map((result, index) => (
          <ChatBox key={index} result={result} productList={productList} remove={() => handleRemove(index)} />
        ))}
        <div ref={messagesEndRef} />
        {showScrollToBottom && (
          <button
            className="tw-absolute tw-bottom-14 tw-right-2 tw-h-10 tw-w-10 tw-bg-white tw-text-black tw-border tw-border-black tw-rounded-full tw-shadow-lg"
            onClick={scrollToBottom}>
            <FontAwesomeIcon icon={faArrowDown} />
          </button>
        )}
      </div>
      <div className="input-group">
        <input
          type="text"
          className="form-control tw-flex-grow"
          placeholder="Ask me anything..."
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
        />
        <button className="btn btn-primary tw-ml-3" onClick={handleSend}>
          {isGenerating ? 'Generating...' : 'Send'}
        </button>
      </div>
    </div>
  );
};

export default ChatDialog;
