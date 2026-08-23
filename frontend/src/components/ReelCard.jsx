function ReelCard({ reel, onDelete }) {
  async function handleDelete() {
    const confirmed = window.confirm(
      'Удалить этот Reel из базы данных?'
    );

    if (!confirmed) {
      return;
    }

    await onDelete(reel.id);
  }

  return (
    <article className="reel-card">
      <div className="reel-card__media">
        <img
          className="reel-card__thumbnail"
          src={reel.thumbnail}
          alt={`Reel пользователя ${reel.username}`}
        />

        {reel.duration && (
          <span className="reel-card__duration">
            {Math.round(reel.duration)} сек
          </span>
        )}
      </div>

      <div className="reel-card__content">
        <div className="reel-card__top">
          <div className="reel-card__author">
            <img
              className="reel-card__avatar"
              src={reel.avatar}
              alt=""
            />

            <div className="reel-card__author-info">
              <h2>{reel.name || reel.username}</h2>
              <span>@{reel.username}</span>
            </div>
          </div>

          <button
            type="button"
            className="reel-card__delete"
            onClick={handleDelete}
            title="Удалить Reel"
            aria-label="Удалить Reel"
          >
            ×
          </button>
        </div>

        {reel.caption && (
          <p className="reel-card__caption">
            {reel.caption}
          </p>
        )}

        <div className="reel-card__stats">
          <div className="reel-card__stat">
            <strong>
              {reel.views.toLocaleString('ru-RU')}
            </strong>
            <span>Просмотры</span>
          </div>

          <div className="reel-card__stat">
            <strong>
              {reel.likes.toLocaleString('ru-RU')}
            </strong>
            <span>Лайки</span>
          </div>

          <div className="reel-card__stat">
            <strong>
              {reel.comments.toLocaleString('ru-RU')}
            </strong>
            <span>Комментарии</span>
          </div>
        </div>

        {reel.publishedAt && (
          <p className="reel-card__date">
            {new Date(reel.publishedAt).toLocaleDateString('ru-RU')}
          </p>
        )}
      </div>
    </article>
  );
}

export default ReelCard;