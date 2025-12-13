export interface ValidationResult {
  isValid: boolean;
  error: string | null;
}

export function validatePollQuestion(question: string): ValidationResult {
  if (!question || typeof question !== 'string') {
    return {
      isValid: false,
      error: 'Question is required'
    };
  }

  const trimmedQuestion = question.trim();

  if (trimmedQuestion.length === 0) {
    return {
      isValid: false,
      error: 'Question cannot be empty'
    };
  }

  if (trimmedQuestion.length > 200) {
    return {
      isValid: false,
      error: 'Question must be 200 characters or less'
    };
  }

  return {
    isValid: true,
    error: null
  };
}

export function validatePollOptions(options: string[]): ValidationResult {
  if (!Array.isArray(options)) {
    return {
      isValid: false,
      error: 'Options must be an array'
    };
  }

  if (options.length < 2) {
    return {
      isValid: false,
      error: 'At least 2 options are required'
    };
  }

  if (options.length > 10) {
    return {
      isValid: false,
      error: 'Maximum 10 options allowed'
    };
  }

  for (let i = 0; i < options.length; i++) {
    const option = options[i];

    if (!option || typeof option !== 'string') {
      return {
        isValid: false,
        error: `Option ${i + 1} is invalid`
      };
    }

    const trimmedOption = option.trim();

    if (trimmedOption.length === 0) {
      return {
        isValid: false,
        error: `Option ${i + 1} cannot be empty`
      };
    }

    if (trimmedOption.length > 100) {
      return {
        isValid: false,
        error: `Option ${i + 1} must be 100 characters or less`
      };
    }
  }

  // Check for duplicate options
  const trimmedOptions = options.map(opt => opt.trim().toLowerCase());
  const uniqueOptions = new Set(trimmedOptions);

  if (uniqueOptions.size !== trimmedOptions.length) {
    return {
      isValid: false,
      error: 'All options must be unique'
    };
  }

  return {
    isValid: true,
    error: null
  };
}

export function validateOptionIndex(optionIndex: number, maxIndex: number): ValidationResult {
  if (typeof optionIndex !== 'number') {
    return {
      isValid: false,
      error: 'Option index must be a number'
    };
  }

  if (!Number.isInteger(optionIndex)) {
    return {
      isValid: false,
      error: 'Option index must be an integer'
    };
  }

  if (optionIndex < 0 || optionIndex >= maxIndex) {
    return {
      isValid: false,
      error: 'Invalid option index'
    };
  }

  return {
    isValid: true,
    error: null
  };
}
