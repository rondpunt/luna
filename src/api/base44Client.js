import { createClient } from '@base44/sdk';
import { appParams } from '@/lib/app-params';

const { appId, token, functionsVersion, appBaseUrl } = appParams;

//Create a client with authentication required
export const base44 = createClient({
  appId,
  token,
  functionsVersion,
  serverUrl: '',
  requiresAuth: false,
  appBaseUrl
});

/**
 * Luna chat edge function (not in generated SDK typings).
 * @param {Record<string, unknown>} payload
 * @returns {Promise<{ reply?: string, content?: string }>}
 */
export function invokeNoraChat(payload) {
  const fns = /** @type {{ noraChat?: (p: Record<string, unknown>) => Promise<unknown> }} */ (base44.functions);
  if (typeof fns.noraChat !== "function") {
    return Promise.reject(new Error("noraChat is not available on this client"));
  }
  return /** @type {Promise<{ reply?: string, content?: string }>} */ (fns.noraChat(payload));
}
