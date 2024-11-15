interface Topic {
  topicId: number;
  content: string;
  imageLocation: string;
  videoLocation: string;
}

interface VocabularyImage {
  vocabularyImageId: number;
  imageLocation: string | null;
  vocabularyId: number;
  vocabularyContent: string;
  primary: boolean;
}

interface VocabularyVideo {
  vocabularyVideoId: number;
  videoLocation: string | null;
  vocabularyId: number;
  vocabularyContent: string;
  primary: boolean;
}

interface Vocabulary {
  vocabularyId: number;
  content: string;
  vocabularyImageResList: VocabularyImage[];
  vocabularyVideoResList: VocabularyVideo[];
  topicId: number;
  topicContent: string;
}
