export class GenerateUtils {
  static genUrlImage = (url: string) => {
    return `${process.env.NEXT_PUBLIC_IMAGE_ROOT}/${url}`;
  };
}
