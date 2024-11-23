/* eslint-disable import/no-anonymous-default-export */
import { Base } from "./Base";

class UploadModel extends Base {
  // upload
  uploadFile = async (body: FormData) => {
    const res = await this.apiUploadFile("/api/upload", body);
    return res.data;
  };

  image = async (body: FormData) => {
    const res = await this.apiUploadFile("/image", body);
    return res.data;
  };

  // check AI
  checkAI = async (body: any) => {
    const res = await this.apiPostWithoutPrefix(
      "/emg-label-tool/ai/detection",
      body,
    );
    return res.data;
  };

  // upload List
  upLoadList = async (body: any) => {
    const res = await this.apiUploadFile(
      "/upload-vocabularies/upload-list",
      body,
    );
    return res.data;
  };

  // detact
}

export default new UploadModel("upload-auth");
