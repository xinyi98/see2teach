import { Affix } from 'antd';
import './AspectAffix.css';

const AspectAffix = ({ aspects }) => {
  return (
    <Affix offsetTop={40} style={{ position: 'absolute', left: 10 }}>
      <ul className="aspect-affix-ul">
        {aspects?.map((aspect, index) => {
          return (
            <li key={index} className="aspect-affix-li">
              <a
                className="aspect-affix-a"
                href={`#aspect-${aspect.aspect_name.replace(/ /g, '-')}`}
              >
                {aspect.aspect_name}
              </a>
            </li>
          );
        })}
      </ul>
    </Affix>
  );
};

export default AspectAffix;
