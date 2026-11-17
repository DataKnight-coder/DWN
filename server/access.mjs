import { json } from './crm.mjs';

let cachedKeys;
let cachedUntil = 0;

function decode(input) {
  const raw = input.replace(/-/g, '+').replace(/_/g, '/');
  return Uint8Array.from(atob(raw.padEnd(Math.ceil(raw.length / 4) * 4, '=')), char => char.charCodeAt(0));
}

function decodeJson(input) { return JSON.parse(new TextDecoder().decode(decode(input))); }

export async function accessActor(request, env) {
  if (!env.ACCESS_ISSUER || !env.ACCESS_AUD || !env.ADMIN_EMAILS) return null;
  const token = request.headers.get('Cf-Access-Jwt-Assertion');
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  try {
    const header = decodeJson(parts[0]);
    const claims = decodeJson(parts[1]);
    const issuer = env.ACCESS_ISSUER.replace(/\/$/, '');
    if (header.alg !== 'RS256' || !header.kid || claims.iss !== issuer ||
      !(Array.isArray(claims.aud) ? claims.aud.includes(env.ACCESS_AUD) : claims.aud === env.ACCESS_AUD) ||
      !Number.isFinite(claims.exp) || claims.exp <= Date.now() / 1000 ||
      (claims.nbf && claims.nbf > Date.now() / 1000)) return null;
    if (cachedUntil < Date.now()) {
      const response = await fetch(`${issuer}/cdn-cgi/access/certs`);
      if (!response.ok) return null;
      cachedKeys = (await response.json()).keys;
      cachedUntil = Date.now() + 300000;
    }
    const jwk = cachedKeys.find(key => key.kid === header.kid);
    if (!jwk) return null;
    const key = await crypto.subtle.importKey('jwk', jwk, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['verify']);
    const signed = new TextEncoder().encode(`${parts[0]}.${parts[1]}`);
    if (!await crypto.subtle.verify('RSASSA-PKCS1-v1_5', key, decode(parts[2]), signed)) return null;
    const email = String(claims.email || '').toLowerCase();
    const admins = env.ADMIN_EMAILS.toLowerCase().split(',').map(item => item.trim());
    const reviewers = String(env.REVIEWER_EMAILS || '').toLowerCase().split(',').map(item => item.trim());
    if (admins.includes(email)) return { email, role: 'admin' };
    if (reviewers.includes(email)) return { email, role: 'reviewer' };
  } catch { return null; }
  return null;
}

export async function authorize(context, role = 'admin') {
  const actor = await accessActor(context.request, context.env);
  if (!actor || (role === 'admin' && actor.role !== 'admin')) return { response: json({ error: 'Access denied.' }, 403) };
  if (!context.env.DB) return { response: json({ error: 'Database unavailable.' }, 503) };
  return { actor };
}
