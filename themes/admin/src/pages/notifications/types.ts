export interface NotificationData {
  id: string;
  title: string;
  type?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any>;
  read_at: string | null;
  read: boolean;
  created_at: string;
  updated_at: string;
}
