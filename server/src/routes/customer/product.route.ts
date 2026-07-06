import { Router, type Request, type Response } from "express";
import { AsyncHandler } from "../../utils/AsyncHandler.js";
import Category from "../../models/category.js";
import { ok } from "../../utils/envelope.js";
import Product from "../../models/product.js";
import { requireFound } from "../../utils/helper.js";


const customerProductRoute = Router()

type ProductSort = 'recent' | 'price-low' | 'price-high'

type ProductAppliedFilterListQery = {
    category ?: string,
    brand ?: string,
    color ?: string,
    size ?: string,
    sort ?: ProductSort
}

customerProductRoute.get('/categories',
    AsyncHandler(async(req : Request,res : Response)=>{
        const category = await Category.find({}).sort({createdAt : 1})

        res.json(ok(category))
    })
)

customerProductRoute.get('/products',
    AsyncHandler(async(req : Request<{},{},{},ProductAppliedFilterListQery>,res : Response)=>{
        const category = (req.query.category || "").trim() 
        const brand = (req.query.brand || "").trim()
        const color = (req.query.color || "").trim()
        const size = (req.query.size || "").trim()
        const sort : ProductSort = req.query.sort || "recent"

        const query : Record<string,unknown> = {status : 'active'}

        if(category){
            query.category = category
        }
        if(brand){
            query.brand = brand
        }
        if(color){
            query.colors = color
        }
        if(size){
            query.sizes = size
        }
        let sortOption : Record<string,1 | -1> = {createdAt : -1}

        if(sort === 'price-low'){
            sortOption ={price : 1}
        }
        if(sort === 'price-high'){
            sortOption ={price : -1}
        }
        
        const products = await Product.find(query)
          .populate('category','name').sort(sortOption)

          res.json(ok(products))
    })
)

customerProductRoute.get('/products/:id',
    AsyncHandler(async(req : Request,res : Response)=>{
        const productId = req.params.id

        const product = await Product.findOne({
            _id : productId,
            status : 'active'
        }).populate('category','name')

        const productFound = requireFound(product,'Product not found')

        const relatedProducts = await Product.find({
            _id : {$ne : productId},
            category : productFound.category._id,
            status : 'active'
        }).populate('category','name').sort({createdAt : -1})

        res.json(ok({
            product : productFound,
            relatedProducts
        }))
    })
)



export default customerProductRoute