export interface updateUser {
  email: string;
  password: string;
  fullName: string;
  avatar_url?: string;
  bio?: string;
  job_title?: string;
  job_role?: string;
  role: "user" | "admin";
  resume_url?: string;
  github_link?: string;
  linkedin_link?: string;
  twitter_link?: string;
}

export interface JwtPayload {
  id: string
  email: string
  fullName: string
  role: "admin" | "user"
}
