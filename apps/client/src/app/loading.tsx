import { Spinner } from "@repo/ui/components/ui/spinner";

export default function SkeletonCard() {
  return (
    <div className="flex flex-col space-y-3">
      <Spinner size="sm" className="bg-black dark:bg-white" />
    </div>
  );
}
