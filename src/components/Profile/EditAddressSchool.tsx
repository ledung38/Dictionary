import User from "@/model/User";
import { RootState } from "@/store";
import { login } from "@/store/slices/adminSlice";
import { useQuery } from "@tanstack/react-query";
import { Form, Input, message, Modal, Select } from "antd";
import axios from "axios";
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

interface EditAddressSchoolProps {
  visible: boolean;
  onClose: () => void;
}
export const EditAddressSchool = ({
  visible,
  onClose,
}: EditAddressSchoolProps) => {
  const [form] = Form.useForm();
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const user: User = useSelector((state: RootState) => state.admin);
  const dispatch = useDispatch();

  console.log("user", user);
  const fetchProvinces = async () => {
    const { data } = await axios.get(
      "https://open.oapi.vn/location/provinces?size=100",
    );
    return data.data;
  };

  const { data: provincesData, isLoading: isLoadingProvinces } = useQuery({
    queryKey: ["provinces"],
    queryFn: fetchProvinces,
  });

  // API calls

  const fetchDistricts = async (provinceId: string) => {
    const { data } = await axios.get(
      `https://open.oapi.vn/location/districts/${provinceId}?size=1000`,
    );
    return data.data;
  };

  const fetchWards = async (districtId: string) => {
    const { data } = await axios.get(
      `https://open.oapi.vn/location/wards/${districtId}?size=1000`,
    );
    return data.data;
  };

  const handleProvinceChange = async (slug: string) => {
    const parts = slug.split("_");
    const provinceId = parts[1];
    form.setFieldsValue({ district: null, ward: null });
    setWards([]);
    const districtsData = await fetchDistricts(provinceId);
    setDistricts(districtsData);
  };

  const handleDistrictChange = async (slug: string) => {
    const parts = slug.split("_");
    const districtId = parts[1];
    form.setFieldsValue({ ward: null });
    const wardsData = await fetchWards(districtId);
    setWards(wardsData);
  };

  const handleSave = () => {
    form.setFieldsValue({
      city: form.getFieldValue("city").split("_")[0],
      district: form.getFieldValue("district").split("_")[0],
      ward: form.getFieldValue("ward").split("_")[0],
      address: `${form.getFieldValue("ward").split("_")[0]}, ${form.getFieldValue("district").split("_")[0]}, ${form.getFieldValue("city").split("_")[0]}`,
    });

    form.getFieldValue;
    form
      .validateFields()
      .then(async (values) => {
        await User.updateProfile(values);
        message.success("Address saved successfully!");
        const response = await User.getProfile();
        dispatch(login(response));
        onClose();
      })
      .catch((error: any) => {
        message.error(error.data.message);
      });
  };

  useEffect(() => {
    form.setFieldsValue({
      ...user,
    });
  }, [user]);

  return (
    <Fragment>
      <Modal
        open={visible}
        onCancel={onClose}
        centered
        footer={null}
        width={450}
      >
        <div className="mb-0 mt-2 flex flex-col items-center justify-center py-4">
          <h1 className="mb-4 text-center font-bold">Địa chỉ trường học</h1>
          <Form form={form} layout="vertical" className="w-full">
            <Form.Item
              name="schoolName"
              label="Tên trường học"
              rules={[{ required: true, message: "Vui lòng nhập tên trường" }]}
            >
              <Input placeholder="Vui lòng nhập tên trường" />
            </Form.Item>
            <Form.Item
              name="city"
              label="Tỉnh/thành phố"
              rules={[
                { required: true, message: "Vui lòng chọn tỉnh/thành phố" },
              ]}
            >
              <Select
                placeholder="Chọn tỉnh/thành phố"
                loading={isLoadingProvinces}
                onChange={handleProvinceChange}
                options={provincesData?.map((city: any) => ({
                  label: city.name,
                  value: `${city.name}_${city.id}`,
                }))}
              />
            </Form.Item>
            <Form.Item
              name="district"
              label="Quận/huyện"
              rules={[
                { required: true, message: "Vui lòng chọn một quận/huyện" },
              ]}
            >
              <Select
                placeholder="Chọn một quận/huyện"
                onChange={handleDistrictChange}
                disabled={!districts.length}
                options={districts?.map((district: any) => ({
                  label: district.name,
                  value: `${district.name}_${district.id}`,
                }))}
              />
            </Form.Item>
            <Form.Item
              name="ward"
              label="Phường/xã"
              rules={[{ required: true, message: "Vui lòng chọn phường/xã" }]}
            >
              <Select
                placeholder="Chọn phường/xã"
                disabled={!wards.length}
                options={wards?.map((ward: any) => ({
                  label: ward.name,
                  value: `${ward.name}_${ward.id}`,
                }))}
              />
            </Form.Item>
            <Form.Item name="address" style={{ display: "none" }}></Form.Item>
            <div className="flex justify-end">
              <button
                className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
                type="button"
                onClick={handleSave}
              >
                Xác nhận
              </button>
            </div>
          </Form>
        </div>
      </Modal>
    </Fragment>
  );
};
