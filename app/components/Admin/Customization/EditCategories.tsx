import {
  useEditLayoutMutation,
  useGetHeroDataQuery,
} from "@/redux/features/layout/layoutApi";
import React, { useEffect, useState } from "react";
import Loader from "../../Loader/Loader";
import { styles } from "@/app/styles/style";
import { AiOutlineDelete } from "react-icons/ai";
import { IoMdAddCircleOutline } from "react-icons/io";
import { toast } from "react-hot-toast";

type Props = {};

const EditCategories = (props: Props) => {
  const { data, isLoading, refetch } = useGetHeroDataQuery("Categories", {
    refetchOnMountOrArgChange: true,
  });
  const [editLayout, { isSuccess: layoutSuccess, error }] =
    useEditLayoutMutation();

  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    if (data?.layout?.categories) {
      setCategories(data.layout.categories);
    }

    if (layoutSuccess) {
      refetch();
      toast.success("Categories updated successfully");
    }

    if (error && "data" in error) {
      const errorData = error as any;
      toast.error(errorData?.data?.message);
    }
  }, [data, layoutSuccess, error, refetch]);

  const originalCategories = data?.layout?.categories || [];

  const handleCategoriesAdd = (id: any, value: string) => {
    setCategories((prev) =>
      prev.map((i: any) => (i._id === id ? { ...i, title: value } : i))
    );
  };

  const newCategoriesHandler = () => {
    if (categories.length > 0 && categories[categories.length - 1].title === "") {
      toast.error("Category title cannot be empty");
      return;
    }
    setCategories((prev) => [...prev, { _id: Math.random(), title: "" }]);
  };

  const areCategoriesUnchanged = (a: any[], b: any[]) =>
    JSON.stringify(a) === JSON.stringify(b);

  const isAnyCategoryTitleEmpty = (arr: any[]) =>
    arr.some((q) => !q.title?.trim());

  const editCategoriesHandler = async () => {
    if (!data?.layout?.categories) return;
    if (!areCategoriesUnchanged(originalCategories, categories) && !isAnyCategoryTitleEmpty(categories)) {
      await editLayout({
        type: "Categories",
        categories,
      });
    }
  };

  // Guard: wait until data exists
  if (isLoading || !data?.layout?.categories) {
    return <Loader />;
  }

  return (
    <div className="mt-[120px] text-center">
      <h1 className={`${styles.title}`}>All Categories</h1>

      {categories.map((item: any, index: number) => (
        <div className="p-3" key={item._id || index}>
          <div className="flex items-center w-full justify-center">
            <input
              className={`${styles.input} !w-[unset] !border-none !text-[20px]`}
              value={item.title}
              onChange={(e) => handleCategoriesAdd(item._id, e.target.value)}
              placeholder="Enter category title..."
            />
            <AiOutlineDelete
              className="dark:text-white text-black text-[18px] cursor-pointer"
              onClick={() =>
                setCategories((prev) =>
                  prev.filter((i: any) => i._id !== item._id)
                )
              }
            />
          </div>
        </div>
      ))}

      <div className="w-full flex justify-center">
        <IoMdAddCircleOutline
          className="dark:text-white text-black text-[25px] cursor-pointer"
          onClick={newCategoriesHandler}
        />
      </div>

      <div
        className={`
          ${styles.button}
          !w-[100px] !min-h-[40px] !h-[40px]
          dark:text-white text-black bg-[#cccccc34]
          ${
            areCategoriesUnchanged(originalCategories, categories) ||
            isAnyCategoryTitleEmpty(categories)
              ? "!cursor-not-allowed"
              : "!cursor-pointer !bg-[#42d383]"
          }
          !rounded fixed bottom-12 right-12
        `}
        onClick={
          areCategoriesUnchanged(originalCategories, categories) ||
          isAnyCategoryTitleEmpty(categories)
            ? undefined
            : editCategoriesHandler
        }
      >
        Save
      </div>
    </div>
  );
};

export default EditCategories;
