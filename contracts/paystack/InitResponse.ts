export default interface InitResponse {
  data: {
    status: string;
    message: string;
    data: {
      authorization_url: string;
      access_code: string;
      reference: string;
    };
  };
}
