// UserRoutes - Complete user API routing
// Following Microsoft Principal Engineer best practices

import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { userAuthMiddleware } from '../middlewares/auth';

const router = Router();
const userController = new UserController();

// ========================
// Public Routes (No Authentication Required)
// ========================

/**
 * @route POST /api/users/register
 * @desc Register a new user
 * @access Public
 * @body { name: string, email: string, password: string, confirmPassword: string }
 */
router.post('/register', (req, res) => userController.register(req, res));

/**
 * @route POST /api/users/login
 * @desc User login
 * @access Public
 * @body { email: string, password: string }
 */
router.post('/login', (req, res) => userController.login(req, res));

// ========================
// Protected Routes (Authentication Required)
// ========================

/**
 * @route GET /api/users/profile
 * @desc Get current user profile
 * @access Private
 * @header Authorization: Bearer <token>
 */
router.get('/profile', userAuthMiddleware, (req, res) => userController.getProfile(req, res));

/**
 * @route PUT /api/users/profile
 * @desc Update user profile
 * @access Private
 * @header Authorization: Bearer <token>
 * @body { name?: string, email?: string, password?: string }
 */
router.put('/profile', userAuthMiddleware, (req, res) => userController.updateProfile(req, res));

/**
 * @route DELETE /api/users/account
 * @desc Deactivate user account
 * @access Private
 * @header Authorization: Bearer <token>
 */
router.delete('/account', userAuthMiddleware, (req, res) => userController.deactivateAccount(req, res));

// ========================
// Shopping Cart Routes
// ========================

/**
 * @route PUT /api/users/cart
 * @desc Update entire shopping cart
 * @access Private
 * @header Authorization: Bearer <token>
 * @body { cart: CartItem[] }
 */
router.put('/cart', userAuthMiddleware, (req, res) => userController.updateCart(req, res));

/**
 * @route POST /api/users/cart/add
 * @desc Add item to shopping cart
 * @access Private
 * @header Authorization: Bearer <token>
 * @body { productId: string, productName: string, quantity: number, price: number, imageUrl?: string }
 */
router.post('/cart/add', userAuthMiddleware, (req, res) => userController.addToCart(req, res));

/**
 * @route DELETE /api/users/cart/remove/:itemId
 * @desc Remove item from shopping cart
 * @access Private
 * @header Authorization: Bearer <token>
 * @param itemId - Cart item ID to remove
 */
router.delete('/cart/remove/:itemId', userAuthMiddleware, (req, res) => userController.removeFromCart(req, res));

// ========================
// Favorite Products Routes
// ========================

/**
 * @route PUT /api/users/favorites
 * @desc Update favorite products list
 * @access Private
 * @header Authorization: Bearer <token>
 * @body { favorites: string[] }
 */
router.put('/favorites', userAuthMiddleware, (req, res) => userController.updateFavorites(req, res));

/**
 * @route POST /api/users/favorites/add
 * @desc Add product to favorites
 * @access Private
 * @header Authorization: Bearer <token>
 * @body { productId: string }
 */
router.post('/favorites/add', userAuthMiddleware, (req, res) => userController.addToFavorites(req, res));

/**
 * @route DELETE /api/users/favorites/remove/:productId
 * @desc Remove product from favorites
 * @access Private
 * @header Authorization: Bearer <token>
 * @param productId - Product ID to remove from favorites
 */
router.delete('/favorites/remove/:productId', userAuthMiddleware, (req, res) => userController.removeFromFavorites(req, res));

export default router;
