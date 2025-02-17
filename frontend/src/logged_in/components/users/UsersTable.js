import React, { useCallback, useState, useEffect, setLoading } from "react";
import PropTypes from "prop-types";
import {
  Table,
  TableBody,
  TableCell,
  TablePagination,
  TableRow,
  withStyles,
  IconButton
} from "@material-ui/core";
import EnhancedTableHead from "../../../shared/components/EnhancedTableHead";
import ColorfulChip from "../../../shared/components/ColorfulChip";
import unixToDateString from "../../../shared/functions/unixToDateString";
import HighlightedInformation from "../../../shared/components/HighlightedInformation";
import currencyPrettyPrint from "../../../shared/functions/currencyPrettyPrint";
import EditIcon from '@material-ui/icons/Edit';
import CheckIcon from '@mui/icons-material/Check';
import DeleteIcon from '@material-ui/icons/Delete';
import { listarOrganizaciones, cambiarAprobacion } from "../../../controllers/api/api.organizaciones";


const styles = theme => ({
  tableWrapper: {
    overflowX: "auto",
    width: "100%"
  },
  blackBackground: {
    backgroundColor: theme.palette.primary.main
  },
  contentWrapper: {
    padding: theme.spacing(3),
    [theme.breakpoints.down("xs")]: {
      padding: theme.spacing(2)
    },
    width: "100%"
  },
  dBlock: {
    display: "block !important"
  },
  dNone: {
    display: "none !important"
  },
  firstData: {
    paddingLeft: theme.spacing(3),
  },
  link: {
    color: '#0295d9',
    cursor: 'pointer',
    '&:hover': {
      color: '#0272a6'
    }
  }
});

const rows = [
  {
    id: "name",
    numeric: false,
    label: "Nombre"
  },
  {
    id: "cuit",
    numeric: false,
    label: "CUIT"
  },
  {
    id: "email",
    numeric: false,
    label: "Email"
  },
  {
    id: "telefono",
    numeric: false,
    label: "Telefono"
  },
  {
    id: "estado",
    numeric: false,
    label: "Estado"
  },
  {
    id: "actions",
    numeric: false,
    label: "Acciones"
  }
];

const rowsPerPage = 25;

function UsersTable(props) {
  const { theme, classes } = props;
  const [page, setPage] = useState(0);
  const handleChangePage = useCallback(
    (_, page) => {
      setPage(page);
    },
    [setPage]
  );

  const [listadoOrganizaciones, setOrganizaciones] = useState(null);
  
  const getOrganizaciones = async () => {
    let data = await listarOrganizaciones();
    let listado = data.response.sort((a,b) => (a.pendienteAprobacion < b.pendienteAprobacion) ? 
      1 : ((b.pendienteAprobacion < a.pendienteAprobacion) ? -1 : 0));
    setOrganizaciones(listado);
  }

  useEffect(() => { 
    getOrganizaciones();
  }, []);

  const cambiarEstado = (idOrganizacion, nuevoEstado) => {
    
    let data = {
      id: idOrganizacion, 
      aprobacion: nuevoEstado
    };

    cambiarAprobacion(data)
      .then(response => {
        if (response.success) {
          getOrganizaciones();
        } else {
          console.log("Error");
        }
      });
  }

  const valoresAprobacion = ['Rechazado', 'Aprobado'];

    return listadoOrganizaciones ? (
      <div className={classes.tableWrapper}>
        <Table aria-labelledby="tableTitle">
          <EnhancedTableHead rowCount={listadoOrganizaciones.length} rows={rows} />
          <TableBody>
            {listadoOrganizaciones
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((listadoOrganizaciones, index) => (
                <TableRow hover tabIndex={-1} key={index}>
                  <TableCell
                    component="th"
                    scope="row"
                    className={classes.firstData}
                  >
                    <a href={listadoOrganizaciones.paginaWeb} className={classes.link} target="_blank">{listadoOrganizaciones.nombre}</a>
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {listadoOrganizaciones.CUIT}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {listadoOrganizaciones.usuarioDetalle.email}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {listadoOrganizaciones.telefono}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {listadoOrganizaciones.pendienteAprobacion ? 'Pendiente' : valoresAprobacion[+listadoOrganizaciones.aprobacion]}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    <IconButton onClick={() => cambiarEstado(listadoOrganizaciones.id, 1)}> 
                      <CheckIcon className="text-black" />
                    </IconButton>
                    <IconButton onClick={() => cambiarEstado(listadoOrganizaciones.id, 0)}> 
                      <DeleteIcon className="text-black" />
                    </IconButton> 
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={listadoOrganizaciones.length}
          rowsPerPage={rowsPerPage}
          page={page}
          backIconButtonProps={{
            "aria-label": "Previous Page"
          }}
          nextIconButtonProps={{
            "aria-label": "Next Page"
          }}
          onChangePage={handleChangePage}
          classes={{
            select: classes.dNone,
            selectIcon: classes.dNone,
            actions: listadoOrganizaciones.length > 0 ? classes.dBlock : classes.dNone,
            caption: listadoOrganizaciones.length > 0 ? classes.dBlock : classes.dNone
          }}
          labelRowsPerPage=""
        />
      </div>
    ) : 
  (
      <div className={classes.contentWrapper}>
        <HighlightedInformation>
          No hay usuarios creados.
        </HighlightedInformation>
      </div>
    ); 
} 

UsersTable.propTypes = {
  theme: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  listadoOrganizaciones: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default withStyles(styles, { withTheme: true })(UsersTable);
