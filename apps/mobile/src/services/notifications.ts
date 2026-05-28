import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

export interface NotificationMessage {
  title: string;
  body: string;
  data?: Record<string, string>;
}

export const setupNotifications = async () => {
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.warn('Failed to get notification permissions');
      return false;
    }

    return true;
  }

  return false;
};

export const sendLocalNotification = async (message: NotificationMessage) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: message.title,
      body: message.body,
      data: message.data || {},
      sound: 'default',
      badge: 1,
    },
    trigger: null,
  });
};

export const scheduleNotification = async (
  message: NotificationMessage,
  delaySeconds: number
) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: message.title,
      body: message.body,
      data: message.data || {},
      sound: 'default',
      badge: 1,
    },
    trigger: {
      seconds: delaySeconds,
    },
  });
};

export const setupNotificationHandler = (
  handler: (notification: Notifications.Notification) => void
) => {
  const subscription = Notifications.addNotificationResponseReceivedListener(handler);
  return subscription;
};
