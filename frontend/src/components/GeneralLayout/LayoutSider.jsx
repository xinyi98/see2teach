import {
  DesktopOutlined,
  DashboardOutlined,
  CalendarOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { Button, Typography } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import { Layout, Menu, Image } from 'antd';
import { Mobile } from '../../utils/media-breakpoints';
import UserDropdown from './UserDropdown';
import { Tooltip } from 'antd';

const { Sider } = Layout;
const { Title } = Typography;

/**
 * This is the sider of the layout. Contains all links to pages and title and allows it to be collapsed.
 * @returns JSX of sider layout.
 */
const LayoutSider = () => {
  const location = useLocation();

  return (
    <Sider
      className="sidebar"
      theme="light"
      breakpoint="lg"
      collapsedWidth={0}
      style={{ position: 'sticky', top: 0, left: 0, height: '100vh' }}
    >
      <div // Place second child (user dropdown) at the bottom of the sidebar on mobile
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <Link to="/">
            <div className="logo">
              <Image width={35} src="/uoa.svg" preview={false} alt="uoa logo" />
              <Title level={3} style={{ float: 'right', marginRight: 10 }}>
                See2Teach
              </Title>
            </div>
          </Link>

          <Mobile>
            <Link to="/request-review">
              <Button style={{ marginLeft: 20, marginBottom: 12 }} icon={<PlusOutlined />}>
                Request a Review
              </Button>
            </Link>
          </Mobile>

          <Menu theme="light" mode="inline" selectedKeys={[location.pathname]}>
            <Menu.Item key="/" icon={<DashboardOutlined />}>
              <Link to="/">Dashboard</Link>
            </Menu.Item>
            <Menu.Item key="/my-reviews" icon={<DesktopOutlined />}>
              <Tooltip
                mouseEnterDelay={0.5}
                placement="right"
                title="Others’ observations of my courses."
              >
                <Link to="/my-reviews">My Reviews</Link>
              </Tooltip>
            </Menu.Item>
            <Menu.Item key="/requested-reviews" icon={<CalendarOutlined />}>
              <Tooltip
                mouseEnterDelay={0.5}
                placement="right"
                title="My observations of others’ courses"
              >
                <Link to="/requested-reviews">Requested Reviews</Link>
              </Tooltip>
            </Menu.Item>
          </Menu>
        </div>

        <Mobile>
          <div style={{ margin: 12 }}>
            <UserDropdown />
          </div>
        </Mobile>
      </div>
    </Sider>
  );
};

export default LayoutSider;
