export interface Announcement {
  id: string;
  title: string;
  summary: string;
  date: string; // e.g. "2026/05/12"
  order: number;
}

export interface CourseAnnouncement {
  id: string;
  tag: string; // e.g. "大學伴研習"
  title: string;
  location: string;
  time: string;
  order: number;
}

export interface ReviewEntry {
  id: string;
  year: string; // e.g. "2024 年度回顧"
  imgUrl: string;
  order: number;
}

export interface PartnerSchool {
  id: string;
  name: string;
  logoUrl: string;
  order: number;
}

export interface PrincipalInvestigator {
  name: string;
  title: string;
  affiliation: string;
  bio: string;
  email: string;
}

export interface Assistant {
  id: string;
  name: string;
  role: string;
  detail: string;
  order: number;
}
