import ReelForm from './ReelForm';
import ReelCard from './ReelCard';

function Dashboard({
  reels,
  stats,
  onSubmit,
  loading,
  error,
}) {
  return (
    <main className="dashboard">
      <section className="dashboard__hero">
        <div>
          <p className="dashboard__eyebrow">
            BLOGGER DASHBOARD
          </p>

          <h1>
            Добро пожаловать 👋
          </h1>

          <p className="dashboard__description">
            Отслеживайте эффективность своих Instagram Reels
            в одном месте.
          </p>
        </div>
      </section>

      <section className="dashboard__stats">
        <div className="stat-card">
          <span className="stat-card__label">
            Просмотры
          </span>

          <strong className="stat-card__value">
            {stats.views.toLocaleString('ru-RU')}
          </strong>

          <span className="stat-card__hint">
            Всего просмотров
          </span>
        </div>

        <div className="stat-card">
          <span className="stat-card__label">
            Лайки
          </span>

          <strong className="stat-card__value">
            {stats.likes.toLocaleString('ru-RU')}
          </strong>

          <span className="stat-card__hint">
            Всего лайков
          </span>
        </div>

        <div className="stat-card">
          <span className="stat-card__label">
            Комментарии
          </span>

          <strong className="stat-card__value">
            {stats.comments.toLocaleString('ru-RU')}
          </strong>

          <span className="stat-card__hint">
            Всего комментариев
          </span>
        </div>

        <div className="stat-card stat-card--accent">
          <span className="stat-card__label">
            Reels
          </span>

          <strong className="stat-card__value">
            {stats.reels}
          </strong>

          <span className="stat-card__hint">
            Загружено роликов
          </span>
        </div>
      </section>

      <section className="dashboard__add">
        <div className="section-heading">
          <div>
            <p className="section-heading__eyebrow">
              NEW REEL
            </p>

            <h2>
              Добавить Reel
            </h2>

            <p>
              Вставьте ссылку на Instagram Reel,
              чтобы получить актуальную статистику.
            </p>
          </div>
        </div>

        <ReelForm
          onSubmit={onSubmit}
          loading={loading}
        />

        {error && (
          <p className="error">
            {error}
          </p>
        )}
      </section>

      <section className="dashboard__reels">
        <div className="section-heading section-heading--row">
          <div>
            <p className="section-heading__eyebrow">
              CONTENT
            </p>

            <h2>
              Ваши Reels
            </h2>

            <p>
              Последние добавленные публикации.
            </p>
          </div>

          <span className="section-heading__count">
            {reels.length} роликов
          </span>
        </div>

        {reels.length > 0 ? (
          <div className="reels-grid">
            {reels.map((reel) => (
              <ReelCard
                key={reel.instagramId}
                reel={reel}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state__icon">
              +
            </div>

            <h3>
              Пока нет Reels
            </h3>

            <p>
              Добавьте первый ролик через форму выше.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}

export default Dashboard;