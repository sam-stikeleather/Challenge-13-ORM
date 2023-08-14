const router = require('express').Router();
const { Tag, Product, ProductTag, Category } = require('../../models');

// The `/api/tags` endpoint
router.get('/', async (req, res) => {
  try {
    const tagData = await Tag.findAll({
      include: [{ model: Product }],
    });
    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const tagData = await Tag.findByPk(req.params.id, {
      include: [{ model: Product }],
    });

    if (!tagData)
    {
      res.status(404).json({ message: "No tag found with that ID"});
      return;
    }

    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// POST route for create tag
router.post('/', async (req, res) => {
  try {
    const newTagData = await Tag.create(req.body);
    res.status(200).json(newTagData);
  } catch (err) {
    res.status(400).json(err);
  }
});

// PUT route for update tag by id
router.put('/:id', async (req, res) => {
  try {
    const updatedTagData = await Tag.update({tag_name: req.body.tag_name}, {
      where: {
        id: req.params.id},
    });
    res.status(200).json(updatedTagData);
  } catch (err) {
    res.status(400).json(err);
  }
});

// DELETE route for tag by id
router.delete('/:id', async (req, res) => {
  try {
    const deletedTagData = await Tag.destroy({
      where: {
        id: req.params.id,
      },
    });
    if (!deletedTagData)
    {
      res.status(404).json({ message: 'No tag found with this ID' });
      return;
    }
    res.status(200).json(deletedTagData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;