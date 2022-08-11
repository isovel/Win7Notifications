
/* ————————— Copyright (c) 2022 toastythetoaster. All rights reserved. —————————
 *
 * Win7Notifications Plugin
 *
 * ————————————————————————————————————————————————————————————————————————————— */

import { UPlugin } from '@classes';
import { suppressErrors } from '@util';
import { instead, unpatchAll } from '@patcher';
import { getByProps } from '@webpack';

import { NotificationArgs } from './types';

const { ipc } = DiscordNative;
const { playSound } = getByProps('playSound');

class Win7Notifications extends UPlugin {
  notifications: [string, ...NotificationArgs][] = [];

  start(): void {
    suppressErrors(this._patchNotifications.bind(this))(this.promises);
  }

  stop(): void {
    unpatchAll('Win7Notifications');
  }

  _patchNotifications(): void {
    instead('Win7Notifications', getByProps('showNotification'), 'showNotification', (_original, args: NotificationArgs) => {
      const id = (Math.floor(Math.random() * 1000000)).toString();
      this.notifications.push([id, ...args]);
      ipc.send('NOTIFICATION_SHOW', {
        id: id,
        title: args[1],
        body: args[2],
        icon: args[0],
      });
      playSound(args[4].sound, args[4].volume);
      ipc.on('NOTIFICATION_CLICK', () => {
        const idx = this.notifications.findIndex(x => x[0] === id);
        if (idx !== -1) {
          this.notifications[idx][5].onClick();
          ipc.send('NOTIFICATION_CLOSE', id);
          this.notifications.splice(idx, 1);
        }
      });
      setTimeout(() => {
        ipc.send('NOTIFICATION_CLOSE', id);
        this.notifications.splice(this.notifications.findIndex(x => x[0] === id), 1);
      }, 5000);
    });
  }
}

module.exports = Win7Notifications;
