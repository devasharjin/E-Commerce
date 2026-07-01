import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { Banner } from "@/features/admin/settings/types";

type AdminSettingsTableProps = {
  banners: Banner[];
};

const AdminSettingsTable = ({
  banners,
}: AdminSettingsTableProps) => {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (!banners.length) {
    return (
      <div className="flex h-52 items-center justify-center rounded-xl border border-dashed bg-muted/20">
        <div className="text-center">
          <p className="text-lg font-medium">
            No banners available
          </p>
          <p className="text-sm text-muted-foreground">
            Upload a banner to display it here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border bg-background">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40">
            <TableHead className="w-16">#</TableHead>
            <TableHead className="w-36">Preview</TableHead>
            <TableHead>Public ID</TableHead>
            <TableHead className="w-40">
              Created
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {banners.map((banner, index) => (
            <TableRow
              key={banner.imagePublicId}
              className="transition-colors hover:bg-muted/30"
            >
              <TableCell className="font-medium text-muted-foreground">
                {index + 1}
              </TableCell>

              <TableCell>
                <div className="overflow-hidden rounded-lg border shadow-sm">
                  <img
                    src={banner.imageUrl}
                    alt="Banner"
                    className="h-20 w-32 object-cover transition-transform hover:scale-105"
                  />
                </div>
              </TableCell>

              <TableCell>
                <Badge
                  variant="secondary"
                  className="max-w-[250px] truncate"
                >
                  {banner.imagePublicId}
                </Badge>
              </TableCell>

              <TableCell>
                <div className="flex flex-col">
                  <span className="font-medium">
                    {formatDate(
                      String(banner.createdAt)
                    )}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Uploaded
                  </span>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminSettingsTable;