"use client";
import BasicDrawer from "@/components/UI/draw/BasicDraw";
import Learning from "@/model/Learning";
import { EditOutlined } from "@ant-design/icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button, Form, Input, Spin, Table, message } from "antd";
import { useForm } from "antd/es/form/Form";
import React, { useState } from "react";

const FileMobile: React.FC = () => {
  const [form] = useForm();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);

  // API lấy danh sách link mobile
  const {
    data: listLinkMobile,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["getLinkMobile"],
    queryFn: async () => {
      const res = await Learning.getLinkMobile();
      return res?.data;
    },
  });

  // Xoá data
  const mutationDel = useMutation({
    mutationFn: Learning.deleteLinkMobile,
    onSuccess: () => {
      message.success("Xoá link mobile thành công");
      refetch();
    },
  });

  // Thêm mới
  const mutationAdd = useMutation({
    mutationFn: Learning.addLinkMobile,
    onSuccess: () => {
      message.success("Thêm mới link mobile thành công");
      setShowModal(false);
      form.resetFields();
      refetch();
    },
    onError: () => {
      message.error("Không thêm được link mobile");
    },
  });

  // Sửa link mobile
  const mutationEdit = useMutation({
    mutationFn: Learning.editLinkMobile,
    onSuccess: () => {
      message.success("Chỉnh sửa link mobile thành công");
      setShowModal(false);
      form.resetFields();
      refetch();
    },
    onError: () => {
      message.error("Chỉnh sửa thất bại");
    },
  });

  const columns = [
    {
      title: "Link mobile",
      dataIndex: "mobileLocation",
      key: "mobileLocation",
      width: "20%",
      ellipsis: true,
      render: (a: any) => (
        <span className="truncate" style={{ fontWeight: 500 }}>
          {a}
        </span>
      ),
    },

    {
      title: "Hành động",
      dataIndex: "mobileLocationId",
      width: "10%",
      render: (value: any, record: any) => (
        <div className="flex space-x-2">
          <Button
            icon={<EditOutlined />}
            onClick={() => {
              setShowModal(true);
              setIsEdit(true);
              form.setFieldValue("mobileId", record?.mobileId);
              form.setFieldValue("mobileLocation", record?.mobileLocation);
            }}
          />
        </div>
      ),
    },
  ];

  return (
    <Spin spinning={isFetching}>
      <div className="">
        <Button
          hidden={listLinkMobile?.length}
          className="float-right mb-2"
          type="primary"
          onClick={() => setShowModal(true)}
        >
          Thêm mới
        </Button>
        <div className="mt-6 w-full max-w-full">
          <Table columns={columns} dataSource={listLinkMobile} />
        </div>

        {/* Modal xem lại */}
        <BasicDrawer
          open={showModal}
          onClose={() => {
            setShowModal(false);
            setIsEdit(false);
          }}
          width={400}
          title={`${isEdit ? "Chỉnh sửa" : "Thêm mới"} link mobile`}
          onOk={() => {
            form.submit();
          }}
          destroyOnClose
        >
          <div className=" w-full  ">
            <Form
              form={form}
              onFinish={(value) => {
                debugger;
                isEdit
                  ? mutationEdit.mutate({
                      id: value.mobileId,
                      mobileLocation: value.mobileLocation,
                    })
                  : mutationAdd.mutate({
                      mobileLocation: value.mobileLocation,
                    });
              }}
              layout="vertical"
            >
              <Form.Item name="mobileId" hidden />
              <Form.Item
                label="Link mobile"
                className="w-full"
                name="mobileLocation"
                rules={[{ required: true, message: "Vui lý nhap link mobile" }]}
              >
                <Input placeholder="Nhập link mobile" className="w-full" />
              </Form.Item>
            </Form>
          </div>
        </BasicDrawer>
      </div>
    </Spin>
  );
};

export default FileMobile;
