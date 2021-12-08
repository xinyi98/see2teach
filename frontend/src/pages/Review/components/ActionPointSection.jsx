import { Input, Button, Modal } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { useState } from 'react';

const { TextArea } = Input;

const ActionPointSection = (props) => {
  const { actionPoints, aspectName, dispatch } = props;
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteAspectName, setDeleteAspectName] = useState('');
  const [deleteIndex, setDeleteIndex] = useState(-1);

  const addActionPoint = (aspectName) => {
    dispatch({ type: 'addActionPoint', aspectName });
  };

  const confirmDelete = (aspectName, index) => {
    setDeleteAspectName(aspectName);
    setDeleteIndex(index);
    setModalVisible(true);
  };

  const handleConfirmOK = () => {
    dispatch({
      type: 'deleteActionPoint',
      aspectName: deleteAspectName,
      index: deleteIndex,
    });
    handleConfirmationClose();
  };

  const handleConfirmationClose = () => {
    setModalVisible(false);
  };

  return (
    <>
      {actionPoints?.length > 0 && (
        <div>
          {actionPoints.map((actionPoint, index) => (
            <div style={{ marginBottom: 24 }}>
              <TextArea
                onChange={(e) => {
                  dispatch({
                    type: 'setActionPoint',
                    aspectName,
                    index,
                    description: e.target.value,
                  });
                }}
                rows={4}
                value={actionPoint.description}
                placeholder="Action point description"
              />

              <Button
                icon={<DeleteOutlined />}
                shape="circle"
                title="Remove"
                style={{ position: 'absolute', marginLeft: 8, fontSize: 24, zIndex: 10 }}
                onClick={() => {
                  confirmDelete(aspectName, index);
                }}
              />
            </div>
          ))}
        </div>
      )}

      <Button
        type="dashed"
        onClick={() => addActionPoint(aspectName)}
        style={{ width: '100%' }}
        icon={<PlusOutlined />}
      >
        Add Action Point
      </Button>

      <Modal visible={modalVisible} onOk={handleConfirmOK} onCancel={handleConfirmationClose}>
        <p>Are you sure you want to delete this action point?</p>
      </Modal>
    </>
  );
};

export default ActionPointSection;
