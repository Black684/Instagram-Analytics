import { useState } from 'react';

function ReelForm({ onSubmit, loading }) {
  const [url, setUrl] = useState('');

  function handleSubmit(event) {
    event.preventDefault();

    if (!url.trim()) {
      return;
    }

    onSubmit(url.trim());
  }

  return (
    <form className="reel-form" onSubmit={handleSubmit}>

      <div className="reel-form__row">
        <input
          id="instagram-url"
          type="url"
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          placeholder="https://www.instagram.com/reels/..."
          disabled={loading}
          required
        />

        <button
          type="submit"
          disabled={loading || !url.trim()}
        >
          {loading ? 'Проверяем...' : 'Проверить'}
        </button>
      </div>
    </form>
  );
}

export default ReelForm;