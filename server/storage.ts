import { 
  users, User, InsertUser,
  posts, Post, InsertPost,
  comments, Comment, InsertComment,
  products, Product, InsertProduct,
  ResourceType
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUsers(): Promise<User[]>;
  getUser(id: number): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<InsertUser>): Promise<User | undefined>;
  deleteUser(id: number): Promise<boolean>;

  // Post operations
  getPosts(): Promise<Post[]>;
  getPost(id: number): Promise<Post | undefined>;
  createPost(post: InsertPost): Promise<Post>;
  updatePost(id: number, post: Partial<InsertPost>): Promise<Post | undefined>;
  deletePost(id: number): Promise<boolean>;

  // Comment operations
  getComments(): Promise<Comment[]>;
  getComment(id: number): Promise<Comment | undefined>;
  createComment(comment: InsertComment): Promise<Comment>;
  updateComment(id: number, comment: Partial<InsertComment>): Promise<Comment | undefined>;
  deleteComment(id: number): Promise<boolean>;

  // Product operations
  getProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;

  // Generic search
  searchResources(resourceType: ResourceType, term: string): Promise<any[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private posts: Map<number, Post>;
  private comments: Map<number, Comment>;
  private products: Map<number, Product>;
  
  private userIdCounter: number;
  private postIdCounter: number;
  private commentIdCounter: number;
  private productIdCounter: number;

  constructor() {
    this.users = new Map();
    this.posts = new Map();
    this.comments = new Map();
    this.products = new Map();
    
    this.userIdCounter = 1;
    this.postIdCounter = 1;
    this.commentIdCounter = 1;
    this.productIdCounter = 1;
    
    // Add some initial data
    this.seedData();
  }

  private seedData() {
    // Add a few sample users
    this.createUser({ 
      name: "John Doe",
      email: "john@example.com", 
      username: "johndoe", 
      password: "password123"
    });
    
    this.createUser({ 
      name: "Jane Smith",
      email: "jane@example.com", 
      username: "janesmith", 
      password: "password123"
    });

    // Add a few sample posts
    this.createPost({
      title: "First Post",
      body: "This is the content of the first post.",
      userId: 1
    });
    
    this.createPost({
      title: "Second Post",
      body: "This is the content of the second post.",
      userId: 2
    });

    // Add a few sample comments
    this.createComment({
      name: "Alice Johnson",
      email: "alice@example.com",
      body: "Great post!",
      postId: 1
    });
    
    this.createComment({
      name: "Bob Wilson",
      email: "bob@example.com",
      body: "I learned a lot from this, thanks!",
      postId: 1
    });

    // Add a few sample products
    this.createProduct({
      name: "Smartphone",
      price: 699.99,
      description: "Latest model with high-resolution camera",
      category: "electronics"
    });
    
    this.createProduct({
      name: "Laptop",
      price: 1299.99,
      description: "Powerful laptop for professionals",
      category: "electronics"
    });
  }

  // User operations
  async getUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async createUser(userData: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const now = new Date();
    const user: User = { ...userData, id, createdAt: now };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined> {
    const currentUser = this.users.get(id);
    if (!currentUser) return undefined;

    const updatedUser: User = { ...currentUser, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async deleteUser(id: number): Promise<boolean> {
    return this.users.delete(id);
  }

  // Post operations
  async getPosts(): Promise<Post[]> {
    return Array.from(this.posts.values());
  }

  async getPost(id: number): Promise<Post | undefined> {
    return this.posts.get(id);
  }

  async createPost(postData: InsertPost): Promise<Post> {
    const id = this.postIdCounter++;
    const now = new Date();
    const post: Post = { ...postData, id, createdAt: now };
    this.posts.set(id, post);
    return post;
  }

  async updatePost(id: number, postData: Partial<InsertPost>): Promise<Post | undefined> {
    const currentPost = this.posts.get(id);
    if (!currentPost) return undefined;

    const updatedPost: Post = { ...currentPost, ...postData };
    this.posts.set(id, updatedPost);
    return updatedPost;
  }

  async deletePost(id: number): Promise<boolean> {
    return this.posts.delete(id);
  }

  // Comment operations
  async getComments(): Promise<Comment[]> {
    return Array.from(this.comments.values());
  }

  async getComment(id: number): Promise<Comment | undefined> {
    return this.comments.get(id);
  }

  async createComment(commentData: InsertComment): Promise<Comment> {
    const id = this.commentIdCounter++;
    const now = new Date();
    const comment: Comment = { ...commentData, id, createdAt: now };
    this.comments.set(id, comment);
    return comment;
  }

  async updateComment(id: number, commentData: Partial<InsertComment>): Promise<Comment | undefined> {
    const currentComment = this.comments.get(id);
    if (!currentComment) return undefined;

    const updatedComment: Comment = { ...currentComment, ...commentData };
    this.comments.set(id, updatedComment);
    return updatedComment;
  }

  async deleteComment(id: number): Promise<boolean> {
    return this.comments.delete(id);
  }

  // Product operations
  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async createProduct(productData: InsertProduct): Promise<Product> {
    const id = this.productIdCounter++;
    const now = new Date();
    const product: Product = { ...productData, id, createdAt: now };
    this.products.set(id, product);
    return product;
  }

  async updateProduct(id: number, productData: Partial<InsertProduct>): Promise<Product | undefined> {
    const currentProduct = this.products.get(id);
    if (!currentProduct) return undefined;

    const updatedProduct: Product = { ...currentProduct, ...productData };
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }

  async deleteProduct(id: number): Promise<boolean> {
    return this.products.delete(id);
  }

  // Search functionality
  async searchResources(resourceType: ResourceType, term: string): Promise<any[]> {
    const lowerTerm = term.toLowerCase();
    
    switch (resourceType) {
      case 'users':
        return (await this.getUsers()).filter(user => 
          user.name.toLowerCase().includes(lowerTerm) || 
          user.email.toLowerCase().includes(lowerTerm) ||
          user.username.toLowerCase().includes(lowerTerm)
        );
      case 'posts':
        return (await this.getPosts()).filter(post => 
          post.title.toLowerCase().includes(lowerTerm) || 
          post.body.toLowerCase().includes(lowerTerm)
        );
      case 'comments':
        return (await this.getComments()).filter(comment => 
          comment.name.toLowerCase().includes(lowerTerm) || 
          comment.email.toLowerCase().includes(lowerTerm) || 
          comment.body.toLowerCase().includes(lowerTerm)
        );
      case 'products':
        return (await this.getProducts()).filter(product => 
          product.name.toLowerCase().includes(lowerTerm) || 
          product.description.toLowerCase().includes(lowerTerm) ||
          product.category.toLowerCase().includes(lowerTerm)
        );
      default:
        return [];
    }
  }
}

export const storage = new MemStorage();
