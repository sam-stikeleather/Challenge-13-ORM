const express = require('express');
const router = express.Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// Route: GET /api/products
// Description: Fetch all products along with their associated Category and Tags
router.get('/', async (req, res) => {
  try {
    const productsWithCategoryAndTags = await Product.findAll({
      include: [
        {
          model: Category,
        },
        {
          model: Tag,
          through: ProductTag,
          as: 'product_tags',
        },
      ],
    });
    res.status(200).json(productsWithCategoryAndTags);
  } catch (err) {
    console.error(err);
    res.status(500).json(err.message);
  }
});

// Route: GET /api/products/:id
// Description: Fetch a single product by its ID along with its associated Category and Tags
router.get('/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    const productWithCategoryAndTags = await Product.findAll({
      include: [
        {
          model: Category,
        },
        {
          model: Tag,
          through: ProductTag,
          as: 'product_tags',
        },
      ],
      where: { id: productId },
    });
    res.status(200).json(productWithCategoryAndTags);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Route: POST /api/products
// Description: Create a new product with associated tags (if provided)
router.post('/', async (req, res) => {
  try {
    const newProduct = await Product.create(req.body);
    if (req.body.tagIds && req.body.tagIds.length) {
      const productTagIdArr = req.body.tagIds.map((tag_id) => ({
        product_id: newProduct.id,
        tag_id,
      }));
      await ProductTag.bulkCreate(productTagIdArr);
    }
    res.status(201).json(newProduct);
  } catch (err) {
    console.error(err);
    res.status(400).json(err);
  }
});

// Route: PUT /api/products/:id
// Description: Update an existing product by its ID along with its associated tags
router.put('/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    await Product.update(req.body, {
      where: {
        id: productId,
      },
    });

    if (req.body.tagIds && req.body.tagIds.length) {
      const productTags = await ProductTag.findAll({
        where: { product_id: productId },
      });

      const currentTagIds = productTags.map(({ tag_id }) => tag_id);
      const newTagIds = req.body.tagIds.filter((tag_id) => !currentTagIds.includes(tag_id));

      const newProductTags = newTagIds.map((tag_id) => ({
        product_id: productId,
        tag_id,
      }));

      await Promise.all([
        ProductTag.destroy({ where: { tag_id: currentTagIds, product_id: productId } }),
        ProductTag.bulkCreate(newProductTags),
      ]);
    }

    res.status(200).json({ message: 'Product updated successfully' });
  } catch (err) {
    res.status(400).json(err);
  }
});

// Route: DELETE /api/products/:id
// Description: Delete a product by its ID
router.delete('/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    await Product.destroy({ where: { id: productId } });
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = router;
