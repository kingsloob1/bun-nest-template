import { type ArgumentMetadata, Injectable, type PipeTransform } from '@nestjs/common';
import {endOfDay, format as formtDate, startOfDay} from 'date-fns';

@Injectable()
export class DateRangePipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    const { startDate, endDate, ...otherQueryParams } = value;

    if (typeof startDate === 'string' && startDate.trim().length > 2) {
      const startDateObj = new Date(startDate);
      const normalizedStartDate = startOfDay(startDateObj)
        .toISOString();

      const derivedEndDate =
        typeof endDate === 'string' && endDate.trim().length > 0
          ? new Date(endDate.trim())
          : new Date();

      const normalizedEndDate = endOfDay(derivedEndDate)
        .toISOString();

      return {
        ...otherQueryParams,
        startDate: normalizedStartDate,
        endDate: normalizedEndDate,
      };
    }

    // If the date range is not valid, exclude from query.
    return otherQueryParams;
  }
}
