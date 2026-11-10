"use client";

import { useEffect, useRef, useState } from "react";
import { Card } from "../ui/Card";
import gsap from "gsap";
import {
  RiCheckboxCircleFill,
  RiCloseCircleFill,
  RiSendPlaneLine,
  RiStarSmileLine,
  RiEmotionSadLine,
} from "react-icons/ri";

interface QuestionCardProps {
  prompt: string;
  options: string[];
  correctAnswer: string;
  onAnswered: (isCorrect: boolean, selectedAnswer: string) => void;
}

const optionLetters = ["A", "B", "C", "D"];

export function QuestionCard({ prompt, options, correctAnswer, onAnswered }: QuestionCardProps) {
  const [selected,  setSelected]  = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const cardRef     = useRef<HTMLDivElement>(null);
  const feedbackRef = useRef<HTMLDivElement>(null);

  const isCorrect = selected?.toLowerCase() === correctAnswer.toLowerCase();

  // Card entrance
  useEffect(() => {
    if (!cardRef.current) return;
    gsap.fromTo(cardRef.current,
      { scale: 0.94, opacity: 0, y: 20 },
      { scale: 1, opacity: 1, y: 0, duration: 0.45, ease: "back.out(1.4)" });
  }, [prompt]); // re-run when question changes

  function handleSubmit() {
    if (!selected) return;
    setSubmitted(true);

    // Option feedback animation
    document.querySelectorAll(".option-btn").forEach((el, i) => {
      const optText = options[i];
      const isSel   = optText === selected;
      const isRight = optText.toLowerCase() === correctAnswer.toLowerCase();
      if (isSel) {
        gsap.to(el, {
          scale: isCorrect ? 1.05 : 0.96,
          duration: 0.25,
          ease: isCorrect ? "back.out(2)" : "power2.out",
          yoyo: !isCorrect,
          repeat: isCorrect ? 0 : 2,
        });
      } else if (isRight && !isCorrect) {
        gsap.to(el, { scale: 1.03, opacity: 1, duration: 0.3, delay: 0.3, ease: "back.out(1.5)" });
      }
    });

    // Feedback banner bounce
    setTimeout(() => {
      if (!feedbackRef.current) return;
      gsap.fromTo(feedbackRef.current,
        { scale: 0.85, opacity: 0, y: 10 },
        { scale: 1, opacity: 1, y: 0, duration: 0.45, ease: "back.out(2)" });
    }, 80);

    onAnswered(isCorrect, selected);
  }

  return (
    <div ref={cardRef} className="overflow-hidden rounded-3xl bg-white shadow-[0_4px_20px_-4px_rgba(27,27,58,0.12)]">
      {/* Question prompt */}
      <div className="bg-gradient-to-r from-midnight to-midnight-soft p-5 text-white">
        <p className="text-xs font-bold uppercase tracking-widest text-white/40">Question</p>
        <h3 className="mt-1.5 text-lg font-extrabold leading-snug">{prompt}</h3>
      </div>

      {/* Options */}
      <div className="grid gap-3 p-5 sm:grid-cols-2">
        {options.map((option, i) => {
          const isSel   = selected === option;
          const isRight = option.toLowerCase() === correctAnswer.toLowerCase();
          const showState = submitted && (isSel || (!isCorrect && isRight));

          const baseClass = "option-btn w-full rounded-2xl border-2 p-3.5 text-left font-bold transition-all";
          const stateClass = showState
            ? isSel && isCorrect
              ? "border-mint bg-mint-soft text-midnight"
              : isSel && !isCorrect
              ? "border-sun bg-sun-soft text-midnight"
              : isRight && !isCorrect
              ? "border-mint/60 bg-mint-soft/60 text-midnight"
              : "border-lavender bg-white text-midnight/40"
            : isSel
            ? "border-lumora bg-lavender text-lumora"
            : "border-lavender/60 bg-white text-midnight hover:border-lumora hover:bg-lavender/40";

          const showIcon = submitted && (isSel || (!isCorrect && isRight));

          return (
            <button
              key={option}
              disabled={submitted}
              onClick={() => setSelected(option)}
              className={`${baseClass} ${stateClass}`}
            >
              <div className="flex items-center gap-3">
                <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-xl text-xs font-extrabold ${
                  isSel && !submitted ? "bg-lumora text-white" : "bg-lavender/60 text-midnight/50"
                }`}>
                  {optionLetters[i]}
                </span>
                <span className="flex-1 text-sm">{option}</span>
                {showIcon && (
                  isSel && isCorrect ? <RiCheckboxCircleFill size={18} className="shrink-0 text-mint" /> :
                  isSel && !isCorrect ? <RiCloseCircleFill size={18} className="shrink-0 text-sun" /> :
                  !isCorrect && isRight ? <RiCheckboxCircleFill size={18} className="shrink-0 text-mint/60" /> : null
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Submit / feedback */}
      <div className="px-5 pb-5">
        {!submitted ? (
          <button
            onClick={handleSubmit}
            disabled={!selected}
            className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-lumora to-lumora-light py-3 text-sm font-extrabold text-white shadow-[0_4px_12px_rgba(108,92,231,0.3)] transition-all hover:shadow-[0_6px_16px_rgba(108,92,231,0.4)] disabled:opacity-40 disabled:shadow-none"
          >
            <RiSendPlaneLine size={16} />
            Check answer
          </button>
        ) : (
          <div ref={feedbackRef}
            className={`flex items-center gap-3 rounded-2xl p-3.5 ${
              isCorrect ? "bg-mint-soft" : "bg-sun-soft"
            }`}
          >
            {isCorrect
              ? <RiStarSmileLine size={22} className="shrink-0 text-mint" />
              : <RiEmotionSadLine size={22} className="shrink-0 text-sun" />
            }
            <p className="text-sm font-extrabold text-midnight">
              {isCorrect
                ? "Great job! You've got this! 🎉"
                : "Not quite — keep going, you'll get it! 💪"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
