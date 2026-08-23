import { useEffect, useState } from 'react';
import Header from './components/Header';
import ReelForm from './components/ReelForm';
import ReelCard from './components/ReelCard';
import Auth from './components/Auth';

function App() {
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');

    return savedUser
      ? JSON.parse(savedUser)
      : null;
  });
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState('');

  const stats = {
    reels: reels.length,

    views: reels.reduce(
      (sum, reel) => sum + Number(reel.views || 0),
      0
    ),

    likes: reels.reduce(
      (sum, reel) => sum + Number(reel.likes || 0),
      0
    ),

    comments: reels.reduce(
      (sum, reel) => sum + Number(reel.comments || 0),
      0
    ),
  };

  async function loadReels() {
    try {
      setLoading(true);
      setError('');

      const response = await fetch(
        'http://localhost:3000/api/reels',
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Не удалось загрузить Reels');
      }

      setReels(data.reels);
    } catch (error) {
      console.error('Load reels error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(url) {
    try {
      setChecking(true);
      setError('');

      const response = await fetch(
        'http://localhost:3000/api/reels',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({ url }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || 'Не удалось получить данные Reel'
        );
      }

      // После добавления/проверки заново получаем список из БД
      await loadReels();

    } catch (error) {
      console.error('Check reel error:', error);
      setError(error.message);
    } finally {
      setChecking(false);
    }
  }

  async function handleDelete(reelId) {
    try {
      setError('');

      const response = await fetch(
        `http://localhost:3000/api/reels/${reelId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || 'Не удалось удалить Reel'
        );
      }

      setReels((currentReels) =>
        currentReels.filter((reel) => reel.id !== reelId)
      );

    } catch (error) {
      console.error('Delete reel error:', error);
      setError(error.message);
    }
  }

  function handleLogin(userData) {
    localStorage.setItem(
      'user',
      JSON.stringify(userData)
    );

    setUser(userData);
  }

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    setUser(null);
    setReels([]);
  }

  async function checkAuth() {
    const token = localStorage.getItem('token');

    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        'http://localhost:3000/api/me',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Сессия истекла');
      }

      localStorage.setItem(
        'user',
        JSON.stringify(data.user)
      );

      setUser(data.user);

    } catch (error) {
      console.error('Auth check error:', error);

      localStorage.removeItem('token');
      localStorage.removeItem('user');

      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (user) {
      loadReels();
    }
  }, [user]);

  if (loading) {
    return (
      <main className="dashboard">
        <div className="dashboard__state">
          Проверяем авторизацию...
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <Auth onLogin={handleLogin} />
    );
  }

  return (

    <>
      <Header user={user} onLogout={handleLogout} />

      <main className="dashboard">
        <section className="dashboard__header">
          <div>
            <p className="dashboard__eyebrow">
              PifPaf Bloggers
            </p>

            <h1>Dashboard</h1>

            <p className="dashboard__description">
              Добавляйте Instagram Reels и отслеживайте
              основные показатели ваших публикаций.
            </p>
          </div>
        </section>

        <section className="dashboard__stats">
          <div className="stat-card">
            <span>Всего Reels</span>
            <strong>{stats.reels}</strong>
          </div>

          <div className="stat-card">
            <span>Просмотры</span>
            <strong>
              {stats.views.toLocaleString('ru-RU')}
            </strong>
          </div>

          <div className="stat-card">
            <span>Лайки</span>
            <strong>
              {stats.likes.toLocaleString('ru-RU')}
            </strong>
          </div>

          <div className="stat-card">
            <span>Комментарии</span>
            <strong>
              {stats.comments.toLocaleString('ru-RU')}
            </strong>
          </div>
        </section>

        <section className="dashboard__add">
          <h2>Добавить Reel</h2>

          <p>
            Вставьте ссылку на Instagram Reel,
            чтобы получить актуальные данные.
          </p>

          <ReelForm
            onSubmit={handleSubmit}
            loading={checking}
          />
        </section>

        {error && (
          <div className="error">
            {error}
          </div>
        )}

        <section className="dashboard__content">
          <div className="dashboard__section-header">
            <div>
              <h2>Ваши Reels</h2>
              <p>
                Все добавленные публикации из базы данных
              </p>
            </div>
          </div>

          {loading ? (
            <div className="dashboard__state">
              Загружаем Reels...
            </div>
          ) : reels.length === 0 ? (
            <div className="dashboard__state">
              <h3>Пока нет Reels</h3>
              <p>
                Добавьте первый Reel через форму выше.
              </p>
            </div>
          ) : (
            <div className="reels-grid">
              {reels.map((reel) => (
                <ReelCard
                  key={reel.id}
                  reel={reel}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}

        </section>
      </main>
    </>
  );
}

export default App;