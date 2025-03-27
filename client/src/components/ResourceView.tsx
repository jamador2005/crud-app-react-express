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
import { User, FileText, MessageSquare, ShoppingBag, Mail, AtSign, Calendar, Tag, CreditCard, AlignLeft, Copy, Check, Hash } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Function to copy text to clipboard
  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedField(fieldName);
      toast({
        title: "Copied!",
        description: `${fieldName} copied to clipboard`,
        duration: 2000,
      });
      
      // Reset the copied state after 2 seconds
      setTimeout(() => {
        setCopiedField(null);
      }, 2000);
    }).catch((err) => {
      console.error('Failed to copy text: ', err);
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    });
  };

  // Field component with copy functionality
  const Field = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string | number }) => {
    const stringValue = String(value);
    const isCopied = copiedField === label;
    
    return (
      <div className="flex items-start gap-2 group">
        <div className="h-4 w-4 text-gray-500 mt-1 flex-shrink-0">
          {icon}
        </div>
        <div className="flex-grow">
          <p className="text-sm font-medium text-gray-700">{label}</p>
          <div className="flex items-center gap-2">
            <p className="text-sm text-gray-600">{stringValue}</p>
            <button 
              type="button"
              onClick={() => copyToClipboard(stringValue, label)}
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 rounded-md hover:bg-gray-200"
              title={`Copy ${label}`}
            >
              {isCopied ? 
                <Check className="h-3.5 w-3.5 text-green-500" /> : 
                <Copy className="h-3.5 w-3.5 text-gray-400" />
              }
            </button>
          </div>
        </div>
      </div>
    );
  };

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
        <Field 
          icon={<User />} 
          label="Name" 
          value={user.name} 
        />
        
        <Field 
          icon={<Mail />} 
          label="Email" 
          value={user.email} 
        />
        
        <Field 
          icon={<AtSign />} 
          label="Username" 
          value={user.username} 
        />
        
        <Field 
          icon={<Calendar />} 
          label="Created At" 
          value={formatDate(user.createdAt)} 
        />
      </div>
    );
  };
  
  const renderPostDetails = () => {
    const post = item as PostType;
    return (
      <div className="space-y-3">
        <Field 
          icon={<FileText />} 
          label="Title" 
          value={post.title} 
        />
        
        <Field 
          icon={<AlignLeft />} 
          label="Content" 
          value={post.body} 
        />
        
        <Field 
          icon={<User />} 
          label="User ID" 
          value={post.userId} 
        />
        
        <Field 
          icon={<Calendar />} 
          label="Created At" 
          value={formatDate(post.createdAt)} 
        />
      </div>
    );
  };
  
  const renderCommentDetails = () => {
    const comment = item as CommentType;
    return (
      <div className="space-y-3">
        <Field 
          icon={<User />} 
          label="Name" 
          value={comment.name} 
        />
        
        <Field 
          icon={<Mail />} 
          label="Email" 
          value={comment.email} 
        />
        
        <Field 
          icon={<MessageSquare />} 
          label="Comment" 
          value={comment.body} 
        />
        
        <Field 
          icon={<FileText />} 
          label="Post ID" 
          value={comment.postId} 
        />
        
        <Field 
          icon={<Calendar />} 
          label="Created At" 
          value={formatDate(comment.createdAt)} 
        />
      </div>
    );
  };
  
  const renderProductDetails = () => {
    const product = item as ProductType;
    return (
      <div className="space-y-3">
        <Field 
          icon={<ShoppingBag />} 
          label="Product Name" 
          value={product.name} 
        />
        
        <Field 
          icon={<CreditCard />} 
          label="Price" 
          value={`$${product.price.toFixed(2)}`} 
        />
        
        <Field 
          icon={<AlignLeft />} 
          label="Description" 
          value={product.description} 
        />
        
        <Field 
          icon={<Tag />} 
          label="Category" 
          value={product.category} 
        />
        
        <Field 
          icon={<Calendar />} 
          label="Created At" 
          value={formatDate(product.createdAt)} 
        />
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
