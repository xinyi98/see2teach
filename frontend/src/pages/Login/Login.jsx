import { Select, Button } from 'antd';
import styles from './Login.module.css';
import { useEffect, useState } from 'react';
import { useAppContext } from '../../context/AppContextProvider';
import { useHistory, useLocation } from 'react-router-dom';
import { getUsers, login } from '../../api/PeerReviewApi';

const { Option } = Select;

const Login = () => {
  // store all users retrieved from the database
  const [users, setUsers] = useState([]);

  // the upi used for login
  const [upi, setUpi] = useState('');

  // used to record the logged-in user
  const { setUser } = useAppContext();

  // Get "from" state from ProtectedRoute redirect so that we can redirect back once logged in
  const history = useHistory();
  const location = useLocation();
  const { from } = location.state || { from: { pathname: '/' } };

  useEffect(() => {
    getUsers()
      .then((res) => {
        setUsers(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  const onLogin = () => {
    login(upi)
      .then((res) => {
        // store user details in session storage
        window.sessionStorage.setItem('user_id', res.data.id);
        window.sessionStorage.setItem('name', res.data.name);
        window.sessionStorage.setItem('upi', res.data.upi);
        setUser({
          id: res.data.id,
          name: res.data.name,
          upi: res.data.upi,
        });

        history.replace(from);
      })
      .catch((err) => console.log(err));
  };

  const onChange = (value) => {
    setUpi(value);
  };

  return (
    <div className={styles.container}>
      <div>
        <Select
          showSearch
          style={{ width: 200 }}
          placeholder="Select a person to login"
          optionFilterProp="person"
          onChange={onChange}
          filterOption={(input, option) => option.toLowerCase().indexOf(input.toLowerCase()) >= 0}
          data-testid="login-select"
        >
          {users.map((user) => {
            return (
              <Option value={user.upi} key={user.upi}>
                {user.name + ' - ' + user.upi}
              </Option>
            );
          })}
        </Select>
        <Button onClick={onLogin} disabled={upi === ''}>
          Login
        </Button>
      </div>
    </div>
  );
};

export default Login;
