import { Button, Input, Modal, message } from 'antd'
import React, {
  ChangeEvent,
  MouseEvent,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
type Props = {
  ax: any
  userId: number
  canvasId: number
}
export function InviteModal(props: Props) {
  const { ax, userId, canvasId } = props
  const handleOk = async () => {
    const res = await ax.post(`/collaboration/invite/?canvas_id=${canvasId}&owner_id=${userId}&collaborator_name=${invitedName}`)
    console.log(res)
    if (res.data === 'isInvited') {
      message.error(res.data)
    }
    else {
      message.success(res.data)
    }
    setIsModalVisible(false)
    setInvitedName('')
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }
  const [invitedName, setInvitedName] = useState('')
  const handleInputName = (e: ChangeEvent<HTMLInputElement>) => {
    setInvitedName(e.target.value)
  }
  const [isModalVisible, setIsModalVisible] = useState(false)
  const showModal = () => {
    setIsModalVisible(true)
  }
  return (
    <>
      <Button onClick={showModal}>invite</Button>
      <Modal
        title="邀请协作者"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Input
          defaultValue={''}
          value={invitedName}
          onInput={handleInputName}
          type="text"
        />
      </Modal>
    </>
  )
}