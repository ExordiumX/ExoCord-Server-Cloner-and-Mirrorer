export interface Channel {
  id: string;
  last_message_id: string;
  type: number;
  name: string;
  position: number;
  parent_id?: string;
  topic?: string;
  guild_id: string;
  permission_overwrites: Overwrite[];
  nsfw: boolean;
  rate_limit_per_user?: number;
}

export interface Overwrite {
  id: string;
  type: number;
  allow: string;
  deny: string;
}

export interface Guild {
  id: string;
  name: string;
  icon: string;
  description: null;
  splash: string;
  discovery_splash: null;
  approximate_member_count: number;
  approximate_presence_count: number;
  features: string[];
  emojis: Emoji[];
  banner: string;
  owner_id: string;
  application_id: null;
  region: string;
  afk_channel_id: null;
  afk_timeout: number;
  system_channel_id: null;
  widget_enabled: boolean;
  widget_channel_id: string;
  verification_level: number;
  roles: Role[];
  default_message_notifications: number;
  mfa_level: number;
  explicit_content_filter: number;
  max_presences: null;
  max_members: number;
  max_video_channel_users: number;
  vanity_url_code: string;
  premium_tier: number;
  premium_subscription_count: number;
  system_channel_flags: number;
  preferred_locale: string;
  rules_channel_id: null;
  public_updates_channel_id: null;
}

export interface Emoji {
  name: string;
  roles: Role[];
  id: string;
  require_colons: boolean;
  managed: boolean;
  animated: boolean;
  available: boolean;
}

export interface Role {
  id: string;
  name: string;
  permissions: string;
  position: number;
  color: number;
  hoist: boolean;
  managed: boolean;
  mentionable: boolean;
}

export interface Embed {
  color: number;
  title: string;
  url: string;
  author: Author;
  description: string;
  thumbnail: Image;
  fields: Field[];
  image: Image;
  timestamp: Date;
  footer: Footer;
}

export interface Author {
  name: string;
  icon_url: string;
  url: string;
}

export interface Field {
  name: string;
  value: string;
  inline?: boolean;
}

export interface Footer {
  text: string;
  icon_url: string;
}

export interface Image {
  url: string;
}

export interface WebhookConfig {
  content: string;
  embeds: Embed[];
  username: string;
  url: string;
  avatar: string;
}
