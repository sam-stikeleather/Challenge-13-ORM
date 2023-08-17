const express = require('express');
const router = express.Router();
const { Tag, Product, ProductTag } = require('../../models');

// Route: GET /api/tags
// Description: Fetch all tags along with their associated products
router.get('/', async (req, res) => {
  try {
    const tagsWithProducts = await Tag.findAll({
      include: [{ model: Product, through: ProductTag, as: 'product_tags' }],
    });
    res.status(200).json(tagsWithProducts);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// Route: GET /api/tags/:id
// Description: Fetch a single tag by its ID along with its associated products
router.get('/:id', async (req, res) => {
  try {
    const tagId = req.params.id;
    const tagWithProducts = await Tag.findByPk(tagId, {
      include: [{ model: Product, through: ProductTag, as: 'product_tags' }],
    });

    if (!tagWithProducts) {
      res.status(404).json({ message: 'Tag not found with that ID' });
      return;
    }

    res.status(200).json(tagWithProducts);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Route: POST /api/tags
// Description: Create a new tag
router.post('/', async (req, res) => {
  try {
    const newTagData = await Tag.create(req.body);
    res.status(201).json(newTagData);
  } catch (err) {
    res.status(400).json(err);
  }
});

// Route: PUT /api/tags/:id
// Description: Update an existing tag by its ID
router.put('/:id', async (req, res) => {
  try {
    const updatedTagData = await Tag.update(
      { tag_name: req.body.tag_name },
      {
        where: {
          id: req.params.id,
        },
      }
    );
    res.status(200).json({message: 'Tag updated successfully'});
  } catch (err) {
    res.status(400).json(err);
  }
});

// Route: DELETE /api/tags/:id
// Description: Delete a tag by its ID
router.delete('/:id', async (req, res) => {
  try {
    const tagId = req.params.id;
    const deletedTagData = await Tag.destroy({
      where: {
        id: tagId,
      },
    });

    if (!deletedTagData) {
      res.status(404).json({ message: 'Tag not found with this ID' });
      return;
    }

    res.status(200).json({message: 'Tag deleted successfully'});
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
