// Temporary type declarations for Clerk components to satisfy TS in this setup.
declare module '@clerk/clerk-react' {
  import * as React from 'react';
  export interface ClerkEmailVerification { status?: string }
  export interface ClerkUserEmailAddress { emailAddress?: string; verification?: ClerkEmailVerification }
  export interface ClerkUser {
    id: string;
    firstName?: string | null;
    lastName?: string | null;
    fullName?: string | null;
    primaryEmailAddress?: ClerkUserEmailAddress | null;
    emailAddresses?: ClerkUserEmailAddress[];
    createdAt?: Date | string;
  }
  export interface SignedInProps { children?: React.ReactNode }
  export interface SignedOutProps { children?: React.ReactNode }
  export const SignedIn: React.FC<SignedInProps>;
  export const SignedOut: React.FC<SignedOutProps>;
  export const RedirectToSignIn: React.FC;
  export const ClerkProvider: React.FC<{ publishableKey: string; children?: React.ReactNode }>; 
  export function useUser(): { isSignedIn: boolean; user?: ClerkUser | null };
  export function useAuth(): { getToken: (opts?: { template?: string }) => Promise<string | null> };
  export function UserButton(props: Record<string, unknown>): JSX.Element;
}