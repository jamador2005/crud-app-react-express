import { ResourceType } from "@shared/schema";
import { ResourceItem } from "@/lib/types";
import ResourceCard from "@/components/ResourceCard";
import { Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ResourceListProps {
  resourceType: ResourceType;
  resources: ResourceItem[];
  isLoading: boolean;
  onView: (item: ResourceItem) => void;
  onEdit: (item: ResourceItem) => void;
  onDelete: (item: ResourceItem) => void;
  onCreate: () => void;
}

export default function ResourceList({
  resourceType,
  resources,
  isLoading,
  onView,
  onEdit,
  onDelete,
  onCreate,
}: ResourceListProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-white bg-primary">
          <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
          Loading...
        </div>
      </div>
    );
  }

  if (resources.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-slate-100 inline-flex items-center justify-center p-4 rounded-full mb-4">
          <span className="material-icons text-slate-400 text-2xl">folder_off</span>
        </div>
        <h3 className="text-sm font-medium text-slate-900">No resources found</h3>
        <p className="mt-1 text-sm text-slate-500">Get started by creating a new resource.</p>
        <div className="mt-6">
          <Button onClick={onCreate} className="inline-flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create Resource
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {resources.map((item) => (
        <ResourceCard
          key={item.id}
          resourceType={resourceType}
          item={item}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
