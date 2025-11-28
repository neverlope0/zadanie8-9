"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function SignInPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  const message = searchParams.get('message');
  const callbackUrl = searchParams.get('callbackUrl') || '/profile';

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (error) {
      switch (error) {
        case 'OAuthAccountNotLinked':
          setErrorMessage('Этот аккаунт OAuth не привязан к существующему пользователю. Попробуйте другой способ входа или зарегистрируйтесь.');
          break;
        case 'EmailNotVerified':
          setErrorMessage('Email не подтвержден. Пожалуйста, проверьте вашу почту и подтвердите email перед входом.');
          break;
        case 'CredentialsSignin':
          setErrorMessage('Неверный email или пароль.');
          break;
        case 'Callback':
          setErrorMessage('Произошла ошибка при входе через OAuth. Попробуйте еще раз.');
          break;
        default:
          setErrorMessage(`Произошла ошибка: ${error}`);
      }
    }

    if (message) {
      switch (message) {
        case 'Registration successful':
          setSuccessMessage('Регистрация успешна! Теперь вы можете войти.');
          break;
        default:
          setSuccessMessage(message);
      }
    }
  }, [error, message]);

  const handleOAuthSignIn = (provider) => {
    signIn(provider, { callbackUrl });
  };

  const handleCredentialsSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      const result = await signIn('credentials', {
        email: credentials.email,
        password: credentials.password,
        redirect: false,
        callbackUrl
      });

      if (result?.error) {
        setErrorMessage('Неверный email или пароль');
      } else {
        window.location.href = callbackUrl;
      }
    } catch (error) {
      setErrorMessage('Произошла ошибка при входе');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            Вход в систему
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Выберите способ входа
          </p>
        </div>

        {errorMessage && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{errorMessage}</p>
              </div>
            </div>
          </div>
        )}

        {successMessage && (
          <div className="bg-green-50 border border-green-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700">{successMessage}</p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <button
            onClick={() => handleOAuthSignIn("google")}
            className="w-full flex justify-center items-center px-4 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            {/* SVG иконка Google */}
            Продолжить с Google
          </button>

          <button
            onClick={() => handleOAuthSignIn("github")}
            className="w-full flex justify-center items-center px-4 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            {/* SVG иконка GitHub */}
            Продолжить с GitHub
          </button>

          <button
            onClick={() => handleOAuthSignIn("yandex")}
            className="w-full flex justify-center items-center px-4 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            {/* SVG иконка Yandex */}
            Продолжить с Яндекс
          </button>
        </div>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Или</span>
          </div>
        </div>

        <form onSubmit={handleCredentialsSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Email"
              value={credentials.email}
              onChange={(e) => setCredentials(prev => ({...prev, email: e.target.value}))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Пароль"
              value={credentials.password}
              onChange={(e) => setCredentials(prev => ({...prev, password: e.target.value}))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
          >
            {loading ? 'Вход...' : 'Войти с email и паролем'}
          </button>
        </form>

        <div className="text-center space-y-2">
          <Link
            href="/auth/forgot-password"
            className="text-sm text-blue-600 hover:text-blue-500 block"
          >
            Забыли пароль?
          </Link>
          <Link
            href="/auth/register"
            className="text-sm text-blue-600 hover:text-blue-500 block"
          >
            Нет аккаунта? Зарегистрируйтесь
          </Link>
        </div>
      </div>
    </div>
  );
}