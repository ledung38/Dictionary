import React from "react";
import { Modal, Button, Avatar, Image, message, Spin } from "antd";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  ManOutlined,
  WomanOutlined,
} from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import User from "@/model/User";
import Conversations from "@/model/Conversations";

interface ProfileModalProps {
  visible: boolean;
  onClose: () => void;
  userId: number;
  showFooter?: boolean;
}

const DetailFriend: React.FC<ProfileModalProps> = ({
  visible,
  onClose,
  userId,
  showFooter = true,
}) => {
  const queryClient = useQueryClient();

  // Remove this line as SocketVideoCallContext no longer exists
  // const { selectedContact, setSelectedContact }: any = useContext(SocketVideoCallContext);

  // Thông tin user
  const { data: userInfo, isFetching } = useQuery({
    queryKey: ["getUserInfo", userId],
    queryFn: async () => {
      const res = await User.getUserInfo(userId);
      return res.data as FriendProps;
    },
    enabled: !!userId,
  });

  // APi lấy danh sách đã gửi kết bạn
  const { data: listSendingFr } = useQuery({
    queryKey: ["getLstSendingFr"],
    queryFn: async () => {
      const res = await User.getLstSending();
      return res.data;
    },
  });

  const { data: listFriend } = useQuery({
    queryKey: ["getListFriends"],
    queryFn: async () => {
      const res = await User.getLstFriend();
      return res.data;
    },
  });

  const isSendingFr = listSendingFr?.some(
    (e: { userId: number }) => e?.userId === userId,
  );
  const isFriend = listFriend?.some(
    (e: { userId: number }) => e?.userId === userId,
  );

  //* API thêm bạn bè
  const addMutation = useMutation({
    mutationFn: User.addFriend,
    onSuccess: async () => {
      message.success("Gửi lời mời kết bạn thành công");
      await queryClient.invalidateQueries({ queryKey: ["getLstSending"] });
      onClose();
    },
    onError: (error: Error) => {
      message.error(error.message);
    },
  });

  return (
    <Modal
      open={visible}
      title="Thông tin"
      onCancel={onClose}
      footer={null}
      centered
    >
      <Spin spinning={isFetching}>
        <div className="w-full">
          <Image
            width={450}
            src="/images/chatBg.png"
            alt="Banner"
            style={{ width: "100%", height: "200px", objectFit: "contain" }}
          />
        </div>

        <div style={{ textAlign: "center", marginTop: "-60px" }}>
          <Avatar
            src={userInfo?.avatarLocation}
            size={120}
            icon={<UserOutlined />}
          />
          <div className="mt-4 flex flex-col items-start gap-2 text-base">
            <h1 className="text-xl font-bold">{userInfo?.name}</h1>
            <p className="flex items-center gap-3">
              {userInfo?.gender === "MALE" ? (
                <ManOutlined style={{ fontSize: 16, marginTop: "1px" }} />
              ) : (
                <WomanOutlined style={{ fontSize: 16 }} />
              )}{" "}
              {userInfo?.gender
                ? userInfo?.gender === "MALE"
                  ? "Nam"
                  : "Nữ"
                : "Chưa có thông tin"}
            </p>
            <p className="flex items-center gap-3">
              <PhoneOutlined style={{ fontSize: 16 }} />{" "}
              {userInfo?.phoneNumber || "Chưa có thông tin"}
            </p>
            <p className="flex items-center gap-3">
              <MailOutlined style={{ fontSize: 16, marginTop: "2px" }} />{" "}
              {userInfo?.email || "Chưa có thông tin"}
            </p>
          </div>
        </div>

        {showFooter ? (
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            {isFriend && (
              <Button type="primary" style={{ marginRight: "10px" }}>
                Bạn bè
              </Button>
            )}

            {isSendingFr && (
              <Button type="primary" style={{ marginRight: "10px" }}>
                Đã gửi lời mời kết bạn
              </Button>
            )}
            {!isFriend && !isSendingFr && (
              <Button
                type="primary"
                style={{ marginRight: "10px" }}
                onClick={() => addMutation.mutate(userId)}
              >
                Gửi lời mời kết bạn
              </Button>
            )}

            <Button
              type="default"
              onClick={async () => {
                const res =
                  await Conversations.getConversationContactId(userId);
                // Remove or modify this part as setSelectedContact is no longer available
                // setSelectedContact({
                //   conversationId: res.data.conversationId,
                //   contactId: userInfo?.userId,
                //   contactName: userInfo?.name,
                // });
                onClose();
              }}
            >
              Chat
            </Button>
          </div>
        ) : null}
      </Spin>
    </Modal>
  );
};

export default DetailFriend;
