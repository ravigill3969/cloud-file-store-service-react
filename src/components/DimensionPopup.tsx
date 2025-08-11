import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useEditImage } from "@/api/file";

export default function DimensionPopup({
  open,
  onOpenChange,
  iid,
}: {
  open: boolean;
  onOpenChange: (val: boolean) => void;
  iid: string;
}) {
  const [height, setHeight] = useState("");
  const [width, setWidth] = useState("");

  const { mutate } = useEditImage();

  const handleSubmit = () => {
    if (height && width) {
      mutate({ height, iid, width });
      onOpenChange?.(false); // Close the dialog
    }
  };

  const handleCancel = () => {
    onOpenChange?.(false); // Close the dialog
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-lg font-semibold">
            Enter Dimensions
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-600">
            Please enter the height and width values below.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <label
              htmlFor="width"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Width
            </label>
            <input
              id="width"
              type="number"
              value={width}
              onChange={(e) => setWidth(e.target.value)}
              placeholder="Enter width"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label
              htmlFor="height"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Height
            </label>
            <input
              id="height"
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder="Enter height"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={handleCancel}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors ml-2"
          >
            Apply
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
