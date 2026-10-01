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
  {
    question: "How is accessibility tested?",
    answer:
      "Keyboard-only walkthroughs, screen reader checks and automated audits, with semantic HTML and ARIA only where it's needed.",
  },
  {
    question: "Does it work on mobile?",
    answer:
      "Yes - every layout is built mobile-first and checked at small widths, with touch targets sized for fingers rather than cursors.",
  },
  {
    question: "Is there a dark mode?",
    answer:
      "Yes - use the switch in the admin sidebar. Colours are defined as tokens, so the whole admin swaps theme in one place.",
  },
  {
    question: "Where do the images in the media library come from?",
    answer:
      "Any image dropped into the static image folder is picked up automatically at build time and named from its file name.",
  },
  {
    question: "Can I use these components in my own project?",
    answer:
      "Feel free to take inspiration - each example is a small, self-contained React component with its own styles.",
  },
  {
    question: "How do I get in touch?",
    answer:
      "Use the contact details on the homepage - I'm always happy to talk about front-end, design systems and accessibility.",
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
