-- Default-deny for app objects created by the normal PostgreSQL migration owner.
-- Existing public app tables retain only the explicit SELECT grants in the prior migration.
-- Avoid creating app-facing objects as the platform-managed supabase_admin role.
alter default privileges in schema public
  revoke all on tables from public, anon, authenticated;
alter default privileges in schema public
  revoke all on sequences from public, anon, authenticated;
alter default privileges in schema public
  revoke execute on functions from public, anon, authenticated;
