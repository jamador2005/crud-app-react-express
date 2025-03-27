import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { ResourceType } from "@shared/schema";
import { ResourceItem } from "@/lib/types";
import { apiRequest } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User, FileText, MessageSquare, ShoppingBag } from "lucide-react";

interface ResourceFormProps {
  resourceType: ResourceType;
  mode: "create" | "edit";
  item: ResourceItem | null;
  onClose: () => void;
}

export default function ResourceForm({
  resourceType,
  mode,
  item,
  onClose,
}: ResourceFormProps) {
  const { toast } = useToast();

  // Dynamic schema based on resource type
  const getFormSchema = () => {
    switch (resourceType) {
      case "users":
        return z.object({
          name: z.string().min(2, "Name must be at least 2 characters"),
          email: z.string().email("Invalid email format"),
          username: z.string().min(3, "Username must be at least 3 characters"),
          password: mode === "create" 
            ? z.string().min(6, "Password must be at least 6 characters") 
            : z.string().min(6, "Password must be at least 6 characters").optional(),
        });

      case "posts":
        return z.object({
          title: z.string().min(3, "Title must be at least 3 characters"),
          body: z.string().min(10, "Content must be at least 10 characters"),
          userId: z.coerce.number().positive("User ID must be a positive number"),
        });

      case "comments":
        return z.object({
          name: z.string().min(2, "Name must be at least 2 characters"),
          email: z.string().email("Invalid email format"),
          body: z.string().min(5, "Comment must be at least 5 characters"),
          postId: z.coerce.number().positive("Post ID must be a positive number"),
        });

      case "products":
        return z.object({
          name: z.string().min(2, "Name must be at least 2 characters"),
          price: z.coerce.number().positive("Price must be a positive number"),
          description: z.string().min(10, "Description must be at least 10 characters"),
          category: z.string().min(2, "Please select a category"),
        });

      default:
        return z.object({});
    }
  };

  type FormValues = z.infer<ReturnType<typeof getFormSchema>>;

  // Initialize the form with the correct schema and default values
  const form = useForm<FormValues>({
    resolver: zodResolver(getFormSchema()),
    defaultValues: item ? {
      ...item,
      // Type-safe property access based on resource type
      ...(resourceType === "posts" && 'userId' in item && { userId: String(item.userId) }),
      ...(resourceType === "comments" && 'postId' in item && { postId: String(item.postId) }),
      // For products, we're no longer converting price to string to avoid data type issues
    } : {
      // Empty defaults based on resource type
      ...(resourceType === "users" && { name: "", email: "", username: "", password: "" }),
      ...(resourceType === "posts" && { title: "", body: "", userId: "" }),
      ...(resourceType === "comments" && { name: "", email: "", body: "", postId: "" }),
      ...(resourceType === "products" && { name: "", price: "", description: "", category: "" }),
    },
  });

  // Create or update mutation
  const mutation = useMutation({
    mutationFn: async (data: FormValues) => {
      const endpoint = `/api/${resourceType}${mode === "edit" && item ? `/${item.id}` : ""}`;
      const method = mode === "create" ? "POST" : "PUT";
      const response = await apiRequest(method, endpoint, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/${resourceType}`] });
      toast({
        title: mode === "create" ? "Resource created" : "Resource updated",
        description: mode === "create"
          ? "The resource has been created successfully."
          : "The resource has been updated successfully.",
        variant: "default",
      });
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to ${mode} resource: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FormValues) => {
    // Make sure we're sending the correct data types to the server
    let processedData = { ...data };
    
    // For products, ensure price is a number when submitting
    if (resourceType === "products" && 'price' in processedData) {
      processedData = {
        ...processedData,
        price: typeof processedData.price === 'string' 
          ? parseFloat(processedData.price) 
          : processedData.price
      };
    }
    
    mutation.mutate(processedData);
  };

  const getFormIcon = () => {
    switch (resourceType) {
      case "users":
        return <User className="h-5 w-5" />;
      case "posts":
        return <FileText className="h-5 w-5" />;
      case "comments":
        return <MessageSquare className="h-5 w-5" />;
      case "products":
        return <ShoppingBag className="h-5 w-5" />;
    }
  };

  const getFormTitle = () => {
    const action = mode === "create" ? "Create" : "Edit";
    switch (resourceType) {
      case "users":
        return `${action} User`;
      case "posts":
        return `${action} Post`;
      case "comments":
        return `${action} Comment`;
      case "products":
        return `${action} Product`;
      default:
        return `${action} Resource`;
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getFormIcon()} {getFormTitle()}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Fill in the details to create a new resource."
              : "Update the details of this resource."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Dynamic form fields based on resource type */}
            {resourceType === "users" && (
              <>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="Email address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="Username" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{mode === "edit" ? "New Password (leave blank to keep current)" : "Password"}</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder={mode === "edit" ? "New password (optional)" : "Password"} 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            {resourceType === "posts" && (
              <>
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Post title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="body"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Post content"
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="userId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>User ID</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="User ID" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            {resourceType === "comments" && (
              <>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="Email address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="body"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Comment</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Your comment"
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="postId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Post ID</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Post ID" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            {resourceType === "products" && (
              <>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Product name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price</FormLabel>
                      <FormControl>
                        <div className="flex items-center">
                          <span className="absolute ml-3 text-slate-500">$</span>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            className="pl-7"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Product description"
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="electronics">Electronics</SelectItem>
                          <SelectItem value="clothing">Clothing</SelectItem>
                          <SelectItem value="books">Books</SelectItem>
                          <SelectItem value="home">Home & Kitchen</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            <DialogFooter className="pt-4">
              <Button variant="outline" type="button" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? "Saving..." : mode === "create" ? "Create" : "Update"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
