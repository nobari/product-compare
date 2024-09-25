import { useGenerator } from '../hooks/useGenerator';
import React, { useEffect } from 'react';
interface CompareActionProps extends React.HTMLAttributes<HTMLDivElement>, ReturnType<typeof useGenerator> {}

const CompareAction: React.FC<CompareActionProps> = ({ isGenerating, generate, stop, ...props }) => {
  const handleCompare = () => {
    if (isGenerating) {
      stop();
    } else {
      generate();
    }
  };
  useEffect(() => {
    const handleCompareEvent = (event: Event) => {
      console.log('compare', event);
      handleCompare();
    };

    window.addEventListener('compare', handleCompareEvent);

    return () => {
      window.removeEventListener('compare', handleCompareEvent);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isGenerating, generate, stop]);
  return (
    <div {...props}>
      <button
        className="tw-w-full tw-bg-primary tw-justify-between tw-px-4 tw-h-10 tw-rounded-2xl tw-shadow-primary-500 tw-shadow tw-flex-row tw-justify-center tw-items-center tw-inline-flex tw-font-bold hover:tw-bg-primary-5000"
        onClick={handleCompare}>
        <img src={chrome.runtime.getURL('content-ui/logo.png')} alt="Logo" className="tw-rounded-full tw-w-6 tw-h-6" />
        <span>{isGenerating ? 'Generating...' : 'Compare'}</span>
      </button>
    </div>
  );
};

export default CompareAction;
