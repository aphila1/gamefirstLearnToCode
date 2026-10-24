import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { supabase } from '../supabaseClient';
import type { User } from '@supabase/supabase-js';

// ============================================================================
// LEVEL & XP MATHEMATICAL UTILITIES
// ============================================================================

/**
 * Calculates a player's level using an exponential curve formula.
 * Lvl 1: 0-99 XP | Lvl 2: 100-249 XP | Lvl 3: 250-449 XP | Lvl 4: 450+ XP
 */
export const getLevelFromXp = (xp: number): number => {
  if (xp < 100) return 1;
  return Math.floor(1 + Math.sqrt(1 + (8 * xp) / 100) / 2);
};

/**
 * Returns the exact absolute total XP required to reach a specific level.
 */
export const getXpRequiredForLevel = (level: number): number => {
  if (level <= 1) return 0;
  return ((level - 1) * level * 100) / 2;
};

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface Profile {
  username: string;
  xp: number;
  tokens: number;
}

interface StudioContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  levelInfo: {
    currentLevel: number;
    xpInCurrentLevel: number;
    xpNeededForNextLevel: number;
    progressPercentage: number;
  };
  addXp: (amount: number) => Promise<void>;
  updateTokens: (newAmount: number) => Promise<void>;
  signOut: () => Promise<void>;
}

// ============================================================================
// CONTEXT & PROVIDER
// ============================================================================

const StudioContext = createContext<StudioContextType | undefined>(undefined);

export function StudioProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Memoized cloud profile fetcher to prevent unnecessary re-renders
  const fetchProfile = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('username, xp, tokens')
      .eq('id', userId)
      .maybeSingle()

    if (!error && data) {
      setProfile(data);
    }
    setLoading(false);
  }, []);

  // Sync session authentication state securely
  useEffect(() => {
    let isMounted = true;

    // onAuthStateChange automatically captures initial boot session and updates
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isMounted) return;

      const currentUser = session?.user ?? null;
      setUser(currentUser);

      if (currentUser) {
        fetchProfile(currentUser.id);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  // Handle XP increments with Level-Up tracking and state rollbacks
  const addXp = async (amount: number) => {
    if (!user || !profile) return;

    const currentXp = profile.xp;
    const nextXp = currentXp + amount;
    
    const currentLevel = getLevelFromXp(currentXp);
    const nextLevel = getLevelFromXp(nextXp);

    // 1. Optimistic UI update for lag-free gaming feel
    setProfile(prev => prev ? { ...prev, xp: nextXp } : null);

    // 2. Persist directly to Supabase
    const { error } = await supabase
      .from('profiles')
      .update({ xp: nextXp })
      .eq('id', user.id);

    // 3. Error Handling and State Rollback
    if (error) {
      console.error('Failed to save XP progress:', error.message);
      setProfile(prev => prev ? { ...prev, xp: currentXp } : null);
      return;
    }

    // 4. Level-Up Notification Hook
    if (nextLevel > currentLevel) {
      setTimeout(() => {
        alert(`🎉 LEVEL UP! You reached Level ${nextLevel}!`);
      }, 100);
    }
  };

  // Safe Token Updates
  const updateTokens = async (newAmount: number) => {
    if (!user || !profile) return;
    const previousTokens = profile.tokens;

    setProfile(prev => prev ? { ...prev, tokens: newAmount } : null);

    const { error } = await supabase
      .from('profiles')
      .update({ tokens: newAmount })
      .eq('id', user.id);

    if (error) {
      console.error('Failed to update tokens:', error.message);
      setProfile(prev => prev ? { ...prev, tokens: previousTokens } : null);
    }
  };

  // Sign out functionality
  const signOut = async () => {
    await supabase.auth.signOut();
  };

  // Dynamically calculate progress details whenever profile state shifts
  const currentXp = profile?.xp || 0;
  const currentLevel = getLevelFromXp(currentXp);
  const currentLevelMinXp = getXpRequiredForLevel(currentLevel);
  const nextLevelMinXp = getXpRequiredForLevel(currentLevel + 1);

  const xpInCurrentLevel = currentXp - currentLevelMinXp;
  const xpNeededForNextLevel = nextLevelMinXp - currentLevelMinXp;
  const progressPercentage = Math.min(100, Math.max(0, (xpInCurrentLevel / xpNeededForNextLevel) * 100));

  const levelInfo = {
    currentLevel,
    xpInCurrentLevel,
    xpNeededForNextLevel,
    progressPercentage
  };

  return (
    <StudioContext.Provider value={{ user, profile, loading, levelInfo, addXp, updateTokens, signOut }}>
      {children}
    </StudioContext.Provider>
  );
}

// Custom Hook to consume player context variables easily
export function useStudio() {
  const context = useContext(StudioContext);
  if (!context) throw new Error('useStudio must be used inside a StudioProvider');
  return context;
}
