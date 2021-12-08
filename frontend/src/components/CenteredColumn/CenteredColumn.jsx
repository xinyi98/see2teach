import { Row, Col } from 'antd';

/**
 * A wrapper component that makes the child component centered on the page.
 * Whitespace is added on the sides on larger screens for easier view.
 * Resizes the width based on screen size (24 span is full width)
 *
 */
const CenteredColumn = ({ children, style }) => {
  return (
    <Row type="flex" justify="center" align="middle" style={style}>
      <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={20}>
        {children}
      </Col>
    </Row>
  );
};

export default CenteredColumn;
