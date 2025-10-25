import React, { useEffect, useRef, useCallback, useState } from 'react';
import { PullRequestListData } from '@shared/types/pull-requests';
import TaskCard from './TaskCard';
import ErrorRow from '../../pull-request-feed/components/ErrorRow';
import LoadingRows from '../../pull-request-feed/components/LoadingRows';
import { useTaskOrder } from '../hooks/useTaskOrder';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface TasksListProps {
  pullRequests: PullRequestListData[];
  hasMoreItems: boolean;
  isLoadingMore: boolean;
  username: string;
  className: string;
  loading: boolean;
  error: string | null;
  isClient: boolean;
  onCardClick: (pr: PullRequestListData) => void;
  onRetry: () => void;
  onLoadMore: () => void;
}

// Sortable wrapper for each task card
interface SortableTaskCardProps {
  pr: PullRequestListData;
  onCardClick: (pr: PullRequestListData) => void;
}

const SortableTaskCard: React.FC<SortableTaskCardProps> = ({ pr, onCardClick }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: pr.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative">
      {/* Drag handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 cursor-grab active:cursor-grabbing z-10"
        title="Drag to reorder"
      >
        <span className="text-lg">⋮⋮</span>
      </div>

      {/* Card with left padding for drag handle */}
      <div className="pl-8">
        <TaskCard pullRequest={pr} onClick={() => onCardClick(pr)} />
      </div>
    </div>
  );
};

/**
 * TasksList - Displays filtered open PRs with labels and drag-drop
 * Reuses PullRequestList structure
 */
export const TasksList: React.FC<TasksListProps> = ({
  pullRequests,
  hasMoreItems,
  isLoadingMore,
  username,
  className,
  loading,
  error,
  isClient,
  onCardClick,
  onRetry,
  onLoadMore
}) => {
  const infiniteScrollTriggerRef = useRef<HTMLDivElement>(null);
  const { sortPRsByOrder, updateOrder, isLoaded } = useTaskOrder();
  const [orderedPRs, setOrderedPRs] = useState<PullRequestListData[]>(pullRequests);

  // Sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Update ordered PRs when pullRequests or order changes
  useEffect(() => {
    if (isLoaded) {
      const sorted = sortPRsByOrder(pullRequests);
      setOrderedPRs(sorted);
    }
  }, [pullRequests, sortPRsByOrder, isLoaded]);

  // Handle loading more items
  const handleLoadMore = useCallback(() => {
    if (!isLoadingMore && hasMoreItems) {
      onLoadMore();
    }
  }, [isLoadingMore, hasMoreItems, onLoadMore]);

  // Set up intersection observer for infinite scroll
  useEffect(() => {
    if (!isClient || !infiniteScrollTriggerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasMoreItems && !isLoadingMore && !loading) {
          console.log('🔄 Intersection Observer triggered - loading more items');
          handleLoadMore();
        }
      },
      {
        rootMargin: '100px',
        threshold: 0.1
      }
    );

    observer.observe(infiniteScrollTriggerRef.current);

    return () => {
      observer.disconnect();
    };
  }, [isClient, hasMoreItems, isLoadingMore, loading, handleLoadMore]);

  // Handle drag end
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = orderedPRs.findIndex((pr) => pr.id === active.id);
      const newIndex = orderedPRs.findIndex((pr) => pr.id === over.id);

      const newOrder = arrayMove(orderedPRs, oldIndex, newIndex);
      setOrderedPRs(newOrder);
      updateOrder(newOrder);
    }
  };

  console.log('📊 TasksList rendering:', {
    totalPRs: pullRequests.length,
    orderedPRs: orderedPRs.length,
    loading,
    error,
    hasMoreItems
  });

  // Helper function to render task cards
  const renderTaskCards = (prs: PullRequestListData[]) => {
    return prs.map((pr) => (
      <SortableTaskCard
        key={pr.id}
        pr={pr}
        onCardClick={onCardClick}
      />
    ));
  };

  // Determine what to render in the table body
  const renderTableBody = () => {
    // Show error state if error exists and no pull requests
    if (error && orderedPRs.length === 0) {
      return (
        <div className="my-4">
          <ErrorRow error={error} onRetry={onRetry} />
        </div>
      );
    }

    // Show loading state
    if (loading && orderedPRs.length === 0) {
      return (
        <div className="my-4">
          <LoadingRows />
        </div>
      );
    }

    // Show empty state
    if (orderedPRs.length === 0 && !loading) {
      return (
        <div className="my-8 text-center">
          <p className="pr-text-muted text-lg">No pending pull requests</p>
          <p className="pr-text-muted text-sm mt-2">All caught up! 🎉</p>
        </div>
      );
    }

    // Show pull requests with drag and drop
    return (
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={orderedPRs.map(pr => pr.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-1">
            {renderTaskCards(orderedPRs)}
          </div>
        </SortableContext>
      </DndContext>
    );
  };

  return (
    <div className={`pull-request-feed ${className}`}>
      <div className="container mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-bold pr-text-primary">
              Pending Approvals
            </h2>
            {pullRequests.length > 0 && (
              <span className="text-sm pr-text-muted">
                {pullRequests.length} open {pullRequests.length === 1 ? 'PR' : 'PRs'}
              </span>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="bg-gray-900/30 dark:bg-gray-800/30 rounded-lg border border-gray-700/50 overflow-hidden">
          {renderTableBody()}

          {/* Loading more indicator */}
          {isLoadingMore && (
            <div className="p-4 text-center">
              <LoadingRows rows={1} />
            </div>
          )}

          {/* Infinite scroll trigger */}
          {hasMoreItems && !isLoadingMore && (
            <div ref={infiniteScrollTriggerRef} className="h-4" />
          )}
        </div>
      </div>
    </div>
  );
};

export default TasksList;
