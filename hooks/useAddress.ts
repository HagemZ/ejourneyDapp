"use client";
import React from "react";
import { useAccount } from "wagmi";

type User = {
  id: string;
  fullname: string;
  email: string;
  address: string;
  id_number: string;
  id_file: string;
  status: string;
  api_key: string;
  secret_key: string;
  createdAt: string;
  updatedAt: string;
};

export default function useGetUserData() {
  const { address } = useAccount();
  const [users, setUsers] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);
  const [needsRegistration, setNeedsRegistration] = React.useState(false);

  React.useEffect(() => {
    if (!address) {
      setUsers(null);
      setNeedsRegistration(false);
      return;
    }
    
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        setNeedsRegistration(false);
        
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/${address}`,
          {
            cache: "no-store",
          }
        );
        
        if (response.status === 404) {
          // User not found - needs registration
          console.log(`User not found for address: ${address} - needs registration`);
          setUsers(null);
          setNeedsRegistration(true);
          setLoading(false);
          return;
        }
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success && data.data) {
          setUsers(data.data);
          setNeedsRegistration(false);
        } else {
          console.error('Invalid response format:', data);
          setUsers(null);
          setNeedsRegistration(true);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError(error as Error);
        setUsers(null);
        setNeedsRegistration(true);
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, [address]);

  return { users, loading, error, needsRegistration };
}