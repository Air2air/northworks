"use client";

import Link from "next/link";

export interface TagsProps {
  tags: string[];
  variant?: "default" | "compact" | "medium" | "large";
  className?: string;
  collection?: "cheryl" | "warner" | "global"; // Add collection context
}

const Tags: React.FC<TagsProps> = ({
  tags,
  variant = "default",
  className,
  collection = "global",
}) => {
  if (!tags || tags.length === 0) {
    return null;
  }
  const color1 = "bg-sky-600 text-white";

  // Determine search URL based on collection
  const getSearchUrl = (tag: string) => {
    const encodedTag = encodeURIComponent(tag);
    
    switch (collection) {
      case "cheryl":
        return `/search?q=${encodedTag}&collection=cheryl`;
      case "warner":
        return `/search?q=${encodedTag}&collection=warner`;
      default:
        return `/search?q=${encodedTag}`;
    }
  };

  const getTagStyles = (variant: string) => {
    const baseStyles =
      "inline-block transition-colors duration-200 hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 no-underline";

    switch (variant) {
      case "compact":
        return `${baseStyles} px-3 py-1.5 text-sm font-medium ${color1} rounded-full hover:bg-sky-700 focus:ring-sky-500`;
      case "medium":
        return `${baseStyles} px-3 py-1.5 text-sm font-medium ${color1} rounded-md hover:bg-sky-700 focus:ring-sky-500`;
      case "large":
        return `${baseStyles} px-4 py-2 text-base font-medium ${color1} rounded-lg hover:bg-sky-700 focus:ring-sky-500`;
      default:
        return `${baseStyles} px-3 py-1.5 text-sm font-medium  ${color1} rounded-md hover:bg-sky-700 focus:ring-sky-500`;
    }
  };

  return (
    <div className={`flex flex-wrap gap-2 ${className || ""}`}>
      {tags.map((tag, index) => (
        <Link
          key={index}
          href={getSearchUrl(tag)}
          className={getTagStyles(variant)}
          title={`Search for "${tag}"${collection !== "global" ? ` in ${collection} collection` : ""}`}
          onClick={(e) => e.stopPropagation()}
        >
          {tag}
        </Link>
      ))}
    </div>
  );
};

export default Tags;
