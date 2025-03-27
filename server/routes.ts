import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema,
  insertPostSchema,
  insertCommentSchema,
  insertProductSchema,
  ResourceType
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Prefix all routes with /api
  const apiRouter = app;

  // Generic error handling middleware
  const handleRequest = async (req: Request, res: Response, handler: () => Promise<any>) => {
    try {
      const result = await handler();
      res.json(result);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          message: "Validation error",
          errors: error.errors
        });
        return;
      }

      console.error("Request error:", error);
      res.status(500).json({ message: "An unexpected error occurred" });
    }
  };

  // User routes
  apiRouter.get("/api/users", async (req, res) => {
    await handleRequest(req, res, async () => {
      const users = await storage.getUsers();
      return users;
    });
  });

  apiRouter.get("/api/users/:id", async (req, res) => {
    await handleRequest(req, res, async () => {
      const id = parseInt(req.params.id);
      const user = await storage.getUser(id);
      
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }
      
      return user;
    });
  });

  apiRouter.post("/api/users", async (req, res) => {
    await handleRequest(req, res, async () => {
      const userData = insertUserSchema.parse(req.body);
      const newUser = await storage.createUser(userData);
      res.status(201);
      return newUser;
    });
  });

  apiRouter.put("/api/users/:id", async (req, res) => {
    await handleRequest(req, res, async () => {
      const id = parseInt(req.params.id);
      const userData = insertUserSchema.partial().parse(req.body);
      
      const updatedUser = await storage.updateUser(id, userData);
      if (!updatedUser) {
        res.status(404).json({ message: "User not found" });
        return;
      }
      
      return updatedUser;
    });
  });

  apiRouter.delete("/api/users/:id", async (req, res) => {
    await handleRequest(req, res, async () => {
      const id = parseInt(req.params.id);
      const success = await storage.deleteUser(id);
      
      if (!success) {
        res.status(404).json({ message: "User not found" });
        return;
      }
      
      return { message: "User deleted successfully" };
    });
  });

  // Post routes
  apiRouter.get("/api/posts", async (req, res) => {
    await handleRequest(req, res, async () => {
      const posts = await storage.getPosts();
      return posts;
    });
  });

  apiRouter.get("/api/posts/:id", async (req, res) => {
    await handleRequest(req, res, async () => {
      const id = parseInt(req.params.id);
      const post = await storage.getPost(id);
      
      if (!post) {
        res.status(404).json({ message: "Post not found" });
        return;
      }
      
      return post;
    });
  });

  apiRouter.post("/api/posts", async (req, res) => {
    await handleRequest(req, res, async () => {
      const postData = insertPostSchema.parse(req.body);
      const newPost = await storage.createPost(postData);
      res.status(201);
      return newPost;
    });
  });

  apiRouter.put("/api/posts/:id", async (req, res) => {
    await handleRequest(req, res, async () => {
      const id = parseInt(req.params.id);
      const postData = insertPostSchema.partial().parse(req.body);
      
      const updatedPost = await storage.updatePost(id, postData);
      if (!updatedPost) {
        res.status(404).json({ message: "Post not found" });
        return;
      }
      
      return updatedPost;
    });
  });

  apiRouter.delete("/api/posts/:id", async (req, res) => {
    await handleRequest(req, res, async () => {
      const id = parseInt(req.params.id);
      const success = await storage.deletePost(id);
      
      if (!success) {
        res.status(404).json({ message: "Post not found" });
        return;
      }
      
      return { message: "Post deleted successfully" };
    });
  });

  // Comment routes
  apiRouter.get("/api/comments", async (req, res) => {
    await handleRequest(req, res, async () => {
      const comments = await storage.getComments();
      return comments;
    });
  });

  apiRouter.get("/api/comments/:id", async (req, res) => {
    await handleRequest(req, res, async () => {
      const id = parseInt(req.params.id);
      const comment = await storage.getComment(id);
      
      if (!comment) {
        res.status(404).json({ message: "Comment not found" });
        return;
      }
      
      return comment;
    });
  });

  apiRouter.post("/api/comments", async (req, res) => {
    await handleRequest(req, res, async () => {
      const commentData = insertCommentSchema.parse(req.body);
      const newComment = await storage.createComment(commentData);
      res.status(201);
      return newComment;
    });
  });

  apiRouter.put("/api/comments/:id", async (req, res) => {
    await handleRequest(req, res, async () => {
      const id = parseInt(req.params.id);
      const commentData = insertCommentSchema.partial().parse(req.body);
      
      const updatedComment = await storage.updateComment(id, commentData);
      if (!updatedComment) {
        res.status(404).json({ message: "Comment not found" });
        return;
      }
      
      return updatedComment;
    });
  });

  apiRouter.delete("/api/comments/:id", async (req, res) => {
    await handleRequest(req, res, async () => {
      const id = parseInt(req.params.id);
      const success = await storage.deleteComment(id);
      
      if (!success) {
        res.status(404).json({ message: "Comment not found" });
        return;
      }
      
      return { message: "Comment deleted successfully" };
    });
  });

  // Product routes
  apiRouter.get("/api/products", async (req, res) => {
    await handleRequest(req, res, async () => {
      const products = await storage.getProducts();
      return products;
    });
  });

  apiRouter.get("/api/products/:id", async (req, res) => {
    await handleRequest(req, res, async () => {
      const id = parseInt(req.params.id);
      const product = await storage.getProduct(id);
      
      if (!product) {
        res.status(404).json({ message: "Product not found" });
        return;
      }
      
      return product;
    });
  });

  apiRouter.post("/api/products", async (req, res) => {
    await handleRequest(req, res, async () => {
      // Pre-process the request body to convert price to a number if it's a string
      const requestBody = { ...req.body };
      if (typeof requestBody.price === 'string') {
        requestBody.price = parseFloat(requestBody.price);
      }
      
      const productData = insertProductSchema.parse(requestBody);
      const newProduct = await storage.createProduct(productData);
      res.status(201);
      return newProduct;
    });
  });

  apiRouter.put("/api/products/:id", async (req, res) => {
    await handleRequest(req, res, async () => {
      const id = parseInt(req.params.id);
      
      // Pre-process the request body to convert price to a number if it's a string
      const requestBody = { ...req.body };
      if (typeof requestBody.price === 'string') {
        requestBody.price = parseFloat(requestBody.price);
      }
      
      const productData = insertProductSchema.partial().parse(requestBody);
      
      const updatedProduct = await storage.updateProduct(id, productData);
      if (!updatedProduct) {
        res.status(404).json({ message: "Product not found" });
        return;
      }
      
      return updatedProduct;
    });
  });

  apiRouter.delete("/api/products/:id", async (req, res) => {
    await handleRequest(req, res, async () => {
      const id = parseInt(req.params.id);
      const success = await storage.deleteProduct(id);
      
      if (!success) {
        res.status(404).json({ message: "Product not found" });
        return;
      }
      
      return { message: "Product deleted successfully" };
    });
  });

  // Search route
  apiRouter.get("/api/search/:resource", async (req, res) => {
    await handleRequest(req, res, async () => {
      const resourceType = req.params.resource as ResourceType;
      const term = req.query.q as string || '';
      
      if (!['users', 'posts', 'comments', 'products'].includes(resourceType)) {
        res.status(400).json({ message: "Invalid resource type" });
        return;
      }
      
      const results = await storage.searchResources(resourceType, term);
      return results;
    });
  });

  const httpServer = createServer(app);
  return httpServer;
}
