import { Router, type Request, type Response } from "express";
import { extractDbUser, requireAdmin, requireAuth } from "../../middleware/auth.js";
import { AsyncHandler } from "../../utils/AsyncHandler.js";
import Banner from "../../models/banner.js";
import { ok } from "../../utils/envelope.js";
import multer from "multer";
import { AppError } from "../../utils/AppError.js";
import { UploadMultipleFilesToCloudinary } from "../../utils/cloudinary.js";



const AdminSettingsRoute = Router()

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024,
        files: 10
    }
})

const folderName = 'E-commerce/banners'

AdminSettingsRoute.use(requireAuth)
AdminSettingsRoute.use(requireAdmin)

AdminSettingsRoute.get('/settings',
    AsyncHandler(async (req: Request, res: Response) => {
        const banner = await Banner.find().sort({
            createdAt: -1
        }).lean()

        res.json(ok(banner))
    })
)

AdminSettingsRoute.post('/settings',
    upload.array('images', 10),
    AsyncHandler(async (req: Request, res: Response) => {
        const dbUser = await extractDbUser(req)
        const files = (req.files || []) as Express.Multer.File[]

        if (!files.length) {
            throw new AppError(400, 'Atleast One image is needed.')
        }

        const uploads = await UploadMultipleFilesToCloudinary(
            files.map((file) => file.buffer),
            folderName
        )

        const createdBanners = await Banner.insertMany(
            uploads.map(item => ({
                imageUrl: item.url,
                imagePublicId: item.publicId,
                uploadedBy: dbUser._id
            }))
        )

        res.json(ok(createdBanners))

    })
)



export default AdminSettingsRoute