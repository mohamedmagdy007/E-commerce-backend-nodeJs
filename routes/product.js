const Product = require("../models/Product");
const upload = require("../helpers/multer");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("../middlewares/verifyToken");

const router = require("express").Router();

router.post("/",verifyTokenAndAdmin, upload , async (req, res) => {
  
  const newProduct = new Product({
    title: req.body.title,
    desc: req.body.desc,
    img: `/images/${req.file.filename}`,
    categories: req.body.categories,
    size: req.body.size,
    color: req.body.color,
    price: req.body.price,
    inStock: req.body.inStock,
  });
  try {
    const savedProduct = await newProduct.save();
    res.status(200).json(savedProduct);
  } catch (err) {
    res.status(400).json(err);
  }
});
router.put("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    const updateProduct = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updateProduct);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await Product.findOneAndDelete(req.params.id);
    res.status(200).json("Product is deleted");
  } catch (err) {
    res.status(400).json(err);
  }
});

router.get("/find/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.status(200).json(product);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.get("/", async (req, res) => {
  const qCategory = req.query.category;
  const qNew = req.query.new;
  try {
    let products;

    if (qNew) {
      products = await Product.find().sort({ createdAt: -1 }).limit(1);
    } else if (qCategory) {
      products = await Product.find({
        categories: {
          $in: [qCategory],
        },
      });
    } else {
      products = await Product.find();
    }
    res.status(200).json(products);
  } catch (err) {
    res.status(400).json(err);
  }
});
module.exports = router;
