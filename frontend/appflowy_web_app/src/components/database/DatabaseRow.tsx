import { AppendBreadcrumb } from '@/application/types';
import ComponentLoading from '@/components/_shared/progress/ComponentLoading';
import { DatabaseRowProperties, DatabaseRowSubDocument } from '@/components/database/components/database-row';
import DatabaseRowHeader from '@/components/database/components/header/DatabaseRowHeader';
import { Divider } from '@mui/material';
import React, { Suspense } from 'react';

export function DatabaseRow ({ appendBreadcrumb, rowId }: { rowId: string; appendBreadcrumb?: AppendBreadcrumb }) {
  return (
    <div className={'flex w-full justify-center'}>
      <div className={'max-w-screen w-[964px] min-w-0'}>
        <div className={' relative flex  flex-col gap-4'}>
          <DatabaseRowHeader appendBreadcrumb={appendBreadcrumb} rowId={rowId} />

          <div className={'flex flex-1 flex-col gap-4'}>
            <Suspense>
              <DatabaseRowProperties rowId={rowId} />
            </Suspense>
            <Divider className={'w-full'} />
            <Suspense fallback={<ComponentLoading />}>
              <DatabaseRowSubDocument rowId={rowId} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DatabaseRow;
