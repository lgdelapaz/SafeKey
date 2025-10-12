import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from 'lucide-react';
interface HeaderProps {
  title: string;
  showBack?: boolean;
  backTo?: string;
}
const Header: React.FC<HeaderProps> = ({
  title,
  showBack = true,
  backTo
}) => {
  const navigate = useNavigate();
  const handleBack = () => {
    if (backTo) {
      navigate(backTo);
    } else {
      navigate(-1);
    }
  };
  return <header className="bg-blue-600 dark:bg-blue-800 text-white p-4 flex items-center">
      {showBack && <button onClick={handleBack} className="mr-4 p-2 rounded-full hover:bg-blue-700 dark:hover:bg-blue-700 transition-colors">
          <ArrowLeftIcon size={24} />
        </button>}
      <h1 className="text-xl font-bold">{title}</h1>
    </header>;
};
export default Header;