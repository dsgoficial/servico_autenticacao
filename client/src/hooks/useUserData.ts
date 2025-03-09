// Path: hooks\useUserData.ts
import { useQuery } from '@tanstack/react-query';
import { getUserPositions, getUserShifts } from '../services/userService';
import { PositionType, RotationType } from '../types/auth';
import { createQueryKey, STALE_TIMES } from '../lib/queryClient';

const QUERY_KEYS = {
  POSITIONS: createQueryKey('positions'),
  ROTATIONS: createQueryKey('rotations'),
};

export const useUserData = () => {
  // Fetch positions data (ranks)
  const {
    data: positionsData,
    isLoading: isLoadingPositions,
    error: positionsError,
  } = useQuery({
    queryKey: QUERY_KEYS.POSITIONS,
    queryFn: getUserPositions,
    staleTime: STALE_TIMES.REFERENCE_DATA, // Reference data changes infrequently
  });

  // Fetch rotations data (shifts)
  const {
    data: rotationsData,
    isLoading: isLoadingRotations,
    error: rotationsError,
  } = useQuery({
    queryKey: QUERY_KEYS.ROTATIONS,
    queryFn: getUserShifts,
    staleTime: STALE_TIMES.REFERENCE_DATA, // Reference data changes infrequently
  });

  return {
    positions: positionsData?.dados || ([] as PositionType[]),
    rotations: rotationsData?.dados || ([] as RotationType[]),
    isLoading: isLoadingPositions || isLoadingRotations,
    error: positionsError || rotationsError,
  };
};
