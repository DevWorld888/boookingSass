"use client";
import Link from 'next/link';
import { ChevronRightIcon } from '@heroicons/react/20/solid';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex mb-6" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        {items.map((item, index) => (
          <li key={index} className="inline-flex items-center">
            {index > 0 && (
              <ChevronRightIcon className="w-4 h-4 text-gray-400 mx-2" />
            )}
            {item.href && index < items.length - 1 ? (
              <Link
                href={item.href}
                className="text-sm font-medium text-white hover:text-gray-300 transition-colors duration-200"
              >
                {item.label}
              </Link>
            ) : (
              <span
                className={`text-sm font-medium ${
                  index === items.length - 1
                    ? 'text-white-900'
                    : 'text-white-500'
                }`}
              >
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}