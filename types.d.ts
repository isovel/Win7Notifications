export interface NotificationData {
  channel_id: string
  channel_type: number
  guild_id: string | null
  message_id: string
  message_type: number
  notif_type: string
  notif_user_id: string
}

export interface NotificationOptions {
  onClick(): void
  tag: string
  sound: string
  volume: Float
  playSoundIfDisabled: boolean
  trackingProps: any
}

export type NotificationArgs = [string, string, string, NotificationData, NotificationOptions]