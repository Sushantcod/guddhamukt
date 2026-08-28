import { useState, useCallback } from 'react';
import { Issue, IssueCategory } from '../types';
import { findNearbyDuplicateIssue, DuplicateMatchResult } from '../utils/haversine';

export function useDuplicateDetection(allIssues: Issue[]) {
  const [duplicateResult, setDuplicateResult] = useState<DuplicateMatchResult>({
    isDuplicate: false,
  });
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const checkForDuplicate = useCallback(
    (lat: number, lng: number, category: IssueCategory): DuplicateMatchResult => {
      const result = findNearbyDuplicateIssue(allIssues, lat, lng, category, 60);
      setDuplicateResult(result);
      if (result.isDuplicate) {
        setIsModalOpen(true);
      }
      return result;
    },
    [allIssues]
  );

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  return {
    duplicateResult,
    isModalOpen,
    checkForDuplicate,
    closeModal,
  };
}
