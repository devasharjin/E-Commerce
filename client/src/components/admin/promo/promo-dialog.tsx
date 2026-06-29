import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import {
  useCreateMutation,
  useUpdateMutation,
} from "@/features/admin/promo/hooks"

import type {
  FormPromo,
  Promo,
} from "@/features/admin/promo/type"

type PromoDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  promo: Promo | null
  closePromoDialog: () => void
}

const defaultForm: FormPromo = {
  code: "",
  percentage: "",
  count: "",
  minimumOrderValue: "",
  startAt: "",
  endAt: "",
}

function formatDateTimeLocal(date: string | Date) {
  const d = new Date(date)
  const offset = d.getTimezoneOffset()

  const localDate = new Date(
    d.getTime() - offset * 60000
  )

  return localDate.toISOString().slice(0, 16)
}

const PromoDialog = ({
  open,
  onOpenChange,
  promo,
  closePromoDialog,
}: PromoDialogProps) => {
  const [formData, setFormData] =
    useState<FormPromo>(defaultForm)

  const updateMutation = useUpdateMutation()
  const createMutation = useCreateMutation()

  const isEditing = !!promo

  function updateField<K extends keyof FormPromo>(
    key: K,
    value: FormPromo[K]
  ) {
    setFormData((current) => ({
      ...current,
      [key]: value,
    }))
  }

  useEffect(() => {
    if (!open) {
      setFormData(defaultForm)
      return
    }

    if (promo) {
      setFormData({
        code: promo.code,
        percentage: String(promo.percentage),
        count: String(promo.count),
        minimumOrderValue: String(
          promo.minimumOrderValue
        ),
        startAt: formatDateTimeLocal(
          promo.startAt
        ),
        endAt: formatDateTimeLocal(
          promo.endAt
        ),
      })
    } else {
      setFormData(defaultForm)
    }
  }, [open, promo])

  async function handleSubmit() {
    try {
      if (isEditing && promo) {
        await updateMutation.mutateAsync({
          id: promo._id,
          body: formData,
        })
      } else {
        await createMutation.mutateAsync(
          formData
        )
      }

      closePromoDialog()
    } catch (error) {
      console.error(error)
    }
  }

  const saving =
    updateMutation.isPending ||
    createMutation.isPending

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {isEditing
              ? "Update Promo"
              : "Add Promo"}
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4 space-y-5">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">
                Promo Code
              </label>

              <input
                className="rounded-md border px-3 py-2"
                type="text"
                placeholder="SAVE20"
                value={formData.code}
                onChange={(e) =>
                  updateField(
                    "code",
                    e.target.value
                  )
                }
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">
                Discount Percentage
              </label>

              <input
                className="rounded-md border px-3 py-2"
                type="number"
                min="0"
                max="100"
                placeholder="10"
                value={formData.percentage}
                onChange={(e) =>
                  updateField(
                    "percentage",
                    e.target.value
                  )
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">
                Promo Count
              </label>

              <input
                className="rounded-md border px-3 py-2"
                type="number"
                min="0"
                placeholder="100"
                value={formData.count}
                onChange={(e) =>
                  updateField(
                    "count",
                    e.target.value
                  )
                }
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">
                Minimum Order Value
              </label>

              <input
                className="rounded-md border px-3 py-2"
                type="number"
                min="0"
                placeholder="999"
                value={formData.minimumOrderValue}
                onChange={(e) =>
                  updateField(
                    "minimumOrderValue",
                    e.target.value
                  )
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">
                Valid From
              </label>

              <input
                className="rounded-md border px-3 py-2"
                type="datetime-local"
                value={formData.startAt}
                onChange={(e) =>
                  updateField(
                    "startAt",
                    e.target.value
                  )
                }
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">
                Valid To
              </label>

              <input
                className="rounded-md border px-3 py-2"
                type="datetime-local"
                value={formData.endAt}
                onChange={(e) =>
                  updateField(
                    "endAt",
                    e.target.value
                  )
                }
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t pt-4">
            <Button
              variant="outline"
              onClick={closePromoDialog}
            >
              Cancel
            </Button>

            <Button
              disabled={saving}
              onClick={handleSubmit}
            >
              {saving
                ? "Saving..."
                : isEditing
                ? "Update Promo"
                : "Create Promo"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default PromoDialog