import { useState } from 'react';
import { useUser } from '../hooks/apiHooks';

type RegisterInputs = {
  username: string;
  password: string;
  email: string;
};

const RegisterForm = () => {
  const [inputs, setInputs] = useState<RegisterInputs>({
    username: '',
    password: '',
    email: '',
  });
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [emailAvailable, setEmailAvailable] = useState<boolean | null>(null);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const { getUsernameAvailable, getEmailAvailable } = useUser();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputs((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Reset availability checks when user changes input
    if (name === 'username') {
      setUsernameAvailable(null);
    }
    if (name === 'email') {
      setEmailAvailable(null);
    }
  };

  const checkUsernameAvailability = async () => {
    if (!inputs.username) return;
    
    try {
      const result = await getUsernameAvailable(inputs.username);
      setUsernameAvailable(result.available);
    } catch (e) {
      console.error('Username check error:', (e as Error).message);
      setUsernameAvailable(false);
    }
  };

  const checkEmailAvailability = async () => {
    if (!inputs.email) return;
    
    try {
      const result = await getEmailAvailable(inputs.email);
      setEmailAvailable(result.available);
    } catch (e) {
      console.error('Email check error:', (e as Error).message);
      setEmailAvailable(false);
    }
  };

  const doSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Check availability before submission
    await checkUsernameAvailability();
    await checkEmailAvailability();

    // Wait a moment for state to update
    setTimeout(async () => {
      if (usernameAvailable === false) {
        setError('Username is already taken');
        return;
      }

      if (emailAvailable === false) {
        setError('Email is already registered');
        return;
      }

      setLoading(true);
      try {
        // Here you would call your register API
        console.log('Registering user:', inputs);
        // TODO: Implement actual registration API call
      } catch (e) {
        setError((e as Error).message);
      } finally {
        setLoading(false);
      }
    }, 100);
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-900/50 border border-red-500 rounded text-red-200">
          {error}
        </div>
      )}
      
      <form onSubmit={doSubmit} className="space-y-4">
        <div>
          <label htmlFor="username" className="block mb-2 font-medium">
            Username:
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={inputs.username}
            onChange={handleChange}
            onBlur={checkUsernameAvailability}
            required
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {usernameAvailable === false && (
            <p className="mt-1 text-sm text-red-400">
              ❌ Username is already taken
            </p>
          )}
          {usernameAvailable === true && (
            <p className="mt-1 text-sm text-green-400">
              ✅ Username is available
            </p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block mb-2 font-medium">
            Email:
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={inputs.email}
            onChange={handleChange}
            onBlur={checkEmailAvailability}
            required
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {emailAvailable === false && (
            <p className="mt-1 text-sm text-red-400">
              ❌ Email is already registered
            </p>
          )}
          {emailAvailable === true && (
            <p className="mt-1 text-sm text-green-400">
              ✅ Email is available
            </p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block mb-2 font-medium">
            Password:
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={inputs.password}
            onChange={handleChange}
            required
            minLength={5}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="mt-1 text-xs text-gray-400">
            Password must be at least 5 characters long
          </p>
        </div>

        <button 
          type="submit" 
          disabled={loading || usernameAvailable === false || emailAvailable === false}
          className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-medium transition-colors"
        >
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
    </div>
  );
};

export default RegisterForm;
