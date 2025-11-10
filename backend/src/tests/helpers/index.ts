export const generateMockRequest = (data: any = {}) => ({
  params: data.params || {},
  body: data.body || {},
  query: data.query || {},
  headers: data.headers || {},
});

export const generateMockResponse = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};
