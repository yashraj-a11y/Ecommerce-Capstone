const express = require('express')
const Product = require('../models/Product')
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

// @route POST  /api/products
// @desc Create a new product
// @access Private/Admin
router.post('/', protect, admin, async (req, res) => {
    try {
        const {
            name,
            description,
            price,
            discountPrice,
            countInStock,
            category,
            brand,
            sizes,
            colors,
            collections,
            material,
            gender,
            images,
            isFeatured,
            isPublished,
            tags,
            dimensions,
            weight,
            sku,
        } = req.body;

        const product = new Product({
            name,
            description,
            price,
            discountPrice,
            countInStock,
            category,
            brand,
            sizes,
            colors,
            collections,
            material,
            gender,
            images,
            isFeatured,
            isPublished,
            tags,
            dimensions,
            weight,
            sku,
            user: req.user._id,
        });

        const createdProduct = await product.save();
        res.status(201).json(createdProduct);

    } catch (err) {
        console.error(err);
        return res.status(500).send('Server Error');
    }
});


// @route PUT /api/products/:id
// @desc Update an existing product
// @access Private/Admin
router.put('/:id', protect, admin, async (req, res) => {
    try {
        const {
            name,
            description,
            price,
            discountPrice,
            countInStock,
            category,
            brand,
            sizes,
            colors,
            collections,
            material,
            gender,
            images,
            isFeatured,
            isPublished,
            tags,
            dimensions,
            weight,
            sku,
        } = req.body;

        const product = await Product.findById(req.params.id);

        if (product) {
            if (name !== undefined) product.name = name;
            if (description !== undefined) product.description = description;
            if (price !== undefined) product.price = price;
            if (discountPrice !== undefined) product.discountPrice = discountPrice;
            if (countInStock !== undefined) product.countInStock = countInStock;
            if (category !== undefined) product.category = category;
            if (brand !== undefined) product.brand = brand;
            if (sizes !== undefined) product.sizes = sizes;
            if (colors !== undefined) product.colors = colors;
            if (collections !== undefined) product.collections = collections;
            if (material !== undefined) product.material = material;
            if (gender !== undefined) product.gender = gender;
            if (images !== undefined) product.images = images;
            if (isFeatured !== undefined) product.isFeatured = isFeatured;
            if (isPublished !== undefined) product.isPublished = isPublished;
            if (tags !== undefined) product.tags = tags;
            if (dimensions !== undefined) product.dimensions = dimensions;
            if (weight !== undefined) product.weight = weight;
            if (sku !== undefined) product.sku = sku;

            const updatedProduct = await product.save();
            res.json(updatedProduct);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }

    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});


// @route DELETE /api/products/:id
// @desc Delete a product
// @access Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            await product.deleteOne();
            res.json({ message: 'Product removed' });
        } else {
            return res.status(404).json({ message: 'Product not found' });
        }

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server Error' });
    }
});


// ---------------------------------------------
// IMPORTANT: STATIC ROUTES MUST COME BEFORE /:id
// ---------------------------------------------

// @route GET /api/products/best-seller
// @desc Retrieve best seller product
router.get('/best-seller', async (req, res) => {
    try {
        const bestSeller = await Product.findOne().sort({ rating: -1 });

        if (bestSeller) {
            res.json(bestSeller);
        } else {
            res.status(404).json({ message: "No Best Seller Found" });
        }

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route GET /api/products/new-arrivals
// @desc Retrieve latest 8 products
router.get('/new-arrivals', async (req, res) => {
    try {
        const newArrivals = await Product.find().sort({ createdAt: -1 }).limit(8);
        res.json(newArrivals);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// @route GET /api/products/similar/:id
// @desc Retrieve similar products
router.get('/similar/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ message: 'Product Not Found' });
        }

        const similarProducts = await Product.find({
            _id: { $ne: id },
            gender: product.gender,
            category: product.category,
        }).limit(4);

        res.json(similarProducts);

    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});


// @route GET /api/products
// @desc Get all products with filters
// @access Public
router.get('/', async (req, res) => {
    try {
        const {
            collection,
            size,
            color,
            gender,
            minPrice,
            maxPrice,
            sortBy,
            search,
            category,
            material,
            brand,
            limit,
            page
        } = req.query;

        let query = {};
        let sort = {};

        if (collection && collection.toLowerCase() !== 'all') {
            query.collections = { $in: [collection] };
        }

        if (category && category.toLowerCase() !== 'all') {
            query.category = category;
        }

        if (material) query.material = { $in: material.split(',') };
        if (brand) query.brand = { $in: brand.split(',') };
        if (size) query.sizes = { $in: size.split(',') };
        if (color) query.colors = { $in: color.split(',') };
        if (gender) query.gender = gender;

        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } }
            ];
        }

        if (sortBy) {
            switch (sortBy) {
                case 'priceAsc':
                    sort = { price: 1 };
                    break;
                case 'priceDesc':
                    sort = { price: -1 };
                    break;
                case 'popularity':
                    sort = { rating: -1 }; 
                    break;
                default:
                    break;
            }
        }

        const pageNumber = Number(page) || 1;
        const pageSize = Number(limit) || 12;
        const skip = (pageNumber - 1) * pageSize;

        const totalProducts = await Product.countDocuments(query);
        const totalPages = Math.ceil(totalProducts / pageSize);

        const products = await Product.find(query)
            .sort(sort)
            .skip(skip)
            .limit(pageSize);

        res.json({
            products,
            currentPage: pageNumber,
            totalPages,
            totalProducts,
            hasNextPage: pageNumber < totalPages,
            hasPrevPage: pageNumber > 1
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});


// @route GET /api/products/:id
// @desc Get product by ID
// @access Public
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            res.json(product);
        } else {
            return res.status(404).json({ message: 'Product Not Found' });
        }

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
