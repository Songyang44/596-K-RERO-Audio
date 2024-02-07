import React, { useState } from 'react';
import "../AboutProject/AboutProject.css";

const AccordionSection = ({ title, children }) => {
    const [isOpen, setIsOpen] = useState(false);
  
    return (
      <div className="accordion-section">
        <div
          className="accordion-title"
          onClick={() => setIsOpen(!isOpen)}
        >
          {title}
          

        </div>
        {isOpen && <div className="accordion-content">{children}</div>}
      </div>
    );
  };
  

const AboutProject = ({ content }) => {
  return (
    <div>
      {content.map((item, index) => (
        <AccordionSection key={index} title={item.title}>
          {item.text}
        </AccordionSection>
      ))}
    </div>
  );
};

export default AboutProject;
