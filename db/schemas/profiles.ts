import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

/**
 * Perfiles de usuario. El id coincide con auth.users.id de Supabase.
 * Se crea una fila por trigger al registrarse (ver db/triggers/handle_new_user.sql).
 */
export const profiles = pgTable('profiles', {
  id: uuid('id').primaryKey(),
  fullname: text('fullname'),
  email: text('email'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export type ProfileRow = typeof profiles.$inferSelect;
export type ProfileInsert = typeof profiles.$inferInsert;
