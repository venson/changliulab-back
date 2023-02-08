export interface BannerInterface {
  id?: string;
  title?: string;
  imageUrl?: string;
  imageOutlinkUrl?: string;
  enable: boolean;
}
export interface ReviewMsgInterface {
  id: string;
  reviewId: string;
  refId: string;
  refType: ReviewType;
  requestUserId: string;
  requestUsername: string;
  requestMsg: string;
  reviewUserId: string;
  reviewUsername: string;
  reviewMsg: string;
  gmtCreate: string;
  gmtModified: string;
  reviewAction: ReviewAction;
}
export interface ReviewInterface {
  id: string;
  status: ReviewStatus;
  refType: ReviewType;
  refId: string;
  gmtCreate: string;
  gmtModified: string;
  messages: ReviewMsgInterface[];
}
export interface ReviewVo {
  id?: string;
  type?: ReviewType;
  from?: ReviewStatus;
  to?: ReviewStatus;
  parentId?: string;
  parentType?: ReviewType;
  userId?: string;
  userName?: string;
  action?: ReviewAction;
  msg?: string;
}
export enum ReviewType {
  COURSE = 'COURSE',
  CHAPTER = 'CHAPTER',
  SECTION = 'SECTION',
  ACTIVITY = 'ACTIVITY',
  RESEARCH = 'RESEARCH',
  METHODOLOGY = 'METHODOLOGY',
}
export interface PageParamInterface {
  current: number;
  size: number;
}
export interface ScholarQueryInterface {
  title: string;
  author: string;
  year: number;
}
export interface ScholarInterface {
  id?: string;
  title: string;
  titleLinkUrl?: string;
  year?: number;
  authors?: string;
  publicationDate?: string;
  journal?: string;
  volume?: number;
  issue?: number;
  pages?: string;
  publisher?: string;
  description?: string;
  linkText?: string;
  linkUrl?: string;
  googleLink?: string;
  totalCitations?: number;
  memberIdList?: string[];
  citationList?: ScholarCitationInterface[];
  memberList?: MemberScholarInterface[];
}
export interface MemberScholarInterface {
  memberId: string;
  name: string;
  scholarId: string;
}

export interface UserInterface {
  id?: string;
  username: string;
  email: string;
  nickName?: string;
  randomPassword?: boolean;
  roleIds?: string[];
}

export interface UserPersonalInterface {
  nickname: string | null;
  email: string | null;
  old: string;
  altered: string | null;
}

export interface ResearchInterface {
  id?: string;
  markdown?: string;
  title: string;
  publishedMd?: string;
  htmlBrBase64?: string;
  publishedHtmlBrBase64?: string;
  language?: LanguageEnum;
  isModified?: boolean;
  isPublished?: boolean;
  review?: ReviewStatus;
  enable?: boolean;
  buttonDisabled?: boolean;
}
export interface MethodologyInterface {
  id?: string;
  markdown?: string;
  title: string;
  publishedMd?: string;
  htmlBrBase64?: string;
  publishedHtmlBrBase64?: string;
  language?: LanguageEnum;
  isModified?: boolean;
  review?: ReviewStatus;
  isPublished?: boolean;
  enable?: boolean;
  buttonDisabled?: boolean;
}
export interface PreviewInterface {
  id?: string;
  title?: string;
  htmlBrBase64?: string;
  publishedHtmlBrBase64?: string;
  review?: ReviewStatus;
}
export interface PermissionInterface {
  id?: string;
  name: string;
  path?: string;
  permissionValue?: string;
  icon?: string;
  pid?: string;
  level: number;
  select?: boolean;
  component?: string;
  children?: PermissionInterface[];
}
export interface CoursePageDTOInterface {
  id?: string;
  title: string;
  totalHour?: number;
  isPublished?: boolean;
  infoReview: ReviewStatus;
  chapterReview: ReviewStatus;
  sectionReview: ReviewStatus;
  isPublic?: boolean;
  isModified?: boolean;
}
export interface SectionContentInterface {
  id: string;
  courseId?: string;
  chapterId?: string;
  title?: string;
  videoLink?: string;
  review?: ReviewStatus;
  sort?: number;
  markdown?: string;
  htmlBrBase64?: string;
}
export interface CourseInterface {
  id?: string;
  title: string;
  totalHour?: number;
  description?: string;
  memberName?: string;
  memberId?: string;
  viewCount?: number;
  isModified?: boolean;
  review?: string;
  isPublished?: boolean;
  isPublic?: boolean;
  cover?: string;
  subjectId?: string;
  subjectParentId?: string;
  isRemoveAfterReview?: boolean;
}
export interface MemberInterface {
  name: string;
  id?: string;
  intro?: string;
  career?: string;
  level: MemberLevel;
  avatar?: string;
  title?: string;
}
export interface ScholarCitationInterface {
  id?: string;
  scholarId?: string;
  year: number;
  citations: number;
}
export interface ActivityInterface {
  id?: string;
  title: string;
  activityDate: string;
  authorMemberId?: string;
  authorMemberName?: string;
  lastModifiedMemberId?: string;
  isPublished?: boolean;
  isModified?: boolean;
  review?: ReviewStatus;
  htmlBrBase64?: string;
  markdown?: string;
  isRemoveAfterReview?: boolean;
  enable?: boolean;
  buttonDisabled?: boolean;
}
export interface ReviewModalInterface {
  id?: string;
  title?: string;
  type?: ReviewType;
  action?: ReviewAction;
}
export enum LanguageEnum {
  CHINESE = 'CHINESE',
  ENGLISH = 'ENGLISH',
}
export interface ContentInterface {
  id?: string;
  title?: string;
  courseId: string;
  chapterId?: string;
  type?: CourseContentType;
  sort?: string;
  videoLink?: string;
  description?: string;
  markdown?: string;
}
export enum CourseContentType {
  CHAPTER = 'chapter',
  SECTION = 'section',
}
export enum ContentType {
  CHAPTER = 'chapter',
  SECTION = 'Section',
  COURSE = 'course',
  ACTIVITY = 'activity',
  METHODOLOGY = 'methodology',
  RESEARCH = 'research',
}
export enum PageType {
  REVIEW = 'REVIEW',
  NORMAL = 'NORMAL',
}
export interface ActivityQuery {
  title: string;
  begin?: string;
  end?: string;
}
export interface MemberQueryInterface {
  name?: string;
  level?: MemberLevel;
  begin?: string;
  end?: string;
}
export interface CourseSyllabusInterface extends ReviewContentInterface {
  // id: string;
  // title: string;
  // review?: ReviewStatus;
  description?: string;
  courseId?: string;
  chapterId?: string;
  isRemoveAfterReview?: boolean;
  children?: CourseSyllabusInterface[];
}
export interface ReviewContentInterface {
  id: string;
  title: string;
  review?: ReviewStatus;
}

export const brotliWasm = 'https://unpkg.com/brotli-wasm@1.3.1/index.web.js?module';
// export const brotliWasm = 'https://unpkg.zhimg.com/brotli-wasm@1.3.1/index.web.js?module';
export interface CourseDetailInterface {
  id?: string;
  title: string;
  totalHour?: number;
  description?: string;
  memberName?: string;
  memberId?: string;
  viewCount?: number;
  cover?: string;
  review?: ReviewStatus;
  l1Subject?: string;
  l2Subject?: string;
  isPublic?: boolean;
  memberTitle?: string;
  avatar?: string;
}
export interface CourseTreeInterface {
  id: string;
  title: string;
  review?: ReviewStatus;
  isPublished?: boolean;
  isModified?: boolean;
  isRemoveAfterReview?: boolean;
  children?: CourseTreeInterface[];
}
export interface SubjectInterface {
  id: string;
  title: string;
  addnew?: boolean;
  remove?: boolean;
  update?: boolean;
  children?: SubjectInterface[];
}
export enum ReviewStatus {
  NONE = 'NONE',
  APPLIED = 'APPLIED',
  REJECTED = 'REJECTED',
  FINISHED = 'FINISHED',
}

export enum ReviewAction {
  REQUEST = 'REQUEST',
  REJECT = 'REJECT',
  PASS = 'PASS',
  REQUEST_ENTIRE = 'REQUEST_ENTIRE',
  REJECT_ENTIRE = 'REJECT_ENTIRE',
  PASS_ENTIRE = 'PASS_ENTIRE',
}

export enum ItemAction {
  ADD = 'add',
  REMOVE = 'remove',
  UPDATE = 'update',
}
export enum MemberLevel {
  INTERN = 'Intern',
  FORMER_MEMBER = 'Former Member',
  CURRENT_MEMBER = 'Member',
  TECH = 'Tech',
  PI = 'Principal Investigator',
}
