import AdminSettingsTable from "@/components/admin/settings/settings-table";
import Loader from "@/components/common/Loader";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAdminSettings } from "@/features/admin/settings/use-admin-settings";
import { ImagePlus, Images, Upload, Loader2 } from "lucide-react";

const AdminSettings = () => {
  const {
    banners,
    isLoading,
    setFiles,
    handleUpload,
    fieldData,
    isPending,
  } = useAdminSettings();

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Banner Settings
          </h1>
          <p className="text-muted-foreground">
            Manage homepage banner images.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="rounded-lg bg-primary/10 p-3">
              <Images className="h-6 w-6 text-primary" />
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                Total Banners
              </p>
              <h2 className="text-2xl font-bold">
                {banners?.length ?? 0}
              </h2>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="rounded-lg bg-blue-500/10 p-3">
              <Upload className="h-6 w-6 text-blue-500" />
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                Selected Files
              </p>
              <h2 className="text-2xl font-bold">
                {fieldData}
              </h2>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Layout */}
      <div className="grid gap-6 xl:grid-cols-4">
        {/* Banner Table */}
        <Card className="xl:col-span-3">
          <CardHeader>
            <CardTitle>Homepage Banners</CardTitle>
            <CardDescription>
              View all uploaded banners.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <AdminSettingsTable
              banners={banners ?? []}
            />
          </CardContent>
        </Card>

        {/* Upload Section */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Upload Banner</CardTitle>
            <CardDescription>
              Upload one or multiple images.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-5">
            <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8">
              <ImagePlus className="mb-3 h-12 w-12 text-muted-foreground" />

              <p className="font-medium">
                Choose banner images
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                JPG, PNG, WEBP
              </p>
            </div>

            <Input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => {
                if (!e.target.files) return;

                setFiles(Array.from(e.target.files));
              }}
            />

            <div className="rounded-lg bg-muted p-3 text-sm text-muted-foreground">
              {fieldData}
            </div>

            <Button
              className="w-full"
              size="lg"
              disabled={isPending}
              onClick={handleUpload}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Banners
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminSettings;