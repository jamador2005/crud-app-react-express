import { ResourceType, User as UserType, Post as PostType, Comment as CommentType, Product as ProductType } from "@shared/schema";
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
import { User, FileText, MessageSquare, ShoppingBag, Mail, AtSign, Calendar, Hash, Tag, CreditCard, AlignLeft, FileText as FileDescription } from "lucide-react";
import { format } from "date-fns";

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
    switch (resourceType) {
      case "users":
        return (item as UserType).name;
      case "posts":
        return (item as PostType).title;
      case "comments":
        return `Comment by ${(item as CommentType).name}`;
      case "products":
        return (item as ProductType).name;
      default:
        return "Resource Details";
    }
  };

  // Helper function to format dates safely
  const formatDate = (date: Date | string | number | null | undefined): string => {
    if (!date) return "N/A";
    return format(new Date(date), 'PPP');
  };

  const renderUserDetails = () => {
    const user = item as UserType;
    return (
      <div className="space-y-3">
        <div className="flex items-start gap-2">
          <User className="h-4 w-4 text-gray-500 mt-1" />
          <div>
            <p className="text-sm font-medium text-gray-700">Name</p>
            <p className="text-sm text-gray-600">{user.name}</p>
          </div>
        </div>
        
        <div className="flex items-start gap-2">
          <Mail className="h-4 w-4 text-gray-500 mt-1" />
          <div>
            <p className="text-sm font-medium text-gray-700">Email</p>
            <p className="text-sm text-gray-600">{user.email}</p>
          </div>
        </div>
        
        <div className="flex items-start gap-2">
          <AtSign className="h-4 w-4 text-gray-500 mt-1" />
          <div>
            <p className="text-sm font-medium text-gray-700">Username</p>
            <p className="text-sm text-gray-600">{user.username}</p>
          </div>
        </div>
        
        <div className="flex items-start gap-2">
          <Hash className="h-4 w-4 text-gray-500 mt-1" />
          <div>
            <p className="text-sm font-medium text-gray-700">ID</p>
            <p className="text-sm text-gray-600">{user.id}</p>
          </div>
        </div>
        
        <div className="flex items-start gap-2">
          <Calendar className="h-4 w-4 text-gray-500 mt-1" />
          <div>
            <p className="text-sm font-medium text-gray-700">Created At</p>
            <p className="text-sm text-gray-600">{formatDate(user.createdAt)}</p>
          </div>
        </div>
      </div>
    );
  };
  
  const renderPostDetails = () => {
    const post = item as PostType;
    return (
      <div className="space-y-3">
        <div className="flex items-start gap-2">
          <FileText className="h-4 w-4 text-gray-500 mt-1" />
          <div>
            <p className="text-sm font-medium text-gray-700">Title</p>
            <p className="text-sm text-gray-600">{post.title}</p>
          </div>
        </div>
        
        <div className="flex items-start gap-2">
          <AlignLeft className="h-4 w-4 text-gray-500 mt-1" />
          <div>
            <p className="text-sm font-medium text-gray-700">Content</p>
            <p className="text-sm text-gray-600">{post.body}</p>
          </div>
        </div>
        
        <div className="flex items-start gap-2">
          <User className="h-4 w-4 text-gray-500 mt-1" />
          <div>
            <p className="text-sm font-medium text-gray-700">User ID</p>
            <p className="text-sm text-gray-600">{post.userId}</p>
          </div>
        </div>
        
        <div className="flex items-start gap-2">
          <Hash className="h-4 w-4 text-gray-500 mt-1" />
          <div>
            <p className="text-sm font-medium text-gray-700">ID</p>
            <p className="text-sm text-gray-600">{post.id}</p>
          </div>
        </div>
        
        <div className="flex items-start gap-2">
          <Calendar className="h-4 w-4 text-gray-500 mt-1" />
          <div>
            <p className="text-sm font-medium text-gray-700">Created At</p>
            <p className="text-sm text-gray-600">{formatDate(post.createdAt)}</p>
          </div>
        </div>
      </div>
    );
  };
  
  const renderCommentDetails = () => {
    const comment = item as CommentType;
    return (
      <div className="space-y-3">
        <div className="flex items-start gap-2">
          <User className="h-4 w-4 text-gray-500 mt-1" />
          <div>
            <p className="text-sm font-medium text-gray-700">Name</p>
            <p className="text-sm text-gray-600">{comment.name}</p>
          </div>
        </div>
        
        <div className="flex items-start gap-2">
          <Mail className="h-4 w-4 text-gray-500 mt-1" />
          <div>
            <p className="text-sm font-medium text-gray-700">Email</p>
            <p className="text-sm text-gray-600">{comment.email}</p>
          </div>
        </div>
        
        <div className="flex items-start gap-2">
          <MessageSquare className="h-4 w-4 text-gray-500 mt-1" />
          <div>
            <p className="text-sm font-medium text-gray-700">Comment</p>
            <p className="text-sm text-gray-600">{comment.body}</p>
          </div>
        </div>
        
        <div className="flex items-start gap-2">
          <FileText className="h-4 w-4 text-gray-500 mt-1" />
          <div>
            <p className="text-sm font-medium text-gray-700">Post ID</p>
            <p className="text-sm text-gray-600">{comment.postId}</p>
          </div>
        </div>
        
        <div className="flex items-start gap-2">
          <Hash className="h-4 w-4 text-gray-500 mt-1" />
          <div>
            <p className="text-sm font-medium text-gray-700">ID</p>
            <p className="text-sm text-gray-600">{comment.id}</p>
          </div>
        </div>
        
        <div className="flex items-start gap-2">
          <Calendar className="h-4 w-4 text-gray-500 mt-1" />
          <div>
            <p className="text-sm font-medium text-gray-700">Created At</p>
            <p className="text-sm text-gray-600">{formatDate(comment.createdAt)}</p>
          </div>
        </div>
      </div>
    );
  };
  
  const renderProductDetails = () => {
    const product = item as ProductType;
    return (
      <div className="space-y-3">
        <div className="flex items-start gap-2">
          <ShoppingBag className="h-4 w-4 text-gray-500 mt-1" />
          <div>
            <p className="text-sm font-medium text-gray-700">Product Name</p>
            <p className="text-sm text-gray-600">{product.name}</p>
          </div>
        </div>
        
        <div className="flex items-start gap-2">
          <CreditCard className="h-4 w-4 text-gray-500 mt-1" />
          <div>
            <p className="text-sm font-medium text-gray-700">Price</p>
            <p className="text-sm text-gray-600">${product.price.toFixed(2)}</p>
          </div>
        </div>
        
        <div className="flex items-start gap-2">
          <AlignLeft className="h-4 w-4 text-gray-500 mt-1" />
          <div>
            <p className="text-sm font-medium text-gray-700">Description</p>
            <p className="text-sm text-gray-600">{product.description}</p>
          </div>
        </div>
        
        <div className="flex items-start gap-2">
          <Tag className="h-4 w-4 text-gray-500 mt-1" />
          <div>
            <p className="text-sm font-medium text-gray-700">Category</p>
            <p className="text-sm text-gray-600">{product.category}</p>
          </div>
        </div>
        
        <div className="flex items-start gap-2">
          <Hash className="h-4 w-4 text-gray-500 mt-1" />
          <div>
            <p className="text-sm font-medium text-gray-700">ID</p>
            <p className="text-sm text-gray-600">{product.id}</p>
          </div>
        </div>
        
        <div className="flex items-start gap-2">
          <Calendar className="h-4 w-4 text-gray-500 mt-1" />
          <div>
            <p className="text-sm font-medium text-gray-700">Created At</p>
            <p className="text-sm text-gray-600">{formatDate(product.createdAt)}</p>
          </div>
        </div>
      </div>
    );
  };

  const renderResourceDetails = () => {
    switch (resourceType) {
      case "users":
        return renderUserDetails();
      case "posts":
        return renderPostDetails();
      case "comments":
        return renderCommentDetails();
      case "products":
        return renderProductDetails();
      default:
        // Fallback to JSON display
        return (
          <pre className="text-sm text-slate-700 whitespace-pre-wrap overflow-auto max-h-[400px]">
            {JSON.stringify(item, null, 2)}
          </pre>
        );
    }
  };

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
            {renderResourceDetails()}
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
