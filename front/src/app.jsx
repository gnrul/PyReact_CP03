import React, { useState } from 'react';
import axios from 'axios';


function UploadForm({ setFile, onUpload, error, imageUrl }) {
  return (
    <div style={{ padding: '30px' }}>
      <h2>гружу картинку</h2>
      <input 
        type="file" 
        accept="image/png, image/jpeg" 
        onChange={(e) => setFile(e.target.files[0])} 
      />
      <button onClick={onUpload} style={{ marginLeft: '10px' }}>
        Загрузить пикчу
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {imageUrl && (
        <div style={{ margin: '20px' }}>
          <h3>картинка:</h3>
          <img src={imageUrl} alt="Thumbnail" />
        </div>
      )}
    </div>
  );
}

function App() {
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState('');

  const handleUpload = async () => {
    if (!file) return alert('Выбери файл!');
    setError('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post('http://localhost:8000/upload', formData);
      setImageUrl(res.data.thumbnail_url);
    } catch (err) {
      setError(err.response?.data?.detail || 'Ошибка');
    }
  };

  return (
    <UploadForm 
      setFile={setFile} 
      onUpload={handleUpload} 
      error={error} 
      imageUrl={imageUrl} 
    />
  );
}

export default App;