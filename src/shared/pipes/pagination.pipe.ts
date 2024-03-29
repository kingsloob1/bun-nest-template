import { type ArgumentMetadata, Injectable, type PipeTransform } from '@nestjs/common';

@Injectable()
export class PaginationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.type !== 'query') {
      return value;
    }
    const page = value?.page && Number(value.page) > 0 ? Number(value.page) : 1;
    value.take =
      value?.perPage && Number(value.perPage) > 0 ? Number(value.perPage) : 15;
    value.skip = (page - 1) * value.take;
    return value;
  }
}
