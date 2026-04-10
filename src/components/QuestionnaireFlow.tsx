"use client";

import { useState } from "react";
import Link from "next/link";
import RatingInput from "./RatingInput";
import type { Question } from "@/lib/questions";

interface QuestionnaireFlowProps {
  questions: Question[];
  onComplete: (responses: Record<string, number | string>) => Promise<void>;
  completionTitle: string;
  completionSubtext: string;
  title?: string;
  subtitle?: string;
  completionHref?: string;
  completionCtaLabel?: string;
}

export default function QuestionnaireFlow({
  questions,
  onComplete,
  completionTitle,
  completionSubtext,
  title,
  subtitle,
  completionHref,
  completionCtaLabel,
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
      <div className="min-h-screen canvas-atmosphere flex flex-col items-center justify-center px-6 text-center">
        <div className="max-w-md rise rise-1">
          <div className="w-14 h-14 rounded-full bg-accent-light/60 border border-accent/30 flex items-center justify-center mx-auto mb-6 shadow-[0_8px_24px_-12px_rgba(196,154,40,0.6)]">
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="#7B5B12"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div className="eyebrow mb-3">Received</div>
          <h1 className="text-2xl sm:text-3xl font-display italic text-text-dark mb-3 leading-snug">
            {completionTitle}
          </h1>
          <p className="text-text-mid font-light">{completionSubtext}</p>
          {completionHref && (
            <Link
              href={completionHref}
              className="inline-block mt-8 px-7 py-3.5 rounded-xl font-medium text-base bg-primary-deep text-accent-light hover:bg-primary active:scale-[0.98] transition-all shadow-[0_10px_24px_-14px_rgba(60,24,104,0.7)]"
            >
              {completionCtaLabel ?? "Continue"}
            </Link>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen canvas-atmosphere flex flex-col">
      {/* Header */}
      {(title || subtitle) && (
        <div className="text-center px-6 pt-7 pb-3">
          {subtitle && (
            <p className="eyebrow mb-1.5">{subtitle}</p>
          )}
          {title && (
            <h1 className="text-lg sm:text-xl font-display italic text-text-dark">{title}</h1>
          )}
        </div>
      )}

      {/* Progress bar — gold */}
      <div className="h-[3px] bg-base-mid/70 mx-6 rounded-full overflow-hidden">
        <div
          className="h-full bg-accent transition-all duration-500 ease-out rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Question counter */}
      <div className="text-center py-4 eyebrow">
        {currentIndex + 1} of {totalQuestions}
      </div>

      {/* Question area */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-lg text-center rise rise-1" key={currentIndex}>
          <h2 className="text-2xl sm:text-3xl font-display italic text-text-dark mb-10 leading-[1.25] tracking-tight">
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
                className="w-full h-32 p-4 bg-[#FAF6F8] border border-base-mid rounded-xl text-text-dark placeholder-text-soft focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/40 resize-none shadow-[0_1px_2px_rgba(60,24,104,0.04)]"
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
              className="flex-1 py-4 rounded-xl text-text-soft font-medium text-base hover:bg-base-mid/60 transition-colors"
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
                  ? "bg-primary-deep text-accent-light hover:bg-primary active:scale-[0.98] shadow-[0_10px_24px_-14px_rgba(60,24,104,0.7)]"
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
