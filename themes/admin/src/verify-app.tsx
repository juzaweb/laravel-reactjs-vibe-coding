import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Text,
  Textarea,
  Select,
  Checkbox,
  Radio,
  Switch,
  DateTimePicker,
  ColorPicker,
  MediaPlaceholder,
  EditorPlaceholder
} from './components/ui/form';

const App = () => {
  return (
    <div className="p-8 bg-gray-50 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100 font-sans max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Juzaweb Form Fields Verification</h1>

      <div className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <Text label="Full Name" name="name" placeholder="Enter your name" description="Please enter your real name" />
        <Text label="Error State" name="error_state" error="This field is required" />
        <Textarea label="Bio" name="bio" rows={4} description="Tell us about yourself" />

        <Select
          label="Status"
          name="status"
          options={[
            { value: 'published', label: 'Published' },
            { value: 'draft', label: 'Draft' }
          ]}
        />

        <div className="space-y-2">
          <Checkbox label="Is Featured" name="is_featured" defaultChecked />
          <Checkbox label="Disabled Checkbox" name="disabled_cb" disabled />
          <Radio label="Option A" name="radio_group" defaultChecked />
          <Radio label="Option B" name="radio_group" />
          <Switch label="Enable Feature" name="feature_toggle" />
        </div>

        <DateTimePicker label="Publish Date" name="publish_date" />
        <ColorPicker label="Background Color" name="bg_color" defaultValue="#3b82f6" />

        <MediaPlaceholder label="Thumbnail" name="thumbnail" />
        <EditorPlaceholder label="Content" name="content" />
      </div>
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
