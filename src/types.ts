export interface VideoItem {
  id: string;
  youtubeId: string;
  videoUrl?: string;
  blobKey?: string;
  videoSourceType?: 'youtube' | 'local';
  thumbnailUrl?: string;
  title: string;
  category: string;
  duration?: string;
  description?: string;
}

export interface GraphicItem {
  id: string;
  filename: string;
  title: string;
  subtitle: string;
  category: string;
  fitMode?: 'cover' | 'contain';
}

export interface PersonalInfo {
  name: string;
  role: string;
  email: string;
  whatsappUrl: string;
  whatsappNumber?: string;
  location?: string;
  availability?: string;
  responseTime?: string;
  youtubeChannelUrl: string;
  behanceUrl?: string;
  instagramUrl: string;
  linkedinUrl: string;
  bio: string;
  strengths: { title: string; desc: string }[];
  tools: string[];
}

export interface PortfolioDataState {
  profilePic: string;
  personalInfo: PersonalInfo;
  featuredVideo: VideoItem;
  portfolioVideos: VideoItem[];
  graphicItems: GraphicItem[];
}

export type ThemeMode = 'dark' | 'light';

export type Language = 'bn' | 'en';

export interface AdminSecuritySettings {
  isConfigured: boolean;
  lastLogin?: string;
}
