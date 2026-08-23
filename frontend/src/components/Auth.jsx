import { useState } from 'react';

function Auth({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setLoading(true);
      setError('');

      const endpoint = isRegister
        ? '/api/auth/register'
        : '/api/auth/login';

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}${endpoint}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || 'Произошла ошибка'
        );
      }

      localStorage.setItem('token', data.token);

      onLogin(data.user);

    } catch (error) {
      console.error('Auth error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth">
      <div className="auth__card">
        <p className="dashboard__eyebrow">
          PifPaf Bloggers
        </p>

        <h1>
          {isRegister
            ? 'Создать аккаунт'
            : 'Войти в аккаунт'}
        </h1>

        <p className="auth__description">
          {isRegister
            ? 'Создайте аккаунт блогера и управляйте своими Reels.'
            : 'Войдите, чтобы открыть свой Dashboard.'}
        </p>

        <form onSubmit={handleSubmit}>
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              placeholder="you@example.com"
              required
            />
          </label>

          <label>
            Пароль
            <input
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              placeholder="Минимум 6 символов"
              required
              minLength={6}
            />
          </label>

          {error && (
            <div className="error">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? 'Загрузка...'
              : isRegister
                ? 'Зарегистрироваться'
                : 'Войти'}
          </button>
        </form>

        <button
          type="button"
          className="auth__switch"
          onClick={() => {
            setIsRegister(!isRegister);
            setError('');
          }}
        >
          {isRegister
            ? 'Уже есть аккаунт? Войти'
            : 'Нет аккаунта? Зарегистрироваться'}
        </button>
      </div>
    </main>
  );
}

export default Auth;