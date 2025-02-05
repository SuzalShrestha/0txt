'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

export default function NotePage() {
  const params = useParams();
  const [text, setText] = useState('');
  const [password, setPassword] = useState('');
  const [inputPassword, setInputPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isNewNote, setIsNewNote] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');
  const [error, setError] = useState('');
  const [isPasswordPromptVisible, setIsPasswordPromptVisible] = useState(false);
  const [isSetPasswordVisible, setIsSetPasswordVisible] = useState(false);

  useEffect(() => {
    checkNoteExists();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkNoteExists = async () => {
    try {
      const response = await fetch(`/api/notes/${params.noteId}`);
      const data = await response.json();

      if (response.status === 401) {
        // Note exists but needs password
        setIsNewNote(false);
        setIsPasswordPromptVisible(true);
      } else if (response.ok && data.exists === false) {
        // New note
        setIsNewNote(true);
        setText('');
        setIsLoading(false);
      } else if (response.ok && data.exists === true) {
        // Note exists but wrong password
        setIsNewNote(false);
        setIsPasswordPromptVisible(true);
      }
    } catch (error) {
      console.error('Failed to check note:', error);
      setError('Failed to check if note exists');
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/notes/${params.noteId}`, {
        headers: {
          'X-Note-Password': inputPassword,
        },
      });

      if (response.status === 401) {
        setError('Invalid password');
        return;
      }

      if (response.ok) {
        const data = await response.json();
        setText(data.text || '');
        setPassword(inputPassword);
        setIsPasswordPromptVisible(false);
      }
    } catch (error) {
      console.error('Failed to verify password:', error);
      setError('Failed to verify password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (inputPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    if (inputPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setPassword(inputPassword);
    setIsSetPasswordVisible(false);
    handleSave();
  };

  const handleSave = async () => {
    if (isNewNote && !password) {
      setIsSetPasswordVisible(true);
      return;
    }

    setIsSaving(true);
    setSaveStatus('Saving...');
    try {
      const response = await fetch(`/api/notes/${params.noteId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Note-Password': password,
        },
        body: JSON.stringify({ text }),
      });

      if (response.status === 401) {
        setSaveStatus('Invalid password');
        return;
      }

      if (response.ok) {
        setSaveStatus('Saved successfully!');
        setIsNewNote(false);
        setTimeout(() => setSaveStatus(''), 2000);
      } else {
        setSaveStatus('Failed to save');
      }
    } catch (error) {
      console.error('Failed to save note:', error);
      setSaveStatus('Failed to save');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading && !isPasswordPromptVisible && !isSetPasswordVisible) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  if (isPasswordPromptVisible) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-xl dark:bg-gray-800">
          <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">Enter Password</h2>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                This note is password protected. Please enter the password to continue:
              </label>
              <input
                type="password"
                id="password"
                value={inputPassword}
                onChange={(e) => setInputPassword(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:ring-blue-400"
                placeholder="Enter password"
                required
              />
            </div>
            {error && <div className="text-sm text-red-600 dark:text-red-400">{error}</div>}
            <button
              type="submit"
              className="w-full rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition-colors duration-200 hover:bg-blue-700"
            >
              Access Note
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (isSetPasswordVisible) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-xl dark:bg-gray-800">
          <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">Set Password</h2>
          <form onSubmit={handleSetPassword} className="space-y-4">
            <div>
              <label
                htmlFor="newPassword"
                className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Create a password to protect your note:
              </label>
              <input
                type="password"
                id="newPassword"
                value={inputPassword}
                onChange={(e) => setInputPassword(e.target.value)}
                className="mb-4 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:ring-blue-400"
                placeholder="Enter password"
                required
                minLength={8}
              />
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:ring-blue-400"
                placeholder="Confirm password"
                required
                minLength={8}
              />
            </div>
            {error && <div className="text-sm text-red-600 dark:text-red-400">{error}</div>}
            <button
              type="submit"
              className="w-full rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition-colors duration-200 hover:bg-blue-700"
            >
              Set Password and Save
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 dark:bg-gray-900">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
          <div className="mb-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {isNewNote ? 'This URL is available!' : params.noteId}
              </h1>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500 dark:text-gray-400">{saveStatus}</span>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors duration-200 hover:bg-blue-700 disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>

            {isNewNote && (
              <div className="rounded-lg bg-yellow-50 p-4 dark:bg-yellow-900">
                <div className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div>
                    <p className="font-medium">
                      This URL is available! Start writing your note and click Save to set a
                      password.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {error && !isPasswordPromptVisible && !isSetPasswordVisible && (
              <div className="rounded-lg bg-red-50 p-4 dark:bg-red-900">
                <p className="text-red-800 dark:text-red-200">{error}</p>
              </div>
            )}
          </div>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="h-[70vh] w-full resize-none rounded-lg border border-gray-300 p-4 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:ring-blue-400"
            placeholder="Start typing your secure note here..."
          />
        </div>
      </div>
    </div>
  );
}
