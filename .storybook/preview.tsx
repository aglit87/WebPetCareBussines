import type { Preview } from '@storybook/react-vite';
import { Provider } from 'react-redux';
import { store } from '../src/app/store';
import { enableMocking } from '../src/app/providers/enableMocking';
import '../src/app/styles/global.scss';
import 'petcare-storybook-ui/style.css';

let mockingReady: Promise<unknown> | null = null;
const ensureMocking = (): Promise<unknown> => {
  if (!mockingReady) mockingReady = enableMocking();
  return mockingReady;
};

const preview: Preview = {
  parameters: {
    layout: 'padded',
    backgrounds: {
      default: 'cabinet',
      values: [
        { name: 'cabinet', value: '#eef3fa' },
        { name: 'white', value: '#ffffff' },
      ],
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: 'todo',
    },
  },
  loaders: [async () => { await ensureMocking(); return {}; }],
  decorators: [
    (Story) => (
      <Provider store={store}>
        <Story />
      </Provider>
    ),
  ],
};

export default preview;
