import { test } from 'node:test';
import assert from 'node:assert/strict';
import bcrypt from 'bcrypt';
import { makeChangePassword } from '../src/application/use-cases/change-password.use-case.js';
import { makeGetNotifications } from '../src/application/use-cases/get-notifications.use-case.js';
import { makeUpdateNotificationPreferences } from '../src/application/use-cases/notification-preferences.use-case.js';

const makeRepo = async () => {
  const state = { hash: await bcrypt.hash('oldpassword1', 4), prefs: { recycle: true, marketplace: true, rewards: true, system: true } };
  return {
    state,
    findById: async (id) => (id === 'u1' ? { id, passwordHash: state.hash } : null),
    updatePasswordHash: async (_id, h) => { state.hash = h; },
    getNotificationPreferences: async () => ({ ...state.prefs }),
    saveNotificationPreferences: async (_id, p) => { state.prefs = p; },
    getNotifications: async () => [
      { id: 1, type: 'recycle' }, { id: 2, type: 'sell' }, { id: 3, type: 'reward' }, { id: 4, type: 'general' },
    ],
  };
};

test('changes the password when the current one matches', async () => {
  const repo = await makeRepo();
  await makeChangePassword({ userRepo: repo })({ userId: 'u1', currentPassword: 'oldpassword1', newPassword: 'newpassword1' });
  assert.ok(await bcrypt.compare('newpassword1', repo.state.hash));
});

test('rejects wrong current password, short and unchanged passwords', async () => {
  const repo = await makeRepo();
  const change = makeChangePassword({ userRepo: repo });
  await assert.rejects(change({ userId: 'u1', currentPassword: 'wrong', newPassword: 'newpassword1' }), /incorrect/);
  await assert.rejects(change({ userId: 'u1', currentPassword: 'oldpassword1', newPassword: 'short' }), /at least 8/);
  await assert.rejects(change({ userId: 'u1', currentPassword: 'oldpassword1', newPassword: 'oldpassword1' }), /differ/);
  await assert.rejects(change({ userId: undefined, currentPassword: 'a', newPassword: 'b' }), /Unauthorized/);
});

test('notification preferences are merged and filter the notification list', async () => {
  const repo = await makeRepo();
  const next = await makeUpdateNotificationPreferences({ userRepo: repo })({ userId: 'u1', preferences: { marketplace: false, system: false } });
  assert.deepEqual(next, { recycle: true, marketplace: false, rewards: true, system: false });
  const list = await makeGetNotifications({ userRepo: repo })('u1');
  assert.deepEqual(list.map((n) => n.type), ['recycle', 'reward']);
  await assert.rejects(makeUpdateNotificationPreferences({ userRepo: repo })({ userId: 'u1', preferences: { recycle: 'yes' } }), /boolean/);
});
