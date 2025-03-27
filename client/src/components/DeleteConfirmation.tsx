import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { ResourceType } from "@shared/schema";
import { ResourceItem } from "@/lib/types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AlertTriangle } from "lucide-react";

interface DeleteConfirmationProps {
  resourceType: ResourceType;
  item: ResourceItem;
  onClose: () => void;
}

export default function DeleteConfirmation({
  resourceType,
  item,
  onClose,
}: DeleteConfirmationProps) {
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("DELETE", `/api/${resourceType}/${item.id}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/${resourceType}`] });
      toast({
        title: "Resource deleted",
        description: "The resource has been deleted successfully.",
      });
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete resource: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const handleDelete = () => {
    mutation.mutate();
  };

  const getTitle = () => {
    switch (resourceType) {
      case "users":
        return item.name || "this user";
      case "posts":
        return item.title || "this post";
      case "comments":
        return "this comment";
      case "products":
        return item.name || "this product";
      default:
        return "this resource";
    }
  };

  return (
    <AlertDialog open={true} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" /> Delete Resource
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete {getTitle()}? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-red-600 text-white hover:bg-red-700"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
