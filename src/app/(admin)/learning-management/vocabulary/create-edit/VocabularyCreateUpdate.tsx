"use client";
import { filterOption } from "@/components/Dashboard/DashboardApp";
import Breadcrumb from "@/components/UI/Breadcrumbs/Breadcrumb";
import { AvatarUpload } from "@/components/UI/Upload/AvatarUpload";
import Learning from "@/model/Learning";
import UploadModel from "@/model/UploadModel";
import { validateRequireInput } from "@/utils/validation/validtor";
import { UploadOutlined } from "@ant-design/icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Button,
  Form,
  Image,
  Input,
  Modal,
  Select,
  Spin,
  Tabs,
  Upload,
  UploadProps,
  message,
} from "antd";
import { useForm } from "antd/es/form/Form";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { setTimeout } from "timers";

interface Topic {
  content: string;
  imageLocation: string;
  videoLocation?: string;
}

interface FilterParams {
  page: number;
  size: number;
  topicId: number;
  content: string;
}

// Danh sách các đuôi file ảnh
const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp"];

// Hàm kiểm tra đuôi file có thuộc danh sách ảnh hay không
export function isImageLocation(url: string) {
  for (let ext of imageExtensions) {
    if (url?.toLowerCase().endsWith(ext)) {
      return true;
    }
  }
  return false;
}

const { TabPane } = Tabs;
const { TextArea } = Input;

const VocabularyCreateUpdate: React.FC = () => {
  const router = useRouter();
  const [form] = useForm();
  const [formUpload] = useForm();
  const searchParams = useSearchParams();
  const isPrivate = searchParams.get("isPrivate");

  //state
  const [tabKey, setTabKey] = useState("1");

  // Modal thêm mới
  const [preview, setPreview] = useState<{
    fileImage: string;
    fileVideo: string;
  }>({
    fileImage: "",
    fileVideo: "",
  });

  const [fileList, setFileList] = useState([]); // State để lưu trữ danh sách tệp tin đã chọn
  const [previewFile, setPreviewFile] = useState<{
    open: boolean;
    file: any;
  }>({
    open: false,
    file: "",
  });
  const [isLoadingUploadLst, setIsLoadingUploadLst] = useState<boolean>(false);
  const [isLoadingFile, setIsLoadingFile] = useState<boolean>(false);

  // Loại từ vựng
  const vocabularyType = Form.useWatch("vocabularyType", form);

  useEffect(() => {
    form.resetFields();
  }, [tabKey]);

  // API lấy danh sách  topics
  const { data: allTopics, isFetching: isFetchingTopic } = useQuery({
    queryKey: ["getAllTopics", isPrivate],
    queryFn: async () => {
      const res = await Learning.getAllTopics({ isPrivate: isPrivate });
      return res?.data?.map((item: { topicId: any; content: any }) => ({
        id: item.topicId,
        value: item.topicId,
        label: item.content,
        text: item.content,
      }));
    },
    enabled: !!isPrivate,
  });

  // Thêm mới / chỉnh sửa  từ vựng
  const mutationCreate = useMutation({
    mutationFn: Learning.addVocabulary,
    onSuccess: () => {
      message.success("Thêm mới từ thành công");
      router.back();
    },
    onError: ({ response }: any) => {
      const { data } = response;
      if (data.code === 409) {
        message.error("Từ vựng đã tồn tại");
        return;
      }
      message.error("Thêm mới từ vựng thất bại");
    },
  });

  // Upload file
  const uploadFileMutation = useMutation({
    mutationFn: UploadModel.uploadFile,
    onSuccess: async (res: any) => {
      if (isImageLocation(res)) {
        setPreview({
          ...preview,
          fileImage: res,
        });
        form.setFieldValue("vocabularyImageReqs", [
          {
            imageLocation: res,
            primary: true,
          },
        ]);
      } else {
        setPreview({
          ...preview,
          fileVideo: res,
        });
        form.setFieldValue("vocabularyVideoReqs", [
          {
            videoLocation: res,
            primary: true,
          },
        ]);
      }
    },
    onError: (error: Error) => {
      console.error(error);
      message.error("File đã được lưu trước đó");
    },
  });

  // upload
  const props: UploadProps = {
    name: "file",
    onChange(info) {
      if (info.file.status === "done") {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    customRequest: ({ file }: { file: any }) => {
      const formData = new FormData();
      formData.append("file", file);
      uploadFileMutation.mutate(formData);
    },
    progress: {
      strokeColor: {
        "0%": "#108ee9",
        "100%": "#87d068",
      },
      strokeWidth: 3,
      format: (percent) => percent && `${parseFloat(percent.toFixed(2))}%`,
    },
  };

  // Hàm xử lý sự kiện khi click vào file để xem trước
  const handlePreview = async (file: any) => {
    if (!file.url && !file.preview) {
      // Nếu không có URL hoặc preview, thì tạo một preview từ file
      file.preview = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onloadend = () => resolve(reader.result);
      });

      setPreviewFile({ open: true, file: file });
    }
  };

  // Hàm xử lý sự kiện khi thay đổi danh sách file
  const handleChange = ({ fileList }: any) => {
    setIsLoadingFile(true);
    // Kiểm tra xem danh sách tệp tin có chứa loại tệp tin khác không
    const containsOtherFileType = fileList.some(
      (file: any) =>
        !file.type.startsWith("image/") && !file.type.startsWith("video/"),
    );
    if (containsOtherFileType) {
      message.error("Chỉ chấp nhận tệp ảnh và video!");
      return;
    }

    setFileList(fileList);
    setTimeout(() => {
      setIsLoadingFile(false);
    }, 2000);
  };

  const handleUpload = async (value: any) => {
    setIsLoadingUploadLst(true);
    // Tạo FormData để truyền danh sách file cho API upload
    const formData = new FormData();
    fileList.forEach((file: any) => {
      formData.append("files", file.originFileObj);
    });

    // Gọi API upload với danh sách file đã chọn
    // Ví dụ sử dụng Fetch:
    const res = await UploadModel.upLoadList(formData);

    if (res.code === 200) {
      const body = res.data?.map(
        (e: {
          content: any;
          imageLocation: any;
          vocabularyId: any;
          videoLocation: any;
        }) => ({
          content: e.content,
          vocabularyImageReqs: [
            {
              imageLocation: e.imageLocation,
              vocabularyId: e.vocabularyId,
              primary: true,
            },
          ],
          vocabularyVideoReqs: [
            {
              vocabularyId: e.vocabularyId,
              videoLocation: e.videoLocation,
              primary: true,
            },
          ],
          topicId: value.topicId,
          vocabularyType: value.vocabularyType,
          private: isPrivate === "false" ? false : true,
        }),
      );
      const response = await Learning.addLstVocabulary(body);
      if (response.code === 200) {
        message.success("Thêm danh sách từ vựng thành công");
        setFileList([]);
        router.push(
          isPrivate === "true"
            ? "/learning-management/vocabulary/private"
            : "/learning-management/vocabulary/public",
        );
      } else {
        message.error("Thêm thất bại");
        setFileList([]);
      }
    } else {
      message.error("Lỗi tải file");
    }
    setIsLoadingUploadLst(false);
  };

  return (
    <Spin spinning={isLoadingUploadLst}>
      <div className="w-full p-4">
        <Breadcrumb
          pageName="Thêm mới từ vựng"
          itemBreadcrumb={[
            { pathName: "/", name: "Trang chủ" },
            {
              pathName:
                isPrivate === "true"
                  ? "/learning-management/vocabulary/private"
                  : "/learning-management/vocabulary/public",
              name: "Danh sách từ vựng",
            },
            { pathName: "#", name: "Thêm mới từ vựng" },
          ]}
        />
        <div className="w-full bg-white">
          <Tabs
            className="px-4"
            activeKey={tabKey}
            onChange={(key) => setTabKey(key)}
          >
            <TabPane tab="Thêm một" key="1">
              <Form
                form={form}
                layout="vertical"
                className="px-4 pb-4"
                onFinish={(value) => {
                  mutationCreate.mutate({
                    ...value,
                    vocabularyImageReqs:
                      value?.vocabularyImageReqs || undefined,
                    vocabularyVideoReqs:
                      value?.vocabularyVideoReqs || undefined,
                    private: isPrivate,
                  });
                }}
              >
                <Form.Item
                  name="topicId"
                  label="Chủ đề liên quan"
                  required
                  rules={[
                    validateRequireInput(
                      "Chủ đề liên quan không được bỏ trống",
                    ),
                  ]}
                  className="mb-2"
                >
                  <Select
                    size="large"
                    className="w-full"
                    allowClear
                    placeholder="Chọn chủ đề"
                    options={allTopics}
                    loading={isFetchingTopic}
                    showSearch
                    filterOption={filterOption}
                    notFoundContent={
                      isFetchingTopic ? (
                        <Spin size="small" />
                      ) : (
                        "Không tìm thấy chủ đề"
                      )
                    }
                  />
                </Form.Item>
                <Form.Item
                  name="vocabularyType"
                  label="Loại từ vựng"
                  required
                  rules={[
                    validateRequireInput("Loại từ vựng không được bỏ trống"),
                  ]}
                  className="mb-2"
                >
                  <Select
                    size="large"
                    className="w-full"
                    allowClear
                    placeholder="Chọn loại từ vựng"
                    options={[
                      {
                        label: "Từ",
                        value: "WORD",
                      },
                      {
                        label: "Câu",
                        value: "SENTENCE",
                      },
                      {
                        label: "Đoạn",
                        value: "PARAGRAPH",
                      },
                    ]}
                  />
                </Form.Item>
                {vocabularyType ? (
                  <Form.Item
                    name="content"
                    label="Ngôn ngữ văn bản"
                    required
                    rules={[
                      validateRequireInput(
                        "Chủ đề liên quan không được bỏ trống",
                      ),
                    ]}
                    className="mb-2"
                  >
                    <TextArea
                      maxLength={200}
                      showCount
                      placeholder="Nhập từ vựng"
                    />
                  </Form.Item>
                ) : null}

                <Form.Item name="note" label="Mô tả">
                  <TextArea
                    maxLength={200}
                    showCount
                    placeholder="Nhập mô tả"
                  />
                </Form.Item>
                <Form.Item name="vocabularyType" hidden />
                <div className="flex flex-col gap-4">
                  <Form.Item name="vocabularyImageReqs" noStyle />
                  <Form.Item name="vocabularyVideoReqs" noStyle />

                  <Upload {...props} showUploadList={false} accept="image/*">
                    <Button icon={<UploadOutlined />}>Tải file ảnh</Button>
                  </Upload>
                  <Upload {...props} showUploadList={false} accept="video/*">
                    <Button icon={<UploadOutlined />}>Tải file video</Button>
                  </Upload>
                </div>
                <div className="mb-3 flex items-center justify-center gap-4">
                  {preview.fileImage ? (
                    <>
                      <Image
                        className=""
                        src={preview.fileImage}
                        alt="Ảnh chủ đề"
                        style={{ width: 300 }}
                      />
                      <Button
                        onClick={() => {
                          setPreview({
                            ...preview,
                            fileImage: "",
                          });
                          form.setFieldValue("vocabularyImageReqs", undefined);
                        }}
                      >
                        Xoá ảnh
                      </Button>
                    </>
                  ) : null}
                  {preview.fileVideo ? (
                    <>
                      <video controls style={{ width: 400, height: "auto" }}>
                        <source src={preview.fileVideo} />
                      </video>
                      <Button
                        onClick={() => {
                          setPreview({
                            ...preview,
                            fileVideo: "",
                          });
                          form.setFieldValue("vocabularyVideoReqs", undefined);
                        }}
                      >
                        Xoá video
                      </Button>
                    </>
                  ) : null}
                </div>
                <div className="flex w-full items-center justify-center gap-4">
                  <Button onClick={() => router.back()}>Huỷ</Button>
                  <Button type="primary" htmlType="submit">
                    Tạo
                  </Button>
                </div>
              </Form>
            </TabPane>

            <TabPane tab="Thêm nhiều" key="2">
              <Form
                form={formUpload}
                layout="vertical"
                className="px-4 pb-4"
                onFinish={(value) => {
                  handleUpload(value);
                }}
              >
                <Form.Item
                  name="topicId"
                  label="Chủ đề liên quan"
                  required
                  rules={[
                    validateRequireInput(
                      "Chủ đề liên quan không được bỏ trống",
                    ),
                  ]}
                  className="mb-2"
                >
                  <Select
                    size="large"
                    className="w-full"
                    allowClear
                    placeholder="Chọn chủ đề"
                    options={allTopics}
                    showSearch
                    filterOption={filterOption}
                  />
                </Form.Item>
                <Form.Item
                  name="vocabularyType"
                  label="Loại từ vựng"
                  required
                  rules={[
                    validateRequireInput("Loại từ vựng không được bỏ trống"),
                  ]}
                  className="mb-2"
                >
                  <Select
                    size="large"
                    className="w-full"
                    allowClear
                    placeholder="Chọn loại từ vựng"
                    options={[
                      {
                        label: "Từ",
                        value: "WORD",
                      },
                      {
                        label: "Câu",
                        value: "SENTENCE",
                      },
                      {
                        label: "Đoạn",
                        value: "PARAGRAPH",
                      },
                    ]}
                  />
                </Form.Item>
                <div className="max-h-[600px] overflow-y-scroll">
                  <CustomUpload
                    listType="text"
                    fileList={fileList}
                    onPreview={handlePreview}
                    onChange={handleChange}
                    multiple
                    customRequest={async ({ file }: any) => {
                      const isImageOrVideo =
                        file.type.startsWith("image/") ||
                        file.type.startsWith("video/");
                      if (!isImageOrVideo) {
                        message.error("Chỉ được chọn file video hoặc ảnh.");
                      }
                    }}
                    accept="image/*,video/*"
                  >
                    <Button loading={isLoadingFile} icon={<UploadOutlined />}>
                      Chọn File
                    </Button>
                  </CustomUpload>
                </div>
                <div className="flex w-full items-center justify-center gap-4">
                  <Button onClick={() => router.back()}>Huỷ</Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    disabled={isLoadingFile}
                  >
                    Tạo
                  </Button>
                </div>
              </Form>
            </TabPane>
          </Tabs>
        </div>

        {/* Modal */}
        {/* Modal xem trước */}
        <Modal
          open={previewFile.open}
          onCancel={() => setPreviewFile({ open: false, file: "" })}
          footer={null}
          width={600}
          closeIcon={null}
        >
          <div className="flex w-full items-center justify-center">
            {previewFile && (
              <>
                {previewFile.file?.originFileObj?.type?.startsWith("image/") ? (
                  <Image
                    className="w-full"
                    alt=""
                    src={previewFile.file.preview}
                  />
                ) : (
                  <div className="w-full">
                    <video controls style={{ width: "100%", height: "auto" }}>
                      <source src={previewFile.file.preview} />
                    </video>
                  </div>
                )}
              </>
            )}
          </div>
        </Modal>
      </div>
    </Spin>
  );
};

export default VocabularyCreateUpdate;
export const CustomUpload = styled(Upload)`
  .ant-upload-icon {
    display: none;
  }
`;
