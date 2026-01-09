import { supabase } from './client';

// Signup
export async function signupWithPassword(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { emailRedirectTo: 'http://localhost:5173/dashboard' },
  });
  return { data, error, success: !error };
}

// Password login
export async function loginWithPassword(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  return { data, error, success: !error };
}

// OTP login
export async function loginWithEmail(email: string) {
  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: 'http://localhost:5173/dashboard' },
  });
  return { data, error, success: !error };
}

// Current user
export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser();
  if (error) return null;
  return data.user || null;
}

