export type UserRole = 'admin' | 'mentor' | 'teacher';
export type UserStatus = 'pending' | 'active' | 'disabled';

export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  className: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
  createdAt?: unknown;
}

export interface CarouselSlide {
  id: string;
  imageUrl: string;
  storagePath: string;
  order: number;
  createdAt?: unknown;
}

export interface CourseScheduleFile {
  fileName: string;
  fileUrl: string;
  storagePath: string;
  uploadedAt?: unknown;
  uploadedByName: string;
}

export interface LessonPlan {
  id: string;
  mentorUid: string;
  mentorName: string;
  mentorEmail: string;
  fileName: string;
  fileUrl: string;
  storagePath: string;
  uploadedAt?: unknown;
}

export type SurveyCategory = 'equipment' | 'needs';

export interface SurveyUpload {
  id: string;
  teacherUid: string;
  teacherName: string;
  teacherEmail: string;
  category: SurveyCategory;
  fileName: string;
  fileUrl: string;
  storagePath: string;
  uploadedAt?: unknown;
}
