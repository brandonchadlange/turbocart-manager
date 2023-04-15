type UseServiceHelperProps = {
  beforeRequest?: () => void;
  request: () => void;
};

const useServiceHelper = (props: UseServiceHelperProps) => {
  return {
    execute() {},
  };
};

export default useServiceHelper;
