import React, { useState } from "react";

const questions = [
  {
    q: "Your body frame is:",
    options: [
      { label: "Thin, light, hard to gain weight", type: "Vata" },
      { label: "Medium, muscular, athletic", type: "Pitta" },
      { label: "Broad, heavy, easy to gain weight", type: "Kapha" },
    ],
  },
  {
    q: "Your skin tends to be:",
    options: [
      { label: "Dry, rough, cool", type: "Vata" },
      { label: "Warm, sensitive, acne-prone", type: "Pitta" },
      { label: "Smooth, oily, thick", type: "Kapha" },
    ],
  },
  {
    q: "Your energy levels feel:",
    options: [
      { label: "Variable—bursts followed by fatigue", type: "Vata" },
      { label: "Strong, intense, goal-driven", type: "Pitta" },
      { label: "Steady but slow", type: "Kapha" },
    ],
  },
  {
    q: "Your digestion pattern is:",
    options: [
      { label: "Irregular—sometimes strong, sometimes weak", type: "Vata" },
      { label: "Strong appetite, gets hungry often", type: "Pitta" },
      { label: "Slow digestion, heaviness", type: "Kapha" },
    ],
  },
  {
    q: "Your sleep pattern is:",
    options: [
      { label: "Light, interrupted", type: "Vata" },
      { label: "Average 6–8 hours", type: "Pitta" },
      { label: "Deep, long sleep", type: "Kapha" },
    ],
  },
  {
    q: "Your emotional response:",
    options: [
      { label: "Anxious, overthinking", type: "Vata" },
      { label: "Easily irritated, intense", type: "Pitta" },
      { label: "Calm but sometimes stubborn", type: "Kapha" },
    ],
  },
  {
    q: "Your climate preference:",
    options: [
      { label: "Prefers warmth, dislikes cold", type: "Vata" },
      { label: "Prefers cool climate, dislikes heat", type: "Pitta" },
      { label: "Comfortable anywhere, dislikes humidity", type: "Kapha" },
    ],
  },
  {
    q: "Your walking/talking style:",
    options: [
      { label: "Fast, restless", type: "Vata" },
      { label: "Confident, sharp", type: "Pitta" },
      { label: "Slow, calm", type: "Kapha" },
    ],
  },
  {
    q: "Your eating habits:",
    options: [
      { label: "Small portions, irregular", type: "Vata" },
      { label: "Large portions, strong appetite", type: "Pitta" },
      { label: "Regular meals, slow eating", type: "Kapha" },
    ],
  },
  {
    q: "Your mental focus is:",
    options: [
      { label: "Easily distracted", type: "Vata" },
      { label: "Sharp and focused", type: "Pitta" },
      { label: "Consistent but slow", type: "Kapha" },
    ],
  },
];

export default function DoshaQuiz({ onResult }) {
  const [answers, setAnswers] = useState({});
  const [error, setError] = useState("");

  const handleSelect = (qIndex, type) => {
    setAnswers({ ...answers, [qIndex]: type });
    setError("");
  };

  const handleSubmit = () => {
    if (Object.keys(answers).length !== questions.length) {
      setError("Please answer all questions.");
      return;
    }

    const score = { Vata: 0, Pitta: 0, Kapha: 0 };
    Object.values(answers).forEach((type) => (score[type] += 1));

    const primary = Object.keys(score).reduce((a, b) =>
      score[a] > score[b] ? a : b
    );
    const secondaryCandidates = Object.keys(score).filter((d) => d !== primary);
    const secondary =
      score[secondaryCandidates[0]] >= score[secondaryCandidates[1]]
        ? secondaryCandidates[0]
        : secondaryCandidates[1];

    onResult({ primary, secondary, score });
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-[var(--ayur-border)]">
      <h1 className="text-2xl font-semibold text-[var(--ayur-text-dark)] mb-4">
        Ayurvedic Dosha Assessment
      </h1>

      {questions.map((item, idx) => (
        <div key={idx} className="mb-6">
          <p className="font-medium mb-2 text-[var(--ayur-text-med)]">{idx + 1}. {item.q}</p>

          <div className="space-y-2">
            {item.options.map((op, i) => (
              <label
                key={i}
                className={`flex items-center gap-3 cursor-pointer p-3 rounded-lg border ${
                  answers[idx] === op.type
                    ? "border-[var(--ayur-primary)] bg-[var(--ayur-mint)]"
                    : "border-gray-300"
                }`}
              >
                <input
                  type="radio"
                  name={`q-${idx}`}
                  className="h-4 w-4"
                  checked={answers[idx] === op.type}
                  onChange={() => handleSelect(idx, op.type)}
                />
                <span className="text-sm">{op.label}</span>
              </label>
            ))}
          </div>
        </div>
      ))}

      {error && <p className="text-red-600 text-sm mb-2">{error}</p>}

      <button
        onClick={handleSubmit}
        className="mt-4 px-6 py-3 bg-[var(--ayur-primary)] text-white rounded-lg shadow-md hover:opacity-85"
      >
        Submit Quiz
      </button>
    </div>
  );
}
