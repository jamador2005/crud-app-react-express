import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { ResourceType } from "@shared/schema";
import { ResourceItem } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { Eye, Edit, Trash2, User, FileText, MessageSquare, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ResourceCardProps {
  resourceType: ResourceType;
  item: ResourceItem;
  onView: (item: ResourceItem) => void;
  onEdit: (item: ResourceItem) => void;
  onDelete: (item: ResourceItem) => void;
}

export default function ResourceCard({ resourceType, item, onView, onEdit, onDelete }: ResourceCardProps) {
  const getIcon = () => {
    switch (resourceType) {
      case "users":
        return <User className="h-5 w-5 text-slate-400" />;
      case "posts":
        return <FileText className="h-5 w-5 text-slate-400" />;
      case "comments":
        return <MessageSquare className="h-5 w-5 text-slate-400" />;
      case "products":
        return <ShoppingBag className="h-5 w-5 text-slate-400" />;
    }
  };

  const getTitle = () => {
    if (resourceType === "users") return item.name;
    if (resourceType === "posts") return item.title;
    if (resourceType === "comments") return item.name;
    if (resourceType === "products") return item.name;
    return "";
  };

  const getDescription = () => {
    let description = "";
    
    if (resourceType === "users") description = item.email || "";
    else if (resourceType === "posts") description = item.body || "";
    else if (resourceType === "comments") description = item.body || "";
    else if (resourceType === "products") description = item.description || "";
    
    if (description && description.length > 100) {
      return description.substring(0, 100) + "...";
    }
    
    return description;
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-5 flex flex-row justify-between items-center">
        <div>
          <h3 className="text-lg leading-6 font-medium text-slate-900">{getTitle()}</h3>
          <p className="mt-1 max-w-2xl text-sm text-slate-500">{getDescription()}</p>
        </div>
        {getIcon()}
      </CardHeader>
      
      <CardContent className="p-0 border-t border-slate-200 bg-slate-50 px-5 py-3">
        <div className="flex justify-between text-sm">
          <div>
            <span className="text-slate-500">ID:</span>
            <span className="ml-1 text-slate-700">{item.id}</span>
          </div>
          {item.createdAt && (
            <div className="text-slate-500">
              {formatDate(new Date(item.createdAt))}
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="border-t border-slate-200 px-4 py-4 flex justify-end space-x-2">
        <Button 
          onClick={() => onView(item)}
          size="sm" 
          variant="outline"
          className="text-indigo-700 bg-indigo-100 border-indigo-200 hover:bg-indigo-200"
        >
          <Eye className="h-4 w-4 mr-1" />
          View
        </Button>
        
        <Button 
          onClick={() => onEdit(item)} 
          size="sm"
          variant="outline"
          className="text-blue-700 bg-blue-100 border-blue-200 hover:bg-blue-200"
        >
          <Edit className="h-4 w-4 mr-1" />
          Edit
        </Button>
        
        <Button 
          onClick={() => onDelete(item)}
          size="sm"
          variant="outline"
          className="text-red-700 bg-red-100 border-red-200 hover:bg-red-200"
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}
