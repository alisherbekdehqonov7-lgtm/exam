import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { INotification } from '../../common/interfaces';
import { generateId, now } from '../../common/utils/helpers';

@Injectable()
export class NotificationsService {
  constructor(private readonly db: DatabaseService) {}

  /** Get user notifications */
  getUserNotifications(userId: string) {
    const notifications = this.db
      .findMany<INotification>('notifications', (n) => n.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const unreadCount = notifications.filter((n) => !n.isRead).length;

    return { notifications, unreadCount };
  }

  /** Mark single notification as read */
  markAsRead(userId: string, notifId: string) {
    const notif = this.db.findOne<INotification>(
      'notifications',
      (n) => n.id === notifId && n.userId === userId,
    );
    if (!notif) throw new NotFoundException('Notification not found');

    this.db.updateOne<INotification>(
      'notifications',
      (n) => n.id === notifId,
      { isRead: true },
    );

    return { message: 'Marked as read' };
  }

  /** Mark all notifications as read */
  markAllAsRead(userId: string) {
    const notifications = this.db.read<INotification>('notifications');
    const updated = notifications.map((n) =>
      n.userId === userId ? { ...n, isRead: true } : n,
    );
    this.db.write('notifications', updated);

    return { message: 'All notifications marked as read' };
  }

  /** Delete a notification */
  deleteNotification(userId: string, notifId: string) {
    const deleted = this.db.deleteOne<INotification>(
      'notifications',
      (n) => n.id === notifId && n.userId === userId,
    );
    if (!deleted) throw new NotFoundException('Notification not found');

    return { message: 'Notification deleted' };
  }

  /** Create notification (internal use) */
  createNotification(
    userId: string,
    type: INotification['type'],
    title: string,
    message: string,
  ) {
    const notif: INotification = {
      id: generateId('notif'),
      userId,
      type,
      title,
      message,
      isRead: false,
      createdAt: now(),
    };

    this.db.insertOne('notifications', notif);
    return notif;
  }
}
