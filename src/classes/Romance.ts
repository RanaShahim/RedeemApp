export default class Romance {
  private id: string;
  private title: string;
  private quote: string;
  private redeemedResult: string;
  private imageUrl: string;

  constructor(
    id: string,
    title: string,
    quote: string,
    redeemedResult: string,
    imageUrl: string
  ) {
    this.id = id;
    this.title = title;
    this.quote = quote;
    this.redeemedResult = redeemedResult;
    this.imageUrl = imageUrl;
  }

  getId(): string {
    return this.id;
  }

  getTitle(): string {
    return this.title;
  }

  getQuote(): string {
    return this.quote;
  }

  getRedeemedResult(): string {
    return this.redeemedResult;
  }

  getImageUrl(): string {
    return this.imageUrl;
  }
}
