import React, { useId, useState } from "react";

const faqs = [
  {
    question: "What stack is this site built with?",
    answer: "React, React Router and Sass, deployed to Netlify from GitHub.",
  },
  {
    question: "Is this CMS connected to a database?",
    answer:
      "No - it's a front-end showcase. Edits are kept in your browser so you can see them on the homepage.",
  },
  {
    question: "Why build the admin at all?",
    answer:
      "Admin interfaces are where UI work gets hard: dense forms, navigation, states and accessibility.",
  },
];

function AccordionItem({ question, answer, isOpen, onToggle }) {
  const id = useId();
  return (
    <div className="sc-accordion__item">
      <h3 className="sc-accordion__heading">
        <button
          type="button"
          className="sc-accordion__trigger"
          aria-expanded={isOpen}
          aria-controls={`${id}-panel`}
          id={`${id}-trigger`}
          onClick={onToggle}
        >
          {question}
          <span className="material-icons" aria-hidden="true">
            expand_more
          </span>
        </button>
      </h3>
      <div
        className="sc-accordion__panel"
        id={`${id}-panel`}
        role="region"
        aria-labelledby={`${id}-trigger`}
        hidden={!isOpen}
      >
        <p>{answer}</p>
      </div>
    </div>
  );
}

export default function AccordionDemo() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="sc-accordion">
      {faqs.map((faq, index) => (
        <AccordionItem
          key={faq.question}
          {...faq}
          isOpen={openIndex === index}
          onToggle={() => setOpenIndex(openIndex === index ? null : index)}
        />
      ))}
    </div>
  );
}
