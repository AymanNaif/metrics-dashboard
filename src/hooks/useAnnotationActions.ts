import { createAnnotation, deleteAnnotation } from "@/lib/api/annotations";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface UseAnnotationActionsProps {
  datasetId?: string;
}

export function useAnnotationActions({ datasetId }: UseAnnotationActionsProps) {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: createAnnotation,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["metrics"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAnnotation,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["metrics"] }),
  });

  const create = (timestamp: number, text: string) => {
    if (!datasetId) return;
    createMutation.mutate({ dataset_id: datasetId, timestamp, text });
  };

  const remove = (id: string) => {
    deleteMutation.mutate(id);
  };

  return {
    create,
    remove,
    isCreating: createMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
