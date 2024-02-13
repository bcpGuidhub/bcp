import { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import { Badge, Box, IconButton, Stack, Tooltip } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { MIconButton } from '../../../@material-extend';
import MyAvatar from '../../../MyAvatar';
import { useSelector } from '../../../../redux/store';
import API from '../../../../utils/axios';
import useAuth from '../../../../hooks/useAuth';
// ----------------------------------------------------------------------

const shapeStyles = { bgcolor: 'primary.main', width: 40, height: 40 };
const shapeCircleStyles = { borderRadius: '50%' };

const reputationScore = (open) => (
  <MIconButton
    // onClick={handleOpen}
    sx={{
      padding: 0,
      width: 44,
      height: 44,
      ...(open && {
        '&:before': {
          zIndex: 1,
          content: "''",
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          position: 'absolute',
          bgcolor: (theme) => alpha(theme.palette.grey[900], 0.72)
        }
      })
    }}
  >
    <MyAvatar />
  </MIconButton>
);

// ----------------------------------------------------------------------

const recentInquistAchievements = (
  <Box component="span">
    <Tooltip title="Copy">
      <IconButton>
        <Icon icon="et:trophy" width={24} height={24} />
      </IconButton>
    </Tooltip>
  </Box>
);

// ----------------------------------------------------------------------

export default function InquistReputation() {
  const { accountType } = useAuth();
  const apiPrefix = accountType === 'stakeholder' ? '/v1/stakeholder/workstation' : '/v1/workstation';
  const [open, setOpen] = useState(false);
  const { account } = useSelector((state) => state.user);
  const [authorRep, setAuthorRep] = useState(1);

  useEffect(async () => {
    try {
      const response = await API.get(`${apiPrefix}/inquisite/community/reputation`, {
        params: { id: account.id }
      });
      if (response.data) {
        setAuthorRep(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  }, []);

  return (
    <Stack spacing={3} direction="row">
      <Tooltip title={`votre réputation: ${authorRep}`}>
        <Badge
          color="secondary"
          badgeContent={authorRep}
          max={99999999}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left'
          }}
        >
          {reputationScore(open)}
        </Badge>
      </Tooltip>

      {/* {recentInquistAchievements} */}
    </Stack>
  );
}
