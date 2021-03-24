export interface PaginatedResults<T> {
  count: number;
  results: Array<T>;
}

export enum SortDirection {
  ascending = 'ASC',
  descending = 'DESC',
}

export interface SortOptions {
  field: string;
  direction?: SortDirection;
}

export interface PaginationOptions {
  offset?: number;
  limit?: number;
  sort?: SortOptions;
  reverse?: boolean;
}

export type PaginationOptionsWithGroupId = PaginationOptions & {GroupId?: Array<number>|number};

export interface IProject {
  id: number;
  name: string;
  description?: string;
}

export interface ISprintPoints {
  claimed: number;
  completed: number;
  predicted: number;
  remaining: number;
}

export interface ISprint {
  id: number;
  name: string;
  description?: string;
  points: ISprintPoints;
}

export interface IStory {
  id: number;
  story: string;
  caption?: string;
  points: number;
}

export interface ISprintCreate {
  name: string;
  description?: string;
  predictedPoints: number;
  claimedPoints?: number;
  completedPoints?: number;
  startAt: Date;
  endAt: Date;
}

export interface IStoryCreate {
  ProjectId: number;
  title: string;
  points: number;
  description?: string;
}

export interface ClaimStoryOptions {
  timestamp?: Date;
}

export interface RemitStoryOptions {
  timestamp?: Date;
}

export interface CompleteStoryOptions {
  timestamp?: Date;
}
