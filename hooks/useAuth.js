import { useState, useEffect } from 'react';

const useAuth = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Replace with logic to fetch user data
    const fetchUser = async () => {
      const mockUser = { id: 1, name: 'John Doe' };
      setUser(mockUser);
    };
    fetchUser();
  }, []);

  return { user, setUser };
};

export default useAuth;
