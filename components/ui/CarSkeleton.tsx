export default function CarSkeleton() {
  return (
    <div className="card animate-pulse">
      {/* Image Skeleton */}
      <div className="h-48 bg-gray-200 rounded-t-2xl"></div>
      
      <div className="p-5">
        {/* Title Skeleton */}
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>

        {/* Specs Skeleton */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="h-10 bg-gray-100 rounded-lg"></div>
          <div className="h-10 bg-gray-100 rounded-lg"></div>
          <div className="h-10 bg-gray-100 rounded-lg"></div>
        </div>

        {/* Price & CTA Skeleton */}
        <div className="flex justify-between items-center mt-2">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-10 bg-gray-200 rounded w-1/3"></div>
        </div>
      </div>
    </div>
  );
}
