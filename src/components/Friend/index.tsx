"use client";
import User from "@/model/User";
import { DeleteFilled, MailOutlined, UserOutlined } from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Avatar, Button, Empty, List, message, Tabs } from "antd";
import { useState } from "react";
import { ConfirmModal } from "../UI/Modal/ConfirmModal";
import DetailFriend from "./components/DetailFriend";

interface Friend {
  id: number;
  name: string;
  email: string;
  avatarLocation: string | null;
}

interface FriendRequest {
  userId: number;
  name: string;
  avatarLocation: string | null;
}

const friends: Friend[] = [
  // Your friend data here
];

const friendRequests: FriendRequest[] = [
  // Your friend request data here
];

const Friend = () => {
  const queryClient = useQueryClient();
  const [view, setView] = useState<"friends" | "requests" | "sending">(
    "friends",
  );

  // state lưu xáo bạn bè, lời mời kb
  const [stateDel, setStateDel] = useState<{
    delFriend: boolean;
    delRequest: boolean;
    delSending: boolean;
  }>({
    delFriend: false,
    delRequest: false,
    delSending: false,
  });

  // state lưu id cần xoá
  const [stateDelId, setStateDelId] = useState<number>(0);

  const [openFriendDetail, setOpenFriendDetail] = useState<{
    open: boolean;
    userId: number;
  }>({
    open: false,
    userId: 0,
  });

  //* API lấy danh sách bạn bè
  const { data: lstFriend, isFetching } = useQuery({
    queryKey: ["getLstFriend", view],
    queryFn: async () => {
      const res = await User.getLstFriend();

      // Sắp xếp theo vần
      const sorted = res.data?.length
        ? res.data?.sort((a: any, b: any) => a.name.localeCompare(b.name))
        : [];

      // Đưa các tên theo vần vào 1 nhóm
      const groupedData = sorted?.reduce((acc: any, item: any) => {
        // Lấy ký tự đầu tiên tạo từ điển rồi đưa danh sách theo tên vào
        // dang { A: []}
        const firstLetter = item.name.charAt(0).toUpperCase();
        acc[firstLetter] = acc[firstLetter] || [];
        acc[firstLetter].push(item);
        return acc;
      }, {});

      return groupedData;
    },
    retry: false,
    refetchOnWindowFocus: false,
    // enabled: view === "friends",
  });

  //* API lấy danh sách lời mời kết bạn
  const { data: lstRequest, isFetching: isFetchingRequest } = useQuery({
    queryKey: ["getLstRequest", view],
    queryFn: async () => {
      const res = await User.getLstRequest();
      return res.data || [];
    },
    retry: false,
    refetchOnWindowFocus: false,
    // enabled: view === "requests",
  });

  //* API lấy danh sách lời mời đã gửi
  const { data: lstSending, isFetching: isFetchingSending } = useQuery({
    queryKey: ["getLstSending", view],
    queryFn: async () => {
      const res = await User.getLstSending();
      return res.data || [];
    },
    retry: false,
    refetchOnWindowFocus: false,
    // enabled: view === "sending",
  });

  //* API đồng ý kết bạn
  const acceptMutation = useMutation({
    mutationFn: User.acceptFriend,
    onSuccess: async () => {
      message.success("Xác nhận kết bạn thành công");
      await queryClient.invalidateQueries({ queryKey: ["getLstFriend"] });
      await queryClient.invalidateQueries({ queryKey: ["getLstRequest"] });
    },
    onError: (error: Error) => {
      message.error(error.message);
    },
  });

  //* API huỷ kết bạn, lời mời
  const cancelMutation = useMutation({
    mutationFn: User.cancelFriend,
    onSuccess: async () => {
      if (view === "friends") {
        message.success("Xoá bạn bè thành công");
        await queryClient.invalidateQueries({ queryKey: ["getLstFriend"] });
      } else if (view === "requests") {
        message.success("Huỷ lời mời kết bạn thành công");
        await queryClient.invalidateQueries({ queryKey: ["getLstRequest"] });
      } else {
        message.success("Thu hồi lời mời kết bạn thành công");
        await queryClient.invalidateQueries({ queryKey: ["getLstSending"] });
      }
    },
    onError: (error: Error) => {
      message.error(error.message);
    },
  });

  const onCancelFriends = (
    userId: number,
    type: "cancelPending" | "cancelRequest" | "cancelFriend",
  ) => {
    setStateDel({
      delFriend: type === "cancelFriend",
      delRequest: type === "cancelRequest",
      delSending: type === "cancelPending",
    });
    setStateDelId(userId);
  };

  return (
    <div className="py-2 pr-4">
      <Tabs
        className="bg-white px-4 pb-3"
        defaultActiveKey="friends"
        onChange={(key) => setView(key as "friends" | "requests")}
      >
        <Tabs.TabPane
          tab={
            <span className="flex items-center gap-3">
              <UserOutlined size={24} className="pt-[2px]" />
              Bạn bè: (
              {(lstFriend && Object?.entries(lstFriend).length) || "Trống"})
            </span>
          }
          key="friends"
        >
          {lstFriend ? (
            Object.entries(lstFriend).map(([letter, groupItems]: any) => (
              <div key={letter}>
                <div className="pb-2 text-base">{letter}</div>
                <List
                  loading={isFetching}
                  itemLayout="horizontal"
                  dataSource={groupItems}
                  renderItem={(friend: FriendProps) => (
                    <List.Item
                      style={{ paddingLeft: "16px" }}
                      className="group hover:rounded-xl hover:bg-neutral-200"
                      actions={[
                        <Button
                          key={friend.userId}
                          type="text"
                          className=" opacity-0 group-hover:opacity-100"
                          icon={<DeleteFilled />}
                          onClick={(e) => {
                            e.stopPropagation();
                            onCancelFriends(friend.userId, "cancelFriend");
                            // handleDeleteFr(friend.userId);
                          }}
                        />,
                      ]}
                      // onClick={() => handleRouterChat(friend.userId)}
                    >
                      <List.Item.Meta
                        avatar={
                          <Avatar
                            className="mt-1"
                            size={32}
                            icon={<UserOutlined />}
                            src={friend?.avatarLocation}
                          />
                        }
                        title={friend?.name}
                        description={friend?.phoneNumber}
                      />
                    </List.Item>
                  )}
                  locale={{ emptyText: "Không có tin" }}
                />
              </div>
            ))
          ) : (
            <Empty description="Không có "></Empty>
          )}
        </Tabs.TabPane>
        <Tabs.TabPane
          tab={
            <span className="flex items-center gap-3">
              <MailOutlined size={24} className="pt-[2px]" />
              Lời mời kết bạn{" "}
              {lstRequest?.length ? `(${lstRequest?.length})` : null}
            </span>
          }
          key="requests"
        >
          {lstRequest?.length ? (
            <List
              grid={{ gutter: 16, column: 4 }}
              dataSource={lstRequest}
              loading={isFetchingRequest}
              pagination={{
                pageSize: 12,
                total: lstRequest?.length,
              }}
              renderItem={(request: FriendProps, index) => (
                <List.Item className="shadow-12 transition-all hover:scale-[1.02]  ">
                  <div className="rounded-lg bg-white p-4 shadow-lg">
                    <div className="mb-3 flex gap-3">
                      <Avatar
                        icon={<UserOutlined />}
                        size={40}
                        src={request.avatarLocation}
                        className="hover:cursor-pointer"
                        onClick={() =>
                          setOpenFriendDetail({
                            open: true,
                            userId: request.userId,
                          })
                        }
                      />

                      <div className="">
                        <h4 className="">{request.name}</h4>
                        <div className="text-sm font-normal text-slate-400">
                          Bạn đã gửi lời mời
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Button
                        danger
                        className="w-full"
                        onClick={() =>
                          onCancelFriends(request.userId, "cancelRequest")
                        }
                      >
                        Huỷ
                      </Button>
                      <Button
                        type="primary"
                        className="w-full"
                        onClick={() => acceptMutation.mutate(request.userId)}
                      >
                        Xác nhận
                      </Button>
                    </div>
                  </div>
                </List.Item>
              )}
              locale={{ emptyText: "Không có thông tin" }}
            />
          ) : (
            <Empty description="Không có thông tin"></Empty>
          )}
        </Tabs.TabPane>
        <Tabs.TabPane
          tab={
            <span className="flex items-center gap-3">
              <MailOutlined size={24} className="pt-[2px]" />
              Lời mời đã gửi{" "}
              {lstSending?.length ? `(${lstSending?.length})` : null}
            </span>
          }
          key="sending"
        >
          {lstSending?.length ? (
            <List
              grid={{ gutter: 16, column: 4 }}
              dataSource={lstSending}
              loading={isFetchingSending}
              pagination={{
                pageSize: 12,
                total: lstSending?.length,
              }}
              renderItem={(sending: FriendProps, index) => (
                <List.Item className="shadow-12 transition-all hover:scale-[1.02]  ">
                  <div className="rounded-lg bg-white p-4 shadow-lg">
                    <div className="mb-3 flex gap-3">
                      <Avatar
                        icon={<UserOutlined />}
                        size={40}
                        src={sending.avatarLocation}
                      />

                      <div className="">
                        <h4 className="">{sending.name}</h4>
                        <div className="text-sm font-normal text-slate-400">
                          Bạn đã gửi lời mời
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Button
                        danger
                        className="w-full"
                        onClick={() =>
                          onCancelFriends(sending.userId, "cancelPending")
                        }
                      >
                        Thu hồi lời mời
                      </Button>
                    </div>
                  </div>
                </List.Item>
              )}
              locale={{ emptyText: "Không có thông tin" }}
            />
          ) : (
            <Empty description="Không có thông"></Empty>
          )}
        </Tabs.TabPane>
      </Tabs>

      {/* Modal */}
      <ConfirmModal
        visible={
          stateDel.delFriend || stateDel.delRequest || stateDel.delSending
        }
        iconType="DELETE"
        title={
          <>
            {stateDel.delFriend && "Xoá bạn bè"}
            {stateDel.delRequest && "Từ chối kết bạn"}
            {stateDel.delSending && "Thu hồi lời mời kết bạn"}
          </>
        }
        content={
          <>
            Hành động này sẽ {stateDel.delFriend && "xoá bạn bè"}
            {stateDel.delRequest && "huỷ lời mời kết bạn"}
            {stateDel.delSending && "thu hồi lời mời kết bạn"}
          </>
        }
        onClick={() => cancelMutation.mutate(stateDelId)}
        onCloseModal={() => {
          setStateDel({
            delFriend: false,
            delRequest: false,
            delSending: false,
          });
        }}
      />

      {/* Detail thông tin */}
      <DetailFriend
        visible={openFriendDetail.open}
        userId={openFriendDetail.userId}
        onClose={() => {
          setOpenFriendDetail({
            ...openFriendDetail,
            open: false,
          });
        }}
        showFooter={false}
      />
    </div>
  );
};

export default Friend;
