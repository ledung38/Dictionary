/* eslint-disable import/no-anonymous-default-export */
import { Base } from "./Base";

class MediaModel extends Base {
  // sét primary
  setPrimaryVideoVocabulary = async (body: any) => {
    const res = await this.apiPut("/vocabulary-videos/set-primary", body);
    return res.data;
  };

  setPrimaryImageVocabulary = async (body: any) => {
    const res = await this.apiPut("/vocabulary-images/set-primary", body);
    return res.data;
  };

  updateVideoVocabulary = async (body: any) => {
    const res = await this.apiPut("/vocabulary-videos", body);
    return res.data;
  };

  updateImageVocabulary = async (body: any) => {
    const res = await this.apiPut("/vocabulary-images", body);
    return res.data;
  };

  deleteVideoVocabulary = async (id: any) => {
    const res = await this.apiDelete(`vocabulary-videos/${id}`);
    return res.data;
  };

  deleteImageVocabulary = async (id: any) => {
    const res = await this.apiDelete(`vocabulary-images/${id}`);
    return res.data;
  };

  // Thêm media
  addListImageVocabulary = async (body: any) => {
    const res = await this.apiPost("/vocabulary-images/add-list", body);
    return res.data;
  };

  addListVideoVocabulary = async (body: any) => {
    const res = await this.apiPost("/vocabulary-videos/add-list", body);
    return res.data;
  };
}

export default new MediaModel("learning-service");
