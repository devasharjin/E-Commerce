import { Router, type Request, type Response } from "express";
import { AsyncHandler } from "../../utils/AsyncHandler.js";
import { extractDbUser, requireAuth } from "../../middleware/auth.js";
import { requireFound, requireText } from "../../utils/helper.js";
import { ok } from "../../utils/envelope.js";
import { Types } from "mongoose";
import { AppError } from "../../utils/AppError.js";

type AddressProps = {
    _id?: Types.ObjectId;
    fullName: string;
    address: string;
    city: string;
    pinCode: string;
    isDefault: boolean;
};

function mapAddress(item: AddressProps) {
    return {
        _id: String(item._id || ""),
        fullName: item.fullName,
        address: item.address,
        city: item.city,
        pinCode: item.pinCode,
        isDefault: item.isDefault
    }
}

const customerAddressRoute = Router();
customerAddressRoute.use(requireAuth)

customerAddressRoute.get(
    "/address",
    AsyncHandler(async (req: Request, res: Response) => {
        const dbUser = await extractDbUser(req);

        const user = requireFound(dbUser, "User not found");

        const addresses: AddressProps[] = user.addresses || []

        const items = [...addresses]
            .sort((a, b) => Number(b.isDefault) - Number(a.isDefault))
            .map(mapAddress)


        res.json(ok(items))
    })
);

customerAddressRoute.post(
    "/address",
    AsyncHandler(async (req: Request, res: Response) => {
        const dbUser = await extractDbUser(req);

        const fullName = String(req.body.fullName || "").trim()
        const address = String(req.body.address || "").trim()
        const city = String(req.body.city || "").trim()
        const pinCode = String(req.body.pinCode || "").trim();

        requireText(fullName, 'fullName is required')
        requireText(address, 'address is required')
        requireText(city, 'city is required')
        requireText(pinCode, 'pinCode is required')

        const user = requireFound(dbUser, "User not found");

        const addresses: AddressProps[] = user.addresses || []

        const shouldBeDefault = addresses.length === 0 && req.body.isDefault === true

        if (shouldBeDefault) {
            addresses.forEach((item) => {
                item.isDefault = false
            })
        }

        addresses.push({
            fullName,
            address,
            pinCode,
            city,
            isDefault: shouldBeDefault
        })

        await user.save()


        const items = [...addresses]
            .sort((a, b) => Number(b.isDefault) - Number(a.isDefault))
            .map(mapAddress)


        res.json(ok(items))

    })
);

customerAddressRoute.put(
    "/address/:id",
    AsyncHandler(async (req: Request, res: Response) => {
        const dbUser = await extractDbUser(req);
        const addressId = req.params.id

        const user = requireFound(dbUser, "User not found");

        const addresses: AddressProps[] = user.addresses || []

        const editAddress = addresses.find(address => String(address._id) === addressId)

        if (!editAddress) {
            throw new AppError(400, 'Id not match')
        }

        const fullName = String(req.body.fullName || "").trim()
        const address = String(req.body.address || "").trim()
        const city = String(req.body.city || "").trim()
        const pinCode = String(req.body.pinCode || "").trim();

        requireText(fullName, 'fullName is required')
        requireText(address, 'address is required')
        requireText(city, 'city is required')
        requireText(pinCode, 'pinCode is required')

        const shouldBeDefault = addresses.length === 0 && req.body.isDefault === true

        if (shouldBeDefault) {
            addresses.forEach((item) => {
                item.isDefault = false
            })
        }

        editAddress.fullName = fullName
        editAddress.address = address
        editAddress.city = city
        editAddress.pinCode = pinCode

        if (shouldBeDefault) {
            editAddress.isDefault = true
        }

        await user.save()


        const items = [...addresses]
            .sort((a, b) => Number(b.isDefault) - Number(a.isDefault))
            .map(mapAddress)


        res.json(ok(items))

    })
);

customerAddressRoute.delete(
    "/address/:id",
    AsyncHandler(async (req: Request, res: Response) => {
        const dbUser = await extractDbUser(req);
        const addressId = req.params.id

        requireText(String(addressId), 'Address Id is required')

        const user = requireFound(dbUser, "User not found");

        const addresses: AddressProps[] = user.addresses || []

        const addressTBoeDeletedIndex = addresses.findIndex(
            address => String(address._id) === addressId
        )

        if (addressTBoeDeletedIndex < 0) {
            throw new AppError(404, "Address not found");
        }

        const wasDefault = addresses[addressTBoeDeletedIndex].isDefault;

        addresses.splice(addressTBoeDeletedIndex, 1);

        if (
            wasDefault &&
            addresses.length > 0 &&
            !addresses.some((address) => address.isDefault)
        ) {
            addresses[0].isDefault = true;
        }

        await user.save();

        const items = [...(user.addresses as AddressProps[])]
            .sort((a, b) => Number(b.isDefault) - Number(a.isDefault))
            .map(mapAddress);

        res.json(ok(items))


    })
);

export default customerAddressRoute;