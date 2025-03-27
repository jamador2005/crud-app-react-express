import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ResourceList from "@/components/ResourceList";
import ResourceForm from "@/components/ResourceForm";
import ResourceView from "@/components/ResourceView";
import DeleteConfirmation from "@/components/DeleteConfirmation";
import { ResourceType } from "@shared/schema";
import { ResourceItem } from "@/lib/types";

export default function Home() {
  const [activeResource, setActiveResource] = useState<ResourceType>("users");
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [selectedItem, setSelectedItem] = useState<ResourceItem | null>(null);

  const { data: resources = [], isLoading } = useQuery({
    queryKey: [`/api/${activeResource}`],
  });

  const filteredResources = searchTerm.trim() === ""
    ? resources
    : resources.filter((item: any) => {
        const searchFields = [
          item.name, 
          item.title, 
          item.email, 
          item.username,
          item.description,
          item.body,
          item.category
        ].filter(Boolean);
        
        const lowerTerm = searchTerm.toLowerCase();
        return searchFields.some(field => 
          field && field.toLowerCase().includes(lowerTerm)
        );
      });

  const handleCreateNew = () => {
    setSelectedItem(null);
    setFormMode("create");
    setIsFormOpen(true);
  };

  const handleEdit = (item: ResourceItem) => {
    setSelectedItem(item);
    setFormMode("edit");
    setIsFormOpen(true);
  };

  const handleView = (item: ResourceItem) => {
    setSelectedItem(item);
    setIsViewOpen(true);
  };

  const handleDelete = (item: ResourceItem) => {
    setSelectedItem(item);
    setIsDeleteOpen(true);
  };

  const resourceTabMapping = {
    users: "Users",
    posts: "Posts",
    comments: "Comments",
    products: "Products"
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-slate-900">{resourceTabMapping[activeResource]}</h1>
        
        <div className="flex gap-4 w-full sm:w-auto">
          <div className="relative flex-grow sm:flex-grow-0 sm:w-64">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-primary"
            />
            <span className="material-icons absolute left-3 top-2 text-slate-400">search</span>
          </div>
          
          <button
            onClick={handleCreateNew}
            className="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium shadow-sm hover:bg-indigo-700"
          >
            Create New
          </button>
        </div>
      </div>

      <Tabs defaultValue="users" value={activeResource} onValueChange={(value) => setActiveResource(value as ResourceType)}>
        <TabsList className="mb-6">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="comments">Comments</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <ResourceList
            resourceType="users"
            resources={filteredResources}
            isLoading={isLoading}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onCreate={handleCreateNew}
          />
        </TabsContent>
        
        <TabsContent value="posts">
          <ResourceList
            resourceType="posts"
            resources={filteredResources}
            isLoading={isLoading}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onCreate={handleCreateNew}
          />
        </TabsContent>
        
        <TabsContent value="comments">
          <ResourceList
            resourceType="comments"
            resources={filteredResources}
            isLoading={isLoading}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onCreate={handleCreateNew}
          />
        </TabsContent>
        
        <TabsContent value="products">
          <ResourceList
            resourceType="products"
            resources={filteredResources}
            isLoading={isLoading}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onCreate={handleCreateNew}
          />
        </TabsContent>
      </Tabs>

      {isFormOpen && (
        <ResourceForm
          resourceType={activeResource}
          mode={formMode}
          item={selectedItem}
          onClose={() => setIsFormOpen(false)}
        />
      )}

      {isViewOpen && selectedItem && (
        <ResourceView
          resourceType={activeResource}
          item={selectedItem}
          onClose={() => setIsViewOpen(false)}
        />
      )}

      {isDeleteOpen && selectedItem && (
        <DeleteConfirmation
          resourceType={activeResource}
          item={selectedItem}
          onClose={() => setIsDeleteOpen(false)}
        />
      )}
    </div>
  );
}
