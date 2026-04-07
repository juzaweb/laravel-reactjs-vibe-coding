import React from 'react';
import { Modal } from '../modal/Modal';
import { MediaContent } from '../../../pages/media/MediaContent';
import type { MediaItem } from '../../../pages/media/types';

export interface MediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (item: MediaItem) => void;
  title?: string;
}

export const MediaModal: React.FC<MediaModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  title = 'Select Media',
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="xl" className="h-[90vh] flex flex-col">
       <div className="flex-1 overflow-hidden">
         <MediaContent
           isSelectMode={true}
           onSelect={(item) => {
             onSelect(item);
             onClose();
           }}
         />
       </div>
    </Modal>
  );
};
