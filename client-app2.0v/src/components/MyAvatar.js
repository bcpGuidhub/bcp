// hooks
import { useSelector } from '../redux/store';
import createAvatar from '../utils/createAvatar';
//
import { MAvatar } from './@material-extend';

// ----------------------------------------------------------------------

export default function MyAvatar({ ...other }) {
  const { account } = useSelector((state) => state.user);
  return (
    <MAvatar
      src={account?.profile_image}
      alt={account?.first_name}
      color={account?.profile_image ? 'default' : createAvatar(account?.first_name).color}
      {...other}
    >
      {createAvatar(account?.first_name).name}
    </MAvatar>
  );
}
