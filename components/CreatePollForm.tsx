'use client';

import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { validatePollQuestion, validatePollOptions } from '@/lib/validators';

interface CreatePollFormProps {
  onPollCreated: (pollId: string) => void;
}

export default function CreatePollForm({ onPollCreated }: CreatePollFormProps) {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleQuestionChange = (value: string) => {
    setQuestion(value);
    setError(null);
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
    setError(null);
  };

  const addOption = () => {
    if (options.length < 10) {
      setOptions([...options, '']);
    }
  };

  const removeOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate question
    const questionValidation = validatePollQuestion(question);
    if (!questionValidation.isValid) {
      setError(questionValidation.error);
      return;
    }

    // Validate options
    const filledOptions = options.filter(opt => opt.trim().length > 0);
    const optionsValidation = validatePollOptions(filledOptions);
    if (!optionsValidation.isValid) {
      setError(optionsValidation.error);
      return;
    }

    setIsCreating(true);

    try {
      const response = await fetch('/api/polls', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          question: question.trim(),
          options: filledOptions.map(opt => opt.trim())
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create poll');
      }

      const data = await response.json();
      onPollCreated(data.pollId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create poll');
      setIsCreating(false);
    }
  };

  const isFormValid = () => {
    const trimmedQuestion = question.trim();
    const filledOptions = options.filter(opt => opt.trim().length > 0);
    return trimmedQuestion.length > 0 && filledOptions.length >= 2;
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border-4 border-text rounded-2xl shadow-brutal-xl p-10 max-w-[680px] mx-auto"
    >
      <h2 className="text-2xl font-bold font-heading text-text mb-6">Create Your Poll</h2>

      {/* Question Input */}
      <div className="mb-6">
        <label htmlFor="question" className="block text-base font-semibold text-text mb-3">
          Poll Question
        </label>
        <textarea
          id="question"
          value={question}
          onChange={(e) => handleQuestionChange(e.target.value)}
          placeholder="What would you like to ask?"
          maxLength={200}
          rows={3}
          className="w-full bg-background border-3 border-text rounded-xl p-5 text-2xl font-semibold font-heading text-text resize-vertical transition-all focus:border-primary focus:shadow-[0_0_0_4px_rgba(255,107,53,0.15)] focus:outline-none placeholder:text-text-muted"
        />
        <div className="text-sm font-medium text-text-muted text-right mt-2">
          {question.length}/200 characters
        </div>
      </div>

      {/* Options */}
      <div className="mb-6">
        <label className="block text-base font-semibold text-text mb-3">
          Poll Options (min 2, max 10)
        </label>
        <div className="space-y-3">
          {options.map((option, index) => (
            <div key={index} className="flex gap-3">
              <input
                type="text"
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                placeholder={`Option ${index + 1}`}
                maxLength={100}
                className="flex-1 bg-white border-3 border-text rounded-lg px-5 py-4 text-lg font-medium text-text transition-all focus:border-secondary focus:shadow-[0_0_0_3px_rgba(0,78,137,0.15)] focus:outline-none placeholder:text-text-muted"
              />
              {options.length > 2 && (
                <button
                  type="button"
                  onClick={() => removeOption(index)}
                  className="bg-transparent border-2 border-error rounded-lg px-3 py-2 text-error text-sm font-semibold cursor-pointer transition-all hover:bg-error hover:text-white"
                  aria-label={`Remove option ${index + 1}`}
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Add Option Button */}
      {options.length < 10 && (
        <button
          type="button"
          onClick={addOption}
          className="bg-accent border-3 border-text rounded-lg px-7 py-3.5 text-base font-bold text-text shadow-brutal-sm cursor-pointer transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brutal-md active:translate-x-0 active:translate-y-0 active:shadow-[2px_2px_0px_rgba(10,10,10,1)] mb-6 flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Option
        </button>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border-3 border-error rounded-lg px-4 py-3 text-sm font-semibold text-text mb-6">
          {error}
        </div>
      )}

      {/* Create Button */}
      <button
        type="submit"
        disabled={!isFormValid() || isCreating}
        className="w-full bg-primary border-4 border-text rounded-xl px-12 py-5 text-xl font-bold font-heading text-white shadow-brutal-lg cursor-pointer transition-all hover:bg-primary-hover hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[11px_11px_0px_rgba(10,10,10,1)] active:translate-x-0 active:translate-y-0 active:shadow-brutal-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      >
        {isCreating ? 'Creating Poll...' : 'Create Poll'}
      </button>
    </form>
  );
}
