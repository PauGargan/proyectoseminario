import React from "react";
import MaterialTable from 'material-table';
import { forwardRef } from 'react';
import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import { listarIniciativas } from "../../../controllers/api/api.iniciativas";


const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
};

export default function ListadoDeIniciativas() {
  const tableData = {
    columns: [
      {
        title: 'Nombre',
        field: 'name',
      },
      {
        title: 'Organizacion',
        field: 'organization',
      },
      {
        title: 'Evento',
        field: 'event',
      },
      {
        title: 'Estado',
        field: 'state',
      },
    ],
    data: []
  }

  const [state, setState] = React.useState(null);

  React.useEffect(() => { 
    const getIniciativas = async () => {
      let data = await listarIniciativas();
      
      data.response.forEach(iniciativa => {
        tableData.data.push({
          name: iniciativa.titulo,
          organization: iniciativa.organizacionDetalle.nombre,
          event: iniciativa.eventoDetalle.titulo,
          state: (iniciativa.aprobacion ? 'Activo' : 'Inactivo')
        })
      });
      setState(tableData);
    }
    getIniciativas();
  }, []);

  return state && (
    <MaterialTable
      icons={tableIcons}
      title="Iniciativas"
      columns={state.columns}
      data={state.data}
      localization={{
        body: {
          emptyDataSourceMessage: 'No hay datos por mostrar',
          addTooltip: 'Añadir',
          deleteTooltip: 'Eliminar',
          editTooltip: 'Editar',
          editRow: {
            deleteText: '¿Segura(o) que quiere eliminar este turno?',
            cancelTooltip: 'Cancelar',
            saveTooltip: 'Guardar',
          },
        },
        header: {
          actions: 'Acciones',
        },
        toolbar: {
          searchPlaceholder: 'Buscar',
          searchTooltip: 'Buscar',
        },
        pagination: {
          firstAriaLabel: 'Primera página',
          firstTooltip: 'Primera página',
          labelDisplayedRows: '{from}-{to} de {count}',
          labelRowsPerPage: 'Filas por página:',
          labelRowsSelect: 'filas',
          lastAriaLabel: 'Ultima página',
          lastTooltip: 'Ultima página',
          nextAriaLabel: 'Pagina siguiente',
          nextTooltip: 'Pagina siguiente',
          previousAriaLabel: 'Pagina anterior',
          previousTooltip: 'Pagina anterior',
        },
      }}
      options={{
        actionsColumnIndex: -1,
      }}
      editable={{
        onRowAdd: (newData) =>
          new Promise((resolve) => {
            setTimeout(() => {
              resolve();
              setState((prevState) => {
                const data = [...prevState.data];
                data.push(newData);
                return { ...prevState, data };
              });
            }, 600);
          }),
      }}
    />
  );
}