export interface Applicant {
  id: string;
  name: string;
  phone: string;
  email?: string;
  course: string;
  schedule: string;
  message?: string;
  createdAt: string;
  status: "pending" | "approved" | "rejected";
}

export interface AdminUser {
  username: string;
  password: string;
  name: string;
  role: string;
  lastLogin?: string;
}

export interface SavedPassword {
  id: string;
  serviceName: string;
  username: string;
  password: string;
  category: "Social Media" | "Email / Server" | "Tools & Software" | "Other";
  createdAt: string;
}
