/* eslint-disable import/no-anonymous-default-export */
import { Base } from "./Base";

class Exam extends Base {
  // Danh sách bài kiểm tra
  getLstExam = async (params?: any) => {
    const res = await this.apiGetWithoutPrefix(
      `/exam/all?${params?.isPrivate !== undefined && `private=${params?.isPrivate}`}`,
      params,
    );
    return res.data;
  };

  // Danh sách bài kiểm tra cho user
  getLstExamUser = async (params?: any) => {
    const res = await this.apiGet(`/exams/all-exams-of-user`, params);
    return res.data;
  };

  // Chỉnh sửa bài kiểm tra
  editExams = async (body?: any) => {
    const res = await this.apiPutWithoutPrefix(`/exam-auth/${body.id}`, body);
    return res.data;
  };

  // Thêm bài kiểm tra
  addExam = async (body?: any) => {
    const res = await this.apiPostWithoutPrefix(`/exam-auth`, body);
    return res.data;
  };

  // Thêm bài kiểm tra cho user
  addExamForUser = async (body?: any) => {
    const res = await this.apiPost(`/exams/exams-for-user`, body);
    return res.data;
  };

  // Chi tiết bài kiểm tra
  detailExamsForUser = async (id: number) => {
    const res = await this.apiGetWithoutPrefix(`/exam/${id}`);
    return res.data;
  };

  // Chấm điểm bài kiểm tra
  markExam = async (body: any) => {
    const res = await this.apiPost(`/exams/exam-scoring`, body);
    return res.data;
  };

  // Lưu kết quả câu hỏi bài kiểm tra
  saveExam = async (body: any) => {
    const res = await this.apiPost(`/exams/exam-saved`, body);
    return res.data;
  };

  // Chi tiét bài kiểm tra
  getDetailSaveExam = async (examId: any) => {
    const res = await this.apiGet(`/exams/exam-saved/${examId}`);
    return res.data;
  };
  // Xoá bài kiểm tra
  deleteExam = async (id: number) => {
    const res = await this.apiDeleteWithoutPrefix(`/exam-auth/${id}`);
    return res.data;
  };

  // Xoá bài kiểm tra cho user
  deleteExamUser = async (id: number) => {
    const res = await this.apiDelete(`/exams/delete-exam-of-user/${id}`);
    return res.data;
  };
}

export default new Exam("");
