import { useCallback, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  FilterValue,
  SorterResult,
  TableCurrentDataSource,
  TablePaginationConfig,
} from "antd/es/table/interface";
import { omit } from "lodash";

/** Xử lý dữ liệu trả về của API phân trang về cùng một dạng content / tổng số content */
export const formatPaginationData = (res: any) => {
  if (res?.content) {
    return {
      content: res.content,
      total: res.meta.itemCount,
      ...omit(res, ["data"]),
    };
  }
  if (res?.content) {
    return {
      content: res.content,
      total: res.itemCount,
    };
  }
  if (res?.length > 0) {
    return {
      content: res,
      total: res.length,
    };
  }
  if (res?.data) {
    return {
      content: res.data,
      total: res.itemCount,
    };
  }

  return {
    content: [],
    total: 0,
  };
};

/** Function xử lý gọi API phân trang để sử dụng với Antd Table */
export const usePage = (
  // Key Query của API truyền vào
  keyQuery: any[],

  // Function gọi API
  callFn: (
    params: { [key: string]: any; size: number; page: number },
    signal?: any,
  ) => any,

  // Các Params mặc định của API
  defaultParams?: { [key: string]: any },

  // Các cài đặt khi gọi API
  queryConfig?: { [key: string]: any; pageSize?: number },
) => {
  /** Trang hiện tại của API */
  const [page, setPage] = useState<number>(1);

  /** Kích cỡ trang hiện tại */
  const [pageSize, setPageSize] = useState<number>(queryConfig?.pageSize || 10);

  /** Thứ tự sắp xếp hiện tại của bảng */
  const [sort, setSort] = useState<string>("");

  /** Quay lại trang đầu tiên mỗi khi giá trị defaultParams truyền vào thay đổi */
  useEffect(() => setPage(1), [JSON.stringify(defaultParams)]);

  /** Gọi API lấy danh sách phân trang */
  const { data, error, isLoading, isFetching, refetch } = useQuery({
    queryKey: [
      "usePagination",
      ...keyQuery,
      defaultParams,
      page,
      pageSize,
      sort,
    ],
    queryFn: async ({ signal }) => {
      const res = await callFn(
        {
          ...defaultParams,
          page: page - 1,
          size: pageSize,
          sort,
        },
        signal,
      );

      return formatPaginationData(res);
    },
    initialData: {
      content: [],
      total: 0,
    },
    ...queryConfig,
  });

  /** Xử lý khi bấm chuyển trang */
  const onPageChange = useCallback((newPage: number, newPageSize: number) => {
    setPage(newPage);
    setPageSize(newPageSize);
  }, []);

  /** Xử lý khi bấm nút trên bảng */
  const onChangeTable = useCallback(
    (
      pagination: { current: number; pageSize: number },
      filters: any,
      sorter: { order: string; field: string },
      { action }: { action: string },
    ) => {
      if (action === "paginate") {
        setPage(pagination.current);
        setPageSize(pagination.pageSize);
      } else if (action === "sort") {
        if (!sorter.order) {
          setSort("");
        } else {
          setSort(`${sorter.field},${sorter.order.slice(0, -3).toUpperCase()}`);
        }
      }
    },
    [],
  );

  return {
    data,
    error,
    isLoading,
    isFetching,
    page,
    pageSize,
    content: data?.content || [],
    total: data?.total,
    refetch,
    pagination: {
      current: page,
      pageSize,
      total: data?.total,
      onChange: onPageChange,
      showSizeChanger: data?.total > 0 && !queryConfig?.pageSize,
      position: ["bottomCenter"],
      pageSizeOptions: [10, 20, 50],
    } as TablePaginationConfig,
    onChange: onChangeTable as (
      pagination: TablePaginationConfig,
      filters: Record<string, FilterValue | null>,
      sorter: SorterResult<any> | SorterResult<any>[],
      extra: TableCurrentDataSource<any>,
    ) => void,
  };
};
