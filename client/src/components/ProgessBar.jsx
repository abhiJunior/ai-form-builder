

import { Flex, Progress } from 'antd';
const ProgressBar = ({value}) => {


  return (
    <Flex vertical gap="small">
      <Flex vertical gap="small">
        <Progress percent={value} type="line" />
      </Flex>
      
    </Flex>
  );
};
export default ProgressBar;