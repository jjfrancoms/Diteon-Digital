export type ActionType = 'demo' | 'diagnostic' | 'custom_proposal';

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface FormSubmissionState {
  isSubmitting: boolean;
  isSuccess: boolean;
  message: string;
  error?: string;
}


