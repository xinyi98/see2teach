import { Layout } from 'antd';
import { useMobileMediaQuery } from '../../utils/media-breakpoints';
import LayoutHeader from './LayoutHeader';
import LayoutSider from './LayoutSider';
import './GeneralLayout.css';

const { Content } = Layout;

const GeneralLayout = ({ children }) => {
  const isMobile = useMobileMediaQuery();

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <LayoutSider />
      <Layout className="site-layout">
        {!isMobile && <LayoutHeader />}
        <Content className="site-layout-background content">
          <div style={{ padding: 24 }}>{children}</div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default GeneralLayout;
