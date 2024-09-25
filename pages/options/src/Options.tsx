import '@src/Options.css';
import {
  useStorageSuspense,
  withErrorBoundary,
  withSuspense,
  settingStorage,
  Setting,
} from '@chrome-extension-boilerplate/shared';
import { useRef, useState } from 'react';
import FieldWrapper from './FieldWrapper';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { OpenAIChatGenerator } from '@chrome-extension-boilerplate/shared/lib/ai/generator';
import ChatDialog from '@chrome-extension-boilerplate/shared/lib/components/ChatDialog';

const Options = () => {
  const setting: Setting = useStorageSuspense(settingStorage);
  const [showPassword, setShowPassword] = useState(false);
  const OpenAiApiKeyInputRef = useRef<HTMLInputElement>(null);

  const handleOpenAiKeySubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const target = event.target as HTMLFormElement;
    const input = target.querySelector('input') as HTMLInputElement;
    const value = input.value;
    settingStorage.set({
      ...setting,
      openAIKey: value,
    });

    if (OpenAiApiKeyInputRef.current) {
      const isOpenApiKeyValid: boolean = await OpenAIChatGenerator.validateApiKey(value);
      if (isOpenApiKeyValid) {
        settingStorage.setOne('openAIKey', value);
        alert(`api key is valid and saved`);
      } else {
        alert(`api key is invalid`);
      }
    }
  };

  return (
    <div
      className="App-container"
      style={
        {
          // backgroundColor: theme === 'light' ? '#eee' : '#222',
        }
      }>
      <ChatDialog
        HeaderComponent={() => (
          <FieldWrapper
            title="Open AI Key"
            description="You can get your Open AI key from https://platform.openai.com/api-keys"
            onSubmit={handleOpenAiKeySubmit}>
            <div className="tw-flex tw-gap-2 tw-items-center">
              <div className="tw-relative tw-w-full">
                <input
                  required
                  // pattern="^(sk(-proj)?-[a-zA-Z0-9]{48})$" seems the cases are more than this
                  ref={OpenAiApiKeyInputRef}
                  placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                  defaultValue={setting.openAIKey}
                  type={showPassword ? 'text' : 'password'}
                  className="form-control"
                />

                <button
                  type="button"
                  className="tw-absolute tw-right-4 tw-top-1/2 tw-transform -tw-translate-y-1/2 tw-outline-none tw-cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <AiOutlineEyeInvisible size={18} /> : <AiOutlineEye size={18} />}
                </button>
              </div>
              <button type="submit" className="btn btn-primary">
                Update
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => {
                  settingStorage.set({
                    ...setting,
                    openAIKey: '',
                  });
                }}>
                Clear
              </button>
            </div>
          </FieldWrapper>
        )}
      />
    </div>
  );
};

// const ToggleButton = (props: ComponentPropsWithoutRef<'button'>) => {
//   const theme = useStorageSuspense(themeStorage);
//   return (
//     <button
//       className={
//         props.className +
//         ' ' +
//         'font-bold mt-4 py-1 px-4 rounded shadow hover:scale-105 ' +
//         (theme === 'light' ? 'tw-bg-white tw-text-black' : 'tw-bg-black tw-text-white')
//       }
//       onClick={themeStorage.toggle}>
//       {props.children}
//     </button>
//   );
// };

export default withErrorBoundary(withSuspense(Options, <div> Loading ... </div>), <div> Error Occur </div>);
