import React from 'react';
import ContactForm from '../components/ContactForm';

const Contact = () => {
  const handleContactSubmit = (formData) => {
    console.log('Formulario enviado:', formData);
  };

  return (
    <>
      <h1>Contact</h1>
      <ContactForm submitContact={handleContactSubmit} />
    </>
  );
};

export default Contact;
