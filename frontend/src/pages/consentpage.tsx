import React, { useState } from 'react';

export default function ConsentPage() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setPdfFile(event.target.files[0]);
    }
  };
  return (
    <div className='container p-4 mx-auto'>
      <h1 className='mb-4 text-2xl font-bold'>Consent Form</h1>

      {/* File Upload */}
      <div className='mb-4'>
        <label className='block mb-2 text-sm font-bold text-gray-700'>
          Upload Consent Form (PDF)
        </label>
        <input
          type='file'
          accept='application/pdf'
          onChange={handleFileChange}
          className='px-3 py-2 leading-tight text-gray-700 border rounded shadow focus:outline-none focus:shadow-outline'
        />
      </div>

      {/* PDF Display */}
      <div className='mb-4'>
        {/* Implement PDF display logic here */}
        {pdfFile && <p>Display PDF here...</p>}
      </div>

      {/* Signature Pad */}
      <div className='mb-4'>
        {/* Implement Signature Pad here */}
        <p>Signature Pad Placeholder</p>
      </div>
    </div>
  );
}
