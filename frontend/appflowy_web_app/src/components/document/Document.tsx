import { CreateRowDoc, LoadView, LoadViewMeta, YDoc, YjsEditorKey } from '@/application/types';
import DocumentSkeleton from '@/components/_shared/skeleton/DocumentSkeleton';
import { Editor } from '@/components/editor';
import { EditorVariant } from '@/components/editor/EditorContext';
import React, { Suspense, useCallback } from 'react';
import ViewMetaPreview, { ViewMetaProps } from '@/components/view-meta/ViewMetaPreview';
import { useSearchParams } from 'react-router-dom';

export interface DocumentProps {
  doc: YDoc;
  navigateToView?: (viewId: string) => Promise<void>;
  loadViewMeta?: LoadViewMeta;
  loadView?: LoadView;
  createRowDoc?: CreateRowDoc;
  viewMeta: ViewMetaProps;
  isTemplateThumb?: boolean;
  variant?: EditorVariant;
}

export const Document = ({
  doc,
  loadView,
  navigateToView,
  loadViewMeta,
  createRowDoc,
  viewMeta,
  isTemplateThumb,
  variant,
}: DocumentProps) => {
  const [search, setSearch] = useSearchParams();
  const blockId = search.get('blockId') || undefined;

  const onJumpedBlockId = useCallback(() => {
    setSearch(prev => {
      prev.delete('blockId');
      return prev;
    });
  }, [setSearch]);
  const document = doc?.getMap(YjsEditorKey.data_section)?.get(YjsEditorKey.document);

  if (!document) return null;

  return (
    <div
      style={{
        minHeight: `calc(100vh - 48px)`,
      }} className={'mb-16 flex h-full w-full flex-col items-center'}
    >
      <ViewMetaPreview {...viewMeta} />
      <Suspense fallback={<DocumentSkeleton />}>
        <div className={'flex justify-center w-full'}>
          <Editor
            loadView={loadView}
            loadViewMeta={loadViewMeta}
            navigateToView={navigateToView}
            createRowDoc={createRowDoc}
            readSummary={isTemplateThumb}
            doc={doc}
            readOnly={true}
            jumpBlockId={blockId}
            onJumpedBlockId={onJumpedBlockId}
            variant={variant}
          />
        </div>
      </Suspense>

    </div>
  );
};

export default Document;
