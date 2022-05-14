import { CProps } from 'types/client';
import { Box, Modal as MuiModal } from '@mui/material';
import { border } from 'client/styles';

interface Props extends CProps {
  open: boolean;
  onClose: () => void;
}

const style = {
  ...border,
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  // boxShadow: 24,
  p: 2,
};

function Modal({ open, onClose, children }: Props) {
  return (
    <MuiModal open={open} onClose={onClose}>
      <Box sx={style}>{children}</Box>
    </MuiModal>
  );
}

export default Modal;
