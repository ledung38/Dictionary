import React, { useState } from "react";
import { Avatar, Button, Input, List, Skeleton } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import styled from "styled-components";
import User from "@/model/User";
import DetailFriend from "./DetailFriend";
import { RootState } from "@/store";
import { useSelector } from "react-redux";

const { Search } = Input;

const CustomSearch = styled(Search)`
  .ant-input {
    height: 30px;
    width: 300px;
    border-radius: 12px;
    border: 2px solid #cccc;
  }
  &.ant-input-search .ant-input-search-button {
    height: 40px;
  }
`;

interface FriendProps {
  userId: number;
  name: string;
  email: string;
  avatarLocation: string;
}

const SearchInput: React.FC = () => {
  const user: User = useSelector((state: RootState) => state.admin);

  const [results, setResults] = useState<FriendProps[]>([]);
  const [params, setParams] = useState<{
    text: string;
    page: number;
    size: number;
  }>({
    text: "",
    page: 1,
    size: 5,
  });
  const [totalElements, setTotalElements] = useState<number>(0);
  const [showLstFriend, setShowLstFriend] = useState<boolean>(false);
  const [openFriendDetail, setOpenFriendDetail] = useState<{
    open: boolean;
    userId: number;
  }>({
    open: false,
    userId: 0,
  });

  const { data: lstFriendSearch, isFetching } = useQuery({
    queryKey: ["searchFriend", params],
    queryFn: async () => {
      const res = await User.searchFriend(params);
      setResults(
        res.data.data?.filter(
          (item: any) => item.role.toLowerCase() !== "admin",
        ),
      );
      setTotalElements(res.data.totalElements);
      return res;
    },
    enabled: !!params.text,
  });

  const onSearch = (value: string) => {
    setResults([]);
  };

  const onItemClick = (id: number) => {
    setOpenFriendDetail({ open: true, userId: id });
    setShowLstFriend(false);
  };

  const onLoadMore = () => {
    setParams({ ...params, size: params.size + 5 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  const handleSearchFocus = () => {
    setShowLstFriend(true);
  };

  const loadMore =
    !isFetching && totalElements > results?.length ? (
      <div
        style={{
          textAlign: "center",
          marginTop: 12,
          height: 32,
          lineHeight: "32px",
        }}
      >
        <Button onMouseDown={handleMouseDown} onClick={onLoadMore}>
          Xem thêm
        </Button>
      </div>
    ) : null;

  return (
    <div className="relative">
      <CustomSearch
        allowClear
        value={params.text}
        placeholder="Tìm kiếm bạn bè"
        onSearch={onSearch}
        onChange={(e) => {
          setShowLstFriend(true);
          setParams({ ...params, text: e.target.value, size: 5 });
        }}
        onBlur={() => {
          setShowLstFriend(false);
        }}
        onFocus={handleSearchFocus}
        enterButton
      />
      {showLstFriend && params.text && (
        <div className="absolute z-10 mt-2 w-full rounded-lg bg-white shadow-lg">
          <List
            className="custom-scrollbar max-h-[350px] overflow-y-auto pb-4"
            loading={isFetching}
            itemLayout="horizontal"
            dataSource={results}
            loadMore={loadMore}
            bordered
            renderItem={(friend) => (
              <List.Item
                className="hover:cursor-pointer hover:bg-neutral-300"
                onMouseDown={() => onItemClick(friend.userId)}
              >
                <Skeleton avatar title={false} loading={isFetching} active>
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        className="mt-1"
                        size={40}
                        icon={<UserOutlined />}
                        src={friend.avatarLocation}
                      />
                    }
                    title={<div className="font-semibold">{friend.name}</div>}
                    description={friend.email}
                  />
                </Skeleton>
              </List.Item>
            )}
            locale={{ emptyText: "Không có kết quả tìm kiếm" }}
          />
        </div>
      )}

      <DetailFriend
        visible={openFriendDetail.open}
        userId={openFriendDetail.userId}
        onClose={() => {
          setOpenFriendDetail({
            ...openFriendDetail,
            open: false,
          });
        }}
      />
    </div>
  );
};

export default SearchInput;
