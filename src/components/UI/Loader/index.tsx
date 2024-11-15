import { colors } from "@/assets/colors";
import { Logo } from "@/assets/icons";

const Loader = () => {
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-white dark:bg-black">
      <div className="flex flex-col items-center mb-8">
        <div className="flex items-end animate-pulse">
          <div className="mb-1 ml-1 text-4xl font-bold text-blue-600 dark:text-blue-400">Dictionary</div>
        </div>
        <div className="mt-4 text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
    </div>
  );
};

export default Loader;
