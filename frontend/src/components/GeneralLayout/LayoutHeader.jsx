import { PlusOutlined } from '@ant-design/icons';
import { Layout, Button } from 'antd';
import { Link } from 'react-router-dom';
import UserDropdown from './UserDropdown';

const { Header } = Layout;

const LayoutHeader = () => {
  return (
    <Header className="site-layout-background header">
      <div className="header-items">
        <Link to="/request-review">
          <Button type="primary" icon={<PlusOutlined />} style={{ marginRight: '2rem' }}>
            Request a Review
          </Button>
        </Link>
        <UserDropdown />
      </div>
    </Header>
  );
};

export default LayoutHeader;
