import { Menu, Avatar, Dropdown } from 'antd';
import { DownOutlined, SettingFilled, LogoutOutlined } from '@ant-design/icons';
import { useAppContext } from '../../context/AppContextProvider';
import { useHistory } from 'react-router-dom';

const UserDropdown = () => {
  const { user, setUser } = useAppContext();
  const history = useHistory();

  const logout = (setUser) => {
    window.sessionStorage.removeItem('user_id');
    window.sessionStorage.removeItem('upi');
    window.sessionStorage.removeItem('name');
    history.push('/login', { from: '/' }); // navigate user to login page. Direct them to dashboard if login again
    setUser({ name: null, upi: null });
  };

  // Dropdown menu items
  const headerMenu = (setUser) => (
    <Menu>
      <Menu.Item key="settings" disabled icon={<SettingFilled />}>
        Settings
      </Menu.Item>
      <Menu.Item key="random" disabled icon={<SettingFilled />}>
        Placeholder
      </Menu.Item>
      <Menu.Item
        key="logout"
        onClick={() => logout(setUser)}
        icon={<LogoutOutlined twoToneColor="#eb2f96" />}
        danger
      >
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <>
      <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
      <Dropdown overlay={headerMenu(setUser)} trigger={['click']}>
        <button className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
          {user?.name} <DownOutlined />
        </button>
      </Dropdown>
    </>
  );
};

export default UserDropdown;
