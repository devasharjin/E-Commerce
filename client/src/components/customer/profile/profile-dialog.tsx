import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useAuthStore } from "@/features/auth/store"
import {
  useAddresses,
  useCreateAddress,
  useDeleteAddress,
  useUpdateAddress,
} from "@/features/customer/Address/api"
import { ProfileStore } from "@/features/customer/Address/store"
import type { Address } from "@/features/customer/Address/types"
import { Pencil, Plus, Trash2 } from "lucide-react"
import { useState } from "react"

const ProfileDialog = () => {
  const {
    open,
    setOpen,
    isEditing,
    setIsEditing,
    form,
    updateField,
  } = ProfileStore()

  const { user } = useAuthStore()

  const { data: addresses } = useAddresses()

  const [formOpen, setFormOpen] = useState(false)

  const createAddress = useCreateAddress()
  const updateAddress = useUpdateAddress()
  const deleteAddress = useDeleteAddress()

  function handleOpen(address?: Address) {
    setFormOpen(true)

    if (address) {
      setIsEditing(address)
    } else {
      setIsEditing(null)
    }
  }

  function handleSave() {
    if (isEditing) {
      updateAddress.mutate({
        id: isEditing._id as string,
        body: form,
      })
    } else {
      createAddress.mutate(form)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="min-w-7xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            My Profile
          </DialogTitle>
        </DialogHeader>

        {/* Profile */}
        <div className="rounded-lg border p-5 mb-6">
          <h2 className="font-semibold text-lg mb-4">
            Personal Information
          </h2>

          <div className="space-y-2">
            <p>
              <span className="font-medium">Name:</span>{" "}
              {user?.name}
            </p>

            <p>
              <span className="font-medium">Email:</span>{" "}
              {user?.email}
            </p>
          </div>
        </div>

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left */}
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-semibold">
                Saved Addresses
              </h2>

              <Button
                onClick={() => handleOpen()}
                className="flex items-center gap-2"
              >
                <Plus size={18} />
                Add Address
              </Button>
            </div>

            <div className="space-y-4">
              {!addresses?.length ? (
                <div className="border rounded-lg p-8 text-center text-muted-foreground">
                  No Addresses Found
                </div>
              ) : (
                addresses.map((address) => (
                  <div
                    key={address._id}
                    className="border rounded-lg p-4 shadow-sm"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">
                          {address.fullName}
                        </h3>

                        {address.isDefault && (
                          <Badge>Default</Badge>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => handleOpen(address)}
                        >
                          <Pencil size={16} />
                        </Button>

                        <Button
                          size="icon"
                          variant="destructive"
                          onClick={() =>
                            deleteAddress.mutate(
                              address._id as string
                            )
                          }
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground">
                      {address.address}
                    </p>

                    <p className="text-sm text-muted-foreground">
                      {address.city} - {address.pinCode}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right */}
          {formOpen && (
            <div className="border rounded-lg p-6 h-fit">
              <h2 className="text-xl font-semibold mb-6">
                {isEditing
                  ? "Update Address"
                  : "Add Address"}
              </h2>

              <div className="space-y-5">
                <div>
                  <label className="text-sm font-medium">
                    Full Name
                  </label>

                  <input
                    type="text"
                    value={form.fullName}
                    onChange={(e) =>
                      updateField(
                        "fullName",
                        e.target.value
                      )
                    }
                    className="mt-2 w-full rounded-md border px-3 py-2 outline-none focus:ring-2"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">
                    Address
                  </label>

                  <textarea
                    value={form.address}
                    onChange={(e) =>
                      updateField(
                        "address",
                        e.target.value
                      )
                    }
                    rows={3}
                    className="mt-2 w-full rounded-md border px-3 py-2 outline-none focus:ring-2"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">
                      City
                    </label>

                    <input
                      type="text"
                      value={form.city}
                      onChange={(e) =>
                        updateField(
                          "city",
                          e.target.value
                        )
                      }
                      className="mt-2 w-full rounded-md border px-3 py-2 outline-none focus:ring-2"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">
                      Pin Code
                    </label>

                    <input
                      type="text"
                      value={form.pinCode}
                      onChange={(e) =>
                        updateField(
                          "pinCode",
                          e.target.value
                        )
                      }
                      className="mt-2 w-full rounded-md border px-3 py-2 outline-none focus:ring-2"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={form.isDefault}
                    onChange={(e) =>
                      updateField(
                        "isDefault",
                        e.target.checked
                      )
                    }
                  />

                  <span>Set as Default Address</span>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setFormOpen(false)
                      setIsEditing(null)
                    }}
                  >
                    Cancel
                  </Button>

                  <Button onClick={handleSave}>
                    {isEditing
                      ? "Update Address"
                      : "Save Address"}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ProfileDialog