"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextController = void 0;
const textService_1 = require("../services/textService");
const textService = new textService_1.TextService();
class TextController {
    async createText(req, res) {
        try {
            const { title, content, excerpt, category, published } = req.body;
            if (!title || !content) {
                return res.status(400).json({ error: 'Title and content are required' });
            }
            const result = await textService.createText({
                title,
                content,
                excerpt,
                category,
                published: published || false
            });
            if (!result.success) {
                return res.status(400).json(result);
            }
            res.status(201).json({
                message: 'Text created successfully',
                text: result.data
            });
        }
        catch (error) {
            console.error('Error creating text:', error);
            res.status(500).json({ error: 'Failed to create text' });
        }
    }
    async getAllTexts(req, res) {
        try {
            const result = await textService.getAllTexts();
            res.json(result);
        }
        catch (error) {
            console.error('Error fetching texts:', error);
            res.status(500).json({ error: 'Failed to fetch texts' });
        }
    }
    async getPublishedTexts(req, res) {
        try {
            const result = await textService.getPublishedTexts();
            res.json(result);
        }
        catch (error) {
            console.error('Error fetching published texts:', error);
            res.status(500).json({ error: 'Failed to fetch texts' });
        }
    }
    async getTextsByCategory(req, res) {
        try {
            const { category } = req.params;
            const result = await textService.getTextsByCategory(category);
            res.json(result);
        }
        catch (error) {
            console.error('Error fetching texts by category:', error);
            res.status(500).json({ error: 'Failed to fetch texts' });
        }
    }
    async updateText(req, res) {
        try {
            const { id } = req.params;
            const { title, content, excerpt, category, published } = req.body;
            const result = await textService.updateText(id, {
                title,
                content,
                excerpt,
                category,
                published
            });
            if (!result.success) {
                return res.status(400).json(result);
            }
            res.json({
                message: 'Text updated successfully',
                text: result.data
            });
        }
        catch (error) {
            console.error('Error updating text:', error);
            res.status(500).json({ error: 'Failed to update text' });
        }
    }
    async deleteText(req, res) {
        try {
            const { id } = req.params;
            const result = await textService.deleteText(id);
            if (!result.success) {
                return res.status(400).json(result);
            }
            res.json({
                message: 'Text deleted successfully'
            });
        }
        catch (error) {
            console.error('Error deleting text:', error);
            res.status(500).json({ error: 'Failed to delete text' });
        }
    }
    async getTextById(req, res) {
        try {
            const { id } = req.params;
            const result = await textService.getTextById(id);
            if (!result.success) {
                return res.status(404).json(result);
            }
            res.json(result);
        }
        catch (error) {
            console.error('Error fetching text:', error);
            res.status(500).json({ error: 'Failed to fetch text' });
        }
    }
    async togglePublish(req, res) {
        try {
            const { id } = req.params;
            const result = await textService.togglePublish(id);
            if (!result.success || !result.data) {
                return res.status(400).json(result);
            }
            res.json({
                message: `Text ${result.data.published ? 'published' : 'unpublished'} successfully`,
                text: result.data
            });
        }
        catch (error) {
            console.error('Error toggling publish status:', error);
            res.status(500).json({ error: 'Failed to toggle publish status' });
        }
    }
}
exports.TextController = TextController;
//# sourceMappingURL=textController.js.map