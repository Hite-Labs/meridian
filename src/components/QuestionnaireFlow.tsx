"use client";

import { useState } from "react";
import RatingInput from "./RatingInput";
import type { Question } from "@/lib/questions";

interface QuestionnaireFlowProps {
  questions: Question[];
  onComplete: (responses: Record<string, number | string>) => Promise<void>;
  completionTitle: string;
  completionSubtext: string;
  title?: string;
  subtitle?: string;
}

export default function QuestionnaireFlow({
  questions,
  onComplete,
  completionTitle,
  completionSubtext,
  title,
  subtitle,
}: QuestionnaireFlowProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, number | string>>(
    {}
  );
  const [isComplete, setIsComplete] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [textValue, setTextValue] = useState("");

  const totalQuestions = questions.length;
  const question = questions[currentIndex];
  const progress = ((currentIndex + 1) / totalQuestions) * 100;

  const currentValue =
    question?.type === "text"
      ? textValue
      : (responses[question?.key] as number) ?? null;
  const canProceed =
    question?.type === "text" ? true : currentValue !== null;

  async function handleNext() {
    if (!question) return;

    if (question.type === "text" && textValue.trim()) {
      setResponses((prev) => ({ ...prev, [question.key]: textValue.trim() }));
    }

    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex(currentIndex + 1);
      setTextValue("");
    } else {
      setIsSubmitting(true);
      const finalResponses = { ...responses };
      if (question.type === "text" && textValue.trim()) {
        finalResponses[question.key] = textValue.trim();
      }
      await onComplete(finalResponses);
      setIsComplete(true);
      setIsSubmitting(false);
    }
  }

  function handleSkip() {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex(currentIndex + 1);
      setTextValue("");
    } else {
      handleNext();
    }
  }

  if (isComplete) {
    return (
      <div className="min-h-screen bg-base flex flex-col items-center justify-center px-6 text-center">
        <div className="max-w-md">
          <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-6 h-6 text-success"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-display text-text-dark mb-3">
            {completionTitle}
          </h1>
          <p className="text-text-mid">{completionSubtext}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base flex flex-col">
      {/* Header */}
      {(title || subtitle) && (
        <div className="text-center px-6 pt-6 pb-2">
          {subtitle && (
            <p className="text-xs font-light text-text-soft uppercase tracking-wide mb-1">{subtitle}</p>
          )}
          {title && (
            <h1 className="text-base font-display text-text-dark">{title}</h1>
          )}
        </div>
      )}

      {/* Progress bar */}
      <div className="h-1 bg-base-mid">
        <div
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Question counter */}
      <div className="text-center py-4 text-sm font-light text-text-soft">
        Question {currentIndex + 1} of {totalQuestions}
      </div>

      {/* Question area */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-lg text-center">
          <h2 className="text-xl sm:text-2xl font-display italic text-text-dark mb-10 leading-relaxed">
            {question.text}
          </h2>

          {question.type === "rating" ? (
            <RatingInput
              min={question.min}
              max={question.max}
              minLabel={question.minLabel}
              maxLabel={question.maxLabel}
              value={currentValue as number | null}
              onChange={(v) =>
                setResponses((prev) => ({ ...prev, [question.key]: v }))
              }
            />
          ) : (
            <div className="w-full max-w-md mx-auto">
              <textarea
                className="w-full h-32 p-4 border border-base-mid rounded-lg text-text-dark placeholder-text-soft focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                placeholder="Share whatever feels right..."
                value={textValue}
                onChange={(e) => setTextValue(e.target.value)}
              />
              {question.optional && (
                <p className="text-sm font-light text-text-soft mt-2">
                  This is optional — feel free to skip.
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Bottom action */}
      <div className="px-6 pb-8 pt-4">
        <div className="max-w-lg mx-auto flex gap-3">
          {question.optional && (
            <button
              type="button"
              onClick={handleSkip}
              className="flex-1 py-4 rounded-xl text-text-soft font-medium text-base hover:bg-base-mid transition-colors"
            >
              Skip
            </button>
          )}
          <button
            type="button"
            onClick={handleNext}
            disabled={!canProceed || isSubmitting}
            className={`
              flex-1 py-4 rounded-xl font-medium text-base transition-all
              ${
                canProceed && !isSubmitting
                  ? "bg-accent text-text-dark hover:bg-accent-deep active:scale-[0.98]"
                  : "bg-base-mid text-text-soft cursor-not-allowed"
              }
            `}
          >
            {isSubmitting
              ? "Submitting..."
              : currentIndex === totalQuestions - 1
                ? "Submit"
                : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}
