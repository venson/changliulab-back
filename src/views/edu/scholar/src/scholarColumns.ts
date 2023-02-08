import { ScholarInterface } from '@/common/types';
import { DataTableColumns } from 'naive-ui';
export const scholarColumns: DataTableColumns<ScholarInterface> = [
  { title: 'Title', key: 'title' },
  { title: 'Year', key: 'year', width: 60, align: 'center' },
  { title: 'Total Citation', key: 'totalCitations', width: 60, align: 'center' },
];
