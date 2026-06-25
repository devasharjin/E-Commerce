import { Router, type Request, type Response } from 'express'
import { extractDbUser, requireAdmin, requireAuth } from '../../middleware/auth.js'
import { AsyncHandler } from '../../utils/AsyncHandler.js'
import Category from '../../models/category.js'
import { fail, ok } from '../../utils/envelope.js'
import Product from '../../models/product.js'
import multer from 'multer'
import { AppError } from '../../utils/AppError.js'
import { UploadMultipleFilesToCloudinary } from '../../utils/cloudinary.js'
import { requireFound, requireNumber, requireText } from '../../utils/helper.js'


const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024,
        files: 10
    }
})


export const AdminProductRouter = Router()

AdminProductRouter.use(requireAuth)
AdminProductRouter.use(requireAdmin)



//categories

AdminProductRouter.get('/categories',
    AsyncHandler(async (req: Request, res: Response) => {
        const categories = await Category.find({}).sort({
            name: 1
        })

        res.json(ok(categories))
    })
)

AdminProductRouter.post('/categories',
    AsyncHandler(async (req: Request, res: Response) => {
        const name = String(req.body.name || "").trim()
        
        requireText(name, 'Category name is needed')

        const checkCategoyExist = await Category.findOne({ name })

        if (checkCategoyExist) {
            return res.status(400).json(fail('Category already exist'))
        }

        const category = await Category.create({ name })

        res.status(201).json(ok(category))
    })
)

AdminProductRouter.put('/categories/:id',
    AsyncHandler(async (req: Request, res: Response) => {
        const extractCategoryId = req.params.id

        const name = String(req.body.name || '').trim()

        requireText(name, 'Category not found')

        const existingCategory = await Category.findById(extractCategoryId)
        const category = requireFound(existingCategory, 'category not found')

        category.name = name
        await category.save()

        res.json(ok(category))

    })
)


//products

AdminProductRouter.get('/products',
    AsyncHandler(async (req: Request, res: Response) => {
        const search = req.query.search
        const query: Record<string, unknown> = {}
        if (search) {
            query.title = { $regex: search, $options: 'i' }
        }

        const products = await Product.find(query).populate('category', 'name').sort({
            createdAt: -1
        })

        res.json(ok(products))
    })
)

AdminProductRouter.get('/products/:id',
    AsyncHandler(async (req: Request, res: Response) => {
        const productId = req.params.id
        const product = await Product.findById(productId).populate
            ("category", 'name')

        requireFound(product, 'Product not found')

        res.json(ok(product))

    })
)


AdminProductRouter.post('/products',
    upload.array('images', 10),
    AsyncHandler(async (req: Request, res: Response) => {
        console.time("req.body");
        const title = String(req.body.title || "").trim()
        const category = String(req.body.category || "").trim()
        const description = String(req.body.description || "").trim()
        const brand = String(req.body.brand || "").trim()
        const stock = Number(req.body.stock)
        const price = Number(req.body.price)
        const salesPercentage = Number(req.body.salePercentage)
        const status: 'active' | 'inactive' = (req.body.status || "active").trim()
        const colors = req.body.colors || []
        const sizes = req.body.sizes || []
        console.timeEnd("req.body");
        requireText(title, 'Title is required')
        requireText(category, 'category is required')
        requireText(description, 'description is required')
        requireText(brand, 'brand is required')
        requireText(status, 'status is required')

        requireNumber(stock, "Stock is required")
        requireNumber(price, "price is required")
        requireNumber(salesPercentage, "salesPercentage is required")
        console.time("category");
        const existingCategory = await Category.findById(category)
        console.timeEnd("category");

        requireFound(existingCategory, 'Category not found')
        console.time("req files");
        const files = (req.files as Express.Multer.File[]) || []
        if (!files.length) {
            throw new AppError(400, 'Atleast One image needed')
        }

        console.timeEnd("req files");
       console.time("upload-all");
        const uploadImage = await UploadMultipleFilesToCloudinary(
            files.map((file) => file.buffer)
        )
        console.timeEnd("upload-all");

        const images = uploadImage.map((img, index) => ({
            url: img.url,
            publicId: img.publicId,
            isCover: index === 0
        }))

        console.time("extract-user");
        const user = await extractDbUser(req)
        console.timeEnd("extract-user");
        console.time("create-product");
        const product = await Product.create({
            title,
            description,
            colors,
            sizes,
            stock,
            price,
            salesPercentage,
            category,
            images,
            brand,
            status,
            createdBy: user._id
        })

        const createdProduct = await Product.findById(product._id).populate
            ("category", 'name')

        res.status(201).json(ok(createdProduct))
        console.timeEnd("create-product");
    })
)


AdminProductRouter.put('/products/:id',
    upload.array('images', 10),
    AsyncHandler(async (req: Request, res: Response) => {
        const productId = req.params.id
        const title = String(req.body.title || "").trim()
        console.log(req.body.category);
        
        const category = String(req.body.category || "").trim()
        const description = String(req.body.description || "").trim()
        const brand = String(req.body.brand || "").trim()
        const stock = Number(req.body.stock)
        const price = Number(req.body.price)
        const salesPercentage = Number(req.body.salePercentage)
        const status: 'active' | 'inactive' = (req.body.status || "active").trim()
        const colors = req.body.colors || []
        const sizes = req.body.sizes || []
        const coverImageurl = String(req.body.coverImagePublicId || "").trim()

        requireText(title, 'Title is required')
        requireText(category, 'category is required')
        requireText(description, 'description is required')
        requireText(brand, 'brand is required')
        requireText(status, 'status is required')

        requireNumber(stock, "Stock is required")
        requireNumber(price, "price is required")
        requireNumber(salesPercentage, "salesPercentage is required")

        const existingCategorydoc =  await Category.findOne({_id: req.body.category})

        const existingCategory = requireFound(existingCategorydoc, 'Category Not found')

        const productDoc = await Product.findById(productId)
        const product = requireFound(productDoc, 'Product Not Found')

        const files = (req.files as Express.Multer.File[]) || []

        const UploadImage = await UploadMultipleFilesToCloudinary(
            files.map((file) => file.buffer)
        )

        const newlyUploadImages = UploadImage.map((img) => ({
            url: img.url,
            publicId: img.publicId,
            isCover: false
        }))
        const existingImageUrl = JSON.parse(req.body.existingImages || "[]");

        const mergedImage = [...newlyUploadImages, ...existingImageUrl]
        if (!mergedImage.length) {
            throw new AppError(400, 'Atleat one img is needed')
        }

        const finalImages = mergedImage.map((img) => ({
            url: img.url,
            publicId: img.publicId,
            isCover: img.publicId === coverImageurl
        }));

        if (!finalImages.some(img => img.isCover)) {
            finalImages[0].isCover = true;
        }
  
        product.title = title;
        product.description = description;
        product.brand = brand;
        product.category = existingCategory._id;
        product.colors = colors;
        product.sizes = sizes;
        product.price = price;
        product.salesPercentage = salesPercentage;
        product.stock = stock;
        product.status = status;
        product.set("images", finalImages)

        await product.save()

        const createdProduct = await Product.findById(product._id).populate
            ("category", 'name')

        res.status(200).json(ok(createdProduct))

    })
)
