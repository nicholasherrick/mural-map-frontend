import { useState } from 'react';

const useEditModal = () => {
  const [isEditShowing, setIsEditShowing] = useState(false);

  function editToggle() {
    setIsEditShowing(!isEditShowing);
  }

  return {
    isEditShowing,
    editToggle,
  };
};

export default useEditModal;
