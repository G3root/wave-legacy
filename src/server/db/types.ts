import type { ColumnType } from "kysely";
export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export type Account = {
  id: Generated<string>;
  userId: string;
  type: string;
  provider: string;
  providerAccountId: string;
  refreshToken: string | null;
  accessToken: string | null;
  expiresAt: number | null;
  tokenType: string | null;
  scope: string | null;
  idToken: string | null;
  sessionState: string | null;
  createdAt: Generated<string>;
  updatedAt: Generated<string>;
};
export type Membership = {
  id: Generated<number>;
  publicId: string;
  workspaceId: string;
  userId: string;
  /**
   * @kyselyType('accepted' | 'pending' | 'declined')
   */
  status: Generated<"accepted" | "pending" | "declined">;
  joinedAt: string | null;
  invitedName: string | null;
  invitedEmail: string | null;
  createdAt: Generated<string>;
  updatedAt: Generated<string>;
};
export type Project = {
  id: Generated<number>;
  publicId: string;
  name: string;
  description: string | null;
  leadId: string | null;
  workspaceId: string;
  /**
   * @kyselyType('backlog' | 'planed' | 'in-progress' | 'paused' | 'completed' | 'cancelled')
   */
  status: Generated<
    "backlog" | "planed" | "in-progress" | "paused" | "completed" | "cancelled"
  >;
  startDate: string | null;
  targetDate: string | null;
  createdAt: Generated<string>;
  updatedAt: Generated<string>;
};
export type ProjectsOnUsers = {
  userId: string;
  projectId: string;
  assignedAt: Generated<string>;
};
export type Session = {
  id: Generated<string>;
  sessionToken: string;
  userId: string;
  expires: string;
};
export type User = {
  id: Generated<string>;
  publicId: string;
  name: string | null;
  email: string | null;
  emailVerified: string | null;
  image: string | null;
  /**
   * @kyselyType('customer' | 'super-admin')
   */
  globalRole: Generated<"customer" | "super-admin">;
  createdAt: Generated<string>;
  updatedAt: Generated<string>;
};
export type VerificationToken = {
  identifier: string;
  token: string;
  expires: string;
  createdAt: Generated<string>;
  updatedAt: Generated<string>;
};
export type Workspace = {
  id: Generated<number>;
  name: string;
  publicId: string;
  creatorId: string | null;
  createdAt: Generated<string>;
  updatedAt: Generated<string>;
};
export type DB = {
  account: Account;
  membership: Membership;
  project: Project;
  projectOnUsers: ProjectsOnUsers;
  session: Session;
  user: User;
  verificationToken: VerificationToken;
  workspace: Workspace;
};
