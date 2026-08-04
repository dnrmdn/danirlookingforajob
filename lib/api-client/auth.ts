import { useMutation } from '@tanstack/react-query';
import { apiClient } from './index';
import { AuthResponse } from '@/features/auth/dto';
import { RegisterRequest as RegisterReqType } from '@/features/auth/validation';
import { signIn } from 'next-auth/react';

export const useRegister = () => {
  return useMutation({
    mutationFn: (data: RegisterReqType) => apiClient.post<AuthResponse>('/auth/register', { data }),
    onSuccess: async (_, variables) => {
      // Automatically log them in after registration
      await signIn('credentials', {
        email: variables.email,
        password: variables.password,
        redirect: true,
        callbackUrl: '/dashboard',
      });
    },
  });
};
