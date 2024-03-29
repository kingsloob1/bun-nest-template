import { join } from 'path';
import processEnvObj from '../config/envs';
import type { PaginationData } from '~/constant/Pagination';
import { SetMetadata } from '@nestjs/common';
import { format as formatDate } from 'date-fns';
import type { Options as StringifyObjectOptions } from 'stringify-object';

export const pathFromSrc = (path: string) => {
  return join(import.meta.dirname, '../', path);
};

export const getExpiryTimeStamp = (expireIn: number): number =>
  Math.floor(Date.now() / 1000) + expireIn;

export const validTimeInSecs = (timeStampInSecs: number): boolean => {
  return Math.floor(Date.now() / 1000) < timeStampInSecs;
};

export const hasTimestampExpired = (timeStamp: number): boolean => {
  // Get the current timestamp in seconds
  const currentTimestamp = Math.floor(Date.now() / 1000);

  // Add 48 hours (in seconds) to the current timestamp to get the future timestamp
  const futureTimestamp = currentTimestamp + 48 * 60 * 60;

  // Compare the provided timestamp with the future timestamp
  // If the provided timestamp is less than or equal to the future timestamp,
  // it means it will expire within the next 48 hours and should be considered expired
  return timeStamp <= futureTimestamp;
};

export const calculateTotalPages = (total: number, limit: number): number => {
  const numberToRound = total / limit;
  const remainder = total % limit;
  let totalPages = Math.round(numberToRound);
  if (remainder) {
    totalPages = totalPages + 1;
  }
  return totalPages;
};

export const generatePaginationMeta = (
  take: number,
  page: number,
  total: number,
): PaginationData => {
  const totalPages = calculateTotalPages(total, take);
  const nextPage = page >= totalPages ? totalPages : page + 1;
  const previousPage = page == 1 ? page : page - 1;
  const meta: PaginationData = {
    total,

    perPage: take,

    currentPage: page,
    totalPages,
    first: `${processEnvObj.APP_URL}/api/v1/products/pageSize=${take}&page=${page}`,
    last: `${processEnvObj.APP_URL}/api/v1/products/pageSize=${take}&page=${totalPages}`,
    prev: `${processEnvObj.APP_URL}/api/v1/products/pageSize=${take}&page=${previousPage}`,
    next: `${processEnvObj.APP_URL}/api/v1/products/pageSize=${take}&page=${nextPage}`,
  };
  return meta;
};

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
export const safeCharForSearchQuery = /[^\u0600-\u06FF\w\s@.,-]/gi;

export const stringify = async (
  input: unknown,
  options?: StringifyObjectOptions,
  pad?: string,
) => {
  const { default: stringifyObject } = (await eval(
    `import('stringify-object')`,
  )) as {
    default: (
      input: unknown,
      options?: StringifyObjectOptions,
      pad?: string,
    ) => string;
  };

  return stringifyObject(
    input,
    {
      ...(options || {}),
      indent: '',
      singleQuotes: false,
    },
    pad,
  );
};

export const getLatestDate = (datesArray: Array<Date | string>) => {
  const dateObjects = datesArray.map((dateStr) => new Date(dateStr));

  dateObjects.sort((a, b) => b.getTime() - a.getTime());

  return dateObjects[0].toISOString().replace('T', ' ').split('.')[0];
};

export const isStartDateGreaterThanStopDate = (
  startDate: Date,
  stopDate: Date,
): boolean => {
  return (
    formatDate(new Date(startDate), 'yyyy-MM-dd') >=
    formatDate(new Date(stopDate), 'yyyy-MM-dd')
  );
};

const englishToArabic: { [key: string]: string } = {
  Saturday: 'السبت',
  Sunday: 'الأحد',
  Monday: 'الاثنين',
  Tuesday: 'الثلاثاء',
  Wednesday: 'الأربعاء',
  Thursday: 'الخميس',
  Friday: 'الجمعة',
};

const arabicToEnglish: { [key: string]: string } = {
  السبت: 'Saturday',
  الأحد: 'Sunday',
  الاثنين: 'Monday',
  الثلاثاء: 'Tuesday',
  الأربعاء: 'Wednesday',
  الخميس: 'Thursday',
  الجمعة: 'Friday',
};

export function removeTrailingSlash(baseUrl: string): string {
  return baseUrl.replace(/\/$/, ''); // This regex removes the trailing slash
}

export function extractTextFromHTML(html: string): string {
  if (!/<[a-z][\s\S]*>/i.test(html)) {
    return html;
  }
  const regex = /<[^>]*>/g;
  const text = html.replace(regex, '');
  return text?.trim();
}

export class ErrorOnNCount extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ErrorOnNCount';
  }
}

export const throwErrorOnNCount = (n: number) => {
  let init = 0;
  return {
    counter: () => {
      init++;
      if (init === n) {
        throw new ErrorOnNCount(`Count up to ${n} Erroring out now`);
      }
    },
  };
};

export function sleep(ms: number) {
  return Bun.sleep(ms)
}
