import React, { Fragment, useEffect, useState, useRef } from "react";
import { useHistory } from "react-router-dom";
import { 
  Grid, 
  Typography,
  Link, 
  Button, 
  Card, 
  withStyles, 
  withWidth, 
  Box
} from "@material-ui/core";
// > Formulario
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import Radio from '@material-ui/core/Radio';
import TextField from '@material-ui/core/TextField';
import RadioGroup from '@material-ui/core/RadioGroup';
import { borderRadius, flexbox } from "@material-ui/system";
// < Formulario
import { createPreference, createPlan } from "../../../controllers/api/api.mercadopago";
import { sumarInteres } from "../../../controllers/api/api.mediciones";
import useMercadoPago from '../../../controllers/hooks/useMercadoPago';
import { getIniciativa } from "../../../controllers/api/api.iniciativas";

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const theme = {
  spacing: 8,
}

const styles = theme =>({
  contentPaddingLg: {
    padding: "0 16px",
    [theme.breakpoints.up('sm')]: {
      padding: "0 128px",
    },
  },
  titleMargin: {
    margin: "22px 0",
  },
  h1Style: {
    fontSize: '1.8rem',
    [theme.breakpoints.up('sm')]: {
      fontSize: '2.4rem',
    },
    marginBottom: "12px",
    fontWeight: "500"
  },
  h2Style: {
    fontSize: '1.3rem',
    fontWeight: "400"
  },
  eventStyle: {
    marginBottom: "24px",
    fontSize: "0.85rem",
    [theme.breakpoints.up('sm')]: {
      marginBottom: "48px",
      fontSize: '1rem',
    },
  },
  button: { 
    maxWidth: "80%",
    backgroundColor: theme.palette.primary.main,
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
    },
    color: '#FFFFFF',
    fontWeight: '500',
    margin: 'auto',
    marginTop: '10px',
    display: 'block'
  },
  otroContainer: {
    display: 'flex'
  },
  inputMonto: {
    maxWidth: '100px',
    display: 'inline-block',
    verticalAlign: 'middle',
    marginTop: '0'
  },
  radioMonto: {
    display: 'inline-block'
  },
  colaborarBtn: {
    width: "150px",
    height: "36px",
    position: "fixed",
    top: "60%",
    right: "-114px",
    backgroundColor: theme.palette.primary.main,
    color: "white",
    borderRadius: "8px 8px 0 0",
    display: "flex",
    alignItems: "center",
    transformOrigin: "0 0",
    transform: "rotate(270deg)",
    cursor: "pointer",
    [theme.breakpoints.up('sm')]: {
      display: "none",
    }
  },
  colaborarBtn_text: {
    margin: "auto"
  }
});

const defaultValues = {
  monto: 100,
  montoPersonalizado: null
};

function DetalleIniciativa(props) {
  
  const { theme, classes } = props;
  const history = useHistory();
  const [formValues, setFormValues] = useState(defaultValues);
  const email = useRef();

  const idIniciativa = props.match.params.idIniciativa;

  const [detalleIniciativa, setDetalleIniciativa] = useState(null);
  useEffect(() => { 

    const getDetalleIniciativa = async () => {
      const data = await getIniciativa(idIniciativa);
      setDetalleIniciativa(data.response.result);
    }
    getDetalleIniciativa();
  }, []);

  const mercadopago = useMercadoPago();

  const handleSubmit = (event) => {
    event.preventDefault();

    const orderData = {
      quantity: 1,
      description: detalleIniciativa.titulo + " - " + detalleIniciativa.organizacionDetalle.nombre,
      price: formValues.monto
    };

    if(formValues.montoPersonalizado !== undefined
      && formValues.montoPersonalizado !== null) {
      orderData.price = formValues.montoPersonalizado;
    }

    createPreference(orderData)
      .then(response => {
        if (response.success) {
          console.log(response);
          history.push(
            "/checkout",
            [{
              preferenceId: response.response.id,
              preference: orderData,
              mpObject: mercadopago,
              idIniciativa: detalleIniciativa.id
            }])

        } else {
          
          console.log("Error");
        }
      });
   
  };
/*
  const irASuscripcion = (event) => {
    event.preventDefault();

    const interes = {
      email: "gargan.p@gmail.com",
    };

    sumarInteres(interes)
      .then(response => {
        if (response.success) {
         console.log(response.result);

        } else {
          
          alert("Error");
        }
      });
  }
*/
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const [dialogOpen, setDialogOpen] = React.useState(false);

  const handleClickOpen = () => {
    setDialogOpen(true);
  };

  const handleClose = () => {
    let interesData = {
      email: null
    }

    sumarInteres(interesData)
      .then(response => {
        if (response.success) {
          console.log('Medicion guardada correctamente');
        } else {
          console.log("Error guardando medicion");
        }
      });
    setDialogOpen(false);
  };

  const handleSuscribir = () => {
    let interesData = {
      email: email.current.value ? email.current.value : null
    }

    sumarInteres(interesData)
      .then(response => {
        if (response.success) {
          console.log('Medicion guardada correctamente');
        } else {
          console.log("Error guardando medicion");
        }
      });

      setDialogOpen(false);
  };


  return ( detalleIniciativa && (
    <div className={classes.contentPaddingLg}>
      <Box style={{ backgroundColor: "#FFFFFF" }} pt={12} pb={8}>
        <Typography variant="subtitle2" align="center" className={classes.eventStyle}>
          {detalleIniciativa.eventoDetalle.titulo}
        </Typography>
        <Box>
          <Typography variant="h1" align="center" className={classes.h1Style} >
          {detalleIniciativa.titulo}
          </Typography>
          <Typography variant="subtitle1" align="center">
          Liderado por <Link href="#">{detalleIniciativa.organizacionDetalle.nombre}</Link>
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={6} justify-content="space-around" >
        <Grid item lg={8} xs={12}>
          <div>
            <div>
              <img src="https://cdn.vox-cdn.com/thumbor/kDxyNNdQSrGDEJdCStUpR7ektDk=/1400x788/filters:format(jpeg)/cdn.vox-cdn.com/uploads/chorus_asset/file/19184784/DSC_0180__1_.jpg" 
                  width="100%" />
            </div>
            <Box mt={4} mb={8}>
              <Typography variant="h2" align="left" className={classes.h2Style}>
                Sobre esta iniciativa
                <br></br>
                <br></br>
              </Typography>
              <Typography variant="body1" paragraph align="left">
                {detalleIniciativa.descripcion}
              </Typography>
            </Box>
            <Box>
              <Typography variant="h2" align="left" className={classes.h2Style}>
                Sobre la organización
                <br></br>
                <br></br>
              </Typography>
              <Typography variant="body1" paragraph align="left">
              It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English.
              </Typography>
            </Box>
          </div>
        </Grid>
        
        <Grid item lg={4} xs={12} id="donacion">
          <Box>
            <Typography variant="h2" align="left" className={classes.h2Style}>
              ¡Colaborá con esta iniciativa!
            </Typography>
            <br></br>
            <Box>
              <form onSubmit={handleSubmit}>
                <FormControl component="fieldset" >
                  <FormLabel component="legend">Seleccioná el monto</FormLabel>
                  <RadioGroup
                    aria-label="monto"
                    defaultValue="100"
                    name="monto"
                    onChange={handleInputChange}
                  >
                    <FormControlLabel value="100" control={<Radio />} label="$100" />
                    <FormControlLabel value="500" control={<Radio />} label="$500" />
                    <FormControlLabel value="1000" control={<Radio />} label="$1000" />
                    <div className="otroContainer">
                      <FormControlLabel value="Otro" control={<Radio />} label="Otro" className={classes.radioMonto}/>
                      {formValues.monto == "Otro" ? 
                        <TextField 
                          id="filled-basic" 
                          name="montoPersonalizado" 
                          required 
                          size="small" 
                          margin="dense" 
                          onChange={handleInputChange}
                          className={classes.inputMonto}
                          InputProps={{
                            startAdornment: (
                              "$"
                            ),
                          }}/> 
                        : null}
                    </div>
                  </RadioGroup>
                </FormControl>
                <Button variant="contained" disableElevation className={classes.button} type="submit">Colaborar</Button>
              </form>
            </Box>
          </Box>
          <Box style={{marginTop: '20px', textAlign: 'center'}}>
            <Typography variant="body1" paragraph align="center">
              ó
            </Typography>
            <Link style={{cursor: 'pointer', fontSize: '1rem'}} onClick={handleClickOpen}>
              Suscribite para colaborar con Vida Silvestre mensualmente
            </Link>
          </Box>
          <Dialog open={dialogOpen} onClose={handleClose}>
            <DialogTitle>Esta opción no está disponible todavía</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Dejanos tu mail si querés que te avisemos cuando se lance. No te preocupes, no mandamos spam.  
              </DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                id="email"
                label="Email Address"
                type="email"
                fullWidth
                variant="standard"
                inputRef={email}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancelar</Button>
              <Button onClick={handleSuscribir}>Subscribirme</Button>
            </DialogActions>
          </Dialog>
         {/* <Box>
            <Typography variant="h2" align="left" className={classes.h2Style}>
              ¡Postulate para ayudar!
            </Typography>
            <br></br>
            <Typography align="left">
              Le enviaremos tus datos a la organización para que se pongan en contacto con vos.
            </Typography>
            <Box>
              <FormControl fullWidth>
                <TextField id="filled-basic" label="Nombre" variant="filled" required size="small" margin="dense"/>
                <TextField id="filled-basic" label="Apellido" variant="filled" required size="small" margin="dense"/>
                <TextField id="filled-basic" label="Dirección de email" variant="filled" required size="small" margin="dense"/>
                <Button variant="contained" disableElevation className={classes.button}>Enviar</Button>
              </FormControl>
            </Box>
         </Box> */}
        </Grid>
      </Grid>
      <Link href="#donacion" className={classes.colaborarBtn}>
        <span className={classes.colaborarBtn_text}>Quiero colaborar</span>
      </Link>
    </div>
  ));
}



export default withWidth()(withStyles(styles, { withTheme: true })(DetalleIniciativa));
