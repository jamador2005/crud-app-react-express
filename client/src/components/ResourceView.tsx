import { ResourceType } from "@shared/schema";
import { ResourceItem } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { User, FileText, MessageSquare, ShoppingBag } from "lucide-react";

interface ResourceViewProps {
  resourceType: ResourceType;
  item: ResourceItem;
  onClose: () => void;
}

export default function ResourceView({
  resourceType,
  item,
  onClose,
}: ResourceViewProps) {
  const getIcon = () => {
    switch (resourceType) {
      case "users":
        return <User className="h-5 w-5 text-indigo-600" />;
      case "posts":
        return <FileText className="h-5 w-5 text-indigo-600" />;
      case "comments":
        return <MessageSquare className="h-5 w-5 text-indigo-600" />;
      case "products":
        return <ShoppingBag className="h-5 w-5 text-indigo-600" />;
    }
  };

  const getTitle = () => {
    if (resourceType === "users") return item.name;
    if (resourceType === "posts") return item.title;
    if (resourceType === "comments") return `Comment by ${item.name}`;
    if (resourceType === "products") return item.name;
    return "Resource Details";
  };

  const displayableItem = { ...item };
  
  // Don't display passwords in the view
  if (resourceType === "users" && "password" in displayableItem) {
    delete displayableItem.password;
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getIcon()} {getTitle()}
          </DialogTitle>
          <DialogDescription>
            Resource details and properties.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh]">
          <div className="bg-slate-50 p-4 rounded-md">
            <pre className="text-sm text-slate-700 whitespace-pre-wrap overflow-auto max-h-[400px]">
              {JSON.stringify(displayableItem, null, 2)}
            </pre>
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
