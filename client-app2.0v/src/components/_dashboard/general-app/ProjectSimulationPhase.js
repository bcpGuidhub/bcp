import { Box, Card, CardContent, CardHeader, Typography } from '@mui/material';

import Scrollbar from '../../Scrollbar';
import Synthesis from '../../../pages/service/projects/financial-forecast/Synthesis';
import { useSelector } from '../../../redux/store';

// ----------------------------------------------------------------------

export default function ProjectSimulationPhase() {
  const { work } = useSelector((state) => state.project);

  return (
    <>
      {work.id && (
        <Scrollbar>
          <Synthesis />
        </Scrollbar>
      )}
      {!work.id && (
        <Box
          sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Typography typography="subtitle1">No project selected</Typography>
        </Box>
      )}
    </>
  );
}
