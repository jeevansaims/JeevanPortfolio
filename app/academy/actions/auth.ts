'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function register(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    full_name: formData.get('full_name') as string,
  }

  // Validate input
  if (!data.email || !data.password) {
    return { error: 'Email and password are required' }
  }

  if (data.password.length < 8) {
    return { error: 'Password must be at least 8 characters' }
  }

  // Create user
  const { error, data: signUpData } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        full_name: data.full_name,
      },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  })

  if (error) {
    return { error: error.message }
  }

  // Check if user already existed (Supabase returns user but doesn't send email)
  // If identities array is empty, user already exists
  if (signUpData.user && signUpData.user.identities && signUpData.user.identities.length === 0) {
    return { error: 'This email is already registered. Try logging in instead.' }
  }

  return { success: true }
}

export async function login(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  // Validate input
  if (!data.email || !data.password) {
    return { error: 'Email and password are required' }
  }

  // Attempt login
  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    // Check if user doesn't exist
    if (error.message.includes('Invalid login credentials')) {
      return { error: 'No account found with this email. Try registering instead.' }
    }
    return { error: error.message }
  }

  // Check if email is verified
  const { data: { user } } = await supabase.auth.getUser()
  
  if (user && !user.email_confirmed_at) {
    return { error: 'Please verify your email before logging in.', needsVerification: true }
  }

  revalidatePath('/', 'layout')
  return { success: true }
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/academy')
}

export async function resendVerificationEmail() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { error: 'No user found' }
  }

  const { error } = await supabase.auth.resend({
    type: 'signup',
    email: user.email!,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/academy/dashboard`,
    },
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}