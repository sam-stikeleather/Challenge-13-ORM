const express = require('express');
const router = express.Router();
const { Category, Product } = require('../../models');

// Route: GET /api/categories
// Description: Fetch all categories along with their associated Products
router.get('/', async (req, res) => {
  try {
    const categoriesWithProducts = await Category.findAll({
      include: [
        {
          model: Product,
        },
      ],
    });
    res.status(200).json(categoriesWithProducts);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// Route: GET /api/categories/:id
// Description: Fetch a single category by its ID along with its associated Products
router.get('/:id', async (req, res) => {
  try {
    const categoryId = req.params.id;
    const categoryWithProducts = await Category.findByPk(categoryId, {
      include: [Product],
    });

    if (!categoryWithProducts) {
      res.status(404).json({ message: 'Category not found' });
      return;
    }

    res.status(200).json(categoryWithProducts);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Route: POST /api/categories
// Description: Create a new category
router.post('/', async (req, res) => {
  try {
    const newCategory = await Category.create(req.body);
    res.status(201).json(newCategory);
  } catch (err) {
    res.status(400).json(err);
  }
});

// Route: PUT /api/categories/:id
// Description: Update an existing category by its ID
router.put('/:id', async (req, res) => {
  try {
    const categoryId = req.params.id;
    const updatedCategory = await Category.update(req.body, {
      where: {
        id: categoryId,
      },
    });

    if (updatedCategory[0] === 0) {
      res.status(404).json({ message: 'Category not found' });
      return;
    }

    res.status(200).json({message: 'Category updated successfully'});
  } catch (err) {
    res.status(500).json(err);
  }
});

// Route: DELETE /api/categories/:id
// Description: Delete a category by its ID
router.delete('/:id', async (req, res) => {
  try {
    const categoryId = req.params.id;
    const deletedCategory = await Category.destroy({
      where: {
        id: categoryId,
      },
    });

    if (!deletedCategory) {
      res.status(404).json({ message: 'Category not found' });
      return;
    }

    res.status(200).json({message: 'Category deleted successfully'});
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
