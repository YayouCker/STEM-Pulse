export enum StemCategory {
  MY_FEED = 'My Personalized Feed',
  SAVED = 'Saved Articles',
  LATEST = 'Latest News',
  COMPUTER_SCIENCE = 'Computer Science',
  DATA_SCIENCE = 'Data Science',
  MATHEMATICS = 'Mathematics',
  PHYSICS = 'Physics',
  CHEMISTRY = 'Chemistry',
  BIOLOGY = 'Biology',
  ENGINEERING = 'Engineering',
  SPACE = 'Space & Astronomy'
}

export const SUBTOPICS: Record<string, string[]> = {
  [StemCategory.COMPUTER_SCIENCE]: ['Artificial Intelligence', 'Cybersecurity', 'Software Engineering', 'Quantum Computing', 'Robotics'],
  [StemCategory.DATA_SCIENCE]: ['Machine Learning', 'Big Data', 'Neural Networks', 'Data Visualization'],
  [StemCategory.MATHEMATICS]: ['Number Theory', 'Topology', 'Applied Mathematics', 'Cryptography'],
  [StemCategory.PHYSICS]: ['Quantum Physics', 'Astrophysics', 'Thermodynamics', 'Particle Physics'],
  [StemCategory.CHEMISTRY]: ['Organic Chemistry', 'Materials Science', 'Biochemistry', 'Green Chemistry'],
  [StemCategory.BIOLOGY]: ['Biotechnology', 'Genetics', 'Neuroscience', 'CRISPR', 'Microbiology'],
  [StemCategory.ENGINEERING]: ['Civil Engineering', 'Electrical Engineering', 'Nanotechnology', 'Robotics'],
  [StemCategory.SPACE]: ['Space Exploration', 'Exoplanets', 'Black Holes', 'Mars Missions']
};

export interface GroundingSource {
  title?: string;
  uri: string;
  source?: string;
}

export interface Article {
  id: string;
  title: string;
  category: string;
  summary: string;
  sourceUrl?: string;
  sourceName?: string;
  tags: string[];
  readTime: string;
  body: string;
  timestamp: string;
}

export interface NewsResponse {
  articles: Article[];
  sources: GroundingSource[];
  timestamp: Date;
  category: StemCategory | string;
}

export interface LoadingState {
  isLoading: boolean;
  message: string;
}