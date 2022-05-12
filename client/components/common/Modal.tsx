import { CProps } from 'types/client';
import { Box, Modal as MuiModal } from '@mui/material';

interface Props extends CProps {
  open: boolean;
  onClose: () => void;
}

const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '1px solid #000',
  // boxShadow: 24,
  p: 4,
};

function Modal({ open, onClose, children }: Props) {
  return (
    <div>
      <MuiModal open={open} onClose={onClose}>
        <Box sx={style}>{children}</Box>
      </MuiModal>
    </div>
  );
}

export default Modal;
