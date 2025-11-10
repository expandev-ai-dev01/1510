import { useMutation, useQueryClient } from '@tanstack/react-query';
import { transactionService } from '../../services/transactionService';
import type { UseTransactionMutationsReturn } from './types';

export const useTransactionMutations = (): UseTransactionMutationsReturn => {
  const queryClient = useQueryClient();

  const { mutateAsync: create, isPending: isCreating } = useMutation({
    mutationFn: transactionService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['balance'] });
    },
  });

  const { mutateAsync: update, isPending: isUpdating } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => transactionService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['balance'] });
    },
  });

  const { mutateAsync: remove, isPending: isRemoving } = useMutation({
    mutationFn: transactionService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['balance'] });
    },
  });

  return {
    create,
    update: (id, data) => update({ id, data }),
    remove,
    isCreating,
    isUpdating,
    isRemoving,
  };
};
