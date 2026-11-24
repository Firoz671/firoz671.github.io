import snapshot from './github.json';

export type ContributionState = 'open' | 'merged' | 'closed';

export type ActivityType =
  | 'push'
  | 'pr-opened'
  | 'pr-merged'
  | 'pr-closed'
  | 'issue-opened'
  | 'issue-closed'
  | 'fork'
  | 'release'
  | 'create-repo'
  | 'create-branch'
  | 'create-tag';

export interface GitHubRepository {
  name: string;
  description: string | null;
  language: string | null;
  stars: number;
  forks: number;
  pushedAt: string | null;
  url: string;
}

export interface GitHubLanguage {
  name: string;
  count: number;
}

export interface GitHubContribution {
  title: string;
  repo: string | null;
  repoUrl: string | null;
  state: ContributionState;
  date: string | null;
  url: string | null;
}

export interface GitHubActivity {
  type: ActivityType;
  repo: string;
  repoUrl: string;
  date: string | null;
  count?: number | null;
}

export interface GitHubCalendarDay {
  date: string;
  count: number;
  weekday: number;
  level: number;
}

export interface GitHubCalendarWeek {
  days: GitHubCalendarDay[];
}

export interface GitHubCalendar {
  totalContributions: number;
  weeks: GitHubCalendarWeek[];
}

export interface GitHubSnapshot {
  generatedAt: string;
  username: string;
  profile: {
    login: string;
    publicRepos: number;
    followers: number;
    createdYear: number | null;
    htmlUrl: string;
  };
  repositories: GitHubRepository[];
  languages: GitHubLanguage[];
  contributions: GitHubContribution[];
  activity: GitHubActivity[];
  calendar: GitHubCalendar | null;
}

export const githubSnapshot = snapshot as GitHubSnapshot;
