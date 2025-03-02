import APIInterceptor from "@/libs/apiInterceptor";

const BASE_URL = `${process.env.NEXT_PUBLIC_ENDPOINT}/wp-json/wp/v2/`;
const apiInterceptor = new APIInterceptor(BASE_URL);

export const fetchData = async <T>(endpoint: string): Promise<T> => {
  return await apiInterceptor.get<T>(endpoint);
};
