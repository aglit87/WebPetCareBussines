import type { Meta, StoryObj } from '@storybook/react-vite';
import { ScheduleWidget } from './ScheduleWidget';

const meta = {
  title: 'widgets/ScheduleWidget',
  component: ScheduleWidget,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: { type: 'vet' },
  argTypes: {
    type: { control: 'select', options: ['vet', 'grooming', 'boarding', 'taxi'] },
  },
} satisfies Meta<typeof ScheduleWidget>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Vet: Story = {};

export const Grooming: Story = { args: { type: 'grooming' } };
