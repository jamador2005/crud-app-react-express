import { User, Post, Comment, Product, ResourceType } from "@shared/schema";

// Union type for all resource items
export type ResourceItem = User | Post | Comment | Product;

// Resource mappings for UI display
export interface ResourceInfo {
  type: ResourceType;
  label: string;
  icon: string;
}

export const resourceMappings: Record<ResourceType, ResourceInfo> = {
  users: {
    type: 'users',
    label: 'Users',
    icon: 'person'
  },
  posts: {
    type: 'posts',
    label: 'Posts',
    icon: 'article'
  },
  comments: {
    type: 'comments',
    label: 'Comments',
    icon: 'chat'
  },
  products: {
    type: 'products',
    label: 'Products',
    icon: 'shopping_bag'
  }
};
