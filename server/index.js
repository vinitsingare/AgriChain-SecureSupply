require('dotenv').config();

if (!process.env.MONGODB_URI) {
    console.error('❌ FATAL ERROR: MONGODB_URI is not defined in .env file');
    process.exit(1);
}
if (!process.env.JWT_SECRET) {
    console.error('❌ FATAL ERROR: JWT_SECRET is not defined in .env file');
    process.exit(1);
}

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const User = require('./models/User');
const Item = require('./models/Item');
const { authMiddleware, checkRole } = require('./middleware/auth');

const app = express();

// Multer Storage Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, 'uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '-'));
    }
});
const upload = multer({ storage });

// Serve Static Files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('✅ Connected to MongoDB');
        console.log(`🔗 Database URI: ${process.env.MONGODB_URI}`);
    })
    .catch(err => {
        console.error('❌ MongoDB connection error:', err);
        process.exit(1); // Exit if we can't connect to DB
    });

// Log all requests for debugging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Middleware
const allowedOrigins = ['http://localhost:3000', 'http://127.0.0.1:3000'];
app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// --- Authentication Routes ---

app.post('/auth/register', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        console.log(`Registering user: ${email} with role: ${role}`);
        
        const userExists = await User.findOne({ email });
        if (userExists) {
            console.log('User already exists');
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = new User({ name, email, password, role });
        await user.save();
        console.log('User saved successfully');
        
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(201).json({ token, user: { id: user._id, name, email, role } });
    } catch (error) {
        console.error('Registration Error:', error);
        res.status(500).json({ message: error.message });
    }
});

app.post('/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(`Login attempt: ${email}`);
        
        const user = await User.findOne({ email });
        if (!user) {
            console.log('Invalid credentials: user not found');
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            console.log('Invalid credentials: password mismatch');
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ message: error.message });
    }
});

// --- Supply Chain Operations ---

app.post('/harvest', authMiddleware, checkRole(['FARMER']), upload.single('image'), async (req, res) => {
    try {
        const { name, origin, price, quality, quantity } = req.body;
        const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';
        
        if (!quantity || quantity <= 0) {
            return res.status(400).json({ error: 'Quantity must be greater than 0' });
        }
        const item = new Item({
            name,
            origin,
            farmerPrice: price,
            quantity: parseFloat(quantity),
            remainingQuantity: parseFloat(quantity),
            unit: 'Kgs',
            quality,
            imageUrl,
            farmer: req.user.id,
            history: [{ state: 'Harvested', updatedBy: req.user.id }]
        });
        await item.save();
        res.status(201).json({ message: 'Item harvested', item });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/purchase-by-distributor', authMiddleware, checkRole(['DISTRIBUTOR']), async (req, res) => {
    try {
        const { itemId, quantity } = req.body;
        const parentItem = await Item.findById(itemId);
        if (!parentItem || parentItem.state !== 'Harvested') throw new Error('Item not available for purchase');

        const purchaseQty = parseFloat(quantity);
        if (!purchaseQty || purchaseQty <= 0) throw new Error('Quantity must be greater than 0');
        if (purchaseQty > parentItem.remainingQuantity) throw new Error(`Only ${parentItem.remainingQuantity} ${parentItem.unit} available`);

        // Reduce remaining quantity on parent item
        parentItem.remainingQuantity -= purchaseQty;
        await parentItem.save();

        // Create child item for the purchased quantity
        const childItem = new Item({
            name: parentItem.name,
            origin: parentItem.origin,
            farmerPrice: parentItem.farmerPrice,
            quantity: purchaseQty,
            remainingQuantity: purchaseQty,
            unit: parentItem.unit,
            quality: parentItem.quality,
            farmer: parentItem.farmer,
            distributor: req.user.id,
            parentItem: parentItem._id,
            state: 'PurchasedByDistributor',
            history: [
                ...parentItem.history,
                { state: 'PurchasedByDistributor', updatedBy: req.user.id }
            ]
        });
        await childItem.save();

        res.json({ message: `Purchased ${purchaseQty} ${parentItem.unit}`, item: childItem, parentRemaining: parentItem.remainingQuantity });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/set-distributor-margin', authMiddleware, checkRole(['DISTRIBUTOR']), async (req, res) => {
    try {
        const { itemId, margin } = req.body;
        const item = await Item.findById(itemId);
        if (!item || item.distributor.toString() !== req.user.id) throw new Error('Unauthorized');

        const parsedMargin = parseFloat(margin) || 0;
        item.distributorMargin = parsedMargin;
        item.distributorPrice = item.farmerPrice + parsedMargin;
        item.retailerPrice = item.distributorPrice; // Initialize retailer price
        await item.save();
        res.json({ message: 'Distributor margin set', item });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/ship-by-distributor', authMiddleware, checkRole(['DISTRIBUTOR']), async (req, res) => {
    try {
        const { itemId } = req.body;
        const item = await Item.findById(itemId);
        if (!item || item.distributor.toString() !== req.user.id) throw new Error('Unauthorized');

        item.state = 'ShippedByDistributor';
        item.history.push({ state: 'ShippedByDistributor', updatedBy: req.user.id });
        await item.save();
        res.json({ message: 'Item shipped by distributor', item });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/receive-by-retailer', authMiddleware, checkRole(['RETAILER']), async (req, res) => {
    try {
        const { itemId } = req.body;
        const item = await Item.findById(itemId);
        if (!item || item.state !== 'ShippedByDistributor') throw new Error('Item not shipped');

        item.retailer = req.user.id;
        item.state = 'ReceivedByRetailer';
        item.history.push({ state: 'ReceivedByRetailer', updatedBy: req.user.id });
        await item.save();
        res.json({ message: 'Item received by retailer', item });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/set-retailer-margin', authMiddleware, checkRole(['RETAILER']), async (req, res) => {
    try {
        const { itemId, margin } = req.body;
        const item = await Item.findById(itemId);
        if (!item || item.retailer.toString() !== req.user.id) throw new Error('Unauthorized');

        const parsedMargin = parseFloat(margin) || 0;
        item.retailerMargin = parsedMargin;
        item.retailerPrice = item.distributorPrice + parsedMargin;
        await item.save();
        res.json({ message: 'Retailer margin set', item });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/purchase-by-retailer', authMiddleware, checkRole(['RETAILER']), async (req, res) => {
    try {
        const { itemId, quantity } = req.body;
        const parentItem = await Item.findById(itemId);
        if (!parentItem || parentItem.retailer.toString() !== req.user.id) throw new Error('Unauthorized');

        const purchaseQty = quantity ? parseFloat(quantity) : parentItem.remainingQuantity;
        if (purchaseQty <= 0) throw new Error('Quantity must be greater than 0');
        if (purchaseQty > parentItem.remainingQuantity) throw new Error(`Only ${parentItem.remainingQuantity} ${parentItem.unit} available`);

        if (purchaseQty === parentItem.remainingQuantity) {
            // Full quantity — just change state
            parentItem.state = 'ForSaleByRetailer';
            parentItem.history.push({ state: 'ForSaleByRetailer', updatedBy: req.user.id });
            await parentItem.save();
            res.json({ message: 'Item ready for sale by retailer', item: parentItem });
        } else {
            // Partial quantity — split
            parentItem.remainingQuantity -= purchaseQty;
            await parentItem.save();

            const childItem = new Item({
                name: parentItem.name,
                origin: parentItem.origin,
                farmerPrice: parentItem.farmerPrice,
                distributorMargin: parentItem.distributorMargin,
                distributorPrice: parentItem.distributorPrice,
                retailerMargin: parentItem.retailerMargin,
                retailerPrice: parentItem.retailerPrice,
                quantity: purchaseQty,
                remainingQuantity: purchaseQty,
                unit: parentItem.unit,
                quality: parentItem.quality,
                farmer: parentItem.farmer,
                distributor: parentItem.distributor,
                retailer: parentItem.retailer,
                parentItem: parentItem._id,
                state: 'ForSaleByRetailer',
                history: [
                    ...parentItem.history,
                    { state: 'ForSaleByRetailer', updatedBy: req.user.id }
                ]
            });
            await childItem.save();
            res.json({ message: `${purchaseQty} ${parentItem.unit} ready for sale`, item: childItem, parentRemaining: parentItem.remainingQuantity });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/purchase-by-consumer', authMiddleware, checkRole(['CONSUMER']), async (req, res) => {
    try {
        const { itemId, quantity } = req.body;
        const parentItem = await Item.findById(itemId);
        if (!parentItem || parentItem.state !== 'ForSaleByRetailer') throw new Error('Item not for sale');

        const purchaseQty = quantity ? parseFloat(quantity) : parentItem.remainingQuantity;
        if (purchaseQty <= 0) throw new Error('Quantity must be greater than 0');
        if (purchaseQty > parentItem.remainingQuantity) throw new Error(`Only ${parentItem.remainingQuantity} ${parentItem.unit} available`);

        if (purchaseQty === parentItem.remainingQuantity) {
            // Full quantity — just change state
            parentItem.consumer = req.user.id;
            parentItem.state = 'PurchasedByConsumer';
            parentItem.history.push({ state: 'PurchasedByConsumer', updatedBy: req.user.id });
            await parentItem.save();
            res.json({ message: 'Item purchased by consumer', item: parentItem });
        } else {
            // Partial quantity — split
            parentItem.remainingQuantity -= purchaseQty;
            await parentItem.save();

            const childItem = new Item({
                name: parentItem.name,
                origin: parentItem.origin,
                farmerPrice: parentItem.farmerPrice,
                distributorMargin: parentItem.distributorMargin,
                distributorPrice: parentItem.distributorPrice,
                retailerMargin: parentItem.retailerMargin,
                retailerPrice: parentItem.retailerPrice,
                quantity: purchaseQty,
                remainingQuantity: 0,
                unit: parentItem.unit,
                quality: parentItem.quality,
                farmer: parentItem.farmer,
                distributor: parentItem.distributor,
                retailer: parentItem.retailer,
                consumer: req.user.id,
                parentItem: parentItem._id,
                state: 'PurchasedByConsumer',
                history: [
                    ...parentItem.history,
                    { state: 'PurchasedByConsumer', updatedBy: req.user.id }
                ]
            });
            await childItem.save();
            res.json({ message: `Purchased ${purchaseQty} ${parentItem.unit}`, item: childItem, parentRemaining: parentItem.remainingQuantity });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- Data Retrieval ---

app.get('/items', async (req, res) => {
    try {
        // Filter out items with 0 remaining quantity (fully purchased)
        const items = await Item.find({ remainingQuantity: { $gt: 0 } }).populate('farmer distributor retailer consumer', 'name role');
        // Also get items without remainingQuantity field (legacy items)
        const legacyItems = await Item.find({ remainingQuantity: { $exists: false } }).populate('farmer distributor retailer consumer', 'name role');
        const allItems = [...items, ...legacyItems];
        res.json({ totalItems: allItems.length, items: allItems });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/items/:id', async (req, res) => {
    try {
        const item = await Item.findById(req.params.id).populate('farmer distributor retailer consumer', 'name role');
        if (!item) return res.status(404).send('Item not found');
        res.json(item);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/price-breakdown/:id', async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);
        if (!item) return res.status(404).json({ error: 'Item not found' });
        
        const qty = item.quantity || 1;
        const finalPricePerKg = item.retailerPrice || item.distributorPrice || item.farmerPrice;

        res.json({
            name: item.name,
            imageUrl: item.imageUrl,
            farmerPrice: item.farmerPrice,
            distributorMargin: item.distributorMargin,
            distributorPrice: item.distributorPrice,
            retailerMargin: item.retailerMargin,
            retailerPrice: item.retailerPrice,
            totalMargin: item.distributorMargin + item.retailerMargin,
            quantity: qty,
            remainingQuantity: item.remainingQuantity || qty,
            unit: item.unit || 'Kgs',
            totalPrice: finalPricePerKg * qty
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server on port ${PORT}`));
