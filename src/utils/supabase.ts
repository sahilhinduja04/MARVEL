import { createBrowserClient } from '@supabase/ssr';

export interface ShieldUser {
  id: string;
  name: string;
  email: string;
  agentId: string;
  createdAt: string;
  spins: number;
  lastHero: string;
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://lslncrqiioujpqhuttlo.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_FAQZK8NnQyKWaPup85HJsQ_v-oIx3dj';

export const supabase = createBrowserClient(supabaseUrl, supabaseKey);

const STORAGE_KEY = 'shield_registered_agents_db';

export function getLocalUsers(): ShieldUser[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('LocalStorage read error:', e);
    return [];
  }
}

export function saveLocalUser(user: ShieldUser) {
  if (typeof window === 'undefined') return;
  try {
    const users = getLocalUsers();
    const existingIndex = users.findIndex((u) => u.email.toLowerCase() === user.email.toLowerCase());
    if (existingIndex >= 0) {
      users[existingIndex] = { ...users[existingIndex], ...user };
    } else {
      users.push(user);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  } catch (e) {
    console.error('LocalStorage write error:', e);
  }
}

export async function registerShieldUser(name: string, email: string): Promise<ShieldUser> {
  const agentId = `SHIELD-${Math.floor(100000 + Math.random() * 900000)}`;
  const newUser: ShieldUser = {
    id: `user-${Date.now()}`,
    name: name.trim(),
    email: email.trim().toLowerCase(),
    agentId,
    createdAt: new Date().toISOString(),
    spins: 0,
    lastHero: 'None',
  };

  // 1. Save to local DB
  saveLocalUser(newUser);

  // 2. Save to Supabase Cloud DB table
  try {
    const { error } = await supabase.from('users').upsert(
      [
        {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          agent_id: newUser.agentId,
          spins: newUser.spins,
          last_hero: newUser.lastHero,
          created_at: newUser.createdAt,
        },
      ],
      { onConflict: 'email' }
    );
    if (error) {
      console.warn('Supabase DB upsert warning:', error.message);
    } else {
      console.log('🎉 Registered agent saved directly to Supabase!');
    }
  } catch (err) {
    console.warn('Supabase DB error:', err);
  }

  return newUser;
}

export async function fetchAllRegisteredUsers(): Promise<ShieldUser[]> {
  const localUsers = getLocalUsers();

  try {
    const { data, error } = await supabase.from('users').select('*').order('created_at', { ascending: false });
    if (!error && data && data.length > 0) {
      const formatted: ShieldUser[] = data.map((item: any) => ({
        id: item.id || `supa-${item.email}`,
        name: item.name || 'Agent',
        email: item.email,
        agentId: item.agent_id || item.agentId || 'SHIELD-000000',
        createdAt: item.created_at || new Date().toISOString(),
        spins: item.spins || 0,
        lastHero: item.last_hero || item.lastHero || 'None',
      }));
      return formatted;
    }
  } catch (err) {
    console.warn('Supabase fetch error, returning local users:', err);
  }

  return localUsers;
}

export async function updateShieldUserActivity(email: string, heroName: string) {
  if (typeof window === 'undefined') return;
  const users = getLocalUsers();
  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (user) {
    user.spins = (user.spins || 0) + 1;
    user.lastHero = heroName;
    saveLocalUser(user);

    try {
      await supabase
        .from('users')
        .update({ spins: user.spins, last_hero: heroName })
        .eq('email', email.toLowerCase());
    } catch (e) {
      console.warn('Supabase update warning:', e);
    }
  }
}
