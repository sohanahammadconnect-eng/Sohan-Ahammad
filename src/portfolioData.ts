import { VideoItem, GraphicItem } from './types';

export const PERSONAL_INFO = {
  name: 'Sohan Ahammad',
  role: 'Video Editor & Visual Storyteller',
  email: 'sohanahammad.connect@gmail.com',
  whatsappUrl: 'https://wa.me/?text=Hi%20Sohan,%20I%20saw%20your%20video%20editing%20portfolio%20and%20would%20love%20to%20discuss%20a%20project!',
  whatsappNumber: '+880 1700-000000',
  location: 'Dhaka, Bangladesh',
  availability: 'Available for Worldwide Remote & Freelance Projects',
  responseTime: 'Quick Response (under 2 hours)',
  youtubeChannelUrl: 'https://www.youtube.com',
  behanceUrl: 'https://www.behance.net',
  instagramUrl: 'https://www.instagram.com',
  linkedinUrl: 'https://www.linkedin.com',
  bio: 'I am a passionate video editor dedicated to the art of visual storytelling. Over the past several months, I have immersed myself in learning the ins and outs of editing—practicing daily, refining my pacing, and perfecting my sound design. While I don\'t claim decades of industry experience, I bring fresh creativity, high-energy dedication, and a modern aesthetic to every frame. Let\'s create something memorable together.',
  strengths: [
    { title: 'Dynamic Pacing', desc: 'Crafting rhythm and tempo that keeps viewers hooked from the first second.' },
    { title: 'Audio & Sound Design', desc: 'Layering SFX, risers, and balanced tracks for immersive auditory impact.' },
    { title: 'Color Grading & Mood', desc: 'Dialing in atmospheric tones to evoke the right emotional narrative.' },
    { title: 'Rapid Daily Learner', desc: 'Continuously refining techniques and adopting the latest creative workflows.' },
  ],
  tools: [
    'Adobe Premiere Pro',
    'After Effects',
    'DaVinci Resolve',
    'Audition',
    'Photoshop',
    'Motion Graphics'
  ]
};

export const FEATURED_VIDEO: VideoItem = {
  id: 'featured-trailer',
  youtubeId: 'hsPSXISkhbo',
  title: 'Cinematic Reel & Visual Showcase',
  category: 'Featured Trailer',
  description: 'My flagship editing showcase highlighting narrative pacing, sound design, and color grading.'
};

export const PORTFOLIO_VIDEOS: VideoItem[] = [
  {
    id: 'video-1',
    youtubeId: 'DVKGyU6LYlM',
    title: 'Visual Narrative & Dynamic Cut',
    category: 'Commercial / Narrative',
    description: 'A punchy edit focusing on rhythm, seamless transitions, and sound-driven beats.'
  },
  {
    id: 'video-2',
    youtubeId: '1PXpU9ZMspQ',
    title: 'High-Energy Music & Motion Edit',
    category: 'Music & Performance',
    description: 'Tight sync cutting with audio beats, speed ramping, and modern stylistic flair.'
  },
  {
    id: 'video-3',
    youtubeId: 'd1lwd6GmW-g',
    title: 'Storytelling & Documentary Cut',
    category: 'Documentary / Story',
    description: 'Emotionally resonant storytelling with ambient sound design and thoughtful pacing.'
  },
  {
    id: 'video-4',
    youtubeId: 'j4Sykq03etU',
    title: 'Creative Visual Experience',
    category: 'Creative Short',
    description: 'Experimental composition blending graphic elements, sound effects, and color grading.'
  }
];

export const GRAPHIC_ITEMS: GraphicItem[] = [
  {
    id: 'graphic-1',
    filename: 'graphic1.jpg',
    title: 'Cinematic Thriller Poster',
    subtitle: 'Key Art & Dramatic Typography',
    category: 'Film Poster'
  },
  {
    id: 'graphic-2',
    filename: 'graphic2.jpg',
    title: 'Neon Horizon Music Single',
    subtitle: 'Music Single Artwork & Brand Cover',
    category: 'Album Art'
  },
  {
    id: 'graphic-3',
    filename: 'graphic3.jpg',
    title: 'Motion & Energy Sports Poster',
    subtitle: 'High Velocity Editorial Layout',
    category: 'Sports Media'
  },
  {
    id: 'graphic-4',
    filename: 'graphic4.jpg',
    title: 'Monochrome Studio Key Visual',
    subtitle: 'Minimalist Editorial & Layout Design',
    category: 'Brand Design'
  },
  {
    id: 'graphic-5',
    filename: 'graphic5.jpg',
    title: 'Sci-Fi Film Concept Banner',
    subtitle: 'Atmospheric Lighting & Title Art',
    category: 'Concept Art'
  },
  {
    id: 'graphic-6',
    filename: 'graphic6.jpg',
    title: 'Mountain Ascent Documentary',
    subtitle: 'Indie Film Festival Visual Identity',
    category: 'Docu Series'
  }
];
