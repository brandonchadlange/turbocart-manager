declare type ServiceResponse<DATA, STATUS_CODE> = {
  data: DATA | null;
  status: STATUS_CODE;
};
