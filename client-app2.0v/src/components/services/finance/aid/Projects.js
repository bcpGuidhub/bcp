import PropTypes from 'prop-types';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import { makeStyles } from '@mui/styles';
import Grid from '@mui/material/Grid';
import { Stack, ButtonGroup, Button } from '@mui/material';
// ----------------------------------------------------------------------

const useStyles = makeStyles((theme) => ({
  layered_filters: {
    // "backgroundColor": blue[100],
  },
  title: {
    margin: '0',
    padding: '12px 0',
    'line-height': '1em',
    color: theme.palette.text.light,
    cursor: 'pointer'
  },
  icon_plus_round: {
    'margin-right': '5px',
    display: 'inline-flex',
    height: '1em',
    width: '1em',
    'align-self': 'center',
    top: '0em',
    position: 'relative'
  },
  remove_filter_icon: {
    'margin-left': '5px'
  }
}));

// ----------------------------------------------------------------------

Projects.propTypes = {
  projects: PropTypes.array.isRequired,
  displayProjectCategories: PropTypes.func.isRequired,
  selectedProject: PropTypes.string.isRequired,
  appendQuery: PropTypes.func.isRequired
};

export default function Projects({ projects, displayProjectCategories, selectedProject, appendQuery }) {
  const classes = useStyles();
  return (
    <Grid item xs={12} className={classes.layered_filters}>
      <Grid container>
        <Grid item>
          <Stack>
            {projects.map((project, i) => (
              <Stack key={i}>
                <div
                  style={{ display: 'flex' }}
                  tabIndex="0"
                  onKeyPress={(e) => displayProjectCategories(e, project)}
                  onClick={(e) => displayProjectCategories(e, project)}
                  role="button"
                >
                  {selectedProject === project.categorie.id_proj && (
                    <>
                      <RemoveCircleIcon className={classes.icon_plus_round} />
                      <h5 className={classes.title}>
                        <span>{project.categorie.proj_libelle}</span>
                      </h5>
                    </>
                  )}
                  {!(selectedProject === project.categorie.id_proj) && (
                    <>
                      <AddCircleIcon className={classes.icon_plus_round} />
                      <h5 className={classes.title}>
                        <span>{project.categorie.proj_libelle}</span>
                      </h5>
                    </>
                  )}
                </div>
                {selectedProject === project.categorie.id_proj && (
                  <ButtonGroup orientation="vertical" variant="contained" color="inherit">
                    {project.values.map((c, j) => (
                      <Button
                        sx={{ textAlign: 'start', width: '100%', justifyContent: 'flex-start', fontSize: '0.7rem' }}
                        key={j}
                        onKeyPress={(e) => appendQuery(e, 'projets', c.proj_libelle, c.id_proj)}
                        onClick={(e) => appendQuery(e, 'projets', c.proj_libelle, c.id_proj)}
                      >
                        {c.proj_libelle}
                      </Button>
                    ))}
                  </ButtonGroup>
                )}
              </Stack>
            ))}
          </Stack>
        </Grid>
      </Grid>
    </Grid>
  );
}
