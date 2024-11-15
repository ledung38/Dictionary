import { colors } from "@/assets/colors";
import Link from "next/link";

interface BreadcrumbItem {
  pathName: string;
  name: string;
}

interface BreadcrumbProps {
  itemBreadcrumb?: BreadcrumbItem[];
  pageName: string;
}

const Breadcrumb = ({ itemBreadcrumb, pageName }: BreadcrumbProps) => {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <h2 className="text-title-md2 font-semibold text-black dark:text-white">
        {pageName}
      </h2>

      <nav>
        <ol className="flex items-center gap-2">
          {itemBreadcrumb?.map((item, index) => (
            <li key={item.name}>
              <Link href={item.pathName}>
                <div
                  className="font-medium"
                  style={{
                    color:
                      index === itemBreadcrumb?.length - 1
                        ? colors.primary600
                        : "",
                  }}
                >
                  {index === itemBreadcrumb?.length - 1
                    ? item.name
                    : `${item.name} /`}
                </div>
              </Link>
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
};

export default Breadcrumb;
