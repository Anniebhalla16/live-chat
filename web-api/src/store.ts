import { v4 as uuid } from 'uuid';
import { ChatMessage } from './types';

type User = { socketId: string; name: string };

const messages: ChatMessage[] = [];          // global message history
const users = new Map<string, User>();   // socketId -> user

// Update if exists, else insert
export function upsertUser(socketId: string, name?: string) {
  const existing = users.get(socketId);
  const user: User = existing ?? { socketId, name: `User-${socketId.slice(0, 4)}` };
  if (name) user.name = name;
  users.set(socketId, user);
  return user;
}

export function addMessage(socketId: string, text: string): ChatMessage {
  const trimmed = text.trim();
  if (!trimmed) {
    throw new Error('Message text cannot be empty');
  }

  const user = upsertUser(socketId);
  const msg: ChatMessage = {
    id: uuid(),
    author: user.name,
    text: trimmed,
    ts: Date.now(),
  };

  messages.push(msg);
  if (messages.length > 200) messages.shift(); 
  return msg;
}

export function getRecent(limit = 50): ChatMessage[] {
  return messages.slice(-limit);
}
